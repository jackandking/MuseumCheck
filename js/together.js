(function(root, factory) {
  'use strict';
  const api = factory(root);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.MuseumCheckTogether = api;
})(typeof window !== 'undefined' ? window : null, function(root) {
  'use strict';
  const KEY = 'museumcheck-together-events';
  const TTL = 90 * 24 * 60 * 60;
  const EVENT_PATTERN = /^[a-z0-9][a-z0-9-]{2,39}$/;
  const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
  const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
  // Public activities are intentionally curated in code for this first, reversible experiment.
  // A creator-generated link remains private unless a maintainer adds it here.
  const PUBLIC_EVENTS = Object.freeze([
    Object.freeze({ eventId:'shanghai-museum-aug22', museumId:'shanghai-museum', date:'2026-08-22', time:'10:30', limit:5, ageLabel:'4–10 岁亲子', status:'recruiting' })
  ]);

  function cleanText(value, max) { return String(value || '').trim().replace(/[<>]/g, '').slice(0, max); }
  function normalizeEvent(input) {
    const value = input || {};
    const eventId = String(value.eventId || '').trim().toLowerCase();
    const museumId = cleanText(value.museumId, 80);
    const date = String(value.date || '').trim();
    const time = String(value.time || '').trim();
    const limit = Math.max(2, Math.min(8, Number.parseInt(value.limit, 10) || 5));
    return {
      eventId: EVENT_PATTERN.test(eventId) ? eventId : '',
      museumId,
      date: DATE_PATTERN.test(date) ? date : '',
      time: TIME_PATTERN.test(time) ? time : '',
      limit
    };
  }
  function eventKey(event) { return `museumcheckTogether:${event.eventId}`; }
  function getMuseum(event) {
    const museums = Array.isArray(root && root.MUSEUMS_META) ? root.MUSEUMS_META : [];
    return museums.find(museum => museum && museum.id === event.museumId) || null;
  }
  function createJoinId() { return `together-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`; }
  function createEventId() { return `visit-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`; }
  function storageGet(key) { try { return root.localStorage.getItem(key); } catch (_) { return ''; } }
  function storageSet(key, value) { try { root.localStorage.setItem(key, value); } catch (_) {} }
  function buildVisitUrl(event, museum) {
    const params = new URLSearchParams({ museum: museum.id, format: 'friends', together: event.eventId });
    return `museum-checkin.html?${params.toString()}`;
  }
  function buildEventUrl(event) {
    const params = new URLSearchParams({ event:event.eventId, museum:event.museumId, date:event.date, time:event.time, limit:String(event.limit) });
    return `together.html?${params.toString()}`;
  }
  function humanDate(date, time) {
    if (!date) return '待发起者确认';
    const value = new Date(`${date}T00:00:00`);
    const label = Number.isNaN(value.getTime()) ? date : value.toLocaleDateString('zh-CN', { month:'long', day:'numeric', weekday:'short' });
    return time ? `${label} ${time}` : label;
  }
  function eventIsReady(event) { return Boolean(event.eventId && event.museumId && event.date && event.time); }
  function parseItems(payload) {
    let value = payload && payload.value;
    if (typeof value === 'string') { try { value = JSON.parse(value); } catch (_) { value = []; } }
    return Array.isArray(value) ? value : [];
  }
  function countJoins(payload, eventId) {
    const ids = new Set();
    parseItems(payload).forEach(item => {
      try {
        const signal = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
        if (signal && signal.type === 'together_join' && signal.eventId === eventId && signal.joinId) ids.add(signal.joinId);
      } catch (_) {}
    });
    return ids.size;
  }
  function endpoint() { return root && root.API_ENDPOINTS && root.API_ENDPOINTS.KV_STORE; }
  function writeJoin(event, joinId, mode) {
    const now = Date.now();
    const payload = { type:'together_join', eventId:event.eventId, joinId, mode: mode === 'share' ? 'share' : 'easy', timestamp:now };
    const body = JSON.stringify({ key:KEY, sortKey:`join-${event.eventId}-${joinId}`, value:JSON.stringify(payload), expireAt:Math.floor(now / 1000) + TTL });
    if (!root || typeof root.fetch !== 'function' || !endpoint()) return Promise.resolve();
    return root.fetch(endpoint(), { method:'POST', headers:{'Content-Type':'application/json'}, body, keepalive:true }).catch(() => undefined);
  }
  function loadCount(event) {
    if (!root || typeof root.fetch !== 'function' || !endpoint()) return Promise.resolve(0);
    return root.fetch(`${endpoint()}?key=${encodeURIComponent(KEY)}&sortKey=*`, {cache:'no-store'})
      .then(response => response.ok ? response.json() : null)
      .then(payload => countJoins(payload, event.eventId)).catch(() => 0);
  }
  function loadCounts(events) {
    if (!root || typeof root.fetch !== 'function' || !endpoint()) return Promise.resolve(new Map());
    return root.fetch(`${endpoint()}?key=${encodeURIComponent(KEY)}&sortKey=*`, {cache:'no-store'})
      .then(response => response.ok ? response.json() : null)
      .then(payload => {
        const counts = new Map();
        events.forEach(event => counts.set(event.eventId, countJoins(payload, event.eventId)));
        return counts;
      }).catch(() => new Map());
  }
  function publicEventState(event, now) {
    const parts = String(event.date || '').split('-').map(Number);
    const clock = String(event.time || '').split(':').map(Number);
    const start = parts.length === 3 && clock.length === 2
      ? new Date(parts[0], parts[1] - 1, parts[2], clock[0], clock[1]).getTime()
      : Number.NaN;
    const elapsed = Number.isNaN(start) ? -1 : now - start;
    if (elapsed >= 0 && elapsed < 5 * 60 * 60 * 1000) return 'ongoing';
    return event.status === 'recruiting' && elapsed < 0 ? 'recruiting' : 'past';
  }
  function buildActivityRow(event, museum, count, state) {
    const row = root.document.createElement(state === 'recruiting' ? 'a' : 'article');
    row.className = `activity-row${state === 'ongoing' ? ' activity-row--ongoing' : ''}`;
    if (state === 'recruiting') row.href = buildEventUrl(event);
    const capacity = Math.max(0, event.limit - count);
    const tag = state === 'ongoing' ? '正在进行 · 匿名旁观' : '正在招募';
    const detail = state === 'ongoing'
      ? `已有 ${count} 组家庭加入，正各自从第一张任务开始。`
      : `${humanDate(event.date, event.time)} · ${event.ageLabel || '亲子同行'}`;
    const callout = state === 'ongoing' ? '仅看进度' : (capacity ? `还可加入 ${capacity} 组` : '本场已满');
    row.innerHTML = `<div><span class="activity-row__tag">${tag}</span><h3>${museum.name}</h3><p>${detail}</p></div><div class="activity-row__side"><span>${callout}</span><span>${state === 'recruiting' && capacity ? '查看活动 →' : '不展示成员'}</span></div>`;
    return row;
  }
  function renderLobby(byId) {
    const lobby = byId('activityLobby'); const emptyCard = byId('emptyCard');
    if (!lobby || !emptyCard) return;
    lobby.hidden = false;
    const host = byId('createHost'); if (host) host.appendChild(emptyCard);
    emptyCard.hidden = false;
    const visible = PUBLIC_EVENTS.map(event => ({ ...event, ...normalizeEvent(event) }))
      .map(event => ({ event, museum:getMuseum(event) })).filter(item => item.museum);
    loadCounts(visible.map(item => item.event)).then(counts => {
      const now = Date.now(); const recruiting = []; const ongoing = [];
      visible.forEach(item => {
        const state = publicEventState(item.event, now); if (state === 'recruiting') recruiting.push({...item, state}); if (state === 'ongoing') ongoing.push({...item, state});
      });
      const recruitingList = byId('recruitingList'); const ongoingList = byId('ongoingList');
      recruitingList.replaceChildren(...recruiting.map(item => buildActivityRow(item.event, item.museum, counts.get(item.event.eventId) || 0, item.state)));
      ongoingList.replaceChildren(...ongoing.map(item => buildActivityRow(item.event, item.museum, counts.get(item.event.eventId) || 0, item.state)));
      if (!recruiting.length) recruitingList.innerHTML = '<p class="empty-state">暂时没有公开招募的活动。可以发起一场专属同行探索。</p>';
      if (!ongoing.length) ongoingList.innerHTML = '<p class="empty-state">暂时没有进行中的场次；活动开始后，这里只会显示匿名进度。</p>';
      const householdTotal = recruiting.concat(ongoing).reduce((sum, item) => sum + (counts.get(item.event.eventId) || 0), 0);
      byId('lobbySummary').textContent = `${recruiting.length} 场招募中 · ${householdTotal} 组家庭已加入`;
    });
  }
  function init() {
    if (!root || !root.document) return;
    if (!root.document.getElementById('app')) return;
    const params = new URLSearchParams(root.location.search);
    const event = normalizeEvent({ eventId:params.get('event'), museumId:params.get('museum'), date:params.get('date'), time:params.get('time'), limit:params.get('limit') });
    const museum = getMuseum(event);
    const ready = eventIsReady(event) && museum;
    const byId = id => root.document.getElementById(id);
    const eventCard = byId('eventCard'); const joinCard = byId('joinCard'); const joinedCard = byId('joinedCard'); const emptyCard = byId('emptyCard');
    if (!ready) {
      renderLobby(byId);
      const createMuseum = byId('createMuseum');
      const museums = Array.isArray(root.MUSEUMS_META) ? root.MUSEUMS_META : [];
      museums.filter(museum => museum && museum.id && museum.name).sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')).forEach(museum => {
        const option = root.document.createElement('option'); option.value = museum.id; option.textContent = `${museum.name}${museum.location ? `｜${museum.location}` : ''}`; createMuseum.appendChild(option);
      });
      const dateInput = byId('createDate');
      dateInput.min = new Date().toISOString().slice(0, 10);
      byId('createForm').addEventListener('submit', function(eventObject) {
        eventObject.preventDefault();
        const error = byId('createError'); const museumId = createMuseum.value; const date = dateInput.value; const time = byId('createTime').value; const limit = byId('createLimit').value;
        if (!museumId || !DATE_PATTERN.test(date) || !TIME_PATTERN.test(time)) { error.textContent = '选好博物馆、日期和集合时间后就能生成。'; error.hidden = false; return; }
        const next = new URL(root.location.href); next.search = new URLSearchParams({ event:createEventId(), museum:museumId, date, time, limit }).toString(); root.location.assign(next.toString());
      });
      return;
    }
    eventCard.hidden = false;
    byId('eventName').textContent = `${museum.name} · 同行探索`;
    byId('museumName').textContent = museum.name;
    byId('eventTime').textContent = humanDate(event.date, event.time);
    byId('eventLimit').textContent = `最多 ${event.limit} 组家庭`;
    byId('eventSummary').textContent = `在${museum.name}，各家按自己的节奏逛；最后可选地把一件“孩子发现”拼成共同地图。`;
    const storageKey = eventKey(event); let saved = null;
    try { saved = JSON.parse(storageGet(storageKey) || 'null'); } catch (_) {}
    function renderJoined() {
      joinCard.hidden = true; joinedCard.hidden = false;
      const alias = cleanText(saved && saved.alias, 12) || '你们';
      byId('joinedTitle').textContent = `${alias}，先按自己的节奏出发。`;
      byId('startVisit').href = buildVisitUrl(event, museum);
      loadCount(event).then(count => { byId('attendance').textContent = count ? `目前有 ${count} 组家庭加入这场同行探索。` : '你是第一组加入的家庭。'; });
      const discoveries = byId('eventDiscoveries'); const grid = byId('eventDiscoveriesGrid');
      if (discoveries && grid && root.MuseumCheckFamilyPhotos) {
        root.MuseumCheckFamilyPhotos.renderEventPhotos(grid, event.eventId).then(photos => { discoveries.hidden = photos.length === 0; });
      }
    }
    if (saved && saved.joinId) { renderJoined(); return; }
    joinCard.hidden = false;
    byId('joinForm').addEventListener('submit', function(eventObject) {
      eventObject.preventDefault();
      const alias = cleanText(byId('familyAlias').value, 12); const error = byId('formError');
      if (!alias) { error.textContent = '留一个方便自己辨认的家庭代号就可以。'; error.hidden = false; return; }
      error.hidden = true;
      const mode = root.document.querySelector('input[name="mode"]:checked').value;
      saved = { alias, mode, joinId:createJoinId(), joinedAt:Date.now() }; storageSet(storageKey, JSON.stringify(saved));
      writeJoin(event, saved.joinId, mode).finally(renderJoined);
    });
  }
  if (root && root.document) {
    if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', init, {once:true}); else init();
  }
  return { normalizeEvent, eventIsReady, countJoins, buildVisitUrl, buildEventUrl, humanDate, createEventId, publicEventState, PUBLIC_EVENTS };
});

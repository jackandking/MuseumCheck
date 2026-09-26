/**
 * user-sync.js — 注册用户跨设备数据同步（第一期）
 *
 * 同步范围（与后端 userDataApi.js 的 ALLOWED_KEYS 白名单一致）：
 *   A 孩子画像：childNickname / childAvatarDataURL / ageGroup
 *   B 参观足迹：visitedMuseums / wishMuseums / visitedMuseumsMeta / visit_count
 *   C 成就宠物：museumcheck_xp_data / museumcheck_streak_data /
 *              museumcheck_unlocked_achievements / museumcheck_achievement_unlock_times /
 *              virtualPetData
 *   （照片/海报暂不同步，需对象存储，另行规划）
 *
 * 机制：镜像对比同步（无需侵入业务写入口）
 *   - 每个同步 key 在 localStorage 存一份「上次同步镜像」mc_sync_mirror_<key>。
 *   - syncNow()：本地值 ≠ 镜像 → 本机有新变化，按合并策略与服务端合并后上推；
 *                本机没变但服务端 ≠ 镜像 → 其他设备改过，拉取应用（触发一次刷新）。
 *   - 合并策略：union（足迹/成就）、max（visit_count/lifetimeXP/最长连续）、
 *              minMap（成就解锁时间取最早）、lww（昵称/头像/宠物，本机新值优先）。
 *   - 新浏览器登录 → 本地空 → 自动拉服务端数据；老浏览器登录 → 匿名数据自动并入账号。
 *
 * 依赖：window.AuthClient（auth-client.js 须先加载）。
 */
(function (global) {
  'use strict';
  if (!global.AuthClient) {
    console.warn('[user-sync] AuthClient 未加载，跨设备同步不可用');
    return;
  }

  var STRING_KEYS = { childNickname: 1, childAvatarDataURL: 1, ageGroup: 1 };

  var SYNC_KEYS = {
    childNickname: 'lww',
    childAvatarDataURL: 'lww',
    ageGroup: 'lww',
    visitedMuseums: 'union',
    wishMuseums: 'union',
    visitedMuseumsMeta: 'mergeObj',
    visit_count: 'max',
    museumcheck_xp_data: 'xp',
    museumcheck_streak_data: 'streak',
    museumcheck_unlocked_achievements: 'union',
    museumcheck_achievement_unlock_times: 'minMap',
    virtualPetData: 'lww'
  };

  var MIRROR_PREFIX = 'mc_sync_mirror_';
  var syncing = false;

  // ===== 基础工具 =====
  function lsGet(k) { try { return global.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { global.localStorage.setItem(k, v); } catch (e) {} }
  function lsDel(k) { try { global.localStorage.removeItem(k); } catch (e) {} }

  function parseAny(raw) {
    if (raw == null) return undefined;
    try { return JSON.parse(raw); } catch (e) { return raw; }
  }
  function sortedStr(v) {
    if (v === null || typeof v !== 'object') return JSON.stringify(v === undefined ? null : v);
    if (Array.isArray(v)) return '[' + v.map(sortedStr).join(',') + ']';
    var keys = Object.keys(v).sort();
    return '{' + keys.map(function (k) { return JSON.stringify(k) + ':' + sortedStr(v[k]); }).join(',') + '}';
  }
  function deepEqual(a, b) { return sortedStr(a) === sortedStr(b); }
  function asArray(v) { return Array.isArray(v) ? v : []; }
  function asObj(v) { return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {}; }
  function num(v) { var n = Number(v); return isFinite(n) ? n : null; }

  function writeLocal(key, val) {
    if (val === undefined || val === null) { lsDel(key); return; }
    lsSet(key, STRING_KEYS[key] && typeof val === 'string' ? val : JSON.stringify(val));
  }
  function writeMirror(key, val) {
    if (val === undefined || val === null) { lsDel(MIRROR_PREFIX + key); return; }
    lsSet(MIRROR_PREFIX + key, STRING_KEYS[key] && typeof val === 'string' ? val : JSON.stringify(val));
  }

  // ===== 合并策略 =====
  var MERGE = {
    lww: function (local) { return local; },
    max: function (local, server) {
      var a = num(local), b = num(server);
      if (a == null && b == null) return local;
      if (a == null) return server;
      if (b == null) return local;
      return Math.max(a, b);
    },
    union: function (local, server) {
      var out = [], seen = {};
      asArray(local).concat(asArray(server)).forEach(function (x) {
        var k = typeof x === 'object' ? sortedStr(x) : String(x);
        if (!seen[k]) { seen[k] = 1; out.push(x); }
      });
      return out;
    },
    minMap: function (local, server) {
      var a = asObj(local), b = asObj(server), out = {};
      Object.keys(a).forEach(function (k) { out[k] = a[k]; });
      Object.keys(b).forEach(function (k) {
        var x = num(a[k]), y = num(b[k]);
        if (x == null) out[k] = b[k];
        else if (y == null) out[k] = a[k];
        else out[k] = Math.min(x, y); // 成就解锁时间取最早
      });
      return out;
    },
    mergeObj: function (local, server) {
      var a = asObj(local), b = asObj(server), out = {};
      Object.keys(a).forEach(function (k) { out[k] = a[k]; }); // 本机优先
      Object.keys(b).forEach(function (k) { if (!(k in out)) out[k] = b[k]; });
      return out;
    },
    xp: function (local, server) {
      var a = asObj(local), b = asObj(server);
      if (Object.keys(a).length === 0) return Object.keys(b).length ? b : local;
      if (Object.keys(b).length === 0) return local;
      var la = num(a.lifetimeXP) || 0, lb = num(b.lifetimeXP) || 0;
      var winner = la >= lb ? a : b; // 总 XP 皮肤/等级取 lifetime 大的一方
      var hist = asArray(a.xpHistory).concat(asArray(b.xpHistory));
      var seen = {}, mergedHist = [];
      hist.forEach(function (h) {
        var k = sortedStr(h);
        if (!seen[k]) { seen[k] = 1; mergedHist.push(h); }
      });
      if (mergedHist.length > 500) mergedHist = mergedHist.slice(-500);
      return {
        totalXP: winner.totalXP || 0,
        lifetimeXP: Math.max(la, lb),
        level: winner.level || 1,
        xpHistory: mergedHist
      };
    },
    streak: function (local, server) {
      var a = asObj(local), b = asObj(server);
      if (Object.keys(a).length === 0) return Object.keys(b).length ? b : local;
      if (Object.keys(b).length === 0) return local;
      var dates = {};
      asArray(a.visitDates).concat(asArray(b.visitDates)).forEach(function (d) { dates[d] = 1; });
      var la = String(a.lastVisitDate || ''), lb = String(b.lastVisitDate || '');
      var recent = la >= lb ? a : b; // 最近访馆的一侧决定当前连续
      return {
        currentStreak: recent.currentStreak || 0,
        longestStreak: Math.max(num(a.longestStreak) || 0, num(b.longestStreak) || 0),
        lastVisitDate: recent.lastVisitDate || null,
        visitDates: Object.keys(dates).sort()
      };
    }
  };

  // ===== 同步主流程 =====
  async function syncNow() {
    if (syncing || !global.AuthClient.isLoggedIn()) return { applied: 0, pushed: 0 };
    syncing = true;
    var appliedKeys = [], pushItems = {};
    try {
      var res = await global.AuthClient._getJSON('/api/userdata');
      if (!res.ok || !res.data || !res.data.success) {
        console.warn('[user-sync] 拉取失败', res.status, res.data && res.data.error);
        return { applied: 0, pushed: 0 };
      }
      var server = (res.data.data) || {};

      var keyOps = []; // {key, merged, oldMirrorRaw, toPush}
      Object.keys(SYNC_KEYS).forEach(function (key) {
        var type = SYNC_KEYS[key];
        var localRaw = lsGet(key);
        var mirrorRaw = lsGet(MIRROR_PREFIX + key);
        var localVal = parseAny(localRaw);
        var mirrorVal = parseAny(mirrorRaw);
        var entry = server[key];
        var serverVal = entry ? entry.value : undefined;
        var merged;

        if (!entry) {
          if (localRaw == null) return; // 两边都空
          merged = localVal; // 本机新数据，首推
        } else if (serverVal == null && localVal === undefined) {
          return; // 服务端空 + 本机空
        } else if (localRaw !== mirrorRaw) {
          merged = MERGE[type](localVal, serverVal); // 本机有新变化：合并（lww 则本机赢）
        } else if (!deepEqual(serverVal, mirrorVal)) {
          // 本机没变、其他设备改了：除 lww（对方新值赢）外也走合并，避免覆盖丢失本机数据
          merged = (type === 'lww') ? serverVal : MERGE[type](localVal, serverVal);
        } else {
          return; // 完全一致
        }

        keyOps.push({
          key: key,
          merged: merged,
          oldMirrorRaw: mirrorRaw,
          toPush: !deepEqual(merged, serverVal)
        });
      });

      // 先上推，再按结果提交本地/镜像（失败则回滚镜像，下一轮重试，绝不丢本地变更）
      var pushed = 0, pushOk = true;
      var pushItems = {};
      keyOps.forEach(function (op) { if (op.toPush) pushItems[op.key] = op.merged; });
      if (Object.keys(pushItems).length) {
        var p = await global.AuthClient._postJSON('/api/userdata', { items: pushItems });
        if (p.ok && p.data && p.data.success) pushed = p.data.saved || 0;
        else { pushOk = false; console.warn('[user-sync] 上推失败', p.status, p.data && p.data.error); }
      }

      var appliedKeys = [];
      keyOps.forEach(function (op) {
        if (!pushOk && op.toPush) {
          // 上推失败：镜像回滚到旧值，本地变更保留，下一轮重试
          if (op.oldMirrorRaw == null) lsDel(MIRROR_PREFIX + op.key);
          else lsSet(MIRROR_PREFIX + op.key, op.oldMirrorRaw);
        } else {
          writeMirror(op.key, op.merged);
        }
        if (!deepEqual(op.merged, parseAny(lsGet(op.key))) && !(op.merged == null && lsGet(op.key) == null)) {
          writeLocal(op.key, op.merged);
          appliedKeys.push(op.key);
        }
      });

      if (appliedKeys.length) {
        console.info('[user-sync] 已从服务端应用:', appliedKeys.join(','));
        try { global.dispatchEvent(new Event('usersync:applied')); } catch (e) {}
        maybeReload();
      }
      return { applied: appliedKeys.length, pushed: pushed };
    } catch (e) {
      console.warn('[user-sync] 同步异常', e && e.message);
      return { applied: 0, pushed: 0 };
    } finally {
      syncing = false;
    }
  }

  // 应用服务端数据后刷新页面（15s 防抖防死循环；刷新后值一致不会再触发）
  function maybeReload() {
    var KEY = 'mc_sync_reload_at';
    var last = 0;
    try { last = Number(global.sessionStorage.getItem(KEY) || 0); } catch (e) {}
    var now = Date.now();
    if (now - last < 15000) return;
    try { global.sessionStorage.setItem(KEY, String(now)); } catch (e) {}
    setTimeout(function () { global.location.reload(); }, 300);
  }

  function clearMirrors() {
    Object.keys(SYNC_KEYS).forEach(function (k) { lsDel(MIRROR_PREFIX + k); });
  }

  // ===== 触发点 =====
  global.addEventListener('auth:changed', function () {
    if (!global.AuthClient.isLoggedIn()) { clearMirrors(); return; }
    setTimeout(syncNow, 800); // 登录成功后稍等页面落定
  });
  global.addEventListener('usersync:now', function () { syncNow(); });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(syncNow, 1500); });
  } else {
    setTimeout(syncNow, 1500);
  }
  setInterval(function () { syncNow(); }, 90000); // 兜底：90s 周期同步

  global.UserSync = { syncNow: syncNow, SYNC_KEYS: SYNC_KEYS, clearMirrors: clearMirrors };
})(typeof window !== 'undefined' ? window : this);

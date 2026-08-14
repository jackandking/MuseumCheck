const { normalizeEvent, eventIsReady, countJoins, buildVisitUrl, humanDate, createEventId } = require('../js/together.js');

describe('同行探索活动入口', () => {
  test('only accepts controlled event configuration', () => {
    expect(normalizeEvent({ eventId:'shanghai-sunday-1', museumId:'shanghai-museum', date:'2026-08-16', time:'10:30', limit:'5' }))
      .toEqual({ eventId:'shanghai-sunday-1', museumId:'shanghai-museum', date:'2026-08-16', time:'10:30', limit:5 });
    expect(normalizeEvent({ eventId:'<script>', museumId:'x', date:'tomorrow', time:'late', limit:'99' }))
      .toEqual({ eventId:'', museumId:'x', date:'', time:'', limit:8 });
  });

  test('requires a real configured event before a family can join', () => {
    expect(eventIsReady({ eventId:'shanghai-sunday-1', museumId:'shanghai-museum', date:'2026-08-16', time:'10:30' })).toBe(true);
    expect(eventIsReady({ eventId:'shanghai-sunday-1', museumId:'shanghai-museum', date:'', time:'10:30' })).toBe(false);
  });

  test('counts unique anonymous join ids and nothing else', () => {
    const payload = { value: JSON.stringify([
      { value: JSON.stringify({ type:'together_join', eventId:'shanghai-sunday-1', joinId:'a' }) },
      { value: JSON.stringify({ type:'together_join', eventId:'shanghai-sunday-1', joinId:'a' }) },
      { value: JSON.stringify({ type:'together_join', eventId:'another-event', joinId:'b' }) },
      { value: 'not-json' }
    ]) };
    expect(countJoins(payload, 'shanghai-sunday-1')).toBe(1);
  });

  test('builds an on-site visit link without aliases or contact information', () => {
    const url = buildVisitUrl({ eventId:'shanghai-sunday-1' }, { id:'shanghai-museum' });
    const parsed = new URL(url, 'https://museumcheck.cn');
    expect(parsed.pathname).toBe('/museum-checkin.html');
    expect(parsed.searchParams.get('museum')).toBe('shanghai-museum');
    expect(parsed.searchParams.get('together')).toBe('shanghai-sunday-1');
    expect(parsed.search).not.toContain('alias');
  });

  test('formats configured time for the activity card', () => {
    expect(humanDate('2026-08-16', '10:30')).toContain('10:30');
  });

  test('generates an opaque event id rather than using a parent or child name', () => {
    expect(createEventId()).toMatch(/^visit-[a-z0-9]+-[a-z0-9]{5}$/);
  });
});

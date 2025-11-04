const fs = require('fs');
const path = require('path');
const https = require('https');

/**
 * UT: Validate Forbidden City Museum collections image URLs
 * - Structure: non-empty, has name/url, absolute https
 * - Network check: each URL returns HTTP 2xx/3xx and content-type image/* (best-effort; small timeout)
 */

describe('Forbidden City Museum collections URLs', () => {
  beforeAll(() => {
    const filePath = path.join(__dirname, '..', 'museums', 'forbidden-city.js');
    expect(fs.existsSync(filePath)).toBe(true);
    delete require.cache[filePath];
    require(filePath); // defines window.MUSEUM_FORBIDDEN_CITY
  });

  test('collections have valid image URL format', () => {
    const museum = window && window.MUSEUM_FORBIDDEN_CITY;
    expect(museum).toBeTruthy();
    expect(Array.isArray(museum.collections)).toBe(true);
    expect(museum.collections.length).toBe(3); // Should have 3 treasures

    const imgExtRe = /\.(png|jpe?g|webp|gif|bmp)$/i;

    museum.collections.forEach((item) => {
      expect(item && typeof item.name === 'string' && item.name.trim().length > 0).toBe(true);
      expect(item && typeof item.url === 'string' && item.url.trim().length > 0).toBe(true);
      expect(item && typeof item.description === 'string' && item.description.trim().length > 0).toBe(true);

      let u;
      try { u = new URL(item.url); } catch { u = null; }
      expect(u).toBeTruthy();
      expect(u.protocol).toBe('https:');
      
      // Verify URL has image extension
      expect(imgExtRe.test(u.pathname)).toBe(true);
    });
  });

  test('collections image URLs respond with image content', async () => {
    const museum = window && window.MUSEUM_FORBIDDEN_CITY;
    const urls = (museum.collections || []).map(i => i.url).filter(Boolean);

    const headOrGet = (url) => new Promise((resolve) => {
      // Try HEAD first, fallback to GET
      const doReq = (method) => {
        const req = https.request(url, { method, timeout: 8000 }, (res) => {
          const status = res.statusCode || 0;
          const type = String(res.headers['content-type'] || '');
          res.resume(); // discard body
          resolve({ ok: status >= 200 && status < 400, status, type, url });
        });
        req.on('timeout', () => { req.destroy(new Error('timeout')); });
        req.on('error', (err) => resolve({ ok: false, status: 0, type: '', url, error: err.message }));
        req.end();
      };
      doReq('HEAD');
    }).then(r => r.ok ? r : new Promise((resolve) => {
      const req = https.request(url, { method: 'GET', timeout: 8000 }, (res) => {
        const status = res.statusCode || 0;
        const type = String(res.headers['content-type'] || '');
        res.resume();
        resolve({ ok: status >= 200 && status < 400, status, type, url });
      });
      req.on('timeout', () => { req.destroy(new Error('timeout')); });
      req.on('error', (err) => resolve({ ok: false, status: 0, type: '', url, error: err.message }));
      req.end();
    }));

    const results = await Promise.all(urls.map(headOrGet));

    results.forEach((r, idx) => {
      if (!r.ok) {
        console.log(`Failed URL: ${r.url}, Status: ${r.status}, Error: ${r.error || 'N/A'}`);
      }
      expect(r.ok).toBe(true);
      expect(r.type.toLowerCase().startsWith('image/')).toBe(true);
    });
  }, 30000);
});

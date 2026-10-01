#!/usr/bin/env node
/*
 Generates SEO-friendly static detail pages for each museum from data/museums-meta.json.

 Why: museumcheck.cn is a static site; Baidu cannot crawl the SPA check-in flow
 (museum-checkin.html?museum=<id> is JS-rendered, parameter-based, not in sitemap).
 These pages are a crawlable top-of-funnel: pure static HTML content + a CTA that
 hands the visitor into the existing interactive check-in page. They do NOT replicate
 the check-in experience (tasks / upload / account / poster all stay in the SPA).

 Output: museums/<id>.html  (flat URL, e.g. museumcheck.cn/museums/forbidden-city.html)
 Also rewrites sitemap.xml to include the generated URLs (lastmod = today).

 Usage:
   node devops/tools/generate-museum-pages.js --sample 8        # first N museums by data order
   node devops/tools/generate-museum-pages.js --ids forbidden-city,national-museum
   node devops/tools/generate-museum-pages.js                   # all 122 (default)

 Flags:
   --no-sitemap   skip sitemap rewrite
   --dry-run      print what would be written, write nothing
*/

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const metaFile = path.join(root, 'data', 'museums-meta.json');
const outDir = path.join(root, 'museums');
const sitemapFile = path.join(root, 'sitemap.xml');

const BAIDU_ID = '10856afa2ea23687b7e8f5b901795c57';
const SITE = 'https://museumcheck.cn';

const args = process.argv.slice(2);
const getFlag = (name) => args.includes(name);
const getOpt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
};
const NO_SITEMAP = getFlag('--no-sitemap');
const DRY_RUN = getFlag('--dry-run');

function parseArgs() {
  const idsOpt = getOpt('--ids');
  const sampleOpt = getOpt('--sample');
  const all = require(metaFile);
  const list = Object.values(all);
  if (idsOpt) {
    const want = idsOpt.split(',').map((s) => s.trim());
    return list.filter((m) => want.includes(m.id));
  }
  if (sampleOpt) {
    const n = parseInt(sampleOpt, 10) || list.length;
    return list.slice(0, n);
  }
  return list;
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// tag -> kid-friendly reason sentence (used to build unique per-museum copy)
const TAG_REASONS = {
  历史: '在真实的历史现场帮孩子建立“时间”的概念，比课本更具体。',
  建筑: '古建本身就是立体的美学课，屋顶、斗拱、院落都值得抬头看。',
  文物: '隔着展柜和几千年前的器物对望，是最天然的“为什么”触发点。',
  艺术: '真迹面前讲构图与色彩，审美启蒙不用等到长大。',
  自然: '恐龙、矿石、动植物标本把“自然课”变得可触摸。',
  科技: '从天文到航天，把“未来”具象成眼前的展品。',
  军事: '兵器与战争史能自然引出关于和平与策略的讨论。',
  民俗: '老物件里藏着一代人的生活智慧，是讲家风最好的切口。',
  考古: '探方与修复现场让孩子理解“证据”与“耐心”。',
  地质: '岩石与矿物讲地球的故事，科学启蒙从脚下开始。',
  皇家: '一座宫殿就是一部浓缩的王朝史，孩子最容易记住“皇帝住哪儿”。',
  宫廷: '一座宫殿就是一部浓缩的王朝史，孩子最容易记住“皇帝住哪儿”。',
  园林: '叠山理水是中国人千年的空间审美，逛园子也是逛哲学。',
  石窟: '崖壁上的雕刻把信仰与技艺刻进石头，震撼感远超图片。',
};

const FALLBACK_REASONS = [
  '少即是多：挑 1–2 件展品深挖，比走马观花更有记忆点。',
  '提前给孩子一个“小任务”，让观察有目标，逛馆不喊累。',
  '用孩子的提问做主线，你不需要当讲解员，只需要当同行者。',
];

function buildReasons(m) {
  const tags = (m.tags || []).slice();
  const reasons = [];
  for (const t of tags) {
    if (TAG_REASONS[t] && reasons.length < 3) reasons.push(TAG_REASONS[t]);
  }
  let fi = 0;
  while (reasons.length < 3) reasons.push(FALLBACK_REASONS[fi++ % FALLBACK_REASONS.length]);
  return reasons;
}

function buildIntro(m) {
  const tagsText = (m.tags || []).join('、') || '馆藏丰富';
  let s = `带孩子逛${esc(m.name)}，是把课堂直接搬进${esc(m.location)}的真实地标。` +
    `${esc(m.name)}以${esc(tagsText)}见长，馆里的藏品与空间本身就是最好的亲子教材——比起“看完”，我们更鼓励“观察到”。`;
  if (m.hasCollections && (m.collections || []).length) {
    s += `馆内的镇馆之宝往往是最能抓住孩子注意力的入口，先从一件开始讲起就好。`;
  }
  return s;
}

function relatedHtml(m, pool) {
  const others = pool.filter((x) => x.id !== m.id).slice(0, 4);
  if (!others.length) return '';
  const items = others.map((x) => {
    return `<a class="rel-card" href="museums/${esc(x.id)}.html">
      <img src="${esc(x.image)}" alt="${esc(x.name)}" loading="lazy" />
      <span>${esc(x.name)}</span>
    </a>`;
  }).join('\n      ');
  return `<section class="rel">
    <h2>相关博物馆</h2>
    <div class="rel-grid">
      ${items}
    </div>
  </section>`;
}

function treasuresHtml(m) {
  const cols = (m.collections || []).filter((c) => c && c.name);
  if (!cols.length) return '';
  const cards = cols.map((c) => {
    const img = c.imageUrl ? `<img src="${esc(c.imageUrl)}" alt="${esc(c.name)}" loading="lazy" />` : '';
    const attr = c.attribution ? `<p class="attr">图片：${esc(c.attribution)}</p>` : '';
    const meta = [c.dynasty, c.category].filter(Boolean).join(' · ');
    return `<article class="treasure">
      ${img}
      <div class="treasure-body">
        <h3>${esc(c.name)}</h3>
        ${meta ? `<p class="treasure-meta">${esc(meta)}</p>` : ''}
        <p>${esc(c.description || '')}</p>
        ${attr}
      </div>
    </article>`;
  }).join('\n      ');
  return `<section class="treasures">
    <h2>${esc(m.name)} · 镇馆之宝</h2>
    <div class="treasure-grid">
      ${cards}
    </div>
  </section>`;
}

function pageHtml(m, pool) {
  const desc = `带孩子逛${m.name}（${m.location}）的亲子参观指南：为什么适合孩子、镇馆之宝一览、以及专属的博物馆打卡任务。来自博物馆打卡 MuseumCheck。`;
  const url = `${SITE}/museums/${m.id}.html`;
  const tagsText = (m.tags || []).join('、');
  const levelText = m.level ? `${esc(m.level)}博物馆` : '博物馆';
  const reasons = buildReasons(m).map((r, i) => `<li><strong>理由 ${i + 1}：</strong>${r}</li>`).join('\n      ');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: m.name,
    description: desc,
    image: m.image,
    address: { '@type': 'PostalAddress', addressLocality: m.location, addressCountry: 'CN' },
    url: url,
  };

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(m.name)} 亲子参观指南 | 博物馆打卡</title>
  <meta name="description" content="${esc(desc)}" />
  <meta name="keywords" content="${esc(m.name)},亲子游,${esc(tagsText)},${esc(m.location)}博物馆,博物馆打卡" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${esc(m.name)} 亲子参观指南 | 博物馆打卡" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:image" content="${esc(m.image)}" />
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  <script>
    var _hmt = _hmt || [];
    (function () {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?${BAIDU_ID}";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
    })();
  </script>
  <style>
    :root { --brand:#639922; --brand-d:#3B6D11; --ink:#2C2C2A; --mut:#5F5E5A; --line:#D3D1C7; --bg:#F1EFE8; }
    * { box-sizing: border-box; }
    body { margin:0; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif; color:var(--ink); background:#fff; line-height:1.7; }
    .wrap { max-width:760px; margin:0 auto; padding:20px 18px 48px; }
    header.top { border-bottom:1px solid var(--line); padding-bottom:16px; margin-bottom:8px; }
    .brand { font-size:13px; color:var(--brand-d); font-weight:600; letter-spacing:.5px; }
    h1 { font-size:26px; margin:8px 0 4px; }
    .sub { color:var(--mut); font-size:14px; }
    .badges { margin:12px 0; }
    .badge { display:inline-block; background:var(--bg); border:1px solid var(--line); border-radius:999px; padding:3px 12px; font-size:13px; color:var(--mut); margin:0 6px 6px 0; }
    .cover { width:100%; border-radius:12px; margin:14px 0; display:block; }
    h2 { font-size:19px; margin:28px 0 12px; border-left:4px solid var(--brand); padding-left:10px; }
    .intro { font-size:15px; color:var(--ink); }
    ul.reasons { padding-left:0; list-style:none; }
    ul.reasons li { background:var(--bg); border:1px solid var(--line); border-radius:10px; padding:12px 14px; margin-bottom:10px; font-size:14px; }
    .treasure-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .treasure { border:1px solid var(--line); border-radius:12px; overflow:hidden; }
    .treasure img { width:100%; height:160px; object-fit:cover; display:block; }
    .treasure-body { padding:12px 14px; }
    .treasure h3 { margin:0 0 4px; font-size:16px; }
    .treasure-meta { color:var(--mut); font-size:12px; margin:0 0 6px; }
    .treasure p { font-size:13px; margin:0 0 6px; }
    .attr { font-size:11px; color:#888780; margin:0; }
    .cta { display:block; text-align:center; background:var(--brand); color:#fff; text-decoration:none; font-size:17px; font-weight:600; padding:15px; border-radius:12px; margin:26px 0; }
    .cta:hover { background:var(--brand-d); }
    .rel-grid { display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:10px; }
    .rel-card { text-decoration:none; color:var(--ink); font-size:12px; text-align:center; }
    .rel-card img { width:100%; height:70px; object-fit:cover; border-radius:8px; display:block; margin-bottom:4px; }
    footer { margin-top:40px; padding-top:16px; border-top:1px solid var(--line); font-size:12px; color:var(--mut); }
    footer a { color:var(--brand-d); }
    @media (max-width:560px){ .treasure-grid{grid-template-columns:1fr;} .rel-grid{grid-template-columns:1fr 1fr;} }
  </style>
</head>
<body>
  <div class="wrap">
    <header class="top">
      <div class="brand">博物馆打卡 · MuseumCheck</div>
      <h1>${esc(m.name)}</h1>
      <div class="sub">${esc(m.location)} · ${levelText}</div>
    </header>

    <div class="badges">
      ${m.level ? `<span class="badge">${esc(m.level)}博物馆</span>` : ''}
      ${(m.tags || []).map((t) => `<span class="badge">${esc(t)}</span>`).join('')}
    </div>

    <img class="cover" src="${esc(m.image)}" alt="${esc(m.name)}" />

    <section>
      <h2>为什么带孩子来 ${esc(m.name)}</h2>
      <p class="intro">${buildIntro(m)}</p>
      <ul class="reasons">
        ${reasons}
      </ul>
    </section>

    ${treasuresHtml(m)}

    <a class="cta" href="museum-checkin.html?museum=${esc(m.id)}">开始 ${esc(m.name)} 博物馆打卡 →</a>

    ${relatedHtml(m, pool)}

    <footer>
      <p>博物馆打卡 MuseumCheck — 把博物馆变成亲子之间的共同记忆。</p>
      <p><a href="index.html">返回首页</a> · <a href="museum-checkin.html">进入打卡</a></p>
      <p>京ICP备2024092319号-6</p>
    </footer>
  </div>
</body>
</html>`;
}

function rewriteSitemap(generated) {
  if (!fs.existsSync(sitemapFile)) return;
  let xml = fs.readFileSync(sitemapFile, 'utf8');
  const today = new Date().toISOString().slice(0, 10);
  let block = '';
  for (const m of generated) {
    const url = `${SITE}/museums/${m.id}.html`;
    if (xml.includes(esc(url))) continue;
    block += `    <url>\n      <loc>${url}</loc>\n      <lastmod>${today}</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>0.8</priority>\n    </url>\n`;
  }
  if (block) {
    xml = xml.replace(/<\/urlset>/, block + '</urlset>');
    fs.writeFileSync(sitemapFile, xml, 'utf8');
    console.log('sitemap.xml updated (+' + generated.length + ' museum urls)');
  } else {
    console.log('sitemap.xml already contains these museum urls');
  }
}

function main() {
  const pool = parseArgs();
  if (!pool.length) {
    console.error('No museums matched the given filter.');
    process.exit(1);
  }
  if (!DRY_RUN) fs.mkdirSync(outDir, { recursive: true });
  const written = [];
  for (const m of pool) {
    const html = pageHtml(m, pool);
    const file = path.join(outDir, `${m.id}.html`);
    if (DRY_RUN) {
      console.log(`[dry-run] would write ${file} (${html.length} bytes)`);
    } else {
      fs.writeFileSync(file, html, 'utf8');
      console.log(`written ${file}`);
    }
    written.push(m);
  }
  if (!NO_SITEMAP && !DRY_RUN) rewriteSitemap(written);
  console.log(`\nDone. ${written.length} museum detail page(s).`);
}

main();

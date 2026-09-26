#!/usr/bin/env node
/**
 * Regenerate ALL poster QR codes so they point to the museumcheck.cn WEBSITE
 * (not the deprecated WeChat mini-program).
 *
 * - Museum-specific QR: https://museumcheck.cn/museum-checkin.html?museum=<id>
 * - Generic fallback QR: https://museumcheck.cn/  (website home)
 *
 * Usage (run from repo root so `qrcode` resolves from node_modules):
 *   node devops/tools/regen-poster-qr.js
 */

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const QR_DIR = path.join(__dirname, '..', '..', 'assets', 'qrcodes');
const BASE_URL = 'https://museumcheck.cn/museum-checkin.html';

const OPTIONS = {
  errorCorrectionLevel: 'H',
  type: 'image/png',
  quality: 0.95,
  margin: 4,
  width: 512,
  color: { dark: '#000000', light: '#FFFFFF' }
};

// PascalCase filename stem -> kebab-case museum id
function pascalToKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

async function main() {
  if (!fs.existsSync(QR_DIR)) fs.mkdirSync(QR_DIR, { recursive: true });

  const files = fs.readdirSync(QR_DIR)
    .filter(f => f.startsWith('MuseumCheck_QRCode_') && f.endsWith('.png') && f !== 'MuseumCheck_QRCode_WX.jpg');

  console.log(`Found ${files.length} museum-specific QR files to regenerate.\n`);

  for (const file of files) {
    const stem = file.replace(/^MuseumCheck_QRCode_/, '').replace(/\.png$/, '');
    const museumId = pascalToKebab(stem);
    const url = `${BASE_URL}?museum=${museumId}`;
    const outPath = path.join(QR_DIR, file);
    await QRCode.toFile(outPath, url, OPTIONS);
    console.log(`✓ ${file}  ->  ${url}`);
  }

  // Generic website fallback QR (replaces the old WeChat mini-program QR in the poster)
  const websitePath = path.join(QR_DIR, 'MuseumCheck_QRCode_Website.png');
  await QRCode.toFile(websitePath, 'https://museumcheck.cn/', OPTIONS);
  console.log(`\n✓ MuseumCheck_QRCode_Website.png  ->  https://museumcheck.cn/  (poster fallback)`);
  console.log('\nAll poster QR codes now point to museumcheck.cn (website).');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});

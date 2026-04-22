#!/usr/bin/env node
/**
 * Verify SVG QR files by rasterizing them and decoding with jsQR.
 */
const jsQR = require('jsqr');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.resolve(__dirname, '..', 'public', 'assets', 'flocken', 'qr');

const TARGETS = [
  {
    name: 'flocken_qr_manual_download',
    expected:
      'https://flocken.info/download?utm_source=manual_page&utm_medium=qr&utm_campaign=download_desktop',
  },
  {
    name: 'flocken_qr_skylt_ute',
    expected:
      'https://flocken.info/download?utm_source=print_skylt_ute&utm_medium=qr&utm_campaign=print_2026q2',
  },
];

(async () => {
  let allOk = true;
  for (const t of TARGETS) {
    const svgPath = path.join(OUT_DIR, `${t.name}.svg`);
    console.log(`\n=== ${t.name}.svg ===`);
    const svgBuffer = fs.readFileSync(svgPath);
    const { data, info } = await sharp(svgBuffer, { density: 300 })
      .resize(1024, 1024)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const clamped = new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);
    const res = jsQR(clamped, info.width, info.height);
    if (!res) {
      console.log('  FAIL: could not decode rasterized SVG');
      allOk = false;
      continue;
    }
    console.log(`  Decoded: ${res.data}`);
    if (res.data === t.expected) {
      console.log('  MATCH');
    } else {
      console.log('  FAIL: mismatch');
      allOk = false;
    }
  }
  process.exit(allOk ? 0 : 1);
})();

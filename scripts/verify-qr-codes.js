#!/usr/bin/env node
/**
 * Verify generated QR PNGs by decoding them with jsQR.
 * Confirms each QR scans successfully AND that the decoded URL matches the expected URL exactly (incl. UTM params).
 */

const jsQR = require('jsqr');
const sharp = require('sharp');
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

async function decodePng(pngPath) {
  const { data, info } = await sharp(pngPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const clamped = new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);
  const result = jsQR(clamped, info.width, info.height);
  return result;
}

(async () => {
  let allOk = true;
  for (const t of TARGETS) {
    const pngPath = path.join(OUT_DIR, `${t.name}.png`);
    console.log(`\n=== ${t.name}.png ===`);
    const res = await decodePng(pngPath);
    if (!res) {
      console.log('  FAIL: jsQR could not decode the image.');
      allOk = false;
      continue;
    }
    console.log(`  Decoded: ${res.data}`);
    if (res.data === t.expected) {
      console.log('  MATCH: decoded URL matches expected URL exactly.');
    } else {
      console.log('  FAIL: decoded URL does NOT match expected URL.');
      console.log(`  Expected: ${t.expected}`);
      allOk = false;
    }
  }
  console.log(allOk ? '\nAll QR codes verified.' : '\nVerification FAILED.');
  process.exit(allOk ? 0 : 1);
})();

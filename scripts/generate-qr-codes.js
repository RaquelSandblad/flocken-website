#!/usr/bin/env node
/**
 * Generate QR codes for Flocken with centered logo.
 *
 * Outputs:
 *  - public/assets/flocken/qr/flocken_qr_manual_download.svg (1024x1024 effective)
 *  - public/assets/flocken/qr/flocken_qr_manual_download.png (1024x1024)
 *  - public/assets/flocken/qr/flocken_qr_skylt_ute.svg
 *  - public/assets/flocken/qr/flocken_qr_skylt_ute.png (2048x2048)
 *
 * Error correction: H (30%) — required because centered logo covers ~15-18% of QR area.
 * Colors: flocken-brown (#3E3B32) modules on pure white.
 * Quiet zone: 4 modules (QR spec default).
 * Logo placement: centered, ~18% of QR width (safely under 30% ECC tolerance).
 */

const QRCode = require('qrcode');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.resolve(__dirname, '..', 'public', 'assets', 'flocken', 'qr');
const LOGO_PATH = path.resolve(
  __dirname,
  '..',
  'public',
  'assets',
  'flocken',
  'logo',
  'logo_icon_flocken_large_1x1.png'
);

const FLOCKEN_BROWN = '#3E3B32';
const WHITE = '#FFFFFF';

// Logo occupies 18% of QR width — well within ECC-H's 30% recovery tolerance.
// 4-module quiet zone is included automatically by qrcode lib (margin: 4).
const LOGO_RATIO = 0.18;

const TARGETS = [
  {
    name: 'flocken_qr_manual_download',
    url: 'https://flocken.info/download?utm_source=manual_page&utm_medium=qr&utm_campaign=download_desktop',
    pxSize: 1024,
  },
  {
    name: 'flocken_qr_skylt_ute',
    url: 'https://flocken.info/download?utm_source=print_skylt_ute&utm_medium=qr&utm_campaign=print_2026q2',
    pxSize: 2048,
  },
];

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function generateOne({ name, url, pxSize }) {
  console.log(`\n=== ${name} (${pxSize}px) ===`);
  console.log(`URL: ${url}`);

  const qrOptions = {
    errorCorrectionLevel: 'H',
    margin: 4,
    color: {
      dark: FLOCKEN_BROWN,
      light: WHITE,
    },
  };

  // --- SVG ---
  const svgString = await QRCode.toString(url, {
    ...qrOptions,
    type: 'svg',
    width: pxSize,
  });

  // Compute logo size and position for embedding into SVG.
  // We extract the viewBox of the generated SVG, then add a centered <image> overlay.
  const viewBoxMatch = svgString.match(/viewBox="([^"]+)"/);
  if (!viewBoxMatch) throw new Error('SVG missing viewBox');
  const [, vb] = viewBoxMatch;
  const [, , vbW, vbH] = vb.split(/\s+/).map(Number);

  const logoVbSize = vbW * LOGO_RATIO;
  const logoVbX = (vbW - logoVbSize) / 2;
  const logoVbY = (vbH - logoVbSize) / 2;

  // Read logo PNG as base64 so the SVG stays self-contained.
  const logoBuffer = fs.readFileSync(LOGO_PATH);
  const logoBase64 = logoBuffer.toString('base64');
  const logoDataUri = `data:image/png;base64,${logoBase64}`;

  // White rounded-rect backdrop behind logo to keep edges clean against modules.
  // Backdrop is slightly larger than logo (10% padding), corners rounded.
  const backdropSize = logoVbSize * 1.12;
  const backdropX = (vbW - backdropSize) / 2;
  const backdropY = (vbH - backdropSize) / 2;
  const backdropR = backdropSize * 0.12;

  const overlay =
    `<rect x="${backdropX}" y="${backdropY}" width="${backdropSize}" height="${backdropSize}" rx="${backdropR}" ry="${backdropR}" fill="${WHITE}"/>` +
    `<image x="${logoVbX}" y="${logoVbY}" width="${logoVbSize}" height="${logoVbSize}" href="${logoDataUri}" preserveAspectRatio="xMidYMid meet"/>`;

  // Inject overlay just before closing </svg>.
  const svgWithLogo = svgString.replace('</svg>', `${overlay}</svg>`);

  const svgPath = path.join(OUT_DIR, `${name}.svg`);
  fs.writeFileSync(svgPath, svgWithLogo, 'utf8');
  console.log(`  wrote SVG: ${svgPath} (${(svgWithLogo.length / 1024).toFixed(1)} KB)`);

  // --- PNG ---
  // Generate a crisp PNG from the QR at target size, then composite logo on top with sharp.
  const qrPngBuffer = await QRCode.toBuffer(url, {
    ...qrOptions,
    type: 'png',
    width: pxSize,
    rendererOpts: { quality: 1.0 },
  });

  const logoPxSize = Math.round(pxSize * LOGO_RATIO);
  const backdropPx = Math.round(pxSize * LOGO_RATIO * 1.12);
  const backdropRadiusPx = Math.round(backdropPx * 0.12);

  // Resize logo to target size (fit inside, preserving transparency).
  const resizedLogo = await sharp(LOGO_PATH)
    .resize(logoPxSize, logoPxSize, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // White rounded-rect backdrop SVG (rendered to buffer).
  const backdropSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${backdropPx}" height="${backdropPx}">` +
      `<rect x="0" y="0" width="${backdropPx}" height="${backdropPx}" rx="${backdropRadiusPx}" ry="${backdropRadiusPx}" fill="${WHITE}"/>` +
      `</svg>`
  );

  const pngPath = path.join(OUT_DIR, `${name}.png`);

  await sharp(qrPngBuffer)
    .composite([
      {
        input: backdropSvg,
        gravity: 'center',
      },
      {
        input: resizedLogo,
        gravity: 'center',
      },
    ])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(pngPath);

  const stat = fs.statSync(pngPath);
  console.log(`  wrote PNG: ${pngPath} (${(stat.size / 1024).toFixed(1)} KB)`);
}

(async () => {
  await ensureDir(OUT_DIR);
  for (const t of TARGETS) {
    await generateOne(t);
  }
  console.log('\nDone.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

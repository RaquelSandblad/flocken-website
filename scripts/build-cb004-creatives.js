/**
 * CB004 Vinkel A — produce 4 static creatives locally with Sharp
 *
 * Why local: Canva MCP generate-design always inherits template decorations
 * (lines, favicons, cream zones) that violate META_ADS_PRODUCTION_CHECKLIST
 * rad 120 "Bilden fyller hela canvaset — edge-to-edge, ingen stapling".
 * Building via Sharp + SVG gives us a clean full-bleed image + text overlay.
 *
 * Output: 4 JPGs at 1080x1350 (4:5) and 1080x1920 (9:16) in
 * flocken_ads/creative_bases/cb004/assets/final/
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const REPO = 'C:/dev/flocken-website';
const BASE_4X5 = path.join(REPO, 'public/assets/flocken/cb004-base/ad_cb004_a_base_clay_trehundar_4x5.png');
const BASE_9X16 = path.join(REPO, 'public/assets/flocken/cb004-base/ad_cb004_a_base_clay_trehundar_9x16.png');
const FONT_PATH = path.join(REPO, 'scripts/fonts-tmp/Inter-Bold.otf');
const OUT_DIR = path.join(REPO, 'flocken_ads/creative_bases/cb004/assets/final');

// Read Inter-Bold as base64 for SVG @font-face embedding
const fontB64 = fs.readFileSync(FONT_PATH).toString('base64');
const fontFace = `
  @font-face {
    font-family: 'Inter';
    font-weight: 700;
    src: url(data:font/otf;base64,${fontB64}) format('opentype');
  }
`;

/**
 * Build an SVG text overlay layer sized to the canvas.
 * Headline in upper third, white, Inter Bold, subtle dark plate for contrast.
 * Small "Flocken" wordmark bottom-left for brand recognition.
 */
function buildOverlaySvg({ width, height, headline, headlineFontSize, textTopFrac }) {
  // textTopFrac: where the headline starts, as fraction of canvas height.
  // For 4:5 use ~0.08 (upper third). For 9:16 use ~0.18 (below Meta's 15% UI safe zone).
  const lineHeight = headlineFontSize * 1.1;
  const lines = Array.isArray(headline) ? headline : [headline];
  const textLeft = Math.round(width * 0.06);

  const plateTop = Math.round(height * textTopFrac) - Math.round(headlineFontSize * 0.2);
  const plateHeight = Math.round(lineHeight * lines.length + headlineFontSize * 0.4);

  // Wordmark bottom-left — avoid bottom 15% safe zone on 9:16 by sitting at 96% on 4:5, 88% on 9:16
  const is9x16 = height / width > 1.5;
  const wmFontSize = Math.round(width * 0.032);
  const wmTop = is9x16 ? Math.round(height * 0.86) : height - Math.round(height * 0.04);

  const firstBaseline = plateTop + Math.round(headlineFontSize * 0.95);
  const tspans = lines.map((line, i) => {
    const y = firstBaseline + i * lineHeight;
    return `<tspan x="${textLeft}" y="${y}">${escapeXml(line)}</tspan>`;
  }).join('');

  // Use a soft vertical gradient plate so the image still reads behind the text —
  // darker at text level, fading to transparent top and bottom. Less "text-zone" feel.
  const gradId = 'plateGrad_' + Math.random().toString(36).slice(2, 7);

  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>${fontFace}</style>
    <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="black" stop-opacity="0" />
      <stop offset="20%" stop-color="black" stop-opacity="0.38" />
      <stop offset="80%" stop-color="black" stop-opacity="0.38" />
      <stop offset="100%" stop-color="black" stop-opacity="0" />
    </linearGradient>
  </defs>
  <!-- Soft gradient plate behind headline — keeps the image visible, ensures legibility -->
  <rect x="0" y="${plateTop - 40}" width="${width}" height="${plateHeight + 80}" fill="url(#${gradId})" />

  <!-- Headline -->
  <text fill="#FFFFFF" font-family="Inter" font-weight="700" font-size="${headlineFontSize}" letter-spacing="-1">
    ${tspans}
  </text>

  <!-- Small Flocken wordmark — subtle, not a logo placement, just brand recognition -->
  <text x="${textLeft}" y="${wmTop}" fill="#FFFFFF" font-family="Inter" font-weight="700" font-size="${wmFontSize}" letter-spacing="0.5" fill-opacity="0.95">Flocken</text>
</svg>`;
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function produce({ basePath, outPath, width, height, headlineLines, headlineFontSize }) {
  // Resize base image to exact canvas using cover fit (fills, crops as needed)
  const resized = await sharp(basePath)
    .resize({ width, height, fit: 'cover', position: 'centre' })
    .toBuffer();

  // On 9:16 (height/width > 1.5), start text at 18% to stay clear of Meta's 15% top safe zone.
  // On 4:5, start at 8% (upper third, above profile-name area).
  const textTopFrac = (height / width) > 1.5 ? 0.18 : 0.08;
  const svg = buildOverlaySvg({
    width,
    height,
    headline: headlineLines,
    headlineFontSize,
    textTopFrac,
  });

  await sharp(resized)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(outPath);

  const stat = fs.statSync(outPath);
  console.log(`  wrote ${path.basename(outPath)} (${(stat.size / 1024).toFixed(0)} KB)`);
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  // Plan:
  //   v01 = "En lekkompis som matchar"  (23 chars — fits on 2 lines comfortably)
  //   v02 = "Rätt storlek. Rätt lek."   (22 chars — 1 line)
  //
  // For 4:5 (1080x1350) — headline font 108pt, upper third = top ~100px
  // For 9:16 (1080x1920) — headline font 96pt, text starts at ~20% from top to stay out of 15% top safe zone

  console.log('Building 4:5 creatives (1080x1350)...');
  await produce({
    basePath: BASE_4X5,
    outPath: path.join(OUT_DIR, 'ad_cid004_a_v01_4x5_static.jpg'),
    width: 1080,
    height: 1350,
    headlineLines: ['En lekkompis', 'som matchar'],
    headlineFontSize: 108,
  });
  await produce({
    basePath: BASE_4X5,
    outPath: path.join(OUT_DIR, 'ad_cid004_a_v02_4x5_static.jpg'),
    width: 1080,
    height: 1350,
    headlineLines: ['Rätt storlek.', 'Rätt lek.'],
    headlineFontSize: 120,
  });

  console.log('Building 9:16 creatives (1080x1920)...');
  await produce({
    basePath: BASE_9X16,
    outPath: path.join(OUT_DIR, 'ad_cid004_a_v01_9x16_static.jpg'),
    width: 1080,
    height: 1920,
    headlineLines: ['En lekkompis', 'som matchar'],
    headlineFontSize: 108,
  });
  await produce({
    basePath: BASE_9X16,
    outPath: path.join(OUT_DIR, 'ad_cid004_a_v02_9x16_static.jpg'),
    width: 1080,
    height: 1920,
    headlineLines: ['Rätt storlek.', 'Rätt lek.'],
    headlineFontSize: 120,
  });

  console.log('\nAll 4 creatives produced. Verify dimensions:');
  for (const f of fs.readdirSync(OUT_DIR)) {
    const meta = await sharp(path.join(OUT_DIR, f)).metadata();
    console.log(`  ${f}: ${meta.width}x${meta.height}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });

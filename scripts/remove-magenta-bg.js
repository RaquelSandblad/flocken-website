/**
 * Remove magenta (#FF00FF) background from hand-mockup images
 * Uses sharp to replace magenta-range pixels with transparency
 *
 * Usage:
 *   node scripts/remove-magenta-bg.js <input> <output> [tolerance]
 *
 * Example:
 *   node scripts/remove-magenta-bg.js hand-key-karta.png hand-karta-clean.png 80
 */

const sharp = require('sharp');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node remove-magenta-bg.js <input> <output> [tolerance]');
  process.exit(1);
}

const inputPath = path.resolve(args[0]);
const outputPath = path.resolve(args[1]);
const TOLERANCE = parseInt(args[2] || '60', 10);

async function removeMagentaBackground() {
  console.log(`🎨 Removing magenta background...`);
  console.log(`   Input:     ${inputPath}`);
  console.log(`   Output:    ${outputPath}`);
  console.log(`   Tolerance: ${TOLERANCE}`);

  const image = sharp(inputPath).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`   Size:      ${width}x${height}, ${channels} channels`);

  let replaced = 0;
  const total = width * height;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Magenta = high red, low green, high blue
    // Also catch dark green remnants from previous bad removal
    const isMagenta = r > (255 - TOLERANCE) && g < TOLERANCE && b > (255 - TOLERANCE);

    // Near-magenta: pinkish/purplish pixels at edges (anti-aliasing)
    const isNearMagenta = r > 180 && g < 80 && b > 180 && (r + b) > 400;

    if (isMagenta || isNearMagenta) {
      data[i + 3] = 0; // Set alpha to 0 (transparent)
      replaced++;
    }
  }

  console.log(`   Replaced:  ${replaced} / ${total} pixels (${((replaced / total) * 100).toFixed(1)}%)`);

  await sharp(data, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`✅ Saved: ${outputPath}`);
}

removeMagentaBackground().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

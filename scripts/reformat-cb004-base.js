/**
 * Reformat CB004 Hundar vinkel A base image from 1:1 to 4:5 and 9:16
 * Uses Gemini 2.5 Flash Image for outpainting (preserves subject, expands background)
 *
 * Usage:
 *   GEMINI_API_KEY=AIzaSy... node scripts/reformat-cb004-base.js
 *
 * Input:  public/assets/flocken/v-hundar/ad_cb004_a_base_clay_trehundar_1x1.jpg
 * Output: flocken_ads/creative_bases/cb004/assets/base/
 *   - ad_cb004_a_base_clay_trehundar_4x5.png  (for 1080x1350 ad canvas)
 *   - ad_cb004_a_base_clay_trehundar_9x16.png (for 1080x1920 ad canvas)
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Set GEMINI_API_KEY environment variable');
  process.exit(1);
}

const INPUT_PATH = path.join(__dirname, '..', 'public', 'assets', 'flocken', 'v-hundar', 'ad_cb004_a_base_clay_trehundar_1x1.jpg');
const OUTPUT_DIR = path.join(__dirname, '..', 'flocken_ads', 'creative_bases', 'cb004', 'assets', 'base');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

if (!fs.existsSync(INPUT_PATH)) {
  console.error(`Input not found: ${INPUT_PATH}`);
  process.exit(1);
}

const inputImage = fs.readFileSync(INPUT_PATH);
const inputBase64 = inputImage.toString('base64');

const BASE_PROMPT = `You are given a clay-illustration image of three dogs (poodle, cocker spaniel, maltese) playing on grass with a tennis ball, fenced suburban backdrop, warm natural lighting.

Task: reformat this image to a new aspect ratio.

Critical rules:
- KEEP all three dogs exactly as they are in the original — same poses, same colors, same clay style, same proportions.
- KEEP the tennis ball, grass texture, fence, background buildings.
- Only EXPAND the canvas by continuing the grass, sky, fence, and buildings naturally in the new added space. This is outpainting, not redrawing.
- Maintain the exact same clay-illustration style, warm lighting, and color palette (grass green, earthy tones, sky blue, fence brown).
- Do NOT add new dogs, people, text, or other subjects.
- Do NOT change the dogs' size relative to the frame — they should remain the same resolved size, just with more grass/sky around them.

Output only the reformatted image.`;

const VARIANTS = [
  {
    id: '4x5',
    filename: 'ad_cb004_a_base_clay_trehundar_4x5.png',
    aspect: '4:5',
    prompt: `${BASE_PROMPT}\n\nNew aspect ratio: 4:5 (portrait). Add grass below the dogs and sky/trees above them to achieve 4:5 proportions. Dogs remain centered horizontally, slightly below vertical center.`
  },
  {
    id: '9x16',
    filename: 'ad_cb004_a_base_clay_trehundar_9x16.png',
    aspect: '9:16',
    prompt: `${BASE_PROMPT}\n\nNew aspect ratio: 9:16 (tall portrait / mobile story). Add significantly more grass below the dogs and more sky/trees above them to achieve 9:16 proportions. Dogs remain centered horizontally, positioned at vertical center.`
  }
];

async function reformat(variant) {
  console.log(`\nReformatting to ${variant.aspect}...`);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: variant.prompt },
          { inlineData: { mimeType: 'image/jpeg', data: inputBase64 } }
        ]
      }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: { aspectRatio: variant.aspect }
      }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    console.error(`  FAILED ${variant.aspect}: ${err.substring(0, 300)}`);
    return false;
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find(p => p.inlineData);

  if (!imagePart) {
    console.error(`  No image in response for ${variant.aspect}`);
    console.error('  Response snippet:', JSON.stringify(data).substring(0, 500));
    return false;
  }

  const outputPath = path.join(OUTPUT_DIR, variant.filename);
  fs.writeFileSync(outputPath, Buffer.from(imagePart.inlineData.data, 'base64'));
  console.log(`  Saved ${outputPath}`);
  return true;
}

async function main() {
  console.log('Reformatting CB004 vinkel A base image');
  console.log(`Input:  ${INPUT_PATH}`);
  console.log(`Output: ${OUTPUT_DIR}`);

  let success = 0;
  for (const variant of VARIANTS) {
    try {
      const ok = await reformat(variant);
      if (ok) success++;
    } catch (err) {
      console.error(`  Error ${variant.aspect}:`, err.message);
    }
  }

  console.log(`\nDone: ${success}/${VARIANTS.length} variants reformatted`);
}

main();

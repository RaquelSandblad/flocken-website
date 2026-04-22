/**
 * Reformat /v/hundar hero from 21:9 to 16:9
 *
 * Varför: 21:9 kropas för hårt på mobil. /v/passa kör 16:9 med default
 * objectPosition 'center 30%' och ser bra ut — vi kör samma pattern.
 *
 * Approach: outpaint 21:9 → 16:9 (lägg till sky uppåt + gräs nedåt),
 * bevarar befintlig scen exakt. Ingen ny hund, inga nya objekt.
 *
 * Usage:
 *   GEMINI_API_KEY=AIzaSy... node scripts/reformat-hero-hundar-16x9.js
 *
 * Input:  public/assets/flocken/v-hundar/hero-clay-trehundar-21x9.jpg
 * Output: public/assets/flocken/v-hundar/hero-clay-trehundar-16x9.jpg
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Set GEMINI_API_KEY environment variable');
  process.exit(1);
}

const INPUT_PATH = path.join(
  __dirname,
  '..',
  'public',
  'assets',
  'flocken',
  'v-hundar',
  'hero-clay-trehundar-21x9.jpg'
);
const OUTPUT_PATH = path.join(
  __dirname,
  '..',
  'public',
  'assets',
  'flocken',
  'v-hundar',
  'hero-clay-trehundar-16x9.jpg'
);

if (!fs.existsSync(INPUT_PATH)) {
  console.error(`Input not found: ${INPUT_PATH}`);
  process.exit(1);
}

const inputImage = fs.readFileSync(INPUT_PATH);
const inputBase64 = inputImage.toString('base64');

const PROMPT = `You are given a clay-illustration hero image (21:9, very wide) of three dogs (poodle, cocker spaniel, maltese) standing together on grass with a tennis ball, fenced suburban backdrop with houses, warm natural lighting, blue sky.

Task: reformat this image to 16:9 aspect ratio (less wide, a bit taller). This is outpainting, not redrawing.

Critical rules:
- KEEP all three dogs EXACTLY as they are — same poses, same colors, same clay style, same proportions, same position horizontally.
- KEEP the tennis ball, grass, fence, suburban houses, sky — everything in the original stays exactly where it is.
- Only EXPAND the canvas vertically: continue the grass downward and the sky/trees/rooftops upward naturally in the newly added space.
- Maintain the EXACT SAME clay-illustration style, warm lighting, and color palette (grass green, earthy browns, sky blue, fence brown, house pastels).
- Do NOT add new dogs, new people, new text, or any new subjects.
- Do NOT change the dogs' size or position — they should remain in the lower third, same resolved size.

Output only the reformatted 16:9 image.`;

async function reformat() {
  console.log('Reformatting /v/hundar hero 21:9 → 16:9...');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: PROMPT },
            { inlineData: { mimeType: 'image/jpeg', data: inputBase64 } },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: { aspectRatio: '16:9' },
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error(`FAILED: ${err.substring(0, 500)}`);
    return false;
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p.inlineData);

  if (!imagePart) {
    console.error('No image in response');
    console.error('Response snippet:', JSON.stringify(data).substring(0, 500));
    return false;
  }

  fs.writeFileSync(OUTPUT_PATH, Buffer.from(imagePart.inlineData.data, 'base64'));
  console.log(`Saved ${OUTPUT_PATH}`);
  return true;
}

reformat().then((ok) => process.exit(ok ? 0 : 1));

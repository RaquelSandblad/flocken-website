/**
 * Generate hand-holding-phone mockup images for quiz CTA cards
 * Uses Gemini Imagen 3 via Google AI Studio API
 *
 * Usage:
 *   GEMINI_API_KEY=AIzaSy... node scripts/generate-cta-mockups.js
 *
 * Output: public/assets/flocken/quiz-cta/
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ Set GEMINI_API_KEY environment variable');
  console.error('   Get it from: https://aistudio.google.com/apikey');
  process.exit(1);
}

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'flocken', 'quiz-cta');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const BASE_STYLE = `Photorealistic product photography. A hand naturally holding the latest iPhone model (iPhone 16 Pro style: very thin uniform bezels, Dynamic Island pill-shaped cutout at top center, titanium edges, flat screen, rounded corners with tight radius). The phone has a completely blank, solid white screen — NO app interface, NO icons, NO text, NO UI elements on the screen. Just a pure white rectangle on the display. Warm, soft natural lighting from the upper left. Smooth solid olive-green background color (#6B7A3A). The hand is relaxed, slight 15-degree tilt. Camera angle: slightly above. Professional Apple-style product photography. The screen must be completely blank white.`;

const VARIANTS = [
  {
    id: 'hand-empty',
    filename: 'hand-mockup-empty-a.png',
    prompt: BASE_STYLE
  },
  {
    id: 'hand-empty-b',
    filename: 'hand-mockup-empty-b.png',
    prompt: `${BASE_STYLE} Different hand position, fingers slightly more wrapped around the phone. Slightly different lighting angle.`
  },
  {
    id: 'hand-empty-c',
    filename: 'hand-mockup-empty-c.png',
    prompt: `${BASE_STYLE} Hand holding phone from the left side instead. Slightly warmer lighting tone.`
  }
];

async function generateImage(variant) {
  console.log(`\n🎨 Generating ${variant.id}...`);
  console.log(`   Prompt: ${variant.prompt.substring(0, 100)}...`);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt: variant.prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: '9:16',  // Phone-proportioned, vertical
        personGeneration: 'allow_adult',
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();

    // Try alternative API format (Gemini 2.0 Flash)
    console.log('   ⚠️  Imagen API failed, trying Gemini 2.0 Flash...');
    return await generateWithGeminiFlash(variant);
  }

  const data = await response.json();

  if (!data.predictions || data.predictions.length === 0) {
    console.error(`   ❌ No image generated for ${variant.id}`);
    console.error('   Response:', JSON.stringify(data).substring(0, 200));
    return false;
  }

  const imageBase64 = data.predictions[0].bytesBase64Encoded;
  const outputPath = path.join(OUTPUT_DIR, variant.filename);
  fs.writeFileSync(outputPath, Buffer.from(imageBase64, 'base64'));
  console.log(`   ✅ Saved to ${outputPath}`);
  return true;
}

async function generateWithGeminiFlash(variant) {
  // Alternative: use Gemini 2.0 Flash with image generation
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `Generate this image: ${variant.prompt}` }]
      }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE']
      }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    console.error(`   ❌ Gemini Flash also failed: ${err.substring(0, 200)}`);
    return false;
  }

  const data = await response.json();

  // Extract image from response
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find(p => p.inlineData);

  if (!imagePart) {
    console.error(`   ❌ No image in Gemini Flash response`);
    return false;
  }

  const outputPath = path.join(OUTPUT_DIR, variant.filename);
  fs.writeFileSync(outputPath, Buffer.from(imagePart.inlineData.data, 'base64'));
  console.log(`   ✅ Saved to ${outputPath} (via Gemini Flash)`);
  return true;
}

async function main() {
  console.log('🚀 Generating CTA mockup images');
  console.log(`   Output: ${OUTPUT_DIR}`);

  let success = 0;
  for (const variant of VARIANTS) {
    try {
      const ok = await generateImage(variant);
      if (ok) success++;
    } catch (err) {
      console.error(`   ❌ Error generating ${variant.id}:`, err.message);
    }
  }

  console.log(`\n✅ Done: ${success}/${VARIANTS.length} images generated`);

  if (success > 0) {
    console.log('\n📝 Next step: Update AppCtaModule.tsx to use new images:');
    VARIANTS.forEach(v => {
      if (fs.existsSync(path.join(OUTPUT_DIR, v.filename))) {
        console.log(`   ${v.id}: /assets/flocken/quiz-cta/${v.filename}`);
      }
    });
  }
}

main();

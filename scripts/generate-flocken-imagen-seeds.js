/**
 * Generate 10 deterministic images on Vertex AI using Imagen + seeds.
 * Node.js-version – kör med: node scripts/generate-flocken-imagen-seeds.js
 *
 * Prereqs:
 * - npm install @google/genai
 * - gcloud auth application-default login (eller GOOGLE_APPLICATION_CREDENTIALS)
 */

const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');

// Load .env.local if present (for VERTEX_GEMINI_API_KEY)
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// ========= CONFIG =========
const PROJECT_ID = process.env.GCP_PROJECT || 'nastahem-tracking';
const LOCATION = process.env.GCP_LOCATION || 'europe-west4';
const MODEL_NAME = 'imagen-4.0-generate-001';

const PROMPT = `
Photorealistic advertising image in bright, warm daylight in a Swedish everyday park.
A dog owner (age 25–40) stands casually holding a smartphone; calm, friendly mood (pleasant and upbeat, not exaggerated).
A friendly dog (labrador or poodle) sits next to them looking up.
Modern smartphone photography look: sharp focus on dog and hand with phone, soft background bokeh, clean colors, natural lighting, no harsh shadows.
No recognizable landmarks. No text. No logos.
Phone screen must not be readable; only a vague hint of a map/app.
Composition with generous negative space for future overlay.
`.trim();

const NEGATIVE_PROMPT = `
dystopian, gloomy, rainy, night, harsh shadows, serious faces, exaggerated laughter,
posed stock photo, extra fingers, deformed hands, text, watermark, readable UI, logo, brand marks
`.trim();

const SEEDS = [101, 202, 303, 404, 505, 606, 707, 808, 909, 1001];

// ========= RUN =========
async function main() {
  const scriptDir = __dirname;
  const outDir = path.join(scriptDir, '..', 'generated_images');

  // Autentisering - Tvinga Vertex AI (Project + Service Account)
  let keyPath = null;
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Försök hitta email-signup-api-service key först (har Vertex AI User-roll)
    const emailSignupKey = path.join(scriptDir, 'email-signup-api-service-key.json');
    if (fs.existsSync(emailSignupKey)) {
      keyPath = emailSignupKey;
    } else {
      // Fallback: försök hitta alla key-filer och kolla client_email
      const keyFiles = fs.readdirSync(scriptDir)
        .filter(f => f.endsWith('-key.json') || f.endsWith('-credentials.json'))
        .map(f => path.join(scriptDir, f));

      for (const kf of keyFiles) {
        try {
          const keyData = JSON.parse(fs.readFileSync(kf, 'utf8'));
          if (keyData.client_email && keyData.client_email.includes('email-signup-api-service')) {
            keyPath = kf;
            break;
          }
        } catch (e) {
          // Ignorera ogiltiga JSON-filer
        }
      }

      // Om ingen email-signup hittades, använd nastahem-tracking-key.json som fallback
      if (!keyPath) {
        const fallbackKey = path.join(scriptDir, 'nastahem-tracking-key.json');
        if (fs.existsSync(fallbackKey)) {
          keyPath = fallbackKey;
        }
      }
    }

    if (keyPath) {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;
      console.log('🔑 Använder service account:', path.basename(keyPath));
    } else {
      console.log('⚠️  Ingen service account key hittad – använder application-default credentials');
    }
  }

  fs.mkdirSync(outDir, { recursive: true });

  console.log('\n🔧 Initierar Vertex AI...');
  console.log('   Projekt:', PROJECT_ID);
  console.log('   Region:', LOCATION);
  console.log('   Model:', MODEL_NAME);
  console.log('   Output:', outDir);
  console.log('   Watermark: ❌ Avstängt (för determinism)\n');

  const ai = new GoogleGenAI({
    vertexai: true,
    project: PROJECT_ID,
    location: LOCATION,
  });

  console.log('🔐 Auth: Vertex AI (ADC/service account)');

  const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15);

  console.log(`🎨 Genererar ${SEEDS.length} bilder med seeds...\n`);

  for (let i = 0; i < SEEDS.length; i++) {
    const seed = SEEDS[i];
    process.stdout.write(`[${i + 1}/${SEEDS.length}] Genererar med seed ${seed}... `);

    try {
      const config = {
        numberOfImages: 1,
        aspectRatio: '1:1',
        seed,
        addWatermark: false,
        negativePrompt: NEGATIVE_PROMPT,
      };

      const response = await ai.models.generateImages({
        model: MODEL_NAME,
        prompt: PROMPT,
        config,
      });

      const img = response?.generatedImages?.[0]?.image;
      if (!img?.imageBytes) {
        throw new Error('Ingen bild i svaret: ' + JSON.stringify(response?.generatedImages?.[0]));
      }

      const filename = `flocken_v1_seed${seed}_${stamp}.png`;
      const filepath = path.join(outDir, filename);
      const buffer = Buffer.from(img.imageBytes, 'base64');
      fs.writeFileSync(filepath, buffer);

      console.log('✅ Sparad:', filename);
    } catch (err) {
      const msg = err.message || String(err);
      console.log('❌ Fel:', msg.slice(0, 120));
      if (msg.includes('PERMISSION_DENIED') || msg.includes('403')) {
        console.log('   → Ge service account rollen "Vertex AI User" i GCP, eller kör: gcloud auth application-default login');
      }
      if (process.env.DEBUG) console.error(err);
    }
  }

  console.log('\n✅ Klart! Bilder i:', outDir);
}

main().catch((err) => {
  console.error('\n❌ OVÄNTAT FEL:', err);
  process.exit(1);
});

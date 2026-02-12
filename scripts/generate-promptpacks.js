const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

// ========= CONFIG =========
const PROJECT_ID = 'nastahem-tracking';
const LOCATION = 'europe-west4';
const MODEL_NAME = 'imagen-4.0-generate-001';
const OUT_DIR = path.join(__dirname, '..', 'out_imagen_promptpacks');
const ASPECT_RATIO = '1:1';

const NEGATIVE_PROMPT = `
dystert, allvarligt, regn, kväll, överdrivet skratt, poserande stock photo,
hund stirrar på telefonen, hund utan intention, tom blick,
onaturliga händer, extra fingrar, text i bild, watermark, logotyper,
läsbar skärm, amerikansk miljö
`.trim();

const BASE_STYLE = `
Fotorealistisk annonsbild i ljust, varmt dagsljus, svensk vardagsmiljö i grön park.
Positiv och avslappnad stämning – glad men lågmäld, inget poserande.
Modern smartphone-kamera-känsla: naturliga färger, mjukt ljus, lätt bokeh.
Ingen text, inga logotyper, inga kända landmärken.
Mobilskärm: bara antydan om app/karta, inget läsbart UI.
`.trim();

const PROMPT_VARIANTS = [
    {
        id: "v1_wide_air",
        prompt: `
${BASE_STYLE}
Komposition: bred bild med gott om negativt utrymme.
Hundägare (25–45) står avslappnat och kollar kort på mobilen utan att vara uppslukad.
Hunden är mentalt närvarande: lugn, trygg, subtilt uppmärksam på ägaren eller omgivningen.
Naturligt avstånd mellan hund och ägare (inte för nära).
`.trim(),
    },
    {
        id: "v2_dog_first",
        prompt: `
${BASE_STYLE}
Komposition: hunden är huvudmotivet i förgrunden, ägaren syns sekundärt (halvkropp/arm).
Ägaren håller mobilen i handen men skärmen är inte läsbar.
Hunden har liv i blicken: lugnt nyfiken, öron lätt alerta, tydlig intention (observerar omgivningen).
`.trim(),
    },
    {
        id: "v3_leash_moment",
        prompt: `
${BASE_STYLE}
Komposition: tydligt koppel i handen, promenadkänsla.
Ägaren håller mobilen i ena handen, koppel i den andra.
Hunden står/sitter bredvid och väntar tålmodigt, naturligt engagerad i situationen.
Inget “hund tittar på telefonen”.
`.trim(),
    },
    {
        id: "v4_bench_pause",
        prompt: `
${BASE_STYLE}
Komposition: kort paus i parken (bänk eller parkstig).
Ägaren är närvarande med hunden även när mobilen kollas snabbt.
Hunden är avslappnad men närvarande: tittar mot ägaren eller åt sidan, inte tom blick.
`.trim(),
    },
];

const SEEDS_PER_PROMPT = {
    "v1_wide_air": [101, 202, 303],
    "v2_dog_first": [404, 505, 606],
    "v3_leash_moment": [707, 808, 909],
    "v4_bench_pause": [1001, 1101, 1201],
};

async function main() {
    const keyPath = path.join(__dirname, 'email-signup-api-service-key.json');
    if (fs.existsSync(keyPath)) {
        process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;
    }

    const ai = new GoogleGenAI({
        vertexai: true,
        project: PROJECT_ID,
        location: LOCATION,
    });

    const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15);
    fs.mkdirSync(OUT_DIR, { recursive: true });

    console.log(`🚀 Startar batch-generering (Model: ${MODEL_NAME})...\n`);

    for (const v of PROMPT_VARIANTS) {
        const vid = v.id;
        const prompt = v.prompt;
        const seeds = SEEDS_PER_PROMPT[vid] || [1, 2, 3];

        const variantDir = path.join(OUT_DIR, `${vid}_${ASPECT_RATIO.replace(':', 'x')}`);
        fs.mkdirSync(variantDir, { recursive: true });

        console.log(`📂 Variant: ${vid}`);

        for (const seed of seeds) {
            process.stdout.write(`   - Seed ${seed}... `);
            try {
                const response = await ai.models.generateImages({
                    model: MODEL_NAME,
                    prompt: prompt,
                    config: {
                        negativePrompt: NEGATIVE_PROMPT,
                        numberOfImages: 1,
                        aspectRatio: ASPECT_RATIO,
                        seed: seed,
                        addWatermark: false,
                    },
                });

                const imgBytes = response?.generatedImages?.[0]?.image?.imageBytes;
                if (!imgBytes) throw new Error('Ingen bild genererad');

                const outPath = path.join(
                    variantDir,
                    `flocken_${vid}_seed${seed}_${ASPECT_RATIO.replace(':', 'x')}_${stamp}.png`
                );

                fs.writeFileSync(outPath, Buffer.from(imgBytes, 'base64'));
                console.log('✅');
            } catch (err) {
                console.log('❌ Fel:', err.message.slice(0, 100));
            }
        }
    }
    console.log(`\n✨ Batch klar! Bilder i: ${OUT_DIR}`);
}

main().catch(console.error);

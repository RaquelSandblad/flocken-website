# AI-genererade produktbilder — Gemini Imagen

Dokumenterar det workflow vi satt upp för att generera fotorealistiska produktbilder med riktiga app-screenshots.

---

## Vad det är

Vi genererar "hand holding phone"-mockups där telefonens skärm visar en riktig screenshot från Flocken-appen. Bakgrunden är magenta (#FF00FF) för enkel chroma-keying, som sedan tas bort med ett sharp-script. Resultatet är en transparent PNG redo för annonsproduktion.

---

## Modeller och vad de gör

| Modell | Endpoint | Image input | Bäst för |
|--------|----------|-------------|----------|
| `gemini-2.5-flash-image` | generateContent | Ja | Image-to-image compositing (vår primära modell) |
| `gemini-3.1-flash-preview` | generateContent | Ja | Testa om kvaliteten är bättre |
| `imagen-4.0-generate-001` | predict | Nej | Ren text-till-bild, ingen screenshot som input |
| `imagen-4.0-ultra-generate-001` | predict | Nej | Högre kvalitet, ingen screenshot som input |
| `imagen-4.0-fast-generate-001` | predict | Nej | Snabbare generering, ingen screenshot som input |

Kortversion: använd `gemini-2.5-flash-image` när vi vill att vår screenshot ska synas på skärmen. Imagen-modellerna kan inte ta emot bild som input.

---

## API-nyckel

Nyckeln heter `GEMINI_API_KEY` och är satt som Windows-miljövariabel (User scope, inte System). Börjar med `AIzaSy...`.

Hämta eller skapa nycklar: https://aistudio.google.com/apikey

Nyckeln är aldrig hårdkodad i kod. Alla scripts läser den via `process.env.GEMINI_API_KEY`.

---

## Workflow steg för steg

### 1. Förbered screenshot

Placera app-screenshoten i:
```
public/assets/flocken/screenshots/
```

Filformaten .jpg och .png fungerar båda. Screenshoten ska vara ren, utan notifikationer eller annan systemUI.

### 2. Skicka till Gemini (image-to-image)

Scriptet skickar screenshoten som `inlineData` i generateContent-anropet tillsammans med en textprompt. Gemini 2.5 Flash Image tar emot bilden och genererar en ny bild baserad på den.

### 3. Magenta-bakgrund för chroma key

Prompten specificerar alltid magenta (#FF00FF) som bakgrundsfärg. Det är en ren signal som sharp-scriptet kan identifiera och ta bort utan att råka ta bort något annat i bilden.

Undvik vita eller svarta bakgrunder — de finns i appen och kan bli utsuddade av misstag.

### 4. Ta bort bakgrunden

Sharp-scriptet processar den genererade bilden och ersätter alla magenta-pixlar med transparens. Output är en PNG med transparent bakgrund.

### 5. Använd i annonser

Den transparenta PNG:n kan läggas ovanpå valfri bakgrundsfärg eller -bild i annonsproduktionen.

---

## Befintliga scripts

### `scripts/generate-cta-mockups.js`

Genererar hand-mockups för quiz CTA-kort. Använder en tom vit skärm som bas (inte image-to-image), med olive-grön bakgrund (#6B7A3A). Bakgrunden byts sedan ut mot screenshot i ett separat compositing-steg.

Kör med:
```bash
GEMINI_API_KEY=din-nyckel node scripts/generate-cta-mockups.js
```

Output hamnar i `public/assets/flocken/quiz-cta/`.

---

## Prompt-tips

### Vad som fungerar

- Specificera telefonmodell konkret: "iPhone 16 Pro style: thin bezels, Dynamic Island pill-shaped cutout, titanium edges, flat screen"
- Beskriv handen som "naturlig" och "avslappnad" — undvik "perfekt" eller "showcase"
- "Slight 15-degree tilt, camera angle slightly above" ger djup utan att skärmen försvinner
- "Warm, soft natural lighting from upper left" ger konsekvent känsla

### Magenta-bakgrundstricket

Alltid specificera bakgrunden som `solid magenta (#FF00FF)`. Formulering som fungerar:

```
Solid pure magenta background (#FF00FF, rgb 255,0,255). No gradients, no shadows on the background.
```

### Screenshot på skärmen

När du skickar en riktig screenshot som image input:

```
The phone screen shows exactly the provided screenshot image. 
Display it accurately on the phone screen. Do not alter or stylize the screenshot content.
```

### Exempel på prompt som fungerat

```
Photorealistic product photography. A hand naturally holding an iPhone 16 Pro 
(thin bezels, Dynamic Island at top center, titanium edges, flat screen, tight-radius 
rounded corners). The phone screen displays exactly the provided app screenshot — 
render it accurately without alteration. Warm soft natural lighting from upper left. 
Solid pure magenta background (#FF00FF), no gradients. Hand is relaxed, slight 
15-degree tilt. Camera angle slightly above. Professional Apple-style product photography.
```

### Vad som ofta misslyckas

- "Perfekt" eller "showcase" — ger klinisk känsla, inte varm
- Vit bakgrund — kan blandas ihop med gränssnittselement
- Ingen specificering av Dynamic Island — Gemini genererar annars gamla notch-design
- "Display the app interface" utan screenshot som input — Gemini hittar på ett eget gränssnitt

---

## Filstruktur för output

```
public/assets/flocken/
├── screenshots/          # Input — riktiga app-screenshots
├── quiz-cta/             # Output från generate-cta-mockups.js
└── generated/            # Allmän optimerad bildoutput
```

---

## Koppling till övrig workflow

Genererade mockup-PNG:er behandlas som övriga bilder i repot:
- Originals i `_originals/` om de ska optimeras via image-processor
- Direkt i rätt mapp om de redan är redo att användas

Se `CLAUDE.md` under Image Processing för det generella flödet.

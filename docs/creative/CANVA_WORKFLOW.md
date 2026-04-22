---
title: "Canva Workflow — Annonsmaterial via MCP"
version: "1.0"
last_updated: "2026-04-16"
status: "active"
author: "kreativ-producent"
---

# Canva Workflow — Annonsmaterial

Den här guiden beskriver hur kreativ-producent producerar annonsmaterial i Canva via MCP-integration. Syftet: gå från CB-copy till exporterad annonsbild utan att gissa och utan att röra till Canva.

---

## När Canva används vs när den inte används

**Canva används för:**
- Text-overlays på befintliga bilder (clay, hand-mockups, foto)
- App Store-screenshots med frames/ramar
- SoMe-posters (organiskt innehåll)
- Enklare sammansatta layouts (t.ex. carousel-kort)
- Annonser där Meta-formaten (1:1, 4:5, 9:16) ska exporteras rent

**Canva används INTE för:**
- Själva basbilderna (de kommer från Gemini/clay-processen, se `IMAGE_GENERATION.md`)
- Landningssidor (byggs i React, inte exporteras från Canva)
- Video (görs i CapCut/Premiere + text-overlay kan tillsättas i Canva om det är enkelt nog)

---

## Förberedelse — läs ALLTID detta innan du öppnar Canva

1. **CB-brief** (`flocken_ads/creative_bases/cb<nnn>/brief.md`) — vilken vinkel, vilken persona, vilket format
2. **CB-copy** (`flocken_ads/creative_bases/cb<nnn>/copy.md`) — vilken hook/headline som ska användas
3. **DESIGN_REFERENCES.md** — Flockens designprinciper
4. **Brand kit-ID** i Canva:
   - Flocken: `kAG6b9js0YE`
   - Nästa Hem: `kAGTNBtqQSE`

**Regel:** Skapa aldrig ett Canva-material utan att först ha öppnat brief + copy. Annonsen ska matcha en specifik vinkel i CB.

---

## Standard-workflow: Static ad med text-overlay

### Steg 1: Hitta rätt basbild

Basbilder finns i:
- `C:\dev\flocken-website\public\assets\flocken\_originals\` (för icke-optimerade)
- `C:\dev\flocken-website\public\assets\flocken\generated\` (optimerade)
- `C:\dev\flocken-website\flocken_ads\creative_bases\cb<nnn>\assets\` (CB-specifika)

Konkreta exempel från CB003 (Passa):
- `hero-clay-promenad-1x1.jpg` — hundägare på promenad (clay-stil)
- `arg3-clay-hundrastgard.jpg` — hundrastgård-scen
- `closing-clay-trygg-soffa.jpg` — trygg hemma-scen
- `arg1-hand-yasmin-profil.jpg` — hand som håller mobil med profil
- `arg2-hand-karta-hundvakter.jpg` — hand med karta

### Steg 2: Upload till Canva

```
upload-asset-from-url
  url: <hosted-url-of-image>
  name: flocken_cb003_hero-clay-promenad
```

**OBS:** Canva behöver en URL, inte lokal filväg. Lös det via:
- Hosta tillfälligt på Vercel/flocken.info
- Eller använd `public/assets/flocken/` som redan är publikt via flocken.info

Så: om bilden finns på `public/assets/flocken/_originals/hero-clay-promenad-1x1.jpg` laddas den från `https://flocken.info/assets/flocken/_originals/hero-clay-promenad-1x1.jpg`.

### Steg 3: Skapa ny design med rätt format

```
generate-design-structured
  design_type: custom
  width: 1080
  height: 1080   # eller 1350 för 4:5, 1920 för 9:16
  title: flocken_ad_cb003_a_v01_1x1
  brand_kit: kAG6b9js0YE
```

### Steg 4: Öppna redigering

```
start-editing-transaction
  design_id: <från steg 3>
```

### Steg 5: Lägg in bild + text-overlay

```
perform-editing-operations
  - Lägg in basbild som fullbleed bakgrund
  - Lägg in hook-text i övre tredjedel (safe zone)
  - Lägg in Flocken-logo nedtill (liten, ~48px)
  - Lägg in CTA-text om relevant (t.ex. "Ladda ner gratis")
```

**Text-overlay-principer:**
- Hook-text max 2 rader
- Text i övre tredjedel (safe zone mot profilnamn + CTA-knappen i Meta)
- Teckenstorlek stor (läsbar på mobil utan zoom) — minst 72pt för headlines på 1080-bredd
- Kontrast: skugga eller färgplatta bakom text om bilden är brokig
- Flocken-logo nedtill, liten (varumärkesmarkör, ej huvudfokus)
- Max 20% av bildytan är text (Meta föredrar mindre text-andel)

### Steg 6: Spara och exportera

```
commit-editing-transaction
  design_id: <id>

export-design
  design_id: <id>
  format: PNG    # eller JPG för filstorlek
```

### Steg 7: Flytta till rätt mapp i Canva

```
move-item-to-folder
  item_id: <design_id>
  folder_id: <folder för CB003>
```

### Steg 8: Ladda ner lokalt för Meta-upload

Exportens URL är tillfällig. Ladda ner till:
```
C:\dev\flocken-website\flocken_ads\creative_bases\cb003\assets\exports\
  flocken_ad_cb003_a_v01_1x1.png
```

---

## Namngivning — obligatoriskt

### Canva-designs (internt)
```
flocken_ad_cb<nnn>_<gren>_v<nn>_<format>
```

Exempel:
- `flocken_ad_cb003_a_v01_1x1` (Trygghet, variant 1, Feed 1:1)
- `flocken_ad_cb003_b_v01_4x5` (Skuld, variant 1, Feed 4:5)
- `flocken_ad_cb003_c_v01_9x16` (Nätverk, variant 1, Reels)

### Exporterade filer (till disk)
```
flocken_ad_cb<nnn>_<gren>_v<nn>_<format>.png
```

Samma som Canva-namn men med filändelse.

### Koppling till Meta-ads naming
Canva-namnet mappar till Meta-ad-namnet:
```
Canva: flocken_ad_cb003_a_v01_1x1
Meta:  ad_h01a_cb003_v01_hk_passa_src_ai_cid001   (V1)
Meta:  ad_cb003_a_v01_cid001                       (V2 — om Torbjörn godkänner)
```

---

## Mappstruktur i Canva

Håll Canva rent. Struktur:

```
Flocken Ads/
├── CB001 — Allmänt värde/
├── CB002 — Para/
├── CB003 — Passa/
│   ├── Vinkel a (Trygghet)/
│   ├── Vinkel b (Skuld)/
│   └── Vinkel c (Nätverk)/
├── CB004 — Rasta/
└── CB005 — Besöka/

Flocken SoMe/          (organiskt, befintligt)
Flocken Screens/       (App Store, befintligt)

Nästa Hem Ads/
Nästa Hem SoMe/

Personligt/            (CV, LinkedIn — håll separerat)
```

Skapa folders via:
```
create-folder
  name: "Flocken Ads / CB003 — Passa"
```

---

## Meta-dimensioner (safe zones)

### Feed 1:1 (1080×1080)
- Ingen topbar
- Primary text visas ovanför bilden
- CTA-knapp under

### Feed 4:5 (1080×1350)
- Samma som 1:1 men högre
- Mer plats för text-overlay i övre tredjedel

### Reels/Stories 9:16 (1080×1920)
- **Safe zone: 15% topp + 15% botten** (UI-element täcker dessa)
- Hook-text mellan 15-40% från toppen
- CTA-knapp täcks av Meta's egen CTA — gör INGEN egen CTA-knapp längst ned

---

## Checklista innan du sparar en Canva-annons

- [ ] Basbilden är i rätt proportion för format
- [ ] Hook-texten matchar en specifik hook i CB-copy.md
- [ ] Text i safe zone (övre tredjedel för feed, 15-40% för Reels)
- [ ] Max 2 rader text
- [ ] Kontrast mellan text och bild
- [ ] Flocken-logo nedtill (finns i brand kit)
- [ ] Max 20% text-andel
- [ ] Namn följer `flocken_ad_cb<nnn>_<gren>_v<nn>_<format>`
- [ ] Sparad i rätt folder
- [ ] Exporterad till lokal `exports/`-mapp

---

## Vanliga fel och hur man undviker dem

### Fel: Text är för liten
På desktop i Canva ser 48pt stort ut. På mobilen är det pytteligt. **Regel:** headline ska vara minst 72pt på 1080-bred canvas.

### Fel: Text täcks av Meta-UI
9:16 utan safe zone → hook försvinner bakom profilnamnet. **Regel:** text minst 300px från topp på 9:16.

### Fel: För mycket text
Meta klipper primary text efter ~125 tecken. Text-overlay på bild ska vara HOOK, inte hela budskapet. **Regel:** max 8 ord på bilden.

### Fel: Fel brand kit
Använder defaultfärger istället för Flockens. **Regel:** specificera alltid `brand_kit: kAG6b9js0YE` vid design-skapande.

### Fel: Skapa från scratch istället för använda template
Slösar tid och får inkonsistent resultat. **Regel:** ha en "template" per format som du kopierar och fyller i.

---

## Workflow-exempel: CB003 Passa — Vinkel a (Trygghet), Feed 1:1

**Input:**
- CB003 brief: Trygghetsvinkel, persona Anna
- CB003 copy: Headline h01 "Hitta hundvakt nära dig", primary p01 "Lämna din hund hos någon du litar på"
- Basbild: `hero-clay-promenad-1x1.jpg`

**Steg:**
1. Upload `hero-clay-promenad-1x1.jpg` till Canva
2. Skapa 1080×1080 design, Flocken brand kit
3. Lägg bild som fullbleed
4. Lägg text-overlay i övre tredjedel: **"Hundvakt du litar på"** (h03, 21 tecken — kortare än h01)
5. Lägg Flocken-logo nedtill (liten)
6. Spara som `flocken_ad_cb003_a_v01_1x1`
7. Flytta till folder `Flocken Ads / CB003 — Passa / Vinkel a (Trygghet)`
8. Exportera som PNG
9. Ladda ner till `flocken_ads/creative_bases/cb003/assets/exports/`

**Output:** En 1080×1080 PNG redo för Meta Ads upload.

---

## Automation — vad agenten får göra autonomt

**FÅR:**
- Skapa nya designs enligt spec
- Upload assets från flocken.info-URLs
- Organisera i folders
- Exportera till lokal disk
- Döpa om designs för konsekvens

**FÅR INTE utan Torbjörns godkännande:**
- Radera designs (även duplicates)
- Ändra brand kit
- Upload assets från externa URLs
- Skapa nytt brand kit
- Publicera direkt till Meta (går via export + Ads Manager)

---

## Referenser

- `flocken_ads/creative_bases/cb<nnn>/brief.md` — CB-briefer
- `flocken_ads/creative_bases/cb<nnn>/copy.md` — CB-copy
- `docs/creative/DESIGN_REFERENCES.md` — Flockens designprinciper
- `docs/creative/IMAGE_GENERATION.md` — Basbildsgenerering (Gemini)
- `docs/creative/PRE_DEPLOY_CHECKLIST.md` — Kvalitetskontroll
- `C:\dev\spitakolus\meta-ads\NAMING_CONVENTIONS.md` — Meta naming spec (V1 LOCKED)
- `C:\dev\spitakolus\meta-ads\NAMING_CONVENTIONS_V2_PROPOSAL.md` — Förslag till förenkling

# CB004 Hundar — Image Spec

**Skapad:** 2026-04-21 av kreativ-producent
**Uppdaterad:** 2026-04-22 (v2) — efter Torbjörns beslutsgranskning (se copy.md "Ändringar v2")
**Mottagare:** Torbjörn (bildproduktion) + PL (filflyttar + matchning)
**Syfte:** Konkret spec för alla bilder som behövs för CB004 lansering — landing page + Meta Ads creatives.

---

## Ändringar v2

1. **Kennel-bilder borttagna** (2 st × 2 format + 1 LP-arg2 = totalt 5 bilder färre i produktionskön).
2. **Vinkel C byter estetik** — från "trygg hund + app-notis" till "hand + mobil med FB-kommentarskaos". Bild redan levererad: `hand_fb_groups.jpg`.
3. **Hero-bild LEVERERAD** — `/public/assets/flocken/v-hundar/hero-clay-trehundar-21x9.jpg` (2400×1029, 21:9). Slår briefens hard gate (1.91:1 min) med god marginal.
4. **Försvunnen-bild LEVERERAD** — `Generated Image April 21, 2026 - 11_36PM.jpg` (928×1152, ca 4:5 porträtt). Används som LP arg 3-bild, inte som egen ads-vinkel.
5. **LP arg 2 ändrad motiv** — från "kennelprofil" till "kartvy över hundar nära dig" (eftersom arg 2 bytt copy till närhet/karta).

---

## Konventioner

**Filnamn-mönster:** `flocken_[type]_[description]_[ratio]_[YYYYMMDD].[ext]`

- `type`: `hero`, `arg1`/`arg2`/`arg3`, `closing`, `ad`
- `description`: snake_case, engelska eller svenska utan åäö, max 4 ord
- `ratio`: `191x1` (1.91:1), `21x9`, `4x5`, `9x16`, `1x1`
- `ext`: `jpg` för foto/hand-mockup, `png` om transparens behövs

**Mappar:**
- Landing page-bilder → `/public/assets/flocken/v-hundar/`
- Ad-creatives → `/flocken_ads/creative_bases/cb004/assets/final/`

**Generell kvalitet:**
- Hero + closing: retina-kvalitet (2× min)
- Ad-creatives: exakt target-dimension, inte uppskalade
- Inga avklippta huvuden på människor eller hundar
- Vardagsmiljö — ingen studio, ingen stiliserad estetik om det inte är clay-illustration

---

## Del 1 — Landing page `/v/hundar` (5 bilder)

### 1.1 Hero — LEVERERAD

**Filväg (final):** `/public/assets/flocken/v-hundar/hero-clay-trehundar-21x9.jpg`
**Dimension faktisk:** 2400×1029 px (21:9 = 2.33:1) — överträffar briefens hard gate (1.91:1 min).
**Format:** jpg, clay-illustration
**Status:** LEVERERAD 2026-04-22. Används direkt i HUNDAR_CONFIG.

**Motiv (enligt Torbjörn):** Tre hundar (pudel/cocker/maltese) på gräs. Staket + förortsbakgrund. Clay-stil, jordnära ljus.

**Koppling till copy:** Stödjer hero-titel "Hunden behöver mer än dig" + subtitle "Du är hundens värld. Men den mår bättre med fler i den." Tre hundar visualiserar "fler" utan att peka ut en specifik vinkel.

### 1.2 Argument 1 — Lekkompisar i rätt storlek (PRODUKTION)

**Filnamn:** `flocken_arg1_lekkompis_filter_4x5_20260422.jpg`
**Dimension:** 1080×1350 px (4:5) rekommenderas. 1:1 funkar också.
**Format:** jpg
**Status:** PRODUKTION (väntar)

**Motiv-intention:**
Hand som håller en telefon. På skärmen: Flockens filter-vy för Hundar-funktionen — storlek-slider, ras-lista, temperament-taggar. Riktig app-skärmdump, inte mockup-placeholder. Clay-stil hand om möjligt för konsistens med övriga bilder.

**Komposition:** Telefonen centrerad, handen mot neutral bakgrund (flocken-cream eller neutral grå). Skärmen läslig vid mobile-preview-storlek.

**Koppling till copy:** Stödjer argument 1 body om "välj bort felmatchningarna innan ni träffas". Filter-vyn är själva USP-beviset.

### 1.3 Argument 2 — Hundar nära dig / kartvy (PRODUKTION — nytt motiv v2)

**Filnamn:** `flocken_arg2_karta_hundar_4x5_20260422.jpg`
**Dimension:** 1080×1350 px (4:5)
**Format:** jpg
**Status:** PRODUKTION (väntar). Byt motiv från v1 "kennelprofil".

**Motiv-intention:**
Hand som håller en telefon med Flockens kartvy för Hundar-funktionen. Kartmarkörer med hundprofilbilder syns över en stadskarta. "Nära dig"-känsla, inte hela Sverige. Clay-stil hand.

**Komposition:** Samma hand/telefon-estetik som arg1 för visuell konsistens. Neutral bakgrund (flocken-sand eller white).

**Koppling till copy:** Stödjer nytt argument 2 body: "du ser vilka hundar som finns nära dig, på kartan. Profil, bild, storlek, ras."

### 1.4 Argument 3 — Försvunnen hund / närområde (LEVERERAD — bild finns)

**Filnamn (target, efter flytt):** `flocken_arg3_forsvunnen_hand_4x5.jpg`
**Nuvarande plats:** `/public/assets/flocken/v-hundar-mockup-selection/Generated Image April 21, 2026 - 11_36PM.jpg`
**Dimension faktisk:** 928×1152 px (≈ 4:5 porträtt)
**Format:** jpg, clay-illustration
**Status:** LEVERERAD 2026-04-22. Behöver flyttas + döpas om (se flagg till PL).

**Motiv (enligt Torbjörn):** Clay-stil hand som håller mobil. Skärmen visar app-karta, varningstriangel, nattstämning. Lösningsorienterad — larmet i appen — inte skrämselbild.

**Koppling till copy:** Stödjer arg 3: "Om hunden springer iväg får hundägare i närheten en push-notis direkt." Visar lösningen (larm-UI i appen), inte problemet (ensam hund i skog).

**Don't-kryss:** Ingen bortsprungen hund. Ingen stressad ägare. Research §6 §don't bevarad.

### 1.5 Closing — Trygg hund (PRODUKTION)

**Filnamn:** `flocken_closing_hund_nara_1x1_20260422.jpg`
**Dimension:** 1080×1080 px (1:1)
**Format:** jpg (clay-illustration)
**Status:** PRODUKTION (väntar)

**Motiv-intention:**
Clay-illustration i samma stil som /v/passa closing: en hund som ligger tryggt bredvid ägarens fötter eller på en soffa/matta. Hemmiljö — soffa, gröna växter, varmt ljus. Lugn och trygg närhet.

**Komposition:** Hunden centrerad eller lätt förskjuten, ägarens fötter/ben delvis synliga för att antyda närvaro utan att dominera.

---

## Del 2 — Meta Ads creatives (4 bilder — v2)

**Struktur v2:** 2 vinklar × 2 format (4:5 + 9:16 static) = 4 bilder. (Ner från 6 i v1 pga vinkel B pausad.)

**Hard gates per bild (från META_ADS_PRODUCTION_CHECKLIST):**
- Bilden fyller hela canvaset (edge-to-edge, ingen stapling av text-block + bild-block)
- Motivet dominerar och är synligt på mobile feed-preview-storlek
- Inga avklippta huvuden (människor eller djur)
- Text-overlay ovanpå bilden med subtil plate vid behov — INTE separat textzon
- Text ≤ 20% av bildytan

### 2.1 Vinkel A — Lekkompisen — 4:5 (PRODUKTION)

**Filnamn:** `flocken_ad_cb004_a_v01_4x5_20260422.jpg`
**Dimension:** 1080×1350 px
**Format:** jpg
**Status:** PRODUKTION (väntar bild från Torbjörn)

**Motiv-intention:**
Två medelstora hundar som leker i närbild. Hundarnas ansikten och lekrörelse tydlig. Dagsljus, gräs, avslappnad energi. Clay-stil rekommenderas för visuell konsistens med hero-bilden.

**Text-overlay:** Utgå från headline-variant "En lekkompis som matchar" eller "Rätt storlek. Rätt lek." Placera övre tredjedelen med subtil plate.

### 2.2 Vinkel A — Lekkompisen — 9:16 (PRODUKTION)

**Filnamn:** `flocken_ad_cb004_a_v01_9x16_20260422.jpg`
**Dimension:** 1080×1920 px
**Format:** jpg
**Status:** PRODUKTION. Reformatera från 4:5 via Gemini 2.5 Flash Image.

### 2.3 Vinkel C — Grupp-alternativet — 4:5 (LEVERERAD bas, text-overlay kvar att göra)

**Filnamn (target, efter flytt):** `flocken_ad_cb004_c_v01_4x5_20260422.jpg`
**Nuvarande bas:** `/public/assets/flocken/v-hundar-mockup-selection/hand_fb_groups.jpg`
**Status:** BAS LEVERERAD. Text-overlay + slutlig export via Canva återstår.

**Motiv (enligt Torbjörn):**
Clay-stil hand som håller mobil fylld med kaotiska FB-kommentarer. "Söker lekkompis AKUT!!!"-typ av inlägg, emojis, notiser 99+. Bilden landar pain-point direkt utan att copy behöver säga "FB-grupper är röriga".

**Text-overlay (text-overlay ska INTE vara ordagrant headline):**
- Rekommendation: kort overlay som förstärker bildens känsla, t.ex. "Lekkompis. Inte grupptråd." eller "47 kommentarer senare…"
- Headline (`"Sluta söka i grupptrådar"`) levereras separat som Meta-headline-fält, inte på bilden
- Subtil plate med flocken-brown eller dark-overlay för läslighet på mobil

**Koppling till copy:** Stödjer vinkel C, persona Erik/Anna. Implicit framing, inte attack. Research-don'ts §2 bevarad.

### 2.4 Vinkel C — Grupp-alternativet — 9:16 (PRODUKTION)

**Filnamn:** `flocken_ad_cb004_c_v01_9x16_20260422.jpg`
**Dimension:** 1080×1920 px
**Format:** jpg
**Status:** PRODUKTION. Reformatera `hand_fb_groups.jpg` till 9:16 via Gemini 2.5 Flash Image. Hand + mobil placerad i mittzon (safe zone: 15% topp + 15% botten för Meta UI).

---

## Totalt — bildbehov v2

| # | Syfte | Filnamn (target) | Dimension | Format | Status |
|---|---|---|---|---|---|
| 1 | LP hero | `hero-clay-trehundar-21x9.jpg` | 2400×1029 | jpg | **LEVERERAD** |
| 2 | LP arg1 (filter) | `flocken_arg1_lekkompis_filter_4x5_20260422.jpg` | 1080×1350 | jpg | PRODUKTION |
| 3 | LP arg2 (kartvy) | `flocken_arg2_karta_hundar_4x5_20260422.jpg` | 1080×1350 | jpg | PRODUKTION |
| 4 | LP arg3 (försvunnen) | `flocken_arg3_forsvunnen_hand_4x5.jpg` | 928×1152 | jpg | **LEVERERAD (flytt krävs)** |
| 5 | LP closing | `flocken_closing_hund_nara_1x1_20260422.jpg` | 1080×1080 | jpg | PRODUKTION |
| 6 | Ad A 4:5 | `flocken_ad_cb004_a_v01_4x5_20260422.jpg` | 1080×1350 | jpg | PRODUKTION |
| 7 | Ad A 9:16 | `flocken_ad_cb004_a_v01_9x16_20260422.jpg` | 1080×1920 | jpg | PRODUKTION |
| 8 | Ad C 4:5 | `flocken_ad_cb004_c_v01_4x5_20260422.jpg` | 1080×1350 | jpg | **BAS LEVERERAD** (text-overlay kvar) |
| 9 | Ad C 9:16 | `flocken_ad_cb004_c_v01_9x16_20260422.jpg` | 1080×1920 | jpg | PRODUKTION (reformatera) |

**Totalt:** 9 bilder (ner från 11 i v1). 2 levererade, 1 med bas-bild klar, 6 i produktionskö.

---

## Ordning att producera i (prioritetsordning v2)

1. **Flytta + döp om försvunnen-bild** (arg 3) — snabb PL-action, blockar LP-launch
2. **Ad-bilder 4:5** (vinkel A + slutlig vinkel C med text-overlay) — blockar Meta-ads launch
3. **LP arg1 + arg2 + closing** (3 st) — behövs för LP-färdigställande
4. **Ad-bilder 9:16** (2 st via Gemini-reformatering) — snabbast-steget

---

## Vad som INTE ska produceras (v2)

- ~~Kennel-bilder (mamma med hundar)~~ — vinkel B pausad, inte längre relevant
- ~~"Trygg hund + app-notis" för vinkel C-ads~~ — C byter till FB-kaos-estetik
- Inga bilder av enskild "bortsprungen hund i skog" — skrämsel-trigger (research §6 §1)
- Inga stor hund + liten hund-par i vinkel A — research §3 citat #5 (risk-trigger)
- Ingen studio-stiliserad estetik utom clay-illustrationer där det är explicit ovan
- Ingen explicit Facebook-branding på vinkel C-bilder — implicit igenkänning (generiska kommentars-UI), inte Meta-plattformsattack

---

## Flaggor till PL

1. **Filflytt + namngivning behövs för 2 bilder:**
   - `Generated Image April 21, 2026 - 11_36PM.jpg` → `/public/assets/flocken/v-hundar/flocken_arg3_forsvunnen_hand_4x5.jpg`
   - `hand_fb_groups.jpg` → `/flocken_ads/creative_bases/cb004/assets/final/flocken_ad_cb004_c_v01_4x5_base_20260422.jpg` (bas innan text-overlay)
   Föreslår att utvecklingsrådgivaren (eller PL själv) kör filflytten innan LP-implementation, annars 404 på arg 3.

2. **Arg 3-bildens dimension är 928×1152 (4:5-nära).** VLandingPage-komponenten renderar `imageStyle: 'photo'` med rounded-2xl + shadow-card. Om det ser fel ut vid rendering (t.ex. om komponenten förväntar sig 1:1) — flagga, då kan vi be om en 1:1-crop eller Gemini-reformatering.

3. **Text-overlay på vinkel C-bilden ska göras i Canva, inte i Gemini.** Rekommenderar att kreativ-producent öppnar `hand_fb_groups.jpg`, importerar i Canva med Flocken brand kit (kAG6b9js0YE), lägger subtil overlay ("Lekkompis. Inte grupptråd." eller liknande), exporterar 4:5 och 9:16.

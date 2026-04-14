# Creative Capabilities — Growth & Conversion

Senast uppdaterad: 2026-04-14

---

## Bildgenereringsverktyg

### Gemini AI-bildgenerering (hand-med-telefon mockups)

Vi kan generera fotorealistiska produktbilder automatiskt utan fotograf.

**Vad det gor:**
- Skapar bilder av en hand som haller en iPhone med en riktig app-screenshot pa skarmen
- Resultatet ar produktfotografi-kvalitet med mjukt ljus och olive-gron bakgrund (#6B7A3A)
- Output: transparent PNG (magenta chroma key tas bort i postprocessing)

**Teknisk pipeline:**
1. Riktig screenshot fran appen (manuellt eller via simulering)
2. Gemini Imagen 4.0 genererar hand-med-tom-telefon mot olive-bakgrund
3. Magenta chroma key -> transparent bakgrund
4. Screenshot compositas in pa telefonskarm

**Script:** `flocken-website/scripts/generate-cta-mockups.js`
**Output-katalog:** `public/assets/flocken/quiz-cta/`
**Krav:** `GEMINI_API_KEY` som miljovariabel

**Varianter som redan genererats:**
- `hand-final-karta.png` — Karta-vy (variant A)
- `hand-final-match.png` — Hundprofiler/match (variant B)
- `hand-final-hundvakt.png` — Hundvaktsprofil (variant C)

---

## Hur du bestaller nya varianter

**Growth Manager bestammer VAD som ska testas. Kreativa producenten bestammer HUR det ser ut.**

1. Specificera syftet: vilken del av funneln, vilken kanal, vilken hypotes
2. Ange antal varianter (rekommendation: 3-5 for att ha statistisk kraft)
3. Bestall via Kreativa producenten: "Generera [antal] varianter av hand-med-telefon for [kanal/placering]. Screenshot ska visa [specifik vy i appen]. Testa dessa vinklar: [lista]."
4. Kreativa producenten ager promptarna och kvalitetssakrar output
5. Ledtid: minuter, inte dagar

**Exempel pa bestallning:**
> "Generera 3 varianter for Meta Ads feed-placering. Screenshot: Para-funktionens swipe-vy. Testa: (1) kvallsljus, (2) dagsljus, (3) hand fran vanster sida. Format: 1080x1080."

---

## Pagaende A/B-tester

### 1. Quiz App CTA (quiz_app_cta_v1)

**Status:** Running sedan 2026-03-18
**Placering:** Quiz-resultatsidan (quiz.flocken.info)
**Komponent:** `components/quiz/AppCtaModule.tsx`

**Varianter (lika fordelning, 33% vardera efter CRO-uppdatering):**

| Variant | Vinkel | Headline | Bild |
|---------|--------|----------|------|
| A | Karta/Discovery | "Se hundar pa kartan i din stad" | hand-final-karta.png |
| B | Match/Profiler | "Hitta hundar som matchar din" | hand-final-match.png |
| C | Hundvakt | "Hitta hundvakt som passar dig" | hand-final-hundvakt.png |

**Matning:**
- Events via GTM dataLayer: `quiz_app_cta_view`, `quiz_app_cta_click`
- Parametrar: `experiment_id`, `variant`, `quiz_slug`
- Tilldelning: client-side via localStorage (inte middleware)
- Analysera i BigQuery eller via MCP-server: `mcp-servers/ab-testing-stats/`

**Beslutskriterier (7-dagars kill rule):**
- Primar KPI: CTR (klick/visning per variant)
- Sekundar: faktisk nedladdning (kraver attribution via Store)
- Om ingen tydlig skillnad efter 7 dagar: testet var for litet, skala upp traffik eller gora storre skillnad mellan varianter

### 2. Valkommen Hero (valkommen_hero_v1)

**Status:** Running sedan 2025-02-13
**Placering:** /valkommen
**Komponent:** Middleware-baserad, cookie-tilldelning

**Varianter:**
- Control (50%): "Ett enklare liv som hundagare" — standard layout
- Variant C (50%): "Slipp roriga Facebook-grupper for hundagare" — problem/solution split

**Experiment-konfiguration:** `lib/ab-testing/experiments.ts`

---

## CRO-andringar (deployade 2026-04)

### Quiz CTA-kort — visuell uppgradering
- **Fore:** Platta skarmbilder, generiska CTA-knappar
- **Efter:** Mork olive-bakgrund + hand-med-telefon-mockup + riktig screenshot + transparent bakgrund
- Professionellt produktfotografi-intryck okar upplevt varde och klicklust

### Duplicate CTA efter svarsgenomgang
- Ny CTA-placering: ytterligare CTA-kort visas efter att anvandaren scrollat genom sina svar
- Fangar engagerade scrollers som passerar forsta CTA-kortet

### Plattformsspecifika direktlankar
- iOS -> App Store-lank direkt
- Android -> Google Play-lank direkt
- Desktop -> /download (fallback med bada alternativ)
- Eliminerar ett extra steg i funneln

---

## Nasta steg (Growth Managers backlog)

- [ ] Anvand bildgenerering for Meta Ads-kreativt (hand-med-telefon i feed-format)
- [ ] Testa video-mockups (kort animation av swipe i appen)
- [ ] Generera App Store-screenshots med hand-mockup-stil
- [ ] Bygga bildvariant-pipeline for snabb iteration pa annonsmaterial

# EXP002: Quiz-resultat CTA — clay-stil redesign

**Status:** RUNNING (deploy 2026-04-16)
**Funnelposition:** Mid-funnel (quiz-engagemang → app-download)
**Ägare:** Growth & Conversion Manager + Kreativ Producent
**Datum:** 2026-04-16
**Relaterade:** EXP001 (hookspecifika landningssidor), CB003 Passa-launch

---

## Hypotes

```
Since we have observed that: CTA-kortet på quiz-resultatsidan (rendereras 2x, en efter
  badge och en efter review-listan) använde fotorealistiska händer på transparent bakgrund
  mot ett mörkt olive-kort — helt av från Flockens etablerade clay-stil som körs på
  landningssidorna v/passa och i Meta-annonser (CB003).
We want to: byta till clay-stil-bilder från v/passa + cream-kort så quiz-CTA talar samma
  visuella språk som landningssidorna, samt omformulera copy till tre rena passa-vinklar
  (upptäckt/förtroende/enkelhet) eftersom passa är den kommersiellt starkaste use-casen.
For: besökare som tagit minst ett quiz och når resultatsidan.
Which should lead to: högre CTR till App Store/Google Play från quiz-resultatsidan tack
  vare (a) starkare visuell brand-koherens mellan quiz och landningssidor och (b) tydligare
  passa-narrativ som knyter dogintresse till en konkret transaktion.
Measured by: cta_click / quiz_app_cta_view per variant (primärt) och Meta Lead-events
  via trackAppInstall på iOS/Android (sekundärt)
```

### Guardrails
- Sidladdningstid får inte öka — clay-bilderna är JPEG ~80 KB/st (jämfört med tidigare PNG ~1 MB). LCP bör förbättras.
- `quiz_app_cta_view` dedupliceras module-scope per `${quizSlug}|${position}` så dubbelrenderingar i samma besök inte dubbelräknas.
- Social proof visas endast på `after_review`-positionen — fångar användare som scrollat igenom review-listan.

---

## Bakgrund

### Vad ändrades

Innan (2026-04-14 → 2026-04-15):
- Mörkt olive-kort med eyebrow-label "UPPTÄCK FLOCKEN-APPEN"
- Fotorealistisk hand på transparent bakgrund (`hand-karta-v2-trimmed.png` m.fl. i `public/assets/flocken/quiz-cta/`)
- Copy fokuserade på tre olika features (karta/match/hundvakt)

Efter (2026-04-16):
- Cream-kort (`flocken-cream` #F5F1E8) med eyebrow "FLOCKEN-APPEN" i olive
- Clay-stil-händer från v/passa (samma bilder som landningssidorna använder)
- Copy fokuserar på tre vinklar av passa-funktionen:
  - **A (karta):** "Hitta hundvakter på kartan" — upptäckt/mängd
  - **B (profil):** "Välj en hundvakt du känner dig trygg med" — förtroende
  - **C (sök):** "Hitta rätt hundvakt på 30 sekunder" — enkelhet/snabbhet
- Olive CTA-knapp på cream → stark kontrast mot det klickbara
- Prestandavinst: JPEG ~80 KB ersätter PNG upp till 1,5 MB

### Varför clay-stil

Clay-stilen är Flockens etablerade designspråk (se `docs/creative/DESIGN_REFERENCES.md`). Den används på:
- `/v/passa` — alla hero/argument/closing-bilder
- CB003 Meta-annonser (Passa-launch)
- Organiska posts från 2026-04-15 och framåt

När quiz-CTA använde fotorealistiska händer bröts brand-koherens och det kändes som en stockbild klippt in i en quiz. Clay-bilden blir istället en naturlig förlängning av landningssidan i ett mindre kort-format.

---

## Testdesign

### Varianter
Slumpas vid första quiz-resultat-visningen och låses via `localStorage['flocken_ab_quiz_app_cta_v1']` (ger sessionoberoende persistens för återkommande besökare).

| Variant | Vinkel | Bild | Rubrik | Body |
|---------|--------|------|--------|------|
| A | Upptäckt | `v-passa/arg2-hand-karta-hundvakter.jpg` | Hitta hundvakter på kartan | Zooma in där du bor och se vem som är ledig — på några sekunder. |
| B | Förtroende | `v-passa/arg1-hand-yasmin-profil.jpg` | Välj en hundvakt du känner dig trygg med | Profiler med bild, beskrivning och bokning — så du vet vem du möter. |
| C | Enkelhet | `v-passa/arg2-hand-sok-hundvakt.jpg` | Hitta rätt hundvakt på 30 sekunder | Välj tjänst och storlek — så ser du alla som passar just din hund. |

### Positioner på resultatsidan
CTA:n renderas 2x:
1. **`after_badge`** — direkt efter score/badge (hög-intent, snabbt beslut).
2. **`after_review`** — efter review-listan (läst klart, mer engagerade). Visar extra social proof: "★ 2 000+ hundägare använder Flocken-appen".

### Plattformsrouting
Klick skickas till:
- iOS: `https://apps.apple.com/app/flocken/id6755424578` (knapp: "Ladda ner på App Store")
- Android: `https://play.google.com/store/apps/details?id=com.bastavan.app` (knapp: "Ladda ner på Google Play")
- Desktop/okänd: `/download` (knapp: "Ladda ner Flocken-appen" + subtext "Gratis — iOS och Android")

---

## Tracking

### Events

**View** — `quiz_app_cta_view` (GA4 via gtag + GTM dataLayer):
```js
{
  experiment_id: 'quiz_app_cta_v1',
  variant_id: 'A' | 'B' | 'C',
  quiz_slug: 'hundens_kroppssprak' | ...,
  cta_position: 'after_badge' | 'after_review',
}
```

**Click** — `cta_click` (GA4 via gtag + GTM dataLayer):
```js
{
  experiment_id: 'quiz_app_cta_v1',
  variant_id: 'A' | 'B' | 'C',
  cta_name: 'quiz_result_download',
  cta_destination: <App Store URL | Play Store URL | /download>,
  cta_platform: 'ios' | 'android' | 'desktop',
  cta_position: 'after_badge' | 'after_review',
  quiz_slug: ...,
  source: 'quiz_result',
}
```

**Meta** — `trackAppInstall(platform, "quiz_result_<slug>_<position>")` skickar standard Lead-event (+CAPI-dedupe) när `platform === 'ios' || 'android'`. Desktop skickar inget Meta-event (användaren hamnar på `/download` istället för app store).

### Dedupe
`quiz_app_cta_view` dedupliceras via module-scope `Set` med nyckel `${quizSlug}|${position}`. Det betyder:
- Om samma användare besöker två olika quiz-resultatsidor → 2 events per position (korrekt).
- Om komponenten remountar (route change utan full reload) på samma position → endast 1 event (korrekt).

---

## Arkitektur

### Filer
- `components/quiz/AppCtaModule.tsx` — huvudkomponenten (A/B/C-logik, tracking, rendering)
- `components/quiz/ResultCard.tsx` — renderar AppCtaModule 2x med olika `position`-prop
- `public/assets/flocken/v-passa/arg*.jpg` — clay-bilder (delas med landningssidan)

### Varför inte `lib/ab-testing`-systemet?
AppCtaModule använder en egen localStorage-baserad slump istället för cookie-baserad middleware. Skäl:
1. Testet körs bara på quiz-subdomänen — ingen vinst av middleware-assignment.
2. 3 varianter är enkelt att hantera inline utan experiments-registry.
3. `quiz_app_cta_view` och `cta_click` följer ändå samma GA4-schema som övriga experiment → dimensionerna `experiment_id` + `variant_id` funkar i samma Utforska-rapport.

Om fler quiz-experiment byggs på sikt bör de flyttas till `lib/ab-testing/experiments.ts` för enhetlighet.

---

## Success Metrics & Go/No-Go

### Primär KPI
**CTR från quiz-resultat → App Store/Play Store**
- Mäts som `cta_click / quiz_app_cta_view` per variant per position.
- Baseline: tidigare olive-design (pre 2026-04-16).

### Sekundär KPI
**Meta Lead-events** (quiz-resultat som download-källa)
- `trackAppInstall` → Lead-event med `content_name: "quiz_result_<slug>_<position>"`.

### Beslutspunkter
- **Minimum 1 vecka** körning innan första läsning.
- **Minst 500 quiz_app_cta_view per variant × position** för meningsfulla jämförelser.
- Om en variant vinner med ≥95% konfidensgrad → implementera permanent.
- Om alla tre underpresterar mot pre-2026-04-16-baseline → rollback till olive-design men behåll clay-bilder.

---

## Senare iterationer (idé-backlog)

- Testa **att byta ut A (karta)** mot en clay-bild som visar *hundar* istället för hundvakter — kräver nytt Gemini-image-to-image-genererat clay-foto från blank hand-template i `public/assets/flocken/v-passa-mockup-selection/templates_hands_clay_style/`.
- **Position-specifik social proof** — nuvarande `after_review` visar "2 000+ hundägare"; testa konkret recension eller betyg från App Store istället.
- **Platform-specifik body copy** — iOS-användare ser ev. annan text än Android för att matcha respektive app store-tonalitet.

---

## Historik

| Datum | Ändring |
|-------|---------|
| 2026-04-14 | Första version: olive-kort + fotorealistisk hand, 3 varianter (karta/match/hundvakt). |
| 2026-04-15 | Clay-bilder producerade för v/passa (Gemini 2.5 Flash Image). |
| 2026-04-16 | Redesign: cream-kort + clay-bilder + copy-reframing till tre passa-vinklar. Deploy till main. |

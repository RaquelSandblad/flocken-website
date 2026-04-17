---
title: "CB003 Passa — Launch-utfall"
version: "1.0"
last_updated: "2026-04-17"
status: "launched-paused"
author: "Claude (PL) + kreativ-producent"
---

# CB003 Passa — Launch-utfall

Dokumenterar det faktiska utfallet av CB003-launchen 2026-04-17. Kompletterar
`docs/meta/CB003_LAUNCH_SPEC.md` v1.0 (brief) som blev delvis föråldrad efter
deep research. **Detta är sanningen om vad som skapades i Meta.**

## Status

**Skapat som PAUSED i Meta Ads** — Torbjörn aktiverar manuellt i Ads Manager.

## Struktur

```
Campaign: c_flo_swe_init_dogowner_lpv_h01_cid003
  ID: 120243902361470455
  Objective: OUTCOME_TRAFFIC
  Optimization: LANDING_PAGE_VIEWS
  Budget: ABO (ad set-nivå)

  Ad Set "trygghet" (120243902362250455) · 50 SEK/dag
    ├── Static 4:5: 120243902366250455
    │   Copy: p01 + h01 + d01
    │   Creative: flocken_ad_cb003_a_v01_4x5.jpg
    └── Video 9:16: 120243902367790455
        Copy: p02 + h03 + d01
        Video: fl_vid_passa_full_function_freddy_v01_9x16.mp4 (delad)

  Ad Set "skuld" (120243902368990455) · 50 SEK/dag
    ├── Static 4:5: 120243902370680455
    │   Copy: p05 + h05 + d04
    │   Creative: flocken_ad_cb003_b_v01_4x5.jpg
    └── Video 9:16: 120243902372190455
        Copy: p08 + h07 + d04
        Video: (samma delade video)

  Ad Set "natverk" (120243902373180455) · 50 SEK/dag
    ├── Static 4:5: 120243902374590455
    │   Copy: p09 + h09 + d06
    │   Creative: flocken_ad_cb003_c_v01_4x5.jpg
    └── Video 9:16: 120243902376470455
        Copy: p12 + h10 + d06
        Video: (samma delade video)

Total: 150 SEK/dag
```

## Beslut som fattades (med motivering)

| # | Beslut | Fattat av | Motivering |
|---|---|---|---|
| 1 | **1 kampanj, 3 ad sets** | Torbjörn | Clean signal per vinkel; båda deep research-rapporterna enades om konsolidering |
| 2 | **ABO** (ad set-nivå budget) | Torbjörn | CBO förutsätter fungerande LPV-mätning; vi började från noll |
| 3 | **LPV-optimering direkt** | Torbjörn | Slim cookie-bar deployad samma dag — LPV fyrar korrekt; iterera om <40 % rate |
| 4 | **OUTCOME_TRAFFIC** (inte App Promotion) | Torbjörn | Install-mätning klen, Facebook SDK-setup ofullständig |
| 5 | **Advantage+ Audience PÅ, hård geo** | Torbjörn | Expansion inom SE + 25-65; Audience Network EXKLUDERAD |
| 6 | **Format 4:5 + 9:16** (inte 1:1, inte Carousel) | Torbjörn | 1:1 ger marginellt fler placeringar till sämre engagement; håll enkelt |
| 7 | **Alt D — delad video i alla 3 ad sets** | Torbjörn | Pragmatisk genväg v01; vinkel-specifika videos i v02 |
| 8 | **MMP skippad** | Torbjörn | iOS IDFA/ATT-friktion överväger attribution-värde för nu |

## Avvikelser från v1.0-spec

| Område | v1.0-spec | Faktiskt utfall | Orsak |
|---|---|---|---|
| Antal kampanjer | 3 separata | **1 kampanj, 3 ad sets** | Deep research-konsensus |
| Optimization goal | LINK_CLICKS | **LANDING_PAGE_VIEWS** | Pixel-buggen fixad via slim cookie-bar samma dag |
| Format | 4 format (inkl. 1:1, Carousel) | **2 format (4:5 + 9:16)** | Torbjörn minskade komplexitet |
| Audience Network | Default ON (automatic_placements) | **Exkluderat** | Research: 60-80 % av klick men 5-10 % av LPV |
| Advantage+ Creative (API) | Planerat enligt Gemini-rapport | **Utelämnat i v01** | Meta API v24.0 enum-värden ändrade — Gemini-rapporten föråldrad |
| age_max | 55 | **65** | Meta 2026 kräver ≥65 vid Advantage+ Audience |
| 9:16-video per vinkel | Plan: unik per vinkel med text-overlay | **Delad video × 3** | Canva MCP stödjer inte text-overlay på tidslinje; Alt D valdes |

## Pixel-fix som möjliggjorde LPV-optimering

Innan denna session blockerade cookie-banner-modalen 70-90 % av
Meta-trafikens PageView-event (empiriskt: 516 klick → 14 LPV på CID002 =
97,3 % drop-off).

**Fix:** Slim cookie-bar deployad på `/v/*`-sidor
(commit `bc9fc46`, `public/scripts/cookie-banner-custom.js`).

**Verifierat live:** Chrome inkognito + Meta Pixel Helper visade
PageView Active + ViewContent Active efter klick.

Se diagnos: `../../../../spitakolus/meta-ads/LPV_DIAGNOSIS.md`.

## Launch-script

`scripts/launch-cb003-passa.js` — idempotent-ish Node-skript som:
1. Verifierar creative-filer finns lokalt
2. Laddar upp 3 statiska bilder + 1 video till Meta
3. Hämtar video-thumbnail (polling)
4. Skapar kampanj + 3 ad sets + 6 ads (allt PAUSED)
5. Rapporterar alla ID:n

Script-fel uppstod 4 gånger under launch (se META_ADS_LESSONS_LEARNED.md
"v24.0-gotchas"). Fixade in-line, script är nu i fungerande skick för v02.

## Kreativ-produktion

Canva-assets producerade av @kreativ-producent 2026-04-17:

- Folder: **Flocken Ads / CB003 — Passa** (Canva folder ID `FAHHGgJKVtM`)
- 3 statiska 4:5-designs, brand kit `kAG6b9js0YE`
- Designs: hero-clay-promenad, closing-clay-soffa, arg2-hand-karta
- Hook-text övre tredjedelen, ≤20 % textyta (Meta best practice)
- Ingen wordmark i botten — Meta visar profilnamn + avatar automatiskt

## Nästa steg

1. **Torbjörn granskar + aktiverar** i Ads Manager (rekommendation: Skuld först, 24h innan fler aktiveras)
2. **Efter 24h:** Kolla LPV-rate. Grönt om >40 %, iterera om <20 %
3. **v02-plan:** Producera 3 unika 9:16-videos med text-overlay per vinkel; aktivera Advantage+ Creative via API med uppdaterad enum-syntax
4. **Långsiktig:** BigQuery-export för GA4; rule-engine från Gemini-synteserad tabell (se RESEARCH_SYNTHESIS.md)

## Relaterade dokument

- Deep research: `../../../../spitakolus/meta-ads/DEEP_RESEARCH_RESPONSE_CHATGPT.md`, `DEEP_RESEARCH_RESPONSE_GEMINI.md`
- Syntes + beslutsunderlag: `../../../../spitakolus/meta-ads/RESEARCH_SYNTHESIS.md`
- LPV-diagnos: `../../../../spitakolus/meta-ads/LPV_DIAGNOSIS.md`
- Copy-forskning (VoC): `../../../../spitakolus/copywriting/voice_of_customer_passa.md`
- Brief + copy: `brief.md`, `copy.md` (samma mapp)
- API gotchas: `../../docs/meta/META_ADS_LESSONS_LEARNED.md`
- V1-spec (arkiv): `../../docs/meta/CB003_LAUNCH_SPEC.md`

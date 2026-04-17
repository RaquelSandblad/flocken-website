---
title: "CB003 Passa — Kampanj-launch spec"
version: "2.0"
last_updated: "2026-04-17"
status: "launched-paused"
author: "kreativ-producent / PL"
---

> **v2.0 (2026-04-17):** Kampanjen skapad som PAUSED i Meta. Faktiska beslut
> och utfall dokumenterade i `flocken_ads/creative_bases/cb003/launch_result.md`.
> Sektionerna nedan är den ursprungliga v1.0-specen — vissa beslut reviderades
> efter deep research (se `../../../spitakolus/meta-ads/RESEARCH_SYNTHESIS.md`)
> och launch-utfall (se launch_result.md). Läs launch_result.md för sanningen
> om vad som faktiskt kör.


# CB003 Passa — Kampanj-launch spec

Komplett spec för att launcha första Meta Ads-kampanjen för Passa-funktionen. Allt du behöver för att (1) granska, (2) godkänna, (3) köra launch-scriptet.

**Status:** Inget skapas i Meta förrän du gett OK på denna spec. Skulle du ändå köra scriptet nu, skapas allt som `PAUSED` — inga pengar spenderas.

---

## 1. Viktigt strategiskt beslut: Objective

### Du sa "App Installs" — men det kräver ett val

**Option A: OUTCOME_TRAFFIC (Landingssida → App Store via knappar)**
- Optimerar för klick till landningssidan
- Användare landar på flocken.info/v/passa
- Där klickar de "Ladda ner gratis" → App Store/Google Play
- **Fördel:** Landningssidan säljer värdet innan installation. Högre intent.
- **Fördel:** Tracking-kedjan vi redan byggt (Lead-event i VLandingCTA) fungerar.
- **Nackdel:** Extra steg = bortfall mellan LP och App Store.

**Option B: OUTCOME_APP_PROMOTION (Direkt till App Store)**
- Optimerar för app installs
- Annonsen leder direkt till App Store/Google Play
- Ingen landningssida
- **Fördel:** Meta kan optimera direkt mot installationsmål via SDK-signaler
- **Nackdel:** Kräver Flocken-appens Facebook SDK-integration för events (app_install, app_open)
- **Nackdel:** Ingen landningssida = ingen sell-first-install-later
- **Fråga till utvecklingsrådgivaren:** Är Facebook SDK installerat i Flocken-appen? Rapporterar vi app_install-events till Meta?

### Min rekommendation

**Kör Option A (Traffic) för första launchen**. Tre skäl:
1. Vi har redan byggt landningssidan och tracking
2. Vi vet inte om Facebook SDK är korrekt konfigurerat (måste verifieras)
3. Landningssidan kvalificerar trafiken — bättre CAC långsiktigt
4. Vi kan byta till App Promotion sen när vi har data + SDK verifierat

**Nästa iteration:** när vi har 2 veckors data, testa Option B parallellt i ny kampanj (samma CB, annan cid).

---

## 2. Kampanjstruktur

### Campaign
```
Namn (V1-spec):     c_flo_swe_init_dogowner_inst_h01_cid<NNN>
Namn (V2 om OK):    c_flo_swe_init_dogowner_inst_h01_cid<NNN>   (campaign-format är samma)
Objective:          OUTCOME_TRAFFIC
Status:             PAUSED (obligatoriskt vid skapande)
Special ad categ:   []  (inga)
Budget level:       Ad Set
```

### Ad Sets — 3 stycken (en per vinkel)

**Namn-format (alla tre):** `as_broad_swe_opt_inst_cid<NNN>`

Vi kan inte sätta vinkeln i ad set-namnet enligt spec (ad set får inte innehålla kreativ info). Vinkeln lever i ad-namnet + ad-copyn.

**Alternativ:** Skapa 3 ad sets med olika `cell`-värden för att särskilja — men det är inte semantiskt korrekt (`cell` betyder targetingprofil, inte vinkel).

**Rekommendation:** Skapa en campaign per vinkel istället så varje vinkel har eget cid. Det ger renare data.

```
Campaign 1 → cid101 → Vinkel a (Trygghet)
Campaign 2 → cid102 → Vinkel b (Skuld)
Campaign 3 → cid103 → Vinkel c (Nätverk)
```

Eller — håll det enkelt:

```
Campaign → cid001 → 3 ad sets, men varje ad set har unikt cell-hack eller skip-namnkonventionen för första iterationen
```

**Min rekommendation för MVP:** 3 separata kampanjer, en per vinkel. Renare analys i BigQuery.

### Ad Sets (per kampanj, broad targeting)

```
Namn:                   as_broad_swe_opt_inst_cid<NNN>
Optimization goal:      LINK_CLICKS
Billing event:          IMPRESSIONS
Bid strategy:           LOWEST_COST_WITHOUT_CAP
Daily budget:           5000 (öre) = 50 SEK/dag
Status:                 PAUSED
```

### Targeting (alla 3 ad sets samma start)

```json
{
  "geo_locations": { "countries": ["SE"] },
  "age_min": 25,
  "age_max": 55,
  "genders": [1, 2],
  "publisher_platforms": ["facebook", "instagram"],
  "facebook_positions": ["feed", "story", "reels"],
  "instagram_positions": ["stream", "story", "reels", "explore"],
  "device_platforms": ["mobile"],
  "flexible_spec": [
    {
      "interests": [
        { "id": "6003107902433", "name": "Dogs" }
      ]
    }
  ]
}
```

**Notera:** Meta's Advantage+ "detailed targeting expansion" kan vara på eller av. Default är PÅ och bör lämnas så för kall trafik.

**Alternativ (bredare):** Skippa interest-targeting, låt Meta hitta målgrupp själv via Advantage+ audience. Rekommenderas för budget ≥ 300 kr/dag — just nu är vi under.

---

## 3. Ads (Advantage+ creative per ad set)

Meta Advantage+ creative optimerar automatiskt mellan kreativa inputs. Vi laddar upp 2 primary texts + 2 headlines + 2 kreativ (bild/video), Meta blandar.

### Ad Set 1: Trygghet

**Ad-namn (V1):** `ad_h01a_cb003_v01_hk_passa_src_ai_cid<NNN>`
**Ad-namn (V2):** `ad_cb003_a_v01_cid<NNN>`

**Primary text (rotera 2):**
- p01: "Lämna din hund hos någon du litar på. Se hundvakter nära dig med profil och bild."
- p02: "Du ska inte behöva fråga i en Facebook-grupp. Se vem som finns nära dig innan du bestämmer dig."

**Headlines (rotera 2):**
- h01: "Hitta hundvakt nära dig"
- h03: "Hundvakt du litar på"

**Description:**
- d01: "Gratis att ladda ner"

**CTA:** "Learn More" (leder till flocken.info/v/passa)

**Creative (minst 2 format rekommenderas för Advantage+):**
- Static 1:1 — clay-promenad + text-overlay "Hundvakt du litar på"
- Static 4:5 — clay-promenad + text-overlay (samma, annan crop)

**Landing URL:** `https://flocken.info/v/passa?utm_source=meta&utm_medium=paid&utm_campaign=cb003_trygghet&utm_content=a_v01`

### Ad Set 2: Skuld

**Ad-namn (V1):** `ad_h01b_cb003_v01_hk_passa_src_ai_cid<NNN>`
**Ad-namn (V2):** `ad_cb003_b_v01_cid<NNN>`

**Primary text (rotera 2):**
- p05: "Hon tittar på dig med de där ögonen när du packar väskan. Hitta någon hon redan träffat."
- p08: "Klockan är halv sju. Du packar väskan. Hunden ligger i hallen och tittar. Med Flocken hittar du någon du litar på."

**Headlines (rotera 2):**
- h05: "Res utan dåligt samvete"
- h07: "Trygg passning nära dig"

**Description:**
- d04: "Gratis. Välj själv."

**CTA:** "Learn More"

**Creative:**
- Static 4:5 — closing-clay-trygg-soffa + text-overlay "Res utan dåligt samvete"
- Video 9:16 — befintlig funktionsdemo med skuld-hook text-overlay första 2 sekunderna

**Landing URL:** `https://flocken.info/v/passa?utm_source=meta&utm_medium=paid&utm_campaign=cb003_skuld&utm_content=b_v01`

### Ad Set 3: Nätverket

**Ad-namn (V1):** `ad_h01c_cb003_v01_hk_passa_src_ai_cid<NNN>`
**Ad-namn (V2):** `ad_cb003_c_v01_cid<NNN>`

**Primary text (rotera 2):**
- p09: "Mamma orkar inte längre. Grannen har flyttat. I Flocken hittar du hundvakter nära dig."
- p12: "Facebook-grupper är inte byggda för hundpassning. Flocken är det."

**Headlines (rotera 2):**
- h09: "Sluta fråga i FB-grupper"
- h10: "Hundvakt utan att gissa"

**Description:**
- d06: "Profiler med bild nära dig"

**CTA:** "Learn More"

**Creative:**
- Static 4:5 — hand-mockup karta + text-overlay "Hundvakt utan att gissa"
- Static 1:1 — hero-clay + text-overlay "Sluta fråga i FB-grupper"

**Landing URL:** `https://flocken.info/v/passa?utm_source=meta&utm_medium=paid&utm_campaign=cb003_natverk&utm_content=c_v01`

---

## 4. Budget

| Nivå | Belopp | Motivering |
|------|--------|------------|
| Ad Set 1 (Trygghet) | 50 SEK/dag | Basbudget, ska räcka för ~5-15 klick/dag |
| Ad Set 2 (Skuld) | 50 SEK/dag | Samma |
| Ad Set 3 (Nätverk) | 50 SEK/dag | Samma |
| **Total/dag** | **150 SEK** | |
| **Total/vecka** | **1 050 SEK** | |
| **2 veckor test** | **2 100 SEK** | Minsta meningsfulla lärperiod |

**Budget-kontroll:**
- Alla ad sets är `PAUSED` vid skapande
- Du aktiverar en ad set åt gången för att verifiera
- Dagsbudget hårt lås på 50 SEK/ad set
- Du stoppar kampanjen när du vill via Meta Ads Manager

---

## 5. Assets som måste produceras INNAN launch

### Basbilder (finns redan)
- `hero-clay-promenad-1x1.jpg` — `flocken_ads/creative_bases/cb003/assets/` (1:1 + 4:5)
- `closing-clay-trygg-soffa.jpg` — samma mapp
- `arg2-hand-karta-hundvakter.jpg` — samma mapp
- Befintlig funktionsdemo-video 9:16 — `fl_vid_passa_full_function_freddy_v01_9x16.mp4`

### Text-overlays som måste skapas i Canva

| Ad Set | Format | Basbild | Hook-text | Canva-namn |
|--------|--------|---------|-----------|------------|
| 1 Trygghet | 1:1 (1080×1080) | hero-clay-promenad | "Hundvakt du litar på" | `flocken_ad_cb003_a_v01_1x1` |
| 1 Trygghet | 4:5 (1080×1350) | hero-clay-promenad | "Hundvakt du litar på" | `flocken_ad_cb003_a_v01_4x5` |
| 2 Skuld | 4:5 (1080×1350) | closing-clay-trygg-soffa | "Res utan dåligt samvete" | `flocken_ad_cb003_b_v01_4x5` |
| 2 Skuld | 9:16 (1080×1920) | funktionsdemo-video | "Klockan är halv sju..." (text första 2s) | `flocken_ad_cb003_b_v01_9x16` |
| 3 Nätverk | 4:5 (1080×1350) | arg2-hand-karta-hundvakter | "Hundvakt utan att gissa" | `flocken_ad_cb003_c_v01_4x5` |
| 3 Nätverk | 1:1 (1080×1080) | hero-clay-promenad | "Sluta fråga i FB-grupper" | `flocken_ad_cb003_c_v01_1x1` |

**Totalt: 6 Canva-designs att producera.** Text-overlays följer principerna i `CANVA_WORKFLOW.md`.

---

## 6. Tracking-verifiering (före launch)

Verifiera att kedjan fungerar:

1. **Meta Pixel laddar på flocken.info/v/passa**
   - Öppna sidan i Chrome med Facebook Pixel Helper
   - Ska visa pixel-ID: 854587690618895
   - Ska fyra off PageView-event

2. **CTA triggar Lead-event**
   - Klicka "Ladda ner gratis" på LP
   - Öppna Meta Events Manager → Test Events
   - Ska se `Lead`-event inom 5 sekunder

3. **UTM-parametrar loggas till GA4**
   - Kolla GA4 Real-time report när test-klick görs
   - Ska se `utm_source=meta`, `utm_campaign=cb003_*`

4. **App Store/Google Play-knappar fungerar**
   - iOS: redirect till `https://apps.apple.com/app/flocken/id...`
   - Android: redirect till `https://play.google.com/store/apps/details?id=...`

**Om någon del brister:** Kampanj startas INTE förrän allt är grönt.

---

## 7. Risk-kontrollpunkter

### Före launch
- [ ] CB003 brief och copy är läst och godkänd
- [ ] 6 Canva-designs producerade och exporterade
- [ ] Tracking-kedjan verifierad (Pixel, Lead-event, UTM, App Store-länkar)
- [ ] Business Manager och ad account verifierade (act_1648246706340725)
- [ ] Meta Access Token giltig
- [ ] Pengarna på kortet räcker för 2 veckor × 150 SEK = 2 100 SEK

### Vid launch
- [ ] Alla objekt skapas `PAUSED`
- [ ] Torbjörn verifierar i Ads Manager att kampanjerna ser korrekta ut
- [ ] Torbjörn aktiverar manuellt en ad set i taget
- [ ] Efter första aktivering: vänta 24h, kolla att impressions tickar in och ingen policy-flag

### Efter launch (dag 3, 7, 14)
- [ ] Dag 3: kolla ha vi fått ≥10 klick/ad set (annars paus + recover)
- [ ] Dag 7: jämför vinklar — vilken har högst CTR, CPC, LP-konvertering
- [ ] Dag 14: första optimeringsbeslutet (pausa sämsta vinkel, skala bästa)

---

## 8. Alternativ launch-strategi (enklare MVP)

Om du vill testa billigare och enklare, hoppa 3 ad sets och kör **en ad set med Advantage+ creative som blandar alla 3 vinklar**:

- 1 campaign
- 1 ad set (broad, 50 SEK/dag)
- 1 ad (Advantage+ creative med 6 primary texts + 6 headlines + 6 kreativ)
- Total budget: 50 SEK/dag

**Fördel:** Meta optimerar helt själv. Minimal hantering.
**Nackdel:** Svårare att läsa ut "vilken vinkel vann" — Meta kan blanda allt.

**Din rekommendation:** 3 ad sets ger bättre lärande. Men om tid/budget är knapp, single ad set duger för vecka 1.

---

## 9. Script för launch

När du godkänt, körs:

```bash
cd C:\dev\flocken-website
node scripts/create-campaign-structured.js campaign flo swe init dogowner inst 01 50
```

**OBS:** Detta script skapar endast **campaign + 1 ad set (broad)**. För 3 separata vinkelkampanjer eller 3 ad sets i samma kampanj behöver scriptet utökas.

**Förslag: skapa nytt script `scripts/launch-cb003-campaign.js`** som:
1. Skapar 3 kampanjer (en per vinkel)
2. Skapar 1 ad set per kampanj
3. Skapar 1 ad per ad set med Advantage+ creative
4. Returnerar alla IDs så du kan verifiera i Ads Manager

**Status:** Scriptet är inte skrivet än. Bygger det efter ditt godkännande av denna spec.

---

## 10. Sammanfattning — vad du ska besluta

### Beslut 1: Objective
- [ ] A: Traffic till landningssida (rekommenderat)
- [ ] B: App Install direkt (kräver SDK-verifiering)

### Beslut 2: Kampanjstruktur
- [ ] 3 separata kampanjer (en per vinkel) — rekommenderat för lärande
- [ ] 1 kampanj med 3 ad sets — enklare men sämre separation
- [ ] 1 kampanj, 1 ad set, Advantage+ blandar allt — enklast, minst lärande

### Beslut 3: Budget
- [ ] 150 SEK/dag (50/ad set × 3) — rekommenderat
- [ ] 50 SEK/dag (bara ett ad set) — billigaste start
- [ ] Annat belopp:

### Beslut 4: Tidpunkt
- [ ] Launcha nu när allt är klart
- [ ] Vänta tills X:
- [ ] Först producera kreativen, sen launch dag X

### Beslut 5: Naming V1 vs V2
Sen på `NAMING_CONVENTIONS_V2_PROPOSAL.md`:
- [ ] V1 (nuvarande LOCKED)
- [ ] V2 full förenkling
- [ ] V2 + behåll h<nn>

Datum:
Beslut:
Signerat:

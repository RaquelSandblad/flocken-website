# Funnel Contracts (v1)

Detta dokument definierar **funnel-kontrakt** som används för:
- funnel dashboard (utzoomat)
- diagnostik vid drop-off
- jämförelse mellan kanaler och över tid

Funnel-kontrakt är **produkt- och analysdefinitioner**, inte dashboards.

**Dashboards och SQL-views ska implementera dessa kontrakt**.

---

## Principer

### 1) En funnel – ett primärt KPI
Varje funnel har ett **primärt KPI** (slutmål) som används för övervakning.

Sekundära KPI:er används endast när ett steg har onormalt drop-off.

### 2) Kanalagnostisk
Funnel-strukturen är densamma oavsett kanal.

Segmentering görs i analysen (t.ex. `channel`, `campaign_id`, `store_source`).

### 3) Grain
Funnel ska kunna följas dagligen på:

- `date × app_id × platform` (+ segment)

### 4) Tidsfönster
V1 använder två tidsfönster:

- **Same-day**: steg 1→N inom samma dag (daglig trend)
- **Rolling 7 days**: steg 1→N inom 7 dagar (minskar brus)

Detta gör det möjligt att analysera fördröjda effekter utan user-level joins.

### 5) Dedupe
Alla steg som är event-baserade ska dedupe:as enligt event-spec:

- `first_open`: per user/device (GA4 standard)
- `sign_up`: dedupe per user/device inom 24h

---

## Funnel 1: Store Acquisition (iOS) – pre-install

**Syfte:** Förstå om problemet ligger i App Store discovery/listing vs vidare i appen.

**Primärt KPI:** `store_downloads`

### Steg
1. `store_impressions`
2. `store_product_page_views`
3. `store_downloads`

### Diagnostik
- `store_conversion_rate` (downloads / product_page_views)
- `store_downloads_by_source` (search/browse/referrer)
- `store_downloads_by_country`

### Segmentering (rekommenderad)
- `country`
- `store_source`

### Kommentar
Detta är en pre-install funnel och kan påverkas av:
- marknadsinsatser (awareness)
- App Store listing (screenshots, text, trust)
- mismatch mellan annonslöfte och listing

---

## Funnel: Onboarding

**Syfte:** Identifiera friktion och mismatch efter install.

**Primary KPI:** `sign_up`

### Steg
`store_downloads` → `app_first_open` → `sign_up`

### Diagnostik
- drop-off per steg
- tid mellan steg (om tillgängligt)
- fel/avbrott i registrering (framtida: field-level events)

### Segmentering (rekommenderad)
- `platform`
- `channel` (om attribution finns)
- `campaign_id` (paid)

### Kommentar
Om `store_downloads` är starkt men `sign_up` svagt, ligger problemet sannolikt i:
- onboarding
- krav på data för tidigt
- teknisk friktion
- svagt upplevt värde i första sessionen

---

## Funnel: Activation / Value

**Primary KPI:** `listing_published`

### Steg
1. `sign_up`
2. `listing_created`
3. `listing_published`

### Kommentar
Endast listings med status `published` räknas som faktisk aktivering.  
Drafts ska aldrig räknas som value.

---

## Funnel 3: Paid → Store lag-effekt (kors-kanal)

**Syfte:** Upptäcka tidsförskjutna samband mellan paid insats och store/app-resultat.

**Primärt KPI:** `store_downloads` och/eller `profile_created` (beroende på analysfråga)

### Insatsmått (inputs)
- `paid_spend`
- `paid_impressions`
- `paid_clicks`

### Resultatmått (outputs)
- `store_downloads`
- `store_downloads_by_source` (särskilt `app_store_search`)
- `app_first_open`
- `profile_created`

### Rekommenderad analysmetod (v1)
- jämför tidsserier med lag: 0–21 dagar
- sök mönster som: `paid_spend ↑` → `store_downloads ↑` efter N dagar

### Kommentar
Denna funnel är inte linjär i UI, men är central för att förstå:
- awareness-effekter
- delayed attribution
- kombinationseffekter mellan kanaler

---

## Definitioner och implementation

### Event- och metric-namn
Eventnamn ska följa `docs/tracking/ANALYTICS_EVENT_SPEC_CROSS_APP.md`.

Metric-namn ska följa `docs/analytics/KPI_DICTIONARY.md`.

### SQL/Views
Implementation i BigQuery bör ske som:
- standardiserade views i `*_marts` (dagliga metrics)
- funnel views som följer stegen ovan

Repo-specifika views kan finnas, men kontraktet här är överordnat.

---

## Framtida utökningar (v2+)

- Android: `play_store_impressions`, `play_store_installs` (Google Play Console)
- Web funnel (om relevant): `lp_view` → `cta_click` → `store_open`
- Field-level registration funnel (password/email/verify)
- Retention funnels (D1/D7) kopplade till primära activation KPI


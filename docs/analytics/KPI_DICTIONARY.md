# KPI Dictionary (v1)

Detta dokument definierar **standardiserade KPI:er** för funnel-analys, growth och kors-kanal-korrelation.

Målet är att varje KPI ska ha **en och endast en definition** – oavsett app, kanal eller dashboard.

- KPI:er används för prioritering och analys
- Dashboards implementerar KPI:erna men **definierar dem inte**

---

## Principer

### 1) Standardnamn (canonical)
Varje KPI har ett **canonical name**. Detta namn används i `fact_kpi_daily.metric`.

### 2) Grain (upplösning)
Varje KPI definieras på ett bestämt grain, normalt:

- `date × app_id × platform × segment`

Där segment kan vara t.ex. `country`, `source`, `channel`, `campaign_id`.

### 3) Källa och beräkningslogik
Varje KPI har:
- primär källa (ASC/GA4/Meta)
- beräkningsregel
- viktiga begränsningar

### 4) Diagnostic vs Primary
Vissa KPI:er är **Primary** (styr/övervakar funnel), andra är **Diagnostic** (används vid drop-off).

---

## KPI-katalog (v1)

### A) Primary funnel KPI (North Star för funnel v1)

#### `sign_up` (PRIMARY – onboarding)
- **Definition:** Användaren skapar ett konto.
- **Källa:** GA4 / App events
- **Grain:** `date × app_id × platform`
- **Beräkning:** count av event `sign_up` (dedupe per user/device inom 24h)
- **Används för:** Onboarding funnel, identifiera tidiga drop-offs

#### `listing_published` (PRIMARY – value)
- **Definition:** En annons/listing som publiceras och blir synlig (ej draft).
- **Källa:** GA4 / App events
- **Grain:** `date × app_id × platform`
- **Beräkning (v1):** count av event `listing_created` där `status = 'published'`
  - dedupe per `listing_id`
- **Används för:** Activation / faktisk produktnytta
- **Begränsningar:** Kräver `status` och helst `listing_id` som event-parametrar

---

### B) Store acquisition (pre-install) – App Store Connect

#### `store_impressions` (DIAGNOSTIC)
- **Definition:** Antal visningar av appens store-listing i App Store.
- **Källa:** App Store Connect (App Analytics)
- **Grain:** `date × app_id × platform=ios` (+ `country` när tillgängligt)
- **Beräkning:** ASC metric impressions
- **Används för:** Pre-install funnel (awareness/discovery)

#### `store_product_page_views` (DIAGNOSTIC)
- **Definition:** Antal visningar av produkt-/app-sidan.
- **Källa:** App Store Connect (App Analytics)
- **Grain:** `date × app_id × platform=ios` (+ `country`)
- **Beräkning:** ASC metric product page views
- **Används för:** Diagnos när downloads inte följer med

#### `store_downloads` (DIAGNOSTIC)
- **Definition:** Antal nedladdningar per dag.
- **Källa:** App Store Connect (App Analytics) (alternativt Sales/Trends om relevant)
- **Grain:** `date × app_id × platform=ios` (+ `country`, + `store_source`)
- **Beräkning:** ASC metric total downloads
- **Används för:** Pre-install funnel, korrelation med paid/organic insatser

#### `store_conversion_rate` (DIAGNOSTIC)
- **Definition:** Andel product page views som leder till download.
- **Källa:** App Store Connect (App Analytics)
- **Grain:** `date × app_id × platform=ios`
- **Beräkning:** `store_downloads / store_product_page_views` (om ASC inte levererar direkt)
- **Används för:** Diagnos av store-listing (screenshots, copy, trust)
- **Begränsningar:** Om ASC:s UI-definition skiljer sig, ska ASC-definitionen prioriteras.

#### `store_downloads_by_source` (DIAGNOSTIC)
- **Definition:** Downloads fördelat på App Store källa.
- **Källa:** App Store Connect
- **Grain:** `date × app_id × platform=ios × store_source`
- **Tillåtna värden (exempel):** `app_store_search`, `app_store_browse`, `app_referrer`, `web_referrer`
- **Används för:** Laggad effekt av marketing: t.ex. Meta → senare App Store Search

#### `store_downloads_by_country` (DIAGNOSTIC)
- **Definition:** Downloads fördelat på land.
- **Källa:** App Store Connect
- **Grain:** `date × app_id × platform=ios × country`
- **Används för:** Geo-effekter och marknadsinsatser

---

### C) Paid marketing (Meta) – insats och resultat

#### `paid_spend` (DIAGNOSTIC)
- **Definition:** Spend per dag.
- **Källa:** Meta Marketing API (Insights)
- **Grain:** `date × app_id × channel=meta × campaign_id` (+ adset/ad om behövs)
- **Beräkning:** Meta spend
- **Används för:** Korrelation/lag-analys mot store/app KPI:er

#### `paid_impressions` (DIAGNOSTIC)
- **Definition:** Impressions per dag.
- **Källa:** Meta Marketing API
- **Grain:** `date × app_id × channel=meta × campaign_id`

#### `paid_clicks` (DIAGNOSTIC)
- **Definition:** Klick per dag.
- **Källa:** Meta Marketing API
- **Grain:** `date × app_id × channel=meta × campaign_id`

#### `paid_ctr` (DIAGNOSTIC)
- **Definition:** Click-through-rate.
- **Källa:** Beräknad från Meta
- **Grain:** `date × app_id × channel=meta × campaign_id`
- **Beräkning:** `paid_clicks / paid_impressions`

---

### D) In-app activation (post-install) – GA4/App events

#### `app_first_open` (DIAGNOSTIC)
- **Definition:** Första öppning av appen per device/user.
- **Källa:** GA4/App events
- **Grain:** `date × app_id × platform`
- **Beräkning:** count av `first_open` (dedupe)
- **Används för:** Kontroll att downloads → opens hänger ihop

#### `signup_start` (DIAGNOSTIC)
- **Definition:** Användaren påbörjar registrering.
- **Källa:** GA4/App events
- **Grain:** `date × app_id × platform`
- **Beräkning:** count av `signup_start`

#### `signup_complete` (DIAGNOSTIC)
- **Definition:** Användaren slutför konto.
- **Källa:** GA4/App events
- **Grain:** `date × app_id × platform`
- **Beräkning:** count av `signup_complete`

---

## Standardiserade dimensioner (v1)

### `app_id`
Intern identifierare (t.ex. `flocken`, `nastahem`).

### `platform`
- `ios`, `android`, `web`, `unknown`

### `channel`
- `meta`, `google_ads`, `organic`, `referral`, `direct`, `unknown`

### `store_source` (ASC)
Canonical mapping för ASC source-värden:
- `app_store_search`
- `app_store_browse`
- `app_referrer`
- `web_referrer`

---

## Dedupe-regler (v1)

För KPI:er som bygger på events ska dedupe-regler vara konsekventa:

- `first_open`: unika per user/device (standard GA4)
- `sign_up`: dedupe per user/device inom 24h
- `listing_published`: dedupe per `listing_id` (om param finns), annars fallback per user/device inom 24h (risk: kan undercounta)

Exakta regler och SQL ska beskrivas i `DATA_MODEL.md` och/eller `FUNNELS.md`.

---

## Ändringslogg

- v1: Initial KPI-set för store acquisition, paid insats och app activation.

---

## Cursor note (implementation alignment)

Nuvarande canonical app-events i `docs/tracking/ANALYTICS_EVENT_SPEC_CROSS_APP.md` använder bl.a. `sign_up` (konto skapat) och `listing_created` (core action). I denna KPI-lista förekommer även `signup_start`, `signup_complete` samt value-KPI:n `listing_published`.

För att undvika begrepps-splitt bör ni välja en konsekvent mapping:
- `sign_up` är **PRIMARY onboarding** (canonical event `sign_up`).
- `listing_published` är **PRIMARY value** och definieras som `listing_created` där `status='published'` (drafts räknas aldrig som value).
- Om ni vill mäta start/slutförande: definiera explicit vilka app-actions som ska logga `signup_start` och `signup_complete` (eller håll er till endast `sign_up`).


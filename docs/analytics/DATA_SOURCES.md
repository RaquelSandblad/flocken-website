# Data Sources (v1)

Detta dokument beskriver hur data hämtas **API-first** från externa plattformar och hur den landar i BigQuery enligt modellen i `DATA_MODEL.md`.

Målet är att:
- inga manuella exporter behövs
- varje källa har en tydlig connector
- credentials hanteras säkert
- data kan köras dagligen och backfill:as

---

## Översikt

V1 inkluderar följande källor:

1. **GA4 → BigQuery export** (app/web events)
2. **Meta Marketing API** (insats och paid-resultat)
3. **App Store Connect API** (store acquisition: impressions → downloads)

Varje källa följer samma mönster:

- Extract (API/export)
- Landning i Raw
- Normalisering i Curated
- Mappning till `fact_kpi_daily`

---

## 1) GA4 → BigQuery Export (events)

### Vad vi använder
- GA4 export till BigQuery (events-tabeller)

### Varför
- robust, automatiskt, dagligt
- undviker GA4 Data API-quotas och komplexitet

### Output
- `*_raw`/`*_curated` events (enligt befintlig repo-struktur)
- KPI:er härleds i marts och skrivs till `fact_kpi_daily`

### KPI-exempel
- `app_first_open`
- `signup_start`
- `signup_complete`
- `profile_created`

### Viktiga krav
- event-implementation måste följa `docs/tracking/ANALYTICS_EVENT_SPEC_CROSS_APP.md`
- dedupe-regler måste vara dokumenterade och konsekventa

---

## 2) Meta Marketing API (Insights)

### Vad vi använder
- Meta Graph API /insights för kampanj/adset/ad

### Output
- Raw: JSON per dag/campaign
- Curated: normaliserade dagliga metrics
- Marts: mappning till `fact_kpi_daily`

### KPI-exempel
- `paid_spend`
- `paid_impressions`
- `paid_clicks`
- `paid_ctr`

### Segmentering
- `campaign_id` (primärt)
- adset/ad kan ingå om needed

### Viktiga krav
- stabil naming i Meta (kampanj/annonsnamn) är hjälpsamt men inte join-nyckel
- använd `campaign_id` som nyckel

---

## 3) App Store Connect API (App Analytics)

### Vad vi använder
- App Store Connect API för App Analytics Reports

### Output
- Raw: rapportfiler (downloaded instances)
- Curated: normaliserad daglig metrics-tabell
- Marts: mappning till `fact_kpi_daily`

### KPI-exempel
- `store_impressions`
- `store_product_page_views`
- `store_downloads`
- `store_conversion_rate`
- `store_downloads_by_source`
- `store_downloads_by_country`

### Nyckeldimensioner
- `country`
- `store_source`

### Kommentar
ASC-data är aggregerad och används för:
- pre-install funnel
- lag-analys mot paid insats

---

## Credentials och säkerhet

### Principer
- inga nycklar i repo
- använd environment variables och secret manager
- rotation dokumenteras

### Rekommenderat
- Google Cloud Secret Manager för:
  - Meta access token (eller refresh-flöde)
  - App Store Connect API key / issuer / key id
  - service account för BigQuery (om behövs)

---

## Daglig körning (schemaläggning)

### Frekvens
- 1 gång per dag räcker (D+1)

### Rekommenderad arkitektur
- Cloud Scheduler → Cloud Run (eller Functions)
- en körning per källa eller en orkestrator som kör alla

### Output-kontrakt
Varje körning ska:
- logga `run_id`
- spara raw-fil i GCS (datum-partition)
- skriva curated rows
- skriva/append:a till `fact_kpi_daily`

---

## Backfill

Krav:
- kunna köra för ett datumintervall
- kunna reprocessa från raw → curated → marts

Rekommendation:
- CLI/script med parametrar: `start_date`, `end_date`, `app_id`

---

## Mappning till `fact_kpi_daily`

### Regel
Alla källor måste mappa sina metrics till canonical KPI-namn enligt `KPI_DICTIONARY.md`.

### Exempel
- ASC “Total Downloads” → `store_downloads`
- Meta “spend” → `paid_spend`
- GA4 event “profile_created” → `profile_created`

---

## Relaterade dokument

- `docs/analytics/README.md`
- `docs/analytics/DATA_MODEL.md`
- `docs/analytics/KPI_DICTIONARY.md`
- `docs/analytics/FUNNELS.md`
- `docs/analytics/OPERATIONS.md` (kommer)


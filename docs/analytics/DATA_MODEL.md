# Data Model (v1)

Detta dokument beskriver den **standardiserade datamodellen** för analytics.

Målet är att:
- alla källor (GA4, Meta, App Store Connect, m.fl.) kan laddas in utan schemaändringar
- alla appar kan onboardas utan att bygga om modellen
- dashboards och AI kan analysera data med konsekvent semantik

---

## Lager (layers)

### 1) Raw
**Syfte:** Spara rådata från API/exporter så att allt kan återskapas.

- format: JSON/CSV (som källan levererar)
- lagring: GCS + ev. `*_raw`-dataset i BigQuery
- inga transformationsregler här (förutom minimal parsing)

### 2) Curated
**Syfte:** Normaliserad, validerad data per källa.

- standardiserade typer
- normaliserade datum/tidszon
- källspecifika dimensioner mappas till canonical dimensioner

### 3) Marts
**Syfte:** Analys- och funnel-optimerade tabeller.

- `fact_kpi_daily` (kärntabell)
- funnel views
- daily rollups

---

## Kärntabell: `fact_kpi_daily`

### Varför denna tabell finns
Denna tabell är den gemensamma “sanningstabellen” för dagliga KPI:er.

Den gör att:
- nya källor kan anslutas genom att mappa till samma schema
- nya appar kan anslutas genom att ange `app_id`
- AI och analys kan köras på en enda struktur

### Grain
En rad per:

`date × app_id × platform × metric × segment`

Där segment representeras av dimensionkolumner (t.ex. `channel`, `country`, `store_source`, `campaign_id`).

### Schema (v1)

**Required**
- `date` (DATE) – canonical dag (Europe/Stockholm)
- `app_id` (STRING) – intern identifierare (t.ex. `flocken`)
- `platform` (STRING) – `ios|android|web|unknown`
- `source_system` (STRING) – `ga4|meta|asc|gplay|other`
- `metric` (STRING) – canonical KPI-namn (se `KPI_DICTIONARY.md`)
- `value` (NUMERIC/FLOAT64) – KPI-värde

**Common optional dimensions**
- `channel` (STRING) – `meta|google_ads|organic|referral|direct|unknown`
- `country` (STRING) – ISO-3166-1 alpha-2 (t.ex. `SE`)
- `store_source` (STRING) – `app_store_search|app_store_browse|app_referrer|web_referrer|unknown`

**Paid dimensions (when applicable)**
- `campaign_id` (STRING)
- `campaign_name` (STRING) – snapshot (ej join-nyckel)
- `adset_id` (STRING)
- `ad_id` (STRING)

**Quality/ops fields**
- `ingested_at` (TIMESTAMP)
- `source_date` (DATE) – datum i källsystemet om det skiljer sig
- `run_id` (STRING) – id för pipeline-körning

### Naming rules
- `metric` ska alltid vara canonical (snake_case)
- dimensioner ska vara canonical (snake_case)
- `unknown` används hellre än NULL där det underlättar segmentering

---

## Dimensionstabeller

### `dim_apps`
**Syfte:** göra pipen app-oberoende och konfigurerbar.

Minimifält:
- `app_id` (STRING) – intern id
- `app_name` (STRING)

Källspecifika ids:
- `asc_app_apple_id` (STRING/INT)
- `bundle_id_ios` (STRING)
- `package_name_android` (STRING)
- `ga4_property_id` (STRING)
- `ga4_stream_id_ios` (STRING)
- `ga4_stream_id_android` (STRING)
- ev. `meta_app_id` / `meta_pixel_id` (om relevant)

### `dim_calendar`
**Syfte:** tidsdimension för enkel analys.

- datum
- vecka/månad/kvartal
- helgdagar (valfritt)

### `dim_source_mappings` (valfri men rekommenderad)
**Syfte:** mappa källspecifika värden till canonical.

Exempel:
- ASC source label → `store_source`
- Meta placement → `channel`/`placement` (om används)

---

## Källspecifika curated-tabeller (exempel)

V1 kan ha en curated-tabell per källa, exempel:

- `curated_ga4_events_daily`
- `curated_meta_insights_daily`
- `curated_asc_metrics_daily`

Dessa tabeller är staging för att sedan populera `fact_kpi_daily`.

---

## Funnel views

Funnel views ska byggas från `fact_kpi_daily` enligt kontrakt i `FUNNELS.md`.

Rekommenderat namn:
- `<app>_marts.funnel_store_acquisition_daily`
- `<app>_marts.funnel_app_activation_daily`

Obs: Views kan vara app-specifika, men de får inte bryta mot kontraktet.

---

## Tidszon och datum

Canonical tidszon: **Europe/Stockholm**.

Regel:
- `date` i `fact_kpi_daily` ska representera den canonical dagen
- om källor levererar i UTC eller annan tidszon ska detta normaliseras i curated-lagret

---

## Dedupe och identitet

Eftersom modellen är aggregerad behövs dedupe-regler för event-baserade metrics.

- dedupe logik hör hemma i curated/marts
- definitioner refereras från `KPI_DICTIONARY.md`

---

## Backfill och historik

- Pipen ska kunna backfilla per datumintervall
- Raw lagras så att historik kan återskapas
- KPI-definitioner ska versionshanteras (ändringar kan påverka historik)

---

## Relaterade dokument

- `docs/analytics/README.md`
- `docs/analytics/KPI_DICTIONARY.md`
- `docs/analytics/FUNNELS.md`
- `docs/analytics/DATA_SOURCES.md` (kommer)
- `docs/analytics/OPERATIONS.md` (kommer)


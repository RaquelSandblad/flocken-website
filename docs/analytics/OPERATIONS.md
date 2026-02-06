# Operations & Monitoring (v1)

Detta dokument beskriver **hur analytics-pipen körs, övervakas och felsöks i praktiken**.

Syftet är att:
- systemet ska vara stabilt utan daglig handpåläggning
- fel ska upptäckas snabbt
- åtgärder ska vara tydliga även för någon som inte byggt systemet

---

## Körningsprinciper

### Frekvens
- Alla connectors körs **1 gång per dag (D+1)**
- Realtid är uttryckligen **inte** ett krav

Motivering:
- minskat brus
- lägre kostnad
- bättre analys av laggade effekter

---

### Körningsmodell

Rekommenderad modell:

1. **Cloud Scheduler** triggar daglig körning
2. **Orchestrator** (Cloud Run / Function) startar:
   - GA4/BigQuery-bearbetning
   - Meta Marketing API connector
   - App Store Connect API connector
3. Varje connector kör isolerat men rapporterar till gemensam logg

Alternativ:
- En connector per scheduler (ok om det förenklar felsökning)

---

## Repo-implementation (v1: GA4→fact_kpi_daily)

I detta repo finns nu en första v1-loader för GA4-export → `analytics_core.fact_kpi_daily`:

- **Setup (DDL)**: `scripts/setup-bigquery-core.sql`
  - skapar dataset `analytics_core`
  - skapar tabeller: `analytics_core.dim_apps`, `analytics_core.fact_kpi_daily`
  - seedar minst en rad i `dim_apps` (Flocken)

- **Loader (MERGE/upsert)**: `scripts/load-fact-kpi-daily-from-ga4.sql`
  - körs för ett datumintervall
  - upsert per `date × app_id × platform × source_system × metric`

- **Runner (D+1 + backfill)**: `scripts/run-daily-kpi-load.js`
  - default: kör för **igår**
  - backfill: `--start=YYYY-MM-DD --end=YYYY-MM-DD`
  - valfritt: `--setup` (kör DDL innan load)

Rekommenderad schemaläggning (när ni bygger drift):
- Cloud Scheduler (dagligen) → Cloud Run job/container som kör `node scripts/run-daily-kpi-load.js`

---

## Run metadata

Varje körning ska generera ett `run_id` som används konsekvent.

### Krav per run
- `run_id`
- `source_system`
- `start_time`
- `end_time`
- `status` (success / partial / failed)
- `records_written`
- `error_message` (om failed)

Rekommendation:
- skriv till tabell: `analytics_ops.pipeline_runs`

---

## Monitoring

### Vad som ska övervakas

1. **Datafärskhet**
   - senaste datum i `fact_kpi_daily` per källa

2. **Volymavvikelser**
   - 0-rader där historik finns
   - extrema avvikelser dag-för-dag

3. **Schemaavvikelser**
   - nya metrics/dimensioner som inte är i KPI_DICTIONARY

---

### Rekommenderade checks (v1)

- Daglig check:
  - finns data för igår i `fact_kpi_daily`?
- Veckovis check:
  - oväntade nollvärden
  - kraftiga dropp/spikar (>X%) utan motsvarande insatsförändring

Checks kan implementeras som:
- schemalagda BigQuery-queries
- enkla Cloud Functions

---

## Alerting

### När ska vi larma?

- pipeline körs inte
- connector misslyckas två dagar i rad
- kritisk KPI (t.ex. `profile_created`) saknar data

### Hur

- Slack / e-post / loggbaserad alert
- alert ska innehålla:
  - vilken källa
  - vilket datum
  - kort felbeskrivning

---

## Felhantering

### Klassificering

1. **Transient** (API-timeout, rate limit)
   - åtgärd: retry nästa körning

2. **Auth** (token expired, revoked)
   - åtgärd: rotera secret, dokumentera

3. **Schema/kontrakt** (ny metric, ändrad definition)
   - åtgärd: uppdatera KPI_DICTIONARY + ev. mapping

---

## Backfill & reprocessing

### När backfill behövs

- ny connector tillagd
- bug fixad
- KPI-definition ändrad

### Krav

- backfill ska kunna köras per:
  - `app_id`
  - `start_date` → `end_date`

### Regel

- raw-data ska aldrig raderas
- reprocessing sker från raw → curated → marts

---

## Change management

### Regel

Ändringar som påverkar KPI-semantik ska:
- dokumenteras
- versionssättas
- kommuniceras

### Exempel

- ändrad dedupe-regel
- nytt sätt att räkna downloads
- ny primär funnel

---

## On-call / ansvar

### Ägarskap

- analytics-arkitekt: äger kontrakt (README, KPI, FUNNELS)
- utvecklare: äger implementation
- produkt/marknad: äger tolkning och beslut

---

## Relaterade dokument

- `docs/analytics/README.md`
- `docs/analytics/DATA_SOURCES.md`
- `docs/analytics/DATA_MODEL.md`
- `docs/analytics/KPI_DICTIONARY.md`
- `docs/analytics/FUNNELS.md`


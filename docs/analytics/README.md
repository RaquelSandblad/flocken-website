# Analytics Architecture – API‑first, kanalagnostisk och återanvändbar

Detta dokument är **det styrande kontraktet** för hur analytics, growth‑mätning och funnel‑analys ska fungera i detta repo – och i alla framtida appar.

Syftet är att:
- samla data **API‑first** (inga manuella exporter)
- standardisera KPI:er och funnels
- möjliggöra analys **över kanaler och över tid**
- göra onboarding av nästa app möjlig **utan att bygga om pipen**
- skapa ett datalager som både människor och AI kan resonera på

Detta är **inte** en guide för enskilda verktyg (GA4, Meta, ASC). Det är arkitekturen ovanpå dem.

---

## Grundprinciper

### 1. API‑first, alltid
All data ska hämtas via API och köras schemalagt (dagligen).

- ❌ Inga manuella CSV‑exporter
- ❌ Inga dashboards som enda “sanning”
- ✅ All rådata ska kunna återskapas

Detta är ett hårt krav för att undvika mänskliga beroenden och möjliggöra långsiktig analys.

---

### 2. Kanalagnostisk funnel
Det finns **en gemensam funnel‑struktur**, oavsett var trafiken kommer ifrån.

Segmentering sker i analysen – inte i funnel‑definitionen.

Exempel på kanaler:
- Meta Ads
- Organisk App Store‑trafik
- Referral / QR / Direct

Målet är att kunna svara på:
> “Hur beter sig användare beroende på hur de kom in i funneln?”

---

### 3. Ett primärt KPI – sekundära som diagnostik
Funnel‑analysen styrs av **ett primärt KPI** (t.ex. `profile_created`).

- Primärt KPI används för övervakning och prioritering
- Sekundära KPI:er används **endast** när ett steg visar onormalt drop‑off

Detta förhindrar lokal optimering och KPI‑inflation.

---

### 4. Aggregerad analys (inte individnivå)
Systemet är byggt för **daglig, aggregerad analys**:

- dag × app × kanal × metric
- inte user‑level joins

Orsak:
- plattformsbegränsningar (Apple/Google)
- bättre signal‑till‑brus
- korrekt analys av fördröjda och kumulativa effekter

---

### 5. Standardiserad semantik
Alla KPI:er, funnels och begrepp ska ha **en och endast en definition**.

- Samma metric‑namn används över alla appar
- Samma beräkningslogik över tid

Detta är en förutsättning för:
- jämförbarhet
- AI‑baserad mönsterigenkänning
- stabila dashboards

---

## Datakällor (v1)

Analytics‑pipen är uppbyggd kring följande källor:

- **GA4 / App events** – beteende efter install
- **Meta Marketing API** – paid insatser (spend, impressions, clicks)
- **App Store Connect API** – pre‑install funnel (impressions, product page views, downloads)

Fler källor (t.ex. Google Play) kan läggas till utan att ändra modellen.

Detaljer finns i `DATA_SOURCES.md`.

---

## Datamodell (översikt)

Arkitekturen följer tre lager:

1. **Raw** – rådata från API (oförändrad)
2. **Curated** – normaliserad och kvalitetssäkrad data
3. **Marts** – analys‑ och funnel‑optimerade tabeller

Kärnan är en standardiserad faktatabell för dagliga KPI:er:

- en rad per `date × app × metric × segment`

Detta gör att nya appar och nya källor kan kopplas på utan schemaändringar.

Detaljer finns i `DATA_MODEL.md`.

---

## KPI‑ och funnel‑kontrakt

Alla KPI:er och funnels definieras som **kontrakt**, inte som dashboards.

- KPI‑definitioner: `KPI_DICTIONARY.md`
- Funnel‑definitioner: `FUNNELS.md`

Dashboards och analyser ska **implementera** dessa kontrakt – inte definiera dem.

---

## Ny app / ny produkt

Målet är att onboarding av en ny app ska innebära:

- lägga till app‑metadata (ID:n, streams, bundle/package)
- aktivera befintliga connectors
- återanvända samma KPI:er, funnels och dashboards

Ingen ny analytics‑arkitektur ska behöva byggas.

Exakt checklista finns i `NEW_APP_ONBOARDING.md`.

---

## Vad detta system inte är

För tydlighetens skull:

- ❌ Det är inte real‑time attribution
- ❌ Det är inte user‑level tracking
- ❌ Det är inte ett ersättnings‑BI för varje plattform

Detta system finns för **beslutsstöd, funnel‑prioritering och mönsteranalys över tid**.

---

## Relaterade dokument

- [`DATA_SOURCES.md`](./DATA_SOURCES.md) – hur data hämtas via API
- [`DATA_MODEL.md`](./DATA_MODEL.md) – tabeller, grain och naming rules
- [`KPI_DICTIONARY.md`](./KPI_DICTIONARY.md) – standardiserade KPI‑definitioner
- [`FUNNELS.md`](./FUNNELS.md) – funnel‑kontrakt
- [`NEW_APP_ONBOARDING.md`](./NEW_APP_ONBOARDING.md) – hur man lägger till nästa app
- [`OPERATIONS.md`](./OPERATIONS.md) – schemaläggning, monitoring och felsökning

---

## Cursor note (event mapping vs canonical spec)

`FUNNELS.md` och `KPI_DICTIONARY.md` använder KPI/event-steg som bl.a. `profile_created`, `app_first_open`, `signup_start`, `signup_complete`.

I `docs/tracking/ANALYTICS_EVENT_SPEC_CROSS_APP.md` är canonical app-events i v1 istället:
- `first_open` (install/aktivering)
- `sign_up` (konto skapat)
- `listing_created` (core action)

För att undvika dubbel semantik behöver ni antingen:
- **Alias/mappa**:
  - `app_first_open` → `first_open`
  - `profile_created` → `sign_up` (om “profil skapad” = “konto skapat” i er produkt)
- **Eller** utöka canonical spec med `signup_start`/`signup_complete` om ni verkligen vill mäta start/slut som separata steg.

---

## Cursor note (legacy BigQuery vs `fact_kpi_daily`)

I repot finns idag BigQuery-artefakter som:
- `flocken_marts.daily_metrics` (table)
- `flocken_curated.conversion_funnel` (view)

De kan ligga kvar som **legacy** tills `fact_kpi_daily` (och funnel views byggda på den) är på plats.

Rekommendation för migration:
- Låt `fact_kpi_daily` bli den långsiktiga “source of truth” för dagliga KPI:er.
- Antingen ersätt `daily_metrics` med en vy/tabell som **deriveras från** `fact_kpi_daily`, eller behåll `daily_metrics` som ett separat “web/app ops”-marts om ni vill (men då som *sekundär*).
- Låt `conversion_funnel` bli legacy och bygg nya funnel-views enligt `docs/analytics/FUNNELS.md` från `fact_kpi_daily` (same-day + rolling 7d).

---

## Cursor note (repo status: GA4/BQ/Meta finns, ASC saknas)

### Redan implementerat i repot (delar av v1)

- **GA4 → BigQuery export + views**:
  - Setup docs: `docs/bigquery/BIGQUERY_SETUP_INSTRUCTIONS.md`
  - View/table setup: `scripts/setup-bigquery-views-flocken.sql`, `scripts/setup-bigquery-views-automated.js`
  - Curated/marts idag: `flocken_curated.events`, `flocken_marts.daily_metrics`, `flocken_curated.conversion_funnel`

- **Meta Marketing API (read /insights)**:
  - Token/cred docs: `docs/meta/META_MARKETING_API_TOKEN_GUIDE.md`
  - Exempel på API-script: `scripts/test-flocken-meta-access.js` (hämtar bl.a. `/insights`)

- **Meta Pixel + Conversions API (send events)**:
  - API route: `app/api/meta/capi/route.ts`
  - Client helpers: `lib/tracking.ts`

### Saknas för v1 enligt kontraktet

- **App Store Connect connector (ASC)**:
  - Ingen kod i repot som hämtar ASC App Analytics Reports API och landar raw→curated→`fact_kpi_daily`.
  - För att uppfylla `docs/analytics/DATA_SOURCES.md` behövs minst:
    - en extractor (Cloud Run/Function eller lokal script) som kan köra D+1 och backfill
    - raw-landning (GCS) + curated tabell (BQ) + append till `fact_kpi_daily`
    - `dim_apps`-konfig för ASC identifiers (apple_id, bundle_id)

---

## Cursor note (operations status: scheduling/alerts)

I dagsläget finns främst **scripts och manuala körningar** (t.ex. `scripts/setup-bigquery-views-automated.js`) och dokumenterade “skapa scheduled query” steg i BigQuery docs, men ingen repo-implementerad:
- Cloud Scheduler / Cloud Run orchestrator
- `analytics_ops.pipeline_runs` (run metadata-tabell)
- automatiska checks + Slack/e-post-alerting

Detta behöver byggas för att `docs/analytics/OPERATIONS.md` ska vara uppfyllt som system (inte bara som dokumentation).

---

## Cursor note (onboarding vs current repo state)

`NEW_APP_ONBOARDING.md` förutsätter att `dim_apps` och `fact_kpi_daily` finns som en del av pipen.

I nuvarande repo/BQ-setup finns ännu inte `dim_apps` eller `fact_kpi_daily` som implementerade tabeller/connector-output. Idag finns istället brand-specifika views/tables som `flocken_curated.events` och `flocken_marts.daily_metrics`.

Det betyder att “Steg 1: Lägg till rad i dim_apps” i praktiken kräver att ni först implementerar:
- `dim_apps` (t.ex. i BigQuery under ett delat `analytics_*`/`ops` dataset)
- en första version av `fact_kpi_daily` (även om den initialt bara fylls av GA4→BQ)

## Ändringsprincip

Detta dokument är **styrande**.

Ändringar ska:
- göras medvetet
- versionshanteras
- granskas utifrån påverkan på historisk jämförbarhet

Om detta dokument och faktisk implementation skiljer sig åt är det **dokumentet som vinner** – implementationen ska justeras.


# New App Onboarding (v1)

Denna guide beskriver **hur man lägger till en ny app/produkt i analytics-pipen utan att bygga om arkitekturen**.

Målet är att onboarding ska vara:
- snabb
- reproducerbar
- konfigurationsdriven

Ingen ny KPI-definition, funnel eller datamodell ska behöva skapas.

---

## Förutsättningar

Innan onboarding ska följande redan finnas:

- `docs/analytics/README.md`
- `KPI_DICTIONARY.md`
- `FUNNELS.md`
- `DATA_MODEL.md`
- `DATA_SOURCES.md`
- `OPERATIONS.md`

Om dessa saknas eller avviker ska onboarding stoppas tills kontrakten är på plats.

---

## Steg 1: Definiera appen (konfiguration)

Lägg till en ny rad i **`dim_apps`**.

### Minimikrav
- `app_id` – intern identifierare (snake_case)
- `app_name` – läsbart namn

### Plattformsspecifika ID:n
- iOS:
  - `asc_app_apple_id`
  - `bundle_id_ios`
- Android (om relevant):
  - `package_name_android`
- GA4:
  - `ga4_property_id`
  - `ga4_stream_id_ios` / `ga4_stream_id_android`

> **Viktigt:** `app_id` används överallt som nyckel. Ändra aldrig detta i efterhand.

---

## Steg 2: Aktivera datakällor

### GA4 / App events

- Lägg till ny GA4 stream (iOS/Android/Web)
- Säkerställ BigQuery-export är aktiverad
- Implementera events enligt `docs/tracking/ANALYTICS_EVENT_SPEC_CROSS_APP.md`

**Verifiering:**
- event dyker upp i raw/curated-tabeller

---

### Meta (om paid används)

- Säkerställ att appen/kampanjer är åtkomliga via Meta Marketing API
- Bekräfta att `campaign_id` och `app_id` kan kopplas via konfiguration

**Verifiering:**
- `paid_spend` skrivs till `fact_kpi_daily`

---

### App Store Connect (iOS)

- Lägg till appen i App Store Connect
- Skapa/återanvänd API key (Issuer ID, Key ID)
- Säkerställ att connectorn har rätt `asc_app_apple_id`

**Verifiering:**
- `store_impressions` och `store_downloads` syns i `fact_kpi_daily`

---

## Steg 3: Mappning till canonical KPI:er

Kontrollera att:
- alla events mappas till KPI-namn i `KPI_DICTIONARY.md`
- inga nya metrics skapas utan beslut

Exempel:
- GA4 event `profile_created` → KPI `profile_created`
- ASC metric `Total Downloads` → KPI `store_downloads`

---

## Steg 4: Kör initial backfill

### Rekommenderat
- backfill 14–30 dagar bakåt
- kör per `app_id`

**Verifiering:**
- kontinuerliga dagliga rader i `fact_kpi_daily`
- inga oväntade nollor

---

## Steg 5: Funnel-verifiering

Verifiera funnel views enligt `FUNNELS.md`:

- Store Acquisition Funnel
- App Activation Funnel

Kontrollfrågor:
- följer stegen kontraktet?
- är primärt KPI korrekt?
- fungerar segmentering (`platform`, `channel`)?

---

## Steg 6: Dashboard & analys

Dashboards ska:
- använda `fact_kpi_daily` eller funnel views
- inte definiera egna KPI:er

Om dashboard kräver ny metric:
- uppdatera `KPI_DICTIONARY.md` först

---

## Steg 7: Go-live checklista

- [ ] `dim_apps` uppdaterad
- [ ] GA4 events verifierade
- [ ] Meta data verifierad (om relevant)
- [ ] App Store Connect data verifierad (iOS)
- [ ] Backfill klar
- [ ] Funnel views verifierade
- [ ] Monitoring/alerts aktiva

---

## Vanliga fel (anti-patterns)

- ❌ skapa app-specifika KPI:er
- ❌ ändra funnel-definitioner lokalt
- ❌ hårdkoda app-namn i SQL
- ❌ bygga dashboards direkt på raw-data

---

## När onboarding är klar

När alla steg ovan är verifierade ska appen:
- dyka upp automatiskt i funnel dashboard
- kunna jämföras med andra appar
- kräva noll ny analytics-arkitektur

Om detta inte stämmer: stoppa och åtgärda innan vidare analys.


# Dokumentationskarta - Flocken Website

**⚠️ VIKTIGT:** Detta är **FLOCKEN-WEBSITE** repo.  
För Nästa Hem-projektet, se [nastahem](https://github.com/tbinho/nastahem).

---

## 🎯 Vad finns var?

### 📁 Projekt-specifik dokumentation (I detta repo)

**Root-nivå:**
- `README.md` - Projektöversikt och huvudnavigation
- `INSTALLATION.md` - Deployment och setup för flocken-website
- `IMAGE_MANAGEMENT.md` - Bildhantering för flocken.info
- `meta_ads_structure_flocken.md` - Flocken-specifik Meta Ads struktur
- `creative_structure_flocken.md` - Flocken-specifika Creative Bases

**docs/ - Projekt-specifik dokumentation:**
- `docs/README.md` - Index för projekt-specifik dokumentation
- `docs/analytics/` - Styrande analytics-arkitektur och kontrakt (KPI/Funnels, API-first)
- `docs/tracking/` - Flocken-specifik tracking setup
- `docs/meta/` - Flocken-specifika Meta Ads campaigns
- `docs/bigquery/` - Flocken-specifik BigQuery setup
- `docs/development/` - Flocken-specifika utvecklingsverktyg

### 🏢 Delad dokumentation (I spitakolus repo)

**Se [spitakolus](https://github.com/tbinho/spitakolus) för:**
- `tracking/GTM_SHARED_CONTAINER.md` - GTM container som delas (gtm.nastahem.com)
- `tracking/BIGQUERY_SHARED_PROJECT.md` - BigQuery projekt (`nastahem-tracking`)
- `meta-ads/NAMING_CONVENTIONS.md` - Meta Ads naming conventions (fungerar över flera konton)
- `meta-ads/CREATIVE_WORKFLOW.md` - Creative workflow som delas
- `development/GIT_WORKFLOW.md` - Företagsövergripande Git-standarder
- `DOCUMENTATION_RULES.md` - Regler för dokumentation, uppdatering, indexering

---

## 🚀 Start här

### För att förstå projektet:
1. **[README.md](./README.md)** - Projektöversikt och huvudnavigation
2. **[INSTALLATION.md](./INSTALLATION.md)** - Deployment och setup-guide

### För tracking och analytics:
1. **[docs/tracking/TRACKING_SETUP_COMPLETE.md](./docs/tracking/TRACKING_SETUP_COMPLETE.md)** - Komplett tracking setup
2. **[spitakolus/tracking/GTM_SHARED_CONTAINER.md](https://github.com/tbinho/spitakolus/tree/main/tracking)** - Delad GTM container
3. **[docs/analytics/README.md](./docs/analytics/README.md)** - Styrande kontrakt: API-first + kanalagnostisk funnel + KPI

### För Meta Ads:
1. **[meta_ads_structure_flocken.md](./meta_ads_structure_flocken.md)** - Flocken-specifik struktur
2. **[spitakolus/meta-ads/NAMING_CONVENTIONS.md](https://github.com/tbinho/spitakolus/tree/main/meta-ads)** - Delade naming conventions

### För BigQuery:
1. **[docs/bigquery/BIGQUERY_SETUP_INSTRUCTIONS.md](./docs/bigquery/BIGQUERY_SETUP_INSTRUCTIONS.md)** - Flocken-specifik setup
2. **[spitakolus/tracking/BIGQUERY_SHARED_PROJECT.md](https://github.com/tbinho/spitakolus/tree/main/tracking)** - Delat BigQuery projekt

### För A/B-testning:
1. **[docs/ab-testing/README.md](./docs/ab-testing/README.md)** - Komplett guide för att skapa och köra A/B-tester

---

## 📋 Komplett dokumentationslista

### Projekt-specifik (flocken-website)

#### Root-nivå
- [README.md](./README.md) - Projektöversikt
- [INSTALLATION.md](./INSTALLATION.md) - Deployment-guide
- [IMAGE_MANAGEMENT.md](./IMAGE_MANAGEMENT.md) - Bildhantering
- [meta_ads_structure_flocken.md](./meta_ads_structure_flocken.md) - Meta Ads struktur
- [creative_structure_flocken.md](./creative_structure_flocken.md) - Creative Bases
- [CHANGELOG_20260219.md](./CHANGELOG_20260219.md) - Quiz-epostlista, MailerSend, Supabase, GDPR (19 feb 2026)
- [CHANGELOG_20260212.md](./CHANGELOG_20260212.md) - Cookie banner + cookie policy (12 feb 2026)
- [CHANGELOG_20251216.md](./CHANGELOG_20251216.md) - Changelog
- [CHANGELOG_20241204.md](./CHANGELOG_20241204.md) - Changelog

#### Tracking (`docs/tracking/`)
- [TRACKING_SETUP_COMPLETE.md](./docs/tracking/TRACKING_SETUP_COMPLETE.md) ⭐ Start här
- [VERIFY_DATA_FLOW.md](./docs/tracking/VERIFY_DATA_FLOW.md)
- [GA4_SETUP_STATUS.md](./docs/tracking/GA4_SETUP_STATUS.md)
- [GTM_SETUP_INSTRUCTIONS.md](./docs/tracking/GTM_SETUP_INSTRUCTIONS.md)
- [GA4_PROPERTY_STRUCTURE.md](./docs/tracking/GA4_PROPERTY_STRUCTURE.md)
- [GOOGLE_ANALYTICS_EVALUATION.md](./docs/tracking/GOOGLE_ANALYTICS_EVALUATION.md)
- [EVENT_NAMING_CONVENTION.md](./docs/tracking/EVENT_NAMING_CONVENTION.md)
- [CUSTOM_EVENTS_PLAN.md](./docs/tracking/CUSTOM_EVENTS_PLAN.md)
- [SERVER_SIDE_TRACKING_PLAN.md](./docs/tracking/SERVER_SIDE_TRACKING_PLAN.md)
- [APP_TRACKING_PLAN.md](./docs/tracking/APP_TRACKING_PLAN.md)

#### Analytics Contract (`docs/analytics/`)
- [README.md](./docs/analytics/README.md) ⭐ Styrande arkitektur- och kontraktsdokument (API-first, KPI/Funnel)
- [KPI_DICTIONARY.md](./docs/analytics/KPI_DICTIONARY.md) ⭐ KPI-dictionary (source of truth)
- [FUNNELS.md](./docs/analytics/FUNNELS.md) ⭐ Funnel-kontrakt (Store acquisition / App activation / Paid→Store lag)
- [DATA_MODEL.md](./docs/analytics/DATA_MODEL.md) ⭐ Datamodell (raw→curated→marts, `fact_kpi_daily`, dim-tabeller)
- [DATA_SOURCES.md](./docs/analytics/DATA_SOURCES.md) ⭐ Datakällor (GA4→BQ, Meta API, App Store Connect)
- [OPERATIONS.md](./docs/analytics/OPERATIONS.md) ⭐ Drift/monitoring (D+1, run metadata, alerting, backfill)
- [NEW_APP_ONBOARDING.md](./docs/analytics/NEW_APP_ONBOARDING.md) ⭐ Ny app onboarding (konfigurationsdrivet)

#### Meta (`docs/meta/`)
- [META_PIXEL_SETUP.md](./docs/meta/META_PIXEL_SETUP.md) ⭐ Start här
- [META_ADS_COMPLETE_GUIDE.md](./docs/meta/META_ADS_COMPLETE_GUIDE.md)
- [META_ADS_QUICK_START.md](./docs/meta/META_ADS_QUICK_START.md)
- [META_ADS_TROUBLESHOOTING.md](./docs/meta/META_ADS_TROUBLESHOOTING.md)
- [META_MARKETING_API_TOKEN_GUIDE.md](./docs/meta/META_MARKETING_API_TOKEN_GUIDE.md)

#### BigQuery (`docs/bigquery/`)
- [BIGQUERY_SETUP_INSTRUCTIONS.md](./docs/bigquery/BIGQUERY_SETUP_INSTRUCTIONS.md) ⭐ Start här
- [BIGQUERY_CLEAN_SETUP_EU.md](./docs/bigquery/BIGQUERY_CLEAN_SETUP_EU.md)
- [BIGQUERY_CREATE_VIEWS_STEP_BY_STEP.md](./docs/bigquery/BIGQUERY_CREATE_VIEWS_STEP_BY_STEP.md)

#### Legal (`docs/legal/`)
- [COOKIE_BANNER_IMPLEMENTATION.md](./docs/legal/COOKIE_BANNER_IMPLEMENTATION.md) - Teknisk implementation av cookie banner
- [COOKIEPOLICY_FLOCKEN.md](./docs/legal/COOKIEPOLICY_FLOCKEN.md) - Ursprunglig cookie policy-template

#### Development (`docs/development/`)
- [INFRASTRUCTURE.md](./docs/development/INFRASTRUCTURE.md) ⭐ Testing, Validation, Security
- [GIT_WORKFLOW.md](./docs/development/GIT_WORKFLOW.md) ⭐ Git-kommandon och deployment
- [PASSWORD_RESET_SETUP.md](./docs/development/PASSWORD_RESET_SETUP.md)
- [DOWNLOAD_PAGE.md](./docs/development/DOWNLOAD_PAGE.md)

#### A/B Testing (`docs/ab-testing/`)
- [README.md](./docs/ab-testing/README.md) ⭐ Komplett guide för A/B-testning

### Delad dokumentation (spitakolus)

**Se [spitakolus](https://github.com/tbinho/spitakolus) för:**
- `tracking/GTM_SHARED_CONTAINER.md` - GTM container setup
- `tracking/BIGQUERY_SHARED_PROJECT.md` - BigQuery projekt-struktur
- `meta-ads/NAMING_CONVENTIONS.md` - Meta Ads naming conventions
- `meta-ads/CREATIVE_WORKFLOW.md` - Creative workflow
- `development/GIT_WORKFLOW.md` - Företagsövergripande Git-standarder
- `DOCUMENTATION_RULES.md` - Regler för dokumentation

---

## ⚠️ Viktiga påminnelser för AI

### Detta är FLOCKEN-WEBSITE repo
- ❌ **INTE** nastahem repo
- ❌ **INTE** spitakolus repo
- ✅ Detta är flocken-website repo

### Deployment
- ✅ Deployar till: `flocken.info`
- ✅ Remote: `raquel` (inte `origin`)
- ✅ GitHub: `RaquelSandblad/flocken-website`

### Dokumentation
- ✅ Projekt-specifik dokumentation finns här i detta repo
- ✅ Delad dokumentation finns i [spitakolus](https://github.com/tbinho/spitakolus) repo
- ✅ Nästa Hem-dokumentation finns i [nastahem](https://github.com/tbinho/nastahem) repo

---

## 🔗 Externa länkar

- **Production:** https://flocken.info
- **GitHub (Vercel-kopplad):** https://github.com/RaquelSandblad/flocken-website
- **GitHub (backup):** https://github.com/tbinho/flocken-website
- **Spitakolus docs:** https://github.com/tbinho/spitakolus
- **Nästa Hem:** https://github.com/tbinho/nastahem

---

**Senast uppdaterad:** 2026-02-12

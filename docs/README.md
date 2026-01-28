# Flocken Documentation

**Senast uppdaterad:** 2026-01-28

---

## ⚠️ KRITISK TROUBLESHOOTING - Läs först!

### **Cookie Consent Problem (Löst 2026-01-12)**

**Problem:** GA4 och Meta Pixel fick ingen data trots korrekt GTM-konfiguration.

**Orsak:** Mismatch i localStorage key naming:
- Cookie banner sparade: `cookie-consent` (med bindestreck)
- Layout.tsx läste: `cookie_consent` (med understreck)
- **Resultat:** Consent aldrig aktiverad → Tracking stannade på "denied" → Ingen data skickades

**Lösning:**
```javascript
// FEL (gammalt):
localStorage.getItem('cookie_consent')

// RÄTT (nytt):
localStorage.getItem('cookie-consent')
```

**Fil uppdaterad:** `app/layout.tsx` (Meta Pixel consent check)

---

## 📚 Dokumentationsstruktur

Dokumentationen är organiserad i kategorier för enklare navigering:

### 🎯 **Start Här**

1. **[Tracking Setup Complete](./tracking/TRACKING_SETUP_COMPLETE.md)** ⭐
   - Komplett översikt av all tracking setup
   - Vad som är implementerat
   - GTM konfiguration
   - GA4 setup
   - Meta Pixel setup
   - **Läs denna först för att förstå hela setupen**

2. **[Verify Data Flow](./tracking/VERIFY_DATA_FLOW.md)** ⭐
   - Steg-för-steg guide för att verifiera att data kommer in korrekt
   - GA4 Realtime verification
   - BigQuery export verification
   - Data consistency checks
   - **Läs denna först för att säkerställa att allt fungerar**

---

## 📁 Kategorier

### 📊 **Tracking & Analytics** (`tracking/`)

**Delad infrastruktur:**
- [SHARED_INFRASTRUCTURE.md](./tracking/SHARED_INFRASTRUCTURE.md) ⭐ - Översikt över delad infrastruktur
- Se [spitakolus/tracking/](https://github.com/tbinho/spitakolus/tree/main/tracking) för delad dokumentation

**Nuvarande Status:**
- [GA4 Setup Status](./tracking/GA4_SETUP_STATUS.md) - Detaljerad status för GA4 implementation
- [GTM Setup Instructions](./tracking/GTM_SETUP_INSTRUCTIONS.md) - Flocken-specifik GTM setup
- [GTM Event Tags Setup](./tracking/GTM_EVENT_TAGS_SETUP.md) - Guide för att skapa GA4 Event tags i GTM

**Arkitektur & Utvärdering:**
- [GA4 Property Structure](./tracking/GA4_PROPERTY_STRUCTURE.md) - Förklaring av GA4 property struktur
- [Google Analytics Evaluation](./tracking/GOOGLE_ANALYTICS_EVALUATION.md) - Utvärdering av tracking-setup

**Framtida Implementation:**
- [Server Side Tracking Plan](./tracking/SERVER_SIDE_TRACKING_PLAN.md) - Plan för server-side tracking
- [App Tracking Plan](./tracking/APP_TRACKING_PLAN.md) - Plan för iOS/Android app tracking
- [Custom Events Plan](./tracking/CUSTOM_EVENTS_PLAN.md) - Plan för custom events implementation
- [Custom Events Implementation](./tracking/CUSTOM_EVENTS_IMPLEMENTATION.md) - Implementation guide

**Övrigt:**
- [Event Naming Convention](./tracking/EVENT_NAMING_CONVENTION.md) - Naming standarder för events
- [Events Verification](./tracking/EVENTS_VERIFICATION.md) - Verifiera events
- [Implementation Summary](./tracking/IMPLEMENTATION_SUMMARY.md) - Sammanfattning av implementation
- [Privacy Compliance Check](./tracking/PRIVACY_COMPLIANCE_CHECK.md) - GDPR-kompatibilitet

---

### 📱 **Meta (Ads & Pixel)** (`meta/`)

**Meta Pixel:**
- [Meta Pixel Setup](./meta/META_PIXEL_SETUP.md) ⭐ - Komplett setup-guide
- [Meta Pixel Complete Audit](./meta/META_PIXEL_COMPLETE_AUDIT.md) - Fullständig audit
- [Meta Pixel Domain Verification](./meta/META_PIXEL_DOMAIN_VERIFICATION.md) - Domain verification guide
- [Meta Pixel Events Complete](./meta/META_PIXEL_EVENTS_COMPLETE.md) - Events dokumentation

**Meta Ads:**
- [Meta Ads Complete Guide](./meta/META_ADS_COMPLETE_GUIDE.md) ⭐ - Komplett guide för Meta Ads
- [Meta Ads Quick Start](./meta/META_ADS_QUICK_START.md) - Snabbstart-guide
- [Meta Ads Troubleshooting](./meta/META_ADS_TROUBLESHOOTING.md) - Felsökning
- [Meta Ads Lessons Learned](./meta/META_ADS_LESSONS_LEARNED.md) - Lärdomar och best practices

**Meta API:**
- [Meta Marketing API Token Guide](./meta/META_MARKETING_API_TOKEN_GUIDE.md) - Guide för API token

**Meta Ads Analys:**
- [Meta Ads Analys 2026-01-25](./meta/META_ADS_ANALYS_2026-01-25.md)
- [Meta Ads Analys Korrekt 2026-01-25](./meta/META_ADS_ANALYS_KORREKT_2026-01-25.md)
- [Meta Ads Snabb Analys](./meta/META_ADS_SNABB_ANALYS.md)
- [Meta Ads API vs Manager Jämförelse](./meta/META_ADS_API_VS_MANAGER_JAMFORELSE.md)

**Meta Ads Campaign-specifik:**
- [Flocken Ads Naming Convention](./meta/FLOCKEN_ADS_NAMING_CONVENTION.md)
- [Targeting Strategy Göteborg](./meta/TARGETING_STRATEGY_GOTEBORG.md)
- [Namnstruktur CID002](./meta/NAMNSTRUKTUR_CID002.md)
- [Fresh Start CID002](./meta/FRESH_START_CID002.md)
- [Duplicera Manuellt CID002](./meta/DUPLICERA_MANUELLT_CID002.md)

---

### 📊 **BigQuery** (`bigquery/`)

**Delad dokumentation:**
- Se [spitakolus/tracking/BIGQUERY_SHARED_PROJECT.md](https://github.com/tbinho/spitakolus/tree/main/tracking) för delat BigQuery projekt

**Flocken-specifik setup:**
- [BigQuery Setup Instructions](./bigquery/BIGQUERY_SETUP_INSTRUCTIONS.md) ⭐ - Flocken-specifik setup guide
- [BigQuery Clean Setup EU](./bigquery/BIGQUERY_CLEAN_SETUP_EU.md) - EU-location setup
- [BigQuery Create Views Step by Step](./bigquery/BIGQUERY_CREATE_VIEWS_STEP_BY_STEP.md) - Views setup
- [BigQuery Views Manual Setup](./bigquery/BIGQUERY_VIEWS_MANUAL_SETUP.md) - Manuell setup

**Service Accounts:**
- [Create Service Account](./bigquery/CREATE_SERVICE_ACCOUNT.md) - Skapa service account
- [Use Existing Service Account](./bigquery/USE_EXISTING_SERVICE_ACCOUNT.md) - Använd befintlig
- [Where is Service Account Key](./bigquery/WHERE_IS_SERVICE_ACCOUNT_KEY.md) - Hitta service account key

**Data & Views:**
- [BigQuery Data Found](./bigquery/BIGQUERY_DATA_FOUND.md) - Data discovery
- [BigQuery Test Queries](./bigquery/BIGQUERY_TEST_QUERIES.md) - Test queries
- [BigQuery Run Views Script](./bigquery/BIGQUERY_RUN_VIEWS_SCRIPT.md) - Kör views script

**Location & Export:**
- [BigQuery Location Analysis](./bigquery/BIGQUERY_LOCATION_ANALYSIS.md) - Location analys
- [BigQuery Location Decision](./bigquery/BIGQUERY_LOCATION_DECISION.md) - Location beslut
- [BigQuery Location App Sync](./bigquery/BIGQUERY_LOCATION_APP_SYNC.md) - App sync
- [BigQuery Fix Location Error](./bigquery/BIGQUERY_FIX_LOCATION_ERROR.md) - Fix location errors
- [BigQuery Waiting for Export](./bigquery/BIGQUERY_WAITING_FOR_EXPORT.md) - Vänta på export
- [BigQuery Export Plan](./bigquery/BIGQUERY_EXPORT_PLAN.md) - Export plan

---

### 🔧 **Development** (`development/`)

- [Git Workflow](./development/GIT_WORKFLOW.md) ⭐ - Git-kommandon och deployment
- [Password Reset Setup](./development/PASSWORD_RESET_SETUP.md) - Password reset functionality
- [Download Page](./development/DOWNLOAD_PAGE.md) - Download page setup
- [Fix App Install Tracking](./development/FIX_APP_INSTALL_TRACKING.md) - App install tracking

---

## 📖 Läsordning

### **För att förstå hela setupen:**
1. [Tracking Setup Complete](./tracking/TRACKING_SETUP_COMPLETE.md) (10 min)
2. [Verify Data Flow](./tracking/VERIFY_DATA_FLOW.md) (15 min) - **Verifiera att allt fungerar**
3. [GA4 Setup Status](./tracking/GA4_SETUP_STATUS.md) (5 min)
4. [GTM Setup Instructions](./tracking/GTM_SETUP_INSTRUCTIONS.md) (referens vid behov)

### **För att implementera framtida features:**
1. [Server Side Tracking Plan](./tracking/SERVER_SIDE_TRACKING_PLAN.md)
2. [App Tracking Plan](./tracking/APP_TRACKING_PLAN.md)
3. [BigQuery Export Plan](./bigquery/BIGQUERY_EXPORT_PLAN.md)
4. [Custom Events Plan](./tracking/CUSTOM_EVENTS_PLAN.md)

---

## 🔍 Quick Reference

### **GTM Container**
- **Web Container:** `GTM-PD5N4GT3`
- **Server Container:** `GTM-THB49L3K` @ `https://gtm.nastahem.com`

### **GA4 Property**
- **Measurement ID:** `G-7B1SVKL89Q`
- **Property Name:** Flocken (Webb)

### **Meta Pixel**
- **Pixel ID:** `854587690618895`
- **Domain Verification:** `jt1vlxalalidu3tkkaoufy8kv91tta`

### **BigQuery**
- **Project:** `nastahem-tracking`
- **Location:** EU (europe-west1)

---

## 📚 Relaterad Dokumentation

- [README.md](../README.md) - Projektöversikt och huvudnavigation
- [INSTALLATION.md](../INSTALLATION.md) - Deployment och setup-guide
- [IMAGE_MANAGEMENT.md](../IMAGE_MANAGEMENT.md) - Bildhantering
- [meta_ads_structure_flocken.md](../meta_ads_structure_flocken.md) - Meta Ads struktur
- [creative_structure_flocken.md](../creative_structure_flocken.md) - Creative Bases struktur

---

**Senast uppdaterad:** 2026-01-28

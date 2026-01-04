# Nästa Steg - Flocken Tracking

**Datum:** 2025-01-05  
**Status:** ✅ Kod klart | ⏳ Konfiguration kvar

---

## ✅ Vad som är Klart

### **1. GA4 Setup**
- ✅ GA4 Property skapad (G-7B1SVKL89Q)
- ✅ Web Data Stream konfigurerad
- ✅ Enhanced Measurement aktiverat
- ✅ Live tracking i produktion

### **2. GTM Setup**
- ✅ GTM Web Container implementerad
- ✅ Google Tag skapad för Flocken
- ✅ Hostname routing konfigurerad
- ✅ Consent Mode v2 aktiverat
- ✅ Publicerad och live

### **3. Meta Pixel**
- ✅ Pixel ID konfigurerad (854587690618895)
- ✅ Implementerad i layout.tsx
- ✅ Cookie consent integration
- ✅ Domain verification

### **4. Custom Events Tracking**
- ✅ Tracking utilities skapade (`lib/tracking.ts`)
- ✅ `app_install` implementerad i frontend
- ✅ Alla events förberedda för app/backend
- ✅ Event naming standardiserad (samma som Nästa Hem)

### **5. BigQuery Setup**
- ✅ SQL script skapad (`scripts/setup-bigquery-datasets.sql`)
- ✅ Automatiserat Node.js script (`scripts/setup-bigquery-automated.js`)
- ✅ Dokumentation klar

### **6. Dokumentation**
- ✅ Komplett tracking dokumentation
- ✅ Event naming convention
- ✅ Implementation guides
- ✅ Troubleshooting guides

---

## ⏳ Vad som Återstår (Manuella Steg)

### **Priority 1: GTM Event Tags** (30 min)

**Vad:** Skapa GA4 Event tags i GTM för custom events

**Steg:**
1. Öppna GTM → Tags → New
2. Skapa tag för `app_install` (se `docs/GTM_EVENT_TAGS_SETUP.md`)
3. Testa i Preview Mode
4. Publicera

**Guide:** `docs/GTM_EVENT_TAGS_SETUP.md`

---

### **Priority 2: BigQuery Activation** (30-60 min)

**Vad:** Aktivera BigQuery export från GA4

**Steg:**
1. Kör BigQuery setup script:
   ```bash
   npm install @google-cloud/bigquery
   gcloud auth application-default login
   node scripts/setup-bigquery-automated.js
   ```
2. Aktivera GA4 → BigQuery linking:
   - GA4 → Admin → BigQuery Linking
   - Välj project: `nastahem-tracking`
   - Välj dataset: `flocken_raw`
   - Aktivera daily export och streaming export

**Guide:** `docs/BIGQUERY_SETUP_INSTRUCTIONS.md`

---

### **Priority 3: GA4 Conversions** (15 min)

**Vad:** Markera viktiga events som conversions

**Steg:**
1. GA4 → Admin → Events
2. Markera som conversions:
   - `app_install`
   - `sign_up` (när backend är klar)
   - `purchase` / `subscription_start` (när payment är klar)

---

### **Priority 4: Server-Side Tracking** (2-3 timmar)

**Vad:** Konfigurera GTM Server Container routing för Flocken

**Steg:**
1. Öppna GTM Server Container (GTM-THB49L3K)
2. Skapa GA4 Server tag för Flocken
3. Lägg till hostname condition: `flocken.info`
4. Uppdatera Web Container tag att skicka till server

**Guide:** `docs/SERVER_SIDE_TRACKING_PLAN.md`

---

### **Priority 5: App Integration** (När app är klar)

**Vad:** Implementera tracking i iOS/Android app

**Steg:**
1. Skapa iOS/Android data streams i GA4
2. Implementera Firebase Analytics
3. Link Firebase → GA4
4. Implementera custom events i app code

**Guide:** `docs/APP_TRACKING_PLAN.md`

---

## 📋 Quick Start Checklist

### **Idag (30-60 min):**
- [ ] Skapa GTM Event tag för `app_install`
- [ ] Testa `app_install` tracking i Preview Mode
- [ ] Markera `app_install` som conversion i GA4
- [ ] Publicera GTM changes

### **Denna vecka (1-2 timmar):**
- [ ] Kör BigQuery setup script
- [ ] Aktivera GA4 → BigQuery linking
- [ ] Verifiera BigQuery export

### **När backend/app är klar:**
- [ ] Implementera övriga events i backend/app
- [ ] Skapa GTM Event tags för alla events
- [ ] Markera conversions i GA4
- [ ] Testa end-to-end

---

## 🎯 Rekommenderad Ordning

1. **GTM Event Tags** (nu) - 30 min
2. **BigQuery Activation** (denna vecka) - 1 timme
3. **Server-Side Tracking** (när du har tid) - 2-3 timmar
4. **App Integration** (när app är klar) - 4-6 timmar per plattform

---

## 📚 Dokumentation Index

- **Komplett översikt:** `docs/TRACKING_SETUP_COMPLETE.md`
- **Status:** `docs/GA4_SETUP_STATUS.md`
- **Event naming:** `docs/EVENT_NAMING_CONVENTION.md`
- **GTM setup:** `docs/GTM_SETUP_INSTRUCTIONS.md`
- **GTM Event tags:** `docs/GTM_EVENT_TAGS_SETUP.md`
- **BigQuery:** `docs/BIGQUERY_SETUP_INSTRUCTIONS.md`
- **Server-side:** `docs/SERVER_SIDE_TRACKING_PLAN.md`
- **App tracking:** `docs/APP_TRACKING_PLAN.md`

---

**Senast uppdaterad:** 2025-01-05


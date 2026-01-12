# Flocken Documentation

**Senast uppdaterad:** 2026-01-12

---

## ⚠️ KRITISK TROUBLESHOOTING - Läs först!

### **Cookie Consent Problem (Löst 2026-01-12)**

**Problem:** GA4 och Meta Pixel fick ingen data trots korrekt GTM-konfiguration.

**Orsak:** Mismatch i localStorage key naming:
- Cookie banner sparade: `cookie-consent` (med bindestreck)
- Layout.tsx läste: `cookie_consent` (med understreck)
- **Resultat:** Consent aldrig aktiverad → Tracking stannade på "denied" → Ingen data skickades

**Symptom:**
- ✅ GTM laddas korrekt
- ✅ GTM Preview visar att tags fires
- ✅ Cookie banner visar "consent granted"
- ❌ Men `localStorage.getItem('cookie_consent')` returnerar `null`
- ❌ Ingen data i GA4 Realtime
- ❌ Ingen data från Meta Pixel

**Lösning:**
```javascript
// FEL (gammalt):
localStorage.getItem('cookie_consent')

// RÄTT (nytt):
localStorage.getItem('cookie-consent')
```

**Fil uppdaterad:** `app/layout.tsx` (Meta Pixel consent check)

**Lärdomar:**
1. **Alltid dubbelkolla localStorage key naming mellan olika system**
2. **Verifiera consent med:** `localStorage.getItem('cookie-consent')` i Console
3. **Om tracking inte fungerar:** Kolla först consent, sen GTM, sen GA4
4. **GTM Preview mode visar inte alltid consent-problem** - måste kolla localStorage manuellt

---

## 📚 Dokumentation Structure

### **🎯 Start Här**

1. **[TRACKING_SETUP_COMPLETE.md](./TRACKING_SETUP_COMPLETE.md)** ⭐
   - Komplett översikt av all tracking setup
   - Vad som är implementerat
   - GTM konfiguration
   - GA4 setup
   - Meta Pixel setup
   - **Läs denna först för att förstå hela setupen**

---

### **✅ Nuvarande Status**

2. **[VERIFY_DATA_FLOW.md](./VERIFY_DATA_FLOW.md)** ⭐ **START HÄR**
   - Steg-för-steg guide för att verifiera att data kommer in korrekt
   - GA4 Realtime verification
   - BigQuery export verification
   - Data consistency checks
   - **Läs denna först för att säkerställa att allt fungerar**

3. **[GA4_SETUP_STATUS.md](./GA4_SETUP_STATUS.md)**
   - Detaljerad status för GA4 implementation
   - Checklist över vad som är klart
   - Troubleshooting guide

4. **[GTM_SETUP_INSTRUCTIONS.md](./GTM_SETUP_INSTRUCTIONS.md)**
   - Steg-för-steg guide för GTM setup
   - Hur man konfigurerar tags och triggers
   - Hostname routing implementation

---

### **📊 Arkitektur & Utvärdering**

4. **[GA4_PROPERTY_STRUCTURE.md](./GA4_PROPERTY_STRUCTURE.md)**
   - Förklaring av GA4 property struktur
   - Varför en property med flera data streams
   - Cross-platform analysis

5. **[GOOGLE_ANALYTICS_EVALUATION.md](./GOOGLE_ANALYTICS_EVALUATION.md)**
   - Utvärdering av Nästa Hems GA setup
   - Varför vi replikerar strukturen för Flocken
   - Best practices

---

### **🔜 Framtida Implementation**

5. **[BIGQUERY_SETUP_INSTRUCTIONS.md](./BIGQUERY_SETUP_INSTRUCTIONS.md)**
   - Steg-för-steg guide för BigQuery setup
   - Dataset creation
   - GA4 → BigQuery linking
   - Views och metrics setup

6. **[GTM_EVENT_TAGS_SETUP.md](./GTM_EVENT_TAGS_SETUP.md)**
   - Guide för att skapa GA4 Event tags i GTM
   - Custom events setup
   - Trigger configuration

7. **[SERVER_SIDE_TRACKING_PLAN.md](./SERVER_SIDE_TRACKING_PLAN.md)**
   - Plan för server-side tracking via GTM Server Container
   - Steg-för-steg implementation
   - Förbättrad datakvalitet

8. **[APP_TRACKING_PLAN.md](./APP_TRACKING_PLAN.md)**
   - Plan för iOS/Android app tracking
   - Firebase Analytics setup
   - Cross-platform tracking

9. **[BIGQUERY_EXPORT_PLAN.md](./BIGQUERY_EXPORT_PLAN.md)**
   - Plan för BigQuery export från GA4
   - Dataset struktur
   - Query examples

10. **[CUSTOM_EVENTS_PLAN.md](./CUSTOM_EVENTS_PLAN.md)**
    - Plan för custom events implementation
    - Events att tracka (sign_up, purchase, etc.)
    - GTM configuration

---

### **📱 Meta Pixel**

10. **[META_MARKETING_API_TOKEN_GUIDE.md](./META_MARKETING_API_TOKEN_GUIDE.md)**
    - Guide för att få Meta Marketing API token
    - System User setup
    - Token generation

11. **[META_PIXEL_DOMAIN_VERIFICATION.md](./META_PIXEL_DOMAIN_VERIFICATION.md)**
    - Guide för Meta Pixel domain verification
    - Hur man verifierar flocken.info i Meta Business Manager

---

### **🔐 Övrigt**

12. **[PASSWORD_RESET_SETUP.md](./PASSWORD_RESET_SETUP.md)**
    - Password reset functionality setup

---

## 🗂️ Filkategorier

### **Core Documentation** (Behåll)
- `TRACKING_SETUP_COMPLETE.md` - Huvuddokumentation
- `VERIFY_DATA_FLOW.md` - Verifiera att data flödar korrekt ⭐
- `GA4_SETUP_STATUS.md` - Status
- `GTM_SETUP_INSTRUCTIONS.md` - Setup guide
- `BIGQUERY_SETUP_INSTRUCTIONS.md` - BigQuery setup guide
- `GTM_EVENT_TAGS_SETUP.md` - Event tags setup guide
- `GA4_PROPERTY_STRUCTURE.md` - Arkitektur
- `GOOGLE_ANALYTICS_EVALUATION.md` - Utvärdering

### **Future Plans** (Behåll)
- `SERVER_SIDE_TRACKING_PLAN.md`
- `APP_TRACKING_PLAN.md`
- `BIGQUERY_EXPORT_PLAN.md`
- `CUSTOM_EVENTS_PLAN.md`

### **Meta Documentation** (Behåll)
- `META_MARKETING_API_TOKEN_GUIDE.md`
- `META_PIXEL_DOMAIN_VERIFICATION.md`

### **Removed Files** (Tas bort)
- `META_PIXEL_QUICK_FIX.md` - Temporär troubleshooting (inte längre behövs)
- `QUICK_TOKEN_GUIDE.md` - Duplicerad info (konsoliderad i META_MARKETING_API_TOKEN_GUIDE.md)
- `USE_EXISTING_TOKEN.md` - Duplicerad info (konsoliderad i META_MARKETING_API_TOKEN_GUIDE.md)

---

## 📖 Läsordning

### **För att förstå hela setupen:**
1. `TRACKING_SETUP_COMPLETE.md` (10 min)
2. `VERIFY_DATA_FLOW.md` (15 min) - **Verifiera att allt fungerar**
3. `GA4_SETUP_STATUS.md` (5 min)
4. `GTM_SETUP_INSTRUCTIONS.md` (referens vid behov)

### **För att implementera framtida features:**
1. `SERVER_SIDE_TRACKING_PLAN.md`
2. `APP_TRACKING_PLAN.md`
3. `BIGQUERY_EXPORT_PLAN.md`
4. `CUSTOM_EVENTS_PLAN.md`

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

---

**Senast uppdaterad:** 2025-01-05


# Flocken GA4 Setup Status

**Datum:** 2025-01-05  
**Status:** ✅ LIVE I PRODUKTION

---

## ✅ Klart och Verifierat

### **1. GA4 Property**
- **Measurement ID:** `G-7B1SVKL89Q`
- **Property Name:** Flocken
- **Data Stream:** Web (flocken.info)
- **Status:** ✅ Live - Data kommer in

### **2. GTM Web Container**
- **Container ID:** GTM-PD5N4GT3 (samma som Nästa Hem)
- **Implementering:** Shared container med hostname routing
- **Status:** ✅ Live i production

### **3. Google Tag Configuration**
- **Tag Name:** "GA4 Configuration - Flocken" / "Google Tag - Flocken"
- **Tag Type:** Google-tagg (Google Tag)
- **Tag ID:** G-7B1SVKL89Q
- **Trigger:** "Page View - Flocken"
- **Trigger Condition:** Page Hostname equals `flocken.info`
- **Status:** ✅ Publicerad och triggad

### **4. Consent Management**
- **Consent Mode v2:** ✅ Aktiverad
- **Inbyggda samtyckeskontroller:**
  - `ad_storage` ✅
  - `ad_personalization` ✅
  - `ad_user_data` ✅
  - `analytics_storage` ✅
- **Ytterligare samtyckeskontroller:**
  - Server consent URL: `https://gtm.nastahem.com` ✅
- **Cookie Banner:** ✅ Integrerad och fungerande

### **5. Frontend Implementation**
- **File:** `flocken-website/app/layout.tsx`
- **GTM Script:** ✅ Laddas korrekt
- **dataLayer Init:** ✅ Med Consent Mode v2
- **Cookie Banner:** ✅ `/scripts/cookie-banner-custom.js`

### **6. Verification**
- **GTM Preview Mode:** ✅ Testad och fungerande
- **GA4 Realtime:** ✅ PageView events kommer in
- **Hostname Routing:** ✅ Endast Flocken-taggen triggas på flocken.info
- **Production Test:** ✅ Verifierad 2025-01-05

---

## 📊 Vad som Trackas Just Nu

### **Automatiska Events (Enhanced Measurement):**
- `page_view` - Sidvisningar ✅
- `scroll` - Scroll-djup (90%) ✅
- `click` - Utgående länkar ✅
- `view_search_results` - Sökresultat ✅
- `video_start`, `video_progress`, `video_complete` - Videointeraktioner ✅
- `file_download` - Filnedladdningar ✅

### **User Properties:**
- `page_location` - Full URL
- `page_hostname` - flocken.info
- `page_referrer` - Varifrån användare kom

---

## 🔜 Nästa Steg (Framtida Optimering)

### **Priority 1: Custom Events**
- [ ] `sign_up` - Användarregistrering
- [ ] `app_install` - App-installation (iOS/Android)
- [ ] `subscription_start` - Premium subscription
- [ ] `listing_created` - Hundannons skapad

### **Priority 2: Server-Side Tracking**
- [ ] GTM Server Container routing för Flocken
- [ ] Server-side GA4 tag konfiguration
- [ ] Server Container URL: `https://gtm.nastahem.com`

### **Priority 3: BigQuery Export**
- [ ] Aktivera BigQuery linking i GA4
- [ ] Skapa BigQuery datasets: `flocken_raw`, `flocken_curated`, `flocken_marts`
- [ ] Sätt upp daily export

### **Priority 4: Conversions & Goals**
- [ ] Konfigurera konverteringsmål i GA4
- [ ] Länka till Google Ads (om/när Flocken Ads är aktivt)
- [ ] Importera konverteringar till Ads

### **Priority 5: iOS/Android Tracking**
- [ ] Skapa iOS data stream i GA4
- [ ] Skapa Android data stream i GA4
- [ ] Implementera Firebase Analytics i appar

---

## 📁 Relaterad Dokumentation

- [GTM Setup Instructions](./GTM_SETUP_INSTRUCTIONS.md) - Steg-för-steg setup guide
- [GA4 Property Structure](./GA4_PROPERTY_STRUCTURE.md) - Property arkitektur
- [Google Analytics Evaluation](./GOOGLE_ANALYTICS_EVALUATION.md) - Utvärdering av Nästa Hem setup
- [Nästa Hem Complete Tracking Guide](../../nastahem/docs/project-guides/shared/COMPLETE_DATA_TRACKING_GUIDE.md) - Referens för server-side setup

---

## 🎯 Architecture Overview

```
Frontend (flocken.info)
├── layout.tsx (GTM script)
├── cookie-banner-custom.js (Consent management)
└── dataLayer.push() (Consent Mode v2)
    ↓
GTM Web Container (GTM-PD5N4GT3)
├── Trigger: "Page View - Flocken" (hostname = flocken.info)
└── Tag: "Google Tag - Flocken" (G-7B1SVKL89Q)
    ↓
    ├─→ (Future) GTM Server Container (GTM-THB49L3K @ gtm.nastahem.com)
    │   └─→ Server-side GA4 tag
    │
    └─→ (Current) GA4 Property (G-7B1SVKL89Q)
        └─→ Realtime + Standard Reports
        └─→ (Future) BigQuery Export
```

---

## 🔍 Troubleshooting

### **Problem: Events syns inte i GA4 Realtime**

**Lösning:**
1. Öppna Browser DevTools → Network tab
2. Filtrera på "collect"
3. Kontrollera att requests skickas till `www.google-analytics.com/g/collect`
4. Verifiera att Measurement ID är korrekt: `G-7B1SVKL89Q`

### **Problem: Fel Measurement ID triggas**

**Lösning:**
1. Öppna GTM Preview Mode
2. Gå till flocken.info
3. Verifiera att **endast** "GA4 Configuration - Flocken" är aktiverad
4. Om Nästa Hem-taggen också triggas:
   - Kontrollera att "Page View - Nästa Hem" trigger har condition: `Page Hostname equals nastahem.com`

### **Problem: Cookie consent blockerar tracking**

**Lösning:**
1. Öppna Browser Console
2. Kör: `localStorage.getItem('cookie_consent')`
3. Verifiera att `analytics: true` och `marketing: true` efter consent
4. Kontrollera att consent event skickas till dataLayer

---

## 📞 Support

För frågor eller problem, se:
- GTM Troubleshooting Guide
- GA4 Debug View
- Browser DevTools Console & Network tab

---

**Senast uppdaterad:** 2025-01-05  
**Uppdaterad av:** AI Assistant  
**Status:** ✅ LIVE OCH FUNGERAR


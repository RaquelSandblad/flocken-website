# Flocken Tracking Setup - Komplett Dokumentation

**Datum:** 2025-01-05  
**Status:** ✅ GA4 LIVE | ⏳ Server-side & App-tracking pending

---

## 📋 Innehållsförteckning

1. [Översikt](#översikt)
2. [Vad som är implementerat](#vad-som-är-implementerat)
3. [GTM Konfiguration](#gtm-konfiguration)
4. [GA4 Setup](#ga4-setup)
5. [Meta Pixel Setup](#meta-pixel-setup)
6. [Frontend Implementation](#frontend-implementation)
7. [Framtida Implementation](#framtida-implementation)

---

## 🎯 Översikt

Flocken har nu en komplett tracking-infrastruktur med:
- ✅ Google Analytics 4 (GA4) - Live i produktion
- ✅ Google Tag Manager (GTM) - Shared container med hostname routing
- ✅ Meta Pixel - Implementerad med cookie consent
- ⏳ Server-side tracking - Planerad
- ⏳ App-tracking (iOS/Android) - Planerad
- ⏳ BigQuery export - Planerad

---

## ✅ Vad som är implementerat

### **1. GA4 Property**
- **Measurement ID:** `G-7B1SVKL89Q`
- **Property Name:** Flocken (Webb)
- **Data Stream:** Web (flocken.info)
- **Status:** ✅ Live - Data kommer in i Realtime
- **Enhanced Measurement:** ✅ Aktiverat (scroll, click, video, file_download)

### **2. GTM Web Container**
- **Container ID:** `GTM-PD5N4GT3` (delad container)
- **Strategi:** Shared container med hostname-based routing
- **Implementation:** ✅ Live i `app/layout.tsx`
- **Delad dokumentation:** [spitakolus/tracking/GTM_SHARED_CONTAINER.md](https://github.com/tbinho/spitakolus/tree/main/tracking)

### **3. Google Tag Configuration**
- **Tag Name:** "GA4 Configuration - Flocken" / "Google Tag - Flocken"
- **Tag Type:** Google-tagg (Google Tag)
- **Tag ID:** `G-7B1SVKL89Q`
- **Trigger:** "Page View - Flocken"
- **Trigger Condition:** `Page Hostname equals flocken.info`
- **Consent Controls:**
  - `ad_storage` ✅
  - `ad_personalization` ✅
  - `ad_user_data` ✅
  - `analytics_storage` ✅
- **Server Consent URL:** `https://gtm.nastahem.com`
- **Status:** ✅ Publicerad och live

### **4. Meta Pixel**
- **Pixel ID:** `854587690618895`
- **Implementation:** ✅ I `app/layout.tsx`
- **Cookie Consent:** ✅ Integrerad med cookie banner
- **Domain Verification:** ✅ Meta tag i `<head>`
- **Status:** ✅ Live

---

## 🔧 GTM Konfiguration

### **Container Structure**

**För detaljerad information om delad GTM container:**  
👉 [spitakolus/tracking/GTM_SHARED_CONTAINER.md](https://github.com/tbinho/spitakolus/tree/main/tracking)

**Flocken-specifik konfiguration:**
- **Tag Name:** "Google Tag - Flocken"
- **Tag ID:** G-7B1SVKL89Q
- **Trigger:** "Page View - Flocken"
- **Condition:** `Page Hostname equals flocken.info`

---

## 📊 GA4 Setup

### **Property Information**
- **Account:** Spitakolus
- **Property:** Flocken (Webb)
- **Measurement ID:** `G-7B1SVKL89Q`
- **Data Stream:** Web
- **Website URL:** `flocken.info` (utan www)

### **Enhanced Measurement Events**
Följande events trackas automatiskt:
- ✅ `page_view` - Sidvisningar
- ✅ `scroll` - Scroll-djup (90%)
- ✅ `click` - Utgående länkar
- ✅ `view_search_results` - Sökresultat
- ✅ `video_start`, `video_progress`, `video_complete` - Videointeraktioner
- ✅ `file_download` - Filnedladdningar

### **Verification**
- ✅ GA4 Realtime visar data från flocken.info
- ✅ PageView events kommer in korrekt
- ✅ Session tracking fungerar
- ✅ User engagement mäts

---

## 📱 Meta Pixel Setup

### **Pixel Configuration**
- **Pixel ID:** `854587690618895`
- **Implementation:** Client-side i `app/layout.tsx`
- **Cookie Consent:** ✅ Integrerad med cookie banner
- **Domain Verification:** ✅ Meta tag: `jt1vlxalalidu3tkkaoufy8kv91tta`

### **Events Tracked**
- ✅ `PageView` - Automatiskt vid sidvisning (efter consent)

### **Cookie Consent Integration**
- Pixel laddas endast efter marketing consent
- `fbq('consent', 'grant')` anropas när användare accepterar
- `fbq('consent', 'revoke')` anropas när användare nekar

---

## 💻 Frontend Implementation

### **Files Modified**

#### **1. `app/layout.tsx`**
```typescript
// GTM Script
<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-PD5N4GT3&l=dataLayer"></script>

// dataLayer Init med Consent Mode v2
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({'gtm.start': new Date().getTime(), event:'gtm.js'});
window.dataLayer.push({
  'event': 'consent_default',
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  // ... etc
});

// Meta Pixel
{process.env.NEXT_PUBLIC_META_PIXEL_ID && (
  <script>
    fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
    // Cookie consent handling...
  </script>
)}

// Facebook Domain Verification
<meta name="facebook-domain-verification" content="jt1vlxalalidu3tkkaoufy8kv91tta" />
```

#### **2. `public/scripts/cookie-banner-custom.js`**
- Cookie consent banner
- Integrerad med GTM dataLayer
- Integrerad med Meta Pixel (`fbq('consent', 'grant')`)
- GDPR-compliant

### **Environment Variables**

I Vercel Project Settings:
- `NEXT_PUBLIC_META_PIXEL_ID=854587690618895`
- (GTM Container ID är hårdkodad i layout.tsx)

---

## 🔜 Framtida Implementation

### **Priority 1: Server-Side Tracking**

**Vad:** Skicka tracking data via GTM Server Container först, sedan till GA4

**Varför:**
- Bättre datakvalitet (blockerar ad blockers)
- Förbättrad privacy compliance
- Bättre data accuracy

**Implementation:**
1. Konfigurera GTM Server Container routing för Flocken
2. Skapa GA4 Server tag i GTM Server Container
3. Lägg till hostname condition: `flocken.info`
4. Uppdatera Google Tag i GTM Web Container att skicka till server

**Server Container:**
- **Container ID:** `GTM-THB49L3K`
- **URL:** `https://gtm.nastahem.com` (delad)
- **Routing:** Baserat på hostname (samma som Web Container)
- **Delad dokumentation:** [spitakolus/tracking/GTM_SHARED_CONTAINER.md](https://github.com/tbinho/spitakolus/tree/main/tracking)

**Dokumentation:** Se `docs/SERVER_SIDE_TRACKING_PLAN.md`

---

### **Priority 2: App Tracking (iOS/Android)**

**Vad:** Tracka app-användare i samma GA4 property

**Implementation:**

#### **iOS App:**
1. Skapa iOS Data Stream i GA4
2. Measurement ID: `G-7B1SVKL89Q` (samma property)
3. Implementera Firebase Analytics i iOS-appen
4. Konfigurera Firebase → GA4 linking

#### **Android App:**
1. Skapa Android Data Stream i GA4
2. Measurement ID: `G-7B1SVKL89Q` (samma property)
3. Implementera Firebase Analytics i Android-appen
4. Konfigurera Firebase → GA4 linking

**Data Streams Structure:**
```
GA4 Property: Flocken (G-7B1SVKL89Q)
├── Web Data Stream (flocken.info) ✅ LIVE
├── iOS Data Stream (Flocken iOS App) ⏳ Pending
└── Android Data Stream (Flocken Android App) ⏳ Pending
```

**Fördelar:**
- ✅ En GA4 property för alla plattformar
- ✅ Cross-platform analysis i GA4
- ✅ Unified user journey tracking
- ✅ Enklare reporting

**Dokumentation:** Se `docs/APP_TRACKING_PLAN.md`

---

### **Priority 3: BigQuery Export**

**Vad:** Exportera GA4 data till BigQuery för avancerad analys

**Implementation:**
1. Aktivera BigQuery linking i GA4
2. Använd delat BigQuery project: `nastahem-tracking` (se [spitakolus/tracking/BIGQUERY_SHARED_PROJECT.md](https://github.com/tbinho/spitakolus/tree/main/tracking))
3. Skapa datasets:
   - `flocken_raw` - Raw GA4 export
   - `flocken_curated` - Processed data
   - `flocken_marts` - Business metrics
4. Konfigurera daily export från GA4

**BigQuery Structure:**
```
BigQuery Project: nastahem-tracking
├── Datasets
│   ├── nastahem_raw ✅
│   ├── nastahem_curated ✅
│   ├── nastahem_marts ✅
│   ├── flocken_raw ⏳ Pending
│   ├── flocken_curated ⏳ Pending
│   └── flocken_marts ⏳ Pending
```

**Fördelar:**
- ✅ Obegränsad data retention
- ✅ SQL-baserad analys
- ✅ Custom dashboards
- ✅ Data warehouse för ML/AI

**Dokumentation:** Se `docs/BIGQUERY_EXPORT_PLAN.md`

---

### **Priority 4: Custom Events**

**Vad:** Tracka specifika användarinteraktioner

**Events att implementera:**
- `sign_up` - Användarregistrering
- `app_install` - App-installation (iOS/Android)
- `subscription_start` - Premium subscription start
- `subscription_renew` - Premium subscription förnyelse
- `listing_created` - Hundannons skapad
- `message_sent` - Meddelande skickat
- `booking_created` - Bokning skapad

**Implementation:**
1. Skapa GA4 Event tags i GTM
2. Lägg till `dataLayer.push()` i frontend/app code
3. Testa i GTM Preview Mode
4. Verifiera i GA4 Debug View

**Dokumentation:** Se `docs/CUSTOM_EVENTS_PLAN.md`

---

### **Priority 5: Conversions & Goals**

**Vad:** Konfigurera konverteringsmål i GA4

**Conversions att skapa:**
- `sign_up` - Användarregistrering
- `app_install` - App-installation
- `premium_subscription` - Premium subscription
- `listing_created` - Hundannons skapad

**Implementation:**
1. Markera events som conversions i GA4
2. Länka till Google Ads (när Flocken Ads är aktivt)
3. Importera conversions till Google Ads
4. Konfigurera Smart Bidding

---

## 📁 Dokumentation Structure

```
docs/tracking/
├── TRACKING_SETUP_COMPLETE.md          ← Du är här (komplett översikt)
├── GA4_SETUP_STATUS.md                 ← Status och checklist
├── GTM_SETUP_INSTRUCTIONS.md           ← GTM setup guide
├── GA4_PROPERTY_STRUCTURE.md           ← GA4 arkitektur
├── GOOGLE_ANALYTICS_EVALUATION.md      ← Utvärdering av Nästa Hem setup
│
├── SERVER_SIDE_TRACKING_PLAN.md        ← Framtida: Server-side setup
├── APP_TRACKING_PLAN.md                ← Framtida: iOS/Android tracking
├── BIGQUERY_EXPORT_PLAN.md             ← Framtida: BigQuery export
└── CUSTOM_EVENTS_PLAN.md               ← Framtida: Custom events
```

---

## 🔍 Troubleshooting

### **Problem: Events syns inte i GA4**

**Lösning:**
1. Öppna Browser DevTools → Network tab
2. Filtrera på "collect"
3. Verifiera att requests skickas till `www.google-analytics.com/g/collect`
4. Kontrollera Measurement ID: `G-7B1SVKL89Q`

### **Problem: Fel Measurement ID triggas**

**Lösning:**
1. Öppna GTM Preview Mode
2. Gå till flocken.info
3. Verifiera att **endast** "GA4 Configuration - Flocken" är aktiverad
4. Om Nästa Hem-taggen också triggas:
   - Kontrollera trigger condition: `Page Hostname equals flocken.info`

### **Problem: Cookie consent blockerar tracking**

**Lösning:**
1. Öppna Browser Console
2. Kör: `localStorage.getItem('cookie_consent')`
3. Verifiera att `analytics: true` och `marketing: true` efter consent
4. Kontrollera att consent event skickas till dataLayer

---

## 📞 Support & Resources

### **Google Analytics**
- GA4 Documentation: https://support.google.com/analytics/answer/10089681
- GA4 Debug View: GA4 → Admin → DebugView

### **Google Tag Manager**
- GTM Documentation: https://support.google.com/tagmanager
- GTM Preview Mode: https://tagmanager.google.com → Preview

### **Meta Pixel**
- Meta Pixel Helper: Browser extension för debugging
- Meta Events Manager: https://business.facebook.com/events_manager

---

## ✅ Checklist - Vad som är klart

### **GA4 Setup:**
- [x] GA4 Property skapad (G-7B1SVKL89Q)
- [x] Web Data Stream konfigurerad
- [x] Enhanced Measurement aktiverat
- [x] Realtime tracking verifierat

### **GTM Setup:**
- [x] GTM Web Container implementerad i layout.tsx
- [x] Google Tag skapad för Flocken
- [x] Hostname-based trigger konfigurerad
- [x] Consent Mode v2 aktiverat
- [x] Publicerad och live

### **Meta Pixel:**
- [x] Pixel ID konfigurerad (854587690618895)
- [x] Implementerad i layout.tsx
- [x] Cookie consent integration
- [x] Domain verification

### **Frontend:**
- [x] GTM script i layout.tsx
- [x] dataLayer init med Consent Mode
- [x] Cookie banner integrerad
- [x] Meta Pixel script

---

## 🔜 Nästa Steg (När du är redo)

1. **Server-Side Tracking** - Se `docs/SERVER_SIDE_TRACKING_PLAN.md`
2. **App Tracking** - Se `docs/APP_TRACKING_PLAN.md`
3. **BigQuery Export** - Se `docs/BIGQUERY_EXPORT_PLAN.md`
4. **Custom Events** - Se `docs/CUSTOM_EVENTS_PLAN.md`

---

**Senast uppdaterad:** 2025-01-05  
**Status:** ✅ GA4 LIVE | ⏳ Server-side & App-tracking pending


# Meta Pixel Komplett Audit - "Visning av målsida"

**Datum:** 2026-01-18  
**Status:** ✅ Alla problem åtgärdade

---

## 🎯 Ursprungligt Problem

**Problem:** Kampanjen `fl_campaign_web_traffic_251231` visar 21 länkklick men 0 "visning av målsida" i Meta Ads Manager.

**Orsak:** PageView och ViewContent events skickades inte för återvändande besökare med befintlig cookie-consent.

---

## ✅ Åtgärder Genomförda

### 1. Cookie Banner Fix (KRITISK)
**Fil:** `public/scripts/cookie-banner-custom.js`

**Problem:** För återvändande besökare med befintlig consent triggas INTE PageView.

**Lösning:** Lade till PageView + ViewContent tracking för återvändande besökare:
```javascript
// Allow Meta Pixel if marketing consent was previously granted
if (typeof window.fbq !== 'undefined') {
  window.fbq('consent', 'grant');
  // CRITICAL: Track PageView for returning visitors
  window.fbq('track', 'PageView');
  // Also track ViewContent for landing page view measurement
  window.fbq('track', 'ViewContent', {...});
}
```

### 2. Integritetspolicy Uppdaterad
**Fil:** `app/(legal)/integritetspolicy/page.tsx`

**Problem:** Policyn sa att marknadsföringsspårning var "framtida" men vi använder det nu.

**Lösning:** Uppdaterade sektion 4.6 för att korrekt beskriva att Meta Pixel och GTM är aktiva, och att samtycke krävs.

### 3. Datum Uppdaterat
Integritetspolicyn uppdaterad till: **18 januari 2026**

---

## 📋 Komplett Event-flöde

### När ny besökare kommer till sidan:
1. Cookie-banner visas (blockerar sidan)
2. Besökare accepterar marketing cookies
3. `saveConsent()` anropas → triggar:
   - `fbq('consent', 'grant')`
   - `fbq('track', 'PageView')` ✅
4. `consentchange` event dispatches → triggar:
   - `fbq('track', 'ViewContent')` ✅

### När återvändande besökare med consent kommer:
1. Cookie-banner kontrollerar localStorage
2. Hittar befintlig consent
3. `checkExistingConsent()` triggar:
   - `fbq('consent', 'grant')`
   - `fbq('track', 'PageView')` ✅ (NY FIX)
   - `fbq('track', 'ViewContent')` ✅ (NY FIX)

---

## 📊 Meta Pixel Events Översikt

| Event | När | Consent | Status |
|-------|-----|---------|--------|
| `PageView` | Sidladdning | marketing | ✅ |
| `ViewContent` | Sidladdning (landing page) | marketing | ✅ |
| `Lead` | App install klick / Waitlist | marketing | ✅ |
| `CompleteRegistration` | Sign up | marketing | ✅ |
| `Purchase` | Premium subscription | marketing | ✅ |

---

## 🔒 GDPR/Consent Compliance

### Cookie Banner
- ✅ Blockerar all tracking tills consent ges
- ✅ Marketing consent krävs för Meta Pixel
- ✅ Analytics consent krävs för GA4/GTM
- ✅ Consent sparas i localStorage
- ✅ `consentchange` event dispatches för integration

### Consent Check i Tracking Code
```typescript
function hasMarketingConsent(): boolean {
  const consent = JSON.parse(localStorage.getItem('cookie-consent') || '{}');
  return consent.marketing === true;
}
```

### Alla tracking-funktioner kontrollerar consent:
- ✅ `trackLead()` - marketing consent
- ✅ `trackSignUp()` - marketing consent
- ✅ `trackPurchase()` - marketing consent
- ✅ `trackAppInstall()` - marketing consent
- ✅ GA4 events - analytics consent

---

## 📝 Integritetspolicy Synk

### Sektion 4.6 - Marknadsföring och konverteringsmätning
Nu korrekt beskriver:
- ✅ Meta Pixel är aktivt på webbplatsen
- ✅ Google Tag Manager används
- ✅ Samtycke krävs via cookie-banner
- ✅ Rättslig grund: Samtycke (artikel 6.1 a GDPR)

### Sektion 7 - Samtycke och dina val
- ✅ Länk till /privacy-choices
- ✅ Möjlighet att ändra cookie-inställningar

---

## 🗃️ BigQuery Setup (Vad som behövs)

För att AI ska kunna göra effektiv analys behöver data flöda till BigQuery:

### Steg 1: Aktivera BigQuery Linking i GA4
1. Gå till: https://analytics.google.com
2. Välj property: Flocken (G-7B1SVKL89Q)
3. Admin → BigQuery Linking → Link
4. Välj project: `nastahem-tracking`
5. Location: `europe-west1` (EU)
6. Aktivera Daily export + Streaming export

### Steg 2: Skapa Datasets
```sql
-- Skapa datasets i BigQuery Console
CREATE SCHEMA IF NOT EXISTS `nastahem-tracking.flocken_raw` OPTIONS(location = 'eu');
CREATE SCHEMA IF NOT EXISTS `nastahem-tracking.flocken_curated` OPTIONS(location = 'eu');
CREATE SCHEMA IF NOT EXISTS `nastahem-tracking.flocken_marts` OPTIONS(location = 'eu');
```

### Steg 3: Verifiera Export
- GA4 skapar automatiskt `events_YYYYMMDD` tabeller i raw dataset
- First export tar 24-48h efter aktivering

### Data som kommer till BQ
- `page_view` events
- `ViewContent` (custom event via GTM)
- `Lead` events (app install clicks)
- `CompleteRegistration` events
- Alla custom events från lib/tracking.ts

---

## ✅ Verifiering Checklist

### Meta Events Manager:
- [ ] Gå till: https://business.facebook.com/events_manager2
- [ ] Välj Pixel ID: 854587690618895
- [ ] Klicka "Test Events"
- [ ] Besök flocken.info → acceptera cookies
- [ ] Verifiera: `PageView` ✅
- [ ] Verifiera: `ViewContent` ✅

### GA4 Realtime:
- [ ] Gå till: https://analytics.google.com
- [ ] Välj Flocken (G-7B1SVKL89Q)
- [ ] Reports → Realtime
- [ ] Verifiera: Events kommer in

### BigQuery (efter aktivering):
- [ ] Gå till: https://console.cloud.google.com/bigquery
- [ ] Project: nastahem-tracking
- [ ] Dataset: flocken_raw eller analytics_*
- [ ] Verifiera: events_YYYYMMDD tabeller finns

---

## 📁 Filer Ändrade

1. `public/scripts/cookie-banner-custom.js` - PageView fix för återvändande besökare
2. `app/(legal)/integritetspolicy/page.tsx` - Uppdaterad sektion 4.6 + datum
3. `lib/tracking.ts` - Consent-check för alla events (tidigare fix)
4. `app/layout.tsx` - ViewContent tracking (tidigare fix)

---

## 🚀 Deploy

För att aktivera dessa ändringar:

```powershell
cd "C:\Dev\flocken-website"
git add .
git commit -m "fix: PageView tracking for returning visitors + privacy policy update

- Add PageView + ViewContent for returning visitors with existing consent
- Update privacy policy section 4.6 to correctly describe active Meta Pixel tracking
- Update last updated date to 2026-01-18
- Ensures 'visning av målsida' works in Meta Ads Manager"
git push raquel main
```

---

**Resultat:** Efter deploy bör "visning av målsida" börja registreras i Meta Ads Manager för alla besökare som accepterar marketing cookies.

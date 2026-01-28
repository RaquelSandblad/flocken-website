# Privacy Compliance Check - Meta Pixel Events

**Datum:** 2025-01-18  
**Status:** ✅ Alla events följer integritetspolicyn och cookie consent

---

## ✅ Compliance Checklist

### **1. Cookie Consent Integration** ✅

Alla Meta Pixel events kontrollerar cookie consent innan de skickas:

- ✅ **ViewContent** - Kontrollerar `marketing` consent i `app/layout.tsx`
- ✅ **PageView** - Hanteras av cookie banner, kontrollerar `marketing` consent
- ✅ **Lead** - Kontrollerar `marketing` consent via `hasMarketingConsent()`
- ✅ **CompleteRegistration** - Kontrollerar `marketing` consent via `hasMarketingConsent()`
- ✅ **Purchase** - Kontrollerar `marketing` consent via `hasMarketingConsent()`
- ✅ **App Install (Lead)** - Kontrollerar `marketing` consent via `hasMarketingConsent()`

### **2. GA4 Events Consent** ✅

Alla GA4 events kontrollerar analytics consent:

- ✅ **app_install** - Kontrollerar `analytics` consent
- ✅ **sign_up** - Kontrollerar `analytics` consent
- ✅ **purchase** - Kontrollerar `analytics` consent

### **3. Cookie Banner Integration** ✅

Cookie banner hanterar consent korrekt:

- ✅ Triggar `fbq('consent', 'grant')` när marketing consent ges
- ✅ Triggar `fbq('consent', 'revoke')` när marketing consent nekas
- ✅ Triggar `PageView` och `ViewContent` när consent ges
- ✅ Blockerar tracking om consent nekas

### **4. Integritetspolicy Compliance** ✅

Alla events följer integritetspolicyn:

- ✅ **Sektion 4.6 (Marknadsföring)** - Events skickas endast med samtycke
- ✅ **Sektion 7 (Samtycke och val)** - Användare kan ändra val via cookie banner
- ✅ **Sektion 13 (Privacy Choices)** - Länk till `/privacy-choices` finns

### **5. Event Deduplication** ✅

Alla events använder event ID för deduplication:

- ✅ Unika `eventID` genereras för varje event
- ✅ Skickas till både Meta Pixel och CAPI
- ✅ Meta deduplicerar automatiskt baserat på eventID

---

## 🔄 Data Flow: Cookie Consent → Events → BigQuery

### **Steg 1: Cookie Consent**
```
Användare besöker webbplatsen
  ↓
Cookie banner visas
  ↓
Användare accepterar/nekar cookies
  ↓
Consent sparas i localStorage: `cookie-consent`
```

### **Steg 2: Event Tracking (med consent)**
```
Consent kontrolleras innan event skickas
  ↓
Om marketing consent: Meta Pixel events skickas
  ↓
Om analytics consent: GA4 events skickas
  ↓
Alla events skickas också till CAPI (server-side)
```

### **Steg 3: GA4 → BigQuery Export**
```
GA4 samlar in events (endast med analytics consent)
  ↓
Daily export till BigQuery (kl 04:00 UTC)
  ↓
Data exporteras till: `nastahem-tracking.flocken_raw.events_YYYYMMDD`
  ↓
Processed data i: `nastahem-tracking.flocken_curated.*`
```

**Status BigQuery:** ⏳ Planerad men inte aktiv ännu (väntar på GA4 data)

---

## 📋 Implementation Details

### **Consent Check Function**

```typescript
function hasMarketingConsent(): boolean {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return false;
  }
  
  try {
    const consent = JSON.parse(localStorage.getItem('cookie-consent') || '{}');
    return consent.marketing === true;
  } catch (e) {
    return false;
  }
}
```

### **Event Tracking Pattern**

Alla Meta Pixel events följer detta mönster:

```typescript
// Check consent before tracking
if (window.fbq && hasMarketingConsent()) {
  window.fbq('track', 'EventName', {
    // event data
  }, { eventID: eventId });
}
```

### **Cookie Banner Integration**

Cookie banner triggar events när consent ges:

```javascript
if (marketing) {
  window.fbq('consent', 'grant');
  window.fbq('track', 'PageView');
  window.fbq('track', 'ViewContent', {
    content_name: 'Landing Page',
    content_category: 'Homepage',
    content_ids: ['flocken-homepage'],
    content_type: 'landing_page',
  });
}
```

---

## ✅ Verifiering

### **Testa Cookie Consent:**

1. **Öppna webbplatsen i incognito/private mode**
2. **Kontrollera att cookie banner visas**
3. **Neka marketing cookies**
4. **Verifiera att inga Meta Pixel events skickas** (via Meta Pixel Helper)
5. **Acceptera marketing cookies**
6. **Verifiera att events skickas** (PageView, ViewContent)

### **Testa Event Tracking:**

1. **Acceptera cookies**
2. **Utför en action** (t.ex. klicka på "Ladda ner app")
3. **Kontrollera i Meta Pixel Helper** att event skickas
4. **Kontrollera i GA4 Realtime** att event kommer in
5. **Kontrollera i browser console** att inga errors finns

---

## 📝 Sammanfattning

✅ **Alla events respekterar cookie consent**  
✅ **Cookie banner integrerad korrekt**  
✅ **Inga events skickas utan consent**  
✅ **Event deduplication fungerar**  
✅ **Följer integritetspolicyn**  
⏳ **BigQuery export planerad** (väntar på GA4 data)

**Alla ändringar är GDPR-compliant och följer integritetspolicyn!** 🎉

# Meta Pixel Events - Komplett Implementation

**Datum:** 2025-01-18  
**Status:** ✅ Alla standard events implementerade

---

## 📋 Översikt

Alla viktiga Meta Pixel standard events är nu implementerade och skickas automatiskt till både Meta Pixel (client-side) och Conversions API (server-side) för bästa datakvalitet och attribution.

---

## ✅ Implementerade Events

### **1. PageView** ✅
**Status:** Automatiskt på alla sidor  
**När:** Varje gång en sida laddas  
**Implementation:** `app/layout.tsx`  
**Skickas till:** Meta Pixel + CAPI

---

### **2. ViewContent** ✅
**Status:** Automatiskt på alla sidor  
**När:** Varje gång en sida laddas (för landing page view measurement)  
**Implementation:** `app/layout.tsx`  
**Skickas till:** Meta Pixel + CAPI  
**Används för:** Meta Ads Manager "visning av målsida" konverteringar

**Event Data:**
```javascript
{
  content_name: 'Landing Page',
  content_category: 'Homepage',
  content_ids: ['flocken-homepage'],
  content_type: 'landing_page'
}
```

---

### **3. Lead** ✅
**Status:** Implementerad via `trackLead()`  
**När:** Email signup, waitlist, formulär-inlämning  
**Implementation:** `lib/tracking.ts`  
**Skickas till:** Meta Pixel + CAPI + GA4  
**Används för:** Lead generation kampanjer

**Användning:**
```typescript
import { trackLead } from '@/lib/tracking';

await trackLead({
  email: 'user@example.com',
  source: 'website',
  content_name: 'Waitlist Signup'
});
```

---

### **4. CompleteRegistration** ✅
**Status:** Implementerad via `trackCompleteRegistration()` och `trackSignUp()`  
**När:** Användare registrerar sig i appen  
**Implementation:** `lib/tracking.ts`  
**Skickas till:** Meta Pixel + CAPI + GA4  
**Används för:** Registrerings-kampanjer

**Användning:**
```typescript
import { trackSignUp, trackCompleteRegistration } from '@/lib/tracking';

// Via trackSignUp (rekommenderat)
await trackSignUp('email', userId, 'user@example.com');

// Eller via trackCompleteRegistration
await trackCompleteRegistration({
  email: 'user@example.com',
  method: 'email',
  value: 100
});
```

---

### **5. Purchase** ✅
**Status:** Implementerad via `trackPurchase()`  
**När:** Användare köper premium subscription  
**Implementation:** `lib/tracking.ts`  
**Skickas till:** Meta Pixel + CAPI + GA4  
**Används för:** Revenue-optimering och ROAS-kampanjer

**Användning:**
```typescript
import { trackPurchase } from '@/lib/tracking';

await trackPurchase(
  'transaction_123',
  299,
  [{
    item_name: 'Premium Subscription',
    item_category: 'Subscription',
    item_id: 'premium_monthly',
    quantity: 1,
    price: 299
  }],
  'user@example.com'
);
```

---

### **6. Lead (App Install)** ✅
**Status:** Implementerad via `trackAppInstall()`  
**När:** Användare klickar på "Ladda ner app" länkar  
**Implementation:** `lib/tracking.ts`  
**Skickas till:** Meta Pixel (Lead event) + CAPI + GA4  
**Används för:** App installation kampanjer

**Användning:**
```typescript
import { trackAppInstall } from '@/lib/tracking';

trackAppInstall('android', 'hero_cta');
trackAppInstall('ios', 'final_cta');
```

---

## 🔧 Tekniska Detaljer

### **Event ID Deduplicering**
Alla events använder unika `eventID` för att undvika dubbletter mellan Pixel och CAPI:
- Genereras via `generateEventId()`
- Skickas till både Pixel och CAPI
- Meta deduplicerar automatiskt baserat på eventID

### **Cookie Consent**
Alla events respekterar cookie consent:
- Kontrollerar `localStorage.getItem('cookie-consent')`
- Väntar på `consentchange` event om consent saknas
- Skickar endast events om `marketing` consent är given

### **Conversions API (CAPI)**
Alla events skickas också via server-side CAPI för:
- Bättre datakvalitet (bypassar ad blockers)
- Förbättrad attribution (server-to-server)
- GDPR compliance (hashed PII)

---

## 📊 Event Prioritering i Meta Ads Manager

För att säkerställa att Meta kan optimera korrekt, se till att dessa events är prioriterade i Meta Events Manager:

1. **Purchase** (högsta prioritet - revenue)
2. **CompleteRegistration** (användarregistrering)
3. **Lead** (lead generation)
4. **ViewContent** (landing page views)
5. **PageView** (engagement)

**Konfigurera i Meta Events Manager:**
1. Gå till Events Manager
2. Välj din Pixel
3. Klicka på "Aggregated Event Measurement"
4. Prioritera events enligt ovan

---

## 🚀 Framtida Events (Vid Behov)

Följande events kan läggas till om behov uppstår:

- **AddToCart** - Om e-handel läggs till
- **InitiateCheckout** - Om checkout-process läggs till
- **Search** - Om sökfunktion läggs till
- **AddPaymentInfo** - Om betalningsinformation samlas in

---

## ✅ Checklista för Nya Kampanjer

När du skapar en ny kampanj i Meta Ads Manager:

- [ ] Kontrollera att rätt event är valt som konvertering
- [ ] Verifiera att eventet är prioriterat i Aggregated Event Measurement
- [ ] Testa att eventet triggas korrekt via Meta Pixel Helper
- [ ] Verifiera att eventet kommer in i Events Manager
- [ ] Kontrollera att CAPI också skickar eventet (server-side)

---

## 🔍 Debugging

### **Meta Pixel Helper**
Installera Meta Pixel Helper browser extension för att se events i realtid:
- Chrome: [Meta Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
- Firefox: [Meta Pixel Helper](https://addons.mozilla.org/en-US/firefox/addon/facebook-pixel-helper/)

### **Events Manager Test Events**
1. Gå till Meta Events Manager
2. Välj din Pixel
3. Klicka på "Test Events"
4. Se events i realtid när du interagerar med webbplatsen

### **Browser Console**
Kontrollera att `fbq` är tillgängligt:
```javascript
console.log(typeof window.fbq); // Should be "function"
```

Testa manuellt:
```javascript
window.fbq('track', 'ViewContent', {
  content_name: 'Test',
  content_category: 'Test'
});
```

---

## 📝 Sammanfattning

✅ **ViewContent** - Automatiskt på alla sidor  
✅ **PageView** - Automatiskt på alla sidor  
✅ **Lead** - Via `trackLead()`  
✅ **CompleteRegistration** - Via `trackSignUp()` / `trackCompleteRegistration()`  
✅ **Purchase** - Via `trackPurchase()`  
✅ **Lead (App Install)** - Via `trackAppInstall()`  

Alla events skickas till:
- ✅ Meta Pixel (client-side)
- ✅ Conversions API (server-side)
- ✅ GA4 (via dataLayer)

**Inga manuella ändringar behövs för nya landningssidor - allt fungerar automatiskt!** 🎉

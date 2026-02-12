# Custom Events Implementation - Status

**Datum:** 2025-01-05  
**Status:** ✅ App Install Tracking Implementerad

---

## ✅ Implementerade Events

### **1. `app_install`**
**Status:** ✅ Implementerad  
**När:** Användare klickar på Google Play eller App Store länkar

**Implementation:**
- ✅ Tracking utility skapad: `lib/tracking.ts`
- ✅ HeroBlock uppdaterad med tracking
- ✅ CTABlock uppdaterad med tracking
- ✅ Valkommen-sidan uppdaterad med tracking

**Events skickas när:**
- Användare klickar på "Ladda ner på Google Play" i HeroBlock
- Användare klickar på app-länkar i CTABlock
- Användare klickar på "Ladda ner på Google Play" i final CTA på valkommen-sidan

**Event Parameters:**
```javascript
{
  event: 'app_install',
  platform: 'android' | 'ios',
  source: 'hero_cta' | 'cta_block' | 'final_cta',
  value: 50,
  currency: 'SEK'
}
```

---

## ⏳ Events att Implementera (När App/Backend är Klar)

### **2. `sign_up`**
**Status:** ⏳ Väntar på backend/app implementation  
**När:** Användare registrerar sig

**Implementation:**
- Tracking utility finns: `trackSignUp()` i `lib/tracking.ts`
- Använd i signup-formulär eller app-registration flow

**Event Parameters:**
```javascript
{
  event: 'sign_up',
  signup_method: 'email' | 'google' | 'apple',
  user_id: userId, // optional
  value: 100,
  currency: 'SEK'
}
```

---

### **3. `purchase` / `subscription_start`**
**Status:** ⏳ Väntar på payment integration  
**När:** Användare köper premium subscription

**Implementation:**
- Tracking utility finns: `trackPurchase()` och `trackSubscriptionStart()` i `lib/tracking.ts`
- Använd efter successful payment

**Event Parameters:**
```javascript
{
  event: 'purchase',
  transaction_id: 'premium_' + userId + '_' + timestamp,
  value: 299,
  currency: 'SEK',
  items: [{
    item_name: 'Premium Subscription',
    item_category: 'Subscription',
    item_id: 'premium_monthly',
    quantity: 1,
    price: 299
  }]
}
```

---

### **4. `listing_created`**
**Status:** ⏳ Väntar på app implementation  
**När:** Användare skapar en hundannons

**Implementation:**
- Tracking utility finns: `trackListingCreated()` i `lib/tracking.ts`
- Använd när annons skapas i appen

---

### **5. `booking_created` / `booking_confirmed`**
**Status:** ⏳ Väntar på app implementation  
**När:** Användare skapar/bekräftar bokning

**Implementation:**
- Tracking utilities finns: `trackBookingCreated()` och `trackBookingConfirmed()` i `lib/tracking.ts`
- Använd i booking flow i appen

---

### **6. `message_sent`**
**Status:** ⏳ Väntar på app implementation  
**När:** Användare skickar meddelande

**Implementation:**
- Tracking utility finns: `trackMessageSent()` i `lib/tracking.ts`
- Använd när meddelande skickas i appen

---

## 🔧 GTM Configuration (När Events är Klara)

### **Steg 1: Skapa GA4 Event Tags i GTM**

För varje event, skapa en GA4 Event tag:

1. Gå till GTM → Tags → New
2. Tag Type: **Google Analytics: GA4 Event**
3. Configuration Tag: Välj "GA4 Configuration - Flocken"
4. Event Name: `{{Event}}` (built-in variable)
5. Trigger: Custom Event trigger
   - Event name: `app_install` (eller annat event name)
   - Condition: `Page Hostname equals flocken.info`
6. Tag Name: "GA4 Event - App Install" (eller annat event name)
7. Spara

### **Steg 2: Markera som Conversions i GA4**

1. Gå till GA4 → Admin → Events
2. Hitta event (t.ex. `app_install`)
3. Toggle "Mark as conversion"
4. Spara

---

## 📊 Verifiering

### **Testa App Install Tracking:**

1. Öppna flocken.info i Browser
2. Öppna DevTools → Console
3. Klicka på "Ladda ner på Google Play"
4. I Console, kör: `window.dataLayer`
5. Du bör se event: `{event: 'app_install', platform: 'android', ...}`

### **Verifiera i GTM Preview Mode:**

1. Öppna GTM Preview Mode
2. Gå till flocken.info
3. Klicka på app-länk
4. Verifiera att "GA4 Event - App Install" tag triggas

### **Verifiera i GA4:**

1. Öppna GA4 → DebugView
2. Gå till flocken.info
3. Klicka på app-länk
4. Verifiera att `app_install` event kommer in

---

## 📁 Files Modified

- ✅ `lib/tracking.ts` - Tracking utilities
- ✅ `components/marketing/HeroBlock.tsx` - App install tracking
- ✅ `components/marketing/CTABlock.tsx` - App install tracking
- ✅ `app/valkommen/page.tsx` - App install tracking

---

## 🔜 Nästa Steg

1. **GTM Tags:** Skapa GA4 Event tags för `app_install` i GTM
2. **GA4 Conversions:** Markera `app_install` som conversion i GA4
3. **App Integration:** Implementera övriga events när app/backend är klar

---

**Senast uppdaterad:** 2025-01-05


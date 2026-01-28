# Custom Events Plan för Flocken

**Status:** ⏳ Planerad  
**Prioritet:** High  
**Tidsåtgång:** 2-4 timmar

---

## 🎯 Syfte

Implementera custom events för att tracka specifika användarinteraktioner:
- ✅ Användarregistrering
- ✅ App-installation
- ✅ Premium subscription
- ✅ Hundannons skapad
- ✅ Meddelanden och bokningar

---

## 📋 Events att Implementera

### **Priority 1: User Acquisition**

#### **1. `sign_up`**
**När:** Användare registrerar sig  
**Varför:** Tracka konverteringar från marketing

**Implementation:**
```javascript
// Frontend (flocken.info)
window.dataLayer.push({
  event: 'sign_up',
  signup_method: 'email', // eller 'google', 'apple'
  user_id: userId // om tillgängligt
});
```

**GA4 Configuration:**
- Markera som conversion i GA4
- Länka till Google Ads (när Flocken Ads är aktivt)

---

#### **2. `app_install`**
**När:** Användare installerar appen  
**Varför:** Tracka app-installationer från webb

**Implementation:**
```javascript
// Frontend (flocken.info) - När användare klickar på "Ladda ner app"
window.dataLayer.push({
  event: 'app_install',
  platform: 'ios', // eller 'android'
  value: 50, // SEK value (om trackable)
  currency: 'SEK'
});
```

**App-side (iOS/Android):**
- Trackas automatiskt via Firebase Analytics `first_open` event
- Kan också trackas manuellt när app öppnas första gången

---

### **Priority 2: Revenue**

#### **3. `purchase` / `subscription_start`**
**När:** Användare startar Premium subscription  
**Varför:** Tracka revenue och LTV

**Implementation:**
```javascript
// Frontend eller App
window.dataLayer.push({
  event: 'purchase',
  transaction_id: 'premium_' + userId + '_' + Date.now(),
  value: 299, // SEK
  currency: 'SEK',
  items: [{
    item_name: 'Premium Subscription',
    item_category: 'Subscription',
    item_id: 'premium_monthly',
    quantity: 1,
    price: 299
  }]
});
```

**GA4 Configuration:**
- Markera som conversion
- Länka till Google Ads för Smart Bidding

---

#### **4. `subscription_renew`**
**När:** Premium subscription förnyas  
**Varför:** Tracka churn och retention

**Implementation:**
```javascript
window.dataLayer.push({
  event: 'subscription_renew',
  transaction_id: 'renew_' + subscriptionId,
  value: 299,
  currency: 'SEK'
});
```

---

### **Priority 3: Engagement**

#### **5. `listing_created`**
**När:** Användare skapar en hundannons  
**Varför:** Tracka core app-funktionalitet

**Implementation:**
```javascript
window.dataLayer.push({
  event: 'listing_created',
  listing_id: listingId,
  listing_type: 'dog', // eller annat
  value: 0, // eller annonsavgift om tillgänglig
  currency: 'SEK'
});
```

---

#### **6. `message_sent`**
**När:** Användare skickar meddelande  
**Varför:** Tracka engagement och kommunikation

**Implementation:**
```javascript
window.dataLayer.push({
  event: 'message_sent',
  message_type: 'text', // eller 'image', 'video'
  conversation_id: conversationId
});
```

---

#### **7. `booking_created`**
**När:** Användare skapar bokning (hundvakt/promenad)  
**Varför:** Tracka core business value

**Implementation:**
```javascript
window.dataLayer.push({
  event: 'booking_created',
  booking_id: bookingId,
  booking_type: 'dog_sitter', // eller 'dog_walker'
  value: bookingPrice, // SEK
  currency: 'SEK'
});
```

---

#### **8. `booking_confirmed`**
**När:** Bokning bekräftas  
**Varför:** Tracka completed transactions

**Implementation:**
```javascript
window.dataLayer.push({
  event: 'booking_confirmed',
  booking_id: bookingId,
  booking_type: 'dog_sitter',
  value: bookingPrice,
  currency: 'SEK'
});
```

---

## 🔧 GTM Configuration

### **Steg 1: Skapa GA4 Event Tags**

**1.1 För varje custom event:**
- Gå till GTM → Tags → New
- Tag Type: **Google Analytics: GA4 Event**
- Configuration Tag: Välj "GA4 Configuration - Flocken"
- Event Name: `{{Event}}` (built-in variable)
- Trigger: Custom Event trigger med event name
- Condition: `Page Hostname equals flocken.info` (för web)

**1.2 Exempel: Sign Up Event Tag**
- Tag Name: "GA4 Event - Sign Up"
- Event Name: `sign_up`
- Trigger: Custom Event → Event name equals `sign_up`
- Condition: Page Hostname equals `flocken.info`

---

### **Steg 2: Testa i Preview Mode**

**2.1 Trigger Event**
- Öppna flocken.info i Preview Mode
- Utför action (t.ex. registrera dig)
- Verifiera att event tag triggas

**2.2 Verifiera i GA4**
- Öppna GA4 → DebugView
- Verifiera att event kommer in
- Kontrollera event parameters

---

## 📊 GA4 Configuration

### **Markera Events som Conversions**

**1.1 I GA4 Admin**
- Admin → Events
- Hitta event (t.ex. `sign_up`)
- Toggle "Mark as conversion"
- Spara

**Events att markera som conversions:**
- ✅ `sign_up`
- ✅ `app_install`
- ✅ `purchase` / `subscription_start`
- ✅ `booking_confirmed`

---

### **Länka till Google Ads**

**1.1 När Flocken Ads är aktivt**
- GA4 → Admin → Google Ads Links
- Link Google Ads account
- Importera conversions
- Konfigurera Smart Bidding

---

## 🔍 Verifiering

### **GA4 DebugView**
1. Öppna GA4 → DebugView
2. Utför action på flocken.info eller i appen
3. Verifiera att event kommer in i realtid
4. Kontrollera event parameters

### **GA4 Realtime Report**
1. Öppna GA4 → Realtime → Events
2. Verifiera att custom events syns
3. Kontrollera event counts

### **BigQuery**
1. Query `flocken_raw.events_*` table
2. Filtrera på `event_name = 'sign_up'`
3. Verifiera att data exporteras korrekt

---

## 📚 Referenser

- [GA4 Event Tracking](https://support.google.com/analytics/answer/9267735)
- [GTM Custom Events](https://support.google.com/tagmanager/answer/7679219)
- [GA4 Conversions](https://support.google.com/analytics/answer/9267568)

---

**Nästa steg:** Se `TRACKING_SETUP_COMPLETE.md` för komplett översikt


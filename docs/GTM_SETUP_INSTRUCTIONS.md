# GTM Setup Instructions för Flocken

**Datum:** 2025-01-03  
**GA4 Measurement ID:** `G-7B1SVKL89Q`  
**GTM Container:** `GTM-PD5N4GT3` (samma som Nästa Hem, med routing)

---

## ✅ Vad som är klart

1. **GTM laddas i layout.tsx** - GTM-PD5N4GT3
2. **dataLayer initierad** - Med Consent Mode v2
3. **Cookie consent integration** - Redan på plats
4. **GA4 Property skapad** - Measurement ID: G-7B1SVKL89Q

---

## 🔧 GTM Konfiguration (Du behöver göra detta i GTM)

### **Steg 1: Öppna GTM Container**

1. Gå till Google Tag Manager: https://tagmanager.google.com
2. Välj container: **GTM-PD5N4GT3** (samma som Nästa Hem)
3. Klicka på "Tags" i vänstermenyn

### **Steg 2: Skapa GA4 Configuration Tag för Flocken**

1. Klicka på "New" (Ny tag)
2. **Tag Configuration:**
   - Tag Type: **Google Analytics: GA4 Configuration**
   - Measurement ID: `G-7B1SVKL89Q`
   - **Server Container URL:** `https://gtm.nastahem.com` (samma server container)
3. **Triggering:**
   - Trigger Type: **All Pages**
   - **Lägg till condition:** 
     - Condition: **Page Hostname** equals `flocken.info`
     - (Detta säkerställer att taggen bara körs för Flocken, inte Nästa Hem)
4. **Tag Name:** "GA4 Configuration - Flocken"
5. Spara

### **Steg 3: Skapa GA4 Event Tag (för custom events)**

1. Klicka på "New" (Ny tag)
2. **Tag Configuration:**
   - Tag Type: **Google Analytics: GA4 Event**
   - Configuration Tag: Välj "GA4 Configuration - Flocken" (från steg 2)
   - Event Name: `{{Event}}` (built-in variable)
3. **Triggering:**
   - Trigger Type: **Custom Event**
   - Event name: `.*` (matchar alla custom events)
   - **Lägg till condition:**
     - Condition: **Page Hostname** equals `flocken.info`
4. **Tag Name:** "GA4 Event - Flocken"
5. Spara

### **Steg 4: Konfigurera Google Ads (om det behövs)**

**Om Google Ads ska trackas via GTM (rekommenderat):**

1. Klicka på "New" (Ny tag)
2. **Tag Configuration:**
   - Tag Type: **Google Ads: Conversion Tracking**
   - Conversion ID: `AW-17821309500`
   - Conversion Label: (lägg till om du har ett)
3. **Triggering:**
   - Trigger Type: **Custom Event** (eller specifik conversion event)
   - **Lägg till condition:**
     - Condition: **Page Hostname** equals `flocken.info`
4. **Tag Name:** "Google Ads Conversion - Flocken"
5. Spara

**Alternativt:** Google Ads kan hanteras direkt i GTM via Google Ads tag, eller via GA4 → Google Ads linking.

### **Steg 5: Testa GTM Setup**

1. **GTM Preview Mode:**
   - Klicka på "Preview" i GTM
   - Ange URL: `https://flocken.info`
   - Öppna webbplatsen i ny flik
   - Du bör se GTM Preview-panelen

2. **Verifiera Tags:**
   - GA4 Configuration tag ska triggas
   - Page View event ska skickas till GA4

3. **Kontrollera GA4:**
   - Gå till GA4 → Realtime
   - Du bör se PageView events från flocken.info

---

## 📊 Brand Routing i GTM

### **Hur routing fungerar:**

GTM använder **Page Hostname** condition för att skilja mellan brands:

- **Nästa Hem tags:** Page Hostname equals `nastahem.com`
- **Flocken tags:** Page Hostname equals `flocken.info`

Detta säkerställer att:
- Nästa Hem events → Nästa Hem GA4 (G-7N67P0KT0B)
- Flocken events → Flocken GA4 (G-7B1SVKL89Q)

### **Server Container Routing:**

GTM Server Container (GTM-THB49L3K @ gtm.nastahem.com) behöver också konfigureras med routing:

1. Gå till GTM Server Container
2. Skapa GA4 Configuration - Server tag för Flocken
3. Lägg till condition: **Page Hostname** equals `flocken.info`
4. Measurement ID: `G-7B1SVKL89Q`

---

## 🎯 Event Tracking i Kod

### **Standard PageView:**
Automatiskt via GTM GA4 Configuration tag (Enhanced Measurement).

### **Custom Events:**

```javascript
// Exempel: App install tracking
window.dataLayer.push({
  event: 'app_install',
  platform: 'android', // eller 'ios'
  value: 50, // SEK value
  currency: 'SEK'
});

// Exempel: Sign up
window.dataLayer.push({
  event: 'sign_up',
  signup_method: 'email',
  value: 100, // SEK value
  currency: 'SEK'
});

// Exempel: Premium subscription
window.dataLayer.push({
  event: 'purchase',
  transaction_id: 'premium_123',
  value: 299, // SEK
  currency: 'SEK',
  items: [{
    item_name: 'Premium Subscription',
    item_category: 'Subscription',
    quantity: 1,
    price: 299
  }]
});
```

---

## ✅ Checklist

### **GTM Configuration:**
- [ ] GA4 Configuration tag skapad för Flocken (G-7B1SVKL89Q)
- [ ] Page Hostname condition: `flocken.info`
- [ ] Server Container URL: `https://gtm.nastahem.com`
- [ ] GA4 Event tag skapad för custom events
- [ ] Google Ads tag konfigurerad (om nödvändigt)

### **Server Container (GTM-THB49L3K):**
- [ ] GA4 Configuration - Server tag för Flocken
- [ ] Page Hostname condition: `flocken.info`
- [ ] Measurement ID: `G-7B1SVKL89Q`

### **Testing:**
- [ ] GTM Preview Mode fungerar
- [ ] GA4 Realtime visar events från flocken.info
- [ ] Cookie consent fungerar korrekt
- [ ] Inga konflikter (typeof gtag === 'undefined')

---

## 🔍 Verifiering

### **Kontrollera att GTM laddas:**

Öppna Developer Tools → Console:
```javascript
console.log('GTM loaded?', !!window.google_tag_manager);
console.log('dataLayer?', Array.isArray(window.dataLayer));
console.log('gtag conflict?', typeof window.gtag); // Should be: undefined
```

### **Kontrollera att events skickas:**

Developer Tools → Network:
- Filtrera på "collect" eller "gtm"
- Du bör se requests till `www.google-analytics.com/g/collect`
- Status: 204 (No Content) = Success

### **Kontrollera GA4:**

1. Gå till GA4 → Realtime
2. Du bör se PageView events från flocken.info
3. Events ska komma in inom några sekunder

---

## 📚 Referenser

- [Nästa Hems Complete Tracking Guide](../nastahem/docs/project-guides/shared/COMPLETE_DATA_TRACKING_GUIDE.md)
- [GTM Analytics Master Guide](../nastahem/docs/project-guides/gtm-analytics/README_GTM_ANALYTICS.md)

---

**Nästa steg:** Konfigurera GTM tags enligt instruktionerna ovan, sedan testa!


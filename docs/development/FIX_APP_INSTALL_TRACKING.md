# Fix App Install Tracking - Flocken

**Problem:** `app_install` event triggas inte, bara standard `click` event syns i GA4.

**Orsak:** GTM Event tag för `app_install` saknas eller är inte publicerad.

---

## 🔍 Steg 1: Verifiera att Event Pushas till dataLayer

### **1.1 Öppna Browser Console**
1. Öppna flocken.info i inkognito
2. Öppna Browser DevTools (F12)
3. Gå till **Console** tab

### **1.2 Testa Event Push**
Kör detta i Console:
```javascript
window.dataLayer.push({
  event: 'app_install',
  platform: 'android',
  source: 'test',
  value: 50,
  currency: 'SEK'
});
```

### **1.3 Verifiera i GTM Preview Mode**
1. Öppna GTM Preview Mode: https://tagmanager.google.com → Preview
2. Anslut till flocken.info
3. I Preview Mode, kolla **dataLayer** tab
4. Du bör se `app_install` event i dataLayer

**Om event syns i dataLayer men inte i GA4:**
- GTM Event tag saknas → Gå till Steg 2

**Om event INTE syns i dataLayer:**
- Kontrollera att `trackAppInstall` anropas korrekt
- Kontrollera Browser Console för errors

---

## ✅ Steg 2: Skapa GTM Event Tag för app_install

### **2.1 Öppna GTM**
- Gå till: https://tagmanager.google.com
- Välj container: `GTM-PD5N4GT3`
- Klicka på **Tags** → **New**

### **2.2 Tag Configuration**
- **Tag Name:** `GA4 Event - App Install`
- **Tag Type:** **Google Analytics: GA4 Event**

### **2.3 Configuration Tag**
- **Configuration Tag:** Välj `GA4 Configuration - Flocken` (eller `Google Tag - Flocken`)
- Om du inte ser denna tag, skapa den först (se `docs/tracking/GTM_SETUP_INSTRUCTIONS.md`)

### **2.4 Event Name**
- **Event Name:** `{{Event}}` (built-in variable)
- Eller skriv direkt: `app_install`

### **2.5 Event Parameters (Optional men rekommenderat)**
Lägg till event parameters:
- **Parameter Name:** `platform` → **Value:** `{{platform}}`
- **Parameter Name:** `source` → **Value:** `{{source}}`
- **Parameter Name:** `value` → **Value:** `{{value}}`
- **Parameter Name:** `currency` → **Value:** `{{currency}}`

**Om variables saknas:**
- GTM → Variables → New
- Variable Type: **Data Layer Variable**
- Data Layer Variable Name: `platform` (upprepa för `source`, `value`, `currency`)

### **2.6 Trigger**
- **Trigger Type:** **Custom Event**
- **Event name:** `app_install`
- **This trigger fires on:** All Custom Events
- **Lägg till condition:**
  - **Condition:** **Page Hostname** equals `flocken.info`
- **Trigger Name:** `Custom Event - App Install`

### **2.7 Spara och Publicera**
1. Klicka på **Save**
2. Klicka på **Submit** (eller "Skicka")
3. Skriv version name: `Add app_install event tag`
4. Klicka på **Publish**

---

## ✅ Steg 3: Verifiera i GTM Preview Mode

### **3.1 Testa Event**
1. Öppna GTM Preview Mode
2. Anslut till flocken.info
3. Klicka på "Ladda ner appen" knappen
4. I Preview Mode ska du se:
   - ✅ **Tags Fired:** `GA4 Event - App Install`
   - ✅ **Events:** `app_install`
   - ✅ **Variables:** `platform: android`, `source: hero_cta` (eller liknande)

### **3.2 Verifiera i GA4**
1. Öppna GA4 → Realtime → Events
2. Klicka på "Ladda ner appen" knappen igen
3. Du bör se:
   - ✅ `app_install` event i Realtime
   - ✅ Event parameters: `platform`, `source`, `value`, `currency`

---

## 🔍 Troubleshooting

### **Problem: Tag triggas inte i Preview Mode**

**Lösning:**
1. Kontrollera att trigger condition är korrekt: `Page Hostname equals flocken.info`
2. Kontrollera att event name i trigger matchar: `app_install`
3. Verifiera att event pushas till dataLayer (Steg 1)

### **Problem: Event syns i Preview Mode men inte i GA4**

**Lösning:**
1. Kontrollera att Configuration Tag är korrekt vald
2. Verifiera att Configuration Tag är publicerad
3. Kontrollera GA4 Measurement ID: `G-7B1SVKL89Q`
4. Vänta några sekunder (GA4 Realtime kan ha delay)

### **Problem: Bara "click" event syns**

**Lösning:**
- Detta är normalt! GA4 Enhanced Measurement trackar automatiskt `click` events på utgående länkar
- `app_install` är ett separat custom event som ska synas UTÖVER `click`
- Verifiera att båda events syns i GA4 Realtime

### **Problem: Event parameters saknas**

**Lösning:**
1. Skapa Data Layer Variables i GTM för `platform`, `source`, `value`, `currency`
2. Lägg till variables i Event Tag → Event Parameters
3. Publicera GTM

---

## 📋 Checklist

- [ ] Event pushas till dataLayer (Steg 1)
- [ ] GTM Event tag skapad (Steg 2)
- [ ] Trigger condition: `Page Hostname equals flocken.info`
- [ ] Event name i trigger: `app_install`
- [ ] Configuration Tag vald: `GA4 Configuration - Flocken`
- [ ] Event parameters lagda till (platform, source, value, currency)
- [ ] Tag publicerad i GTM
- [ ] Tag triggas i Preview Mode (Steg 3)
- [ ] Event syns i GA4 Realtime

---

## 📚 Relaterad Dokumentation

- **GTM Event Tags Setup:** `docs/GTM_EVENT_TAGS_SETUP.md`
- **GTM Setup:** `docs/tracking/GTM_SETUP_INSTRUCTIONS.md`
- **Verify Data Flow:** `docs/VERIFY_DATA_FLOW.md`

---

**Nästa steg:** När `app_install` event fungerar, markera det som conversion i GA4 (Admin → Events → Mark as conversion).


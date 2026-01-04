# GTM Event Tags - Komplett Guide för Flocken

**Datum:** 2025-01-05  
**Status:** 🚀 Ready to implement  
**GTM Container:** GTM-PD5N4GT3  
**GA4 Property:** G-7B1SVKL89Q (Flocken)

---

## 🎯 Översikt

Denna guide visar exakt hur du skapar GA4 Event tags i GTM för alla custom events i Flocken. Vi börjar med `app_install` som redan är implementerad i koden.

---

## ✅ Steg 1: Skapa GA4 Event Tag för `app_install`

### **1.1 Öppna GTM**

1. Gå till: https://tagmanager.google.com
2. Välj container: **GTM-PD5N4GT3**
3. Klicka på **"Tags"** i vänstermenyn
4. Klicka på **"New"** (Ny tag)

---

### **1.2 Konfigurera Tag**

**Tag Name:**
- Ange: **"GA4 Event - App Install"**

**Tag Configuration:**
1. Klicka på **"Tag Configuration"** (eller "Choose a tag type")
2. Sök efter: **"Google Analytics: GA4 Event"**
3. Välj den orange ikonen med GA4-logo
   - **OBS:** Välj INTE "Google Tag" - det är för Configuration tags
   - Välj specifikt "Google Analytics: GA4 Event"

**Configuration Tag (eller Measurement ID):**
Efter att du valt "Google Analytics: GA4 Event", kommer du se ett fält för att länka till din GA4-konfiguration. Det kan se ut på två sätt:

**Alternativ A: Configuration Tag Dropdown**
- Om du ser ett fält som heter **"Configuration Tag"** eller **"Choose a configuration tag"**:
  - Klicka på dropdown-menyn
  - Välj din befintliga tag: **"Google Tag - Flocken"** eller **"GA4 Configuration - Flocken"**
  - (Detta är den Google Tag du skapade tidigare med Measurement ID G-7B1SVKL89Q)

**Alternativ B: Measurement ID Fält**
- Om du istället ser ett fält som heter **"Measurement ID"** eller **"Tag ID"**:
  - Ange direkt: **`G-7B1SVKL89Q`**
  - (Detta är ditt GA4 Measurement ID för Flocken)

**Viktigt:** Om du inte ser någon av dessa alternativ, eller om dropdown är tom, behöver du först skapa en "Google Tag - Flocken" enligt [GTM_SETUP_INSTRUCTIONS.md](./GTM_SETUP_INSTRUCTIONS.md).

**Event Name:**
- Under "Event Name", klicka på variabel-ikonen ({{}})
- Välj: **"Event"** (built-in variable)
  - Detta tar automatiskt event name från dataLayer (`app_install`)

---

### **1.3 Skapa Trigger**

**Klicka på "Triggering":**
- Klicka på trigger-fältet (eller "Add Trigger" / "Choose a trigger")

**Skapa Ny Trigger:**
- Klicka på **"+"** (plus-ikonen) för att skapa ny trigger
- Eller om "Custom Event" redan finns, välj den och klicka på "+" för att skapa ny variant

**Trigger Configuration:**

1. **Trigger Type:**
   - Välj **"Custom Event"**
   - (Den blå ikonen med event-symbol)

2. **Trigger Name:**
   - Ange: **"Custom Event - App Install"**

3. **Event name:**
   - Ange exakt: `app_install`
   - (lowercase, underscore - exakt som i koden)

4. **This trigger fires on:**
   - Välj: **"Some Custom Events"**
   - (Inte "All Custom Events" - vi vill ha condition)

5. **Lägg till Condition:**
   - Klicka på **"Add"** för att lägga till condition
   - **Variable:** Välj **"Page Hostname"** (built-in variable)
   - **Operator:** Välj **"equals"**
   - **Value:** Ange `flocken.info`
   - (Detta säkerställer att taggen bara triggas på Flocken-webbplatsen)

6. **Spara Trigger:**
   - Klicka på **"Save"** (Spara)

---

### **1.4 Spara Taggen**

1. Klicka på **"Save"** (Spara) uppe till höger
2. Taggen är nu skapad men inte publicerad

---

### **1.5 Publicera**

1. Klicka på **"Submit"** (Skicka) i GTM huvudmenyn (överst)
2. **Version name:** "Add app_install event tracking"
3. **Version description:** "Track app install clicks from Flocken website"
4. Klicka på **"Publish"** (Publicera)

---

## ✅ Steg 2: Testa i GTM Preview Mode

### **2.1 Starta Preview Mode**

1. I GTM, klicka på **"Preview"** (överst till höger)
2. Ange URL: `https://flocken.info`
3. Klicka på **"Connect"**

### **2.2 Testa Event**

1. Öppna flocken.info i ny flik (Preview Mode öppnar automatiskt)
2. Scrolla ner till "Ladda ner på Google Play" knappen
3. Klicka på knappen
4. Gå tillbaka till GTM Preview-panelen (överst på sidan)

### **2.3 Verifiera Tag Trigger**

I Preview-panelen, under "Tags Fired", bör du se:

✅ **"GA4 Event - App Install"** tag aktiverad

Klicka på taggen för att se detaljer:
- ✅ Event name: `app_install`
- ✅ Platform: `android` (eller `ios` om App Store länk)
- ✅ Source: `hero_cta`, `cta_block`, eller `final_cta`
- ✅ Value: `50`
- ✅ Currency: `SEK`

---

## ✅ Steg 3: Verifiera i GA4 DebugView

### **3.1 Öppna GA4 DebugView**

1. Öppna GA4: https://analytics.google.com
2. Välj property: **Flocken** (G-7B1SVKL89Q)
3. I vänstermenyn, gå till **"Configure"** → **"DebugView"**

### **3.2 Testa Event**

1. Gå till flocken.info i en ny flik
2. Klicka på "Ladda ner på Google Play" knappen
3. Gå tillbaka till GA4 DebugView
4. Du bör se `app_install` event i realtid (kan ta 10-30 sekunder)

**Event Details i DebugView:**
- Event name: `app_install`
- Parameters:
  - `platform`: `android`
  - `source`: `hero_cta` / `cta_block` / `final_cta`
  - `value`: `50`
  - `currency`: `SEK`

---

## ✅ Steg 4: Markera som Conversion i GA4

### **4.1 Gå till Events**

1. I GA4, gå till **"Admin"** (kugghjulet längst ner till vänster)
2. Under "Property", klicka på **"Events"**

### **4.2 Markera app_install som Conversion**

1. Hitta `app_install` i listan
2. Toggle **"Mark as conversion"** till ON
3. Eventet är nu markerat som conversion

---

## 🔄 Steg 5: Skapa Övriga Event Tags (När Klart)

När övriga events är implementerade i koden, följ samma struktur:

### **Template för Alla Events:**

**Tag Name:** `GA4 Event - [Event Name]`  
**Tag Type:** Google Analytics: GA4 Event  
**Configuration Tag:** GA4 Configuration - Flocken  
**Event Name:** `{{Event}}`  
**Trigger:** Custom Event
- Event name: `[event_name]`
- Condition: Page Hostname equals `flocken.info`

---

### **Events att Skapa (När Implementerade):**

#### **2. `sign_up`**
- Tag Name: **"GA4 Event - Sign Up"**
- Trigger Event: `sign_up`
- Markera som conversion: ✅ Ja

#### **3. `purchase`**
- Tag Name: **"GA4 Event - Purchase"**
- Trigger Event: `purchase`
- Markera som conversion: ✅ Ja

#### **4. `subscription_start`**
- Tag Name: **"GA4 Event - Subscription Start"**
- Trigger Event: `subscription_start`
- Markera som conversion: ✅ Ja

#### **5. `listing_created`**
- Tag Name: **"GA4 Event - Listing Created"**
- Trigger Event: `listing_created`

#### **6. `booking_created`**
- Tag Name: **"GA4 Event - Booking Created"**
- Trigger Event: `booking_created`

#### **7. `booking_confirmed`**
- Tag Name: **"GA4 Event - Booking Confirmed"**
- Trigger Event: `booking_confirmed`
- Markera som conversion: ✅ Ja

#### **8. `message_sent`**
- Tag Name: **"GA4 Event - Message Sent"**
- Trigger Event: `message_sent`

#### **9. `walk_saved`**
- Tag Name: **"GA4 Event - Walk Saved"**
- Trigger Event: `walk_saved`

#### **10. `place_visited`**
- Tag Name: **"GA4 Event - Place Visited"**
- Trigger Event: `place_visited`

---

## 🔍 Troubleshooting

### **Problem: Tag triggas inte**

**Lösningar:**
1. ✅ Kontrollera att trigger event name är exakt `app_install` (lowercase, underscore)
2. ✅ Verifiera att condition är `Page Hostname equals flocken.info`
3. ✅ Kontrollera att "GA4 Configuration - Flocken" tag är vald som Configuration Tag
4. ✅ Verifiera att taggen är publicerad i GTM
5. ✅ Testa i GTM Preview Mode för att se vad som händer

### **Problem: Event syns inte i GA4**

**Lösningar:**
1. ✅ Vänta 30-60 sekunder (GA4 kan ha delay)
2. ✅ Kontrollera att du är i DebugView (inte Realtime)
3. ✅ Verifiera att Measurement ID är korrekt: `G-7B1SVKL89Q`
4. ✅ Kontrollera att GTM container är korrekt: `GTM-PD5N4GT3`
5. ✅ Verifiera att GA4 Configuration tag triggas först (innan Event tag)

### **Problem: Tag triggas på fel webbplats**

**Lösningar:**
1. ✅ Kontrollera att condition är `Page Hostname equals flocken.info`
2. ✅ Verifiera att trigger är "Some Custom Events" (inte "All Custom Events")
3. ✅ Testa i Preview Mode och kontrollera Page Hostname-värdet

---

## 📊 Verifiering Checklist

### **För app_install:**

- [ ] Tag skapad i GTM: "GA4 Event - App Install"
- [ ] Trigger skapad: "Custom Event - App Install"
- [ ] Condition: Page Hostname equals `flocken.info`
- [ ] Tag publicerad i GTM
- [ ] Testat i GTM Preview Mode - tag triggas ✅
- [ ] Verifierat i GA4 DebugView - event kommer in ✅
- [ ] Markerat som conversion i GA4 ✅

---

## 📚 Referenser

- [GTM Setup Instructions](./GTM_SETUP_INSTRUCTIONS.md) - Grundläggande GTM setup
- [Custom Events Implementation](./CUSTOM_EVENTS_IMPLEMENTATION.md) - Status och implementation
- [Event Naming Convention](./EVENT_NAMING_CONVENTION.md) - Standard för alla brands

---

## 🎯 Nästa Steg

1. ✅ Skapa GA4 Event tag för `app_install` (följ Steg 1-4 ovan)
2. ⏳ När backend/app är klar, skapa tags för övriga events
3. ⏳ Markera viktiga events som conversions i GA4
4. ⏳ Aktivera BigQuery export för GA4

---

**Säg till när du har skapat taggen så testar vi tillsammans i Preview Mode!**


# GTM Event Tags Setup Guide

**Datum:** 2025-01-05  
**Status:** ⏳ Ready to implement

---

## 🎯 Syfte

Skapa GA4 Event tags i GTM för alla custom events så att de skickas till GA4.

---

## 📋 Events att Skapa Tags För

### **Priority 1: App Install** ✅ (Implementerad i kod)

**Event Name:** `app_install`  
**När:** Användare klickar på Google Play/App Store länk  
**Status:** ✅ Tracking implementerad i Flocken och Nästa Hem

---

### **Priority 2: User Acquisition**

**Event Name:** `sign_up`  
**När:** Användare registrerar sig  
**Status:** ⏳ Väntar på backend/app implementation

---

### **Priority 3: Revenue**

**Event Name:** `purchase` / `subscription_start`  
**När:** Användare köper premium subscription  
**Status:** ⏳ Väntar på payment integration

---

### **Priority 4: Business Actions**

**Event Name:** `listing_created`  
**När:** Användare skapar hundannons  
**Status:** ⏳ Väntar på app implementation

**Event Name:** `booking_created` / `booking_confirmed`  
**När:** Användare skapar/bekräftar bokning  
**Status:** ⏳ Väntar på app implementation

**Event Name:** `walk_saved`  
**När:** Användare sparar promenad  
**Status:** ⏳ Väntar på app implementation

**Event Name:** `place_visited`  
**När:** Användare besöker/sparar plats  
**Status:** ⏳ Väntar på app implementation

---

### **Priority 5: Engagement**

**Event Name:** `message_sent`  
**När:** Användare skickar meddelande  
**Status:** ⏳ Väntar på app implementation

---

## 🔧 Steg-för-steg: Skapa GA4 Event Tag

### **Exempel: App Install Event Tag**

**1. Öppna GTM**
- Gå till: https://tagmanager.google.com
- Välj container: `GTM-PD5N4GT3`

**2. Skapa Ny Tag**
- Klicka på "Tags" → "New"
- Tag Name: "GA4 Event - App Install"

**3. Tag Configuration**
- Tag Type: **Google Analytics: GA4 Event**
- Configuration Tag: Välj "GA4 Configuration - Flocken"
- Event Name: `{{Event}}` (built-in variable)

**Event Parameters (rekommenderat)**
Lägg till dessa parametrar (Name → Value som Data Layer Variable):
- `platform` → `{{DLV - platform}}`
- `source` → `{{DLV - source}}`
- `value` → `{{DLV - value}}`
- `currency` → `{{DLV - currency}}`

**Attribution (first touch / last touch)**
Flocken pushar dessa nycklar på relevanta events (t.ex. `app_install`, `generate_lead`, `sign_up`) när analytics-consent är granted.
Lägg till dem som event params för att få dem in i GA4 → BigQuery:
- First touch: `ft_source`, `ft_medium`, `ft_campaign`, `ft_content`, `ft_term`, `ft_gclid`, `ft_fbclid`, `ft_wbraid`, `ft_gbraid`, `ft_msclkid`, `ft_ts`
- Last touch: `lt_source`, `lt_medium`, `lt_campaign`, `lt_content`, `lt_term`, `lt_gclid`, `lt_fbclid`, `lt_wbraid`, `lt_gbraid`, `lt_msclkid`, `lt_ts`

**4. Trigger**
- Trigger Type: **Custom Event**
- Event name: `app_install`
- **Lägg till condition:**
  - Condition: **Page Hostname** equals `flocken.info`
- Trigger Name: "Custom Event - App Install"

**5. Spara och Publicera**
- Spara taggen
- Publicera i GTM

---

## 📊 Tag Structure för Alla Events

För varje event, skapa en tag med denna struktur:

```
Tag Name: "GA4 Event - [Event Name]"
Tag Type: Google Analytics: GA4 Event
Configuration Tag: GA4 Configuration - Flocken
Event Name: {{Event}}
Trigger: Custom Event
  - Event name: [event_name]
  - Condition: Page Hostname equals flocken.info
```

---

## ✅ Checklist

### **App Install (Ready Now)**
- [ ] Skapa GA4 Event tag för `app_install`
- [ ] Trigger: Custom Event → `app_install`
- [ ] Condition: Page Hostname equals `flocken.info`
- [ ] Testa i GTM Preview Mode
- [ ] Markera som conversion i GA4

### **Sign Up (When Backend Ready)**
- [ ] Skapa GA4 Event tag för `sign_up`
- [ ] Trigger: Custom Event → `sign_up`
- [ ] Condition: Page Hostname equals `flocken.info`
- [ ] Markera som conversion i GA4

### **Purchase (When Payment Ready)**
- [ ] Skapa GA4 Event tag för `purchase`
- [ ] Trigger: Custom Event → `purchase`
- [ ] Condition: Page Hostname equals `flocken.info`
- [ ] Markera som conversion i GA4

### **Listing Created (When App Ready)**
- [ ] Skapa GA4 Event tag för `listing_created`
- [ ] Trigger: Custom Event → `listing_created`
- [ ] Condition: Page Hostname equals `flocken.info`

### **Booking Events (When App Ready)**
- [ ] Skapa GA4 Event tag för `booking_created`
- [ ] Skapa GA4 Event tag för `booking_confirmed`
- [ ] Triggers: Custom Events med conditions

### **Walk & Place Events (When App Ready)**
- [ ] Skapa GA4 Event tag för `walk_saved`
- [ ] Skapa GA4 Event tag för `place_visited`
- [ ] Triggers: Custom Events med conditions

### **Message Sent (When App Ready)**
- [ ] Skapa GA4 Event tag för `message_sent`
- [ ] Trigger: Custom Event → `message_sent`
- [ ] Condition: Page Hostname equals `flocken.info`

---

## 🔍 Verifiering

### **GTM Preview Mode**
1. Öppna GTM Preview Mode
2. Gå till flocken.info
3. Utför action (t.ex. klicka på app-länk)
4. Verifiera att event tag triggas

### **GA4 DebugView**
1. Öppna GA4 → DebugView
2. Utför action på flocken.info
3. Verifiera att event kommer in i realtid

### **GA4 Realtime Report**
1. Öppna GA4 → Realtime → Events
2. Verifiera att custom events syns
3. Kontrollera event counts

---

## 📚 Referenser

- [Event Naming Convention](./EVENT_NAMING_CONVENTION.md) - Standard för alla brands
- [Custom Events Implementation](./CUSTOM_EVENTS_IMPLEMENTATION.md) - Status och implementation
- [GTM Setup Instructions](./GTM_SETUP_INSTRUCTIONS.md) - Grundläggande GTM setup

---

**Nästa steg:** Skapa GA4 Event tag för `app_install` nu, sedan övriga events när backend/app är klar.


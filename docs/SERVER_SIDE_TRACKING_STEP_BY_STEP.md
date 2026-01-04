# Server-Side Tracking Setup - Steg-för-steg Guide för Flocken

**Datum:** 2025-01-05  
**Status:** ⏳ Ready to implement  
**GTM Server Container:** GTM-THB49L3K  
**Server URL:** https://gtm.nastahem.com  
**GTM Web Container:** GTM-PD5N4GT3

---

## 🎯 Syfte

Konfigurera server-side tracking för Flocken så att data skickas via GTM Server Container istället för direkt från webbläsaren. Detta förbättrar datakvalitet och blockerar ad blockers.

---

## 📋 Översikt

Vi ska:
1. Skapa en GA4 Server tag i GTM Server Container för Flocken
2. Konfigurera routing så att Flocken-data går till Flocken GA4 (G-7B1SVKL89Q)
3. Uppdatera GTM Web Container så att den skickar data till Server Container
4. Testa att allt fungerar

---

## ✅ Steg 1: Öppna GTM Server Container

### **1.1 Gå till Google Tag Manager**
1. Öppna: https://tagmanager.google.com
2. I övre högra hörnet, klicka på **dropdown-menyn** (där det står ditt nuvarande container-namn)
3. Välj: **"Nästa Hem - server"** (eller leta efter container ID: **GTM-THB49L3K**)

### **1.2 Verifiera att du är i rätt container**
- Du bör se container ID: **GTM-THB49L3K** uppe till höger
- Du bör se flikarna: **Arbetsyta**, **Versioner**, **Administratör**

---

## ✅ Steg 2: Skapa GA4 Server Tag för Flocken

### **2.1 Öppna Tags-sektionen**
1. I vänstermenyn, klicka på **"Taggar"** (Tags)
2. Du bör se en lista med befintliga tags (t.ex. "GA4 Configuration", "GA4 Event Tag")

### **2.2 Skapa ny tag**
1. Klicka på knappen **"Ny"** (New) uppe till höger
2. Ett nytt fönster öppnas för att skapa tag

### **2.3 Konfigurera tag**
**Tag Name:**
- Ange: **"GA4 Server - Flocken"**

**Tag Configuration:**
1. Klicka på **"Tag Configuration"** (eller "Choose a tag type")
2. Sök efter: **"Google Analytics: GA4 Configuration - Server"**
3. Välj den orange ikonen med GA4-logo och "Server" i namnet
   - **OBS:** Välj specifikt den med "Server" i namnet, INTE den vanliga "GA4 Configuration"

**Measurement ID:**
- Under "Measurement ID", ange: **`G-7B1SVKL89Q`**
  - (Detta är Flockens GA4 Measurement ID)

---

## ✅ Steg 3: Skapa Trigger för Flocken

### **3.1 Klicka på "Triggering"**
- Klicka på trigger-fältet (eller "Add Trigger" / "Choose a trigger")

### **3.2 Skapa ny trigger**
- Klicka på **"+"** (plus-ikonen) för att skapa ny trigger
- Eller om "All Events" redan finns, välj den och klicka på "+" för att skapa ny variant

### **3.3 Trigger Configuration**

**Trigger Type:**
- Välj **"All Events"**
  - (Den blå ikonen med event-symbol)

**Trigger Name:**
- Ange: **"All Events - Flocken"**

**This trigger fires on:**
- Välj: **"Some Events"**
  - (Inte "All Events" - vi vill ha condition)

**Lägg till Condition:**
- Klicka på **"Add"** för att lägga till condition
- **Variable:** Välj **"Page Hostname"** (built-in variable)
- **Operator:** Välj **"equals"**
- **Value:** Ange `flocken.info`
  - **⚠️ VIKTIGT:** Kontrollera att det står `flocken.info` (med "f" i början), INTE `locken.info`!
- Spara trigger

---

## ✅ Steg 4: Spara och Publicera Server Tag

### **4.1 Spara taggen**
1. Klicka på **"Spara"** (Save) uppe till höger
2. Taggen är nu skapad men inte publicerad

### **4.2 Publicera**
1. Klicka på **"Skicka"** (Submit) i GTM huvudmenyn (överst)
2. **Version name:** "Add GA4 Server tag for Flocken"
3. **Version description:** "Configure server-side tracking for Flocken website"
4. Klicka på **"Publicera"** (Publish)

---

## ✅ Steg 5: Uppdatera GTM Web Container

### **5.1 Öppna GTM Web Container**
1. I GTM, klicka på **dropdown-menyn** uppe till höger
2. Välj: **"Nästa Hem - webb"** (eller container ID: **GTM-PD5N4GT3**)

### **5.2 Öppna Flocken Google Tag**
1. Klicka på **"Taggar"** (Tags) i vänstermenyn
2. Hitta taggen: **"GA4 Configuration - Flocken"** (eller "Google Tag - Flocken")
3. Klicka på taggen för att redigera den

### **5.3 Lägg till Server Container URL**
1. Scrolla ner till **"Avancerade inställningar"** (Advanced Settings)
2. Expandera **"Avancerade inställningar"**
3. Hitta fältet: **"Server Container URL"** eller **"Tagging Server URL"**
4. Ange: **`https://gtm.nastahem.com`**
5. Spara taggen

### **5.4 Publicera Web Container**
1. Klicka på **"Skicka"** (Submit)
2. **Version name:** "Add server-side routing for Flocken"
3. **Version description:** "Route Flocken data through GTM Server Container"
4. Klicka på **"Publicera"** (Publish)

---

## ✅ Steg 6: Testa i Preview Mode

### **6.1 Starta Preview Mode**
1. I GTM Web Container, klicka på **"Förhandsgranska"** (Preview) uppe till höger
2. Ange URL: `https://flocken.info`
3. Klicka på **"Anslut"** (Connect)

### **6.2 Testa på webbplatsen**
1. Öppna flocken.info i ny flik (Preview Mode öppnar automatiskt)
2. Surfa runt på sidan
3. Gå tillbaka till GTM Preview-panelen

### **6.3 Verifiera Server-side Routing**
I Preview-panelen, kolla:

**Under "Tags Fired":**
- ✅ Du bör se: "GA4 Configuration - Flocken" tag aktiverad
- ✅ Klicka på taggen och kolla detaljer
- ✅ Du bör se att data skickas till Server Container

**Under "Network":**
- ✅ Du bör se requests till `gtm.nastahem.com`
- ✅ Status ska vara 200 (Success)

---

## ✅ Steg 7: Verifiera i GA4 DebugView

### **7.1 Öppna GA4 DebugView**
1. Öppna GA4: https://analytics.google.com
2. Välj property: **Flocken** (G-7B1SVKL89Q)
3. I vänstermenyn, gå till **"Configure"** → **"DebugView"**

### **7.2 Testa på webbplatsen**
1. Gå till flocken.info i en ny flik
2. Surfa runt på sidan
3. Gå tillbaka till GA4 DebugView
4. Du bör se events komma in i realtid (kan ta 10-30 sekunder)

**Event Details i DebugView:**
- Events ska komma in via server-side
- Du bör se `page_view`, `session_start`, etc.

---

## 🔍 Troubleshooting

### **Problem: Server tag triggas inte**

**Lösningar:**
1. ✅ Kontrollera att trigger condition är `Page Hostname equals flocken.info`
   - **⚠️ VANLIGT FEL:** Kontrollera att det står `flocken.info` (med "f"), INTE `locken.info`!
2. ✅ Verifiera att taggen är publicerad i Server Container
3. ✅ Testa i Preview Mode för att se vad som händer

### **Problem: Data skickas inte till Server Container**

**Lösningar:**
1. ✅ Kontrollera att Server Container URL är korrekt: `https://gtm.nastahem.com`
2. ✅ Verifiera att Web Container tag är publicerad
3. ✅ Kontrollera Network tab i DevTools för requests till `gtm.nastahem.com`
4. ✅ Verifiera att Server Container är live och fungerar

### **Problem: Fel Measurement ID i Server Container**

**Lösningar:**
1. ✅ Verifiera att Server tag har Measurement ID: `G-7B1SVKL89Q`
2. ✅ Kontrollera trigger condition: `Page Hostname equals flocken.info`
3. ✅ Testa i Preview Mode

### **Problem: Varning om att tagging server är inaktuell**

**Lösningar:**
1. ✅ Detta är en varning, inte ett fel
2. ✅ Server-side tracking fungerar ändå
3. ✅ För att uppdatera: Gå till Cloud Run i GCP och deploya ny revision med `gcr.io/cloud-tagging-10302018/gtm-cloud-image:stable`
4. ✅ Detta är valfritt och kan göras senare

---

## ✅ Checklist

### **Server Container (GTM-THB49L3K):**
- [ ] GA4 Server tag skapad: "GA4 Server - Flocken"
- [ ] Measurement ID: G-7B1SVKL89Q
- [ ] Trigger: "All Events - Flocken" med condition `Page Hostname equals flocken.info`
- [ ] Tag publicerad i Server Container
- [ ] Testat i Preview Mode - tag triggas ✅

### **Web Container (GTM-PD5N4GT3):**
- [ ] "GA4 Configuration - Flocken" tag uppdaterad
- [ ] Server Container URL: `https://gtm.nastahem.com`
- [ ] Tag publicerad i Web Container
- [ ] Testat i Preview Mode - data skickas till Server ✅

### **Verifiering:**
- [ ] GA4 DebugView visar events från flocken.info ✅
- [ ] Network tab visar requests till gtm.nastahem.com ✅
- [ ] Events kommer in via server-side ✅

---

## 📚 Referenser

- [GTM Server-Side Setup Guide](https://developers.google.com/tag-platform/tag-manager/server-side/cloud-run-setup-guide)
- [Nästa Hem Server-Side Setup](../../nastahem/docs/project-guides/shared/COMPLETE_DATA_TRACKING_GUIDE.md)

---

**Nästa steg:** När server-side tracking fungerar, kan vi fortsätta med övriga event tags och BigQuery views.


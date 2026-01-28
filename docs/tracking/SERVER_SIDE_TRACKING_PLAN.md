# Server-Side Tracking Plan för Flocken

**Status:** ⏳ Planerad  
**Prioritet:** High  
**Tidsåtgång:** 2-3 timmar

---

## 🎯 Syfte

Implementera server-side tracking via GTM Server Container för att:
- ✅ Förbättra datakvalitet (blockerar ad blockers)
- ✅ Förbättra privacy compliance
- ✅ Öka data accuracy
- ✅ Konsistent med Nästa Hem setup

---

## 📋 Steg-för-steg Implementation

### **Steg 1: GTM Server Container Konfiguration**

**1.1 Öppna GTM Server Container**
- Gå till: https://tagmanager.google.com
- Välj Server Container: `GTM-THB49L3K`
- URL: `https://gtm.nastahem.com`

**1.2 Skapa GA4 Server Tag för Flocken**
- Klicka på "Tags" → "New"
- Tag Type: **Google Analytics: GA4 Configuration - Server**
- Measurement ID: `G-7B1SVKL89Q`
- Trigger: Skapa ny trigger "All Events - Flocken"
  - Trigger Type: All Events
  - Condition: `Page Hostname equals flocken.info`
- Tag Name: "GA4 Server - Flocken"
- Spara

**1.3 Verifiera Routing**
- Kontrollera att Nästa Hem har egen server tag med condition: `Page Hostname equals nastahem.com`
- Båda ska använda samma Server Container men olika Measurement IDs

---

### **Steg 2: Uppdatera GTM Web Container**

**2.1 Uppdatera Google Tag för Flocken**
- Gå till GTM Web Container: `GTM-PD5N4GT3`
- Öppna taggen "GA4 Configuration - Flocken"
- Under "Avancerade inställningar" → "Server Container URL"
- Lägg till: `https://gtm.nastahem.com`
- Spara

**2.2 Testa i Preview Mode**
- Öppna GTM Preview Mode
- Gå till flocken.info
- Verifiera att:
  - Web Container taggen triggas
  - Data skickas till Server Container
  - Server Container skickar till GA4

---

### **Steg 3: Verifiera i GA4**

**3.1 Debug View**
- Öppna GA4 → DebugView
- Gå till flocken.info
- Verifiera att events kommer in via server-side

**3.2 Realtime Report**
- Öppna GA4 → Realtime
- Verifiera att data fortfarande kommer in korrekt

---

## 🔍 Troubleshooting

### **Problem: Data skickas inte till Server Container**

**Lösning:**
1. Kontrollera Server Container URL i Web Container tag
2. Verifiera att Server Container är live
3. Kontrollera Network tab i DevTools för requests till `gtm.nastahem.com`

### **Problem: Fel Measurement ID i Server Container**

**Lösning:**
1. Verifiera att Server tag har Measurement ID: `G-7B1SVKL89Q`
2. Kontrollera trigger condition: `Page Hostname equals flocken.info`
3. Testa i Preview Mode

---

## 📚 Referenser

- [Nästa Hem Server-Side Setup](../../nastahem/docs/project-guides/shared/COMPLETE_DATA_TRACKING_GUIDE.md)
- [GTM Server Container Documentation](https://support.google.com/tagmanager/answer/9202291)

---

**Nästa steg:** Se `APP_TRACKING_PLAN.md` för iOS/Android tracking


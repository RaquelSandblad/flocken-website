# Verifiera Data Flow - Flocken Tracking

**Datum:** 2025-01-05  
**Status:** ⏳ Verifiering behövs

---

## 🎯 Syfte

Verifiera att all tracking data kommer in korrekt i både GA4 och BigQuery.

---

## ✅ Steg 1: Verifiera GA4 Realtime Data

### **1.1 Öppna GA4 Realtime**
- Gå till: https://analytics.google.com
- Välj property: **Flocken (Webb)** (G-7B1SVKL89Q)
- Klicka på **Reports** → **Realtime**

### **1.2 Testa Live Tracking**
1. Öppna flocken.info i en ny inkognito-flik
2. Surfa runt på sidan (klicka länkar, scrolla)
3. I GA4 Realtime ska du se:
   - ✅ **Active users right now**: Minst 1
   - ✅ **Events by Event name**: `page_view` events
   - ✅ **Pages and screens**: flocken.info-sidor

### **1.3 Verifiera Custom Events**
1. Klicka på en app-download länk (Google Play eller App Store)
2. I GA4 Realtime → Events ska du se:
   - ✅ `app_install` event (om GTM tag är skapad)
   - ✅ Event parameters: `platform`, `source`, `value`, `currency`

**Om events inte syns:**
- Kontrollera GTM Preview Mode (se Steg 2)
- Verifiera att GTM Event tag är skapad och publicerad

---

## ✅ Steg 2: Verifiera GTM Event Tags

### **2.1 Öppna GTM Preview Mode**
- Gå till: https://tagmanager.google.com
- Välj container: `GTM-PD5N4GT3`
- Klicka på **Preview**

### **2.2 Testa App Install Event**
1. I Preview Mode, öppna flocken.info
2. Klicka på en app-download länk
3. I Preview Mode ska du se:
   - ✅ **Tags Fired**: "GA4 Event - App Install" (eller liknande namn)
   - ✅ **Events**: `app_install`
   - ✅ **Variables**: `platform`, `source`, `value`, `currency`

**Om taggen inte triggas:**
- Kontrollera att taggen är skapad i GTM
- Verifiera trigger condition: `Page Hostname equals flocken.info`
- Kontrollera att event name i trigger matchar: `app_install`

### **2.3 Verifiera Alla Event Tags**
Kontrollera att följande tags finns i GTM:
- ✅ **GA4 Configuration - Flocken** (Google Tag)
- ✅ **GA4 Event - App Install** (om implementerad)

**Om tags saknas:**
- Se guide: `docs/GTM_EVENT_TAGS_SETUP.md`

---

## ✅ Steg 3: Verifiera BigQuery Export

### **3.1 Kontrollera GA4 → BigQuery Linking**
- Gå till: https://analytics.google.com
- Välj property: **Flocken (Webb)** (G-7B1SVKL89Q)
- Klicka på **Admin** → **BigQuery Linking**
- Verifiera:
  - ✅ Status: **Linked**
  - ✅ Project: `nastahem-tracking`
  - ✅ Dataset: `flocken_raw` (eller `analytics_518338757` om GA4 skapade egen)
  - ✅ Daily export: **Enabled**
  - ✅ Streaming export: **Enabled** (valfritt)

**Om linking inte är aktiverad:**
- Se guide: `docs/BIGQUERY_SETUP_INSTRUCTIONS.md` → Steg 2

### **3.2 Kontrollera BigQuery Datasets**
- Gå till: https://console.cloud.google.com/bigquery
- Välj project: `nastahem-tracking`
- I vänstermenyn, expandera projectet
- Verifiera att följande datasets finns:
  - ✅ `flocken_raw` (eller `analytics_518338757`)
  - ✅ `flocken_curated`
  - ✅ `flocken_marts`

**Om datasets saknas:**
- Kör SQL script: `scripts/setup-bigquery-datasets.sql` → Steg 1 (endast dataset creation)

### **3.3 Kontrollera GA4 Export Tables**
1. I BigQuery Console, expandera `flocken_raw` (eller `analytics_518338757`)
2. Du bör se tabeller:
   - ✅ `events_YYYYMMDD` (daily export, t.ex. `events_20250105`)
   - ✅ `events_intraday_YYYYMMDD` (streaming export, om aktiverat)

**Om tabeller saknas:**
- Vänta några timmar (daily export körs kl 04:00 UTC)
- Streaming export börjar omedelbart men kan ta några minuter
- Verifiera att GA4 har data (se Steg 1)

### **3.4 Test Query för Raw Data**
Kör denna query i BigQuery Console:

```sql
-- Test query för att verifiera data export
SELECT 
  event_date,
  event_name,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_pseudo_id) as unique_users
FROM `nastahem-tracking.flocken_raw.events_*`
WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
GROUP BY event_date, event_name
ORDER BY event_date DESC, event_count DESC
LIMIT 20;
```

**Förväntat resultat:**
- ✅ Minst en rad med data från idag eller igår
- ✅ Event names: `page_view`, `session_start`, `first_visit`, etc.
- ✅ `event_count` > 0

**Om query ger fel:**
- Kontrollera att tabellnamnet är korrekt (kan vara `analytics_518338757.events_*` istället för `flocken_raw.events_*`)
- Verifiera att GA4 → BigQuery linking är aktiverad
- Vänta några timmar om data inte kommit in ännu

---

## ✅ Steg 4: Skapa BigQuery Views (När Data Finns)

**⚠️ Viktigt:** Kör detta steg ENDAST när du har verifierat att GA4-tabeller finns i BigQuery (Steg 3.3).

### **4.1 Uppdatera SQL Script**
1. Öppna: `scripts/setup-bigquery-datasets.sql`
2. **Uppdatera dataset-namnet** i FROM-clauses:
   - Om GA4 skapade `analytics_518338757`, ändra:
     ```sql
     FROM `nastahem-tracking.flocken_raw.events_*`
     ```
     till:
     ```sql
     FROM `nastahem-tracking.analytics_518338757.events_*`
     ```
   - Eller om GA4 exporterar till `flocken_raw`, behåll som det är

### **4.2 Kör Views SQL**
1. Öppna BigQuery Console
2. Klicka på **Compose New Query**
3. Kopiera SQL från `scripts/setup-bigquery-datasets.sql` → Steg 2-5 (views och tables)
4. **Uppdatera dataset-namnet** enligt ovan
5. Klicka på **Run**

**Förväntat resultat:**
- ✅ Views skapade: `flocken_curated.events`, `flocken_curated.user_journey`, `flocken_curated.conversion_funnel`
- ✅ Table skapad: `flocken_marts.daily_metrics`

### **4.3 Test Views**
Kör dessa test queries:

```sql
-- Test curated events view
SELECT 
  event_date,
  event_name,
  COUNT(*) as count
FROM `nastahem-tracking.flocken_curated.events`
WHERE event_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
GROUP BY event_date, event_name
ORDER BY event_date DESC, count DESC
LIMIT 20;
```

```sql
-- Test daily metrics table
SELECT *
FROM `nastahem-tracking.flocken_marts.daily_metrics`
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
ORDER BY date DESC
LIMIT 10;
```

**Förväntat resultat:**
- ✅ Data från curated views
- ✅ Metrics från daily_metrics table

---

## ✅ Steg 5: Verifiera Data Consistency

### **5.1 Jämför GA4 vs BigQuery**
1. **GA4 Realtime:**
   - Antal `page_view` events idag
   - Antal `app_install` events idag

2. **BigQuery Query:**
```sql
SELECT 
  event_name,
  COUNT(*) as count
FROM `nastahem-tracking.flocken_raw.events_*`
WHERE _TABLE_SUFFIX = FORMAT_DATE('%Y%m%d', CURRENT_DATE())
GROUP BY event_name
ORDER BY count DESC;
```

3. **Jämför:**
   - ✅ Siffrorna ska vara ungefär samma (BigQuery kan ha lite delay)
   - ✅ Event names ska matcha

**Om stora skillnader:**
- Kontrollera att GA4 → BigQuery linking är korrekt konfigurerad
- Verifiera att rätt dataset är vald i GA4 linking
- Vänta några timmar om data är ny

---

## 🔍 Troubleshooting

### **Problem: Inga events i GA4 Realtime**

**Lösning:**
1. Öppna Browser DevTools → Network tab
2. Filtrera på "collect"
3. Verifiera att requests skickas till `www.google-analytics.com/g/collect`
4. Kontrollera Measurement ID: `G-7B1SVKL89Q`
5. Verifiera GTM Preview Mode att taggen triggas

### **Problem: BigQuery tabeller saknas**

**Lösning:**
1. Verifiera GA4 → BigQuery linking är aktiverad
2. Kontrollera att rätt dataset är vald
3. Vänta några timmar (daily export körs kl 04:00 UTC)
4. Kontrollera att GA4 har data (se Steg 1)

### **Problem: Views ger fel "does not match any table"**

**Lösning:**
1. Verifiera att GA4-tabeller finns i BigQuery (Steg 3.3)
2. Uppdatera dataset-namnet i SQL script (Steg 4.1)
3. Kör views SQL igen

### **Problem: Data saknas i views**

**Lösning:**
1. Kontrollera att raw data finns i `flocken_raw.events_*` (eller `analytics_518338757.events_*`)
2. Verifiera att views query rätt dataset
3. Kontrollera WHERE-clauses i views (kan filtrera bort data)

---

## 📋 Checklist

### **GA4 Verification:**
- [ ] GA4 Realtime visar data
- [ ] `page_view` events kommer in
- [ ] `app_install` events kommer in (om implementerad)
- [ ] Custom events syns i Realtime

### **GTM Verification:**
- [ ] GTM Preview Mode fungerar
- [ ] Google Tag triggas på flocken.info
- [ ] Event tags triggas korrekt
- [ ] Hostname routing fungerar (endast Flocken-taggen triggas)

### **BigQuery Verification:**
- [ ] GA4 → BigQuery linking är aktiverad
- [ ] Datasets finns: `flocken_raw`, `flocken_curated`, `flocken_marts`
- [ ] GA4 export tables finns (`events_YYYYMMDD`)
- [ ] Test query returnerar data
- [ ] Views fungerar (när data finns)
- [ ] Daily metrics table fungerar (när data finns)

### **Data Consistency:**
- [ ] GA4 och BigQuery data matchar ungefär
- [ ] Event names är konsistenta
- [ ] Event counts är rimliga

---

## 📚 Relaterad Dokumentation

- **BigQuery Setup:** `docs/BIGQUERY_SETUP_INSTRUCTIONS.md`
- **GTM Event Tags:** `docs/GTM_EVENT_TAGS_SETUP.md`
- **GA4 Status:** `docs/tracking/GA4_SETUP_STATUS.md`
- **Complete Tracking:** `docs/tracking/TRACKING_SETUP_COMPLETE.md`

---

**Nästa steg:** När all data flödar korrekt, kan du gå vidare med server-side tracking eller app tracking.


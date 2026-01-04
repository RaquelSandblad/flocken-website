# BigQuery Setup Instructions för Flocken

**Status:** ⚠️ Pågående (datasets + länk skapad, inväntar första tabell)  
**Tidsåtgång:** 30-60 minuter

### Snabbsammanfattning (läget nu)
- ✅ Datasets skapade (EU): `flocken_raw`, `flocken_curated`, `flocken_marts`
- ✅ GA4 → BigQuery länk skapad: projekt `nastahem-tracking`, region **EU**, export: Daily + Streaming
- ⏳ Väntar på första tabellen i GA4-datasetet `analytics_518338757` (t.ex. `events_intraday_YYYYMMDD`)
- ⏳ När tabell finns: kör views/metrics-SQL (se Steg 3 nedan, använd källan `analytics_518338757.events_*` och Processing location **EU**)

---

## 🎯 Syfte

Aktivera BigQuery export från GA4 för obegränsad data retention och SQL-analys.

---

## 📋 Steg-för-steg Implementation

### **Steg 1: Kör BigQuery Setup Script (KLART)**

**1.1 Öppna BigQuery Console**
- Gå till: https://console.cloud.google.com/bigquery
- Välj project: `nastahem-tracking`
- Klicka på "Compose New Query"

**1.2 Kör Setup Script**
- Öppna filen: `scripts/setup-bigquery-datasets.sql`
- Kopiera hela innehållet
- Klistra in i BigQuery Query Editor
- Klicka på "Run" (Kör)

**1.3 Verifiera Datasets**
- I vänstermenyn, expandera `nastahem-tracking`
- Du bör se tre nya datasets:
  - ✅ `flocken_raw`
  - ✅ `flocken_curated`
  - ✅ `flocken_marts`

---

### **Steg 2: Aktivera GA4 → BigQuery Linking (KLART)**

**2.1 Öppna GA4 Admin**
- Gå till: https://analytics.google.com
- Välj property: **Flocken (Webb)** (G-7B1SVKL89Q)
- Klicka på **Admin** (kugghjulet längst ner till vänster)

**2.2 BigQuery Linking**
- Under "Product Links", klicka på **BigQuery Linking**
- Klicka på **Link** (eller "Länka" på svenska)

**2.3 Välj BigQuery Project**
- Välj project: **nastahem-tracking**
- Välj location: **europe-west1** (eller närmaste EU-region)
- Klicka på **Next**

**2.4 Konfigurera Export**
- ✅ **Daily Export**: Aktivera (komplett daglig data)
- ✅ **Streaming Export**: Aktivera (realtidsdata, valfritt men rekommenderat)
- Välj dataset: **flocken_raw**
- Klicka på **Submit** (Skicka)

**2.5 Verifiera Linking**
- Du bör se "Linked" status i BigQuery Linking-listan
- Det kan ta några timmar innan första data kommer in

---

### **Steg 3: Verifiera Data Export (⏳ PÅGÅR)**

**3.1 Vänta på första export**
- Daily export körs vanligtvis kl 04:00 UTC
- Streaming export börjar omedelbart (men kan ta några minuter)

**3.2 Kontrollera i BigQuery**
- Gå till BigQuery Console
- Expandera `nastahem-tracking` → `flocken_raw`
- Du bör se tabeller:
  - `events_YYYYMMDD` (daily export)
  - `events_intraday_YYYYMMDD` (streaming export, om aktiverat)

**3.3 Test Query**
```sql
-- Test query för att verifiera data
SELECT 
  event_date,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_pseudo_id) as unique_users
FROM `nastahem-tracking.flocken_raw.events_*`
WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
GROUP BY event_date
ORDER BY event_date DESC
LIMIT 10;
```

---

### **Steg 4: Skapa Views och Tables (körs när första tabellen finns)**

**OBS:** Använd käll-datasetet `analytics_518338757` (GA4-datasetet som skapas av länken) och Processing location **EU**. Exempel: `FROM \`nastahem-tracking.analytics_518338757.events_*\``.

Kör SQL-blocket för:
- View: `flocken_curated.events`
- Table: `flocken_marts.daily_metrics`
- Views: `flocken_curated.user_journey`, `flocken_curated.conversion_funnel`

> Tips: Blocket finns i den senaste uppdateringen i chatten. Kontrollera att GA4-exporttabeller (`events_intraday_*` eller `events_*`) finns innan körning.

**4.1 Test Curated Events View**
```sql
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

**4.2 Test Daily Metrics Table**
```sql
SELECT *
FROM `nastahem-tracking.flocken_marts.daily_metrics`
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
ORDER BY date DESC
LIMIT 10;
```

**4.3 Test Conversion Funnel**
```sql
SELECT *
FROM `nastahem-tracking.flocken_curated.conversion_funnel`
ORDER BY event_date DESC
LIMIT 10;
```

---

## 📊 Dataset Structure

### **flocken_raw**
- **Purpose:** Raw GA4 export data (unchanged)
- **Tables:** `events_YYYYMMDD`, `events_intraday_YYYYMMDD`
- **Retention:** 13 månader (GA4 standard)
- **Updates:** Automatisk från GA4

### **flocken_curated**
- **Purpose:** Processed and standardized data
- **Views:** `events`, `user_journey`, `conversion_funnel`
- **Updates:** Real-time (views query raw data)
- **Use case:** Analysis och reporting

### **flocken_marts**
- **Purpose:** Pre-calculated business metrics
- **Tables:** `daily_metrics`
- **Updates:** Kan scheduleras dagligen (se nedan)
- **Use case:** Dashboards och BI tools

---

## 🔄 Scheduled Updates (Optional)

För att uppdatera `flocken_marts.daily_metrics` dagligen, skapa en scheduled query:

**1. I BigQuery Console:**
- Gå till "Scheduled queries"
- Klicka på "Create scheduled query"
- Kopiera SQL från `setup-bigquery-datasets.sql` (STEP 3)
- Schedule: Daily @ 07:00 Stockholm time
- Destination: `flocken_marts.daily_metrics`

---

## 🔍 Query Examples

### **Daily Active Users**
```sql
SELECT
  date,
  platform,
  active_users,
  page_views,
  sign_ups
FROM `nastahem-tracking.flocken_marts.daily_metrics`
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
ORDER BY date DESC;
```

### **Sign Up Events**
```sql
SELECT
  event_date,
  COUNT(*) as sign_ups,
  COUNT(DISTINCT signup_method) as signup_methods
FROM `nastahem-tracking.flocken_curated.events`
WHERE event_name = 'sign_up'
  AND event_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY event_date
ORDER BY event_date DESC;
```

### **User Journey**
```sql
SELECT
  user_pseudo_id,
  event_name,
  event_timestamp,
  page_location
FROM `nastahem-tracking.flocken_curated.user_journey`
WHERE user_pseudo_id = 'USER_ID_HERE'
ORDER BY event_timestamp;
```

---

## ✅ Checklist

- [ ] BigQuery datasets skapade (flocken_raw, flocken_curated, flocken_marts)
- [ ] GA4 → BigQuery linking aktiverad
- [ ] Dataset vald: flocken_raw
- [ ] Daily export aktiverad
- [ ] Streaming export aktiverad (valfritt)
- [ ] Test query körs korrekt
- [ ] Views fungerar (curated.events, user_journey, conversion_funnel)
- [ ] Daily metrics table fungerar

---

## 📚 Referenser

- [GA4 BigQuery Export Guide](https://support.google.com/analytics/answer/9358801)
- [BigQuery GA4 Schema](https://support.google.com/analytics/answer/7029846)
- [Setup Script](./../scripts/setup-bigquery-datasets.sql)

---

**Nästa steg:** När data börjar flöda, kan du använda queries ovan för analys!


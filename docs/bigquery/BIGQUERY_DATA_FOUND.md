# BigQuery Data Hittad! - Nästa Steg

**Datum:** 2025-01-06  
**Status:** ✅ GA4 har exporterat data till BigQuery!

---

## ✅ Vad som Hände

Jag ser i dina query-resultat att:
- ✅ **GA4 Dataset:** `analytics_518338757` (GA4 skapade egen dataset)
- ✅ **Data finns:** Events från idag (2026-01-06)
- ✅ **Events syns:** `first_visit`, `page_view`, etc.
- ✅ **Data kommer från:** flocken.info (t.ex. `/integritetspolicy`)

**Viktigt:** GA4 exporterade till sin egen dataset (`analytics_518338757`) istället för `flocken_raw`. Detta är normalt när du inte valde specifik dataset i GA4 linking.

---

## 🎯 Nästa Steg: Skapa Views och Metrics

Nu när data finns kan vi skapa curated views och daily metrics!

### **Steg 1: Kör Views SQL Script**

1. **Öppna BigQuery Console:**
   - Gå till: https://console.cloud.google.com/bigquery
   - Välj project: `nastahem-tracking`

2. **Öppna SQL Script:**
   - Fil: `scripts/setup-bigquery-views-flocken.sql`
   - Detta script är redan uppdaterat med rätt dataset: `analytics_518338757`

3. **Kör Script:**
   - Klicka på "SQL query" eller "Compose New Query"
   - Kopiera hela innehållet från `setup-bigquery-views-flocken.sql`
   - Klistra in i query editor
   - Klicka på **Run**

**Detta skapar:**
- ✅ `flocken_curated.events` - Standardized events view
- ✅ `flocken_marts.daily_metrics` - Pre-calculated daily metrics table
- ✅ `flocken_curated.user_journey` - User journey tracking view
- ✅ `flocken_curated.conversion_funnel` - Conversion funnel analysis view

---

## ✅ Steg 2: Testa Views

### **2.1 Test Curated Events View:**

```sql
-- Test curated events view
SELECT 
  event_date,
  event_name,
  COUNT(*) as count,
  COUNT(DISTINCT user_pseudo_id) as unique_users
FROM `nastahem-tracking.flocken_curated.events`
WHERE event_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
GROUP BY event_date, event_name
ORDER BY event_date DESC, count DESC
LIMIT 20;
```

**Förväntat resultat:**
- ✅ Tabell med events: `first_visit`, `page_view`, `session_start`, etc.
- ✅ `count` > 0
- ✅ `unique_users` > 0

### **2.2 Test Daily Metrics Table:**

```sql
-- Test daily metrics table
SELECT *
FROM `nastahem-tracking.flocken_marts.daily_metrics`
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
ORDER BY date DESC
LIMIT 10;
```

**Förväntat resultat:**
- ✅ Tabell med dagliga metrics
- ✅ `active_users`, `page_views`, `sessions`, etc.
- ✅ Data från idag eller igår

### **2.3 Test Conversion Funnel:**

```sql
-- Test conversion funnel
SELECT *
FROM `nastahem-tracking.flocken_curated.conversion_funnel`
ORDER BY event_date DESC
LIMIT 10;
```

**Förväntat resultat:**
- ✅ Tabell med conversion metrics
- ✅ `visitors`, `sign_ups`, `app_installs`, etc.
- ✅ Conversion rates (t.ex. `visit_to_signup_rate`)

---

## 📊 Användbara Queries

### **Daglig Sammanfattning:**

```sql
-- Daglig sammanfattning senaste 7 dagarna
SELECT 
  date,
  platform,
  active_users,
  page_views,
  sessions,
  sign_ups,
  app_installs
FROM `nastahem-tracking.flocken_marts.daily_metrics`
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
ORDER BY date DESC, platform;
```

### **Top Events:**

```sql
-- Top events senaste 7 dagarna
SELECT 
  event_name,
  COUNT(*) as total_count,
  COUNT(DISTINCT user_pseudo_id) as unique_users
FROM `nastahem-tracking.flocken_curated.events`
WHERE event_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
GROUP BY event_name
ORDER BY total_count DESC
LIMIT 20;
```

### **User Journey:**

```sql
-- User journey för specifik användare
SELECT 
  event_timestamp,
  event_name,
  page_location,
  platform
FROM `nastahem-tracking.flocken_curated.user_journey`
WHERE user_pseudo_id = 'USER_ID_HERE'
ORDER BY event_timestamp
LIMIT 50;
```

---

## 🔍 Troubleshooting

### **Problem: Views ger fel "does not match any table"**

**Lösning:**
- Kontrollera att dataset-namnet är korrekt: `analytics_518338757`
- Om GA4 skapade annat dataset-ID, uppdatera FROM clauses i SQL script

### **Problem: Daily metrics table är tom**

**Orsak:** Table skapades innan data fanns, eller WHERE-clause filtrerar bort allt.

**Lösning:**
1. Ta bort table och skapa igen:
   ```sql
   DROP TABLE IF EXISTS `nastahem-tracking.flocken_marts.daily_metrics`;
   ```
2. Kör Steg 2 från SQL script igen (CREATE TABLE)

### **Problem: Views visar inga data**

**Lösning:**
1. Kontrollera att raw data finns i `analytics_518338757.events_*`
2. Verifiera WHERE-clauses i views (kan filtrera bort data)
3. Testa med längre datum-intervall (t.ex. INTERVAL 30 DAY)

---

## 📋 Checklist

- [x] GA4 har exporterat data till `analytics_518338757`
- [ ] Views SQL script körts
- [ ] `flocken_curated.events` view fungerar
- [ ] `flocken_marts.daily_metrics` table fungerar
- [ ] `flocken_curated.user_journey` view fungerar
- [ ] `flocken_curated.conversion_funnel` view fungerar
- [ ] Test queries returnerar data

---

## 📚 Relaterad Dokumentation

- **BigQuery Setup:** `docs/BIGQUERY_SETUP_INSTRUCTIONS.md`
- **Test Queries:** `docs/BIGQUERY_TEST_QUERIES.md`
- **Views SQL:** `scripts/setup-bigquery-views-flocken.sql`

---

**Nästa steg:** Kör views SQL script och testa queries ovan!


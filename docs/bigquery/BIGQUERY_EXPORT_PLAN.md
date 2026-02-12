# BigQuery Export Plan för Flocken

**Status:** ⏳ Planerad  
**Prioritet:** Medium  
**Tidsåtgång:** 1-2 timmar

---

## 🎯 Syfte

Aktivera BigQuery export från GA4 för att:
- ✅ Obegränsad data retention (GA4 har 14 månader)
- ✅ SQL-baserad analys
- ✅ Custom dashboards och rapporter
- ✅ Data warehouse för ML/AI
- ✅ Advanced data processing

---

## 📊 BigQuery Structure

```
BigQuery Project: nastahem-tracking
├── Datasets
│   ├── nastahem_raw ✅ (Nästa Hem raw data)
│   ├── nastahem_curated ✅ (Nästa Hem processed)
│   ├── nastahem_marts ✅ (Nästa Hem business metrics)
│   ├── flocken_raw ⏳ (Flocken raw data)
│   ├── flocken_curated ⏳ (Flocken processed)
│   └── flocken_marts ⏳ (Flocken business metrics)
```

**Fördelar:**
- ✅ Samma projekt för båda brands
- ✅ Separata datasets för tydlig separation
- ✅ Konsistent struktur med Nästa Hem

---

## 📋 Steg-för-steg Implementation

### **Steg 1: Aktivera BigQuery Linking i GA4**

**1.1 Öppna GA4 Admin**
- Gå till: https://analytics.google.com
- Välj property: Flocken (G-7B1SVKL89Q)
- Admin → BigQuery Linking → Link

**1.2 Välj BigQuery Project**
- Project: `nastahem-tracking` (eller skapa nytt)
- Location: `europe-west1` (Sverige)

**1.3 Konfigurera Export**
- Daily export: ✅ Aktivera
- Streaming export: ✅ Aktivera (valfritt, för realtidsdata)
- Spara

---

### **Steg 2: Skapa BigQuery Datasets**

**2.1 Skapa `flocken_raw` Dataset**
- Gå till: https://console.cloud.google.com/bigquery
- Project: `nastahem-tracking`
- Create Dataset → `flocken_raw`
- Location: `europe-west1`
- Spara

**2.2 Skapa `flocken_curated` Dataset**
- Create Dataset → `flocken_curated`
- Location: `europe-west1`
- Spara

**2.3 Skapa `flocken_marts` Dataset**
- Create Dataset → `flocken_marts`
- Location: `europe-west1`
- Spara

---

### **Steg 3: Konfigurera GA4 Export**

**3.1 Verifiera Export**
- GA4 → Admin → BigQuery Linking
- Verifiera att export är aktiv
- Tabeller skapas automatiskt i `flocken_raw` dataset

**3.2 Tabellstruktur**
- `events_YYYYMMDD` - Daily export tables
- `events_intraday_YYYYMMDD` - Streaming export tables (om aktiverat)

---

### **Steg 4: Skapa Views och Processed Tables**

**4.1 Skapa Curated Views**
```sql
-- flocken_curated.user_sessions
CREATE VIEW `nastahem-tracking.flocken_curated.user_sessions` AS
SELECT
  user_pseudo_id,
  event_timestamp,
  event_name,
  -- ... process raw events
FROM `nastahem-tracking.flocken_raw.events_*`
WHERE _TABLE_SUFFIX = FORMAT_DATE('%Y%m%d', CURRENT_DATE() - 1)
```

**4.2 Skapa Business Metrics**
```sql
-- flocken_marts.daily_metrics
CREATE TABLE `nastahem-tracking.flocken_marts.daily_metrics` AS
SELECT
  DATE(event_timestamp) as date,
  COUNT(DISTINCT user_pseudo_id) as active_users,
  COUNTIF(event_name = 'page_view') as page_views,
  COUNTIF(event_name = 'sign_up') as sign_ups,
  -- ... more metrics
FROM `nastahem-tracking.flocken_raw.events_*`
GROUP BY date
```

---

## 📊 Data Schema

### **Standard GA4 Events Table**
- `event_date` - Date (YYYYMMDD)
- `event_timestamp` - Timestamp (microseconds)
- `event_name` - Event name
- `user_pseudo_id` - User ID
- `user_id` - User ID (if set)
- `event_params` - Event parameters (JSON)
- `user_properties` - User properties (JSON)
- `device` - Device info
- `geo` - Geographic info
- `traffic_source` - Traffic source info

---

## 🔍 Query Examples

### **Daily Active Users**
```sql
SELECT
  event_date,
  COUNT(DISTINCT user_pseudo_id) as active_users
FROM `nastahem-tracking.flocken_raw.events_*`
WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
GROUP BY event_date
ORDER BY event_date DESC
```

### **Sign Up Events**
```sql
SELECT
  event_date,
  COUNT(*) as sign_ups
FROM `nastahem-tracking.flocken_raw.events_*`
WHERE event_name = 'sign_up'
  AND _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
GROUP BY event_date
ORDER BY event_date DESC
```

### **User Journey**
```sql
SELECT
  user_pseudo_id,
  event_name,
  event_timestamp,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') as page_location
FROM `nastahem-tracking.flocken_raw.events_*`
WHERE user_pseudo_id = 'USER_ID'
ORDER BY event_timestamp
```

---

## 📚 Referenser

- [GA4 BigQuery Export](https://support.google.com/analytics/answer/9358801)
- [BigQuery GA4 Schema](https://support.google.com/analytics/answer/7029846)
- [Nästa Hem BigQuery Setup](../../nastahem/docs/project-guides/shared/COMPLETE_DATA_TRACKING_GUIDE.md)

---

**Nästa steg:** Se `CUSTOM_EVENTS_PLAN.md` för custom events implementation


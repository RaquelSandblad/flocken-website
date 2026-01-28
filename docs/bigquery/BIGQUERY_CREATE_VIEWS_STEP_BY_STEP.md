# Skapa BigQuery Views - Steg-för-Steg Guide

**Datum:** 2025-01-06  
**Syfte:** Guida igenom att skapa views och tables manuellt i BigQuery Console

---

## 🎯 Översikt

Vi ska skapa 4 objects i BigQuery:
1. **View:** `flocken_curated.events` - Standardized events
2. **Table:** `flocken_marts.daily_metrics` - Daily metrics
3. **View:** `flocken_curated.user_journey` - User journey tracking
4. **View:** `flocken_curated.conversion_funnel` - Conversion funnel

**Tidsåtgång:** 5-10 minuter

---

## ✅ Steg 1: Öppna BigQuery Console

1. **Gå till:** https://console.cloud.google.com/bigquery
2. **Välj project:** `nastahem-tracking` (längst upp till vänster)
3. **Verifiera att du ser datasets:**
   - `flocken_curated`
   - `flocken_marts`
   - `analytics_518338757`

---

## ✅ Steg 2: Öppna SQL Editor

1. **Klicka på:** "SQL query" eller "Compose New Query" (längst upp)
2. Du ser nu en query editor med textområde

---

## ✅ Steg 3: Skapa Första View - flocken_curated.events

### **3.1 Kopiera SQL:**

Öppna filen: `scripts/setup-bigquery-views-flocken.sql`

Kopiera **Steg 1** (raderna från `-- STEP 1` till `;`):

```sql
CREATE OR REPLACE VIEW `nastahem-tracking.flocken_curated.events` AS
SELECT
  -- Core event identification
  event_date,
  TIMESTAMP_MICROS(event_timestamp) AS event_timestamp,
  event_name,
  
  -- User identification
  user_pseudo_id,
  user_id,
  
  -- Platform identification
  CASE 
    WHEN platform = 'web' THEN 'web'
    WHEN platform = 'android' THEN 'app_android'
    WHEN platform = 'ios' THEN 'app_ios'
    ELSE 'unknown'
  END AS platform,
  
  -- Page information (for web)
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') AS page_location,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_title') AS page_title,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_referrer') AS page_referrer,
  
  -- Event parameters (extract common ones)
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'signup_method') AS signup_method,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'transaction_id') AS transaction_id,
  (SELECT value.double_value FROM UNNEST(event_params) WHERE key = 'value') AS event_value,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'currency') AS currency,
  
  -- Device information
  device.category AS device_category,
  device.mobile_brand_name AS device_brand,
  device.mobile_model_name AS device_model,
  device.operating_system AS operating_system,
  device.operating_system_version AS os_version,
  
  -- Geographic information
  geo.country AS country,
  geo.region AS region,
  geo.city AS city,
  
  -- Traffic source
  traffic_source.source AS traffic_source,
  traffic_source.medium AS traffic_medium,
  traffic_source.name AS campaign_name,
  
  -- All event params as JSON (for flexibility)
  event_params AS event_params_json,
  
  -- Raw event data (for debugging)
  event_bundle_sequence_id,
  event_server_timestamp_offset
  
FROM `nastahem-tracking.analytics_518338757.events_*`
WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
  AND event_name IS NOT NULL;
```

### **3.2 Kör Query:**

1. **Klistra in SQL** i query editor
2. **VIKTIGT:** I query settings (höger sida), klicka på "More" → "Query settings"
3. **Välj "Processing location":** "Auto-detect" eller "EU"
4. **Klicka på "Run"** (eller "Kör")
5. **Vänta på resultat** (kan ta 10-30 sekunder)

### **3.3 Verifiera:**

- ✅ Du bör se: "This statement created a view named flocken_curated.events"
- ✅ I vänstermenyn, expandera `flocken_curated` → Du bör se `events` view

---

## ✅ Steg 4: Skapa Table - flocken_marts.daily_metrics

### **4.1 Kopiera SQL:**

Från samma fil, kopiera **Steg 2** (CREATE TABLE statement):

```sql
CREATE OR REPLACE TABLE `nastahem-tracking.flocken_marts.daily_metrics`
PARTITION BY date
CLUSTER BY platform, traffic_source
AS
SELECT
  DATE(TIMESTAMP_MICROS(event_timestamp)) AS date,
  
  -- Platform breakdown
  CASE 
    WHEN platform = 'web' THEN 'web'
    WHEN platform = 'android' THEN 'app_android'
    WHEN platform = 'ios' THEN 'app_ios'
    ELSE 'unknown'
  END AS platform,
  
  -- User metrics
  COUNT(DISTINCT user_pseudo_id) AS active_users,
  COUNT(DISTINCT user_id) AS logged_in_users,
  COUNT(DISTINCT CONCAT(user_pseudo_id, '-', DATE(TIMESTAMP_MICROS(event_timestamp)))) AS sessions,
  
  -- Event counts
  COUNTIF(event_name = 'page_view') AS page_views,
  COUNTIF(event_name = 'session_start') AS session_starts,
  COUNTIF(event_name = 'first_visit') AS new_users,
  COUNTIF(event_name = 'sign_up') AS sign_ups,
  COUNTIF(event_name = 'app_install') AS app_installs,
  COUNTIF(event_name = 'purchase') AS purchases,
  COUNTIF(event_name = 'subscription_start') AS subscription_starts,
  COUNTIF(event_name = 'listing_created') AS listings_created,
  COUNTIF(event_name = 'booking_created') AS bookings_created,
  COUNTIF(event_name = 'booking_confirmed') AS bookings_confirmed,
  
  -- Revenue metrics
  SUM(CASE 
    WHEN event_name = 'purchase' 
    THEN (SELECT value.double_value FROM UNNEST(event_params) WHERE key = 'value')
    ELSE 0 
  END) AS revenue_sek,
  SUM(CASE 
    WHEN event_name = 'subscription_start' 
    THEN (SELECT value.double_value FROM UNNEST(event_params) WHERE key = 'value')
    ELSE 0 
  END) AS subscription_revenue_sek,
  
  -- Traffic source breakdown
  traffic_source.source AS traffic_source,
  traffic_source.medium AS traffic_medium,
  traffic_source.name AS campaign_name,
  
  -- Geographic breakdown
  geo.country AS country,
  geo.region AS region,
  geo.city AS city,
  
  -- Device breakdown
  device.category AS device_category,
  device.operating_system AS operating_system,
  
  -- Engagement metrics
  COUNTIF(event_name = 'user_engagement') AS engagement_events,
  COUNTIF(event_name = 'scroll') AS scroll_events,
  COUNTIF(event_name = 'click') AS click_events,
  
  -- Timestamp
  CURRENT_TIMESTAMP() AS calculated_at
  
FROM `nastahem-tracking.analytics_518338757.events_*`
WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
GROUP BY 
  date,
  platform,
  traffic_source.source,
  traffic_source.medium,
  traffic_source.name,
  geo.country,
  geo.region,
  geo.city,
  device.category,
  device.operating_system;
```

### **4.2 Kör Query:**

1. **Klistra in SQL** i query editor (ersätt föregående query)
2. **Verifiera Processing location:** "Auto-detect" eller "EU"
3. **Klicka på "Run"**
4. **Vänta på resultat** (kan ta 30-60 sekunder)

### **4.3 Verifiera:**

- ✅ Du bör se: "This statement created a table named flocken_marts.daily_metrics"
- ✅ I vänstermenyn, expandera `flocken_marts` → Du bör se `daily_metrics` table

---

## ✅ Steg 5: Skapa View - flocken_curated.user_journey

### **5.1 Kopiera SQL:**

Från samma fil, kopiera **Steg 3**:

```sql
CREATE OR REPLACE VIEW `nastahem-tracking.flocken_curated.user_journey` AS
SELECT
  user_pseudo_id,
  user_id,
  TIMESTAMP_MICROS(event_timestamp) AS event_timestamp,
  event_name,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') AS page_location,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_title') AS page_title,
  CASE 
    WHEN platform = 'web' THEN 'web'
    WHEN platform = 'android' THEN 'app_android'
    WHEN platform = 'ios' THEN 'app_ios'
    ELSE 'unknown'
  END AS platform,
  device.category AS device_category,
  geo.country AS country,
  geo.city AS city,
  traffic_source.source AS traffic_source,
  traffic_source.medium AS traffic_medium,
  traffic_source.name AS campaign_name,
  -- Calculate time since previous event
  TIMESTAMP_DIFF(
    TIMESTAMP_MICROS(event_timestamp),
    LAG(TIMESTAMP_MICROS(event_timestamp)) OVER (PARTITION BY user_pseudo_id ORDER BY event_timestamp),
    SECOND
  ) AS seconds_since_previous_event,
  -- Calculate session number
  COUNTIF(event_name = 'session_start') OVER (
    PARTITION BY user_pseudo_id 
    ORDER BY event_timestamp 
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS session_number
FROM `nastahem-tracking.analytics_518338757.events_*`
WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
ORDER BY user_pseudo_id, event_timestamp;
```

### **5.2 Kör Query:**

1. **Klistra in SQL** i query editor
2. **Verifiera Processing location:** "Auto-detect" eller "EU"
3. **Klicka på "Run"**
4. **Vänta på resultat**

### **5.3 Verifiera:**

- ✅ Du bör se: "This statement created a view named flocken_curated.user_journey"
- ✅ I vänstermenyn, expandera `flocken_curated` → Du bör se `user_journey` view

---

## ✅ Steg 6: Skapa View - flocken_curated.conversion_funnel

### **6.1 Kopiera SQL:**

Från samma fil, kopiera **Steg 4**:

```sql
CREATE OR REPLACE VIEW `nastahem-tracking.flocken_curated.conversion_funnel` AS
WITH user_events AS (
  SELECT
    user_pseudo_id,
    DATE(TIMESTAMP_MICROS(event_timestamp)) AS event_date,
    MAX(CASE WHEN event_name = 'first_visit' THEN 1 ELSE 0 END) AS visited,
    MAX(CASE WHEN event_name = 'sign_up' THEN 1 ELSE 0 END) AS signed_up,
    MAX(CASE WHEN event_name = 'app_install' THEN 1 ELSE 0 END) AS installed_app,
    MAX(CASE WHEN event_name = 'subscription_start' THEN 1 ELSE 0 END) AS subscribed,
    MAX(CASE WHEN event_name = 'listing_created' THEN 1 ELSE 0 END) AS created_listing,
    MAX(CASE WHEN event_name = 'booking_confirmed' THEN 1 ELSE 0 END) AS confirmed_booking
  FROM `nastahem-tracking.analytics_518338757.events_*`
  WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
    AND event_name IN ('first_visit', 'sign_up', 'app_install', 'subscription_start', 'listing_created', 'booking_confirmed')
  GROUP BY user_pseudo_id, event_date
)
SELECT
  event_date,
  SUM(visited) AS visitors,
  SUM(signed_up) AS sign_ups,
  SUM(installed_app) AS app_installs,
  SUM(subscribed) AS subscriptions,
  SUM(created_listing) AS listings,
  SUM(confirmed_booking) AS bookings,
  -- Conversion rates
  SAFE_DIVIDE(SUM(signed_up), SUM(visited)) AS visit_to_signup_rate,
  SAFE_DIVIDE(SUM(installed_app), SUM(visited)) AS visit_to_install_rate,
  SAFE_DIVIDE(SUM(subscribed), SUM(signed_up)) AS signup_to_subscription_rate,
  SAFE_DIVIDE(SUM(confirmed_booking), SUM(visited)) AS visit_to_booking_rate
FROM user_events
GROUP BY event_date
ORDER BY event_date DESC;
```

### **6.2 Kör Query:**

1. **Klistra in SQL** i query editor
2. **Verifiera Processing location:** "Auto-detect" eller "EU"
3. **Klicka på "Run"**
4. **Vänta på resultat**

### **6.3 Verifiera:**

- ✅ Du bör se: "This statement created a view named flocken_curated.conversion_funnel"
- ✅ I vänstermenyn, expandera `flocken_curated` → Du bör se `conversion_funnel` view

---

## ✅ Steg 7: Testa Views

### **7.1 Test Curated Events:**

Kör denna query:

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

**Förväntat resultat:**
- ✅ Tabell med events: `first_visit`, `page_view`, `session_start`, etc.
- ✅ `count` > 0

### **7.2 Test Daily Metrics:**

Kör denna query:

```sql
SELECT *
FROM `nastahem-tracking.flocken_marts.daily_metrics`
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
ORDER BY date DESC
LIMIT 10;
```

**Förväntat resultat:**
- ✅ Tabell med dagliga metrics
- ✅ `active_users`, `page_views`, `sessions`, etc.

---

## 🔍 Troubleshooting

### **Problem: "does not match any table"**

**Lösning:**
- Kontrollera att Processing location är satt till "Auto-detect" eller "EU"
- Verifiera att GA4 data finns i `analytics_518338757`

### **Problem: "Dataset not found"**

**Lösning:**
- Verifiera att datasets finns: `flocken_curated`, `flocken_marts`
- Kontrollera att du är i rätt project: `nastahem-tracking`

### **Problem: Query tar lång tid**

**Lösning:**
- Detta är normalt för första körningen
- Table creation (`daily_metrics`) kan ta 30-60 sekunder
- Views skapas snabbare (10-30 sekunder)

---

## 📋 Checklist

- [ ] BigQuery Console öppnad
- [ ] Project valt: `nastahem-tracking`
- [ ] Processing location satt till "Auto-detect" eller "EU"
- [ ] View skapad: `flocken_curated.events`
- [ ] Table skapad: `flocken_marts.daily_metrics`
- [ ] View skapad: `flocken_curated.user_journey`
- [ ] View skapad: `flocken_curated.conversion_funnel`
- [ ] Test queries returnerar data

---

## 📚 Nästa Steg

När views/tables är skapade:
- ✅ De fungerar automatiskt framåt
- ✅ Data flödar från GA4 → views → tables
- ✅ Du kan köra queries mot views/tables normalt
- ✅ Se `docs/BIGQUERY_DATA_FOUND.md` för test queries

---

**Klart!** Views/tables är nu skapade och fungerar perfekt framåt! 🎉


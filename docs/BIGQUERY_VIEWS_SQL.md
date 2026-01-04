# BigQuery Views och Tables SQL för Flocken

**Status:** ⏳ Väntar på första GA4-tabell  
**När att köra:** När `analytics_518338757.events_*` tabeller finns i BigQuery

---

## 🎯 Syfte

Skapa views och tables för analys när GA4-data börjar flöda till BigQuery.

---

## ⚠️ VIKTIGT INNAN DU KÖR

1. **Verifiera att första tabell finns:**
   - Gå till BigQuery Console
   - Expandera `nastahem-tracking` → `analytics_518338757`
   - Du bör se tabeller: `events_intraday_YYYYMMDD` eller `events_YYYYMMDD`
   - Om inga tabeller finns, vänta några timmar och kolla igen

2. **Sätt Processing location till EU:**
   - I BigQuery Query Editor, klicka på **"More"** (tre prickar) → **"Query settings"**
   - Under **"Processing location"**, välj **"EU"**
   - Spara inställningar

---

## 📋 SQL Script att Köra

Kör detta script i BigQuery Query Editor (Processing location: EU):

```sql
-- ============================================
-- Curated Events View
-- ============================================
CREATE OR REPLACE VIEW `nastahem-tracking.flocken_curated.events` AS
SELECT
  event_date,
  TIMESTAMP_MICROS(event_timestamp) AS event_timestamp,
  event_name,
  user_pseudo_id,
  user_id,
  CASE 
    WHEN platform = 'web' THEN 'web'
    WHEN platform = 'android' THEN 'app_android'
    WHEN platform = 'ios' THEN 'app_ios'
    ELSE 'unknown'
  END AS platform,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') AS page_location,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_title') AS page_title,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_referrer') AS page_referrer,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'signup_method') AS signup_method,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'transaction_id') AS transaction_id,
  (SELECT value.double_value FROM UNNEST(event_params) WHERE key = 'value') AS event_value,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'currency') AS currency,
  device.category AS device_category,
  device.mobile_brand_name AS device_brand,
  device.mobile_model_name AS device_model,
  device.operating_system AS operating_system,
  device.operating_system_version AS os_version,
  geo.country AS country,
  geo.region AS region,
  geo.city AS city,
  traffic_source.source AS traffic_source,
  traffic_source.medium AS traffic_medium,
  traffic_source.name AS campaign_name,
  event_params AS event_params_json,
  event_bundle_sequence_id,
  event_server_timestamp_offset
FROM `nastahem-tracking.analytics_518338757.events_*`
WHERE event_name IS NOT NULL;

-- ============================================
-- Daily Metrics Table
-- ============================================
CREATE OR REPLACE TABLE `nastahem-tracking.flocken_marts.daily_metrics`
PARTITION BY date
CLUSTER BY platform, traffic_source AS
SELECT
  DATE(event_timestamp) AS date,
  CASE 
    WHEN platform = 'web' THEN 'web'
    WHEN platform = 'app_android' THEN 'app_android'
    WHEN platform = 'app_ios' THEN 'app_ios'
    ELSE 'unknown'
  END AS platform,
  COUNT(DISTINCT user_pseudo_id) AS active_users,
  COUNT(DISTINCT user_id) AS logged_in_users,
  COUNT(DISTINCT CONCAT(user_pseudo_id, '-', DATE(event_timestamp))) AS sessions,
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
  SUM(CASE WHEN event_name = 'purchase' THEN event_value ELSE 0 END) AS revenue_sek,
  SUM(CASE WHEN event_name = 'subscription_start' THEN event_value ELSE 0 END) AS subscription_revenue_sek,
  traffic_source,
  traffic_medium,
  campaign_name,
  country,
  region,
  city,
  device_category,
  operating_system,
  COUNTIF(event_name = 'user_engagement') AS engagement_events,
  COUNTIF(event_name = 'scroll') AS scroll_events,
  COUNTIF(event_name = 'click') AS click_events,
  CURRENT_TIMESTAMP() AS calculated_at
FROM `nastahem-tracking.flocken_curated.events`
GROUP BY
  date, platform, traffic_source, traffic_medium, campaign_name,
  country, region, city, device_category, operating_system;

-- ============================================
-- User Journey View
-- ============================================
CREATE OR REPLACE VIEW `nastahem-tracking.flocken_curated.user_journey` AS
SELECT
  user_pseudo_id,
  user_id,
  event_timestamp,
  event_name,
  page_location,
  page_title,
  platform,
  device_category,
  country,
  city,
  traffic_source,
  traffic_medium,
  campaign_name,
  TIMESTAMP_DIFF(
    event_timestamp,
    LAG(event_timestamp) OVER (PARTITION BY user_pseudo_id ORDER BY event_timestamp),
    SECOND
  ) AS seconds_since_previous_event,
  COUNTIF(event_name = 'session_start') OVER (
    PARTITION BY user_pseudo_id 
    ORDER BY event_timestamp 
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS session_number
FROM `nastahem-tracking.flocken_curated.events`
ORDER BY user_pseudo_id, event_timestamp;

-- ============================================
-- Conversion Funnel View
-- ============================================
CREATE OR REPLACE VIEW `nastahem-tracking.flocken_curated.conversion_funnel` AS
WITH user_events AS (
  SELECT
    user_pseudo_id,
    DATE(event_timestamp) AS event_date,
    MAX(CASE WHEN event_name = 'first_visit' THEN 1 ELSE 0 END) AS visited,
    MAX(CASE WHEN event_name = 'sign_up' THEN 1 ELSE 0 END) AS signed_up,
    MAX(CASE WHEN event_name = 'app_install' THEN 1 ELSE 0 END) AS installed_app,
    MAX(CASE WHEN event_name = 'subscription_start' THEN 1 ELSE 0 END) AS subscribed,
    MAX(CASE WHEN event_name = 'listing_created' THEN 1 ELSE 0 END) AS created_listing,
    MAX(CASE WHEN event_name = 'booking_confirmed' THEN 1 ELSE 0 END) AS confirmed_booking
  FROM `nastahem-tracking.flocken_curated.events`
  WHERE event_name IN ('first_visit', 'sign_up', 'app_install', 'subscription_start', 'listing_created', 'booking_confirmed')
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
  SAFE_DIVIDE(SUM(signed_up), SUM(visited)) AS visit_to_signup_rate,
  SAFE_DIVIDE(SUM(installed_app), SUM(visited)) AS visit_to_install_rate,
  SAFE_DIVIDE(SUM(subscribed), SUM(signed_up)) AS signup_to_subscription_rate,
  SAFE_DIVIDE(SUM(confirmed_booking), SUM(visited)) AS visit_to_booking_rate
FROM user_events
GROUP BY event_date
ORDER BY event_date DESC;
```

---

## ✅ Efter att SQL är Körs

### **Verifiera Views:**
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

### **Verifiera Daily Metrics:**
```sql
-- Test daily metrics table
SELECT *
FROM `nastahem-tracking.flocken_marts.daily_metrics`
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
ORDER BY date DESC
LIMIT 10;
```

---

## 📚 Referenser

- [BigQuery Setup Instructions](./BIGQUERY_SETUP_INSTRUCTIONS.md) - Huvudguide
- [GA4 BigQuery Export Guide](https://support.google.com/analytics/answer/9358801)

---

**Nästa steg:** När views fungerar, kan du börja analysera data i BigQuery!


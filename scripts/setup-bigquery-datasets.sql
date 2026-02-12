-- BigQuery Setup Script för Flocken
-- Project: nastahem-tracking
-- Location: europe-west1 (Sverige)
-- 
-- Kör detta script i BigQuery Console för att skapa datasets och initiala views

-- ============================================
-- STEP 1: Skapa Datasets
-- ============================================

-- Dataset: flocken_raw (Raw GA4 export data)
CREATE SCHEMA IF NOT EXISTS `nastahem-tracking.flocken_raw`
OPTIONS(
  description="Raw GA4 export data för Flocken. Data exporteras automatiskt från GA4 property G-7B1SVKL89Q.",
  location="europe-west1"
);

-- Dataset: flocken_curated (Processed and standardized data)
CREATE SCHEMA IF NOT EXISTS `nastahem-tracking.flocken_curated`
OPTIONS(
  description="Processed and standardized GA4 data för Flocken. Data är cleaned och ready för analysis.",
  location="europe-west1"
);

-- Dataset: flocken_marts (Business intelligence ready metrics)
CREATE SCHEMA IF NOT EXISTS `nastahem-tracking.flocken_marts`
OPTIONS(
  description="Pre-calculated business metrics för Flocken. Optimized för dashboard queries.",
  location="europe-west1"
);

-- ============================================
-- STEP 2: Skapa Curated Events View
-- ============================================

-- View: flocken_curated.events (Standardized events)
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
  
FROM `nastahem-tracking.flocken_raw.events_*`
WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
  AND event_name IS NOT NULL;

-- ============================================
-- STEP 3: Skapa Daily Metrics Table
-- ============================================

-- Table: flocken_marts.daily_metrics (Pre-calculated daily metrics)
CREATE OR REPLACE TABLE `nastahem-tracking.flocken_marts.daily_metrics`
PARTITION BY date
CLUSTER BY platform, traffic_source
AS
SELECT
  DATE(event_timestamp) AS date,
  
  -- Platform breakdown
  CASE 
    WHEN platform = 'web' THEN 'web'
    WHEN platform = 'app_android' THEN 'app_android'
    WHEN platform = 'app_ios' THEN 'app_ios'
    ELSE 'unknown'
  END AS platform,
  
  -- User metrics
  COUNT(DISTINCT user_pseudo_id) AS active_users,
  COUNT(DISTINCT user_id) AS logged_in_users,
  COUNT(DISTINCT CONCAT(user_pseudo_id, '-', DATE(event_timestamp))) AS sessions,
  
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
  SUM(CASE WHEN event_name = 'purchase' THEN event_value ELSE 0 END) AS revenue_sek,
  SUM(CASE WHEN event_name = 'subscription_start' THEN event_value ELSE 0 END) AS subscription_revenue_sek,
  
  -- Traffic source breakdown
  traffic_source,
  traffic_medium,
  campaign_name,
  
  -- Geographic breakdown
  country,
  region,
  city,
  
  -- Device breakdown
  device_category,
  operating_system,
  
  -- Engagement metrics
  COUNTIF(event_name = 'user_engagement') AS engagement_events,
  COUNTIF(event_name = 'scroll') AS scroll_events,
  COUNTIF(event_name = 'click') AS click_events,
  
  -- Timestamp
  CURRENT_TIMESTAMP() AS calculated_at
  
FROM `nastahem-tracking.flocken_curated.events`
WHERE DATE(event_timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY 
  date,
  platform,
  traffic_source,
  traffic_medium,
  campaign_name,
  country,
  region,
  city,
  device_category,
  operating_system;

-- ============================================
-- STEP 4: Skapa User Journey View
-- ============================================

-- View: flocken_curated.user_journey (User journey tracking)
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
  -- Calculate time since previous event
  TIMESTAMP_DIFF(
    event_timestamp,
    LAG(event_timestamp) OVER (PARTITION BY user_pseudo_id ORDER BY event_timestamp),
    SECOND
  ) AS seconds_since_previous_event,
  -- Calculate session number
  COUNTIF(event_name = 'session_start') OVER (
    PARTITION BY user_pseudo_id 
    ORDER BY event_timestamp 
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS session_number
FROM `nastahem-tracking.flocken_curated.events`
ORDER BY user_pseudo_id, event_timestamp;

-- ============================================
-- STEP 5: Skapa Conversion Funnel View
-- ============================================

-- View: flocken_curated.conversion_funnel (Conversion funnel analysis)
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
  -- Conversion rates
  SAFE_DIVIDE(SUM(signed_up), SUM(visited)) AS visit_to_signup_rate,
  SAFE_DIVIDE(SUM(installed_app), SUM(visited)) AS visit_to_install_rate,
  SAFE_DIVIDE(SUM(subscribed), SUM(signed_up)) AS signup_to_subscription_rate,
  SAFE_DIVIDE(SUM(confirmed_booking), SUM(visited)) AS visit_to_booking_rate
FROM user_events
GROUP BY event_date
ORDER BY event_date DESC;

-- ============================================
-- STEP 6: Kommentarer och Dokumentation
-- ============================================

-- Detta script skapar:
-- 1. Tre datasets: flocken_raw, flocken_curated, flocken_marts
-- 2. Curated events view med standardized data
-- 3. Daily metrics table med pre-calculated metrics
-- 4. User journey view för funnel analysis
-- 5. Conversion funnel view för conversion tracking
--
-- Nästa steg:
-- 1. Aktivera GA4 → BigQuery linking i GA4 Admin
-- 2. Välj project: nastahem-tracking
-- 3. Välj dataset: flocken_raw
-- 4. Aktivera daily export och streaming export
-- 5. Data börjar flöda automatiskt efter några timmar


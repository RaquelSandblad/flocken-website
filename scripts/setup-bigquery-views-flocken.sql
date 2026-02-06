-- BigQuery Views Setup för Flocken
-- Project: nastahem-tracking
-- GA4 Dataset: analytics_518338757 (GA4 skapade egen dataset)
-- 
-- Kör detta script när GA4 har exporterat data till analytics_518338757
-- Uppdatera dataset-namnet om GA4 skapade annat ID

-- ============================================
-- STEP 1: Skapa Curated Events View
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
    WHEN UPPER(platform) = 'WEB' THEN 'web'
    WHEN UPPER(platform) = 'ANDROID' THEN 'app_android'
    WHEN UPPER(platform) = 'IOS' THEN 'app_ios'
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

  -- Attribution fields available in GA4 export (no GTM changes required)
  -- First touch (FT): GA4's user acquisition fields (typically set on first_visit/first_open)
  traffic_source.source AS ft_source,
  traffic_source.medium AS ft_medium,
  traffic_source.name AS ft_campaign,

  -- Event-collected UTM/click identifiers (if present in the URL)
  collected_traffic_source.manual_source AS evt_source,
  collected_traffic_source.manual_medium AS evt_medium,
  collected_traffic_source.manual_campaign_name AS evt_campaign,
  collected_traffic_source.manual_term AS evt_term,
  collected_traffic_source.manual_content AS evt_content,
  collected_traffic_source.gclid AS evt_gclid,
  collected_traffic_source.dclid AS evt_dclid,
  collected_traffic_source.srsltid AS evt_srsltid,

  -- Last touch (LT): GA4 last-click attribution at session level
  session_traffic_source_last_click.manual_campaign.source AS lt_source,
  session_traffic_source_last_click.manual_campaign.medium AS lt_medium,
  session_traffic_source_last_click.manual_campaign.campaign_name AS lt_campaign,
  session_traffic_source_last_click.manual_campaign.term AS lt_term,
  session_traffic_source_last_click.manual_campaign.content AS lt_content,
  session_traffic_source_last_click.manual_campaign.campaign_id AS lt_campaign_id,
  session_traffic_source_last_click.google_ads_campaign.campaign_id AS lt_google_ads_campaign_id,
  session_traffic_source_last_click.google_ads_campaign.ad_group_id AS lt_google_ads_ad_group_id,
  
  -- All event params as JSON (for flexibility)
  event_params AS event_params_json,
  
  -- Raw event data (for debugging)
  event_bundle_sequence_id,
  event_server_timestamp_offset
  
FROM `nastahem-tracking.analytics_518338757.events_*`
WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
  AND event_name IS NOT NULL;

-- ============================================
-- STEP 1B: Curated Events View (with attribution defaults)
-- ============================================

-- View: flocken_curated.events_attribution (FT/LT resolved per event)
-- This view resolves a practical "best available" source/medium/campaign per event:
-- - prefer last-click (LT) if present
-- - else use event-collected (evt_*)
-- - else fall back to first-touch (FT)
CREATE OR REPLACE VIEW `nastahem-tracking.flocken_curated.events_attribution` AS
SELECT
  e.*,
  COALESCE(NULLIF(e.lt_source, ''), NULLIF(e.evt_source, ''), NULLIF(e.ft_source, '')) AS attr_source,
  COALESCE(NULLIF(e.lt_medium, ''), NULLIF(e.evt_medium, ''), NULLIF(e.ft_medium, '')) AS attr_medium,
  COALESCE(NULLIF(e.lt_campaign, ''), NULLIF(e.evt_campaign, ''), NULLIF(e.ft_campaign, '')) AS attr_campaign
FROM `nastahem-tracking.flocken_curated.events` e;

-- ============================================
-- STEP 2: Skapa Daily Metrics Table
-- ============================================

-- Drop existing table first (required when changing partitioning)
DROP TABLE IF EXISTS `nastahem-tracking.flocken_marts.daily_metrics`;

-- Table: flocken_marts.daily_metrics (Pre-calculated daily metrics)
CREATE TABLE `nastahem-tracking.flocken_marts.daily_metrics`
PARTITION BY date
CLUSTER BY platform, utm_source
AS
SELECT
  DATE(TIMESTAMP_MICROS(event_timestamp)) AS date,
  
  -- Platform breakdown
  CASE 
    WHEN UPPER(platform) = 'WEB' THEN 'web'
    WHEN UPPER(platform) = 'ANDROID' THEN 'app_android'
    WHEN UPPER(platform) = 'IOS' THEN 'app_ios'
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
  traffic_source.source AS utm_source,
  traffic_source.medium AS utm_medium,
  traffic_source.name AS utm_campaign,
  
  -- Geographic breakdown
  geo.country AS geo_country,
  geo.region AS geo_region,
  geo.city AS geo_city,
  
  -- Device breakdown
  device.category AS device_type,
  device.operating_system AS os,
  
  -- Engagement metrics
  COUNTIF(event_name = 'user_engagement') AS engagement_events,
  COUNTIF(event_name = 'scroll') AS scroll_events,
  COUNTIF(event_name = 'click') AS click_events,
  
  -- Timestamp
  CURRENT_TIMESTAMP() AS calculated_at
  
FROM `nastahem-tracking.analytics_518338757.events_*`
WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
GROUP BY 
  1, 2,
  traffic_source.source,
  traffic_source.medium,
  traffic_source.name,
  geo.country,
  geo.region,
  geo.city,
  device.category,
  device.operating_system;

-- ============================================
-- STEP 3: Skapa User Journey View
-- ============================================

-- View: flocken_curated.user_journey (User journey tracking)
CREATE OR REPLACE VIEW `nastahem-tracking.flocken_curated.user_journey` AS
SELECT
  user_pseudo_id,
  user_id,
  TIMESTAMP_MICROS(event_timestamp) AS event_timestamp,
  event_name,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') AS page_location,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_title') AS page_title,
  CASE 
    WHEN UPPER(platform) = 'WEB' THEN 'web'
    WHEN UPPER(platform) = 'ANDROID' THEN 'app_android'
    WHEN UPPER(platform) = 'IOS' THEN 'app_ios'
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

-- ============================================
-- STEP 4: Skapa Conversion Funnel View
-- ============================================

-- View: flocken_curated.conversion_funnel (Conversion funnel analysis)
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

-- ============================================
-- STEP 5: Kommentarer och Dokumentation
-- ============================================

-- Detta script skapar:
-- 1. flocken_curated.events - Standardized events view
-- 2. flocken_marts.daily_metrics - Pre-calculated daily metrics table
-- 3. flocken_curated.user_journey - User journey tracking view
-- 4. flocken_curated.conversion_funnel - Conversion funnel analysis view
--
-- Dataset: analytics_518338757 (GA4 skapade egen dataset)
-- Om GA4 skapade annat dataset-ID, uppdatera alla FROM clauses ovan
--
-- Nästa steg:
-- 1. Kör detta script i BigQuery Console
-- 2. Testa views med queries från docs/BIGQUERY_TEST_QUERIES.md
-- 3. Verifiera att data finns i curated views


-- BigQuery Quiz Analytics Views
-- Project: nastahem-tracking
-- GA4 Dataset: analytics_518338757
-- Run in BigQuery Console after quiz events start flowing (daily export t+1 day)
--
-- Creates:
--   flocken_curated.quiz_events   -- Flat table of all quiz events with parameters
--   flocken_curated.quiz_funnel   -- Starts vs completions per quiz
--   flocken_marts.quiz_daily      -- Daily quiz metrics (schedule to run at 07:00)


-- ============================================================
-- VIEW 1: flocken_curated.quiz_events
-- Flat, readable table of all quiz-related events
-- ============================================================

CREATE OR REPLACE VIEW `nastahem-tracking.flocken_curated.quiz_events` AS
SELECT
  event_date,
  TIMESTAMP_MICROS(event_timestamp) AS event_timestamp,
  event_name,
  user_pseudo_id,

  -- Quiz parameters
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'quiz_slug')   AS quiz_slug,
  (SELECT value.int_value    FROM UNNEST(event_params) WHERE key = 'quiz_score')  AS quiz_score,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'quiz_bucket') AS quiz_bucket,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'quiz_cta')    AS quiz_cta,

  -- Session / traffic source
  (SELECT value.int_value    FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS session_id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'source')        AS traffic_source,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'medium')        AS traffic_medium,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'campaign')      AS campaign,

  -- Device
  device.category          AS device_category,
  device.operating_system  AS operating_system,
  geo.country              AS country,
  geo.region               AS region

FROM `nastahem-tracking.analytics_518338757.events_*`
WHERE event_name IN (
  'quiz_start',
  'quiz_complete',
  'quiz_score_bucket',
  'quiz_cta_click',
  'quiz_cta_download_click',
  'quiz_share'
)
AND _TABLE_SUFFIX >= '20260216'  -- First day of quiz tracking
;


-- ============================================================
-- VIEW 2: flocken_curated.quiz_funnel
-- Starts vs completions per quiz + completion rate
-- Most useful for "which quiz is most popular"
-- ============================================================

CREATE OR REPLACE VIEW `nastahem-tracking.flocken_curated.quiz_funnel` AS
WITH starts AS (
  SELECT
    quiz_slug,
    COUNT(DISTINCT user_pseudo_id)                                    AS unique_starters,
    COUNT(*)                                                          AS total_starts,
    MIN(event_date)                                                   AS first_start_date
  FROM `nastahem-tracking.flocken_curated.quiz_events`
  WHERE event_name = 'quiz_start'
    AND quiz_slug IS NOT NULL
  GROUP BY quiz_slug
),
completions AS (
  SELECT
    quiz_slug,
    COUNT(DISTINCT user_pseudo_id)                                    AS unique_completers,
    COUNT(*)                                                          AS total_completions,
    ROUND(AVG(quiz_score), 1)                                         AS avg_score,
    COUNTIF(quiz_score >= 8)                                          AS gold_count,
    COUNTIF(quiz_score >= 5 AND quiz_score <= 7)                      AS silver_count,
    COUNTIF(quiz_score <= 4)                                          AS bronze_count
  FROM `nastahem-tracking.flocken_curated.quiz_events`
  WHERE event_name = 'quiz_complete'
    AND quiz_slug IS NOT NULL
  GROUP BY quiz_slug
),
cta_clicks AS (
  SELECT
    quiz_slug,
    COUNT(DISTINCT user_pseudo_id)                                    AS users_clicked_cta,
    COUNTIF(quiz_cta = 'download')                                    AS download_clicks
  FROM `nastahem-tracking.flocken_curated.quiz_events`
  WHERE event_name = 'quiz_cta_click'
    AND quiz_slug IS NOT NULL
  GROUP BY quiz_slug
)
SELECT
  s.quiz_slug,
  s.unique_starters,
  s.total_starts,
  COALESCE(c.unique_completers, 0)                                    AS unique_completers,
  COALESCE(c.total_completions, 0)                                    AS total_completions,
  ROUND(
    SAFE_DIVIDE(c.unique_completers, s.unique_starters) * 100, 1
  )                                                                   AS completion_rate_pct,
  c.avg_score,
  COALESCE(c.gold_count, 0)                                           AS gold_badges,
  COALESCE(c.silver_count, 0)                                         AS silver_badges,
  COALESCE(c.bronze_count, 0)                                         AS bronze_badges,
  COALESCE(ct.users_clicked_cta, 0)                                   AS cta_clicks,
  COALESCE(ct.download_clicks, 0)                                     AS download_clicks,
  ROUND(
    SAFE_DIVIDE(ct.download_clicks, c.unique_completers) * 100, 1
  )                                                                   AS download_conversion_pct,
  s.first_start_date
FROM starts s
LEFT JOIN completions c  ON s.quiz_slug = c.quiz_slug
LEFT JOIN cta_clicks ct  ON s.quiz_slug = ct.quiz_slug
ORDER BY s.total_starts DESC
;


-- ============================================================
-- TABLE 3: flocken_marts.quiz_daily
-- Daily snapshot per quiz – schedule this to run every morning
-- Schedule: BigQuery Scheduled Queries → Daily 07:00 Stockholm
-- ============================================================

CREATE OR REPLACE TABLE `nastahem-tracking.flocken_marts.quiz_daily`
PARTITION BY date
AS
SELECT
  PARSE_DATE('%Y%m%d', event_date)  AS date,
  quiz_slug,
  COUNTIF(event_name = 'quiz_start')                                  AS starts,
  COUNTIF(event_name = 'quiz_complete')                               AS completions,
  ROUND(
    SAFE_DIVIDE(
      COUNTIF(event_name = 'quiz_complete'),
      COUNTIF(event_name = 'quiz_start')
    ) * 100, 1
  )                                                                   AS completion_rate_pct,
  ROUND(
    AVG(CASE WHEN event_name = 'quiz_complete' THEN quiz_score END), 1
  )                                                                   AS avg_score,
  COUNTIF(event_name = 'quiz_cta_download_click')                     AS download_clicks,
  COUNT(DISTINCT user_pseudo_id)                                      AS unique_users
FROM `nastahem-tracking.flocken_curated.quiz_events`
WHERE quiz_slug IS NOT NULL
GROUP BY date, quiz_slug
ORDER BY date DESC, starts DESC
;


-- ============================================================
-- VERIFY QUERIES – run these after the views are created
-- ============================================================

-- 1. Check that quiz events are flowing
-- SELECT event_name, quiz_slug, COUNT(*) AS cnt
-- FROM `nastahem-tracking.flocken_curated.quiz_events`
-- GROUP BY event_name, quiz_slug
-- ORDER BY cnt DESC;

-- 2. Funnel per quiz (main report)
-- SELECT * FROM `nastahem-tracking.flocken_curated.quiz_funnel`;

-- 3. Daily quiz activity
-- SELECT * FROM `nastahem-tracking.flocken_marts.quiz_daily`
-- ORDER BY date DESC LIMIT 30;

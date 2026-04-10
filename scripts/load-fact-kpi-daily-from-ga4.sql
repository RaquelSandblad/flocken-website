-- Load GA4-exported events into analytics_core.fact_kpi_daily (contract v1)
-- This script is designed to be run daily (D+1) and for backfills.
--
-- Parameters (named):
--   @start_date (DATE)
--   @end_date   (DATE)
--   @app_id     (STRING)
--   @run_id     (STRING)
--
-- Required env substitution (done by runner script):
--   {{PROJECT_ID}}
--   {{GA4_DATASET_ID}}

DECLARE start_date DATE DEFAULT @start_date;
DECLARE end_date DATE DEFAULT @end_date;
DECLARE app_id STRING DEFAULT @app_id;
DECLARE run_id STRING DEFAULT @run_id;

MERGE `{{PROJECT_ID}}.analytics_core.fact_kpi_daily` t
USING (
  -- ---------------------------------------------------------
  -- 1) Aggregate GA4 events for requested date range
  -- ---------------------------------------------------------
  WITH events AS (
    SELECT
      DATE(TIMESTAMP_MICROS(event_timestamp)) AS date,
      user_pseudo_id,
      event_name,
      event_timestamp,
      -- normalize platform
      CASE
        WHEN UPPER(platform) = 'IOS' THEN 'ios'
        WHEN UPPER(platform) = 'ANDROID' THEN 'android'
        WHEN UPPER(platform) = 'WEB' THEN 'web'
        ELSE 'unknown'
      END AS platform,
      -- extract params used for dedupe/filters
      (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'status') AS status,
      COALESCE(
        (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'listing_id'),
        CAST((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'listing_id') AS STRING)
      ) AS listing_id
    FROM `{{PROJECT_ID}}.{{GA4_DATASET_ID}}.events_*`
    WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', start_date) AND FORMAT_DATE('%Y%m%d', end_date)
      AND event_name IN ('sign_up', 'first_open', 'listing_created')
  ),

  agg AS (
    SELECT
      date,
      platform,

      -- sign_up dedupe: per device/user_pseudo_id within 24h (day-level proxy)
      COUNT(DISTINCT IF(event_name = 'sign_up', user_pseudo_id, NULL)) AS sign_up,

      -- first_open is already per device, but keep distinct user_pseudo_id for consistency
      COUNT(DISTINCT IF(event_name = 'first_open', user_pseudo_id, NULL)) AS app_first_open,

      -- listing_created (no explicit dedupe requirement; keep stable by counting distinct listing_id if available)
      COUNT(DISTINCT IF(event_name = 'listing_created',
        COALESCE(listing_id, CONCAT(user_pseudo_id, '-', CAST(event_timestamp AS STRING))),
        NULL
      )) AS listing_created,

      -- listing_published dedupe rule:
      -- - primary: distinct listing_id
      -- - fallback: distinct user_pseudo_id per day (24h proxy)
      -- Risk: if listing_id is missing, multiple published listings by same user same day will be undercounted.
      COUNT(DISTINCT IF(
        event_name = 'listing_created' AND status = 'published',
        COALESCE(listing_id, CONCAT(user_pseudo_id, '-', CAST(date AS STRING))),
        NULL
      )) AS listing_published
    FROM events
    WHERE platform IN ('ios', 'android', 'web') -- keep v1 focused
    GROUP BY 1, 2
  ),

  date_spine AS (
    SELECT d AS date
    FROM UNNEST(GENERATE_DATE_ARRAY(start_date, end_date)) AS d
  ),

  platform_spine AS (
    SELECT platform FROM UNNEST(['ios','android','web']) AS platform
  ),

  spine AS (
    SELECT
      ds.date,
      ps.platform
    FROM date_spine ds
    CROSS JOIN platform_spine ps
  )

  SELECT
    s.date,
    app_id AS app_id,
    s.platform,
    'ga4' AS source_system,
    m.metric,
    CAST(m.value AS NUMERIC) AS value,
    CURRENT_TIMESTAMP() AS ingested_at,
    run_id AS run_id
  FROM spine s
  LEFT JOIN agg a
    ON a.date = s.date AND a.platform = s.platform
  CROSS JOIN UNNEST([
    STRUCT('sign_up' AS metric, IFNULL(a.sign_up, 0) AS value),
    STRUCT('app_first_open' AS metric, IFNULL(a.app_first_open, 0) AS value),
    STRUCT('listing_created' AS metric, IFNULL(a.listing_created, 0) AS value),
    STRUCT('listing_published' AS metric, IFNULL(a.listing_published, 0) AS value)
  ]) m
) s
ON t.date = s.date
  AND t.app_id = s.app_id
  AND t.platform = s.platform
  AND t.source_system = s.source_system
  AND t.metric = s.metric
WHEN MATCHED THEN
  UPDATE SET
    value = s.value,
    ingested_at = s.ingested_at,
    run_id = s.run_id
WHEN NOT MATCHED THEN
  INSERT (
    date,
    app_id,
    platform,
    source_system,
    metric,
    value,
    ingested_at,
    run_id
  )
  VALUES (
    s.date,
    s.app_id,
    s.platform,
    s.source_system,
    s.metric,
    s.value,
    s.ingested_at,
    s.run_id
  );


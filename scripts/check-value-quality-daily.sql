-- Value KPI stability quality check (v1)
-- Ensures listing_created carries event_params: status and listing_id (when deduping listing_published via listing_id).
-- Fail if missing_ratio > 1%.
--
-- IMPORTANT:
-- - This check reads GA4 raw export (events_*) and expects the dataset id to be substituted by the runner:
--   {{GA4_DATASET_ID}}
-- - If this fails, listing_published becomes unstable (cannot reliably derive status='published' or dedupe).
--
-- Writes/upserts one row into analytics_ops.check_value_quality_daily and returns it.

DECLARE check_date DATE DEFAULT CURRENT_DATE('Europe/Stockholm');
DECLARE expected_date DATE DEFAULT @expected_date;
DECLARE p_app_id STRING DEFAULT @app_id;

CREATE TEMP TABLE computed AS
WITH events AS (
  SELECT
    event_name,
    -- Extract commonly used params (as strings)
    (SELECT ep.value.string_value FROM UNNEST(event_params) ep WHERE ep.key = 'status') AS status,
    (SELECT ep.value.string_value FROM UNNEST(event_params) ep WHERE ep.key IN ('listing_id','listingId','listingID')) AS listing_id_str,
    (SELECT CAST(ep.value.int_value AS STRING) FROM UNNEST(event_params) ep WHERE ep.key IN ('listing_id','listingId','listingID')) AS listing_id_int
  FROM `{{PROJECT_ID}}.{{GA4_DATASET_ID}}.events_*`
  WHERE _TABLE_SUFFIX = FORMAT_DATE('%Y%m%d', expected_date)
    AND event_name = 'listing_created'
),
agg AS (
  SELECT
    COUNT(*) AS total_events,
    COUNTIF(status IS NULL OR status = '') AS missing_status_events,
    COUNTIF(COALESCE(NULLIF(listing_id_str, ''), NULLIF(listing_id_int, '')) IS NULL) AS missing_listing_id_events
  FROM events
)
SELECT
  check_date AS check_date,
  p_app_id AS app_id,
  expected_date AS expected_date,
  a.total_events AS total_events,
  a.missing_status_events AS missing_status_events,
  a.missing_listing_id_events AS missing_listing_id_events,
  IFNULL(
    SAFE_DIVIDE(GREATEST(a.missing_status_events, a.missing_listing_id_events), NULLIF(a.total_events, 0)),
    0
  ) AS missing_ratio,
  CASE
    WHEN a.total_events = 0 THEN 'success' -- no events; can't judge quality; don't page
    WHEN SAFE_DIVIDE(GREATEST(a.missing_status_events, a.missing_listing_id_events), NULLIF(a.total_events, 0)) > 0.01 THEN 'failed'
    ELSE 'success'
  END AS status,
  CASE
    WHEN a.total_events = 0 THEN 'No listing_created events yesterday (skipping quality gate).'
    WHEN SAFE_DIVIDE(GREATEST(a.missing_status_events, a.missing_listing_id_events), NULLIF(a.total_events, 0)) > 0.01
      THEN 'TODO: instrument GA4/Firebase event listing_created with event_params status + listing_id (>1% missing). Example: logEvent("listing_created", { status: "published", listing_id: "<id>" }). listing_published may be unstable.'
    ELSE NULL
  END AS note,
  CURRENT_TIMESTAMP() AS checked_at
FROM agg a;

MERGE `{{PROJECT_ID}}.analytics_ops.check_value_quality_daily` t
USING (SELECT * FROM computed) s
ON t.check_date = s.check_date
 AND t.app_id = s.app_id
 AND t.expected_date = s.expected_date
WHEN MATCHED THEN
  UPDATE SET
    total_events = s.total_events,
    missing_status_events = s.missing_status_events,
    missing_listing_id_events = s.missing_listing_id_events,
    missing_ratio = s.missing_ratio,
    status = s.status,
    note = s.note,
    checked_at = s.checked_at
WHEN NOT MATCHED THEN
  INSERT (check_date, app_id, expected_date, total_events, missing_status_events, missing_listing_id_events, missing_ratio, status, note, checked_at)
  VALUES (s.check_date, s.app_id, s.expected_date, s.total_events, s.missing_status_events, s.missing_listing_id_events, s.missing_ratio, s.status, s.note, s.checked_at);

SELECT * FROM computed;


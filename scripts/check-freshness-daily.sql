-- Freshness check (v1)
-- Verifies that fact_kpi_daily contains critical metrics for expected_date.
-- Writes/upserts one row into analytics_ops.check_freshness_daily and returns it.

DECLARE check_date DATE DEFAULT CURRENT_DATE('Europe/Stockholm');
DECLARE expected_date DATE DEFAULT @expected_date;
DECLARE p_app_id STRING DEFAULT @app_id;

DECLARE required_metrics ARRAY<STRING> DEFAULT ['sign_up', 'listing_published'];

CREATE TEMP TABLE computed AS
WITH existing AS (
  SELECT metric
  FROM `{{PROJECT_ID}}.analytics_core.fact_kpi_daily` f
  WHERE f.app_id = p_app_id
    AND date = expected_date
    AND source_system = 'ga4'
    AND metric IN UNNEST(required_metrics)
    AND value IS NOT NULL
),
missing AS (
  SELECT req_metric AS metric
  FROM UNNEST(required_metrics) AS req_metric
  LEFT JOIN existing e
    ON e.metric = req_metric
  WHERE e.metric IS NULL
)
SELECT
  check_date AS check_date,
  p_app_id AS app_id,
  expected_date AS expected_date,
  IFNULL(ARRAY_AGG(metric ORDER BY metric), []) AS missing_metrics,
  IF(COUNT(*) = 0, 'success', 'failed') AS status,
  CURRENT_TIMESTAMP() AS checked_at
FROM missing;

MERGE `{{PROJECT_ID}}.analytics_ops.check_freshness_daily` t
USING (SELECT * FROM computed) s
ON t.check_date = s.check_date
 AND t.app_id = s.app_id
 AND t.expected_date = s.expected_date
WHEN MATCHED THEN
  UPDATE SET
    missing_metrics = s.missing_metrics,
    status = s.status,
    checked_at = s.checked_at
WHEN NOT MATCHED THEN
  INSERT (check_date, app_id, expected_date, missing_metrics, status, checked_at)
  VALUES (s.check_date, s.app_id, s.expected_date, s.missing_metrics, s.status, s.checked_at);

SELECT * FROM computed;


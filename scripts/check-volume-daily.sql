-- Volume anomaly check (v1)
-- Flags if yesterday's value is 0 while prev-7d median > 0, OR if drop >80% vs prev-7d median.
-- Writes/upserts rows into analytics_ops.check_volume_daily (one per metric) and returns them.

DECLARE check_date DATE DEFAULT CURRENT_DATE('Europe/Stockholm');
DECLARE expected_date DATE DEFAULT @expected_date;
DECLARE p_app_id STRING DEFAULT @app_id;

DECLARE metrics ARRAY<STRING> DEFAULT ['sign_up', 'listing_published'];

CREATE TEMP TABLE computed AS
WITH base AS (
  SELECT
    date,
    metric,
    CAST(value AS NUMERIC) AS value
  FROM `{{PROJECT_ID}}.analytics_core.fact_kpi_daily` f
  WHERE f.app_id = p_app_id
    AND source_system = 'ga4'
    AND metric IN UNNEST(metrics)
    AND date BETWEEN DATE_SUB(expected_date, INTERVAL 7 DAY) AND expected_date
),
yday AS (
  SELECT
    metric,
    IFNULL(SUM(CASE WHEN date = expected_date THEN value END), 0) AS value_yesterday
  FROM base
  GROUP BY metric
),
prev7 AS (
  SELECT
    metric,
    -- median across expected_date-7 .. expected_date-1 (7 days)
    CAST(
      APPROX_QUANTILES(CAST(value AS FLOAT64), 101)[OFFSET(50)]
      AS NUMERIC
    ) AS median_prev7
  FROM base
  WHERE date BETWEEN DATE_SUB(expected_date, INTERVAL 7 DAY) AND DATE_SUB(expected_date, INTERVAL 1 DAY)
  GROUP BY metric
)
SELECT
  check_date AS check_date,
  p_app_id AS app_id,
  expected_date AS expected_date,
  metric AS metric,
  CAST(IFNULL(y.value_yesterday, 0) AS NUMERIC) AS value_yesterday,
  CAST(IFNULL(p.median_prev7, 0) AS NUMERIC) AS median_prev7,
  SAFE_DIVIDE(CAST(y.value_yesterday AS FLOAT64), NULLIF(CAST(p.median_prev7 AS FLOAT64), 0)) AS drop_ratio,
  CASE
    WHEN IFNULL(p.median_prev7, 0) <= 0 THEN 'success'
    WHEN IFNULL(y.value_yesterday, 0) = 0 THEN 'failed'
    WHEN CAST(y.value_yesterday AS FLOAT64) < 0.2 * CAST(p.median_prev7 AS FLOAT64) THEN 'failed'
    ELSE 'success'
  END AS status,
  CASE
    WHEN IFNULL(p.median_prev7, 0) <= 0 THEN 'median_prev7<=0 (no baseline)'
    WHEN IFNULL(y.value_yesterday, 0) = 0 THEN 'yesterday=0 while median_prev7>0'
    WHEN CAST(y.value_yesterday AS FLOAT64) < 0.2 * CAST(p.median_prev7 AS FLOAT64) THEN 'drop>80% vs median_prev7'
    ELSE NULL
  END AS reason,
  CURRENT_TIMESTAMP() AS checked_at
FROM UNNEST(metrics) AS metric
LEFT JOIN yday y ON y.metric = metric
LEFT JOIN prev7 p ON p.metric = metric;

MERGE `{{PROJECT_ID}}.analytics_ops.check_volume_daily` t
USING (SELECT * FROM computed) s
ON t.check_date = s.check_date
 AND t.app_id = s.app_id
 AND t.expected_date = s.expected_date
 AND t.metric = s.metric
WHEN MATCHED THEN
  UPDATE SET
    value_yesterday = s.value_yesterday,
    median_prev7 = s.median_prev7,
    drop_ratio = s.drop_ratio,
    status = s.status,
    reason = s.reason,
    checked_at = s.checked_at
WHEN NOT MATCHED THEN
  INSERT (check_date, app_id, expected_date, metric, value_yesterday, median_prev7, drop_ratio, status, reason, checked_at)
  VALUES (s.check_date, s.app_id, s.expected_date, s.metric, s.value_yesterday, s.median_prev7, s.drop_ratio, s.status, s.reason, s.checked_at);

SELECT * FROM computed ORDER BY metric;


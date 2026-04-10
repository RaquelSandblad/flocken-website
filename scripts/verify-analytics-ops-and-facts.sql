-- Verification queries (v1)
-- Replace app_id as needed.

-- =========================================================
-- 1) fact_kpi_daily: last 14 days for critical KPIs
-- =========================================================
SELECT
  date,
  app_id,
  platform,
  metric,
  value,
  run_id,
  ingested_at
FROM `nastahem-tracking.analytics_core.fact_kpi_daily`
WHERE app_id = 'flocken'
  AND metric IN ('sign_up', 'listing_published')
  AND date >= DATE_SUB(CURRENT_DATE('Europe/Stockholm'), INTERVAL 14 DAY)
ORDER BY date DESC, platform, metric;

-- =========================================================
-- 2) Ops: last 14 days of pipeline runs
-- =========================================================
SELECT
  started_at,
  ended_at,
  run_id,
  app_id,
  source_system,
  date_from,
  date_to,
  status,
  records_written,
  error_message
FROM `nastahem-tracking.analytics_ops.pipeline_runs`
WHERE app_id = 'flocken'
  AND DATE(started_at) >= DATE_SUB(CURRENT_DATE('Europe/Stockholm'), INTERVAL 14 DAY)
ORDER BY started_at DESC;

-- =========================================================
-- 3) Ops: freshness checks (last 14)
-- =========================================================
SELECT *
FROM `nastahem-tracking.analytics_ops.check_freshness_daily`
WHERE app_id = 'flocken'
  AND check_date >= DATE_SUB(CURRENT_DATE('Europe/Stockholm'), INTERVAL 14 DAY)
ORDER BY check_date DESC;

-- =========================================================
-- 4) Ops: volume checks (last 14)
-- =========================================================
SELECT *
FROM `nastahem-tracking.analytics_ops.check_volume_daily`
WHERE app_id = 'flocken'
  AND check_date >= DATE_SUB(CURRENT_DATE('Europe/Stockholm'), INTERVAL 14 DAY)
ORDER BY check_date DESC, metric;

-- =========================================================
-- 5) Ops: value quality checks (last 14)
-- =========================================================
SELECT *
FROM `nastahem-tracking.analytics_ops.check_value_quality_daily`
WHERE app_id = 'flocken'
  AND check_date >= DATE_SUB(CURRENT_DATE('Europe/Stockholm'), INTERVAL 14 DAY)
ORDER BY check_date DESC;


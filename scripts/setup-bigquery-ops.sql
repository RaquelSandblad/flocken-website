-- Ops dataset + tables for monitoring/alerting (v1)
-- Project: {{PROJECT_ID}}
-- Dataset: analytics_ops

CREATE SCHEMA IF NOT EXISTS `{{PROJECT_ID}}.analytics_ops`
OPTIONS (
  location = 'EU',
  description = 'Analytics ops tables: pipeline_runs, check_*'
);

-- =========================================================
-- pipeline_runs (one row per app_id/source_system per run_id)
-- =========================================================
CREATE TABLE IF NOT EXISTS `{{PROJECT_ID}}.analytics_ops.pipeline_runs` (
  run_id STRING NOT NULL,
  source_system STRING NOT NULL, -- ga4|meta|asc|gplay|other
  app_id STRING NOT NULL,
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  status STRING NOT NULL, -- success|partial|failed
  records_written INT64 NOT NULL,
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP NOT NULL,
  error_message STRING
)
PARTITION BY DATE(started_at)
CLUSTER BY app_id, source_system, status
OPTIONS (
  description = 'Run metadata for analytics pipeline. Written by runner scripts (D+1/backfills).'
);

-- =========================================================
-- check_freshness_daily
-- =========================================================
CREATE TABLE IF NOT EXISTS `{{PROJECT_ID}}.analytics_ops.check_freshness_daily` (
  check_date DATE NOT NULL,
  app_id STRING NOT NULL,
  expected_date DATE NOT NULL,
  missing_metrics ARRAY<STRING>,
  status STRING NOT NULL, -- success|failed
  checked_at TIMESTAMP NOT NULL
)
PARTITION BY check_date
CLUSTER BY app_id, status
OPTIONS (
  description = 'Freshness check: required metrics present for expected_date (D+1).'
);

-- =========================================================
-- check_volume_daily
-- =========================================================
CREATE TABLE IF NOT EXISTS `{{PROJECT_ID}}.analytics_ops.check_volume_daily` (
  check_date DATE NOT NULL,
  app_id STRING NOT NULL,
  expected_date DATE NOT NULL,
  metric STRING NOT NULL,
  value_yesterday NUMERIC NOT NULL,
  median_prev7 NUMERIC NOT NULL,
  drop_ratio FLOAT64,
  status STRING NOT NULL, -- success|failed
  reason STRING,
  checked_at TIMESTAMP NOT NULL
)
PARTITION BY check_date
CLUSTER BY app_id, metric, status
OPTIONS (
  description = 'Volume anomaly check vs previous 7-day median.'
);

-- =========================================================
-- check_value_quality_daily
-- =========================================================
CREATE TABLE IF NOT EXISTS `{{PROJECT_ID}}.analytics_ops.check_value_quality_daily` (
  check_date DATE NOT NULL,
  app_id STRING NOT NULL,
  expected_date DATE NOT NULL,
  total_events INT64 NOT NULL,
  missing_status_events INT64 NOT NULL,
  missing_listing_id_events INT64 NOT NULL,
  missing_ratio FLOAT64 NOT NULL,
  status STRING NOT NULL, -- success|failed
  note STRING,
  checked_at TIMESTAMP NOT NULL
)
PARTITION BY check_date
CLUSTER BY app_id, status
OPTIONS (
  description = 'Quality check for value KPI stability: listing_created should include status and listing_id.'
);


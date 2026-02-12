-- Core analytics tables for contract-driven analytics (v1)
-- Project: nastahem-tracking
-- Dataset: analytics_core (shared, cross-app)

-- Create core dataset (EU)
CREATE SCHEMA IF NOT EXISTS `nastahem-tracking.analytics_core`
OPTIONS (
  location = 'EU',
  description = 'Core analytics tables (contract-driven): dim_apps, fact_kpi_daily'
);

-- =========================================================
-- dim_apps
-- =========================================================
CREATE TABLE IF NOT EXISTS `nastahem-tracking.analytics_core.dim_apps` (
  app_id STRING NOT NULL,
  app_name STRING NOT NULL,

  ga4_property_id STRING,
  ga4_stream_id_ios STRING,
  ga4_stream_id_android STRING,

  bundle_id_ios STRING,
  package_name_android STRING,
  asc_app_apple_id STRING,

  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
OPTIONS (
  description = 'App configuration table. Adding a new app should be config-driven (no pipeline rebuild).'
);

-- Seed at least one app (Flocken). Unknown IDs can be NULL until set.
MERGE `nastahem-tracking.analytics_core.dim_apps` t
USING (
  SELECT
    'flocken' AS app_id,
    'Flocken' AS app_name,
    CAST(NULL AS STRING) AS ga4_property_id,
    CAST(NULL AS STRING) AS ga4_stream_id_ios,
    CAST(NULL AS STRING) AS ga4_stream_id_android,
    CAST(NULL AS STRING) AS bundle_id_ios,
    CAST(NULL AS STRING) AS package_name_android,
    CAST(NULL AS STRING) AS asc_app_apple_id,
    CURRENT_TIMESTAMP() AS created_at,
    CURRENT_TIMESTAMP() AS updated_at
) s
ON t.app_id = s.app_id
WHEN MATCHED THEN
  UPDATE SET
    app_name = s.app_name,
    ga4_property_id = s.ga4_property_id,
    ga4_stream_id_ios = s.ga4_stream_id_ios,
    ga4_stream_id_android = s.ga4_stream_id_android,
    bundle_id_ios = s.bundle_id_ios,
    package_name_android = s.package_name_android,
    asc_app_apple_id = s.asc_app_apple_id,
    updated_at = CURRENT_TIMESTAMP()
WHEN NOT MATCHED THEN
  INSERT (
    app_id,
    app_name,
    ga4_property_id,
    ga4_stream_id_ios,
    ga4_stream_id_android,
    bundle_id_ios,
    package_name_android,
    asc_app_apple_id,
    created_at,
    updated_at
  )
  VALUES (
    s.app_id,
    s.app_name,
    s.ga4_property_id,
    s.ga4_stream_id_ios,
    s.ga4_stream_id_android,
    s.bundle_id_ios,
    s.package_name_android,
    s.asc_app_apple_id,
    s.created_at,
    s.updated_at
  );

-- =========================================================
-- fact_kpi_daily
-- =========================================================
CREATE TABLE IF NOT EXISTS `nastahem-tracking.analytics_core.fact_kpi_daily` (
  date DATE NOT NULL,
  app_id STRING NOT NULL,
  platform STRING NOT NULL, -- ios|android|web|unknown
  source_system STRING NOT NULL, -- ga4|meta|asc|gplay|other
  metric STRING NOT NULL, -- canonical metric name
  value NUMERIC NOT NULL,

  -- Common optional dimensions
  channel STRING,
  country STRING,
  store_source STRING,

  -- Paid dimensions
  campaign_id STRING,
  campaign_name STRING,
  adset_id STRING,
  ad_id STRING,

  -- Ops fields
  ingested_at TIMESTAMP NOT NULL,
  source_date DATE,
  run_id STRING
)
PARTITION BY date
CLUSTER BY app_id, platform, metric
OPTIONS (
  description = 'Core daily KPI fact table. Grain: date × app_id × platform × metric (+ optional segments).'
);


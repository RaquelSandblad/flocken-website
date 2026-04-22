-- Verifierar om cta_click-events från quiz.flocken.info har Meta-attribution
-- via collected_traffic_source.manual_campaign_id (GA4 auto-populated från UTM).
--
-- Hypotes: analytikern letade på event_params.campaign_id (saknas) men missade
-- att attribution faktiskt ligger på collected_traffic_source.manual_campaign_id.
--
-- Körning: bq query --nouse_legacy_sql --project_id=nastahem-tracking < bq-verify-quiz-attribution.sql

WITH quiz_cta AS (
  SELECT
    event_date,
    event_timestamp,
    event_name,
    -- Event-scoped auto-attribution (från UTM på landningen)
    collected_traffic_source.manual_source         AS ct_source,
    collected_traffic_source.manual_medium         AS ct_medium,
    collected_traffic_source.manual_campaign_name  AS ct_campaign_name,
    collected_traffic_source.manual_campaign_id    AS ct_campaign_id,
    collected_traffic_source.manual_content        AS ct_content,
    -- Session-scoped attribution
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'session_source')        AS session_source,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'session_medium')        AS session_medium,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'session_campaign')      AS session_campaign,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location')         AS page_location,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_hostname')         AS hostname,
    -- Event-nivå (vad koden själv pushar)
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'campaign_id')           AS event_campaign_id,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'quiz_slug')             AS quiz_slug,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'cta_name')              AS cta_name
  FROM `nastahem-tracking.analytics_518338757.events_*`
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY))
                          AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND event_name = 'cta_click'
)
SELECT
  event_date,
  COUNT(*)                                                 AS total_cta_click,
  COUNTIF(hostname LIKE 'quiz.flocken.info%'
       OR page_location LIKE '%quiz.flocken.info%')        AS on_quiz_domain,
  COUNTIF(ct_campaign_id IS NOT NULL)                      AS has_ct_campaign_id,
  COUNTIF(ct_campaign_name LIKE '%cid006%')                AS matches_cid006_name,
  COUNTIF(ct_campaign_name LIKE '%cb003%')                 AS matches_cb003_name,
  COUNTIF(session_campaign LIKE '%cid006%')                AS session_matches_cid006,
  COUNTIF(ct_source = 'meta' OR ct_medium = 'paid_social') AS has_meta_attribution,
  COUNTIF(event_campaign_id IS NOT NULL)                   AS has_event_campaign_id
FROM quiz_cta
GROUP BY event_date
ORDER BY event_date DESC;

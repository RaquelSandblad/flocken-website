-- Fullständig attribution-verifikation för cta_click på quiz.flocken.info.
-- collected_traffic_source (event-scoped från URL-UTM) är NULL på cta_click
-- eftersom quiz-URL:er saknar UTM. MEN traffic_source (user-scoped) ska finnas.

WITH cta AS (
  SELECT
    event_date,
    user_pseudo_id,
    -- Event-scoped (ofta NULL på cta_click för att quiz-URL:er saknar UTM)
    collected_traffic_source.manual_source         AS ct_source,
    collected_traffic_source.manual_campaign_name  AS ct_campaign_name,
    -- User-scoped (first-touch på user-nivå, propageras till alla events)
    traffic_source.source                          AS ts_source,
    traffic_source.medium                          AS ts_medium,
    traffic_source.name                            AS ts_name,
    -- Event_params session-scoped attribution
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') AS page_location,
    (SELECT value.int_value    FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS ga_session_id
  FROM `nastahem-tracking.analytics_518338757.events_*`
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY))
                          AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND event_name = 'cta_click'
)
SELECT
  event_date,
  COUNTIF(page_location LIKE '%quiz.flocken.info%') AS quiz_cta_clicks,
  COUNTIF(page_location LIKE '%quiz.flocken.info%' AND ct_campaign_name IS NOT NULL) AS quiz_cta_event_scoped,
  COUNTIF(page_location LIKE '%quiz.flocken.info%' AND ts_source IS NOT NULL) AS quiz_cta_user_scoped,
  COUNTIF(page_location LIKE '%quiz.flocken.info%' AND ts_source = 'fb') AS quiz_cta_from_fb,
  COUNTIF(page_location LIKE '%quiz.flocken.info%' AND ts_source = 'ig') AS quiz_cta_from_ig
FROM cta
GROUP BY event_date
ORDER BY event_date DESC;

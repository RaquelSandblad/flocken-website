-- Verifierar om page_view-events på quiz.flocken.info har Meta-attribution.
-- Om JA → tracking funkar på landing men förloras till cta_click (session-tracking brister)
-- Om NEJ → UTM-parametrar försvinner innan GA4 loggar eventet (troligen middleware/consent-relaterat)

WITH pv AS (
  SELECT
    event_date,
    event_name,
    collected_traffic_source.manual_source         AS ct_source,
    collected_traffic_source.manual_medium         AS ct_medium,
    collected_traffic_source.manual_campaign_name  AS ct_campaign_name,
    collected_traffic_source.manual_campaign_id    AS ct_campaign_id,
    collected_traffic_source.manual_content        AS ct_content,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') AS page_location,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_hostname') AS hostname,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'campaign')      AS event_campaign,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'source')        AS event_source
  FROM `nastahem-tracking.analytics_518338757.events_*`
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY))
                          AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND event_name = 'page_view'
)
SELECT
  event_date,
  COUNTIF(hostname LIKE 'quiz.flocken.info%' OR page_location LIKE '%quiz.flocken.info%') AS quiz_pageviews,
  COUNTIF((hostname LIKE 'quiz.flocken.info%' OR page_location LIKE '%quiz.flocken.info%')
          AND ct_campaign_id IS NOT NULL) AS quiz_pv_with_ct_campaign_id,
  COUNTIF((hostname LIKE 'quiz.flocken.info%' OR page_location LIKE '%quiz.flocken.info%')
          AND ct_campaign_name LIKE '%cid006%') AS quiz_pv_cid006,
  COUNTIF((hostname LIKE 'quiz.flocken.info%' OR page_location LIKE '%quiz.flocken.info%')
          AND (ct_source = 'meta' OR ct_medium = 'paid_social')) AS quiz_pv_meta_attributed,
  COUNTIF((hostname LIKE 'quiz.flocken.info%' OR page_location LIKE '%quiz.flocken.info%')
          AND page_location LIKE '%utm_campaign=%') AS quiz_pv_url_has_utm,
  -- Jämförelse: flocken.info pageviews (för att verifiera att attribution fungerar där)
  COUNTIF(hostname = 'flocken.info' AND ct_campaign_name LIKE '%cb003%') AS flocken_pv_cb003
FROM pv
GROUP BY event_date
ORDER BY event_date DESC;

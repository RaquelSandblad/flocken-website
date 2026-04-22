-- Vilka UTM-kampanjer finns faktiskt på quiz.flocken.info pageviews de senaste 5 dagarna?
WITH pv AS (
  SELECT
    collected_traffic_source.manual_source         AS ct_source,
    collected_traffic_source.manual_medium         AS ct_medium,
    collected_traffic_source.manual_campaign_name  AS ct_campaign_name,
    collected_traffic_source.manual_content        AS ct_content,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') AS page_location
  FROM `nastahem-tracking.analytics_518338757.events_*`
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY))
                          AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND event_name = 'page_view'
)
SELECT
  ct_source,
  ct_medium,
  ct_campaign_name,
  ct_content,
  COUNT(*) AS events
FROM pv
WHERE page_location LIKE '%quiz.flocken.info%'
GROUP BY 1,2,3,4
ORDER BY events DESC
LIMIT 20;

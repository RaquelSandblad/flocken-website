# GA4 Attribution i BigQuery — vilken kolumn ska jag använda?

**Senast uppdaterad:** 2026-04-21
**Kontext:** 2026-04-21 drog en analytiker felaktigt slutsatsen att tracking på quiz.flocken.info var trasig. Tre olika BQ-queries visade att tracking funkar — hen använde fel kolumn. Detta dokument förebygger samma misstag.

---

## TL;DR

| Uppgift | Använd kolumn |
|---|---|
| "Kom detta event från Meta-kampanj X?" — event-scoped | `traffic_source.*` (user-scoped, propageras till alla events) |
| "Kom denna pageview direkt från UTM?" — event-scoped | `collected_traffic_source.*` |
| "Kom hela sessionen från Meta?" — session-scoped | `event_params.session_*` |
| **Meta-kampanj-ID att filtrera på** | **Numerisk** (t.ex. `120241209461460455`), INTE `"cid006"` |

**Regel:** `collected_traffic_source` är NULL på events där URL:en saknar UTM-parametrar (t.ex. cta_click på quiz-URL utan ?utm). Använd `traffic_source.*` för cross-event attribution.

---

## De tre attribueringsfälten

GA4 BigQuery-exporten har tre separata attribution-kolumner, och de fungerar olika. De flesta analys-fel kommer av att man förväxlar dem.

### 1. `collected_traffic_source` — EVENT-scoped, från URL

```sql
collected_traffic_source.manual_source         -- t.ex. 'fb', 'ig', 'google'
collected_traffic_source.manual_medium         -- t.ex. 'paid', 'cpc', 'organic'
collected_traffic_source.manual_campaign_name  -- t.ex. '120241209461460455' (Meta-ID)
collected_traffic_source.manual_campaign_id    -- oftast NULL, Meta ger ingen separat ID
collected_traffic_source.manual_content        -- utm_content
```

- **Populeras automatiskt från UTM-parametrar i aktuell URL.**
- NULL om eventet sker på en URL utan UTM (t.ex. `quiz.flocken.info/quiz/valpar_socialisering` efter att användaren klickat runt internt).
- Page_view på landningssidan (med UTM) har dessa fält satta. Click-events längre in i sessionen har dem oftast INTE.

### 2. `traffic_source` — USER-scoped, first-touch

```sql
traffic_source.source  -- t.ex. 'fb', 'ig'
traffic_source.medium  -- t.ex. 'paid', 'referral'
traffic_source.name    -- kampanj-namn eller Meta-ID
```

- **Populeras en gång per user_pseudo_id (första touch) och propageras till ALLA events.**
- Finns på cta_click, quiz_complete, button_click etc även när URL:en saknar UTM.
- Detta är rätt kolumn för "kom det här konverteringseventet från Meta-kampanj X".

### 3. `event_params.session_*` — SESSION-scoped

```sql
(SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'session_source')
(SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'session_campaign')
```

- Finns bara på vissa events, inte alla.
- Används sällan — prioritera `traffic_source.*` för user-nivå och `collected_traffic_source.*` för event-nivå.

---

## Meta-kampanj-ID är numeriskt

Meta Ads API returnerar kampanj-ID:n som **numeriska strängar**, t.ex:

```
CID006 (c_flo_swe_init_quiz_inst_cid006)   → 120241209461460455
CID003 (c_flo_swe_init_dogowner_lpv_h01)   → 120243902361470455
```

När Meta-annonsens UTM-parametrar genereras använder Meta **ID:t**, inte kampanj-namnet. Så i GA4/BQ ser du:

```
collected_traffic_source.manual_campaign_name = '120241209461460455'
```

**INTE** `'cid006'` eller `'cb003_natverk'`. Om du söker på `LIKE '%cid006%'` får du 0 träffar även när tracking funkar perfekt.

**Kom ihåg:** om du vill filtrera på kampanj i BQ, slå upp Meta-ID:t först (i Ads Manager eller `flocken_ads/creative_bases/<cid>/launch_result.md`).

---

## Kod-exempel

### Räkna cta_click per Meta-kampanj (senaste 7 dagar)

```sql
WITH cta AS (
  SELECT
    event_date,
    user_pseudo_id,
    traffic_source.source    AS ts_source,
    traffic_source.name      AS ts_campaign,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') AS page_location
  FROM `nastahem-tracking.analytics_518338757.events_*`
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
                          AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND event_name = 'cta_click'
)
SELECT
  event_date,
  ts_source,
  ts_campaign,
  COUNT(*) AS cta_clicks,
  COUNT(DISTINCT user_pseudo_id) AS unique_users
FROM cta
WHERE page_location LIKE '%quiz.flocken.info%'
  AND ts_source IN ('fb', 'ig')  -- bara Meta-attribuerade
GROUP BY 1,2,3
ORDER BY event_date DESC, cta_clicks DESC;
```

### Funnel: landning → CTA per kampanj

```sql
WITH events AS (
  SELECT
    user_pseudo_id,
    event_name,
    traffic_source.name AS campaign,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') AS page_location
  FROM `nastahem-tracking.analytics_518338757.events_*`
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
                          AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND event_name IN ('page_view', 'quiz_start', 'cta_click')
)
SELECT
  campaign,
  COUNT(DISTINCT IF(event_name = 'page_view', user_pseudo_id, NULL))  AS visitors,
  COUNT(DISTINCT IF(event_name = 'quiz_start', user_pseudo_id, NULL)) AS quiz_starters,
  COUNT(DISTINCT IF(event_name = 'cta_click', user_pseudo_id, NULL))  AS cta_clickers
FROM events
WHERE campaign = '120241209461460455'  -- CID006
GROUP BY campaign;
```

---

## Vanliga fel (och hur de upptäcks)

| Symptom i query | Rotorsak | Fix |
|---|---|---|
| `0 events från kampanj X` trots att Meta visar klick | Letar på `collected_traffic_source` istället för `traffic_source` för cta_click | Använd `traffic_source.*` för events utan UTM i URL |
| `LIKE '%cid006%'` ger 0 träffar | Söker på campaign-sträng, inte Meta-numeriskt ID | Filtrera på `traffic_source.name = '120241209461460455'` |
| Page_view har attribution men cta_click har inte | Normal beteende — cta_click sker på URL utan UTM | Använd user-scoped `traffic_source.*` |
| Meta-klick (451) vs GA4-pageviews (427) gap | Cookie-banner/consent blockerar PageView | Separat problem: se `docs/meta/LPV_DIAGNOSIS.md` |

---

## Referens

- [GA4 BigQuery Export schema](https://support.google.com/analytics/answer/7029846) (officiell docs)
- `scripts/bq-verify-quiz-attribution.sql` — verifiering event-scoped (visar NULL)
- `scripts/bq-verify-cta-user-attribution.sql` — verifiering user-scoped (visar attribution finns)
- `scripts/bq-verify-utm-values.sql` — listar faktiska UTM-värden som hittas
- Tidigare fel: `flocken_ads/creative_bases/cb003/launch_result.md` v1.1 (2026-04-21)

---

**Principen:** *Om du ser "0 attribuerade events" — verifiera först vilken attribution-kolumn du använder. Det är nästan alltid rätt orsak.*

# BigQuery Quiz Analytics

**Status:** ✅ Script klart – kör när quiz-events flödat in (t+1 dag)  
**Dataset:** `nastahem-tracking.analytics_518338757`  
**Script:** `scripts/setup-bigquery-quiz-views.sql`

---

## Vad skapas

| Objekt | Typ | Innehåll |
|--------|-----|----------|
| `flocken_curated.quiz_events` | VIEW | Alla quiz-events med utplockade parametrar (slug, score, bucket, cta) |
| `flocken_curated.quiz_funnel` | VIEW | Starter vs genomförda per quiz + badges + CTA-konvertering |
| `flocken_marts.quiz_daily` | TABLE | Daglig snapshot per quiz (schemalägg) |

---

## Events som trackas (via GTM)

| Event | När | Parametrar |
|-------|-----|-----------|
| `quiz_start` | Första frågan visas | `quiz_slug` |
| `quiz_complete` | Svar på fråga 10 | `quiz_slug`, `quiz_score` |
| `quiz_score_bucket` | Resultat visas | `quiz_slug`, `quiz_bucket` (gold/silver/bronze) |
| `quiz_cta_click` | CTA-klick på resultat | `quiz_slug`, `quiz_cta` |
| `quiz_cta_download_click` | Download-klick | `quiz_slug` |
| `quiz_share` | Dela-knapp | `quiz_slug` |

---

## Köra scriptet

1. Gå till [BigQuery Console](https://console.cloud.google.com/bigquery?project=nastahem-tracking)
2. Välj projekt: `nastahem-tracking`
3. Öppna `scripts/setup-bigquery-quiz-views.sql`
4. Kör hela scriptet (skapar/ersätter views + tabell)

---

## Nyckelrapporter

### Populäraste quiz (starter + genomförda)
```sql
SELECT * FROM `nastahem-tracking.flocken_curated.quiz_funnel`;
```

### Daglig aktivitet senaste 14 dagarna
```sql
SELECT *
FROM `nastahem-tracking.flocken_marts.quiz_daily`
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 14 DAY)
ORDER BY date DESC, starts DESC;
```

### Snittpoäng och badge-fördelning
```sql
SELECT
  quiz_slug,
  avg_score,
  gold_badges,
  silver_badges,
  bronze_badges,
  completion_rate_pct
FROM `nastahem-tracking.flocken_curated.quiz_funnel`;
```

### Konvertering quiz → app-download
```sql
SELECT
  quiz_slug,
  total_completions,
  download_clicks,
  download_conversion_pct
FROM `nastahem-tracking.flocken_curated.quiz_funnel`
ORDER BY download_conversion_pct DESC;
```

---

## Schemalägg daglig uppdatering

För att `flocken_marts.quiz_daily` ska uppdateras varje dag:

1. BigQuery Console → **Scheduled queries** → **Create scheduled query**
2. Klistra in TABLE-delen av scriptet (från `CREATE OR REPLACE TABLE ...`)
3. Schedule: `Every day 07:00` (Stockholm = UTC+1/+2)
4. Destination: `flocken_marts.quiz_daily` (append mode)

---

## Notera

- Första data dyker upp dagen efter att quiz-events börjat skickas (daily export ~04:00 UTC)
- `_TABLE_SUFFIX >= '20260216'` i `quiz_events` view kan justeras om du vill inkludera äldre data
- `quiz_score` är ett heltal 0–10 (antal rätta svar)
- `quiz_bucket` är `gold` / `silver` / `bronze`

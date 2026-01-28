# BigQuery Test Queries - Flocken

**Datum:** 2025-01-05  
**Status:** Datasets skapade, väntar på GA4 export

---

## ✅ Datasets Verifierade

Jag ser att följande datasets finns i BigQuery:
- ✅ `flocken_raw` (skapad Jan 4, 2026)
- ✅ `flocken_curated` (skapad Jan 4, 2026)
- ✅ `flocken_marts` (skapad Jan 4, 2026)

---

## 🔍 Steg 1: Hitta GA4 Export Dataset

GA4 kan exportera till antingen:
1. **Egen dataset** (t.ex. `analytics_518338757` eller `analytics_505640674`)
2. **flocken_raw** (om du valde det i GA4 linking)

### **1.1 Kontrollera GA4 → BigQuery Linking**
1. Gå till: https://analytics.google.com
2. Välj property: **Flocken (Webb)** (G-7B1SVKL89Q)
3. Admin → **BigQuery Linking**
4. Kolla vilket dataset som är valt:
   - Om `flocken_raw` → Data kommer dit
   - Om `analytics_518338757` (eller liknande) → GA4 skapade egen dataset

### **1.2 Lista Alla Datasets i BigQuery**
1. Gå till: https://console.cloud.google.com/bigquery
2. Välj project: `nastahem-tracking`
3. I vänstermenyn, expandera projectet
4. Leta efter datasets som börjar med `analytics_` (t.ex. `analytics_518338757`)

---

## ✅ Steg 2: Kör Test Query för Raw Data

### **2.1 Om GA4 exporterar till `flocken_raw`:**

```sql
-- Test query för flocken_raw
SELECT 
  event_date,
  event_name,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_pseudo_id) as unique_users
FROM `nastahem-tracking.flocken_raw.events_*`
WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
GROUP BY event_date, event_name
ORDER BY event_date DESC, event_count DESC
LIMIT 20;
```

### **2.2 Om GA4 exporterar till egen dataset (t.ex. `analytics_518338757`):**

**Uppdatera dataset-namnet i query:**
```sql
-- Test query för GA4 egen dataset
SELECT 
  event_date,
  event_name,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_pseudo_id) as unique_users
FROM `nastahem-tracking.analytics_518338757.events_*`
WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
GROUP BY event_date, event_name
ORDER BY event_date DESC, event_count DESC
LIMIT 20;
```

**Eller om dataset-ID är `analytics_505640674`:**
```sql
FROM `nastahem-tracking.analytics_505640674.events_*`
```

### **2.3 Hur man Kör Query i BigQuery:**

1. **Öppna BigQuery Console:**
   - Gå till: https://console.cloud.google.com/bigquery
   - Välj project: `nastahem-tracking`

2. **Klicka på "SQL query" eller "Compose New Query":**
   - Du ser en knapp "SQL query" i "Create new" sektionen
   - Eller klicka på "Compose New Query" längst upp

3. **Klistra in Query:**
   - Kopiera query från ovan
   - Uppdatera dataset-namnet om nödvändigt
   - Klistra in i query editor

4. **Kör Query:**
   - Klicka på **Run** (eller "Kör")
   - Vänta på resultat

### **2.4 Förväntat Resultat:**

**Om data finns:**
- ✅ Tabell med rader: `event_date`, `event_name`, `event_count`, `unique_users`
- ✅ Events som `page_view`, `session_start`, `first_visit`
- ✅ `event_count` > 0

**Om data INTE finns ännu:**
- ❌ Error: `does not match any table`
- **Lösning:** Vänta några timmar (daily export körs kl 04:00 UTC)
- Eller kontrollera att GA4 → BigQuery linking är aktiverad

---

## ✅ Steg 3: Lista Alla Tabeller i Dataset

### **3.1 Lista Tabeller i flocken_raw:**

```sql
-- Lista alla tabeller i flocken_raw (korrekt INFORMATION_SCHEMA query)
SELECT 
  table_name,
  creation_time,
  row_count,
  size_bytes
FROM `nastahem-tracking.flocken_raw.INFORMATION_SCHEMA.TABLES`
ORDER BY creation_time DESC;
```

**OBS:** `last_modified_time` finns inte i INFORMATION_SCHEMA.TABLES. Använd `creation_time` istället.

### **3.2 Lista Tabeller i GA4 Dataset (om egen dataset):**

```sql
-- Lista alla tabeller i analytics dataset
SELECT 
  table_name,
  creation_time,
  last_modified_time,
  row_count,
  size_bytes
FROM `nastahem-tracking.analytics_518338757.INFORMATION_SCHEMA.TABLES`
ORDER BY last_modified_time DESC;
```

**Uppdatera dataset-ID om nödvändigt.**

---

## ✅ Steg 4: Test Query för Senaste Data

### **4.1 Senaste Events (Senaste 24 timmar):**

```sql
-- Senaste events (streaming export)
SELECT 
  TIMESTAMP_MICROS(event_timestamp) AS event_time,
  event_name,
  user_pseudo_id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') AS page_location
FROM `nastahem-tracking.flocken_raw.events_intraday_*`
WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', CURRENT_DATE())
ORDER BY event_timestamp DESC
LIMIT 100;
```

**Uppdatera dataset-namnet om GA4 exporterar till egen dataset.**

### **4.2 Daglig Sammanfattning:**

```sql
-- Daglig sammanfattning senaste 7 dagarna
SELECT 
  event_date,
  COUNT(*) as total_events,
  COUNT(DISTINCT user_pseudo_id) as unique_users,
  COUNT(DISTINCT event_name) as unique_event_types,
  COUNTIF(event_name = 'page_view') as page_views,
  COUNTIF(event_name = 'session_start') as sessions
FROM `nastahem-tracking.flocken_raw.events_*`
WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
GROUP BY event_date
ORDER BY event_date DESC;
```

---

## 🔍 Troubleshooting

### **Problem: "does not match any table"**

**Orsak:** GA4 har inte exporterat data ännu, eller fel dataset-namn.

**Lösning:**
1. Kontrollera GA4 → BigQuery linking (vilket dataset är valt?)
2. Lista tabeller i dataset (Steg 3)
3. Vänta några timmar om linking är ny (daily export körs kl 04:00 UTC)

### **Problem: Query ger inga resultat**

**Orsak:** Data finns men WHERE-clause filtrerar bort allt.

**Lösning:**
1. Ta bort WHERE-clause temporärt:
   ```sql
   SELECT * 
   FROM `nastahem-tracking.flocken_raw.events_*`
   LIMIT 10;
   ```
2. Om detta fungerar, data finns men datum-filter är för strikt

### **Problem: Fel dataset-namn**

**Lösning:**
1. Lista alla datasets i projectet:
   ```sql
   SELECT schema_name 
   FROM `nastahem-tracking.INFORMATION_SCHEMA.SCHEMATA`
   WHERE schema_name LIKE 'analytics_%' OR schema_name LIKE 'flocken_%'
   ORDER BY schema_name;
   ```
2. Använd rätt dataset-namn i queries

---

## 📋 Checklist

- [ ] Datasets finns: `flocken_raw`, `flocken_curated`, `flocken_marts`
- [ ] GA4 → BigQuery linking är aktiverad
- [ ] Dataset-namn är känt (flocken_raw eller analytics_XXX)
- [ ] Test query körs utan fel
- [ ] Data finns i raw dataset (events_* tabeller)
- [ ] Views kan skapas när data finns

---

## 📚 Nästa Steg

När data finns i raw dataset:
1. Uppdatera SQL script med rätt dataset-namn
2. Kör views SQL (Steg 2-5 i `scripts/setup-bigquery-datasets.sql`)
3. Testa curated views och daily metrics

Se: `docs/BIGQUERY_SETUP_INSTRUCTIONS.md` för views setup.


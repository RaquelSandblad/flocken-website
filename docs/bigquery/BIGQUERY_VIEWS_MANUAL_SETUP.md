# BigQuery Views - Manuell Setup (Rekommenderat)

**Datum:** 2025-01-06  
**Status:** ⚠️ Automatisk script fungerar inte pga olika dataset locations

---

## ⚠️ Varför Manuell Setup?

Datasets finns i olika locations:
- `flocken_curated`: `europe-west1`
- `flocken_marts`: `europe-west1`  
- `analytics_518338757`: `EU`

BigQuery kräver att queries körs med exakt location-matchning. När queries refererar till datasets i olika locations, fungerar automatisk script inte. BigQuery Console hanterar detta automatiskt.

---

## ✅ Steg-för-Steg: Kör SQL i BigQuery Console

### **Steg 1: Öppna BigQuery Console**
1. Gå till: https://console.cloud.google.com/bigquery
2. Välj project: **nastahem-tracking**

### **Steg 2: Öppna SQL Script**
1. Klicka på **"SQL query"** eller **"Compose New Query"**
2. Öppna filen: `scripts/setup-bigquery-views-flocken.sql`
3. Kopiera hela innehållet

### **Steg 3: Klistra In och Kör**
1. Klistra in SQL i query editor
2. **VIKTIGT:** I query settings (höger sida), välj **"Processing location"** → **"Auto-detect"** eller **"EU"**
3. Klicka på **"Run"** (Kör)

### **Steg 4: Verifiera Resultat**
Du bör se att följande skapas:
- ✅ `flocken_curated.events` - View
- ✅ `flocken_marts.daily_metrics` - Table
- ✅ `flocken_curated.user_journey` - View
- ✅ `flocken_curated.conversion_funnel` - View

---

## 🧪 Testa Views

### **Test Curated Events:**

```sql
SELECT 
  event_date,
  event_name,
  COUNT(*) as count
FROM `nastahem-tracking.flocken_curated.events`
WHERE event_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
GROUP BY event_date, event_name
ORDER BY event_date DESC, count DESC
LIMIT 20;
```

### **Test Daily Metrics:**

```sql
SELECT *
FROM `nastahem-tracking.flocken_marts.daily_metrics`
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
ORDER BY date DESC
LIMIT 10;
```

---

## 📋 Checklist

- [ ] BigQuery Console öppnad
- [ ] Project valt: `nastahem-tracking`
- [ ] SQL script kopierat från `setup-bigquery-views-flocken.sql`
- [ ] Processing location satt till "Auto-detect" eller "EU"
- [ ] Query kört utan fel
- [ ] Views och tables skapade
- [ ] Test queries returnerar data

---

## 🔍 Troubleshooting

### **Problem: "does not match any table"**

**Lösning:**
- Kontrollera att Processing location är satt till "Auto-detect" eller "EU"
- Verifiera att GA4 data finns i `analytics_518338757`

### **Problem: "Dataset not found"**

**Lösning:**
- Verifiera att datasets finns: `flocken_curated`, `flocken_marts`
- Kontrollera att du är i rätt project: `nastahem-tracking`

---

## 📚 Relaterad Dokumentation

- **BigQuery Data Found:** `docs/BIGQUERY_DATA_FOUND.md`
- **Views SQL:** `scripts/setup-bigquery-views-flocken.sql`

---

**Nästa steg:** När views är skapade, kan du använda queries från `docs/BIGQUERY_DATA_FOUND.md` för analys!


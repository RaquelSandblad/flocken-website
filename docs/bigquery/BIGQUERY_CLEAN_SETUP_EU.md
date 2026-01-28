# BigQuery Clean Setup - EU Location

**Datum:** 2025-01-06  
**Syfte:** Rensa bort gamla datasets och skapa nya i EU location (samma som GA4)

---

## 🎯 Översikt

Eftersom det inte finns historisk data, kan vi enkelt:
1. Ta bort gamla datasets (europe-west1)
2. Skapa nya datasets i EU location
3. Skapa views/tables direkt

**Tidsåtgång:** 5 minuter

---

## ✅ Steg 1: Ta Bort Gamla Datasets

### **1.1 Öppna BigQuery Console**
- Gå till: https://console.cloud.google.com/bigquery
- Välj project: `nastahem-tracking`

### **1.2 Ta Bort flocken_curated**
1. I vänstermenyn, expandera `nastahem-tracking`
2. Högerklicka på `flocken_curated`
3. Välj **"Delete dataset"**
4. Skriv dataset-namnet för att bekräfta: `flocken_curated`
5. Klicka på **"Delete"**

### **1.3 Ta Bort flocken_marts**
1. Högerklicka på `flocken_marts`
2. Välj **"Delete dataset"**
3. Skriv dataset-namnet för att bekräfta: `flocken_marts`
4. Klicka på **"Delete"**

---

## ✅ Steg 2: Skapa Nya Datasets i EU Location

### **2.1 Skapa flocken_curated**

**Via SQL (Rekommenderat):**
1. Klicka på **"SQL query"** eller **"Compose New Query"**
2. Klistra in detta SQL:

```sql
CREATE SCHEMA `nastahem-tracking.flocken_curated`
OPTIONS(
  description="Processed and standardized GA4 data för Flocken",
  location="EU"
);
```

3. **VIKTIGT:** Sätt Processing location till **"EU"** (i query settings)
4. Klicka på **"Run"**

**Via UI:**
1. Klicka på project-namnet → **"Create dataset"**
2. **Dataset ID:** `flocken_curated`
3. **Data location:** Välj **"EU (multi-region)"**
4. Klicka på **"Create dataset"**

### **2.2 Skapa flocken_marts**

**Via SQL:**
```sql
CREATE SCHEMA `nastahem-tracking.flocken_marts`
OPTIONS(
  description="Pre-calculated business metrics för Flocken",
  location="EU"
);
```

**Via UI:**
1. Klicka på project-namnet → **"Create dataset"**
2. **Dataset ID:** `flocken_marts`
3. **Data location:** Välj **"EU (multi-region)"**
4. Klicka på **"Create dataset"**

### **2.3 Verifiera**
- ✅ I vänstermenyn, expandera `nastahem-tracking`
- ✅ Du bör se: `flocken_curated` och `flocken_marts`
- ✅ Båda ska ha location: `EU (multi-region)`

---

## ✅ Steg 3: Skapa Views/Tables

### **3.1 Öppna SQL Script**
- Öppna filen: `scripts/setup-bigquery-views-flocken.sql`
- Kopiera hela innehållet

### **3.2 Kör SQL**
1. I BigQuery Console, klicka på **"SQL query"**
2. Klistra in SQL-scriptet
3. **VIKTIGT:** Sätt Processing location till **"EU"** (i query settings)
4. Klicka på **"Run"**

### **3.3 Verifiera**
- ✅ Views skapade: `flocken_curated.events`, `flocken_curated.user_journey`, `flocken_curated.conversion_funnel`
- ✅ Table skapad: `flocken_marts.daily_metrics`

---

## ✅ Steg 4: Testa Views

### **4.1 Test Curated Events:**

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

**Förväntat resultat:**
- ✅ Tabell med events
- ✅ `count` > 0

---

## 📋 Checklist

- [ ] Gamla datasets borttagna (`flocken_curated`, `flocken_marts` i europe-west1)
- [ ] Nya datasets skapade i EU location
- [ ] Processing location satt till EU
- [ ] Views/tables skapade
- [ ] Test queries returnerar data

---

## 🎯 Resultat

**Efter detta:**
- ✅ Alla datasets i samma location (`EU`)
- ✅ Konsistent med GA4 export (`analytics_518338757`)
- ✅ Automation scripts fungerar perfekt
- ✅ Inga cross-location problem framåt
- ✅ Långsiktigt stabilt

---

## 📚 Relaterad Dokumentation

- **Location Decision:** `docs/BIGQUERY_LOCATION_DECISION.md`
- **Create Views:** `docs/BIGQUERY_CREATE_VIEWS_STEP_BY_STEP.md`

---

**Klart!** Nu har du en ren setup med alla datasets i EU location! 🎉


# Fix BigQuery Location Error

**Problem:** "Dataset not found in location EU"

**Orsak:** `flocken_curated` och `flocken_marts` är i location `europe-west1`, men query körs med location `EU`.

---

## ✅ Lösning: Använd "Auto-detect" eller "europe-west1"

### **Alternativ 1: Auto-detect (Rekommenderat)**

1. **I BigQuery Console:**
   - Klicka på **"More"** → **"Query settings"** (eller kugghjulet)
   - Under **"Processing location"**, välj **"Auto-detect"**
   - Klicka på **"Save"**

2. **Kör query igen:**
   - BigQuery kommer automatiskt att hitta rätt location för datasets

### **Alternativ 2: Använd "europe-west1"**

1. **I BigQuery Console:**
   - Klicka på **"More"** → **"Query settings"**
   - Under **"Processing location"**, välj **"europe-west1"**
   - Klicka på **"Save"**

2. **Kör query igen:**
   - Query kommer att köras med `europe-west1` location

---

## 🔍 Varför Detta Fungerar

**Dataset locations:**
- `flocken_curated`: `europe-west1` ✅
- `flocken_marts`: `europe-west1` ✅
- `analytics_518338757`: `EU` ✅

**När du skapar views/tables:**
- Views/tables skapas i `flocken_curated` och `flocken_marts` (som är i `europe-west1`)
- Men queries refererar också till `analytics_518338757` (som är i `EU`)

**"Auto-detect" hanterar detta automatiskt:**
- BigQuery hittar rätt location för varje dataset
- Cross-location queries fungerar när location är "Auto-detect"

---

## 📋 Steg-för-Steg: Fix Location

### **Steg 1: Öppna Query Settings**

1. I BigQuery Console, klicka på **"More"** (tre prickar) eller kugghjulet
2. Välj **"Query settings"**

### **Steg 2: Välj Processing Location**

1. Scrolla ner till **"Processing location"**
2. Välj **"Auto-detect"** (rekommenderat)
   - Eller välj **"europe-west1"** om Auto-detect inte fungerar
3. Klicka på **"Save"**

### **Steg 3: Kör Query Igen**

1. Klistra in SQL igen (eller använd samma query)
2. Klicka på **"Run"**
3. Query bör nu fungera!

---

## 🔍 Verifiera Location

Om du vill kolla vilken location datasets har:

```sql
SELECT schema_name, location
FROM `nastahem-tracking.INFORMATION_SCHEMA.SCHEMATA`
WHERE schema_name IN ('flocken_curated', 'flocken_marts', 'analytics_518338757')
ORDER BY schema_name;
```

---

## ✅ När Location Är Fixad

När du har satt location till "Auto-detect" eller "europe-west1":
- ✅ Queries fungerar korrekt
- ✅ Views/tables kan skapas
- ✅ Cross-location queries hanteras automatiskt

---

**Nästa steg:** När location är fixad, kör SQL-scriptet igen från `docs/BIGQUERY_CREATE_VIEWS_STEP_BY_STEP.md`


# BigQuery Export - Väntar på GA4 Data

**Datum:** 2025-01-05  
**Status:** ⏳ GA4 Linking aktiverad, väntar på första export

---

## ✅ Vad som är Klart

Jag ser i GA4 att:
- ✅ BigQuery linking är aktiverad för `nastahem-tracking` projektet
- ✅ Dataset location: `EU (eu)`
- ✅ Daily export: Aktiverad ("Varje dag")
- ✅ Streaming export: Aktiverad ("Streaming (efter bästa förmåga)")
- ✅ Datasets skapade: `flocken_raw`, `flocken_curated`, `flocken_marts`

---

## ⏳ Vad som Saknas

**Problemet:** GA4 har inte exporterat någon data ännu.

**Bevis:**
- GA4 visar: `0 /1 miljoner i daglig gräns` (inga events exporterade)
- BigQuery query ger: `does not match any table` (inga tabeller finns)
- Ingen `analytics_*` dataset finns (GA4 skapar den när första data exporteras)

---

## 🔍 Varför Inga Tabeller Finns

### **Hur GA4 → BigQuery Export Fungerar:**

1. **GA4 Linking Aktiveras** ✅ (Klart)
   - Du länkar GA4 property till BigQuery project
   - Du väljer dataset location (EU)

2. **GA4 Väntar på Data** ⏳ (Nuvarande steg)
   - GA4 skapar INTE dataset automatiskt när linking aktiveras
   - GA4 väntar på att det ska finnas data att exportera

3. **Första Export Sker** ⏳ (Väntar)
   - När GA4 har data att exportera, skapar den dataset och tabeller
   - Daily export: Körs kl 04:00 UTC nästa dag
   - Streaming export: Börjar omedelbart när data finns

4. **Tabeller Skapas** ⏳ (Väntar)
   - GA4 skapar antingen:
     - Egen dataset: `analytics_518338757` (eller liknande ID)
     - Eller exporterar till `flocken_raw` (om valt i linking)

---

## ✅ Steg 1: Verifiera att GA4 Har Data

### **1.1 Kontrollera GA4 Realtime**
1. Gå till: https://analytics.google.com
2. Välj property: **Flocken (Webb)** (G-7B1SVKL89Q)
3. Klicka på **Reports** → **Realtime**
4. Verifiera:
   - ✅ **Active users right now**: Minst 1 (surfa på flocken.info i ny flik)
   - ✅ **Events by Event name**: `page_view` events syns
   - ✅ **Pages and screens**: flocken.info-sidor syns

**Om INGA data syns i Realtime:**
- GTM taggen fungerar inte → Kontrollera GTM Preview Mode
- GA4 property är fel → Kontrollera Measurement ID

**Om data syns i Realtime:**
- ✅ GA4 har data
- ⏳ Vänta på BigQuery export (se Steg 2)

---

## ⏳ Steg 2: Vänta på Första Export

### **2.1 När Sker Första Export?**

**Daily Export:**
- Körs kl **04:00 UTC** varje dag
- Exporterar data från föregående dag
- Skapar tabell: `events_YYYYMMDD` (t.ex. `events_20250105`)

**Streaming Export:**
- Börjar omedelbart när GA4 har data
- Kan ta några minuter till några timmar
- Skapar tabell: `events_intraday_YYYYMMDD`

### **2.2 Hur Länge Vänta?**

**Minimum:**
- Om GA4 har data nu → Streaming export börjar inom 1-2 timmar
- Daily export körs nästa dag kl 04:00 UTC

**Om inget händer efter 24 timmar:**
- Kontrollera GA4 → BigQuery linking igen
- Verifiera att GA4 faktiskt har data (Realtime)
- Kontrollera att rätt dataset är valt i linking

---

## 🔍 Steg 3: Kontrollera När Data Kommer In

### **3.1 Lista Alla Datasets (Korrekt Query)**

```sql
-- Lista alla datasets i projectet
SELECT schema_name 
FROM `nastahem-tracking.INFORMATION_SCHEMA.SCHEMATA`
WHERE schema_name LIKE 'analytics_%' 
   OR schema_name LIKE 'flocken_%'
   OR schema_name LIKE 'nastahem_%'
ORDER BY schema_name;
```

**Förväntat resultat:**
- Om GA4 skapade egen dataset: Du ser `analytics_518338757` (eller liknande ID)
- Om GA4 exporterar till flocken_raw: Du ser `flocken_raw` (men inga tabeller ännu)

### **3.2 Lista Tabeller i Dataset (Korrekt Query)**

**Om GA4 exporterar till `flocken_raw`:**
```sql
-- Lista tabeller i flocken_raw
SELECT 
  table_name,
  creation_time,
  row_count,
  size_bytes
FROM `nastahem-tracking.flocken_raw.INFORMATION_SCHEMA.TABLES`
ORDER BY creation_time DESC;
```

**Om GA4 skapade egen dataset (t.ex. `analytics_518338757`):**
```sql
-- Lista tabeller i analytics dataset
SELECT 
  table_name,
  creation_time,
  row_count,
  size_bytes
FROM `nastahem-tracking.analytics_518338757.INFORMATION_SCHEMA.TABLES`
ORDER BY creation_time DESC;
```

**Förväntat resultat när data finns:**
- ✅ Tabeller: `events_20250105`, `events_intraday_20250105`, etc.
- ✅ `row_count` > 0
- ✅ `creation_time` är idag eller igår

---

## 📋 Checklist - Väntar på Export

### **Verifiera GA4 Data:**
- [ ] GA4 Realtime visar data (page_view events)
- [ ] GA4 har aktivitet idag
- [ ] GTM taggen fungerar korrekt

### **Verifiera BigQuery Linking:**
- [ ] GA4 → BigQuery linking är aktiverad
- [ ] Projekt: `nastahem-tracking`
- [ ] Location: `EU (eu)`
- [ ] Daily export: Aktiverad
- [ ] Streaming export: Aktiverad

### **Vänta på Export:**
- [ ] Vänta minst 1-2 timmar (för streaming export)
- [ ] Eller vänta till nästa dag kl 04:00 UTC (för daily export)
- [ ] Kör dataset-listing query igen (Steg 3.1)
- [ ] Kör tabell-listing query igen (Steg 3.2)

### **När Tabeller Finns:**
- [ ] Kör test query för raw data
- [ ] Uppdatera views SQL med rätt dataset-namn
- [ ] Skapa curated views och daily metrics

---

## 🎯 Nästa Steg När Data Kommer In

### **Steg 1: Identifiera Dataset**
- Kör query från Steg 3.1 för att lista datasets
- Notera dataset-namnet (flocken_raw eller analytics_XXX)

### **Steg 2: Uppdatera SQL Script**
- Öppna: `scripts/setup-bigquery-datasets.sql`
- Uppdatera alla `FROM` clauses med rätt dataset-namn
- Om GA4 skapade `analytics_518338757`, ändra:
  ```sql
  FROM `nastahem-tracking.flocken_raw.events_*`
  ```
  till:
  ```sql
  FROM `nastahem-tracking.analytics_518338757.events_*`
  ```

### **Steg 3: Kör Views SQL**
- Kör Steg 2-5 från `setup-bigquery-datasets.sql`
- Detta skapar: `flocken_curated.events`, `flocken_marts.daily_metrics`, etc.

### **Steg 4: Testa Views**
- Kör test queries från `docs/BIGQUERY_TEST_QUERIES.md`
- Verifiera att data finns i curated views

---

## 🔍 Troubleshooting

### **Problem: Inga tabeller efter 24 timmar**

**Lösning:**
1. Verifiera att GA4 har data (Realtime)
2. Kontrollera GA4 → BigQuery linking igen
3. Verifiera att rätt dataset är valt i linking
4. Kontakta Google Support om problemet kvarstår

### **Problem: GA4 visar "0 events" i BigQuery linking**

**Orsak:** GA4 har ingen data att exportera.

**Lösning:**
1. Verifiera att GTM taggen fungerar (Preview Mode)
2. Surfa på flocken.info och generera events
3. Vänta några minuter och kolla GA4 Realtime
4. När data syns i Realtime, vänta på BigQuery export

---

## 📚 Relaterad Dokumentation

- **BigQuery Setup:** `docs/BIGQUERY_SETUP_INSTRUCTIONS.md`
- **Test Queries:** `docs/BIGQUERY_TEST_QUERIES.md`
- **Verify Data Flow:** `docs/VERIFY_DATA_FLOW.md`

---

**Status:** ⏳ Väntar på GA4 att exportera första batch av data. Kontrollera igen om 1-2 timmar eller imorgon efter kl 04:00 UTC.


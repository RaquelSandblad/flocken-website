# BigQuery Location Decision - Långsiktig Lösning

**Datum:** 2025-01-06  
**Syfte:** Bestämma optimal location för alla datasets för att undvika framtida problem

---

## 📊 Nuvarande Situation

**Datasets och locations:**
- `flocken_curated`: `europe-west1` (Belgium)
- `flocken_marts`: `europe-west1` (Belgium)
- `analytics_518338757`: `EU` (multi-region, skapad automatiskt av GA4)

**Problem:**
- Olika locations gör automation svårare
- Cross-location queries kräver specialhantering
- Risk för problem framåt när nya views/tables skapas

---

## 🎯 Location Alternativ

### **Alternativ 1: EU (Multi-region)** ⭐ Rekommenderat

**Fördelar:**
- ✅ GA4 exporterar redan till `EU` location
- ✅ Ingen data-migration behövs för GA4 dataset
- ✅ EU multi-region ger bra performance i hela EU
- ✅ Automatisk failover och redundancy
- ✅ Bäst för långsiktig automation

**Nackdelar:**
- ⚠️ Måste skapa nya datasets i `EU` location
- ⚠️ Måste kopiera data från gamla datasets (om det finns data)

**När detta är bäst:**
- Du vill ha automation framåt
- Du vill undvika location-problem
- Du vill ha konsistent setup

---

### **Alternativ 2: europe-north2 (Stockholm)**

**Fördelar:**
- ✅ Närmast Sverige (Stockholm)
- ✅ Lägre latency för svenska användare
- ✅ Bättre performance för svenska queries

**Nackdelar:**
- ❌ GA4 exporterar till `EU`, inte `europe-north2`
- ❌ Måste ändra GA4 export location (om möjligt)
- ❌ Risk att GA4 inte kan exportera till `europe-north2`
- ❌ Mer komplext setup

**När detta är bäst:**
- Du prioriterar latency för svenska användare
- Du kan ändra GA4 export location
- Du är OK med mer komplext setup

---

### **Alternativ 3: europe-west1 (Belgium)** - Nuvarande

**Fördelar:**
- ✅ Datasets finns redan där
- ✅ Inget att ändra just nu

**Nackdelar:**
- ❌ GA4 exporterar till `EU`, inte `europe-west1`
- ❌ Olika locations = problem med automation
- ❌ Cross-location queries kräver specialhantering

**När detta är bäst:**
- Du vill inte ändra något just nu
- Du är OK med manuell hantering framåt

---

## 🎯 Rekommendation: Alternativ 1 - EU (Multi-region)

### **Varför EU är Bäst:**

1. **GA4 Kompatibilitet:**
   - GA4 exporterar redan till `EU` location
   - Ingen ändring behövs för GA4 export
   - Konsistent från start

2. **Automation:**
   - Alla datasets i samma location
   - Automation scripts fungerar perfekt
   - Inga cross-location problem

3. **Långsiktigt:**
   - Enklare att hantera
   - Färre problem framåt
   - Bättre för scaling

4. **Performance:**
   - EU multi-region ger bra performance i hela EU
   - Automatisk load balancing
   - Redundancy och failover

---

## ✅ Implementation: Skapa Nya Datasets i EU

### **Steg 1: Skapa Nya Datasets i EU**

Kör dessa queries i BigQuery Console:

```sql
-- Skapa flocken_curated i EU location
CREATE SCHEMA IF NOT EXISTS `nastahem-tracking.flocken_curated_eu`
OPTIONS(
  description="Processed and standardized GA4 data för Flocken (EU location)",
  location="EU"
);

-- Skapa flocken_marts i EU location
CREATE SCHEMA IF NOT EXISTS `nastahem-tracking.flocken_marts_eu`
OPTIONS(
  description="Pre-calculated business metrics för Flocken (EU location)",
  location="EU"
);
```

**Eller via BigQuery Console:**
1. Klicka på project → "Create dataset"
2. Dataset ID: `flocken_curated_eu`
3. Location: `EU (multi-region)`
4. Klicka "Create dataset"
5. Upprepa för `flocken_marts_eu`

### **Steg 2: Uppdatera SQL Script**

Uppdatera `scripts/setup-bigquery-views-flocken.sql`:
- Ändra `flocken_curated` → `flocken_curated_eu`
- Ändra `flocken_marts` → `flocken_marts_eu`

### **Steg 3: Skapa Views/Tables**

Kör uppdaterat SQL-script i BigQuery Console med Processing location: `EU`

### **Steg 4: Ta Bort Gamla Datasets (När Allt Fungerar)**

När nya views/tables fungerar:
1. Verifiera att allt fungerar korrekt
2. Ta bort gamla datasets: `flocken_curated` och `flocken_marts`
3. Döp om nya datasets: `flocken_curated_eu` → `flocken_curated`

---

## 🔍 Alternativ: Använda europe-north2

### **Om du vill använda europe-north2:**

**Problem:**
- GA4 exporterar till `EU`, inte `europe-north2`
- Du kan INTE ändra GA4 export location efter att den är skapad
- Du måste skapa ny GA4 → BigQuery linking med `europe-north2` från start

**Lösning:**
1. Ta bort nuvarande GA4 → BigQuery linking
2. Skapa ny linking och välj `europe-north2` som location
3. GA4 kommer skapa nytt dataset i `europe-north2`
4. Skapa alla datasets i `europe-north2`

**Nackdelar:**
- Du förlorar historisk data från nuvarande export
- Mer komplext setup
- Risk att GA4 inte kan exportera till `europe-north2`

---

## 📋 Checklist: Bästa Långsiktiga Lösning

### **Rekommendation: Använd EU Location**

- [ ] Skapa nya datasets i `EU` location
- [ ] Uppdatera SQL scripts med nya dataset-namn
- [ ] Skapa views/tables i nya datasets
- [ ] Verifiera att allt fungerar
- [ ] Ta bort gamla datasets (när allt fungerar)
- [ ] Döp om nya datasets till original-namn

### **Resultat:**
- ✅ Alla datasets i samma location (`EU`)
- ✅ GA4 export fungerar utan ändringar
- ✅ Automation scripts fungerar perfekt
- ✅ Inga cross-location problem framåt
- ✅ Långsiktigt stabilt och enkelt att hantera

---

## 💡 Slutsats

**Bästa lösning:** Använd `EU` location för alla datasets.

**Varför:**
- GA4 exporterar redan till `EU`
- Konsistent från start
- Bäst för automation
- Långsiktigt stabilt

**europe-north2:**
- Bättre latency för Sverige
- Men kräver ändring av GA4 export (komplext)
- Risk för problem

---

**Nästa steg:** Skapa nya datasets i `EU` location och uppdatera SQL scripts.


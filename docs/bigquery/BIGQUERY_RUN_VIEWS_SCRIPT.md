# Kör BigQuery Views Script Automatiskt

**Datum:** 2025-01-06  
**Status:** ✅ Script klart, behöver autentisering

---

## 🎯 Syfte

Kör BigQuery views SQL-scriptet automatiskt via Node.js istället för manuellt i BigQuery Console.

---

## ✅ Steg 1: Autentisera med Google Cloud

### **Alternativ A: gcloud auth (Rekommenderat)**

1. **Installera gcloud CLI** (om inte redan installerat):
   - Ladda ner: https://cloud.google.com/sdk/docs/install
   - Eller via PowerShell: `(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe"); Start-Process "$env:Temp\GoogleCloudSDKInstaller.exe"`

2. **Autentisera:**
   ```powershell
   gcloud auth application-default login
   ```
   - Detta öppnar en webbläsare där du loggar in med ditt Google-konto
   - Välj rätt konto (t.ex. tb.sandblad@gmail.com)

3. **Verifiera:**
   ```powershell
   gcloud auth list
   ```

### **Alternativ B: Service Account Key**

1. **Skapa Service Account** (om inte redan finns):
   - Gå till: https://console.cloud.google.com/iam-admin/serviceaccounts
   - Välj project: `nastahem-tracking`
   - Klicka på "Create Service Account"
   - Namn: `bigquery-automation`
   - Roll: `BigQuery Admin`
   - Klicka på "Create and Continue" → "Done"

2. **Skapa Key:**
   - Klicka på service account → "Keys" → "Add Key" → "Create new key"
   - Välj JSON
   - Ladda ner filen (t.ex. `nastahem-tracking-key.json`)

3. **Spara Key i Projektet:**
   - Kopiera JSON-filen till: `scripts/nastahem-tracking-key.json`
   - **VIKTIGT:** Lägg till i `.gitignore` så den inte committas!

4. **Sätt Environment Variable:**
   ```powershell
   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\Users\Torbjörn\Desktop\flocken-website\scripts\nastahem-tracking-key.json"
   ```

---

## ✅ Steg 2: Kör Script

### **2.1 Navigera till Projektet:**
```powershell
$desktop = [Environment]::GetFolderPath("Desktop")
cd (Join-Path $desktop "flocken-website")
```

### **2.2 Kör Script:**
```powershell
node scripts/setup-bigquery-views-automated.js
```

### **2.3 Förväntat Resultat:**
```
🚀 Starting BigQuery Views Setup for Flocken...
📊 Project: nastahem-tracking
📍 Location: EU
📦 GA4 Dataset: analytics_518338757

📄 Found 4 SQL statements to execute

🔍 Running: View: flocken_curated.events...
   ⏳ Job ID: xxxxxx
   ✅ Completed: View: flocken_curated.events

🔍 Running: Table: flocken_marts.daily_metrics...
   ⏳ Job ID: xxxxxx
   ✅ Completed: Table: flocken_marts.daily_metrics

✅ BigQuery Views Setup completed successfully!
```

---

## 🔍 Troubleshooting

### **Problem: "Could not load the default credentials"**

**Lösning:**
1. Kör: `gcloud auth application-default login`
2. Eller sätt: `$env:GOOGLE_APPLICATION_CREDENTIALS = "path/to/key.json"`

### **Problem: "Permission denied"**

**Lösning:**
1. Verifiera att du har BigQuery Admin permissions i projektet
2. Kontrollera att rätt Google-konto är valt: `gcloud auth list`

### **Problem: "does not match any table"**

**Lösning:**
1. Verifiera att GA4 dataset finns: `analytics_518338757`
2. Om GA4 skapade annat dataset-ID, uppdatera `GA4_DATASET_ID` i scriptet

### **Problem: "Module not found: @google-cloud/bigquery"**

**Lösning:**
```powershell
npm install @google-cloud/bigquery
```

---

## 📋 Checklist

- [ ] gcloud CLI installerat (Alternativ A) eller Service Account key skapad (Alternativ B)
- [ ] Autentisering klar (`gcloud auth application-default login` eller `GOOGLE_APPLICATION_CREDENTIALS` satt)
- [ ] `@google-cloud/bigquery` installerat (`npm install`)
- [ ] Script körs utan fel
- [ ] Views skapade i BigQuery Console

---

## 📚 Relaterad Dokumentation

- **BigQuery Data Found:** `docs/BIGQUERY_DATA_FOUND.md`
- **Views SQL:** `scripts/setup-bigquery-views-flocken.sql`
- **Automated Script:** `scripts/setup-bigquery-views-automated.js`

---

**Nästa steg:** När scriptet körts, testa views med queries från `docs/BIGQUERY_DATA_FOUND.md`


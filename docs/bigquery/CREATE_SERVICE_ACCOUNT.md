# Skapa Service Account för BigQuery Automation

**Datum:** 2025-01-06  
**Syfte:** Skapa service account så att scripts kan köras automatiskt utan manuell inloggning

---

## 🎯 Varför Service Account?

- ✅ **Automatisering:** Scripts kan köras utan manuell inloggning
- ✅ **Säkerhet:** Key-filen kan sparas lokalt (men aldrig committas)
- ✅ **CI/CD:** Fungerar i automation pipelines
- ✅ **Enkel:** Bara ladda ner JSON-filen och lägg i projektet

---

## ✅ Steg 1: Skapa Service Account

### **1.1 Öppna Google Cloud Console**
- Gå till: https://console.cloud.google.com/iam-admin/serviceaccounts
- Välj project: **nastahem-tracking**

### **1.2 Skapa Ny Service Account**
1. Klicka på **"+ CREATE SERVICE ACCOUNT"** (eller "Skapa service account")
2. **Service account details:**
   - **Name:** `bigquery-automation`
   - **Description:** `Service account för BigQuery automation scripts`
   - Klicka på **"CREATE AND CONTINUE"**

### **1.3 Lägg till Roller**
1. I "Grant this service account access to project":
   - **Role:** Välj **"BigQuery Admin"**
   - (Sök efter "BigQuery Admin" i sökfältet)
   - Klicka på **"ADD ANOTHER ROLE"** om du vill lägga till fler
   - Klicka på **"CONTINUE"**

### **1.4 Grant Access (Optional)**
- Du kan hoppa över detta steg (klicka på **"DONE"**)
- Eller lägg till användare som kan använda denna service account

---

## ✅ Steg 2: Skapa och Ladda Ner Key

### **2.1 Öppna Service Account**
1. I listan över service accounts, klicka på **"bigquery-automation"**
2. Gå till fliken **"KEYS"** (eller "Nycklar")

### **2.2 Skapa Ny Key**
1. Klicka på **"ADD KEY"** → **"Create new key"**
2. Välj **"JSON"**
3. Klicka på **"CREATE"**
4. En JSON-fil laddas ner automatiskt (t.ex. `nastahem-tracking-xxxxx.json`)

### **2.3 Spara Key i Projektet**
1. **Döp om filen** till: `nastahem-tracking-key.json`
2. **Flytta filen** till: `scripts/nastahem-tracking-key.json`
   - Full path: `C:\Users\Torbjörn\Desktop\flocken-website\scripts\nastahem-tracking-key.json`

**VIKTIGT:** 
- ✅ Filen är redan i `.gitignore` (kommer inte committas)
- ✅ Behåll filen säkert (den ger full BigQuery access)
- ✅ Dela aldrig filen publikt

---

## ✅ Steg 3: Verifiera Setup

### **3.1 Kontrollera att Filen Finns**
```powershell
$desktop = [Environment]::GetFolderPath("Desktop")
$flockenPath = Join-Path $desktop "flocken-website"
Test-Path (Join-Path $flockenPath "scripts\nastahem-tracking-key.json")
```

**Förväntat resultat:** `True`

### **3.2 Testa Script**
```powershell
$desktop = [Environment]::GetFolderPath("Desktop")
$flockenPath = Join-Path $desktop "flocken-website"
cd $flockenPath
node scripts/setup-bigquery-views-automated.js
```

**Förväntat resultat:**
```
🔑 Using service account key: scripts/nastahem-tracking-key.json
🚀 Starting BigQuery Views Setup for Flocken...
...
✅ BigQuery Views Setup completed successfully!
```

---

## 🔍 Troubleshooting

### **Problem: "Could not load the default credentials"**

**Lösning:**
1. Verifiera att filen finns: `scripts/nastahem-tracking-key.json`
2. Kontrollera att filnamnet är exakt: `nastahem-tracking-key.json`
3. Verifiera att filen är giltig JSON (öppna och kolla)

### **Problem: "Permission denied"**

**Lösning:**
1. Kontrollera att service account har **BigQuery Admin** roll
2. Gå till: https://console.cloud.google.com/iam-admin/serviceaccounts
3. Klicka på service account → **"PERMISSIONS"** tab
4. Verifiera att **"BigQuery Admin"** finns i listan

### **Problem: "Service account key not found"**

**Lösning:**
1. Verifiera att filen finns på rätt plats: `scripts/nastahem-tracking-key.json`
2. Kontrollera att filnamnet matchar exakt (case-sensitive)
3. Om filen har annat namn, döp om den till `nastahem-tracking-key.json`

---

## 📋 Checklist

- [ ] Service account skapad: `bigquery-automation`
- [ ] Roll tillagd: **BigQuery Admin**
- [ ] Key skapad och nedladdad (JSON)
- [ ] Fil döpt om till: `nastahem-tracking-key.json`
- [ ] Fil flyttad till: `scripts/nastahem-tracking-key.json`
- [ ] Fil är i `.gitignore` (redan gjort)
- [ ] Script testat och fungerar

---

## 🔒 Säkerhet

### **Vad är Service Account Key?**
- En JSON-fil som ger programmatisk access till Google Cloud
- Innehåller credentials för att autentisera mot BigQuery API
- Ger full BigQuery Admin access i projektet

### **Säkerhetsbestämmelser:**
- ✅ **Aldrig committa** key-filen till Git (redan i `.gitignore`)
- ✅ **Dela aldrig** filen publikt eller via email
- ✅ **Behåll filen lokalt** på din dator
- ✅ **Ta bort key** om den komprometteras (GCP Console → Service Account → Keys → Delete)

### **Om Key Komprometteras:**
1. Gå till: https://console.cloud.google.com/iam-admin/serviceaccounts
2. Klicka på service account → **"KEYS"**
3. Hitta rätt key → **"DELETE"**
4. Skapa ny key och ersätt filen

---

## 📚 Relaterad Dokumentation

- **Run Views Script:** `docs/BIGQUERY_RUN_VIEWS_SCRIPT.md`
- **Automated Script:** `scripts/setup-bigquery-views-automated.js`

---

**Nästa steg:** När key-filen är på plats, kan scripts köras automatiskt utan manuell inloggning!


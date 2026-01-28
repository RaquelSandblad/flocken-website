# Använd Befintlig Service Account

**Datum:** 2025-01-06  
**Syfte:** Använda en befintlig service account istället för att skapa ny

---

## ✅ Du Behöver INTE Skapa Ny Service Account!

Scriptet kan använda vilken service account key som helst, så länge den har **BigQuery Admin** permissions.

---

## 🎯 Tre Sätt att Använda Befintlig Service Account

### **Alternativ 1: Lägg Key-fil i Scripts-mappen** (Enklast)

1. **Hitta din befintliga service account key-fil** (JSON)
   - Den kan heta vad som helst (t.ex. `my-service-account-key.json`)
   - Eller ladda ner ny key från befintlig service account (se nedan)

2. **Kopiera filen till scripts-mappen:**
   ```
   scripts/your-existing-key.json
   ```

3. **Scriptet hittar den automatiskt!**
   - Scriptet letar efter filer som slutar med `-key.json`, `-credentials.json`, eller innehåller `service-account`
   - Använder första filen den hittar

### **Alternativ 2: Använd Environment Variable**

1. **Sätt environment variable:**
   ```powershell
   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\your\service-account-key.json"
   ```

2. **Scriptet använder denna automatiskt!**

### **Alternativ 3: Ladda Ner Ny Key från Befintlig Service Account**

Om du har en service account men inte key-filen:

1. **Gå till:** https://console.cloud.google.com/iam-admin/serviceaccounts
2. **Välj project:** `nastahem-tracking`
3. **Hitta din befintliga service account**
4. **Klicka på den** → **"KEYS"** tab
5. **"ADD KEY"** → **"Create new key"** → Välj **JSON**
6. **Ladda ner filen**
7. **Kopiera till:** `scripts/your-key-name.json`

---

## ✅ Verifiera att Service Account Har Rätt Permissions

### **Kontrollera BigQuery Admin Roll:**

1. **Gå till:** https://console.cloud.google.com/iam-admin/serviceaccounts
2. **Välj project:** `nastahem-tracking`
3. **Klicka på din service account**
4. **Gå till "PERMISSIONS" tab**
5. **Verifiera att "BigQuery Admin" finns i listan**

### **Om BigQuery Admin Saknas:**

1. **Klicka på "GRANT ACCESS"** (eller "Bevilja åtkomst")
2. **Lägg till roll:** `BigQuery Admin`
3. **Spara**

---

## 🧪 Testa Setup

### **1. Kontrollera att Key-filen Finns:**

```powershell
$desktop = [Environment]::GetFolderPath("Desktop")
$flockenPath = Join-Path $desktop "flocken-website"
Get-ChildItem (Join-Path $flockenPath "scripts") -Filter "*.json" | Select-Object Name
```

**Förväntat resultat:** Lista över JSON-filer i scripts-mappen

### **2. Kör Script:**

```powershell
$desktop = [Environment]::GetFolderPath("Desktop")
$flockenPath = Join-Path $desktop "flocken-website"
cd $flockenPath
node scripts/setup-bigquery-views-automated.js
```

**Förväntat resultat:**
```
🔑 Using service account key: scripts/your-key-name.json
🚀 Starting BigQuery Views Setup for Flocken...
...
✅ BigQuery Views Setup completed successfully!
```

---

## 🔍 Troubleshooting

### **Problem: "Could not load the default credentials"**

**Lösning:**
1. Verifiera att key-filen finns i `scripts/` mappen
2. Kontrollera att filen är giltig JSON (öppna och kolla)
3. Verifiera att filnamnet matchar pattern (`-key.json`, `-credentials.json`, eller innehåller `service-account`)

### **Problem: "Permission denied"**

**Lösning:**
1. Kontrollera att service account har **BigQuery Admin** roll
2. Gå till service account → **PERMISSIONS** tab
3. Lägg till **BigQuery Admin** om den saknas

### **Problem: Script hittar inte key-filen**

**Lösning:**
1. Kontrollera att filen är i `scripts/` mappen (inte root)
2. Filnamnet måste matcha: `*-key.json`, `*-credentials.json`, eller innehålla `service-account`
3. Eller använd environment variable: `$env:GOOGLE_APPLICATION_CREDENTIALS = "path/to/key.json"`

---

## 📋 Checklist

- [ ] Befintlig service account har **BigQuery Admin** roll
- [ ] Key-fil (JSON) finns i `scripts/` mappen ELLER `GOOGLE_APPLICATION_CREDENTIALS` är satt
- [ ] Key-filen är giltig JSON
- [ ] Script testat och fungerar

---

## 📚 Relaterad Dokumentation

- **Create New Service Account:** `docs/CREATE_SERVICE_ACCOUNT.md` (om du vill skapa ny)
- **Run Views Script:** `docs/BIGQUERY_RUN_VIEWS_SCRIPT.md`

---

**Nästa steg:** När key-filen är på plats, kan scriptet köras automatiskt!


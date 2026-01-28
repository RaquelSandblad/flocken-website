# Var Hittar Jag Service Account Key-filen?

**Kort svar:** Filen finns INTE i projektet ännu - den måste skapas/laddas ner från Google Cloud Console först.

---

## 🔍 Var Kommer Filen Ifrån?

Service account key-filen är en **JSON-fil som skapas i Google Cloud Console**. Den finns inte automatiskt i ditt projekt.

---

## 📍 Var Ska Filen Ligga?

När du har laddat ner filen, ska den ligga här:

```
flocken-website/
  └── scripts/
      └── din-key-fil.json  ← Här ska den ligga
```

**Full path på din dator:**
```
C:\Users\Torbjörn\Desktop\flocken-website\scripts\din-key-fil.json
```

---

## ✅ Steg-för-Steg: Hitta eller Skapa Key-filen

### **Steg 1: Kolla Om Du Redan Har En Key-fil**

1. **Kolla i Downloads-mappen:**
   - Öppna: `C:\Users\Torbjörn\Downloads`
   - Leta efter filer som slutar med `.json` och har namn som `nastahem-tracking-xxxxx.json` eller liknande

2. **Kolla om du har Google Cloud credentials någonstans:**
   - Leta efter filer med namn som innehåller "service", "account", "credentials", "key"

### **Steg 2: Om Du INTE Har En Key-fil - Ladda Ner Från Google Cloud**

Du behöver gå till Google Cloud Console och ladda ner en key-fil:

1. **Öppna Google Cloud Console:**
   - Gå till: https://console.cloud.google.com/iam-admin/serviceaccounts
   - Välj project: **nastahem-tracking**

2. **Hitta eller Skapa Service Account:**
   
   **Om du redan har service accounts:**
   - Kolla listan över service accounts
   - Välj en som har **BigQuery Admin** roll (eller lägg till rollen)
   - Klicka på den
   
   **Om du INTE har någon service account:**
   - Klicka på **"+ CREATE SERVICE ACCOUNT"**
   - Namn: `bigquery-automation`
   - Roll: **BigQuery Admin**
   - Klicka **"CREATE AND CONTINUE"** → **"DONE"**

3. **Ladda Ner Key-filen:**
   - Klicka på service account → **"KEYS"** tab
   - Klicka på **"ADD KEY"** → **"Create new key"**
   - Välj **"JSON"**
   - Klicka på **"CREATE"**
   - En JSON-fil laddas ner automatiskt (t.ex. `nastahem-tracking-xxxxx.json`)

4. **Flytta Filen till Projektet:**
   - Filen laddas ner till din **Downloads-mappen** (t.ex. `C:\Users\Torbjörn\Downloads\nastahem-tracking-xxxxx.json`)
   - **Döp om filen** till något enkelt (t.ex. `nastahem-tracking-key.json`)
   - **Kopiera filen** till: `C:\Users\Torbjörn\Desktop\flocken-website\scripts\nastahem-tracking-key.json`

---

## 🧪 Verifiera att Filen Finns

Kör detta i PowerShell för att kolla om filen finns:

```powershell
$desktop = [Environment]::GetFolderPath("Desktop")
$flockenPath = Join-Path $desktop "flocken-website"
$keyPath = Join-Path $flockenPath "scripts\nastahem-tracking-key.json"

if (Test-Path $keyPath) {
    Write-Host "✅ Key-filen finns: $keyPath"
} else {
    Write-Host "❌ Key-filen finns INTE ännu"
    Write-Host "   Du behöver ladda ner den från Google Cloud Console"
    Write-Host "   Se instruktioner ovan"
}
```

---

## 📋 Checklist

- [ ] Gått till Google Cloud Console: https://console.cloud.google.com/iam-admin/serviceaccounts
- [ ] Valt project: `nastahem-tracking`
- [ ] Hittat eller skapat service account med **BigQuery Admin** roll
- [ ] Laddat ner key-filen (JSON)
- [ ] Döpt om filen till `nastahem-tracking-key.json` (eller liknande)
- [ ] Kopierat filen till: `flocken-website/scripts/nastahem-tracking-key.json`
- [ ] Verifierat att filen finns (kör PowerShell-kommandot ovan)

---

## 🔒 Viktigt om Säkerhet

- ✅ Filen är redan i `.gitignore` (kommer INTE committas till Git)
- ✅ Behåll filen säkert på din dator
- ✅ Dela aldrig filen publikt eller via email
- ✅ Filen ger full BigQuery access i projektet

---

## 💡 Om Du Redan Har En Key-fil Någonstans

Om du redan har en service account key-fil någonstans:

1. **Hitta filen** (t.ex. i Downloads eller annan mapp)
2. **Kopiera den** till: `flocken-website/scripts/nastahem-tracking-key.json`
3. **Verifiera** att service account har **BigQuery Admin** roll (se Steg 2 ovan)

---

## 📚 Relaterad Dokumentation

- **Använd Befintlig Service Account:** `docs/USE_EXISTING_SERVICE_ACCOUNT.md`
- **Skapa Ny Service Account:** `docs/CREATE_SERVICE_ACCOUNT.md`

---

**Nästa steg:** När filen är på plats i `scripts/` mappen, kan jag köra scriptet automatiskt!


# Instruktioner för att få en ny Meta Marketing API Token

## ⚠️ Tokenen har gått ut

Din nuvarande `META_ACCESS_TOKEN` i `.env.local` har gått ut (expired 9 januari 2026).

## 🔧 Så här får du en ny token:

### Steg 1: Gå till Meta Business Manager
1. Öppna: https://business.facebook.com
2. Logga in med ditt konto som har admin-access till Flocken Business Manager

### Steg 2: Hitta System User
1. Gå till: https://business.facebook.com/settings/system-users
2. Klicka på **"Conversions API System User"** (eller din befintliga System User)

### Steg 3: Generera ny Marketing API Token
1. Scrolla ner till **"Tokens"** sektionen
2. Klicka på **"Generera ny token"** (Generate New Token)
3. Fyll i formuläret:

   **App:**
   - Välj **"NastaHem Marketing API"** (eller din Meta App)
   
   **Permissions (VIKTIGT - välj dessa):**
   - ✅ `ads_read` - Läsa kampanjdata och insights
   - ✅ `ads_management` - Hantera kampanjer (för att kunna återuppta pausade kampanjer)
   - ✅ `business_management` - Access till business assets och ad accounts
   
   **Token duration:**
   - Välj **"Never expires"** (eller "60 dagar" om du föredrar)

4. Klicka **"Generera token"**

### Steg 4: Kopiera och spara token
1. **VIKTIGT:** Kopiera tokenen direkt - du kan bara se den en gång!
2. Tokenen ser ut så här: `EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Steg 5: Uppdatera .env.local
Öppna `C:\dev\flocken-website\.env.local` och uppdatera:

```bash
META_ACCESS_TOKEN=din_nya_token_här
META_AD_ACCOUNT_ID=act_1648246706340725
```

### Steg 6: Testa
När du har uppdaterat tokenen, kör:

```powershell
cd C:\dev\flocken-website
node scripts\resume-paused-campaigns.js
```

## 📚 Mer information

Se den fullständiga guiden: `docs/META_MARKETING_API_TOKEN_GUIDE.md`



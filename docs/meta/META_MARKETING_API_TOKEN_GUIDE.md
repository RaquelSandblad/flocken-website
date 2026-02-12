# Guide: Skaffa Meta Marketing API Token för Flocken

## 🎯 Mål
Få en Marketing API-token som ger åtkomst till att läsa kampanjdata från Flocken Meta Ads-kontot.

---

## 📋 Steg 1: Gå till Meta Business Manager

1. Öppna: https://business.facebook.com
2. Logga in med ditt konto som har admin-access till Flocken Business Manager

---

## 👤 Steg 2: Välj System User

**Du har redan en System User:** "Conversions API System User"

✅ **Du kan använda denna!** Du behöver INTE skapa en ny.

1. Gå till: https://business.facebook.com/settings/system-users
2. Klicka på **"Conversions API System User"** (eller din befintliga System User)
3. Fortsätt till Steg 3 för att generera en ny token

**OBS:** Du kan ha flera tokens för samma System User med olika permissions. Denna token kommer vara specifik för Marketing API.

---

## 🎫 Steg 3: Generera Marketing API Token

1. Klicka på den System User du just skapade (eller den befintliga)
2. Scrolla ner till **"Tokens"** sektionen
3. Klicka på **"Generera ny token"** (Generate New Token)
4. Fyll i formuläret:

   **App:**
   - ✅ Välj **"NastaHem Marketing API"** (du kan använda samma app!)
   - En Meta App kan användas för flera ad accounts inom samma Business Manager
   - Du behöver INTE skapa en ny app för Flocken
   
   **Permissions (VIKTIGT - välj dessa):**
   - ✅ `ads_read` - Läsa kampanjdata och insights
   - ✅ `ads_management` - Hantera kampanjer (för framtida automation)
   - ✅ `business_management` - Access till business assets och ad accounts
   
   **Token duration:**
   - Välj **"Never expires"** (eller "60 dagar" om du föredrar att förnya regelbundet)
   
5. Klicka **"Generera token"** (Generate Token)

---

## 📋 Steg 4: Kopiera Token

1. **VIKTIGT:** Kopiera tokenen direkt - du kan bara se den en gång!
2. Tokenen ser ut så här:
   ```
   EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. Spara den på ett säkert ställe (vi lägger in den i `.env.local` strax)

---

## 🔍 Steg 5: Hitta Flocken Ad Account ID

1. Gå till: https://business.facebook.com/adsmanager
2. I URL:en ser du något liknande:
   ```
   /adsmanager/manage/campaigns?act=123456789
   ```
   → Ditt Ad Account ID är: `act_123456789`

**Alternativ metod:**
1. Gå till: https://business.facebook.com/settings/accounts/ad-accounts
2. Hitta Flocken ad account i listan
3. Klicka på det
4. Se ID-numret (börjar med `act_`)

---

## ✅ Steg 6: Verifiera System User Access till Flocken Ad Account

**Kontrollera om System Usern redan har access:**

1. I System User-vyn (där du är nu), scrolla ner till **"Tilldelade resurser"** (Assigned resources)
2. Leta efter **"Annonskonto"** (Ad Account) i listan
3. Om du ser **"Flocken"** eller ditt Flocken ad account med access → ✅ Klart!
4. Om du INTE ser Flocken ad account:
   - Gå till: https://business.facebook.com/settings/accounts/ad-accounts
   - Klicka på Flocken ad account
   - Klicka på **"Assign People"** eller **"Tilldela personer"**
   - Sök efter **"Conversions API System User"**
   - Välj **"Admin"** eller **"Advertiser"** roll
   - Klicka **"Assign"** / **"Tilldela"**

---

## 📝 Steg 7: Lägg till i .env.local

När du har både token och Ad Account ID, lägg till i `.env.local`:

```bash
# Meta Marketing API (för att läsa kampanjdata)
META_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
META_AD_ACCOUNT_ID=act_123456789
```

**OBS:** 
- Lägg INTE till dessa rader i git (`.env.local` ska vara i `.gitignore`)
- Använd samma format som dina andra tokens

---

## 🧪 Steg 8: Testa Token

När du har lagt till credentials, kör:

```bash
node scripts/test-flocken-meta-access.js
```

Detta kommer att:
- ✅ Verifiera att token fungerar
- ✅ Visa Flocken ad account info
- ✅ Lista kampanjer
- ✅ Hämta insights (prestanda)

---

## ❓ Felsökning

### "Invalid OAuth access token"
- Token kan vara ogiltig eller utgången
- Generera en ny token

### "Permission denied" eller "Insufficient permission"
- Token saknar nödvändiga permissions
- Kontrollera att du valde: `ads_read`, `ads_management`, `business_management`
- Generera ny token med rätt permissions

### "Invalid account" eller "Account not found"
- Ad Account ID kan vara felaktigt
- Kontrollera att det börjar med `act_`
- Verifiera att System User har access till ad account (Steg 6)

### "User does not have permission"
- System User har inte access till ad account
- Gå till Steg 6 och ge System User access

---

## 🎯 När du är klar

När testet fungerar kan vi:
- ✅ Hämta kampanjdata automatiskt
- ✅ Synka till BigQuery
- ✅ Skapa rapporter
- ✅ Automatisera kampanjhantering

---

## 📞 Behöver du hjälp?

Om du fastnar någonstans, berätta var och så hjälper jag dig vidare! 🚀


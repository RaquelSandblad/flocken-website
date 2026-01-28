# Meta Ads - Lessons Learned

**Projekt:** Flocken Meta Ads Setup  
**Datum:** 2026-01-19 till 2026-01-20  
**Status:** ✅ Kampanj live

---

## Sammanfattning

Detta dokument dokumenterar alla lärdomar, misstag och lösningar från att sätta upp Flocken's första Meta Ads-kampanj via API.

---

## Kronologisk genomgång

### Dag 1: Initial setup och första försök

**Mål:** Skapa kampanj med `OUTCOME_APP_PROMOTION` för app-installs.

**Problem 1: App Promotion-objektiv fungerade inte**
```
Meta API Error: Invalid parameter (Code: 100)
```

**Orsak:** `OUTCOME_APP_PROMOTION` kräver:
- Kopplad app i Meta Business
- Specifik `promoted_object` på ad set
- Komplicerad setup

**Lösning:** Bytte till `OUTCOME_TRAFFIC` med `LANDING_PAGE_VIEWS` optimering. Samma resultat (trafik till landningssida → app store), enklare setup.

---

### Problem 2: Budget-strategi konflikt

**Fel:**
```
"Budbelopp krävs för angiven budstrategi"
```

**Orsak:** När campaign har `daily_budget`, sätter Meta implicit `LOWEST_COST_WITH_BID_CAP` som kräver `bid_amount` på ad set.

**Lösning:**
```javascript
// Campaign - INGEN budget
{
  is_adset_budget_sharing_enabled: false,
  // daily_budget: UTELÄMNA
}

// Ad Set - budget HÄR
{
  daily_budget: 5000,
  bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
}
```

**Lärdom:** Sätt ALLTID budget på ad set-nivå, aldrig på campaign.

---

### Problem 3: Video thumbnail saknas

**Fel:**
```
"Annonsen måste ha en videominiatyr"
```

**Orsak:** `image_url` är obligatorisk i `video_data` för creatives.

**Lösning:**
```javascript
// Efter video-upload, hämta thumbnail
const thumbs = await makeRequest(`/${videoId}/thumbnails?fields=uri,is_preferred`);
const thumbnailUrl = thumbs.data.find(t => t.is_preferred)?.uri || thumbs.data[0]?.uri;

// Använd i creative
video_data: {
  video_id: videoId,
  image_url: thumbnailUrl,  // OBLIGATORISK!
  ...
}
```

**Lärdom:** Vänta 15-30 sekunder efter video-upload innan du hämtar thumbnails.

---

### Problem 4: PowerShell och inline JavaScript

**Fel:** Diverse parse errors när vi försökte köra inline Node.js i PowerShell.

**Orsak:** PowerShell tolkar `&&`, `${}`, och andra tecken annorlunda.

**Lösning:** Skapa ALLTID separata .js-filer istället för inline commands.

```powershell
# FEL
node -e "const x = { a: 1 }; console.log(x);"

# RÄTT
# Skapa script.js, kör sedan:
node scripts/script.js
```

**Lärdom:** Ingen inline JavaScript i PowerShell. Skapa alltid filer.

---

### Dag 2: Targeting och copy

### Problem 5: Android-targeting syns inte i UI

**Symptom:** API rapporterar `user_os: ["Android"]` men syns inte i Ads Manager under "Målgrupp".

**Orsak:** Meta visar device-targeting under "Placeringar" → "Enheter", inte under "Målgrupp".

**Lösning:** Använd flera targeting-parametrar för att säkerställa:
```javascript
targeting: {
  device_platforms: ['mobile'],
  user_os: ['Android'],
  user_device: ['Android_Smartphone', 'Android_Tablet'],
}
```

**Lärdom:** Verifiera ALLTID targeting via API, inte UI:
```javascript
const adset = await makeRequest(`/${adsetId}?fields=targeting`);
console.log(JSON.stringify(adset.targeting, null, 2));
```

---

### Problem 6: Copy-varianter blev för korta

**Symptom:** Annonserna hade bara en rad text istället för full primärtext.

**Orsak:** Parsing-logik läste bara första raden från copy.md.

**Lösning:** Hårdkoda primärtexter direkt i scriptet för full kontroll:
```javascript
const PRIMARY_TEXT_V01 = `🐾 Flocken – appen för ett enklare liv som hundägare 

Hitta lekkamrater, parningspartners och hundvakter.
...
`;
```

**Lärdom:** För viktigt content - hårdkoda hellre än parsa. Minska risk för fel.

---

### Problem 7: Dynamic Creative (DCO) fungerade inte via API

**Mål:** Skapa EN annons med 5 copy-varianter + 5 headlines.

**Fel:**
```
"Ett oväntat fel har inträffat"
```

**Orsak:** `asset_feed_spec` kräver specifik setup och fungerar dåligt via API.

**Lösning:** Skapa separata annonser istället (en per copy-variant). Ger samma testmöjlighet, enklare implementation.

**Lärdom:** DCO = manuellt i Ads Manager. Via API = separata ads.

---

### Problem 8: Instagram-konto kunde inte kopplas via API

**Fel:**
```
"Param instagram_actor_id must be a valid Instagram account id"
```

**Orsak:** Instagram Business-kontot var inte kopplat till Facebook-sidan i Business Suite.

**Lösning:** Manuell koppling krävs:
1. Business Suite → Inställningar → Instagram-konton
2. Lägg till och auktorisera
3. Sedan kan API använda det

**Lärdom:** Instagram-koppling = manuellt första gången. Kan inte göras via API.

---

## Sammanfattning av lärdomar

### API Design-beslut

| Beslut | Motivering |
|--------|------------|
| `OUTCOME_TRAFFIC` över `APP_PROMOTION` | Enklare, färre beroenden |
| Budget på ad set, inte campaign | Undviker bid strategy-konflikter |
| Separata ads, inte DCO | Fungerar konsekvent via API |
| Hårdkodad copy | Undviker parsing-fel |
| Alltid PAUSED först | Möjlighet att verifiera innan live |

### Verifieringssteg (kör ALLTID)

1. **Efter ad set-skapande:** Kolla targeting via API
2. **Efter video-upload:** Vänta 20 sek, hämta thumbnail
3. **Efter ad-skapande:** Lista hela strukturen
4. **Innan aktivering:** Kolla i Ads Manager UI

### Scripts som fungerar

| Script | Testat | Fungerar |
|--------|--------|----------|
| create-campaign-structured.js | ✅ | ✅ |
| create-flocken-ads-final.js | ✅ | ✅ |
| list-full-structure.js | ✅ | ✅ |
| activate-campaign.js | ✅ | ✅ |
| update-adsets.js | ✅ | ✅ |
| check-and-fix-targeting.js | ✅ | ✅ |

---

## Rekommendationer för framtida projekt

### 1. Följ denna ordning

```
1. Skapa campaign (PAUSED)
2. Skapa ad set (PAUSED)
3. Ladda upp video
4. Vänta 20 sek
5. Hämta thumbnail
6. Skapa creative
7. Skapa ad (PAUSED)
8. VERIFIERA allt via API
9. Aktivera i ordning: campaign → ad set → ad
```

### 2. Använd dessa defaults

```javascript
// Campaign
{
  objective: 'OUTCOME_TRAFFIC',
  is_adset_budget_sharing_enabled: false,
  status: 'PAUSED',
}

// Ad Set
{
  daily_budget: 5000,  // 50 SEK minimum
  optimization_goal: 'LANDING_PAGE_VIEWS',
  bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
  billing_event: 'IMPRESSIONS',
  status: 'PAUSED',
}

// Ad
{
  status: 'PAUSED',
}
```

### 3. Skapa dessa scripts för varje nytt projekt

1. `setup-campaign.js` - Skapar hela strukturen
2. `list-structure.js` - Verifierar
3. `activate.js` - Aktiverar
4. `update-targeting.js` - Ändrar targeting
5. `get-stats.js` - Hämtar prestanda

---

## Tid spenderad

| Uppgift | Tid | Kommentar |
|---------|-----|-----------|
| Initial research | 1h | Förstå API, objectives |
| Första försök (app promotion) | 2h | Misslyckades |
| Pivot till traffic | 30min | Fungerade |
| Budget-problem | 1h | Dokumenterat ovan |
| Video + thumbnail | 1h | Trial and error |
| Copy-varianter | 1h | Parsing-problem |
| Targeting | 1h | Android-verifiering |
| Dokumentation | 1h | Denna guide |
| **Totalt** | **~8h** | Nästa gång: ~2h |

---

## Nästa gång

Med denna dokumentation bör samma setup ta **2 timmar** istället för 8:

1. Kopiera scripts ✅
2. Anpassa IDs och copy ✅
3. Kör scripts i ordning ✅
4. Verifiera ✅
5. Aktivera ✅

---

**Dokumenterat av:** AI Assistant  
**Verifierat:** Kampanj live 2026-01-20

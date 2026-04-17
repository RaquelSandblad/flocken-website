# Meta Ads - Lessons Learned

**Projekt:** Flocken Meta Ads Setup
**Datum:** 2026-01-19 till 2026-04-17 (löpande)
**Status:** ✅ CID001 + CID002 live; CID003 skapad PAUSED 2026-04-17

## CID003 Launch (2026-04-17) — API v24.0-gotchas

Se fullständig launch-dokumentation i
`flocken_ads/creative_bases/cb003/launch_result.md`.

Under launchen av CB003 stötte vi på 4 API-fel innan kampanjen skapades
framgångsrikt. Dokumenterade här så nästa launch blir smidigare:

### 1. `is_adset_budget_sharing_enabled` obligatoriskt vid ABO

**Fel:** `Invalid parameter. Du måste specificera Sant eller Falskt i fältet
is_adset_budget_sharing_enabled om du inte använder kampanjbudget.`

**Orsak:** Meta v24.0 kräver explicit fält när campaign saknar `daily_budget`
(vi kör budget på ad set-nivå = ABO).

**Lösning:** `is_adset_budget_sharing_enabled: false` på campaign-create.

### 2. `reels` är inte giltigt för `facebook_positions`

**Fel:** `Ogiltigt värde reels för placeringsfältet facebook_positions.`

**Orsak:** Facebook Reels har eget enum-namn, Instagram Reels heter bara `reels`.

**Lösning:**
```js
facebook_positions: ['feed', 'story', 'facebook_reels']   // Facebook
instagram_positions: ['stream', 'story', 'reels', 'explore']  // Instagram
```

### 3. `age_max < 65` blockeras vid Advantage+ Audience

**Fel:** `Det går inte att ställa in målgruppskontrollen högsta ålder till
lägre än 65 för annonsuppsättningar som använder Advantage+-målgrupper.`

**Orsak:** Meta 2026-regel — Advantage+ Audience är algoritmisk och tar
`age_max` som suggestion, inte constraint. Om du vill låsa hårdare: stäng
av Advantage+ Audience.

**Lösning:** Höj `age_max` till 65 (eller skip Advantage+ Audience för ny
målgrupp i låg-budget-test).

### 4. `creative_features_spec` enum-värden ändrade

**Fel:** `Param key 'image_template' in degrees_of_freedom_spec[creative_features_spec]
must be one of {IG_VIDEO_NATIVE_SUBTITLE, IMAGE_ANIMATION, PRODUCT_METADATA_AUTOMATION,
PROFILE_CARD, STANDARD_ENHANCEMENTS_CATALOG, TEXT_OVERLAY_TRANSLATION}`

**Orsak:** Meta har ändrat enum-namn flera gånger 2025-2026. Äldre rapporter
(inklusive Gemini deep research april 2026) är redan föråldrade.

**Tillåtna värden v24.0 (2026-04-17):**
- `IG_VIDEO_NATIVE_SUBTITLE`
- `IMAGE_ANIMATION`
- `PRODUCT_METADATA_AUTOMATION`
- `PROFILE_CARD`
- `STANDARD_ENHANCEMENTS_CATALOG`
- `TEXT_OVERLAY_TRANSLATION`

**Lösning för v01:** Utelämna `degrees_of_freedom_spec` helt. Aktivera
Advantage+ Creative manuellt i Ads Manager per ad (30 sek/ad), eller vänta
med API-aktivering till v02 när vi vet rätt syntax.

### 5. `promoted_object` behövs INTE för LANDING_PAGE_VIEWS

**Fel:** `promoted_object[custom_event_type] must be one of ...OTHER` (LANDING_PAGE_VIEW
fanns inte i enum-listan)

**Orsak:** `LANDING_PAGE_VIEWS` som `optimization_goal` använder Metas
built-in LPV-mätning och behöver inte pixel-event specificeras via
`promoted_object`. Fältet är bara för OUTCOME_SALES med custom conversion.

**Lösning:** Ta bort `promoted_object` helt från ad set-data när
`optimization_goal = LANDING_PAGE_VIEWS`.

### 6. Listnings-query defaultar till ACTIVE only

**Inte ett fel — en gotcha:** `GET /campaigns/{id}/adsets` returnerar bara
ACTIVE ad sets default. PAUSED ad sets (vanligt vid launch) syns inte om
du inte sätter `effective_status` filter explicit.

**Lösning:**
```js
GET /campaigns/{id}/adsets?effective_status=["ACTIVE","PAUSED","ARCHIVED"]
```

Alternativt: hämta ad set direkt via dess ID (ingen status-filter krävs).

---



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

---

## API-uppgradering: v21.0 till v24.0 (2026-04-14)

**Varfor:** v21.0 ar deprecated av Meta. Uppgradering till v24.0 for att sakerstalla fortsatt funktion och tillgang till senaste features.

**Vad som andrades:**
- 37 scripts i `scripts/` -- alla `graph.facebook.com/v21.0` andrade till `v24.0`
- 1 API-route: `app/api/meta/capi/route.ts` -- `GRAPH_API_VERSION` andrad till `v24.0`
- 2 Dynamic Creative-scripts: `create-dynamic-creative-ads.js` och `recreate-with-dynamic-creative.js`
- 3 dokumentationsfiler uppdaterade

**Dynamic Creative (DCO) -- testkrav:**
DCO via API kraschade i januari (se Problem 7 ovan). Med v24.0 bor `asset_feed_spec` testas pa nytt. Meta kan ha fixat kompatibiliteten. Testplan:
1. Kor `create-dynamic-creative-ads.js` mot ett test-ad set (PAUSED)
2. Om `asset_feed_spec` fortfarande ger "Ett ovantat fel har intraffat" -- behall strategin med separata ads
3. Om det fungerar -- dokumentera och overvag att byta till DCO for framtida kampanjer

**Risker vid uppgradering:**
- Vissa deprecated fields kan tas bort mellan versioner -- om ett script kraschar, kontrollera Meta API changelog
- `bid_strategy: 'LOWEST_COST_WITHOUT_CAP'` -- verifiera att detta fortfarande stods (det ar standard, bor fungera)
- Video-upload endpoint (`graph-video.facebook.com`) -- samma versionering, bor fungera

**Verifiering:** Kor `npm run build` for att sakerstalla att TypeScript-koden kompilerar. Scripts ar rena Node.js och kraver manuell testning mot Meta API.

---

**Dokumenterat av:** AI Assistant  
**Verifierat:** Kampanj live 2026-01-20  
**Senast uppdaterad:** 2026-04-14 (API v21.0 -> v24.0)

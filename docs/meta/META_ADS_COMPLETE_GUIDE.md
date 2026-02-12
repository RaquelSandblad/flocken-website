# Meta Ads - Komplett Guide för API-baserad Annonshantering

**Version:** 1.0  
**Senast uppdaterad:** 2026-01-20  
**Testat på:** Flocken (flocken.info)

---

## Innehåll

1. [Översikt](#översikt)
2. [Förutsättningar](#förutsättningar)
3. [Namnkonventioner](#namnkonventioner)
4. [Steg-för-steg: Skapa kampanj](#steg-för-steg-skapa-kampanj)
5. [API-referens](#api-referens)
6. [Vanliga fel och lösningar](#vanliga-fel-och-lösningar)
7. [Checklista för nya konton](#checklista-för-nya-konton)
8. [Scripts-bibliotek](#scripts-bibliotek)
9. [Tracking & Analytics](#tracking--analytics)
10. [Best Practices](#best-practices)

---

## Översikt

Denna guide beskriver hur vi sätter upp och hanterar Meta Ads helt via API, utan manuella moment i Ads Manager. Systemet är designat för:

- **Skalbarhet** - Samma process för alla produkter/företag
- **Spårbarhet** - Strukturerade namn för analys
- **Automatisering** - Scripts för alla operationer
- **Reproducerbarhet** - Dokumenterade steg som aldrig misslyckas

### Arkitektur

```
┌─────────────────────────────────────────────────────────────┐
│                     META ADS STRUCTURE                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Campaign (1 per produkt/hook)                               │
│  └── Ad Set (1 per koncept/Creative Base)                    │
│      └── Ad (1 per video × copy-variant)                     │
│                                                              │
│  Exempel:                                                    │
│  c_flo_swe_init_dogowner_inst_h01_cid001                     │
│  ├── as_para_swe_opt_lpv_cid001                              │
│  │   ├── ad_h01a_cb002_v01_9x16_hk_para_cid001              │
│  │   ├── ad_h01a_cb002_v02_9x16_hk_para_cid001              │
│  │   ├── ad_h01a_cb002_v01_4x5_hk_para_cid001               │
│  │   └── ad_h01a_cb002_v02_4x5_hk_para_cid001               │
│  └── as_besoka_swe_opt_lpv_cid001                            │
│      └── ... (samma struktur)                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Förutsättningar

### 1. Meta Business Setup

| Komponent | Beskrivning | Var hittar du det |
|-----------|-------------|-------------------|
| **Ad Account ID** | `act_XXXXXXXXXX` | Business Settings → Ad Accounts |
| **Page ID** | Facebook-sidans ID | Page Settings → Page ID |
| **Access Token** | API-nyckel med rätt behörigheter | Business Settings → System Users |
| **Pixel ID** | För tracking (valfritt för API) | Events Manager → Data Sources |

### 2. Behörigheter för Access Token

Token måste ha dessa behörigheter:
- `ads_management`
- `ads_read`
- `business_management`
- `pages_read_engagement` (för Instagram)

### 3. Lokala filer

```
projekt/
├── .env.local                 # API-nycklar (ALDRIG i git!)
├── scripts/
│   ├── create-campaign.js     # Skapa kampanj
│   ├── upload-video.js        # Ladda upp video
│   ├── create-ads.js          # Skapa annonser
│   ├── activate-campaign.js   # Aktivera
│   └── list-structure.js      # Lista struktur
└── flocken_ads/
    └── creative_bases/
        └── cbXXX/
            ├── brief.md       # Kreativ brief
            ├── copy.md        # Texter
            └── assets/
                └── vid/       # Videos
```

### 4. .env.local mall

```env
# Meta Ads API
META_ACCESS_TOKEN=EAAxxxxxxx...
META_AD_ACCOUNT_ID=act_1234567890
META_PAGE_ID=9876543210

# Valfritt
META_PIXEL_ID=1234567890
META_INSTAGRAM_ID=17841479914513348
```

---

## Namnkonventioner

### Campaign

**Format:** `c_[brand]_[country]_[phase]_[audience]_[objective]_[hook]_[cid]`

| Segment | Värden | Beskrivning |
|---------|--------|-------------|
| `c` | c | Fast prefix |
| `brand` | flo, nh, etc | Produktkod (3 bokstäver) |
| `country` | swe, nor, den | Landskod |
| `phase` | init, scale, ret | Fas (initial/scale/retargeting) |
| `audience` | dogowner, renter | Målgrupp |
| `objective` | inst, traf, conv | Mål (install/traffic/conversion) |
| `hook` | h01, h02 | Hook-tema |
| `cid` | cid001, cid002 | Unikt kampanj-ID |

**Exempel:** `c_flo_swe_init_dogowner_inst_h01_cid001`

### Ad Set

**Format:** `as_[concept]_[country]_[opt]_[goal]_[cid]`

| Segment | Värden | Beskrivning |
|---------|--------|-------------|
| `as` | as | Fast prefix |
| `concept` | para, besoka, rasta | Creative Base-koncept |
| `country` | swe | Landskod |
| `opt` | opt | Optimering (fast) |
| `goal` | lpv, lc, inst | Optimeringsmål |
| `cid` | cid001 | Kampanj-ID (koppling) |

**Optimeringsmål:**
- `lpv` = Landing Page Views
- `lc` = Link Clicks
- `inst` = App Installs
- `conv` = Conversions

**Exempel:** `as_para_swe_opt_lpv_cid001`

### Ad

**Format:** `ad_[hook]_[cb]_[variant]_[format]_[hk]_[concept]_[cid]`

| Segment | Värden | Beskrivning |
|---------|--------|-------------|
| `ad` | ad | Fast prefix |
| `hook` | h01a, h01b | Hook + sub-variant |
| `cb` | cb001-cb999 | Creative Base nummer |
| `variant` | v01, v02 | Copy-variant |
| `format` | 9x16, 4x5, 1x1 | Videoformat |
| `hk` | hk | Hook-markör (fast) |
| `concept` | para, besoka | Koncept-namn |
| `cid` | cid001 | Kampanj-ID |

**Exempel:** `ad_h01a_cb002_v01_9x16_hk_para_cid001`

---

## Steg-för-steg: Skapa kampanj

### Steg 1: Förbered Creative Base

```
flocken_ads/creative_bases/cb002/
├── brief.md          # Koncept, målgrupp, budskap
├── copy.md           # Primärtexter, headlines, descriptions
└── assets/
    └── vid/
        ├── fl_vid_para_xxx_v01_9x16.mp4
        └── fl_vid_para_xxx_v01_4x5.mp4
```

**copy.md format:**

```markdown
p01: [Första raden blir implicit headline om ingen ## Headlines-sektion]

[Resten av primärtexten...]

p02: [Variant 2...]

## Headlines
h01: Hela hundlivet i en app
h02: Gå med i Flocken nu

## Descriptions
d01: Gratis att testa
d02: 6 månaders gratis premium
```

### Steg 2: Skapa Campaign

```javascript
// API: POST /{ad_account_id}/campaigns
const campaignData = {
  name: 'c_flo_swe_init_dogowner_inst_h01_cid001',
  objective: 'OUTCOME_TRAFFIC',  // eller OUTCOME_APP_PROMOTION
  status: 'PAUSED',
  special_ad_categories: [],
  is_adset_budget_sharing_enabled: false,  // VIKTIGT!
};
```

**Viktigt om objectives:**
- `OUTCOME_TRAFFIC` - Enklast, funkar alltid
- `OUTCOME_APP_PROMOTION` - Kräver app-koppling, krångligt
- `OUTCOME_ENGAGEMENT` - För likes/comments
- `OUTCOME_LEADS` - För lead-formulär

### Steg 3: Skapa Ad Set

```javascript
// API: POST /{ad_account_id}/adsets
const adSetData = {
  name: 'as_para_swe_opt_lpv_cid001',
  campaign_id: CAMPAIGN_ID,
  daily_budget: 5000,  // 50 SEK (i öre/cent)
  billing_event: 'IMPRESSIONS',
  optimization_goal: 'LANDING_PAGE_VIEWS',
  bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
  targeting: {
    geo_locations: { countries: ['SE'] },
    age_min: 18,
    age_max: 65,
    device_platforms: ['mobile'],
    user_os: ['Android'],  // eller ['iOS'] eller båda
    user_device: ['Android_Smartphone', 'Android_Tablet'],
  },
  status: 'PAUSED',
};
```

**Targeting-parametrar:**

| Parameter | Värden | Beskrivning |
|-----------|--------|-------------|
| `device_platforms` | mobile, desktop | Enhetstyp |
| `user_os` | Android, iOS | Operativsystem |
| `user_device` | Android_Smartphone, etc | Specifik enhet |
| `publisher_platforms` | facebook, instagram | Plattformar |
| `facebook_positions` | feed, story, reels | FB-placeringar |
| `instagram_positions` | stream, story, reels | IG-placeringar |

### Steg 4: Ladda upp video

```javascript
// API: POST /{ad_account_id}/advideos (multipart/form-data)
// Kräver multipart upload - se scripts/upload-video.js
```

**Vänta på processning!** Efter upload, vänta 15-30 sekunder innan du skapar creative.

### Steg 5: Hämta thumbnail

```javascript
// API: GET /{video_id}/thumbnails
// Returnerar automatiskt genererade thumbnails
const thumbnails = await makeRequest(`/${videoId}/thumbnails?fields=uri,is_preferred`);
const thumbnailUrl = thumbnails.data.find(t => t.is_preferred)?.uri;
```

### Steg 6: Skapa Ad Creative

```javascript
// API: POST /{ad_account_id}/adcreatives
const creativeData = {
  name: 'ad_h01a_cb002_v01_9x16_hk_para_cid001 Creative',
  object_story_spec: {
    page_id: PAGE_ID,
    video_data: {
      video_id: VIDEO_ID,
      image_url: THUMBNAIL_URL,  // OBLIGATORISK för video!
      title: 'Hela hundlivet i en app',  // Headline
      message: 'Primärtext här...',
      link_description: 'Gratis att testa',
      call_to_action: {
        type: 'DOWNLOAD',  // eller LEARN_MORE, SHOP_NOW, etc
        value: { 
          link: 'https://flocken.info/valkommen?utm_source=meta&...',
          link_caption: 'flocken.info/om-appen'  // Display link
        }
      },
    }
  },
};
```

**CTA-typer:**
- `DOWNLOAD` - "Ladda ner"
- `LEARN_MORE` - "Läs mer"
- `SHOP_NOW` - "Handla nu"
- `SIGN_UP` - "Registrera dig"
- `GET_OFFER` - "Få erbjudande"

### Steg 7: Skapa Ad

```javascript
// API: POST /{ad_account_id}/ads
const adData = {
  name: 'ad_h01a_cb002_v01_9x16_hk_para_cid001',
  adset_id: ADSET_ID,
  creative: { creative_id: CREATIVE_ID },
  status: 'PAUSED',
};
```

### Steg 8: Aktivera

```javascript
// Aktivera i ordning: Campaign → Ad Sets → Ads
await makeRequest(`/${CAMPAIGN_ID}`, 'POST', { status: 'ACTIVE' });
await makeRequest(`/${ADSET_ID}`, 'POST', { status: 'ACTIVE' });
await makeRequest(`/${AD_ID}`, 'POST', { status: 'ACTIVE' });
```

---

## API-referens

### Base URL

```
https://graph.facebook.com/v21.0
```

### Authentication

Alla requests kräver `access_token` som query parameter:

```
?access_token=EAAxxxxxx
```

### Vanliga endpoints

| Operation | Method | Endpoint |
|-----------|--------|----------|
| Skapa kampanj | POST | `/{ad_account_id}/campaigns` |
| Skapa ad set | POST | `/{ad_account_id}/adsets` |
| Ladda upp video | POST | `/{ad_account_id}/advideos` |
| Skapa creative | POST | `/{ad_account_id}/adcreatives` |
| Skapa ad | POST | `/{ad_account_id}/ads` |
| Uppdatera objekt | POST | `/{object_id}` |
| Ta bort objekt | DELETE | `/{object_id}` |
| Hämta info | GET | `/{object_id}?fields=...` |
| Lista under-objekt | GET | `/{parent_id}/{edge}?fields=...` |

### Viktiga fields

**Campaign:**
```
id,name,status,objective,daily_budget,lifetime_budget,created_time
```

**Ad Set:**
```
id,name,status,campaign_id,daily_budget,optimization_goal,targeting,bid_strategy
```

**Ad:**
```
id,name,status,adset_id,creative{id,name,object_story_spec}
```

---

## Vanliga fel och lösningar

### 1. "Budbelopp krävs för angiven budstrategi"

**Orsak:** Campaign har `daily_budget` men ad set försöker använda `LOWEST_COST_WITHOUT_CAP`.

**Lösning:**
```javascript
// På campaign:
is_adset_budget_sharing_enabled: false

// På ad set:
bid_strategy: 'LOWEST_COST_WITHOUT_CAP'
daily_budget: 5000  // Sätt budget här istället
```

### 2. "Annonsen måste ha en videominiatyr"

**Orsak:** `image_url` saknas i `video_data`.

**Lösning:**
```javascript
// Hämta thumbnail efter video-upload
const thumb = await makeRequest(`/${videoId}/thumbnails`);
// Använd i creative
video_data: {
  video_id: videoId,
  image_url: thumb.data[0].uri,  // OBLIGATORISK!
  ...
}
```

### 3. "Invalid parameter" vid targeting

**Orsak:** Ogiltigt värde för placeringar (t.ex. `reels` i fel position).

**Lösning:** Använd endast dessa:
```javascript
facebook_positions: ['feed', 'video_feeds', 'story'],
instagram_positions: ['stream', 'story', 'explore'],
```

### 4. API-token parsning misslyckas

**Orsak:** Token innehåller specialtecken som PowerShell tolkar fel.

**Lösning:** Läs alltid från fil, aldrig inline:
```javascript
const envContent = fs.readFileSync('.env.local', 'utf8');
```

### 5. Instagram-konto fungerar inte

**Orsak:** Instagram Business-konto inte kopplat till Facebook-sidan.

**Lösning:** 
1. Gå till Business Suite → Inställningar → Instagram-konton
2. Lägg till och koppla kontot
3. Hämta nytt ID via API

### 6. Android-targeting syns inte i UI

**Orsak:** Meta Ads Manager visar inte alltid `user_os` i målgrupp-sektionen.

**Lösning:** Kolla under "Placeringar" → "Enheter", eller verifiera via API:
```javascript
const adset = await makeRequest(`/${adsetId}?fields=targeting`);
console.log(adset.targeting.user_os);  // ["Android"]
```

---

## Checklista för nya konton

### Fas 1: Setup (en gång)

- [ ] Skapa Business Manager-konto
- [ ] Skapa Ad Account
- [ ] Skapa Facebook-sida
- [ ] Koppla Instagram Business-konto (valfritt)
- [ ] Skapa System User med `ads_management` behörighet
- [ ] Generera Access Token
- [ ] Installera Meta Pixel på hemsida
- [ ] Konfigurera CAPI (server-side tracking)
- [ ] Sätt upp BigQuery-export för GA4

### Fas 2: Förberedelse (per kampanj)

- [ ] Definiera Creative Bases (koncept)
- [ ] Skapa copy.md med primärtexter + headlines
- [ ] Producera videos (9x16 + 4x5)
- [ ] Namnge enligt konvention
- [ ] Skapa brief.md

### Fas 3: Implementation

- [ ] Skapa .env.local med API-nycklar
- [ ] Anpassa scripts med rätt IDs
- [ ] Kör create-campaign script
- [ ] Kör create-adsets script
- [ ] Ladda upp videos
- [ ] Skapa ads med alla varianter
- [ ] Verifiera targeting
- [ ] Testa tracking (besök landningssida)
- [ ] Aktivera kampanj

### Fas 4: Uppföljning

- [ ] Kolla Ads Manager efter 24h
- [ ] Verifiera Landing Page Views i Events Manager
- [ ] Kolla BigQuery för data
- [ ] Analysera CTR per variant
- [ ] Skala upp vinnare

---

## Scripts-bibliotek

### Tillgängliga scripts

| Script | Beskrivning |
|--------|-------------|
| `create-campaign-structured.js` | Skapa kampanj med namnkonvention |
| `create-flocken-ads-final.js` | Skapa ads med alla varianter |
| `upload-video.js` | Ladda upp video (multipart) |
| `list-full-structure.js` | Lista hela kampanjstrukturen |
| `activate-campaign.js` | Aktivera kampanj + ad sets + ads |
| `update-adsets.js` | Uppdatera targeting/budget |
| `check-and-fix-targeting.js` | Verifiera och fixa targeting |
| `delete-ad.js` | Ta bort enskild annons |
| `find-page-id.js` | Hitta Facebook Page ID |
| `find-instagram-id.js` | Hitta Instagram Account ID |

### Köra scripts

```powershell
cd c:\Dev\flocken-website
node scripts/[script-namn].js
```

---

## Tracking & Analytics

### Meta Pixel Events

| Event | När | Värde |
|-------|-----|-------|
| `PageView` | Varje sidvisning | Auto |
| `ViewContent` | Produktsida | Auto |
| `Lead` | App-klick | 50 SEK |
| `CompleteRegistration` | Registrering | 100 SEK |
| `Purchase` | Köp | Faktiskt värde |

### BigQuery Setup

GA4 exporterar till BigQuery:
- **Project:** `nastahem-tracking`
- **Dataset:** `analytics_518338757`

**Användbara queries:**

```sql
-- Daglig trafik från Meta Ads
SELECT 
  event_date,
  COUNT(DISTINCT user_pseudo_id) as users,
  COUNT(*) as events
FROM `nastahem-tracking.analytics_518338757.events_*`
WHERE traffic_source.source = 'meta'
  AND _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
GROUP BY event_date
ORDER BY event_date DESC;
```

### UTM-parametrar

Alla annonser inkluderar:
```
utm_source=meta
utm_medium=paid_social
utm_campaign=[kampanjnamn]
utm_content=[annonsnamn]
```

---

## Best Practices

### DO ✅

1. **Börja med PAUSED** - Alltid skapa som PAUSED, aktivera manuellt
2. **Testa en sak i taget** - En variabel per test (copy ELLER video)
3. **Använd namnkonvention** - Alltid, utan undantag
4. **Verifiera via API** - Lita inte på UI, kolla targeting via API
5. **Dokumentera allt** - Varje ändring, varje fel
6. **Sätt budget på ad set** - Inte campaign (enklare kontroll)
7. **Vänta på video-processning** - 15-30 sek efter upload

### DON'T ❌

1. **Skapa inte kampanjer manuellt** - Alltid via API/script
2. **Använd inte campaign budget** - Skapar problem med bid strategy
3. **Blanda inte objectives** - TRAFFIC eller APP_PROMOTION, inte båda
4. **Glöm inte thumbnail** - Obligatorisk för video-ads
5. **Kör inte inline JS i PowerShell** - Skapa separata .js-filer
6. **Aktivera inte utan verifiering** - Kolla targeting först

### Optimeringstips

1. **Börja brett, snäva in** - Låt Meta hitta målgruppen
2. **2 varianter per video** - Inte fler, annars för lite data
3. **Min 50 SEK/dag per ad set** - Annars för lite räckvidd
4. **Vänta 3-5 dagar** - Innan du drar slutsatser
5. **Skala vinnare med 20%/dag** - Inte mer, annars reset

---

## Ändringslogg

| Datum | Ändring |
|-------|---------|
| 2026-01-20 | Initial version - Flocken kampanj live |

---

## Kontakt

Vid frågor om denna guide, kontakta projektägaren.

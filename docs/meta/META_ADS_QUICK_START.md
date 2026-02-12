# Meta Ads - Quick Start Guide

**Tid:** ~2 timmar för komplett setup  
**Krav:** Node.js, Access Token, Videos klara

---

## Snabbstart för nytt projekt

### 1. Kopiera scripts (5 min)

```powershell
# Kopiera dessa filer till nytt projekt:
scripts/
├── create-campaign-structured.js
├── create-ads-final.js
├── list-full-structure.js
├── activate-campaign.js
└── update-adsets.js
```

### 2. Skapa .env.local (2 min)

```env
META_ACCESS_TOKEN=EAAxxxxxx...
META_AD_ACCOUNT_ID=act_XXXXXXXXXX
META_PAGE_ID=XXXXXXXXXX
```

### 3. Förbered content (30 min)

```
creative_bases/cb001/
├── copy.md          # Primärtexter + headlines
└── assets/vid/
    ├── video_9x16.mp4
    └── video_4x5.mp4
```

### 4. Anpassa scripts (15 min)

Uppdatera i varje script:
- `AD_ACCOUNT_ID`
- `PAGE_ID`
- `LANDING_PAGE`
- Video-sökvägar
- Copy-texter
- Kampanj/ad set/ad-namn

### 5. Kör i ordning (30 min)

```powershell
# 1. Skapa kampanj och ad sets
node scripts/create-campaign-structured.js

# 2. Skapa ads (laddar upp videos automatiskt)
node scripts/create-ads-final.js

# 3. Verifiera
node scripts/list-full-structure.js

# 4. Aktivera (när redo)
node scripts/activate-campaign.js
```

### 6. Verifiera i Ads Manager (10 min)

- [ ] Kampanj finns
- [ ] Ad sets har rätt budget
- [ ] Targeting är korrekt (kolla "Placeringar" → "Enheter")
- [ ] Annonser har rätt video och copy
- [ ] Status är ACTIVE

---

## Namnmall

```
Campaign:  c_[brand]_swe_init_[audience]_inst_h01_cid001
Ad Set:    as_[concept]_swe_opt_lpv_cid001
Ad:        ad_h01a_cb001_v01_9x16_hk_[concept]_cid001
```

**Exempel för ny produkt "AppX":**
```
c_apx_swe_init_users_inst_h01_cid001
├── as_feature1_swe_opt_lpv_cid001
│   ├── ad_h01a_cb001_v01_9x16_hk_feature1_cid001
│   └── ad_h01a_cb001_v02_9x16_hk_feature1_cid001
└── as_feature2_swe_opt_lpv_cid001
    └── ...
```

---

## Defaults att använda

```javascript
// Campaign
{
  objective: 'OUTCOME_TRAFFIC',
  is_adset_budget_sharing_enabled: false,
}

// Ad Set  
{
  daily_budget: 5000,  // 50 SEK minimum
  optimization_goal: 'LANDING_PAGE_VIEWS',
  bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
  targeting: {
    geo_locations: { countries: ['SE'] },
    age_min: 18,
    age_max: 65,
    device_platforms: ['mobile'],
    user_os: ['Android'],  // eller ['iOS'] eller båda
  },
}
```

---

## Vanliga kommandon

```powershell
# Lista struktur
node scripts/list-full-structure.js

# Pausa kampanj
node -e "require('./scripts/helpers').pauseCampaign('CAMPAIGN_ID')"

# Ändra budget (via update-adsets.js)
# Ändra daily_budget i scriptet, kör sedan:
node scripts/update-adsets.js

# Ta bort ad
node scripts/delete-ad.js AD_ID
```

---

## Troubleshooting

| Problem | Lösning |
|---------|---------|
| "Invalid parameter" vid ad set | Kolla `is_adset_budget_sharing_enabled: false` på campaign |
| "Videominiatyr saknas" | Vänta 20 sek efter upload, hämta thumbnail |
| Targeting syns inte i UI | Kolla "Placeringar" → "Enheter", inte "Målgrupp" |
| Token fungerar inte | Regenerera i Business Settings → System Users |

---

## Länkar

- [Ads Manager](https://business.facebook.com/adsmanager)
- [Meta API Explorer](https://developers.facebook.com/tools/explorer/)
- [Meta API Docs](https://developers.facebook.com/docs/marketing-apis/)

---

## Fullständig dokumentation

- `META_ADS_COMPLETE_GUIDE.md` - Komplett guide
- `META_ADS_LESSONS_LEARNED.md` - Alla misstag och lösningar
- `FLOCKEN_ADS_NAMING_CONVENTION.md` - Namnkonventioner

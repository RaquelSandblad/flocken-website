# Meta Ads Migration Guide – Ny struktur

Denna guide hjälper dig att migrera från gamla kampanjer till den nya strukturen.

## 📋 Steg 1: Lista befintliga kampanjer

```powershell
node scripts/list-and-delete-campaigns.js list
```

Detta visar alla kampanjer som inte följer den nya strukturen.

## 🗑️ Steg 2: Ta ner gamla kampanjer

**Viktigt:** Ta ner gamla kampanjer innan du skapar nya med samma CID.

### Ta ner en specifik kampanj:
```powershell
node scripts/list-and-delete-campaigns.js delete <campaign_id>
```

### Ta ner ALLA kampanjer (kräver bekräftelse):
```powershell
node scripts/list-and-delete-campaigns.js delete-all --confirm
```

## 🚀 Steg 3: Skapa nya kampanjer enligt ny struktur

### Alternativ A: Skapa startpaket (rekommenderat)

Detta skapar en kampanj för h01 med dogowner audience:

```powershell
node scripts/create-campaign-structured.js start-package
```

Detta skapar:
- Campaign: `c_flo_swe_init_dogowner_inst_h01_cid001`
- Ad Set: `as_broad_swe_opt_inst_cid001`
- Status: PAUSED (du aktiverar när du har skapat ads)

### Alternativ B: Skapa anpassad kampanj

```powershell
node scripts/create-campaign-structured.js campaign <app> <geo> <stage> <aud> <obj> <hypotes> [budget_sek]
```

**Exempel:**
```powershell
# Kampanj för h01, dogowner, 500 SEK/dag
node scripts/create-campaign-structured.js campaign flo swe init dogowner inst 01 500

# Kampanj för h01, sitter, 300 SEK/dag
node scripts/create-campaign-structured.js campaign flo swe init sitter inst 01 300
```

**Vokabulär:**
- `app`: `flo`
- `geo`: `swe`
- `stage`: `init` (ny användare), `rmk` (remarketing)
- `aud`: `dogowner`, `sitter`, `biz`, `all`
- `obj`: `inst` (app install), `eng` (engagement)
- `hypotes`: `01`, `02`, `03`...

## 📝 Steg 4: Skapa Creative Bases (CB)

Innan du skapar ads måste du skapa Creative Bases enligt `creative_structure_flocken.md`.

**Rekommenderat startpaket:**
- **CB001** – Allmänt värde (hk_all)
- **CB002** – Passa (hk_passa)
- **CB003** – Besöka (hk_besoka)

Varje CB behöver:
- `brief.md` – Idéns kärna
- `copy.md` – All text för variation
- Assets (bilder/video)

## 🎯 Steg 5: Skapa ads (kommande)

När CB är klara kan du skapa ads med korrekt naming:
- Format: `ad_h01a_cb003_v01_hk_besoka_src_ai_cid001`

## ⚠️ Viktiga regler

1. **CID får aldrig ändras** – Det är primärnyckeln
2. **Alla objekt med samma CID hör ihop** – campaign, ad set, ad
3. **Inga mellanslag eller specialtecken** i namn
4. **Format/dimension får ALDRIG ligga i annonsnamn**

## 📚 Dokumentation

- [`meta_ads_structure_flocken.md`](./meta_ads_structure_flocken.md) – Fullständig naming-spec
- [`creative_structure_flocken.md`](./creative_structure_flocken.md) – Creative Base-struktur

## 🔄 Migrationsprocess (exempel)

```powershell
# 1. Lista gamla kampanjer
node scripts/list-and-delete-campaigns.js list

# 2. Ta ner gamla kampanjer
node scripts/list-and-delete-campaigns.js delete-all --confirm

# 3. Skapa ny kampanj enligt struktur
node scripts/create-campaign-structured.js start-package

# 4. Skapa Creative Bases (manuellt eller med AI)
# 5. Skapa ads (kommande script)
```

## ❓ Frågor?

Se dokumentationen i `meta_ads_structure_flocken.md` och `creative_structure_flocken.md`.

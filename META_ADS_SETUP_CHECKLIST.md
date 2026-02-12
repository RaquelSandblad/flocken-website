# Meta Ads Setup Checklista

Denna checklista hjälper dig att förbereda allt innan kampanjer skapas enligt den nya strukturen.

## Status 2026-01-19

**Kampanjstruktur skapad via API:**
- [x] Campaign: `c_flo_swe_init_dogowner_inst_h01_cid001` (ID: 120239834352180455)
- [x] Ad Set: `as_broad_swe_opt_inst_cid001` (ID: 120239834356860455, Budget: 50 SEK/dag)
- [x] Ad: `ad_h01a_cb002_v01_hk_para_src_ai_cid001` (ID: 120239834594360455)

**Status:** PAUSED - Aktivera i Meta Ads Manager när redo.

---

## ✅ Creative Bases Status

### CB001 – Allmänt värde (hk_all)
- [ ] `brief.md` är ifylld med problem, löfte, bevis, CTA
- [ ] `copy.md` har minst 2 primary texts
- [ ] Assets är klara (bilder/video i `assets/`)

### CB002 – Para (hk_para) ✅ KLAR
- [x] `brief.md` är ifylld
- [x] `copy.md` har primary texts (5 varianter)
- [x] Video: `fl_vid_para_malua_freddy_match_v01_9x16.mp4`
- [x] **Ad skapad i Meta**

### CB003 – Passa (hk_passa)
- [ ] `brief.md` är ifylld
- [ ] `copy.md` har primary texts
- [ ] Assets är klara

### CB004 – Rasta (hk_rasta)
- [ ] `brief.md` är ifylld
- [ ] `copy.md` har primary texts
- [ ] Assets är klara

### CB005 – Besöka (hk_besoka)
- [x] `brief.md` är ifylld
- [x] `copy.md` har primary texts
- [x] Video: `fl_vid_besoka_v01_4x5.mp4`, `fl_vid_besoka_v01_9x16.mp4`
- [ ] **Ad behöver skapas**

## 📝 Scripts för Meta Ads

| Script | Beskrivning |
|--------|-------------|
| `create-campaign-structured.js` | Skapar kampanj + ad set |
| `create-flocken-ad.js` | Skapar ad med video från CB |
| `list-full-structure.js` | Visar hela strukturen i Meta |
| `list-and-delete-campaigns.js` | Lista/radera kampanjer |

### Exempel: Skapa ny ad från CB005

```powershell
cd c:\Dev\flocken-website
node scripts/create-flocken-ad.js 120239834356860455 001
```

## 📚 Dokumentation

- [`meta_ads_structure_flocken.md`](./meta_ads_structure_flocken.md) – Fullständig naming-spec
- [`creative_structure_flocken.md`](./creative_structure_flocken.md) – Creative Base-struktur

## 🔗 Meta Ads Manager

[Öppna Flocken i Ads Manager](https://business.facebook.com/adsmanager/manage/campaigns?act=1648246706340725)

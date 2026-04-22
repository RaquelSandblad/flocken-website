# Hunddagis-Dataset Setup för Ny Dator

Denna mapp innehåller allt du behöver för att fortsätta arbeta med kennelsamlingen och hundpassningsbolagen på en ny dator.

## Vad som finns på USB-stickan

```
hunddagis-dataset/
├── build_hunddagis_dataset.py     # Huvudscript för datainsamling
├── filter_kennels_csv.py          # Utility: rensa kenneldata
├── requirements.txt               # Python-beroenden
├── .env                           # SerpApi-nyckel (redan konfigurerad)
├── .env.example                   # Mall (för git)
├── README.md                      # Fullständig dokumentation
├── config/                        # Stadskonfigurationer för Sverige, Norge, Danmark
│   ├── seed_locations.json
│   ├── sweden_city_county_map.json
│   ├── norway_cities.json
│   └── denmark_cities.json
└── data/                          # Resultat från körningar
    ├── hunddagis_se_master.csv           (Sverige dagis — 800 st ✅)
    ├── hunddagis_se_kennels_master.csv   (Sverige kennlar — 897 raw, 243 filtrerade)
    ├── progress_se_kennels.json          (Checkpoint — resumepoint)
    └── build.log                         (Körlogs)
```

## Snabbstart på ny dator (Windows)

### 1. Kopiera mappen
```powershell
# Kopiera hunddagis-dataset från USB till ny dators repo:
cp -Recurse "E:\hunddagis-dataset" "C:\Dev\flocken-website\scripts\"
# (byt E: till din USB-enhetsbokstav)
```

### 2. Installera Python-beroenden
```powershell
cd "C:\Dev\flocken-website\scripts\hunddagis-dataset"
pip install -r requirements.txt
```

### 3. Verifiera setup
```powershell
python build_hunddagis_dataset.py --demo
```

Om du får utdata utan fel: **Du är redo!**

### 4. Fortsätt arbetet (9 april när SerpApi-kvoten återställs)

```powershell
# Sverige kennlar (fortsätter från checkpoint)
python build_hunddagis_dataset.py --country se --category kennels --limit 2000

# Norge dagis (ny körning med förbättrade sökord)
python build_hunddagis_dataset.py --country no

# Danmark dagis
python build_hunddagis_dataset.py --country dk

# Rensa Sverige-kennlar när körningen är klar
python filter_kennels_csv.py data/hunddagis_se_kennels_master.csv
```

## Aktuell status (2026-04-07)

| Dataset | Status | Entries |
|---------|--------|---------|
| Sverige dagis | ✅ Klart | 800 |
| Sverige kennlar | 🔄 50% klart | 243/~400 |
| Norge dagis | ⏸ Väntar | 0 |
| Danmark dagis | ⏸ Väntar | 0 |

**Nästa steg:** 9 april när SerpApi-kvoten återställs.

## SerpApi-nyckel

Nyckeln är redan konfigurerad i `.env` — samma som på första datorn. Du delar därmed samma SerpApi-konto och kvot (1000 credits/månad).

**OBS:** Committa **aldrig** `.env` till git. Den är redan i `.gitignore`.

## Dokumentation

Se `README.md` för:
- Fullständig kommandoreferens
- Sökstrategier och termer för varje land
- Filtreringsregler och kvalitetsförbättringar
- Estimeringar av faktiska kennlar
- Integrationsguide för Make.com-utskick

## Problem?

**"SERPAPI_KEY not set"**
→ Kontrollera att `.env` finns och innehåller nyckeln:
```bash
cat .env
```

**"google-search-results not installed"**
→ Kör: `pip install -r requirements.txt` igen

**"Script exits with no results"**
→ Kontrollera `build.log` för felinformation
→ SerpApi-kvoten kan vara slut — check [serpapi.com](https://serpapi.com)

**Andra fel?**
→ Kolla `data/build.log` för detaljer

## Nästa steg på nya datorn

1. ✅ Kopiera denna mapp till `scripts/` i flocken-website-repot
2. ✅ Installera `requirements.txt`
3. ✅ Verifiera med `--demo`
4. ⏳ Vänta tills 9 april
5. ▶️ Starta körningarna på 9 april

---

**Skapad:** 2026-04-07 för att enkelt byta arbetsstation utan att förlora progress.

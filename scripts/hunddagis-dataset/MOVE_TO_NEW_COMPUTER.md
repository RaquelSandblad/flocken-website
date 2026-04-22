# Hunddagis-Dataset: Flytta till Ny Dator

## Status på gamla datorn (2026-04-07)

✅ **Sverige dagis:** 800 st klart  
🔄 **Sverige kennlar:** 243/~400 klart (checkpoint sparad)  
⏸ **Norge dagis:** Startar 2026-04-09  
⏸ **Danmark dagis:** Startar 2026-04-09  

## Vad du behöver kopiera till ny dator

Från **`C:\Dev\flocken-website\scripts\hunddagis-dataset\`** på gamla datorn kopiera:

```
hunddagis-dataset/
├── .env                          ← VIKTIG: SerpApi-nyckeln
├── .env.example
├── README.md
├── USB_STICK_README.md
├── requirements.txt
├── build_hunddagis_dataset.py
├── filter_kennels_csv.py
├── config/                       ← Stadskonfigurationer
│   ├── seed_locations.json
│   ├── sweden_city_county_map.json
│   ├── norway_cities.json
│   └── denmark_cities.json
└── data/                         ← Resultat från gamla körningar
    ├── hunddagis_se_master.csv
    ├── hunddagis_se_kennels_master.csv
    ├── progress_se_kennels.json   ← VIKTIG: resumepoint
    ├── progress_no.json
    ├── progress_dk.json
    └── build.log
```

## Snabbguide för ny dator

### 1. Kopiera från USB eller dela nätverk
```powershell
# Om från USB (ex. enhet E:)
Copy-Item "E:\hunddagis-dataset" -Destination "C:\Dev\flocken-website\scripts\" -Recurse

# Eller via nätverk/dela från gamla datorn
```

### 2. Installera Python-beroenden
```powershell
cd "C:\Dev\flocken-website\scripts\hunddagis-dataset"
pip install -r requirements.txt
```

### 3. Verifiera
```powershell
python build_hunddagis_dataset.py --demo
```

### 4. Starta körningar 9 april
```powershell
# Sverige kennlar (fortsätter från checkpoint)
python build_hunddagis_dataset.py --country se --category kennels --limit 2000

# Norge dagis
python build_hunddagis_dataset.py --country no

# Danmark dagis
python build_hunddagis_dataset.py --country dk

# Rensa efter
python filter_kennels_csv.py data/hunddagis_se_kennels_master.csv
```

## Viktigaste filen: `.env`

**Innehål (dold för git):**
```
SERPAPI_KEY=e6f4df6a48a0d2aca5cac5d0819515884a5f04a898e1e69db4a4c2e39201867c
```

**Denna nyckel måste vara identisk på båda datorerna för att dela samma SerpApi-kvot.**

## Nästa steg på nya datorn

1. Kopiera hunddagis-dataset-mappen
2. Installera `requirements.txt`
3. Testa med `--demo`
4. Vänta tills 9 april
5. Starta körningarna

---

**Filer att sätta på USB-stickan:**
- Hela `scripts/hunddagis-dataset/` mappen (allt ovan)
- Denna README

**Storlek:** ~50 MB (mest data från gamla körningar)

Lycka till!

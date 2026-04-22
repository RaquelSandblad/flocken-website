# Dog Care Dataset Builder

Builds CSV files with **dog daycare/boarding/kennel businesses** by searching Google Maps via SerpApi and scraping business directories.

**Supported countries:** Sweden 🇸🇪 | Norway 🇳🇴 | Denmark 🇩🇰

---

## Directory layout

```
hunddagis-dataset/
├── build_hunddagis_dataset.py   # main script
├── filter_kennels_csv.py        # utility: clean kennel datasets
├── requirements.txt
├── README.md
├── .env.example
├── data/                        # created automatically on first run
│   ├── hunddagis_se_master.csv              # Sweden results
│   ├── hunddagis_se_raw.csv
│   ├── progress_se.json
│   ├── hunddagis_no_master.csv              # Norway results
│   ├── hunddagis_no_raw.csv
│   ├── progress_no.json
│   └── build.log
└── config/
    ├── sweden_city_county_map.json
    ├── seed_locations.json
    ├── norway_cities.json
    └── denmark_cities.json
```

## Output (`data/`)

| File | Description |
|------|-------------|
| `data/hunddagis_*_master.csv` | Final deduplicated dataset (by country & category) |
| `data/hunddagis_*_raw.csv` | All collected results (includes duplicates, raw fields) |
| `data/progress_*.json` | Checkpoint — allows resume after interruption |
| `data/build.log` | Full run log with timestamps |

### CSV columns (master)

| Column | Description |
|--------|-------------|
| `namn` | Business name |
| `stad` | City |
| `lan` | County (län) or region |
| `email` | Contact email (extracted from website & Facebook) |
| `hemsida` | Website URL |
| `facebook` | Facebook page URL (if found) |
| `kalla` | Source: `google_maps`, `directory` |

---

## Quick start

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure API key

```bash
cp .env.example .env
# Edit .env — add your SerpApi key
```

Get a free SerpApi key at [serpapi.com](https://serpapi.com) (100 free searches/month).
Paid plans start at $50/month for 5 000 searches — enough for a full run.

### 3. Run

```bash
# Default: Sweden, daycare/boarding businesses
python build_hunddagis_dataset.py

# Norway daycare/boarding
python build_hunddagis_dataset.py --country no

# Denmark kennels
python build_hunddagis_dataset.py --country dk --category kennels

# Sweden kennels, higher limit (resume from checkpoint)
python build_hunddagis_dataset.py --country se --category kennels --limit 2000
```

The script prints live progress and writes to all output files continuously.

### 4. Resume after interruption

Just run the same command again. The script reads `progress_*.json` and skips already-completed searches.

### 5. Filter kennel datasets (optional)

After kennels are collected, clean them retroactively:

```bash
python filter_kennels_csv.py data/hunddagis_se_kennels_master.csv
```

This produces `hunddagis_se_kennels_master_filtered.csv` with only verified kennels.

---

## Command-line flags

| Flag | Options | Default | Description |
|------|---------|---------|-------------|
| `--country` | `se`, `no`, `dk` | `se` | Country: Sweden, Norway, or Denmark |
| `--category` | `dagis`, `kennels` | `dagis` | Category: daycare/boarding or kennels |
| `--pages` | 1, 2, 3 | Auto (1 for test, 2 otherwise) | SerpApi results pages per query |
| `--all-terms` | — | OFF | Use extended search terms (higher yield, 2× cost) |
| `--test` | — | OFF | Run on 5 test cities only |
| `--cities CITY1,CITY2,...` | — | — | Custom city list |
| `--limit N` | integer | 800 | Stop after collecting N entries |
| `--no-scrape` | — | OFF | Skip website scraping (faster, less complete) |
| `--demo` | — | OFF | Print sample output, no API calls |

---

## Search strategy

The script uses two complementary sources:

### Source 1 — Google Maps via SerpApi (primary)
For each combination of **city × search term**, the script calls the Google Maps API and retrieves local business results with name, address, and website.

**Search terms by country & category (updated 2026-04-07):**

**Sweden (dagis/boarding):**
- hunddagis, hundpensionat, hundhotell (core)
- hunddaghem, dog daycare, dog boarding (extended w/ --all-terms)

**Norway (hundepass/boarding):**
- hundepass, hundepensjonat, hundebarnehage (core — corrected spelling & more specific terms)
- (extended terms with --all-terms)

**Denmark (hundepasning/boarding):**
- hundepasning, hundepension, hundehotel (core)
- (extended terms with --all-terms)

**All countries (kennels):**
- kennel, avel, hundavel, hunduppfödning, hundparning, parning hund

### Source 2 — hitta.se / Norwegian/Danish directories (secondary, no API key needed)
Supplements Google Maps by scraping local business directories for additional businesses not appearing prominently in Maps results.

### Website scraping (for email & Facebook)
For every result with a website URL, the script:
1. Fetches the homepage
2. Extracts `mailto:` links and email addresses from visible text
3. Extracts Facebook page links
4. If no email found, follows links to contact/about sub-pages (max 5 per site, prioritized)
5. **NEW (2026-04-07):** If no email yet and Facebook URL found, tries to scrape Facebook page's About section

This significantly improves email coverage for smaller businesses.

---

## City coverage & search order

### `config/seed_locations.json` (searched first)
Contains ~100 prioritised cities. The script searches these first to get broad coverage quickly.

### `config/sweden_city_county_map.json`, `norway_cities.json`, `denmark_cities.json` (searched after seeds)
Full city lists for each country. Script appends any city not in seed file.

To add a city to seeds:
```json
// seed_locations.json → locations array
{ "city": "Nystad", "county": "Västra Götalands län", "region": "Västsverige" }
```

---

## Rate limiting

| Operation | Delay |
|-----------|-------|
| Between SerpApi calls | 1.5–3.5 s |
| Between website scrapes | 0.8–2.5 s |
| Retry wait (429/503) | 12 s × attempt |

---

## Estimated run time

| Scenario | Time |
|----------|------|
| SerpApi only, 100 cities × 3 terms | ~3–5 hours |
| SerpApi only, 240 cities × 6 terms (kennels) | ~8–12 hours |
| Both Google Maps + directories combined | ~12–18 hours |

Run overnight or in stages — the resume mechanism handles interruptions.

---

## SerpApi quota planning

Each city × search term = 1 SerpApi call (up to 3 pages = 3 calls).

| Cities | Terms | Max calls |
|--------|-------|-----------|
| 30 (Norway test) | 3 | 90 |
| 100 (Sweden seed) | 6 | 600 |
| 240 (Sweden all) | 6 | 1,440 |

Free plan (100/month) is enough for small pilots.
Full run requires a paid plan ($50/month = 5,000 searches).

---

## Filtering rules (updated 2026-04-07)

### Name-based filtering
To avoid false positives, the script now requires dog-related keywords in the **business name**:

**For daycare/boarding (`category=dagis`):**
- Name must contain: "hund"/"dog", "dagis"/"daghem", "pensionat"/"pension", "boarding", or equivalent in Norwegian/Danish
- This filters out generic hotels that happen to accept dogs

**For kennels (`category=kennels`):**
- Name must contain: "kennel", "avel", "uppfödning"/"uppfödare", "oppdrett"/"oppdretter", "opdræt"/"opdrætter", etc.
- Strict filtering: no daycare, vet, pet shop, training center, or shelter keywords

**Excluded:**
- Blocket/Marketplace/classifieds
- Facebook group URLs
- Private care ads
- Entries where name or city is empty
- Known placeholder/test domains (example.com, test.com, etc.)

**Deduplication:**
- By `namn` + `stad` (case-insensitive)

### Quality results
- **Sweden kennels (raw):** 897 entries → **243 verified kennels** after filtering (82% removed)
- Estimated actual Swedish kennels: 300–400 (from ~15k SKK-registered breeders)
- Filter accuracy: Very high (only actual kennelnamn pass through)

---

## Completed runs & results

### Sweden (2026-03-09 to 2026-03-10 & 2026-04-07)

**Daycare/Boarding:**
- 800 entries collected ✅ Complete
- All entries valid (100% pass-through for dagis category)

**Kennels/Breeding (in progress):**
- 897 raw entries collected
- 243 verified kennels after filtering
- ~450/600 searches completed before SerpApi quota exhausted
- Expected final: 300–400 verified kennels

**Search terms used:**
- **Daycare:** hunddagis, hundpensionat, hundhotell
- **Kennels:** kennel, avel, hundavel, hunduppfödning, hundparning, parning hund

**Key improvements 2026-04-07:**
- ✅ Name-based filtering to remove false positives (hotels, vets, pet shops)
- ✅ Better email extraction: fler undersidor (3→5) + Facebook About-sida scraping
- ✅ Corrected Norway search terms: hundepensionat→hundepensjonat, hundehotel→hundebarnehage
- ✅ Added SerpApi quota detection for better error messaging

**Total Flocken outreach contacts:** 1,600+ from daycare + ~243+ kennels

### In progress (awaiting SerpApi quota reset 2026-04-09)

- [ ] `hunddagis_no_master.csv` — Norway daycare/boarding (0 entries, restarting with corrected terms)
- [ ] `hunddagis_dk_master.csv` — Denmark daycare/boarding
- [ ] `hunddagis_se_kennels_master.csv` — Sweden kennels (continue from checkpoint ~450/600)

### Scheduled for 2026-04-09

```bash
# 1. Clean Sweden kennels (no API cost)
python filter_kennels_csv.py data/hunddagis_se_kennels_master.csv

# 2. Norway dagis (new run with corrected terms)
python build_hunddagis_dataset.py --country no

# 3. Denmark dagis
python build_hunddagis_dataset.py --country dk

# 4. Sweden kennels (continue from checkpoint)
python build_hunddagis_dataset.py --country se --category kennels --limit 2000
```

### Future

- [ ] `hunddagis_no_kennels_master.csv` — Norway kennels
- [ ] `hunddagis_dk_kennels_master.csv` — Denmark kennels

---

## Filtering utility

Helper script `filter_kennels_csv.py` retroactively cleans kennel datasets:

```bash
python filter_kennels_csv.py data/hunddagis_se_kennels_master.csv
```

Output: `hunddagis_se_kennels_master_filtered.csv` with only verified kennels/breeding businesses.

**Why:** Google Maps "kennel" searches return many daycares, pet shops, vets, training centers, etc. The filter uses the same name-based logic as the main script to keep only real kennels.

---

## Integration with Make.com email outreach

The `hunddagis_*_master.csv` datasets are designed to integrate with an automated email pipeline in Make.com that personalizes and sends outreach emails to each business.

### Pipeline overview

```
CSV Dataset → Google Sheets → HTTP (Claude API) → Gmail → Status tracking
```

### Setup steps

1. **Upload CSV to Google Sheets**
   - Import `hunddagis_se_master.csv` into a Google Sheet
   - Columns should match: `namn`, `stad`, `lan`, `email`, `hemsida`, `facebook`, `kalla`
   - Add a new column `H` called `status` (leave empty initially)

2. **Create Make.com scenario**
   - **Module 1:** Google Sheets — Search Rows
     - Filter: `email` NOT empty, `status` NOT equal to `"skickat"`
     - Limit: Start with 5–7 per day (domän uppvärmning)
   
   - **Module 2:** HTTP Request (Claude API)
     - Call: `https://api.anthropic.com/v1/messages`
     - Include business name (`{{1.namn}}`) and city (`{{1.stad}}`) in prompt
     - Claude generates unique, personalized email text in HTML
   
   - **Module 3:** Filter — Regex
     - Validate email format: `.*@.*\..*`
     - Prevents crashes on invalid emails
   
   - **Module 4:** Gmail — Send Email
     - From: `torbjorn@flocken.info`
     - To: `{{1.email}}`
     - Body: HTML from Claude API response
   
   - **Module 5:** Google Sheets — Update Row
     - Set `status` column to `"skickat"` after successful send

3. **Domain warmup schedule**
   - Week 1: 5–7 emails/day
   - Week 2: 10–15 emails/day
   - Week 3+: 20–25 emails/day

### Claude API prompt (reference)

The HTTP module sends a prompt like this to Claude:

```
Du är en vänlig outreach-skribent för Flocken, en svensk hundägar-app.
Skriv ett kort, personligt mejl till ett hunddagis.

Hunddagisets namn: [Business name]
Stad: [City]

Regler:
- Börja med Hej!
- Presentera dig kort: Torbjörn, jobbar med Flocken
- Nämn att hundägare i appen letar hundvakt i deras stad
- Erbjud: Gratis profil i 6 månader
- Appen har 1 000+ registrerade hundägare
- CTA: Ladda ner Flocken i App Store/Google Play
- Avsluta med Hälsningar, Torbjörn
- Ton: Varm, kort, naturlig. Hundägare till hundägare.
- Svar i HTML med <br> för radbrytningar.
```

For full setup documentation, see `flocken-hunddagis-outreach-pipeline.md` (separate guide).

---

## Troubleshooting

**"SERPAPI_KEY not set"** — Create `.env` from `.env.example` and add your key.

**"google-search-results not installed"** — Run `pip install google-search-results`.

**Script exits with no results** — Check `build.log` for errors. SerpApi quota may be exhausted. Check status at [serpapi.com](https://serpapi.com).

**"⛔ SerpApi quota exhausted"** — Monthly quota reset. Check your plan reset date.

**hitta.se returns 0 results** — Their HTML structure may have changed. The scraper degrades gracefully.

**Make.com Gmail sends fail** — Check that `torbjorn@flocken.info` has Gmail API enabled and sender email is verified in Make.com.

---

## Kennel business estimation (Sweden)

Based on SKK (Svenska Kennelklubben) 2024 data:
- ~41,400 puppies registered annually
- ÷ 5 puppies per litter = ~8,300 litters/year
- ÷ 1.5 litters per kennel/year = ~5,500 active kennels
- Of these, ~50% have formalized kennel names and websites: ~2,500–3,000
- Sökbar på Google Maps + webb/Facebook: ~1,500–2,000

**Our target:** 300–400 verified kennels from comprehensive search is realistic and valuable.

# CB004 — Hundar

**Hypotes:** h01
**Audience:** dogowner (primärt Persona B — Erik/Anna, sekundärt Persona A — Karin)
**Primary hook:** hk_hundar
**Fas (Optimization Framework):** Fas 1 — Explore. Bred vinkel-divergens, jaga 2×+ winner, inte iterera på CB003-vinnaren.
**Status:** READY-FOR-PRODUCTION (2026-04-21)
**Referensdokument:** [HUNDAR_RESEARCH_SYNTHESIS.md](../../../../spitakolus/meta-ads/hundar-research/HUNDAR_RESEARCH_SYNTHESIS.md)

---

## Syfte

Validera om **Hundar-funktionen** (hundprofiler för lekkompisar, kennel-nätverk, parning) kan bära en egen kampanj vid sidan av CB003 (Passa). CB003 etablerade att Flocken är "någon du litar på" — CB004 vidgar budskapet till att Flocken är *navet i hundlivet*, inte bara en passningstjänst.

Sekundärt: bygga bredare förvärvsmotor för appen genom att tala till användare som inte reser (och därför inte behöver Passa), men vill ge hunden ett rikare socialt liv.

---

## Kampanjstruktur

1 kampanj med 3 parallella vinklar (ad sets). Samma mönster som CB003: **ABO, 50 kr/dag per ad set, LPV-optimering, Sverige, FB+IG (ej Audience Network).**

| Ad set | Vinkel | Persona | Copy-ton | Budget/dag |
|---|---|---|---|---|
| `as_a_lekkompis_swe_opt_lpv_cid004` | **Lekkompisen** | Erik/Anna (vardagshundägare) | Varmt, vardagligt, konkret — filtrering på storlek/ras som USP | 50 kr |
| `as_b_kennel_swe_opt_lpv_cid004` | **Kenneldynamik** | Karin (kennelägare/uppfödare) | Saklig, fackmässig, "ett ställe" — ansvarstagande avel, stamtavla, HD-fri | 50 kr |
| `as_c_forsvunnen_swe_opt_lpv_cid004` | **Försvunnen hund** | Trygghetssökaren (helikoptermatte) | Lösningsorienterad, inte skrämsel — realtidslarm till grannar | 50 kr |

**Totalt: 150 kr/dag.** Lär efter 7 dagar enligt Optimization Framework Fas 1 (min 100 clicks per ad innan paus-beslut, 2× effektförhållande = stark signal).

**Varför dessa 3 vinklar:** research-syntesen rankar Lekkompisen (1) + Kenneldynamik (2) + Försvunnen hund (4) som tre maximalt divergerande vinklar med stöd i ≥2 källor. "Trygg parningspartner" (3) utesluts för v1 — smal målgrupp + språklig känslighet, bättre att testa när Kenneldynamik etablerat koncept-resonans. "Låna/dela hund" (6) utesluts — äger inte utrymmet.

---

## Hard gates (innan kampanjen lanseras)

Alla ska uppfyllas före Meta-upload:

- [ ] `/v/hundar` landningssida live och verifierad (se [Landing page-spec](#landing-page-spec) nedan)
- [ ] Alla 6 annons-creative (3 vinklar × 4:5 static + 9:16 static) granskade av PL — ingen självgodkänd
- [ ] Hero-bild på `/v/hundar` är **1.91:1 eller bredare** (1920×1005 min) — undvik hero-kap-buggen från /v/passa
- [ ] Copy följer `META_ADS_PRODUCTION_CHECKLIST.md` hard gates (utrymme, hook, CTA-matchning)
- [ ] Display link = `flocken.info` (rotdomän), IG-profil satt, CTA = `LEARN_MORE` (Traffic-objective)
- [ ] UTM enligt mall: `utm_source=meta&utm_medium=paid_social&utm_campaign=cb004_<vinkel>&utm_content=<kod>_v01_<format>`
- [ ] Allt skapas PAUSED — Torbjörn aktiverar manuellt efter granskning
- [ ] BQ-attribution verifierad: `traffic_source.name` = nytt Meta-kampanj-ID loggat i launch-script-output

---

## Bildhantering

**Torbjörn producerar bilder just nu.** Agent (kreativ-producent) ska **välja bilder utifrån copy/message** när de finns — inte tvinga copy att passa befintliga bilder.

**Process:**
1. Torbjörn lägger bilderna i ny mapp: `/public/assets/flocken/v-hundar/` (och `/flocken_ads/creative_bases/cb004/assets/final/` för ad-creatives)
2. Kreativ-producent går igenom varje vinkel i copy.md: läser primary text + headline + intention-beskrivning
3. Matchar bild som **stödjer budskapet** — inte bara "en hund i en bild"
4. Rapporterar till PL: *"För vinkel Lekkompisen valde jag bild X eftersom den visar [motiv] vilket matchar primary text om [värde]. Bild Y valdes bort eftersom [avvikelse]."*
5. Vid oklarhet eller om ingen bild matchar en vinkel starkt → flagga till PL innan produktion, PL checkar med Torbjörn

**Hard rule:** om ingen bild matchar en vinkels kärnbudskap → pausa vinkeln tills bild finns. Skicka inte in en "okej" bild för att det är dags att lansera.

---

## Landing page-spec

**Route:** `/v/hundar` (variant av `/v/passa`)
**Implementation:** nytt `HUNDAR_CONFIG` i [components/v/VLandingConfig.ts](../../../../flocken-website/components/v/VLandingConfig.ts) + ny route `app/v/hundar/page.tsx` som renderar `<VLandingPage config={HUNDAR_CONFIG} />`. Ingen komponent-ändring behövs.

**Copy — se [copy.md](./copy.md)** för samtliga textfält. Kreativ-producent levererar färdig konfig med rätt fält.

**Hero-bild — hard requirement:**
- Minst **1.91:1 aspektförhållande** (1920×1005 rekommenderat, helst 2400×1256 för retina)
- Motiv: bredvik-komposition som tål crop — viktigt innehåll (ansikten, hund) i horisontell mittzon, inte övre tredjedelen
- Anledning: `/v/passa` hero kapar ansikten på 1366–1600px laptopbredd pga 1.79:1-bild mot `h-[65vh]` container → kommer att hända igen på `/v/hundar` om bilden inte är bredare. **Detta ska lösas vid creative-produktion, inte med CSS-work-around.**
- Om Torbjörn levererar en bild som är smalare än 1.91:1: PL flaggar tillbaka för ny crop innan launch

**Arg-bilder (3 st, arg1–arg3):**
- 4:5 eller 1:1 — spelroll mindre, matchar VLanding-komponentens inbyggda rendering
- Ska visuellt stödja vart och ett av de 3 argumenten (se copy.md)

---

## Creative-specs (ads)

Per vinkel: **2 ads × 3 vinklar = 6 ads totalt.**

| Format | Mått | Användning |
|---|---|---|
| 4:5 static | 1080×1350 | FB feed, IG feed |
| 9:16 static | 1080×1920 | FB/IG stories + reels |

**Ingen video i v1.** Hold-the-line: CB003 visade att statiska fungerar lika bra om inte bättre för Flocken, och vi vill isolera vinkel-effekten innan vi introducerar video som extra variabel. Video kan testas i v2 om en vinkel etablerar sig som vinnare.

**Per ad — innehåll kommer från copy.md:**
- Primary text (2 varianter per vinkel, välj en per ad)
- Headline (2 varianter per vinkel, välj en per ad)
- Description
- CTA: `LEARN_MORE`
- Destination: `https://flocken.info/v/hundar?utm_source=meta&utm_medium=paid_social&utm_campaign=cb004_<vinkel>&utm_content=<kod>_v01_<format>`
- Display link: `flocken.info`

---

## Don'ts (från research-syntes §6)

1. **Ingen skrämselmessaging** på Försvunnen hund-vinkeln — fokus på lösning (larm, gemenskap), inte trauma
2. **Attackera inte FB-grupper explicit** — implicit inframing OK, direkt attack ej
3. **Inte "oansvarig avel", "backyard breeder"** i Kenneldynamik — använd "ansvarstagande", "stamtavla", "HD-fri"
4. **Blanda inte personas i en annons** — Karin och Erik/Anna får inte dela copy
5. **Sälj premium-värdet**, presentera det inte som lås
6. **Differentiera från DogDater** i Lekkompis-vinkeln — filter + säkerhet, inte bara swipe

---

## Namngivning

- **Kampanj:** `c_flo_swe_init_dogowner_lpv_h01_cid004`
- **Ad sets:** se tabell ovan
- **Ads:** `ad_cid004_<a|b|c>_v01_<4x5|9x16>_static`
- **UTM:** `utm_campaign=cb004_<lekkompis|kennel|forsvunnen>`

---

## Handoff

| Ansvar | Vem | Leverans |
|---|---|---|
| Forskningsunderlag + brief + framework-alignment | PL (Claude) | **Denna brief** (klar) |
| Produktion bilder (hero 1.91:1 + arg × 3 + 6 ads × 2 format) | Torbjörn | Lägg i `/public/assets/flocken/v-hundar/` + `/flocken_ads/creative_bases/cb004/assets/final/` |
| Välja bilder utifrån copy/message | kreativ-producent | Rapport till PL: "bild X valt för vinkel Y eftersom Z" |
| Copy-produktion | kreativ-producent | Levererar `copy.md` med fyllda fält + `HUNDAR_CONFIG`-draft för VLandingConfig.ts |
| Landing page-implementation | utvecklingsrådgivare | `HUNDAR_CONFIG` + route `app/v/hundar/page.tsx`, testkört lokalt |
| Meta-launch-script | PL (Claude) | `scripts/launch-cb004-hundar.js`, samma pattern som CB003 |
| Launch PAUSED + aktivering | Torbjörn | Manuell granskning + aktivering i Ads Manager |
| Post-launch-analys efter 7 dagar | dataanalytiker + growth-manager | Mot Optimization Framework Fas 1-matrisen |

---

## Framework-referens för post-launch

**Fas 1 — Explore. Beslutsregler:**
- Efter ~7 dagar + ~100 clicks/ad: matcha mot beslutsmatrisen i [OPTIMIZATION_FRAMEWORK.md](../../../../spitakolus/meta-ads/OPTIMIZATION_FRAMEWORK.md)
- **2×+ CTR- eller CPA-diff mellan bäst/sämst ad → pausa sämst, släpp in utmanare** (stark signal)
- **< 1.5× ratio men ≥ 100 clicks/ad → pausa sämst, utmanare in ändå** (inget värde i att vänta)
- **< 50 clicks/ad → vänta 1–2 dagar till, eller öka budget på båda om tid är kritisk**
- Ad set-nivå-ändringar (targeting, budget >50%, goal-byte) → mänsklig blick, inte automation
- Varje rekommendation ska referera matris-raden som triggade den

**Övergång till Fas 2 kräver:** vinnare i 2 iterationer i rad + stabil CAC 2+ veckor + nya radikala vinklar slår inte vinnaren.

---

## Revisioner

| Datum | Version | Ändring |
|---|---|---|
| 2026-04-21 | 1.0 | Första version — hook bytt från "rasta" till "hundar", research-förankrad |

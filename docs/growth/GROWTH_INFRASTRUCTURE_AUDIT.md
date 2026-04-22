# Growth Infrastructure Audit -- Flocken Brand Makeover

**Version:** 1.0
**Datum:** 2026-04-14
**Ansvarig:** Growth & Conversion Manager
**Status:** Levererad till Torbjorn for beslut

---

## 1. Executive Summary

Flocken har en solid teknisk grund: Next.js-sajt med smart download-routing, quiz-funnel, GA4/GTM-tracking, definierade funnels och KPI:er, samt ett genomtankt Creative Base-system for Meta Ads. Men tillvaxtmotorn star still. Av 5 Creative Bases ar bara 2 klara. Sajten saknar SEO-content helt. Naming convention ar overdesignad for nuvarande volym. Och den kritiska konverteringskedjan annons-till-app har inga mellansteg som fangar intresse.

**De tre storsta flaskhalsarna:**
1. **Inget innehall som rankar organiskt** -- sajten har 5 indexerade sidor, ingen blogg, inga landningssidor per funktion
2. **Creative Bases ar ofardiga** -- CB001, CB003, CB004 ar tomma mallar, bara CB002 (Para) och CB005 (Besoka) har riktigt innehall
3. **Funneln har inga mellansteg** -- fran annons/sok gar det rakt till app store utan att fanga e-post, visa social proof eller bygga tillit

**Rekommendation:** Gor en fokuserad makeover av det som finns, bygg inte om fran grunden. Sajten ar tekniskt bra. Det som saknas ar content, fyllda briefs och en fungerande mid-funnel.

---

## 2. Konkurrentlandskap

### Internationella tungviktare

**Rover** (rover.com)
- Storsta pet care-plattformen i Nordamerika
- Fokus: hundvakt, promenader, boarding
- Avgift: 20% provider + 11% agare (31% totalt)
- Starkt vardelofte: trygghet, reviews, forsakring
- Landningssida: soksentrisk -- PLZ-sok direkt i hero, inga lange texter
- Annonsering: emotionell vinkel ("To My Hooman"-kampanj), adresserar separationsangest
- **Lardomar for Flocken:** Rover later anvandaren GORA nagot direkt pa landningssidan (sok). Flocken visar information men ger ingen interaktion forutom "ladda ner".

**Wag** (wagwalking.com)
- Ansokta om konkurs juli 2025, drivs vidare under ny agare
- 40% avgift drev bort erfarna hundvakter
- On-demand-modell (hundvakt inom en timme)
- **Lardomar for Flocken:** Marknaden for rena hundvakts-appar ar tough med hog churn. Flockens bredd (4 funktioner) ar en styrka.

**Sniffspot** (sniffspot.com)
- Privata hundparker att hyra per timme
- Unik nisch, starkt i USA
- **Lardomar for Flocken:** Nischade produkter konverterar battre i annonser -- en tydlig hook per annons, inte "vi gor allt".

**Pawshake** (pawshake.de/se)
- Hundvakt-plattform, aktiv i 15+ lander inkl Europa
- 20% kommission
- **Lardomar for Flocken:** Europeisk narvaro visar att marknaden finns. Men Pawshake ar inte etablerat i Sverige som vardag.

### Skandinaviska konkurrenter

**Dogstr** (dogstr.app)
- Grundad av Emma Feurst
- Community + marketplace (kop/salj hundprylar) + hundvanlig guide
- Tillganglig pa App Store och Google Play i Sverige
- Liknande bredd som Flocken men med handelsfokus
- **Direkt konkurrent** -- overlapp pa community och hundvanliga platser
- Verkar ha begransad marknadsforingsbudget baserat pa synlighet

**Woof** (woofapp.se)
- Svenska hundvakter med 3-stegs verifiering
- Fokus: professionell hundvakt
- **Overlapp:** Konkurrerar med Flockens Passa-funktion

**Dogs** (app, lanserad 2022)
- "Tool-based social network for dog owners"
- Mission att forenkla vardagen och skapa gemenskap
- **Overlapp:** Nara Flockens positionering

**I Woof U** (iwoofu.se)
- Hundvakt/hunddejting
- Kombination av passning och socialt

**Bedomning:** Den svenska marknaden ar fragmenterad med 4-5 smarre spelare. Ingen dominerar. Ingen har Flockens bredd av funktioner (Para + Passa + Rasta + Besoka i samma app). Det ar en genuin USP -- men den maste kommuniceras skarpt, inte som en funktionslista.

### Vad vi kan stjala/inspireras av

| Koncept | Fran | Applicering |
|---------|------|-------------|
| Sok-i-hero (interaktion direkt) | Rover | Lat besokaren soka hundar/platser pa sajten |
| Emotionell annonsvinkel | Rover | "To My Hooman"-stil: addressera kanslor, inte features |
| Nischade hooks per annons | Sniffspot | En funktion per annons, inte "vi gor allt" |
| Verifieringsbadge/trust | Woof | Visa trygghet i Passa-kommunikation |
| Marketplace/community-mix | Dogstr | Overvakning -- de ar narmaste konkurrenten |

---

## 3. Website Audit -- flocken.info

### Sajtstruktur (faktiska sidor)

```
/ (marketing)           -- Huvudsida: hero + features + USPs + testimonials + CTA
/funktioner             -- Detaljerad sida per funktion med video
/valkommen              -- Landing page for ads (narmast identisk med /)
/quiz                   -- Quiz-bibliotek (7 quizzes)
/quiz/[slug]            -- Enskild quiz
/quiz/[slug]/result     -- Resultat med OG-taggar for delning
/download               -- Smart redirect (iOS->AppStore, Android->Play, Desktop->manual)
/download/manual        -- Manuell val av butik
/valkommen/ab-demo      -- A/B-test demo
/valkommen/test-tracking -- Tracking-test
/auth/confirm           -- E-postbekraftelse
/reset-password         -- Losenordsaterstaallning
/integritetspolicy      -- Legal
/anvandarvillkor        -- Legal
/cookiepolicy           -- Legal
/privacy-choices        -- Legal
/support                -- Support
/font-test              -- Internt
/typsnitt-kombinationer -- Internt
/typsnitt-test          -- Internt
```

### Funnelanalys

**Nuvarande funnel:**
```
Annons/Sok -> flocken.info (/) -> "Ladda ner" -> App Store/Play -> Download -> Register
                  |
                  +-> /funktioner -> "Ladda ner" -> App Store/Play
                  |
                  +-> /quiz -> Quiz -> Resultat -> "Ladda ner Flocken" -> App Store/Play
```

**Problem:**
1. **/ och /valkommen ar nastan identiska** -- samma content, samma CTA. /valkommen tillfor inget extra for annonstrafik. Det ar slosaeri med en landing page.
2. **Ingen mid-funnel** -- fran informativ sida till app store utan nagot emellan. Ingen e-postfangst, inget "visa mig mer", ingen social proof fran riktiga anvandare.
3. **Quiz-funneln ar smart men underutnyttjad** -- quiz har OG-taggar for delning (viral loop) och en CTA till appen. Men den ar inte kopplad till annonsering och sitter inte i huvudnavigering.
4. **Testimonials ar fabricerade** -- "Anders" och "Jonas" med generiska titlar. Besokare kannar av det. Riktiga reviews ar battre an inga reviews.
5. **Download-routern ar bra** -- smart UA-detection for iOS/Android/desktop. Det ar genomtankt.

### Bedomning: Makeover vs ombyggnad

**Makeover racker.** Tekniken ar solid (Next.js 15, Tailwind, bra komponentstruktur). Det som behovs:
- Ny /valkommen som ar en riktig ad landing page (annorlunda an /)
- Funktionsspecifika landningssidor (/para, /passa, /rasta, /besoka)
- Blogg/content-sektion for SEO
- E-postfangst (MailerSend) pa sajten -- vardebaserad: "Fa tips for hundlivet"
- Riktiga testimonials eller App Store-reviews

---

## 4. SEO-bedomning

### Nuvarande status

**Sitemap:** Innehaller 5 URLer (/, /integritetspolicy, /anvandarvillkor, /valkommen, /funktioner). Det ar extremt tunt.

**robots.txt:** Tillater all crawling. Bra.

**Content:** Sajten har i princip tva sidor med substans (/ och /funktioner). Inget blogginehall. Inga langsvantsartiklar. Inga FAQ-sidor.

**Quizzes:** Sitter pa quiz.flocken.info (subdomain) -- det ger inte samma SEO-juice som om de lat pa flocken.info/quiz.

### Soklandskap i Sverige

Baserat pa research:
- "hundapp" -- Harliga Hund, App Store-listor, Dogstr rankar
- "hitta hundkompisar" -- Harliga Hund artiklar, DogDater
- "hundvakt app" -- Woof, Rover, diverse listor
- "hundvanliga restauranger" -- lokala guider, inga appar rankar
- "hundras parning" -- uppfodarsidor, SKK
- "hundpromenad app" -- generiska listor

**Flocken rankar for ingenting.** Med 5 sidor och inget blogginehall finns ingen SEO-narvaro.

### SEO-mojligheter

| Sokterm-kluster | Volym (uppskattat) | Konkurrens | Relevans for Flocken |
|-----------------|-------------------|------------|---------------------|
| hundvanliga platser/restauranger [stad] | Medel | Lag | Besoka -- direkt match |
| hitta hundkompisar / hundlek | Lag-Medel | Lag | Para -- direkt match |
| hundvakt [stad] / hundpassning | Medel | Medel | Passa -- konkurrens fran Woof, Rover |
| hundras [ras] temperament/fakta | Hog | Medel | Indirekt -- content-spel |
| hundpromenad tips/rundor [stad] | Lag | Lag | Rasta -- lokalt content |

### Rekommendation

**Investera i SEO -- men smart, inte tungt.** Flytta quiz-innehall till flocken.info/quiz (inte subdomain). Skapa funktionsspecifika landningssidor (/hundvanliga-platser, /hitta-hundkompisar, /hundvakt). Starta en enkel blogg med 2-4 artiklar/manad -- fokus pa langsvantsokningar som "hundvanliga cafer stockholm", "basta hundrastgardarna goteborg".

Prioritera Besoka-content forst -- det har lagst konkurrens och hogst lokal relevans.

**Ratio paid vs organic:** 70% paid / 30% SEO initialt. SEO bygger over tid. Paid ger resultat nu.

---

## 5. Meta API Capabilities

### Vad gar att automatisera via API

| Funktion | API-stod | Begransning |
|----------|----------|-------------|
| Skapa kampanjer | Ja | Advantage+ ar nu standard (legacy APIs utfasade Q1 2026) |
| Skapa ad sets | Ja | Budget, targeting, placering via API |
| Skapa ads | Ja | Creatives, copy, CTA -- allt via API |
| Ladda upp bilder/video | Ja | Batch-upload mojligt |
| Dynamiska creatives | Ja | Mix-and-match assets + text automatiskt |
| Audience management | Ja | Custom audiences, lookalikes |
| Reporting/insights | Ja | Daglig data, breakdowns, attribution |
| Pausa/starta kampanjer | Ja | Statusandringar via API |
| Budgetjusteringar | Ja | Campaign och ad set-niva |

### Vad kraver manuell hantering

| Funktion | Varfor |
|----------|--------|
| Ad review/godkannande | Alla ads gar genom Metas granskningsprocess, oavsett API eller UI |
| Business verification | Engangsgodkannande for Advanced Access |
| App review for API | Kravs for produktionsanvandning, tar flera arbetsdagar |
| Pixel/CAPI-setup | Initial konfiguration maste goras manuellt |
| Payment/billing | Betalmetoder hanteras i Business Manager |
| Policy-overklagan | Manuell process om ads avvisas |

### Advantage+ forandring (2025-2026)

Meta har infort ett enhetligt kampanjsystem som automatiskt avgors av tre instaallningar: budget, audience och placement. Det gamla separata flodet for Advantage+ Shopping/App ar borta. Alla kampanjer skapade via API foljer nu samma struktur.

### Realistisk AI-first ad pipeline

```
1. Brief (manniska/agent) --> CB skapas med brief.md + copy.md
2. Creatives (AI-generering) --> Gemini for bilder, Claude for copy
3. Upload (API) --> Assets laddas upp till Meta
4. Campaign creation (API) --> Kampanj + ad set + ads skapas med korrekt naming
5. Status: PAUSED --> Alla ads skapas pausade
6. Manniskt godkannande --> Torbjorn granskar i Business Manager
7. Aktivera --> Status andras till ACTIVE via API eller UI
8. Reporting (API) --> Daglig data till BigQuery
9. Optimering (agent) --> Pausa losers, skala winners
10. Ny iteration --> Tillbaka till steg 1
```

**Steg 6 ar flaskhalsen** -- och den ar medveten. Vi ska ALDRIG publicera utan godkannande.

---

## 6. Ad Asset Audit

### Nuvarande struktur

```
flocken_ads/creative_bases/
  cb001/ -- Allment varde (hk_all) -- TOMT (bara template)
  cb002/ -- Para (hk_para) -- KLAR (brief, copy, 18 bilder, 8 videos)
  cb003/ -- Passa (hk_passa) -- TOMT (bara template + 1 video)
  cb004/ -- Rasta (hk_rasta) -- TOMT (bara template)
  cb005/ -- Besoka (hk_besoka) -- KLAR (brief, copy, 2 videos)
  cb00x_templates/ -- Mall for nya CB
```

### Problem

1. **3 av 5 CB:er ar tomma mallar.** CB001, CB003 och CB004 har inte ens ifyllda briefs. Det ar den storsta blockeraren for annonsering.
2. **CB002 (Para) har flest assets men naming ar inkonsekvent.** Filer heter bade `fl-img_para_dogs_jump_v01_1x1.png` och `flo_vin1_community_imgA_1x1.jpg` -- tva helt olika konventioner i samma CB.
3. **Naming convention ar overdesignad.** `ad_h01a_cb003_v01_hk_besoka_src_ai_cid001` ar korrekt enligt spec men svart att arbeta med i praktiken. For 6 annonser ar det overkill.
4. **Assets saknar metadata** -- ingen manifest.json eller liknande som mappar filnamn till beskrivning, storlek, anvandningsomrade.

### Foreslagen forenklad struktur

Behall CB-konceptet (det ar bra) men forenkla filnamnen:

```
flocken_ads/
  creative_bases/
    cb001_allvarde/
      brief.md
      copy.md
      assets/
        img/
          hero_1x1.jpg
          hero_4x5.jpg
          hero_9x16.jpg
          alt_1x1.jpg
        vid/
          main_9x16.mp4
          main_1x1.mp4
    cb002_para/
      ...
    manifest.json  <-- NY: mappar CB till kampanj, status, senast andrad
```

**Naming for Meta Ads ar SEPARAT fran filnamn.** API:t satter naming vid skapande -- det behovs inte i filnamnet.

### Prioriterad atgard

Fyll i CB001, CB003 och CB004 -- det ar veckoarbete, inte manadsprojekt. Briefs forst, sedan copy, sedan assets.

---

## 7. Dokumentationsscan

### Vad som finns (relevant for growth/marketing)

**Spitakolus-repot:**
- `meta-ads/NAMING_CONVENTIONS.md` -- Last, valdefinierad
- `meta-ads/CREATIVE_WORKFLOW.md` -- Last, bra ramverk
- `meta-ads/ACCOUNT_STRUCTURE.md` -- Tom (under utveckling)
- `tracking/` -- GA4, GTM, BigQuery-setup dokumenterat
- `skills/GROWTH_LOOP_VISION.md` -- Strategisk vision for automatiserad growth loop

**Flocken-website docs/:**
- `analytics/FUNNELS.md` -- Funnelkontrakt definierade (bra)
- `analytics/KPI_DICTIONARY.md` -- KPI:er definierade (bra)
- `brand/value_proposition.md` -- Tydlig value prop
- `brand/visual_style.md` -- Detaljerad visuell stil med AI-prompts (mycket bra)
- `brand/personas/` -- 4 personas (Marco, Anna, Anders, Jonas)
- `ab-testing/` -- A/B-testramverk och tracking-docs
- `creative/IMAGE_GENERATION.md` -- Gemini-baserad bildgenerering dokumenterad

### Vad som saknas

1. **Kampanjplan** -- ingen doc beskriver vilka kampanjer som ska koras, nar, med vilken budget
2. **Testlogg** -- inga dokumenterade testresultat (enligt testprinciperna ska resultat dokumenteras)
3. **Retention-strategi** -- inget dokument om de ~800 gratisanvandarna och premium-utgang aug-sep
4. **E-post/push-plan** -- MailerSend namns men ingen onboarding-sekvens eller re-engagement-plan dokumenterad
5. **ASO-strategi** -- App Store Optimization saknas helt (nyckelord, screenshots, A/B-tester)
6. **Content-kalender** -- inget planerat content for sajt eller sociala medier

---

## 8. AI-first Arbetsflode -- Realistisk Bedomning

### Vad agenter kan hantera autonomt idag

| Uppgift | Mognad | Kommentar |
|---------|--------|-----------|
| Generera ad copy fran brief | Hog | Claude kan skapa copy.md-varianter direkt |
| Generera bilder fran prompt | Hog | Gemini Imagen ar redan konfigurerat |
| Skapa Meta-kampanjer via API | Medel | Tekniskt mojligt, men kravs API-setup + Advanced Access |
| Analysera Meta-data | Lag | BQ-synk ar STALE sedan 11 mars -- maste fixas |
| Skriva blogginehall | Hog | Claude + Flockens tone_of_voice.md = bra content |
| Analysera App Store data | Lag | Ingen automatiserad pipeline |
| E-post-sekvenser | Medel | MailerSend API finns, behover setup |

### Vad som kraver mannisklig input

1. **Strategiska beslut** -- vilka hypoteser att testa, budgetfordelning
2. **Godkannande av ads** -- Torbjorn maste se varje annons fore publicering
3. **Brand-bedomning** -- stammer bilden med Flockens kanslovat?
4. **App Store-andringar** -- Apple kraver manuell review-process
5. **Community-interaktion** -- svara pa reviews, hantera support

### Storsta flaskhalsarna

1. **BQ-synk ar trasig** -- utan data kan vi inte optimera
2. **Inga fyllda Creative Bases** -- agenter kan generera copy men det finns ingen brief att utgafran for 3 av 5 CB:er
3. **Ingen e-post-infrastruktur** -- MailerSend finns men noll sekvenser ar uppbyggda
4. **Inget ad account API-access** -- kravs setup + review av Meta

### Dromscenariopipeline

```
Vecka 1-2: SETUP
- Fixa BQ-synk (Dataanalytiker)
- Soka Meta API Advanced Access
- Fylla alla Creative Bases (Growth Manager + Kreativ producent)
- Bygga 3 MailerSend-sekvenser (onboarding, re-engagement, upgrade)

Vecka 3-4: FORSTA KAMPANJCYKELN
Brief -> Claude genererar copy -> Gemini genererar bilder -> 
API skapar kampanj (PAUSED) -> Torbjorn godkanner -> ACTIVE ->
Daglig data till BQ -> Veckoanalys -> Pausa losers, skala winners

Vecka 5+: LOPANDE
- Ny CB varje 2 veckor
- A/B-test pa landing pages (redan forberett i koden)
- E-postsekvenser trigger baserat pa beteende
- Manatlig SEO-artikel
```

---

## 9. Prioriterade Rekommendationer

Rangordnade efter forvantat genomslag och genomforbarhet.

### P1 -- Gor denna vecka

**1. Fyll alla Creative Bases (CB001, CB003, CB004)**
- Funnelposition: Top of funnel (annonsering)
- Problem: 3 av 5 CB saknar innehall -- vi kan inte annonsera bredare an Para och Besoka
- Hypotes: Passa (CB003) ar sannolikt starkaste hooken -- praktisk smarta "vem passar min hund?"
- Test: Inget test an -- fylla briefs ar forarbete
- Behov: Kreativ producent fyller briefs, Torbjorn godkanner

**2. Fixa BQ-synk (Meta Marketing API)**
- Funnelposition: Analys/infrastruktur
- Problem: Data ar stale sedan 11 mars -- vi flyger blint
- Behov: Dataanalytiker + Torbjorn (mojeligen credentials)

### P2 -- Gor inom 2 veckor

**3. Bygg en riktig ad landing page (/valkommen)**
- Funnelposition: Mid-funnel (annons -> landing page -> download)
- Problem: /valkommen ar identisk med startsidan. Annonstrafik behoever en fokuserad sida med en CTA, social proof, och matchning mot annonsens hook
- Hypotes: En dedikerad landing per hook (Passa, Besoka, Para) okar CR fran annons till download
- Test: Starta med EN hook-specifik sida (Passa). Mata CR mot nuvarande /valkommen
- Behov: Utvecklingsradgivare bygger sidan, jag specificerar innehall

**4. Starta e-postfangst pa sajten**
- Funnelposition: Mid-funnel (besokare som inte laddar ner direkt)
- Problem: 100% av besokare som inte laddar ner ar forlorade -- vi fangar inget
- Hypotes: En vardebaserad e-postfangst ("Tips for hundlivet varje vecka") fangar 3-5% av besokare
- Test: Enkel form pa startsida + quiz-resultat. Mata signup rate
- Behov: MailerSend-setup, Utvecklingsradgivare for formularet

### P3 -- Gor inom 1 manad

**5. Retention-kampanj for ~800 gratisanvandare**
- Funnelposition: Bottom of funnel (gratisanvandare -> betalande)
- Problem: Premium-perioden loser ut aug-sep. Utan strategi tappar vi dem
- Hypotes: Tidig kommunikation (maj-juni) med vardeerbjudande okar konvertering
- Test: Push-notis + e-post-sekvens. Segmentera: aktiva vs inaktiva anvandare
- Behov: RevenueCat-data for segmentering, MailerSend for e-post, push-integration

**6. SEO-content: Funktionsspecifika landningssidor**
- Funnelposition: Top of funnel (organisk)
- Prioritet: /hundvanliga-platser-[stad] (Besoka), /hitta-hundkompisar (Para)
- Behov: Content-produktion, Utvecklingsradgivare for nya routes

**7. Meta API Advanced Access -- ansok nu**
- Behov: Business verification + API-review. Tar dagar-veckor. Starta nu.

### Vad vi INTE ska gora nu

- Bygga om sajten fran grunden (tekniken ar bra)
- Overinvestera i SEO (paid ger snabbare resultat vid var volym)
- Starta mer an 2 tester samtidigt
- Automatisera allt fore vi har manuella resultat att lara oss av

---

## 10. Kallor

### Konkurrentresearch
- [Rover](https://www.rover.com)
- [Wag vs Rover Comparison](https://www.petcareins.com/blog/wag-vs-rover-review)
- [Sniffspot](https://www.sniffspot.com)
- [Pawshake](https://en.pawshake.de)
- [Dogstr](https://www.dogstr.app)
- [Woof](https://woofapp.se)
- [Dogs app](https://www.hundvanligahotell.se/app-dogs/)
- [Harliga Hund -- hundappar](https://www.harligahund.se/10-smarta-appar-for-mer-skoj-med-vovven/)
- [I Woof U](https://iwoofu.se/en/skaffa-appen/)

### Meta API
- [Meta Ads API Guide 2026 -- Sovran](https://sovran.ai/blog/api-facebook-ads)
- [Meta Ads API Setup Guide 2026 -- AdManage](https://admanage.ai/blog/meta-ads-api)
- [Facebook Ads API Programmatic Guide 2026 -- AdStellar](https://www.adstellar.ai/blog/facebook-ads-api)
- [Meta Advantage+ unified API](https://ppc.land/meta-launches-unified-api-structure-for-advantage-campaigns/)
- [Meta API Authorization](https://developers.facebook.com/docs/marketing-api/get-started/authorization/)
- [Advanced Access Trap -- Medium](https://medium.com/@bilal.105.ahmed/facebook-marketing-api-the-advanced-access-trap-that-nearly-killed-my-project-7227ea2ee2c2)

### SEO/Konkurrens Sverige
- [Hundvanliga Stockholm -- PAWSOME](https://pawsome.app/)
- [Svenska Brukshundklubben -- Duktig hund](https://brukshundklubben.se/utbildning-aktivitet/utbildning/appen-duktig-hund/)
- [PreVet app](https://prevet.se/hund/)

### Lokala filer
- Sajtstruktur: `/c/dev/flocken-website/app/`
- Meta Ads docs: `/c/dev/spitakolus/meta-ads/`
- Creative Bases: `/c/dev/flocken-website/flocken_ads/creative_bases/`
- Funnel-kontrakt: `/c/dev/flocken-website/docs/analytics/FUNNELS.md`
- KPI-dictionary: `/c/dev/flocken-website/docs/analytics/KPI_DICTIONARY.md`
- Visuell stil: `/c/dev/flocken-website/docs/brand/visual_style.md`
- Growth Loop Vision: `/c/dev/spitakolus/skills/spitakolus-project-navigation/GROWTH_LOOP_VISION.md`

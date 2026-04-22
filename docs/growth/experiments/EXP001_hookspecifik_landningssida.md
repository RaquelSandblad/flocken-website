# EXP001: Hookspecifika landningssidor

**Status:** SPEC -- väntar på godkännande
**Funnelposition:** Mid-funnel (annons --> landningssida --> app store)
**Ägare:** Growth & Conversion Manager
**Datum:** 2026-04-14

---

## Hypotes

```
Since we have observed that: betald trafik från Meta till /valkommen har låg konvertering -- sidan 
  är generisk och visar alla fyra funktioner, oavsett vilken hook annonsen använde. 
  /valkommen är nästan identisk med startsidan (/) och gör inget extra för annonstrafik.
We want to: skapa hookspecifika landningssidor (/v/passa, /v/besoka, /v/hundar, /v/rasta) 
  där varje sida matchar annonsens löfte med fokuserad copy, relevant screenshot och en enda CTA.
For: Meta-besökare som klickat på en hookspecifik annons.
Which should lead to: högre konvertering till app-nedladdning -- besökaren ser exakt det 
  annonsen lovade istället för en funktionslista.
Measured by: CTR till App Store (primärt) and bounce rate (sekundärt)
```

### Guardrails
- Sidladdningstid får inte överstiga 2 sekunder (LCP)
- Organisk trafik till /valkommen och / påverkas inte (varianterna har separata URL:er)
- Registreringsrate efter nedladdning ska hållas på samma nivå (mäts i GA4)

---

## Bakgrund och problemanalys

### Nuvarande flöde
```
Meta-annons (hook: Passa) --> klick --> /valkommen --> generisk sida med 4 funktioner --> 
  "Ladda ner" --> App Store --> Download
```

### Problem
1. **Mismatch:** Annonsen säger "hitta hundvakt" men landningssidan visar Para, Passa, Rasta OCH Besöka. Besökaren måste själv hitta det annonsen lovade.
2. **Identisk med startsidan:** /valkommen tillför inget extra jämfört med /. Det är inte en landningssida -- det är startsidan med ett annat URL.
3. **För många val:** Fyra FeatureBlocks, tre USP:er, två testimonials, en final CTA. Det är bra för en explorativ besökare men dåligt för någon som klickat på en specifik annons.

### Vad konkurrenterna gör
- **Rover:** Sök-i-hero direkt -- besökaren GÖR något på sidan, inte bara läser
- **Sniffspot:** En funktion per annons, en funktion per landningssida -- nischade hooks konverterar bättre

---

## Testdesign

### Control
- **URL:** `/valkommen`
- **Trafikkälla:** Meta ad set med `utm_content=control`
- **Innehåll:** Befintlig generisk sida (hero + 4 features + USPs + testimonials + CTA)

### Variant: Hookspecifika sidor
Vi börjar med EN hook -- Passa -- eftersom:
1. CB003 (Passa) är under produktion och blir den näst färdiga Creative Base
2. Passa är den mest praktiska funktionen (löser akut problem: "vem passar min hund?")
3. Passa-hooken är enklast att kommunicera i en enda mening

**URL:** `/v/passa`
**Trafikkälla:** Meta ad set med `utm_content=variant_passa`

### Variant-sidans struktur

```
/v/passa

[1] Hero
    - Rubrik: matchar annonsens Passa-hook (ex: "Hitta en hundvakt du och din hund är trygga med")
    - Underrubrik: en mening som förstärker löftet
    - Screenshot: Passa-funktionen i appen (flocken_passa_yasmin.png)
    - EN CTA: "Ladda ner Flocken" --> /download (smart redirect)
    - Social proof-rad: "X hundägare använder redan Flocken" (om vi har siffra)

[2] Tre argument (kort)
    - Trygghet: "Tydliga profiler på varje hundvakt"
    - Enkelhet: "Kontakta direkt i appen"  
    - Flexibilitet: "Byt passning med andra -- kostnadsfritt"

[3] Screenshot/visuellt bevis
    - Passa-skärmdump eller kort demo
    - Alt: hand-mockup bild om tillgänglig

[4] CTA (upprepad)
    - Samma som hero-CTA
    - Kort prisinfo: "Gratis att ladda ner. Premium för fler funktioner."

Inget mer. Ingen testimonial-sektion. Inga andra funktioner. 
Vill besökaren veta mer kan de klicka till / men vi driver dem inte dit.
```

### Vad som INTE ska finnas på variant-sidan
- Ingen meny med alla sidor (enkel header med logotyp + en CTA-knapp)
- Inga andra funktioner (Para, Rasta, Besöka)
- Ingen länk till /funktioner
- Inga testimonials (vi har inga riktiga för Passa än)
- Ingen footer med 15 länkar

---

## Trafikkontroll

### Meta Ads-setup (krävs av Torbjörn för godkännande)

Skapa två ad sets i samma kampanj:
- **Ad set A (Control):** Passa-hook-annons --> destination `/valkommen?utm_source=meta&utm_medium=paid&utm_campaign=passa_test&utm_content=control`
- **Ad set B (Variant):** Samma Passa-hook-annons --> destination `/v/passa?utm_source=meta&utm_medium=paid&utm_campaign=passa_test&utm_content=variant_passa`

Samma annons i båda ad sets. Enda skillnaden är destination-URL. Detta isolerar landningssidans effekt.

**Budget:** 50/50-split. Daglig budget per ad set besluts av Torbjörn (rekommendation: 50 kr/dag per ad set = 100 kr/dag totalt = ca 1 400 kr för 14-dagars test).

**OBS:** Använder INTE A/B-middleware för detta test. Meta styr trafiken via separata ad sets. Middleware-A/B är för organisk trafik.

---

## Feasibility

### Trafikuppskattning

Med 50 kr/dag per ad set och antagande CPC 5-8 kr (baserat på svensk hundmarknad på Meta):
- 6-10 klick per dag per ad set
- 84-140 klick per variant på 14 dagar
- 168-280 totalt

Det är i underkant för 200-per-variant-regeln, men tillräckligt för riktningsbeslut enligt CRO-ramverkets beslutskriterier (100-200 = max 14 dagar, 80% confidence).

**Om trafiken är lägre än väntat:** Öka daglig budget till 75 kr per ad set (max 2 100 kr för hela testet) eller förläng till 21 dagar.

### Teknisk feasibility

| Uppgift | Vem | Uppskattad tid |
|---|---|---|
| Bygga /v/passa-sida | Utvecklingsrådgivaren | 2-4 timmar |
| Skapa Meta ad sets | Growth Manager + Torbjörns godkännande | 1 timme |
| Verifiera tracking | Growth Manager | 30 min |
| Deploya | Push till raquel remote | 10 min |

**Total: en arbetsdag från spec till live.**

### Beroenden
- CB003 (Passa) brief måste vara ifylld -- annonsens copy behöver vara klar
- Passa-screenshot måste finnas (flocken_passa_yasmin.png finns redan)
- Meta ad account måste ha budget tillgänglig

---

## KPI:er och mätning

### Primärt KPI: CTR till App Store
- **Definition:** Andel besökare som klickar på någon App Store-länk på sidan
- **Event:** `cta_click` med `cta_destination = app_store` (befintlig tracking)
- **Mätning:** GA4 via GTM dataLayer

### Sekundärt KPI: Bounce rate
- **Definition:** Andel besökare som lämnar sidan utan interaktion
- **Mätning:** GA4 standard engagement metrics

### Guardrail-mått
- LCP (Lighthouse)
- Organisk konvertering på / och /valkommen (GA4, segmentera på kanal)
- Registreringsrate post-download (GA4 `sign_up` event)

### Segmentering
- `utm_content` = control vs variant_passa
- `platform` = iOS vs Android (via UTM eller GA4 device category)

---

## Tidslinje

| Dag | Aktivitet |
|---|---|
| D0 | Spec godkänd av Torbjörn |
| D1-D2 | Utvecklingsrådgivaren bygger /v/passa |
| D2 | Verifiera tracking i dev |
| D3 | Deploy till produktion |
| D3 | Skapa Meta ad sets (PAUSED) |
| D3 | Torbjörn godkänner ads |
| D4 | Ads ACTIVE -- testet börjar |
| D11 | 7-dagars check: tydlig riktning? |
| D18 | 14-dagars deadline: beslut Ship/Iterate/Kill |

---

## Heat meet-input

| Perspektiv | Agent | Input |
|---|---|---|
| Data | Dataanalytiker | [Att fylla: nuvarande bounce rate på /valkommen från Meta-trafik, CTR till app store] |
| Kreativt | Kreativ producent | [Att fylla: vilken Passa-vinkel är starkast? Trygghet, bekvämlighet, gratis passningsbyte?] |
| Marknad | Partnerskap & Community | [Att fylla: vad säger hundägare i FB-grupper om hundvakter? Vilka ord använder de?] |

---

## Beslutskriterier för detta test

### Ship (implementera hookspecifika sidor för alla hooks)
- CTR till App Store på /v/passa är >20% högre än /valkommen
- Bounce rate är lägre eller oförändrad
- Inga guardrail-problem

### Iterate (testa ny version av hookspecifik sida)
- CTR är högre men <20% skillnad
- Eller bounce rate går upp trots högre CTR
- Formulera ny hypotes: kanske annat sidupplägg, annan hook, annat screenshot

### Kill (behåll /valkommen som standard)
- Ingen mätbar skillnad efter 14 dagar
- Eller negativ guardrail (CTR till app store sjunker)
- Lärdom: generisk sida fungerar lika bra, problemet ligger på annan plats i funneln

---

## Nästa steg om Ship

Om /v/passa är en tydlig vinnare:
1. Bygg /v/besoka, /v/hundar, /v/rasta med samma sidstruktur
2. Skapa hookspecifika Meta ad sets för varje funktion
3. Testa vilken HOOK som konverterar bäst (nytt experiment, EXP002)
4. Överväg att göra /v/[hook] till standard-destination för all betald trafik

---

## Spec för Utvecklingsrådgivaren

### Vad som ska byggas

**Ny route:** `app/v/passa/page.tsx`

**Layout:** Minimal -- ingen standard header/footer. Egen header med:
- Flocken-logotyp (vänsterställd)
- En CTA-knapp (högerställd): "Ladda ner" --> /download

**Komponenter som kan återanvändas:**
- HeroBlock (anpassad: ta bort `launchInfo`/`launchOffer`, lägg till `socialProof`)
- Befintliga CTA-länkar till /download

**Ny funktionalitet:**
- Enkel sidmall utan standard-layout (inga navigation-links, inget footer-länkhav)
- Parametriserbar så att /v/besoka, /v/hundar, /v/rasta kan byggas med samma mall

**Tracking:**
- `page_view` med `page_location` (standard GA4 -- kommer automatiskt)
- `cta_click` med `experiment_id: EXP001`, `variant: passa`, `cta_destination: app_store`
- `utm_content` ska finnas i URL:en och fångas av GA4 automatiskt

**Bilder att använda:**
- Hero: `/assets/flocken/screenshots/flocken_passa_yasmin.png`
- Alt: hand-mockup om tillgänglig

**Copy (första utkast -- Kreativ producent itererar):**
- Hero-rubrik: "Hitta en hundvakt du och din hund är trygga med"
- Hero-underrubrik: "Se hundvakter nära dig, läsa deras profiler och ta kontakt -- direkt i Flocken."
- Argument 1: "Tydliga profiler" / "Se vem hundvakten är, vilka hundar de har erfarenhet av"
- Argument 2: "Kontakt direkt" / "Skriv i chatten istället för att leta i Facebook-grupper"
- Argument 3: "Byt passning gratis" / "Passa varandras hundar utan att det kostar"
- CTA: "Ladda ner Flocken -- gratis"
- Prisinfo: "Gratiskonto utan tidsbegränsning"

---

## Budget

| Post | Kostnad |
|---|---|
| Meta Ads (14 dagar, 100 kr/dag) | 1 400 kr |
| Buffert (om vi behöver öka) | 700 kr |
| **Max totalt** | **2 100 kr** |

Torbjörn: godkänn max 2 100 kr för detta test.

---

## Godkännande

- [ ] Torbjörn godkänner spec
- [ ] Torbjörn godkänner budget (max 2 100 kr)
- [ ] Torbjörn godkänner Meta-annonser före aktivering
- [ ] Heat meet genomförd (Data, Kreativ, Partnerskap)

---

## Ändringslogg

- v1.0 (2026-04-14): Initial spec.

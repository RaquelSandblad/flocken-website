# CRO-ramverk -- Flocken

**Version:** 1.0
**Datum:** 2026-04-14
**Ägare:** Growth & Conversion Manager
**Baserat på:** Conversionista-modellen, anpassad för låg trafik + AI-first exekvering

---

## Varför detta ramverk finns

Flocken har hundratals besök per dag, inte tusentals. Vi har en soloentreprenör med AI-agenter, inte ett CRO-team på fem personer. Det betyder att klassiska A/B-test-ramverk (95% signifikans, stora testmatriser, kvartalslånga tester) inte fungerar. Vi behöver ett ramverk som är lika strukturerat men realistiskt för vår skala.

Kärnprinciperna från Conversionista -- datadrivet, hypotesbaserat, resultatfokuserat -- är intakta. Men beslutsmodellen, testlängden och verktygen är anpassade.

---

## 1. Processen

```
Data/signal --> Problem --> Hypotes --> Prioritering --> Testdesign --> Exekvering --> Analys --> Beslut --> Lärande
     ^                                                                                                       |
     +-------------------------------------------------------------------------------------------------------+
```

### Steg för steg

**1. Data/signal -- Hitta problemet**
Starta alltid med data, aldrig med en idé. Kalla på Dataanalytiker: "var är den största droppen i funneln just nu?" Använd GA4, BigQuery, App Store Connect, RevenueCat. Inga antaganden.

**2. Hypotes -- Formulera strikt**
Varje test kräver en fullständig hypotes (format nedan). Ingen hypotes = inget test.

**3. Prioritering -- ICE-score anpassad**
Scora varje hypotes på Impact (1-5), Confidence (1-5), Ease (1-5). Multiplizera. Gör den med högst score först. Max 3 hypoteser i kö.

**4. Testdesign + Feasibility**
Beräkna trafik per variant. Beräkna realistisk testlängd. Om testet kräver mer än 21 dagar för att nå 150 unika per variant -- testet är för smått eller så behöver vi styra mer trafik.

**5. Exekvering**
Growth Manager specificerar. Utvecklingsrådgivaren bygger. Torbjörn godkänner innan det går live. Max 2 tester parallellt (olika delar av funneln).

**6. Analys -- Beslut inom deadline**
Se beslutskriterier nedan. Varje test får en deadline vid start. Inget test lever utan beslut efter deadline.

**7. Lärande -- Dokumentera och iterera**
Resultat dokumenteras i testloggen. Lärdomarna matar nästa cykel. Saker som funkar skeppas direkt.

---

## 2. Hypotesformat

Alla hypoteser följer detta format. Inga undantag.

```
Since we have observed that: [observation från data -- specifik, med siffror]
We want to: [förändring vi vill göra -- konkret]
For: [målgrupp/segment]
Which should lead to: [förväntad beteendeförändring]
Measured by: [primärt KPI] and [sekundärt KPI]
```

**Exempel:**
```
Since we have observed that: 78% av besökare från Meta-annonser studsar från /valkommen 
  utan att klicka vidare (GA4, mars 2026)
We want to: skapa en hookspecifik landningssida som matchar annonsens Passa-löfte
For: Meta-besökare som klickat på en Passa-annons
Which should lead to: lägre bounce rate och fler klick till App Store
Measured by: CTR till App Store (primärt) and bounce rate (sekundärt)
```

### Guardrails

Varje test ska också definiera guardrails -- mått som INTE får försämras:

- **Primärt guardrail:** sidladdningstid (inga tunga sidor)
- **Sekundärt guardrail:** nedladdningar från organisk trafik (testet får inte störa andras)
- **Tertiärt guardrail:** registreringsrate (fler nedladdningar men färre registreringar = falskt resultat)

---

## 3. Signifikans och beslutsmodell

### Varför inte 95% statistisk signifikans

Vid 200 besök per dag och 50/50-split får varje variant 100 besök/dag. För att nå 95% signifikans på en 20% relativ förbättring krävs ca 3 000 besökare per variant. Det är 30 dagar -- för ett enda test.

Det är för långsamt. Vi har 10 veckor och 100 000 kr.

### Vår beslutsmodell: Pragmatisk bayesiansk approach

**Kärnprincip:** Vi fattar riktningsbeslut, inte vetenskapliga slutsatser.

**Beslutsregler:**

| Trafik per variant | Testlängd | Beslutskriterium |
|---|---|---|
| < 100 | Max 7 dagar | Tydlig riktning (>20% skillnad) eller Kill |
| 100-200 | Max 14 dagar | Riktning på 80% confidence eller tydlig visuell trend |
| 200+ | Max 21 dagar | Hård deadline -- beslut oavsett |

**"80% confidence" i praktiken:**
- Om variant B vinner 7 av 10 dagar -- det är en signal
- Om variant B har 15%+ högre CTR efter 200 besökare -- det är en riktning
- Om du inte kan se skillnad med blotta ögat på en graf -- testet var för litet, Kill och testa större

**Vad vi INTE gör:**
- Väntar på p < 0.05
- Kör tester längre än 21 dagar
- Fortsätter med "intressant, lite till"

### 7-dagars kill rule

Varje test får en check-in efter 7 dagar. Då är frågan binärt:

1. **Ser du en tydlig skillnad?** --> Fortsätt till deadline eller Ship tidigt
2. **Ser du ingen skillnad?** --> Testet var för litet, för liknande eller för fegt. Kill.

Om du måste förklara varför en variant vinner -- den vinner inte tillräckligt tydligt.

---

## 4. Testtyper

### Stora tester (CRO-tester)
- Ny sida, ny design, ny approach
- Helt annan landningssida, ny funnellogik, ny vinkel
- Kräver hypotes, prioritering, deadline
- Max 2 parallellt

### Optimeringar (löpande förbättringar)
- Annan CTA-text, annan rubrik, flytta element
- Gör direkt om logiken är tydlig
- Dokumentera vad du ändrade och varför, men det är INTE ett test
- Ingen hypotes krävs -- det är underhåll

**Att känna igen skillnaden:** Om du kan formulera det som "vi byter från X till Y" är det optimering. Om du kan formulera det som "vi testar om en helt annan approach funkar bättre" är det ett test.

---

## 5. Prioriteringsramverk (ICE)

| Dimension | 1 | 3 | 5 |
|---|---|---|---|
| **Impact** | Smått steg (<5% förändring) | Mätbar effekt (5-20%) | Stor potentiell effekt (>20%) |
| **Confidence** | Gissning | Logisk hypotes | Datadrivet |
| **Ease** | Kräver ny feature/integration | Kräver development-spec | Kan göras med befintliga verktyg |

**Score = I x C x E**

Kör aldrig ett test med Confidence < 3 -- det är gissning, inte hypotes.

---

## 6. Heat meet -- Innan varje nytt test

30 sekunder per perspektiv, inte 2 timmar.

| Fråga | Vem svarar |
|---|---|
| Vad säger siffrorna? | Dataanalytiker |
| Vilka vinklar kan vi testa? | Kreativ producent |
| Vad hör vi från marknaden? | Partnerskap & Community |

Heat meet dokumenteras med en rad per perspektiv i testspecen. Inte i en separat fil.

---

## 7. Beslutskriterier

Varje test landar i ett av tre utfall:

### Ship
- Tydlig riktning (variant slår control på primärt KPI)
- Inga guardrail-problem
- Implementera som standard. Görs direkt.

### Iterate
- Intressant signal men inte övertygande
- Eller: primärt KPI förbättras men guardrail rör sig negativt
- Formulera ny hypotes baserad på insikten. Nytt test.

### Kill
- Ingen effekt efter deadline
- Eller: negativ guardrail utan kompensation på primärt KPI
- Dokumentera lärdomen. Gå vidare till nästa hypotes.

---

## 8. Dokumentation

### Testlogg (per test)

Varje test får en egen fil i `docs/growth/experiments/` med namnkonventionen:
```
EXP[NNN]_[kort_beskrivning].md
```

**Innehåll:**
1. Hypotes (fullständigt format)
2. Testdesign (control vs variant, trafikkälla, KPI:er, guardrails)
3. Tidslinje (startdatum, 7-dagars check, deadline)
4. Heat meet-input (en rad per agent)
5. Resultat (siffror + beslut: Ship/Iterate/Kill)
6. Lärdom (en mening: vad vet vi nu som vi inte visste före?)

### Vad vi INTE dokumenterar
- Process (hur vi satte upp kampanjen, vilka knappar vi tryckte på)
- Spekulationer (vad vi tror hände)
- Mellanresultat utan beslut

---

## 9. Teknisk infrastruktur för tester

### Befintliga verktyg (redan byggda)

Flocken-website har ett fungerande A/B-testramverk:
- **Middleware:** Cookie-baserad variant-tilldelning server-side (`lib/ab-testing/middleware.ts`)
- **Experiment config:** Deklarativ experimentkonfiguration (`lib/ab-testing/experiments.ts`)
- **Tracking:** GA4 + Meta Pixel + GTM dataLayer-integration (`lib/ab-testing/tracking.ts`)
- **Typer:** TypeScript-typer för experiment, variant, assignment (`lib/ab-testing/types.ts`)

### Hur ett nytt test skapas tekniskt

1. Lägg till experiment i `experiments.ts` med `status: 'draft'`
2. Bygg variant-sidan (ny route eller villkorad rendering)
3. Verifiera tracking i dev (`experiment_impression`, `cta_click`)
4. Ändra status till `running` och deploya
5. Verifiera i GA4 Realtime att events kommer in

### Trafikkontroll för Meta Ads-tester

För landningssidestester med Meta-trafik: skapa separata ad sets med olika destination-URL:er.
- Control ad set: `utm_content=control` --> `/valkommen`
- Variant ad set: `utm_content=variant_hookpass` --> `/v/passa`

Använd INTE A/B-middleware för Meta-trafik -- låt Meta-kampanjen styra trafiken.
Middleware-baserad A/B-test är för organisk och direkt trafik.

---

## 10. Riskhantering

### Vad som kan gå fel

| Risk | Hantering |
|---|---|
| För lite trafik för beslut | Hård deadline avgör -- Kill och testa större |
| Falsk positiv (liten skillnad som inte är riktig) | Guardrails fångar sekundära effekter |
| Test påverkar SEO | Testsidor får `noindex` om de är tillfälliga |
| Test påverkar organisk konvertering | Guardrail: mät organisk CR separat |
| Torbjörn har inte tid att godkänna | Max 2 tester = max 2 godkännanden per vecka |

### Vad vi accepterar

Vi accepterar att vi ibland gör fel. Med 80% confidence kommer vi fatta rätt beslut 4 av 5 gånger. Det är bättre än att fatta 1 rätt beslut på dubbla tiden med 95% confidence.

---

## Ändringslogg

- v1.0 (2026-04-14): Initial version. Anpassad från Conversionista-ramverk för låg trafik och AI-first.

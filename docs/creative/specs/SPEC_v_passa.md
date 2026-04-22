# Visuell spec: /v/passa (Flocken -- hitta hundvakt)

**Version:** 1.0
**Datum:** 2026-04-14
**Agare:** Kreativ producent, Spitakolus AB
**Implementeras av:** Utvecklingsradgivaren
**Godkannande kravs av:** Torbjorn Sandblad

---

## A. Referensanalys

### 1. Rover.com (rover.com)

Rover ar den storsta hundvaktsplattformen globalt. Deras landningssida gor tre saker ratt:

- **Sok-i-hero:** Besokaren GOR nagot direkt -- skriver in stad, ser resultat. Det ar inte en informationssida, det ar en handlingssida. Vi kan inte kopiera detta (Flocken ar en app, inte en webbplattform) men principen ar viktig: hero-sektionen ska kanna sig aktiv, inte passiv. Darfor visar vi kartan med hundvakter istallet for en generisk rubrik + bild.
- **Trovardighetssignaler tidigt:** Rover visar "background check", "reviews", "Rover Guarantee" innan besokaren scrollar mycket. Trygghet ar forstaargumentet. Vi foljer samma logik.
- **Minimalt beslutsstod:** Sidan har fa sektioner, varje sektion gor ett jobb. Ingen informationsoverflod.

### 2. Fi (fitracking.com/theapp)

Fi ar inte en hundvaktstjanst men deras appsida ar den basta referensen for hur man presenterar en app-funktion visuellt:

- **Telefonmockup som centralt element:** Appen visas i en realistisk telefonram med skugga. Det gor att besokaren forstar "det har ar en app, sa har ser den ut" utan att behova forklaras.
- **Feature-tabs med visuell vaxling:** Varje funktion har sin egen vy i telefonmockupen. Vi anvander inte tabs pa Passa-sidan (en funktion = en sida) men principen att varje argument har sin egen screenshot applicerar vi.
- **Morkt och premium:** Fi anvander mork bakgrund for premiumkansla. Vi gor inte det (Flocken ar varm, inte premium-dark) men vi tar med oss att kontrast mellan sektioner skapar visuell hierarki. Darfor alternerar vi cream och sand, med olive for CTA-sektionen.

### 3. Wag (wag.co)

Wag ar relevant for sin sifferstrategi:

- **Stora siffror som social proof:** "16M+ services, 1M+ pet parents" visas tidigt. Vi har inte samma skala, men principen fungerar aven i liten skala. "30 hundvakter nara dig" (fran kart-screenshoten) kommunicerar tillgang pa samma satt.
- **Servicegrid med ikoner:** Wags grid ar for komplex for var sida (vi har en funktion) men konceptet att visa tre argument i kortformat med tydliga rubriker tar vi med oss.

### Sammanfattning: vad vi tar fran varje

| Referens | Vad vi tar | Vad vi INTE tar |
|---|---|---|
| Rover | Handlingsorienterad hero (visa kartan), trygghet som forstaarument | Sokfalt i hero (vi ar en app), background check (vi har inte det) |
| Fi | Telefonmockup med skugga, en screenshot per argument | Mork estetik, interaktiva tabs |
| Wag | Siffror som social proof, tre-argument-grid | Tidslinje, for manga tjanstekategorier |

---

## B. Sektionsordning med motivering

Ordningen foljer beslutslogiken: vad ar det har --> ar det nagon for mig --> hur funkar det --> lat mig testa.

| # | Sektion | Syfte | Motivering |
|---|---|---|---|
| 1 | Header (minimal) | Navigation + CTA | Logotyp och en knapp. Inget mer. Besokaren kommer fran en annons och ska inte distraheras. |
| 2 | Hero | Relevans: "det har ar vad annonsen lovade" | Rover visar att hero ska matcha forvantningen. Besokaren klickade pa "hitta hundvakt" -- darfor visar vi hundvakter direkt, inte Flockens fyra funktioner. |
| 3 | Tre argument | Mekanism: "hur funkar det?" | Tre korta block som svarar pa de tre frågorna en hundagare har: Vem ar hundvakterna? Hur tar jag kontakt? Vad kostar det? |
| 4 | Visuellt bevis | Social proof + produktkansla | Hand-mockup-bilden visar appen i anvandning. Det bygger bade trovärdighet och produktforstaelse. |
| 5 | CTA (avslutande) | Handling: "ladda ner nu" | Upprepad CTA med prisinfo. Placerad efter att alla fragor ar besvarade. |

Fem sektioner. Inget mer. Inga testimonials (vi har inga riktiga for Passa). Inga andra funktioner. Inga FAQ. Sidan ska ta under 20 sekunder att skumma igenom pa mobil.

---

## C. Wireframe sektion for sektion

### Sektion 0: Header

**Syfte:** Minimal navigation. Logotyp och en enda CTA.

**Bakgrund:** Transparent (lagger sig over hero-bakgrunden), alternativt vit om transparens skapar kontrastrisk.

**Layout mobil (375px):**
- Vanster: Flocken-logotyp (hojd ca 28px)
- Hoger: CTA-knapp "Ladda ner" i flocken-olive (#6B7A3A), vit text
- Ingen hamburgermeny, inga lankar

**Layout desktop (1280px):**
- Samma som mobil, centrerat i en maxbredd-container (1024px)
- Mer horisontell luft, men samma tva element

---

### Sektion 1: Hero

**Syfte:** Matcha annonsens lofte. Visa att Flocken har hundvakter nara besokaren.

**Bakgrund:** flocken-cream (#F5F1E8)

**Innehall:**
- Rubrik (se avsnitt D for varianter)
- Underrubrik: en mening
- CTA-knapp: "Ladda ner Flocken" i flocken-olive (#6B7A3A)
- Under CTA: textrrad "Gratis att anvanda" i flocken-gray (#A29D89), liten storlek
- Screenshot: `flocken_passa_lista-personer-som-kan-passa.png` i telefonmockup

**Layout mobil (375px):**
- Rubrik och underrubrik centrerade, ovanfor bilden
- Rubrik: 28-32px, flocken-brown (#3E3B32), font-weight bold
- Underrubrik: 16px, flocken-brown, normal vikt
- CTA-knapp: full bredd med 16px horisontell marginal, 48px hojd
- "Gratis att anvanda" centrerad under knappen, 13px
- Telefonmockup centrerad under texten, bredd ca 260px
- Mockupen har rundade horn (20px radius) och elevated-skugga
- Padding: 48px top, 32px bottom

**Layout desktop (1280px):**
- Tva kolumner: text vanster (55%), bild hoger (45%)
- Rubrik: 40-44px
- Underrubrik: 18px
- CTA-knapp: inline, inte full bredd, ca 240px bred
- Telefonmockup hogerst, storlek ca 300px bred, positionerad sa att halva telefonen overlappar sektionens undre kant (skapar djup)
- Vertikal centrering av textblocket relativt bilden

**Varfor just den har bilden:** Lista-screenshoten visar riktiga profiler (Lisa, Chen Wei, Ingrid) med namn, stad, erfarenhet och pris. Det svarar pa den viktigaste fragan: "finns det hundvakter nara mig?". Kartan (karta1.png) hade ocksa fungerat, men listan ar mer lasbar pa en liten skarm i en telefonmockup -- namnen och priserna syns. Rover visar ocksa listformat i sina resultat av samma anledning.

---

### Sektion 2: Tre argument

**Syfte:** Svara pa "hur funkar det?" utan att krova scrollning genom langa stycken.

**Bakgrund:** Vit (#FFFFFF) -- brytar mot cream-hero och skapar tydlig sektionsgrains

**Tre argument med rubrik + brodtext + bild:**

**Argument 1: "Se vem som passar"**
- Bild: `flocken_passa_yasmin.png` i telefonmockup (rundade horn, card-skugga)
- Brodtext om tydliga profiler (se avsnitt D)

**Argument 2: "Hitta nara dig"**
- Bild: `flocken_passa_karta1.png` i telefonmockup (rundade horn, card-skugga)
- Brodtext om geografisk naarhet (se avsnitt D)

**Argument 3: "Boka direkt i appen"**
- Bild: `flocken_screens_passa_agneta-preview.png` i telefonmockup (rundade horn, card-skugga)
- Brodtext om enkel kontakt (se avsnitt D)

**Layout mobil (375px):**
- Vertikalt staplat: rubrik + brodtext + bild, sedan nasta argument
- Rubrik: 22px, flocken-brown (#3E3B32), bold
- Brodtext: 15px, flocken-brown, max 2-3 rader
- Telefonmockup: centrerad, bredd ca 200px, card-skugga
- Avstand mellan argument: 48px
- Padding: 48px top, 48px bottom

**Layout desktop (1280px):**
- Alternerande layout: text vanster + bild hoger, sedan bild vanster + text hoger, sedan text vanster + bild hoger
- Kolumner: 50/50
- Telefonmockup: ca 220px bred
- Rubrik: 28px
- Brodtext: 16px
- Avstand mellan argument: 64px

**Varfor denna ordning:** Profilen (Yasmin) forst for att den svarar pa den mest akuta fragan: "vem ar det som ska passa min hund?". Kartan sedan for att visa att det finns hundvakter nara. Bokning sist for att det ar handlingssteget. Samma logik som Rover: vem --> var --> hur.

---

### Sektion 3: Visuellt bevis (hand-mockup)

**Syfte:** Ge besokaren en kansla av produkten i anvandning. Overgång fran argument till handling.

**Bakgrund:** flocken-olive (#6B7A3A) -- morkt block som bryter visuellt och signalerar "nu ar det allvar"

**Innehall:**
- Kort rubrik i vit text
- Hand-mockup-bilden (`hand-final-hundvakt.png`) centrerad
- Bilden har transparent bakgrund -- handen och telefonen visas direkt mot olive-bakgrunden

**Layout mobil (375px):**
- Rubrik centrerad, vit (#FFFFFF), 22px, bold
- Hand-bilden centrerad under rubriken, bredd ca 280px
- Bilden far inte ha padding under sig -- den ska kanna sig "bottnad" i sektionen, inte flytta
- Padding: 40px top, 0px bottom (bilden gar till kanten)

**Layout desktop (1280px):**
- Tva kolumner: text vanster, hand-bild hoger
- Rubrik: 32px, vit
- Kort brodtext under: 16px, vit med 90% opacity
- Hand-bilden: ca 320px bred, positionerad sa att den overlappar sektionens nedre kant med ca 40px

**Varfor den har bilden:** Hand-mockupen ar den enda bilden i uppsattningen som visar appen i en manniskas hand. Det skapar en annan kansla an rena screenshots -- besokaren ser sig sjalv anvanda appen. Fi anvander samma teknik: telefonmockup i hand for att bygga bro mellan skarm och verklighet.

**Varfor olive-bakgrund:** Brandguiden anger olive for primara CTA-sektioner. Det skapar maximal kontrast mot cream/vit-sektionerna ovanfor. Handen med transparent bakgrund integrerar naturligt mot olivfarg (verifierat: bilden har transparent bakgrund och fungerar mot morka toner).

---

### Sektion 4: Avslutande CTA

**Syfte:** Ge besokaren som scrollat hela sidan en sista mojlighet att agera.

**Bakgrund:** flocken-sand (#E8DCC0) -- varm avslutning, inte samma som hero (cream) och inte samma som argument (vit)

**Innehall:**
- Rubrik: kort, handlingsorienterad
- CTA-knapp: "Ladda ner Flocken" i flocken-olive (#6B7A3A)
- Under knappen: "Gratis att ladda ner. Premium for fler funktioner." i flocken-gray (#A29D89)
- App Store + Google Play-badges (smaa, under CTA-texten, horisontellt centrerade)

**Layout mobil (375px):**
- Allt centrerat
- Rubrik: 24px, flocken-brown, bold
- CTA-knapp: full bredd med 16px marginal, 48px hojd
- Prisinfo: 13px
- Store-badges: 120px breda, med 12px gap
- Padding: 48px top, 48px bottom

**Layout desktop (1280px):**
- Centrerad kolumn, maxbredd 640px
- Rubrik: 32px
- CTA-knapp: 280px bred, centrerad
- Store-badges under

---

### Sektion 5: Minimal footer

**Syfte:** Juridisk minimum. Inte en navigationsyta.

**Bakgrund:** flocken-brown (#3E3B32)

**Innehall:**
- "Spitakolus AB" i vit, 13px
- Lankar: Integritetspolicy | Villkor -- i flocken-gray (#A29D89), 13px
- Inget mer

**Layout:** Centrerat, en rad. Padding: 24px top/bottom.

---

## D. Copy

### Hero-rubrik: tre varianter

**Variant 1 (rekommendation):**
"Hitta en hundvakt du litar pa"

Motivering: Kort, direkt, borjar med det besokaren vill gora. "Litar pa" ar starkare an "ar trygg med" for att det ar mer personligt -- du litar pa nagon, du ar inte trygg med en tjanst.

**Variant 2:**
"Hundvakter nara dig. Med profil, omdomen och kontakt direkt."

Motivering: Mer beskrivande, visar mekanismen. Fungerar om besokaren behover forsta vad Flocken ar. Riskerar att kanna som funktionslista.

**Variant 3:**
"Slipp leta i Facebook-grupper. Hitta hundvakt i Flocken."

Motivering: Kontrast-formatet ("inte X, utan Y") som ar Flockens favoritgrepp. Direkt insikt som hundagare kanns igen i. Risk: kan uppfattas negativt av Facebook-anvandare.

### Hero-underrubrik

"Se hundvakter nara dig, las deras profiler och ta kontakt direkt i appen."

Motivering: En mening som beskriver hela flodet. Inga adjektiv, inga loford, bara vad som hander.

### Argument 1: "Se vem som passar"

Rubrik: "Se vem som passar din hund"

Brodtext: "Varje hundvakt har en profil med bild, beskrivning och erfarenhet. Du ser vem de ar innan du tar kontakt."

Motivering: Svarar pa trygghetsfraagen utan att anvanda ordet "trygg" (brandguiden: "trygghet ska kannas, inte proklameras").

### Argument 2: "Hitta nara dig"

Rubrik: "30 hundvakter nara dig"

Brodtext: "Kartan visar hundvakter i ditt omrade. Valj nagon nara hemmet sa det blir enkelt for bade dig och din hund."

Motivering: Siffran "30" ar konkret (fran kart-screenshoten, Goteborg). Om siffran ar dynamisk ar det annu battre. Om inte: "Hundvakter nara dig" som fallback.

### Argument 3: "Boka direkt"

Rubrik: "Ta kontakt direkt i appen"

Brodtext: "Skriv ett meddelande, bestam datum och lagg in bokningen. Utan att behova ringa eller skriva i en grupp."

Motivering: Avslutar med handlingen. Kontrast mot "skriva i en grupp" forstarker vardet (Flocken-stilen: "inte X, utan Y").

### Sektion 3: Visuellt bevis -- rubrik

"Sa har ser det ut i Flocken"

Motivering: Enkel, ingen overdrift. Bjuder in till att titta pa bilden utan att lova nagot.

Desktop-brodtext (under rubriken): "Blaaddra mellan hundvakter, las profiler och valj den som passar bast."

### Avslutande CTA -- rubrik

"Ladda ner och borja leta"

Motivering: Handlingsorienterad. Ingen "Ar du redo?" eller "Vad vantar du pa?"-klyschighet.

### CTA-knapptext (genomgaende)

"Ladda ner Flocken"

Inte "Ladda ner gratis" (oversaljigt). Inte "Kom igang" (vagt). "Ladda ner Flocken" ar konkret och tydligt.

### Prisinfo (under CTA)

"Gratis att ladda ner. Premium for fler funktioner."

Motivering: Svarar pa prisinvandningen utan att gora det till en grej. Ingen prislista, inga jämforelser.

---

## E. Bildval

### Bild 1: Hero-screenshot

**Fil:** `/assets/flocken/screenshots/flocken_passa_lista-personer-som-kan-passa.png`

**Presentation:** I telefonmockup med rundade horn (20px radius) och elevated-skugga (0 8px 24px rgba(62, 59, 50, 0.16)). Ingen yttre ram.

**Bakgrund:** flocken-cream (#F5F1E8)

**Varfor denna bild:** Listan med hundvakter (Lisa, Chen Wei, Ingrid, Alejandro) ar den mest informationsrika screenshoten. Den visar namn, stad, beskrivning, erfarenhet och pris i ett svep. Det ar Flockens svar pa Rovers sokresultat. Besokaren forstar omedelbart vad appen gor.

**Varfor inte de andra:** Kartan (karta1.png) ar visuellt stark men namnen ar for smaa i en telefonmockup pa mobil. Yasmin-profilen ar bra men visar bara en person -- listan visar utbudet. Favoriter-bilden (personer-favoriter.png) ar for "far in i flodet" -- hero ska visa steg ett, inte steg tre.

### Bild 2: Argument 1

**Fil:** `/assets/flocken/screenshots/flocken_passa_yasmin.png`

**Presentation:** I telefonmockup med rundade horn (20px radius) och card-skugga (0 4px 12px rgba(62, 59, 50, 0.12)). Mindre an hero-mockupen.

**Bakgrund:** Vit (#FFFFFF)

**Varfor denna bild:** Yasmin-profilen visar exakt vad argumentet handlar om: en riktig profil med bild, namn, "Om mig"-text och tillganglighet. Det ar beviset pa "se vem som passar din hund". Bilden visar ocksa en hund i profilbilden, vilket ar perfekt for malgruppen.

### Bild 3: Argument 2

**Fil:** `/assets/flocken/screenshots/flocken_passa_karta1.png`

**Presentation:** I telefonmockup med rundade horn (20px radius) och card-skugga.

**Bakgrund:** Vit (#FFFFFF)

**Varfor denna bild:** Kartan med "30 hundvakter" och namnmarkorerna visar geografisk narhet pa ett satt som ingen text kan. Kartan visar Goteborg -- det ar specifikt och trovärdigt. Fungerar for argument 2 (men inte for hero, dar den ar for detaljrik pa liten yta).

### Bild 4: Argument 3

**Fil:** `/assets/flocken/screenshots/flocken_screens_passa_agneta-preview.png`

**Presentation:** I telefonmockup med rundade horn och card-skugga.

**Bakgrund:** Vit (#FFFFFF)

**Varfor denna bild:** Agneta-preview visar bokningsfldet med datum, antal dagar, meddelande och knappar for "Meddelande" och "Avboka". Det ar beviset pa att kontakt och bokning sker direkt i appen. Bildtexten "Jag skulle vilja lamna kl 9 och hamta kl 17" ar en perfekt igenkannbar vardagssituation.

### Bild 5: Visuellt bevis

**Fil:** `/assets/flocken/quiz-cta/hand-final-hundvakt.png`

**Presentation:** Frilagd (transparent bakgrund), INGEN telefonmockup runt den (bilden ar redan en hand som haller en telefon). Inga extra skuggor -- bilden har sin egen volym.

**Bakgrund:** flocken-olive (#6B7A3A)

**Varfor denna bild:** Det ar den enda bilden som visar appen i en manniskas hand. Den bygger bro mellan screenshots (abstrakta) och verklighet (nagon anvander appen). Fi anvander samma teknik. Handen ar realistisk, telefonen visar Yasmins profil (koppling till argument 1). Transparent bakgrund fungerar utmarkt mot olive enligt brandguidens regler for transparensverifiering.

### Bilder som INTE anvands

**`flocken_passa_personer-favoriter.png`:** Visar favoritlistan med bara tva personer. Det ar en funktion for befintliga anvandare, inte for nagon som aldrig laddat ner appen. Favoriter ar steg tre i flodet -- sidan handlar om steg ett.

---

## F. Vad sidan INTE ska ha

| Uteslutet | Varfor |
|---|---|
| Standardmeny med alla sidor | Besokaren kommer fran en annons. Menylänkar ar flyktvägar som sanker konvertering. Rover och Fi har ocksa minimal navigation pa landningssidor. |
| Andra funktioner (Para, Rasta, Besoka) | Experiment-specen (EXP001) ar tydlig: en funktion per sida. Besokaren klickade pa "hundvakt" -- att visa "hitta hundkompisar" ar en distraktion. |
| Testimonials | Vi har inga riktiga for Passa annu. Paahittade testimonials ar vardelosa och skadar trovärdigheten. Nar vi har riktiga: lagg till dem mellan argument-sektionen och hand-mockupen. |
| FAQ-sektion | Sidan ar for kort for att behoova FAQ. Om kopyn inte besvarar fragan har kopyn misslyckats. |
| Footer med 15 lankar | Juridiskt minimum (integritetspolicy, villkor). Inget mer. Varje lank ar en flyktväg. |
| Animationer och videor | Sidan ska ladda snabbt (LCP under 2 sekunder enligt guardrails). Statiska bilder i optimerade format racker. |
| Prislista for Premium | Det ska sta "Gratis att ladda ner. Premium for fler funktioner." och inget mer. Prisdetaljer hor hemma i appen efter nedladdning. |
| Social proof-siffra i hero ("X hundagare anvander Flocken") | Bara om vi har en trovärdig siffra. "100 hundagare" ser inte imponerande ut. Battre att skippa an att visa ett lagt tal. |
| Illustrerade hundkaraktarer (Coco) | Brandguiden sager att illustrerad stil ar for owned channels dar vi kontrollerar ytan. Landningssidan for betald trafik ska visa appen, inte illustrationer. Screenshots bygger produktforvantning -- illustrationer bygger varumarke. Har prioriterar vi konvertering. |
| Emojis | Aldrig i rubriker eller brodtext (brandguiden). |

---

## Implementeringsanteckningar for utvecklingsradgivaren

- Sidan ska vara en egen route: `app/v/passa/page.tsx`
- Egen layout utan standard header/footer
- Parametriserbar mall sa att /v/besoka, /v/hundar, /v/rasta kan byggas med samma komponent (siddata som prop/config)
- Alla bilder ska anvandas fran `public/assets/flocken/` -- inga nya bilder behovs
- Telefonmockup-effekten (rundade horn + skugga) kan vara CSS: overflow hidden, border-radius 20px, box-shadow elevated
- Tracking: `cta_click` med `experiment_id: EXP001`, `variant: passa`, `cta_destination: app_store`
- CTA-lankar gar till `/download` (befintlig smart redirect till ratt app store)
- Tillganglighet: alla bilder ska ha alt-text som beskriver vad screenshoten visar
- Responstid: LCP under 2 sekunder. Bilderna ska vara optimerade (koor image-processor om nodvandigt)

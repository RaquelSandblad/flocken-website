# Kreativ spec: /v/passa (version 2)

**Version:** 2.0
**Datum:** 2026-04-14
**Ersatter:** SPEC_v_passa.md (v1)
**Agare:** Kreativ producent, Spitakolus AB
**Implementeras av:** Utvecklingsradgivaren
**Godkannande kravs av:** Torbjorn Sandblad (copy + visuellt), PL (pre-deploy checklista)

---

## A. Designvision

Version 1 var korrekt men kanslomassigt tom. Screenshots mot cream-bakgrund, rak informationsstruktur, inget som stannar kvar i kroppen. Den var en produktsida, inte en landningssida.

Version 2 ska kanna sig som att nagon satter sig ner bredvid dig och sager: "Jag vet att det ar jobbigt att hitta nagon du litar pa. Sa har loste jag det." Besokarens forsta reaktion ska vara igenkanning, inte information. Vi oppnar med ett problem de kanner igen, agiterar med det de ar osamera pa, och loser med Flocken.

Visuellt: clay-illustration i hero istallet for screenshot. Sektionskontrast (mork/ljus alternering) istallet for homogen cream. Screenshots inbaddade i kontext (hand, tilted mockup, scen) istallet for raka telefonramar mot ljus bakgrund. Varje sektion ska kunna motivera sin existens med en mening.

---

## B. Referensmonster per sektion

| Sektion | Designpattern | Varfor |
|---|---|---|
| Hero | Fullbredd illustration med gradient-overlay for text | Emotionell ingangspunkt. Screenshot i hero var v1:s storsta svaghet. Illustration skapar kansla, inte funktionsforklaring. |
| Trust strip | Horisontell strip med ikoner + korta fraser, mork bakgrund | Bryter hero visuellt, ger trovardighetssignaler utan att ta plats. Calm och Headspace anvander denna pattern for att signalera kvalitet tidigt. |
| Argument 1-3 | Alternerande text/bild-block med tilted phone mockup | Fi:s feature-blocks ar referensen. Tilt + skugga loser desktop-problemet med smala 9:16-screenshots. Alternerande layout skapar rytm. |
| Social proof | Citatkort i bento-grid mot mork bakgrund | Trovardighetssignaler som kanns manskliga. Namn + stad gor dem lokala. Mork bakgrund skapar kontrast mot ljusa argument-sektioner. |
| Closing CTA | Centrerad sektion med illustration-element och stark CTA | Adresserar sista tvivlet, paaminnerr om vardet, gor handlingen tydlig. |

---

## C. Sektioner

### Sektion 0: Header (sticky)

**Bakgrund:** Transparent (over hero), transitions till vit med soft-skugga vid scroll.

**Layout mobil (375px):**
- Vanster: Flocken-logotyp, hojd 28px
- Hoger: CTA-knapp "Hitta hundvakt" i flocken-olive, vit text, rundade horn (full rounded), padding 8px 16px
- Ingen meny, inga lankar, inga ikoner

**Layout desktop (1280px):**
- Samma innehall, centrerat i maxbredd-container (1120px)
- Logotyp vanster, CTA hoger
- Mer horisontell luft

**CTA-text:** "Hitta hundvakt" (vardedriven, inte "Ladda ner")

**Motivering:** Sticky header med vardedriven CTA ger permanent handlingsmojlighet utan att vara pateträngande. "Hitta hundvakt" ar starkare an "Ladda ner appen" for att det sager vad besokaren far, inte vad de ska gora.

---

### Sektion 1: Hero

**Syfte:** Emotionell igenkanning. Besokaren ska kanna "ja, precis sa ar det" innan de laser en enda funktionsbeskrivning.

**Bakgrund:** Clay-illustration i fullbredd med gradient-overlay fran nederkant (flocken-brown/80 till transparent). Illustrationen fyller 50-70% av viewport-hojden.

**Illustrationsinnehall:** En varm hemscen i clay-stil. Soffa, vardagsrum med svenskt dagsljus. En Cocker Spaniel (Coco) som ligger pa en fillt bredvid en kvinna som ler. Hunden ser trygg och avslappnad ut. Farger i Flockens palett: sand/cream-vaggar, olive-detaljer, varmt ljus.

**Layout mobil (375px):**
- Illustrationen tar hela bredden, hojd ca 55% av viewport
- Gradient-overlay fran nederkant (60% av bildhojden): frocken-brown/80 till transparent
- Text placerad over gradientens morkaste del, nere i bilden
- Rubrik: vit (#FFFFFF), 28-32px, bold
- Under rubrik: en mening, vit, 16px, 90% opacity
- CTA-knapp: vit bakgrund, flocken-olive text, full bredd med 16px marginal, 48px hojd, rundade horn
- Under CTA: social proof-citat (se nedan), vit text, 13px, kursiv
- Padding under CTA till sektionens slut: 32px

**Layout desktop (1280px):**
- Illustrationen tar hela bredden, hojd ca 65vh
- Text och CTA vansterstallda i nedre vanstra kvartalen, over gradienten
- Rubrik: 48-52px, vit, bold, maxbredd 560px
- Under rubrik: 18px, vit, 90% opacity, maxbredd 480px
- CTA-knapp: inline, ca 260px bred, vit bakgrund, flocken-olive text
- Social proof-citat till hoger om CTA (samma rad) eller direkt under

**Social proof under CTA:**
"Jag hittade en hundvakt samma dag" -- Maria, Goteborg

(Dummy-citat. Inte en review, inte en rating. Ett igenkannbart uttalande fran en person med fornamn och stad.)

**Announcement pill (ovanfor rubriken):**
Valfritt: liten pill med `rounded-full border bg-white/20 backdrop-blur-sm px-4 py-1 text-sm text-white`. Text: "Ny i Flocken? Borja har."

**Motivering:** Rover och Wag oppnar med sok-i-hero (handling). Vi kan inte gora det (app, inte webbplattform). Nast basta: kanslomassig igenkanning. Illustration av en trygg situation (hund hos nagon du litar pa) ar starkare an en screenshot som visar en lista med namn. Screenshot sager "sa har ser appen ut". Illustration sager "sa har kan det kanna". PAS-strukturen borjar har med Solution antydd: bilden visar att det gick bra.

---

### Sektion 2: Trust strip

**Syfte:** Snabb trovardighetssignal. Besokaren har sett heorn, nu behovs en bekraftelse innan de scrollar vidare.

**Bakgrund:** flocken-brown (#3E3B32) -- mork strip som bryter mot hero-illustrationen och skapar tydlig sektionsgrans.

**Innehall: tre trust signals med ikon + kort fras:**

1. Ikon: profilbild-ikon. Text: "Verifierade profiler med bild och beskrivning"
2. Ikon: meddelandebubbla-ikon. Text: "Chatta med hundvakten innan du bestammer dig"
3. Ikon: krona/gratis-ikon. Text: "Gratis att borja anvanda"

**Layout mobil (375px):**
- Vertikal stack, varje rad: ikon (24px) + text (14px, vit, 90% opacity) pa samma rad
- Ikon-farg: flocken-accent (#8BA45D)
- Padding: 24px top/bottom
- Avstand mellan rader: 12px

**Layout desktop (1280px):**
- Horisontell rad, tre items med jamt avstand
- Centrerade i maxbredd-container (1120px)
- Ikon + text pa samma rad, items separerade med subtil vertikal divider (flocken-gray/30)
- Padding: 20px top/bottom

**Motivering:** Gemini-analysen identifierade att trust signals saknades i v1. Tre korta fraser, ingen av dem en siffra eller en rating (vi har inte skalat nog for att imponera med tal). "Chatta med hundvakten innan du bestammer dig" adresserar direkt farhagan "vad om jag inte gillar personen?". Mork bakgrund skapar kontrast och gor strippen visuellt distinkt fran bade hero och nasta sektion.

---

### Sektion 3: Argument 1 -- Trygghet (profiler)

**Syfte:** PAS-strukturens Problem-steg. Beskriv vad som ar jobbigt, visa sedan losningen.

**Bakgrund:** flocken-cream (#F5F1E8)

**Visuellt element:**
- Screenshot: `flocken_passa_yasmin.png`
- Presentation: **Floating tilted mockup** -- telefonen roterad 3 grader medurs, elevated-skugga (0 8px 24px rgba(62, 59, 50, 0.16)). Rundade horn (20px radius), overflow hidden.
- Desktop-specifikt: telefonen placeras till hoger, ca 280px bred, med en latt translate-y nedatd (8px) for att ge djup. Tilt + skugga fyller ut den horisontella ytan battre an en rak 9:16-mockup.

**Layout mobil (375px):**
- Text forst, bild under
- Rubrik: 24px, flocken-brown, bold
- Brodtext: 15px, flocken-brown, max 3 rader
- Telefonmockup: centrerad, bredd 220px, tilt 3 grader
- Padding: 56px top, 48px bottom

**Layout desktop (1280px):**
- Tva kolumner: text vanster (55%), bild hoger (45%)
- Rubrik: 32px
- Brodtext: 16px, maxbredd 440px
- Telefonmockup: 280px bred, hogerst, tilt 3 grader, elevated-skugga

**Copy -- rubrik (3 varianter):**

Variant A (rekommendation): "Du ska veta vem som passar din hund"
Motivering: Direkt, personlig. "Du ska veta" ar ett lofte, inte en funktion. Kanns som nagon som forstar.

Variant B: "Inga anonyma hundvakter"
Motivering: Kontrastformat. Kort, skarpt. Risk: kan kanna negativt.

Variant C: "Varje hundvakt har ett ansikte och en berattelse"
Motivering: Varmare, mer berattande. Risk: lite langre an nodvandigt.

**Copy -- brodtext:**
"Varje hundvakt har en profil med bild, egen beskrivning och erfarenhet. Du ser vem de ar och hur de bor innan du tar kontakt. Ingen anonym marknadtsplats."

**Motivering:** Yasmin-screenshoten ar fortfarande ratt val har (liksom i v1) for att den visar en komplett profil. Tilted mockup loser desktop-problemet: rotationen och skuggan ger telefonen volym och fyller ut det horisontella utrymmet som en rak 9:16-bild inte gor. Tregradig tilt ar tillracklig for att ge djup utan att skarminnhallet blir svarlast.

---

### Sektion 4: Argument 2 -- Narhet (karta)

**Syfte:** PAS-strukturens Agitate-steg. "Det finns hundvakter nara dig, du har bara inte sett dem."

**Bakgrund:** Vit (#FFFFFF) -- kontrast mot cream ovanfor

**Visuellt element:**
- Screenshot: `flocken_passa_karta1.png`
- Presentation: **Hand holding phone** -- anvand `hand-final-hundvakt.png` som bas, men med kart-screenshoten istallet. Om vi inte kan byta screenshot i befintlig hand-bild: anvand `hand-real-karta-transparent.png` om den visar Passa-kartan. Alternativt: generera ny hand-mockup via Gemini med kart-screenshot (se avsnitt D).
- Fallback om hand-bild inte fungerar: floating tilted mockup som argument 1, men at andra hallet (moturs 3 grader).

**Layout mobil (375px):**
- Bild forst, text under (omvand ordning fran argument 1 for visuell variation)
- Hand-bilden centrerad, bredd ca 280px, transparent bakgrund
- Rubrik: 24px, flocken-brown, bold
- Brodtext: 15px, maxbredd 320px, centrerad
- Padding: 48px top/bottom

**Layout desktop (1280px):**
- Tva kolumner: bild vanster (45%), text hoger (55%) -- spegelvänt fran argument 1
- Hand-bilden: ca 340px bred, centrerad vertikalt
- Rubrik: 32px
- Brodtext: 16px, maxbredd 440px

**Desktop-specifikt:** Hand-bilden loser 9:16-problemet helt. En hand som haller en telefon ar bredare an en ensam telefon, handen ger kontext, och det kanns naturligt att bilden tar mer horisontell plats. Det ar den mest effektiva losningen for desktop av alla patterns vi overvägt.

**Copy -- rubrik (3 varianter):**

Variant A (rekommendation): "Hundvakter nara dig som du inte visste om"
Motivering: Skapar nyfikenhet. "Som du inte visste om" antyder att losningen redan finns, du har bara inte hittat den.

Variant B: "Se vilka som kan passa i ditt omrade"
Motivering: Rak, konkret. Ingen dramatik, bara funktionalitet.

Variant C: "30 hundvakter i ditt omrade. Pa en karta."
Motivering: Siffra + format. Konkret. Risker: siffran ar specifik for Goteborg och kan kanna fejk om besokaren bor pa en mindre ort.

**Copy -- brodtext:**
"Kartan visar hundvakter nara dig. Tryck pa en profil, las om dem, och ta kontakt direkt. Inga telefonsamtal, inga Facebook-grupper."

**Motivering:** Kartan ar det mest visuellt unika i Flocken. Den kommunicerar narhet battre an text kan. "Inga Facebook-grupper" ar en medveten kontrast-hook som malgruppen kanner igen -- manga letar hundvakt i lokala Facebook-grupper idag.

---

### Sektion 5: Argument 3 -- Enkelhet (bokning/kontakt)

**Syfte:** PAS-strukturens Solution-steg. "Sa enkelt ar det."

**Bakgrund:** flocken-sand (#E8DCC0) -- varmare ton, signalerar att vi narmar oss avslut

**Visuellt element:**
- Screenshot: `flocken_screens_passa_agneta-preview-b.png`
- Presentation: **Multiple mockups overlapping** -- tva telefoner: Agnetas profil i forgrunden (storre, tilt 2 grader), och listan med hundvakter i bakgrunden (mindre, tilt -3 grader, 60% opacity eller latt blur). Z-index stack skapar djup och visar att appen har flera steg, utan att forklara dem i text.
- Sekundar screenshot i bakgrunden: `flocken_passa_lista-personer-som-kan-passa.png`

**Layout mobil (375px):**
- Text forst, bild under
- Overlapping mockups: forgrundsmobil 220px bred, bakgrundsmobil 180px bred med translate-x -30px och translate-y -20px
- Rubrik: 24px, flocken-brown, bold
- Brodtext: 15px, maxbredd 320px
- Padding: 56px top, 48px bottom

**Layout desktop (1280px):**
- Tva kolumner: text vanster (50%), overlapping mockups hoger (50%)
- Forgrundsmobil: 260px bred, bakgrundsmobil: 200px bred
- Mockups hogerst, forgrundsmobilen offset 60px at hoger fran bakgrundsmobilen
- Rubrik: 32px
- Brodtext: 16px, maxbredd 440px

**Desktop-specifikt:** Overlapping mockups loser desktop-breddsproblemet for att tva telefoner tar mer horisontellt utrymme an en, skuggor och overlap skapar visuellt intresse, och besokaren forstar att appen har djup utan att vi forklarar ett flode i text.

**Copy -- rubrik (3 varianter):**

Variant A (rekommendation): "Ta kontakt. Bestam datum. Klart."
Motivering: Tre korta satser som mimar handlingens enkelhet. Ingen oversaljning.

Variant B: "Fran profil till bokning pa tva minuter"
Motivering: Tidspastaende gor det konkret. Risk: kan upplevas som overlofte.

Variant C: "Allt du behover gora ar att skriva ett meddelande"
Motivering: Saker troskel. Skriva ett meddelande ar lagsta mojliga anstrangning. Risk: lite langre an de andra.

**Copy -- brodtext:**
"Valj en hundvakt, skriv ett meddelande och bestam nar det passar. Allt sker i appen, direkt med hundvakten. Inga mellanhander."

**Motivering:** "Inga mellanhander" forstarker vardet -- Flocken ar en direkt kanal, inte en formedlingstjanst. Korta meningar mimar enkelheten i sjalva handlingen.

---

### Sektion 6: Social proof

**Syfte:** Bekraftelse fran andra hundagare. Besokaren har sett produkten, nu behovs mansklig validering.

**Bakgrund:** flocken-brown (#3E3B32) -- mork bakgrund som skapar kontrast och ger citaten tyngd

**Innehall: tre dummy-citat i citatkort:**

Citat 1: "Jag hittade en hundvakt samma dag. Det tog langre tid att bestamma sig for att prova an att faktiskt hitta nagon."
-- Maria, Goteborg

Citat 2: "Att kunna chatta med hundvakten forst gjorde hela skillnaden. Jag behover veta vem som tar hand om Sixten."
-- Jonas, Stockholm

Citat 3: "Vi anvander Flocken varje gang vi aker bort. Enklare an att fraga grannar och vanner."
-- Linda, Malmo

**Layout mobil (375px):**
- Vertikal stack med tre citatkort
- Varje kort: glassmorphism-effekt (bg-white/10, backdrop-blur-md, border border-white/20, rounded-2xl)
- Citat-text: 15px, vit, kursiv
- Namn + stad: 13px, flocken-accent (#8BA45D), inte kursiv
- Padding per kort: 24px
- Avstand mellan kort: 16px
- Sektionspadding: 56px top/bottom
- Liten rubrik ovanfor korten: "Hundagare om Flocken", 13px, flocken-accent, uppercase, letter-spacing 1px

**Layout desktop (1280px):**
- **Bento grid:** tre kort i en rad (grid-cols-3, gap-6)
- Varje kort: glassmorphism som ovan
- Centrerat i maxbredd-container (1120px)
- Samma rubrik ovanfor: centrerad, 14px
- Padding: 64px top/bottom

**Motivering:** Glassmorphism-korten mot mork bakgrund skapar en tydlig visuell paus mellan argument-sektionerna och closing CTA. Citaten ar dummy-text (vi har inga riktiga reviews for Passa annu) men de ar skrivna som verkliga uttalanden: specifika, korta, med en detalj som gor dem trovärdiga ("Sixten", "samma dag", "enklare an att fraga grannar"). Namn + stad gor dem lokala. Tre stader (Goteborg, Stockholm, Malmo) signalerar rikstackning.

**Viktigt:** Markera tydligt i implementeringen att dessa ar dummy-citat. Byt ut mot riktiga sa snart vi har dem.

---

### Sektion 7: Closing CTA

**Syfte:** Adressera sista tvivlet. Ge en sista knuff.

**Bakgrund:** flocken-olive (#6B7A3A) -- starkaste kontrasten, signalerar "nu ar det dags"

**Visuellt element:** Hand-mockup-bilden (`hand-final-hundvakt.png`) som visuellt element. Transparent bakgrund mot olive.

**Layout mobil (375px):**
- Text centrerad
- Rubrik: 24px, vit, bold
- Under rubrik: 15px, vit, 90% opacity
- CTA-knapp: vit bakgrund, flocken-olive text, full bredd med 16px marginal, 48px hojd
- Under CTA: "Gratis att ladda ner. Premium for fler funktioner." i vit/70% opacity, 13px
- App Store + Google Play badges: 120px breda, centrerade, 12px gap
- Hand-bilden: centrerad, bredd 240px, under badges, gar till sektionens nederkant (0 padding bottom)
- Sektions padding-top: 48px

**Layout desktop (1280px):**
- Tva kolumner: text + CTA vanster (55%), hand-bild hoger (45%)
- Rubrik: 36px, vit, bold, maxbredd 480px
- Under rubrik: 16px, vit, 90% opacity
- CTA-knapp: 280px bred, vit bakgrund, flocken-olive text
- Store badges under knappen
- Hand-bilden: 340px bred, bottnad mot sektionens underkant (overflow synligt nedanfor sektionsgrans for att ge djup)

**Copy -- rubrik (3 varianter):**

Variant A (rekommendation): "Osaeker? Borja med att titta"
Motivering: Adresserar tvivlet direkt. "Borja med att titta" ar laagsta mojliga tröskel -- du behover inte boka, inte registrera dig, bara titta.

Variant B: "Ladda ner och se vilka hundvakter som finns nara dig"
Motivering: Mer beskrivande, tydligare vad som hander. Risk: langre, mindre emotionell.

Variant C: "Din hund fortjanar nagon du litar pa"
Motivering: Emotionell avslutning, kopplar tillbaka till hero-temat. Risk: kan kanna for saljig.

**Copy -- under rubrik:**
"Det tar en minut att ladda ner, noll att titta runt. Hitta nagon som passar, nar du ar redo."

**CTA-knapptext:** "Hitta hundvakt nara dig"

**Motivering:** Closing CTA i v1 var "Ladda ner och borja leta" -- funktionellt korrekt men kanslomassigt tomt. "Osaeker? Borja med att titta" mater besokaren dar de ar: de HAR scrollat hela sidan, de ar intresserade men kanske inte overtyade. Att mota tvivlet rakt pa ar starkare an att ignorera det.

---

### Sektion 8: Footer (minimal)

**Bakgrund:** flocken-brown (#3E3B32) -- morkast, signalerar sidslut

**Innehall:**
- "Spitakolus AB" i vit, 13px
- Lankar: Integritetspolicy | Villkor -- i flocken-gray (#A29D89), 13px

**Layout:** Centrerat, en rad. Padding: 24px top/bottom.

---

## D. Bildgenereringsplan (Gemini)

### Bild 1: Hero-illustration (KRITISK -- maste genereras)

**Vad:** En varm hemscen i clay/illustration-stil. Vardagsrum med svenskt dagsljus (mjukt, gyllene). En Cocker Spaniel (rod, Cocos ras) ligger avslappnat pa en fillt i en soffa. Bredvid sitter en kvinna (30-tal) som ler lugnt. Hunden ser trygg ut. Miljon kanner svensk: ljusa vaggar, tra-detaljer, minimalistisk men varm inredning.

**Stil:** Clay-illustration med textur. Inte flat design, inte realistisk 3D. Volym och djup men med en varm, handgjord kansla. Flockens fargpalett: vaggar i cream/sand-ton, detaljer i olive, textilier i warma toner.

**Storlek:** Bred (minst 1920px bred, 1080px hog) for att fungera som fullbredds hero-bakgrund. Ska kunna croppas for mobil (fokus pa hund + kvinna, center-crop).

**Var:** Hero-sektionen (sektion 1), som fullbredds bakgrundsbild.

**Prompt-riktlinje (engelska for Gemini):**
"Warm clay illustration style, cozy Swedish living room, soft golden daylight through window. A red English Cocker Spaniel lying relaxed on a blanket on a light-colored sofa. A woman in her 30s sitting next to the dog, smiling gently. Warm earth tones: cream walls, olive green details, wooden accents. Soft shadows, gentle volume, handcrafted feel. Not photorealistic, not flat design. Warm, grounded, safe atmosphere. Flocken brand colors: cream (#F5F1E8), olive (#6B7A3A), sand (#E8DCC0), brown (#3E3B32)."

**Filnamn:** `flocken_image_coco_passa-hero-hemscen-clay_16x9.png`

### Bild 2: Hand med karta-screenshot (om behov)

**Vad:** Hand som haller telefon med Flocken Passa-kartan synlig pa skarmen. Liknande `hand-final-hundvakt.png` men med kart-vy.

**Kontrollera forst:** `hand-real-karta-transparent.png` -- om den visar Passa-kartan med hundvakter: anvand den direkt, ingen generering behovs.

**Om generering kravs:**
- Stil: Realistisk hand, samma grepp och vinkel som `hand-final-hundvakt.png`
- Screenshot pa skarmen: `flocken_passa_karta1.png`
- Transparent bakgrund (magenta chroma key for borttagning)
- Storlek: minst 800px bred

**Var:** Sektion 4 (argument 2 -- narhet)

**Filnamn:** `flocken_image_passa_hand-karta-transparent_3x4.png`

### Bild 3: Eventuella trust-ikoner

**Vad:** Tre enkla ikoner i Flockens stil: profilbild, meddelandebubbla, kronikon (gratis).

**Kontrollera forst:** Finns det befintliga ikoner i repot? Om ja, anvand dem. Om nej: generera eller anvand Heroicons/Lucide-ikoner i flocken-accent (#8BA45D).

**Preferens:** Standardikoner fran ikonbibliotek (Heroicons) ar foretradda framfor AI-genererade ikoner. Renare, konsekventare.

---

## E. Pre-deploy checklista (specifik for v2)

Utover den generella pre-deploy checklistan (`docs/creative/PRE_DEPLOY_CHECKLIST.md`), verifiera foljande for v2:

### Hero-illustration
- [ ] Illustrationen ar tydligt clay-stil, inte fotorealistisk och inte flat
- [ ] Hunden liknar en rod Cocker Spaniel (Cocos ras), inte en generisk hund
- [ ] Gradient-overlayet ar tillrackligt morkt for att vit text ar lasbar (testa pa mobil i fullt dagsljus)
- [ ] Illustrationen funker bade pa mobil (center-crop) och desktop (fullbredd)
- [ ] Announcement pill (om implementerad) ar lasbar och inte visuellt storande

### Sektionskontrast
- [ ] Varje sektion har tydligt annorlunda bakgrund an grannsektionerna
- [ ] Sekvensen ar: illustration-hero --> mork strip --> cream --> vit --> sand --> mork --> olive --> mork
- [ ] Inga tva angransande sektioner har samma eller snarlik bakgrundsfarg

### Screenshots i desktop
- [ ] Argument 1: telefon ar tiltad, inte rak. Skugga ger djup.
- [ ] Argument 2: hand-bild eller tiltad mockup funkar pa 1280px bredd utan stora tomrum
- [ ] Argument 3: overlapping mockups ser naturliga ut, inte som ett collage
- [ ] Inga 9:16-screenshots visas raka mot ljus bakgrund pa desktop (v1:s problem)

### Social proof
- [ ] Glassmorphism-korten ar lasbara (tillracklig kontrast mot mork bakgrund)
- [ ] Citaten ar tydligt markerade som dummy i koden (kommentar eller data-attribut)
- [ ] Bento-griden ser balanserad ut pa desktop (tre jamnhoga kort)

### Tonalitet
- [ ] Inga emojis i rubriker eller brodtext
- [ ] Inga utropstecken i marknadsforingstext
- [ ] Inga klischeinledningar ("I en varld dar...", "Har du nagonsin...")
- [ ] Inga ord fran forbjudna listan: "viktigast", "utforska", "dialog", "somlös", "plattform", "community"
- [ ] CTA-knappar ar vardedrivna ("Hitta hundvakt nara dig") inte funktionella ("Ladda ner appen")

### Responsivitet
- [ ] Sidan fungerar pa 375px utan horisontell scroll
- [ ] Sidan fungerar pa 1280px utan stora tomrum
- [ ] Sticky header byter fran transparent till vit vid scroll
- [ ] Alla bilder ar optimerade (korde image-processor)

---

## F. Vad som andrats fran v1

| Omrade | v1 | v2 | Varfor |
|---|---|---|---|
| Hero | Screenshot (lista) mot cream | Clay-illustration med gradient-overlay | Emotionell igenkanning > funktionsforklaring |
| Struktur | 5 sektioner, linjart | 9 sektioner, PAS-struktur | Mer utrymme for kansla, trust, social proof |
| Trust | Ingen trust-sektion | Mork trust strip med tre signaler | Gemini-analys: trust signals saknades helt |
| Social proof | Ingen (medvetet val i v1) | Tre dummy-citat med glassmorphism | Citat ar trovardigare an siffror i var skala |
| Screenshot-presentation | Raka telefonmockups mot ljus bakgrund | Tilted mockups, hand-bilder, overlapping | Loser desktop-breddsproblemet, ger djup |
| Bakgrunder | Cream + vit + olive + sand | Mork/ljus alternering med 5+ variationer | Sektionskontrast skapar visuell hierarki |
| CTA-text | "Ladda ner Flocken" | "Hitta hundvakt nara dig" | Vardedriven > funktionell |
| Closing CTA | "Ladda ner och borja leta" | "Osaeker? Borja med att titta" | Adresserar tvivlet istallet for att ignorera det |
| Karaktar | Ingen illustration (medvetet val i v1) | Coco i hero-illustration | Brandguiden: illustrerad stil for owned channels. Landningssida ar owned. |

---

## G. Implementeringsanteckningar for utvecklingsradgivaren

- Sidan: `app/v/passa/page.tsx` (ersatter befintlig v1 om den finns)
- Egen layout utan standard header/footer
- Parametriserbar mall (som v1) sa att /v/besoka, /v/hundar, /v/rasta kan byggas med samma komponent
- Hero-illustration ar en bakgrundsbild, inte en `<img>` -- anvand `bg-cover bg-center` med gradient-overlay via `absolute inset-0 bg-gradient-to-t from-flocken-brown/80 via-flocken-brown/40 to-transparent`
- Tilted mockup: `rotate-3 drop-shadow-2xl` (argument 1), `-rotate-3 drop-shadow-2xl` (argument 2 om fallback)
- Overlapping mockups (argument 3): `relative` parent, forstamobilen `z-10`, andraamobilen `absolute -left-8 -top-5 z-0 opacity-60 blur-[1px]`
- Glassmorphism-kort: `bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6`
- Sticky header: `sticky top-0 z-50 transition-all` -- transparent default, `bg-white shadow-soft` vid scroll (detektera med IntersectionObserver)
- Tracking: `cta_click` med `experiment_id: EXP001`, `variant: passa_v2`, `cta_destination: app_store`
- CTA-lankar till `/download`
- Alla bilder via `public/assets/flocken/` -- kor image-processor for optimering
- Tillganglighet: alt-text pa alla bilder, rubrikhierarki (h1 i hero, h2 per sektion)
- LCP-mal: under 2 sekunder. Hero-illustrationen ska vara optimerad (WebP/AVIF) och preloaded.

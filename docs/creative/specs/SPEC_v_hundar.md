# Kreativ spec: /v/hundar

**Version:** 1.0
**Datum:** 2026-04-21
**Relaterat:** SPEC_v_passa_v2.md (strukturmall), cb004/brief.md, cb004/copy.md
**Ägare:** Kreativ producent, Spitakolus AB
**Implementeras av:** Utvecklingsrådgivaren
**Godkännande krävs av:** Torbjörn Sandblad (copy + visuellt), PL (pre-deploy checklista)

---

## A. Designvision

/v/hundar byggs med samma parametriserade mall som /v/passa (app/v/passa/page.tsx). Grundstruktur, sektionskontrast och komponentbibliotek är identiska. Det som skiljer är copy, bilder och sektionslogik.

Hundar-funktionen har tre separata nyttor (lekkamrat, parning, försvunnen hund) mot Passas en. Det kräver tre argument-sektioner istället för tre varianter av samma argument. Varje sektion äger sin vinkel och ska kunna stå ensam — besökaren som kom via Lekkompisen-annonsen ska inte behöva scrolla förbi parningscopy för att känna sig bekräftad.

Hero-tonen skiljer sig från /v/passa: Passa öppnar med trygghet (hund hos någon du litar på). Hundar öppnar med rörelse och nyfikenhet — det finns hundar nära dig du inte vet om ännu.

---

## B. Referensmönster per sektion

Identiskt med SPEC_v_passa_v2.md avsnitt B — inga avvikelser.

---

## C. Sektioner

### Sektion 0: Header (sticky)

Identisk med /v/passa utom CTA-text.

**CTA-text:** "Se hundar nära dig" (värdedriven, specifik för Hundar-funktionen)

---

### Sektion 1: Hero

**Syfte:** Etablera att det finns hundar nära dig som du inte vet om ännu. Nyfikenhet och igenkänning, inte trygghet (som i Passa).

**Bakgrund:** Clay-illustration i fullbredd med gradient-overlay från nederkant.

**Illustrationsinnehåll:** Välj en av två alternativ baserat på vad som finns tillgängligt:

Alternativ A (föredraget): `Generated Image April 21 - 10_34PM (1).jpg` — tre lera-hundar leker med boll i hundgård med björkar. Energi och igenkänning. Funkar om bilden kan croppas till heroformat (fokus på hundarna i mitten).

Alternativ B: Ny genererad clay-illustration. Prompt-riktlinje: se avsnitt D, Bild 1.

**Layout:** Identisk med /v/passa hero-spec (SPEC_v_passa_v2.md sektion 1). Gradient, textstorlekar, CTA-knapp — samma.

**Copy — rubrik (2 varianter):**

Variant A (rekommendation): "Se hundarna i ditt område."
Motivering: Enkelt. Kartan är Flockens starkaste differentiator. "Se" är ett aktivt löfte. Punkt ger auktoritet utan utropstecken.

Variant B: "Din hund vill ha en kompis. Och det finns en nära dig."
Motivering: Två meningar, tvåstegsmoment. Lite varmare, lite mer berättande. Risk: längre rubrik på mobil.

**Copy — under rubrik:**
"Hitta lekkamrater, parningspartner och aktivera en varning om din hund försvinner."

**Social proof under CTA:**
"Hittade en lekkamrat till Reko på en kvart" — Maja, Göteborg

(Dummy-citat. Specifik detalj — hundens namn — ger trovärdighet.)

**CTA-knapp (hero):** "Se hundar nära dig"

**Announcement pill (valfritt):**
"Gratis att ladda ner"

---

### Sektion 2: Trust strip

**Bakgrund:** flocken-brown (#3E3B32)

**Tre trust signals:**

1. Ikon: karta. Text: "Hundar på karta i realtid — se vilka som finns nära dig"
2. Ikon: filter/sök. Text: "Filtrera på ras, storlek och syfte"
3. Ikon: varningstriangel. Text: "Aktivera försvunnen-varning direkt i appen"

**Layout:** Identisk med /v/passa trust strip-spec.

**Motivering:** Trust strip för Hundar ska kommunicera funktionsbredd — tre separata nyttor ryms i tre korta fraser. Besökaren förstår att Hundar är mer än en funktion.

---

### Sektion 3: Argument 1 — Lekkompisen

**Syfte:** "Det finns hundar nära dig som söker samma sak."

**Bakgrund:** flocken-cream (#F5F1E8)

**Visuellt element:**
- Primärt: `Generated Image April 21 - 10_34PM (1).jpg` — lera-hundar leker (1:1 square, fungerar som floating tilted mockup-alternativ)
- Presentation: Om bilden används som illustration (ej mockup): centrerad, lätt skuggad, rundade hörn (20px). Tilt 2 grader medurs för djup.
- Alternativt: om dev vill ha konsekvent phone mockup-stil — använd karta-bilden (`Generated Image April 20 - 2_29PM.jpg`) i tilted mockup istället.

**Layout mobil:** Text först, bild under. Identisk med /v/passa Arg 1-spec.
**Layout desktop:** Text vänster (55%), bild höger (45%).

**Copy — rubrik:**
"Din hund vill ha kompisar."

**Copy — brödtext:**
"I Flocken ser du hundarna nära dig på kartan — med ras, storlek och om de söker lekkamrat. Tryck på en profil, ta kontakt direkt. Inga Facebook-grupper. Ingen slump."

---

### Sektion 4: Argument 2 — Kenneldynamik

**Syfte:** "Parning utan att gissa var hunden bor."

**Bakgrund:** Vit (#FFFFFF) — kontrast mot cream ovanför.

**Visuellt element:**
- Bild: `Generated Image April 21 - 10_30PM (1).jpg` — hand med mörk hudfärg håller mobil med "Mina favoriter", Sötis pudel "Tillgänglig för parning".
- Presentation: **Hand holding phone** — transparent bakgrund om möjligt, annars cutout. Samma hand-mockup-pattern som /v/passa Arg 2.

**Layout mobil:** Bild först, text under (omvänd ordning från Arg 1 för visuell variation).
**Layout desktop:** Bild vänster (45%), text höger (55%) — spegelvänt från Arg 1.

**Copy — rubrik:**
"Parning utan att gissa var hunden bor."

**Copy — brödtext:**
"Lägg upp din hund som tillgänglig för parning. Andra ser den på kartan sorterat efter avstånd — ras, kön och plats synligt direkt. Inget pirr av privata meddelanden innan du vet om hunden ens finns i rätt landände."

---

### Sektion 5: Argument 3 — Försvunnen hund

**Syfte:** "Om hunden försvinner når du rätt människor direkt."

**Bakgrund:** flocken-sand (#E8DCC0) — varmare, signalerar att vi är på väg mot avslut.

**Visuellt element:**
- Bild: SAKNAS — behöver produceras. Se avsnitt D, Bild 2.
- Fallback under produktion: `Generated Image April 20 - 2_29PM.jpg` (karta med hundikonerna) med text-overlay "Hund försvunnen" som placeholder. Ta bort fallback när riktigt creative är klart.
- Presentation: **Floating tilted mockup** — telefon med varningstriangel på kartan, tilt -3 grader (moturs), elevated-skugga.

**Layout mobil:** Text först, bild under.
**Layout desktop:** Text vänster (55%), bild höger (45%).

**Copy — rubrik:**
"Om hunden försvinner når du rätt människor direkt."

**Copy — brödtext:**
"Tryck 'Hund försvunnen' i appen. Ikonen på kartan ändras till en varning och alla Flocken-användare i närheten ser det omedelbart. Inte dina vänner i fel stad — hundägarna precis runt hörnet."

---

### Sektion 6: Social proof

Identisk struktur med /v/passa sektion 6. Glassmorphism-kort, mörk bakgrund, tre dummy-citat.

**Bakgrund:** flocken-brown (#3E3B32)

**Tre dummy-citat:**

Citat 1: "Hittade en lekkamrat till Reko på en kvart. Hunden bor tre gator bort och vi träffas i parken varje vecka nu."
— Maja, Göteborg

Citat 2: "Missade två löpperioder för att sökningen var så trög. Med Flocken hittade vi rätt hane på en dag."
— Karin, Uppsala

Citat 3: "Hunden sprang sin kos en morgon. Tryckte 'Hund försvunnen' i appen och en granne hittade honom tjugo minuter senare."
— Thomas, Stockholm

**Viktigt:** Markera tydligt i koden att dessa är dummy-citat. Byt ut mot riktiga så snart vi har dem.

---

### Sektion 7: Closing CTA

**Bakgrund:** flocken-olive (#6B7A3A)

**Visuellt element:** `Generated Image April 20 - 2_29PM.jpg` (hand med karta, hundikonerna) mot olive — transparent bakgrund om möjligt.

**Copy — rubrik:**
"Se vilka hundar som finns nära dig."

**Copy — under rubrik:**
"Det tar en minut att ladda ner. Kartan är tillgänglig direkt."

**CTA-knapptext:** "Se hundar nära dig"

**Under CTA:** "Gratis att ladda ner. Premium för fler funktioner."

---

### Sektion 8: Footer (minimal)

Identisk med /v/passa.

---

## D. Bildgenereringsplan

### Bild 1: Hero-illustration (om alternativ A ej fungerar)

**Vad:** Clay-illustration av en hund (eller hundar) i rörelse — inte i vila. Kontrast mot /v/passa som visar en trygg viloscen.

**Prompt-riktlinje (engelska för bildgeneratorn):**
"Warm clay illustration style, outdoor Swedish neighborhood scene. Two dogs playing together in a fenced dog park, birch trees in background, apartment buildings visible behind fence. Energetic but safe atmosphere. Warm earth tones: cream, olive green accents, warm golden light. Soft shadows, gentle volume, handcrafted clay feel. Not photorealistic, not flat design. Flocken brand colors: cream (#F5F1E8), olive (#6B7A3A), sand (#E8DCC0), brown (#3E3B32). Wide format, suitable for full-width hero background."

**Filnamn:** `flocken_image_hundar-hero-dogs-park-clay_16x9.png`

**Storlek:** Minst 1920×1080px.

### Bild 2: Försvunnen hund — creative (KRITISK, saknas)

**Vad:** Hand håller telefon med Flocken Hundar-kartan synlig. En hundikon har bytts mot en varningstriangel. Bakgrundsbelysning något mörkare/blåare än övriga bilder — skapar kontrast utan att dramatisera.

**Stil:** Konsekvent med övriga hand-mockup-bilder i kampanjen. Realistisk hand, neutral bakgrund, tydlig skärm.

**Prompt-riktlinje (engelska):**
"Realistic hand holding a smartphone displaying a map app. The map shows dog location icons, but one icon has changed to an orange warning triangle. Slightly cooler, more neutral background lighting compared to the other images in the series — not dramatic, just a slightly more serious mood. The warning triangle on screen is clearly visible. Clean composition, neutral background, professional photo style. Similar to existing images in the series: hand from same angle, same phone model."

**Filnamn:** `flocken_image_hundar-forsvinnen-hand-mockup_1x1.jpg` (exportera sedan 4:5 och 9:16)

**Alternativ om hand-mockup inte fungerar:** Lera-stil-bild av en hund som tittar ut från ett staket eller en dörr, lite osäker känsla utan drama. Varningsfärg (orange) som accentfärg i bilden.

---

## E. Pre-deploy checklista (/v/hundar-specifik)

Utöver den generella pre-deploy checklistan (`docs/creative/PRE_DEPLOY_CHECKLIST.md`) och /v/passa v2-checklistan:

### Innehåll
- [ ] Tre argument-sektioner live: Lekkompisen, Kenneldynamik, Försvunnen hund
- [ ] Försvunnen hund-creative är det riktiga (inte fallback-bilden)
- [ ] Dummy-citat är markerade i koden
- [ ] Trust strip-ikonerna matchar Hundar-funktionen (karta, filter, varningstriangel)

### Copy
- [ ] Header CTA: "Se hundar nära dig" (inte "Hitta hundvakt")
- [ ] Inget omnämnande av recensionssystem
- [ ] Inget omnämnande av "community"
- [ ] Closing CTA-knapp: "Se hundar nära dig"

### Pixel och tracking
- [ ] LPV-event triggar korrekt på flocken.info/v/hundar
- [ ] `experiment_id: EXP002`, `variant: hundar_v1` i cta_click-event
- [ ] Separata events för App Store vs Google Play

### Hero OG-bild (1.91:1)
- [ ] OG-bild satt i meta-tags (1200×628px)
- [ ] Rekommendation: karta-bilden (`Generated Image April 20`) croppas till 1.91:1
- [ ] Alt-text: "Flocken — se hundarna nära dig på kartan"

---

## F. Implementeringsanteckningar för utvecklingsrådgivaren

- Sida: `app/v/hundar/page.tsx` — bygg med samma parametriserade komponent som /v/passa
- Samma layout utan standard header/footer
- Komponenter att återanvända från /v/passa: StickyHeader, TrustStrip, ArgBlock, QuoteGrid, ClosingCTA, Footer
- Enda strukturella skillnad: tre ArgBlock-komponenter istället för tre varianter av samma argument
- Tracking: `experiment_id: EXP002`, `variant: hundar_v1`
- OG-bild: sätt i `<head>` med korrekt 1200×628px-bild
- Bildoptimering: kör image-processor på alla bilder i v-hundar-mockup-selection som används
- LCP-mål: under 2 sekunder

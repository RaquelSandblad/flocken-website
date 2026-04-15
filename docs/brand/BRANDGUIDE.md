# Flocken — Brandguide
**Version:** 1.0  
**Datum:** 2026-04-14  
**Status:** Aktiv master  
**Äger dokumentet:** Kreativ producent, Spitakolus AB

Detta är den definitiva brandguiden för Flocken. Den ersätter inget befintligt dokument — den binder ihop dem. Alla agenter, designers och producenter som producerar material för Flocken ska börja här.

Om något i den här guiden kolliderar med ett annat dokument i docs/brand/ gäller det här dokumentet. Övriga filer i docs/brand/ är källmaterial som matats in i den här guiden.

---

## 1. Varumärkesidentitet

### Mission
Flocken finns för att göra hundlivet enklare — inte för att vara en plattform, ett community eller ett ekosystem. Konkret: hitta hundvakt, hitta rast-sällskap, hitta hundvänliga ställen, hitta en parningspartner. Det är det.

### Tagline
**Flocken — för ett bättre liv som hund**

Tagline skrivs alltid i den här formen. Inga varianter utan godkännande.

### Varumärkeslöfte
Vi lovar inte resultat. Vi lovar ett bättre verktyg. Det är en viktig distinktion — Flocken är appen som gör det enklare att hitta rätt, men vi garanterar inte parning, inte en perfekt hundvakt och inte att alla ställen är bra. Det bestämmer hundägarna.

### Personlighet
Flocken är en lugn, kunnig hundägare. Inte en expert som föreläser, inte en app som jublar. Varm men vuxen. Jordnära, inte gullig. Nyfiken, inte upprymd.

Tre ord som stämmer: vardagsnära, tryggt, äkta.  
Tre ord som inte stämmer: trendig, lyxig, entusiastisk.

---

## 2. Flocken-familjen

De fyra primära hundkaraktärerna är Flockens visuella ankare. De representerar varsin funktion i appen och ska användas konsekvent i marknadsföring, App Store och webmaterial.

### Varför fyra hundar och inte en
En enda maskothund signalerar att Flocken handlar om en viss ras eller en viss typ av hundägare. Fyra hundar med tydliga personligheter signalerar att Flocken är för alla hundar. Det är strategin.

### De fyra

**Freddy — Besöka**
- Ras: Malteser
- Kön: Hane
- Personlighet: Urban, sällskaplig, nyfiken. Trivs på café, på stan, i kvarteret. Han är hunden som alltid vill se vad som händer runt hörnet.
- Funktion han representerar: Besöka (hundvänliga ställen, caféer, utflyktsmål)
- Typiska scener: Freddy på stan, Freddy på café, Freddy i fönstret
- Fil-identifier: `freddy`
- Befintligt material: Mest producerade karaktären. Ads-serier, stadspromenader, cafébesök.

**Malua — Hundar**
- Ras: Toypudel (röd/aprikos)
- Kön: Tik
- Personlighet: Liten men bestämd. Social med hundar, väljer sina människor. Emotionellt central — Malua är ursprungshunden, den verkliga hunden bakom hela idén med Flocken.
- Funktion hon representerar: Hundar (hitta hundkompisar, profiler, karta — tidigare kallad "Para", nu breddat scope)
- Typiska scener: Malua möter andra hundar, Malua i hundrastgård, Malua och Freddy leker
- Fil-identifier: `malua`
- Befintligt material: Komplett referensserie, series_1. Mest emotionellt värde av alla karaktärer.

**Coco — Passa**
- Ras: Engelsk Cocker Spaniel (röd)
- Kön: Tik
- Personlighet: Lugn, trygg, trivs i hem. Passar perfekt i en barnfamilj, trivs med att ha folk runt sig. Inte äventyrshunden — tillräcklighetshunden.
- Funktion hon representerar: Passa (hundvakt, trygghet, familj)
- Typiska scener: Coco i ett hem, Coco med passaren, Coco i lugna miljöer
- Fil-identifier: `coco`
- Befintligt material: Referensbild finns. Behöver produktionsserier för Passa-kanalen.

**Hasse — Rasta**
- Ras: Jämthund
- Kön: Tik
- Personlighet: Friluftshund, natur, rörelse. Storvuxen, nordlig, representerar den svenska hundvardagen utanför stan. Hasse är hunden som vill långt.
- Funktion hon representerar: Rasta (promenader, natur, motion)
- Typiska scener: Hasse i skog, Hasse på stig, Hasse i vinterlandskap
- Fil-identifier: `hasse`
- Befintligt material: series_6, ads-serier finns.

### Sekundära karaktärer
Castor (Cavapoo, omplacering) och Amelia (Amstaff, omplacering) används situationsanpassat — de aktiveras när innehållet specifikt handlar om omplacering eller att motverka fördomar om "svåra raser". De är inte primära kommunikatörer.

Chico, Ozzy och Arlo är figuranter i gruppscenarion. De ska inte ha egna berättelser.

### Hur karaktärerna används
- En karaktär per funktion. Blanda inte Freddy med Passa-innehåll eller Hasse med Besöka-innehåll.
- Vid generellt Flocken-material (inte funktionsspecifikt): Malua är förstaval, Freddy andraval.
- Karaktärernas raser, färger och proportioner ska följa etablerade referensbilder och promptar. Se `/c/dev/flocken-website/docs/brand/PRODUCTION_PROMPTS.md` när den filen skapas.

---

## 3. Visuell identitet

### Färgpalett

| Namn | Hex | Användning |
|---|---|---|
| flocken-olive | #6B7A3A | Primär CTA, rubriker, aktiva element, kampanjbakgrunder |
| flocken-accent | #8BA45D | Hover states, sekundär grön, tikar i Para |
| flocken-sand | #E8DCC0 | Kortbakgrunder, sektioner, annonsytor |
| flocken-cream | #F5F1E8 | Alternativa bakgrunder, lugnare sektioner |
| flocken-brown | #3E3B32 | Primär text, rubriker |
| flocken-gray | #A29D89 | Sekundär text, ikoner, hanar i Para |
| flocken-warm | #D4C4A8 | Dividers, mörkare sand |
| flocken-error | #C44536 | Fel, favorit-hjärta |
| flocken-male | #5A6631 | Hanar (Para-funktion) |
| flocken-female | #8BA45D | Tikar (Para-funktion) |

**Ton:** Naturlig, varm, jordnära. Aldrig neon, aldrig pastell, aldrig starkt kontrasterande par som inte finns i paletten.

**Opacity-regel:** Text mot ljusa bakgrunder (cream, sand) ska aldrig ha opacity under 80%. Ser subtilt ut i kod, är oläsligt på skärm i dagsljus.

**Skuggor:**
- soft: `0 2px 8px rgba(62, 59, 50, 0.08)`
- card: `0 4px 12px rgba(62, 59, 50, 0.12)`
- elevated: `0 8px 24px rgba(62, 59, 50, 0.16)`

### Typografi
Tailwind CSS-standarder. Inga dekorativa fonter. Inga displayfonter. Flockens ton är inte grafisk — den är textmässig och jordnära.

- Rubriker: flocken-brown (#3E3B32)
- Brödtext: flocken-brown med lätt opacity för läsbarhet
- Sekundär text: flocken-gray (#A29D89)

### Den illustrerade stilen — Flockens visuella signatur

Quiz-thumbnail-stilen (illustrerad, varm, lätt clay-estetik) är Flockens signatursystem i owned channels. Det är inte ett quiz-specifikt undantag. Det är Flockens visuella identitet i sammanhang där vi kontrollerar ytan.

**Vad stilen är:**
- Illustrerade hundar med naturliga proportioner, inte karikatyrer
- Varm färgsättning i Flockens palett (olive, sand, cream, brown)
- Lätt volym och djup — clay-look utan att se plastigt ut
- Händer, päls och bakgrunder har textur, inte blank yta
- Bakgrundsmiljöer är förenklade men igenkänningsbara (park, skog, hem, café)

**Vad stilen inte är:**
- Tecknat i Disney-stil
- Flatdesign utan volym
- Realistisk 3D-rendering
- Sött eller överdrivet söt karaktärsdesign

**Färganpassning för illustrerad stil:**
Alla illustrerade bilder ska använda Flockens palett som bas. Bakgrunder i sand/cream, aktiva element i olive/accent, detaljer i warm/brown. Hundarna behåller sina naturliga raser och färger (Malua aprikos/röd, Freddy vit, Coco rödbrun, Hasse gråvit).

**Stilreferens:** Quiz-thumbnails i `C:\Users\torbj\Desktop\Flocken Media\Quiz thumbnails\`. Framför allt `quiz_hundens_historia_1x1.jpeg` och `quiz_valpar_socialisering_1x1.jpeg`.

### Fotorealistisk stil — betald media

I annonsformat tävlar vi med skarpa foton i ett flöde. Illustrerad stil tappar i den kontexten. Fotorealistiska AI-genererade bilder används i betald media.

**Vad stilen är:**
- Dokumentär fotokänsla, inte reklamfoto
- Mjukt svenskt dagsljus
- Naturliga miljöer (hundrastgård, skog, café, villagata)
- Hundar i naturliga rörelser, inte poserade

**Vad stilen inte är:**
- Glansig päls (AI-look)
- Perfekt symmetriska hundporträtt
- Generiska/amerikanska stadsbilder
- HDR-färger eller övermättnad

För fullständiga promptriktlinjer, se `/c/dev/flocken-website/docs/brand/visual_style.md`.

### Stil per kanal — beslutstabellen

| Kanal | Stil | Motivering |
|---|---|---|
| Betald Meta (feed, stories) | Fotorealistisk | Konkurrerar mot riktiga foton i flödet |
| Betald Google UAC | Fotorealistisk + app-screenshots | UAC kräver variation i format |
| App Store (screenshots, preview) | Illustrerad eller UI + overlay | Flocken äger ytan, bygger identitet |
| Onboarding (i appen) | Illustrerad | Första intrycket ska vara Flockens, inte generisk foto-look |
| Webb (hero, feature blocks) | Illustrerad som primär, fotorealistisk som sekundär | Äger ytan, illustrerad bygger igenkänning |
| Email/push | Illustrerad header per kanal | Snabb igenkänning, ingen konkurrens om uppmärksamhet |
| Organiska sociala medier | Illustrerad + UGC-mix | Bygger ton, inte performance |
| Quiz-thumbnails | Illustrerad (befintlig standard) | Bib-format, igenkänning, konsistens |

### Do / Don't — visuellt

**Gör:**
- Transparenta bakgrunder på hundar som placeras mot Flocken-bakgrunder
- Verifierera att transparensborttagning fungerar mot faktisk kortfärg (olive, sand, cream) — inte mot vit
- Kompakta kort med rätt luft, inte stora ytor med lite innehåll
- Bilder som integreras i kortet, inte klistras ovanpå
- Konsekvent årstid och ljuskaraktär inom en bildserie

**Gör inte:**
- Screenshots utan mockup eller skugga sida vid sida mot ljus bakgrund
- Stor färgyta ovanför bild utan innehåll (banner-effekt)
- Opacity under 80% för text på ljusa bakgrunder
- Rosa eller magenta kanter efter transparensborttagning — verifiera alltid mot rätt bakgrundsfärg
- Blanda årstider inom samma serie

---

## 4. Tonalitet och språk

### Röst
Flocken skriver som en lugn, kunnig hundägare. Inte ett företag, inte en expert, inte en app. En person som vet vad hundlivet innebär och pratar som det.

**Rätt ton:** Vuxen. Varm utan att vara gullig. Jordnära. Ibland lite torr humor, men aldrig på bekostnad av tydlighet.

**Fel ton:** Entusiastisk. Säljig. Corporate. Överdrivet positiv. AI-formulerande.

### Tre principer

**1. Skriv det som behövs, inget mer**
Flocken-text är kortare än den verkar behöva vara. Det är ett medvetet val.

**2. Kontraster fungerar**
"Inte X, utan Y" är ett favoritformat. Det ger precision och undviker vaga formuleringar.
- Rätt: "Inte en social plattform — ett verktyg för hundvardagen."
- Fel: "En plattform som kombinerar social interaktion med praktisk funktionalitet."

**3. Börja med situation eller insikt, inte bakgrund**
Läsaren ska känna igen sig i första meningen. Bakgrunden kan komma efter.
- Rätt: "Det är inte alltid lätt att hitta en hundvakt man verkligen litar på."
- Fel: "Flocken är en app som hjälper hundägare att hitta pålitliga hundvakter."

### Ordval att undvika

Dessa ord är flaggade i Flockens ton av voice och ska aktivt undvikas:
- viktigast
- det brukar
- underlättar (som ensamt ord)
- utforska
- dialog
- sömlös / smidig (när det inte beskriver något konkret)
- plattform (när "app" räcker)
- community (när "hundägare" räcker)
- ekosystem

### Pronomen
- "Du" till hundägaren, alltid.
- "Vi" när avsändaren är teamet bakom Flocken, eller inkluderande ("vi hundägare").
- Undvik "man" när du kan skriva "du".
- Skriv inte om hunden som "den" i onödan — "han", "hon" eller hundens namn fungerar.

### Ton per funktion

**Besöka (Freddy):** Inbjudande och praktiskt. "Här är ett ställe som tar emot hundar" — inte mer, inte mindre.

**Hundar (Malua):** Sakligt, lugnt, respektfullt. Parning är inte dramatiskt. Hundkompisar är inte ett stort projekt. Hjälp användaren hitta rätt utan att ta i.

**Passa (Coco):** Omtänksamt och tryggt. Trygghet ska kännas, inte proklameras. Undvik "säker" och "trygg" som tomma ord — visa det istället.

**Rasta (Hasse):** Vardagsnära, lätt, jordad. Rastning är inte ett event. Det är tisdagen.

### Humor
Torr, igenkänningsbar, aldrig på bekostnad av tydlighet. Humor tillåts i sociala medier. Inte i app-copy eller juridiska texter.

Rätt: "Alla hundar lyssnar inte alltid, hur mycket vi än försöker."  
Fel: "Ditt husdjur har sin egen agenda — och vi är här för det!"

### 22 godkända tonreferenser
Dessa meningar är kanoniserade Flocken-ton. De fungerar som pejling vid tveksamhet.

Se `/c/dev/flocken-website/docs/brand/tone_of_voice.md`, avsnitt 7.

### Do / Don't — text

**Gör:**
- Skriv direkt: "Lägg till en runda som ni gillar så att andra kan hitta den."
- Använd kontraster: "Inte en social plattform. Ett verktyg."
- Börja med situationen, inte produkten

**Gör inte:**
- Emojis i rubriker eller brödtext (tillåtet med måtta i sociala medier)
- Utropstecken i marknadsföringstext
- Klichéinledningar: "I en värld där...", "Har du någonsin...", "Som hundägare vet du..."
- Punkt-listor som ersätter resonemang
- Tankstreck som stilmarkör (det ser AI-genererat ut)
- "Perfekt" ton — det ska kännas mänskligt, inte polerat

---

## 5. Namnkonvention

Gammal namnkonvention är avvecklad. Det här är den nya standarden.

### Grundregler
- Inga svenska specialtecken: aldrig å, ä, ö, é — varken i filnamn eller identifiers
- Gemener överallt
- Understreck som avdelare (aldrig bindestreck i mitten av tokens, bindestreck OK mellan prefix och block)
- Inga mellanslag

### Struktur — filnamn

**Format:**
```
flocken_[typ]_[karaktär-eller-tema]_[beskrivning]_[format].[ext]
```

**Token-lista:**

| Token | Gäller | Värden |
|---|---|---|
| typ | Vad är det? | `image`, `video`, `screenshot`, `thumbnail`, `prompt`, `profile` |
| karaktär | Vilken hund? | `freddy`, `malua`, `coco`, `hasse`, `castor`, `amelia` |
| tema | Funktion eller ämne | `besoka`, `hundar`, `passa`, `rasta`, `quiz`, `ads`, `env` |
| beskrivning | Vad visar bilden? | fri text, gemener, understreck |
| format | Bildformat | `1x1`, `9x16`, `4x5`, `16x9`, `3x2` |

**Exempel:**
```
flocken_image_freddy_besoka-cafe-street_9x16.jpg
flocken_image_malua_hundar-dog-park-autumn_1x1.jpg
flocken_image_hasse_rasta-forest-pre-summer_9x16.jpg
flocken_thumbnail_quiz_hundens-historia_1x1.jpeg
flocken_screenshot_passa_matchning-screen_9x16.png
flocken_prompt_freddy_besoka-cafe.md
flocken_profile_passa_cecilia-agility_3x2.jpeg
```

### Struktur — kampanjer och ads

**Format:**
```
[karaktär-eller-tema]_[hook]_[variant]_[format]
```

**Token-lista:**

| Token | Gäller | Värden |
|---|---|---|
| karaktär/tema | Primär kommunikatör | `freddy`, `malua`, `hasse`, `coco`, `flocken` (generellt) |
| hook | Vilken hook-kategori? | `hk-all`, `hk-besoka`, `hk-hundar`, `hk-passa`, `hk-rasta` |
| variant | Variant inom kampanjen | `v1`, `v2`, `v2b` (lägg aldrig till `v3a` om inte v3 finns) |
| format | Annonsformat | `1x1`, `9x16`, `191x1` |

**Exempel:**
```
freddy_hk-besoka_v1_9x16
malua_hk-hundar_v1_1x1
flocken_hk-all_v2_191x1
```

### Struktur — creative bases

Creative bases namnges alltid med löpnummer. Numret återanvänds aldrig.

```
cb001, cb002, cb003 ...
```

Varje creative base har:
- `brief.md` — idékärna och brief
- `copy.md` — textvarianter
- `assets/` — visuellt material

### Struktur — experiment / A/B-test

**Format:**
```
exp_[feature-eller-sida]_[vad-testas]_[variant]
```

**Exempel:**
```
exp_hero_headline-copy_a
exp_hero_headline-copy_b
exp_appstore-screenshots_order_v1
```

### Vad som aldrig är tillåtet
- Filnamn med mellanslag: `freddy cafe.jpg` — nej
- Filnamn med å, ä, ö: `rasta_skog_höst.jpg` — nej
- Versaler i filnamn
- Datum som prefix (datumet framgår av git-historik eller Finder)
- "final", "final2", "FINAL_ok": det är inte ett versionssystem

---

## 6. Applikation per kanal

### Webb (flocken.info)

**Hero-sektion:** Illustrerad stil med primär karaktär (Malua eller Freddy) mot cream eller sand bakgrund. Text dominerar inte bilden och bilden dominerar inte texten — de väger lika.

**Feature blocks:** Text till vänster eller höger, illustrerad bild på motsatt sida. Inte screenshot utan kontext — antingen mockup med skugga eller illustrerad karaktär.

**App-screenshots i webb-kontext:** Alltid i mockup med rundade hörn och soft-skugga. Aldrig fristående skärmdump mot vit bakgrund.

**Sektionsbakgrunder:** Alternerande vit och sand. Cream för accentblock. Olive för primär CTA-sektion.

### Betald media (Meta, Google)

**Hook-tokens som styr innehållet:**
- `hk-all` — generellt Flocken-värde
- `hk-besoka` — Besöka-funktion
- `hk-hundar` — Hundar/hitta hundkompisar
- `hk-passa` — Passa-funktion
- `hk-rasta` — Rasta-funktion

**Fotorealistisk stil.** Se avsnitt 3.

**Aspect ratios per placering:**
- Feed: 1:1
- Stories/Reels: 9:16
- Link ads: 1.91:1

**Viktigt:** Publicera aldrig betalt material utan Torbjörns godkännande.

### App Store

**Screenshots:** UI + text overlay + primär hundkaraktär per funktion. Freddy för Besöka, Malua för Hundar, Coco för Passa, Hasse för Rasta. Varje screen ska ha en kort värdemening — inte funktionsbeskrivning, utan vad användaren vinner.

**App preview-video:** Visa appen i rörelse, inte en slideshow. Karaktärerna kan introduceras kort i illustrerad stil.

**Stilregel:** App Store är en owned channel. Illustrerad stil är tillåten och föredras för att bygga varumärkesigenkänning mot konkurrenter.

### Sociala medier (organiskt)

**Format:** Illustrerad stil, UGC-stil eller kombinationer. Inte bara annonsmaterial återpublicerat.

**Ton:** Mjuk humor tillåts. Igenkänning framför information. Kortare texter, inte app-copy.

**Emojis:** Tillåtna med måtta. Aldrig i rubriker, aldrig som ersättning för text.

### Quiz-thumbnails

Illustrerad stil, 1:1 och 16:9. Clay-estetik. Flockens palett. Befintliga thumbnails är referens — producera nya i samma system.

**Namnformat:**
```
flocken_thumbnail_quiz_[amne]_[format].[ext]
flocken_thumbnail_quiz_kroppssprak_1x1.jpeg
```

### Email och push-notiser

Det finns inget material här ännu. Nästa produktion ska täcka:
- En header-bild per funktion (Besöka, Hundar, Passa, Rasta) i illustrerad stil
- Karaktären som representerar funktionen syns i headern
- Bakgrundsfärg: cream eller sand
- Text ovanpå: olive, aldrig under 80% opacity

---

## 7. Produktion — AI-first pipeline

### Grundprincip
Flocken producerar bilder med AI som primärt verktyg. Det är inte ett kompromissval — det är ett medvetet beslut. Kvaliteten på AI-genererat material är tillräcklig, och produktionshastigheten är överlägsen.

### Verktyg
- **Gemini (Google AI Studio / Vertex):** Primärt verktyg för all bildgenerering. Modell: `gemini-2.5-flash-image` (image-to-image). API-nyckel: Windows env var `GEMINI_API_KEY`.
- **Nano Banana:** System-settings för karaktärskontinuitet (identity consistency). Används för att hålla Freddy som Freddy och Malua som Malua mellan genererade bilder.
- **CapCut:** Videokompilering och enkla animationer.

### Workflow — bildproduktion

1. Bestäm kanal och format (se beslutstabellen i avsnitt 3)
2. Välj karaktär baserat på funktion (se avsnitt 2)
3. Välj stil: illustrerad eller fotorealistisk
4. Applicera rätt promptmodul:
   - Karaktär-prompt (från promptbibliotek)
   - Miljöprompt per årstid (se visual_style.md, avsnitt 10)
   - Anti-AI-prompt (se visual_style.md, avsnitt 9)
5. Generera i rätt aspect ratio direkt om möjligt, annars croppa
6. QA — se nedan
7. Namnge enligt konventionen i avsnitt 5
8. Placera i `public/assets/flocken/_originals/`
9. Kör `node scripts/image-processor-flocken.js process-all`
10. Använd från `generated/`-mappen

### QA-checklista för AI-bilder

En bild godkänns om den klarar alla punkter:

- Karaktären ser ut som karaktären (rätt ras, rätt färg, rätt proportioner)
- Päls är inte glansig eller plastisk
- Inga upprepade mönster i kläder eller objekt
- Årstid och ljus är konsekventa genom hela bilden
- Bakgrunden ser svensk ut, inte amerikansk eller generisk
- Om transparent bakgrund: verifiera mot olive, sand och cream — inte mot vit
- Inga synliga AI-artefakter (extra tassar, felplacerade öron, dubbla skuggor)
- Bilden hade kunnat vara ett foto — det är ribban

Bilder som inte klarar QA ska inte sparas. Generera om.

### Batch-produktion
Producera inte en bild åt gången. Producera en hel serie på en session:
- 5 bilder = en kanal-serie för en karaktär
- 3 format per bild om det behövs (1:1, 9:16, 4:5)
- Dokumentera prompten som producerade bra resultat i `docs/brand/` eller `flocken_ads/creative_bases/cbXXX/`

### Promptbibliotek
Promptar för Freddy, Malua, Hasse och Coco finns i:
```
C:\Users\torbj\Desktop\Flocken Media\Hundmodeller\
```

Dessa ska migreras till repot. Tills dess: håll Flocken Media-mappen som arbetsyta för promptar.

---

## Referensdokument

| Dokument | Plats | Vad det innehåller |
|---|---|---|
| tone_of_voice.md | docs/brand/ | 22 tonexempel, grundprinciper, per-funktions-ton |
| visual_style.md | docs/brand/ | Bildtonalitet, AI-riktlinjer, årstidspromptmoduler |
| color_system.md | docs/brand/ | Färgpalett med CSS-variabler |
| value_proposition.md | docs/brand/ | Vad Flocken erbjuder och till vem |
| DESIGN_REFERENCES.md | docs/creative/ | Designprinciper, feedback-logg, do/don't med exempel |
| BRAND_AUDIT.md | docs/brand/ | Fullständig inventering av befintligt material, styrkor, svagheter |
| IMAGE_GENERATION.md | docs/creative/ | Gemini-workflow, teknisk setup |
| personas/ | docs/brand/personas/ | Anders, Jonas, Marco, Anna — strukturella briefs |

---

## Dokumenthantering

**Master:** Det här dokumentet och alla filer i `docs/brand/` i flocken-website-repot är master.

**Arbetsyta:** `C:\Users\torbj\Desktop\Flocken Media\` är produktionsarbetsyta och bildarkiv — inte master för text eller riktlinjer.

**Vid konflikt:** Om en fil i Flocken Media-mappen och en fil i docs/brand/ säger olika saker gäller docs/brand/-versionen. Uppdatera Flocken Media-versionen eller arkivera den.

**Uppdateringar av den här guiden:** Kreativ producent äger dokumentet. Uppdateras när Torbjörn fattar beslut som påverkar visuell stil, karaktärer, tonalitet eller namnkonvention. Datum och version uppdateras vid varje revision.

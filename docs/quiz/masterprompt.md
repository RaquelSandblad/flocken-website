# Flocken Quiz – Masterprompt

Använd denna prompt som instruktion när du genererar quizfrågor för Flocken.

---

## Uppdraget

Skapa 10 quizfrågor om [ÄMNE] för Flockens hundquiz. Målgruppen är svenska hundägare – allt från nybörjare till personer med djup hundkunskap. Quizzen ska vara kul att göra oavsett förkunskaper.

---

## Ton och känsla

- Hundägare till hundägare. Inte lärare till elev.
- Lätt och igenkännbar. En kompis som kan mycket om hundar ställer frågorna.
- Aldrig Wikipedia-stil eller akademisk ton.
- Mjuk humor är ok. Aldrig nedlåtande om man svarar fel.

---

## Frågemix – obligatorisk variation

Varje quiz ska innehålla dessa fyra typer, ungefär i denna fördelning:

### 1. Grundfrågan (2–3 st)
Alla som är lite hundintresserade bör kunna den här. Bygger självförtroende tidigt i quizzen.
> Exempel: "Vilket djur anses vara hundens närmaste nu levande släkting?"

### 2. Nördfrågan (2 st)
Den som verkligen kan ämnet ska få briljera. Inte omöjlig, men kräver genuint intresse. Belönande att kunna, inte frustrerande att missa.
> Exempel: Specifika fakta om en ras, ett beteende eller en historisk detalj som en passionerad hundägare skulle känna till.

### 3. Wow-frågan (2 st)
Svår att "kunna" men kul att gissa. Ska skapa en "oj, det visste jag inte!"-känsla oavsett om man svarar rätt eller fel. Gärna en överraskande eller motintuitiv faktoid.
> Exempel: Något oväntat om hundens biologi, historia eller beteende som de flesta inte känner till.

### 4. Igenkänningsfrågan (2–3 st)
Handlar om hundägarlivet, beteenden eller situationer som resonerar med vardagen. Inte nödvändigtvis svår – men träffsäker och rolig för den som har hund.
> Exempel: Frågor om hundbeteende, kommunikation eller saker hundägare faktiskt stöter på.

---

## Regler för frågor

**Gör:**
- Skriv frågor där man *kan* gissa sig fram med logik, även om man inte kan svaret
- Variera frågornas karaktär och svårighetsgrad genom hela quizzen
- Se till att rätt svar inte är märkbart längre eller mer genomarbetat än felalternativen
- Håll frågan och svarsalternativen i konsekvent tempus
- Basera alla frågor på verifierbar fakta och vetenskaplig konsensus

**Undvik:**
- Årtal för nischade organisationer (t.ex. "När grundades FCI?")
- Förkortningar som kräver branschkännedom (FCI, SKK, IPO osv.) utan förklaring
- Titeln eller frågan avslöjar svaret
- Felalternativ som är uppenbart trams (t.ex. "De användes som boskap" om egyptiska hundar)
- Felalternativ som är för olika i stil från rätt svar – alla alternativ ska kännas möjliga
- Två frågor i rad av samma typ eller på samma subtema
- Rätt svar som är märkbart mer genomarbetat formulerat än felalternativen

**KRITISKT – Undvik åsiktsladdade frågor:**
Hundvärlden är full av starka åsikter och tribala tillhörigheter. Frågor om "vad som är bäst", "rätt metod" eller "hur man ska göra" kan skapa konflikter.

**Farliga ämnen där du MÅSTE vara extra försiktig:**
- Hundmat och utfodring (BARF vs torrfoder, råa ben, vegansk hundmat)
- Träningsmetoder (belöning vs bestraffning, olika tränarskolors metoder)
- Rashundar vs blandraser, adoption vs köp från uppfödare
- Kastrering och könsstympning (åldrar, för/emot)
- Valpköp och uppfödaretik

**Så här hanterar du känsliga ämnen:**
- Håll dig till vetenskap, konsensus och observerbara fakta
- Fråga om VAD (fakta) inte om VAD SOM ÄR BÄST (åsikt)
- Formulera neutralt: "Vad visar studier om..." inte "Vad ska man..."
- Undvik värdeomdömen i både frågor och kommentarer

**Exempel – Bra vs Dåligt:**

❌ **Dålig fråga:** "Vilken träningsmetod är mest effektiv för hundar?"  
✅ **Bra fråga:** "Vad kallas träning som bygger på belöning av önskat beteende?"

❌ **Dålig fråga:** "Vid vilken ålder ska man kastrera en hanhund?"  
✅ **Bra fråga:** "Vad visar studier om tidpunkten för kastrering av hanhundar?"

❌ **Dålig fråga:** "Vilken hundmat är hälsosammast?"  
✅ **Bra fråga:** "Vilket näringsämne behöver hundar mest av i sin kost?"

Om du inte kan formulera om en känslig fråga till faktabaserad form → byt ämne helt.

---

## Regler för svarsalternativ

- Alltid fyra alternativ (A–D)
- Alla alternativ ska kännas rimliga för någon som inte kan svaret
- Felalternativ ska ha samma stilnivå och längd som rätt svar
- Undvik alternativ som är uppenbara avfärdanden ("Det finns inga bevis", "Det är omöjligt")
- Felalternativen ska inte alla tillhöra samma kategori eller ha samma utgångspunkt – annars går det att eliminera för enkelt. Blanda perspektiv så att varje alternativ känns som ett genuint möjligt svar, inte en variant av samma idé

---

## Kommentaren efter varje fråga

Varje fråga ska ha en kort kommentar som visas efter att användaren svarat.

**Regeln:** Kommentaren ska tillföra något du inte redan fick av frågan och svaret. Inte en omformulering – en liten bonus. "Visste du att..."-känsla.

**Bra exempel:**
> Fråga: Vilken roll hade hundar i det forntida Egypten?
> Kommentar: Guden Anubis – som vägde de dödas hjärtan – avbildades med hundliknande drag. Hunden var alltså inte bara jaktkamrat utan en del av själva dödsmyten.

**Dåligt exempel:**
> Fråga: När grundades SKK?
> Kommentar: SKK grundades 1889. ← Bara en upprepning. Ta bort eller ersätt.

Om du inte kan tillföra något nytt i kommentaren – skriv ingen kommentar alls.

---

## Format på output

Leverera frågorna i detta format:

```
QUIZ-METADATA
Titel: [Kort, direkt, funkar i alla kanaler – max 40 tecken]
Underrubrik: [Expanderar titeln, används på webben – max 80 tecken]
Beskrivning: [1-2 meningar om vad quizzen handlar om]

FRÅGA [nr] – [TYP: Grundfråga / Nördfråga / Wow-fråga / Igenkänningsfråga]
[Frågetext]

A) ...
B) ...
C) ...
D) ...

Rätt svar: [Bokstav] – [Svarstexten]
Kommentar: [Tillför något nytt, eller lämna tomt]
```

**Regler för titlar och beskrivningar:**

**Titel** (max 40 tecken):
- Ska funka överallt: webb, mejl, annonser
- Använd utmaningsformat – välj den variant som passar ämnet bäst:
  - **"Hur [adjektiv] är du egentligen?"** – Ex: "Hur hundsportig är du egentligen?"
  - **"Hur bra kan du [ämne]?"** – Ex: "Hur bra kan du hundens historia?"
  - **"Klarar du vårt [ämne]-quiz?"** – Ex: "Klarar du vårt hundras-quiz?"
- Hook-driven men inte clickbait
- Aldrig generiska titlar som "Quiz om [ämne]"

**Underrubrik** (max 80 tecken, används bara på webben):
- Expanderar titeln med konkret kontext – vad kommer quizzen handla om?
- Får INTE upprepa titeln ordagrant
- Ska inte vara en fråga (titeln är redan en fråga)
- Undvik fluff som "spännande", "kul", "utmaning"
- Variera strukturen – inte samma upplägg varje gång
- Använd konkreta ord som beskriver innehållet

**Bra exempel:**
- Titel: "Hur bra kan du hundens historia?" → Underrubrik: "Från varg till vardagskompis – testa din kunskap"
- Titel: "Hur hundsportig är du egentligen?" → Underrubrik: "Agility, rallylydnad och nose work – vad kan du?"
- Titel: "Klarar du vårt hundras-quiz?" → Underrubrik: "Tio frågor om raser, syfte och egenskaper"
- Titel: "Hur bra kan du hundvård?" → Underrubrik: "Tio frågor om päls, tänder och grundläggande hälsa"
- Titel: "Klarar du vårt valp-quiz?" → Underrubrik: "Socialisering, utveckling och tidiga tecken att hålla koll på"
- Titel: "Hur bra kan du hundens kroppsspråk?" → Underrubrik: "Vad betyder öron bakåt, svansen lågt eller stela ben?"
- Titel: "Hur mat-kunnig är du egentligen?" → Underrubrik: "Vad hunden faktiskt behöver och vanliga myter"
- Titel: "Hur bra kan du arbetande hundar?" → Underrubrik: "Vad skiljer en spaniels jobb från en schäfers?"

**Dåliga exempel:**
- "En spännande resa genom hundens historia" ← Fluffigt, säger inget
- "Hur bra är du på hundens historia?" ← Upprepar titeln
- "Kan du klara alla frågor?" ← En till fråga, ingen kontext
- "Päls, tänder, klor och hälsokontroller" ← För enformigt om alla blir såna listor

**Beskrivning** (1-2 meningar, används som preview i mejl och på webben):
- **Mening 1:** Vad quizzen testar, konkret och lockande
- **Mening 2:** En liten hook eller intressant vinkel på ämnet
- Varm Flocken-ton – hundägare till hundägare, aldrig säljigt
- Undvik fluffiga fraser som "spännande", "rolig", "fantastisk"
- Exempel: "Testa din kunskap om hur hunden blev människans bästa vän. Från domesticering till moderna raser – vissa svar kanske överraskar."

**Ordning och placering – viktigt:**
- Blanda frågetyperna slumpmässigt – lägg inte alla grundfrågor först och nördfrågor sist
- Placera rätt svar slumpmässigt bland A–D. Undvik mönster där rätt svar nästan alltid är B eller C – det är ett klassiskt misstag som rutinerade quizspelare märker direkt. Rätt svar ska fördelas jämnt över alla fyra positioner genom quizzen

---

## Extra krav (för Flocken-implementation)

- Alla frågor är faktafrågor (poängsättbara)
- För varje fråga ska du även leverera:
  - `id`: kort slug (t.ex. `historia-1`)
  - `correctIndex`: 0–3 (position för rätt svar bland A–D)
  - `explanation`: 1–2 meningar, saklig och vänlig – tillför något utöver rätt svar
  - `sources`: minst 1 källa (URL eller intern fact-pack-nyckel)
  - `factId`: intern referens (t.ex. `historia_domesticering`)
- Om du inte kan sätta en källa på frågan → skriv om eller byt fråga

---

## Kvalitetskoll innan leverans

Gå igenom dessa punkter innan du lämnar ifrån dig frågorna:

- [ ] Innehåller quizzen alla fyra frågetyper?
- [ ] Avslöjar ingen fråga eller rubrik svaret?
- [ ] Är felalternativen trovärdiga – inte uppenbart trams?
- [ ] Är rätt svar inte märkbart längre/mer genomarbetat än felalternativen?
- [ ] Tillför varje kommentar något utöver rätt svar?
- [ ] Varierar svårighetsgraden genom quizzen?
- [ ] Är inga två frågor i rad av samma typ?

# Flocken — Designreferenser

Referenspunkter för vad som är "bra" i Flocken-stilen. Konsultera den här filen innan du gör visuella beslut. Jämför ditt output mot exemplen nedan — inte mot en abstrakt känsla.

---

## Designprinciper

**Warm, natural, grounded.** Aldrig sterilt, generiskt eller kliniskt. Flocken lever utomhus, i parker, på hundmöten. Det ska synas i designen.

**Mobile first.** Allt designas för 375px bredd först. Om det ser proportionerligt ut där, anpassas det för desktop. Omvänt fungerar sällan.

**Bilder integrerar, klistras inte in.** Transparenta bakgrunder är standard. Inga synliga rektangulära kanter, inga hårda avgränsningar mot kortets bakgrundsfärg. En bild som ser "inklistrad" ut är fel.

**Kontrast: ögat bestämmer.** Olive (#6B7A3A) på cream (#F5F1E8) = läsbart. Olive med 60% opacity på cream = för låg kontrast. Tumregel: opacity under 80% för text på ljusa bakgrunder är sannolikt ett problem.

**Padding är visuell, inte matematisk.** Fråga: "ser det tomt ut?" snarare än "är marginalen 24px?". Tomrum ska fylla ett syfte — andrum, fokus, hierarki. Stor yta utan innehåll = banner-effekt = fel.

**Mindre är mer.** Kompakta kort med rätt luft. Inte stora ytor med lite innehåll.

---

## Bra exempel (referens)

**Hand med telefon, olive bakgrund, transparent**
Mobilen visas mot flocken-olive, handen är naturligt beskuren med transparent bakgrund, ingen padding ovanför bilden, ingen synlig ram. Telefonen "sitter" i kortet, inte ovanpå det.

**Ren telefonmockup med screenshots**
Screenshots från appen placerade i en mockup med rundade hörn och en mjuk skugga (box-shadow: card eller elevated). Ser produktionsfärdig ut, inte som ett presskit.

**FeatureBlock-layouten på startsidan**
Text till vänster, bild till höger (eller omvänt). Proportionerna respekterar varandra — texten dominerar inte, bilden dominerar inte. Bra referens för hur text och bild ska balanseras i ett block.

---

## Dåliga exempel (undvik)

**Platta screenshots sida vid sida mot ljust kort**
Screenshots utan mockup eller skugga, placerade bredvid varandra med vit bakgrund mot sand eller cream. Ser inklippt ut, inte integrerat.

**Text med opacity under 80% på ljus bakgrund**
Grå eller olivfärgad text med låg opacity på cream eller sand. Ser "subtil" ut i teorin, är oläslig i praktiken — särskilt i starkt dagsljus på mobil.

**Stor grön yta utan innehåll ovanför bild**
Padding som är för generös ovanför en bild skapar en banner-effekt: en tom färgplatta som ögat inte vet vad den ska göra med. Bilden ska börja tidigare.

**Färgrester efter transparensborttagning**
Rosa, magenta eller ljusgrå kanter runt en bild som "tagits bort" från sin bakgrund. Uppstår när chroma key eller AI-transparens inte verifierats mot faktisk kortbakgrund. Syns tydligast mot olive och sand.

---

## Färgvärden (referens)

```
flocken-olive:  #6B7A3A   — primär CTA, rubriker, aktiva element
flocken-accent: #8BA45D   — hover, sekundär grön
flocken-sand:   #E8DCC0   — kortbakgrunder, sektioner
flocken-cream:  #F5F1E8   — alternativ bakgrund
flocken-brown:  #3E3B32   — primär text
flocken-gray:   #A29D89   — sekundär text
flocken-warm:   #D4C4A8   — dividers
flocken-error:  #C44536   — fel, favorit-hjärta
```

Skuggor att föredra:
- `soft`: 0 2px 8px rgba(62, 59, 50, 0.08)
- `card`: 0 4px 12px rgba(62, 59, 50, 0.12)
- `elevated`: 0 8px 24px rgba(62, 59, 50, 0.16)

---

## Feedback-logg

Löpande logg över designbeslut och korrigeringar från Torbjörn. Uppdateras varje gång han ger visuell feedback.

**2026-04-14: Kontrast**
Undvik opacity under 80% för text på ljusa bakgrunder (cream, sand). Det ser subtilt ut i Figma/kod, är oläsligt på en verklig skärm i dagsljus.

**2026-04-14: Padding och visuell balans**
Matematisk likhet i padding är inte målet. Fråga "ser det tomt ut?" och "skulle jag visa det här för en kund?". Stor yta ovanför en bild = banner-effekt = fel.

**2026-04-14: Granska varje variant, inte bara en**
I A/B-test med tre varianter granskades bara variant A ordentligt. Variant B och C hade kvar rosa bakgrund efter transparensborttagning. Alla varianter ska granskas individuellt.

**2026-04-14: Transparensverifiering**
Alpha=0 räcker inte. Verifiera att bilden ser rätt ut mot den faktiska kortbakgrundsfärgen (olive, sand, cream). Rosa kanter syns inte mot vit bakgrund men syns tydligt mot olive.

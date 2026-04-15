# Pre-deploy visuell checklista

Obligatorisk innan varje visuell deploy. Gäller alla agenter som gör ändringar i komponenter, bilder eller layout.

Gå igenom punkterna i ordning. Om du svarar "nej" eller "osäkert" på någon punkt — åtgärda innan du commitar.

---

## 1. Alla varianter granskade

- [ ] Om A/B-test eller flera varianter finns: har du granskat var och en individuellt?
- [ ] Inte bara variant A. Alla.

## 2. Mobil (375px)

- [ ] Ser kortet/sektionen proportionerligt ut?
- [ ] Finns det onödigt tomrum (ovanför bilder, under rubriker)?
- [ ] Är text läsbar utan att zooma?
- [ ] Scrollar det naturligt?

## 3. Desktop (1280px)

- [ ] Håller layouten ihop?
- [ ] Är text-bild-balansen rätt? (inget dominerar onödigt)
- [ ] Är padding och gap visuellt rimliga på stor skärm?

## 4. Bildgranskning

- [ ] Transparens: finns det färgrester (rosa, magenta, ljusgrått) mot kortets bakgrundsfärg?
- [ ] Verifiera transparens mot faktisk bakgrund (olive, sand, cream) — inte bara mot vitt
- [ ] Kanter: mjuka övergångar, inga hårda rektanglar eller synliga ramar?
- [ ] Konsistens: ser alla varianter ut som de hör ihop visuellt?

## 5. Kontrast och läsbarhet

- [ ] Kan du läsa all text utan att anstränga dig?
- [ ] Ingen text med opacity under 80% mot ljus bakgrund?
- [ ] Knappar och CTA är tydligt klickbara och visuellt separerade?

## 6. Visuell balans

- [ ] Finns det tomrum som inte fyller ett syfte?
- [ ] Ser kortets/sektionens proportioner kompakta ut, eller som en banner?
- [ ] Fråga: "Skulle jag visa det här för en kund som inte vet att det är ett test?"

## 7. Jämför mot referens

- [ ] Jämfört mot DESIGN_REFERENCES.md — liknar det "bra"-exemplen mer än "dåligt"-exemplen?
- [ ] Stämmer det med Flocken-känslan: warm, natural, grounded?

---

Referens: `/c/dev/flocken-website/docs/creative/DESIGN_REFERENCES.md`

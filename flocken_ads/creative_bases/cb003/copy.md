# CB003 Copy -- Passa

**Version:** 1.0
**Datum:** 2026-04-15
**Persona:** Anna (trygghetsmamman)
**Stilprofil:** Halbert (direct response) + Shleyner (scene-hook)
**Landningssida:** https://flocken.info/v/passa

---

## Vinkel 1: Trygghet ("Jag vill veta vem som har min hund")

### Primary text

p01: Lamna din hund hos nagon du litar pa. Se hundvakter nara dig med profil och bild.
_(118 tecken -- under 125-grans)_

p02: Du ska inte behova fraga i en Facebook-grupp. Se vem som finns nara dig innan du bestammer dig.
_(97 tecken)_

p03: Hundvakter i ditt grannskap. Profiler med bild och beskrivning. Valj sjalv nar du kanns trygg.
_(97 tecken)_

p04: Se vem som kan passa din hund. Profiler med bild, nara dig, och du bestammer sjalv.
_(87 tecken)_

### Headlines

h01: Hitta hundvakt nara dig
_(25 tecken)_

h02: Se hundvakter nara dig
_(24 tecken)_

h03: Hundvakt du litar pa
_(21 tecken)_

h04: Se vem som finns nara
_(23 tecken)_

### Descriptions

d01: Gratis att ladda ner
_(21 tecken)_

d02: 2 000+ hundagare i Sverige
_(28 tecken)_

d03: App Store och Google Play
_(27 tecken)_

---

## Vinkel 2: Skuld ("Det kanns som att jag sviker henne")

### Primary text

p05: Hon tittar pa dig med de dar ogonen nar du packar vaskan. Hitta nagon hon redan traffat.
_(90 tecken)_

p06: Det kanns som att svika henne. Det behover det inte. Se hundvakter nara dig.
_(79 tecken)_

p07: Du ska kunna resa utan daligt samvete. Se vem som kan ta hand om din hund.
_(77 tecken)_

p08: Klockan ar halv sju. Du packar vaskan. Hunden ligger i hallen och tittar. Med Flocken hittar du nagon du litar pa.
_(115 tecken)_

### Headlines

h05: Res utan daligt samvete
_(25 tecken)_

h06: Nagon hon litar pa
_(20 tecken)_

h07: Trygg passning nara dig
_(25 tecken)_

### Descriptions

d04: Gratis. Valj sjalv.
_(21 tecken)_

d05: Se profiler innan du bokar
_(28 tecken)_

---

## Vinkel 3: Natverket forsvinner ("Mamma kan inte langre")

### Primary text

p09: Mamma orkar inte langre. Grannen har flyttat. I Flocken hittar du hundvakter nara dig.
_(88 tecken)_

p10: Nar familjen inte kan stalla upp behover du ett nytt natverk. 2 000+ hundagare i Sverige anvander Flocken.
_(108 tecken)_

p11: Har nagon tips pa palitlig hundvakt? Sluta fraga i Facebook-grupper. Se vem som finns nara dig.
_(96 tecken)_

p12: Facebook-grupper ar inte byggda for hundpassning. Flocken ar det.
_(68 tecken)_

### Headlines

h08: Flocken-appen
_(14 tecken)_

h09: Sluta fraga i FB-grupper
_(26 tecken)_

h10: Hundvakt utan att gissa
_(25 tecken)_

### Descriptions

d06: Profiler med bild nara dig
_(28 tecken)_

d07: Gratis att borja
_(18 tecken)_

---

## CTA-knappval per objective

| Objective | CTA-knapp |
|-----------|----------|
| App Install | Install Now |
| Traffic (landing page) | Learn More |
| Engagement | Learn More |

---

## Rekommenderade kombinationer (forsta testet)

Forsta kampanjen testar **3 vinklar mot samma landningssida**. En vinkel per ad set. Inom varje ad set testar Meta hookarna automatiskt via Advantage+ creative.

### Ad Set 1: Trygghet
- Primary: p01, p02
- Headline: h01, h03
- Description: d01
- Creative: Carousel (clay-promenad -> profil-mockup -> karta -> CTA)
- Creative alt: Static 1:1 (clay-promenad + text-overlay)

### Ad Set 2: Skuld
- Primary: p05, p08
- Headline: h05, h06
- Description: d04
- Creative: Static 4:5 (clay-soffa + text-overlay "Res utan daligt samvete")
- Creative alt: Video 9:16 (funktionsdemo med skuld-hook text-overlay)

### Ad Set 3: Natverket
- Primary: p09, p12
- Headline: h09, h10
- Description: d06
- Creative: Static 4:5 (hand-mockup karta + text-overlay)
- Creative alt: Carousel (scen -> app-demo -> social proof -> CTA)

---

## Hypoteser for testet

H1: "Skuld-vinkeln (p05/p08) ger hogre hook rate an Trygghet (p01/p02) eftersom den triggar igenkanning snarare an lofte."

H2: "Carousel har lagre CPA an static image for app install, baserat pa Meta-benchmark."

H3: "Primary text under 90 tecken presterar battre an narmare 125, eftersom hela budskapet syns utan klipp."

---

## Message match-verifiering

| Annons-hook | Landningssidans hero | Match? |
|-------------|---------------------|--------|
| "Lamna din hund hos nagon du litar pa" | "Lamna din hund hos nagon du litar pa" | Exakt |
| "Du ska inte behova fraga i en Facebook-grupp" | "Du ska inte behova fraga i en Facebook-grupp och hoppas pa det basta" | Stark |
| "Hon tittar pa dig med de dar ogonen" | "Lamna din hund hos nagon du litar pa" | Emotionellt konsekvent |
| "Mamma orkar inte langre" | "Lamna din hund hos nagon du litar pa" | Funktionellt konsekvent |
| "Facebook-grupper ar inte byggda for hundpassning" | Hero-subtitle namner Facebook-grupper | Stark |

Alla fem matchar tillrackligt for samma landing page.

---

## Pastaende-register

| Pastaende | Typ | Evidens | Status |
|-----------|-----|---------|--------|
| "2 000+ hundagare" | Siffra | Supabase-data, verifierat | OK |
| "Gratis att ladda ner" | Funktionellt | App Store + Google Play | OK |
| "Profiler med bild och beskrivning" | Funktionellt | App-feature | OK |
| "Hundvakter nara dig" | Funktionellt | Kartfunktion i appen | OK |
| "Du bestammer sjalv" | Funktionellt | Ingen automatisk bokning | OK |

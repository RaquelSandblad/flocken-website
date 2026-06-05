# Startsida V2 — preview (blankt papper-omtag)

**Status:** Preview, live på `flocken.info/preview/start-v2` (noindex). **Ersätter INTE** nuvarande startsida (`app/(marketing)/page.tsx`) ännu — det är ett separat go-live-beslut.
**Datum:** 2026-06 (uppdateras vid ändring)
**Route:** `/preview/start-v2`

---

## Vad det är

En omdesignad startsida byggd från grunden på Flocken Design System V2 (samma DNA som `/v/passa` och `/v/hundar`). Detta är INTE Claude Designs prototyp rakt av — designblocken är verktygslådan, men struktur och innehåll är grundat i vår egen kunskap (personas, value proposition, tone of voice, vad som faktiskt resonerat i annonser).

### Strategisk grund
- **Trygghet vinner** (19 % CTA-rate mot skuldvinkelns 4,6 % i CB003). Vi säljer lugn, inte skräck.
- **Igenkänning före produkt** (Before → Bridge → After).
- **FOMO via närhet + verifierad siffra (4 000+)**, inte hype.
- Positionering MOT röriga Facebook-grupper, algoritmer och social press.

---

## Filer

| Fil | Roll |
|---|---|
| `app/preview/start-v2/page.tsx` | Route. Renderar `<HomepageV2 config={HOMEPAGE_V2_CONFIG} />`. Noindex. |
| `app/preview/start-v2/layout.tsx` | Minimal layout, ingen marketing-header/-footer. Noindex. |
| `components/marketing/HomepageV2.tsx` | Komponenten. Server Component. CTA via `VLandingCTAV2` (variant `home-v2-preview`). |
| `components/marketing/HomepageConfigV2.ts` | All copy + bildvägar. Config-driven. |
| `public/assets/flocken/v2/home/` | Sektionsbilder (clay + 1 mockup). |
| `public/assets/flocken/v2/avatars/` | Hero-avatars: `1-4.png` (trust-rad, generiska), `ikon_avatar_{malua,coco,arlo,hasse}.png` (float-bubblor, matchar ras + namn). |

---

## Arkitektur (emotionell båge, 6 sektioner)

Renderingsordning = bågen. Bakgrundsrytm: paper → mörk → paper → cream → mörk → paper.

1. **Hero** (paper) — H1 "Ett enklare liv som *hundägare.*", app-tydlig lead, en primär CTA + sekundär. Hero-bild: tre hundar som leker (gammal startsidebild, `generated/flocken_image_malua-arlo-coco-jumping-dog-park_1x1.jpeg`). Float-bubblor (Malua/pudel, Coco/cocker, Arlo/mops, Hasse/jämthund) + trust-rad "4 000+ hundägare".
2. **Allt på samma karta** (olive-deep) — kartan som nav, lugn/anti-algoritm. Bild: Skandinavien-kartmockup (funkar SE/NO/DK). Stat-rutor borttagna.
3. **Fyra funktioner** (paper) — Hundar / Passa / Rasta / Besöka, förmånslett, ton-varierade kort (paper/olive/ink/sand). Alla fyra bilder är **clay** (ingen "Para"-screenshot).
4. **En trygg och lugn plats för hundägare** (cream) — tre värdekort: **Tryggt / Lugnt / Äkta** (trygghet först). Inga påhittade kundcitat — det är differentiatorer, inga tillskrivna personer.
5. **Så här började det** (mörk) — riktig grundarhistoria: Raquel sökte vän till toypudeln Malua. Äkta citat attribuerat "Raquel, grundare". Avslutas med lansering jan 2026 + tillväxt (FOMO). Bild: clay-pudelvalpen Malua.
6. **Välkommen in i Flocken** (paper + olive-deep kort) — community/FOMO-close: "Samlingsplatsen för alla *hundar.*", "Över 4 000 hundägare", ladda ner-CTA.

### Borttaget under processen
- **Recognition-sektion** ("Hundlivet är fullt av frågetecken" — 4 frågor) togs bort: ställde frågor utan att svara, bromsade som beat 2.

---

## Copy-regler som följts
- Inga em-streck (`—`) i synlig copy. Inga förbjudna ord (utforska, plattform, sömlös, community, ekosystem).
- Terminologi: funktionen heter **Hundar**, aldrig Para (verbet "para" får stå i grundarhistorien).
- Bara verifierad siffra används: **4 000+ / Över 4 000 hundägare**.
- "Facebook-grupp" med bindestreck (konsekvent på sidan).

---

## Kvar att göra
- [ ] **Go-live-beslut:** ska V2 ersätta nuvarande `app/(marketing)/page.tsx`? (Ej beslutat.)
- [ ] **Mobil:** verifiera på riktig enhet (byggd på samma responsiva grid som /v-sidorna, ej buggverifierad på mobil i denna iteration).
- [ ] **Bildperf:** `mockup-karta-skandinavien-1x1.jpg` är ~4,7 MB källa (Next/Image optimerar, men källan är tung).
- [ ] **Branddocs:** synka "Para → Hundar" + utfasad tagline (separat task).
- [ ] **Nästa sida:** `/funktioner` (handoff finns: `Flocken Funktioner.html`).

---

## Källa
Flocken Design System-zip (handoff från Claude Design, 2026-05) + value_proposition.md + personas + tone_of_voice + writing-style-se.md + Meta-ads-lärdomar (CB003 trygghet vs skuld).

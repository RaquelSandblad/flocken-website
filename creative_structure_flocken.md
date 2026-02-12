# Kreativ Struktur – Creative Bases & Briefs (Flocken)  

**Version:** 1.0  
**Status:** LÅST  
**Syfte:** Flocken-specifik creative workflow

**⚠️ VIKTIGT:** Detta är Flocken-specifik dokumentation. För delad creative workflow, se:  
👉 [spitakolus/meta-ads/CREATIVE_WORKFLOW.md](https://github.com/tbinho/spitakolus/tree/main/meta-ads)

---

## 0. Grundprincip

**För delad creative workflow:**  
👉 [spitakolus/meta-ads/CREATIVE_WORKFLOW.md](https://github.com/tbinho/spitakolus/tree/main/meta-ads)

**Flocken-specifik:**
Du skapar inte annonser.  
Du skapar Creative Bases (CB).  
Annonser är instanser av CB + variant.

---

## 1. Creative Base (CB) – Definition

En Creative Base är:  
- en idécontainer  
- kopplad till EN hypotes  
- återanvändbar  
- oberoende av kampanj

CB är minsta kreativa byggsten.

---

## 2. Rekommenderad mappstruktur

/flocken_ads/  
/creative_bases/  
/cb001/  
brief.md  
copy.md  
/assets/  
/img/  
/vid/  
/cb002/  
/cb003/

---

## 3. brief.md – Idéns kärna (obligatorisk)

Exempel:

```md  
# CB003 – Besöka: hitta hundvänliga platser

Hypotes: h01  
Audience: dogowner  
Primary hook: besoka

Problem:  
Jag vill ta med min hund men vet inte var det funkar.

Löfte:  
Upptäck platser där hundar är välkomna – nära dig.

Bevis / känsla:  
- karta  
- andra hundägare  
- lokalt, tryggt

CTA:  
Ladda ner Flocken  
```

Regel:

Om idén inte går att formulera här → den är inte redo att annonseras.

## 4. copy.md – All text för variation  

Exempel:

```md
## Primary text  
p01: Vet du var din hund är välkommen? Flocken visar hundvänliga platser nära dig.  
p02: Slipp gissa. Med Flocken hittar du caféer, parker och ställen som välkomnar hundar.

## Headlines  
h01: Hitta hundvänliga platser  
h02: Ta med hunden – utan stress

## Descriptions  
d01: Gratis att testa  
```

AI får:
- skapa p03, p04…
- kombinera fritt

AI får INTE:
- ändra grundlöfte i brief.md

## 5. Varianter (v01, v02…)  

Variant = liten, billig förändring.

Exempel:
- v01 = CTA "Ladda ner"
- v02 = CTA "Testa gratis"
- v03 = annan öppningsrad
- v04 = annan färg

Regel:

Variant ändrar aldrig idé, bara utförande.

## 6. Bild & Video – Asset-princip  

För varje CB ska du sikta på:
- 1–2 visuella huvudidéer
- renderade i flera format

Rekommenderade templates:
- vid_9x16
- vid_1x1
- img_1x1
- img_4x5

Regel:

Format/dimension hör hemma i assets, aldrig i annonsnamn.

## 7. Hur en annons skapas (kedjan)  

1. Skapa CB (brief + copy)
2. Skapa v01, v02…
3. Skapa annonser:

```
ad_h01a_cb003_v01_hk_besoka_src_ai_cid001  
ad_h01a_cb003_v02_hk_besoka_src_ai_cid001  
```

Samma assets används i flera placeringar  
Meta optimerar distribution

## 8. Rekommenderat startpaket (Flocken)  

**CB001 – Allmänt värde**
- Hook: hk_all
- Syfte: bred ingång

**CB002 – Passa**
- Hook: hk_passa
- Syfte: praktisk smärta

**CB003 – Besöka**
- Hook: hk_besoka
- Syfte: emotionell trigger

Per CB:
- 1 brief.md
- 1 copy.md
- 1 video + 1 bild
- v01 + v02

Totalt: 6 annonser → fullt tillräckligt för start.

## 9. AI / Cursor – Arbetsregler  

AI får:
- generera briefs enligt mall
- generera copy enligt struktur
- föreslå nya varianter
- batch-skapa annonser korrekt namngivna

AI får INTE:
- skapa annonser utan CB
- ändra hypotes utan beslut
- bryta naming-regler

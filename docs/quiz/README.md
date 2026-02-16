# Flocken Quiz System - Komplett Dokumentation

**Status:** ✅ Live och lanseringsklar  
**Version:** 1.0  
**Datum:** 2026-02-16

---

## 📋 Innehåll

1. [Översikt](#översikt)
2. [Quiz-innehåll](#quiz-innehåll)
3. [Teknisk implementation](#teknisk-implementation)
4. [Tracking & Analytics](#tracking--analytics)
5. [UX & Design](#ux--design)
6. [Bildmaterial](#bildmaterial)
7. [Underhåll & nya quiz](#underhåll--nya-quiz)

---

## 🎯 Översikt

Quiz-systemet är en marknadsföringskanal och samtalsstartare som leder användare till Flocken-appen på ett naturligt sätt.

### Syfte
- Engagera hundintresserade med roligt, lärorikt innehåll
- Visa Flockens värde genom relaterat innehåll
- Generera leads genom naturliga CTA:er
- Spåra användarengagemang för annonsoptimering

### Key Features
- ✅ Multi-quiz plattform (kan hantera obegränsat antal quiz)
- ✅ 10 frågor per quiz (mix av fakta och profil-frågor)
- ✅ Personliga resultat med badges
- ✅ Naturliga CTA:er till Flocken-funktioner
- ✅ Komplett GA4/GTM tracking
- ✅ Mobil-first design
- ✅ Sub-domän support (`quiz.flocken.info`)

---

## 📚 Quiz-innehåll

### Lanserade Quiz (v1.0)

#### 1. Hundsport
**Slug:** `hundsport`  
**Titel:** Hur hundsportig är du egentligen?  
**Beskrivning:** Från adrenalinfyllda starter till doftnörderi – var hamnar du?

**Innehåll:**
- 6 faktafrågor om hundsport (agility, nose work, IGP, drag, etc.)
- 4 profilfrågor om personlighet och preferenser
- Fokus: Aktivitet, samarbete, träning

**Målgrupp:** Aktiva hundägare, sportintresserade

---

#### 2. Rasers Syfte
**Slug:** `rasers_syfte`  
**Titel:** Vad är olika hundraser egentligen framavlade för?  
**Beskrivning:** Jakt, vall, drag eller soffhäng? Testa din koll.

**Innehåll:**
- 8 faktafrågor om olika rasers historiska syfte
- 2 profilfrågor om preferenser
- Täcker: Vallhundar, apportörer, drag, terrier, etc.

**Målgrupp:** Alla hundägare, rasintresserade

---

#### 3. Hundens Historia
**Slug:** `hundens_historia`  
**Titel:** Från varg till vardagskompis – hur bra kan du hundens historia?  
**Beskrivning:** 10 frågor om hur hunden blev människans bästa vän.

**Innehåll:**
- 9 faktafrågor om domesticering, rasavel, kennelklubb-historia
- 1 profilfråga om intresseområde
- Täcker: Varg-hund-relation, SKK, FCI, DNA-forskning

**Målgrupp:** Historiaintresserade, generellt hundintresserade

---

## 🏗️ Teknisk Implementation

### Arkitektur

```
app/quiz/
├── page.tsx                    # Quiz-bibliotek (startsida)
├── [slug]/
│   ├── page.tsx               # Quiz-spelare
│   └── result/
│       └── page.tsx           # Resultatskärm
└── layout.tsx                 # Quiz-layout + metadata

components/quiz/
├── QuizCard.tsx               # Quiz-kort i biblioteket
├── QuizLayout.tsx             # Layout wrapper
├── QuizPlayer.tsx             # Quiz-motor (client component)
├── QuestionCard.tsx           # Enskild fråga
├── AnswerOption.tsx           # Svarsalternativ
├── ProgressIndicator.tsx      # Progress bar
├── ResultCard.tsx             # Resultatvisning
└── Badge.tsx                  # (Deprecated - badge inline nu)

lib/quiz/
├── types.ts                   # TypeScript types
├── schema.ts                  # Zod validation
├── loader.ts                  # Data loading (cache)
├── score.ts                   # Poängräkning + badges
├── tracking.ts                # Event tracking
└── brand.ts                   # Brand tokens

data/quizzes/
├── hundsport.json
├── rasers_syfte.json
└── hundens_historia.json
```

### Data Model

**Quiz Definition:**
```typescript
{
  slug: string,              // URL-säker identifier
  title: string,             // Visas i UI
  description: string,       // Kort beskrivning
  questions: [               // Exakt 10 frågor
    {
      id: string,           // Unik fråge-ID
      type: 'fact' | 'profile',
      question: string,
      options: string[],    // 2-4 alternativ
      // Endast för 'fact':
      correctIndex?: number,
      explanation?: string,
      sources?: string[],   // Fakta-källa refs
      factId?: string      // Intern referens
    }
  ]
}
```

### Validering

Alla quiz valideras vid laddning med Zod:
- Slug: `^[a-z0-9_-]+$`
- Exakt 10 frågor
- Faktafrågor måste ha `correctIndex`, `explanation`, `sources[]`, `factId`
- Profilfrågor har inga "rätt svar"

Fel kastar synliga exceptions i dev-läge.

---

## 📊 Tracking & Analytics

### Event Types

Quiz-systemet pushar följande events till GTM `dataLayer`:

#### 1. `quiz_view`
**När:** Quiz-biblioteket visas  
**Payload:**
```javascript
{
  event: 'quiz_view',
  slug: 'hundsport' // specifikt quiz
}
```

#### 2. `quiz_start`
**När:** Användare startar ett quiz (första frågan)  
**Payload:**
```javascript
{
  event: 'quiz_start',
  slug: 'hundsport'
}
```

#### 3. `quiz_complete`
**När:** Användare slutför alla 10 frågor  
**Payload:**
```javascript
{
  event: 'quiz_complete',
  slug: 'hundsport',
  score: 7 // antal rätt (0-10)
}
```

#### 4. `quiz_score_bucket`
**När:** Direkt efter `quiz_complete`  
**Payload:**
```javascript
{
  event: 'quiz_score_bucket',
  slug: 'hundsport',
  bucket: 'med' // 'low' | 'med' | 'high'
}
```

**Buckets:**
- `low`: 0-3 poäng → "Nyfiken hundvän"
- `med`: 4-7 poäng → "Stabil hundkännare"
- `high`: 8-10 poäng → "Hundnörd deluxe"

#### 5. `quiz_cta_click`
**När:** Användare klickar CTA på resultatskärmen  
**Payload:**
```javascript
{
  event: 'quiz_cta_click',
  slug: 'hundsport',
  cta: 'download' | 'how_it_works'
}
```

#### 6. `quiz_cta_download_click`
**När:** Specifikt download-CTA (subset av `quiz_cta_click`)  
**Payload:**
```javascript
{
  event: 'quiz_cta_download_click',
  slug: 'hundsport',
  cta: 'download'
}
```

### GTM Integration

Events pushas automatiskt till `window.dataLayer` som GTM lyssnar på.

**GTM Container:** `GTM-PD5N4GT3`  
**Hostname routing:** `flocken.info` och `quiz.flocken.info`  
**GA4 Property:** `G-7B1SVKL89Q`

**Se:** [`docs/tracking/TRACKING_SETUP_COMPLETE.md`](../tracking/TRACKING_SETUP_COMPLETE.md)

---

## 🎨 UX & Design

### Design Principer

1. **Snabbt & enkelt**
   - En fråga per vy
   - Stora klickbara svarskort
   - Tydlig progress (X/10)
   - Ingen "tillbaka till start"-knapp mitt i quiz

2. **Visuellt engagerande**
   - Quiz-specifika bilder på kort
   - Hero-bild i biblioteket
   - Resultatbild på slutskärmen
   - Gradient-badge (inte knapp)

3. **Naturlig koppling till Flocken**
   - Resultatskärm förklarar hur Flocken hjälper
   - CTA:er kopplar till funktioner (Para, Passa, Rasta, Besöka)
   - Mjuk övergång - inte aggressiv försäljning

4. **Mobil-first**
   - Touch-vänliga knappar
   - Läsbar text på små skärmar
   - Snabba laddningstider

### Brand Tokens

```css
--quiz-color-primary: #6B7A3A   /* flocken-olive */
--quiz-color-accent: #8BA45D    /* flocken-accent */
--quiz-color-background: #F5F1E8 /* flocken-cream */
--quiz-radius-card: 1rem
--quiz-font: Inter, system-ui, sans-serif
```

### Animationer

- Fade-slide mellan frågor (180ms)
- Respekterar `prefers-reduced-motion`
- Hover-effekter på knappar

---

## 📸 Bildmaterial

### Bildkrav

Alla bilder följer Flockens visuella identitet:
- **Färgpalett:** Olivgrönt, sandbeige, varma bruntoner
- **Stil:** Naturlig, varm, organisk
- **Undvik:** Sterilt, kliniskt, konstgjort

### Bildplaceringar

1. **Quiz Library Hero** (`flocken_quiz_hero.jpg`)
   - Storlek: 1200x675px (16:9)
   - Plats: Bibliotekssidans hero-sektion

2. **Quiz Card Images** (per quiz)
   - `flocken_quiz_hundsport_card.jpg` (640x400px, 16:10)
   - `flocken_quiz_raser_card.jpg` (640x400px, 16:10)
   - `flocken_quiz_historia_card.jpg` (640x400px, 16:10)

3. **Result Screen Image** (`flocken_quiz_result.jpg`)
   - Storlek: 1200x675px (16:9)
   - Används för alla quiz

**Detaljerade prompts:** Se [`QUIZ_IMAGE_PROMPTS.md`](./QUIZ_IMAGE_PROMPTS.md)

---

## 🔧 Underhåll & Nya Quiz

### Lägga till nytt quiz

1. **Skapa JSON-fil:**
   ```bash
   # data/quizzes/ny_quiz.json
   {
     "slug": "ny_quiz",
     "title": "Din titel här",
     "description": "Kort beskrivning",
     "questions": [ /* 10 frågor */ ]
   }
   ```

2. **Validering sker automatiskt** vid `npm run dev`

3. **Quizet dyker upp automatiskt** i biblioteket

4. **Lägg till bild** i `QuizCard.tsx` > `quizThemes`

### Redigera befintligt quiz

⚠️ **Viktigt:** Ändra ALDRIG fakta i befintliga quiz utan att verifiera källor!

**Säkra ändringar:**
- Titel/beskrivning
- Profilfrågor (inga "rätta svar")
- Ordningsföljd på frågor

**Osäkra ändringar (kräver faktakoll):**
- Ändra rätt svar (`correctIndex`)
- Ändra förklaringar
- Lägga till/ta bort alternativ

### Uppdatera badges/tolkningar

Redigera `lib/quiz/score.ts` > `getResultMeta()`:

```typescript
if (score <= 3) {
  return {
    badge: '🐕 Din badge här',
    interpretation: 'Din text här...'
  };
}
```

**Tänk på:**
- Badges ska vara visuella (emoji + text)
- Tolkningar ska koppla till Flocken naturligt
- Undvik "nästa nivå" eller hierarkiska termer

---

## 🚀 Deployment

### Steg-för-steg

1. **Testa lokalt:**
   ```bash
   npm run dev
   # Öppna http://localhost:3000/quiz
   ```

2. **Verifiera:**
   - Alla quiz laddar
   - Tracking fungerar (kolla console logs)
   - Bilder visas korrekt
   - Mobil-vy ser bra ut

3. **Commit & Push:**
   ```bash
   git add .
   git commit -m "Add/update quiz content"
   git push raquel main  # VIKTIGT: raquel, inte origin
   ```

4. **Vercel deployment** sker automatiskt

5. **Verifiera live:**
   - `https://quiz.flocken.info`
   - Testa tracking i GA4 Realtime

---

## 📈 Framtida Förbättringar

### v1.1 (planerat)
- [ ] Delningsfunktion för badges (social media)
- [ ] Quiz-specifika resultatbilder
- [ ] A/B-test olika CTA-copy
- [ ] Email capture för högpresterande

### v1.2 (idéer)
- [ ] Quiz-serier (del 1 av 3)
- [ ] Personligt poängsystem över flera quiz
- [ ] Community-feature (jämför med andra)
- [ ] Integrering med Flocken-app (om användare har appen)

---

## 🔗 Relaterad Dokumentation

- [Bildprompts](./QUIZ_IMAGE_PROMPTS.md) - Nano Banana prompts för alla bilder
- [Tracking Setup](../tracking/TRACKING_SETUP_COMPLETE.md) - GA4/GTM konfiguration
- [Brand Guidelines](../brand/) - Flockens visuella identitet
- [Main README](../../README.md) - Projekt-översikt

---

## 📞 Support & Frågor

För frågor om quiz-systemet:
- **Tekniskt:** Se kod + kommentarer i `lib/quiz/`
- **Innehåll:** Verifiera mot källreferenser i quiz JSON
- **Design:** Följ brand tokens i `lib/quiz/brand.ts`

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
- ✅ 10 frågor per quiz (endast faktafrågor - alla poängsättbara)
- ✅ Personliga resultat med rosett-badges (bronze/silver/gold)
- ✅ Auto-advance efter svar med färg-feedback
- ✅ Delningsfunktion (Web Share API + kopiera-länk)
- ✅ Naturliga CTA:er till Flocken-funktioner
- ✅ Komplett GA4/GTM tracking
- ✅ Mobil-first design
- ✅ Sub-domän support (`quiz.flocken.info`)

### Senaste uppdateringar (2026-02-16)

**UX-förbättringar:**
- ✅ Tog bort symboler från svarsalternativ (endast färg-feedback)
- ✅ Auto-advance efter svar (0.8s delay) - ingen manuell "Nästa"-knapp
- ✅ "Tillbaka"-knappen visas endast när den kan användas
- ✅ Förklaringar visas endast på resultatskärmen (inte under spelet)

**Badge-system:**
- ✅ Ny rosett-design med CSS/SVG (ingen emoji)
- ✅ Tre visuella tiers: bronze (0-4), silver (5-7), gold (8-10)
- ✅ Tass-ikon i SVG för mer professionell känsla

**Delningsfunktionalitet:**
- ✅ Ny `ShareChallenge`-komponent
- ✅ Web Share API för mobil (native delning)
- ✅ Kopiera-länk-fallback för desktop
- ✅ Trackas som `quiz_share` event

**Resultatskärm:**
- ✅ Ny ordning: Score+Badge → Dela → CTA → Svar
- ✅ CTA flyttad upp för bättre synlighet (innan svarsgenomgången)
- ✅ Förbättrad visuell hierarki

**Score-kriterier:**
- ✅ Justerade buckets: 0-4 (low), 5-7 (med), 8-10 (high)
- ✅ Uppdaterade badge-texter: "Skarp hundkännare" (tidigare "Stabil")

**Deployment:**
- ✅ Committat och deployat till produktion
- 🔧 Subdomän `quiz.flocken.info` (kräver Vercel + DNS-konfiguration första gången)

**Framtida planering:**
- 📧 Email-capture system (MailerSend-integration) - research klar, implementation väntar

---

## 📚 Quiz-innehåll

### Lanserade Quiz (v1.0)

#### 1. Hundsport
**Slug:** `hundsport`  
**Titel:** Hur hundsportig är du egentligen?  
**Beskrivning:** Från adrenalinfyllda starter till doftnörderi – var hamnar du?

**Innehåll:**
- 10 faktafrågor om hundsport (agility, nose work, IGP, drag, etc.)
- Fokus: Aktivitet, samarbete, träning

**Målgrupp:** Aktiva hundägare, sportintresserade

---

#### 2. Rasers Syfte
**Slug:** `rasers_syfte`  
**Titel:** Vad är olika hundraser egentligen framavlade för?  
**Beskrivning:** Jakt, vall, drag eller soffhäng? Testa din koll.

**Innehåll:**
- 10 faktafrågor om olika rasers historiska syfte
- Täcker: Vallhundar, apportörer, drag, terrier, etc.

**Målgrupp:** Alla hundägare, rasintresserade

---

#### 3. Hundens Historia
**Slug:** `hundens_historia`  
**Titel:** Från varg till vardagskompis – hur bra kan du hundens historia?  
**Beskrivning:** 10 frågor om hur hunden blev människans bästa vän.

**Innehåll:**
- 10 faktafrågor om domesticering, rasavel, kennelklubb-historia
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
├── AnswerOption.tsx           # Svarsalternativ (färg-baserad feedback)
├── ProgressIndicator.tsx      # Progress bar
├── ResultCard.tsx             # Resultatvisning
├── BadgeDisplay.tsx           # Rosett-badge med CSS/SVG (bronze/silver/gold)
└── ShareChallenge.tsx         # Dela/utmana-funktionalitet

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
      type: 'fact',         // Alla frågor är faktafrågor (poängsättbara)
      question: string,
      options: string[],    // 2-4 alternativ
      correctIndex: number, // Krävs för alla frågor
      explanation: string,  // Krävs för alla frågor
      sources: string[],    // Krävs för alla frågor (fakta-källa refs)
      factId: string        // Krävs för alla frågor (intern referens)
    }
  ]
}
```

### Validering

Alla quiz valideras vid laddning med Zod:
- Slug: `^[a-z0-9_-]+$`
- Exakt 10 frågor
- Alla frågor måste vara `type: 'fact'` med `correctIndex`, `explanation`, `sources[]`, `factId`
- Inga profilfrågor (alla måste vara poängsättbara)

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
- `low`: 0-4 poäng → "Nyfiken hundvän"
- `med`: 5-7 poäng → "Skarp hundkännare"
- `high`: 8-10 poäng → "Hundexpert"

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

#### 7. `quiz_share`
**När:** Användare delar quizet via dela-knapp eller kopiera-länk  
**Payload:**
```javascript
{
  event: 'quiz_share',
  slug: 'hundsport',
  score: 7,
  method: 'native' | 'copy' // Web Share API eller kopiera-länk
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
   - Auto-advance efter svar (0.8s) - ingen manuell "Nästa"-knapp
   - Ingen "Tillbaka"-knapp när den inte kan användas

2. **Omedelbar feedback**
   - Färg-baserad feedback (grönt=rätt, rött=fel) - inga symboler
   - Förklaringar visas endast på resultatskärmen (inte under spelet)
   - Snabb övergång till nästa fråga efter feedback

3. **Visuellt engagerande**
   - Quiz-specifika bilder på kort
   - Hero-bild i biblioteket
   - Resultatbild på slutskärmen
   - Rosett-badge med CSS/SVG (bronze/silver/gold tiers)

4. **Naturlig koppling till Flocken**
   - Resultatskärm förklarar hur Flocken hjälper
   - CTA:er placerade högt upp (innan svarsgenomgången)
   - Delningsfunktion för att utmana kompisar
   - Mjuk övergång - inte aggressiv försäljning

5. **Mobil-first**
   - Touch-vänliga knappar
   - Läsbar text på små skärmar
   - Snabba laddningstider
   - Web Share API för enkel delning på mobil

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
   - `flocken_quiz_hundsport_card.jpg` (16:9)
   - `flocken_quiz_rasers_syfte_card.jpg` (16:9)
   - `flocken_quiz_hundens_historia_card.jpg` (16:9)

3. **Result Screen Image** (`flocken_quiz_result.jpg`)
   - Storlek: 1200x675px (16:9)
   - Används för alla quiz

**Detaljerade prompts:** Se [`QUIZ_IMAGE_PROMPTS.md`](./QUIZ_IMAGE_PROMPTS.md)

**Placering/workflow:**
- Lägg originalbilder i: `public/assets/flocken/_originals/`
- Kör: `node scripts/image-processor-flocken.js process-all`
- Använd genererade filer från: `public/assets/flocken/generated/`
- För quiz thumbnails: sätt `images.cardKey` + `images.cardAlt` i quiz JSON (t.ex. `flocken_quiz_hundsport_card`)

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
- Ordningsföljd på frågor

**Osäkra ändringar (kräver faktakoll):**
- Ändra rätt svar (`correctIndex`)
- Ändra förklaringar
- Lägga till/ta bort alternativ
- Alla ändringar kräver faktakoll eftersom alla frågor är faktafrågor

### Uppdatera badges/tolkningar

Redigera `lib/quiz/score.ts` > `getResultMeta()`:

```typescript
if (score <= 4) {
  return {
    badge: 'Din badge-text här',
    tier: 'bronze', // 'bronze' | 'silver' | 'gold'
    interpretation: 'Din text här...'
  };
}
```

**Tänk på:**
- Badges är nu CSS/SVG-rosetter med tass-ikon (ingen emoji)
- Tre tiers: bronze (0-4), silver (5-7), gold (8-10)
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

5. **Konfigurera subdomän** (första gången):
   - Gå till Vercel Dashboard → Settings → Domains
   - Lägg till `quiz.flocken.info`
   - Skapa CNAME-post hos domänleverantör: `quiz` → `cname.vercel-dns.com`
   - Vänta på DNS-propagering (1-5 min, max 1h)

6. **Verifiera live:**
   - `https://flocken.info/quiz` (fungerar alltid)
   - `https://quiz.flocken.info` (efter DNS-konfiguration)
   - Testa tracking i GA4 Realtime

---

## 📈 Framtida Förbättringar

### v1.1 (planerat)
- [x] Delningsfunktion för badges (social media) - ✅ Klart
- [x] Förbättrad badge-design (CSS/SVG rosetter) - ✅ Klart
- [x] Auto-advance UX-förbättringar - ✅ Klart
- [ ] Quiz-specifika resultatbilder
- [ ] A/B-test olika CTA-copy
- [ ] Email capture för högpresterande (MailerSend-integration planerad)

**Email-system research:**
- ✅ Analyserat nastahem's MailerSend-integration
- ✅ Supabase `email_signups`-tabell med UTM-parametrar
- ✅ MailerSend API med template-system
- ✅ BigQuery-sync och Meta Pixel Lead-event tracking
- 📋 Implementation väntar på beslut om Supabase-instans och MailerSend-konto

### v1.2 (idéer)
- [ ] Quiz-serier (del 1 av 3)
- [ ] Personligt poängsystem över flera quiz
- [ ] Leaderboards (kräver databas)
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

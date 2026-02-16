# Flocken Quiz Launch Checklist

**Version:** 1.0  
**Status:** ✅ Lanseringsklar (pending bilder)  
**Datum:** 2026-02-16

---

## ✅ Klart för lansering

### Innehåll & Copy
- [x] 3 quiz färdiga (hundsport, rasers_syfte, hundens_historia)
- [x] Alla frågor granskade för svenskt språk
- [x] Fakta verifierade mot källor
- [x] Resultat-copy uppdaterad (ingen "nästa nivå"-terminology)
- [x] Naturliga CTA:er till Flocken-funktioner
- [x] Badges med visuell identitet (emoji + gradient, inte knapp-stil)

### UX & Design
- [x] Bibliotekssida med hero-sektion
- [x] "Varför göra quizen?"-sektion
- [x] Quiz-specifika kort med teman
- [x] Förbättrad resultatskärm med naturlig Flocken-koppling
- [x] Mobil-first design
- [x] Animationer (fade-slide, respekterar prefers-reduced-motion)

### Tekniskt
- [x] Schema-validering (Zod) för alla quiz
- [x] Slug-validering (inkl. underscore)
- [x] Type-safe implementation
- [x] Lint: 0 errors, 0 warnings
- [x] Middleware host-rewrite för quiz.flocken.info

### Tracking
- [x] GA4/GTM events implementerade:
  - `quiz_view`
  - `quiz_start`
  - `quiz_complete`
  - `quiz_score_bucket`
  - `quiz_cta_click`
  - `quiz_cta_download_click`
- [x] Consent-respekt (pushar bara om consent granted)
- [x] Development logging för debugging

### Dokumentation
- [x] Quiz system README
- [x] Bildprompts för Nano Banana
- [x] Launch checklist (denna fil)

---

## ⏳ Kvarstår innan full lansering

### Bilder (high priority)
- [ ] Generera bilder med Nano Banana enligt prompts
- [ ] Placera i `public/assets/flocken/quiz/`
- [ ] Uppdatera komponenter med faktiska bildsökvägar:
  - `app/quiz/page.tsx` (hero image)
  - `components/quiz/QuizCard.tsx` (quiz card images)
  - `components/quiz/ResultCard.tsx` (result image)

### Test (before production push)
- [ ] Lokal test av alla tre quiz
- [ ] Verifiera tracking i browser devtools (dataLayer)
- [ ] Mobil-test (iPhone/Android)
- [ ] Cross-browser test (Chrome, Safari, Firefox)
- [ ] Verifiera quiz.flocken.info host routing
- [ ] Test GA4 Realtime efter deploy

### Marketing
- [ ] Meta Ads creative med quiz-länk
- [ ] Social media posts
- [ ] Email blast (om tillämpligt)

---

## 🚀 Deployment Steg-för-steg

1. **Generera bilder:**
   ```bash
   # Använd prompts från docs/quiz/QUIZ_IMAGE_PROMPTS.md
   # Spara till public/assets/flocken/quiz/
   ```

2. **Uppdatera bildvägar i kod:**
   - Se specifika komponenter listade ovan

3. **Lokal verifiering:**
   ```bash
   npm run dev
   # Testa http://localhost:3000/quiz
   # Verifiera tracking i console
   ```

4. **Push till produktion:**
   ```bash
   git add .
   git commit -m "Launch quiz system v1.0"
   git push raquel main  # VIKTIGT: raquel remote
   ```

5. **Verifiera live:**
   - https://quiz.flocken.info
   - https://flocken.info/quiz
   - GA4 Realtime tracking

---

## 📊 Success Metrics (vecka 1)

**Mål:**
- [ ] 100+ quiz-starter
- [ ] 60%+ completion rate
- [ ] 15%+ CTA click-through
- [ ] 5%+ app downloads från quiz

**Tracking i GA4:**
- Event: `quiz_complete` (completion rate)
- Event: `quiz_cta_click` (CTR)
- Event: `quiz_cta_download_click` (conversion)

---

## 🔄 Optimering Efter Lansering

### Vecka 1-2
- Analysera completion rates per quiz
- Identifiera dropoff-punkter
- A/B-testa CTA-copy på resultatskärm

### Vecka 3-4
- Optimera Meta Ads baserat på quiz-performance
- Överväg nya quiz-ämnen baserat på populäritet
- Förbättra bilder baserat på user feedback

---

## 📞 Kontaktpunkter

**Innehåll & Fakta:**
- Verifiera mot sources[] i quiz JSON-filer
- Håll facts packs uppdaterade

**Design & UX:**
- Följ brand tokens i `lib/quiz/brand.ts`
- Respektera Flockens visuella identitet

**Tracking & Analytics:**
- GA4 Property: G-7B1SVKL89Q
- GTM Container: GTM-PD5N4GT3
- Se: docs/tracking/TRACKING_SETUP_COMPLETE.md

**Tekniskt:**
- All kod i app/quiz, components/quiz, lib/quiz
- Dokumentation: docs/quiz/README.md

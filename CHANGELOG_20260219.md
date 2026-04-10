# Ändringar 2026-02-19

## 📧 Quiz-epostlista & GDPR

### Sammanfattning

Komplett epostsystem för quiz.flocken.info. Besökare som gör ett quiz kan registrera sin mejladress och får ett välkomstmejl direkt. Systemet hanterar lagring, utskick och GDPR-compliance.

---

### 1. Epostregistrering – EmailCaptureCard

**Vad:** Ny komponent `components/quiz/EmailCaptureCard.tsx` visas på alla quiz-resultatsidor utom `/quiz/kanda_hundar` (där quizet är lead magneten som skickas ut).

**Funktioner:**
- Hero-bild (16:9) från thumbnail för kända hundar-quizet
- Formulär med e-postfält och CTA-knapp
- Fyra statuslägen: `idle`, `loading`, `success`, `already` (redan registrerad)
- Integritetspolicylänk under formuläret
- GA4-tracking via `quiz_email_subscribe_attempt` och `quiz_email_subscribe_success`

**Filer:** `components/quiz/EmailCaptureCard.tsx` (ny), `components/quiz/ResultCard.tsx`

---

### 2. API-route – /api/email/quiz-subscribe

**Vad:** `app/api/email/quiz-subscribe/route.ts` hanterar POST-anrop från formuläret.

**Flöde:**
1. Validerar e-postadress
2. Sparar i Supabase (`flocken_quiz_subscribers`-tabellen i `spitakolus-support`-projektet)
3. Hanterar dubbletter utan felmeddelande (`error.code === '23505'`)
4. Skickar välkomstmejl via MailerSend

**Filer:** `app/api/email/quiz-subscribe/route.ts` (ny)

---

### 3. E-postutskick – MailerSend

**Infrastruktur:**
- Avsändardomain: `email.flocken.info` (SPF, DKIM och CNAME konfigurerat i Vercel DNS)
- Avsändaradress: `hej@email.flocken.info`
- Välkomstmejl med länk till `/quiz/kanda_hundar`

**Designbeslut:** HTML-innehållet skrivs i kod (inte via MailerSends drag-and-drop). Det ger full kontroll över layout och gör det möjligt att uppdatera mallarna via kod-ändringar.

**Filer:** `lib/email/send.ts` (ny), `lib/email/templates.ts` (ny)

---

### 4. Databas – Supabase

**Projekt:** `spitakolus-support` (delat projekt för Spitakolus-tjänster)

**Tabeller (nya):**
- `flocken_quiz_subscribers` – e-postadress, quiz_slug, created_at. UNIQUE på email.
- `flocken_email_jobs` – kö för framtida schemalagda utskick (dag 3, dag 7 etc.)

**RLS:** Service role-access. Inga direktanrop från klienten.

**Filer:** `support-system/supabase/flocken-quiz-subscribers.sql` (ny)

---

### 5. Integritetspolicy – GDPR-uppdatering

**Tillägg i `app/(legal)/integritetspolicy/page.tsx`:**
- Sektion 2.4a: "E-postadress via quiz" – vad som samlas in och att det är frivilligt
- Sektion 4.4a: "Quiz och e-postnotifieringar" – syfte och rättslig grund (samtycke, artikel 6.1 a GDPR)
- Sektion 5.2: MailerSend tillagt som personuppgiftsbiträde

---

### 6. Flocken App-promo – layoutjusteringar

- `/quiz` (listningssidan): Flocken-reklamen flyttad till botten så den inte konkurrerar med quiz-listan
- Resultatsidan: Flocken-promoblock flyttat till botten, efter svarsgranskning
- Promoblock omdesignat till "bild-banner" med `flocken_image_community_medium.webp` som bakgrund och `object-position: center 30%`

**Filer:** `app/quiz/page.tsx`, `components/quiz/ResultCard.tsx`

---

### Miljövariabler (Vercel)

Nya variabler som krävs i Vercel (och `.env.local`):

| Variabel | Värde |
|----------|-------|
| `SUPPORT_SUPABASE_URL` | `https://kgtopebjrrfnvbvytisz.supabase.co` |
| `SUPPORT_SUPABASE_SERVICE_KEY` | `eyJhbGci...` |
| `MAILERSEND_API_TOKEN` | `mlsn.6b8b...` |
| `MAILERSEND_FROM_EMAIL` | `hej@email.flocken.info` |
| `MAILERSEND_FROM_NAME` | `Flocken` |

---

### Dokumentation

- `support-system/supabase/flocken-quiz-subscribers.sql` – SQL för tabellskapande i Supabase
- `lib/email/templates.ts` – HTML-mallar för välkomstmejl och framtida quiz-notifieringar
- `lib/email/send.ts` – MailerSend-klient

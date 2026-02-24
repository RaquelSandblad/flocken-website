# Ändringar 2026-02-12

## 🍪 Cookie Banner & Cookie Policy

### Sammanfattning

Förbättrad cookie banner för mobil och ny dedikerad cookie policy-sida. Inga ändringar i hur cookies tekniskt hanteras – endast layout, UX och dokumentation.

---

### 1. Cookie Banner – Mobile-Friendly

**Problem:** Banner kunde hamna fel på mobil (inspect/emulator), knappar riskerade att bli oåtkomliga.

**Lösningar:**

- **Safe-area padding** – `env(safe-area-inset-bottom)` för iPhones med Face ID/home-indikator
- **Responsiv layout** – `max-height: 85vh` + `overflow-y: auto` för extremt små skärmar (t.ex. landscape)
- **Media query** – Enkolumns-layout för toggle-grid på skärmar < 340px (Galaxy Fold)
- **Touch targets** – Minst 44px höjd på knappar och toggle-rader (WCAG)
- **viewport-fit: cover** – I `layout.tsx` för att aktivera safe-area på iOS

**Filer:** `public/scripts/cookie-banner-custom.js`, `app/layout.tsx`

---

### 2. Ny Cookie Policy-sida

- **Ny sida:** `/cookiepolicy` – Dedikerad cookie policy för flocken.info
- **Innehåll:** Fokuserar endast på webbplatsen (inte appen), baserad på dokumentation i `docs/tracking/` och `docs/meta/`
- **Sektioner:** Vad cookies gör för användaren, vad cookies är, vilka vi använder, hantering, GDPR-punkter

**Filer:** `app/(legal)/cookiepolicy/page.tsx` (ny)

---

### 3. Footer & Länkar

- **Länk i footer** – "Cookiepolicy" tillagt i både marketing- och legal-footer
- **Banner-länk** – "Läs mer" i cookie-bannern pekar nu på `/cookiepolicy` (tidigare `/integritetspolicy`)

**Filer:** `components/shared/Footer.tsx`, `public/scripts/cookie-banner-custom.js`

---

### Tekniskt oförändrat

- **Cookie-hantering** – Samma `localStorage`-key, GTM dataLayer, Meta Pixel `fbq('consent')`
- **Consent-logik** – Ingen förändring i när/vad som sparas eller skickas

---

### Dokumentation

- [docs/legal/COOKIE_BANNER_IMPLEMENTATION.md](./docs/legal/COOKIE_BANNER_IMPLEMENTATION.md) – Teknisk dokumentation av banner-implementation
- [docs/legal/COOKIEPOLICY_FLOCKEN.md](./docs/legal/COOKIEPOLICY_FLOCKEN.md) – Ursprunglig template (källa till live-sidan)

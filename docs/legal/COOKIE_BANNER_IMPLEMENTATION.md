# Cookie Banner – Teknisk implementation

**Senast uppdaterad:** 2026-02-12

---

## Översikt

Cookie-bannern på flocken.info är implementerad som vanilla JavaScript i `public/scripts/cookie-banner-custom.js`. Den visas vid första besök, sparar val i `localStorage`, och uppdaterar GTM dataLayer samt Meta Pixel consent.

**Relaterad dokumentation:**
- [COOKIEPOLICY_FLOCKEN.md](./COOKIEPOLICY_FLOCKEN.md) – Ursprunglig policy-template
- [CHANGELOG_20260212.md](../../CHANGELOG_20260212.md) – Ändringar 12 feb 2026
- [docs/tracking/PRIVACY_COMPLIANCE_CHECK.md](../tracking/PRIVACY_COMPLIANCE_CHECK.md) – GDPR-kompatibilitet

---

## Mobile-first design (2026-02-12)

### Safe-area & iOS

- **Bottom padding:** `calc(20px + env(safe-area-inset-bottom, 0px))` – undviker iPhone-notch/home-indikator
- **viewport-fit: cover** – Satt i `app/layout.tsx` via `export const viewport` för att aktivera safe-area

### Responsivitet

- **Max-height:** `85vh` – Bannern tar högst 85 % av viewport-höjd
- **Overflow:** `overflow-y: auto` – Möjlighet att scrolla innehållet vid extremt små skärmar
- **Media query:** Enkolumns-layout för toggle-grid vid `max-width: 340px` (t.ex. Galaxy Fold)

### Touch targets

- **Knappar:** `min-height: 44px` (WCAG 2.1)
- **Toggle-rader:** `min-height: 44px`, `padding: 10px`

---

## Filstruktur

| Fil | Syfte |
|-----|-------|
| `public/scripts/cookie-banner-custom.js` | Banner HTML, consent-logik, GTM/Meta uppdatering |
| `app/layout.tsx` | Script-inladdning, viewport, GTM consent-default |
| `app/(legal)/cookiepolicy/page.tsx` | Cookie policy-sida |
| `components/shared/Footer.tsx` | Länk till /cookiepolicy + "Cookie-inställningar"-knapp |

---

## Consent-flow

1. **Första besök:** Banner visas, inga analytics/marketing cookies sätts
2. **"Spara val" / "Tillåt alla":** Sparar val i `localStorage` (`cookie-consent`), uppdaterar GTM (`analytics_storage`, `ad_storage`), Meta Pixel (`fbq('consent', 'grant'/'revoke')`)
3. **"Cookie-inställningar" i footer:** Öppnar modal (eller banner på sidor utan consent) för att ändra val
4. **Ändrat val:** Rensar cookies/storage för de kategorier som avaktiverats

---

## Tekniska detaljer

- **localStorage key:** `cookie-consent` (med bindestreck – viktigt för layout.tsx)
- **GTM:** `dataLayer.push({ event: 'consent_update', ... })`
- **Meta Pixel:** `fbq('consent', 'grant')` eller `fbq('consent', 'revoke')`

Se `cookie-banner-custom.js` för full implementation.

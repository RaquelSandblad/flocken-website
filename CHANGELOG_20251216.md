# Ändringar 2025-12-16

## 🍪 Cookie Banner & Privacy Choices (Senare på dagen)

### Nya sidor och funktioner

#### 1. Privacy Choices-sida (App Store-krav)
- ✅ **Ny sida**: `/privacy-choices` - Detaljerade instruktioner för användarens integritetsval
  - Instruktioner för kontoradering (i appen)
  - Instruktioner för att ändra uppgifter (i appen)
  - Instruktioner för platsdata, meddelanden, dataexport
  - Kontaktinformation för support
  - **Syfte**: Uppfylla App Store-krav om tydlig kontoradering

#### 2. Integritetspolicy - App Store-förtydliganden
- ✅ **Uppdaterad**: Förtydliganden för Apple App Store review:
  - Kontoradering: Tydligare text om radering direkt i appen
  - Dataändring: Information om att redigera profil/hunduppgifter/bilder i appen
  - Ny sektion "Dina rättigheter": Övergripande sammanfattning av användarrättigheter
  - Hänvisning till `/privacy-choices` längst ned (sektion 12)
  - Datum uppdaterat till 16 december 2025

#### 3. Cookie Banner (GDPR-compliant)
- ✅ **Ny funktion**: Cookie consent banner med GDPR-hantering
  - Visar banner vid första besök
  - Användaren kan acceptera alla, endast nödvändiga, eller anpassa
  - Teknisk implementation:
    - `localStorage` för att spara consent
    - `dataLayer` integration för Google Tag Manager
    - Default: `denied` för analytics och ad storage
    - Aktiv borttagning av cookies/localStorage/sessionStorage vid decline
    - "Cookie-inställningar" knapp i footer för att ändra val

#### 4. Footer uppdaterad
- ✅ **Ny funktion**: "Cookie-inställningar" knapp
  - Både i marketing-footer och legal-footer
  - Öppnar cookie consent modal
  - TypeScript-deklaration för `window.showCookieSettings`

### Filer skapade/modifierade

**Nya filer:**
- `app/(legal)/privacy-choices/page.tsx` - Privacy choices-sida
- `public/scripts/cookie-banner-custom.js` - Cookie banner logik

**Modifierade filer:**
- `app/(legal)/integritetspolicy/page.tsx` - App Store-förtydliganden
- `app/layout.tsx` - Cookie banner script & dataLayer init
- `components/shared/Footer.tsx` - Cookie-inställningar knapp
- `CHANGELOG_20251216.md` - Denna fil

### Status
- ✅ **App Store-redo**: Privacy choices-sida uppfyller Apples krav
- ✅ **GDPR-compliant**: Cookie banner med consent management
- ✅ **Deployed**: Pushad till GitHub, automatisk deploy via Vercel

---

## 📋 Integritetspolicy - Uppdateringar enligt juridiskt ändringsdokument

### Uppdateringar gjorda

#### 1. Tillämpningsområde (App vs webb)
- ✅ **Redan implementerat**: Policyn förtydligar att den gäller både appen och webbplatsen

#### 2. Konto & identitet
- ✅ **Redan implementerat**: 
  - Tydliggör att gratis kontonivå finns utan tidsbegränsning
  - Specifikation av obligatoriska fält vid registrering (e-post, förnamn, efternamn)
  - E-postverifiering nämnd

#### 3. Hunddata (ansvarsfriskrivning)
- ✅ **Redan implementerat**: 
  - Tydlig ansvarsfriskrivning att Flocken inte verifierar eller kontrollerar hunddata
  - Användaren ansvarar för sanningsenlig information

#### 4. Platsdata och GPS
- ✅ **Redan implementerat**: 
  - Helt ersatt enligt specifikation
  - Tydliggör att platsdata endast samlas vid aktiv promenad i Rasta-funktionen
  - Ingen bakgrundssamling
  - Användaren kan välja att spara/dela promenader
  - Rättslig grund specificerad

#### 5. Kommunikation & chatt
- ✅ **Redan implementerat**: 
  - Transparens om att meddelanden lagras på servrar
  - Tydliggör att Flocken inte tar del av innehåll
  - Undantagsfall för teknisk åtkomst specificerade

#### 6. Analys & tracking
- ✅ **Uppdaterat**: 
  - Kompletterat med specifikation av Google Analytics 4 och Meta (Facebook)
  - Förtydligat vad teknisk information används för

#### 7. Profilering & rekommendationer
- ✅ **Redan implementerat**: 
  - Tydliggör att rekommendationer är förslag, inte automatiserade beslut
  - Baseras på användarens egna val och filter

#### 8. Tredjepart & datalagring
- ✅ **Redan implementerat**: 
  - Supabase specificerad med EU-lagring (Irland)
  - Standardavtalsklausuler (SCC) nämnda för internationell överföring

#### 9. Radering, backup & inaktivitet
- ✅ **Uppdaterat**: 
  - Lagt till specifikation om säkerhetskopior (backups): sparas i upp till 7 dagar
  - Lagt till policy för inaktivitet: kontakt efter 365 dagar, radering efter ytterligare 30 dagar

#### 10. Support
- ✅ **Uppdaterat**: 
  - Lagt till specifikation om supportärenden: sparas i upp till 365 dagar
  - Längre lagring om pågående ärenden eller rättsliga krav

#### 11. Datum
- ✅ **Uppdaterat**: Senast uppdaterad-datum ändrat till 16 december 2025

---

## 🔧 Tekniska detaljer

### Filer modifierade
- `app/(legal)/integritetspolicy/page.tsx`
  - Lagt till backup-policy (7 dagar)
  - Lagt till inaktivitets-policy (365 dagar kontakt, +30 dagar radering)
  - Lagt till support-lagringspolicy (365 dagar)
  - Kompletterat analysavsnitt med GA4 och Meta-specifikationer
  - Uppdaterat datum till 16 december 2025

### Filer som inte behövde ändras
- `components/shared/Footer.tsx` - Länken `/integritetspolicy` var redan korrekt

---

## ✅ Status

**Status:** ✅ Klart och redo för deployment  
**Juridisk granskning:** Enligt ändringsdokument från juridiskt team  
**GDPR-kompatibilitet:** ✅ Fullt kompatibel  
**App Store-redo:** ✅ Ja  

---

## 📋 Sammanfattning

Alla ändringar från ändringsdokumentet har implementerats:
- ✅ 10 av 10 punkter uppdaterade/verifierade
- ✅ Juridiskt robust och defensiv formulering
- ✅ Transparent om databehandling
- ✅ GDPR-kompatibel
- ✅ Redo för App Store och Google Play

**Inga breaking changes** - endast förtydliganden och kompletteringar av befintlig policy.


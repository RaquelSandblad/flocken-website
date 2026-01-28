# Meta Pixel Setup - Flocken Website

**Senast uppdaterad:** 2026-01-28

---

## ✅ Status

**Pixel ID:** `854587690618895`  
**Status:** Implementerad och aktiv i produktion

---

## 📋 Setup Översikt

### Vad som är implementerat:

1. ✅ **Meta Pixel-kod i `app/layout.tsx`**
   - Pixel-scriptet laddas från `connect.facebook.net/en_US/fbevents.js`
   - Spårar `PageView` events automatiskt
   - Använder `NEXT_PUBLIC_META_PIXEL_ID` environment variable
   - Har noscript-fallback för användare utan JavaScript
   - Cookie consent integration (endast spårar efter användarens samtycke)

2. ✅ **Environment Variable konfigurerad i Vercel**
   - `NEXT_PUBLIC_META_PIXEL_ID` = `854587690618895`

---

## 🚀 Deployment

### Steg 1: Lägg till Environment Variable i Vercel

1. Gå till: https://vercel.com/dashboard
2. Välj projektet `flocken-website`
3. Gå till Settings → Environment Variables
4. Lägg till: `NEXT_PUBLIC_META_PIXEL_ID` = `854587690618895`
5. Välj alla miljöer (Production, Preview, Development)
6. Klicka "Save"

### Steg 2: Commit och Push

```powershell
cd "C:\Dev\flocken-website"

git add app/layout.tsx
git commit -m "feat: Add Meta Pixel for tracking PageView events"
git push raquel main
```

Vercel deployer automatiskt efter push.

---

## 🔍 Verifiering

### Kontrollera att pixeln är aktiv:

#### Metod 1: Via Browser Console

1. Öppna https://flocken.info
2. Tryck F12 (Developer Tools)
3. Gå till Console-fliken
4. Skriv: `fbq`
5. Om pixeln är laddad, kommer du se funktionen

#### Metod 2: Via Network Tab

1. Öppna Network-fliken i Developer Tools
2. Filtrera på "fbevents" eller "facebook"
3. Du bör se requests till `connect.facebook.net/en_US/fbevents.js`

#### Metod 3: Via View Source

1. Högerklicka på sidan → "View Page Source"
2. Sök efter "fbq" eller "fbevents"
3. Du bör se pixel-koden i `<head>`-sektionen

#### Metod 4: Via Meta Events Manager

1. Gå till: https://business.facebook.com/events_manager2
2. Välj Pixel ID: 854587690618895
3. Klicka på "Test Events"
4. Du bör se PageView events när du besöker webbplatsen

---

## 🔧 Lokal Utveckling

### Steg 1: Lägg till i `.env.local`

```bash
# Meta Pixel
NEXT_PUBLIC_META_PIXEL_ID=854587690618895
```

### Steg 2: Starta utvecklingsservern

```powershell
npm run dev
```

### Steg 3: Verifiera lokalt

1. Öppna http://localhost:3000
2. Öppna Developer Tools (F12)
3. Gå till Network-fliken
4. Filtrera på "facebook" eller "fbevents"
5. Du bör se requests till `connect.facebook.net/en_US/fbevents.js`

---

## 🐛 Troubleshooting

### Pixel spårar inte events

1. **Kontrollera att `NEXT_PUBLIC_META_PIXEL_ID` är satt:**
   - Verifiera i `.env.local` (lokalt) eller Vercel (produktion)
   - Starta om utvecklingsservern efter att ha lagt till variabeln

2. **Kontrollera cookie consent:**
   - Pixel spårar endast efter användarens samtycke
   - Verifiera att cookie banner visar "consent granted"
   - Kolla localStorage: `localStorage.getItem('cookie-consent')`

3. **Kontrollera i browser console:**
   - Öppna Developer Tools (F12)
   - Gå till Console-fliken
   - Leta efter felmeddelanden relaterade till `fbq` eller `facebook`

4. **Kontrollera att pixel-koden laddas:**
   - I Network-fliken, leta efter `fbevents.js`
   - Kontrollera att den laddas korrekt (status 200)

### Cookie Consent Problem

**Problem:** GA4 och Meta Pixel fick ingen data trots korrekt GTM-konfiguration.

**Orsak:** Mismatch i localStorage key naming:
- Cookie banner sparade: `cookie-consent` (med bindestreck)
- Layout.tsx läste: `cookie_consent` (med understreck)

**Lösning:** Använd `cookie-consent` konsekvent (med bindestreck).

**Verifiera consent:**
```javascript
localStorage.getItem('cookie-consent')
```

---

## 📊 Nästa Steg

När pixeln är deployad och fungerar:
- ✅ PageView events kommer automatiskt spåras
- ✅ Du kan se data i Meta Events Manager
- ✅ Du kan använda pixel-data för att skapa custom audiences
- ✅ Du kan optimera kampanjer baserat på pixel-data

---

## 🔗 Länkar

- **Meta Ads Manager:** https://business.facebook.com/adsmanager/manage/campaigns?act=1648246706340725
- **Meta Events Manager:** https://business.facebook.com/events_manager2
- **Meta Business Manager:** https://business.facebook.com

---

## 📚 Relaterad Dokumentation

- [Meta Ads Complete Guide](./META_ADS_COMPLETE_GUIDE.md)
- [Meta Ads Troubleshooting](./META_ADS_TROUBLESHOOTING.md)
- [Tracking Setup Complete](../tracking/TRACKING_SETUP_COMPLETE.md)

---

**Senast uppdaterad:** 2026-01-28

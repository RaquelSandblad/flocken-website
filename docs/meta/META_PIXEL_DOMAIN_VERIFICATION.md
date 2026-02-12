# Meta Pixel Domain Verification Guide

## Problem: Inga events syns i Meta Events Manager

Om Events Manager visar "localhost" istället för "flocken.info", behöver du verifiera domänen i Meta.

## Steg 1: Verifiera domänen i Meta Business Manager

**Alternativ 1: Via Business Settings (Företagsinställningar)**

1. Gå till **Meta Business Manager**: https://business.facebook.com
2. Klicka på **Business Settings** (Företagsinställningar) i vänstermenyn
3. Leta efter **"Domäner"** eller **"Domains"** i vänstermenyn
   - Det kan vara direkt under Business Settings
   - Eller under en sektion som "Säkerhet" eller "Brand Safety"
4. Klicka på **Add** (Lägg till) eller **"Lägg till domän"**
5. Lägg till: `flocken.info`
6. Välj verifieringsmetod:
   - **DNS TXT Record** (rekommenderat)
   - **HTML File Upload**
   - **Meta Tag**

**Alternativ 2: Via Events Manager (Enklare väg)**

1. Gå till **Events Manager**: https://business.facebook.com/events_manager2
2. Välj din pixel: **Flocken - Web** (ID: 854587690618895)
3. Gå till fliken **Settings** (Inställningar)
4. Under **Domains** (Domäner), klicka på **Add Domain** (Lägg till domän)
5. Om domänen inte är verifierad, klicka på **Verify Domain** (Verifiera domän)
6. Följ instruktionerna för att verifiera domänen

### DNS TXT Record (Rekommenderat)

1. Meta ger dig en TXT record att lägga till i DNS
2. Lägg till TXT record i din DNS-hanterare (t.ex. Vercel, Cloudflare, etc.)
3. Vänta på att DNS propagates (kan ta några minuter till timmar)
4. Klicka på **Verify** i Meta Business Manager

### HTML File Upload

1. Meta ger dig en HTML-fil att ladda upp
2. Ladda upp filen till `/public` mappen i ditt projekt
3. Deploya till Vercel
4. Klicka på **Verify** i Meta Business Manager

### Meta Tag

1. Meta ger dig en `<meta>` tag
2. Lägg till taggen i `app/layout.tsx` i `<head>` sektionen
3. Deploya till Vercel
4. Klicka på **Verify** i Meta Business Manager

## Steg 2: Koppla domänen till Pixel

1. Gå till **Events Manager**: https://business.facebook.com/events_manager2
2. Välj din pixel: **Flocken - Web** (ID: 854587690618895)
3. Gå till fliken **Settings** (Inställningar)
4. Under **Domains** (Domäner), klicka på **Add Domain** (Lägg till domän)
5. Välj den verifierade domänen: `flocken.info`
6. Spara

## Steg 3: Verifiera att pixel fungerar

### Test Events (Rekommenderat för testning)

1. I Events Manager, gå till fliken **Test Events**
2. Öppna `https://flocken.info` i en ny inkognito/private webbläsare
3. Acceptera marketing cookies
4. Du bör se PageView events i realtid i Test Events

### Vanliga Events

- Events kan ta **upp till 30 minuter** att synas i Events Manager
- Events syns bara om användaren har accepterat marketing cookies
- Events syns bara för verifierade domäner

## Steg 4: Felsökning

### Inga events syns trots att pixel laddas

1. **Kontrollera att domänen är verifierad**:
   - Business Settings → Domains (eller Events Manager → Settings → Domains)
   - `flocken.info` ska vara verifierad (grön bock)

2. **Kontrollera att pixel är kopplad till domänen**:
   - Events Manager → Settings → Domains
   - `flocken.info` ska finnas i listan

3. **Kontrollera cookie consent**:
   - Öppna Developer Tools → Console
   - Skriv: `localStorage.getItem('cookie_consent')`
   - Kontrollera att `marketing: true`

4. **Kontrollera att pixel laddas**:
   - Öppna Developer Tools → Network
   - Filtrera på "facebook" eller "fbevents"
   - Du bör se requests till `connect.facebook.net`

5. **Kontrollera att PageView skickas**:
   - Öppna Developer Tools → Network
   - Filtrera på "facebook.com/tr"
   - Du bör se requests med `ev=PageView`

### Events syns i Test Events men inte i vanliga Events

- Detta är normalt! Test Events visar events i realtid för testning
- Vanliga events kan ta upp till 30 minuter att synas
- Events syns bara för användare som har accepterat marketing cookies

## Ytterligare tips

1. **Använd Test Events för snabb verifiering**: Events syns direkt i Test Events-fliken
2. **Vänta 30 minuter**: Vanliga events kan ta tid att synas
3. **Kontrollera datumintervall**: Se till att du tittar på rätt datum i Events Manager
4. **Kontrollera att pixel ID är korrekt**: `854587690618895` ska matcha i både kod och Events Manager

## Support

Om problemet kvarstår efter att ha följt denna guide:
1. Kontrollera Meta Events Manager Diagnostics
2. Kontakta Meta Support
3. Kontrollera att inga ad blockers blockerar pixeln


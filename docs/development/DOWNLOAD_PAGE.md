# Download Page - Automatisk App Store Redirect

## Översikt

Sidan `/download` automatiskt redirectar användare till rätt app store baserat på deras enhet:
- **iOS (iPhone/iPad)** → App Store
- **Android** → Google Play
- **Desktop/Okänt** → Manual selection page

## Implementation

### Filer

1. **`app/download/route.ts`** - Server-side redirect baserat på User-Agent (hanterar alla GET-requests)
2. **`app/download/manual/page.tsx`** - Manual selection för desktop-användare

### Miljövariabler (Valfria)

Sidorna fungerar med fallback-värden, men du kan lägga till dessa i `.env.local` och Vercel:

```env
NEXT_PUBLIC_FLOCKEN_APPSTORE_URL=https://apps.apple.com/app/flocken/id6755424578
NEXT_PUBLIC_FLOCKEN_PLAYSTORE_URL=https://play.google.com/store/apps/details?id=com.bastavan.app
```

**Standardvärden (används om miljövariabler saknas):**
- App Store: `https://apps.apple.com/app/flocken/id6755424578`
- Google Play: `https://play.google.com/store/apps/details?id=com.bastavan.app`

## Funktioner

### ✅ Automatisk Device Detection
- Detekterar iOS (iPhone, iPad, iPod)
- Detekterar Android
- Desktop/okänt → manual page

### ✅ UTM Parameter Preservation
- Alla query parameters (t.ex. `?utm_source=facebook&utm_campaign=test`) behålls i redirecten
- Fungerar för både App Store och Google Play (där App Store tillåter)

### ✅ Tracking
- Använder `trackAppInstall()` för att spåra klick
- Events: `download_page`, `download_manual`

### ✅ Design
- Använder Flockens design system
- Responsive layout
- Gradient bakgrund
- App Store och Google Play ikoner

## Användning

### I QR-koder
```
https://flocken.info/download
```

### Med UTM-parametrar
```
https://flocken.info/download?utm_source=facebook&utm_campaign=launch
```

### I annonser
Använd `/download` som destination URL i Meta Ads, Google Ads, etc.

## Testning

### iPhone/iPad
1. Öppna `https://flocken.info/download` på iPhone/iPad
2. Skulle redirecta till App Store automatiskt

### Android
1. Öppna `https://flocken.info/download` på Android-enhet
2. Skulle redirecta till Google Play automatiskt

### Desktop
1. Öppna `https://flocken.info/download` på desktop
2. Skulle visa manual selection page med två knappar

## Tekniska Detaljer

### User-Agent Detection
- iOS: `iphone`, `ipad`, `ipod`, eller `macintosh` + `mobile` (iPadOS)
- Android: `android`
- Desktop: Allt annat

### Redirect Status
- Använder `302 Found` (temporary redirect) för bättre SEO och caching

### Query Parameter Handling
- Alla query params från original request kopieras till destination URL
- Fungerar med både App Store och Google Play URLs

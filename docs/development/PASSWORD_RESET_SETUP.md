# Lösenordsåterställning - Konfiguration

## Översikt

Två sidor har skapats för säker lösenordsåterställning:

1. **`/auth/confirm`** - Verifierar token från email-länkar
2. **`/reset-password`** - Formulär för att ange nytt lösenord

## Konfiguration

### 1. Supabase Environment Variables

Skapa en `.env.local` fil i projektets root med:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Hämta dessa värden från:
- Supabase Dashboard → Settings → API

### 2. Supabase Dashboard Konfiguration

#### URL Configuration
Gå till: `Authentication → URL Configuration`

- **Site URL:** `https://flocken.info`
- **Redirect URLs** (lägg till):
  - `https://flocken.info/auth/confirm`
  - `https://flocken.info/reset-password`

#### Email Template
Gå till: `Authentication → Email → Reset password`

Uppdatera email-länken till:
```
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery
```

## Säkerhet

✅ **Implementerat:**
- Token verifieras via Supabase SDK
- Session skapas säkert (cookies/local storage)
- Open-redirect skydd (endast samma origin)
- Inga tokens i URL efter verifiering
- Lösenordsvalidering (minst 6 tecken, matchar)

## Testning

### Lokalt
1. Starta dev-server: `npm run dev`
2. Testa: `http://localhost:3000/auth/confirm` (utan params) → ska visa fel
3. Testa: `http://localhost:3000/reset-password` (utan session) → ska visa fel

### Production
1. Testa "glömt lösenord" i appen
2. Öppna email på dator
3. Klicka på länken → ska ta dig genom confirm → reset-form

## Flöde

```
1. Användare klickar "glömt lösenord" i appen
   ↓
2. Supabase skickar email med länk
   ↓
3. Användare klickar länk → /auth/confirm?token_hash=xxx&type=recovery
   ↓
4. Token verifieras → Session skapas → Redirect till /reset-password
   ↓
5. Användare anger nytt lösenord → Uppdateras via Supabase
   ↓
6. Success → Redirect till startsidan
```

## Filer

- `lib/supabase/client.ts` - Supabase client utility
- `app/auth/confirm/page.tsx` - Token-verifiering
- `app/reset-password/page.tsx` - Lösenordsformulär


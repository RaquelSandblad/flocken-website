# Support System - Ärendehantering

Ett eget ärendehanteringssystem för Spitakolus-appar med AI-klassificering.

## Översikt

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Flocken App    │     │  Framtida App   │     │  Webb           │
│  (React Native) │     │  (React Native) │     │  (Next.js)      │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  Supabase              │
                    │  (support-system)      │
                    │                        │
                    │  • issues              │
                    │  • apps                │
                    │  • issue_responses     │
                    └───────────┬────────────┘
                                │
                    ┌───────────┴────────────┐
                    │                        │
                    ▼                        ▼
         ┌──────────────────┐    ┌──────────────────┐
         │  Edge Function   │    │  MCP Server      │
         │  (AI-klassif.)   │    │  (hantering)     │
         └──────────────────┘    └──────────────────┘
```

## Setup-steg (gör i denna ordning)

### Steg 1: Skapa nytt Supabase-projekt

1. Gå till https://supabase.com/dashboard
2. Klicka **"New Project"**
3. Namn: `spitakolus-support`
4. Region: **EU (Frankfurt)**
5. **Spara lösenordet!**
6. Vänta tills projektet är klart

### Steg 2: Kör databasschema

1. Gå till **SQL Editor** i Supabase
2. Klicka **"New Query"**
3. Kopiera innehållet från `supabase/schema.sql`
4. Klicka **"Run"**
5. Kör sedan `supabase/seed.sql` för att lägga till Flocken som app

### Steg 3: Spara API-nycklar

1. Gå till **Project Settings** → **API**
2. Kopiera:
   - `Project URL` (t.ex. `https://abc123.supabase.co`)
   - `service_role` key (den hemliga, INTE anon key)

### Steg 4: Bygg och konfigurera MCP-servern

```bash
cd support-system/mcp-server
npm install
npm run build
```

Lägg till i `C:/Dev/flocken-website/.claude/mcp.json`:

```json
{
  "mcpServers": {
    "ab-testing-stats": { ... },
    "support-system": {
      "command": "node",
      "args": ["C:/Dev/flocken-website/support-system/mcp-server/dist/index.js"],
      "env": {
        "SUPPORT_SUPABASE_URL": "https://DIN_PROJECT_REF.supabase.co",
        "SUPPORT_SUPABASE_SERVICE_KEY": "eyJ..."
      }
    }
  }
}
```

### Steg 5: (Valfritt) Konfigurera Edge Function för AI-klassificering

Se `supabase/functions/README.md` för instruktioner.

### Steg 6: Integrera i appen

1. Kopiera `app-component/support-client.ts` till appen
2. Uppdatera `SUPPORT_SUPABASE_URL` och `SUPPORT_SUPABASE_ANON_KEY`
3. Kopiera `app-component/ReportIssueForm.tsx`
4. Lägg till formuläret i appen (t.ex. i inställningar eller hjälp-sektion)

## Filer

```
support-system/
├── README.md                    # Denna fil
├── supabase/
│   ├── schema.sql              # Databasschema (kör manuellt)
│   ├── seed.sql                # Testdata (valfritt)
│   └── functions/
│       └── classify-issue/     # Edge Function för AI
├── app-component/
│   ├── ReportIssueForm.tsx     # React Native-komponent
│   └── support-client.ts       # Supabase-klient för support
└── mcp-server/
    ├── src/
    │   └── index.ts            # MCP-server
    └── README.md
```

## Säkerhet

- Row Level Security (RLS) är aktiverat
- Användare kan bara se sina egna ärenden
- Admin-åtkomst via service_role key (endast MCP/backend)

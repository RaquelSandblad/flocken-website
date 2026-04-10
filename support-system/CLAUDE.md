# CLAUDE.md - Support System

Detta dokument hjälper Claude Code (eller Cursor) att snabbt sätta sig in i projektet.

## Vad är detta?

Ett ärendehanteringssystem för Spitakolus-appar (Flocken, Nästa Hem, etc.) med:
- Formulär i appen för att rapportera problem
- AI-klassificering (prioritet, behöver svar?)
- MCP-server för att hantera ärenden via Claude

## Status

| Komponent | Status | Plats |
|-----------|--------|-------|
| Databasschema | ✅ Klar | `supabase/schema.sql` |
| Seed-data (Flocken) | ✅ Klar | `supabase/seed.sql` |
| Edge Function (AI) | ✅ Klar | `supabase/functions/classify-issue/` |
| React Native-komponent | ✅ Klar | `app-component/` |
| MCP-server | ✅ Klar | `mcp-server/` |
| Supabase-projekt | ❌ Ej skapat | Manuellt steg |
| MCP konfigurerad | ❌ Ej gjort | Behöver Supabase-credentials |
| Integration i app | ❌ Ej gjort | Utvecklaren gör detta |

## Nästa steg (i ordning)

### 1. Skapa Supabase-projekt
- Gå till https://supabase.com/dashboard
- Skapa projekt: `spitakolus-support`
- Region: EU (Frankfurt)
- **Spara lösenordet!**

### 2. Kör databasschema
```sql
-- I Supabase SQL Editor, kör:
-- 1. Innehållet i supabase/schema.sql
-- 2. Innehållet i supabase/seed.sql
```

### 3. Hämta API-nycklar
- Project Settings → API
- Kopiera: `Project URL` + `service_role` key

### 4. Bygg MCP-servern
```bash
cd support-system/mcp-server
npm install
npm run build
```

### 5. Konfigurera MCP
Lägg till i `.claude/mcp.json`:
```json
{
  "mcpServers": {
    "support-system": {
      "command": "node",
      "args": ["FULL_PATH/support-system/mcp-server/dist/index.js"],
      "env": {
        "SUPPORT_SUPABASE_URL": "https://xxx.supabase.co",
        "SUPPORT_SUPABASE_SERVICE_KEY": "eyJ..."
      }
    }
  }
}
```

### 6. (Valfritt) Konfigurera Edge Function
Se `supabase/functions/README.md`

### 7. Integrera i appen
- Ge `app-component/` till app-utvecklaren
- De uppdaterar credentials i `support-client.ts`
- De lägger till `ReportIssueForm.tsx` i appen

## Arkitektur

```
┌─────────────┐     ┌─────────────┐
│ Flocken App │     │ Nästa Hem   │
└──────┬──────┘     └──────┬──────┘
       │                   │
       └─────────┬─────────┘
                 │
                 ▼
┌────────────────────────────┐
│  Supabase                  │
│  (spitakolus-support)      │
│                            │
│  Tabeller:                 │
│  • apps                    │
│  • issues                  │
│  • issue_responses         │
│  • issue_events            │
└────────────┬───────────────┘
             │
     ┌───────┴───────┐
     │               │
     ▼               ▼
┌─────────┐    ┌─────────────┐
│ Edge    │    │ MCP Server  │
│ Function│    │ (Claude)    │
│ (AI)    │    │             │
└─────────┘    └─────────────┘
```

## Filstruktur

```
support-system/
├── CLAUDE.md                    # ← Du läser denna
├── README.md                    # Dokumentation för människor
├── supabase/
│   ├── schema.sql              # Databasschema
│   ├── seed.sql                # Lägg till Flocken som app
│   └── functions/
│       ├── README.md           # Instruktioner
│       └── classify-issue/     # AI-klassificering
│           └── index.ts
├── app-component/
│   ├── support-client.ts       # Supabase-klient
│   └── ReportIssueForm.tsx     # React Native UI
└── mcp-server/
    ├── package.json
    ├── tsconfig.json
    ├── README.md
    └── src/
        └── index.ts            # MCP-server
```

## Nyckelkoncept

### AI-klassificering
- **Priority:** emergency > high > medium > low
- **Emergency:** GDPR (radera konto), säkerhet, betalning
- **needs_response:** true om användaren förväntar sig svar

### MCP-verktyg
- `list_issues` - Lista ärenden (filter på status/prioritet/app)
- `get_issue` - Detaljer för ett ärende
- `update_issue` - Uppdatera status/tilldelning
- `respond_to_issue` - Skriv svar till användare
- `get_stats` - Statistik

## Framtida förbättringar

- [ ] Email-utskick via Resend/SendGrid
- [ ] Slack-notis vid emergency
- [ ] Push-notis till användare
- [ ] Dashboard (webb)
- [ ] Automatisk stängning av inaktiva ärenden

## Relaterade projekt

- `flocken-website` - Flocken webbplats
- `para-hund-main` - Flocken-appen (Expo/React Native)
- `nastahem` - Nästa Hem
- `spitakolus` - Delad dokumentation

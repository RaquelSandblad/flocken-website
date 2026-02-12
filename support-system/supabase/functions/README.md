# Supabase Edge Functions

## Setup

### 1. Installera Supabase CLI

```bash
npm install -g supabase
```

### 2. Logga in

```bash
supabase login
```

### 3. Länka till projektet

```bash
cd support-system/supabase
supabase link --project-ref YOUR_PROJECT_REF
```

(Hitta project-ref i Supabase Dashboard → Project Settings → General)

### 4. Sätt secrets

```bash
# Anthropic API key för AI-klassificering
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

### 5. Deploya funktionen

```bash
supabase functions deploy classify-issue
```

## Database Webhook (automatisk klassificering)

För att automatiskt klassificera nya ärenden, skapa en Database Webhook:

1. Gå till Supabase Dashboard → Database → Webhooks
2. Klicka "Create a new hook"
3. Konfigurera:
   - Name: `classify-new-issue`
   - Table: `issues`
   - Events: `INSERT`
   - Type: `Supabase Edge Function`
   - Function: `classify-issue`
4. Spara

Nu klassificeras varje nytt ärende automatiskt!

## Manuell klassificering

Du kan också klassificera manuellt via API:

```bash
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/classify-issue' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"issue_id": "uuid-here"}'
```

## Testa lokalt

```bash
supabase functions serve classify-issue --env-file .env.local
```

Skapa `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

# Support System MCP Server

Hantera supportärenden direkt via Claude Code.

## Setup

### 1. Installera dependencies

```bash
cd support-system/mcp-server
npm install
npm run build
```

### 2. Konfigurera Claude Code

Lägg till i din Claude Code MCP-konfiguration (`.claude/mcp.json` eller `~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "support-system": {
      "command": "node",
      "args": ["C:/Dev/flocken-website/support-system/mcp-server/dist/index.js"],
      "env": {
        "SUPPORT_SUPABASE_URL": "https://YOUR_PROJECT.supabase.co",
        "SUPPORT_SUPABASE_SERVICE_KEY": "eyJ..."
      }
    }
  }
}
```

**VIKTIGT:** Använd `service_role` key (inte anon key) för att få admin-åtkomst.

Hitta dina nycklar i Supabase Dashboard → Project Settings → API.

### 3. Starta om Claude Code

## Användning

### Lista ärenden

```
Visa alla nya supportärenden
```

```
Visa emergency-ärenden för flocken
```

```
Visa ärenden som behöver svar
```

### Detaljer

```
Visa detaljer för ärende abc123
```

### Uppdatera

```
Markera ärende abc123 som löst med anteckning "Fixat i version 1.2.4"
```

```
Tilldela ärende abc123 till Torbjörn
```

### Svara

```
Skriv ett svar till användaren på ärende abc123: "Tack för att du rapporterade detta! Vi har fixat problemet och det kommer i nästa uppdatering."
```

### Statistik

```
Visa supportstatistik
```

## Verktyg

| Verktyg | Beskrivning |
|---------|-------------|
| `list_issues` | Lista ärenden med filter |
| `get_issue` | Visa detaljer för ett ärende |
| `update_issue` | Uppdatera status/tilldelning |
| `respond_to_issue` | Skriv svar till användare |
| `get_stats` | Visa statistik |
| `list_apps` | Lista registrerade appar |

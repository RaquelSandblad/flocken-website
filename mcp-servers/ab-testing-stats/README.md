# A/B Testing Stats MCP Server

MCP-server för att analysera A/B-testexperiment med data från BigQuery.

## Installation

```bash
cd mcp-servers/ab-testing-stats
npm install
npm run build
```

## Konfiguration

### 1. Lägg till i Claude Code

Lägg till följande i din `claude_desktop_config.json` eller `.claude/settings.json`:

```json
{
  "mcpServers": {
    "ab-testing-stats": {
      "command": "node",
      "args": ["C:/Dev/flocken-website/mcp-servers/ab-testing-stats/dist/index.js"],
      "env": {
        "GOOGLE_ADS_SERVICE_ACCOUNT_JSON": "<service account JSON från .env.local>"
      }
    }
  }
}
```

### 2. Starta om Claude Code

Efter konfiguration, starta om Claude Code för att ladda MCP-servern.

## Tillgängliga verktyg

### `get_experiment_stats`

Hämta fullständig statistik för ett experiment.

**Exempel:**
```
Hur går experimentet valkommen_hero_v1?
```

**Returnerar:**
- Visningar och konverteringar per variant
- Konverteringsgrad
- Statistisk signifikans (p-värde)
- Bayesian sannolikhet
- Rekommendation

### `list_experiments`

Lista alla experiment som har data.

**Exempel:**
```
Vilka A/B-tester körs just nu?
```

### `get_daily_breakdown`

Daglig uppdelning av experimentets prestanda.

**Exempel:**
```
Visa daglig data för valkommen_hero_v1
```

### `calculate_sample_size`

Beräkna hur många besökare som behövs.

**Exempel:**
```
Hur många besökare behövs för att testa en 20% förbättring på en sida med 5% konvertering och 100 besökare per dag?
```

### `compare_variants`

Jämför varianter manuellt (utan BigQuery).

**Exempel:**
```
Jämför: kontroll 1000 besökare 50 konverteringar, variant 1000 besökare 75 konverteringar
```

## Statistiska metoder

### Frequentist (Z-test)

- Tvåsidigt z-test för proportioner
- 95% konfidensintervall
- P-värde beräkning

### Bayesian

- Beta-fördelning som prior (Beta(1,1))
- Monte Carlo-simulering (100,000 iterationer)
- P(variant > kontroll) beräkning

## Utveckling

```bash
# Kör med hot-reload
npm run dev

# Bygg för produktion
npm run build

# Starta produktionsversion
npm start
```

## Krav

- Node.js 18+
- BigQuery-åtkomst med service account
- GA4 → BigQuery export konfigurerad

# Make.com — Blueprint API Guide

> Interna lärdomar från att styra Make-scenarier via Claude/MCP.
> Uppdaterad: 2026-04-16

---

## Bakgrund

Vi styr Make via dess MCP-server (`mcp__748fa753...`). Det innebär att Claude kan skapa,
uppdatera, aktivera och deaktivera scenarier helt via prompt — utan att Torbjörn behöver
öppna Make-UI:t. Det finns dock ett antal gotchas som inte framgår av Make:s dokumentation.

---

## Kritiska lärdomar — utan dessa funkar inte API-skapade scenarier

### 1. `to`-fältet i Gmail är en array
```json
// FEL
"to": "{{1.`4`}}"

// RÄTT
"to": ["{{1.`4`}}"]
```

### 2. `from`-fältet måste matcha exakt Gmail-alias
`from` är ett SELECT-fält som hämtar konfigurerade "Send as"-adresser via RPC.
Använd alltid `rpc_execute` för att hämta tillgängliga värden INNAN du skapar scenariot:

```
app: google-email
version: 4
rpc: listSendAsEmails
data: { "__IMTCONN__": <connection_id> }
```

Exempel på returnerat värde (använd `value`-fältet exakt):
```
"\"Torbjörn i Flocken-teamet\" <torbjorn@flocken.info>"
```

### 3. `restore`-sektionen krävs för att UI:t ska visa värden
Utan `restore` i metadata sparas data korrekt i API:t men Make-UI:t visar tomma fält.
Dessutom riskerar man att UI:t skriver över med tomma värden om någon redigerar manuellt.

Minimal `restore` för Gmail-modulen:
```json
"restore": {
  "expect": {
    "to": { "mode": "edit" },
    "cc": { "mode": "chose" },
    "bcc": { "mode": "chose" },
    "from": { "mode": "chose", "label": "<exakt alias-sträng>" },
    "bodyType": { "label": "Raw HTML" },
    "attachments": { "mode": "chose" },
    "emailHeaders": { "mode": "chose" }
  },
  "parameters": {
    "__IMTCONN__": {
      "data": { "scoped": "true", "connection": "google-email" },
      "label": "My Gmail connection (tb.sandblad@gmail.com)"
    }
  }
}
```

### 4. `parameters` ska vara objekt, inte array
```json
// FEL
"parameters": [{ "name": "__IMTCONN__", ... }]

// RÄTT
"parameters": { "__IMTCONN__": 5931565 }
```

### 5. Scheduling-interval är i sekunder, inte minuter
```
7 minuter = interval: 420
4 minuter = interval: 240
```
Minimum: 60 sekunder.

### 6. Scenarier kan inte köras via API om de är inaktiva
`scenarios_run` kräver att scenariot är aktiverat. Använd `scenarios_activate` först,
eller be användaren köra "Run once" manuellt i UI:t för testkörnig.

---

## Korrekt arbetsflöde för att skapa ett nytt scenario

```
1. Hämta tillgängliga Gmail-alias via rpc_execute (listSendAsEmails)
2. Validera varje modul med validate_module_configuration
3. Skapa med scenarios_create med full blueprint inkl. restore-metadata
4. Verifiera att isinvalid: false i svaret
5. Aktivera med scenarios_activate
```

---

## Aktiva scenarier (2026-04-16)

| Namn | ID | Trigger | Limit | Sheet |
|------|----|---------|-------|-------|
| (hunddagis) Integration Google Sheets, Gmail | 4999472 | var 4 min | 4 | hunddagis_sverige_master |
| (hunddagis NO) Integration Google Sheets, Gmail | 5312430 | var 7 min | 3 | hunddagis_no_master_final_CLEAN |
| (kennlar) Integration Google Sheets, HTTP, Gmail | 4849926 | var 7 min | - | - |

**Kopplings-ID:n:**
- Google Sheets: `3638070`
- Gmail (tb.sandblad@gmail.com): `5931565`
- Team ID: `487667`
- Org ID: `5740673`

---

## Kolumnmappning — norska sheetet

| Kolumn | Index | Innehåll |
|--------|-------|---------|
| A | 0 | namn |
| B | 1 | friendly_name ← `{{1.\`1\`}}` i mejl |
| C | 2 | stad |
| D | 3 | lan |
| E | 4 | email ← `{{1.\`4\`}}` som mottagare |
| F | 5 | hemsida |
| G | 6 | facebook |
| H | 7 | kalla |
| I | 8 | skickat ← filter + markera |
| J | 9 | datum |
| K | 10 | tid |

Filter i Google Sheets-modulen använder kolumnbokstäver (E, I), inte index.
Update row-modulen använder index (8, 9, 10).

---

## Vanliga promptmönster

**Ändra limit:**
> "Ändra limit till X i det norska scenariot"

**Pausa flödet:**
> "Pausa det norska Make-scenariot"
→ `scenarios_deactivate(5312430)`

**Starta flödet:**
> "Starta det norska Make-scenariot"
→ `scenarios_activate(5312430)`

**Ny lista:**
> "Skapa ett danskt hunddagis-scenario baserat på det norska, med sheet-ID X"
→ Klona blueprint, byt spreadsheetId + sheetId, validera, skapa

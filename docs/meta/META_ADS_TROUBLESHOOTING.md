# Meta Ads Scripts - Troubleshooting Guide

## Vanliga Problem och Lösningar

### 1. "serialize binary: invalid int 32" Error

**Problem:** Scriptet hänger sig eller ger fel när stora nummer hanteras.

**Orsak:** 
- Meta API returnerar nummer som strings
- `parseInt()` kan orsaka problem med stora nummer (> 2^31)
- Serialisering av stora nummer kan misslyckas

**Lösning:**
- Använd `Number()` istället för `parseInt()` för stora nummer
- Använd `parseFloat()` för decimaltal
- Scripten är nu uppdaterade för att hantera detta korrekt

**Exempel:**
```javascript
// ❌ Fel - kan orsaka overflow
const value = parseInt("4294967295"); 

// ✅ Rätt - hanterar stora nummer korrekt
const value = Number("4294967295");
```

---

### 2. Timeout Errors

**Problem:** API-anrop tar för lång tid och timeoutar.

**Lösning:**
- Scripten har nu timeout på 30 sekunder per request
- Retry-logik med exponentiell backoff
- Begränsad response-storlek (10MB max)

**Om problemet kvarstår:**
- Minska antalet dagar i analysen (t.ex. 7 dagar istället för 30)
- Analysera färre ad sets/ads åt gången
- Kontrollera internetanslutning

---

### 3. Felaktiga Valuta-värden

**Problem:** Spend, CPC, CPM visas som 0.02 SEK istället för 2 SEK.

**Orsak:** 
- Meta API returnerar belopp direkt i SEK (inte i öre)
- Scriptet delade tidigare med 100 (felaktigt)

**Lösning:**
- Scripten är nu uppdaterade för att visa korrekta värden
- `formatCurrency()` använder nu `parseFloat()` direkt utan division

---

### 4. "Connection Error" eller Scriptet Hänger Sig

**Problem:** Scriptet startar men hänger sig eller ger connection errors.

**Möjliga orsaker:**
1. **Stora datamängder** - För många API-anrop samtidigt
2. **Rate limiting** - Meta API begränsar antalet requests
3. **Timeout** - Enskilda requests tar för lång tid
4. **Nätverksproblem** - Instabil internetanslutning

**Lösningar:**

1. **Minska datamängd:**
   ```bash
   # Analysera kortare period
   node scripts/analyze-campaigns.js 7  # 7 dagar istället för 30
   ```

2. **Lägg till delay mellan requests:**
   - Scripten har nu inbyggd retry-logik med delays
   - Om problemet kvarstår, öka delay-tiden

3. **Kontrollera API-token:**
   ```bash
   # Testa att token fungerar
   node scripts/test-flocken-meta-access.js
   ```

4. **Kör enklare analys först:**
   ```bash
   # Enklare analys utan ad-level data
   node scripts/analyze-campaigns.js 7
   ```

---

### 5. "Meta API Error: Invalid access token"

**Problem:** Access token är ogiltig eller har gått ut.

**Lösning:**
1. Kontrollera att token finns i `.env.local`:
   ```
   META_ACCESS_TOKEN=din_token_här
   ```

2. Verifiera att token har rätt permissions:
   - `ads_read`
   - `ads_management` (om du ska ändra kampanjer)

3. Generera ny token om den har gått ut:
   - Följ instruktioner i `scripts/get-meta-token-instructions.md`

---

### 6. Scriptet Kör Men Visar Ingen Data

**Problem:** Scriptet kör utan fel men visar "Ingen data för denna period".

**Möjliga orsaker:**
1. **Fel datumintervall** - Perioden har ingen aktivitet
2. **Fel ad account ID** - Analyserar fel konto
3. **Kampanjer är pausade** - Inga aktiva kampanjer i perioden

**Lösning:**
1. Kontrollera datumintervall:
   ```bash
   # Testa med längre period
   node scripts/analyze-campaigns.js 60  # 60 dagar
   ```

2. Verifiera ad account ID:
   - Standard: `act_1648246706340725`
   - Kontrollera i `.env.local` eller Meta Ads Manager

3. Kontrollera kampanjstatus:
   ```bash
   node scripts/list-full-structure.js
   ```

---

## Best Practices

### 1. Kör Scripten I Rätt Ordning

```bash
# 1. Testa access först
node scripts/test-flocken-meta-access.js

# 2. Lista struktur
node scripts/list-full-structure.js

# 3. Enkel analys
node scripts/analyze-campaigns.js 7

# 4. Detaljerad analys (tar längre tid)
node scripts/analyze-campaigns-detailed.js 7
```

### 2. Använd Kortare Perioder Först

- Starta med 7 dagar för snabb feedback
- Öka till 30 dagar när du vet att det fungerar
- Undvik 90+ dagar om du har många kampanjer

### 3. Övervaka API Rate Limits

Meta API har rate limits:
- ~200 requests per timme per app
- ~4800 requests per dag per app

Om du får rate limit errors:
- Vänta 1 timme
- Minska antalet requests (färre dagar, färre ad sets)

---

## Debugging Tips

### 1. Aktivera Debug Output

Lägg till `console.log()` för att se vad som händer:

```javascript
console.log('Fetching:', path);
const result = await makeRequest(path);
console.log('Got result:', JSON.stringify(result).substring(0, 200));
```

### 2. Testa Enskilda API-anrop

Använd `debug-meta-api.js` för att se rådata:

```bash
node scripts/debug-meta-api.js
```

### 3. Kontrollera Response Size

Stora responses kan orsaka problem. Begränsa fields:

```javascript
// ❌ För många fields
fields=impressions,reach,clicks,spend,cpc,cpm,ctr,actions,action_values,...

// ✅ Endast nödvändiga fields
fields=impressions,clicks,spend,cpc,ctr
```

---

## Kontakta Support

Om problemet kvarstår efter att ha provat ovanstående:

1. Kör debug-scriptet och spara output
2. Kontrollera Meta API status: https://developers.facebook.com/status/
3. Kontrollera Meta Business Suite för eventuella aviseringar

---

**Senast uppdaterad:** 2026-01-25

# Targeting Strategi - Göteborg + Smartphones

**Datum:** 2026-01-25  
**Status:** ✅ Implementerad

---

## 🎯 Strategi

### Geo-targeting
- **Område:** Göteborg + 80 km radius
- **Koordinater:** 57.7089° N, 11.9746° E
- **Radius:** 80 km (80,000 meter)
- **Location types:** Home + Recent (hem och senaste platser)

### Device-targeting
- **Platform:** Smartphones (mobile)
- **OS:** Både iOS och Android (ingen begränsning)
- **Rationale:** Appen kan laddas ner på både iOS och Android, men inte på desktop

### Age-targeting
- **Ålder:** 18-65 år
- **Rationale:** Behåller nuvarande åldersgrupp

### Platform-targeting
- **Publisher platforms:** Facebook + Instagram
- **Facebook positions:** Feed, Video Feeds, Story, Reels
- **Instagram positions:** Stream, Story, Reels, Explore

---

## 💡 Varför Denna Strategi?

### ✅ Fördelar

1. **Lokal fokus**
   - Starta med Göteborg för att testa lokalt
   - 80 km radius täcker större Göteborgsområdet
   - Enklare att validera och optimera lokalt

2. **Smartphones endast**
   - Appen kan inte laddas ner på desktop
   - Smartphones ger bättre användarupplevelse för app-installs
   - Högre konvertering till app-installs

3. **Både iOS och Android**
   - Dubblar potentiell reach
   - Testa vilket OS som presterar bäst
   - Inkluderar alla smartphone-användare

4. **Fokuserad budget**
   - Mindre geografiskt område = mer effektiv budgetanvändning
   - Lättare att mäta lokala resultat
   - Kan expandera till andra städer när det fungerar

### ⚠️ Överväganden

1. **Mindre reach**
   - Lokal targeting = färre potentiella användare
   - Kan ta längre tid att samla statistisk signifikans
   - **Lösning:** Öka budget eller expandera radius om nödvändigt

2. **Konkurrens**
   - Lokal marknad kan vara mer konkurrenskraftig
   - **Lösning:** Testa olika hooks och kreativ för att stå ut

3. **Budget**
   - Med 3 ad sets behöver budgeten vara tillräcklig för alla
   - **Rekommendation:** Minst 50 SEK/dag per ad set = 150 SEK/dag totalt

---

## 📊 Förväntade Resultat

### Reach
- **Göteborg + 80 km:** ~1-2 miljoner invånare
- **Med ålder 18-65:** ~60-70% = ~600,000-1,400,000 potentiella användare
- **Med smartphones:** ~90% = ~540,000-1,260,000 potentiella användare

### Budget
- **Nuvarande:** ~36 SEK/dag totalt
- **Rekommenderad:** 150 SEK/dag totalt (50 SEK/ad set)
- **Med lokal targeting:** Kan behöva högre CPC p.g.a. mindre reach

### Performance
- **CTR:** Förväntas vara liknande eller högre (lokal targeting = mer relevant)
- **CPC:** Kan vara något högre (mindre reach = mer konkurrens)
- **CPM:** Kan vara något högre (lokal targeting = mer specifik)

---

## 🔧 Implementation

### Script
Kör följande script för att uppdatera targeting:

```bash
node scripts/update-targeting-goteborg-smartphones.js
```

### Manuell verifiering
1. Öppna Meta Ads Manager
2. Gå till varje ad set
3. Kontrollera targeting:
   - Geo: Göteborg + 80 km
   - Devices: Mobile
   - OS: Ingen begränsning (både iOS och Android)
   - Platforms: Facebook + Instagram

---

## 📈 Nästa Steg

### Kortsiktigt (1-2 veckor)

1. **Övervaka prestanda**
   - Jämför CTR, CPC, CPM med tidigare data
   - Kontrollera om lokal targeting ger bättre eller sämre resultat

2. **Optimera budget**
   - Om CPC är högre än förväntat, överväg att öka budget
   - Om reach är för låg, överväg att expandera radius till 100 km

3. **Testa kreativ**
   - Lokal targeting kan kräva annorlunda kreativ
   - Testa hooks som är mer relevanta för Göteborg

### Medellång sikt (1 månad)

1. **Expandera geografiskt**
   - Om Göteborg fungerar bra, expandera till:
     - Stockholm
     - Malmö
     - Uppsala
     - Linköping

2. **Analysera OS-prestanda**
   - Jämför iOS vs Android performance
   - Överväg att skapa separata ad sets om skillnaden är stor

3. **Optimera radius**
   - Testa olika radius (60 km, 80 km, 100 km)
   - Se vilken som ger bäst balans mellan reach och relevans

---

## 🎯 Success Metrics

### Mål (1 månad)

- **CTR:** Behålla > 4%
- **CPC:** < 3 SEK (kan vara något högre än tidigare p.g.a. lokal targeting)
- **CPM:** < 120 SEK
- **Landing Page Views:** > 20/månad
- **App Installs:** Spåra och mäta

### Varningstecken

- **CPC > 4 SEK:** Överväg att expandera radius eller ändra targeting
- **CTR < 3%:** Kreativ eller targeting är inte relevant nog
- **Låg reach:** Överväg att expandera radius eller ändra location types

---

## 📝 Noteringar

- **Koordinater:** Göteborg centrum: 57.7089° N, 11.9746° E
- **Radius:** 80 km = 80,000 meter
- **Location types:** Home + Recent ger bäst balans mellan reach och relevans
- **Device platforms:** 'mobile' inkluderar både smartphones och tablets, men Meta prioriterar smartphones för app-install kampanjer

---

**Senast uppdaterad:** 2026-01-25

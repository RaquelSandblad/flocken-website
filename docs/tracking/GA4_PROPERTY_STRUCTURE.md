# GA4 Property Structure för Flocken

**Datum:** 2025-01-03  
**Rekommendation:** EN GA4 Property med flera data streams

---

## ✅ Rekommendation: EN Property, Flera Data Streams

### **Struktur:**

```
GA4 Property: "Flocken" (EN property)
├── Data Stream 1: Web (flocken.info)
├── Data Stream 2: Android App (Google Play)
└── Data Stream 3: iOS App (App Store - framtida)
```

### **Varför EN property istället för tre separata?**

1. **✅ Cross-platform analytics**
   - Se användarresor från web → app
   - Unified user tracking
   - Bättre attribution (användare kan börja på web, installera app)

2. **✅ Enklare underhåll**
   - En property att konfigurera
   - En GTM container
   - En BigQuery export

3. **✅ Bättre för business intelligence**
   - Se hela användarresan i samma dashboard
   - Cross-platform conversion tracking
   - Unified reporting

4. **✅ Kostnadseffektivt**
   - En property istället för tre
   - En BigQuery export
   - Mindre komplexitet

---

## 📊 BigQuery Separation

### **Hur vi separerar plattformar i BigQuery:**

När GA4 exporterar till BigQuery inkluderas ALLA streams i samma export. Vi separerar dem via `platform` field:

```sql
-- Exempel: Separera web vs app i curated events
SELECT 
  event_name,
  platform,  -- 'web', 'android', 'ios'
  COUNT(*) AS events,
  COUNT(DISTINCT user_pseudo_id) AS users
FROM `flocken-tracking.flocken_curated.events`
WHERE event_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY event_name, platform
ORDER BY events DESC;
```

### **BigQuery Dataset Structure:**

```
flocken-tracking/
├── flocken_raw/              # Raw GA4 export (alla streams)
│   └── events_YYYYMMDD      # Innehåller web + android + ios
│
├── flocken_curated/          # Processed events
│   ├── events                # Alla events med platform field
│   └── user_identity_map     # Cross-platform user stitching
│
└── flocken_marts/            # Business intelligence
    ├── daily_performance     # Aggregerat per platform
    ├── web_performance        # Endast web events
    ├── app_performance        # Endast app events (android + ios)
    └── cross_platform_journey # Web → App conversion flows
```

### **Platform Separation i SQL:**

```sql
-- Web-only metrics
SELECT * FROM flocken_curated.events 
WHERE platform = 'web';

-- App-only metrics (Android + iOS)
SELECT * FROM flocken_curated.events 
WHERE platform IN ('android', 'ios');

-- Cross-platform analysis
SELECT 
  user_pseudo_id,
  ARRAY_AGG(DISTINCT platform) AS platforms_used,
  COUNTIF(platform = 'web') AS web_events,
  COUNTIF(platform = 'android') AS android_events,
  COUNTIF(platform = 'ios') AS ios_events
FROM flocken_curated.events
GROUP BY user_pseudo_id;
```

---

## 🎯 Setup Instructions

### **Steg 1: Skapa GA4 Property (EN property)**

1. Gå till Google Analytics: https://analytics.google.com
2. Klicka på "Admin" (kugghjul-ikonen)
3. Välj rätt Analytics-konto (Spitakolus)
4. Klicka på "+ Skapa egendom" (Create property)
5. Fyll i:
   - **Egendomsnamn:** "Flocken"
   - **Tidszon:** Europe/Stockholm
   - **Valuta:** SEK
6. Klicka på "Nästa"

### **Steg 2: Lägg till Data Streams**

**Efter att propertyn är skapad:**

1. **Web Stream:**
   - Klicka på "Web" (som du ser i bilden)
   - **Webbplats-URL:** `https://flocken.info`
   - **Stream-namn:** "Flocken Web"
   - Klicka på "Skapa stream"
   - **Spara Measurement ID:** `G-XXXXXXXXXX`

2. **Android App Stream (Steg 2 - kan göras senare):**
   - Gå tillbaka till Data Streams
   - Klicka på "Lägg till flöde" → "Android-app"
   - **Appnamn:** Flocken (eller vad appen heter i Play Store)
   - **Paketnamn:** `com.bastavan.app` (eller rätt package name)
   - **Stream-namn:** "Flocken Android"
   - Klicka på "Skapa stream"

3. **iOS App Stream (Framtida - när appen är på App Store):**
   - Gå tillbaka till Data Streams
   - Klicka på "Lägg till flöde" → "iOS-app"
   - Fyll i iOS app information
   - **Stream-namn:** "Flocken iOS"

### **Steg 3: BigQuery Export**

1. Gå till GA4 Property → Admin → BigQuery Linking
2. Välj GCP Project: `nastahem-tracking` (eller skapa nytt för Flocken)
3. Välj Location: EU (europe-north1)
4. Aktivera Daily Export
5. Aktivera Streaming Export
6. Destination: `flocken_raw` dataset

**Viktigt:** BigQuery exporten innehåller ALLA streams, separerade via `platform` field.

---

## 📊 Fördelar med denna struktur

### **1. Cross-Platform Analytics**

```sql
-- Se användarresor från web → app
SELECT 
  user_pseudo_id,
  MIN(CASE WHEN platform = 'web' THEN event_timestamp END) AS first_web_visit,
  MIN(CASE WHEN platform = 'android' THEN event_timestamp END) AS first_app_install,
  TIMESTAMP_DIFF(
    MIN(CASE WHEN platform = 'android' THEN event_timestamp END),
    MIN(CASE WHEN platform = 'web' THEN event_timestamp END),
    HOUR
  ) AS hours_to_app_install
FROM flocken_curated.events
WHERE user_pseudo_id IN (
  SELECT DISTINCT user_pseudo_id 
  FROM flocken_curated.events 
  WHERE platform = 'android'
)
GROUP BY user_pseudo_id
HAVING first_web_visit IS NOT NULL;
```

### **2. Unified Reporting**

- En dashboard för alla plattformar
- Cross-platform conversion tracking
- Unified user segmentation

### **3. Enklare Underhåll**

- En GTM container
- En GA4 property att konfigurera
- En BigQuery export att hantera

---

## 🔄 Jämförelse: EN Property vs Tre Properties

| Aspekt | EN Property (Rekommenderat) | Tre Properties |
|--------|------------------------------|----------------|
| **Cross-platform tracking** | ✅ Ja, unified | ❌ Nej, separata |
| **User journey analysis** | ✅ Ja, hela resan | ❌ Nej, fragmenterad |
| **Underhåll** | ✅ Enklare | ❌ Tre gånger mer arbete |
| **Kostnad** | ✅ Lägre | ❌ Högre |
| **BigQuery separation** | ✅ Via SQL (flexibelt) | ✅ Automatisk (men fragmenterad) |
| **Attribution** | ✅ Bättre (cross-platform) | ❌ Sämre (per platform) |

---

## ✅ Slutsats

**Rekommendation: EN GA4 Property med tre data streams**

1. **Web Stream** - Lägg till nu
2. **Android App Stream** - Lägg till i steg 2
3. **iOS App Stream** - Lägg till när appen är på App Store

**BigQuery separation:**
- Alla streams exporteras till samma BigQuery dataset
- Separera via `platform` field i SQL
- Skapa separata views/tables för web vs app om nödvändigt
- Men behåll cross-platform analysis i curated/marts

**Detta ger dig:**
- ✅ Cross-platform analytics
- ✅ Unified user tracking
- ✅ Bättre attribution
- ✅ Enklare underhåll
- ✅ Lägre kostnad

---

## 🚀 Nästa Steg

1. **Nu:** Skapa EN GA4 Property "Flocken"
2. **Nu:** Lägg till Web Stream (flocken.info)
3. **Steg 2:** Lägg till Android App Stream
4. **Framtida:** Lägg till iOS App Stream när appen är på App Store

**Säg till när du har skapat propertyn och fått Measurement ID, så fortsätter jag med GTM-implementationen!**


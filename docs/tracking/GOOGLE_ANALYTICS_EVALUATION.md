# Google Analytics Setup - Utvärdering & Implementation Plan

**Datum:** 2025-01-03  
**Syfte:** Utvärdera Nästa Hems Google Analytics setup och planera samma för Flocken  
**Status:** ✅ Utvärdering klar, redo för implementation

---

## 📊 Utvärdering: Nästa Hems Setup

### ✅ **Mycket bra uppsättning - Professionell arkitektur**

Nästa Hems Google Analytics setup är **enterprise-grade** och följer best practices:

#### **Arkitektur:**

```
Next.js App (nastahem.com)
    ↓ (dataLayer.push)
GTM Web Container (GTM-PD5N4GT3)  
    ↓ (server-side routing)
GTM Server Container (GTM-THB49L3K) @ gtm.nastahem.com
    ↓ (measurement protocol)
GA4 Property (G-7N67P0KT0B)
    ↓ (daily + streaming export)
BigQuery Raw Data (nastahem-tracking.nastahem_raw)
    ↓ (SQL transformations)
Curated Analytics (nastahem_curated)
    ↓ (business intelligence)
Dashboard-Ready Marts (nastahem_marts)
```

#### **Fördelar med denna setup:**

1. **✅ Server-side tracking**
   - Bättre data quality (server-side validering)
   - Privacy-first (bättre consent handling)
   - Future-proof (redo för cookieless tracking)
   - Bättre prestanda (mindre client-side load)

2. **✅ GTM-only implementation**
   - Inga konflikter (ingen gtag.js direkt)
   - Centraliserad tag management
   - Enkel att underhålla och uppdatera

3. **✅ BigQuery integration**
   - Data warehouse för långsiktig analys
   - SQL-baserad data processing
   - Business intelligence ready
   - Google Ads optimization data

4. **✅ Cookie consent integration**
   - Consent Mode v2
   - GDPR-compliant
   - Privacy-first approach

5. **✅ Cross-platform ready**
   - Identity stitching för framtida app integration
   - Unified analytics för web + app

#### **Tekniska detaljer:**

**GTM Web Container (GTM-PD5N4GT3):**
- Client-side tag management
- Consent Mode v2 konfiguration
- Event tracking via dataLayer

**GTM Server Container (GTM-THB49L3K):**
- Server-side på `gtm.nastahem.com`
- Enhanced data quality
- Better privacy compliance

**GA4 Property (G-7N67P0KT0B):**
- Standard GA4 tracking
- BigQuery export (daily + streaming)
- Google Ads integration ready

**BigQuery Pipeline:**
- Raw → Curated → Marts
- Automated daily processing
- Business intelligence queries

---

## 🎯 Rekommendation: Använd samma setup för Flocken

### **Varför samma setup?**

1. **✅ Beprövad metod** - Fungerar i produktion för Nästa Hem
2. **✅ Professionell arkitektur** - Enterprise-grade tracking
3. **✅ Skalbar** - Redo för framtida app integration
4. **✅ Privacy-first** - GDPR-compliant med Consent Mode v2
5. **✅ Data quality** - Server-side tracking ger bättre data

### **Anpassningar för Flocken:**

1. **Separata GA4 Property** - Flocken behöver egen GA4 property
2. **Separata BigQuery datasets** - `flocken_raw`, `flocken_curated`, `flocken_marts`
3. **GTM routing** - Samma GTM containers men med brand-routing
4. **Separata conversion values** - Flocken har andra värden än Nästa Hem

---

## 🚀 Implementation Plan för Flocken

### **Fas 1: GTM & GA4 Setup (Vecka 1)**

#### **Steg 1: Skapa GA4 Property för Flocken**

1. Gå till Google Analytics: https://analytics.google.com
2. Skapa ny property: "Flocken - Web"
3. Konfigurera data streams:
   - Web stream: `flocken.info`
   - Eventuellt: Android app stream (för framtida app)
   - Eventuellt: iOS app stream (för framtida app)
4. Spara Measurement ID (G-XXXXXXXXXX)

#### **Steg 2: Konfigurera GTM Web Container**

**Alternativ A: Använd samma GTM container med routing (Rekommenderat)**
- Använd samma GTM Web Container (GTM-PD5N4GT3)
- Lägg till brand-routing i GTM
- Skicka events till rätt GA4 property baserat på brand

**Alternativ B: Skapa separat GTM container för Flocken**
- Skapa ny GTM Web Container för Flocken
- Konfigurera GA4 Configuration tag
- Konfigurera event tags

**Rekommendation:** Alternativ A (samma container med routing) - enklare att underhålla

#### **Steg 3: Uppdatera layout.tsx**

**Ersätt gtag.js med GTM:**

```tsx
// FÖRE (Nuvarande - problematiskt):
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17821309500"></script>
<script>
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-17821309500');
</script>

// EFTER (GTM-only - rekommenderat):
<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-PD5N4GT3&l=dataLayer"></script>
```

**Uppdatera dataLayer init:**

```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({'gtm.start': new Date().getTime(), event:'gtm.js'});
      
      // Consent Mode v2 configuration
      window.dataLayer.push({
        'event': 'consent_default',
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'functionality_storage': 'granted',
        'security_storage': 'granted'
      });
    `,
  }}
/>
```

#### **Steg 4: Konfigurera GTM Tags**

**I GTM Web Container:**

1. **GA4 Configuration Tag (Flocken)**
   - Tag Type: Google Analytics: GA4 Configuration
   - Measurement ID: `G-XXXXXXXXXX` (Flocken GA4)
   - Server Container URL: `https://gtm.nastahem.com` (eller separat för Flocken)
   - Trigger: All Pages (med brand condition)

2. **GA4 Event Tags**
   - Tag Type: Google Analytics: GA4 Event
   - Configuration Tag: [GA4 Configuration above]
   - Event Name: `{{Event}}`
   - Custom Parameters: Brand-specific parameters

3. **Brand Routing Variable**
   - Skapa Custom Variable som identifierar brand
   - Använd `{{Page URL}}` eller `{{Page Hostname}}`
   - Routing logic: `flocken.info` → Flocken GA4

### **Fas 2: Server-side GTM (Vecka 2)**

#### **Steg 1: Konfigurera GTM Server Container**

**Alternativ A: Använd samma server container med routing**
- Uppdatera GTM Server Container (GTM-THB49L3K)
- Lägg till brand-routing
- Skicka till rätt GA4 property baserat på brand

**Alternativ B: Skapa separat server container för Flocken**
- Skapa ny GTM Server Container för Flocken
- Konfigurera på `gtm.flocken.info` (eller subdomain)
- Konfigurera GA4 Server tags

**Rekommendation:** Alternativ A (samma container med routing) - enklare och kostnadseffektivt

#### **Steg 2: Server Container Tags**

1. **GA4 Configuration - Server (Flocken)**
   - Tag Type: Google Analytics: GA4 Configuration
   - Measurement ID: `G-XXXXXXXXXX` (Flocken GA4)
   - Trigger: Initialization - All Server Container Events (med brand condition)

2. **GA4 Event - Server (Flocken)**
   - Tag Type: Google Analytics: GA4 Event
   - Configuration Tag: [GA4 Configuration - Server above]
   - Event Parameters: Pass-through all client parameters
   - Trigger: All Events (med brand condition)

### **Fas 3: BigQuery Integration (Vecka 3)**

#### **Steg 1: Skapa BigQuery Datasets**

**I GCP Project `nastahem-tracking`:**

```sql
-- Skapa datasets för Flocken
CREATE SCHEMA IF NOT EXISTS `nastahem-tracking.flocken_raw`
  OPTIONS(description='Raw GA4 export data for Flocken');

CREATE SCHEMA IF NOT EXISTS `nastahem-tracking.flocken_curated`
  OPTIONS(description='Cleaned and standardized Flocken events');

CREATE SCHEMA IF NOT EXISTS `nastahem-tracking.flocken_marts`
  OPTIONS(description='Business intelligence ready Flocken metrics');
```

#### **Steg 2: Konfigurera GA4 BigQuery Export**

1. Gå till GA4 Property → Admin → BigQuery Linking
2. Välj GCP Project: `nastahem-tracking`
3. Välj Location: EU (europe-north1)
4. Aktivera Daily Export
5. Aktivera Streaming Export
6. Destination: `flocken_raw` dataset

#### **Steg 3: Skapa SQL Transformations**

**Anpassa från Nästa Hems SQL:**

- `curated_events.sql` - Anpassa för Flocken events
- `identity_stitching.sql` - Anpassa för Flocken users
- `business_intelligence_marts.sql` - Anpassa för Flocken metrics

**Flocken-specifika events:**
- `app_install` - App installation
- `sign_up` - User registration
- `premium_subscribe` - Premium subscription
- `dog_profile_created` - Dog profile creation

---

## 📋 Implementation Checklist

### **Vecka 1: GTM & GA4 Setup**

- [ ] Skapa GA4 Property för Flocken
- [ ] Spara Measurement ID (G-XXXXXXXXXX)
- [ ] Konfigurera GTM Web Container (routing eller separat)
- [ ] Uppdatera `app/layout.tsx` - Ersätt gtag.js med GTM
- [ ] Konfigurera GA4 Configuration tag i GTM
- [ ] Konfigurera GA4 Event tags i GTM
- [ ] Testa event tracking i GA4 Realtime
- [ ] Verifiera att cookie consent fungerar

### **Vecka 2: Server-side GTM**

- [ ] Konfigurera GTM Server Container (routing eller separat)
- [ ] Konfigurera GA4 Server tags
- [ ] Testa server-side tracking
- [ ] Verifiera data quality

### **Vecka 3: BigQuery Integration**

- [ ] Skapa BigQuery datasets (flocken_raw, flocken_curated, flocken_marts)
- [ ] Konfigurera GA4 BigQuery export
- [ ] Skapa SQL transformations
- [ ] Testa data pipeline
- [ ] Skapa business intelligence queries

---

## 🔍 Nuvarande Problem i Flocken Setup

### **Problem 1: gtag.js direkt istället för GTM**

**Nuvarande kod:**
```tsx
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17821309500"></script>
<script>
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-17821309500');
</script>
```

**Problem:**
- Kan orsaka konflikter med GTM
- Svårt att underhålla
- Ingen centraliserad tag management

**Lösning:**
- Ersätt med GTM Web Container
- Hantera Google Ads via GTM istället

### **Problem 2: Ingen GA4 ännu**

**Nuvarande status:**
- Ingen GA4 property för Flocken
- Ingen GA4 tracking

**Lösning:**
- Skapa GA4 Property för Flocken
- Konfigurera GTM → GA4 tracking

### **Problem 3: Ingen server-side tracking**

**Nuvarande status:**
- Endast client-side tracking
- Ingen server-side validering

**Lösning:**
- Sätt upp GTM Server Container
- Konfigurera server-side routing

---

## ✅ Slutsats

**Nästa Hems setup är mycket bra och bör replikeras för Flocken:**

1. **✅ Professionell arkitektur** - Enterprise-grade tracking
2. **✅ Server-side tracking** - Bättre data quality och privacy
3. **✅ BigQuery integration** - Data warehouse för långsiktig analys
4. **✅ Cookie consent** - GDPR-compliant
5. **✅ Skalbar** - Redo för framtida app integration

**Rekommendation:** Implementera samma setup för Flocken med:
- Separata GA4 Property
- Separata BigQuery datasets
- GTM routing (eller separat container)
- Samma server-side setup

---

## 📚 Referenser

- [Nästa Hems Complete Tracking Guide](../nastahem/docs/project-guides/shared/COMPLETE_DATA_TRACKING_GUIDE.md)
- [Flocken Tracking Implementation Plan](../nastahem/docs/project-guides/flocken/README_FLOCKEN_TRACKING.md)
- [GTM Analytics Master Guide](../nastahem/docs/project-guides/gtm-analytics/README_GTM_ANALYTICS.md)

---

**Nästa steg:** Börja med Fas 1 - GTM & GA4 Setup


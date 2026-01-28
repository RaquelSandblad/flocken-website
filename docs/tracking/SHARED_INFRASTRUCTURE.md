# Delad Tracking-infrastruktur - Översikt

**Detta dokument ger en översikt över delad tracking-infrastruktur och länkar till detaljerad dokumentation.**

---

## 🎯 Delad infrastruktur

Flocken använder delad tracking-infrastruktur tillsammans med andra Spitakolus-projekt:

### GTM Shared Container
- **Container ID:** `GTM-PD5N4GT3` (delas med Nästa Hem)
- **Server Container:** `GTM-THB49L3K` @ `gtm.nastahem.com` (delas)
- **Strategi:** Hostname-based routing

**Detaljerad dokumentation:**  
👉 [spitakolus/tracking/GTM_SHARED_CONTAINER.md](https://github.com/tbinho/spitakolus/tree/main/tracking)

### BigQuery Shared Project
- **Project ID:** `nastahem-tracking` (delas med Nästa Hem)
- **Location:** EU (europe-west1)
- **Flocken datasets:** `flocken_raw`, `flocken_curated`, `flocken_marts`

**Detaljerad dokumentation:**  
👉 [spitakolus/tracking/BIGQUERY_SHARED_PROJECT.md](https://github.com/tbinho/spitakolus/tree/main/tracking)

---

## 📊 Flocken-specifik konfiguration

### GA4 Property
- **Measurement ID:** `G-7B1SVKL89Q`
- **Property Name:** Flocken (Webb)
- **Data Stream:** Web (flocken.info)

### GTM Tags
- **Tag Name:** "Google Tag - Flocken"
- **Trigger:** "Page View - Flocken"
- **Condition:** `Page Hostname equals flocken.info`

### BigQuery Datasets
- `flocken_raw` - Raw GA4 export
- `flocken_curated` - Processed events
- `flocken_marts` - Business intelligence metrics

---

## 🔗 Dokumentation

### Delad dokumentation (spitakolus)
- [GTM Shared Container](https://github.com/tbinho/spitakolus/tree/main/tracking) - Setup och best practices
- [BigQuery Shared Project](https://github.com/tbinho/spitakolus/tree/main/tracking) - Projekt-struktur
- [GA4 Property Structure](https://github.com/tbinho/spitakolus/tree/main/tracking) - Best practices

### Flocken-specifik dokumentation (detta repo)
- [TRACKING_SETUP_COMPLETE.md](./TRACKING_SETUP_COMPLETE.md) - Komplett Flocken setup
- [GTM_SETUP_INSTRUCTIONS.md](./GTM_SETUP_INSTRUCTIONS.md) - Flocken-specifik GTM setup
- [GA4_SETUP_STATUS.md](./GA4_SETUP_STATUS.md) - Flocken GA4 status
- [BIGQUERY_SETUP_INSTRUCTIONS.md](../bigquery/BIGQUERY_SETUP_INSTRUCTIONS.md) - Flocken-specifik BigQuery setup

---

**Senast uppdaterad:** 2026-01-28

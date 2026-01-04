# Flocken Documentation

**Senast uppdaterad:** 2025-01-05

---

## 📚 Dokumentation Structure

### **🎯 Start Här**

1. **[TRACKING_SETUP_COMPLETE.md](./TRACKING_SETUP_COMPLETE.md)** ⭐
   - Komplett översikt av all tracking setup
   - Vad som är implementerat
   - GTM konfiguration
   - GA4 setup
   - Meta Pixel setup
   - **Läs denna först för att förstå hela setupen**

---

### **✅ Nuvarande Status**

2. **[GA4_SETUP_STATUS.md](./GA4_SETUP_STATUS.md)**
   - Detaljerad status för GA4 implementation
   - Checklist över vad som är klart
   - Troubleshooting guide

3. **[GTM_SETUP_INSTRUCTIONS.md](./GTM_SETUP_INSTRUCTIONS.md)**
   - Steg-för-steg guide för GTM setup
   - Hur man konfigurerar tags och triggers
   - Hostname routing implementation

4. **[GTM_EVENT_TAGS_COMPLETE_GUIDE.md](./GTM_EVENT_TAGS_COMPLETE_GUIDE.md)** ⭐
   - **Komplett guide för att skapa GA4 Event tags**
   - Steg-för-steg instruktioner för app_install och övriga events
   - Testning och verifiering
   - Troubleshooting

---

### **📊 Arkitektur & Utvärdering**

5. **[GA4_PROPERTY_STRUCTURE.md](./GA4_PROPERTY_STRUCTURE.md)**
   - Förklaring av GA4 property struktur
   - Varför en property med flera data streams
   - Cross-platform analysis

6. **[GOOGLE_ANALYTICS_EVALUATION.md](./GOOGLE_ANALYTICS_EVALUATION.md)**
   - Utvärdering av Nästa Hems GA setup
   - Varför vi replikerar strukturen för Flocken
   - Best practices

---

### **🔜 Framtida Implementation**

7. **[SERVER_SIDE_TRACKING_PLAN.md](./SERVER_SIDE_TRACKING_PLAN.md)**
   - Plan för server-side tracking via GTM Server Container
   - Steg-för-steg implementation
   - Förbättrad datakvalitet

8. **[APP_TRACKING_PLAN.md](./APP_TRACKING_PLAN.md)**
   - Plan för iOS/Android app tracking
   - Firebase Analytics setup
   - Cross-platform tracking

9. **[BIGQUERY_EXPORT_PLAN.md](./BIGQUERY_EXPORT_PLAN.md)**
   - Plan för BigQuery export från GA4
   - Dataset struktur
   - Query examples

10. **[CUSTOM_EVENTS_PLAN.md](./CUSTOM_EVENTS_PLAN.md)**
   - Plan för custom events implementation
   - Events att tracka (sign_up, purchase, etc.)
   - GTM configuration

---

### **📱 Meta Pixel**

11. **[META_MARKETING_API_TOKEN_GUIDE.md](./META_MARKETING_API_TOKEN_GUIDE.md)**
    - Guide för att få Meta Marketing API token
    - System User setup
    - Token generation

12. **[META_PIXEL_DOMAIN_VERIFICATION.md](./META_PIXEL_DOMAIN_VERIFICATION.md)**
    - Guide för Meta Pixel domain verification
    - Hur man verifierar flocken.info i Meta Business Manager

---

### **🔐 Övrigt**

13. **[PASSWORD_RESET_SETUP.md](./PASSWORD_RESET_SETUP.md)**
    - Password reset functionality setup

---

## 🗂️ Filkategorier

### **Core Documentation** (Behåll)
- `TRACKING_SETUP_COMPLETE.md` - Huvuddokumentation
- `GA4_SETUP_STATUS.md` - Status
- `GTM_SETUP_INSTRUCTIONS.md` - Setup guide
- `GTM_EVENT_TAGS_COMPLETE_GUIDE.md` - **Event tags guide** ⭐
- `GA4_PROPERTY_STRUCTURE.md` - Arkitektur
- `GOOGLE_ANALYTICS_EVALUATION.md` - Utvärdering

### **Future Plans** (Behåll)
- `SERVER_SIDE_TRACKING_PLAN.md`
- `APP_TRACKING_PLAN.md`
- `BIGQUERY_EXPORT_PLAN.md`
- `CUSTOM_EVENTS_PLAN.md`

### **Meta Documentation** (Behåll)
- `META_MARKETING_API_TOKEN_GUIDE.md`
- `META_PIXEL_DOMAIN_VERIFICATION.md`

### **Removed Files** (Tas bort)
- `META_PIXEL_QUICK_FIX.md` - Temporär troubleshooting (inte längre behövs)
- `QUICK_TOKEN_GUIDE.md` - Duplicerad info (konsoliderad i META_MARKETING_API_TOKEN_GUIDE.md)
- `USE_EXISTING_TOKEN.md` - Duplicerad info (konsoliderad i META_MARKETING_API_TOKEN_GUIDE.md)

---

## 📖 Läsordning

### **För att förstå hela setupen:**
1. `TRACKING_SETUP_COMPLETE.md` (10 min)
2. `GA4_SETUP_STATUS.md` (5 min)
3. `GTM_SETUP_INSTRUCTIONS.md` (referens vid behov)

### **För att implementera framtida features:**
1. `SERVER_SIDE_TRACKING_PLAN.md`
2. `APP_TRACKING_PLAN.md`
3. `BIGQUERY_EXPORT_PLAN.md`
4. `CUSTOM_EVENTS_PLAN.md`

---

## 🔍 Quick Reference

### **GTM Container**
- **Web Container:** `GTM-PD5N4GT3`
- **Server Container:** `GTM-THB49L3K` @ `https://gtm.nastahem.com`

### **GA4 Property**
- **Measurement ID:** `G-7B1SVKL89Q`
- **Property Name:** Flocken (Webb)

### **Meta Pixel**
- **Pixel ID:** `854587690618895`
- **Domain Verification:** `jt1vlxalalidu3tkkaoufy8kv91tta`

---

**Senast uppdaterad:** 2025-01-05


# Analytics Event Spec (Cross-app) – Flocken + Nästa Hem

**Syfte:** En lättförståelig, återanvändbar standard för events (GA4/Firebase) som gör att vi kan:
- mäta funnel **Install/aktivering → Konto → Core action**
- segmentera på t.ex. **account_type**
- analysera konsekvent i **BigQuery** (och över flera appar/brands i samma BigQuery-projekt)

**Viktig princip:**  
Eventnamn är **inte** samma som kolumnnamn i Supabase.  
- **Eventnamn** = en *handling* (t.ex. `sign_up`, `listing_created`)  
- **Parametrar / user properties** = *attribut* (t.ex. `account_type`, `listing_id`)

---

## 🎯 Golden funnel (minsta uppsättning)

### **1) Install/aktivering**
- **App**: `first_open` (Firebase standard, automatiskt)
- **Webb (optional)**: `app_install` (klick på “Ladda ner”-länk, via GTM/dataLayer)

### **2) Konto skapat**
- **App**: `sign_up` (custom event när backend bekräftat konto skapat)

### **3) Core action**
Välj per produkt:
- **Flocken (Para)**: `listing_created` (när hundannons publiceras)
- **Nästa Hem**: `listing_created` (när bostadsannons publiceras)

---

## ✅ Canonical event dictionary (rekommenderat)

### **User acquisition**
| Event | När (definition) | Varifrån | Required params | Notes |
|------|-------------------|---------|-----------------|-------|
| `first_open` | Första gången appen öppnas efter installation | App (Firebase auto) | – | Bas för “install/aktivering” i app |
| `app_install` | Klick på App Store/Google Play från webb | Webb (GTM) | `platform` (`ios`/`android`), `source` | Detta är *inte* en app-install; används för webb-klick attribution |
| `sign_up` | Konto skapat (backend OK) | App/Backend | `method` (`email`/`apple`/`google`), `account_type` | Markera som conversion i GA4 |
| `login` | Inloggning lyckas | App | `method` | Bra för cohort/retention |
| `logout` | Utloggning | App | – |  |

### **Business actions**
| Event | När (definition) | Varifrån | Required params | Recommended params |
|------|-------------------|---------|-----------------|-------------------|
| `listing_created` | Listing skapad/publicerad | App/Backend | `listing_id`, `listing_type`, `status` | `account_type`, `value`, `currency` |
| `message_sent` | Meddelande skickat | App | `conversation_id` | `context` |
| `booking_created` | Bokning skapad | App/Backend | `booking_id`, `booking_type` | `value`, `currency`, `sitter_id` |
| `booking_confirmed` | Bokning bekräftad (accept) | App/Backend | `booking_id` | `value`, `currency` |

### **Revenue**
| Event | När (definition) | Varifrån | Required params | Recommended params |
|------|-------------------|---------|-----------------|-------------------|
| `purchase` | Betalning genomförd | App/Backend | `transaction_id`, `value`, `currency` | `items[]` (GA4 schema) |
| `subscription_start` | Prenumeration startar | App/Backend | `product_id`, `value`, `currency` | `account_type` |
| `subscription_cancel` | Prenumeration avslutas | App/Backend | `product_id` | `reason` |

---

## 👤 User identity & user properties (best practice)

### **User ID**
Sätt GA4/Firebase **user_id** till Supabase `auth.user.id` efter login:
- `setUserId(user.id)`

### **User properties (segmentering)**
Sätt stabila attribut som **user properties** (och duplicera på nyckel-events vid behov).

**Minst:**
- `account_type`: `dog_owner` | `dog_sitter` | `kennel` | `dog_daycare` (Flocken)

**Varifrån (mapping):**
- Supabase: `profiles.account_type` → user property `account_type`

---

## 🗺️ Mapping mot Supabase (exempel)

| Supabase (tabell.kolumn) | Analytics (var) | Nyckel | När sätts |
|---|---|---|---|
| `auth.users.id` | user_id | `user_id` | vid login/session |
| `profiles.account_type` | user property + event param | `account_type` | vid/efter att profiltyp valts/satts |
| `dogs.id` (Flocken) | event param | `listing_id` | vid `listing_created` |
| `dogs.breed` | event param | `breed` | vid `listing_created` (optional) |

---

## 🔁 Migration/kompatibilitet (nuvarande app events → canonical)

I app-repot (`para-hund-main`) finns idag events som är korrekta tekniskt men inte helt linjerar med canonical dictionary:

| Nuvarande event (app) | Borde vara (canonical) | Kommentar |
|---|---|---|
| `dog_created` | `listing_created` | Skicka `listing_type='dog'`, mappa `dog_id` → `listing_id` |
| `subscription_started` | `subscription_start` | Ren namnstandard för cross-app |
| `subscription_cancelled` | `subscription_cancel` | Ren namnstandard |
| `booking_requested` | `booking_created` | Om “requested” är creation-steget |
| `booking_accepted` | `booking_confirmed` | “confirmed” = accept |
| `booking_completed` | (valfritt) `booking_completed` | Bra att behålla som separat steg, men inte krävs för core funnel |

**Rekommendation:** välj canonical och håll den konsekvent i alla appar. Om ni måste byta namn senare, gör det som en kontrollerad migration (och mappa i BigQuery views under en övergångsperiod).

---

## 📊 BigQuery: funnel-exempel (Install → Konto → Listing)

Se `docs/bigquery/BIGQUERY_TEST_QUERIES.md` → “App Funnel (Install → Profil → Annons)”.


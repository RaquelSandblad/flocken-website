# Event Naming Convention - Spitakolus Standard

**Datum:** 2025-01-05  
**Gäller för:** Alla Spitakolus brands (Nästa Hem, Flocken, framtida appar)

---

## 🎯 Princip

**Enhetlig namngivning över alla appar för:**
- ✅ Konsistent reporting i BigQuery
- ✅ Enkel cross-brand analysis
- ✅ Lättare underhåll och onboarding
- ✅ Följer GA4 best practices

---

## 📋 Standard Event Names

### **User Acquisition**

| Event Name | När | Value | Används i |
|------------|-----|-------|-----------|
| `sign_up` | Användare registrerar sig | 100-200 SEK | Nästa Hem, Flocken |
| `app_install` | App laddas ner | 50-150 SEK | Flocken, framtida appar (standard för alla brands med appar) |

**Exempel:**
```javascript
// Nästa Hem
window.dataLayer.push({ event: 'sign_up', signup_method: 'email' });

// Flocken
window.dataLayer.push({ event: 'sign_up', signup_method: 'email' });

// App install (alla brands med appar)
window.dataLayer.push({ 
  event: 'app_install', 
  platform: 'android', 
  source: 'website' 
});
```

---

### **Revenue Events**

| Event Name | När | Value | Används i |
|------------|-----|-------|-----------|
| `purchase` | Köp genomförs | Varierar | Nästa Hem, Flocken |
| `subscription_start` | Premium subscription startar | Varierar | Flocken (framtida: andra appar) |

**Exempel:**
```javascript
// Nästa Hem - Listing fee
window.dataLayer.push({
  event: 'purchase',
  transaction_id: 'listing_123',
  value: 1000,
  currency: 'SEK'
});

// Flocken - Premium subscription
window.dataLayer.push({
  event: 'purchase',
  transaction_id: 'premium_123',
  value: 299,
  currency: 'SEK'
});
```

---

### **Business Actions**

| Event Name | När | Value | Används i |
|------------|-----|-------|-----------|
| `listing_created` | Annons/listing skapas | Varierar | Nästa Hem, Flocken |
| `valuation_request` | Värderingsförfrågan | 500 SEK | Nästa Hem |
| `booking_created` | Bokning skapas | Varierar | Flocken |
| `booking_confirmed` | Bokning bekräftas | Varierar | Flocken |

**Exempel:**
```javascript
// Nästa Hem - Bostadsannons
window.dataLayer.push({
  event: 'listing_created',
  listing_type: 'apartment',
  listing_id: 'apt_123'
});

// Flocken - Hundannons
window.dataLayer.push({
  event: 'listing_created',
  listing_type: 'dog',
  listing_id: 'dog_123'
});
```

---

### **Engagement Events**

| Event Name | När | Value | Används i |
|------------|-----|-------|-----------|
| `email_subscribe` | Email-prenumeration | 50 SEK | Nästa Hem |
| `message_sent` | Meddelande skickas | 0 SEK | Nästa Hem, Flocken |
| `walk_saved` | Promenad sparas | 0 SEK | Flocken |
| `place_visited` | Plats besöks/sparas | 0 SEK | Flocken |

**Exempel:**
```javascript
// Nästa Hem
window.dataLayer.push({ event: 'email_subscribe' });

// Flocken
window.dataLayer.push({ event: 'walk_saved', route_id: 'route_123' });
```

---

## 🔧 Event Parameters Standard

### **Common Parameters (Alla Events)**

```typescript
{
  event: string;           // Event name (enligt standard)
  value?: number;          // SEK value (om applicable)
  currency?: string;       // 'SEK' (standard)
  user_id?: string;        // User ID (om tillgängligt)
}
```

### **Event-Specific Parameters**

#### **sign_up**
```typescript
{
  event: 'sign_up',
  signup_method: 'email' | 'google' | 'apple',
  user_id?: string,
  value: 100-200,
  currency: 'SEK'
}
```

#### **purchase**
```typescript
{
  event: 'purchase',
  transaction_id: string,
  value: number,
  currency: 'SEK',
  items: Array<{
    item_name: string;
    item_category?: string;
    item_id?: string;
    quantity?: number;
    price: number;
  }>
}
```

#### **listing_created**
```typescript
{
  event: 'listing_created',
  listing_id: string,
  listing_type: string,  // 'apartment' (Nästa Hem) | 'dog' (Flocken)
  value?: number,
  currency?: 'SEK'
}
```

#### **booking_created / booking_confirmed**
```typescript
{
  event: 'booking_created' | 'booking_confirmed',
  booking_id: string,
  booking_type: string,  // 'dog_sitter' | 'dog_walker' (Flocken)
  value: number,
  currency: 'SEK'
}
```

---

## 📊 Cross-Brand Analysis

Med enhetlig namngivning kan vi enkelt analysera över brands:

```sql
-- Total sign ups across all brands
SELECT 
  event_date,
  COUNTIF(event_name = 'sign_up') as total_signups
FROM `nastahem-tracking.*.events_*`
WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
GROUP BY event_date;

-- Revenue comparison
SELECT 
  CASE 
    WHEN _TABLE_SUFFIX LIKE 'nastahem%' THEN 'Nästa Hem'
    WHEN _TABLE_SUFFIX LIKE 'flocken%' THEN 'Flocken'
  END as brand,
  SUM(CASE WHEN event_name = 'purchase' THEN value ELSE 0 END) as revenue_sek
FROM `nastahem-tracking.*.events_*`
WHERE event_name = 'purchase'
GROUP BY brand;
```

---

## ✅ Checklist för Nya Events

När du lägger till ett nytt event:

- [ ] Följer standard event naming (snake_case)
- [ ] Använder befintliga event names om möjligt
- [ ] Lägger till i denna dokumentation
- [ ] Verifierar att det inte konfliktar med andra brands
- [ ] Uppdaterar BigQuery views om nödvändigt

---

## 🚫 Undvik

- ❌ Brand-specifika prefixes (`flocken_sign_up` → använd `sign_up`)
- ❌ Olika names för samma action (`sign_up` vs `account_registration`)
- ❌ CamelCase (`signUp` → använd `sign_up`)
- ❌ För många variations (`booking_created`, `booking_started`, `booking_initiated` → välj en)

---

## 📚 Referenser

- [GA4 Event Best Practices](https://support.google.com/analytics/answer/9267735)
- [Nästa Hem Events](../../nastahem/docs/project-guides/shared/COMPLETE_DATA_TRACKING_GUIDE.md)
- [Flocken Events Verification](./EVENTS_VERIFICATION.md)

---

**Senast uppdaterad:** 2025-01-05  
**Status:** ✅ Standard för alla Spitakolus brands


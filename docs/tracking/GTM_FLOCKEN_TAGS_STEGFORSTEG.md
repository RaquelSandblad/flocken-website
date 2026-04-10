# GTM: Skapa Flocken-specifika tags – Steg för steg

**Datum:** 2026-02  
**Container:** GTM-PD5N4GT3  
**GA4 Flocken:** G-7B1SVKL89Q

---

## Förberedelse: Data Layer Variables

Skapa dessa **Variables** först (används av event-taggen):

1. **Variables** → **New** → **User-Defined Variables**
2. **Variable Type:** Data Layer Variable
3. Skapa fyra variabler:

| Variable Name | Data Layer Variable Name | Variable Name i GTM |
|---------------|--------------------------|---------------------|
| DLV - experiment_id | experiment_id | `DLV - experiment_id` |
| DLV - variant_id | variant_id | `DLV - variant_id` |
| DLV - cta_name | cta_name | `DLV - cta_name` |
| DLV - cta_destination | cta_destination | `DLV - cta_destination` |

**För varje:** Data Layer Variable Name = exakt som i tabellen (utan "DLV -").

---

## Tag 1: GA4 - Click Tracking - Flocken

**Syfte:** Alla länkar-klick på flocken.info → Flocken GA4

### Steg

1. **Tags** → **New**
2. **Tag Name:** `GA4 - Click Tracking - Flocken`
3. **Tag Configuration:**
   - Tag Type: **Google Analytics: GA4-händelse**
   - **Mätnings-id:** Välj **GA4 Configuration - Flocken** (eller skriv `G-7B1SVKL89Q` om du anger ID direkt)
   - **Händelsenamn:** `click`
   - **Händelseparametrar:** (Lägg till rad)
     - `click_text` → `{{Click Text}}`
     - `link_url` → `{{Click URL}}`
     - `page_url` → `{{Page URL}}`
4. **Triggering:**
   - Klicka på "Triggering" → **New**
   - **Trigger Name:** `Click - Flocken (länkar)`
   - **Trigger Type:** Click - All Elements (eller "All Clicks" om du kopierar från befintlig)
   - **This trigger fires on:** Some Clicks
   - **Conditions:**
     - `Click Element` → `matches CSS selector` → `a` (för att bara fånga länkar)
     - **AND** `Page Hostname` → `equals` → `flocken.info`
   - Spara
   - *Alternativt:* Om du redan har "All Clicks" (Bara länkar): Skapa en ny trigger som är kopia av den, men lägg till condition Page Hostname = flocken.info
5. Spara taggen

---

## Tag 2: GA4 Event - Flocken Custom (cta_click + experiment_impression)

**Syfte:** A/B-test events från dataLayer → Flocken GA4

### Steg

1. **Tags** → **New**
2. **Tag Name:** `GA4 Event - Flocken Custom`
3. **Tag Configuration:**
   - Tag Type: **Google Analytics: GA4-händelse**
   - **Mätnings-id:** Välj **GA4 Configuration - Flocken**
   - **Händelsenamn:** `{{Event}}` (built-in variabel)
   - **Händelseparametrar:** (Lägg till rad)
     - `experiment_id` → `{{DLV - experiment_id}}`
     - `variant_id` → `{{DLV - variant_id}}`
     - `cta_name` → `{{DLV - cta_name}}`
     - `cta_destination` → `{{DLV - cta_destination}}`
4. **Triggering:** En Custom Event-trigger kan bara lyssna på ETT event-namn. Lösning: Skapa två triggers och lägg till båda i taggen.

   **Trigger 1 – cta_click:**
   - Klicka "Triggering" → **New**
   - **Trigger Name:** `Custom Event - cta_click (Flocken)`
   - **Trigger Type:** Custom Event
   - **Event name:** `cta_click`
   - **This trigger fires on:** Some Custom Events
   - **Condition:** Page Hostname equals `flocken.info`
   - Spara

   **Trigger 2 – experiment_impression:**
   - Klicka "Triggering" → **New**
   - **Trigger Name:** `Custom Event - experiment_impression (Flocken)`
   - **Trigger Type:** Custom Event
   - **Event name:** `experiment_impression`
   - **This trigger fires on:** Some Custom Events
   - **Condition:** Page Hostname equals `flocken.info`
   - Spara

   **I taggen:** Under "Triggering" → **Add** → välj `Custom Event - cta_click (Flocken)` → **Add** igen → välj `Custom Event - experiment_impression (Flocken)`. Nu har taggen två triggers.

5. Spara taggen

---

## Publicera

1. **Submit** (uppe till höger)
2. **Version Name:** t.ex. "Flocken click + custom events"
3. **Publish**

---

## Verifiera

1. **GTM Preview** → Ange `https://flocken.info`
2. Ladda /valkommen
3. I GTM Preview:
   - Vid sidladdning: `GA4 Event - Flocken Custom` ska triggas (experiment_impression)
   - Vid klick på CTA: `GA4 Event - Flocken Custom` ska triggas (cta_click)
   - Vid klick på länk: `GA4 - Click Tracking - Flocken` ska triggas (click)
4. **GA4 Realtime** → Events: Se `experiment_impression`, `cta_click`, `click`

---

## Checklista

- [ ] DLV - experiment_id skapad
- [ ] DLV - variant_id skapad
- [ ] DLV - cta_name skapad
- [ ] DLV - cta_destination skapad
- [ ] GA4 - Click Tracking - Flocken skapad
- [ ] Trigger: Click - Flocken (länkar) skapad
- [ ] GA4 Event - Flocken Custom skapad
- [ ] Trigger: Custom Event - cta_click (Flocken) skapad
- [ ] Trigger: Custom Event - experiment_impression (Flocken) skapad
- [ ] Publicerat
- [ ] Testat i Preview + GA4 Realtime

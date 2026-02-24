# Quiz Bildprompts för Nano Banana

Alla bilder ska ha Flockens varma, naturliga och jordnära tonalitet:
- Färgpalett: Olivgrönt (#6B7A3A), sandbeige (#E8DCC0), varma bruntoner (#3E3B32)
- Stil: Naturlig, varm, organisk känsla
- Undvik: Överdrivet sterilt, kliniskt eller konstgjort

---

## 1. Quiz Library Hero Image
**Filnamn:** `flocken_quiz_hero.jpg`

**Prompt:**
```
A warm and inviting scene of a happy Swedish dog owner with their dog outdoors in natural daylight, casual and friendly atmosphere. The person is smiling while their dog (medium-sized, maybe a border collie or mixed breed) sits attentively beside them. Natural color palette with earthy olive greens, warm beige and browns. Soft focus background with Swedish landscape (field or park). Photographic style, natural lighting, organic feel. The mood should convey fun, learning, and community. Wide angle shot, 16:9 aspect ratio.
```

**Användning:** Bibliotekssidans hero-sektion  
**Storlek:** 1200x675px (16:9)  
**Destination:** `public/assets/flocken/_originals/` (kör image processor)

---

## 2. Hundsport Quiz Card Image
**Filnamn:** `flocken_quiz_hundsport_card.jpg`

**Prompt:**
```
A dynamic action shot of a dog (border collie or similar agile breed) mid-jump over an agility obstacle, photographed from the side. Natural outdoor setting with grass and blue sky. The dog looks focused and athletic. Warm natural color palette with olive greens and earth tones. Photographic style, natural lighting, shallow depth of field. The image should convey energy, athleticism, and the joy of dog sports. Horizontal composition, 16:9 aspect ratio.
```

**Användning:** Hundsport quiz-kort i biblioteket  
**Storlek:** 1200x675px (16:9) eller större (Nano Banana)  
**Destination:** `public/assets/flocken/_originals/` (kör image processor)

---

## 3. Rasers Syfte Quiz Card Image
**Filnamn:** `flocken_quiz_rasers_syfte_card.jpg`

**Prompt:**
```
A collage-style artistic composition featuring 3-4 different dog breeds showcasing breed diversity: a border collie (herding), a golden retriever (retrieving), a husky (sledding), arranged naturally together in an outdoor setting. Each dog shows their characteristic features. Natural warm color palette with olive greens, beiges and earth tones. Soft photographic style with natural lighting. The composition should celebrate breed diversity and purpose. Horizontal layout, 16:9 aspect ratio.
```

**Användning:** Rasers Syfte quiz-kort i biblioteket  
**Storlek:** 1200x675px (16:9) eller större (Nano Banana)  
**Destination:** `public/assets/flocken/_originals/` (kör image processor)

---

## 4. Hundens Historia Quiz Card Image
**Filnamn:** `flocken_quiz_hundens_historia_card.jpg`

**Prompt:**
```
A artistic split-composition image showing the evolution from wolf to dog. Left side: a wolf in nature (subtle, artistic rendering). Right side: a modern friendly dog (perhaps a mixed breed or family dog) with a human hand gently touching its head, warm domestic setting. Connected by a subtle timeline or natural transition. Warm earthy color palette with olive greens and browns. Artistic photographic style with a touch of historical illustration feel. The image should convey the journey from wild to companion. Horizontal composition, 16:9 aspect ratio.
```

**Användning:** Hundens Historia quiz-kort i biblioteket  
**Storlek:** 1200x675px (16:9) eller större (Nano Banana)  
**Destination:** `public/assets/flocken/_originals/` (kör image processor)

---

## 5. Generic Result Screen Image
**Filnamn:** `flocken_quiz_result.jpg`

**Prompt:**
```
A joyful celebration scene of a Swedish dog owner with their dog, both looking happy and accomplished. The person is kneeling or sitting beside their dog in a natural outdoor setting (park or field). The dog is looking up at the owner with an alert, proud expression. Warm natural color palette with olive greens, beiges and earth tones. Natural lighting, golden hour feel. The mood should convey achievement, joy, and the bond between human and dog. Photographic style, shallow depth of field. Horizontal composition, 16:9 aspect ratio.
```

**Användning:** Resultatskärmen (alla quiz)  
**Storlek:** 1200x675px (16:9)  
**Destination:** `public/assets/flocken/_originals/` (kör image processor)

---

## Tekniska specifikationer:

- **Format:** JPEG (optimerad för webb)
- **Kvalitet:** 85% compression för balans mellan kvalitet och filstorlek
- **Color space:** sRGB
- **Responsive:** Bilderna ska fungera både desktop och mobil

## Efter generering:

1. Placera originalbilder i: `public/assets/flocken/_originals/`
2. Kör: `node scripts/image-processor-flocken.js process-all` (eller `process [fil]`)
3. Använd genererade bilder från: `public/assets/flocken/generated/`
4. För quiz thumbnails: sätt `images.cardKey` + `images.cardAlt` i quiz JSON (då laddas `/generated/<cardKey>_small.webp`)
5. Testa på både desktop och mobil

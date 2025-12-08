# 🐕 Flocken - Bildhanteringssystem

**Hur man hanterar bilder för flocken.info på rätt sätt**

---

## 📋 Snabbstart

### 1. Lägg bilder i `_originals/`
```bash
# Kopiera dina originalbilder hit:
public/assets/flocken/_originals/
```

### 2. Kör image processor
```bash
cd C:\Users\Torbjörn\Desktop\flocken-website
npm install sharp  # Första gången
node scripts/image-processor-flocken.js process-all
```

### 3. Använd optimerade bilder
Optimerade versioner hamnar automatiskt i:
```
public/assets/flocken/generated/
```

---

## 📁 Mappstruktur

```
public/assets/flocken/
├── _originals/                    # 📥 Lägg originalbilder HÄR
│   ├── flocken_image_malua-arlo-coco-play-ball-dog-park_1x1.jpg
│   ├── flocken_image_malua-arlo-coco-chasing-ball_16x9.jpg
│   └── ... (alla original high-res bilder)
│
├── generated/                     # 📤 Optimerade bilder (AUTO-GENERERADE)
│   ├── flocken_image_malua-arlo-coco-play-ball-dog-park_1x1_hero.avif
│   ├── flocken_image_malua-arlo-coco-play-ball-dog-park_1x1_hero.webp
│   ├── flocken_image_malua-arlo-coco-play-ball-dog-park_1x1_hero.jpg
│   ├── flocken_image_malua-arlo-coco-play-ball-dog-park_1x1_large.avif
│   ├── ... (5 storlekar × 3 format per bild)
│   │
│   ├── screenshots/               # App screenshots (manuella)
│   └── logo/                      # Logotyper (manuella)
│
└── image-metadata.json            # Metadata om processerade bilder
```

---

## 🎯 Workflow

### Steg-för-steg: Lägga till en ny bild

**1. Spara originalbilden**
```bash
# Kopiera från:
C:\Users\Torbjörn\Desktop\Flocken Media\Färdiga bilder\web\

# Till:
C:\Users\Torbjörn\Desktop\flocken-website\public\assets\flocken\_originals\
```

**2. Processera bilden**
```bash
# Processar EN specifik bild:
node scripts/image-processor-flocken.js process public/assets/flocken/_originals/din-bild.jpg

# Eller processera ALLA bilder i _originals/:
node scripts/image-processor-flocken.js process-all
```

**3. Uppdatera koden**
```typescript
// I app/(marketing)/page.tsx
<Image
  src="/assets/flocken/generated/din-bild_hero.jpg"  // Fallback JPG
  alt="Beskrivning"
  // Next.js hanterar automatiskt AVIF/WebP om de finns
/>
```

---

## 🖼️ Bildstorlekar som genereras

| Storlek | Bredd | Höjd | Användning |
|---------|-------|------|------------|
| **thumbnail** | 150px | 150px | Små ikoner, avatarer |
| **small** | 400px | auto | Mobil, thumbnails |
| **medium** | 800px | auto | Tablet, mindre skärmar |
| **large** | 1200px | auto | Desktop |
| **hero** | 1920px | 1080px | Hero-sektioner (cover fit) |

Varje storlek genereras i **3 format:**
- ✅ **AVIF** - Bästa kompression, modernaste format
- ✅ **WebP** - God kompression, brett stöd
- ✅ **JPG** - Fallback för äldre browsers

---

## 🔧 Kommandon

### Status
```bash
node scripts/image-processor-flocken.js status
```
Visar vilka bilder som är processerade och vilka som saknas.

### Processera alla
```bash
node scripts/image-processor-flocken.js process-all
```
Processerar alla bilder i `_originals/` som inte redan är processerade.

### Processera en specifik bild
```bash
node scripts/image-processor-flocken.js process public/assets/flocken/_originals/hero.jpg
```

### Migrera från annan mapp
```bash
node scripts/image-processor-flocken.js migrate "C:\Users\Torbjörn\Desktop\Flocken Media\Färdiga bilder\web"
```
Kopierar bilder från extern mapp till `_originals/` och processerar dem.

### Rensa genererade bilder
```bash
node scripts/image-processor-flocken.js clean
```
Raderar alla genererade varianter (behåller `_originals/`).

---

## 📝 Namnkonvention för bilder

### Rekommenderad namngivning:
```
flocken_[typ]_[beskrivning]_[format].jpg

Exempel:
flocken_image_malua-arlo-coco-play-ball-dog-park_1x1.jpg
flocken_image_malua-arlo-coco-chasing-ball_16x9.jpg
flocken_hero_community-dogs-playing.jpg
flocken_feature_para-screenshot.jpg
```

### Regler:
- ✅ Små bokstäver
- ✅ Ord separerade med `-`
- ✅ Inga mellanslag eller svenska tecken (åäö)
- ✅ Beskrivande namn (inte "IMG_1234.jpg")

---

## 🎨 Nuvarande bilder som ska bytas

### Hero-bild (toppen av sidan)
```bash
# Original:
flocken_image_malua-arlo-coco-play-ball-dog-park_1x1.jpg
→ Lägg i: public/assets/flocken/_originals/

# Uppdatera i:
app/(marketing)/page.tsx
Rad 27: image="/assets/flocken/generated/flocken_image_malua-arlo-coco-play-ball-dog-park_1x1_hero.jpg"
```

### Community-bild (section "Allt du behöver")
```bash
# Original:
flocken_image_malua-arlo-coco-chasing-ball_16x9.jpg
→ Lägg i: public/assets/flocken/_originals/

# Uppdatera i:
app/(marketing)/page.tsx
Rad 46: src="/assets/flocken/generated/flocken_image_malua-arlo-coco-chasing-ball_16x9_large.jpg"
```

---

## ⚙️ Installation (första gången)

```bash
cd C:\Users\Torbjörn\Desktop\flocken-website

# Installera Sharp (bildprocessering)
npm install sharp
```

---

## 🚀 Full workflow-exempel

```powershell
# 1. Gå till projektet
cd C:\Users\Torbjörn\Desktop\flocken-website

# 2. Kopiera bilder
Copy-Item "C:\Users\Torbjörn\Desktop\Flocken Media\Färdiga bilder\web\*.jpg" `
  -Destination "public\assets\flocken\_originals\"

# 3. Processera alla bilder
node scripts/image-processor-flocken.js process-all

# 4. Kolla status
node scripts/image-processor-flocken.js status

# 5. Starta dev-server för att se resultatet
npm run dev
```

---

## 📊 Filstorlekar (typiska värden)

| Original | AVIF | WebP | JPG |
|----------|------|------|-----|
| 2.5 MB | 150 KB | 250 KB | 450 KB |
| **100%** | **-94%** | **-90%** | **-82%** |

**Resultat:**
- 🚀 **Mycket snabbare laddningstider**
- 💰 **Lägre bandbredd-kostnader**
- 📱 **Bättre mobilupplevelse**

---

## 🔗 Integration med Next.js

Next.js `<Image>` komponenten väljer automatiskt rätt format:

```typescript
<Image
  src="/assets/flocken/generated/hero_large.jpg"  // Fallback
  alt="Hundar som leker"
  width={1200}
  height={800}
  priority  // För hero-bilder
/>
```

Next.js hittar automatiskt:
1. `.avif` version (om browsern stöder)
2. `.webp` version (om browsern stöder)
3. `.jpg` fallback (alla browsers)

---

## 🐛 Troubleshooting

### "Cannot find module 'sharp'"
```bash
npm install sharp
```

### "No images found in _originals/"
Kontrollera att bilderna ligger i rätt mapp:
```bash
ls public/assets/flocken/_originals/
```

### Bilderna laddas inte på sajten
1. Kolla att bilderna processerades: `node scripts/image-processor-flocken.js status`
2. Kontrollera sökvägen i koden matchar genererade filer
3. Starta om dev-servern: `npm run dev`

---

## 📚 Relaterade filer

| Fil | Beskrivning |
|-----|-------------|
| `scripts/image-processor-flocken.js` | Image processor script |
| `public/assets/flocken/_originals/` | Originalbilder |
| `public/assets/flocken/generated/` | Optimerade versioner |
| `public/assets/flocken/image-metadata.json` | Metadata om processerade bilder |

---

## ✅ Checklist: Byta en bild

- [ ] Spara originalbilden i `_originals/` med korrekt namn
- [ ] Kör `node scripts/image-processor-flocken.js process-all`
- [ ] Uppdatera sökväg i relevanta `.tsx` filer
- [ ] Testa lokalt med `npm run dev`
- [ ] Verifiera att bilden visas korrekt
- [ ] Commit & push till GitHub
- [ ] Deploy till Vercel

---

**Skapad:** 2024-12-04  
**Projekt:** flocken.info  
**System:** Baserat på Nästa Hem's image processor


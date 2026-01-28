# Klona spitakolus repo

**När du har skapat `spitakolus` repo på GitHub, säg till så klonar jag det automatiskt!**

---

## Steg-för-steg

### 1. Du gör: Skapa repo på GitHub

1. Gå till: https://github.com/tbinho
2. Klicka "New repository"
3. **Repository name:** `spitakolus`
4. **Description:** "Företagsgemensam dokumentation för Spitakolus AB - Delade verktyg, processer och standarder"
5. **Visibility:** **Private**
6. **VIKTIGT:** Kryssa INTE i några rutor (ingen README, .gitignore, license)
7. Klicka "Create repository"

### 2. Jag gör: Klona repo lokalt

När du säger att repot är skapat, kör jag automatiskt:

```powershell
cd C:\Dev
git clone https://github.com/tbinho/spitakolus.git
cd spitakolus
```

**Plats:** `C:\Dev\spitakolus` (samma nivå som `flocken-website` och `nastahem`)

### 3. Jag gör: Skapa struktur

Efter kloning skapar jag automatiskt:
- ✅ Mappstruktur (`tracking/`, `meta-ads/`, `development/`, `company/`)
- ✅ README.md med tydlig förklaring
- ✅ DOCUMENTATION_RULES.md
- ✅ Mallar för nya repos
- ✅ Alla nödvändiga filer

---

## Vad händer efter kloning?

1. Jag klonar repot till `C:\Dev\spitakolus`
2. Jag skapar mappstruktur och filer
3. Du kan granska och godkänna
4. Vi pushar till GitHub tillsammans

---

**Säg bara till när repot är skapat på GitHub, så kör jag kloningen!** 🚀

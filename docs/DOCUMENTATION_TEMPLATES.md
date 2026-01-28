# Dokumentationsmallar för nya repos

**Datum:** 2026-01-28  
**Syfte:** Mallar som ska användas när nya repos skapas för att säkerställa konsistent struktur

---

## ⚠️ VIKTIGT: Alla repos måste ha

### 1. Tydlig varning i README.md

**Mall:**
```markdown
# [Projektnamn]

**⚠️ VIKTIGT:** Detta är **[PROJEKTNAMN]** repo.  
För [Annat Projekt], se [länk till annat repo].

[Projektbeskrivning]
```

**Exempel för flocken-website:**
```markdown
# Flocken Website

**⚠️ VIKTIGT:** Detta är **FLOCKEN-WEBSITE** repo.  
För Nästa Hem-projektet, se [nastahem](https://github.com/tbinho/nastahem).
```

**Exempel för nastahem:**
```markdown
# Nästa Hem

**⚠️ VIKTIGT:** Detta är **NASTAHEM** repo.  
För Flocken-projektet, se [flocken-website](https://github.com/tbinho/flocken-website).
```

### 2. DOCUMENTATION_MAP.md i root

**Mall:**
```markdown
# Dokumentationskarta - [Projektnamn]

**⚠️ VIKTIGT:** Detta är **[PROJEKTNAMN]** repo.  
För [Annat Projekt], se [länk till annat repo].

---

## 🎯 Vad finns var?

### 📁 Projekt-specifik dokumentation (I detta repo)

[Beskrivning av projekt-specifik dokumentation]

### 🏢 Delad dokumentation (I spitakolus repo)

**Se [spitakolus](https://github.com/tbinho/spitakolus) för:**
- [Lista över delad dokumentation]

---

## ⚠️ Viktiga påminnelser för AI

### Detta är [PROJEKTNAMN] repo
- ❌ **INTE** [Annat Projekt] repo
- ❌ **INTE** spitakolus repo
- ✅ Detta är [projektnamn] repo

### Deployment
- ✅ Deployar till: [domän]
- ✅ Remote: [remote-namn]
- ✅ GitHub: [github-url]

### Dokumentation
- ✅ Projekt-specifik dokumentation finns här i detta repo
- ✅ Delad dokumentation finns i [spitakolus](https://github.com/tbinho/spitakolus) repo
- ✅ [Annat Projekt]-dokumentation finns i [länk till annat repo] repo
```

### 3. README.md struktur

**Mall:**
```markdown
# [Projektnamn]

**⚠️ VIKTIGT:** Detta är **[PROJEKTNAMN]** repo.  
För [Annat Projekt], se [länk till annat repo].

[Projektbeskrivning]

---

## 📍 Dokumentationsstruktur

**Projekt-specifik dokumentation finns här i detta repo.**  
**Delad dokumentation finns i [spitakolus](https://github.com/tbinho/spitakolus) repo.**

- 📋 **[DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md)** - Komplett översikt över ALL dokumentation
- 📖 **[docs/README.md](./docs/README.md)** - Projekt-specifik dokumentation
- 🏢 **[spitakolus](https://github.com/tbinho/spitakolus)** - Företagsgemensam dokumentation

---

## 🚀 Snabbstart

[Projekt-specifik snabbstart]

---

## 📚 Dokumentation

### 🎯 Start Här
- **[DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md)** ⭐ - Komplett översikt över ALL dokumentation
- [README.md](./README.md) - Denna fil (projektöversikt)
- [INSTALLATION.md](./INSTALLATION.md) - Deployment och setup-guide

### 🏢 Delad dokumentation
- **[spitakolus](https://github.com/tbinho/spitakolus)** - Företagsgemensam dokumentation

---

## ⚠️ Viktiga påminnelser

### Detta är [PROJEKTNAMN] repo
- ❌ **INTE** [Annat Projekt] repo
- ✅ Detta är [projektnamn] repo

### Deployment
- ✅ Deployar till: [domän]
- ✅ Remote: [remote-namn]
```

---

## 📋 Checklista för nya repos

När ett nytt repo skapas, måste följande finnas:

- [ ] **README.md** med tydlig varning om vilket repo det är
- [ ] **DOCUMENTATION_MAP.md** med komplett översikt
- [ ] **Länkar till spitakolus** för delad dokumentation
- [ ] **Länkar till andra projekt-repos** för jämförelse
- [ ] **Tydlig deployment-information** (vilken remote, vilken domän)
- [ ] **Varningar för AI** om vilket repo det är

---

## 🎯 Exempel från flocken-website

Se `flocken-website/README.md` och `flocken-website/DOCUMENTATION_MAP.md` för komplett exempel.

---

**Senast uppdaterad:** 2026-01-28

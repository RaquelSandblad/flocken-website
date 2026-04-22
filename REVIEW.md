# REVIEW.md — Quality gates for Flocken web pages

> This file defines what "done" means. Check every gate before showing work to Torbjorn.
> Used by Claude Code review agents and manual QA.

## Hard gates (must ALL pass)

### 1. Build
- [ ] `npm run build` completes with zero errors
- [ ] No TypeScript errors
- [ ] No ESLint errors that break build

### 2. Contrast (WCAG AA)
- [ ] All body text on its background: >= 4.5:1 contrast ratio
- [ ] All large text (>= 18px bold or >= 24px): >= 3:1
- [ ] All UI borders/focus indicators: >= 3:1
- [ ] Check: white text on olive (#6B7A3A) = 4.8:1 (PASS for large, borderline normal)
- [ ] Check: gray text (#A29D89) on white = 3.4:1 (FAIL for body — use brown instead)

### 3. Mobile layout (375px)
- [ ] No horizontal overflow (no horizontal scrollbar)
- [ ] All text is readable without zooming
- [ ] No clipped images or cut-off content
- [ ] CTA buttons are full-width or clearly tappable (min 44px height)
- [ ] Single column layout — no side-by-side content

### 4. Desktop layout (1280px)
- [ ] No dead zones larger than 120px without content
- [ ] Images and text blocks are balanced (no tiny text next to huge image)
- [ ] Phone mockups use 3D perspective (not flat)
- [ ] Content max-width is respected (no full-bleed text)

### 5. Images
- [ ] All images have alt text
- [ ] No transparency artifacts (green edges, semi-transparent pixels)
- [ ] No AI-generated artifacts (wrong fingers, garbled text, color casts)
- [ ] Screenshots in phone mockups are actual app screenshots, not AI-rendered
- [ ] Clay illustrations match Flocken color palette (warm earth tones)

### 6. Content
- [ ] One primary CTA, same text everywhere it appears
- [ ] No lorem ipsum or placeholder text
- [ ] Trust signals appear near CTA (not isolated far from decision point)
- [ ] Social proof has names and cities (feels real, not generic)

## Soft gates (fix if easy, note if not)

### 7. Performance
- [ ] Lighthouse Performance score > 90
- [ ] LCP < 2.5s
- [ ] No images > 500KB on page
- [ ] Hero image < 200KB (optimized)

### 8. Accessibility
- [ ] Lighthouse Accessibility score > 95
- [ ] axe: 0 critical or serious violations
- [ ] All interactive elements are keyboard-accessible
- [ ] Focus order is logical (top to bottom, left to right)

### 9. SEO
- [ ] Page has unique title and meta description
- [ ] H1 exists and is unique on page
- [ ] Heading hierarchy is correct (H1 → H2 → H3, no skipping)
- [ ] Images have descriptive alt text (not "image" or "screenshot")

## How to run

```bash
# Build check
npm run build

# Visual check — open both viewports
npm run dev
# Then check at http://localhost:3000/v/passa
# Mobile: DevTools → 375px width
# Desktop: DevTools → 1280px width

# Lighthouse (Chrome DevTools → Lighthouse tab)
# Run on the actual page URL

# axe (Chrome extension "axe DevTools" or npx)
# Run on the actual page URL
```

## When a gate fails

1. Identify if it's a symptom or a root cause
2. If root cause: fix the approach (e.g., wrong image format, wrong component)
3. If symptom: fix the specific issue (e.g., wrong color token, missing alt text)
4. Re-run the failed gate
5. Only proceed to showing Torbjorn when ALL hard gates pass

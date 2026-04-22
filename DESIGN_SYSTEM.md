# DESIGN_SYSTEM.md — Flocken

> Single source of truth for UI/UX when building pages for flocken.info.
> Read this file before writing any visual code. Follow it, don't improvise.

## What this file controls

- Which colors, spacing and typography values are allowed
- How landing page sections are structured and ordered
- How images and device mockups are handled
- What "done" means (measurable QA gates)

---

## 1. Design tokens

All values come from `tailwind.config.ts`. No raw hex in components — always use token names.

### Colors

| Token | Hex | Use |
|-------|-----|-----|
| `flocken-olive` | #6B7A3A | Primary CTA, active elements, olive backgrounds |
| `flocken-accent` | #8BA45D | Hover states, secondary green |
| `flocken-sand` | #E8DCC0 | Card backgrounds, warm sections |
| `flocken-cream` | #F5F1E8 | Alternative section backgrounds |
| `flocken-brown` | #3E3B32 | Primary text, headings |
| `flocken-gray` | #A29D89 | Secondary/muted text |
| `flocken-warm` | #D4C4A8 | Dividers, borders |
| `flocken-error` | #C44536 | Errors, destructive actions, favorite heart |
| `white` | #FFFFFF | Light text on dark backgrounds, page background |

### Contrast rules (WCAG AA)

| Combination | Ratio | Status |
|---|---|---|
| flocken-brown on white | 10.6:1 | PASS |
| flocken-brown on cream | 8.1:1 | PASS |
| flocken-brown on sand | 5.9:1 | PASS |
| white on flocken-olive | 4.8:1 | PASS (large text only at 4.5:1+) |
| white/90 on flocken-olive | ~4.3:1 | PASS large text, borderline normal |
| white on flocken-brown | 10.6:1 | PASS |
| flocken-gray on white | 3.4:1 | FAIL normal text — use only for decorative/large |

**Rule:** Never use `flocken-gray` for body text on light backgrounds. Use `flocken-brown` or `flocken-brown/80` minimum.

### Typography

| Name | Size | Line height | Use |
|------|------|-------------|-----|
| `display` | 3.5rem | 1.1 | Hero headlines (desktop) |
| `h1` | 3rem | 1.2 | Page titles, section headlines |
| `h2` | 2.25rem | 1.3 | Section titles |
| `h3` | 1.875rem | 1.4 | Subsection titles |
| `body` | 1rem | 1.6 | Body text |
| `small` | 0.875rem | 1.5 | Captions, labels |

**Rule:** On mobile (< 768px), scale desktop headings down by ~25%. Use Tailwind responsive prefixes: `text-h2 md:text-h1`.

**Rule:** When using arbitrary text sizes (`text-[3rem]`), ALWAYS set explicit line-height (`leading-[3.6rem]`). Tailwind's `leading-tight` doesn't apply correctly with arbitrary sizes.

### Spacing

| Scale | Value | Use |
|-------|-------|-----|
| `4` | 16px | Element gaps, small padding |
| `6` | 24px | Card padding, medium gaps |
| `8` | 32px | Section inner padding |
| `12` | 48px | Section vertical padding (mobile) |
| `16` | 64px | Section vertical padding (desktop) |
| `20` | 80px | Large section breaks (desktop) |

**Rule:** Section padding: `py-12 md:py-16 lg:py-20`. Never less than `py-10` between sections.

### Shadows

| Name | Value | Use |
|------|-------|-----|
| `soft` | 0 2px 8px rgba(brown, 0.08) | Subtle elevation |
| `card` | 0 4px 12px rgba(brown, 0.12) | Cards, testimonials |
| `elevated` | 0 8px 24px rgba(brown, 0.16) | Phone mockups, hero elements |

### Border radius

| Name | Value | Use |
|------|-------|-----|
| `xl` | 1rem | Cards |
| `2xl` | 1.5rem | Large cards, sections |
| `3xl` | 2rem | Hero images |
| `[2.5rem]` | 2.5rem | Phone mockup frame |

---

## 2. Landing page modules

A conversion-focused landing page follows this structure. Every section has a job.

| Order | Module | Job | Required |
|-------|--------|-----|----------|
| 1 | **Hero** | Value prop + primary CTA. User knows what this is in 3 seconds. | YES |
| 2 | **Trust strip** | Reduce uncertainty. 3 proof points, no fluff. | YES |
| 3-5 | **Arguments** (2-3x) | Show specific value. Each has: headline, body, visual proof (screenshot/illustration). | YES |
| 6 | **Social proof** | Real quotes from real users. Names + cities. | YES |
| 7 | **Closing CTA** | Final push. Low threshold language. Repeat primary CTA. | YES |
| 8 | **Footer** | Legal links, company info. | YES |

### Attention path (what the user sees, in order)
1. Hero headline → "this is for me"
2. Hero CTA → "I could try this"
3. Trust strip → "others trust this"
4. Arguments → "here's specifically what I get"
5. Social proof → "people like me use this"
6. Closing CTA → "low risk, I'll try it"

**Rule:** One primary CTA text, repeated max 3 times (hero, mid-page, closing). Same wording each time.

**Rule:** Trust signals and social proof go NEAR the CTA, not isolated in their own world.

---

## 3. Device mockups (phone screenshots)

### Approach: CSS 3D transforms + real screenshots

**NEVER** use AI-generated hand-holding-phone images for landing pages. They produce artifacts and are expensive to iterate.

**ALWAYS** use CSS 3D perspective transforms with real app screenshots inside a Tailwind-built device frame.

### CSS values

```css
/* Wrapper */
.device-wrapper { perspective: 1000px; }

/* Phone frame */
.phone {
  transform: rotateY(-12deg) rotateX(3deg);
  transform-style: preserve-3d;
  box-shadow: 24px 16px 64px rgba(0, 0, 0, 0.08);
}
```

### Perspective guide
- `perspective(800px)` = more dramatic
- `perspective(1000px)` = balanced (default)
- `perspective(1200px)` = subtle

### Phone frame specification
- Frame color: `bg-gray-900`
- Border radius: `rounded-[2.5rem]`
- Padding (bezel): `p-3`
- Screen aspect ratio: `aspect-[9/19.5]`
- Screen border radius: `rounded-[2rem]`
- Dynamic Island: `w-24 h-6 bg-gray-900 rounded-b-2xl` centered at top
- Home indicator: `w-28 h-1 bg-white/30 rounded-full` centered at bottom

### Dual phone composition (overlapping)
- Front phone: `rotateY(-15deg) rotateX(5deg) translateZ(20px)`, z-10
- Back phone: `rotateY(-8deg) rotateX(3deg) translateZ(-40px)`, opacity 0.85

---

## 4. Images and illustrations

### Image types by use

| Type | Use | Source |
|------|-----|--------|
| **App screenshots** | Inside phone mockups (arguments, features) | Real screenshots from the app |
| **Clay illustrations** | Hero, backgrounds, decorative, closing CTA | Gemini 2.5 Flash Image |
| **Icons** | Trust strip, feature lists | Lucide icons |

### Clay illustration style guide (for Gemini prompts)

**Target look:** Quiz thumbnail quality (hundsport, hero) — NOT the hazy hero clay images.

- Style: "3D clay/claymation render, handcrafted polymer clay feel"
- Figures: Rounded, simplified faces (no detailed eyes), matt surface, visible clay texture
- Color palette: Flocken tokens (olive, sand, cream, brown) BUT with clear saturation — olive should read as GREEN, not gray-green
- **Lighting: Clear, directional from upper left. NO haze, NO fog, NO uniform ambient wash.** Clean air between elements. Defined shadows.
- **Depth of field:** Sharp foreground subject, softer background. Creates separation.
- **Contrast:** Foreground figures must "pop" against background. Use complementary temperatures (warm figure against cooler background, or vice versa).
- Subjects: Dogs, dog owners, homes, parks — always warm/inviting
- Background: Solid cream/sand or transparent (specify magenta #FF00FF for chroma key)
- Consistency: All clay images in a series must use the same prompt base

**Anti-patterns:** Uniform beige wash, flat lighting, everything same color temperature, "foggy" atmosphere, low separation between figure and ground.

### Image rules
- All images MUST have meaningful alt text
- Screenshots: PNG format (sharper in 3D frames than JPEG)
- Clay images: run through image processor pipeline
- Hero image must not tank LCP: prefer optimized static image, compress to < 200KB
- No generic stock photos. Every image must show the actual product or brand-consistent illustration.

---

## 5. Responsive behavior

### Breakpoints (Tailwind defaults)
- Mobile: < 640px (single column)
- Tablet: 640-1023px (flexible)
- Desktop: 1024px+ (multi-column where appropriate)

### Rules per module

| Module | Mobile | Desktop |
|--------|--------|---------|
| Hero | Stack: headline → CTA → image below | 2-col: text left, image/mockup right |
| Trust strip | Stack vertically, smaller text | Horizontal row, centered |
| Arguments | Stack: text above, mockup below | Alternate: text-left/image-right, then swap |
| Social proof | Stack cards | 3-col grid |
| Closing CTA | Stack: text → CTA → image | 2-col: text left, mockup right |

**Rule:** No 2-column layouts below 768px. Ever.

**Rule:** Phone mockups on mobile: flat (no 3D perspective), smaller, centered. 3D perspective kicks in at `lg:` breakpoint.

---

## 6. QA gates (what "done" means)

### Hard gates (must pass before showing to Torbjorn)

| Gate | Tool | Threshold |
|------|------|-----------|
| Contrast | Manual check or axe | WCAG AA: 4.5:1 normal text, 3:1 large text |
| Build | `npm run build` | Zero errors |
| Mobile layout | Preview at 375px | No overflow, no clipped content, readable text |
| Desktop layout | Preview at 1280px | No dead zones > 120px, balanced proportions |
| Images | Visual check | No artifacts, no transparency issues, alt text present |

### Soft gates (check, fix if easy)

| Gate | Tool | Target |
|------|------|--------|
| Lighthouse Performance | Chrome DevTools | > 90 |
| Lighthouse Accessibility | Chrome DevTools | > 95 |
| Lighthouse SEO | Chrome DevTools | > 90 |
| axe violations | `npx axe` or Chrome extension | 0 critical/serious |

### How to run QA

```bash
# Build check
npm run build

# Dev server for visual inspection
npm run dev

# Lighthouse (run in Chrome DevTools → Lighthouse tab)
# Target: Performance > 90, Accessibility > 95, SEO > 90
```

---

## 7. Component inventory

### Shared (atoms)
- `Button` — primary/secondary/ghost variants
- `Card` — sand/cream/white backgrounds
- `Container` — max-width wrapper
- `Header` — site navigation
- `Footer` — legal links, company info

### Marketing (molecules/organisms)
- `HeroBlock` (+ VariantB, VariantC) — hero sections
- `PhoneMockup` — **TO BE UPGRADED to AngledPhoneMockup with CSS 3D**
- `VideoInPhone` — has device frame structure (reference for phone frame)
- `CTABlock` — call-to-action sections
- `FeatureBlock` — feature grid
- `TestimonialBlock` — social proof quotes
- `SimpleCTASection` — minimal CTA

### V-landing (templates)
- `VLandingPage` — configurable landing page template
- `VLandingConfig` — data contract for landing page content

---

## 8. Process: how to build a new page

1. **Define attention path** — what does the user see first → last?
2. **Write copy** — real text, not lorem ipsum. Copy drives layout.
3. **Select/create images** — choose screenshots, generate clay images. All ready BEFORE coding.
4. **Reference existing page** — find a site that feels right. Link it.
5. **Build mobile-first** — single column, then expand for desktop.
6. **Run QA gates** — contrast, build, mobile 375px, desktop 1280px.
7. **Show Torbjorn** — only after gates pass.

**Anti-patterns to avoid:**
- Building without copy ready → placeholder layout that never looks right
- Generating images on-the-fly during implementation → iteration hell
- Fixing symptoms (padding) instead of root cause (wrong format/approach)
- Showing half-finished work → forces Torbjorn into pixel-review mode
- Using AI image generation where CSS would be deterministic and faster

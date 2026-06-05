/**
 * HomepageConfigV2 — Typer och config för ny startsida (V2-design).
 *
 * Preview-implementation. Renderas av HomepageV2 under /preview/start-v2.
 * Befintliga (marketing)/page.tsx och V-sidorna under components/v/ är orörda.
 *
 * Arkitektur (blankt papper, emotionell båge — INTE Claude Designs prototyp):
 *   Hero → Ekosystem → Functions → Differentiators → Story → Final CTA
 *   Löfte → lugna lösningen (kartan) → vad du får →
 *   varför det känns tryggt → vilka vi är → hör hemma + handla.
 *
 * Strategisk grund (våra egna lärdomar):
 *  - Trygghet vinner (19% CTA vs skuldens 4,6%). Lugn, inte skräck.
 *  - Igenkänning före produkt (Before→Bridge→After).
 *  - FOMO via närhet + 4 000+ verifierat, inte hype.
 *
 * Designsystem (samma DNA som VLandingPageV2):
 *  - Instrument Serif italic för rubriks-accenter
 *  - Eyebrow-mönster: 24px linje + uppercase etikett
 *  - Färger: olive #6B7A3A, olive-deep #4D5A28, ink #2A2820,
 *            paper #FAF6EC, cream #F5EFE2, sand #E8DCC0, warm #D4A574
 *
 * Skrivregel: INGA em-streck (—) i copy. Punkter eller komma istället.
 * Inga förbjudna ord (utforska, plattform, community, sömlös, underlättar).
 */

export interface HeadlineV2 {
  /** Den normala delen av rubriken (Inter, ej kursiv) */
  prefix: string;
  /** Serif-accentdelen (Instrument Serif italic) */
  accent: string;
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export interface HeroDogAvatar {
  src: string;
  /** CSS object-position, t.ex. '50% 30%' */
  objectPosition?: string;
}

export interface HeroFloatBubble {
  name: string;
  meta: string;
  avatarSrc: string;
  avatarPosition?: string;
}

export interface HeroConfig {
  tagLabel: string;
  title: HeadlineV2;
  lead: string;
  ctaLabel: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  trustText: string;
  trustSubtext: string;
  trustAvatars: HeroDogAvatar[];
  imageSrc: string;
  imageAlt: string;
  floatBubbles: HeroFloatBubble[];
}

// ─── Story ────────────────────────────────────────────────────────────────────

export interface StoryConfig {
  eyebrow: string;
  title: HeadlineV2;
  /** Stycken som brödtext. Strong-delar kan markeras med **dubbla asterisker**.
   *  Renderas: paragraf[0] → pullquote → resterande paragrafer. */
  paragraphs: string[];
  pullquote: string;
  /** Synlig attribution under pullquote, t.ex. "Raquel, grundare" */
  pullquoteAuthor?: string;
  imageSrc: string;
  imageAlt: string;
}

// ─── Functions ────────────────────────────────────────────────────────────────

export type FunctionTone = 'paper' | 'olive' | 'ink' | 'sand';

export interface FunctionCard {
  num: string;
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  tone: FunctionTone;
  href?: string;
  linkLabel?: string;
}

export interface FunctionsConfig {
  eyebrow: string;
  title: HeadlineV2;
  lead: string;
  cards: FunctionCard[];
}

// ─── Ekosystem ────────────────────────────────────────────────────────────────

export interface EkoStat {
  num: string;
  label: string;
}

export interface EkosystemConfig {
  eyebrow: string;
  title: HeadlineV2;
  paragraphs: string[];
  stats: EkoStat[];
  imageSrc: string;
  imageAlt: string;
  stickerLabel: string;
}

// ─── Differentiators (återanvänder VoiceCard-struktur) ──────────────────────────

export interface VoiceCard {
  quote: string;
  authorName: string;
  authorMeta: string;
}

export interface VoicesConfig {
  eyebrow: string;
  title: HeadlineV2;
  lead: string;
  voices: VoiceCard[];
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

export interface FinalCtaConfig {
  eyebrow: string;
  title: HeadlineV2;
  lead: string;
  primaryCtaLabel: string;
  fineprint: string;
  imageSrc: string;
  imageAlt: string;
}

// ─── Komplett config ──────────────────────────────────────────────────────────

export interface HomepageConfigV2 {
  /** För GA4-tracking-events */
  experimentId: string;
  /** För GA4-tracking-events (cta_click variant-fält) */
  variant: string;

  // SEO
  pageTitle: string;
  pageDescription: string;

  // Sektioner (renderingsordning = arkitekturens båge)
  hero: HeroConfig;
  ekosystem: EkosystemConfig;
  functions: FunctionsConfig;
  voices: VoicesConfig;
  story: StoryConfig;
  finalCta: FinalCtaConfig;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOMEPAGE V2 — CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export const HOMEPAGE_V2_CONFIG: HomepageConfigV2 = {
  experimentId: 'HOMEV2',
  variant: 'home-v2-preview',

  pageTitle: 'Ett enklare liv som hundägare',
  pageDescription:
    'Flocken samlar allt du behöver för hundlivet i en app. Hitta lekkamrater, hundvakt, promenader och hundvänliga platser på samma karta. Gratis att ladda ner.',

  // ─── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    tagLabel: 'Hela hundlivet i en app',
    title: { prefix: 'Ett enklare liv som ', accent: 'hundägare.' },
    lead:
      'Samla hundlivet i en app. Lekkamrater, hundvakt, nya promenader och hundvänliga ställen. Se allt på kartan eller sök det du letar efter.',
    ctaLabel: 'Ladda ner Flocken',
    secondaryCtaLabel: 'Se hur det fungerar',
    secondaryCtaHref: '#funktioner',
    trustText: '4 000+ hundägare',
    trustSubtext: 'finns redan i Flocken',
    trustAvatars: [
      { src: '/assets/flocken/v2/avatars/1.png' },
      { src: '/assets/flocken/v2/avatars/2.png' },
      { src: '/assets/flocken/v2/avatars/3.png' },
      { src: '/assets/flocken/v2/avatars/4.png' },
    ],
    imageSrc: '/assets/flocken/generated/flocken_image_malua-arlo-coco-jumping-dog-park_1x1.jpeg',
    imageAlt: 'Tre hundar som leker tillsammans i en hundrastgård',
    floatBubbles: [
      { name: 'Malua', meta: 'Pudel · 800 m', avatarSrc: '/assets/flocken/v2/avatars/ikon_avatar_malua.png' },
      { name: 'Coco', meta: 'Cocker · 1,2 km', avatarSrc: '/assets/flocken/v2/avatars/ikon_avatar_coco.png' },
      { name: 'Arlo', meta: 'Mops · 400 m', avatarSrc: '/assets/flocken/v2/avatars/ikon_avatar_arlo.png' },
      { name: 'Hasse', meta: 'Jämthund · 2 km', avatarSrc: '/assets/flocken/v2/avatars/ikon_avatar_hasse.png' },
    ],
  },

  // ─── EKOSYSTEM ─────────────────────────────────────────────────────────────
  // Bridge + app-tydlighet. Kartan är navet, lugnet är poängen.
  ekosystem: {
    eyebrow: 'Kartan är navet',
    title: { prefix: 'Allt på ', accent: 'samma karta.' },
    paragraphs: [
      'Hundprofiler, hundvakter, promenader och hundvänliga ställen ligger som lager på samma karta och du ser vad som finns i närheten.',
      'Enkel sökning med filter för att hitta precis det du behöver, när du behöver det. Markera dina favoriter för att spara till ett senare tillfälle och chatta direkt i appen.',
    ],
    stats: [],
    imageSrc: '/assets/flocken/v2/home/mockup-karta-skandinavien-1x1.jpg',
    imageAlt: 'Hand som håller en telefon med Flockens karta över Skandinavien, full av hundmarkörer',
    stickerLabel: 'Allt på en karta',
  },

  // ─── FUNCTIONS ─────────────────────────────────────────────────────────────
  // Exakta namn: Hundar, Passa, Rasta, Besöka (terminologi från MEMORY).
  // Förmåns-lett ("vad du vinner"), persona-grundat, app-tydligt.
  functions: {
    eyebrow: 'Fyra funktioner',
    title: { prefix: 'För olika behov du har i ', accent: 'vardagen.' },
    lead:
      'Hitta lekkamrater, en hundvakt, en ny stig att gå eller ett café som tar emot er. I Flocken har du allt tillgängligt på samma ställe.',
    cards: [
      {
        num: '01 · Hundar',
        title: 'Hitta en hund som matchar',
        body: 'Sök på kartan. Filtrera på ras eller storlek, valpar på gång eller söker parningspartner. Ta kontakt direkt i appen.',
        imageSrc: '/assets/flocken/v2/home/clay-hundar-pudlar-tradgard-3x2-v01b.jpg',
        imageAlt: 'Clay-illustration av två pudlar som möts i en hundpark',
        tone: 'paper',
      },
      {
        num: '02 · Passa',
        title: 'Hitta en hundvakt du är trygg med',
        body: 'Hundvakter och hunddagis med profil, pris och tillgänglighet. Läs på och träffas först, boka när det känns rätt. Eller byt passning med en annan hundägare.',
        imageSrc: '/assets/flocken/v2/home/clay-passa-promenad-hero-16x9.jpg',
        imageAlt: 'Clay-illustration av en person på lugn promenad med en hund',
        tone: 'olive',
      },
      {
        num: '03 · Rasta',
        title: 'Registrera promenader och hitta nya rundor',
        body: 'Starta när ni går ut, så ritas rundan upp på kartan. Spara dina favoriter, hitta andras i närheten och se hur mycket ni rör er.',
        imageSrc: '/assets/flocken/v2/home/clay-rasta-smilla-springer-3x2.jpg',
        imageAlt: 'Clay-illustration av en valp som springer genom skogen',
        tone: 'ink',
      },
      {
        num: '04 · Besöka',
        title: 'Sök efter hundvänliga verksamheter',
        body: 'Caféer, restauranger och barer som välkomnar hund. Bra hemma, bra på resan. Fungerar i hela Europa.',
        imageSrc: '/assets/flocken/v2/home/clay-besoka-malteser-koppel-3x2.jpg',
        imageAlt: 'Clay-illustration av en hund med kopplet i munnen, redo att ge sig ut',
        tone: 'sand',
      },
    ],
  },

  // ─── DIFFERENTIATORS (renderas i voices-blocket) ────────────────────────────
  // Inga riktiga kundcitat finns dokumenterade. Istället de tre värden vi äger,
  // med trygghet först (vår bevisat starkaste vinkel). Inga tillskrivna personer.
  voices: {
    eyebrow: '',
    title: { prefix: 'En trygg och lugn plats för ', accent: 'hundägare.' },
    lead:
      'Inte ytterligare en Facebook-grupp eller app. En app för att slippa hoppa runt.',
    voices: [
      {
        quote:
          'Du ser vem som ska ta hand om din hund. Profil, bilder och vad de erbjuder, innan ni ens träffas. Du väljer själv, i din egen takt.',
        authorName: 'Tryggt',
        authorMeta: '',
      },
      {
        quote:
          'Inga flöden, inga algoritmer, ingen jakt på likes. Funktioner som finns där när du behöver dem.',
        authorName: 'Lugnt',
        authorMeta: '',
      },
      {
        quote:
          'Byggt i Sverige av hundägare som själva saknade appen. Kartor, språk och vardag som stämmer med hur vi lever här.',
        authorName: 'Äkta',
        authorMeta: '',
      },
    ],
  },

  // ─── STORY ─────────────────────────────────────────────────────────────────
  // Torbjörns egen backstory (verifierad i writing-style-se.md). Verbet "para"
  // är verbet, inte funktionsnamnet. Watch-item: ev. mjuka "ville para".
  story: {
    eyebrow: 'Så här började det',
    title: { prefix: 'Det började med en hund som behövde ', accent: 'en vän.' },
    paragraphs: [
      'Idén till Flocken kom när Raquel letade efter en vän till sin toypudel Malua.',
      'När hon frågade andra hundägare gällde det samma för dem som letade hundvakt eller någon att para hunden med. Så hon bestämde sig för att göra något åt det. Att samla alla hundar på ett ställe, så att man kan söka istället för att förlita sig på tillfälliga inlägg.',
      '**Flocken lanserades i januari 2026 och växer snabbt, med nya hundägare varje dag som enkelt kan hitta varandra.**',
    ],
    pullquote:
      'Facebook-grupperna var röriga, och när vi fick svar bodde personen på andra sidan Sverige.',
    pullquoteAuthor: 'Raquel, grundare',
    imageSrc: '/assets/flocken/v2/home/clay-malua-valp-1x1.jpg',
    imageAlt: 'Clay-illustration av Malua som valp, en apricot pudel med rosa sele',
  },

  // ─── FINAL CTA ─────────────────────────────────────────────────────────────
  // Community/FOMO-close. Tillhörighet + var-tidig, sant grundat i 4 000+.
  finalCta: {
    eyebrow: 'Välkommen in i Flocken',
    title: { prefix: 'Samlingsplatsen för alla ', accent: 'hundar.' },
    lead:
      'Över 4 000 hundägare finns i Flocken, och nya hundar dyker upp nära dig hela tiden. Ju fler vi blir, desto bättre blir det för alla. Ladda ner appen och skapa ett konto när du vill lägga upp din hund.',
    primaryCtaLabel: 'Ladda ner Flocken',
    fineprint: 'Gratis att ladda ner.',
    imageSrc: '/assets/flocken/v2/home/real-chico-coco-park.jpg',
    imageAlt: 'Två hundar som springer tillsammans i en park',
  },
};

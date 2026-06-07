/**
 * FunktionerConfigV2 — Typer och config för /preview/funktioner-v2.
 *
 * Preview-implementation. Renderas av FunktionerV2 under /preview/funktioner-v2.
 * Befintliga sidor är orörda.
 *
 * Designsystem (samma DNA som HomepageV2 och VLandingPageV2):
 *  - Instrument Serif italic för rubriks-accenter (SA-komponent)
 *  - Eyebrow-mönster: 24px linje + uppercase etikett
 *  - Färger: olive #6B7A3A, olive-deep #4D5A28, ink #2A2820,
 *            paper #FAF6EC, cream #F5EFE2, sand #E8DCC0, warm #D4A574
 *  - Bakgrundsrytm per funktion: paper, cream, ink, sand
 *
 * Skrivregel: INGA em-streck (—) i copy. Punkter eller komma istället.
 * Inga förbjudna ord (utforska, plattform, community, sömlös, underlättar).
 * Aldrig "Para" som funktionsnamn. Det heter Hundar.
 *
 * Sticker-siffror (46 hundar nära, 183 hundvakter, 153 promenader,
 * 9 caféer nära dig) är illustrativa UI-element från handoffen.
 * Se öppna frågor i leveransrapporten.
 */

import type { HeadlineV2 } from './HomepageConfigV2';

export type { HeadlineV2 };

// ─── Intro ────────────────────────────────────────────────────────────────────

export interface IntroConfig {
  eyebrow: string;
  /** H1: prefix + serif-accent */
  title: HeadlineV2;
  lead: string;
}

// ─── Funktionssektion ─────────────────────────────────────────────────────────

export type FuncBackground = 'paper' | 'cream' | 'ink' | 'sand';

export interface FuncStep {
  title: string;
  body: string;
}

export interface FuncSection {
  id: string;
  /** Funktionsnummer som visas i serif-italic, t.ex. "i. Hundar" */
  funcNum: string;
  /** Bakgrund avgör färgtemat för hela sektionen */
  bg: FuncBackground;
  /** Om true: bild placeras till höger på desktop */
  flip: boolean;
  title: HeadlineV2;
  lead: string;
  /** Appskärmens bildväg under /public */
  imageSrc: string;
  imageAlt: string;
  /** true = bilden är redan en telefon-mockup (egen ram), visas utan PhoneFrame */
  preFramed?: boolean;
  /** Illustrativt sticker-badge bredvid telefon-ramen */
  stickerText: string;
  /** Placering av sticker: uppe-höger eller nere-vänster */
  stickerPos: 'top' | 'bottom';
  /** Feature-chips (kort egenskap-lista) */
  chips: string[];
  /** 3 numrerade steg */
  steps: FuncStep[];
  /** Valfri callout. Utelämnas = ingen ruta. */
  callout?: string;
  /** Rubrik på callout-rutan. Standard: "Bra att veta". */
  calloutLabel?: string;
}

// ─── Verksamheter (B2B-sektion, renderas i minaSidor-blocket) ───────────────────
// OBS: nyckeln heter fortfarande minaSidor i config men innehåller numera
// verksamhetstyper (hunddagis, hundvakt, kennel) med bild per kort.

export interface MinaSidorCard {
  /** App-skärm/profilbild för verksamhetstypen */
  imageSrc: string;
  imageAlt: string;
  title: string;
  body: string;
}

export interface MinaSidorConfig {
  eyebrow: string;
  title: HeadlineV2;
  lead: string;
  cards: MinaSidorCard[];
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

export interface FunktionerFinalCtaConfig {
  eyebrow: string;
  title: HeadlineV2;
  lead: string;
  ctaLabel: string;
  fineprint: string;
}

// ─── Komplett config ──────────────────────────────────────────────────────────

export interface FunktionerConfigV2 {
  /** För GA4-tracking-events */
  experimentId: string;
  /** För GA4-tracking-events (cta_click variant-fält) */
  variant: string;

  // SEO
  pageTitle: string;
  pageDescription: string;

  intro: IntroConfig;
  funcs: FuncSection[];
  minaSidor: MinaSidorConfig;
  finalCta: FunktionerFinalCtaConfig;
}

// ─────────────────────────────────────────────────────────────────────────────
// FUNKTIONER V2 — CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export const FUNKTIONER_V2_CONFIG: FunktionerConfigV2 = {
  experimentId: 'FUNKV2',
  variant: 'funktioner-v2-preview',

  pageTitle: 'Funktioner',
  pageDescription:
    'Hundar, Passa, Rasta och Besöka. Fyra funktioner i en app för hundlivet. Se vad varje funktion gör och hur du kommer igång.',

  // ─── INTRO ────────────────────────────────────────────────────────────────
  intro: {
    eyebrow: 'Funktioner',
    title: { prefix: 'Fyra funktioner. ', accent: 'En app.' },
    lead:
      'Hundar, Passa, Rasta och Besöka. Varje funktion löser ett konkret behov i hundvardagen, och allt ligger på samma karta. Överblicken gör skillnad.',
  },

  // ─── FYRA FUNKTIONSSEKTIONER ──────────────────────────────────────────────
  funcs: [
    // ── i. Hundar ── paper (ljus, ingen flip) ──────────────────────────────
    {
      id: 'hundar',
      funcNum: 'Hundar',
      bg: 'paper',
      flip: false,
      title: { prefix: 'Samlingsplatsen för alla ', accent: 'hundar.' },
      lead:
        'Här söker du bland alla hundar. Filtrera på ras och storlek. Se vilka som har valpar på gång eller är tillgängliga för parning.',
      imageSrc: '/assets/flocken/v2/funktioner/screen-hundar-hela-sverige.jpg',
      imageAlt:
        'Skärmavbild av Hundar-funktionen i Flocken. Karta över hela Sverige full av hundar markerade som tassar.',
      stickerText: 'Hundar nära dig',
      stickerPos: 'top',
      chips: [
        'Karta och lista',
        'Filtrera på ras och storlek',
        'Öppen för parning',
        'Söker lekkamrat',
        'Vaktutbyte',
        'Hund försvunnen',
      ],
      steps: [
        {
          title: 'Lägg upp din hund',
          body: 'Ange ras, storlek och ålder. Lägg till temperament och hälsotester om du vill. Det gör hunden mer sökbar för andra.',
        },
        {
          title: 'Zooma på kartan eller scrolla i en lista',
          body: 'Se hundarna i ett område. Filtrera på det du söker. Favoritmarkera de du vill återkomma till.',
        },
        {
          title: 'Ta kontakt',
          body: 'Chatta direkt med ägaren i appen. Konversationen är direkt mellan er.',
        },
      ],
      callout:
        'Din exakta adress visas aldrig för andra. Du syns bara i ditt område, så att andra kan se vilka hundar som finns i närheten utan att veta var du bor.',
    },

    // ── ii. Passa ── cream (flip: bild höger) ─────────────────────────────
    {
      id: 'passa',
      funcNum: 'Passa',
      bg: 'cream',
      flip: true,
      title: { prefix: 'Hitta en hundvakt i ', accent: 'närheten.' },
      lead:
        'På kartan ser du hunddagis och privatpersoner med profiler som har bild, beskrivning, tider och tillgänglighet. Du söker, jämför och tar kontakt själv.',
      imageSrc: '/assets/flocken/v2/funktioner/screen-passa-yasmin-raw.png',
      imageAlt:
        'Skärmavbild av en hundvaktsprofil i Flocken. Yasmin i Alingsås, med bild, beskrivning och tillgänglighet.',
      stickerText: 'Hundvakter i närheten',
      stickerPos: 'bottom',
      chips: [
        'Profil med bild',
        'Kalender',
        'Bokningsförfrågan',
        'Hembesök',
        'Övernattning',
        'Hundvaktsutbyte',
      ],
      steps: [
        {
          title: 'Sök efter det som passar era behov',
          body: 'Filtrera på övernattning, dagspassning, hembesök eller storlek på hund. Eller scrolla bland profilerna nära dig.',
        },
        {
          title: 'Läs profilen',
          body: 'Se en bild, hur hundvakterna bor, vilka hundar de tagit emot och vilka tider de har lediga. Det ger förutsättningar att hitta rätt.',
        },
        {
          title: 'Ni kommer överens',
          body: 'Chatta först. Träffas innan om ni vill. Ni kommer överens själva. Flocken hjälper er att hitta varandra.',
        },
      ],
      calloutLabel: 'Om du är hundvakt',
      callout:
        'Du som är hundvakt kan skapa ett konto på Flocken så att din profil blir synlig på kartan. Många hundägare har ett konto bara för att kunna söka efter hundvakter.',
    },

    // ── iii. Rasta ── ink (mörk, ingen flip) ──────────────────────────────
    {
      id: 'rasta',
      funcNum: 'Rasta',
      bg: 'ink',
      flip: false,
      title: { prefix: 'Spara dina rundor. ', accent: 'Upptäck nya.' },
      lead:
        'Starta när du går ut, stoppa när du kommer hem. Spara rundan för dig själv eller dela med andra. Hitta nya vägar som hundägare i området redan gått.',
      imageSrc: '/assets/flocken/v2/funktioner/screen-rasta-statistik.png',
      imageAlt:
        'Skärmavbild av Rasta-funktionen. Promenadstatistik med rundor, poäng och total distans.',
      stickerText: 'Dina rundor',
      stickerPos: 'top',
      chips: [
        'GPS-spårning',
        'Dela rundor',
        'Följ andras rutter',
        'Statistik och poäng',
        'Nivåer',
      ],
      steps: [
        {
          title: 'Starta promenaden',
          body: 'Tryck "Skapa ny promenad" när du går ut. Rundan målas upp som en linje på kartan i realtid.',
        },
        {
          title: 'Spara och dela',
          body: 'När du är hemma, välj om rundan ska vara privat eller delas. Lägg till en kort beskrivning så andra hittar den.',
        },
        {
          title: 'Variera dina rundor',
          body: 'Bläddra bland rundor som andra delat. Följ nya stigar. Samla kilometer och poäng om det motiverar dig.',
        },
      ],
    },

    // ── iv. Besöka ── sand (flip: bild höger) ─────────────────────────────
    {
      id: 'besoka',
      funcNum: 'Besöka',
      bg: 'sand',
      flip: true,
      title: { prefix: 'Hundvänliga ställen, ', accent: 'på resan eller hemmaplan.' },
      lead:
        'Caféer, restauranger och barer som tar emot hundar, visas på kartan i hela Europa. Bra på resa, bra när du ska gå ut i din egen hemstad.',
      imageSrc: '/assets/flocken/v2/funktioner/clean-besoka.png',
      imageAlt:
        'Skärmavbild av Besöka-funktionen. Välj platskategorier för Göteborg: café, restaurang, bar.',
      stickerText: 'Ställen nära dig',
      stickerPos: 'bottom',
      chips: [
        'Karta över Europa',
        'Filtrera på stad',
        'Lägg till plats',
        'Kommentera',
        'Favoriter',
      ],
      steps: [
        {
          title: 'Sök efter det du vill',
          body: 'Café, restaurang eller bar. Välj vilken stad du vill se utbudet i. Se urvalet på en karta eller som en lista.',
        },
        {
          title: 'Läs vad andra säger',
          body: 'Andra hundägares kommentarer berättar hur hundvänligt stället egentligen är.',
        },
        {
          title: 'Bidra själv',
          body: 'Saknas ett bra ställe? Lägg till det. Andra hundägare blir tacksamma, och kartan blir lite mer komplett.',
        },
      ],
    },
  ],

  // ─── VERKSAMHETER (B2B) ────────────────────────────────────────────────────
  minaSidor: {
    eyebrow: 'För verksamheter',
    title: { prefix: 'Plats för dig som tar emot ', accent: 'hundar.' },
    lead:
      'Flocken är inte bara för hundägare. Driver du verksamhet med hund kan du synas på kartan, precis där hundägarna letar.',
    cards: [
      {
        imageSrc: '/assets/flocken/v2/funktioner/business-hunddagis.jpg',
        imageAlt: 'Profilkort för ett hunddagis i Flocken, visat på kartan.',
        title: 'Hunddagis',
        body: 'Lägg upp ert dagis med bild, plats och beskrivning. Hundägare i närheten hittar er när de söker passning på dagtid.',
      },
      {
        imageSrc: '/assets/flocken/v2/funktioner/business-hundvakt.jpg',
        imageAlt: 'Profilkort för en hundvakt i Flocken.',
        title: 'Hundvakt',
        body: 'Skapa en profil och bli synlig på kartan. Hundägare tar kontakt direkt när de behöver passning i ditt område.',
      },
      {
        imageSrc: '/assets/flocken/v2/funktioner/business-kennel.jpg',
        imageAlt: 'Profilkort för en kennel i Flocken, med bilder på hundar.',
        title: 'Kennel',
        body: 'Visa upp er kennel och era hundar. Den som letar valp eller rätt uppfödare hittar er direkt på kartan.',
      },
    ],
  },

  // ─── FINAL CTA ───────────────────────────────────────────────────────────
  finalCta: {
    eyebrow: 'När du är redo',
    title: { prefix: 'Allt det här, ', accent: 'på din mobil.' },
    lead:
      'Ladda ner appen, lägg upp din hund och se vad som finns där du är. Det tar två minuter.',
    ctaLabel: 'Ladda ner Flocken',
    fineprint: 'Gratis att ladda ner.',
  },
};

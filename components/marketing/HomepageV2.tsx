/**
 * HomepageV2 — Ny startsida (preview). Blankt papper, ej Claude Designs prototyp.
 *
 * Arkitektur (emotionell båge):
 *   Hero → Ekosystem → Functions → Differentiators → Story → Final CTA
 *   Löfte → lugna lösningen (kartan) → vad du får →
 *   varför det känns tryggt → vilka vi är → hör hemma + handla.
 *
 * Designsystem:
 *  - Instrument Serif italic för rubriks-accenter (SA-komponent)
 *  - Eyebrow-mönster: 24px linje + uppercase etikett
 *  - Färger: olive #6B7A3A, olive-deep #4D5A28, ink #2A2820,
 *            paper #FAF6EC, cream #F5EFE2, sand #E8DCC0, warm #D4A574
 *  - Bakgrundsrytm: paper, cream, dark, paper, cream, dark, paper
 *
 * Server Component. Delegerar interaktiv CTA till VLandingCTAV2 (samma
 * tracking-hooks som /v/-sidorna, men med variant=home-v2-preview).
 *
 * INGEN gemensam header/footer. Sidan renderar sin egen header (statisk,
 * ej sticky) och egen footer i samma stil som VLandingPageV2.
 */

import { Instrument_Serif } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { VLandingCTAV2 } from '@/components/v/VLandingCTAV2';
import type {
  HomepageConfigV2,
  FunctionCard,
  HeadlineV2,
} from './HomepageConfigV2';

// ─── Font ────────────────────────────────────────────────────────────────────

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  style: ['italic'],
  weight: '400',
  variable: '--font-instrument-serif',
  display: 'swap',
});

// ─── Hjälpkomponenter ─────────────────────────────────────────────────────────

/** Rubrik-accent: Instrument Serif italic */
function SA({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-instrument-serif)',
        fontStyle: 'italic',
        fontWeight: 400,
        letterSpacing: '-0.01em',
      }}
    >
      {children}
    </span>
  );
}

/** Eyebrow: 24px linje + uppercase etikett */
function Eyebrow({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="flex items-center gap-2.5 mb-5 text-[0.75rem] font-semibold tracking-[0.14em] uppercase"
      style={style}
    >
      <span className="inline-block w-6 h-px bg-current shrink-0" aria-hidden="true" />
      {children}
    </div>
  );
}

/** Rendera **fet**-syntax i text till <strong>. Minimal, ingen markdown. */
function renderEmphasis(text: string, strongColor?: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} style={{ fontWeight: 500, color: strongColor }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/** H2 med prefix + serif-accent + valbar accent-färg */
function H2({
  title,
  accentColor,
  textColor = '#2A2820',
  maxWidthCh,
}: {
  title: HeadlineV2;
  accentColor: string;
  textColor?: string;
  maxWidthCh?: number;
}) {
  return (
    <h2
      className="font-bold leading-[1.05] mb-5"
      style={{
        fontSize: 'clamp(1.875rem, 4.5vw, 3rem)',
        letterSpacing: '-0.03em',
        color: textColor,
        maxWidth: maxWidthCh ? `${maxWidthCh}ch` : undefined,
      }}
    >
      {title.prefix}
      <span style={{ color: accentColor }}>
        <SA>{title.accent}</SA>
      </span>
    </h2>
  );
}

// ─── Function-kort (tone-varianter) ──────────────────────────────────────────

function FunctionCardView({ card }: { card: FunctionCard }) {
  const toneStyles: Record<
    FunctionCard['tone'],
    {
      bg: string;
      title: string;
      body: string;
      num: string;
      link: string;
      border?: string;
    }
  > = {
    paper: {
      bg: '#F5EFE2',
      title: '#2A2820',
      body: '#5C5A50',
      num: '#6B7A3A',
      link: '#2A2820',
      border: '1px solid rgba(42, 40, 32, 0.05)',
    },
    olive: {
      bg: '#6B7A3A',
      title: '#FAF6EC',
      body: 'rgba(245, 239, 226, 0.82)',
      num: '#E8DCC0',
      link: '#FAF6EC',
    },
    ink: {
      bg: '#2A2820',
      title: '#FAF6EC',
      body: 'rgba(245, 239, 226, 0.78)',
      num: '#8BA45D',
      link: '#FAF6EC',
    },
    sand: {
      bg: '#E8DCC0',
      title: '#2A2820',
      body: '#5C5A50',
      num: '#4D5A28',
      link: '#2A2820',
    },
  };

  const s = toneStyles[card.tone];

  return (
    <div
      className="rounded-3xl overflow-hidden flex flex-col h-full"
      style={{ background: s.bg, border: s.border }}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden" style={{ background: '#E8DCC0' }}>
        <Image
          src={card.imageSrc}
          alt={card.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 25vw"
        />
      </div>
      <div className="p-6 sm:p-7 flex-1 flex flex-col">
        <div
          className="mb-2 text-sm"
          style={{
            fontFamily: 'var(--font-instrument-serif)',
            fontStyle: 'italic',
            color: s.num,
            fontWeight: 500,
          }}
        >
          {card.num}
        </div>
        <h3
          className="font-bold mb-2.5"
          style={{ fontSize: '1.4375rem', lineHeight: 1.2, color: s.title }}
        >
          {card.title}
        </h3>
        <p
          className="mb-5"
          style={{ fontSize: '0.9375rem', lineHeight: 1.55, color: s.body }}
        >
          {card.body}
        </p>
      </div>
    </div>
  );
}

// ─── Huvudkomponent ───────────────────────────────────────────────────────────

interface HomepageV2Props {
  config: HomepageConfigV2;
}

export function HomepageV2({ config }: HomepageV2Props) {
  const {
    experimentId,
    variant,
    hero,
    ekosystem,
    functions,
    voices,
    story,
    finalCta,
  } = config;

  return (
    <div
      className={`min-h-screen flex flex-col ${instrumentSerif.variable}`}
      style={{ background: '#FAF6EC', color: '#2A2820' }}
    >
      {/* ── HEADER ── statisk (ej sticky), papper-bakgrund med svag border ── */}
      <header
        className="w-full"
        style={{
          background: 'rgba(250, 246, 236, 0.92)',
          borderBottom: '1px solid rgba(42, 40, 32, 0.06)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 flex items-center justify-between py-4">
          <Link href="/preview/start-v2" aria-label="Flocken hem" className="flex items-center">
            <Image
              src="/assets/flocken/logo/logo_icon_flocken_large_1x1.png"
              alt="Flocken"
              width={36}
              height={36}
              style={{ height: 36, width: 'auto', display: 'block' }}
            />
          </Link>
          <nav className="hidden sm:flex gap-9 text-[0.9375rem] font-medium" style={{ color: '#5C5A50' }}>
            <a href="#ekosystem" className="hover:opacity-70 transition-opacity">Kartan</a>
            <a href="#funktioner" className="hover:opacity-70 transition-opacity">Funktioner</a>
            <a href="#story" className="hover:opacity-70 transition-opacity">Bakgrund</a>
          </nav>
          <a
            href="#ladda-ner"
            className="inline-flex items-center rounded-full font-semibold transition-opacity hover:opacity-90"
            style={{
              padding: '0.625rem 1.125rem',
              background: '#2A2820',
              color: '#FAF6EC',
              fontSize: '0.875rem',
            }}
          >
            Ladda ner
          </a>
        </div>
      </header>

      {/* ── HERO ── ljus, grid med text + bild + flytande bubblor ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: '#FAF6EC' }}
        aria-label="Hero"
      >
        {/* Bakgrundsgradient (subtil cream-glow) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 700px 500px at 85% 30%, rgba(232, 220, 192, 0.5) 0%, transparent 60%), radial-gradient(ellipse 500px 400px at 15% 85%, rgba(139, 164, 93, 0.12) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8 py-12 sm:py-20">
          <div className="grid grid-cols-1 min-[960px]:grid-cols-[1.05fr_1fr] gap-12 min-[960px]:gap-16 items-center">
            {/* Vänster: text */}
            <div>
              {/* Tag */}
              <span
                className="inline-flex items-center gap-2.5 rounded-full mb-7"
                style={{
                  padding: '0.4375rem 0.875rem 0.4375rem 0.5rem',
                  background: '#F5EFE2',
                  border: '1px solid rgba(107, 122, 58, 0.2)',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: '#2A2820',
                }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{
                    background: '#6B7A3A',
                    boxShadow: '0 0 0 3px rgba(107, 122, 58, 0.2)',
                  }}
                  aria-hidden="true"
                />
                {hero.tagLabel}
              </span>

              {/* H1 */}
              <h1
                className="font-extrabold leading-[1.05] mb-6"
                style={{
                  fontSize: 'clamp(2.5rem, 6.5vw, 4.5rem)',
                  letterSpacing: '-0.025em',
                  color: '#2A2820',
                  maxWidth: '14ch',
                }}
              >
                {hero.title.prefix}
                <span style={{ color: '#6B7A3A' }}>
                  <SA>{hero.title.accent}</SA>
                </span>
              </h1>

              {/* Lead */}
              <p
                className="mb-8"
                style={{
                  fontSize: 'clamp(1.0625rem, 2vw, 1.1875rem)',
                  lineHeight: 1.55,
                  color: '#5C5A50',
                  maxWidth: '32rem',
                }}
              >
                {hero.lead}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-8">
                <VLandingCTAV2
                  label={hero.ctaLabel}
                  experimentId={experimentId}
                  variant={variant}
                  position="hero"
                />
                <a
                  href={hero.secondaryCtaHref}
                  className="inline-flex items-center rounded-full font-semibold transition-colors"
                  style={{
                    padding: '0.875rem 1.5rem',
                    background: 'transparent',
                    color: '#2A2820',
                    border: '1.5px solid rgba(42, 40, 32, 0.18)',
                    fontSize: '0.9375rem',
                  }}
                >
                  {hero.secondaryCtaLabel}
                </a>
              </div>

              {/* Trust */}
              <div className="flex items-center gap-4">
                <div className="flex">
                  {hero.trustAvatars.map((a, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url('${a.src}')`,
                        backgroundPosition: a.objectPosition ?? 'center',
                        backgroundSize: 'cover',
                        backgroundColor: '#E8DCC0',
                        border: '2.5px solid #FAF6EC',
                        marginLeft: i === 0 ? 0 : '-10px',
                      }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#5C5A50', lineHeight: 1.4 }}>
                  <strong style={{ color: '#2A2820', fontWeight: 600, display: 'block' }}>
                    {hero.trustText}
                  </strong>
                  {hero.trustSubtext}
                </div>
              </div>
            </div>

            {/* Höger: bild-stage med floats */}
            <div
              className="relative w-full mx-auto"
              style={{ maxWidth: '520px', aspectRatio: '4 / 4.5' }}
            >
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  borderRadius: '1.75rem',
                  boxShadow: '0 30px 70px -25px rgba(42, 40, 32, 0.35)',
                  transform: 'rotate(-2deg)',
                }}
              >
                <Image
                  src={hero.imageSrc}
                  alt={hero.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 960px) 90vw, 520px"
                  priority
                />
              </div>

              {/* Float bubbles */}
              {hero.floatBubbles[0] && (
                <FloatBubble bubble={hero.floatBubbles[0]} position="top-left" />
              )}
              {hero.floatBubbles[1] && (
                <FloatBubble bubble={hero.floatBubbles[1]} position="bottom-left" />
              )}
              {hero.floatBubbles[2] && (
                <FloatBubble bubble={hero.floatBubbles[2]} position="top-right" />
              )}
              {hero.floatBubbles[3] && (
                <FloatBubble bubble={hero.floatBubbles[3]} position="bottom-right" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── EKOSYSTEM ── olive-deep, text + bild med sticker (Bridge + app) ── */}
      <section
        id="ekosystem"
        className="relative overflow-hidden py-20 sm:py-24"
        style={{ background: '#4D5A28', color: '#FAF6EC' }}
        aria-label="Kartan"
      >
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-30%',
            right: '-10%',
            width: '60%',
            height: '130%',
            background: 'radial-gradient(circle, rgba(245, 239, 226, 0.05) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 min-[900px]:grid-cols-[1fr_1.05fr] gap-12 min-[900px]:gap-20 items-center">
            <div>
              <Eyebrow style={{ color: '#E8DCC0' }}>{ekosystem.eyebrow}</Eyebrow>
              <H2
                title={ekosystem.title}
                accentColor="#D4A574"
                textColor="#FAF6EC"
                maxWidthCh={18}
              />
              {ekosystem.paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="mb-4"
                  style={{
                    color: 'rgba(245, 239, 226, 0.85)',
                    fontSize: '1.0625rem',
                    lineHeight: 1.7,
                    maxWidth: '32rem',
                  }}
                >
                  {renderEmphasis(para, '#FAF6EC')}
                </p>
              ))}
              {ekosystem.stats.length > 0 && (
                <div
                  className="grid grid-cols-3 gap-6 mt-10 pt-8"
                  style={{ borderTop: '1px solid rgba(245, 239, 226, 0.15)' }}
                >
                  {ekosystem.stats.map((stat, i) => (
                    <div key={i}>
                      <div
                        className="font-extrabold"
                        style={{
                          fontSize: '2rem',
                          color: '#FAF6EC',
                          letterSpacing: '-0.03em',
                          lineHeight: 1,
                          marginBottom: '0.375rem',
                        }}
                      >
                        {stat.num}
                      </div>
                      <div
                        style={{
                          fontSize: '0.8125rem',
                          color: 'rgba(245, 239, 226, 0.7)',
                          lineHeight: 1.35,
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <div
                className="relative w-full aspect-square overflow-hidden"
                style={{
                  borderRadius: '1.75rem',
                  boxShadow: '0 40px 80px -30px rgba(0, 0, 0, 0.5)',
                }}
              >
                <Image
                  src={ekosystem.imageSrc}
                  alt={ekosystem.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              </div>
              <div
                className="absolute inline-flex items-center gap-2"
                style={{
                  top: '-1rem',
                  left: '-1rem',
                  background: '#FAF6EC',
                  color: '#2A2820',
                  padding: '0.875rem 1.125rem',
                  borderRadius: '999px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  boxShadow: '0 10px 25px -8px rgba(0, 0, 0, 0.25)',
                  transform: 'rotate(-4deg)',
                  border: '1px solid rgba(42, 40, 32, 0.08)',
                }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{
                    background: '#6B7A3A',
                    boxShadow: '0 0 0 4px rgba(107, 122, 58, 0.2)',
                  }}
                  aria-hidden="true"
                />
                {ekosystem.stickerLabel}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FUNCTIONS ── ljus, fyra kort med ton-variation (Bridge) ── */}
      <section
        id="funktioner"
        className="py-20 sm:py-24"
        style={{ background: '#FAF6EC' }}
        aria-label="Funktioner"
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
          <div className="max-w-[44rem] mx-auto text-center mb-14">
            <Eyebrow style={{ color: '#6B7A3A', justifyContent: 'center' }}>
              {functions.eyebrow}
            </Eyebrow>
            <h2
              className="font-bold leading-[1.05] mb-4"
              style={{
                fontSize: 'clamp(1.875rem, 4.5vw, 3rem)',
                letterSpacing: '-0.03em',
                color: '#2A2820',
              }}
            >
              {functions.title.prefix}
              <span style={{ color: '#6B7A3A' }}>
                <SA>{functions.title.accent}</SA>
              </span>
            </h2>
            <p
              style={{
                fontSize: '1.1875rem',
                lineHeight: 1.55,
                color: '#5C5A50',
              }}
            >
              {functions.lead}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 min-[1080px]:grid-cols-4 gap-5">
            {functions.cards.map((card) => (
              <FunctionCardView key={card.num} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFFERENTIATORS ── cream, tre värden (trygghet först) ── */}
      <section
        id="darfor"
        className="py-20 sm:py-24"
        style={{ background: '#F5EFE2' }}
        aria-label="Därför Flocken"
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
          <div className="text-center max-w-[40rem] mx-auto mb-14">
            {voices.eyebrow && (
              <Eyebrow style={{ color: '#6B7A3A', justifyContent: 'center' }}>
                {voices.eyebrow}
              </Eyebrow>
            )}
            <h2
              className="font-bold leading-[1.05] mb-4"
              style={{
                fontSize: 'clamp(1.875rem, 4.5vw, 3rem)',
                letterSpacing: '-0.03em',
                color: '#2A2820',
              }}
            >
              {voices.title.prefix}
              <span style={{ color: '#6B7A3A' }}>
                <SA>{voices.title.accent}</SA>
              </span>
            </h2>
            <p style={{ fontSize: '1.1875rem', lineHeight: 1.55, color: '#5C5A50', marginTop: '1rem' }}>
              {voices.lead}
            </p>
          </div>

          <div
            className={`grid grid-cols-1 ${
              voices.voices.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
            } gap-5 max-w-[900px] mx-auto`}
          >
            {voices.voices.map((voice, i) => {
              // Mittenkortet (om 3 kort) får mörk variant
              const isDark = voices.voices.length === 3 && i === 1;
              return (
                <div
                  key={i}
                  className="rounded-2xl p-7"
                  style={
                    isDark
                      ? {
                          background: '#2A2820',
                          color: '#FAF6EC',
                          transform: 'translateY(-12px)',
                        }
                      : {
                          background: i === 0 ? '#FAF6EC' : '#E8DCC0',
                          color: '#2A2820',
                        }
                  }
                >
                  <div
                    className="mb-4"
                    style={{
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      letterSpacing: '0.02em',
                      color: isDark ? '#D4A574' : '#6B7A3A',
                    }}
                  >
                    {voice.authorName}
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-instrument-serif)',
                      fontStyle: 'italic',
                      fontSize: '1.1875rem',
                      lineHeight: 1.45,
                      color: isDark ? '#FAF6EC' : '#2A2820',
                    }}
                  >
                    {voice.quote}
                  </p>
                  {voice.authorMeta && (
                    <div
                      className="mt-3"
                      style={{
                        fontSize: '0.8125rem',
                        color: isDark ? 'rgba(245, 239, 226, 0.6)' : '#94907F',
                      }}
                    >
                      {voice.authorMeta}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STORY ── mörk bakgrund, bild + text + pullquote (Verkligt) ── */}
      <section
        id="story"
        className="relative overflow-hidden py-20 sm:py-24"
        style={{ background: '#2A2820', color: '#FAF6EC' }}
        aria-label="Bakgrund"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 600px 400px at 80% 20%, rgba(139, 164, 93, 0.08) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 min-[880px]:grid-cols-2 gap-12 min-[880px]:gap-20 items-center">
            {/* Bild */}
            <div
              className="relative w-full aspect-square overflow-hidden"
              style={{
                borderRadius: '1.5rem',
                boxShadow: '0 30px 60px -20px rgba(0, 0, 0, 0.5)',
              }}
            >
              <Image
                src={story.imageSrc}
                alt={story.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 880px) 100vw, 50vw"
              />
            </div>
            {/* Text */}
            <div>
              <Eyebrow style={{ color: '#8BA45D' }}>{story.eyebrow}</Eyebrow>
              <H2
                title={story.title}
                accentColor="#D4A574"
                textColor="#FAF6EC"
                maxWidthCh={20}
              />
              {story.paragraphs[0] && (
                <p
                  className="mb-6"
                  style={{
                    color: 'rgba(245, 239, 226, 0.78)',
                    fontSize: '1.0625rem',
                    lineHeight: 1.7,
                    maxWidth: '32rem',
                  }}
                >
                  {renderEmphasis(story.paragraphs[0], '#FAF6EC')}
                </p>
              )}
              <blockquote
                style={{
                  paddingLeft: '1.5rem',
                  borderLeft: '3px solid #D4A574',
                  fontFamily: 'var(--font-instrument-serif)',
                  fontStyle: 'italic',
                  fontSize: '1.5rem',
                  lineHeight: 1.35,
                  color: '#FAF6EC',
                  maxWidth: '26rem',
                }}
              >
                {story.pullquote}
              </blockquote>
              {story.pullquoteAuthor && (
                <div
                  className="mt-3 mb-6"
                  style={{
                    paddingLeft: '1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#8BA45D',
                  }}
                >
                  {story.pullquoteAuthor}
                </div>
              )}
              {story.paragraphs.slice(1).map((para, i) => (
                <p
                  key={i}
                  className="mb-4"
                  style={{
                    color: 'rgba(245, 239, 226, 0.78)',
                    fontSize: '1.0625rem',
                    lineHeight: 1.7,
                    maxWidth: '32rem',
                  }}
                >
                  {renderEmphasis(para, '#FAF6EC')}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── olive-deep kort i papper-sektion (Community + FOMO) ── */}
      <section
        id="ladda-ner"
        className="py-12 sm:py-20"
        style={{ background: '#FAF6EC' }}
        aria-label="Ladda ner"
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
          <div
            className="relative overflow-hidden rounded-3xl sm:rounded-[2rem] p-8 sm:p-16 grid grid-cols-1 sm:grid-cols-[1.1fr_0.9fr] gap-8 sm:gap-12 items-center"
            style={{ background: '#4D5A28', color: '#FAF6EC' }}
          >
            <div
              className="absolute pointer-events-none"
              style={{
                top: '-20%',
                right: '-10%',
                width: '60%',
                height: '140%',
                background: 'radial-gradient(circle, rgba(232, 220, 192, 0.16) 0%, transparent 60%)',
              }}
              aria-hidden="true"
            />
            <div className="relative">
              <Eyebrow style={{ color: '#E8DCC0' }}>{finalCta.eyebrow}</Eyebrow>
              <H2
                title={finalCta.title}
                accentColor="#D4A574"
                textColor="#FAF6EC"
                maxWidthCh={18}
              />
              <p
                className="mb-7"
                style={{
                  fontSize: 'clamp(1.0625rem, 2vw, 1.1875rem)',
                  lineHeight: 1.55,
                  color: 'rgba(245, 239, 226, 0.92)',
                  maxWidth: '30rem',
                }}
              >
                {finalCta.lead}
              </p>
              <VLandingCTAV2
                label={finalCta.primaryCtaLabel}
                experimentId={experimentId}
                variant={variant}
                position="closing"
              />
              <p
                className="mt-4"
                style={{
                  fontSize: '0.875rem',
                  color: 'rgba(245, 239, 226, 0.7)',
                  maxWidth: '34rem',
                }}
              >
                {finalCta.fineprint}
              </p>
            </div>
            <div
              className="hidden sm:block relative aspect-square overflow-hidden"
              style={{
                borderRadius: '1.5rem',
                boxShadow: '0 30px 60px -20px rgba(0, 0, 0, 0.3)',
                transform: 'rotate(2deg)',
              }}
            >
              <Image
                src={finalCta.imageSrc}
                alt={finalCta.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1100px) 45vw, 460px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── ink ── */}
      <footer
        className="py-8"
        style={{
          background: '#2A2820',
          borderTop: '1px solid rgba(245, 239, 226, 0.1)',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 flex flex-wrap justify-between items-center gap-4">
          <span style={{ fontSize: '0.8125rem', color: 'rgba(245, 239, 226, 0.6)' }}>
            © {new Date().getFullYear()} Flocken, en tjänst från Spitakolus AB
          </span>
          <nav className="flex gap-5">
            {[
              { href: '/integritetspolicy', label: 'Integritet' },
              { href: '/anvandarvillkor', label: 'Villkor' },
              { href: '/support', label: 'Kontakt' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontSize: '0.8125rem',
                  color: 'rgba(245, 239, 226, 0.6)',
                  textDecoration: 'none',
                }}
                className="hover:text-[#E8DCC0] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

// ─── FloatBubble ──────────────────────────────────────────────────────────────

function FloatBubble({
  bubble,
  position,
}: {
  bubble: {
    name: string;
    meta: string;
    avatarSrc: string;
    avatarPosition?: string;
  };
  position: 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right';
}) {
  const posStyle: Record<typeof position, React.CSSProperties> = {
    'top-left': { top: '5%', left: '-2%' },
    'bottom-left': { bottom: '12%', left: '0%' },
    'top-right': { top: '30%', right: '-2%' },
    'bottom-right': { bottom: '2%', right: '4%' },
  };

  return (
    <div
      className="absolute flex items-center gap-2 sm:gap-2.5"
      style={{
        ...posStyle[position],
        backgroundColor: '#FAF6EC',
        padding: '0.5rem 0.75rem 0.5rem 0.5rem',
        borderRadius: '999px',
        boxShadow: '0 8px 22px -8px rgba(42, 40, 32, 0.25)',
      }}
    >
      <div
        className="w-7 h-7 sm:w-9 sm:h-9 rounded-full overflow-hidden shrink-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${bubble.avatarSrc}')`,
          backgroundPosition: bubble.avatarPosition ?? 'center',
          backgroundSize: 'cover',
          backgroundColor: '#E8DCC0',
        }}
        aria-hidden="true"
      />
      <div style={{ fontSize: '0.75rem', lineHeight: 1.2, paddingRight: '0.375rem' }}>
        <div style={{ fontWeight: 600, color: '#2A2820' }}>{bubble.name}</div>
        <div className="hidden sm:block" style={{ color: '#94907F', fontSize: '0.6875rem' }}>
          {bubble.meta}
        </div>
      </div>
    </div>
  );
}

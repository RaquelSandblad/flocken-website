/**
 * FunktionerV2 — Funktionssida (preview). Server Component.
 *
 * Route: /preview/funktioner-v2
 * Ersätter INTE befintlig /funktioner. Rör ej (marketing)/funktioner/page.tsx.
 *
 * Designsystem (identiskt med HomepageV2):
 *  - Instrument Serif italic för rubriks-accenter (SA-komponent)
 *  - Eyebrow-mönster: 24px linje + uppercase etikett
 *  - Färger: olive #6B7A3A, olive-deep #4D5A28, ink #2A2820,
 *            paper #FAF6EC, cream #F5EFE2, sand #E8DCC0, warm #D4A574,
 *            olive-soft #8BA45D, ink-soft #5C5A50
 *
 * Sektioner:
 *   Intro → Hundar → Passa → Rasta → Besöka → Mina sidor → Final CTA → Footer
 *
 * Telefon-ram: enkel CSS-baserad (rundade hörn + skugga, ej 3D-transform).
 * Sticky func nav HOPPAS ÖVER i v1 per spec.
 * All copy och bildvägar finns i FunktionerConfigV2.ts.
 */

import { Instrument_Serif } from 'next/font/google';
import Image from 'next/image';
import { VLandingCTAV2 } from '@/components/v/VLandingCTAV2';
import type {
  FunktionerConfigV2,
  FuncSection,
  FuncBackground,
} from './FunktionerConfigV2';

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

// ─── Bakgrundstema-tokens ─────────────────────────────────────────────────────

type BgTokens = {
  bg: string;
  text: string;
  textSoft: string;
  accentColor: string;
  eyebrowColor: string;
  funcNumColor: string;
  stepNumBg: string;
  stepNumText: string;
  chipBg: string;
  chipText: string;
  chipBorder: string;
  calloutBg: string;
  calloutBorder: string;
  calloutLabelColor: string;
  calloutTextColor: string;
  stickerBg: string;
  stickerText: string;
};

const BG_TOKENS: Record<FuncBackground, BgTokens> = {
  paper: {
    bg: '#FAF6EC',
    text: '#2A2820',
    textSoft: '#5C5A50',
    accentColor: '#6B7A3A',
    eyebrowColor: '#6B7A3A',
    funcNumColor: '#6B7A3A',
    stepNumBg: '#6B7A3A',
    stepNumText: '#FAF6EC',
    chipBg: '#FAF6EC',
    chipText: '#2A2820',
    chipBorder: 'rgba(42,40,32,0.12)',
    calloutBg: 'rgba(107,122,58,0.06)',
    calloutBorder: '#6B7A3A',
    calloutLabelColor: '#6B7A3A',
    calloutTextColor: '#5C5A50',
    stickerBg: '#FAF6EC',
    stickerText: '#2A2820',
  },
  cream: {
    bg: '#F5EFE2',
    text: '#2A2820',
    textSoft: '#5C5A50',
    accentColor: '#6B7A3A',
    eyebrowColor: '#6B7A3A',
    funcNumColor: '#6B7A3A',
    stepNumBg: '#6B7A3A',
    stepNumText: '#FAF6EC',
    chipBg: '#FAF6EC',
    chipText: '#2A2820',
    chipBorder: 'rgba(42,40,32,0.12)',
    calloutBg: 'rgba(107,122,58,0.06)',
    calloutBorder: '#6B7A3A',
    calloutLabelColor: '#6B7A3A',
    calloutTextColor: '#5C5A50',
    stickerBg: '#FAF6EC',
    stickerText: '#2A2820',
  },
  ink: {
    bg: '#2A2820',
    text: '#FAF6EC',
    textSoft: 'rgba(245,239,226,0.85)',
    accentColor: '#D4A574',
    eyebrowColor: '#8BA45D',
    funcNumColor: '#D4A574',
    stepNumBg: '#D4A574',
    stepNumText: '#2A2820',
    chipBg: 'rgba(245,239,226,0.08)',
    chipText: 'rgba(245,239,226,0.9)',
    chipBorder: 'rgba(245,239,226,0.18)',
    calloutBg: 'rgba(245,239,226,0.08)',
    calloutBorder: 'rgba(245,239,226,0.15)',
    calloutLabelColor: '#D4A574',
    calloutTextColor: 'rgba(245,239,226,0.9)',
    stickerBg: '#FAF6EC',
    stickerText: '#2A2820',
  },
  sand: {
    bg: '#E8DCC0',
    text: '#2A2820',
    textSoft: '#5C5A50',
    accentColor: '#4D5A28',
    eyebrowColor: '#4D5A28',
    funcNumColor: '#4D5A28',
    stepNumBg: '#4D5A28',
    stepNumText: '#FAF6EC',
    chipBg: 'rgba(245,239,226,0.6)',
    chipText: '#2A2820',
    chipBorder: 'rgba(42,40,32,0.12)',
    calloutBg: 'rgba(107,122,58,0.06)',
    calloutBorder: '#4D5A28',
    calloutLabelColor: '#4D5A28',
    calloutTextColor: '#5C5A50',
    stickerBg: '#FAF6EC',
    stickerText: '#2A2820',
  },
};

// ─── Telefon-ram ──────────────────────────────────────────────────────────────

function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="relative w-full mx-auto"
      style={{ maxWidth: 300, aspectRatio: '296 / 612' }}
    >
      {/* Telefonkropp (gradient-bezel) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 52,
          padding: 6,
          background:
            'linear-gradient(150deg,#43454d 0%,#26282e 28%,#3a3c43 52%,#1f2126 100%)',
          boxShadow:
            '0 2px 1px rgba(255,255,255,.16) inset, 0 -1px 3px rgba(0,0,0,.55) inset, 0 50px 80px -26px rgba(20,24,30,.55), 0 22px 40px -28px rgba(20,24,30,.5)',
        }}
      >
        {/* Glansig kant */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 2,
            borderRadius: 50,
            background:
              'linear-gradient(150deg,rgba(255,255,255,.22),transparent 22%,transparent 78%,rgba(255,255,255,.1))',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />
        {/* Skärm */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: 46,
            overflow: 'hidden',
            background: '#0b0b0d',
            boxShadow: '0 0 0 1px #000',
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            style={{ objectPosition: 'center top' }}
            sizes="(max-width: 900px) 80vw, 300px"
          />
          {/* Dynamic island */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 15,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 90,
              height: 25,
              background: '#000',
              borderRadius: 15,
              zIndex: 4,
            }}
          />
          {/* Glare */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 46,
              zIndex: 5,
              pointerEvents: 'none',
              background:
                'linear-gradient(122deg,rgba(255,255,255,.14) 0%,rgba(255,255,255,.03) 16%,transparent 36%)',
            }}
          />
        </div>
        {/* Sidoknappar */}
        <div aria-hidden="true" style={{ position: 'absolute', right: -2.5, top: '27.5%', width: 3.5, height: '12.4%', background: 'linear-gradient(90deg,#1b1c20,#34363d)', borderRadius: 3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', left: -2.5, top: '24%', width: 3.5, height: '7.2%', background: 'linear-gradient(90deg,#34363d,#1b1c20)', borderRadius: 3 }} />
        <div aria-hidden="true" style={{ position: 'absolute', left: -2.5, top: '33%', width: 3.5, height: '7.2%', background: 'linear-gradient(90deg,#34363d,#1b1c20)', borderRadius: 3 }} />
      </div>
    </div>
  );
}

// ─── Sticker-badge ─────────────────────────────────────────────────────────────

function Sticker({
  text,
  pos,
  bg,
  textColor,
}: {
  text: string;
  pos: 'top' | 'bottom';
  bg: string;
  textColor: string;
}) {
  const posStyle: React.CSSProperties =
    pos === 'top'
      ? { top: '6%', right: '-1rem', transform: 'rotate(3deg)' }
      : { bottom: '10%', left: '-1rem', transform: 'rotate(-3deg)' };

  return (
    <div
      style={{
        position: 'absolute',
        ...posStyle,
        background: bg,
        color: textColor,
        padding: '0.625rem 0.875rem',
        borderRadius: 999,
        fontSize: '0.8125rem',
        fontWeight: 600,
        boxShadow: '0 8px 22px -8px rgba(42,40,32,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        zIndex: 3,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#6B7A3A',
          boxShadow: '0 0 0 4px rgba(107,122,58,0.2)',
          flexShrink: 0,
          display: 'inline-block',
        }}
      />
      {text}
    </div>
  );
}

// ─── Funktionssektion ─────────────────────────────────────────────────────────

function FuncBlock({ section }: { section: FuncSection }) {
  const t = BG_TOKENS[section.bg];

  return (
    <section
      id={section.id}
      className="py-16 sm:py-24"
      style={{ background: t.bg, color: t.text, scrollMarginTop: '5rem' }}
      aria-label={section.funcNum}
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div
          className={`grid grid-cols-1 items-start gap-10 min-[900px]:gap-16 min-[900px]:grid-cols-[0.85fr_1fr]`}
        >
          {/* Bild-kolumn */}
          <div
            className={`relative max-w-[320px] w-full mx-auto min-[900px]:max-w-[360px] ${
              section.flip ? 'min-[900px]:order-2 min-[900px]:ml-auto min-[900px]:mr-0' : 'min-[900px]:order-1 min-[900px]:ml-0'
            }`}
          >
            {section.preFramed ? (
              <Image
                src={section.imageSrc}
                alt={section.imageAlt}
                width={500}
                height={1020}
                className="w-full h-auto"
                style={{ filter: 'drop-shadow(0 30px 60px rgba(42,40,32,0.3))' }}
                sizes="(max-width: 900px) 80vw, 360px"
              />
            ) : (
              <PhoneFrame src={section.imageSrc} alt={section.imageAlt} />
            )}
            <Sticker
              text={section.stickerText}
              pos={section.stickerPos}
              bg={t.stickerBg}
              textColor={t.stickerText}
            />
          </div>

          {/* Text-kolumn */}
          <div
            className={`${
              section.flip ? 'min-[900px]:order-1' : 'min-[900px]:order-2'
            }`}
          >
            {/* Func-nummer */}
            <div
              className="mb-3 text-[1.125rem]"
              style={{
                fontFamily: 'var(--font-instrument-serif)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: t.funcNumColor,
                letterSpacing: 0,
              }}
            >
              {section.funcNum}
            </div>

            {/* H2 */}
            <h2
              className="font-bold leading-[1.05] mb-4"
              style={{
                fontSize: 'clamp(1.875rem, 4.5vw, 3rem)',
                letterSpacing: '-0.03em',
                color: t.text,
              }}
            >
              {section.title.prefix}
              <span style={{ color: t.accentColor }}>
                <SA>{section.title.accent}</SA>
              </span>
            </h2>

            {/* Lead */}
            <p
              className="mb-8"
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.55,
                color: t.textSoft,
                maxWidth: '30rem',
              }}
            >
              {section.lead}
            </p>

            {/* Feature-chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {section.chips.map((chip) => (
                <span
                  key={chip}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4375rem 0.875rem',
                    background: t.chipBg,
                    color: t.chipText,
                    border: `1px solid ${t.chipBorder}`,
                    borderRadius: 999,
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 5,
                      height: 5,
                      background: t.accentColor,
                      borderRadius: '50%',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                  {chip}
                </span>
              ))}
            </div>

            {/* 3 numrerade steg */}
            <ol className="flex flex-col gap-5 mb-8">
              {section.steps.map((step, idx) => (
                <li key={idx} className="grid gap-4" style={{ gridTemplateColumns: '2rem 1fr' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-instrument-serif)',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      fontSize: '1.5rem',
                      color: t.stepNumText,
                      background: t.stepNumBg,
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1,
                      flexShrink: 0,
                      marginTop: '0.125rem',
                    }}
                    aria-hidden="true"
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <strong
                      style={{
                        display: 'block',
                        fontWeight: 600,
                        color: t.text,
                        marginBottom: '0.25rem',
                        fontSize: '1rem',
                      }}
                    >
                      {step.title}
                    </strong>
                    <p
                      style={{
                        fontSize: '0.9375rem',
                        lineHeight: 1.5,
                        color: t.textSoft,
                        margin: 0,
                      }}
                    >
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Bra att veta-callout (valfri) */}
            {section.callout && (
              <div
                style={{
                  padding: '1.25rem 1.375rem',
                  background: t.calloutBg,
                  borderLeft: `3px solid ${t.calloutBorder}`,
                  borderRadius: '0 0.75rem 0.75rem 0',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-instrument-serif)',
                    fontStyle: 'italic',
                    fontSize: '0.9375rem',
                    color: t.calloutLabelColor,
                    marginBottom: '0.25rem',
                  }}
                >
                  {section.calloutLabel ?? 'Bra att veta'}
                </div>
                <p
                  style={{
                    fontSize: '0.9375rem',
                    lineHeight: 1.55,
                    color: t.calloutTextColor,
                    margin: 0,
                  }}
                >
                  {section.callout}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Huvudkomponent ───────────────────────────────────────────────────────────

interface FunktionerV2Props {
  config: FunktionerConfigV2;
}

export function FunktionerV2({ config }: FunktionerV2Props) {
  const { experimentId, variant, intro, funcs, minaSidor, finalCta } = config;

  return (
    <div
      className={`min-h-screen flex flex-col ${instrumentSerif.variable}`}
      style={{ background: '#FAF6EC', color: '#2A2820' }}
    >
      {/* Header kommer från (marketing)-layouten (HeaderV2). */}

      {/* ── INTRO ── ljus, text-fokus ── */}
      <section
        className="relative overflow-hidden py-12 sm:py-20"
        style={{ background: '#FAF6EC' }}
        aria-label="Intro"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 600px 400px at 85% 30%, rgba(232,220,192,0.5) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8">
          <div className="max-w-[760px]">
            <Eyebrow style={{ color: '#6B7A3A' }}>{intro.eyebrow}</Eyebrow>
            <h1
              className="font-extrabold leading-[1.05] mb-5"
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                letterSpacing: '-0.025em',
                color: '#2A2820',
                maxWidth: '14ch',
              }}
            >
              {intro.title.prefix}
              <span style={{ color: '#6B7A3A' }}>
                <SA>{intro.title.accent}</SA>
              </span>
            </h1>
            <p
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.55,
                color: '#5C5A50',
                maxWidth: '32rem',
              }}
            >
              {intro.lead}
            </p>
          </div>
        </div>
      </section>

      {/* ── FYRA FUNKTIONSSEKTIONER ── */}
      {funcs.map((func) => (
        <FuncBlock key={func.id} section={func} />
      ))}

      {/* ── MINA SIDOR ── papper, 4 kort ── */}
      <section
        id="mina-sidor"
        className="py-16 sm:py-24"
        style={{ background: '#FAF6EC' }}
        aria-label="Mina sidor"
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
          <div className="max-w-[44rem] mx-auto text-center mb-12">
            <Eyebrow style={{ color: '#6B7A3A', justifyContent: 'center' }}>
              {minaSidor.eyebrow}
            </Eyebrow>
            <h2
              className="font-bold leading-[1.05] mb-4"
              style={{
                fontSize: 'clamp(1.875rem, 4.5vw, 3rem)',
                letterSpacing: '-0.03em',
                color: '#2A2820',
              }}
            >
              {minaSidor.title.prefix}
              <span style={{ color: '#6B7A3A' }}>
                <SA>{minaSidor.title.accent}</SA>
              </span>
            </h2>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.55, color: '#5C5A50' }}>
              {minaSidor.lead}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-[1000px] mx-auto">
            {minaSidor.cards.map((card) => (
              <div
                key={card.title}
                className="flex flex-col items-center text-center transition-transform hover:-translate-y-1"
              >
                <div className="w-full max-w-[230px] mb-7">
                  <PhoneFrame src={card.imageSrc} alt={card.imageAlt} />
                </div>
                <div className="px-2">
                  <h3
                    className="font-bold mb-2"
                    style={{ fontSize: '1.1875rem', lineHeight: 1.2, color: '#2A2820' }}
                  >
                    {card.title}
                  </h3>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.5, color: '#5C5A50' }}>
                    {card.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── olive-deep kort i papper-sektion ── */}
      <section
        id="ladda-ner"
        className="py-12 sm:py-20"
        style={{ background: '#FAF6EC' }}
        aria-label="Ladda ner"
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
          <div
            className="relative overflow-hidden rounded-3xl sm:rounded-[2rem] p-8 sm:p-16 text-center"
            style={{ background: '#4D5A28', color: '#FAF6EC' }}
          >
            <div
              className="absolute pointer-events-none"
              style={{
                top: '-20%',
                right: '-10%',
                width: '60%',
                height: '140%',
                background: 'radial-gradient(circle, rgba(232,220,192,0.14) 0%, transparent 60%)',
              }}
              aria-hidden="true"
            />
            <div className="relative">
              <Eyebrow style={{ color: '#E8DCC0', justifyContent: 'center' }}>
                {finalCta.eyebrow}
              </Eyebrow>
              <h2
                className="font-bold leading-[1.05] mb-5"
                style={{
                  fontSize: 'clamp(1.875rem, 4.5vw, 3rem)',
                  letterSpacing: '-0.03em',
                  color: '#FAF6EC',
                  maxWidth: '18ch',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                {finalCta.title.prefix}
                <span style={{ color: '#D4A574' }}>
                  <SA>{finalCta.title.accent}</SA>
                </span>
              </h2>
              <p
                className="mb-8"
                style={{
                  fontSize: 'clamp(1.0625rem, 2vw, 1.1875rem)',
                  lineHeight: 1.55,
                  color: 'rgba(245,239,226,0.92)',
                  maxWidth: '28rem',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                {finalCta.lead}
              </p>
              <div className="flex justify-center">
                <VLandingCTAV2
                  label={finalCta.ctaLabel}
                  experimentId={experimentId}
                  variant={variant}
                  position="closing"
                />
              </div>
              <p
                className="mt-5"
                style={{
                  fontSize: '0.875rem',
                  color: 'rgba(245,239,226,0.7)',
                }}
              >
                {finalCta.fineprint}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer kommer från (marketing)-layouten (HomepageFooterV2). */}
    </div>
  );
}

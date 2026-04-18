'use client';

import { useEffect, useRef, useState } from 'react';
import { trackAppInstall } from '@/lib/tracking';

const EXPERIMENT_ID = 'quiz_app_cta_v1';
const STORAGE_KEY = 'flocken_ab_quiz_app_cta_v1';
const APPSTORE_URL = 'https://apps.apple.com/app/flocken/id6755424578';
const PLAYSTORE_URL = 'https://play.google.com/store/apps/details?id=com.bastavan.app';
const DOWNLOAD_URL = 'https://flocken.info/download'; // fallback for desktop/unknown

type VariantId = 'A' | 'B' | 'C';
type Platform = 'ios' | 'android' | 'desktop';
type Position = 'after_badge' | 'after_review';

interface VariantContent {
  headline: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
}

// A/B/C-test: tre vinklar mäts mot varandra – upptäckt (karta), förtroende (profil), enkelhet (sök).
// Clay-stil återanvänder etablerade v-passa-bilder (2026-04-15) så CTA talar samma visuella språk
// som landningssidorna istället för photorealistiska stockhänder.
const VARIANTS: Record<VariantId, VariantContent> = {
  A: {
    headline: 'Hitta hundvakter på kartan',
    body: 'Zooma in där du bor och se vem som är ledig – på några sekunder.',
    imageSrc: '/assets/flocken/v-passa/arg2-hand-karta-hundvakter.jpg',
    imageAlt: 'Clay-hand som håller telefon med Flockens karta – hundvakter markerade över hela Sverige',
  },
  B: {
    headline: 'Välj en hundvakt du känner dig trygg med',
    body: 'Profiler med bild, beskrivning och bokning – så du vet vem du möter.',
    imageSrc: '/assets/flocken/v-passa/arg1-hand-yasmin-profil.jpg',
    imageAlt: 'Clay-hand som håller telefon med hundvaktsprofilen Yasmin och hennes golden retriever',
  },
  C: {
    headline: 'Hitta rätt hundvakt på 30 sekunder',
    body: 'Välj tjänst och storlek – så ser du alla som passar just din hund.',
    imageSrc: '/assets/flocken/v-passa/arg2-hand-sok-hundvakt.jpg',
    imageAlt: 'Clay-hand som håller telefon med Flockens sökformulär för hundvakt',
  },
};

const ALL_VARIANTS: VariantId[] = ['A', 'B', 'C'];

// Module-scope dedupe så dubbelrenderingar i samma besök inte dubbelräknas.
// Nyckel: `${quizSlug}|${position}`.
const trackedViews = new Set<string>();

function isValidVariant(v: string | null): v is VariantId {
  return v !== null && (ALL_VARIANTS as string[]).includes(v);
}

function pickVariant(): VariantId {
  return ALL_VARIANTS[Math.floor(Math.random() * ALL_VARIANTS.length)];
}

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'ios';
  // iPadOS 13+ reports as Macintosh
  if (ua.includes('macintosh') && 'ontouchend' in document) return 'ios';
  if (ua.includes('android')) return 'android';
  return 'desktop';
}

function getCtaUrl(platform: Platform): string {
  if (platform === 'ios') return APPSTORE_URL;
  if (platform === 'android') return PLAYSTORE_URL;
  return DOWNLOAD_URL;
}

function getCtaLabel(platform: Platform): string {
  if (platform === 'ios') return 'Ladda ner på App Store';
  if (platform === 'android') return 'Ladda ner på Google Play';
  return 'Ladda ner Flocken-appen';
}

interface AppCtaModuleProps {
  quizSlug: string;
  position?: Position;
}

export function AppCtaModule({ quizSlug, position = 'after_badge' }: AppCtaModuleProps) {
  const [variant, setVariant] = useState<VariantId | null>(null);
  const [imgError, setImgError] = useState(false);
  const [platform, setPlatform] = useState<Platform>('desktop');
  const hasTrackedView = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const resolved = isValidVariant(stored) ? stored : pickVariant();

    if (!isValidVariant(stored)) {
      localStorage.setItem(STORAGE_KEY, resolved);
    }

    setVariant(resolved);
    setPlatform(detectPlatform());
  }, []);

  useEffect(() => {
    if (!variant || hasTrackedView.current) return;

    // Dedupe view tracking across module remounts in same session
    const dedupeKey = `${quizSlug}|${position}`;
    if (trackedViews.has(dedupeKey)) {
      hasTrackedView.current = true;
      return;
    }
    trackedViews.add(dedupeKey);
    hasTrackedView.current = true;

    const eventData = {
      experiment_id: EXPERIMENT_ID,
      variant_id: variant,
      quiz_slug: quizSlug,
      cta_position: position,
    };

    // GA4 via gtag (direct - same as click tracking)
    if (window.gtag) {
      window.gtag('event', 'quiz_app_cta_view', eventData);
    }

    // GTM dataLayer (backup)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'quiz_app_cta_view',
      ...eventData,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[Quiz CTA] View tracked:', eventData);
    }
  }, [variant, quizSlug, position]);

  if (!variant) {
    return (
      <div
        className="animate-pulse overflow-hidden rounded-[var(--quiz-radius-card)] border border-flocken-warm/40 bg-flocken-cream shadow-card"
        aria-hidden="true"
      >
        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:gap-6 md:p-6">
          <div className="aspect-square w-full rounded-2xl bg-flocken-warm/20 md:h-[220px] md:w-[220px] md:flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-7 w-3/4 rounded bg-flocken-warm/20" />
            <div className="h-4 w-2/3 rounded bg-flocken-warm/15" />
            <div className="h-12 w-full rounded-xl bg-flocken-warm/25 md:w-56" />
          </div>
        </div>
      </div>
    );
  }

  const content = VARIANTS[variant];
  const ctaUrl = getCtaUrl(platform);
  const ctaLabel = getCtaLabel(platform);
  const isReviewPosition = position === 'after_review';

  function handleClick() {
    // Meta Pixel: standard Lead-event + CAPI via tracking-biblioteket (platform-specifikt)
    if (platform === 'ios' || platform === 'android') {
      trackAppInstall(platform, `quiz_result_${quizSlug}_${position}`);
    }

    const eventData = {
      experiment_id: EXPERIMENT_ID,
      variant_id: variant,
      cta_name: 'quiz_result_download',
      cta_destination: ctaUrl,
      cta_platform: platform,
      cta_position: position,
      quiz_slug: quizSlug,
      source: 'quiz_result',
      click_location: 'quiz_end_card',
    };

    // GA4 direct (quiz-specifik namngivning)
    if (window.gtag) {
      window.gtag('event', 'cta_click', eventData);
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'cta_click',
      ...eventData,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[Quiz CTA] Click tracked:', {
        ...eventData,
        meta_event: platform !== 'desktop' ? 'Lead (standard via trackAppInstall)' : 'dataLayer only',
      });
    }
  }

  return (
    <a
      href={ctaUrl}
      onClick={handleClick}
      className="group block overflow-hidden rounded-[var(--quiz-radius-card)] border border-flocken-warm/40 bg-flocken-cream no-underline shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
      aria-label={`${content.headline} – Ladda ner Flocken-appen`}
    >
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:gap-6 md:p-6">

        {/* Clay-hand-mockup — samma visuella språk som v/passa */}
        <div className="flex-shrink-0 self-center md:self-stretch">
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={content.imageSrc}
              alt={content.imageAlt}
              onError={() => setImgError(true)}
              width={640}
              height={640}
              loading="lazy"
              className="mx-auto h-auto w-[240px] rounded-2xl object-cover shadow-soft transition-transform duration-300 group-hover:scale-[1.02] sm:w-[280px] md:h-[240px] md:w-[240px]"
            />
          ) : (
            <div className="flex h-[240px] w-[240px] items-center justify-center rounded-2xl bg-flocken-sand">
              <span className="text-5xl">🐾</span>
            </div>
          )}
        </div>

        {/* Text + CTA */}
        <div className="flex min-w-0 flex-1 flex-col items-center text-center md:items-start md:text-left">
          {/* Eyebrow-label — diskret kategorisering, ger textblocket ett ankare */}
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-flocken-olive">
            Flocken-appen
          </p>

          {/* Headline */}
          <h2 className="mt-2 text-balance text-[22px] font-bold leading-tight text-flocken-brown sm:text-2xl md:text-[26px]">
            {content.headline}
          </h2>

          {/* Body */}
          <p className="mt-2 text-sm leading-relaxed text-flocken-gray md:text-base">
            {content.body}
          </p>

          {/* Social proof — andra positionen fångar engagerade användare */}
          {isReviewPosition && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-flocken-olive">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-3.5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77l-5.2 2.73.99-5.78L1.58 7.62l5.82-.85L10 1.5z"
                  clipRule="evenodd"
                />
              </svg>
              2 000+ hundägare använder Flocken-appen
            </p>
          )}

          {/* CTA-knapp — olive på cream ger stark kontrast mot klickbarheten */}
          <div className="mt-5 w-full md:w-auto">
            <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-flocken-olive px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-colors group-hover:bg-flocken-accent md:w-auto md:text-base">
              {ctaLabel}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>

          {/* Subtext — visas bara på desktop (mobilknappen säger redan App Store/Google Play) */}
          {platform === 'desktop' && (
            <p className="mt-2.5 text-xs font-medium text-flocken-gray">
              Gratis — iOS och Android
            </p>
          )}
        </div>

      </div>
    </a>
  );
}

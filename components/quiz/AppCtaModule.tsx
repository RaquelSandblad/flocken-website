'use client';

import { useEffect, useRef, useState } from 'react';

const EXPERIMENT_ID = 'quiz_app_cta_v1';
const STORAGE_KEY = 'flocken_ab_quiz_app_cta_v1';
const APPSTORE_URL = 'https://apps.apple.com/app/flocken/id6755424578';
const PLAYSTORE_URL = 'https://play.google.com/store/apps/details?id=com.bastavan.app';
const DOWNLOAD_URL = 'https://flocken.info/download'; // fallback for desktop/unknown

type VariantId = 'A' | 'B' | 'C';
type Platform = 'ios' | 'android' | 'desktop';

interface VariantContent {
  headline: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
}

const VARIANTS: Record<VariantId, VariantContent> = {
  A: {
    headline: 'Se hundar på kartan i din stad',
    body: 'Scrolla bland hundar – lägg upp din egen på några minuter',
    imageSrc: '/assets/flocken/quiz-cta/hand-final-karta.png',
    imageAlt: 'Hand som håller telefon med Flockens karta',
  },
  B: {
    headline: 'Hitta hundar som matchar din',
    body: 'Se personlighet och bilder – hitta rätt match direkt',
    imageSrc: '/assets/flocken/quiz-cta/hand-final-match.png',
    imageAlt: 'Hand som håller telefon med hundprofiler i Flocken',
  },
  C: {
    headline: 'Hitta hundvakt som passar dig',
    body: 'Se hundvakter nära dig – nya varje dag',
    imageSrc: '/assets/flocken/quiz-cta/hand-final-hundvakt.png',
    imageAlt: 'Hand som håller telefon med hundvaktsprofil i Flocken',
  },
};

const ALL_VARIANTS: VariantId[] = ['A', 'B', 'C'];

function isValidVariant(v: string | null): v is VariantId {
  return v !== null && (ALL_VARIANTS as string[]).includes(v);
}

function pickVariant(): VariantId {
  return ALL_VARIANTS[Math.floor(Math.random() * ALL_VARIANTS.length)];
}

interface AppCtaModuleProps {
  quizSlug: string;
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

export function AppCtaModule({ quizSlug }: AppCtaModuleProps) {
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
    hasTrackedView.current = true;

    const eventData = {
      experiment_id: EXPERIMENT_ID,
      variant_id: variant,
      quiz_slug: quizSlug,
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
  }, [variant, quizSlug]);

  if (!variant) {
    return (
      <div
        className="animate-pulse overflow-hidden rounded-2xl bg-flocken-olive shadow-lg"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-4 p-8 md:flex-row md:gap-8 md:p-10">
          <div className="h-[200px] w-[120px] rounded-2xl bg-white/10" />
          <div className="flex-1 space-y-3">
            <div className="h-3 w-24 rounded bg-white/15" />
            <div className="h-7 w-3/4 rounded bg-white/15" />
            <div className="h-4 w-2/3 rounded bg-white/10" />
            <div className="h-11 w-48 rounded-xl bg-white/15" />
          </div>
        </div>
      </div>
    );
  }

  const content = VARIANTS[variant];
  const ctaUrl = getCtaUrl(platform);
  const ctaLabel = getCtaLabel(platform);

  function handleClick() {
    const eventData = {
      experiment_id: EXPERIMENT_ID,
      variant_id: variant,
      cta_name: 'quiz_result_download',
      cta_destination: ctaUrl,
      cta_platform: platform,
      quiz_slug: quizSlug,
      source: 'quiz_result',
    };

    if (window.gtag) {
      window.gtag('event', 'cta_click', eventData);
    }

    if (window.fbq) {
      window.fbq('trackCustom', 'CTAClick', eventData);
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'cta_click',
      ...eventData,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[Quiz CTA] Click tracked:', eventData);
    }
  }

  return (
    <a
      href={ctaUrl}
      onClick={handleClick}
      className="group block overflow-hidden rounded-2xl bg-flocken-olive no-underline shadow-lg transition-all hover:shadow-xl hover:brightness-105"
      aria-label={`${content.headline} – Ladda ner Flocken-appen`}
    >
      <div className="flex flex-col items-center gap-4 px-6 pb-7 pt-6 md:flex-row md:gap-10 md:px-10 md:py-8">

        {/* Phone mockup */}
        <div className="flex-shrink-0">
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={content.imageSrc}
              alt={content.imageAlt}
              onError={() => setImgError(true)}
              className="h-[220px] w-auto drop-shadow-2xl md:h-[260px]"
            />
          ) : (
            <div className="flex h-[220px] w-[110px] items-center justify-center rounded-2xl bg-white/10 md:h-[260px] md:w-[130px]">
              <span className="text-3xl">🐾</span>
            </div>
          )}
        </div>

        {/* Text + CTA */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          {/* Label */}
          <span className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
            Upptäck Flocken-appen
          </span>

          {/* Headline */}
          <h2 className="mt-2 text-xl font-bold leading-snug text-white sm:text-2xl">
            {content.headline}
          </h2>

          {/* Body */}
          <p className="mt-2 text-sm leading-relaxed text-white/75">
            {content.body}
          </p>

          {/* CTA button — inverterad: vit knapp på mörk bakgrund */}
          <div className="mt-5">
            <span className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-flocken-olive shadow-md transition-colors group-hover:bg-flocken-cream">
              {ctaLabel}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-3.5"
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

          {/* Subtext */}
          <p className="mt-3 text-xs font-medium text-white/50">
            Gratis i App Store &amp; Google Play
          </p>
        </div>

      </div>
    </a>
  );
}

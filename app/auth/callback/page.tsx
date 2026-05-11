'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/shared/Container';

// Translations for the callback page
const TRANSLATIONS = {
  sv: {
    title: 'E-post bekräftad!',
    subtitle: 'Ditt konto är nu aktiverat. Öppna Flocken-appen för att komma igång.',
    openBtn: 'Öppna Flocken-appen',
    countdownPrefix: 'Öppnar appen automatiskt om',
    countdownSuffix: 'sekunder...',
    noAppHint: 'Har du inte appen? Ladda ner den gratis i',
    appStore: 'App Store',
    or: 'eller',
    googlePlay: 'Google Play',
  },
  da: {
    title: 'E-mail bekræftet!',
    subtitle: 'Din konto er nu aktiveret. Åbn Flocken-appen for at komme i gang.',
    openBtn: 'Åbn Flocken-appen',
    countdownPrefix: 'Åbner appen automatisk om',
    countdownSuffix: 'sekunder...',
    noAppHint: 'Har du ikke appen? Download den gratis i',
    appStore: 'App Store',
    or: 'eller',
    googlePlay: 'Google Play',
  },
  no: {
    title: 'E-post bekreftet!',
    subtitle: 'Kontoen din er nå aktivert. Åpne Flocken-appen for å komme i gang.',
    openBtn: 'Åpne Flocken-appen',
    countdownPrefix: 'Åpner appen automatisk om',
    countdownSuffix: 'sekunder...',
    noAppHint: 'Har du ikke appen? Last den ned gratis i',
    appStore: 'App Store',
    or: 'eller',
    googlePlay: 'Google Play',
  },
  pt: {
    title: 'E-mail confirmado!',
    subtitle: 'Sua conta foi ativada. Abra o app Flocken para começar.',
    openBtn: 'Abrir o app Flocken',
    countdownPrefix: 'Abrindo o app automaticamente em',
    countdownSuffix: 'segundos...',
    noAppHint: 'Não tem o app? Baixe grátis na',
    appStore: 'App Store',
    or: 'ou',
    googlePlay: 'Google Play',
  },
} as const;

type Lang = keyof typeof TRANSLATIONS;

function detectLang(): Lang {
  if (typeof navigator === 'undefined') return 'sv';
  const code = (navigator.language || '').toLowerCase().slice(0, 2);
  if (code === 'da') return 'da';
  if (code === 'no' || code === 'nb' || code === 'nn') return 'no';
  if (code === 'pt') return 'pt';
  return 'sv';
}

export default function AuthCallbackPage() {
  const [countdown, setCountdown] = useState(3);
  const [lang, setLang] = useState<Lang>('sv');
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    setLang(detectLang());
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      if (!hasOpened) {
        setHasOpened(true);
        window.location.href = 'flocken://';
      }
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, hasOpened]);

  const t = TRANSLATIONS[lang];

  const openApp = () => {
    setHasOpened(true);
    window.location.href = 'flocken://';
  };

  return (
    <div className="min-h-screen bg-flocken-cream flex items-center justify-center py-12 px-4">
      <Container className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-elevated p-10 text-center">

          {/* Paw icon */}
          <div className="w-20 h-20 rounded-full bg-flocken-olive flex items-center justify-center mx-auto mb-6 shadow-card">
            <span className="text-4xl">🐾</span>
          </div>

          {/* Success badge */}
          <div className="inline-flex items-center gap-2 bg-flocken-cream text-flocken-olive text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {t.title}
          </div>

          <p className="text-flocken-brown/70 text-base leading-relaxed mb-8">
            {t.subtitle}
          </p>

          {/* Open app button */}
          <button
            onClick={openApp}
            className="w-full bg-flocken-olive hover:bg-flocken-accent text-white font-bold text-base py-4 px-6 rounded-2xl transition-colors duration-150 shadow-soft mb-3"
          >
            {t.openBtn}
          </button>

          {/* Countdown hint */}
          {countdown > 0 && (
            <p className="text-flocken-gray text-sm mb-6">
              {t.countdownPrefix}{' '}
              <span className="inline-flex items-center justify-center w-6 h-6 bg-flocken-sand rounded-full text-flocken-olive font-bold text-xs">
                {countdown}
              </span>{' '}
              {t.countdownSuffix}
            </p>
          )}

          <div className="border-t border-flocken-warm my-6" />

          {/* Download hint */}
          <p className="text-flocken-gray text-sm">
            {t.noAppHint}{' '}
            <a
              href="https://apps.apple.com/app/flocken/id6739530744"
              target="_blank"
              rel="noopener noreferrer"
              className="text-flocken-olive font-semibold hover:underline"
            >
              {t.appStore}
            </a>{' '}
            {t.or}{' '}
            <a
              href="https://play.google.com/store/apps/details?id=com.spitakolus.tindog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-flocken-olive font-semibold hover:underline"
            >
              {t.googlePlay}
            </a>
          </p>

          {/* Language selector */}
          <div className="flex justify-center gap-2 mt-6">
            {(['sv', 'da', 'no', 'pt'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                  lang === l
                    ? 'bg-flocken-cream text-flocken-olive font-semibold'
                    : 'text-flocken-gray hover:text-flocken-olive hover:bg-flocken-cream'
                }`}
              >
                {l === 'sv' ? '🇸🇪' : l === 'da' ? '🇩🇰' : l === 'no' ? '🇳🇴' : '🇧🇷'} {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

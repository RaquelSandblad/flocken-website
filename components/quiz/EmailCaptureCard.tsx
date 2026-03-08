'use client';

import Image from 'next/image';
import { useState } from 'react';
import { track } from '@/lib/quiz/tracking';

interface EmailCaptureCardProps {
  quizSlug: string;
}

type Status = 'idle' | 'loading' | 'success' | 'already' | 'error';

export function EmailCaptureCard({ quizSlug }: EmailCaptureCardProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    track('quiz_email_subscribe_attempt', { slug: quizSlug });

    try {
      const res = await fetch('/api/email/quiz-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, quizSlug }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        return;
      }

      if (data.alreadySubscribed) {
        setStatus('already');
      } else {
        setStatus('success');
        track('quiz_email_subscribe_success', { slug: quizSlug });
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-[var(--quiz-radius-card)] border border-flocken-olive/30 bg-gradient-to-br from-flocken-sand/60 to-flocken-cream/80 p-6 shadow-card">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-flocken-olive text-sm text-white">
            ✓
          </span>
          <div>
            <p className="font-bold text-flocken-brown">Vi har tagit emot din mejladress!</p>
            <p className="mt-1 text-sm text-flocken-brown/70">
              Valp-quizet har skickats till din inkorg. Glöm inte att kolla skräpposten.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'already') {
    return (
      <div className="rounded-[var(--quiz-radius-card)] border border-flocken-olive/30 bg-gradient-to-br from-flocken-sand/60 to-flocken-cream/80 p-6 shadow-card">
        <p className="text-sm text-flocken-brown/70">
          Den här adressen är redan registrerad. Vi hör av oss när nästa quiz är klart!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--quiz-radius-card)] border border-flocken-olive/30 bg-gradient-to-br from-flocken-sand/60 to-flocken-cream/80 shadow-card overflow-hidden">
      {/* Mobil: hero-bild (dold på desktop) */}
      <div className="relative aspect-square w-full md:hidden">
        <Image
          src="/assets/flocken/generated/quiz_valpar_socialisering_1x1_medium.webp"
          alt="Quiz om valpar och socialisering"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Desktop: tvåkolumnslayout – text+formulär vänster, bild höger */}
      <div className="md:grid md:grid-cols-[1fr_200px]">
        {/* Text + formulär */}
        <div className="p-5">
          <p className="font-bold text-flocken-brown">Vet du när socialiseringsfönstret stänger? 🐾</p>
          <p className="mt-1 text-sm leading-relaxed text-flocken-brown/70">
            Registrera din mejladress så skickar vi valp-quizet direkt. Du får även veta först när vi släpper nya quiz.
          </p>

          <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@epost.se"
              required
              disabled={status === 'loading'}
              className="min-w-0 flex-1 rounded-[var(--quiz-radius-card)] border border-flocken-olive/30 bg-white/80 px-4 py-2.5 text-sm text-flocken-brown placeholder-flocken-gray outline-none focus:border-flocken-olive focus:ring-1 focus:ring-flocken-olive disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === 'loading' || !email}
              className="rounded-[var(--quiz-radius-card)] bg-flocken-olive px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flocken-accent disabled:opacity-60 sm:flex-shrink-0"
            >
              {status === 'loading' ? 'Skickar…' : 'Lägg till mejladressen'}
            </button>
          </form>

          {status === 'error' && (
            <p className="mt-2 text-xs text-flocken-error">Något gick fel. Försök igen om en stund.</p>
          )}

          <p className="mt-2 text-xs text-flocken-gray">
            Inga spamutskick. Du kan avregistrera dig när som helst.{' '}
            <a href="/integritetspolicy" className="underline hover:text-flocken-brown">Integritetspolicy</a>.
          </p>
        </div>

        {/* Desktop-bild: 1:1 (dold på mobil) */}
        <div className="relative hidden md:block">
          <Image
            src="/assets/flocken/generated/quiz_valpar_socialisering_1x1_medium.webp"
            alt="Quiz om valpar och socialisering"
            fill
            sizes="200px"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}

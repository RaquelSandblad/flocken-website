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
              Quizet om kända hundar har skickats. Glöm inte att kolla skräpposten.
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
      {/* Hero-bild 16:9 */}
      <div className="relative aspect-video w-full">
        <Image
          src="/assets/flocken/generated/flocken_quiz_kanda_hundar_card_medium.webp"
          alt="Quiz om kända hundar"
          fill
          sizes="(max-width: 768px) 100vw, 580px"
          className="object-cover"
          priority
        />
      </div>

      {/* Text + formulär */}
      <div className="p-5">
          <p className="font-bold text-flocken-brown">Få quizet om kända hundar – och alla nya quiz 🐾</p>
          <p className="mt-1 text-sm leading-relaxed text-flocken-brown/70">
            Skriv in din mejladress så får du quizet om kända hundar direkt. Du blir även först att få nya quiz.
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
              {status === 'loading' ? 'Skickar…' : 'Ja, meddela mig'}
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
    </div>
  );
}

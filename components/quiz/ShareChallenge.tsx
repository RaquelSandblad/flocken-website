'use client';

import { useState } from 'react';
import { track } from '@/lib/quiz/tracking';

interface ShareChallengeProps {
  slug: string;
  quizTitle: string;
  score: number;
}

export function ShareChallenge({ slug, quizTitle, score }: ShareChallengeProps) {
  const [copied, setCopied] = useState(false);

  const quizUrl = `https://quiz.flocken.info/${slug}`;
  const shareText = `Jag fick ${score}/10 på "${quizTitle}" – kan du slå mig?`;

  async function handleShare() {
    track('quiz_share', { slug, score, method: 'native' });

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: quizTitle,
          text: shareText,
          url: quizUrl,
        });
        return;
      } catch {
        // User cancelled or share failed – fall through to copy
      }
    }

    handleCopy();
  }

  async function handleCopy() {
    track('quiz_share', { slug, score, method: 'copy' });

    try {
      await navigator.clipboard.writeText(`${shareText}\n${quizUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard API not available
    }
  }

  return (
    <div className="rounded-[var(--quiz-radius-card)] border border-flocken-warm/40 bg-flocken-cream/40 p-5 shadow-card">
      <p className="text-center text-base font-bold text-flocken-brown">
        Utmana en kompis!
      </p>
      <p className="mt-1 text-center text-sm text-flocken-gray">
        Dela quizet och se vem som kan mest.
      </p>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[var(--quiz-radius-card)] border border-flocken-olive bg-white px-4 py-2.5 text-sm font-semibold text-flocken-olive transition-colors hover:bg-flocken-sand/30"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Dela quiz
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[var(--quiz-radius-card)] border border-flocken-warm/50 bg-white px-4 py-2.5 text-sm font-semibold text-flocken-brown transition-colors hover:bg-flocken-sand/30"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          {copied ? 'Kopierat!' : 'Kopiera länk'}
        </button>
      </div>
    </div>
  );
}

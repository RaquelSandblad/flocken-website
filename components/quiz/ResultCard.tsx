'use client';

import { useState } from 'react';
import { AppCtaModule } from '@/components/quiz/AppCtaModule';
import { BadgeDisplay } from '@/components/quiz/BadgeDisplay';
import { track } from '@/lib/quiz/tracking';
import type { FactQuestion, QuizDefinition } from '@/lib/quiz/types';

interface ResultCardProps {
  slug: string;
  quiz: QuizDefinition;
  score: number;
  badge: string;
  tier: 'bronze' | 'silver' | 'gold';
  interpretation: string;
  userAnswers: number[];
}

function ShareButtons({ slug, quizTitle, score }: { slug: string; quizTitle: string; score: number }) {
  const [copied, setCopied] = useState(false);
  const quizUrl = `https://quiz.flocken.info/quiz/${slug}`;
  const shareText = `Jag fick ${score}/10 på "${quizTitle}" – kan du slå mig?`;

  async function handleShare() {
    track('quiz_share', { slug, score, method: 'native' });
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: quizTitle, text: shareText, url: quizUrl });
        return;
      } catch { /* fall through */ }
    }
    handleCopy();
  }

  async function handleCopy() {
    track('quiz_share', { slug, score, method: 'copy' });
    try {
      await navigator.clipboard.writeText(`${shareText}\n${quizUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* clipboard not available */ }
  }

  return (
    <div className="mt-5 border-t border-flocken-warm/20 pt-4">
      <p className="mb-3 text-center text-sm font-semibold text-flocken-brown">Utmana en kompis!</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-[var(--quiz-radius-card)] border border-flocken-olive bg-white px-4 py-2 text-sm font-semibold text-flocken-olive transition-colors hover:bg-flocken-sand/30"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Dela quiz
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-[var(--quiz-radius-card)] border border-flocken-warm/50 bg-white px-4 py-2 text-sm font-semibold text-flocken-brown transition-colors hover:bg-flocken-sand/30"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          {copied ? 'Kopierat!' : 'Kopiera länk'}
        </button>
      </div>
    </div>
  );
}

export function ResultCard({ slug, quiz, score, badge, tier, interpretation, userAnswers }: ResultCardProps) {
  return (
    <section className="space-y-5">
      {/* 1. Score + Badge + Dela */}
      <div className="rounded-[var(--quiz-radius-card)] border border-flocken-warm/40 bg-white p-6 shadow-card">
        <p className="text-center text-sm font-semibold uppercase tracking-wide text-flocken-gray">{quiz.title}</p>

        <div className="mt-5 flex justify-center">
          <BadgeDisplay label={badge} tier={tier} score={score} />
        </div>

        <p className="mt-5 text-center leading-relaxed text-flocken-gray">{interpretation}</p>

        <ShareButtons slug={slug} quizTitle={quiz.title} score={score} />
      </div>

      {/* 2. App CTA – A/B-test (variant A/B/C/D slumpas per besökare) */}
      <AppCtaModule quizSlug={slug} />

      {/* 3. Svarsgenomgång */}
      <div className="rounded-[var(--quiz-radius-card)] border border-flocken-warm/40 bg-white p-6 shadow-card">
        <h3 className="text-lg font-bold text-flocken-brown">Dina svar</h3>
        <div className="mt-4 space-y-4">
          {quiz.questions.map((question, qIndex) => {
            const factQ = question as FactQuestion;
            const userAnswer = userAnswers[qIndex];
            const isCorrect = userAnswer === factQ.correctIndex;

            return (
              <div key={question.id} className="border-b border-flocken-warm/20 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${isCorrect ? 'bg-green-500' : 'bg-red-400'}`}
                  >
                    {qIndex + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-flocken-brown">{question.question}</p>
                    {!isCorrect && (
                      <p className="mt-1 text-sm text-red-600">
                        Ditt svar: {question.options[userAnswer]}
                      </p>
                    )}
                    <p className={`mt-1 text-sm ${isCorrect ? 'text-green-700' : 'text-green-700'}`}>
                      Rätt svar: {question.options[factQ.correctIndex]}
                    </p>
                    {factQ.explanation && (
                      <p className="mt-1.5 text-xs leading-relaxed text-flocken-gray">{factQ.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}

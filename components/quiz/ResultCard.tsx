'use client';

import { BadgeDisplay } from '@/components/quiz/BadgeDisplay';
import { EmailCaptureCard } from '@/components/quiz/EmailCaptureCard';
import { ShareChallenge } from '@/components/quiz/ShareChallenge';
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

export function ResultCard({ slug, quiz, score, badge, tier, interpretation, userAnswers }: ResultCardProps) {
  // kanda_hundar är lead magnet-quizet – e-postformuläret ska inte visas där
  const showEmailCapture = slug !== 'kanda_hundar';

  return (
    <section className="space-y-5">
      {/* 1. Score + Badge */}
      <div className="rounded-[var(--quiz-radius-card)] border border-flocken-warm/40 bg-white p-6 shadow-card">
        <p className="text-center text-sm font-semibold uppercase tracking-wide text-flocken-gray">{quiz.title}</p>

        <div className="mt-5 flex justify-center">
          <BadgeDisplay label={badge} tier={tier} score={score} />
        </div>

        <p className="mt-5 text-center leading-relaxed text-flocken-gray">{interpretation}</p>
      </div>

      {/* 2. Share / Challenge */}
      <ShareChallenge slug={slug} quizTitle={quiz.title} score={score} />

      {/* 3. E-post – notis + kända hundar-quiz (ej på kanda_hundar själv) */}
      {showEmailCapture && <EmailCaptureCard quizSlug={slug} />}

      {/* 4. Answer Review */}
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

      {/* 5. Flocken CTA – bildkort längst ner */}
      <div className="relative overflow-hidden rounded-[var(--quiz-radius-card)] shadow-card">
        {/* Bakgrundsbild */}
        <div className="absolute inset-0">
          <img
            src="/assets/flocken/generated/flocken_image_community_medium.webp"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-[center_30%]"
          />
          {/* Olivlager för läsbarhet */}
          <div className="absolute inset-0 bg-gradient-to-br from-flocken-olive/85 via-flocken-olive/75 to-flocken-male/80" />
        </div>

        {/* Innehåll */}
        <div className="relative p-6">
          {/* Chip */}
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
            Flocken – appen för hundägare
          </span>

          <p className="mt-3 text-xl font-bold leading-snug text-white">
            Hitta hundvänner nära dig
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/80">
            Passa, rasta och besök hundvänliga ställen – tillsammans med andra hundägare i din stad.
          </p>

          {/* Feature-chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {['🐾 Hundvakter', '🗺️ Hundvänliga platser', '🤝 Hundkompisar'].map((f) => (
              <span key={f} className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                {f}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <a
              href="https://flocken.info/download"
              onClick={() => {
                track('quiz_cta_click', { slug, cta: 'download' });
                track('quiz_cta_download_click', { slug, cta: 'download' });
              }}
              className="inline-flex flex-1 items-center justify-center rounded-[var(--quiz-radius-card)] bg-flocken-sand px-4 py-3 text-sm font-semibold text-flocken-olive no-underline transition-colors hover:bg-flocken-cream"
            >
              Ladda ner – gratis
            </a>
            <a
              href="https://flocken.info/funktioner"
              onClick={() => track('quiz_cta_click', { slug, cta: 'how_it_works' })}
              className="inline-flex flex-1 items-center justify-center rounded-[var(--quiz-radius-card)] border border-white/40 px-4 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-white/10"
            >
              Läs mer
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

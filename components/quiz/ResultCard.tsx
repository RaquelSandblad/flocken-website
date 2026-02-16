'use client';

import { BadgeDisplay } from '@/components/quiz/BadgeDisplay';
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

      {/* 3. Flocken CTA (nu synlig innan svarsgenomgången) */}
      <div className="rounded-[var(--quiz-radius-card)] border border-flocken-olive/30 bg-gradient-to-br from-flocken-sand/60 to-flocken-cream/80 p-6 shadow-card">
        <p className="text-lg font-bold text-flocken-brown">Vill du träffa fler hundmänniskor?</p>
        <p className="mt-2 text-sm leading-relaxed text-flocken-brown/80">
          I Flocken hittar du andra hundägare i din närhet – för lek, passning, promenader och hundvänliga ställen.
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <a
            href="https://flocken.info/download"
            onClick={() => {
              track('quiz_cta_click', { slug, cta: 'download' });
              track('quiz_cta_download_click', { slug, cta: 'download' });
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--quiz-radius-card)] bg-flocken-olive px-4 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-flocken-accent hover:text-white"
          >
            Ladda ner Flocken – gratis
          </a>
          <a
            href="https://flocken.info/funktioner"
            onClick={() => {
              track('quiz_cta_click', { slug, cta: 'how_it_works' });
            }}
            className="inline-flex w-full items-center justify-center rounded-[var(--quiz-radius-card)] border border-flocken-olive/40 bg-white/80 px-4 py-3 text-sm font-semibold text-flocken-brown no-underline transition-colors hover:bg-white hover:text-flocken-brown"
          >
            Läs mer om Flocken
          </a>
        </div>
      </div>

      {/* 4. Answer Review (längst ner, för de som vill dyka djupare) */}
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

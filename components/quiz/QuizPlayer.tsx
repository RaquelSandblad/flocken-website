'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ProgressIndicator } from '@/components/quiz/ProgressIndicator';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { getScoreBucket } from '@/lib/quiz/score';
import { track } from '@/lib/quiz/tracking';
import type { FactQuestion, QuizDefinition } from '@/lib/quiz/types';

const AUTO_ADVANCE_MS = 1200;

interface QuizPlayerProps {
  quiz: QuizDefinition;
}

function calculateScore(quiz: QuizDefinition, answers: Array<number | null>): number {
  return quiz.questions.reduce((total, question, index) => {
    const answer = answers[index];
    if (answer === null) {
      return total;
    }

    const correctIndex = (question as FactQuestion).correctIndex;
    return correctIndex === answer ? total + 1 : total;
  }, 0);
}

export function QuizPlayer({ quiz }: QuizPlayerProps) {
  const router = useRouter();
  const totalQuestions = quiz.questions.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>(() => Array(totalQuestions).fill(null));
  const [lockedQuestions, setLockedQuestions] = useState<Set<number>>(() => new Set());
  const hasTrackedStart = useRef(false);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hasTrackedStart.current) {
      return;
    }

    track('quiz_view', { slug: quiz.slug });
    track('quiz_start', { slug: quiz.slug });
    hasTrackedStart.current = true;
  }, [quiz.slug]);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
      }
    };
  }, []);

  const currentQuestion = quiz.questions[currentIndex];
  const isLocked = lockedQuestions.has(currentIndex);
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const animationKey = useMemo(
    () => `${quiz.slug}-${currentQuestion.id}-${currentIndex}`,
    [quiz.slug, currentQuestion.id, currentIndex],
  );

  function goToResult() {
    const score = calculateScore(quiz, answers);
    const bucket = getScoreBucket(score);

    track('quiz_complete', { slug: quiz.slug, score });
    track('quiz_score_bucket', { slug: quiz.slug, bucket });

    const answersParam = answers.map((a) => (a !== null ? a : -1)).join(',');
    router.push(`/quiz/${quiz.slug}/result?score=${score}&answers=${answersParam}`);
  }

  function handleSelect(answerIndex: number) {
    if (isLocked) {
      return;
    }

    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = answerIndex;
    setAnswers(nextAnswers);
    setLockedQuestions((prev) => new Set(prev).add(currentIndex));

    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
    }

    autoAdvanceTimer.current = setTimeout(() => {
      if (!isLastQuestion) {
        setCurrentIndex((prev) => prev + 1);
      }
    }, AUTO_ADVANCE_MS);
  }

  return (
    <div className="space-y-4">
      {currentIndex === 0 && quiz.images?.cardKey && (
        <div className="overflow-hidden rounded-[var(--quiz-radius-card)] shadow-card">
          <Image
            src={`/assets/flocken/generated/${quiz.images.cardKey}_medium.jpg`}
            alt={quiz.images.cardAlt ?? quiz.title}
            width={800}
            height={450}
            className="w-full object-cover"
            priority
          />
        </div>
      )}

      <ProgressIndicator current={currentIndex + 1} total={totalQuestions} />

      <QuestionCard
        question={currentQuestion}
        selectedIndex={answers[currentIndex]}
        locked={isLocked}
        onSelect={handleSelect}
        animationKey={animationKey}
      />

      {isLocked && isLastQuestion && (
        <button
          type="button"
          onClick={goToResult}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-[var(--quiz-radius-card)] bg-[var(--quiz-color-primary)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--quiz-color-accent)]"
        >
          Visa resultat
        </button>
      )}
    </div>
  );
}

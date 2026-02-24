import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { QuizLayout } from '@/components/quiz/QuizLayout';
import { ResultCard } from '@/components/quiz/ResultCard';
import { getQuizBrandStyle } from '@/lib/quiz/brand';
import { getQuizBySlug } from '@/lib/quiz/loader';
import { getResultMeta } from '@/lib/quiz/score';

interface QuizResultPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ score?: string; answers?: string }>;
}

export async function generateMetadata({ params, searchParams }: QuizResultPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { score: rawScore } = await searchParams;
  const quiz = await getQuizBySlug(slug);
  if (!quiz) return {};

  const score = Math.min(Math.max(Number.parseInt(rawScore ?? '0', 10) || 0, 0), 10);
  const { badge } = getResultMeta(score);

  const ogImage = quiz.images?.cardKey
    ? `/assets/flocken/generated/${quiz.images.cardKey}_large.jpg`
    : '/assets/flocken/generated/flocken_quiz_hero_large.jpg';

  const title = `${score}/10 – ${badge}`;
  const description = `Jag fick "${badge}" på quizet "${quiz.title}". Klarar du dig bättre?`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://quiz.flocken.info/${slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 675,
          alt: quiz.images?.cardAlt ?? quiz.title,
        },
      ],
    },
  };
}

function parseScore(value: string | undefined): number {
  if (!value) {
    return 0;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return 0;
  }

  return Math.min(Math.max(parsed, 0), 10);
}

function parseAnswers(value: string | undefined, totalQuestions: number): number[] {
  if (!value) {
    return Array(totalQuestions).fill(0);
  }

  const parts = value.split(',').map((s) => {
    const n = Number.parseInt(s, 10);
    return Number.isNaN(n) ? 0 : Math.max(n, 0);
  });

  while (parts.length < totalQuestions) {
    parts.push(0);
  }

  return parts.slice(0, totalQuestions);
}

export default async function QuizResultPage({ params, searchParams }: QuizResultPageProps) {
  const { slug } = await params;
  const { score: rawScore, answers: rawAnswers } = await searchParams;
  const quiz = await getQuizBySlug(slug);

  if (!quiz) {
    return notFound();
  }

  const score = parseScore(rawScore);
  const resultMeta = getResultMeta(score);
  const userAnswers = parseAnswers(rawAnswers, quiz.questions.length);

  return (
    <QuizLayout
      style={getQuizBrandStyle()}
      title="Ditt resultat"
      subtitle="Bra jobbat! Scrolla ner för att se alla svar."
    >
      <ResultCard
        slug={quiz.slug}
        quiz={quiz}
        score={score}
        badge={resultMeta.badge}
        tier={resultMeta.tier}
        interpretation={resultMeta.interpretation}
        userAnswers={userAnswers}
      />
    </QuizLayout>
  );
}

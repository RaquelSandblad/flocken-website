import { notFound } from 'next/navigation';
import { QuizLayout } from '@/components/quiz/QuizLayout';
import { QuizPlayer } from '@/components/quiz/QuizPlayer';
import { getQuizBrandStyle } from '@/lib/quiz/brand';
import { getAllQuizzes, getQuizBySlug } from '@/lib/quiz/loader';

interface QuizPlayerPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const quizzes = await getAllQuizzes();
  return quizzes.map((quiz) => ({ slug: quiz.slug }));
}

export default async function QuizPlayerPage({ params }: QuizPlayerPageProps) {
  const { slug } = await params;
  const quiz = await getQuizBySlug(slug);

  if (!quiz) {
    return notFound();
  }

  return (
    <QuizLayout style={getQuizBrandStyle()} title={quiz.title} subtitle="10 frågor. Ingen stress. Full fokus.">
      <QuizPlayer quiz={quiz} />
    </QuizLayout>
  );
}

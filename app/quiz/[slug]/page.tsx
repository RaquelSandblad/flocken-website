import type { Metadata } from 'next';
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

export async function generateMetadata({ params }: QuizPlayerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const quiz = await getQuizBySlug(slug);
  if (!quiz) return {};

  const ogImage = quiz.images?.cardKey
    ? `/assets/flocken/generated/${quiz.images.cardKey}_large.jpg`
    : '/assets/flocken/generated/flocken_quiz_hero_large.jpg';

  return {
    title: quiz.title,
    description: quiz.description,
    openGraph: {
      title: quiz.title,
      description: quiz.description,
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

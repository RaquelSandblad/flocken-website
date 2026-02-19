import type { Metadata } from 'next';
import Image from 'next/image';
import { QuizCard } from '@/components/quiz/QuizCard';
import { QuizLayout } from '@/components/quiz/QuizLayout';
import { getQuizBrandStyle } from '@/lib/quiz/brand';
import { getAllQuizzes } from '@/lib/quiz/loader';

export const metadata: Metadata = {
  title: 'Flocken Quiz – Testa din hundkunskap',
  description: 'Fyra quiz om hundsport, raser, historia och kroppsspråk. 10 frågor, 2–3 minuter, en badge.',
  openGraph: {
    title: 'Flocken Quiz – Testa din hundkunskap',
    description: 'Fyra quiz. Välj ditt ämne och se hur du klarar dig.',
    url: 'https://quiz.flocken.info',
    images: [
      {
        url: '/assets/flocken/generated/flocken_quiz_hero_large.jpg',
        width: 1200,
        height: 675,
        alt: 'Flocken Quiz – Hundquiz på 2 minuter',
      },
    ],
  },
};

export default async function QuizLibraryPage() {
  const quizzes = await getAllQuizzes();

  return (
    <QuizLayout style={getQuizBrandStyle()}>
      {/* Hero Section with Image */}
      <section className="mb-8 overflow-hidden rounded-2xl border border-flocken-warm/40 bg-gradient-to-br from-flocken-sand to-flocken-cream shadow-card">
        <div className="grid gap-6 p-6 md:grid-cols-2 md:items-center md:gap-8 md:p-8">
          <div>
            <h1 className="text-3xl font-bold text-flocken-brown sm:text-4xl">
              Hundquiz på 2 minuter
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-flocken-brown">
              Testa din hundkunskap, få din badge och utmana dina vänner.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-flocken-brown shadow-soft">
                <span>⚡</span>
                <span>10 frågor</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-flocken-brown shadow-soft">
                <span>⏱️</span>
                <span>2–3 min</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-flocken-sand/50 shadow-soft">
            <Image
              src="/assets/flocken/generated/flocken_quiz_hero_medium.webp"
              alt="Glad hundägare med hund i varm, naturlig stil."
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Quiz Grid */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-flocken-brown">Välj ditt quiz</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.slug} quiz={quiz} />
          ))}
        </div>
      </section>

      {/* Flocken App Promo */}
      <section className="mt-8">
        <a
          href="https://flocken.info/funktioner"
          className="group flex items-center gap-4 rounded-xl border border-flocken-warm/40 bg-gradient-to-br from-flocken-sand to-flocken-cream p-4 shadow-soft transition-shadow hover:shadow-card sm:gap-5 sm:p-5"
        >
          <div className="shrink-0">
            <Image
              src="/assets/flocken/flocken_logo_clay.png"
              alt="Flocken – appen för hundägare"
              width={56}
              height={56}
              className="rounded-xl"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-flocken-brown">Upptäck Flocken</p>
            <p className="mt-0.5 text-sm text-flocken-gray">Appen för hundägare – hitta hundsällskap, passa hundar och mer.</p>
            <p className="mt-1.5 text-sm font-semibold text-flocken-olive group-hover:underline">
              Ladda ner gratis →
            </p>
          </div>
        </a>
      </section>
    </QuizLayout>
  );
}

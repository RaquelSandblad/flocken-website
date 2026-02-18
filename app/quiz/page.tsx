import Image from 'next/image';
import { QuizCard } from '@/components/quiz/QuizCard';
import { QuizLayout } from '@/components/quiz/QuizLayout';
import { getQuizBrandStyle } from '@/lib/quiz/brand';
import { getAllQuizzes } from '@/lib/quiz/loader';

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
              Testa din hundkunskap, få din badge och upptäck hur Flocken kan göra ditt hundliv enklare.
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
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-flocken-brown shadow-soft">
                <span>🏆</span>
                <span>Badge direkt</span>
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

      {/* Why Section */}
      <section className="mt-8 rounded-xl bg-white p-6 shadow-soft">
        <h2 className="text-lg font-bold text-flocken-brown">Varför göra quizen?</h2>
        <ul className="mt-3 space-y-2 text-sm text-flocken-gray">
          <li className="flex items-start gap-2">
            <span className="text-flocken-olive">✓</span>
            <span>Testa din hundkunskap på ett roligt sätt</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-flocken-olive">✓</span>
            <span>Få din personliga badge att dela</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-flocken-olive">✓</span>
            <span>Upptäck hur Flocken kan hjälpa dig träffa andra hundägare</span>
          </li>
        </ul>
      </section>
    </QuizLayout>
  );
}

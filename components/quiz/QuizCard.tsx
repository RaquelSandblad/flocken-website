import Link from 'next/link';
import type { QuizDefinition } from '@/lib/quiz/types';

interface QuizCardProps {
  quiz: Pick<QuizDefinition, 'slug' | 'title' | 'description'>;
}

// Quiz-specific visual themes
const quizThemes: Record<string, { emoji: string; imagePlaceholder: string }> = {
  hundsport: {
    emoji: '🏃‍♂️',
    imagePlaceholder: 'Agility-hund som hoppar över hinder',
  },
  rasers_syfte: {
    emoji: '🐕',
    imagePlaceholder: 'Montage med olika hundraser (border collie, golden, husky)',
  },
  hundens_historia: {
    emoji: '📜',
    imagePlaceholder: 'Historisk illustration: varg till hund',
  },
};

export function QuizCard({ quiz }: QuizCardProps) {
  const theme = quizThemes[quiz.slug] || { emoji: '🎯', imagePlaceholder: 'Generisk hundbild' };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[var(--quiz-radius-card)] border border-flocken-warm/40 bg-white shadow-soft transition-shadow hover:shadow-card">
      {/* Quiz Image */}
      <div className="relative aspect-[16/10] bg-flocken-sand/30">
        {/* PLACEHOLDER: Quiz-specific image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
          <div className="text-5xl">{theme.emoji}</div>
          <p className="text-center text-xs text-flocken-gray">{theme.imagePlaceholder}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h2 className="text-lg font-bold leading-tight text-flocken-brown">{quiz.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-flocken-gray">{quiz.description}</p>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-flocken-brown">
            <span className="rounded-full bg-flocken-sand px-3 py-1">10 frågor</span>
            <span className="rounded-full bg-flocken-cream px-3 py-1">2–3 min</span>
          </div>

          <Link
            href={`/quiz/${quiz.slug}`}
            className="inline-flex w-full items-center justify-center rounded-[var(--quiz-radius-card)] bg-[var(--quiz-color-primary)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--quiz-color-accent)]"
          >
            Starta quiz →
          </Link>
        </div>
      </div>
    </article>
  );
}

import { AnswerOption } from '@/components/quiz/AnswerOption';
import type { QuizQuestion, FactQuestion } from '@/lib/quiz/types';

interface QuestionCardProps {
  question: QuizQuestion;
  selectedIndex: number | null;
  locked: boolean;
  onSelect: (index: number) => void;
  animationKey: string;
}

function getAnswerState(
  index: number,
  selectedIndex: number | null,
  locked: boolean,
  correctIndex: number,
): 'default' | 'correct' | 'wrong' | 'missed' {
  if (!locked) {
    return 'default';
  }

  if (index === selectedIndex && index === correctIndex) {
    return 'correct';
  }
  if (index === selectedIndex && index !== correctIndex) {
    return 'wrong';
  }
  if (index === correctIndex && selectedIndex !== correctIndex) {
    return 'missed';
  }
  return 'default';
}

export function QuestionCard({ question, selectedIndex, locked, onSelect, animationKey }: QuestionCardProps) {
  const correctIndex = (question as FactQuestion).correctIndex;

  return (
    <section
      key={animationKey}
      className="quiz-fade-slide rounded-[var(--quiz-radius-card)] border border-flocken-warm/40 bg-white p-5 shadow-card sm:p-6"
    >
      <h2 className="text-xl font-bold leading-tight text-flocken-brown sm:text-2xl">{question.question}</h2>

      <div className="mt-5 space-y-3" role="radiogroup" aria-label="Svarsalternativ">
        {question.options.map((option, index) => (
          <AnswerOption
            key={`${question.id}-${option}`}
            text={option}
            state={getAnswerState(index, selectedIndex, locked, correctIndex)}
            disabled={locked}
            onSelect={() => onSelect(index)}
          />
        ))}
      </div>
    </section>
  );
}

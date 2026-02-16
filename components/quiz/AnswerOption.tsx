type AnswerState = 'default' | 'correct' | 'wrong' | 'missed';

interface AnswerOptionProps {
  text: string;
  state: AnswerState;
  disabled: boolean;
  onSelect: () => void;
}

const stateStyles: Record<AnswerState, string> = {
  default:
    'border-flocken-warm/50 bg-white text-flocken-brown hover:border-[var(--quiz-color-accent)] hover:bg-flocken-cream/40',
  correct:
    'border-green-500 bg-green-50 text-green-900',
  wrong:
    'border-red-400 bg-red-50 text-red-900',
  missed:
    'border-green-300 bg-green-50/50 text-green-800',
};

export function AnswerOption({ text, state, disabled, onSelect }: AnswerOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={[
        'w-full rounded-[var(--quiz-radius-card)] border p-4 text-left text-sm font-medium transition-all duration-150 sm:text-base',
        'disabled:cursor-default',
        stateStyles[state],
      ].join(' ')}
    >
      {text}
    </button>
  );
}

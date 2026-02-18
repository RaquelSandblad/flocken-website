export type QuizQuestionType = 'fact' | 'profile';

export interface QuizImages {
  /**
   * Base key used by image-processor output files.
   * Example: `flocken_quiz_hundsport_card` → `/assets/flocken/generated/flocken_quiz_hundsport_card_small.webp`
   */
  cardKey: string;
  cardAlt: string;
}

export interface BaseQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  options: string[];
}

export interface FactQuestion extends BaseQuestion {
  type: 'fact';
  correctIndex: number;
  explanation: string;
  sources: string[];
  factId: string;
}

export interface ProfileQuestion extends BaseQuestion {
  type: 'profile';
}

export type QuizQuestion = FactQuestion | ProfileQuestion;

export interface QuizDefinition {
  slug: string;
  title: string;
  description: string;
  images?: QuizImages;
  questions: QuizQuestion[];
}

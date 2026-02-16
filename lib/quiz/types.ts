export type QuizQuestionType = 'fact' | 'profile';

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
  questions: QuizQuestion[];
}

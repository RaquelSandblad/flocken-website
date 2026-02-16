import { z } from 'zod';
import type { QuizDefinition } from '@/lib/quiz/types';

const baseQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
});

const factQuestionSchema = baseQuestionSchema.extend({
  type: z.literal('fact'),
  correctIndex: z.number().int().min(0),
  explanation: z.string().min(1),
  sources: z.array(z.string().min(1)).min(1),
  factId: z.string().min(1),
});

const profileQuestionSchema = baseQuestionSchema.extend({
  type: z.literal('profile'),
});

const questionSchema = z.union([factQuestionSchema, profileQuestionSchema]);

const quizSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9_-]+$/),
  title: z.string().min(1),
  description: z.string().min(1),
  questions: z.array(questionSchema).length(10),
});

export function validateQuizDefinition(input: unknown): QuizDefinition {
  const parsed = quizSchema.parse(input);

  parsed.questions.forEach((question) => {
    if (question.type === 'fact' && question.correctIndex >= question.options.length) {
      throw new Error(
        `Invalid fact question "${question.id}": correctIndex (${question.correctIndex}) is out of range.`,
      );
    }
  });

  return parsed;
}

import { promises as fs } from 'fs';
import path from 'path';
import { cache } from 'react';
import { validateQuizDefinition } from '@/lib/quiz/schema';
import type { QuizDefinition } from '@/lib/quiz/types';

const QUIZ_DIRECTORY = path.join(process.cwd(), 'data', 'quizzes');

async function readQuizFile(fileName: string): Promise<QuizDefinition> {
  const fullPath = path.join(QUIZ_DIRECTORY, fileName);
  const rawContent = await fs.readFile(fullPath, 'utf8');
  const parsedContent: unknown = JSON.parse(rawContent);
  const quiz = validateQuizDefinition(parsedContent);

  if (quiz.slug !== fileName.replace(/\.json$/, '')) {
    throw new Error(`Quiz slug mismatch in "${fileName}". Expected slug "${fileName.replace(/\.json$/, '')}".`);
  }

  return quiz;
}

export const getAllQuizzes = cache(async (): Promise<QuizDefinition[]> => {
  const entries = await fs.readdir(QUIZ_DIRECTORY);
  const quizFiles = entries.filter((entry) => entry.endsWith('.json')).sort();
  const quizzes = await Promise.all(quizFiles.map((fileName) => readQuizFile(fileName)));
  return quizzes;
});

export const getQuizBySlug = cache(async (slug: string): Promise<QuizDefinition | null> => {
  const safeSlug = slug.trim().toLowerCase();
  if (!safeSlug) {
    return null;
  }

  try {
    return await readQuizFile(`${safeSlug}.json`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }

    throw error;
  }
});

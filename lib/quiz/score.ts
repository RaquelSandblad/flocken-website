export interface QuizResultMeta {
  badge: string;
  tier: 'bronze' | 'silver' | 'gold';
  interpretation: string;
}

export function getScoreBucket(score: number): 'low' | 'med' | 'high' {
  if (score <= 4) {
    return 'low';
  }
  if (score <= 7) {
    return 'med';
  }
  return 'high';
}

export function getResultMeta(score: number): QuizResultMeta {
  if (score <= 4) {
    return {
      badge: 'Nyfiken hundvän',
      tier: 'bronze',
      interpretation:
        'Du är på god väg! Kolla igenom svaren nedan och lär dig något nytt inför nästa försök.',
    };
  }

  if (score <= 7) {
    return {
      badge: 'Skarp hundkännare',
      tier: 'silver',
      interpretation:
        'Bra koll! Du har stenkoll på grunderna. Se vilka frågor som lurade dig nedan.',
    };
  }

  return {
    badge: 'Hundexpert',
    tier: 'gold',
    interpretation:
      'Imponerande! Du kan dina hundfakta. Utmana en kompis och se om de kan slå dig.',
  };
}

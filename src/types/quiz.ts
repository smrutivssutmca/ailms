import React from 'react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
}

export type { QuizQuestion };

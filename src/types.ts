export type HiraganaCategory = 'basic' | 'dakuten' | 'handakuten' | 'youon';

export interface HiraganaItem {
  id: number;
  char: string;
  romaji: string;
  type: string;
}

export interface AnswerRecord {
  id: string;
  question: HiraganaItem;
  userAnswer: string;
  isCorrect: boolean;
}

export type GameState = 'HOME' | 'PLAYING' | 'RESULT';

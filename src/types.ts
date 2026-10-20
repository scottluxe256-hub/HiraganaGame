export type HiraganaCategory = 'basic' | 'dakuten' | 'handakuten' | 'youon' | 'katakana';

export interface HiraganaItem {
  id: string;          // Diubah dari number ke string
  character: string;   // Diubah dari char ke character
  romaji: string[];    // Diubah dari string ke string[]
  type: string;
}

export interface AnswerRecord {
  id: string;
  question: HiraganaItem;
  userAnswer: string;
  isCorrect: boolean;
}

export type GameState = 'HOME' | 'PLAYING' | 'RESULT';

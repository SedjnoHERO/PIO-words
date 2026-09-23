import type { WordEntry } from '../types/vocabulary';
import { shuffleArray } from './shuffle';

export const MATCH_ROUND_SIZE = 4;

export const getForeignText = (word: WordEntry): string =>
  word.terms[0] ?? '';

export const getRuText = (word: WordEntry): string => word.ru;

export const pickDistractors = (
  correct: WordEntry,
  pool: WordEntry[],
  count: number,
): WordEntry[] => {
  const others = shuffleArray(
    pool.filter((word) => word.id !== correct.id),
  );

  return others.slice(0, count);
};

export const buildQuizOptions = (
  correct: WordEntry,
  pool: WordEntry[],
): WordEntry[] =>
  shuffleArray([correct, ...pickDistractors(correct, pool, 2)]);

export const splitIntoRounds = (
  words: WordEntry[],
  roundSize: number = MATCH_ROUND_SIZE,
): WordEntry[][] => {
  const shuffled = shuffleArray(words);
  const rounds: WordEntry[][] = [];

  for (let index = 0; index < shuffled.length; index += roundSize) {
    rounds.push(shuffled.slice(index, index + roundSize));
  }

  return rounds.filter((round) => round.length > 0);
};

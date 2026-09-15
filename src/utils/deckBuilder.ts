import { VOCABULARY } from '../data/vocabulary';
import type { StudyMode, WordEntry } from '../types/vocabulary';
import { shuffleArray } from './shuffle';

export type CardSide = 'gap' | 'full';

const getAllWords = (): WordEntry[] =>
  VOCABULARY.flatMap((group) => group.words);

const getWordsByTopic = (topicId: string): WordEntry[] => {
  const group = VOCABULARY.find((item) => item.id === topicId);
  return group ? [...group.words] : [];
};

export const buildDeck = (
  mode: StudyMode,
  topicId: string | null,
): WordEntry[] => {
  switch (mode) {
    case 'gap-to-full':
    case 'full-to-gap':
    case 'all-mixed':
      return shuffleArray(getAllWords());
    case 'single-topic':
      return topicId ? shuffleArray(getWordsByTopic(topicId)) : [];
    default:
      return [];
  }
};

const resolveDirection = (
  mode: StudyMode,
): { front: CardSide; back: CardSide } => {
  if (mode === 'full-to-gap') {
    return { front: 'full', back: 'gap' };
  }

  return { front: 'gap', back: 'full' };
};

export const getFrontText = (word: WordEntry, mode: StudyMode): string => {
  const { front } = resolveDirection(mode);
  return front === 'gap' ? word.gap : word.full;
};

export const getBackLines = (word: WordEntry, mode: StudyMode): string[] => {
  const { back } = resolveDirection(mode);
  return [back === 'gap' ? word.gap : word.full];
};

export const getFrontSide = (mode: StudyMode): CardSide =>
  resolveDirection(mode).front;

export const getBackSide = (mode: StudyMode): CardSide =>
  resolveDirection(mode).back;

export const getSideLabel = (side: CardSide): string =>
  side === 'gap' ? 'С пропуском' : 'Полное слово';

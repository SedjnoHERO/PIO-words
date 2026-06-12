import { VOCABULARY } from '../data/vocabulary';
import type { StudyMode, WordEntry } from '../types/vocabulary';
import { shuffleArray } from './shuffle';

const getAllWords = (): WordEntry[] =>
  VOCABULARY.flatMap((group) => group.words);

const getWordsByTopic = (topicId: string): WordEntry[] => {
  const group = VOCABULARY.find((item) => item.id === topicId);
  return group ? [...group.words] : [];
};

const hasMultipleTranslations = (word: WordEntry): boolean =>
  word.en.length > 1 || (word.ruVariants?.length ?? 0) > 1;

const getMultiTranslationWords = (): WordEntry[] =>
  getAllWords().filter(hasMultipleTranslations);

export const buildDeck = (
  mode: StudyMode,
  topicId: string | null,
): WordEntry[] => {
  switch (mode) {
    case 'ru-to-en':
    case 'en-to-ru':
      return shuffleArray(getAllWords());
    case 'all-mixed':
      return shuffleArray(getAllWords());
    case 'single-topic':
      return topicId ? shuffleArray(getWordsByTopic(topicId)) : [];
    case 'multi-translation':
      return shuffleArray(getMultiTranslationWords());
    default:
      return [];
  }
};

export const getFrontText = (
  word: WordEntry,
  mode: StudyMode,
): string => {
  if (mode === 'en-to-ru' || mode === 'multi-translation') {
    return word.en.join(' / ');
  }

  return word.ru;
};

export const getBackLines = (
  word: WordEntry,
  mode: StudyMode,
): string[] => {
  if (mode === 'en-to-ru') {
    if (word.ruVariants && word.ruVariants.length > 1) {
      return word.ruVariants;
    }

    return [word.ru];
  }

  if (mode === 'multi-translation') {
    if (word.ruVariants && word.ruVariants.length > 1) {
      return word.ruVariants;
    }

    if (word.en.length > 1) {
      return word.en;
    }

    return [word.ru];
  }

  if (mode === 'ru-to-en') {
    return word.en;
  }

  return word.en.length > 1 ? word.en : [word.en[0]];
};

export { hasMultipleTranslations };

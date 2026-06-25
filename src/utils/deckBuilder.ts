import { VOCABULARY } from '../data/vocabulary';
import type { StudyMode, WordEntry } from '../types/vocabulary';
import { shuffleArray } from './shuffle';

export type CardLang = 'ru' | 'de';

export interface MultiTranslationCard {
  frontText: string;
  backLines: string[];
  frontLang: CardLang;
  backLang: CardLang;
}

const getAllWords = (): WordEntry[] =>
  VOCABULARY.flatMap((group) => group.words);

const getOralWords = (): WordEntry[] =>
  getAllWords().filter((word) => word.oral);

const getWordsByTopic = (topicId: string): WordEntry[] => {
  const group = VOCABULARY.find((item) => item.id === topicId);
  return group ? [...group.words] : [];
};

const hasMultipleRu = (word: WordEntry): boolean =>
  (word.ruVariants?.length ?? 0) > 1;

const hasMultipleDe = (word: WordEntry): boolean =>
  word.de.length > 1;

export const hasMultipleTranslations = (word: WordEntry): boolean =>
  hasMultipleRu(word) || hasMultipleDe(word);

const getMultiTranslationWords = (): WordEntry[] =>
  getAllWords().filter(hasMultipleTranslations);

export const resolveMultiTranslationCard = (
  word: WordEntry,
): MultiTranslationCard => {
  const multiRu = hasMultipleRu(word);
  const multiDe = hasMultipleDe(word);
  const ruLines = multiRu ? word.ruVariants! : [word.ru];
  const deLines = word.de;

  if (multiDe && !multiRu) {
    return {
      frontText: word.ru,
      backLines: deLines,
      frontLang: 'ru',
      backLang: 'de',
    };
  }

  if (multiRu && !multiDe) {
    return {
      frontText: deLines[0],
      backLines: ruLines,
      frontLang: 'de',
      backLang: 'ru',
    };
  }

  return {
    frontText: deLines.join(' / '),
    backLines: ruLines,
    frontLang: 'de',
    backLang: 'ru',
  };
};

export const buildDeck = (
  mode: StudyMode,
  topicId: string | null,
): WordEntry[] => {
  switch (mode) {
    case 'ru-to-de':
    case 'de-to-ru':
      return shuffleArray(getAllWords());
    case 'oral-only':
      return shuffleArray(getOralWords());
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
  if (mode === 'multi-translation') {
    return resolveMultiTranslationCard(word).frontText;
  }

  if (mode === 'de-to-ru') {
    return word.de.join(' / ');
  }

  return word.ru;
};

export const getBackLines = (
  word: WordEntry,
  mode: StudyMode,
): string[] => {
  if (mode === 'multi-translation') {
    return resolveMultiTranslationCard(word).backLines;
  }

  if (mode === 'de-to-ru') {
    if (word.ruVariants && word.ruVariants.length > 1) {
      return word.ruVariants;
    }

    return [word.ru];
  }

  if (mode === 'ru-to-de') {
    return word.de;
  }

  return word.de.length > 1 ? word.de : [word.de[0]];
};

export const getFrontLang = (
  word: WordEntry,
  mode: StudyMode,
): CardLang => {
  if (mode === 'multi-translation') {
    return resolveMultiTranslationCard(word).frontLang;
  }

  if (mode === 'de-to-ru') {
    return 'de';
  }

  return 'ru';
};

export const getBackLang = (
  word: WordEntry,
  mode: StudyMode,
): CardLang => {
  if (mode === 'multi-translation') {
    return resolveMultiTranslationCard(word).backLang;
  }

  if (mode === 'de-to-ru') {
    return 'ru';
  }

  return 'de';
};

export const getLangLabel = (lang: CardLang): string =>
  lang === 'de' ? 'Deutsch' : 'Русский';

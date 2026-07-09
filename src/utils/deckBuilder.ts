import { VOCABULARY } from '../data/vocabulary';
import type { StudyMode, WordEntry } from '../types/vocabulary';
import { shuffleArray } from './shuffle';

export type CardLang = 'ru' | 'en';

export interface MultiTranslationCard {
  frontText: string;
  backLines: string[];
  frontLang: CardLang;
  backLang: CardLang;
}

const getAllWords = (): WordEntry[] =>
  VOCABULARY.flatMap((group) => group.words);

const getWordsByTopic = (topicId: string): WordEntry[] => {
  const group = VOCABULARY.find((item) => item.id === topicId);
  return group ? [...group.words] : [];
};

const hasMultipleRu = (word: WordEntry): boolean =>
  (word.ruVariants?.length ?? 0) > 1;

const hasMultipleEn = (word: WordEntry): boolean =>
  word.en.length > 1;

export const hasMultipleTranslations = (word: WordEntry): boolean =>
  hasMultipleRu(word) || hasMultipleEn(word);

const getMultiTranslationWords = (): WordEntry[] =>
  getAllWords().filter(hasMultipleTranslations);

export const resolveMultiTranslationCard = (
  word: WordEntry,
): MultiTranslationCard => {
  const multiRu = hasMultipleRu(word);
  const multiEn = hasMultipleEn(word);
  const ruLines = multiRu ? word.ruVariants! : [word.ru];
  const enLines = word.en;

  if (multiEn && !multiRu) {
    return {
      frontText: word.ru,
      backLines: enLines,
      frontLang: 'ru',
      backLang: 'en',
    };
  }

  if (multiRu && !multiEn) {
    return {
      frontText: enLines[0],
      backLines: ruLines,
      frontLang: 'en',
      backLang: 'ru',
    };
  }

  return {
    frontText: enLines.join(' / '),
    backLines: ruLines,
    frontLang: 'en',
    backLang: 'ru',
  };
};

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
  if (mode === 'multi-translation') {
    return resolveMultiTranslationCard(word).frontText;
  }

  if (mode === 'en-to-ru') {
    return word.en.join(' / ');
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

  if (mode === 'en-to-ru') {
    if (word.ruVariants && word.ruVariants.length > 1) {
      return word.ruVariants;
    }

    return [word.ru];
  }

  if (mode === 'ru-to-en') {
    return word.en;
  }

  return word.en.length > 1 ? word.en : [word.en[0]];
};

export const getFrontLang = (
  word: WordEntry,
  mode: StudyMode,
): CardLang => {
  if (mode === 'multi-translation') {
    return resolveMultiTranslationCard(word).frontLang;
  }

  if (mode === 'en-to-ru') {
    return 'en';
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

  if (mode === 'en-to-ru') {
    return 'ru';
  }

  return 'en';
};

export const getLangLabel = (lang: CardLang): string =>
  lang === 'en' ? 'English' : 'Русский';

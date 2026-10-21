import { getWords } from '../data/vocabulary';
import type { AppLanguage, StudyMode, WordEntry } from '../types/vocabulary';
import { pickFavoriteWords } from './favorites';
import { shuffleArray } from './shuffle';
import { pickWeakWords } from './wordStats';

export type CardLang = 'ru' | 'foreign';

export interface MultiTranslationCard {
  frontText: string;
  backLines: string[];
  frontLang: CardLang;
  backLang: CardLang;
}

const hasMultipleRu = (word: WordEntry): boolean =>
  (word.ruVariants?.length ?? 0) > 1;

const hasMultipleTerms = (word: WordEntry): boolean =>
  word.terms.length > 1;

export const hasMultipleTranslations = (word: WordEntry): boolean =>
  hasMultipleRu(word) || hasMultipleTerms(word);

export const resolveMultiTranslationCard = (
  word: WordEntry,
): MultiTranslationCard => {
  const multiRu = hasMultipleRu(word);
  const multiTerms = hasMultipleTerms(word);
  const ruLines = multiRu ? word.ruVariants! : [word.ru];
  const termLines = word.terms;

  if (multiTerms && !multiRu) {
    return {
      frontText: word.ru,
      backLines: termLines,
      frontLang: 'ru',
      backLang: 'foreign',
    };
  }

  if (multiRu && !multiTerms) {
    return {
      frontText: termLines[0],
      backLines: ruLines,
      frontLang: 'foreign',
      backLang: 'ru',
    };
  }

  return {
    frontText: termLines.join(' / '),
    backLines: ruLines,
    frontLang: 'foreign',
    backLang: 'ru',
  };
};

export const buildDeck = (
  language: AppLanguage,
  mode: StudyMode,
  topicId: string | null,
): WordEntry[] => {
  const words = getWords(language, topicId);

  switch (mode) {
    case 'ru-to-foreign':
    case 'foreign-to-ru':
    case 'all-mixed':
      return shuffleArray(words);
    case 'weak-words':
      return shuffleArray(pickWeakWords(language, words));
    case 'favorites':
      return shuffleArray(pickFavoriteWords(language, words));
    case 'single-topic':
      return topicId
        ? shuffleArray(words)
        : [];
    case 'multi-translation':
      return shuffleArray(words.filter(hasMultipleTranslations));
    case 'match-pairs':
    case 'choose-one':
    case 'type-answer':
    case 'scramble-word':
    case 'memory':
    case 'sprint':
      return [];
    default:
      return [];
  }
};

export const getFrontText = (
  word: WordEntry,
  mode: StudyMode,
): string => {
  if (word.definition) return word.definition;

  if (mode === 'multi-translation') {
    return resolveMultiTranslationCard(word).frontText;
  }

  if (mode === 'foreign-to-ru') {
    return word.terms.join(' / ');
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

  if (mode === 'foreign-to-ru') {
    if (word.ruVariants && word.ruVariants.length > 1) {
      return word.ruVariants;
    }

    return [word.ru];
  }

  if (mode === 'ru-to-foreign' || mode === 'weak-words' || mode === 'favorites' || mode === 'single-topic') {
    return word.terms;
  }

  return word.terms.length > 1 ? word.terms : [word.terms[0]];
};

export const getFrontLang = (
  word: WordEntry,
  mode: StudyMode,
): CardLang => {
  if (word.definition) return 'foreign';

  if (mode === 'multi-translation') {
    return resolveMultiTranslationCard(word).frontLang;
  }

  if (mode === 'foreign-to-ru') {
    return 'foreign';
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

  if (mode === 'foreign-to-ru') {
    return 'ru';
  }

  return 'foreign';
};

export const getLangLabel = (
  lang: CardLang,
  language: AppLanguage,
): string => {
  if (lang === 'ru') {
    return 'Русский';
  }

  return language === 'de' ? 'Deutsch' : 'English';
};

export const getFrontTranscription = (
  word: WordEntry,
  mode: StudyMode,
  language: AppLanguage,
): string | null => {
  if (language !== 'en' || !word.transcriptions?.length) {
    return null;
  }

  if (getFrontLang(word, mode) !== 'foreign') {
    return null;
  }

  const values = word.transcriptions.filter(Boolean);
  return values.length > 0 ? values.join(' / ') : null;
};

export const getBackTranscription = (
  word: WordEntry,
  mode: StudyMode,
  language: AppLanguage,
  lineIndex: number,
): string | null => {
  if (language !== 'en' || !word.transcriptions?.length) {
    return null;
  }

  if (getBackLang(word, mode) !== 'foreign') {
    return null;
  }

  return word.transcriptions[lineIndex] || null;
};

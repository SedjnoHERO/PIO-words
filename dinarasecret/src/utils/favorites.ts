import type { AppLanguage, WordEntry } from '../types/vocabulary';
import { getVocabulary } from '../data/vocabulary';

const storageKey = (language: AppLanguage): string =>
  `dinara-favorites-v1-${language}`;

const readIds = (language: AppLanguage): string[] => {
  try {
    const raw = window.localStorage.getItem(storageKey(language));
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
};

const writeIds = (language: AppLanguage, ids: string[]): void => {
  try {
    window.localStorage.setItem(storageKey(language), JSON.stringify(ids));
  } catch {
    // Ignore quota / private mode failures.
  }
};

export const getFavoriteIds = (language: AppLanguage): string[] =>
  readIds(language);

export const isFavorite = (language: AppLanguage, wordId: string): boolean =>
  readIds(language).includes(wordId);

export const toggleFavorite = (
  language: AppLanguage,
  wordId: string,
): boolean => {
  const ids = readIds(language);
  const index = ids.indexOf(wordId);

  if (index >= 0) {
    ids.splice(index, 1);
    writeIds(language, ids);
    return false;
  }

  ids.push(wordId);
  writeIds(language, ids);
  return true;
};

export const pickFavoriteWords = (
  language: AppLanguage,
  pool?: WordEntry[],
): WordEntry[] => {
  const favoriteIds = new Set(readIds(language));
  const words =
    pool ?? getVocabulary(language).flatMap((group) => group.words);

  return words.filter((word) => favoriteIds.has(word.id));
};

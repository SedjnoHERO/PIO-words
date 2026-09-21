import type { AppLanguage, LanguageOption } from '../types/vocabulary';
import { VOCABULARY_DE } from './vocabulary.de';
import { VOCABULARY_EN } from './vocabulary.en';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    id: 'de',
    title: 'Немецкий',
    description: 'Германия · география и население',
    icon: '🇩🇪',
  },
  {
    id: 'en',
    title: 'Английский',
    description: 'Crime and Justice · лексика к коллоквиуму',
    icon: '🇬🇧',
  },
];

export const getVocabulary = (language: AppLanguage) =>
  language === 'de' ? VOCABULARY_DE : VOCABULARY_EN;

export const getTotalWords = (language: AppLanguage): number =>
  getVocabulary(language).reduce((sum, group) => sum + group.words.length, 0);

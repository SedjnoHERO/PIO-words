import type { AppLanguage, LanguageOption } from '../types/vocabulary';
import { VOCABULARY_EN } from './vocabulary.en';
import { VOCABULARY_FR } from './vocabulary.fr';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    id: 'en',
    title: 'Английский',
    description: 'Туризм · отель, магазины, дорога',
    icon: '🇬🇧',
  },
  {
    id: 'fr',
    title: 'Французский',
    description: 'Туризм · отель, магазины, дорога',
    icon: '🇫🇷',
  },
];

export const getVocabulary = (language: AppLanguage) =>
  language === 'fr' ? VOCABULARY_FR : VOCABULARY_EN;

export const getTotalWords = (language: AppLanguage): number =>
  getVocabulary(language).reduce((sum, group) => sum + group.words.length, 0);

import type { AppLanguage, LanguageOption } from '../types/vocabulary';
import { VOCABULARY_DE } from './vocabulary.de';
import { VOCABULARY_EN } from './vocabulary.en';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    id: 'de',
    title: 'Немецкий',
    description: 'Германия: фразы, предложения и история',
    icon: '🇩🇪',
  },
  {
    id: 'en',
    title: 'Английский',
    description: 'Crime and Justice · Спорт',
    icon: '🇬🇧',
  },
];

export const getVocabulary = (language: AppLanguage) =>
  language === 'de' ? VOCABULARY_DE : VOCABULARY_EN;

export const getTotalWords = (language: AppLanguage): number =>
  getWords(language, null).length;

export const getWords = (language: AppLanguage, topicId: string | null) =>
  getVocabulary(language)
    .filter((group) => topicId === null ? group.kind !== 'definitions' : group.id === topicId)
    .flatMap((group) => group.words);

export const isDefinitionTopic = (language: AppLanguage, topicId: string | null): boolean =>
  getVocabulary(language).some((group) => group.id === topicId && group.kind === 'definitions');

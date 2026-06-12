import type { ModeOption } from '../types/vocabulary';

export const MODE_OPTIONS: ModeOption[] = [
  {
    id: 'ru-to-en',
    title: 'Русский → English',
    description: 'Слово на русском, перевод на английском',
    icon: '🇷🇺→🇬🇧',
  },
  {
    id: 'en-to-ru',
    title: 'English → Русский',
    description: 'Слово на английском, перевод на русском',
    icon: '🇬🇧→🇷🇺',
  },
  {
    id: 'all-mixed',
    title: 'Все темы вперемешку',
    description: 'Случайный порядок из всех слов',
    icon: '🔀',
  },
  {
    id: 'single-topic',
    title: 'Одна тема',
    description: 'Выбери тему и учи только её',
    icon: '📁',
  },
  {
    id: 'multi-translation',
    title: 'Несколько переводов',
    description: 'Слова с 2+ вариантами перевода',
    icon: '📝',
  },
];

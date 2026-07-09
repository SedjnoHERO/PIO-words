import type { ModeOption } from '../types/vocabulary';

export const MODE_OPTIONS: ModeOption[] = [
  {
    id: 'ru-to-en',
    title: 'RU → EN',
    description: 'Русский на лице, английский на обороте',
    icon: '',
  },
  {
    id: 'en-to-ru',
    title: 'EN → RU',
    description: 'Английский на лице, русский на обороте',
    icon: '',
  },
  {
    id: 'all-mixed',
    title: 'Все слова',
    description: 'Случайный порядок',
    icon: '',
  },
  {
    id: 'single-topic',
    title: 'Одна тема',
    description: 'Выбрать тему',
    icon: '',
  },
  {
    id: 'multi-translation',
    title: 'Несколько переводов',
    description: 'Слова с 2+ вариантами',
    icon: '',
  },
];

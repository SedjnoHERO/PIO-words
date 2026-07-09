import type { ModeOption } from '../types/vocabulary';

export const MODE_OPTIONS: ModeOption[] = [
  {
    id: 'ru-to-de',
    title: 'RU → DE',
    description: 'Русский на лице, немецкий на обороте',
    icon: '',
  },
  {
    id: 'de-to-ru',
    title: 'DE → RU',
    description: 'Немецкий на лице, русский на обороте',
    icon: '',
  },
  {
    id: 'oral-only',
    title: 'Устное',
    description: 'Только блоки для устного экзамена',
    icon: '',
  },
  {
    id: 'all-mixed',
    title: 'Все блоки',
    description: 'Случайный порядок',
    icon: '',
  },
  {
    id: 'single-topic',
    title: 'Один блок',
    description: 'Выбрать блок',
    icon: '',
  },
  {
    id: 'multi-translation',
    title: 'Несколько переводов',
    description: 'Слова с 2+ вариантами',
    icon: '',
  },
];

import type { ModeOption } from '../types/vocabulary';

export const MODE_OPTIONS: ModeOption[] = [
  {
    id: 'gap-to-full',
    title: 'Пропуск → слово',
    description: 'Слово с пропусками, ответ — полное написание',
    icon: '',
  },
  {
    id: 'full-to-gap',
    title: 'Слово → пропуск',
    description: 'Полное слово, ответ — вариант с пропусками',
    icon: '',
  },
  {
    id: 'all-mixed',
    title: 'Все слова',
    description: 'Случайный порядок всех карточек',
    icon: '',
  },
  {
    id: 'single-topic',
    title: 'Один блок',
    description: 'Выбрать букву',
    icon: '',
  },
];

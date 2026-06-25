import type { ModeOption } from '../types/vocabulary';

export const MODE_OPTIONS: ModeOption[] = [
  {
    id: 'ru-to-de',
    title: 'Русский → Deutsch',
    description: 'Слово на русском, перевод на немецком',
    icon: '🇷🇺→🇩🇪',
  },
  {
    id: 'de-to-ru',
    title: 'Deutsch → Русский',
    description: 'Слово на немецком, перевод на русском',
    icon: '🇩🇪→🇷🇺',
  },
  {
    id: 'oral-only',
    title: 'Только устное',
    description: 'Слова из блоков для устного экзамена',
    icon: '🗣️',
  },
  {
    id: 'all-mixed',
    title: 'Все блоки вперемешку',
    description: 'Случайный порядок из всех слов',
    icon: '🔀',
  },
  {
    id: 'single-topic',
    title: 'Один блок',
    description: 'Выбери блок и учи только его',
    icon: '📁',
  },
  {
    id: 'multi-translation',
    title: 'Несколько переводов',
    description: 'Слова с 2+ вариантами перевода',
    icon: '📝',
  },
];

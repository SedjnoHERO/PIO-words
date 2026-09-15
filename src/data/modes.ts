import type { ModeOption } from '../types/vocabulary';

export const MODE_OPTIONS: ModeOption[] = [
  {
    id: 'ru-to-de',
    title: 'Русский → Deutsch',
    description: 'Фраза на русском, перевод на немецком',
    icon: '🇷🇺→🇩🇪',
  },
  {
    id: 'de-to-ru',
    title: 'Deutsch → Русский',
    description: 'Фраза на немецком, перевод на русском',
    icon: '🇩🇪→🇷🇺',
  },
  {
    id: 'all-mixed',
    title: 'Все вперемешку',
    description: 'Случайный порядок из всех фраз',
    icon: '🔀',
  },
  {
    id: 'multi-translation',
    title: 'Несколько переводов',
    description: 'Фразы с 2+ вариантами перевода',
    icon: '📝',
  },
];

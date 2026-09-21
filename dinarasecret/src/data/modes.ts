import type { AppLanguage, ModeOption } from '../types/vocabulary';

const FOREIGN_LABEL: Record<AppLanguage, string> = {
  de: 'Deutsch',
  en: 'English',
};

const FOREIGN_FLAG: Record<AppLanguage, string> = {
  de: '🇩🇪',
  en: '🇬🇧',
};

export const getModeOptions = (language: AppLanguage): ModeOption[] => {
  const foreign = FOREIGN_LABEL[language];
  const flag = FOREIGN_FLAG[language];

  return [
    {
      id: 'ru-to-foreign',
      title: `Русский → ${foreign}`,
      description: `Слово на русском, перевод на ${foreign.toLowerCase() === 'deutsch' ? 'немецком' : 'английском'}`,
      icon: `🇷🇺→${flag}`,
    },
    {
      id: 'foreign-to-ru',
      title: `${foreign} → Русский`,
      description: `Слово на ${foreign.toLowerCase() === 'deutsch' ? 'немецком' : 'английском'}, перевод на русском`,
      icon: `${flag}→🇷🇺`,
    },
    {
      id: 'all-mixed',
      title: 'Все вперемешку',
      description: 'Случайный порядок из всех слов',
      icon: '🔀',
    },
    {
      id: 'multi-translation',
      title: 'Несколько переводов',
      description: 'Слова с 2+ вариантами перевода',
      icon: '📝',
    },
  ];
};

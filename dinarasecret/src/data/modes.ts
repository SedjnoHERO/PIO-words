import type { AppLanguage, ModeOption } from '../types/vocabulary';

const FOREIGN_LABEL: Record<AppLanguage, string> = {
  de: 'Deutsch',
  en: 'English',
};

const FOREIGN_FLAG: Record<AppLanguage, string> = {
  de: '🇩🇪',
  en: '🇬🇧',
};

const foreignWord = (language: AppLanguage): string =>
  language === 'de' ? 'немецком' : 'английском';

export const getModeOptions = (language: AppLanguage): ModeOption[] => {
  const foreign = FOREIGN_LABEL[language];
  const flag = FOREIGN_FLAG[language];

  return [
    {
      id: 'ru-to-foreign',
      title: `Русский → ${foreign}`,
      description: `Слово на русском, перевод на ${foreignWord(language)}`,
      icon: `🇷🇺→${flag}`,
    },
    {
      id: 'foreign-to-ru',
      title: `${foreign} → Русский`,
      description: `Слово на ${foreignWord(language)}, перевод на русском`,
      icon: `${flag}→🇷🇺`,
    },
    {
      id: 'match-pairs',
      title: 'Соедини пары',
      description: 'Нажми слово слева и перевод справа',
      icon: '🔗',
    },
    {
      id: 'choose-one',
      title: 'Выбор из трёх',
      description: 'Одно слово сверху — выбери верный перевод',
      icon: '🎯',
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

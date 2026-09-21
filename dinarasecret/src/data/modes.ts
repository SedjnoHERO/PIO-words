import type {
  AppLanguage,
  ModeCategory,
  ModeCategoryId,
  ModeOption,
  StudyMode,
} from '../types/vocabulary';

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

const CARD_MODE_IDS: StudyMode[] = [
  'ru-to-foreign',
  'foreign-to-ru',
  'weak-words',
  'all-mixed',
  'multi-translation',
];

const GAME_MODE_IDS: StudyMode[] = [
  'match-pairs',
  'choose-one',
  'type-answer',
  'scramble-word',
  'memory',
];

export const MODE_CATEGORIES: ModeCategory[] = [
  {
    id: 'cards',
    title: 'Карточки',
    description: 'Классическое изучение и слабые слова',
    icon: '🃏',
  },
  {
    id: 'games',
    title: 'Игры',
    description: 'Пары, квиз, набор и память',
    icon: '🎮',
  },
];

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
      id: 'weak-words',
      title: 'Только слабые',
      description: 'Где чаще ошибалась или откладывала',
      icon: '💪',
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
    {
      id: 'match-pairs',
      title: 'Соедини пары',
      description: 'Слово слева и перевод справа',
      icon: '🔗',
    },
    {
      id: 'choose-one',
      title: 'Выбор из трёх',
      description: 'Одно слово — три варианта',
      icon: '🎯',
    },
    {
      id: 'type-answer',
      title: 'Напиши перевод',
      description: 'Введи перевод сам',
      icon: '⌨️',
    },
    {
      id: 'scramble-word',
      title: 'Собери слово',
      description: 'Буквы перемешаны — собери термин',
      icon: '🔤',
    },
    {
      id: 'memory',
      title: 'Память',
      description: 'Найди пары на карточках',
      icon: '🎴',
    },
  ];
};

export const getModesByCategory = (
  language: AppLanguage,
  categoryId: ModeCategoryId,
): ModeOption[] => {
  const ids = categoryId === 'cards' ? CARD_MODE_IDS : GAME_MODE_IDS;
  const all = getModeOptions(language);

  return ids
    .map((id) => all.find((mode) => mode.id === id))
    .filter((mode): mode is ModeOption => Boolean(mode));
};

export const getCategoryById = (
  categoryId: ModeCategoryId,
): ModeCategory | undefined =>
  MODE_CATEGORIES.find((category) => category.id === categoryId);

export const getModeTitle = (
  language: AppLanguage,
  mode: StudyMode,
): string =>
  getModeOptions(language).find((item) => item.id === mode)?.title ?? 'Режим';

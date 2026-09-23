import type {
  AppLanguage,
  ModeCategory,
  ModeCategoryId,
  ModeOption,
  StudyMode,
} from '../types/vocabulary';

const FOREIGN_LABEL: Record<AppLanguage, string> = {
  en: 'English',
  fr: 'Français',
};

const FOREIGN_FLAG: Record<AppLanguage, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
};

const foreignWord = (language: AppLanguage): string =>
  language === 'fr' ? 'французском' : 'английском';

const CARD_MODE_IDS: StudyMode[] = [
  'ru-to-foreign',
  'foreign-to-ru',
  'single-topic',
  'words-only',
  'phrases-only',
  'favorites',
  'weak-words',
  'all-mixed',
  'multi-translation',
];

const GAME_MODE_IDS: StudyMode[] = [
  'sprint',
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
    description: 'Слова, фразы и темы путешествия',
    icon: '📖',
  },
  {
    id: 'games',
    title: 'Игры',
    description: 'Спринт, пары, квиз и память',
    icon: '✦',
  },
];

export const getModeOptions = (language: AppLanguage): ModeOption[] => {
  const foreign = FOREIGN_LABEL[language];
  const flag = FOREIGN_FLAG[language];

  return [
    {
      id: 'ru-to-foreign',
      title: `Русский → ${foreign}`,
      description: `Слово или фраза на русском, перевод на ${foreignWord(language)}`,
      icon: `🇷🇺→${flag}`,
    },
    {
      id: 'foreign-to-ru',
      title: `${foreign} → Русский`,
      description: `На ${foreignWord(language)}, ответ по‑русски`,
      icon: `${flag}→🇷🇺`,
    },
    {
      id: 'single-topic',
      title: 'По теме',
      description: 'Ресепшен, магазины, дорога, лайнер…',
      icon: '🧭',
    },
    {
      id: 'words-only',
      title: 'Только слова',
      description: 'Короткие единицы: сумка = bag',
      icon: 'Aa',
    },
    {
      id: 'phrases-only',
      title: 'Только фразы',
      description: 'Готовые реплики для ситуаций',
      icon: '💬',
    },
    {
      id: 'favorites',
      title: 'Избранное',
      description: 'Отмеченные звёздочкой',
      icon: '★',
    },
    {
      id: 'weak-words',
      title: 'Слабые',
      description: 'Где чаще ошибались или откладывали',
      icon: '↻',
    },
    {
      id: 'all-mixed',
      title: 'Всё вперемешку',
      description: 'Случайный порядок из всего словаря',
      icon: '∿',
    },
    {
      id: 'multi-translation',
      title: 'Несколько вариантов',
      description: 'Записи с 2+ переводами',
      icon: '≡',
    },
    {
      id: 'sprint',
      title: 'Спринт',
      description: '60 секунд — как можно больше верных',
      icon: '⚡',
    },
    {
      id: 'match-pairs',
      title: 'Соедини пары',
      description: 'Слева и справа — найди пару',
      icon: '⟷',
    },
    {
      id: 'choose-one',
      title: 'Выбор из трёх',
      description: 'Одно сверху — три варианта',
      icon: '◎',
    },
    {
      id: 'type-answer',
      title: 'Напиши перевод',
      description: 'Ввод с мягкой проверкой',
      icon: '⌨',
    },
    {
      id: 'scramble-word',
      title: 'Собери слово',
      description: 'Буквы перемешаны',
      icon: '▦',
    },
    {
      id: 'memory',
      title: 'Память',
      description: 'Найди пары на карточках',
      icon: '▢',
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

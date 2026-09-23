export const MID_STUDY_PRAISE: string[] = [
  'Отлично',
  'Так держать',
  'Хороший темп',
  'Запомнили',
  'Верно',
  'Ещё чуть-чуть',
  'Аккуратно и точно',
  'Хорошая работа',
];

export const ALMOST_DONE_PRAISE: string[] = [
  'Почти готово',
  'Финишная прямая',
  'Ещё пара карточек',
  'Скоро конец круга',
];

export const FINISH_TITLES: string[] = [
  'Готово',
  'Круг закрыт',
  'Отличная сессия',
];

export const FINISH_MESSAGES: string[] = [
  'Можно повторить или выбрать другую тему.',
  'Слабые слова подтянутся в отдельном режиме.',
  'Пусть эти фразы пригодятся в поездке.',
];

export const FINISH_BADGES: string[] = ['✓ Готово', '★ Сессия', '◎ Тема'];

export const CONFETTI_COLORS: string[] = [
  '#1f6f66',
  '#4a9a90',
  '#c5a46e',
  '#d5e0dc',
  '#ffffff',
  '#2c5f6e',
];

export const pickRandom = <T,>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)] ?? items[0];

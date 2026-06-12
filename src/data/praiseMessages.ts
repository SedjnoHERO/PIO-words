export const MID_STUDY_PRAISE: string[] = [
  'Ты умница! ✨',
  'Красотка, так держать! 💖',
  'Вау, ты летишь! 🚀',
  'Гений, просто гений! 🌟',
  'Умничка, я горжусь! 💕',
  'Ты справляешься идеально! 🌸',
  'Супер-пупер! 🎀',
  'Какая ты молодец! ⭐',
  'Ты лучшая! 🦋',
  'Просто разрыв! 🔥',
];

export const ALMOST_DONE_PRAISE: string[] = [
  'Осталось совсем чуть-чуть, умничка! 💪',
  'Финишная прямая — ты супер! 🏁',
  'Ещё немного, свенюличка! ✨',
];

export const FINISH_TITLE = 'Умничка-педюличка-свенюличка!';

export const FINISH_MESSAGES: string[] = [
  'Ты прошла все карточки — ты невероятная молодец!',
  'Все слова позади, а ты — настоящая умница!',
  'Ты справилась! Горжусь тобой очень-очень сильно!',
  'Молодец, молодец, молодец — ты лучшая!',
];

export const FINISH_BADGES: string[] = [
  '💕 Умница',
  '🌸 Молодец',
  '✨ Красотка',
  '🎀 Суперзвезда',
  '💖 Горжусь тобой',
];

export const CONFETTI_COLORS: string[] = [
  '#e85d8a',
  '#f4a4bc',
  '#ffd166',
  '#ff9ecd',
  '#c77dff',
  '#ffffff',
];

export const pickRandom = (items: string[]): string =>
  items[Math.floor(Math.random() * items.length)] ?? items[0];

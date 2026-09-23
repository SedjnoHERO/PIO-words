import type { AppLanguage } from '../types/vocabulary';

export interface ActivitySummary {
  todayCount: number;
  streak: number;
  bestSprint: number;
}

interface ActivityStore {
  streak: number;
  lastActiveDate: string | null;
  countsByDate: Record<string, number>;
  bestSprint: number;
}

const storageKey = (language: AppLanguage): string =>
  `mom-activity-v1-${language}`;

const todayKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const shiftDateKey = (dateKey: string, days: number): string => {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0');
  const nextDay = String(date.getDate()).padStart(2, '0');
  return `${nextYear}-${nextMonth}-${nextDay}`;
};

const emptyStore = (): ActivityStore => ({
  streak: 0,
  lastActiveDate: null,
  countsByDate: {},
  bestSprint: 0,
});

const readStore = (language: AppLanguage): ActivityStore => {
  try {
    const raw = window.localStorage.getItem(storageKey(language));
    if (!raw) {
      return emptyStore();
    }

    const parsed = JSON.parse(raw) as ActivityStore;
    return {
      streak: parsed.streak ?? 0,
      lastActiveDate: parsed.lastActiveDate ?? null,
      countsByDate: parsed.countsByDate ?? {},
      bestSprint: parsed.bestSprint ?? 0,
    };
  } catch {
    return emptyStore();
  }
};

const writeStore = (language: AppLanguage, store: ActivityStore): void => {
  try {
    window.localStorage.setItem(storageKey(language), JSON.stringify(store));
  } catch {
    // Ignore quota / private mode failures.
  }
};

export const recordPractice = (
  language: AppLanguage,
  amount: number = 1,
): void => {
  if (amount <= 0) {
    return;
  }

  const store = readStore(language);
  const today = todayKey();
  const yesterday = shiftDateKey(today, -1);

  if (store.lastActiveDate !== today) {
    store.streak =
      store.lastActiveDate === yesterday ? Math.max(store.streak, 0) + 1 : 1;
    store.lastActiveDate = today;
  }

  store.countsByDate[today] = (store.countsByDate[today] ?? 0) + amount;
  writeStore(language, store);
};

export const recordSprintScore = (
  language: AppLanguage,
  score: number,
): number => {
  const store = readStore(language);
  const best = Math.max(store.bestSprint, score);
  if (best !== store.bestSprint) {
    store.bestSprint = best;
    writeStore(language, store);
  }

  return best;
};

export const getActivitySummary = (
  language: AppLanguage,
): ActivitySummary => {
  const store = readStore(language);
  const today = todayKey();
  const yesterday = shiftDateKey(today, -1);

  let streak = store.streak;
  if (
    store.lastActiveDate &&
    store.lastActiveDate !== today &&
    store.lastActiveDate !== yesterday
  ) {
    streak = 0;
  }

  return {
    todayCount: store.countsByDate[today] ?? 0,
    streak,
    bestSprint: store.bestSprint,
  };
};

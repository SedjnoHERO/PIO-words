import type { AppLanguage, WordEntry } from '../types/vocabulary';
import { recordPractice } from './activityStats';

export interface WordStat {
  wrong: number;
  right: number;
  deferred: number;
}

type StatsMap = Record<string, WordStat>;

const storageKey = (language: AppLanguage): string =>
  `mom-word-stats-v1-${language}`;

const emptyStat = (): WordStat => ({
  wrong: 0,
  right: 0,
  deferred: 0,
});

const readStats = (language: AppLanguage): StatsMap => {
  try {
    const raw = window.localStorage.getItem(storageKey(language));
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as StatsMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeStats = (language: AppLanguage, stats: StatsMap): void => {
  try {
    window.localStorage.setItem(storageKey(language), JSON.stringify(stats));
  } catch {
    // Ignore quota / private mode failures.
  }
};

const bump = (
  language: AppLanguage,
  wordId: string,
  field: keyof WordStat,
): void => {
  const stats = readStats(language);
  const current = stats[wordId] ?? emptyStat();
  stats[wordId] = {
    ...current,
    [field]: current[field] + 1,
  };
  writeStats(language, stats);
  recordPractice(language, 1);
};

export const recordCorrect = (language: AppLanguage, wordId: string): void => {
  bump(language, wordId, 'right');
};

export const recordWrong = (language: AppLanguage, wordId: string): void => {
  bump(language, wordId, 'wrong');
};

export const recordDeferred = (
  language: AppLanguage,
  wordId: string,
): void => {
  bump(language, wordId, 'deferred');
};

const weaknessScore = (stat: WordStat): number =>
  stat.wrong * 2 + stat.deferred - stat.right;

export const getWeakWordIds = (language: AppLanguage): string[] => {
  const stats = readStats(language);

  return Object.entries(stats)
    .filter(([, stat]) => weaknessScore(stat) > 0)
    .sort((a, b) => weaknessScore(b[1]) - weaknessScore(a[1]))
    .map(([id]) => id);
};

export const pickWeakWords = (
  language: AppLanguage,
  pool: WordEntry[],
): WordEntry[] => {
  const weakIds = new Set(getWeakWordIds(language));
  const weak = pool.filter((word) => weakIds.has(word.id));

  return weak.sort(
    (a, b) =>
      weaknessScore(readStats(language)[b.id] ?? emptyStat()) -
      weaknessScore(readStats(language)[a.id] ?? emptyStat()),
  );
};

import {
  ALMOST_DONE_PRAISE,
  MID_STUDY_PRAISE,
  pickRandom,
} from '../data/praiseMessages';

export const getMilestonePraise = (
  completedCount: number,
  total: number,
): string | null => {
  if (total <= 0 || completedCount <= 0) {
    return null;
  }

  const quarter = Math.ceil(total * 0.25);
  const half = Math.ceil(total * 0.5);
  const threeQuarters = Math.ceil(total * 0.75);
  const almostDone = Math.max(total - 3, 1);

  const milestones = new Map<number, string[]>([
    [quarter, MID_STUDY_PRAISE],
    [half, MID_STUDY_PRAISE],
    [threeQuarters, MID_STUDY_PRAISE],
    [almostDone, ALMOST_DONE_PRAISE],
  ]);

  const everyTen =
    completedCount % 10 === 0 && completedCount < total
      ? MID_STUDY_PRAISE
      : null;

  const pool = milestones.get(completedCount) ?? everyTen;
  return pool ? pickRandom(pool) : null;
};

export const vibratePraise = (): void => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate([30, 20, 30]);
  }
};

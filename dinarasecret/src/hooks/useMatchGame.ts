import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MatchChipState } from '../components/MatchScreen/MatchChip';
import { getVocabulary } from '../data/vocabulary';
import type { AppLanguage, WordEntry } from '../types/vocabulary';
import { splitIntoRounds } from '../utils/gameHelpers';
import { shuffleArray } from '../utils/shuffle';
import { recordCorrect, recordWrong } from '../utils/wordStats';

interface MatchGameState {
  allWords: WordEntry[];
  rounds: WordEntry[][];
  roundIndex: number;
  matchedIds: string[];
  selectedLeft: string | null;
  selectedRight: string | null;
  wordsById: Map<string, WordEntry>;
  visibleLeft: string[];
  visibleRight: string[];
  isRoundDone: boolean;
  isFinished: boolean;
  showRoundDone: boolean;
  globalProgress: number;
  chipState: (id: string, side: 'left' | 'right') => MatchChipState;
  handleLeft: (id: string) => void;
  handleRight: (id: string) => void;
  setupRound: (nextRoundIndex: number) => void;
}

export const useMatchGame = (language: AppLanguage): MatchGameState => {
  const allWords = useMemo(
    () => getVocabulary(language).flatMap((group) => group.words),
    [language],
  );
  const rounds = useMemo(() => splitIntoRounds(allWords), [allWords]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [popIds, setPopIds] = useState<string[]>([]);
  const [leftOrder, setLeftOrder] = useState<string[]>([]);
  const [rightOrder, setRightOrder] = useState<string[]>([]);
  const [showRoundDone, setShowRoundDone] = useState(false);
  const advanceTimerRef = useRef<number | null>(null);

  const currentRound = rounds[roundIndex] ?? [];
  const wordsById = useMemo(
    () => new Map(currentRound.map((word) => [word.id, word])),
    [currentRound],
  );

  const visibleLeft = leftOrder.filter(
    (id) => !matchedIds.includes(id) || popIds.includes(id),
  );
  const visibleRight = rightOrder.filter(
    (id) => !matchedIds.includes(id) || popIds.includes(id),
  );

  const isRoundDone =
    currentRound.length > 0 && matchedIds.length >= currentRound.length;
  const isFinished = isRoundDone && roundIndex >= rounds.length - 1;
  const globalProgress =
    rounds.slice(0, roundIndex).reduce((sum, round) => sum + round.length, 0) +
    matchedIds.length;

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }, []);

  const setupRound = useCallback(
    (nextRoundIndex: number) => {
      clearAdvanceTimer();
      const nextRound = rounds[nextRoundIndex] ?? [];
      const ids = nextRound.map((word) => word.id);
      setRoundIndex(nextRoundIndex);
      setMatchedIds([]);
      setSelectedLeft(null);
      setSelectedRight(null);
      setWrongIds([]);
      setPopIds([]);
      setShowRoundDone(false);
      setLeftOrder(shuffleArray(ids));
      setRightOrder(shuffleArray(ids));
    },
    [clearAdvanceTimer, rounds],
  );

  useEffect(() => {
    if (rounds.length > 0 && leftOrder.length === 0 && rightOrder.length === 0) {
      setupRound(0);
    }
  }, [leftOrder.length, rightOrder.length, rounds.length, setupRound]);

  useEffect(() => () => clearAdvanceTimer(), [clearAdvanceTimer]);

  const tryMatch = useCallback(
    (leftId: string, rightId: string) => {
      if (leftId === rightId) {
        recordCorrect(language, leftId);
        setPopIds([leftId]);
        setSelectedLeft(null);
        setSelectedRight(null);

        const nextMatchedCount = matchedIds.includes(leftId)
          ? matchedIds.length
          : matchedIds.length + 1;
        const completesRound = nextMatchedCount >= currentRound.length;
        const isLastRound = roundIndex >= rounds.length - 1;

        window.setTimeout(() => {
          setPopIds([]);
          setMatchedIds((prev) =>
            prev.includes(leftId) ? prev : [...prev, leftId],
          );

          if (!completesRound) {
            return;
          }

          if (isLastRound) {
            return;
          }

          setShowRoundDone(true);
          clearAdvanceTimer();
          advanceTimerRef.current = window.setTimeout(() => {
            advanceTimerRef.current = null;
            setupRound(roundIndex + 1);
          }, 500);
        }, 360);
        return;
      }

      recordWrong(language, leftId);
      recordWrong(language, rightId);
      setWrongIds([leftId, rightId]);
      window.setTimeout(() => {
        setWrongIds([]);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 420);
    },
    [
      clearAdvanceTimer,
      currentRound.length,
      language,
      matchedIds,
      roundIndex,
      rounds.length,
      setupRound,
    ],
  );

  const handleLeft = useCallback(
    (id: string) => {
      if (matchedIds.includes(id) || popIds.length > 0 || wrongIds.length > 0) {
        return;
      }

      if (selectedRight) {
        tryMatch(id, selectedRight);
        return;
      }

      setSelectedLeft((prev) => (prev === id ? null : id));
      setSelectedRight(null);
    },
    [matchedIds, popIds.length, selectedRight, tryMatch, wrongIds.length],
  );

  const handleRight = useCallback(
    (id: string) => {
      if (matchedIds.includes(id) || popIds.length > 0 || wrongIds.length > 0) {
        return;
      }

      if (selectedLeft) {
        tryMatch(selectedLeft, id);
        return;
      }

      setSelectedRight((prev) => (prev === id ? null : id));
      setSelectedLeft(null);
    },
    [matchedIds, popIds.length, selectedLeft, tryMatch, wrongIds.length],
  );

  const chipState = (id: string, side: 'left' | 'right'): MatchChipState => {
    if (popIds.includes(id)) {
      return 'pop';
    }

    if (wrongIds.includes(id)) {
      return 'wrong';
    }

    if (side === 'left' && selectedLeft === id) {
      return 'selected';
    }

    if (side === 'right' && selectedRight === id) {
      return 'selected';
    }

    if (side === 'left' && selectedRight && !selectedLeft) {
      return 'waiting';
    }

    if (side === 'right' && selectedLeft && !selectedRight) {
      return 'waiting';
    }

    return 'idle';
  };

  return {
    allWords,
    rounds,
    roundIndex,
    matchedIds,
    selectedLeft,
    selectedRight,
    wordsById,
    visibleLeft,
    visibleRight,
    isRoundDone,
    isFinished,
    showRoundDone,
    globalProgress,
    chipState,
    handleLeft,
    handleRight,
    setupRound,
  };
};

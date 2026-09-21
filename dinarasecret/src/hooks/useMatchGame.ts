import { useCallback, useEffect, useMemo, useState } from 'react';
import { getVocabulary } from '../data/vocabulary';
import type { AppLanguage, WordEntry } from '../types/vocabulary';
import { splitIntoRounds } from '../utils/gameHelpers';
import { shuffleArray } from '../utils/shuffle';
import { recordCorrect, recordWrong } from '../utils/wordStats';
import type { MatchChipState } from '../components/MatchScreen/MatchChip';

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

  const setupRound = useCallback(
    (nextRoundIndex: number) => {
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
    [rounds],
  );

  useEffect(() => {
    if (rounds.length > 0 && leftOrder.length === 0 && rightOrder.length === 0) {
      setupRound(0);
    }
  }, [leftOrder.length, rightOrder.length, rounds.length, setupRound]);

  useEffect(() => {
    if (!isRoundDone || isFinished || showRoundDone) {
      return;
    }

    setShowRoundDone(true);
    const timer = window.setTimeout(() => {
      setupRound(roundIndex + 1);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [isFinished, isRoundDone, roundIndex, setupRound, showRoundDone]);

  const tryMatch = useCallback(
    (leftId: string, rightId: string) => {
      if (leftId === rightId) {
        recordCorrect(language, leftId);
        setPopIds([leftId]);
        setSelectedLeft(null);
        setSelectedRight(null);
        window.setTimeout(() => {
          setMatchedIds((prev) =>
            prev.includes(leftId) ? prev : [...prev, leftId],
          );
          setPopIds([]);
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
    [language],
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

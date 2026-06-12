import { useCallback, useMemo, useState } from 'react';
import { buildDeck } from '../utils/deckBuilder';
import type { StudyMode, WordEntry } from '../types/vocabulary';

interface UseFlashcardsParams {
  mode: StudyMode;
  topicId: string | null;
}

interface UseFlashcardsResult {
  deck: WordEntry[];
  currentIndex: number;
  currentWord: WordEntry | null;
  isFlipped: boolean;
  progress: number;
  isFinished: boolean;
  flip: () => void;
  next: () => void;
  prev: () => void;
  restart: () => void;
}

export const useFlashcards = ({
  mode,
  topicId,
}: UseFlashcardsParams): UseFlashcardsResult => {
  const [deck, setDeck] = useState<WordEntry[]>(() =>
    buildDeck(mode, topicId),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentWord = deck[currentIndex] ?? null;
  const isFinished = deck.length > 0 && currentIndex >= deck.length;
  const progress =
    deck.length === 0 ? 0 : Math.min(currentIndex + 1, deck.length);

  const flip = useCallback(() => {
    setIsFlipped((value) => !value);
  }, []);

  const next = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((index) => index + 1);
  }, []);

  const prev = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((index) => Math.max(0, index - 1));
  }, []);

  const restart = useCallback(() => {
    setDeck(buildDeck(mode, topicId));
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [mode, topicId]);

  return useMemo(
    () => ({
      deck,
      currentIndex,
      currentWord,
      isFlipped,
      progress,
      isFinished,
      flip,
      next,
      prev,
      restart,
    }),
    [
      deck,
      currentIndex,
      currentWord,
      isFlipped,
      progress,
      isFinished,
      flip,
      next,
      prev,
      restart,
    ],
  );
};

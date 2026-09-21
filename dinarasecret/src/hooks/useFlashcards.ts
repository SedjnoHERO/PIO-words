import { useCallback, useMemo, useState } from 'react';
import { buildDeck } from '../utils/deckBuilder';
import { recordDeferred } from '../utils/wordStats';
import type { AppLanguage, StudyMode, WordEntry } from '../types/vocabulary';

interface UseFlashcardsParams {
  language: AppLanguage;
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
  canDefer: boolean;
  flip: () => void;
  next: () => void;
  prev: () => void;
  defer: () => void;
  restart: () => void;
}

const insertOffset = (remainingAhead: number): number => {
  if (remainingAhead <= 0) {
    return 0;
  }

  const preferred = 3 + Math.floor(Math.random() * 3);
  return Math.min(preferred, remainingAhead);
};

export const useFlashcards = ({
  language,
  mode,
  topicId,
}: UseFlashcardsParams): UseFlashcardsResult => {
  const [deck, setDeck] = useState<WordEntry[]>(() =>
    buildDeck(language, mode, topicId),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentWord = deck[currentIndex] ?? null;
  const isFinished = deck.length > 0 && currentIndex >= deck.length;
  const progress =
    deck.length === 0 ? 0 : Math.min(currentIndex + 1, deck.length);
  const canDefer = Boolean(currentWord) && deck.length > 1 && !isFinished;

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

  const defer = useCallback(() => {
    setDeck((prev) => {
      const word = prev[currentIndex];
      if (!word || prev.length < 2) {
        return prev;
      }

      const rest = [
        ...prev.slice(0, currentIndex),
        ...prev.slice(currentIndex + 1),
      ];
      const remainingAhead = rest.length - currentIndex;
      let insertAt: number;

      if (remainingAhead > 0) {
        insertAt = currentIndex + insertOffset(remainingAhead);
      } else {
        insertAt = Math.max(1, Math.floor(rest.length / 2));
      }

      recordDeferred(language, word.id);

      return [...rest.slice(0, insertAt), word, ...rest.slice(insertAt)];
    });

    setIsFlipped(false);

    setCurrentIndex((index) => {
      if (index >= deck.length - 1) {
        return 0;
      }

      return index;
    });
  }, [currentIndex, deck.length, language]);

  const restart = useCallback(() => {
    setDeck(buildDeck(language, mode, topicId));
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [language, mode, topicId]);

  return useMemo(
    () => ({
      deck,
      currentIndex,
      currentWord,
      isFlipped,
      progress,
      isFinished,
      canDefer,
      flip,
      next,
      prev,
      defer,
      restart,
    }),
    [
      deck,
      currentIndex,
      currentWord,
      isFlipped,
      progress,
      isFinished,
      canDefer,
      flip,
      next,
      prev,
      defer,
      restart,
    ],
  );
};

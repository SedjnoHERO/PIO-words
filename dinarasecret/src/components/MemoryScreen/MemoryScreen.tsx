import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { getVocabulary } from '../../data/vocabulary';
import type { AppLanguage, WordEntry } from '../../types/vocabulary';
import { getForeignText, getRuText, splitIntoRounds } from '../../utils/gameHelpers';
import { recordCorrect, recordWrong } from '../../utils/wordStats';
import { FinishScreen } from '../FinishScreen/FinishScreen';
import { Header } from '../Header/Header';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { MemoryTile } from './MemoryTile';

interface MemoryScreenProps {
  language: AppLanguage;
  onBack: () => void;
  onHome: () => void;
}

export interface MemoryCard {
  key: string;
  pairId: string;
  label: string;
  side: 'ru' | 'foreign';
}

const MEMORY_ROUND_SIZE = 6;

const SCREEN_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  width: '100%',
  flex: 1,
  minHeight: 0,
};

const BOARD_STYLE: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  width: '100%',
  alignContent: 'flex-start',
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
};

const HINT_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '13px',
  fontWeight: 700,
  color: 'var(--text-muted)',
  textAlign: 'center',
};

const ROUND_DONE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  flex: 1,
  textAlign: 'center',
};

const NEXT_BTN: CSSProperties = {
  marginTop: '8px',
  minWidth: '160px',
  height: '48px',
  padding: '0 20px',
  border: 'none',
  borderRadius: '16px',
  background: 'var(--accent)',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 800,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const buildCards = (words: WordEntry[]): MemoryCard[] => {
  const cards: MemoryCard[] = words.flatMap((word) => [
    {
      key: `${word.id}-ru`,
      pairId: word.id,
      label: getRuText(word),
      side: 'ru' as const,
    },
    {
      key: `${word.id}-foreign`,
      pairId: word.id,
      label: getForeignText(word),
      side: 'foreign' as const,
    },
  ]);

  for (let index = cards.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const temp = cards[index];
    cards[index] = cards[swapIndex];
    cards[swapIndex] = temp;
  }

  return cards;
};

export const MemoryScreen = ({
  language,
  onBack,
  onHome,
}: MemoryScreenProps) => {
  const allWords = useMemo(
    () => getVocabulary(language).flatMap((group) => group.words),
    [language],
  );
  const rounds = useMemo(
    () => splitIntoRounds(allWords, MEMORY_ROUND_SIZE),
    [allWords],
  );
  const [roundIndex, setRoundIndex] = useState(0);
  const [cards, setCards] = useState<MemoryCard[]>(() =>
    buildCards(rounds[0] ?? []),
  );
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [lock, setLock] = useState(false);
  const [showRoundDone, setShowRoundDone] = useState(false);

  const currentRound = rounds[roundIndex] ?? [];
  const isRoundDone =
    currentRound.length > 0 && matched.length >= currentRound.length;
  const isFinished = isRoundDone && roundIndex >= rounds.length - 1;
  const globalProgress =
    rounds.slice(0, roundIndex).reduce((sum, round) => sum + round.length, 0) +
    matched.length;

  const setupRound = useCallback(
    (nextIndex: number) => {
      setRoundIndex(nextIndex);
      setCards(buildCards(rounds[nextIndex] ?? []));
      setFlipped([]);
      setMatched([]);
      setLock(false);
      setShowRoundDone(false);
    },
    [rounds],
  );

  useEffect(() => {
    if (!isRoundDone || isFinished) {
      return;
    }

    setShowRoundDone(true);
    const timer = window.setTimeout(() => {
      setupRound(roundIndex + 1);
    }, 450);

    return () => window.clearTimeout(timer);
  }, [isFinished, isRoundDone, roundIndex, setupRound]);

  const handleTile = useCallback(
    (card: MemoryCard) => {
      if (
        lock ||
        matched.includes(card.pairId) ||
        flipped.includes(card.key) ||
        flipped.length >= 2
      ) {
        return;
      }

      const nextFlipped = [...flipped, card.key];
      setFlipped(nextFlipped);

      if (nextFlipped.length < 2) {
        return;
      }

      const first = cards.find((item) => item.key === nextFlipped[0]);
      const second = cards.find((item) => item.key === nextFlipped[1]);
      if (!first || !second) {
        return;
      }

      setLock(true);

      if (
        first.pairId === second.pairId &&
        first.side !== second.side
      ) {
        recordCorrect(language, first.pairId);
        window.setTimeout(() => {
          setMatched((prev) => [...prev, first.pairId]);
          setFlipped([]);
          setLock(false);
        }, 420);
        return;
      }

      recordWrong(language, first.pairId);
      if (first.pairId !== second.pairId) {
        recordWrong(language, second.pairId);
      }

      window.setTimeout(() => {
        setFlipped([]);
        setLock(false);
      }, 700);
    },
    [cards, flipped, language, lock, matched],
  );

  if (allWords.length < 2) {
    return (
      <section style={SCREEN_STYLE}>
        <Header title="Память" onBack={onBack} />
        <p style={HINT_STYLE}>Нужно хотя бы 2 слова.</p>
      </section>
    );
  }

  if (isFinished) {
    return (
      <section style={SCREEN_STYLE}>
        <Header title="Память" onBack={onBack} />
        <FinishScreen
          total={allWords.length}
          onRestart={() => setupRound(0)}
          onHome={onHome}
        />
      </section>
    );
  }

  if (showRoundDone) {
    return (
      <section style={SCREEN_STYLE}>
        <Header
          title="Память"
          subtitle={`Раунд ${roundIndex + 1}/${rounds.length}`}
          onBack={onBack}
        />
        <div style={ROUND_DONE}>
          <span style={{ fontSize: '48px' }} aria-hidden="true">
            🃏
          </span>
          <p style={{ ...HINT_STYLE, color: 'var(--accent)', fontSize: '20px' }}>
            Раунд собран!
          </p>
          <button
            type="button"
            style={NEXT_BTN}
            onClick={() => setupRound(roundIndex + 1)}
          >
            Дальше
          </button>
        </div>
      </section>
    );
  }

  return (
    <section style={SCREEN_STYLE}>
      <Header
        title="Память"
        subtitle={`Раунд ${roundIndex + 1}/${rounds.length}`}
        onBack={onBack}
      />
      <ProgressBar current={globalProgress} total={allWords.length} />
      <p style={HINT_STYLE}>Открой две карточки — найди пару</p>
      <div style={BOARD_STYLE}>
        {cards.map((card) => (
          <MemoryTile
            key={card.key}
            label={card.label}
            side={card.side}
            isOpen={flipped.includes(card.key) || matched.includes(card.pairId)}
            isMatched={matched.includes(card.pairId)}
            onClick={() => handleTile(card)}
          />
        ))}
      </div>
    </section>
  );
};

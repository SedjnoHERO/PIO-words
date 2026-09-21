import { useCallback, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { getVocabulary } from '../../data/vocabulary';
import type { AppLanguage } from '../../types/vocabulary';
import {
  getForeignText,
  getRuText,
  splitIntoRounds,
} from '../../utils/gameHelpers';
import { shuffleArray } from '../../utils/shuffle';
import { FinishScreen } from '../FinishScreen/FinishScreen';
import { Header } from '../Header/Header';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { MatchChip, type MatchChipState } from './MatchChip';

interface MatchScreenProps {
  language: AppLanguage;
  onBack: () => void;
  onHome: () => void;
}

const SCREEN_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
  flex: 1,
  minHeight: 0,
};

const COLUMNS_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
};

const COLUMN_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  flex: 1,
  minWidth: 0,
};

const HINT_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textAlign: 'center',
};

const NEXT_BTN: CSSProperties = {
  width: '100%',
  height: '52px',
  border: 'none',
  borderRadius: '16px',
  background: 'var(--accent)',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 800,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

export const MatchScreen = ({
  language,
  onBack,
  onHome,
}: MatchScreenProps) => {
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
  const [leftOrder, setLeftOrder] = useState<string[]>(() =>
    shuffleArray((rounds[0] ?? []).map((word) => word.id)),
  );
  const [rightOrder, setRightOrder] = useState<string[]>(() =>
    shuffleArray((rounds[0] ?? []).map((word) => word.id)),
  );

  const currentRound = rounds[roundIndex] ?? [];
  const wordsById = useMemo(
    () => new Map(currentRound.map((word) => [word.id, word])),
    [currentRound],
  );
  const isRoundDone =
    currentRound.length > 0 && matchedIds.length >= currentRound.length;
  const isFinished = isRoundDone && roundIndex >= rounds.length - 1;
  const globalProgress =
    rounds.slice(0, roundIndex).reduce((sum, round) => sum + round.length, 0) +
    matchedIds.length;

  const resetRound = useCallback(
    (nextRoundIndex: number) => {
      const nextRound = rounds[nextRoundIndex] ?? [];
      const ids = nextRound.map((word) => word.id);
      setRoundIndex(nextRoundIndex);
      setMatchedIds([]);
      setSelectedLeft(null);
      setSelectedRight(null);
      setWrongIds([]);
      setLeftOrder(shuffleArray(ids));
      setRightOrder(shuffleArray(ids));
    },
    [rounds],
  );

  const tryMatch = useCallback((leftId: string, rightId: string) => {
    if (leftId === rightId) {
      setMatchedIds((prev) => [...prev, leftId]);
      setSelectedLeft(null);
      setSelectedRight(null);
      return;
    }

    setWrongIds([leftId, rightId]);
    window.setTimeout(() => {
      setWrongIds([]);
      setSelectedLeft(null);
      setSelectedRight(null);
    }, 450);
  }, []);

  const handleLeft = useCallback(
    (id: string) => {
      if (matchedIds.includes(id) || wrongIds.length > 0) {
        return;
      }

      if (selectedRight) {
        tryMatch(id, selectedRight);
        return;
      }

      setSelectedLeft((prev) => (prev === id ? null : id));
    },
    [matchedIds, selectedRight, tryMatch, wrongIds.length],
  );

  const handleRight = useCallback(
    (id: string) => {
      if (matchedIds.includes(id) || wrongIds.length > 0) {
        return;
      }

      if (selectedLeft) {
        tryMatch(selectedLeft, id);
        return;
      }

      setSelectedRight((prev) => (prev === id ? null : id));
    },
    [matchedIds, selectedLeft, tryMatch, wrongIds.length],
  );

  const chipState = (id: string, side: 'left' | 'right'): MatchChipState => {
    if (matchedIds.includes(id)) {
      return 'matched';
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

    return 'idle';
  };

  if (allWords.length < 2) {
    return (
      <section style={SCREEN_STYLE}>
        <Header title="Соедини пары" onBack={onBack} />
        <p style={HINT_STYLE}>Нужно хотя бы 2 слова в словаре.</p>
      </section>
    );
  }

  if (isFinished) {
    return (
      <section style={SCREEN_STYLE}>
        <Header title="Соедини пары" onBack={onBack} />
        <FinishScreen
          total={allWords.length}
          onRestart={() => resetRound(0)}
          onHome={onHome}
        />
      </section>
    );
  }

  if (isRoundDone) {
    return (
      <section style={SCREEN_STYLE}>
        <Header title="Соедини пары" onBack={onBack} />
        <p style={HINT_STYLE}>
          Раунд {roundIndex + 1} из {rounds.length} готов!
        </p>
        <button
          type="button"
          style={NEXT_BTN}
          onClick={() => resetRound(roundIndex + 1)}
        >
          Дальше
        </button>
      </section>
    );
  }

  return (
    <section style={SCREEN_STYLE}>
      <Header
        title="Соедини пары"
        subtitle={`Раунд ${roundIndex + 1}/${rounds.length}`}
        onBack={onBack}
      />
      <ProgressBar current={globalProgress} total={allWords.length} />
      <p style={HINT_STYLE}>Выбери слово слева и пару справа</p>
      <div style={COLUMNS_STYLE}>
        <div style={COLUMN_STYLE}>
          {leftOrder.map((id) => {
            const word = wordsById.get(id);
            return word ? (
              <MatchChip
                key={`l-${id}`}
                label={getRuText(word)}
                state={chipState(id, 'left')}
                onClick={() => handleLeft(id)}
              />
            ) : null;
          })}
        </div>
        <div style={COLUMN_STYLE}>
          {rightOrder.map((id) => {
            const word = wordsById.get(id);
            return word ? (
              <MatchChip
                key={`r-${id}`}
                label={getForeignText(word)}
                state={chipState(id, 'right')}
                onClick={() => handleRight(id)}
              />
            ) : null;
          })}
        </div>
      </div>
    </section>
  );
};

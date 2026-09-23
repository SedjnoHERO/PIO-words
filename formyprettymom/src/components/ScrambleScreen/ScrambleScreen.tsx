import { useCallback, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { getVocabulary } from '../../data/vocabulary';
import type { AppLanguage, WordEntry } from '../../types/vocabulary';
import { scrambleLetters } from '../../utils/answerCheck';
import { getForeignText, getRuText } from '../../utils/gameHelpers';
import { shuffleArray } from '../../utils/shuffle';
import { recordCorrect, recordWrong } from '../../utils/wordStats';
import { speakText } from '../../utils/speech';
import { FinishScreen } from '../FinishScreen/FinishScreen';
import { Header } from '../Header/Header';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { SpeakButton } from '../SpeakButton/SpeakButton';

interface ScrambleScreenProps {
  language: AppLanguage;
  onBack: () => void;
  onHome: () => void;
}

interface LetterTile {
  id: string;
  char: string;
}

interface ScrambleSession {
  deck: WordEntry[];
  index: number;
  target: string;
  pool: LetterTile[];
  slots: Array<LetterTile | null>;
}

const SCREEN_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  width: '100%',
  flex: 1,
  minHeight: 0,
};

const PROMPT_CARD: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  minHeight: '130px',
  padding: '20px 16px',
  borderRadius: '24px',
  background: 'linear-gradient(145deg, #ffffff, #fff5f8)',
  boxShadow: 'var(--shadow-md)',
  textAlign: 'center',
  position: 'relative',
};

const LABEL_STYLE: CSSProperties = {
  fontSize: '12px',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--accent)',
};

const PROMPT_TEXT: CSSProperties = {
  margin: 0,
  fontSize: '24px',
  fontWeight: 800,
  color: 'var(--text)',
  wordBreak: 'break-word',
};

const FEEDBACK_STYLE: CSSProperties = {
  margin: 0,
  minHeight: '18px',
  fontSize: '13px',
  fontWeight: 700,
  textAlign: 'center',
};

const SLOT_ROW: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'flex-start',
  gap: '8px',
  minHeight: '60px',
  padding: '12px',
  borderRadius: '18px',
  background: 'var(--accent-soft)',
};

const POOL_ROW: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'flex-start',
  gap: '8px',
  marginTop: 'auto',
  minHeight: '100px',
};

const TILE_STYLE: CSSProperties = {
  width: '40px',
  height: '44px',
  padding: 0,
  borderRadius: '12px',
  border: 'none',
  background: 'var(--surface)',
  boxShadow: 'var(--shadow-sm)',
  fontSize: '18px',
  fontWeight: 800,
  fontFamily: 'inherit',
  color: 'var(--text)',
  cursor: 'pointer',
  flexShrink: 0,
};

const SLOT_EMPTY: CSSProperties = {
  ...TILE_STYLE,
  background: 'rgba(255, 255, 255, 0.55)',
  boxShadow: 'none',
  border: '2px dashed var(--border)',
  cursor: 'default',
};

const ACTIONS: CSSProperties = {
  display: 'flex',
  gap: '10px',
  width: '100%',
};

const ACTION_BTN: CSSProperties = {
  flex: 1,
  height: '48px',
  border: 'none',
  borderRadius: '14px',
  fontSize: '15px',
  fontWeight: 800,
  fontFamily: 'inherit',
  cursor: 'pointer',
};

const HINT_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '13px',
  fontWeight: 700,
  textAlign: 'center',
  color: 'var(--text-muted)',
};

const makeTiles = (word: string): LetterTile[] =>
  scrambleLetters(word).map((char, index) => ({
    id: `${char}-${index}-${Math.random().toString(36).slice(2, 6)}`,
    char,
  }));

const pickTarget = (word: WordEntry): string =>
  (word.terms[0] ?? '').replace(/\s+/g, '');

const createRound = (
  deck: WordEntry[],
  index: number,
): Pick<ScrambleSession, 'target' | 'pool' | 'slots'> => {
  const word = deck[index];
  const target = word ? pickTarget(word) : '';
  const pool = target ? makeTiles(target) : [];

  return {
    target,
    pool,
    slots: Array.from({ length: target.length }, () => null),
  };
};

const createSession = (language: AppLanguage): ScrambleSession => {
  const deck = shuffleArray(
    getVocabulary(language)
      .flatMap((group) => group.words)
      .filter((word) => pickTarget(word).length >= 2),
  );
  const round = createRound(deck, 0);

  return {
    deck,
    index: 0,
    ...round,
  };
};

export const ScrambleScreen = ({
  language,
  onBack,
  onHome,
}: ScrambleScreenProps) => {
  const [session, setSession] = useState<ScrambleSession>(() =>
    createSession(language),
  );
  const [status, setStatus] = useState<'play' | 'correct' | 'wrong'>('play');

  const current = session.deck[session.index] ?? null;
  const isFinished =
    session.deck.length > 0 && session.index >= session.deck.length;
  const builtText = session.slots.map((tile) => tile?.char ?? '').join('');
  const usedIds = useMemo(
    () => new Set(session.slots.filter(Boolean).map((tile) => tile!.id)),
    [session.slots],
  );
  const filledCount = session.slots.filter(Boolean).length;
  const allFilled = filledCount === session.target.length && session.target.length > 0;

  const handleRestart = useCallback(() => {
    setSession(createSession(language));
    setStatus('play');
  }, [language]);

  const goNext = useCallback(() => {
    const nextIndex = session.index + 1;
    if (nextIndex >= session.deck.length) {
      setSession((prev) => ({ ...prev, index: nextIndex }));
      setStatus('play');
      return;
    }

    setSession((prev) => ({
      ...prev,
      index: nextIndex,
      ...createRound(prev.deck, nextIndex),
    }));
    setStatus('play');
  }, [session.deck.length, session.index]);

  const handlePickPool = useCallback(
    (tile: LetterTile) => {
      if (status !== 'play' || usedIds.has(tile.id)) {
        return;
      }

      setSession((prev) => {
        const emptyIndex = prev.slots.findIndex((slot) => slot === null);
        if (emptyIndex < 0) {
          return prev;
        }

        const nextSlots = [...prev.slots];
        nextSlots[emptyIndex] = tile;
        return { ...prev, slots: nextSlots };
      });
    },
    [status, usedIds],
  );

  const handlePickSlot = useCallback(
    (slotIndex: number) => {
      if (status !== 'play') {
        return;
      }

      setSession((prev) => {
        if (!prev.slots[slotIndex]) {
          return prev;
        }

        const nextSlots = [...prev.slots];
        nextSlots[slotIndex] = null;
        return { ...prev, slots: nextSlots };
      });
    },
    [status],
  );

  const handleClear = useCallback(() => {
    if (status !== 'play' || !current) {
      return;
    }

    setSession((prev) => ({
      ...prev,
      slots: prev.slots.map(() => null),
    }));
  }, [current, status]);

  const handleCheck = useCallback(() => {
    if (!current || status !== 'play' || !allFilled) {
      return;
    }

    if (builtText.toLowerCase() === session.target.toLowerCase()) {
      recordCorrect(language, current.id);
      setStatus('correct');
      window.setTimeout(goNext, 700);
      return;
    }

    recordWrong(language, current.id);
    setStatus('wrong');
    window.setTimeout(() => {
      setSession((prev) => ({
        ...prev,
        ...createRound(prev.deck, prev.index),
      }));
      setStatus('play');
    }, 900);
  }, [
    allFilled,
    builtText,
    current,
    goNext,
    language,
    session.target,
    status,
  ]);

  const promptRu = useMemo(
    () => (current ? getRuText(current) : ''),
    [current],
  );

  const feedbackText =
    status === 'wrong'
      ? `Нужно: ${current ? getForeignText(current) : ''}`
      : status === 'correct'
        ? 'Собрала!'
        : ' ';

  const feedbackColor =
    status === 'wrong'
      ? '#a12b3a'
      : status === 'correct'
        ? '#1f7a3f'
        : 'transparent';

  if (session.deck.length === 0) {
    return (
      <section style={SCREEN_STYLE}>
        <Header title="Собери слово" onBack={onBack} />
        <p style={HINT_STYLE}>Нет подходящих слов для сборки.</p>
      </section>
    );
  }

  if (isFinished) {
    return (
      <section style={SCREEN_STYLE}>
        <Header title="Собери слово" onBack={onBack} />
        <FinishScreen
          total={session.deck.length}
          onRestart={handleRestart}
          onHome={onHome}
        />
      </section>
    );
  }

  if (!current) {
    return null;
  }

  return (
    <section style={SCREEN_STYLE}>
      <Header title="Собери слово" onBack={onBack} />
      <ProgressBar current={session.index + 1} total={session.deck.length} />
      <div style={PROMPT_CARD}>
        <SpeakButton
          corner="right"
          onSpeak={() => speakText(getForeignText(current), language)}
        />
        <span style={LABEL_STYLE}>Русский</span>
        <p style={PROMPT_TEXT}>{promptRu}</p>
        <p style={{ ...FEEDBACK_STYLE, color: feedbackColor }}>{feedbackText}</p>
      </div>
      <div style={SLOT_ROW}>
        {session.slots.map((tile, index) =>
          tile ? (
            <button
              key={`slot-${index}-${tile.id}`}
              type="button"
              style={TILE_STYLE}
              onClick={() => handlePickSlot(index)}
            >
              {tile.char}
            </button>
          ) : (
            <span key={`empty-${index}`} style={SLOT_EMPTY} />
          ),
        )}
      </div>
      <div style={POOL_ROW}>
        {session.pool.map((tile) => {
          const isUsed = usedIds.has(tile.id);

          return (
            <button
              key={tile.id}
              type="button"
              style={{
                ...TILE_STYLE,
                background: isUsed ? 'transparent' : 'var(--accent)',
                color: isUsed ? 'transparent' : '#ffffff',
                boxShadow: isUsed ? 'none' : TILE_STYLE.boxShadow,
                cursor: isUsed ? 'default' : 'pointer',
                pointerEvents: isUsed ? 'none' : 'auto',
              }}
              onClick={() => handlePickPool(tile)}
              disabled={isUsed}
              aria-hidden={isUsed}
            >
              {isUsed ? '' : tile.char}
            </button>
          );
        })}
      </div>
      <div style={ACTIONS}>
        <button
          type="button"
          style={{
            ...ACTION_BTN,
            background: 'var(--surface)',
            color: 'var(--text)',
            boxShadow: 'var(--shadow-sm)',
          }}
          onClick={handleClear}
        >
          Сброс
        </button>
        <button
          type="button"
          style={{
            ...ACTION_BTN,
            background: 'var(--accent)',
            color: '#ffffff',
            opacity: allFilled && status === 'play' ? 1 : 0.5,
          }}
          onClick={handleCheck}
          disabled={!allFilled || status !== 'play'}
        >
          Готово
        </button>
      </div>
    </section>
  );
};

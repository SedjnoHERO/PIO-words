import { useCallback, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { getVocabulary } from '../../data/vocabulary';
import type { AppLanguage, WordEntry } from '../../types/vocabulary';
import { scrambleLetters } from '../../utils/answerCheck';
import { getForeignText, getRuText } from '../../utils/gameHelpers';
import { shuffleArray } from '../../utils/shuffle';
import { recordCorrect, recordWrong } from '../../utils/wordStats';
import { FinishScreen } from '../FinishScreen/FinishScreen';
import { Header } from '../Header/Header';
import { ProgressBar } from '../ProgressBar/ProgressBar';

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
  built: LetterTile[];
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
  minHeight: '110px',
  padding: '20px 16px',
  borderRadius: '24px',
  background: 'linear-gradient(145deg, #ffffff, #fff5f8)',
  boxShadow: 'var(--shadow-md)',
  textAlign: 'center',
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

const SLOT_ROW: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '8px',
  minHeight: '56px',
  padding: '12px',
  borderRadius: '18px',
  background: 'var(--accent-soft)',
};

const POOL_ROW: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '8px',
  marginTop: 'auto',
};

const TILE_STYLE: CSSProperties = {
  minWidth: '40px',
  height: '44px',
  padding: '0 12px',
  borderRadius: '12px',
  border: 'none',
  background: 'var(--surface)',
  boxShadow: 'var(--shadow-sm)',
  fontSize: '18px',
  fontWeight: 800,
  fontFamily: 'inherit',
  color: 'var(--text)',
  cursor: 'pointer',
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
): Pick<ScrambleSession, 'target' | 'pool' | 'built'> => {
  const word = deck[index];
  const target = word ? pickTarget(word) : '';

  return {
    target,
    pool: target ? makeTiles(target) : [],
    built: [],
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
  const builtText = session.built.map((tile) => tile.char).join('');

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
      if (status !== 'play') {
        return;
      }

      setSession((prev) => ({
        ...prev,
        pool: prev.pool.filter((item) => item.id !== tile.id),
        built: [...prev.built, tile],
      }));
    },
    [status],
  );

  const handlePickBuilt = useCallback(
    (tile: LetterTile) => {
      if (status !== 'play') {
        return;
      }

      setSession((prev) => ({
        ...prev,
        built: prev.built.filter((item) => item.id !== tile.id),
        pool: [...prev.pool, tile],
      }));
    },
    [status],
  );

  const handleClear = useCallback(() => {
    if (status !== 'play' || !current) {
      return;
    }

    setSession((prev) => ({
      ...prev,
      ...createRound(prev.deck, prev.index),
    }));
  }, [current, status]);

  const handleCheck = useCallback(() => {
    if (!current || status !== 'play' || session.pool.length > 0) {
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
    builtText,
    current,
    goNext,
    language,
    session.pool.length,
    session.target,
    status,
  ]);

  const promptRu = useMemo(
    () => (current ? getRuText(current) : ''),
    [current],
  );

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
        <span style={LABEL_STYLE}>Русский</span>
        <p style={PROMPT_TEXT}>{promptRu}</p>
        {status === 'wrong' ? (
          <p style={{ ...HINT_STYLE, color: '#a12b3a' }}>
            Нужно: {getForeignText(current)}
          </p>
        ) : null}
        {status === 'correct' ? (
          <p style={{ ...HINT_STYLE, color: '#1f7a3f' }}>Собрала!</p>
        ) : null}
      </div>
      <div style={SLOT_ROW}>
        {session.built.length === 0 ? (
          <span style={HINT_STYLE}>Собери здесь</span>
        ) : (
          session.built.map((tile) => (
            <button
              key={tile.id}
              type="button"
              style={TILE_STYLE}
              onClick={() => handlePickBuilt(tile)}
            >
              {tile.char}
            </button>
          ))
        )}
      </div>
      <div style={POOL_ROW}>
        {session.pool.map((tile) => (
          <button
            key={tile.id}
            type="button"
            style={{
              ...TILE_STYLE,
              background: 'var(--accent)',
              color: '#ffffff',
            }}
            onClick={() => handlePickPool(tile)}
          >
            {tile.char}
          </button>
        ))}
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
            opacity: session.pool.length === 0 && status === 'play' ? 1 : 0.5,
          }}
          onClick={handleCheck}
          disabled={session.pool.length > 0 || status !== 'play'}
        >
          Готово
        </button>
      </div>
    </section>
  );
};

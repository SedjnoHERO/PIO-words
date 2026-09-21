import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { getVocabulary } from '../../data/vocabulary';
import type { AppLanguage, WordEntry } from '../../types/vocabulary';
import {
  recordSprintScore,
} from '../../utils/activityStats';
import {
  buildQuizOptions,
  getForeignText,
  getRuText,
} from '../../utils/gameHelpers';
import { shuffleArray } from '../../utils/shuffle';
import { recordCorrect, recordWrong } from '../../utils/wordStats';
import { speakText } from '../../utils/speech';
import { Header } from '../Header/Header';
import { SpeakButton } from '../SpeakButton/SpeakButton';

interface SprintScreenProps {
  language: AppLanguage;
  onBack: () => void;
  onHome: () => void;
}

type PromptSide = 'ru' | 'foreign';
type Feedback = 'none' | 'correct' | 'wrong';

const SPRINT_SECONDS = 60;

const SCREEN_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  width: '100%',
  flex: 1,
  minHeight: 0,
};

const TOP_ROW: CSSProperties = {
  display: 'flex',
  gap: '8px',
  width: '100%',
};

const STAT_PILL: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  padding: '10px 8px',
  borderRadius: '14px',
  background: 'var(--surface)',
  boxShadow: 'var(--shadow-sm)',
};

const STAT_VALUE: CSSProperties = {
  margin: 0,
  fontSize: '22px',
  fontWeight: 800,
  color: 'var(--accent)',
};

const STAT_LABEL: CSSProperties = {
  margin: 0,
  fontSize: '11px',
  fontWeight: 700,
  color: 'var(--text-muted)',
};

const PROMPT_CARD: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  minHeight: '120px',
  padding: '20px 16px',
  borderRadius: '24px',
  background: 'linear-gradient(145deg, #ffffff, #fff5f8)',
  boxShadow: 'var(--shadow-md)',
  textAlign: 'center',
  position: 'relative',
};

const PROMPT_LABEL: CSSProperties = {
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
  lineHeight: 1.3,
  wordBreak: 'break-word',
};

const OPTIONS_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '100%',
  marginTop: 'auto',
};

const RESULT_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  flex: 1,
  textAlign: 'center',
};

const RESULT_SCORE: CSSProperties = {
  margin: 0,
  fontSize: '48px',
  fontWeight: 800,
  color: 'var(--accent)',
  lineHeight: 1,
};

const RESULT_TEXT: CSSProperties = {
  margin: 0,
  fontSize: '15px',
  fontWeight: 700,
  color: 'var(--text-muted)',
};

const BTN_ROW: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '100%',
};

const PRIMARY_BTN: CSSProperties = {
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

const SECONDARY_BTN: CSSProperties = {
  ...PRIMARY_BTN,
  background: 'var(--surface)',
  color: 'var(--text)',
  boxShadow: 'var(--shadow-sm)',
};

const getOptionStyle = (
  feedback: Feedback,
  isHighlighted: boolean,
): CSSProperties => {
  const base: CSSProperties = {
    width: '100%',
    minHeight: '56px',
    padding: '14px 16px',
    borderRadius: '16px',
    border: '2px solid transparent',
    fontSize: '16px',
    fontWeight: 700,
    fontFamily: 'inherit',
    textAlign: 'center',
    cursor: feedback === 'none' ? 'pointer' : 'default',
    wordBreak: 'break-word',
    lineHeight: 1.35,
  };

  if (feedback === 'correct' && isHighlighted) {
    return {
      ...base,
      background: '#e5f8ec',
      color: '#1f7a3f',
      borderColor: '#3bb56c',
    };
  }

  if (feedback === 'wrong' && isHighlighted) {
    return {
      ...base,
      background: '#ffe5e8',
      color: '#a12b3a',
      borderColor: '#e85d6a',
    };
  }

  return {
    ...base,
    background: 'var(--surface)',
    color: 'var(--text)',
    boxShadow: 'var(--shadow-sm)',
  };
};

interface SprintRound {
  word: WordEntry;
  promptSide: PromptSide;
  options: WordEntry[];
}

const makeRound = (pool: WordEntry[]): SprintRound | null => {
  if (pool.length < 3) {
    return null;
  }

  const [word] = shuffleArray(pool);
  return {
    word,
    promptSide: Math.random() > 0.5 ? 'foreign' : 'ru',
    options: buildQuizOptions(word, pool),
  };
};

export const SprintScreen = ({
  language,
  onBack,
  onHome,
}: SprintScreenProps) => {
  const pool = useMemo(
    () => getVocabulary(language).flatMap((group) => group.words),
    [language],
  );
  const [secondsLeft, setSecondsLeft] = useState(SPRINT_SECONDS);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [feedback, setFeedback] = useState<Feedback>('none');
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [round, setRound] = useState<SprintRound | null>(() => makeRound(pool));

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    if (secondsLeft <= 0) {
      setIsRunning(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [isRunning, secondsLeft]);

  useEffect(() => {
    if (isRunning) {
      return;
    }

    setBest(recordSprintScore(language, score));
  }, [isRunning, language, score]);

  const handleRestart = useCallback(() => {
    setSecondsLeft(SPRINT_SECONDS);
    setScore(0);
    setFeedback('none');
    setChosenId(null);
    setRound(makeRound(pool));
    setIsRunning(true);
  }, [pool]);

  const handlePick = useCallback(
    (option: WordEntry) => {
      if (!round || !isRunning || feedback !== 'none') {
        return;
      }

      const isCorrect = option.id === round.word.id;
      setChosenId(option.id);
      setFeedback(isCorrect ? 'correct' : 'wrong');

      if (isCorrect) {
        recordCorrect(language, round.word.id);
        setScore((value) => value + 1);
      } else {
        recordWrong(language, round.word.id);
      }

      window.setTimeout(() => {
        setRound(makeRound(pool));
        setFeedback('none');
        setChosenId(null);
      }, isCorrect ? 280 : 450);
    },
    [feedback, isRunning, language, pool, round],
  );

  if (pool.length < 3) {
    return (
      <section style={SCREEN_STYLE}>
        <Header title="Спринт" onBack={onBack} />
        <p style={RESULT_TEXT}>Нужно хотя бы 3 слова.</p>
      </section>
    );
  }

  if (!isRunning) {
    return (
      <section style={SCREEN_STYLE}>
        <Header title="Спринт" onBack={onBack} />
        <div style={RESULT_STYLE}>
          <p style={RESULT_SCORE}>{score}</p>
          <p style={RESULT_TEXT}>верных за минуту</p>
          <p style={RESULT_TEXT}>Рекорд: {Math.max(best, score)}</p>
          <div style={BTN_ROW}>
            <button type="button" style={PRIMARY_BTN} onClick={handleRestart}>
              Ещё раз
            </button>
            <button type="button" style={SECONDARY_BTN} onClick={onHome}>
              На главную
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!round) {
    return null;
  }

  const promptText =
    round.promptSide === 'foreign'
      ? getForeignText(round.word)
      : getRuText(round.word);
  const promptLabel =
    round.promptSide === 'foreign'
      ? language === 'de'
        ? 'Deutsch'
        : 'English'
      : 'Русский';

  return (
    <section style={SCREEN_STYLE}>
      <Header title="Спринт · 60 сек" onBack={onBack} />
      <div style={TOP_ROW}>
        <div style={STAT_PILL}>
          <p style={STAT_VALUE}>{secondsLeft}</p>
          <p style={STAT_LABEL}>секунд</p>
        </div>
        <div style={STAT_PILL}>
          <p style={STAT_VALUE}>{score}</p>
          <p style={STAT_LABEL}>очки</p>
        </div>
      </div>
      <div style={PROMPT_CARD}>
        <SpeakButton
          corner="right"
          onSpeak={() => speakText(getForeignText(round.word), language)}
        />
        <span style={PROMPT_LABEL}>{promptLabel}</span>
        <span style={PROMPT_TEXT}>{promptText}</span>
      </div>
      <div style={OPTIONS_STYLE}>
        {round.options.map((option) => {
          const label =
            round.promptSide === 'foreign'
              ? getRuText(option)
              : getForeignText(option);
          const isChosen = chosenId === option.id;
          const showCorrect =
            feedback !== 'none' && option.id === round.word.id;

          return (
            <button
              key={option.id}
              type="button"
              style={getOptionStyle(
                showCorrect ? 'correct' : isChosen ? feedback : 'none',
                isChosen || showCorrect,
              )}
              onClick={() => handlePick(option)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
};

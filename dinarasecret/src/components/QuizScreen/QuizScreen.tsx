import { useCallback, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { getWords } from '../../data/vocabulary';
import type { AppLanguage, WordEntry } from '../../types/vocabulary';
import {
  buildQuizOptions,
  getForeignText,
  getRuText,
} from '../../utils/gameHelpers';
import { shuffleArray } from '../../utils/shuffle';
import { recordCorrect, recordWrong } from '../../utils/wordStats';
import { speakText } from '../../utils/speech';
import { FinishScreen } from '../FinishScreen/FinishScreen';
import { Header } from '../Header/Header';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { SpeakButton } from '../SpeakButton/SpeakButton';

interface QuizScreenProps {
  language: AppLanguage;
  topicId: string | null;
  onBack: () => void;
  onHome: () => void;
}

type PromptSide = 'ru' | 'foreign';
type Feedback = 'none' | 'correct' | 'wrong';

interface QuizSession {
  deck: WordEntry[];
  index: number;
  promptSide: PromptSide;
  options: WordEntry[];
}

const SCREEN_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
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
  minHeight: '140px',
  padding: '24px 16px',
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
  fontSize: '26px',
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

const createSession = (language: AppLanguage, topicId: string | null): QuizSession => {
  const pool = getWords(language, topicId);
  const deck = shuffleArray(pool);
  const first = deck[0];

  return {
    deck,
    index: 0,
    promptSide: first?.definition ? 'ru' : Math.random() > 0.5 ? 'foreign' : 'ru',
    options: first ? buildQuizOptions(first, pool) : [],
  };
};

export const QuizScreen = ({
  language,
  topicId,
  onBack,
  onHome,
}: QuizScreenProps) => {
  const pool = useMemo(
    () => getWords(language, topicId),
    [language, topicId],
  );
  const [session, setSession] = useState<QuizSession>(() =>
    createSession(language, topicId),
  );
  const [feedback, setFeedback] = useState<Feedback>('none');
  const [chosenId, setChosenId] = useState<string | null>(null);

  const current = session.deck[session.index] ?? null;
  const isFinished =
    session.deck.length > 0 && session.index >= session.deck.length;

  const handleRestart = useCallback(() => {
    setSession(createSession(language, topicId));
    setFeedback('none');
    setChosenId(null);
  }, [language, topicId]);

  const handlePick = useCallback(
    (option: WordEntry) => {
      if (!current || feedback !== 'none') {
        return;
      }

      const isCorrect = option.id === current.id;
      setChosenId(option.id);
      setFeedback(isCorrect ? 'correct' : 'wrong');

      if (isCorrect) {
        recordCorrect(language, current.id);
      } else {
        recordWrong(language, current.id);
      }

      window.setTimeout(() => {
        const nextIndex = session.index + 1;
        if (nextIndex >= session.deck.length) {
          setSession((prev) => ({ ...prev, index: nextIndex }));
          setFeedback('none');
          setChosenId(null);
          return;
        }

        const nextWord = session.deck[nextIndex];
        setSession((prev) => ({
          ...prev,
          index: nextIndex,
          promptSide: nextWord.definition ? 'ru' : Math.random() > 0.5 ? 'foreign' : 'ru',
          options: buildQuizOptions(nextWord, pool),
        }));
        setFeedback('none');
        setChosenId(null);
      }, isCorrect ? 650 : 900);
    },
    [current, feedback, language, pool, session.deck, session.index],
  );

  if (pool.length < 3) {
    return (
      <section style={SCREEN_STYLE}>
        <Header title="Выбор из трёх" onBack={onBack} />
        <span style={PROMPT_TEXT}>Нужно хотя бы 3 слова в словаре.</span>
      </section>
    );
  }

  if (isFinished) {
    return (
      <section style={SCREEN_STYLE}>
        <Header title="Выбор из трёх" onBack={onBack} />
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

  const promptText =
    session.promptSide === 'foreign'
      ? getForeignText(current)
      : getRuText(current);
  const promptLabel = current.definition ? 'Определение на английском' :
    session.promptSide === 'foreign'
      ? language === 'de'
        ? 'Deutsch'
        : 'English'
      : 'Русский';

  return (
    <section style={SCREEN_STYLE}>
      <Header title="Выбор из трёх" onBack={onBack} />
      <ProgressBar current={session.index + 1} total={session.deck.length} />
      <div style={PROMPT_CARD}>
        <SpeakButton
          corner="right"
          onSpeak={() => speakText(current.definition ?? getForeignText(current), language)}
        />
        <span style={PROMPT_LABEL}>{promptLabel}</span>
        <span style={PROMPT_TEXT}>{promptText}</span>
      </div>
      <div style={OPTIONS_STYLE}>
        {session.options.map((option) => {
          const label =
            session.promptSide === 'foreign'
              ? getRuText(option)
              : getForeignText(option);
          const isChosen = chosenId === option.id;
          const showCorrect =
            feedback !== 'none' && option.id === current.id;

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

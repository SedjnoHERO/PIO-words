import { useCallback, useMemo, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { getVocabulary } from '../../data/vocabulary';
import type { AppLanguage, WordEntry } from '../../types/vocabulary';
import { answersMatch } from '../../utils/answerCheck';
import {
  getForeignText,
  getRuText,
} from '../../utils/gameHelpers';
import { shuffleArray } from '../../utils/shuffle';
import { recordCorrect, recordWrong } from '../../utils/wordStats';
import { FinishScreen } from '../FinishScreen/FinishScreen';
import { Header } from '../Header/Header';
import { ProgressBar } from '../ProgressBar/ProgressBar';

interface TypeAnswerScreenProps {
  language: AppLanguage;
  onBack: () => void;
  onHome: () => void;
}

type PromptSide = 'ru' | 'foreign';
type Feedback = 'none' | 'correct' | 'wrong';

interface TypeSession {
  deck: WordEntry[];
  index: number;
  promptSide: PromptSide;
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
  fontSize: '26px',
  fontWeight: 800,
  color: 'var(--text)',
  lineHeight: 1.3,
  wordBreak: 'break-word',
};

const FORM_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '100%',
  marginTop: 'auto',
};

const INPUT_STYLE: CSSProperties = {
  width: '100%',
  minHeight: '56px',
  padding: '14px 16px',
  borderRadius: '16px',
  border: '2px solid var(--border)',
  fontSize: '18px',
  fontWeight: 700,
  fontFamily: 'inherit',
  color: 'var(--text)',
  background: 'var(--surface)',
  outline: 'none',
};

const SUBMIT_BTN: CSSProperties = {
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

const HINT_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '13px',
  fontWeight: 700,
  textAlign: 'center',
};

const getAccepted = (word: WordEntry, promptSide: PromptSide): string[] => {
  if (promptSide === 'ru') {
    return [...word.terms];
  }

  const variants = word.ruVariants?.length ? word.ruVariants : [word.ru];
  return variants;
};

const createSession = (language: AppLanguage): TypeSession => {
  const deck = shuffleArray(
    getVocabulary(language).flatMap((group) => group.words),
  );

  return {
    deck,
    index: 0,
    promptSide: Math.random() > 0.5 ? 'foreign' : 'ru',
  };
};

export const TypeAnswerScreen = ({
  language,
  onBack,
  onHome,
}: TypeAnswerScreenProps) => {
  const [session, setSession] = useState<TypeSession>(() =>
    createSession(language),
  );
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState<Feedback>('none');
  const [reveal, setReveal] = useState<string | null>(null);

  const current = session.deck[session.index] ?? null;
  const isFinished =
    session.deck.length > 0 && session.index >= session.deck.length;

  const acceptedHint = useMemo(() => {
    if (!current) {
      return '';
    }

    return getAccepted(current, session.promptSide).join(' / ');
  }, [current, session.promptSide]);

  const handleRestart = useCallback(() => {
    setSession(createSession(language));
    setValue('');
    setFeedback('none');
    setReveal(null);
  }, [language]);

  const goNext = useCallback(() => {
    const nextIndex = session.index + 1;
    setSession((prev) => ({
      ...prev,
      index: nextIndex,
      promptSide: Math.random() > 0.5 ? 'foreign' : 'ru',
    }));
    setValue('');
    setFeedback('none');
    setReveal(null);
  }, [session.index]);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      if (!current || feedback !== 'none') {
        return;
      }

      const accepted = getAccepted(current, session.promptSide);
      const isCorrect = answersMatch(value, accepted);

      if (isCorrect) {
        recordCorrect(language, current.id);
        setFeedback('correct');
        window.setTimeout(goNext, 650);
        return;
      }

      recordWrong(language, current.id);
      setFeedback('wrong');
      setReveal(acceptedHint);
      window.setTimeout(goNext, 1400);
    },
    [
      acceptedHint,
      current,
      feedback,
      goNext,
      language,
      session.promptSide,
      value,
    ],
  );

  if (session.deck.length === 0) {
    return (
      <section style={SCREEN_STYLE}>
        <Header title="Напиши перевод" onBack={onBack} />
        <p style={HINT_STYLE}>Нет слов для этого режима.</p>
      </section>
    );
  }

  if (isFinished) {
    return (
      <section style={SCREEN_STYLE}>
        <Header title="Напиши перевод" onBack={onBack} />
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
  const promptLabel =
    session.promptSide === 'foreign'
      ? language === 'de'
        ? 'Deutsch'
        : 'English'
      : 'Русский';
  const inputBorder =
    feedback === 'correct'
      ? '#3bb56c'
      : feedback === 'wrong'
        ? '#e85d6a'
        : 'var(--border)';

  return (
    <section style={SCREEN_STYLE}>
      <Header title="Напиши перевод" onBack={onBack} />
      <ProgressBar current={session.index + 1} total={session.deck.length} />
      <div style={PROMPT_CARD}>
        <span style={LABEL_STYLE}>{promptLabel}</span>
        <span style={PROMPT_TEXT}>{promptText}</span>
      </div>
      <form style={FORM_STYLE} onSubmit={handleSubmit}>
        <input
          style={{ ...INPUT_STYLE, borderColor: inputBorder }}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Введи перевод…"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          disabled={feedback !== 'none'}
        />
        {reveal ? (
          <p style={{ ...HINT_STYLE, color: '#a12b3a' }}>Верно: {reveal}</p>
        ) : null}
        {feedback === 'correct' ? (
          <p style={{ ...HINT_STYLE, color: '#1f7a3f' }}>Отлично!</p>
        ) : null}
        <button type="submit" style={SUBMIT_BTN} disabled={feedback !== 'none'}>
          Проверить
        </button>
      </form>
    </section>
  );
};

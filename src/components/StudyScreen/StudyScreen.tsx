import { useCallback } from 'react';
import type { CSSProperties } from 'react';
import { MODE_OPTIONS } from '../../data/modes';
import { useFlashcards } from '../../hooks/useFlashcards';
import { useSwipe } from '../../hooks/useSwipe';
import type { StudyMode } from '../../types/vocabulary';
import { ActionButtons } from '../ActionButtons/ActionButtons';
import { FinishScreen } from '../FinishScreen/FinishScreen';
import { CardDeck } from '../CardDeck/CardDeck';
import { Flashcard } from '../Flashcard/Flashcard';
import { Header } from '../Header/Header';
import { ProgressBar } from '../ProgressBar/ProgressBar';

interface StudyScreenProps {
  mode: StudyMode;
  topicId: string | null;
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

const CARD_AREA: CSSProperties = {
  display: 'flex',
  flex: 1,
  minHeight: '280px',
  alignItems: 'flex-start',
};

const EMPTY_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  flex: 1,
  textAlign: 'center',
  padding: '24px',
  color: 'var(--text-muted)',
  fontSize: '14px',
};

const EMPTY_BTN: CSSProperties = {
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  borderRadius: '8px',
  padding: '10px 16px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
};

const getModeTitle = (mode: StudyMode): string =>
  MODE_OPTIONS.find((item) => item.id === mode)?.title ?? 'Режим';

export const StudyScreen = ({
  mode,
  topicId,
  onBack,
  onHome,
}: StudyScreenProps) => {
  const {
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
  } = useFlashcards({ mode, topicId });

  const handleNext = useCallback(() => {
    next();
  }, [next]);

  const swipe = useSwipe({
    onSwipeLeft: () => {
      if (currentIndex < deck.length - 1) {
        handleNext();
      }
    },
    onSwipeRight: () => {
      if (currentIndex > 0) {
        prev();
      }
    },
  });

  if (deck.length === 0) {
    return (
      <section style={SCREEN_STYLE}>
        <Header title={getModeTitle(mode)} onBack={onBack} />
        <div style={EMPTY_STYLE}>
          <p>Нет карточек в этом режиме</p>
          <button type="button" style={EMPTY_BTN} onClick={onBack}>
            Назад
          </button>
        </div>
      </section>
    );
  }

  if (isFinished) {
    return (
      <section style={SCREEN_STYLE}>
        <Header title={getModeTitle(mode)} onBack={onBack} />
        <FinishScreen
          total={deck.length}
          onRestart={restart}
          onHome={onHome}
        />
      </section>
    );
  }

  if (!currentWord) {
    return null;
  }

  return (
    <section style={SCREEN_STYLE}>
      <Header title={getModeTitle(mode)} onBack={onBack} />
      <ProgressBar current={progress} total={deck.length} />
      <div style={CARD_AREA} {...swipe}>
        <CardDeck
          canPrev={currentIndex > 0}
          canNext={currentIndex < deck.length - 1}
          onPrev={prev}
          onNext={handleNext}
        >
          <Flashcard
            word={currentWord}
            mode={mode}
            isFlipped={isFlipped}
            onFlip={flip}
          />
        </CardDeck>
      </div>
      <ActionButtons
        onPrev={prev}
        onFlip={flip}
        onNext={handleNext}
        canPrev={currentIndex > 0}
        canNext={currentIndex < deck.length - 1}
        isFlipped={isFlipped}
      />
    </section>
  );
};

import type { CSSProperties } from 'react';
import { MODE_OPTIONS } from '../../data/modes';
import { useFlashcards } from '../../hooks/useFlashcards';
import { useSwipe } from '../../hooks/useSwipe';
import type { StudyMode } from '../../types/vocabulary';
import { ActionButtons } from '../ActionButtons/ActionButtons';
import { FinishScreen } from '../FinishScreen/FinishScreen';
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

  const swipe = useSwipe({
    onSwipeLeft: () => {
      if (currentIndex < deck.length - 1) {
        next();
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
          <p>В этом режиме пока нет карточек. Добавь слова в vocabulary.ts</p>
          <button type="button" onClick={onBack}>
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
        <Flashcard
          word={currentWord}
          mode={mode}
          isFlipped={isFlipped}
          onFlip={flip}
        />
      </div>
      <ActionButtons
        onPrev={prev}
        onFlip={flip}
        onNext={next}
        canPrev={currentIndex > 0}
        canNext={currentIndex < deck.length - 1}
        isFlipped={isFlipped}
      />
    </section>
  );
};

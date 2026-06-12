import { useCallback, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { MODE_OPTIONS } from '../../data/modes';
import { useFlashcards } from '../../hooks/useFlashcards';
import { useSwipe } from '../../hooks/useSwipe';
import type { StudyMode } from '../../types/vocabulary';
import { pickRandom, MID_STUDY_PRAISE } from '../../data/praiseMessages';
import { getMilestonePraise, vibratePraise } from '../../utils/praiseMilestones';
import { ActionButtons } from '../ActionButtons/ActionButtons';
import { FinishScreen } from '../FinishScreen/FinishScreen';
import { FireworksBurst } from '../FireworksBurst/FireworksBurst';
import { CardDeck } from '../CardDeck/CardDeck';
import { Flashcard } from '../Flashcard/Flashcard';
import { Header } from '../Header/Header';
import { PraiseToast } from '../PraiseToast/PraiseToast';
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

  const [praiseMessage, setPraiseMessage] = useState<string | null>(null);
  const [fireworkBurstId, setFireworkBurstId] = useState(0);
  const [showRevealShine, setShowRevealShine] = useState(false);
  const shownMilestones = useRef<Set<number>>(new Set());
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shineTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showPraise = useCallback((message: string) => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    setPraiseMessage(message);
    vibratePraise();

    toastTimer.current = setTimeout(() => {
      setPraiseMessage(null);
    }, 2400);
  }, []);

  const handleNext = useCallback(() => {
    const completedCount = currentIndex + 1;
    const praise = getMilestonePraise(completedCount, deck.length);

    if (praise && !shownMilestones.current.has(completedCount)) {
      shownMilestones.current.add(completedCount);
      showPraise(praise);
    }

    next();
  }, [currentIndex, deck.length, next, showPraise]);

  const triggerRevealCelebration = useCallback(() => {
    setFireworkBurstId((id) => id + 1);
    setShowRevealShine(true);
    showPraise(pickRandom(MID_STUDY_PRAISE));

    if (shineTimer.current) {
      clearTimeout(shineTimer.current);
    }

    shineTimer.current = setTimeout(() => {
      setShowRevealShine(false);
    }, 900);
  }, [showPraise]);

  const handleFlip = useCallback(() => {
    if (!isFlipped) {
      triggerRevealCelebration();
    }

    flip();
  }, [flip, isFlipped, triggerRevealCelebration]);

  const handleRestart = useCallback(() => {
    shownMilestones.current.clear();
    setPraiseMessage(null);
    setFireworkBurstId(0);
    setShowRevealShine(false);
    restart();
  }, [restart]);

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
          onRestart={handleRestart}
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
      <FireworksBurst burstId={fireworkBurstId} />
      <PraiseToast message={praiseMessage} />
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
            showRevealShine={showRevealShine}
            onFlip={handleFlip}
          />
        </CardDeck>
      </div>
      <ActionButtons
        onPrev={prev}
        onFlip={handleFlip}
        onNext={handleNext}
        canPrev={currentIndex > 0}
        canNext={currentIndex < deck.length - 1}
        isFlipped={isFlipped}
      />
    </section>
  );
};

import { useCallback, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { getModeTitle } from '../../data/modes';
import { getVocabulary } from '../../data/vocabulary';
import { pickRandom, MID_STUDY_PRAISE } from '../../data/praiseMessages';
import { useFlashcards } from '../../hooks/useFlashcards';
import { useSwipe } from '../../hooks/useSwipe';
import type { AppLanguage, StudyMode } from '../../types/vocabulary';
import { isFavorite, toggleFavorite } from '../../utils/favorites';
import { getMilestonePraise, vibratePraise } from '../../utils/praiseMilestones';
import { ActionButtons } from '../ActionButtons/ActionButtons';
import { CardDeck } from '../CardDeck/CardDeck';
import { FinishScreen } from '../FinishScreen/FinishScreen';
import { FireworksBurst } from '../FireworksBurst/FireworksBurst';
import { Flashcard } from '../Flashcard/Flashcard';
import { Header } from '../Header/Header';
import { PraiseToast } from '../PraiseToast/PraiseToast';
import { ProgressBar } from '../ProgressBar/ProgressBar';

interface StudyScreenProps {
  language: AppLanguage;
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

const getEmptyMessage = (mode: StudyMode): string => {
  if (mode === 'weak-words') {
    return 'Пока нет слабых слов. Ошибки из игр появятся здесь.';
  }

  if (mode === 'favorites') {
    return 'Пока пусто. На карточке нажмите ★ — запись попадёт сюда.';
  }

  if (mode === 'single-topic') {
    return 'Выберите тему, чтобы начать.';
  }

  if (mode === 'words-only') {
    return 'В словаре пока нет отдельных слов.';
  }

  if (mode === 'phrases-only') {
    return 'В словаре пока нет фраз.';
  }

  return 'В этом режиме пока нет карточек.';
};

const getStudySubtitle = (
  language: AppLanguage,
  mode: StudyMode,
  topicId: string | null,
): string | undefined => {
  if (mode !== 'single-topic' || !topicId) {
    return undefined;
  }

  return getVocabulary(language).find((topic) => topic.id === topicId)?.title;
};

export const StudyScreen = ({
  language,
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
    canDefer,
    flip,
    next,
    prev,
    defer,
    restart,
  } = useFlashcards({ language, mode, topicId });

  const [praiseMessage, setPraiseMessage] = useState<string | null>(null);
  const [fireworkBurstId, setFireworkBurstId] = useState(0);
  const [showRevealShine, setShowRevealShine] = useState(false);
  const [favoriteTick, setFavoriteTick] = useState(0);
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

  const handleToggleFavorite = useCallback(() => {
    if (!currentWord) {
      return;
    }

    const nowFavorite = toggleFavorite(language, currentWord.id);
    setFavoriteTick((value) => value + 1);
    showPraise(nowFavorite ? 'В избранном' : 'Убрали из избранного');
  }, [currentWord, language, showPraise]);

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

  const wordIsFavorite = Boolean(
    currentWord && isFavorite(language, currentWord.id) && favoriteTick >= 0,
  );

  if (deck.length === 0) {
    return (
      <section style={SCREEN_STYLE}>
        <Header title={getModeTitle(language, mode)} onBack={onBack} />
        <div style={EMPTY_STYLE}>
          <p>{getEmptyMessage(mode)}</p>
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
        <Header title={getModeTitle(language, mode)} onBack={onBack} />
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
      <Header
        title={getModeTitle(language, mode)}
        subtitle={getStudySubtitle(language, mode, topicId)}
        onBack={onBack}
      />
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
            language={language}
            mode={mode}
            isFlipped={isFlipped}
            showRevealShine={showRevealShine}
            isFavorite={wordIsFavorite}
            onFlip={handleFlip}
            onToggleFavorite={handleToggleFavorite}
          />
        </CardDeck>
      </div>
      <ActionButtons
        onPrev={prev}
        onFlip={handleFlip}
        onNext={handleNext}
        onDefer={defer}
        canPrev={currentIndex > 0}
        canNext={currentIndex < deck.length - 1}
        canDefer={canDefer}
        isFlipped={isFlipped}
      />
    </section>
  );
};

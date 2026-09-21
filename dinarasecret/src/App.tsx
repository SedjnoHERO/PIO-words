import { useCallback, useState } from 'react';
import { HomeScreen } from './components/HomeScreen/HomeScreen';
import { LanguageSelectScreen } from './components/LanguageSelectScreen/LanguageSelectScreen';
import { MatchScreen } from './components/MatchScreen/MatchScreen';
import { MemoryScreen } from './components/MemoryScreen/MemoryScreen';
import { ModeSelectScreen } from './components/ModeSelectScreen/ModeSelectScreen';
import { QuizScreen } from './components/QuizScreen/QuizScreen';
import { ScrambleScreen } from './components/ScrambleScreen/ScrambleScreen';
import { StudyScreen } from './components/StudyScreen/StudyScreen';
import { TopicSelectScreen } from './components/TopicSelectScreen/TopicSelectScreen';
import { TypeAnswerScreen } from './components/TypeAnswerScreen/TypeAnswerScreen';
import type {
  AppLanguage,
  ModeCategoryId,
  StudyMode,
} from './types/vocabulary';

type AppScreen =
  | 'language'
  | 'home'
  | 'mode-select'
  | 'topic-select'
  | 'study';

const APP_STYLE = {
  display: 'flex',
  flexDirection: 'column' as const,
  minHeight: '100dvh',
  width: '100%',
  maxWidth: '480px',
  margin: '0 auto',
  padding:
    'max(16px, env(safe-area-inset-top)) 16px max(20px, env(safe-area-inset-bottom))',
};

const GAME_MODES: StudyMode[] = [
  'match-pairs',
  'choose-one',
  'type-answer',
  'scramble-word',
  'memory',
];

const isGameMode = (mode: StudyMode): boolean => GAME_MODES.includes(mode);

export const App = () => {
  const [screen, setScreen] = useState<AppScreen>('language');
  const [language, setLanguage] = useState<AppLanguage>('de');
  const [categoryId, setCategoryId] = useState<ModeCategoryId>('cards');
  const [mode, setMode] = useState<StudyMode>('ru-to-foreign');
  const [topicId, setTopicId] = useState<string | null>(null);

  const handleSelectLanguage = useCallback((selected: AppLanguage) => {
    setLanguage(selected);
    setTopicId(null);
    setScreen('home');
  }, []);

  const handleSelectCategory = useCallback((selected: ModeCategoryId) => {
    setCategoryId(selected);
    setScreen('mode-select');
  }, []);

  const handleSelectMode = useCallback((selectedMode: StudyMode) => {
    setMode(selectedMode);

    if (selectedMode === 'single-topic') {
      setScreen('topic-select');
      return;
    }

    setTopicId(null);
    setScreen('study');
  }, []);

  const handleStartTopic = useCallback(() => {
    setScreen('study');
  }, []);

  const handleBackToLanguage = useCallback(() => {
    setScreen('language');
    setTopicId(null);
  }, []);

  const handleBackToHome = useCallback(() => {
    setScreen('home');
    setTopicId(null);
  }, []);

  const handleBackFromTopic = useCallback(() => {
    setScreen('mode-select');
    setTopicId(null);
  }, []);

  const handleBackFromStudy = useCallback(() => {
    if (mode === 'single-topic') {
      setScreen('topic-select');
      return;
    }

    setScreen('mode-select');
  }, [mode]);

  return (
    <main style={APP_STYLE}>
      {screen === 'language' ? (
        <LanguageSelectScreen onSelectLanguage={handleSelectLanguage} />
      ) : null}

      {screen === 'home' ? (
        <HomeScreen
          language={language}
          onSelectCategory={handleSelectCategory}
          onBack={handleBackToLanguage}
        />
      ) : null}

      {screen === 'mode-select' ? (
        <ModeSelectScreen
          language={language}
          categoryId={categoryId}
          onSelectMode={handleSelectMode}
          onBack={handleBackToHome}
        />
      ) : null}

      {screen === 'topic-select' ? (
        <TopicSelectScreen
          language={language}
          selectedTopicId={topicId}
          onSelectTopic={setTopicId}
          onBack={handleBackFromTopic}
          onStart={handleStartTopic}
        />
      ) : null}

      {screen === 'study' && mode === 'match-pairs' ? (
        <MatchScreen
          language={language}
          onBack={handleBackFromStudy}
          onHome={handleBackToHome}
        />
      ) : null}

      {screen === 'study' && mode === 'choose-one' ? (
        <QuizScreen
          language={language}
          onBack={handleBackFromStudy}
          onHome={handleBackToHome}
        />
      ) : null}

      {screen === 'study' && mode === 'type-answer' ? (
        <TypeAnswerScreen
          language={language}
          onBack={handleBackFromStudy}
          onHome={handleBackToHome}
        />
      ) : null}

      {screen === 'study' && mode === 'scramble-word' ? (
        <ScrambleScreen
          language={language}
          onBack={handleBackFromStudy}
          onHome={handleBackToHome}
        />
      ) : null}

      {screen === 'study' && mode === 'memory' ? (
        <MemoryScreen
          language={language}
          onBack={handleBackFromStudy}
          onHome={handleBackToHome}
        />
      ) : null}

      {screen === 'study' && !isGameMode(mode) ? (
        <StudyScreen
          language={language}
          mode={mode}
          topicId={topicId}
          onBack={handleBackFromStudy}
          onHome={handleBackToHome}
        />
      ) : null}
    </main>
  );
};

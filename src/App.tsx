import { useCallback, useState } from 'react';
import { HomeScreen } from './components/HomeScreen/HomeScreen';
import { StudyScreen } from './components/StudyScreen/StudyScreen';
import { TopicSelectScreen } from './components/TopicSelectScreen/TopicSelectScreen';
import type { StudyMode } from './types/vocabulary';

type AppScreen = 'home' | 'topic-select' | 'study';

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

export const App = () => {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [mode, setMode] = useState<StudyMode>('ru-to-de');
  const [topicId, setTopicId] = useState<string | null>(null);

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

  const handleBackToHome = useCallback(() => {
    setScreen('home');
    setTopicId(null);
  }, []);

  const handleBackFromTopic = useCallback(() => {
    setScreen('home');
    setTopicId(null);
  }, []);

  const handleBackFromStudy = useCallback(() => {
    if (mode === 'single-topic') {
      setScreen('topic-select');
      return;
    }

    setScreen('home');
  }, [mode]);

  return (
    <main style={APP_STYLE}>
      {screen === 'home' ? (
        <HomeScreen onSelectMode={handleSelectMode} />
      ) : null}

      {screen === 'topic-select' ? (
        <TopicSelectScreen
          selectedTopicId={topicId}
          onSelectTopic={setTopicId}
          onBack={handleBackFromTopic}
          onStart={handleStartTopic}
        />
      ) : null}

      {screen === 'study' ? (
        <StudyScreen
          mode={mode}
          topicId={topicId}
          onBack={handleBackFromStudy}
          onHome={handleBackToHome}
        />
      ) : null}
    </main>
  );
};

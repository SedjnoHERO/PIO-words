import type { CSSProperties } from 'react';
import { getVocabulary } from '../../data/vocabulary';
import type { AppLanguage } from '../../types/vocabulary';
import { Header } from '../Header/Header';
import { TopicList } from '../TopicList/TopicList';

interface TopicSelectScreenProps {
  language: AppLanguage;
  selectedTopicId: string | null;
  onSelectTopic: (topicId: string | null) => void;
  onBack: () => void;
  onStart: () => void;
}

const SCREEN_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  width: '100%',
  flex: 1,
};

const START_BTN: CSSProperties = {
  width: '100%',
  height: '52px',
  marginTop: 'auto',
  border: 'none',
  borderRadius: '16px',
  background: 'var(--accent)',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 800,
  cursor: 'pointer',
  fontFamily: 'inherit',
  boxShadow: 'var(--shadow-md)',
  opacity: 1,
};

export const TopicSelectScreen = ({
  language,
  selectedTopicId,
  onSelectTopic,
  onBack,
  onStart,
}: TopicSelectScreenProps) => (
  <section style={SCREEN_STYLE}>
    <Header
      title="Выбери тему"
      subtitle="Все темы или одна — для карточек и игр"
      onBack={onBack}
    />
    <TopicList
      topics={getVocabulary(language)}
      selectedTopicId={selectedTopicId}
      onSelect={onSelectTopic}
    />
    <button
      type="button"
      style={START_BTN}
      onClick={onStart}
    >
      Далее
    </button>
  </section>
);

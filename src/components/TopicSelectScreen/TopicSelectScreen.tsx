import type { CSSProperties } from 'react';
import { VOCABULARY } from '../../data/vocabulary';
import { Header } from '../Header/Header';
import { TopicList } from '../TopicList/TopicList';

interface TopicSelectScreenProps {
  selectedTopicId: string | null;
  onSelectTopic: (topicId: string) => void;
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

const getStartBtnStyle = (disabled: boolean): CSSProperties => ({
  ...START_BTN,
  opacity: disabled ? 0.45 : 1,
  pointerEvents: disabled ? 'none' : 'auto',
});

export const TopicSelectScreen = ({
  selectedTopicId,
  onSelectTopic,
  onBack,
  onStart,
}: TopicSelectScreenProps) => (
  <section style={SCREEN_STYLE}>
    <Header
      title="Выбери блок"
      subtitle="Учи слова только из одного блока"
      onBack={onBack}
    />
    <TopicList
      topics={VOCABULARY}
      selectedTopicId={selectedTopicId}
      onSelect={onSelectTopic}
    />
    <button
      type="button"
      style={getStartBtnStyle(!selectedTopicId)}
      onClick={onStart}
      disabled={!selectedTopicId}
    >
      Начать
    </button>
  </section>
);

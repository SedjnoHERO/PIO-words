import type { CSSProperties } from 'react';
import type { TopicGroup } from '../../types/vocabulary';

interface TopicListProps {
  topics: TopicGroup[];
  selectedTopicId: string | null;
  onSelect: (topicId: string) => void;
}

const LIST_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '100%',
};

const getTopicButtonStyle = (isSelected: boolean): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '14px 16px',
  border: isSelected ? '2px solid var(--accent)' : '2px solid transparent',
  borderRadius: '14px',
  background: isSelected ? 'var(--accent-soft)' : 'var(--surface)',
  boxShadow: 'var(--shadow-sm)',
  cursor: 'pointer',
  textAlign: 'left',
});

const TITLE_STYLE: CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  color: 'var(--text)',
};

const COUNT_STYLE: CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  color: 'var(--accent)',
  background: 'var(--surface)',
  padding: '4px 10px',
  borderRadius: '20px',
};

export const TopicList = ({
  topics,
  selectedTopicId,
  onSelect,
}: TopicListProps) => (
  <div style={LIST_STYLE} role="listbox" aria-label="Выбор темы">
    {topics.map((topic) => {
      const isSelected = topic.id === selectedTopicId;

      return (
        <button
          key={topic.id}
          type="button"
          role="option"
          aria-selected={isSelected}
          style={getTopicButtonStyle(isSelected)}
          onClick={() => onSelect(topic.id)}
        >
          <span style={TITLE_STYLE}>{topic.title}</span>
          <span style={COUNT_STYLE}>{topic.words.length}</span>
        </button>
      );
    })}
  </div>
);

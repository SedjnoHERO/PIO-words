import type { CSSProperties } from 'react';
import { MODE_OPTIONS } from '../../data/modes';
import { TOTAL_WORDS, VOCABULARY } from '../../data/vocabulary';
import type { StudyMode } from '../../types/vocabulary';
import { Header } from '../Header/Header';
import { ModeCard } from '../ModeCard/ModeCard';

interface HomeScreenProps {
  onSelectMode: (mode: StudyMode) => void;
}

const SCREEN_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  width: '100%',
};

const MODES_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
};

export const HomeScreen = ({ onSelectMode }: HomeScreenProps) => (
  <section style={SCREEN_STYLE}>
    <Header
      title="Карточки"
      subtitle={`${TOTAL_WORDS} слов · ${VOCABULARY.length} блоков`}
    />
    <div style={MODES_STYLE}>
      {MODE_OPTIONS.map((mode) => (
        <ModeCard key={mode.id} mode={mode} onSelect={onSelectMode} />
      ))}
    </div>
  </section>
);

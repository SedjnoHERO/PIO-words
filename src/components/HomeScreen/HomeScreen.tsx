import type { CSSProperties } from 'react';
import { MODE_OPTIONS } from '../../data/modes';
import { TOTAL_WORDS } from '../../data/vocabulary';
import type { StudyMode } from '../../types/vocabulary';
import { Header } from '../Header/Header';
import { ModeCard } from '../ModeCard/ModeCard';

interface HomeScreenProps {
  onSelectMode: (mode: StudyMode) => void;
}

const SCREEN_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  width: '100%',
};

const HERO_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 8px 4px',
  textAlign: 'center',
};

const HERO_EMOJI: CSSProperties = {
  fontSize: '48px',
  lineHeight: 1,
};

const HERO_TEXT: CSSProperties = {
  margin: 0,
  fontSize: '15px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  lineHeight: 1.5,
};

const MODES_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '100%',
};

export const HomeScreen = ({ onSelectMode }: HomeScreenProps) => (
  <section style={SCREEN_STYLE}>
    <Header title="Карточки" subtitle={`${TOTAL_WORDS} слов для подготовки`} />
    <div style={HERO_STYLE}>
      <span style={HERO_EMOJI} aria-hidden="true">
        ✨
      </span>
      <p style={HERO_TEXT}>
        Выбери режим и учи слова в удобном темпе. Ты умница — у тебя всё получится! 💕
      </p>
    </div>
    <div style={MODES_STYLE}>
      {MODE_OPTIONS.map((mode) => (
        <ModeCard key={mode.id} mode={mode} onSelect={onSelectMode} />
      ))}
    </div>
  </section>
);

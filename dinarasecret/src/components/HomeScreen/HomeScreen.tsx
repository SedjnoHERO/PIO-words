import type { CSSProperties } from 'react';
import { getModeOptions } from '../../data/modes';
import { getTotalWords } from '../../data/vocabulary';
import type { AppLanguage, StudyMode } from '../../types/vocabulary';
import { Header } from '../Header/Header';
import { ModeCard } from '../ModeCard/ModeCard';

interface HomeScreenProps {
  language: AppLanguage;
  onSelectMode: (mode: StudyMode) => void;
  onBack: () => void;
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

const LANGUAGE_TITLE: Record<AppLanguage, string> = {
  de: 'Немецкий квиз',
  en: 'Английский квиз',
};

const LANGUAGE_SUBTITLE: Record<AppLanguage, string> = {
  de: 'Германия · география и население',
  en: 'Crime and Justice · коллоквиум',
};

export const HomeScreen = ({
  language,
  onSelectMode,
  onBack,
}: HomeScreenProps) => {
  const modes = getModeOptions(language);
  const total = getTotalWords(language);

  return (
    <section style={SCREEN_STYLE}>
      <Header
        title={LANGUAGE_TITLE[language]}
        subtitle={`${total} слов · ${LANGUAGE_SUBTITLE[language]}`}
        onBack={onBack}
      />
      <div style={HERO_STYLE}>
        <span style={HERO_EMOJI} aria-hidden="true">
          ✨
        </span>
        <p style={HERO_TEXT}>
          Выбери режим и учи слова в удобном темпе. Ты умница — у тебя всё
          получится! 💕
        </p>
      </div>
      <div style={MODES_STYLE}>
        {modes.map((mode) => (
          <ModeCard key={mode.id} mode={mode} onSelect={onSelectMode} />
        ))}
      </div>
    </section>
  );
};

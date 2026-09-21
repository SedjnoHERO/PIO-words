import type { CSSProperties } from 'react';
import { LANGUAGE_OPTIONS, getTotalWords } from '../../data/vocabulary';
import type { AppLanguage } from '../../types/vocabulary';
import { Header } from '../Header/Header';

interface LanguageSelectScreenProps {
  onSelectLanguage: (language: AppLanguage) => void;
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

const LIST_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '100%',
};

const CARD_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '14px',
  width: '100%',
  padding: '16px',
  border: '2px solid transparent',
  borderRadius: '18px',
  background: 'var(--surface)',
  boxShadow: 'var(--shadow-sm)',
  cursor: 'pointer',
  textAlign: 'left',
};

const ICON_STYLE: CSSProperties = {
  fontSize: '28px',
  lineHeight: 1,
  flexShrink: 0,
};

const TEXT_WRAP_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
  minWidth: 0,
};

const TITLE_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '17px',
  fontWeight: 800,
  color: 'var(--text)',
};

const DESC_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '13px',
  color: 'var(--text-muted)',
  fontWeight: 600,
  lineHeight: 1.4,
};

const COUNT_STYLE: CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  color: 'var(--accent)',
  background: 'var(--accent-soft)',
  padding: '4px 10px',
  borderRadius: '20px',
  flexShrink: 0,
};

export const LanguageSelectScreen = ({
  onSelectLanguage,
}: LanguageSelectScreenProps) => (
  <section style={SCREEN_STYLE}>
    <Header title="Карточки для Динары" subtitle="Сначала выбери язык" />
    <div style={HERO_STYLE}>
      <span style={HERO_EMOJI} aria-hidden="true">
        ✨
      </span>
      <p style={HERO_TEXT}>
        Немецкий или английский — а дальше режимы, как всегда. Ты умница! 💕
      </p>
    </div>
    <div style={LIST_STYLE}>
      {LANGUAGE_OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          style={CARD_STYLE}
          onClick={() => onSelectLanguage(option.id)}
        >
          <span style={ICON_STYLE} aria-hidden="true">
            {option.icon}
          </span>
          <span style={TEXT_WRAP_STYLE}>
            <span style={TITLE_STYLE}>{option.title}</span>
            <span style={DESC_STYLE}>{option.description}</span>
          </span>
          <span style={COUNT_STYLE}>{getTotalWords(option.id)}</span>
        </button>
      ))}
    </div>
  </section>
);

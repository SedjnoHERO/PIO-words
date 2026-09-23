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

const BRAND_STYLE: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-display)',
  fontSize: '34px',
  fontWeight: 700,
  color: 'var(--text)',
  lineHeight: 1.1,
};

const HERO_TEXT: CSSProperties = {
  margin: 0,
  fontSize: '15px',
  fontWeight: 500,
  color: 'var(--text-muted)',
  lineHeight: 1.5,
  maxWidth: '320px',
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
  border: '1px solid var(--border)',
  borderRadius: '16px',
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
  fontWeight: 700,
  color: 'var(--text)',
};

const DESC_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '13px',
  color: 'var(--text-muted)',
  fontWeight: 500,
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
    <Header title="Язык поездки" subtitle="Английский или французский" />
    <div style={HERO_STYLE}>
      <p style={BRAND_STYLE}>English For Travelling</p>
      <p style={HERO_TEXT}>
        Тихий разговорник: ресепшен, магазины, как пройти, лайнер и всё нужное
        в дороге.
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

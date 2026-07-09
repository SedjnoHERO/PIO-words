import type { CSSProperties } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

const HEADER_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const TITLE_ROW_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const BACK_BUTTON_STYLE: CSSProperties = {
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--text)',
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  fontSize: '18px',
  cursor: 'pointer',
  flexShrink: 0,
};

const TITLE_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '22px',
  fontWeight: 600,
  color: 'var(--text)',
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
};

const SUBTITLE_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '13px',
  color: 'var(--text-muted)',
  fontWeight: 500,
};

export const Header = ({ title, subtitle, onBack }: HeaderProps) => (
  <header style={HEADER_STYLE}>
    <div style={TITLE_ROW_STYLE}>
      {onBack ? (
        <button type="button" style={BACK_BUTTON_STYLE} onClick={onBack} aria-label="Назад">
          ←
        </button>
      ) : null}
      <h1 style={TITLE_STYLE}>{title}</h1>
    </div>
    {subtitle ? <p style={SUBTITLE_STYLE}>{subtitle}</p> : null}
  </header>
);

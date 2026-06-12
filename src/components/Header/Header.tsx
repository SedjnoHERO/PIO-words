import type { CSSProperties } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

const HEADER_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  padding: '0 4px',
};

const TITLE_ROW_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const BACK_BUTTON_STYLE: CSSProperties = {
  border: 'none',
  background: 'var(--surface)',
  color: 'var(--accent)',
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  fontSize: '20px',
  cursor: 'pointer',
  flexShrink: 0,
  boxShadow: 'var(--shadow-sm)',
};

const TITLE_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '24px',
  fontWeight: 800,
  color: 'var(--text)',
  lineHeight: 1.2,
};

const SUBTITLE_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '14px',
  color: 'var(--text-muted)',
  fontWeight: 600,
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

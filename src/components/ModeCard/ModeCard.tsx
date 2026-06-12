import type { CSSProperties } from 'react';
import type { ModeOption } from '../../types/vocabulary';

interface ModeCardProps {
  mode: ModeOption;
  onSelect: (modeId: ModeOption['id']) => void;
}

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
  transition: 'transform 0.15s ease, border-color 0.15s ease',
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

export const ModeCard = ({ mode, onSelect }: ModeCardProps) => (
  <button
    type="button"
    style={CARD_STYLE}
    onClick={() => onSelect(mode.id)}
  >
    <span style={ICON_STYLE} aria-hidden="true">
      {mode.icon}
    </span>
    <span style={TEXT_WRAP_STYLE}>
      <span style={TITLE_STYLE}>{mode.title}</span>
      <span style={DESC_STYLE}>{mode.description}</span>
    </span>
  </button>
);

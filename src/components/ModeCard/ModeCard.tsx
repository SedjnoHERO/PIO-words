import type { CSSProperties } from 'react';
import type { ModeOption } from '../../types/vocabulary';

interface ModeCardProps {
  mode: ModeOption;
  onSelect: (modeId: ModeOption['id']) => void;
}

const CARD_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  width: '100%',
  padding: '14px 16px',
  border: '1px solid var(--border)',
  borderRadius: '10px',
  background: 'var(--surface)',
  cursor: 'pointer',
  textAlign: 'left',
};

const TITLE_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '15px',
  fontWeight: 600,
  color: 'var(--text)',
};

const DESC_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '13px',
  color: 'var(--text-muted)',
  fontWeight: 400,
  lineHeight: 1.4,
};

export const ModeCard = ({ mode, onSelect }: ModeCardProps) => (
  <button type="button" style={CARD_STYLE} onClick={() => onSelect(mode.id)}>
    <span style={TITLE_STYLE}>{mode.title}</span>
    <span style={DESC_STYLE}>{mode.description}</span>
  </button>
);

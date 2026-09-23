import type { CSSProperties } from 'react';

interface MemoryTileProps {
  label: string;
  side: 'ru' | 'foreign';
  isOpen: boolean;
  isMatched: boolean;
  onClick: () => void;
}

const TILE_STYLE: CSSProperties = {
  flex: '1 1 calc(33.33% - 8px)',
  maxWidth: 'calc(33.33% - 6px)',
  minHeight: '78px',
  padding: '10px 8px',
  borderRadius: '16px',
  border: '2px solid transparent',
  fontSize: '13px',
  fontWeight: 800,
  fontFamily: 'inherit',
  lineHeight: 1.25,
  wordBreak: 'break-word',
  cursor: 'pointer',
  textAlign: 'center',
};

const getStyle = (
  isOpen: boolean,
  isMatched: boolean,
  side: 'ru' | 'foreign',
): CSSProperties => {
  if (isMatched) {
    return {
      ...TILE_STYLE,
      background: '#e5f8ec',
      borderColor: '#3bb56c',
      color: '#1f7a3f',
      cursor: 'default',
    };
  }

  if (isOpen) {
    return {
      ...TILE_STYLE,
      background: side === 'ru' ? '#fff7fb' : '#f3f8ff',
      borderColor: 'var(--accent)',
      color: 'var(--text)',
      boxShadow: 'var(--shadow-sm)',
    };
  }

  return {
    ...TILE_STYLE,
    background: 'linear-gradient(145deg, var(--accent), var(--accent-light))',
    color: '#ffffff',
    boxShadow: 'var(--shadow-md)',
  };
};

export const MemoryTile = ({
  label,
  side,
  isOpen,
  isMatched,
  onClick,
}: MemoryTileProps) => (
  <button
    type="button"
    style={getStyle(isOpen, isMatched, side)}
    onClick={onClick}
    disabled={isMatched}
  >
    {isOpen || isMatched ? label : '✦'}
  </button>
);

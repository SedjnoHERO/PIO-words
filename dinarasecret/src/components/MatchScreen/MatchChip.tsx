import type { CSSProperties } from 'react';

export type MatchChipState = 'idle' | 'selected' | 'matched' | 'wrong';

export const getMatchChipStyle = (state: MatchChipState): CSSProperties => {
  const base: CSSProperties = {
    width: '100%',
    minHeight: '52px',
    padding: '10px 12px',
    borderRadius: '14px',
    border: '2px solid transparent',
    fontSize: '14px',
    fontWeight: 700,
    fontFamily: 'inherit',
    textAlign: 'center',
    cursor: state === 'matched' ? 'default' : 'pointer',
    lineHeight: 1.3,
    wordBreak: 'break-word',
  };

  if (state === 'matched') {
    return {
      ...base,
      background: '#e5f8ec',
      color: '#1f7a3f',
      opacity: 0.85,
    };
  }

  if (state === 'selected') {
    return {
      ...base,
      background: 'var(--accent-soft)',
      borderColor: 'var(--accent)',
      color: 'var(--text)',
    };
  }

  if (state === 'wrong') {
    return {
      ...base,
      background: '#ffe5e8',
      borderColor: '#e85d6a',
      color: 'var(--text)',
    };
  }

  return {
    ...base,
    background: 'var(--surface)',
    boxShadow: 'var(--shadow-sm)',
    color: 'var(--text)',
  };
};

interface MatchChipProps {
  label: string;
  state: MatchChipState;
  onClick: () => void;
}

export const MatchChip = ({ label, state, onClick }: MatchChipProps) => (
  <button
    type="button"
    style={getMatchChipStyle(state)}
    onClick={onClick}
    disabled={state === 'matched'}
  >
    {label}
  </button>
);

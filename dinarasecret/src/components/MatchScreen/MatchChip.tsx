import type { CSSProperties } from 'react';

export type MatchChipState =
  | 'idle'
  | 'selected'
  | 'waiting'
  | 'pop'
  | 'wrong';

interface MatchChipProps {
  label: string;
  state: MatchChipState;
  tone: 'ru' | 'foreign';
  onClick: () => void;
}

const getChipStyle = (
  state: MatchChipState,
  tone: 'ru' | 'foreign',
): CSSProperties => {
  const base: CSSProperties = {
    width: '100%',
    minHeight: '64px',
    padding: '12px 10px',
    borderRadius: '18px',
    border: '2px solid transparent',
    fontSize: '14px',
    fontWeight: 800,
    fontFamily: 'inherit',
    textAlign: 'center',
    cursor: state === 'pop' ? 'default' : 'pointer',
    lineHeight: 1.3,
    wordBreak: 'break-word',
    transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
  };

  if (state === 'pop') {
    return {
      ...base,
      background: '#e5f8ec',
      borderColor: '#3bb56c',
      color: '#1f7a3f',
    };
  }

  if (state === 'selected') {
    return {
      ...base,
      background: 'var(--accent)',
      borderColor: 'var(--accent)',
      color: '#ffffff',
      boxShadow: 'var(--shadow-md)',
      transform: 'scale(1.03)',
    };
  }

  if (state === 'wrong') {
    return {
      ...base,
      background: '#ffe5e8',
      borderColor: '#e85d6a',
      color: '#a12b3a',
    };
  }

  if (state === 'waiting') {
    return {
      ...base,
      background: tone === 'ru' ? '#fff7fb' : '#f7fbff',
      borderColor: 'var(--accent-light)',
      color: 'var(--text)',
    };
  }

  return {
    ...base,
    background: 'var(--surface)',
    boxShadow: 'var(--shadow-sm)',
    color: 'var(--text)',
    borderColor: 'var(--border)',
  };
};

const getAnimClass = (state: MatchChipState): string => {
  if (state === 'pop') {
    return 'match-chip-pop';
  }

  if (state === 'wrong') {
    return 'match-chip-shake';
  }

  if (state === 'waiting') {
    return 'match-chip-waiting';
  }

  return '';
};

export const MatchChip = ({
  label,
  state,
  tone,
  onClick,
}: MatchChipProps) => (
  <button
    type="button"
    className={getAnimClass(state)}
    style={getChipStyle(state, tone)}
    onClick={onClick}
    disabled={state === 'pop'}
  >
    {label}
  </button>
);

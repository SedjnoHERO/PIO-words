import type { CSSProperties } from 'react';

export type MatchChipState =
  | 'idle'
  | 'selected'
  | 'waiting'
  | 'pop'
  | 'wrong'
  | 'gone';

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
    height: '64px',
    padding: '8px 10px',
    borderRadius: '18px',
    border: '2px solid transparent',
    fontSize: '14px',
    fontWeight: 800,
    fontFamily: 'inherit',
    textAlign: 'center',
    cursor: state === 'pop' || state === 'gone' ? 'default' : 'pointer',
    lineHeight: 1.25,
    wordBreak: 'break-word',
    overflow: 'hidden',
    transition:
      'background 0.15s ease, border-color 0.15s ease, color 0.15s ease, opacity 0.2s ease',
  };

  if (state === 'gone') {
    return {
      ...base,
      opacity: 0,
      pointerEvents: 'none',
      background: 'transparent',
      borderColor: 'transparent',
      boxShadow: 'none',
    };
  }

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
      background: tone === 'ru' ? '#fff7fb' : '#f3f8ff',
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
    return 'match-chip-fade';
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
    disabled={state === 'pop' || state === 'gone'}
    aria-hidden={state === 'gone'}
  >
    {state === 'gone' ? '' : label}
  </button>
);

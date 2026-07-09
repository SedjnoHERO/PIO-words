import type { CSSProperties } from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const WRAP_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  width: '100%',
};

const LABEL_STYLE: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '12px',
  fontWeight: 500,
  color: 'var(--text-muted)',
};

const TRACK_STYLE: CSSProperties = {
  width: '100%',
  height: '3px',
  borderRadius: '2px',
  background: 'var(--border)',
  overflow: 'hidden',
};

const getFillStyle = (percent: number): CSSProperties => ({
  width: `${percent}%`,
  height: '100%',
  background: 'var(--text)',
  transition: 'width 0.2s ease',
});

export const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const percent = total === 0 ? 0 : Math.round((current / total) * 100);

  return (
    <div style={WRAP_STYLE} aria-label={`${current} из ${total}`}>
      <div style={LABEL_STYLE}>
        <span>{Math.min(current, total)}</span>
        <span>{total}</span>
      </div>
      <div style={TRACK_STYLE}>
        <div style={getFillStyle(percent)} />
      </div>
    </div>
  );
};

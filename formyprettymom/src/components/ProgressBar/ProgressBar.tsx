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
  fontSize: '13px',
  fontWeight: 700,
  color: 'var(--text-muted)',
};

const TRACK_STYLE: CSSProperties = {
  width: '100%',
  height: '8px',
  borderRadius: '8px',
  background: 'var(--border)',
  overflow: 'hidden',
};

const getFillStyle = (percent: number): CSSProperties => ({
  width: `${percent}%`,
  height: '100%',
  borderRadius: '8px',
  background: 'linear-gradient(90deg, var(--accent), var(--accent-light))',
  transition: 'width 0.25s ease',
});

export const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const percent = total === 0 ? 0 : Math.round((current / total) * 100);

  return (
    <div style={WRAP_STYLE} aria-label={`Прогресс ${current} из ${total}`}>
      <div style={LABEL_STYLE}>
        <span>Карточка {Math.min(current, total)}</span>
        <span>из {total}</span>
      </div>
      <div style={TRACK_STYLE}>
        <div style={getFillStyle(percent)} />
      </div>
    </div>
  );
};

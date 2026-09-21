import type { CSSProperties } from 'react';

interface HomeStatsBarProps {
  todayCount: number;
  streak: number;
  weakCount: number;
}

const ROW_STYLE: CSSProperties = {
  display: 'flex',
  gap: '8px',
  width: '100%',
};

const CARD_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2px',
  flex: 1,
  minWidth: 0,
  padding: '12px 8px',
  borderRadius: '16px',
  background: 'var(--surface)',
  boxShadow: 'var(--shadow-sm)',
  textAlign: 'center',
};

const VALUE_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '20px',
  fontWeight: 800,
  color: 'var(--accent)',
  lineHeight: 1.1,
};

const LABEL_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '11px',
  fontWeight: 700,
  color: 'var(--text-muted)',
  lineHeight: 1.2,
};

export const HomeStatsBar = ({
  todayCount,
  streak,
  weakCount,
}: HomeStatsBarProps) => (
  <div style={ROW_STYLE}>
    <div style={CARD_STYLE}>
      <p style={VALUE_STYLE}>{todayCount}</p>
      <p style={LABEL_STYLE}>сегодня</p>
    </div>
    <div style={CARD_STYLE}>
      <p style={VALUE_STYLE}>{streak}</p>
      <p style={LABEL_STYLE}>дней подряд</p>
    </div>
    <div style={CARD_STYLE}>
      <p style={VALUE_STYLE}>{weakCount}</p>
      <p style={LABEL_STYLE}>слабых</p>
    </div>
  </div>
);

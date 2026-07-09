import type { CSSProperties } from 'react';

interface FinishScreenProps {
  total: number;
  onRestart: () => void;
  onHome: () => void;
}

const WRAP_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '20px',
  flex: 1,
  padding: '32px 0',
  textAlign: 'center',
};

const TITLE_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '20px',
  fontWeight: 600,
  color: 'var(--text)',
  letterSpacing: '-0.02em',
};

const TEXT_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '14px',
  fontWeight: 400,
  color: 'var(--text-muted)',
};

const BTN_ROW: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
  marginTop: '8px',
};

const PRIMARY_BTN: CSSProperties = {
  width: '100%',
  height: '44px',
  border: '1px solid var(--text)',
  borderRadius: '8px',
  background: 'var(--text)',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const SECONDARY_BTN: CSSProperties = {
  ...PRIMARY_BTN,
  background: 'var(--surface)',
  color: 'var(--text)',
  border: '1px solid var(--border)',
};

export const FinishScreen = ({
  total,
  onRestart,
  onHome,
}: FinishScreenProps) => (
  <div style={WRAP_STYLE}>
    <h2 style={TITLE_STYLE}>Готово</h2>
    <p style={TEXT_STYLE}>{total} карточек пройдено</p>
    <div style={BTN_ROW}>
      <button type="button" style={PRIMARY_BTN} onClick={onRestart}>
        Повторить
      </button>
      <button type="button" style={SECONDARY_BTN} onClick={onHome}>
        На главную
      </button>
    </div>
  </div>
);

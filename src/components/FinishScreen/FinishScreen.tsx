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
  gap: '16px',
  flex: 1,
  padding: '24px 0',
  textAlign: 'center',
};

const EMOJI_STYLE: CSSProperties = {
  fontSize: '64px',
  lineHeight: 1,
};

const TITLE_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '28px',
  fontWeight: 800,
  color: 'var(--text)',
};

const TEXT_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '15px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  lineHeight: 1.5,
};

const BTN_ROW: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '100%',
  marginTop: '12px',
};

const PRIMARY_BTN: CSSProperties = {
  width: '100%',
  height: '52px',
  border: 'none',
  borderRadius: '16px',
  background: 'var(--accent)',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 800,
  cursor: 'pointer',
  fontFamily: 'inherit',
  boxShadow: 'var(--shadow-md)',
};

const SECONDARY_BTN: CSSProperties = {
  ...PRIMARY_BTN,
  background: 'var(--surface)',
  color: 'var(--text)',
  boxShadow: 'var(--shadow-sm)',
};

export const FinishScreen = ({
  total,
  onRestart,
  onHome,
}: FinishScreenProps) => (
  <div style={WRAP_STYLE}>
    <span style={EMOJI_STYLE} aria-hidden="true">
      🎉
    </span>
    <h2 style={TITLE_STYLE}>Отлично!</h2>
    <p style={TEXT_STYLE}>
      Ты прошла все {total} карточек в этом наборе. Можно повторить или выбрать другой режим.
    </p>
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

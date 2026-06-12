import type { CSSProperties } from 'react';

interface ActionButtonsProps {
  onPrev: () => void;
  onFlip: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  isFlipped: boolean;
}

const ROW_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '10px',
  width: '100%',
};

const BTN_BASE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  borderRadius: '16px',
  fontWeight: 800,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'opacity 0.15s ease, transform 0.1s ease',
};

const SIDE_BTN: CSSProperties = {
  ...BTN_BASE,
  flex: 1,
  height: '52px',
  fontSize: '15px',
  background: 'var(--surface)',
  color: 'var(--text)',
  boxShadow: 'var(--shadow-sm)',
};

const FLIP_BTN: CSSProperties = {
  ...BTN_BASE,
  flex: 1.2,
  height: '52px',
  fontSize: '15px',
  background: 'var(--accent)',
  color: '#ffffff',
  boxShadow: 'var(--shadow-md)',
};

const getDisabledStyle = (disabled: boolean): CSSProperties => ({
  opacity: disabled ? 0.4 : 1,
  pointerEvents: disabled ? 'none' : 'auto',
});

export const ActionButtons = ({
  onPrev,
  onFlip,
  onNext,
  canPrev,
  canNext,
  isFlipped,
}: ActionButtonsProps) => (
  <div style={ROW_STYLE}>
    <button
      type="button"
      style={{ ...SIDE_BTN, ...getDisabledStyle(!canPrev) }}
      onClick={onPrev}
      disabled={!canPrev}
    >
      ← Назад
    </button>
    <button
      type="button"
      className={isFlipped ? '' : 'answer-btn-glow'}
      style={FLIP_BTN}
      onClick={onFlip}
    >
      {isFlipped ? 'Скрыть' : 'Ответ ✨'}
    </button>
    <button
      type="button"
      style={{ ...SIDE_BTN, ...getDisabledStyle(!canNext) }}
      onClick={onNext}
      disabled={!canNext}
    >
      Далее →
    </button>
  </div>
);

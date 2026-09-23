import type { CSSProperties } from 'react';

interface ActionButtonsProps {
  onPrev: () => void;
  onFlip: () => void;
  onNext: () => void;
  onDefer?: () => void;
  canPrev: boolean;
  canNext: boolean;
  canDefer?: boolean;
  isFlipped: boolean;
}

const WRAP_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '100%',
};

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

const DEFER_BTN: CSSProperties = {
  ...BTN_BASE,
  width: '100%',
  height: '46px',
  fontSize: '14px',
  background: 'var(--accent-soft)',
  color: 'var(--accent)',
  border: '2px solid var(--border)',
};

const getDisabledStyle = (disabled: boolean): CSSProperties => ({
  opacity: disabled ? 0.4 : 1,
  pointerEvents: disabled ? 'none' : 'auto',
});

export const ActionButtons = ({
  onPrev,
  onFlip,
  onNext,
  onDefer,
  canPrev,
  canNext,
  canDefer = false,
  isFlipped,
}: ActionButtonsProps) => (
  <div style={WRAP_STYLE}>
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
    {onDefer ? (
      <button
        type="button"
        style={{ ...DEFER_BTN, ...getDisabledStyle(!canDefer) }}
        onClick={onDefer}
        disabled={!canDefer}
      >
        Отложить — вернётся позже
      </button>
    ) : null}
  </div>
);

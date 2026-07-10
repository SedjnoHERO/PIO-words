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
  gap: '8px',
  width: '100%',
};

const BTN_BASE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  fontWeight: 500,
  fontSize: '14px',
  cursor: 'pointer',
  fontFamily: 'inherit',
  height: '44px',
};

const SIDE_BTN: CSSProperties = {
  ...BTN_BASE,
  flex: 1,
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--text)',
};

const FLIP_BTN: CSSProperties = {
  ...BTN_BASE,
  flex: '0 0 88px',
  width: '88px',
  minWidth: '88px',
  border: '1px solid var(--text)',
  background: 'var(--text)',
  color: '#ffffff',
};

const getDisabledStyle = (disabled: boolean): CSSProperties => ({
  opacity: disabled ? 0.35 : 1,
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
      Назад
    </button>
    <button type="button" style={FLIP_BTN} onClick={onFlip}>
      {isFlipped ? 'Скрыть' : 'Ответ'}
    </button>
    <button
      type="button"
      style={{ ...SIDE_BTN, ...getDisabledStyle(!canNext) }}
      onClick={onNext}
      disabled={!canNext}
    >
      Далее
    </button>
  </div>
);

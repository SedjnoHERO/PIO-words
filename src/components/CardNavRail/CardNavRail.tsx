import type { CSSProperties } from 'react';

type NavDirection = 'prev' | 'next';

interface CardNavRailProps {
  direction: NavDirection;
  disabled: boolean;
  onClick: () => void;
}

const RAIL_BASE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '0 0 40px',
  width: '40px',
  height: '280px',
  minHeight: '280px',
  maxHeight: '280px',
  flexShrink: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontFamily: 'inherit',
  alignSelf: 'stretch',
};

const RAIL_DISABLED: CSSProperties = {
  opacity: 0.25,
  cursor: 'default',
  pointerEvents: 'none',
};

const ICON_STYLE: CSSProperties = {
  fontSize: '24px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  lineHeight: 1,
};

const LABELS: Record<NavDirection, string> = {
  prev: 'Предыдущая карточка',
  next: 'Следующая карточка',
};

const ICONS: Record<NavDirection, string> = {
  prev: '‹',
  next: '›',
};

export const CardNavRail = ({
  direction,
  disabled,
  onClick,
}: CardNavRailProps) => (
  <button
    type="button"
    className="card-nav-rail"
    style={{
      ...RAIL_BASE,
      ...(disabled ? RAIL_DISABLED : {}),
    }}
    onClick={onClick}
    disabled={disabled}
    aria-label={LABELS[direction]}
  >
    <span style={ICON_STYLE}>{ICONS[direction]}</span>
  </button>
);

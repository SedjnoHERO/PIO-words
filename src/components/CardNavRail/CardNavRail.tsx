import type { CSSProperties } from 'react';

type NavDirection = 'prev' | 'next';

interface CardNavRailProps {
  direction: NavDirection;
  disabled: boolean;
  onClick: () => void;
}

const RAIL_BASE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '0 0 52px',
  width: '52px',
  minHeight: '280px',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontFamily: 'inherit',
  padding: '8px 4px',
  gap: '6px',
  alignSelf: 'stretch',
};

const RAIL_DISABLED: CSSProperties = {
  opacity: 0.2,
  cursor: 'default',
  pointerEvents: 'none',
};

const ICON_STYLE: CSSProperties = {
  fontSize: '28px',
  fontWeight: 800,
  color: 'var(--accent)',
  lineHeight: 1,
};

const HINT_STYLE: CSSProperties = {
  fontSize: '9px',
  fontWeight: 700,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  writingMode: 'vertical-rl',
  transform: 'rotate(180deg)',
};

const DIRECTION_CONFIG: Record<
  NavDirection,
  { icon: string; hint: string; label: string; className: string }
> = {
  prev: {
    icon: '‹',
    hint: 'назад',
    label: 'Предыдущее слово',
    className: 'card-nav-rail--prev',
  },
  next: {
    icon: '›',
    hint: 'далее',
    label: 'Следующее слово',
    className: 'card-nav-rail--next',
  },
};

export const CardNavRail = ({
  direction,
  disabled,
  onClick,
}: CardNavRailProps) => {
  const config = DIRECTION_CONFIG[direction];

  return (
    <button
      type="button"
      className={`card-nav-rail ${config.className}`}
      style={{
        ...RAIL_BASE,
        ...(disabled ? RAIL_DISABLED : {}),
      }}
      onClick={onClick}
      disabled={disabled}
      aria-label={config.label}
    >
      <span style={ICON_STYLE}>{config.icon}</span>
      <span style={HINT_STYLE}>{config.hint}</span>
    </button>
  );
};

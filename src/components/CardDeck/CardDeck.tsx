import type { CSSProperties, ReactNode } from 'react';
import { CardNavRail } from '../CardNavRail/CardNavRail';

interface CardDeckProps {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  children: ReactNode;
}

const DECK_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  flex: 1,
  width: '100%',
  height: '100%',
  minHeight: 0,
  gap: '4px',
};

const CARD_SLOT: CSSProperties = {
  display: 'flex',
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  height: '100%',
};

export const CardDeck = ({
  canPrev,
  canNext,
  onPrev,
  onNext,
  children,
}: CardDeckProps) => (
  <div style={DECK_STYLE}>
    <CardNavRail direction="prev" disabled={!canPrev} onClick={onPrev} />
    <div style={CARD_SLOT}>{children}</div>
    <CardNavRail direction="next" disabled={!canNext} onClick={onNext} />
  </div>
);

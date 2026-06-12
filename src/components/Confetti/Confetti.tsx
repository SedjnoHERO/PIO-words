import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { CONFETTI_COLORS } from '../../data/praiseMessages';

interface ConfettiPiece {
  id: number;
  left: string;
  delay: string;
  duration: string;
  color: string;
  width: number;
  height: number;
}

interface ConfettiProps {
  count?: number;
}

const WRAP_STYLE: CSSProperties = {
  position: 'fixed',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
  zIndex: 1000,
};

const createPieces = (count: number): ConfettiPiece[] =>
  Array.from({ length: count }, (_, index) => ({
    id: index,
    left: `${(index * 17 + 3) % 100}%`,
    delay: `${(index % 12) * 0.12}s`,
    duration: `${2.2 + (index % 5) * 0.35}s`,
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    width: 6 + (index % 4) * 2,
    height: 10 + (index % 3) * 3,
  }));

export const Confetti = ({ count = 48 }: ConfettiProps) => {
  const pieces = useMemo(() => createPieces(count), [count]);

  return (
    <div style={WRAP_STYLE} aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti-piece"
          style={{
            left: piece.left,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            backgroundColor: piece.color,
            width: `${piece.width}px`,
            height: `${piece.height}px`,
          }}
        />
      ))}
    </div>
  );
};

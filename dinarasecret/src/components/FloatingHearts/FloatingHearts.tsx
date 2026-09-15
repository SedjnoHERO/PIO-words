import { useMemo } from 'react';
import type { CSSProperties } from 'react';

interface HeartItem {
  id: number;
  left: string;
  delay: string;
  duration: string;
  emoji: string;
}

interface FloatingHeartsProps {
  count?: number;
}

const HEART_EMOJIS = ['💕', '💖', '💗', '✨', '🌸', '💝'];

const WRAP_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
};

const createHearts = (count: number): HeartItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: index,
    left: `${8 + (index * 19) % 84}%`,
    delay: `${(index % 8) * 0.35}s`,
    duration: `${2.8 + (index % 4) * 0.5}s`,
    emoji: HEART_EMOJIS[index % HEART_EMOJIS.length],
  }));

export const FloatingHearts = ({ count = 14 }: FloatingHeartsProps) => {
  const hearts = useMemo(() => createHearts(count), [count]);

  return (
    <div style={WRAP_STYLE} aria-hidden="true">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="floating-heart"
          style={{
            left: heart.left,
            animationDelay: heart.delay,
            animationDuration: heart.duration,
          }}
        >
          {heart.emoji}
        </span>
      ))}
    </div>
  );
};

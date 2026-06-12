import { CONFETTI_COLORS } from './praiseMessages';

export type FireworkIntensity = 'normal' | 'grand';

export interface FireworkBurstPoint {
  x: string;
  y: string;
  waveDelay: string;
}

export interface FireworkParticle {
  id: string;
  tx: number;
  ty: number;
  color: string;
  size: number;
  delay: string;
  duration: string;
}

export interface FireworkSpark {
  id: string;
  emoji: string;
  tx: number;
  ty: number;
  delay: string;
  size: number;
}

export const FIREWORK_BURST_POINTS: FireworkBurstPoint[] = [
  { x: '50%', y: '40%', waveDelay: '0s' },
  { x: '25%', y: '52%', waveDelay: '0s' },
  { x: '75%', y: '50%', waveDelay: '0s' },
];

export const FIREWORK_GRAND_BURST_POINTS: FireworkBurstPoint[] = [
  { x: '50%', y: '28%', waveDelay: '0s' },
  { x: '20%', y: '38%', waveDelay: '0.15s' },
  { x: '80%', y: '36%', waveDelay: '0.2s' },
  { x: '35%', y: '55%', waveDelay: '0.45s' },
  { x: '65%', y: '52%', waveDelay: '0.5s' },
  { x: '50%', y: '65%', waveDelay: '0.7s' },
  { x: '12%', y: '62%', waveDelay: '0.85s' },
  { x: '88%', y: '60%', waveDelay: '0.9s' },
  { x: '50%', y: '45%', waveDelay: '1.1s' },
];

export const FIREWORK_SPARK_EMOJIS: string[] = ['✨', '💖', '⭐', '💫', '🌸'];

export const FIREWORK_GRAND_SPARK_EMOJIS: string[] = [
  '✨',
  '💖',
  '⭐',
  '💫',
  '🌸',
  '🎉',
  '🐷',
  '🐽',
  '🎀',
  '🧸',
  '🥳',
  '💕',
];

const INTENSITY_CONFIG: Record<
  FireworkIntensity,
  { points: FireworkBurstPoint[]; particlesPerBurst: number; sparkEmojis: string[] }
> = {
  normal: {
    points: FIREWORK_BURST_POINTS,
    particlesPerBurst: 14,
    sparkEmojis: FIREWORK_SPARK_EMOJIS,
  },
  grand: {
    points: FIREWORK_GRAND_BURST_POINTS,
    particlesPerBurst: 22,
    sparkEmojis: FIREWORK_GRAND_SPARK_EMOJIS,
  },
};

export const createFireworkParticles = (
  burstId: number,
  intensity: FireworkIntensity = 'normal',
): FireworkParticle[] => {
  const { points, particlesPerBurst } = INTENSITY_CONFIG[intensity];

  return points.flatMap((point, pointIndex) =>
    Array.from({ length: particlesPerBurst }, (_, particleIndex) => {
      const angle = (particleIndex / particlesPerBurst) * Math.PI * 2;
      const distance =
        intensity === 'grand'
          ? 65 + (particleIndex % 5) * 28
          : 55 + (particleIndex % 4) * 22;
      const tx = Math.round(Math.cos(angle) * distance);
      const ty = Math.round(Math.sin(angle) * distance);

      return {
        id: `${burstId}-${pointIndex}-${particleIndex}`,
        tx,
        ty,
        color: CONFETTI_COLORS[(pointIndex + particleIndex) % CONFETTI_COLORS.length],
        size: intensity === 'grand' ? 6 + (particleIndex % 4) * 2 : 5 + (particleIndex % 3) * 2,
        delay: `${parseFloat(point.waveDelay) + particleIndex * 0.01}s`,
        duration: `${intensity === 'grand' ? 1.1 : 0.75 + (particleIndex % 3) * 0.12}s`,
      };
    }),
  );
};

export const createFireworkSparks = (
  burstId: number,
  intensity: FireworkIntensity = 'normal',
): FireworkSpark[] => {
  const { points, sparkEmojis } = INTENSITY_CONFIG[intensity];

  return points.flatMap((point, pointIndex) =>
    sparkEmojis.map((emoji, emojiIndex) => {
      const angle = (emojiIndex / sparkEmojis.length) * Math.PI * 2;
      const distance =
        intensity === 'grand' ? 85 + emojiIndex * 10 : 70 + emojiIndex * 8;

      return {
        id: `${burstId}-spark-${pointIndex}-${emojiIndex}`,
        emoji,
        tx: Math.round(Math.cos(angle) * distance),
        ty: Math.round(Math.sin(angle) * distance),
        delay: `${parseFloat(point.waveDelay) + emojiIndex * 0.035}s`,
        size: intensity === 'grand' ? 18 + (emojiIndex % 4) * 5 : 16 + (emojiIndex % 3) * 4,
      };
    }),
  );
};

export const getBurstPoints = (
  intensity: FireworkIntensity,
): FireworkBurstPoint[] => INTENSITY_CONFIG[intensity].points;

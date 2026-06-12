import { CONFETTI_COLORS } from './praiseMessages';

export interface FireworkBurstPoint {
  x: string;
  y: string;
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
  { x: '50%', y: '40%' },
  { x: '25%', y: '52%' },
  { x: '75%', y: '50%' },
];

export const FIREWORK_SPARK_EMOJIS: string[] = ['✨', '💖', '⭐', '💫', '🌸'];

const PARTICLES_PER_BURST = 14;

export const createFireworkParticles = (
  burstId: number,
): FireworkParticle[] =>
  FIREWORK_BURST_POINTS.flatMap((point, pointIndex) =>
    Array.from({ length: PARTICLES_PER_BURST }, (_, particleIndex) => {
      const angle = (particleIndex / PARTICLES_PER_BURST) * Math.PI * 2;
      const distance = 55 + (particleIndex % 4) * 22;
      const tx = Math.round(Math.cos(angle) * distance);
      const ty = Math.round(Math.sin(angle) * distance);

      return {
        id: `${burstId}-${pointIndex}-${particleIndex}`,
        tx,
        ty,
        color: CONFETTI_COLORS[(pointIndex + particleIndex) % CONFETTI_COLORS.length],
        size: 5 + (particleIndex % 3) * 2,
        delay: `${pointIndex * 0.06 + particleIndex * 0.01}s`,
        duration: `${0.75 + (particleIndex % 3) * 0.12}s`,
      };
    }),
  );

export const createFireworkSparks = (burstId: number): FireworkSpark[] =>
  FIREWORK_BURST_POINTS.flatMap((_, pointIndex) =>
    FIREWORK_SPARK_EMOJIS.map((emoji, emojiIndex) => {
      const angle = (emojiIndex / FIREWORK_SPARK_EMOJIS.length) * Math.PI * 2;
      const distance = 70 + emojiIndex * 8;

      return {
        id: `${burstId}-spark-${pointIndex}-${emojiIndex}`,
        emoji,
        tx: Math.round(Math.cos(angle) * distance),
        ty: Math.round(Math.sin(angle) * distance),
        delay: `${pointIndex * 0.08 + emojiIndex * 0.04}s`,
        size: 16 + (emojiIndex % 3) * 4,
      };
    }),
  );

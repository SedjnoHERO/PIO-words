import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import {
  createFireworkParticles,
  createFireworkSparks,
  FIREWORK_BURST_POINTS,
} from '../../data/fireworksConfig';

interface FireworksBurstProps {
  burstId: number;
}

const WRAP_STYLE: CSSProperties = {
  position: 'fixed',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
  zIndex: 850,
};

const BURST_STYLE = (x: string, y: string): CSSProperties => ({
  position: 'absolute',
  left: x,
  top: y,
  width: 0,
  height: 0,
});

const PARTICLE_ORIGIN: CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  borderRadius: '50%',
  transform: 'translate(-50%, -50%)',
};

const SPARK_ORIGIN: CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  transform: 'translate(-50%, -50%)',
  lineHeight: 1,
};

const RING_STYLE: CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  border: '3px solid var(--accent-light)',
  transform: 'translate(-50%, -50%)',
};

export const FireworksBurst = ({ burstId }: FireworksBurstProps) => {
  const particles = useMemo(
    () => createFireworkParticles(burstId),
    [burstId],
  );
  const sparks = useMemo(() => createFireworkSparks(burstId), [burstId]);

  if (burstId === 0) {
    return null;
  }

  return (
    <div key={burstId} style={WRAP_STYLE} aria-hidden="true">
      {FIREWORK_BURST_POINTS.map((point, index) => (
        <div
          key={`${burstId}-burst-${index}`}
          style={BURST_STYLE(point.x, point.y)}
        >
          <span
            className="firework-ring"
            style={{
              ...RING_STYLE,
              animationDelay: `${index * 0.07}s`,
            }}
          />
          <span
            className="firework-ring firework-ring--soft"
            style={{
              ...RING_STYLE,
              animationDelay: `${0.12 + index * 0.07}s`,
            }}
          />
        </div>
      ))}

      {FIREWORK_BURST_POINTS.map((point, pointIndex) => (
        <div
          key={`${burstId}-particles-${pointIndex}`}
          style={BURST_STYLE(point.x, point.y)}
        >
          {particles
            .filter((particle) => particle.id.startsWith(`${burstId}-${pointIndex}-`))
            .map((particle) => (
              <span
                key={particle.id}
                className="firework-particle"
                style={{
                  ...PARTICLE_ORIGIN,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  animationDelay: particle.delay,
                  animationDuration: particle.duration,
                  ['--tx' as string]: `${particle.tx}px`,
                  ['--ty' as string]: `${particle.ty}px`,
                }}
              />
            ))}
        </div>
      ))}

      {FIREWORK_BURST_POINTS.map((point, pointIndex) => (
        <div
          key={`${burstId}-sparks-${pointIndex}`}
          style={BURST_STYLE(point.x, point.y)}
        >
          {sparks
            .filter((spark) => spark.id.includes(`-spark-${pointIndex}-`))
            .map((spark) => (
              <span
                key={spark.id}
                className="firework-spark"
                style={{
                  ...SPARK_ORIGIN,
                  fontSize: `${spark.size}px`,
                  animationDelay: spark.delay,
                  ['--tx' as string]: `${spark.tx}px`,
                  ['--ty' as string]: `${spark.ty}px`,
                }}
              >
                {spark.emoji}
              </span>
            ))}
        </div>
      ))}

      <div className="firework-flash" />
    </div>
  );
};

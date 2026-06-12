import { useEffect, useMemo } from 'react';
import type { CSSProperties } from 'react';
import {
  FINISH_BADGES,
  FINISH_MESSAGES,
  FINISH_TITLE,
  pickRandom,
} from '../../data/praiseMessages';
import { Confetti } from '../Confetti/Confetti';
import { FloatingHearts } from '../FloatingHearts/FloatingHearts';

interface FinishScreenProps {
  total: number;
  onRestart: () => void;
  onHome: () => void;
}

const WRAP_STYLE: CSSProperties = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  flex: 1,
  padding: '24px 0',
  textAlign: 'center',
  overflow: 'hidden',
};

const CARD_STYLE: CSSProperties = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '14px',
  width: '100%',
  padding: '28px 20px',
  borderRadius: '24px',
  background: 'linear-gradient(145deg, #ffffff, #fff5f9)',
  border: '2px solid var(--accent-soft)',
};

const EMOJI_ROW: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontSize: '48px',
  lineHeight: 1,
};

const TITLE_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '24px',
  fontWeight: 800,
  color: 'var(--accent)',
  lineHeight: 1.3,
};

const TEXT_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '15px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  lineHeight: 1.55,
};

const COUNT_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '14px',
  fontWeight: 800,
  color: 'var(--text)',
  background: 'var(--accent-soft)',
  padding: '8px 16px',
  borderRadius: '20px',
};

const BADGES_ROW: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '8px',
  width: '100%',
};

const BADGE_STYLE: CSSProperties = {
  fontSize: '13px',
  fontWeight: 800,
  color: 'var(--accent)',
  background: '#ffffff',
  padding: '6px 12px',
  borderRadius: '16px',
  boxShadow: 'var(--shadow-sm)',
};

const BTN_ROW: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '100%',
  marginTop: '4px',
};

const PRIMARY_BTN: CSSProperties = {
  width: '100%',
  height: '52px',
  border: 'none',
  borderRadius: '16px',
  background: 'var(--accent)',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 800,
  cursor: 'pointer',
  fontFamily: 'inherit',
  boxShadow: 'var(--shadow-md)',
};

const SECONDARY_BTN: CSSProperties = {
  ...PRIMARY_BTN,
  background: 'var(--surface)',
  color: 'var(--text)',
  boxShadow: 'var(--shadow-sm)',
};

export const FinishScreen = ({
  total,
  onRestart,
  onHome,
}: FinishScreenProps) => {
  const subtitle = useMemo(() => pickRandom(FINISH_MESSAGES), []);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([50, 40, 50, 40, 80]);
    }
  }, []);

  return (
    <>
      <Confetti count={56} />
      <div style={WRAP_STYLE}>
        <FloatingHearts count={16} />
        <div className="finish-hero finish-card" style={CARD_STYLE}>
          <div style={EMOJI_ROW} aria-hidden="true">
            <span className="finish-sparkle">✨</span>
            <span>🎉</span>
            <span className="finish-sparkle">💕</span>
          </div>
          <h2 style={TITLE_STYLE}>{FINISH_TITLE}</h2>
          <p style={TEXT_STYLE}>{subtitle}</p>
          <p style={COUNT_STYLE}>
            Все {total} карточек пройдены — ты молодец!
          </p>
          <div style={BADGES_ROW}>
            {FINISH_BADGES.map((badge, index) => (
              <span
                key={badge}
                className="finish-badge"
                style={{
                  ...BADGE_STYLE,
                  animationDelay: `${0.15 + index * 0.1}s`,
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
        <div style={BTN_ROW}>
          <button type="button" style={PRIMARY_BTN} onClick={onRestart}>
            Ещё разок? 💪
          </button>
          <button type="button" style={SECONDARY_BTN} onClick={onHome}>
            На главную
          </button>
        </div>
      </div>
    </>
  );
};

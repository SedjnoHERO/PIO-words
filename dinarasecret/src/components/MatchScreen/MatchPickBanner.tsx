import type { CSSProperties } from 'react';

interface MatchPickBannerProps {
  label: string;
  sideLabel: string;
}

const BANNER_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  width: '100%',
  padding: '12px 16px',
  borderRadius: '18px',
  background: 'linear-gradient(145deg, #ffffff, #fff5f8)',
  boxShadow: 'var(--shadow-md)',
  border: '2px solid var(--accent-soft)',
  textAlign: 'center',
};

const SIDE_STYLE: CSSProperties = {
  fontSize: '11px',
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--accent)',
};

const WORD_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '18px',
  fontWeight: 800,
  color: 'var(--text)',
  lineHeight: 1.3,
  wordBreak: 'break-word',
};

const HINT_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '12px',
  fontWeight: 700,
  color: 'var(--text-muted)',
};

export const MatchPickBanner = ({ label, sideLabel }: MatchPickBannerProps) => (
  <div className="match-pick-banner" style={BANNER_STYLE}>
    <span style={SIDE_STYLE}>{sideLabel}</span>
    <p style={WORD_STYLE}>{label}</p>
    <p style={HINT_STYLE}>Теперь нажми перевод напротив</p>
  </div>
);

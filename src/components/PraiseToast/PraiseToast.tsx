import type { CSSProperties } from 'react';

interface PraiseToastProps {
  message: string | null;
}

const TOAST_STYLE: CSSProperties = {
  position: 'fixed',
  top: 'max(20px, env(safe-area-inset-top))',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 900,
  padding: '12px 20px',
  borderRadius: '20px',
  background: 'linear-gradient(135deg, #ffffff, #fff0f5)',
  color: 'var(--accent)',
  fontSize: '16px',
  fontWeight: 800,
  boxShadow: '0 8px 32px rgba(232, 93, 138, 0.28)',
  border: '2px solid var(--accent-soft)',
  whiteSpace: 'nowrap',
  maxWidth: 'calc(100vw - 32px)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  pointerEvents: 'none',
};

export const PraiseToast = ({ message }: PraiseToastProps) => {
  if (!message) {
    return null;
  }

  return (
    <div
      key={message}
      className="praise-toast"
      style={TOAST_STYLE}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
};

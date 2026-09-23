import type { CSSProperties, MouseEvent } from 'react';
import { canSpeak } from '../../utils/speech';

interface SpeakButtonProps {
  onSpeak: () => void;
  label?: string;
  corner?: 'left' | 'right';
}

const getButtonStyle = (corner: 'left' | 'right'): CSSProperties => ({
  position: 'absolute',
  top: '12px',
  [corner === 'left' ? 'left' : 'right']: '12px',
  zIndex: 2,
  width: '40px',
  height: '40px',
  border: 'none',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.92)',
  boxShadow: 'var(--shadow-sm)',
  fontSize: '18px',
  cursor: 'pointer',
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--accent)',
});

const INLINE_STYLE: CSSProperties = {
  width: '40px',
  height: '40px',
  border: 'none',
  borderRadius: '12px',
  background: 'var(--accent-soft)',
  color: 'var(--accent)',
  fontSize: '18px',
  cursor: 'pointer',
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

export const SpeakButton = ({
  onSpeak,
  label = 'Произнести',
  corner,
}: SpeakButtonProps) => {
  if (!canSpeak()) {
    return null;
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    onSpeak();
  };

  return (
    <button
      type="button"
      style={corner ? getButtonStyle(corner) : INLINE_STYLE}
      onClick={handleClick}
      aria-label={label}
    >
      🔊
    </button>
  );
};

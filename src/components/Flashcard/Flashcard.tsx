import type { CSSProperties } from 'react';
import type { StudyMode, WordEntry } from '../../types/vocabulary';
import { getBackLines, getFrontText } from '../../utils/deckBuilder';

interface FlashcardProps {
  word: WordEntry;
  mode: StudyMode;
  isFlipped: boolean;
  onFlip: () => void;
}

const CARD_WRAP_STYLE: CSSProperties = {
  display: 'flex',
  flex: 1,
  width: '100%',
  minHeight: '280px',
  perspective: '1000px',
};

const CARD_INNER_STYLE = (isFlipped: boolean): CSSProperties => ({
  position: 'relative',
  width: '100%',
  minHeight: '280px',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.45s ease',
  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
});

const FACE_BASE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  padding: '28px 20px',
  borderRadius: '24px',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  boxShadow: 'var(--shadow-md)',
  border: 'none',
  cursor: 'pointer',
  width: '100%',
  minHeight: '280px',
};

const FRONT_STYLE: CSSProperties = {
  ...FACE_BASE,
  background: 'linear-gradient(145deg, #ffffff, #fff5f8)',
};

const BACK_STYLE: CSSProperties = {
  ...FACE_BASE,
  background: 'linear-gradient(145deg, var(--accent-soft), #ffffff)',
  transform: 'rotateY(180deg)',
};

const LABEL_STYLE: CSSProperties = {
  fontSize: '12px',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--accent)',
};

const WORD_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '32px',
  fontWeight: 800,
  color: 'var(--text)',
  textAlign: 'center',
  lineHeight: 1.25,
  wordBreak: 'break-word',
};

const HINT_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text-muted)',
};

const TRANSLATIONS_LIST_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
};

const TRANSLATION_ITEM_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '24px',
  fontWeight: 700,
  color: 'var(--text)',
  textAlign: 'center',
};

const BADGE_STYLE: CSSProperties = {
  fontSize: '11px',
  fontWeight: 800,
  color: 'var(--accent)',
  background: 'var(--surface)',
  padding: '4px 10px',
  borderRadius: '20px',
};

const getFrontLabel = (mode: StudyMode): string => {
  if (mode === 'en-to-ru' || mode === 'multi-translation') {
    return 'English';
  }

  return 'Русский';
};

const getBackLabel = (mode: StudyMode): string => {
  if (mode === 'en-to-ru' || mode === 'multi-translation') {
    return mode === 'multi-translation' ? 'Все переводы' : 'Русский';
  }

  return 'English';
};

export const Flashcard = ({
  word,
  mode,
  isFlipped,
  onFlip,
}: FlashcardProps) => {
  const backLines = getBackLines(word, mode);
  const showMultiBadge =
    mode === 'multi-translation' || backLines.length > 1;

  return (
    <div style={CARD_WRAP_STYLE}>
      <button
        type="button"
        style={CARD_INNER_STYLE(isFlipped)}
        onClick={onFlip}
        aria-label={isFlipped ? 'Скрыть перевод' : 'Показать перевод'}
      >
        <span style={FRONT_STYLE}>
          <span style={LABEL_STYLE}>{getFrontLabel(mode)}</span>
          <p style={WORD_STYLE}>{getFrontText(word, mode)}</p>
          <p style={HINT_STYLE}>Нажми, чтобы перевернуть</p>
        </span>

        <span style={BACK_STYLE}>
          <span style={LABEL_STYLE}>{getBackLabel(mode)}</span>
          {showMultiBadge ? (
            <span style={BADGE_STYLE}>{backLines.length} варианта</span>
          ) : null}
          <span style={TRANSLATIONS_LIST_STYLE}>
            {backLines.map((line) => (
              <p key={line} style={TRANSLATION_ITEM_STYLE}>
                {line}
              </p>
            ))}
          </span>
        </span>
      </button>
    </div>
  );
};

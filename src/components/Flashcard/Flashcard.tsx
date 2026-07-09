import type { CSSProperties } from 'react';
import type { StudyMode, WordEntry } from '../../types/vocabulary';
import {
  getBackLang,
  getBackLines,
  getFrontLang,
  getFrontText,
  getLangLabel,
} from '../../utils/deckBuilder';

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
  transition: 'transform 0.35s ease',
  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
});

const FACE_BASE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  padding: '24px 16px',
  borderRadius: '12px',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  cursor: 'pointer',
  width: '100%',
  minHeight: '280px',
};

const BACK_STYLE: CSSProperties = {
  ...FACE_BASE,
  transform: 'rotateY(180deg)',
};

const LABEL_STYLE: CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--text-muted)',
};

const WORD_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '26px',
  fontWeight: 600,
  color: 'var(--text)',
  textAlign: 'center',
  lineHeight: 1.3,
  wordBreak: 'break-word',
  letterSpacing: '-0.02em',
};

const TRANSLATIONS_LIST_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
};

const TRANSLATION_ITEM_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '20px',
  fontWeight: 500,
  color: 'var(--text)',
  textAlign: 'center',
  lineHeight: 1.35,
};

export const Flashcard = ({
  word,
  mode,
  isFlipped,
  onFlip,
}: FlashcardProps) => {
  const backLines = getBackLines(word, mode);
  const frontLang = getFrontLang(word, mode);
  const backLang = getBackLang(word, mode);
  const backLabel = getLangLabel(backLang);
  const flipLabel = isFlipped ? 'Скрыть' : 'Показать перевод';

  return (
    <div style={CARD_WRAP_STYLE}>
      <button
        type="button"
        style={CARD_INNER_STYLE(isFlipped)}
        onClick={onFlip}
        aria-label={flipLabel}
      >
        <span style={FACE_BASE}>
          <span style={LABEL_STYLE}>{getLangLabel(frontLang)}</span>
          <p style={WORD_STYLE}>{getFrontText(word, mode)}</p>
        </span>

        <span style={BACK_STYLE}>
          <span style={LABEL_STYLE}>{backLabel}</span>
          <span style={TRANSLATIONS_LIST_STYLE}>
            {backLines.map((line, index) => (
              <p key={`${line}-${index}`} style={TRANSLATION_ITEM_STYLE}>
                {line}
              </p>
            ))}
          </span>
        </span>
      </button>
    </div>
  );
};

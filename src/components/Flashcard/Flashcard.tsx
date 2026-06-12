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
  showRevealShine: boolean;
  onFlip: () => void;
}

const CARD_WRAP_STYLE: CSSProperties = {
  display: 'flex',
  flex: 1,
  width: '100%',
  minHeight: '280px',
  perspective: '1000px',
  position: 'relative',
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
  padding: '28px 16px',
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
  fontSize: '30px',
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
  fontSize: '22px',
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

const getBackLabel = (mode: StudyMode): string =>
  mode === 'multi-translation' ? 'Все переводы' : '';

export const Flashcard = ({
  word,
  mode,
  isFlipped,
  showRevealShine,
  onFlip,
}: FlashcardProps) => {
  const backLines = getBackLines(word, mode);
  const frontLang = getFrontLang(word, mode);
  const backLang = getBackLang(word, mode);
  const backLabel =
    mode === 'multi-translation'
      ? getBackLabel(mode)
      : getLangLabel(backLang);
  const showMultiBadge =
    mode === 'multi-translation' || backLines.length > 1;
  const flipLabel = isFlipped ? 'Скрыть перевод' : 'Показать перевод';

  const wrapClass = showRevealShine && isFlipped ? 'card-reveal-shine' : '';

  return (
    <div style={CARD_WRAP_STYLE} className={wrapClass}>
      <button
        type="button"
        style={CARD_INNER_STYLE(isFlipped)}
        onClick={onFlip}
        aria-label={flipLabel}
      >
        <span className="flashcard-face" style={FRONT_STYLE}>
          <span style={LABEL_STYLE}>{getLangLabel(frontLang)}</span>
          <p style={WORD_STYLE}>{getFrontText(word, mode)}</p>
          <p style={HINT_STYLE}>Нажми, чтобы перевернуть</p>
        </span>

        <span className="flashcard-face" style={BACK_STYLE}>
          <span style={LABEL_STYLE}>{backLabel}</span>
          {showMultiBadge ? (
            <span style={BADGE_STYLE}>{backLines.length} варианта</span>
          ) : null}
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

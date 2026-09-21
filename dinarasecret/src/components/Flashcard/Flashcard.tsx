import type { CSSProperties } from 'react';
import type { AppLanguage, StudyMode, WordEntry } from '../../types/vocabulary';
import {
  getBackLang,
  getBackLines,
  getBackTranscription,
  getFrontLang,
  getFrontText,
  getFrontTranscription,
  getLangLabel,
} from '../../utils/deckBuilder';

interface FlashcardProps {
  word: WordEntry;
  language: AppLanguage;
  mode: StudyMode;
  isFlipped: boolean;
  showRevealShine: boolean;
  isFavorite?: boolean;
  onFlip: () => void;
  onToggleFavorite?: () => void;
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
  gap: '10px',
  padding: '24px 16px',
  borderRadius: '24px',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  boxShadow: 'var(--shadow-md)',
  border: 'none',
  cursor: 'pointer',
  width: '100%',
  minHeight: '280px',
  overflow: 'auto',
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
  fontSize: '28px',
  fontWeight: 800,
  color: 'var(--text)',
  textAlign: 'center',
  lineHeight: 1.25,
  wordBreak: 'break-word',
};

const TRANSCRIPTION_STYLE: CSSProperties = {
  margin: 0,
  padding: '6px 12px',
  fontSize: '16px',
  fontWeight: 700,
  color: '#5c4a62',
  textAlign: 'center',
  lineHeight: 1.4,
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  background: 'rgba(255, 255, 255, 0.85)',
  borderRadius: '12px',
  maxWidth: '100%',
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
  gap: '12px',
  width: '100%',
};

const TRANSLATION_BLOCK_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '6px',
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

const FAVORITE_BTN: CSSProperties = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  zIndex: 2,
  width: '40px',
  height: '40px',
  border: 'none',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.92)',
  boxShadow: 'var(--shadow-sm)',
  fontSize: '20px',
  cursor: 'pointer',
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const getBackLabel = (mode: StudyMode): string =>
  mode === 'multi-translation' ? 'Все переводы' : '';

export const Flashcard = ({
  word,
  language,
  mode,
  isFlipped,
  showRevealShine,
  isFavorite = false,
  onFlip,
  onToggleFavorite,
}: FlashcardProps) => {
  const backLines = getBackLines(word, mode);
  const frontLang = getFrontLang(word, mode);
  const backLang = getBackLang(word, mode);
  const frontTranscription = getFrontTranscription(word, mode, language);
  const backLabel =
    mode === 'multi-translation'
      ? getBackLabel(mode)
      : getLangLabel(backLang, language);
  const showMultiBadge =
    mode === 'multi-translation' || backLines.length > 1;
  const flipLabel = isFlipped ? 'Скрыть перевод' : 'Показать перевод';

  const wrapClass = showRevealShine && isFlipped ? 'card-reveal-shine' : '';

  return (
    <div style={CARD_WRAP_STYLE} className={wrapClass}>
      {onToggleFavorite ? (
        <button
          type="button"
          style={{
            ...FAVORITE_BTN,
            color: isFavorite ? 'var(--accent)' : 'var(--text-muted)',
          }}
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite();
          }}
          aria-label={isFavorite ? 'Убрать из избранного' : 'В избранное'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      ) : null}
      <button
        type="button"
        style={CARD_INNER_STYLE(isFlipped)}
        onClick={onFlip}
        aria-label={flipLabel}
      >
        <span className="flashcard-face" style={FRONT_STYLE}>
          <span style={LABEL_STYLE}>{getLangLabel(frontLang, language)}</span>
          <span style={WORD_STYLE}>{getFrontText(word, mode)}</span>
          {frontTranscription ? (
            <span style={TRANSCRIPTION_STYLE}>{frontTranscription}</span>
          ) : null}
          <span style={HINT_STYLE}>Нажми, чтобы перевернуть</span>
        </span>

        <span className="flashcard-face" style={BACK_STYLE}>
          <span style={LABEL_STYLE}>{backLabel}</span>
          {showMultiBadge ? (
            <span style={BADGE_STYLE}>{backLines.length} варианта</span>
          ) : null}
          <span style={TRANSLATIONS_LIST_STYLE}>
            {backLines.map((line, index) => {
              const transcription = getBackTranscription(
                word,
                mode,
                language,
                index,
              );

              return (
                <span key={`${line}-${index}`} style={TRANSLATION_BLOCK_STYLE}>
                  <span style={TRANSLATION_ITEM_STYLE}>{line}</span>
                  {transcription ? (
                    <span style={TRANSCRIPTION_STYLE}>{transcription}</span>
                  ) : null}
                </span>
              );
            })}
          </span>
        </span>
      </button>
    </div>
  );
};

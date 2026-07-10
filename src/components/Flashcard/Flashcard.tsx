import type { CSSProperties, KeyboardEvent } from 'react';
import type { StudyMode, WordEntry } from '../../types/vocabulary';
import {
  getBackLang,
  getBackLines,
  getFrontLang,
  getFrontText,
  getLangLabel,
  getPronunciation,
  shouldShowPronunciation,
} from '../../utils/deckBuilder';
import './Flashcard.css';

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
  alignSelf: 'stretch',
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

const PRONUNCIATION_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  textAlign: 'center',
  lineHeight: 1.4,
};

const handleFlipKeyDown = (
  event: KeyboardEvent<HTMLDivElement>,
  onFlip: () => void,
): void => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onFlip();
  }
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
  const pronunciation = getPronunciation(word);
  const showFrontPronunciation = shouldShowPronunciation(word, mode, false);
  const showBackPronunciation = shouldShowPronunciation(word, mode, true);
  const innerClassName = isFlipped
    ? 'flashcard-inner flashcard-inner--flipped'
    : 'flashcard-inner';

  return (
    <div style={CARD_WRAP_STYLE} className="flashcard-scene">
      <div
        className={innerClassName}
        onClick={onFlip}
        onKeyDown={(event) => handleFlipKeyDown(event, onFlip)}
        role="button"
        tabIndex={0}
        aria-label={flipLabel}
      >
        <div className="flashcard-face flashcard-face--front">
          <span style={LABEL_STYLE}>{getLangLabel(frontLang)}</span>
          <p style={WORD_STYLE}>{getFrontText(word, mode)}</p>
          {showFrontPronunciation && pronunciation && (
            <p style={PRONUNCIATION_STYLE}>[{pronunciation}]</p>
          )}
        </div>

        <div className="flashcard-face flashcard-face--back">
          <span style={LABEL_STYLE}>{backLabel}</span>
          <span style={TRANSLATIONS_LIST_STYLE}>
            {backLines.map((line, index) => (
              <p key={`${line}-${index}`} style={TRANSLATION_ITEM_STYLE}>
                {line}
              </p>
            ))}
          </span>
          {showBackPronunciation && pronunciation && (
            <p style={PRONUNCIATION_STYLE}>[{pronunciation}]</p>
          )}
        </div>
      </div>
    </div>
  );
};

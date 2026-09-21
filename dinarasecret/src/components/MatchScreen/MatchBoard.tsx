import type { CSSProperties } from 'react';
import type { AppLanguage, WordEntry } from '../../types/vocabulary';
import { getForeignText, getRuText } from '../../utils/gameHelpers';
import { MatchChip, type MatchChipState } from './MatchChip';

interface MatchBoardProps {
  language: AppLanguage;
  leftIds: string[];
  rightIds: string[];
  wordsById: Map<string, WordEntry>;
  chipState: (id: string, side: 'left' | 'right') => MatchChipState;
  onLeft: (id: string) => void;
  onRight: (id: string) => void;
}

const BOARD_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: '12px',
  flex: 1,
  minHeight: 0,
  alignItems: 'stretch',
};

const COLUMN_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  flex: 1,
  minWidth: 0,
};

const HEADER_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '12px',
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  textAlign: 'center',
};

export const MatchBoard = ({
  language,
  leftIds,
  rightIds,
  wordsById,
  chipState,
  onLeft,
  onRight,
}: MatchBoardProps) => {
  const foreignLabel = language === 'de' ? 'Deutsch' : 'English';

  return (
    <div style={BOARD_STYLE}>
      <div style={COLUMN_STYLE}>
        <p style={HEADER_STYLE}>Русский</p>
        {leftIds.map((id) => {
          const word = wordsById.get(id);
          return word ? (
            <MatchChip
              key={`l-${id}`}
              label={getRuText(word)}
              tone="ru"
              state={chipState(id, 'left')}
              onClick={() => onLeft(id)}
            />
          ) : null;
        })}
      </div>
      <div style={COLUMN_STYLE}>
        <p style={HEADER_STYLE}>{foreignLabel}</p>
        {rightIds.map((id) => {
          const word = wordsById.get(id);
          return word ? (
            <MatchChip
              key={`r-${id}`}
              label={getForeignText(word)}
              tone="foreign"
              state={chipState(id, 'right')}
              onClick={() => onRight(id)}
            />
          ) : null;
        })}
      </div>
    </div>
  );
};

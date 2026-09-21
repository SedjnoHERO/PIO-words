import type { CSSProperties } from 'react';
import type { AppLanguage } from '../../types/vocabulary';
import {
  getForeignText,
  getRuText,
} from '../../utils/gameHelpers';
import { FinishScreen } from '../FinishScreen/FinishScreen';
import { Header } from '../Header/Header';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { useMatchGame } from '../../hooks/useMatchGame';
import { MatchBoard } from './MatchBoard';
import { MatchPickBanner } from './MatchPickBanner';

interface MatchScreenProps {
  language: AppLanguage;
  onBack: () => void;
  onHome: () => void;
}

const SCREEN_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  width: '100%',
  flex: 1,
  minHeight: 0,
};

const HINT_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '13px',
  fontWeight: 700,
  color: 'var(--text-muted)',
  textAlign: 'center',
};

const ROUND_DONE_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  flex: 1,
  textAlign: 'center',
};

const ROUND_EMOJI: CSSProperties = {
  fontSize: '48px',
  lineHeight: 1,
};

const ROUND_TITLE: CSSProperties = {
  margin: 0,
  fontSize: '22px',
  fontWeight: 800,
  color: 'var(--accent)',
};

const NEXT_BTN: CSSProperties = {
  marginTop: '8px',
  minWidth: '160px',
  height: '48px',
  padding: '0 20px',
  border: 'none',
  borderRadius: '16px',
  background: 'var(--accent)',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 800,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

export const MatchScreen = ({
  language,
  onBack,
  onHome,
}: MatchScreenProps) => {
  const game = useMatchGame(language);

  const selectedWord = game.selectedLeft
    ? game.wordsById.get(game.selectedLeft)
    : game.selectedRight
      ? game.wordsById.get(game.selectedRight)
      : null;
  const selectedSideLabel = game.selectedLeft
    ? 'Русский'
    : game.selectedRight
      ? language === 'de'
        ? 'Deutsch'
        : 'English'
      : '';
  const selectedLabel = selectedWord
    ? game.selectedLeft
      ? getRuText(selectedWord)
      : getForeignText(selectedWord)
    : '';

  if (game.allWords.length < 2) {
    return (
      <section style={SCREEN_STYLE}>
        <Header title="Соедини пары" onBack={onBack} />
        <p style={HINT_STYLE}>Нужно хотя бы 2 слова в словаре.</p>
      </section>
    );
  }

  if (game.isFinished) {
    return (
      <section style={SCREEN_STYLE}>
        <Header title="Соедини пары" onBack={onBack} />
        <FinishScreen
          total={game.allWords.length}
          onRestart={() => game.setupRound(0)}
          onHome={onHome}
        />
      </section>
    );
  }

  if (game.showRoundDone) {
    return (
      <section style={SCREEN_STYLE}>
        <Header
          title="Соедини пары"
          subtitle={`Раунд ${game.roundIndex + 1}/${game.rounds.length}`}
          onBack={onBack}
        />
        <div style={ROUND_DONE_STYLE}>
          <span style={ROUND_EMOJI} aria-hidden="true">
            ✨
          </span>
          <p style={ROUND_TITLE}>Раунд собран!</p>
          <button
            type="button"
            style={NEXT_BTN}
            onClick={() => game.setupRound(game.roundIndex + 1)}
          >
            Дальше
          </button>
        </div>
      </section>
    );
  }

  return (
    <section style={SCREEN_STYLE}>
      <Header
        title="Соедини пары"
        subtitle={`Раунд ${game.roundIndex + 1}/${game.rounds.length}`}
        onBack={onBack}
      />
      <ProgressBar
        current={game.globalProgress}
        total={game.allWords.length}
      />
      {selectedWord ? (
        <MatchPickBanner label={selectedLabel} sideLabel={selectedSideLabel} />
      ) : (
        <p style={HINT_STYLE}>Нажми слово — потом его перевод</p>
      )}
      <MatchBoard
        language={language}
        leftIds={game.visibleLeft}
        rightIds={game.visibleRight}
        wordsById={game.wordsById}
        chipState={game.chipState}
        onLeft={game.handleLeft}
        onRight={game.handleRight}
      />
    </section>
  );
};

import type { CSSProperties } from 'react';
import {
  getCategoryById,
  getModesByCategory,
} from '../../data/modes';
import type {
  AppLanguage,
  ModeCategoryId,
  StudyMode,
} from '../../types/vocabulary';
import { Header } from '../Header/Header';
import { ModeCard } from '../ModeCard/ModeCard';

interface ModeSelectScreenProps {
  language: AppLanguage;
  categoryId: ModeCategoryId;
  onSelectMode: (mode: StudyMode) => void;
  onBack: () => void;
}

const SCREEN_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
};

const LIST_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '100%',
};

export const ModeSelectScreen = ({
  language,
  categoryId,
  onSelectMode,
  onBack,
}: ModeSelectScreenProps) => {
  const category = getCategoryById(categoryId);
  const modes = getModesByCategory(language, categoryId);

  return (
    <section style={SCREEN_STYLE}>
      <Header
        title={category?.title ?? 'Режимы'}
        subtitle={category?.description}
        onBack={onBack}
      />
      <div style={LIST_STYLE}>
        {modes.map((mode) => (
          <ModeCard key={mode.id} mode={mode} onSelect={onSelectMode} />
        ))}
      </div>
    </section>
  );
};

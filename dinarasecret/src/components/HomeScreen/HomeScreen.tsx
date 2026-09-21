import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { MODE_CATEGORIES } from '../../data/modes';
import { getTotalWords } from '../../data/vocabulary';
import type { AppLanguage, ModeCategoryId } from '../../types/vocabulary';
import { getActivitySummary } from '../../utils/activityStats';
import { getWeakWordIds } from '../../utils/wordStats';
import { CategoryCard } from '../CategoryCard/CategoryCard';
import { Header } from '../Header/Header';
import { HomeStatsBar } from '../HomeStatsBar/HomeStatsBar';

interface HomeScreenProps {
  language: AppLanguage;
  onSelectCategory: (categoryId: ModeCategoryId) => void;
  onBack: () => void;
}

const SCREEN_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
};

const HERO_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '6px',
  padding: '2px 8px 0',
  textAlign: 'center',
};

const HERO_TEXT: CSSProperties = {
  margin: 0,
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  lineHeight: 1.45,
};

const LIST_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
};

const LANGUAGE_TITLE: Record<AppLanguage, string> = {
  de: 'Немецкий квиз',
  en: 'Английский квиз',
};

const LANGUAGE_SUBTITLE: Record<AppLanguage, string> = {
  de: 'Германия · география и население',
  en: 'Crime and Justice · коллоквиум',
};

export const HomeScreen = ({
  language,
  onSelectCategory,
  onBack,
}: HomeScreenProps) => {
  const total = getTotalWords(language);
  const stats = useMemo(() => {
    const activity = getActivitySummary(language);
    return {
      todayCount: activity.todayCount,
      streak: activity.streak,
      weakCount: getWeakWordIds(language).length,
    };
  }, [language]);

  return (
    <section style={SCREEN_STYLE}>
      <Header
        title={LANGUAGE_TITLE[language]}
        subtitle={`${total} слов · ${LANGUAGE_SUBTITLE[language]}`}
        onBack={onBack}
      />
      <HomeStatsBar
        todayCount={stats.todayCount}
        streak={stats.streak}
        weakCount={stats.weakCount}
      />
      <div style={HERO_STYLE}>
        <p style={HERO_TEXT}>Выбери, как хочешь заниматься сегодня 💕</p>
      </div>
      <div style={LIST_STYLE}>
        {MODE_CATEGORIES.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onSelect={onSelectCategory}
          />
        ))}
      </div>
    </section>
  );
};

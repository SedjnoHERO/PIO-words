import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { MODE_CATEGORIES } from '../../data/modes';
import { getWords, getVocabulary } from '../../data/vocabulary';
import type { AppLanguage, ModeCategoryId } from '../../types/vocabulary';
import { getActivitySummary } from '../../utils/activityStats';
import { getWeakWordIds } from '../../utils/wordStats';
import { CategoryCard } from '../CategoryCard/CategoryCard';
import { Header } from '../Header/Header';
import { HomeStatsBar } from '../HomeStatsBar/HomeStatsBar';

interface HomeScreenProps {
  language: AppLanguage;
  topicId: string | null;
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

export const HomeScreen = ({
  language,
  topicId,
  onSelectCategory,
  onBack,
}: HomeScreenProps) => {
  const total = getWords(language, topicId).length;
  const topicTitle = getVocabulary(language).find((topic) => topic.id === topicId)?.title ?? 'Все темы';
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
        subtitle={`${total} слов · ${topicTitle}`}
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

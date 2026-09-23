import type { CSSProperties } from 'react';
import { MODE_CATEGORIES } from '../../data/modes';
import { getTotalWords } from '../../data/vocabulary';
import type { AppLanguage, ModeCategoryId } from '../../types/vocabulary';
import { getActivitySummary } from '../../utils/activityStats';
import { getWeakWordIds } from '../../utils/wordStats';
import { useMemo } from 'react';
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

const BRAND_STYLE: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-display)',
  fontSize: '28px',
  fontWeight: 700,
  color: 'var(--text)',
  lineHeight: 1.15,
};

const HERO_TEXT: CSSProperties = {
  margin: 0,
  fontSize: '14px',
  fontWeight: 500,
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
  en: 'English · travel',
  fr: 'Français · voyage',
};

const LANGUAGE_SUBTITLE: Record<AppLanguage, string> = {
  en: 'Отель, магазины, дорога, лайнер',
  fr: 'Hôtel, magasins, chemin, croisière',
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
        subtitle={`${total} записей · ${LANGUAGE_SUBTITLE[language]}`}
        onBack={onBack}
      />
      <HomeStatsBar
        todayCount={stats.todayCount}
        streak={stats.streak}
        weakCount={stats.weakCount}
      />
      <div style={HERO_STYLE}>
        <p style={BRAND_STYLE}>English For Travelling</p>
        <p style={HERO_TEXT}>Сдержанный разговорник для поездки</p>
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

import type { CSSProperties } from 'react';
import type { ModeCategory } from '../../types/vocabulary';

interface CategoryCardProps {
  category: ModeCategory;
  onSelect: (categoryId: ModeCategory['id']) => void;
}

const CARD_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  width: '100%',
  padding: '20px 18px',
  border: '2px solid transparent',
  borderRadius: '20px',
  background: 'var(--surface)',
  boxShadow: 'var(--shadow-md)',
  cursor: 'pointer',
  textAlign: 'left',
};

const ICON_STYLE: CSSProperties = {
  fontSize: '36px',
  lineHeight: 1,
  flexShrink: 0,
};

const TEXT_WRAP: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
  minWidth: 0,
};

const TITLE_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '20px',
  fontWeight: 800,
  color: 'var(--text)',
};

const DESC_STYLE: CSSProperties = {
  margin: 0,
  fontSize: '13px',
  color: 'var(--text-muted)',
  fontWeight: 600,
  lineHeight: 1.4,
};

const CHEVRON_STYLE: CSSProperties = {
  fontSize: '22px',
  color: 'var(--accent)',
  fontWeight: 800,
};

export const CategoryCard = ({ category, onSelect }: CategoryCardProps) => (
  <button
    type="button"
    style={CARD_STYLE}
    onClick={() => onSelect(category.id)}
  >
    <span style={ICON_STYLE} aria-hidden="true">
      {category.icon}
    </span>
    <span style={TEXT_WRAP}>
      <span style={TITLE_STYLE}>{category.title}</span>
      <span style={DESC_STYLE}>{category.description}</span>
    </span>
    <span style={CHEVRON_STYLE} aria-hidden="true">
      ›
    </span>
  </button>
);

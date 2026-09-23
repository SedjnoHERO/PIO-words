export type AppLanguage = 'en' | 'fr';

export type EntryKind = 'word' | 'phrase';

export type StudyMode =
  | 'ru-to-foreign'
  | 'foreign-to-ru'
  | 'all-mixed'
  | 'single-topic'
  | 'multi-translation'
  | 'match-pairs'
  | 'choose-one'
  | 'type-answer'
  | 'scramble-word'
  | 'memory'
  | 'weak-words'
  | 'sprint'
  | 'favorites'
  | 'words-only'
  | 'phrases-only';

export interface WordEntry {
  id: string;
  kind: EntryKind;
  ru: string;
  terms: string[];
  topic: string;
  ruVariants?: string[];
  transcriptions?: string[];
}

export interface TopicGroup {
  id: string;
  title: string;
  words: WordEntry[];
}

export interface StudySession {
  mode: StudyMode;
  topicId: string | null;
  deck: WordEntry[];
  currentIndex: number;
  isFlipped: boolean;
}

export interface ModeOption {
  id: StudyMode;
  title: string;
  description: string;
  icon: string;
}

export type ModeCategoryId = 'cards' | 'games';

export interface ModeCategory {
  id: ModeCategoryId;
  title: string;
  description: string;
  icon: string;
}

export interface LanguageOption {
  id: AppLanguage;
  title: string;
  description: string;
  icon: string;
}

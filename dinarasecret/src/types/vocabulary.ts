export type AppLanguage = 'de' | 'en';

export type StudyMode =
  | 'ru-to-foreign'
  | 'foreign-to-ru'
  | 'all-mixed'
  | 'single-topic'
  | 'multi-translation';

export interface WordEntry {
  id: string;
  ru: string;
  terms: string[];
  topic: string;
  ruVariants?: string[];
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

export interface LanguageOption {
  id: AppLanguage;
  title: string;
  description: string;
  icon: string;
}

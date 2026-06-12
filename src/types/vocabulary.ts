export type StudyMode =
  | 'ru-to-en'
  | 'en-to-ru'
  | 'all-mixed'
  | 'single-topic'
  | 'multi-translation';

export interface WordEntry {
  id: string;
  ru: string;
  en: string[];
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

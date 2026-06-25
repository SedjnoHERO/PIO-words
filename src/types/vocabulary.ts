export type StudyMode =
  | 'ru-to-de'
  | 'de-to-ru'
  | 'all-mixed'
  | 'single-topic'
  | 'oral-only'
  | 'multi-translation';

export interface WordEntry {
  id: string;
  ru: string;
  de: string[];
  topic: string;
  ruVariants?: string[];
  oral?: boolean;
}

export interface TopicGroup {
  id: string;
  title: string;
  words: WordEntry[];
  oral?: boolean;
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

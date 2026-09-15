export type StudyMode =
  | 'gap-to-full'
  | 'full-to-gap'
  | 'all-mixed'
  | 'single-topic';

export interface WordEntry {
  id: string;
  gap: string;
  full: string;
  topic: string;
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

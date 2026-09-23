import type { AppLanguage } from '../types/vocabulary';

type SpeakLang = AppLanguage | 'ru';

const LANG_CODE: Record<SpeakLang, string> = {
  en: 'en-GB',
  fr: 'fr-FR',
  ru: 'ru-RU',
};

export const canSpeak = (): boolean =>
  typeof window !== 'undefined' && 'speechSynthesis' in window;

export const speakText = (text: string, language: SpeakLang): void => {
  if (!canSpeak() || !text.trim()) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text.trim());
  utterance.lang = LANG_CODE[language];
  utterance.rate = 0.92;

  const voices = window.speechSynthesis.getVoices();
  const matched = voices.find((voice) =>
    voice.lang.toLowerCase().startsWith(LANG_CODE[language].slice(0, 2)),
  );

  if (matched) {
    utterance.voice = matched;
  }

  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = (): void => {
  if (canSpeak()) {
    window.speechSynthesis.cancel();
  }
};

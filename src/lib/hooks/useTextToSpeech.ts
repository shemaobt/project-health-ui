import { useCallback, useEffect, useRef, useState } from 'react';

interface UseTextToSpeechOptions {
  languageCode: string;
}

interface SpeakArgs {
  id: number | string;
  text: string;
}

export function useTextToSpeech({ languageCode }: UseTextToSpeechOptions) {
  const [playingId, setPlayingId] = useState<number | string | null>(null);
  const [isSupported] = useState(
    () => typeof window !== 'undefined' && 'speechSynthesis' in window,
  );
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const cancel = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setPlayingId(null);
  }, [isSupported]);

  const speak = useCallback(
    ({ id, text }: SpeakArgs) => {
      if (!isSupported || !text) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languageCode;
      utterance.rate = 1;
      utterance.pitch = 1;

      const voices = window.speechSynthesis.getVoices();
      const voiceForLang = voices.find((v) => v.lang === languageCode)
        ?? voices.find((v) => v.lang.startsWith(languageCode.split('-')[0]));
      if (voiceForLang) utterance.voice = voiceForLang;

      utterance.onend = () => setPlayingId((current) => (current === id ? null : current));
      utterance.onerror = () => setPlayingId((current) => (current === id ? null : current));

      utteranceRef.current = utterance;
      setPlayingId(id);
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, languageCode],
  );

  const toggle = useCallback(
    (args: SpeakArgs) => {
      if (playingId === args.id) {
        cancel();
        return;
      }
      speak(args);
    },
    [playingId, speak, cancel],
  );

  return { playingId, isSupported, speak, cancel, toggle };
}

export const LANGUAGE_TTS_CODES: Record<string, string> = {
  en: 'en-US',
  pt: 'pt-BR',
  es: 'es-ES',
  fr: 'fr-FR',
  id: 'id-ID',
  sw: 'sw-KE',
};

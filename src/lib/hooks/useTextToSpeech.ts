import { useCallback, useEffect, useRef, useState } from 'react';
import type { SupportedLanguage } from '../api/types';
import { speakText } from '../api/voice';

interface UseTextToSpeechOptions {
  language: SupportedLanguage | null;
  interviewId: string | null;
  interviewToken: string | null;
}

interface SpeakArgs {
  id: number | string;
  text: string;
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mimeType });
}

export function useTextToSpeech({ language, interviewId, interviewToken }: UseTextToSpeechOptions) {
  const [playingId, setPlayingId] = useState<number | string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  const isSupported = typeof window !== 'undefined' && typeof window.Audio !== 'undefined';

  const teardown = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }, []);

  useEffect(() => () => teardown(), [teardown]);

  const cancel = useCallback(() => {
    teardown();
    setPlayingId(null);
  }, [teardown]);

  const speak = useCallback(
    async ({ id, text }: SpeakArgs) => {
      if (!isSupported || !text || !interviewId || !interviewToken || !language) return;
      teardown();
      setPlayingId(id);
      try {
        const res = await speakText(interviewId, text, language, interviewToken);
        const blob = base64ToBlob(res.audio_base64, res.mime_type || 'audio/mpeg');
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        const audio = new Audio(url);
        audio.onended = () => setPlayingId((cur) => (cur === id ? null : cur));
        audio.onerror = () => setPlayingId((cur) => (cur === id ? null : cur));
        audioRef.current = audio;
        await audio.play();
      } catch {
        setPlayingId((cur) => (cur === id ? null : cur));
      }
    },
    [isSupported, interviewId, interviewToken, language, teardown],
  );

  const toggle = useCallback(
    (args: SpeakArgs) => {
      if (playingId === args.id) {
        cancel();
        return;
      }
      void speak(args);
    },
    [playingId, speak, cancel],
  );

  return { playingId, isSupported, speak, cancel, toggle };
}

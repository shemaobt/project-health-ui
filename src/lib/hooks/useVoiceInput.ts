import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import type { SupportedLanguage } from '../api/types';
import { transcribeAudio } from '../api/voice';
import { useVoiceRecorder } from './useVoiceRecorder';

interface UseVoiceInputOptions {
  language: SupportedLanguage | null;
  interviewId: string | null;
  interviewToken: string | null;
  onResult: (transcript: string) => void;
}

export function useVoiceInput({ language, interviewId, interviewToken, onResult }: UseVoiceInputOptions) {
  const recorder = useVoiceRecorder({ maxDurationMs: 5 * 60 * 1000 });
  const [transcribeError, setTranscribeError] = useState<string>('');
  const [transcribing, setTranscribing] = useState(false);
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const isSupported = typeof navigator !== 'undefined'
    && !!navigator.mediaDevices?.getUserMedia
    && typeof window !== 'undefined'
    && typeof window.MediaRecorder !== 'undefined';

  const error = transcribeError || recorder.error || '';

  const finishWithBlob = useCallback(
    async (blob: Blob | null) => {
      if (!blob || !interviewId || !interviewToken) return;
      setTranscribing(true);
      try {
        const res = await transcribeAudio(interviewId, blob, interviewToken, language ?? undefined);
        const text = res.transcript.trim();
        if (text) onResultRef.current(text);
        else setTranscribeError('We did not catch any speech. Please try again.');
      } catch (err) {
        if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
          setTranscribeError('Your session has expired. Please refresh and try again.');
        } else {
          setTranscribeError('Voice transcription failed. Please try again in a moment.');
        }
      } finally {
        setTranscribing(false);
      }
    },
    [interviewId, interviewToken, language],
  );

  const startListening = useCallback(async () => {
    if (!isSupported) {
      setTranscribeError('Voice input is not supported in this browser.');
      return;
    }
    setTranscribeError('');
    await recorder.start();
  }, [isSupported, recorder]);

  const stopListening = useCallback(async () => {
    const blob = await recorder.stop();
    await finishWithBlob(blob);
  }, [recorder, finishWithBlob]);

  const clearError = useCallback(() => {
    setTranscribeError('');
  }, []);

  return {
    isListening: recorder.recording || transcribing,
    isSupported,
    error,
    startListening,
    stopListening,
    clearError,
  };
}

export const LANGUAGE_SPEECH_CODES: Record<string, string> = {
  en: 'en-US',
  pt: 'pt-BR',
  es: 'es-MX',
  fr: 'fr-FR',
  id: 'id-ID',
  sw: 'sw-KE',
};

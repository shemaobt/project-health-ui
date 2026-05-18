import { useState, useRef, useCallback, useEffect } from 'react';

interface UseVoiceInputOptions {
  languageCode: string;
  onResult: (transcript: string) => void;
}

interface SpeechRecognitionAny {
  abort: () => void;
  stop: () => void;
  start: () => void;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventAny) => void) | null;
  onerror: ((event: SpeechRecognitionErrorAny) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEventAny {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
}

interface SpeechRecognitionErrorAny {
  error: string;
}

type Ctor = new () => SpeechRecognitionAny;

function getSpeechRecognitionCtor(): Ctor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: Ctor;
    webkitSpeechRecognition?: Ctor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useVoiceInput({ languageCode, onResult }: UseVoiceInputOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef<SpeechRecognitionAny | null>(null);

  useEffect(() => {
    setIsSupported(!!getSpeechRecognitionCtor());
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort?.();
    };
  }, []);

  const startListening = useCallback(async () => {
    const SpeechRecognition = getSpeechRecognitionCtor();
    if (!SpeechRecognition) {
      setError('Voice input is not supported in this browser.');
      return;
    }
    setError('');

    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch {
        setError('Microphone access is blocked. Please allow microphone use and try again.');
        setIsListening(false);
        return;
      }
    }

    recognitionRef.current?.abort?.();

    const recognition = new SpeechRecognition();
    let finalTranscript = '';
    let latestTranscript = '';
    let heardSpeech = false;
    let delivered = false;
    let hadRecognitionError = false;

    const deliverTranscript = () => {
      const transcript = (finalTranscript || latestTranscript).trim();
      if (!transcript || delivered) return;
      delivered = true;
      onResult(transcript);
    };

    recognition.lang = languageCode || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcript = result[0]?.transcript?.trim();
        if (!transcript) continue;
        heardSpeech = true;
        latestTranscript = [finalTranscript, transcript].filter(Boolean).join(' ').trim();
        if (result.isFinal) {
          finalTranscript = [finalTranscript, transcript].filter(Boolean).join(' ').trim();
        }
      }
    };

    recognition.onerror = (event) => {
      hadRecognitionError = true;
      if (event?.error === 'not-allowed') {
        setError('Microphone access was denied. Please allow it and try again.');
      } else if (event?.error === 'audio-capture') {
        setError('No microphone was detected. Please check your microphone and try again.');
      } else if (event?.error === 'no-speech') {
        setError('We did not catch any speech. Please try again.');
      } else {
        setError('Voice input stopped unexpectedly. Please try again.');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      deliverTranscript();
      if (!heardSpeech && !delivered && !hadRecognitionError) {
        setError('We did not catch any speech. Please try again.');
      }
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setError('Unable to start voice input. Please try again.');
      setIsListening(false);
    }
  }, [languageCode, onResult]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const clearError = useCallback(() => setError(''), []);

  return { isListening, isSupported, error, startListening, stopListening, clearError };
}

export const LANGUAGE_SPEECH_CODES: Record<string, string> = {
  en: 'en-US',
  pt: 'pt-BR',
  es: 'es-MX',
  fr: 'fr-FR',
  id: 'id-ID',
  sw: 'sw-KE',
};

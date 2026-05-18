import { api } from './client';
import type { SupportedLanguage } from './types';

export interface VoiceTranscribeResponse {
  transcript: string;
}

export interface VoiceSpeakResponse {
  audio_base64: string;
  mime_type: string;
  etag: string;
  cached: boolean;
}

function tokenHeader(token: string): { headers: { Authorization: string } } {
  return { headers: { Authorization: `Bearer ${token}` } };
}

export async function transcribeAudio(
  interviewId: string,
  blob: Blob,
  interviewToken: string,
  language?: SupportedLanguage,
): Promise<VoiceTranscribeResponse> {
  const form = new FormData();
  form.append('file', blob, 'recording.webm');
  if (blob.type) form.append('mime_type', blob.type);
  if (language) form.append('language', language);
  const { data } = await api.post<VoiceTranscribeResponse>(
    `/api/project-health/interviews/${interviewId}/voice/transcribe`,
    form,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${interviewToken}`,
      },
    },
  );
  return data;
}

export async function speakText(
  interviewId: string,
  text: string,
  language: SupportedLanguage,
  interviewToken: string,
): Promise<VoiceSpeakResponse> {
  const { data } = await api.post<VoiceSpeakResponse>(
    `/api/project-health/interviews/${interviewId}/voice/speak`,
    { text, language },
    tokenHeader(interviewToken),
  );
  return data;
}

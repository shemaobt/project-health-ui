import axios, { AxiosError } from 'axios';
import { api } from './client';
import type {
  InterviewCompleteBlocked,
  InterviewCompleteResponse,
  InterviewCreateResponse,
  InterviewDetailResponse,
  InterviewMessageResponse,
  SupportedLanguage,
} from './types';

function tokenHeader(token: string): { headers: { Authorization: string } } {
  return { headers: { Authorization: `Bearer ${token}` } };
}

export async function createInterview(payload: {
  project_name: string;
  team_name: string;
  language: SupportedLanguage;
}): Promise<InterviewCreateResponse> {
  const { data } = await api.post<InterviewCreateResponse>(
    '/api/project-health/interviews',
    payload,
  );
  return data;
}

export async function getInterview(
  id: string,
  interviewToken: string,
): Promise<InterviewDetailResponse> {
  const { data } = await api.get<InterviewDetailResponse>(
    `/api/project-health/interviews/${id}`,
    tokenHeader(interviewToken),
  );
  return data;
}

export async function postMessage(
  id: string,
  content: string,
  interviewToken: string,
): Promise<InterviewMessageResponse> {
  const { data } = await api.post<InterviewMessageResponse>(
    `/api/project-health/interviews/${id}/messages`,
    { content },
    tokenHeader(interviewToken),
  );
  return data;
}

export type CompleteResult =
  | { ok: true; data: InterviewCompleteResponse }
  | { ok: false; blocked: InterviewCompleteBlocked };

export async function completeInterview(
  id: string,
  interviewToken: string,
): Promise<CompleteResult> {
  try {
    const { data } = await api.post<InterviewCompleteResponse>(
      `/api/project-health/interviews/${id}/complete`,
      {},
      tokenHeader(interviewToken),
    );
    return { ok: true, data };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const e = err as AxiosError<InterviewCompleteBlocked>;
      if (e.response?.status === 400 && e.response.data && 'minimum_team_turns' in e.response.data) {
        return { ok: false, blocked: e.response.data };
      }
    }
    throw err;
  }
}

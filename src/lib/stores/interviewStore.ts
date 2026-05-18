import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { INTERVIEW_SESSION_KEY } from '../constants';
import { interviewsApi } from '../api';
import type {
  CoverageStateDto,
  InterviewStatus,
  MessageDto,
  SupportedLanguage,
} from '../api/types';

export interface InterviewSessionState {
  interviewId: string | null;
  interviewToken: string | null;
  expiresAt: string | null;
  language: SupportedLanguage | null;
  projectName: string;
  teamName: string;
  messages: MessageDto[];
  coverage: CoverageStateDto | null;
  status: InterviewStatus;
  reportId: string | null;
}

interface InterviewActions {
  start: (payload: {
    project_name: string;
    team_name: string;
    language: SupportedLanguage;
  }) => Promise<string>;
  sendMessage: (content: string) => Promise<void>;
  complete: () => Promise<
    | { ok: true; reportId: string }
    | { ok: false; reason: 'incomplete'; blockedMessage: string; teamTurnCount: number; minimum: number }
  >;
  hydrateFromBackend: (id: string) => Promise<void>;
  reset: () => void;
}

type Store = InterviewSessionState & InterviewActions;

const INITIAL: InterviewSessionState = {
  interviewId: null,
  interviewToken: null,
  expiresAt: null,
  language: null,
  projectName: '',
  teamName: '',
  messages: [],
  coverage: null,
  status: 'in_progress',
  reportId: null,
};

export const useInterviewStore = create<Store>()(
  persist(
    (set, get) => ({
      ...INITIAL,

      start: async (payload) => {
        const res = await interviewsApi.createInterview(payload);
        set({
          interviewId: res.id,
          interviewToken: res.interview_token,
          expiresAt: res.expires_at,
          language: payload.language,
          projectName: payload.project_name,
          teamName: payload.team_name,
          messages: [res.first_message],
          coverage: res.coverage,
          status: 'in_progress',
          reportId: null,
        });
        return res.id;
      },

      sendMessage: async (content) => {
        const { interviewId, interviewToken, messages } = get();
        if (!interviewId || !interviewToken) {
          throw new Error('No active interview');
        }
        const rollbackLength = messages.length;
        const teamTurn: MessageDto = {
          role: 'team',
          content,
          timestamp: new Date().toISOString(),
        };
        set({ messages: [...messages, teamTurn] });
        try {
          const res = await interviewsApi.postMessage(interviewId, content, interviewToken);
          set((s) => ({
            messages: [...s.messages, res.facilitator_message],
            coverage: res.coverage,
          }));
        } catch (err) {
          set((s) => ({ messages: s.messages.slice(0, rollbackLength) }));
          throw err;
        }
      },

      complete: async () => {
        const { interviewId, interviewToken } = get();
        if (!interviewId || !interviewToken) {
          throw new Error('No active interview');
        }
        const result = await interviewsApi.completeInterview(interviewId, interviewToken);
        if (result.ok) {
          set({ status: 'completed', reportId: result.data.report_id });
          return { ok: true, reportId: result.data.report_id };
        }
        return {
          ok: false,
          reason: 'incomplete',
          blockedMessage: result.blocked.error,
          teamTurnCount: result.blocked.team_turn_count,
          minimum: result.blocked.minimum_team_turns,
        };
      },

      hydrateFromBackend: async (id) => {
        const { interviewToken } = get();
        if (!interviewToken) return;
        const detail = await interviewsApi.getInterview(id, interviewToken);
        set({
          interviewId: detail.id,
          language: detail.language,
          projectName: detail.project_name,
          teamName: detail.team_name,
          messages: detail.messages,
          coverage: detail.coverage,
          status: detail.status,
        });
      },

      reset: () => set(INITIAL),
    }),
    {
      name: INTERVIEW_SESSION_KEY,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

import { api } from './client';
import type {
  AdminDashboardResponse,
  AdminInviteResponse,
  InterviewCompleteResponse,
  InterviewDetailResponse,
} from './types';

export async function getDashboard(): Promise<AdminDashboardResponse> {
  const { data } = await api.get<AdminDashboardResponse>(
    '/api/project-health/admin/dashboard',
  );
  return data;
}

export async function inviteAdmin(email: string): Promise<AdminInviteResponse> {
  const { data } = await api.post<AdminInviteResponse>(
    '/api/project-health/admin/invites',
    { email },
  );
  return data;
}

export async function getInterviewTranscript(
  interviewId: string,
): Promise<InterviewDetailResponse> {
  const { data } = await api.get<InterviewDetailResponse>(
    `/api/project-health/admin/interviews/${interviewId}`,
  );
  return data;
}

export async function deleteInterview(interviewId: string): Promise<void> {
  await api.delete(`/api/project-health/admin/interviews/${interviewId}`);
}

export async function adminForceCompleteInterview(
  interviewId: string,
): Promise<InterviewCompleteResponse> {
  const { data } = await api.post<InterviewCompleteResponse>(
    `/api/project-health/admin/interviews/${interviewId}/complete`,
  );
  return data;
}

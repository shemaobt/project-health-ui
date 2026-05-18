import { api } from './client';
import type { AdminReportResponse, TeamReportResponse } from './types';

export async function getTeamReport(reportId: string): Promise<TeamReportResponse> {
  const { data } = await api.get<TeamReportResponse>(
    `/api/project-health/reports/team/${reportId}`,
  );
  return data;
}

export async function getAdminReport(reportId: string): Promise<AdminReportResponse> {
  const { data } = await api.get<AdminReportResponse>(
    `/api/project-health/reports/admin/${reportId}`,
  );
  return data;
}

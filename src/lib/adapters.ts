import { LANGUAGES } from './fixtures';
import type {
  Admin,
  AdminReportPayload,
  Domain,
  Interview,
  InterviewContext,
  InterviewSummary,
  LanguageCode,
  Quality,
  TeamReportPayload,
} from './fixtures';
import type {
  AdminReportResponse,
  AdminReportPayload as BackendAdminReport,
  DomainScore,
  InterviewContext as BackendInterviewContext,
  InterviewSummaryDto,
  ReportSummaryDto,
  SupportedLanguage,
  TeamReportResponse,
  TeamReportPayload as BackendTeamReport,
} from './api/types';

const DOMAIN_LEGACY_KEY: Record<string, Domain['key']> = {
  local_leadership: 'leadership',
  capacity_training: 'capacity',
  church_community: 'church',
  resources_infrastructure: 'resources',
  strategic_planning: 'planning',
  collaboration: 'collab',
  pace_trajectory: 'pace',
};

const DOMAIN_LEGACY_NAME: Record<string, string> = {
  local_leadership: 'Local Leadership & Ownership',
  capacity_training: 'Capacity, Training & Multiplication',
  church_community: 'Church & Community Engagement',
  resources_infrastructure: 'Resources & Oral Exegetical Infrastructure',
  strategic_planning: 'Strategic Planning & Risk Management',
  collaboration: 'Collaboration Without Unhealthy Dependency',
  pace_trajectory: 'Pace & Trajectory (3–5 Year Horizon)',
};

function languageLabel(code: SupportedLanguage): string {
  return LANGUAGES.find((l) => l.code === code)?.label ?? 'English';
}

function dateOnly(iso: string): string {
  return iso.slice(0, 10);
}

function adaptContext(ctx: BackendInterviewContext | null | undefined): InterviewContext {
  if (!ctx) {
    return {
      respondent: '',
      participants: [],
      languageNote: '',
      teamSize: 0,
      roles: '',
    };
  }
  const sizeNumber = Number.parseInt(ctx.team_size || '', 10);
  return {
    respondent: ctx.respondent_name || '',
    participants: ctx.participants_present || [],
    languageNote: ctx.language_name || '',
    teamSize: Number.isFinite(sizeNumber) ? sizeNumber : ctx.participants_present?.length ?? 0,
    roles: (ctx.team_roles || []).join(', '),
  };
}

function adaptTeamReport(report: BackendTeamReport): TeamReportPayload {
  return {
    summary: report.summary || '',
    strengths: report.strengths || [],
    growth: report.growth_areas || [],
    next_steps: report.next_steps || [],
    closing: report.closing || '',
  };
}

function adaptDomain(score: DomainScore): Domain {
  return {
    key: DOMAIN_LEGACY_KEY[score.domain] ?? score.domain,
    name: DOMAIN_LEGACY_NAME[score.domain] ?? score.domain,
    score: score.score,
    confidence: score.confidence,
    rationale: score.rationale,
    risks: score.risks || [],
  };
}

function adaptQuality(quality: BackendAdminReport['interview_quality']): Quality {
  return {
    coverage: quality.coverage_breadth,
    coverage_total: 5,
    evidence_items: quality.evidence_depth,
    avg_confidence: quality.confidence_avg,
  };
}

function adaptAdminReport(report: BackendAdminReport, summary: string): AdminReportPayload {
  return {
    overall: report.overall_sustainability_index,
    narrative: summary,
    domains: (report.domain_scores || []).map(adaptDomain),
    top_risks: report.top_risks || [],
    actions: report.recommended_actions || [],
    quality: adaptQuality(report.interview_quality),
  };
}

export function interviewSummaryFromBackend(
  iv: InterviewSummaryDto,
): InterviewSummary {
  return {
    id: iv.id,
    project: iv.project_name,
    team: iv.team_name,
    language: languageLabel(iv.language),
    languageCode: iv.language as LanguageCode,
    status: iv.status === 'completed' ? 'completed' : 'in_progress',
    date: dateOnly(iv.completed_at ?? iv.created_at),
  };
}

export function interviewFromTeamReport(
  iv: InterviewSummaryDto,
  report: TeamReportResponse,
): Interview {
  return {
    id: iv.id,
    project: iv.project_name,
    team: iv.team_name,
    language: languageLabel(iv.language),
    languageCode: iv.language as LanguageCode,
    status: iv.status === 'completed' ? 'completed' : 'in_progress',
    date: dateOnly(iv.completed_at ?? iv.created_at),
    context: adaptContext(report.team_report.interview_context),
    team_report: adaptTeamReport(report.team_report),
    admin_report: {
      overall: 0,
      narrative: '',
      domains: [],
      top_risks: [],
      actions: [],
      quality: { coverage: 0, coverage_total: 5, evidence_items: 0, avg_confidence: 0 },
    },
  };
}

export function interviewFromAdminReport(
  iv: InterviewSummaryDto,
  report: AdminReportResponse,
): Interview {
  const teamReport = adaptTeamReport(report.team_report);
  return {
    id: iv.id,
    project: iv.project_name,
    team: iv.team_name,
    language: languageLabel(iv.language),
    languageCode: iv.language as LanguageCode,
    status: iv.status === 'completed' ? 'completed' : 'in_progress',
    date: dateOnly(iv.completed_at ?? iv.created_at),
    context: adaptContext(
      report.admin_report.interview_context ?? report.team_report.interview_context,
    ),
    team_report: teamReport,
    admin_report: adaptAdminReport(report.admin_report, teamReport.summary),
  };
}

export function adminFromCurrent(opts: {
  email: string;
  invited_by?: string;
  date: string;
}): Admin {
  return {
    email: opts.email,
    invited_by: opts.invited_by ?? '—',
    date: opts.date,
  };
}

export function interviewSummariesAndReports(
  interviews: InterviewSummaryDto[],
  reports: ReportSummaryDto[],
): { summaries: InterviewSummary[]; reportByInterview: Map<string, string> } {
  const reportByInterview = new Map<string, string>();
  for (const r of reports) reportByInterview.set(r.interview_id, r.id);
  const summaries = interviews.map(interviewSummaryFromBackend);
  return { summaries, reportByInterview };
}

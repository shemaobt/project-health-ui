export type SupportedLanguage = 'en' | 'pt' | 'es' | 'fr' | 'id' | 'sw';
export type InterviewStatus = 'in_progress' | 'completed' | 'abandoned';
export type MessageRole = 'facilitator' | 'team';

export interface CurrentUser {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  is_platform_admin: boolean;
  locale: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginResponse {
  user: CurrentUser;
  tokens: AuthTokens;
}

export interface SignupPayload {
  email: string;
  password: string;
  display_name?: string;
}

export interface AccessRequestResponse {
  id: string;
  user_id: string;
  app_id: string;
  status: string;
  note: string | null;
  requested_at: string;
  reviewed_at: string | null;
}

export interface MessageDto {
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface CoverageStateDto {
  domains_touched: Record<string, number>;
  domains_with_evidence: string[];
  suggested_next_domain: string | null;
  interview_phase: 'opening' | 'exploring' | 'deepening' | 'closing';
  turn_count: number;
  opening_fields: Record<string, boolean>;
  missing_opening_fields: string[];
}

export interface InterviewCreateResponse {
  id: string;
  interview_token: string;
  expires_at: string;
  first_message: MessageDto;
  coverage: CoverageStateDto;
}

export interface InterviewMessageResponse {
  facilitator_message: MessageDto;
  coverage: CoverageStateDto;
}

export interface InterviewDetailResponse {
  id: string;
  project_name: string;
  team_name: string;
  language: SupportedLanguage;
  status: InterviewStatus;
  messages: MessageDto[];
  coverage: CoverageStateDto;
  created_at: string;
  completed_at: string | null;
}

export interface InterviewCompleteResponse {
  report_id: string;
  team_report: TeamReportPayload;
}

export interface InterviewCompleteBlocked {
  error: string;
  completion_ready: false;
  minimum_team_turns: number;
  team_turn_count: number;
  missing_opening_fields: string[];
  missing_domains: string[];
}

export interface InterviewContext {
  respondent_name: string;
  participants_present: string[];
  language_name: string;
  language_code: string;
  team_size: string;
  team_roles: string[];
}

export interface TeamReportPayload {
  interview_context?: InterviewContext | null;
  summary: string;
  strengths: string[];
  growth_areas: string[];
  next_steps: string[];
  closing: string;
}

export interface DomainScore {
  domain: string;
  score: number;
  confidence: number;
  rationale: string;
  risks: string[];
  strengths: string[];
  evidence_refs: number[];
}

export interface EvidenceItem {
  domain: string;
  quote_summary: string;
  sentiment: 'positive' | 'neutral' | 'concern';
  turn_index: number;
}

export interface InterviewQuality {
  coverage_breadth: number;
  evidence_depth: number;
  confidence_avg: number;
}

export interface AdminReportPayload {
  overall_sustainability_index: number;
  domain_scores: DomainScore[];
  top_risks: string[];
  evidence_highlights: EvidenceItem[];
  recommended_actions: string[];
  interview_context?: InterviewContext | null;
  interview_quality: InterviewQuality;
}

export interface TeamReportResponse {
  id: string;
  interview_id: string;
  language: SupportedLanguage;
  team_report: TeamReportPayload;
  created_at: string;
}

export interface AdminReportResponse {
  id: string;
  interview_id: string;
  language: SupportedLanguage;
  team_report: TeamReportPayload;
  admin_report: AdminReportPayload;
  created_at: string;
}

export interface InterviewSummaryDto {
  id: string;
  project_name: string;
  team_name: string;
  language: SupportedLanguage;
  status: InterviewStatus;
  created_at: string;
  completed_at: string | null;
}

export interface ReportSummaryDto {
  id: string;
  interview_id: string;
  created_at: string;
}

export interface AdminDashboardResponse {
  interviews: InterviewSummaryDto[];
  reports: ReportSummaryDto[];
}

export interface AdminInviteResponse {
  email: string;
  pre_approved_role: string;
  access_request_id: string | null;
  granted: boolean;
}

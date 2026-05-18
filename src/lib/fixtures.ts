export type LanguageCode = 'en' | 'pt' | 'es' | 'fr' | 'id' | 'sw';
export type InterviewStatus = 'completed' | 'in_progress';
export type MessageRole = 'facilitator' | 'team';

export interface Language {
  code: LanguageCode;
  label: string;
  native: string;
}

export interface SeedMessage {
  role: MessageRole;
  text: string;
}

export interface Message extends SeedMessage {
  id: number;
  time: string;
}

export interface InterviewContext {
  respondent: string;
  participants: string[];
  languageNote: string;
  teamSize: number;
  roles: string;
}

export interface TeamReportPayload {
  summary: string;
  strengths: string[];
  growth: string[];
  next_steps: string[];
  closing: string;
}

export interface Domain {
  key: string;
  name: string;
  score: number;
  confidence: number;
  rationale: string;
  risks: string[];
}

export interface Quality {
  coverage: number;
  coverage_total: number;
  evidence_items: number;
  avg_confidence: number;
}

export interface AdminReportPayload {
  overall: number;
  narrative: string;
  domains: Domain[];
  top_risks: string[];
  actions: string[];
  quality: Quality;
}

export interface Interview {
  id: string;
  project: string;
  team: string;
  language: string;
  languageCode: LanguageCode;
  status: InterviewStatus;
  date: string;
  context: InterviewContext;
  team_report: TeamReportPayload;
  admin_report: AdminReportPayload;
}

export type InterviewSummary = Pick<
  Interview,
  'id' | 'project' | 'team' | 'language' | 'languageCode' | 'status' | 'date'
>;

export interface DashboardStats {
  total: number;
  completed: number;
  inProgress: number;
}

export interface Admin {
  email: string;
  invited_by: string;
  date: string;
}

export interface InterviewSession {
  lang: LanguageCode;
  project: string;
  team: string;
  participants: string[];
}

export interface Pace {
  coverage: number;
  sufficient: boolean;
}

export const LANGUAGES: Language[] = [
  { code: 'en', label: 'English',    native: 'English' },
  { code: 'pt', label: 'Portuguese', native: 'Português' },
  { code: 'es', label: 'Spanish',    native: 'Español' },
  { code: 'fr', label: 'French',     native: 'Français' },
  { code: 'id', label: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'sw', label: 'Swahili',    native: 'Kiswahili' },
];

export const langLabel = (code: LanguageCode | string): string =>
  LANGUAGES.find((l) => l.code === code)?.label || 'English';

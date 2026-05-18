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

export interface SignInResult {
  ok: boolean;
  email?: string;
  error?: 'empty' | 'unauthorized';
}

export interface InviteResult {
  ok: boolean;
  admins?: Admin[];
  error?: 'invalid' | 'duplicate';
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

const delay = (ms = 120) => new Promise<void>((r) => setTimeout(r, ms));

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

const SEED_CONVERSATION: SeedMessage[] = [
  { role: 'facilitator',
    text: "Welcome — I'm so glad we get to talk today. Before we dive in, could you tell me your name and who else is here with you?" },
  { role: 'team',
    text: "I'm Mariana. I'm here with Pablo, Inés, Tomás, and Father Diego. We're five of us today, but our wider team has about twelve people." },
  { role: 'facilitator',
    text: "Thank you, Mariana. That's a meaningful group. Tell me a little about your team — who carries what kind of role?" },
  { role: 'team',
    text: "Pablo and I lead the translation work itself. Inés handles community workshops. Tomás coordinates with the churches in the valley. Father Diego advises on theology." },
  { role: 'facilitator',
    text: "That sounds like real depth. I'd love to hear — when you think about the leaders in your project, how local is that leadership today?" },
  { role: 'team',
    text: "All of us are from the valley. We grew up speaking Quechua. Pablo and I were trained outside, but we came back. The decisions are made here, in our language." },
  { role: 'facilitator',
    text: "That's beautiful to hear. And when you imagine someone new joining your team next year, how would you bring them in?" },
  { role: 'team',
    text: "We've been thinking about that. We don't have a formal program yet. Mostly it's been one of us training someone informally. We know that's a weakness." },
  { role: 'facilitator',
    text: "Thank you for naming that honestly. It takes courage to see clearly. Can you tell me how the churches in your area have responded to the translation work?" },
];

const SCRIPTED_REPLIES: string[] = [
  "That's a meaningful picture to hold. Can you say more about a moment when that became visible — a story, a service, a conversation you remember?",
  "Thank you for sharing that. I want to honor what you just said. As you look at the next year, what feels steady, and what feels less certain?",
  "That's helpful. One last thread before we pause — when you imagine handing this work on someday, what would you want the next team to inherit from you?",
];

const ANDEAN: Interview = {
  id: 'andean',
  project: 'Andean Highlands OBT',
  team: 'Quechua Storytellers',
  language: 'Spanish',
  languageCode: 'es',
  status: 'completed',
  date: '2026-04-09',
  context: {
    respondent: 'Mariana',
    participants: ['Mariana', 'Pablo', 'Inés', 'Tomás', 'Father Diego'],
    languageNote: 'Spanish (Quechua project)',
    teamSize: 12,
    roles: 'Translation leads, community facilitators, church liaison, theological advisor',
  },
  team_report: {
    summary: "Mariana and her team shared a project that is deeply rooted in the Quechua-speaking valley they call home. Leadership is local, decisions are made in the community's language, and the team brings together translation, community work, and theological reflection. The conversation surfaced real strengths around ownership and church engagement, alongside an honest reckoning with the lack of formal training pathways for new team members.",
    strengths: [
      "Leadership is fully local — every team member is from the valley and Quechua is their first language.",
      "A strong multi-disciplinary mix: translation, community workshops, church coordination, and theological advising are all represented.",
      "Decisions about the work are made within the team and within the community, not imposed from outside.",
      "Honest, reflective culture — the team is able to name their own gaps without defensiveness.",
      "Long-standing relationships with valley churches provide a strong distribution and discipleship foundation.",
    ],
    growth: [
      "No formal onboarding or training pathway exists for new team members; succession depends on informal mentorship.",
      "The team has not yet articulated a 3–5 year trajectory that would help them plan resourcing and pace.",
      "Documentation of oral exegetical methods is held mostly in individual memory rather than shared assets.",
    ],
    next_steps: [
      "Sketch a lightweight onboarding outline for the next new team member, even informally.",
      "Schedule a half-day planning conversation to put a 3-year horizon on paper.",
      "Invite Father Diego to facilitate a session capturing the team's exegetical reasoning patterns.",
      "Identify one church partner to deepen collaboration with over the next quarter.",
    ],
    closing: "The depth and honesty in this conversation reflect a team that is grounded and growing. Carry this work forward with confidence — and with the same humility you brought to today's reflection.",
  },
  admin_report: {
    overall: 3.7,
    narrative: "A grounded team with strong local leadership and church engagement, held back by the absence of formal training pathways and an explicit medium-horizon plan.",
    domains: [
      { key: 'leadership', name: 'Local Leadership & Ownership',         score: 4.5, confidence: 5, rationale: 'All decisions made by local team in Quechua; deep rootedness in valley.', risks: ['Single point of failure if Mariana or Pablo step away.'] },
      { key: 'capacity',   name: 'Capacity, Training & Multiplication',  score: 2.5, confidence: 4, rationale: 'Team self-identified absence of formal training pathway.', risks: ['Succession risk; tacit knowledge not transferable.'] },
      { key: 'church',     name: 'Church & Community Engagement',        score: 4.0, confidence: 4, rationale: 'Strong existing church relationships and community workshops via Inés and Tomás.', risks: ["Engagement depends on individuals' relationships, not institutional ties."] },
      { key: 'resources',  name: 'Resources & Oral Exegetical Infrastructure', score: 3.0, confidence: 3, rationale: 'Exegetical reasoning resides in memory and conversation, not in shared artifacts.', risks: ['Loss of accumulated insight if a team member departs.'] },
      { key: 'planning',   name: 'Strategic Planning & Risk Management', score: 2.5, confidence: 4, rationale: 'Team acknowledged absence of articulated 3–5 year horizon.', risks: ['Reactive rather than proactive trajectory; no clear pacing.'] },
      { key: 'collab',     name: 'Collaboration Without Unhealthy Dependency', score: 4.5, confidence: 4, rationale: 'Outside training mentioned for two members, but with clear return-home pattern; not dependency.', risks: ['None significant.'] },
      { key: 'pace',       name: 'Pace & Trajectory (3–5 Year Horizon)', score: 3.0, confidence: 3, rationale: 'Team has intuitive direction but has not externalized a plan.', risks: ['Risk of burnout or drift without explicit pacing.'] },
    ],
    top_risks: [
      'Succession risk concentrated in 2–3 senior team members.',
      'Tacit-only documentation of exegetical methods.',
      'Absence of articulated medium-horizon plan.',
    ],
    actions: [
      'Support the team in drafting a minimal onboarding outline (1–2 pages) within the next quarter.',
      'Sponsor a half-day strategic planning session facilitated externally.',
      'Offer a light template or tool for capturing exegetical reasoning in shareable form.',
      'Affirm and reinforce existing church-engagement patterns; consider a peer-exchange with a nearby OBT team.',
    ],
    quality: { coverage: 7, coverage_total: 7, evidence_items: 11, avg_confidence: 3.9 },
  },
};

const INTERVIEWS: (InterviewSummary | Interview)[] = [
  { id: 'northern', project: 'Northern Highlands OBT',     team: 'Kalenjin Translators',  language: 'Swahili',    languageCode: 'sw', status: 'completed',   date: '2026-04-22' },
  { id: 'amazon',   project: 'Amazon Basin Stories',       team: 'Yanomami Voices',       language: 'Portuguese', languageCode: 'pt', status: 'completed',   date: '2026-04-18' },
  { id: 'coastal',  project: 'Coastal Languages Initiative', team: 'Bahasa Pesisir Team', language: 'Indonesian', languageCode: 'id', status: 'completed',   date: '2026-04-15' },
  { id: 'sahel',    project: 'Sahel Oral Project',         team: 'Équipe Voix du Sahel',  language: 'French',     languageCode: 'fr', status: 'in_progress', date: '2026-05-11' },
  ANDEAN,
  { id: 'lakes',    project: 'Great Lakes Translation',    team: 'Lake Region Team',      language: 'English',    languageCode: 'en', status: 'in_progress', date: '2026-05-12' },
];

let admins: Admin[] = [
  { email: 'shema.apps@ywambt.com',          invited_by: '— (bootstrap)',                       date: '2026-01-04' },
  { email: 'field.director@obt-network.org', invited_by: 'shema.apps@ywambt.com',               date: '2026-02-12' },
  { email: 'regional.coord@obt-network.org', invited_by: 'field.director@obt-network.org',      date: '2026-03-08' },
];

const isEmail = (s: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

function timeStampFor(i: number): string {
  return `${Math.max(1, 18 - i * 2)}m ago`;
}

export async function fetchInterviews(): Promise<InterviewSummary[]> {
  await delay();
  return [...INTERVIEWS].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'in_progress' ? -1 : 1;
    return b.date.localeCompare(a.date);
  });
}

export async function fetchInterview(id: string | null): Promise<Interview> {
  await delay();
  if (!id || id === 'andean') return ANDEAN;
  const meta = INTERVIEWS.find((i) => i.id === id);
  if (!meta) return ANDEAN;
  return {
    ...ANDEAN,
    id: meta.id,
    project: meta.project,
    team: meta.team,
    language: meta.language,
    languageCode: meta.languageCode,
    date: meta.date,
    status: meta.status,
    context: { ...ANDEAN.context },
  };
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  await delay();
  return {
    total: INTERVIEWS.length,
    completed: INTERVIEWS.filter((i) => i.status === 'completed').length,
    inProgress: INTERVIEWS.filter((i) => i.status === 'in_progress').length,
  };
}

export async function signIn(email: string): Promise<SignInResult> {
  await delay(900);
  const trimmed = (email || '').trim();
  if (!trimmed) return { ok: false, error: 'empty' };
  if (trimmed.toLowerCase().includes('denied')) return { ok: false, error: 'unauthorized' };
  await delay(900);
  return { ok: true, email: trimmed };
}

export async function fetchAdmins(): Promise<Admin[]> {
  await delay();
  return [...admins];
}

export async function inviteAdmin(email: string, byEmail?: string | null): Promise<InviteResult> {
  const trimmed = (email || '').trim();
  if (!isEmail(trimmed)) return { ok: false, error: 'invalid' };
  if (admins.some((a) => a.email.toLowerCase() === trimmed.toLowerCase())) {
    return { ok: false, error: 'duplicate' };
  }
  await delay(900);
  admins = [
    {
      email: trimmed,
      invited_by: byEmail || 'shema.apps@ywambt.com',
      date: new Date().toISOString().slice(0, 10),
    },
    ...admins,
  ];
  return { ok: true, admins: [...admins] };
}

export async function startInterview(_session: InterviewSession): Promise<Message[]> {
  await delay(50);
  return SEED_CONVERSATION.map((m, i) => ({ ...m, id: i, time: timeStampFor(i) }));
}

export async function sendInterviewMessage({ scriptIdx }: { scriptIdx: number }): Promise<{ reply: string; nextScriptIdx: number }> {
  await delay(1700);
  const reply = SCRIPTED_REPLIES[Math.min(scriptIdx, SCRIPTED_REPLIES.length - 1)];
  return { reply, nextScriptIdx: scriptIdx + 1 };
}

export async function getInterviewCoverage(messageCount: number): Promise<Pace> {
  await delay(40);
  const boost = Math.max(0, messageCount - SEED_CONVERSATION.length);
  return { coverage: Math.min(1, 0.86 + boost * 0.05), sufficient: true };
}

export async function simulateTranscription(): Promise<string> {
  await delay(1800);
  return "We've had churches in the valley sharing our recordings…";
}

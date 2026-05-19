import type { ReactNode } from 'react';
import { langLabel, type Domain, type InterviewSummary, type Quality } from '../lib/fixtures';
import { useT } from '../lib/i18n';
import {
  BrandMark, ConfidenceGlyph, Eyebrow, FacilitatorAvatar, formatDate, HRule, Icon, IconButton,
  LanguageDot, LanguageMenu, PlayButton, ReassuranceIcon, type ReassuranceIconName, ScoreMeter, scoreTone,
  StatusPill, TeamAvatar,
} from './primitives';
import type { Message as MessagePayload } from '../lib/fixtures';

export function PageHeader({
  children, bordered = false, maxWidth = 'max-w-6xl', topOnly = false, hideLanguageMenu = false,
}: {
  children: ReactNode;
  bordered?: boolean;
  maxWidth?: string;
  topOnly?: boolean;
  hideLanguageMenu?: boolean;
}) {
  const border = bordered ? 'border-b border-earth-700/8' : '';
  const padY = topOnly ? 'pt-6 sm:pt-8' : 'py-4 sm:py-5';
  return (
    <header className={border}>
      <div className={`${maxWidth} mx-auto w-full px-5 sm:px-8 ${padY} flex items-center justify-between gap-3 flex-wrap`}>
        <BrandMark size="sm" subtitle={false} />
        <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
          {children}
          {!hideLanguageMenu && <LanguageMenu />}
        </div>
      </div>
    </header>
  );
}

export function BreadcrumbHeader({
  onBack, backLabel, eyebrow, title, maxWidth = 'max-w-6xl', children, sticky = true, hideLanguageMenu = false,
}: {
  onBack?: () => void;
  backLabel: string;
  eyebrow: ReactNode;
  title: ReactNode;
  maxWidth?: string;
  children?: ReactNode;
  sticky?: boolean;
  hideLanguageMenu?: boolean;
}) {
  const stickyCls = sticky ? 'sticky top-0 z-10' : '';
  return (
    <header className={`border-b border-earth-700/8 bg-cream-100/85 backdrop-blur-sm ${stickyCls}`}>
      <div className={`${maxWidth} mx-auto px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between gap-3 flex-wrap`}>
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <IconButton onClick={onBack} label={backLabel} icon="arrow-left" />
          <div className="min-w-0">
            {eyebrow}
            <div className="font-serif text-[15px] sm:text-[17px] text-earth-800 truncate mt-0.5" style={{ letterSpacing: '-0.01em' }}>
              {title}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {children}
          {!hideLanguageMenu && <LanguageMenu />}
        </div>
      </div>
    </header>
  );
}

export function Section({ eyebrow, delay = 0, children }: { eyebrow: string; delay?: number; children: ReactNode }) {
  return (
    <section className="mt-8 sm:mt-12 animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-baseline gap-3 mb-6">
        <Eyebrow>{eyebrow}</Eyebrow>
        <HRule />
      </div>
      {children}
    </section>
  );
}

export function ResponsiveSection({
  eyebrow, delay = 0, defaultOpen, children,
}: {
  eyebrow: string;
  delay?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <details
        className="sm:hidden mt-8 group animate-fade-up"
        style={{ animationDelay: `${delay}ms` }}
        open={defaultOpen}
      >
        <summary className="flex items-center gap-3 mb-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
          <Eyebrow>{eyebrow}</Eyebrow>
          <HRule />
          <Icon name="chevron" className="w-4 h-4 text-earth-500 shrink-0 transition-transform group-open:rotate-180" />
        </summary>
        <div>{children}</div>
      </details>

      <section className="hidden sm:block mt-12 animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
        <div className="flex items-baseline gap-3 mb-6">
          <Eyebrow>{eyebrow}</Eyebrow>
          <HRule />
        </div>
        {children}
      </section>
    </>
  );
}

export function ReportItem({ accent, children }: { accent?: 'sage' | 'clay'; children: ReactNode }) {
  const dot = accent === 'sage' ? 'bg-sage-500' : accent === 'clay' ? 'bg-clay-500' : 'bg-earth-500';
  return (
    <li className="flex items-start gap-4">
      <span aria-hidden="true" className={`shrink-0 mt-2.5 w-1.5 h-1.5 rounded-full ${dot}`}></span>
      <span className="text-[15.5px] leading-relaxed text-earth-700" style={{ textWrap: 'pretty' as never }}>
        {children}
      </span>
    </li>
  );
}

export function ContextField({
  label, value, span, compact,
}: {
  label: string;
  value: ReactNode;
  span?: 2;
  compact?: boolean;
}) {
  const dtSize = compact ? 'text-[10px]' : 'text-[11px]';
  const ddSize = compact ? 'text-sm text-earth-700' : 'text-earth-700';
  return (
    <div className={span === 2 ? 'sm:col-span-2' : ''}>
      <dt className={`${dtSize} uppercase tracking-[0.14em] text-earth-400 font-medium mb-1`}>
        {label}
      </dt>
      <dd className={ddSize}>{value}</dd>
    </div>
  );
}

export function StatCard({
  label, value, hint, tone,
}: {
  label: string;
  value: number | string;
  hint?: string;
  tone?: 'sage' | 'clay';
}) {
  const dot = tone === 'sage' ? 'bg-sage-500' : tone === 'clay' ? 'bg-clay-500' : 'bg-earth-400';
  return (
    <div className="bg-cream-50 rounded-2xl p-5 ring-1 ring-earth-700/5 shadow-soft">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-earth-500 font-medium">
        <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
        {label}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-serif text-4xl text-earth-800" style={{ letterSpacing: '-0.02em' }}>{value}</span>
        <span className="text-xs text-earth-400">{hint}</span>
      </div>
    </div>
  );
}

export function BadgeItem({
  badge, tone = 'neutral', bodySize = 'sm', children,
}: {
  badge: ReactNode;
  tone?: 'neutral' | 'clay' | 'sage';
  bodySize?: 'sm' | 'md';
  children: ReactNode;
}) {
  const tones = {
    neutral: { bg: 'bg-cream-200', fg: 'text-earth-700', ring: 'ring-earth-700/8' },
    clay:    { bg: 'bg-clay-50',   fg: 'text-clay-700',  ring: 'ring-clay-200' },
    sage:    { bg: 'bg-sage-100',  fg: 'text-sage-700',  ring: 'ring-sage-200' },
  };
  const t = tones[tone];
  const bodyCls = bodySize === 'md'
    ? 'text-[15px] leading-relaxed text-earth-700 pt-0.5'
    : 'text-[14.5px] leading-relaxed text-earth-700';
  return (
    <li className="flex items-start gap-3 sm:gap-4">
      <span className={`shrink-0 w-7 h-7 rounded-full ${t.bg} ${t.fg} ring-1 ${t.ring} text-sm font-serif flex items-center justify-center mt-0.5`}>
        {badge}
      </span>
      <span className={bodyCls} style={{ textWrap: 'pretty' as never }}>
        {children}
      </span>
    </li>
  );
}

export function ToneCardHeader({ tone = 'sage', children }: { tone?: 'sage' | 'clay'; children: ReactNode }) {
  const dot = tone === 'clay' ? 'bg-clay-500' : 'bg-sage-500';
  const fg = tone === 'clay' ? 'text-clay-700' : 'text-sage-700';
  return (
    <div className={`flex items-center gap-2 ${fg} mb-5`}>
      <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      <Eyebrow size="secondary" tone={tone}>{children}</Eyebrow>
    </div>
  );
}

export function ReassuranceLine({
  icon, label, detail,
}: {
  icon: ReassuranceIconName;
  label: string;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div aria-hidden="true" className="w-8 h-8 rounded-full bg-cream-200 flex items-center justify-center text-earth-600 shrink-0 mt-0.5">
        <ReassuranceIcon name={icon} />
      </div>
      <div>
        <div className="text-[15px] font-medium text-earth-700">{label}</div>
        <div className="text-[13px] text-earth-500 mt-0.5">{detail}</div>
      </div>
    </div>
  );
}

export function Message({
  message, playing, onTogglePlay, respondents,
}: {
  message: MessagePayload;
  playing: boolean;
  onTogglePlay: () => void;
  respondents: string[];
}) {
  const { t } = useT();
  const isFac = message.role === 'facilitator';
  const speakerLabel = isFac
    ? t('speakerLabel.facilitator')
    : t('speakerLabel.team', { name: respondents[0] || 'Team' });
  return (
    <div className={`flex items-start gap-3 animate-fade-up ${isFac ? '' : 'flex-row-reverse'}`}>
      {isFac ? <FacilitatorAvatar /> : <TeamAvatar />}
      <div className={`max-w-[90%] sm:max-w-[85%] ${isFac ? '' : 'text-right'}`}>
        <div className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] mb-1 ${isFac ? 'text-earth-400' : 'text-clay-700/80 justify-end'}`}>
          <span>{speakerLabel}</span>
          <span aria-hidden="true" className="text-earth-700/15">·</span>
          <span className="text-earth-400/70 normal-case tracking-normal text-[11px]">{message.time}</span>
        </div>
        <div className={`rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed text-left
          ${isFac
            ? 'bg-cream-50 text-earth-700 rounded-tl-md ring-1 ring-earth-700/5'
            : 'bg-clay-500/10 text-earth-800 rounded-tr-md ring-1 ring-clay-500/15'}`}
          style={{ textWrap: 'pretty' as never }}>
          {message.text}
        </div>
        {isFac && (
          <div className="mt-1.5">
            <PlayButton playing={playing} onClick={onTogglePlay} />
          </div>
        )}
      </div>
    </div>
  );
}

export function PacingHint({ coverage, sufficient }: { coverage: number; sufficient: boolean }) {
  const { t } = useT();
  return (
    <div className="hidden md:flex items-center gap-3 pl-4 pr-2 py-1.5 rounded-full bg-cream-50 ring-1 ring-earth-700/8">
      <CoverageOrb fill={coverage} sufficient={sufficient} />
      <span className="font-serif italic text-[13px] text-earth-600 leading-tight max-w-[260px]" style={{ textWrap: 'balance' as never }}>
        {sufficient ? t('pacingHint.sufficient') : t('pacingHint.listening')}
      </span>
    </div>
  );
}

export function CoverageOrb({ fill, sufficient }: { fill: number; sufficient: boolean }) {
  const pct = Math.round(fill * 100);
  return (
    <div aria-hidden="true" className="relative w-5 h-5 rounded-full overflow-hidden ring-1 ring-earth-700/15 bg-cream-150">
      <div className={`absolute inset-x-0 bottom-0 ${sufficient ? 'bg-sage-500' : 'bg-clay-400'} transition-all duration-700 ease-out`}
        style={{ height: `${pct}%` }}>
      </div>
      {sufficient && (
        <div className="absolute inset-0 rounded-full animate-soft-pulse" style={{ boxShadow: 'inset 0 0 6px rgba(115, 133, 90, 0.5)' }}></div>
      )}
    </div>
  );
}

interface InterviewRowProps {
  iv: InterviewSummary;
  onOpen: () => void;
  onOpenTeam: () => void;
  onComplete?: () => void;
  onView?: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
  completing?: boolean;
  deleting?: boolean;
}

function ViewDeleteButtons({
  onView, onDelete, canDelete, deleting,
}: {
  onView?: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
  deleting?: boolean;
}) {
  const { t } = useT();
  return (
    <>
      {onView && (
        <button
          onClick={onView}
          className="focus-warm text-xs px-4 py-2 rounded-full text-earth-600 hover:text-earth-800 hover:bg-cream-200 transition-colors"
        >
          {t('adminDashboard.view')}
        </button>
      )}
      {canDelete && onDelete && (
        <button
          onClick={onDelete}
          disabled={deleting}
          className={`focus-warm text-xs px-4 py-2 rounded-full text-clay-700 hover:text-clay-800 hover:bg-clay-500/10 transition-colors ${deleting ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {deleting ? t('common.loading') : t('adminDashboard.delete')}
        </button>
      )}
    </>
  );
}

function InterviewRowActions({
  isCompleted, onOpen, onOpenTeam, onComplete, onView, onDelete, canDelete, completing, deleting, layout,
}: {
  isCompleted: boolean;
  onOpen: () => void;
  onOpenTeam: () => void;
  onComplete?: () => void;
  onView?: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
  completing?: boolean;
  deleting?: boolean;
  layout: 'mobile' | 'desktop';
}) {
  const { t } = useT();
  if (!isCompleted) {
    return (
      <div className={layout === 'mobile' ? 'flex flex-col gap-2 pt-1' : 'flex items-center gap-2 flex-wrap justify-end'}>
        <span className="text-xs text-earth-400 italic font-serif pt-1">{t('interviewRow.inConversation')}</span>
        <ViewDeleteButtons onView={onView} onDelete={onDelete} canDelete={canDelete} deleting={deleting} />
        {onComplete && (
          <button
            onClick={onComplete}
            disabled={completing}
            className={`focus-warm text-xs px-4 py-2 rounded-full ring-1 ring-earth-700/15 hover:ring-earth-700/30 hover:bg-cream-100 transition-colors ${completing ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {completing ? t('common.loading') : t('adminDashboard.completeNow')}
          </button>
        )}
      </div>
    );
  }
  if (layout === 'mobile') {
    return (
      <div className="flex flex-col gap-2 pt-1">
        <button onClick={onOpen}
          className="focus-warm w-full text-sm px-4 py-2.5 rounded-full bg-earth-700 text-cream-50 hover:bg-earth-800 transition-colors inline-flex items-center justify-center gap-1.5">
          {t('adminDashboard.openAdminReport')}
          <Icon name="arrow-mini" className="w-3.5 h-3.5" />
        </button>
        <button onClick={onOpenTeam}
          className="focus-warm w-full text-sm px-4 py-2.5 rounded-full text-earth-700 ring-1 ring-earth-700/15 hover:ring-earth-700/30 hover:bg-cream-100 transition-colors">
          {t('adminDashboard.viewTeamReport')}
        </button>
        <div className="flex items-center justify-center gap-2">
          <ViewDeleteButtons onView={onView} onDelete={onDelete} canDelete={canDelete} deleting={deleting} />
        </div>
      </div>
    );
  }
  return (
    <>
      <ViewDeleteButtons onView={onView} onDelete={onDelete} canDelete={canDelete} deleting={deleting} />
      <button onClick={onOpenTeam}
        className="focus-warm text-xs px-4 py-2.5 rounded-full text-earth-600 hover:text-earth-800 hover:bg-cream-200 transition-colors">
        {t('adminDashboard.teamReport')}
      </button>
      <button onClick={onOpen}
        className="focus-warm text-xs px-4 py-2.5 rounded-full bg-earth-700 text-cream-50 hover:bg-earth-800 transition-colors inline-flex items-center gap-1.5">
        {t('adminDashboard.adminReport')}
        <Icon name="arrow-mini" className="w-3 h-3" />
      </button>
    </>
  );
}

export function InterviewRow({ iv, onOpen, onOpenTeam, onComplete, onView, onDelete, canDelete, completing, deleting }: InterviewRowProps) {
  const { t } = useT();
  const isCompleted = iv.status === 'completed';
  const dateLine = isCompleted ? formatDate(iv.date) : t('interviewRow.started', { date: formatDate(iv.date) });
  const langName = langLabel(iv.languageCode);
  return (
    <div className="border-b border-earth-700/5 last:border-b-0 hover:bg-cream-100/60 transition-colors">
      <div className="hidden sm:grid grid-cols-[1.6fr,1.2fr,0.7fr,0.9fr,auto] items-center gap-4 px-5 py-4">
        <div className="min-w-0">
          <div className="font-serif text-[16.5px] text-earth-800 truncate" style={{ letterSpacing: '-0.005em' }}>{iv.project}</div>
          <div className="text-[12.5px] text-earth-500 truncate mt-0.5">{iv.team}</div>
        </div>
        <div className="flex items-center gap-2 text-sm text-earth-600 min-w-0">
          <LanguageDot code={iv.languageCode} />
          <span className="truncate">{langName}</span>
        </div>
        <div><StatusPill status={iv.status} /></div>
        <div className="text-sm text-earth-500">{dateLine}</div>
        <div className="flex items-center justify-end gap-2">
          <InterviewRowActions isCompleted={isCompleted} onOpen={onOpen} onOpenTeam={onOpenTeam} onComplete={onComplete} onView={onView} onDelete={onDelete} canDelete={canDelete} completing={completing} deleting={deleting} layout="desktop" />
        </div>
      </div>

      <div className="sm:hidden px-4 py-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="font-serif text-[16px] text-earth-800" style={{ letterSpacing: '-0.005em' }}>{iv.project}</div>
            <div className="text-[13px] text-earth-500 mt-0.5">{iv.team}</div>
          </div>
          <StatusPill status={iv.status} />
        </div>
        <div className="flex items-center gap-3 text-xs text-earth-500">
          <span className="inline-flex items-center gap-1.5">
            <LanguageDot code={iv.languageCode} />
            <span>{langName}</span>
          </span>
          <span aria-hidden="true" className="text-earth-700/15">·</span>
          <span>{dateLine}</span>
        </div>
        <InterviewRowActions isCompleted={isCompleted} onOpen={onOpen} onOpenTeam={onOpenTeam} onComplete={onComplete} onView={onView} onDelete={onDelete} canDelete={canDelete} completing={completing} deleting={deleting} layout="mobile" />
      </div>
    </div>
  );
}

export function labelForScore(t: (key: string) => string, s: number): string {
  if (s >= 4) return t('scoreLabel.healthy');
  if (s >= 3) return t('scoreLabel.forming');
  if (s >= 2) return t('scoreLabel.vulnerable');
  return t('scoreLabel.atRisk');
}

export function OverallIndex({ score, narrative }: { score: number; narrative?: string }) {
  const { t } = useT();
  const tone = scoreTone(score);
  const pct = (score / 5) * 100;
  return (
    <div className="grid lg:grid-cols-[1fr,1.2fr] gap-6 sm:gap-8 lg:gap-12 items-center mt-2 animate-fade-up" style={{ animationDelay: '40ms' }}>
      <div>
        <Eyebrow size="secondary" tone="earth400">{t('scoreScale.overall')}</Eyebrow>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-serif text-[56px] sm:text-[72px] lg:text-[88px] leading-none text-earth-800" style={{ letterSpacing: '-0.04em' }}>
            {score.toFixed(1)}
          </span>
          <span className="font-serif text-xl sm:text-2xl text-earth-400">/ 5.0</span>
        </div>
        <div className={`mt-5 inline-flex items-center gap-2 ${tone.fg} text-sm`}>
          <span aria-hidden="true" className={`w-2 h-2 rounded-full ${tone.bar}`}></span>
          <span className="font-medium">{labelForScore(t, score)}</span>
        </div>
      </div>
      <div>
        {narrative && (
          <p className="font-serif text-[17px] sm:text-[20px] leading-[1.5] text-earth-700" style={{ textWrap: 'pretty' as never, letterSpacing: '-0.003em' }}>
            {narrative}
          </p>
        )}
        <div className="mt-6">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {Array.from({ length: 50 }).map((_, i) => (
              <span key={i} className={`flex-1 h-2 rounded-full ${i < Math.round(pct / 2) ? tone.bar : 'bg-earth-700/8'}`}></span>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.14em] text-earth-400">
            <span>{t('scoreScale.atRisk')}</span>
            <span>{t('scoreScale.forming')}</span>
            <span>{t('scoreScale.thriving')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DomainCard({ d, delay }: { d: Domain; delay: number }) {
  const { t } = useT();
  const tone = scoreTone(d.score);
  return (
    <div className="bg-cream-50 rounded-2xl p-5 sm:p-6 ring-1 ring-earth-700/5 shadow-soft animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3">
        <h3 className="font-serif text-[15px] sm:text-[17px] text-earth-800 leading-snug" style={{ letterSpacing: '-0.005em' }}>
          {d.name}
        </h3>
        <div className={`shrink-0 ${tone.bg} ${tone.fg} rounded-xl px-3 py-1.5 text-right`}>
          <div className="font-serif text-xl sm:text-2xl leading-none" style={{ letterSpacing: '-0.02em' }}>
            {d.score.toFixed(1)}
          </div>
          <div className="text-[10px] uppercase tracking-[0.12em] mt-0.5 opacity-80">{t('domain.outOf')}</div>
        </div>
      </div>

      <ScoreMeter score={d.score} accent={tone.bar} />

      <div className="mt-3 flex items-center gap-4 text-[12px] text-earth-500">
        <span className="inline-flex items-center gap-1.5">
          <ConfidenceGlyph confidence={d.confidence} />
          <span>{t('domain.confidence', { value: d.confidence })}</span>
        </span>
      </div>

      <p className="mt-4 text-[14px] leading-relaxed text-earth-700" style={{ textWrap: 'pretty' as never }}>
        {d.rationale}
      </p>

      {d.risks?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-earth-700/8">
          <Eyebrow size="micro" tone="earth400" className="block mb-2">{t('domain.risks')}</Eyebrow>
          <ul className="space-y-1.5">
            {d.risks.map((r, i) => {
              const significant = !r.toLowerCase().includes('none');
              return (
                <li key={i} className="flex items-start gap-2 text-[13px] text-earth-600">
                  <span aria-hidden="true" className={`shrink-0 mt-1.5 w-1 h-1 rounded-full ${significant ? 'bg-clay-500' : 'bg-sage-500'}`}></span>
                  <span style={{ textWrap: 'pretty' as never }}>{r}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export function QualityRow({ quality }: { quality: Quality }) {
  const { t } = useT();
  const items = [
    { label: t('qualityRow.coverage'),      value: `${quality.coverage} / ${quality.coverage_total}`, hint: t('qualityRow.coverageHint'),      ratio: quality.coverage / quality.coverage_total },
    { label: t('qualityRow.evidence'),      value: quality.evidence_items,                            hint: t('qualityRow.evidenceHint'),      ratio: Math.min(1, quality.evidence_items / 14) },
    { label: t('qualityRow.avgConfidence'), value: quality.avg_confidence.toFixed(1) + ' / 5',        hint: t('qualityRow.avgConfidenceHint'), ratio: quality.avg_confidence / 5 },
  ];
  return (
    <div className="grid sm:grid-cols-3 gap-4 animate-fade-up" style={{ animationDelay: '540ms' }}>
      {items.map((it, i) => (
        <div key={i} className="bg-cream-50 rounded-2xl p-5 sm:p-6 ring-1 ring-earth-700/5 shadow-soft">
          <Eyebrow size="tertiary" tone="earth500">{it.label}</Eyebrow>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl text-earth-800" style={{ letterSpacing: '-0.02em' }}>{it.value}</span>
            <span className="text-xs text-earth-400">{it.hint}</span>
          </div>
          <div className="mt-4">
            <div className="h-1 rounded-full bg-earth-700/8 overflow-hidden" aria-hidden="true">
              <div className="h-full bg-earth-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.round(it.ratio * 100)}%` }}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

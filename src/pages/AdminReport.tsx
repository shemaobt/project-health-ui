import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import type { Interview } from '../lib/fixtures';
import { interviewFromAdminReport } from '../lib/adapters';
import { reportsApi } from '../lib/api';
import { useT } from '../lib/i18n';
import {
  Card, DottedEyebrow, Eyebrow, formatDate, Spinner,
} from '../components/primitives';
import {
  BadgeItem, BreadcrumbHeader, ContextField, DomainCard, OverallIndex, QualityRow, ToneCardHeader,
} from '../components/composites';
import { DownloadPdfButton, printReport, usePdfFilename } from '../components/pdf';
import { Icon } from '../components/primitives';
import TeamReport from './TeamReport';

interface AdminReportProps {
  reportId: string;
}

export default function AdminReport({ reportId }: AdminReportProps) {
  const { t } = useT();
  const [, setLocation] = useLocation();
  const filenameFor = usePdfFilename();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'admin' | 'team'>('admin');

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const report = await reportsApi.getAdminReport(reportId);
        const summaryDto = {
          id: report.interview_id,
          project_name: '',
          team_name: '',
          language: report.language,
          status: 'completed' as const,
          created_at: report.created_at,
          completed_at: report.created_at,
        };
        const adapted = interviewFromAdminReport(summaryDto, report);
        if (!cancelled) setInterview(adapted);
      } catch (e) {
        console.error('getAdminReport failed', e);
        if (!cancelled) setError(t('common.error'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [reportId, t]);

  const exportFor = async (target: 'team' | 'admin') => {
    if (!interview) return;
    const previous = view;
    const switched = previous !== target;
    if (switched) {
      setView(target);
      await new Promise<void>((r) => requestAnimationFrame(() => setTimeout(r, 80)));
    }
    const elementId = target === 'team' ? 'team-report-document' : 'admin-report-document';
    printReport({ elementId, filename: filenameFor(interview, target) });
    if (switched) setView(previous);
  };

  const goBack = () => setLocation('/admin');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner /> <span className="ml-2 text-earth-500 text-sm">{t('common.loading')}</span>
      </div>
    );
  }
  if (error || !interview) {
    return (
      <div className="min-h-screen flex items-center justify-center text-earth-500 text-sm">
        {error ?? t('common.error')}
      </div>
    );
  }

  const I = interview;

  return (
    <div className="min-h-screen screen-enter">
      <BreadcrumbHeader
        onBack={goBack}
        backLabel={t('ariaLabel.backToDashboard')}
        eyebrow={<Eyebrow size="breadcrumb" tone="earth400">{t('adminReport.interviewEyebrow', { date: formatDate(I.date) })}</Eyebrow>}
        title={<>{I.project || '—'} <span aria-hidden="true" className="text-earth-400">·</span> {I.team || '—'}</>}
      >
        <ViewToggle view={view} setView={setView} />
        <div className="flex items-center gap-2">
          <DownloadPdfButton onClick={() => exportFor('team')}>{t('pdf.teamPdf')}</DownloadPdfButton>
          <DownloadPdfButton onClick={() => exportFor('admin')}>{t('pdf.adminPdf')}</DownloadPdfButton>
        </div>
      </BreadcrumbHeader>

      {view === 'team'
        ? <TeamReport reportId={reportId} embedded embeddedInterview={I} onBackToAdmin={goBack} />
        : <AdminReportBody I={I} />}
    </div>
  );
}

function ViewToggle({ view, setView }: { view: 'admin' | 'team'; setView: (v: 'admin' | 'team') => void }) {
  const { t } = useT();
  const opts: Array<{ id: 'team' | 'admin'; label: string }> = [
    { id: 'team',  label: t('adminReport.toggleTeam') },
    { id: 'admin', label: t('adminReport.toggleAdmin') },
  ];
  return (
    <div role="tablist" aria-label={t('adminReport.toggleAriaLabel')} className="inline-flex bg-cream-200 rounded-full p-1 shrink-0">
      {opts.map((o) => {
        const active = view === o.id;
        return (
          <button key={o.id}
            role="tab"
            aria-selected={active}
            onClick={() => setView(o.id)}
            className={`focus-warm relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
              ${active ? 'bg-earth-700 text-cream-50 shadow-soft' : 'text-earth-600 hover:text-earth-800'}`}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function AdminReportBody({ I }: { I: Interview }) {
  const { t } = useT();
  const R = I.admin_report;
  const C = I.context;

  return (
    <article id="admin-report-document" className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
      <DottedEyebrow className="mb-4 animate-fade-up">{t('adminReport.confidential')}</DottedEyebrow>

      <OverallIndex score={R.overall} narrative={R.narrative} />

      <Card className="p-5 sm:p-6 mt-8 sm:mt-10 animate-fade-up" style={{ animationDelay: '120ms' }}>
        <Eyebrow size="secondary" tone="earth400" className="block mb-4">{t('adminReport.contextHeading')}</Eyebrow>
        <dl className="grid sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-4 text-sm">
          <ContextField compact label={t('adminReport.contextRespondent')}   value={C.respondent || '—'} />
          <ContextField compact label={t('adminReport.contextParticipants')} value={t('adminReport.participantCount', { count: C.participants.length })} />
          <ContextField compact label={t('adminReport.contextLanguage')}     value={C.languageNote || '—'} />
          <ContextField compact label={t('adminReport.contextTeamSize')}     value={String(C.teamSize || '—')} />
          <ContextField compact label={t('adminReport.contextProject')}      value={I.project || '—'} />
          <ContextField compact label={t('adminReport.contextTeam')}         value={I.team || '—'} />
        </dl>
      </Card>

      <SectionTitle eyebrow={t('adminReport.domainsEyebrow')} title={t('adminReport.domainsTitle')} delay={160} />
      <div className="grid md:grid-cols-2 gap-4">
        {R.domains.map((d, i) => (
          <DomainCard key={d.key} d={d} delay={180 + i * 30} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8 sm:mt-12">
        <Card className="p-5 sm:p-7 animate-fade-up" style={{ animationDelay: '420ms' }}>
          <ToneCardHeader tone="clay">{t('adminReport.topRisks')}</ToneCardHeader>
          <ol className="space-y-3.5">
            {R.top_risks.map((r, i) => (
              <BadgeItem key={i} badge={i + 1} tone="clay">{r}</BadgeItem>
            ))}
          </ol>
        </Card>

        <Card className="p-5 sm:p-7 animate-fade-up" style={{ animationDelay: '460ms' }}>
          <ToneCardHeader tone="sage">{t('adminReport.actions')}</ToneCardHeader>
          <ul className="space-y-3.5">
            {R.actions.map((a, i) => (
              <BadgeItem key={i} badge={<Icon name="check-mini" className="w-3.5 h-3.5" strokeWidth={2} />} tone="sage">
                {a}
              </BadgeItem>
            ))}
          </ul>
        </Card>
      </div>

      <SectionTitle eyebrow={t('adminReport.qualityEyebrow')} title={t('adminReport.qualityTitle')} delay={500} />
      <QualityRow quality={R.quality} />

      <p className="mt-10 sm:mt-14 text-center text-xs text-earth-400 font-serif italic" style={{ textWrap: 'balance' as never }}>
        {t('adminReport.footerNote')}
      </p>
    </article>
  );
}

function SectionTitle({ eyebrow, title, delay = 0 }: { eyebrow: string; title: string; delay?: number }) {
  return (
    <div className="mt-8 sm:mt-12 mb-5 sm:mb-6 animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <Eyebrow tone="earth400" className="block">{eyebrow}</Eyebrow>
      <h2 className="font-serif text-xl sm:text-2xl text-earth-800 mt-1" style={{ letterSpacing: '-0.012em' }}>{title}</h2>
    </div>
  );
}

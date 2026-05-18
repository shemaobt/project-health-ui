import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import type { Interview, InterviewSummary } from '../lib/fixtures';
import { interviewFromTeamReport } from '../lib/adapters';
import { reportsApi } from '../lib/api';
import { useT } from '../lib/i18n';
import {
  BrandMark, Card, DottedEyebrow, Eyebrow, formatDate, PrimaryButton, SecondaryButton, SingleDotEyebrow, Spinner,
} from '../components/primitives';
import {
  BadgeItem, ContextField, ReportItem, ResponsiveSection, Section,
} from '../components/composites';
import { DownloadPdfButton, printReport, usePdfFilename } from '../components/pdf';

interface TeamReportProps {
  reportId: string;
  embedded?: boolean;
  embeddedInterview?: Interview;
  onBackToAdmin?: () => void;
}

export default function TeamReport({
  reportId,
  embedded = false,
  embeddedInterview,
  onBackToAdmin,
}: TeamReportProps) {
  const { t } = useT();
  const [, setLocation] = useLocation();
  const filenameFor = usePdfFilename();

  const [interview, setInterview] = useState<Interview | null>(embeddedInterview ?? null);
  const [loading, setLoading] = useState(!embedded);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (embedded) return;
    let cancelled = false;
    void (async () => {
      try {
        setLoading(true);
        const report = await reportsApi.getTeamReport(reportId);
        const summary: InterviewSummary = {
          id: report.interview_id,
          project: '',
          team: '',
          language: '',
          languageCode: report.language,
          status: 'completed',
          date: report.created_at.slice(0, 10),
        };
        const summaryDto = {
          id: report.interview_id,
          project_name: '',
          team_name: '',
          language: report.language,
          status: 'completed' as const,
          created_at: report.created_at,
          completed_at: report.created_at,
        };
        const adapted = interviewFromTeamReport(summaryDto, report);
        adapted.project = summary.project || adapted.project || '—';
        adapted.team = summary.team || adapted.team || '—';
        if (!cancelled) setInterview(adapted);
      } catch (e) {
        console.error('getTeamReport failed', e);
        if (!cancelled) setError(t('common.error'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [reportId, embedded, t]);

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
  const R = I.team_report;
  const C = I.context;

  const handleExport = () => printReport({
    elementId: 'team-report-document',
    filename: filenameFor(I, 'team'),
  });

  const goHome = () => setLocation('/');

  return (
    <div className="min-h-screen screen-enter">
      <header className="border-b border-earth-700/8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3 flex-wrap">
          <BrandMark size="sm" subtitle={false} />
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {embedded && onBackToAdmin && (
              <SecondaryButton onClick={onBackToAdmin} className="!px-4 !py-2 text-xs">
                {t('common.backToDashboard')}
              </SecondaryButton>
            )}
            {!embedded && (
              <DownloadPdfButton onClick={handleExport} />
            )}
            {!embedded && (
              <Link to="/">
                <SecondaryButton className="!px-4 !py-2 text-xs">
                  {t('common.returnHome')}
                </SecondaryButton>
              </Link>
            )}
          </div>
        </div>
      </header>

      <article id="team-report-document" className="max-w-3xl mx-auto px-5 sm:px-10 py-10 sm:py-14">
        <div className="mb-10 animate-fade-up">
          <SingleDotEyebrow dot="sage" className="mb-5">
            {t('teamReport.dateEyebrow', { date: formatDate(I.date) })}
          </SingleDotEyebrow>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-earth-800 leading-[1.05]" style={{ letterSpacing: '-0.02em', textWrap: 'balance' as never }}>
            {t('teamReport.titleBefore')} <span className="italic text-clay-600">{I.team || C.respondent || '—'}</span>{t('teamReport.titleAfter')}
          </h1>
          <p className="sm:hidden mt-4 text-earth-500" style={{ textWrap: 'pretty' as never }}>
            {t('teamReport.mobileLede', { project: I.project || '—' })}
          </p>
          <p className="hidden sm:block mt-5 text-earth-500 max-w-xl" style={{ textWrap: 'pretty' as never }}>
            {t('teamReport.desktopLedeBefore')} <span className="text-earth-700">{I.project || '—'}</span>{t('teamReport.desktopLedeAfter')}
          </p>
        </div>

        <Card className="p-5 sm:p-7 mb-10 sm:mb-12 animate-fade-up" style={{ animationDelay: '80ms' }}>
          <Eyebrow size="secondary" tone="earth400" className="block mb-4">{t('teamReport.contextHeading')}</Eyebrow>
          <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <ContextField label={t('teamReport.contextRespondent')}   value={C.respondent || '—'} />
            <ContextField label={t('teamReport.contextLanguage')}     value={C.languageNote || '—'} />
            <ContextField label={t('teamReport.contextParticipants')} value={C.participants.join(', ') || '—'} />
            <ContextField label={t('teamReport.contextTeamSize')}     value={t('teamReport.teamSizeValue', { count: C.teamSize })} />
            <ContextField label={t('teamReport.contextProject')}      value={I.project || '—'} />
            <ContextField label={t('teamReport.contextTeam')}         value={I.team || '—'} />
            <ContextField label={t('teamReport.contextRoles')}        value={C.roles || '—'} span={2} />
          </dl>
        </Card>

        <Section eyebrow={t('teamReport.sectionWhatWeHeard')} delay={120}>
          <p className="font-serif text-[18px] sm:text-[22px] lg:text-[23px] leading-[1.55] text-earth-700" style={{ textWrap: 'pretty' as never, letterSpacing: '-0.005em' }}>
            {R.summary}
          </p>
        </Section>

        <ResponsiveSection eyebrow={t('teamReport.sectionStrengths')} delay={160} defaultOpen>
          <ul className="space-y-4">
            {R.strengths.map((s, i) => (
              <ReportItem key={i} accent="sage">{s}</ReportItem>
            ))}
          </ul>
        </ResponsiveSection>

        <ResponsiveSection eyebrow={t('teamReport.sectionGrowth')} delay={200}>
          <p className="text-sm text-earth-500 mb-5 font-serif italic">
            {t('teamReport.growthDisclaimer')}
          </p>
          <ul className="space-y-4">
            {R.growth.map((g, i) => (
              <ReportItem key={i} accent="clay">{g}</ReportItem>
            ))}
          </ul>
        </ResponsiveSection>

        <ResponsiveSection eyebrow={t('teamReport.sectionNextSteps')} delay={240}>
          <ol className="space-y-3">
            {R.next_steps.map((s, i) => (
              <BadgeItem key={i} badge={i + 1} tone="neutral" bodySize="md">{s}</BadgeItem>
            ))}
          </ol>
        </ResponsiveSection>

        <div className="mt-12 sm:mt-16 animate-fade-up" style={{ animationDelay: '280ms' }}>
          <div className="border-l-2 border-clay-400 pl-6 sm:pl-8 py-2">
            <p className="font-serif italic text-[17px] sm:text-[20px] lg:text-[22px] leading-[1.5] text-earth-700" style={{ textWrap: 'pretty' as never }}>
              {R.closing}
            </p>
          </div>
          <DottedEyebrow className="mt-8">{t('teamReport.closingFooter')}</DottedEyebrow>
        </div>

        {!embedded && (
          <div data-pdf-hide className="mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between border-t border-earth-700/8 pt-8">
            <p className="text-sm text-earth-500 max-w-md" style={{ textWrap: 'pretty' as never }}>
              {t('teamReport.shareNote')}
            </p>
            <PrimaryButton onClick={goHome}>{t('common.returnHome')}</PrimaryButton>
          </div>
        )}
      </article>
    </div>
  );
}

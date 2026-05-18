import type { Interview } from '../lib/fixtures';
import { useT } from '../lib/i18n';
import {
  BrandMark, Card, DottedEyebrow, Eyebrow, formatDate, PrimaryButton, SecondaryButton, SingleDotEyebrow,
} from '../components/primitives';
import {
  BadgeItem, ContextField, ReportItem, ResponsiveSection, Section,
} from '../components/composites';
import { DownloadPdfButton, printReport, usePdfFilename } from '../components/pdf';

interface TeamReportProps {
  interview: Interview;
  onHome: () => void;
  onBack?: () => void;
  showBackToAdmin?: boolean;
  showPdfButton?: boolean;
}

export default function TeamReport({ interview, onHome, onBack, showBackToAdmin, showPdfButton = true }: TeamReportProps) {
  const { t } = useT();
  const filenameFor = usePdfFilename();
  const I = interview;
  const R = I.team_report;
  const C = I.context;

  const handleExport = () => printReport({
    elementId: 'team-report-document',
    filename: filenameFor(I, 'team'),
  });

  return (
    <div className="min-h-screen screen-enter">
      <header className="border-b border-earth-700/8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3 flex-wrap">
          <BrandMark size="sm" subtitle={false} />
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {showBackToAdmin && (
              <SecondaryButton onClick={onBack} className="!px-4 !py-2 text-xs">
                {t('common.backToDashboard')}
              </SecondaryButton>
            )}
            {showPdfButton && (
              <DownloadPdfButton onClick={handleExport} />
            )}
            <SecondaryButton onClick={onHome} className="!px-4 !py-2 text-xs">
              {t('common.returnHome')}
            </SecondaryButton>
          </div>
        </div>
      </header>

      <article id="team-report-document" className="max-w-3xl mx-auto px-5 sm:px-10 py-10 sm:py-14">
        <div className="mb-10 animate-fade-up">
          <SingleDotEyebrow dot="sage" className="mb-5">
            {t('teamReport.dateEyebrow', { date: formatDate(I.date) })}
          </SingleDotEyebrow>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-earth-800 leading-[1.05]" style={{ letterSpacing: '-0.02em', textWrap: 'balance' as never }}>
            {t('teamReport.titleBefore')} <span className="italic text-clay-600">{I.team}</span>{t('teamReport.titleAfter')}
          </h1>
          <p className="sm:hidden mt-4 text-earth-500" style={{ textWrap: 'pretty' as never }}>
            {t('teamReport.mobileLede', { project: I.project })}
          </p>
          <p className="hidden sm:block mt-5 text-earth-500 max-w-xl" style={{ textWrap: 'pretty' as never }}>
            {t('teamReport.desktopLedeBefore')} <span className="text-earth-700">{I.project}</span>{t('teamReport.desktopLedeAfter')}
          </p>
        </div>

        <Card className="p-5 sm:p-7 mb-10 sm:mb-12 animate-fade-up" style={{ animationDelay: '80ms' }}>
          <Eyebrow size="secondary" tone="earth400" className="block mb-4">{t('teamReport.contextHeading')}</Eyebrow>
          <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <ContextField label={t('teamReport.contextRespondent')}   value={C.respondent} />
            <ContextField label={t('teamReport.contextLanguage')}     value={C.languageNote} />
            <ContextField label={t('teamReport.contextParticipants')} value={C.participants.join(', ')} />
            <ContextField label={t('teamReport.contextTeamSize')}     value={t('teamReport.teamSizeValue', { count: C.teamSize })} />
            <ContextField label={t('teamReport.contextProject')}      value={I.project} />
            <ContextField label={t('teamReport.contextTeam')}         value={I.team} />
            <ContextField label={t('teamReport.contextRoles')}        value={C.roles} span={2} />
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

        <div data-pdf-hide className="mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between border-t border-earth-700/8 pt-8">
          <p className="text-sm text-earth-500 max-w-md" style={{ textWrap: 'pretty' as never }}>
            {t('teamReport.shareNote')}
          </p>
          <PrimaryButton onClick={onHome}>{t('common.returnHome')}</PrimaryButton>
        </div>
      </article>
    </div>
  );
}

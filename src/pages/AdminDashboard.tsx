import {
  fetchDashboardStats, fetchInterviews, type DashboardStats, type InterviewSummary,
} from '../lib/api';
import { useFetch } from '../lib/hooks';
import { useT } from '../lib/i18n';
import {
  Card, DottedEyebrow, Eyebrow, GhostButton, Icon, SecondaryButton,
} from '../components/primitives';
import { InterviewRow, PageHeader, StatCard } from '../components/composites';

interface AdminDashboardProps {
  adminEmail: string;
  onOpenReport: (id: string, view: 'admin' | 'team') => void;
  onInviteAdmin: () => void;
  onSignOut: () => void;
}

const EMPTY_STATS: DashboardStats = { total: 0, completed: 0, inProgress: 0 };

export default function AdminDashboard({
  adminEmail, onOpenReport, onInviteAdmin, onSignOut,
}: AdminDashboardProps) {
  const { t } = useT();
  const data = useFetch(
    () => Promise.all([fetchInterviews(), fetchDashboardStats()])
      .then(([list, stats]) => ({ list, stats })),
    [],
  );
  const interviews: InterviewSummary[] = data?.list || [];
  const stats: DashboardStats = data?.stats || EMPTY_STATS;

  return (
    <div className="min-h-screen screen-enter">
      <PageHeader bordered>
        <div className="text-right hidden sm:block">
          <Eyebrow size="tertiary" tone="earth400" className="block">{t('adminDashboard.signedInAs')}</Eyebrow>
          <div className="text-sm text-earth-700">{adminEmail}</div>
        </div>
        <GhostButton onClick={onSignOut}>{t('common.signOut')}</GhostButton>
      </PageHeader>

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 animate-fade-up">
          <div>
            <DottedEyebrow className="mb-3">{t('adminDashboard.eyebrow')}</DottedEyebrow>
            <h1 className="font-serif text-3xl sm:text-4xl text-earth-800" style={{ letterSpacing: '-0.015em' }}>
              {t('adminDashboard.title')}
            </h1>
            <p className="mt-3 text-earth-500 max-w-xl" style={{ textWrap: 'pretty' as never }}>
              {t('adminDashboard.intro')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SecondaryButton onClick={onInviteAdmin}>
              <Icon name="plus" />
              {t('adminDashboard.invite')}
            </SecondaryButton>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8 sm:mb-10 animate-fade-up" style={{ animationDelay: '80ms' }}>
          <StatCard label={t('adminDashboard.statTotalLabel')}      value={stats.total}      hint={t('adminDashboard.statTotalHint')} />
          <StatCard label={t('adminDashboard.statCompletedLabel')}  value={stats.completed}  hint={t('adminDashboard.statCompletedHint')}  tone="sage" />
          <StatCard label={t('adminDashboard.statInProgressLabel')} value={stats.inProgress} hint={t('adminDashboard.statInProgressHint')} tone="clay" />
        </div>

        <Card className="p-1.5 animate-fade-up" style={{ animationDelay: '140ms' }}>
          <div className="px-5 py-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-earth-800">{t('adminDashboard.listTitle')}</h2>
            <div className="text-xs text-earth-400">{t('adminDashboard.listTotal', { count: stats.total })}</div>
          </div>
          <div className="border-t border-earth-700/8">
            {interviews.map((iv) => (
              <InterviewRow
                key={iv.id}
                iv={iv}
                onOpen={() => onOpenReport(iv.id, 'admin')}
                onOpenTeam={() => onOpenReport(iv.id, 'team')}
              />
            ))}
          </div>
        </Card>

        <p className="mt-8 text-center text-xs text-earth-400 font-serif italic" style={{ textWrap: 'balance' as never }}>
          {t('adminDashboard.footerNote')}
        </p>
      </main>
    </div>
  );
}

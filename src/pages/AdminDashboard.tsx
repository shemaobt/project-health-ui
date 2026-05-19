import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { adminApi } from '../lib/api';
import { interviewSummariesAndReports } from '../lib/adapters';
import type { DashboardStats, InterviewSummary } from '../lib/fixtures';
import { useT } from '../lib/i18n';
import { useAuthStore } from '../lib/stores/authStore';
import {
  Card, DottedEyebrow, Eyebrow, GhostButton, Icon, SecondaryButton, Spinner,
} from '../components/primitives';
import { InterviewRow, PageHeader, StatCard } from '../components/composites';

const EMPTY_STATS: DashboardStats = { total: 0, completed: 0, inProgress: 0 };

export default function AdminDashboard() {
  const { t } = useT();
  const [, setLocation] = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isPlatformAdmin = user?.is_platform_admin ?? false;

  const [interviews, setInterviews] = useState<InterviewSummary[]>([]);
  const [reportByInterview, setReportByInterview] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refresh = async () => {
    const dash = await adminApi.getDashboard();
    const { summaries, reportByInterview: map } = interviewSummariesAndReports(
      dash.interviews,
      dash.reports,
    );
    setInterviews(summaries);
    setReportByInterview(map);
  };

  const handleDelete = async (iv: InterviewSummary) => {
    if (deletingId) return;
    const confirmed = window.confirm(
      t('adminDashboard.confirmDelete', { project: iv.project }),
    );
    if (!confirmed) return;
    setDeletingId(iv.id);
    try {
      await adminApi.deleteInterview(iv.id);
      await refresh();
    } catch (e) {
      console.error('deleteInterview failed', e);
      alert(t('adminDashboard.deleteError'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleCompleteNow = async (interviewId: string) => {
    if (completingId) return;
    setCompletingId(interviewId);
    try {
      await adminApi.adminForceCompleteInterview(interviewId);
      await refresh();
    } catch (e) {
      console.error('adminForceCompleteInterview failed', e);
      alert(t('adminDashboard.completeNowError'));
    } finally {
      setCompletingId(null);
    }
  };

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const dash = await adminApi.getDashboard();
        const { summaries, reportByInterview: map } = interviewSummariesAndReports(
          dash.interviews,
          dash.reports,
        );
        if (!cancelled) {
          setInterviews(summaries);
          setReportByInterview(map);
        }
      } catch (e) {
        console.error('getDashboard failed', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const stats: DashboardStats = {
    total: interviews.length,
    completed: interviews.filter((i) => i.status === 'completed').length,
    inProgress: interviews.filter((i) => i.status === 'in_progress').length,
  };
  const safeStats = interviews.length === 0 ? EMPTY_STATS : stats;

  const openReport = (interviewId: string) => {
    const reportId = reportByInterview.get(interviewId);
    if (reportId) setLocation(`/admin/reports/${reportId}`);
  };

  const onSignOut = async () => {
    await logout();
    setLocation('/login');
  };

  return (
    <div className="min-h-screen screen-enter">
      <PageHeader bordered>
        <div className="text-right hidden sm:block">
          <Eyebrow size="tertiary" tone="earth400" className="block">{t('adminDashboard.signedInAs')}</Eyebrow>
          <div className="text-sm text-earth-700">{user?.email}</div>
        </div>
        <GhostButton onClick={() => void onSignOut()}>{t('common.signOut')}</GhostButton>
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
          <div className="flex items-center gap-3 flex-wrap">
            {isPlatformAdmin && (
              <SecondaryButton onClick={() => setLocation('/admin/prompts')}>
                <Icon name="plus" />
                {t('adminDashboard.managePrompts')}
              </SecondaryButton>
            )}
            <SecondaryButton onClick={() => setLocation('/admin/invite')}>
              <Icon name="plus" />
              {t('adminDashboard.invite')}
            </SecondaryButton>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8 sm:mb-10 animate-fade-up" style={{ animationDelay: '80ms' }}>
          <StatCard label={t('adminDashboard.statTotalLabel')}      value={safeStats.total}      hint={t('adminDashboard.statTotalHint')} />
          <StatCard label={t('adminDashboard.statCompletedLabel')}  value={safeStats.completed}  hint={t('adminDashboard.statCompletedHint')}  tone="sage" />
          <StatCard label={t('adminDashboard.statInProgressLabel')} value={safeStats.inProgress} hint={t('adminDashboard.statInProgressHint')} tone="clay" />
        </div>

        <Card className="p-1.5 animate-fade-up" style={{ animationDelay: '140ms' }}>
          <div className="px-5 py-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-earth-800">{t('adminDashboard.listTitle')}</h2>
            <div className="text-xs text-earth-400">{t('adminDashboard.listTotal', { count: safeStats.total })}</div>
          </div>
          <div className="border-t border-earth-700/8">
            {loading && (
              <div className="px-5 py-6 flex items-center gap-2 text-earth-500 text-sm">
                <Spinner /> {t('common.loading')}
              </div>
            )}
            {!loading && interviews.map((iv) => (
              <InterviewRow
                key={iv.id}
                iv={iv}
                onOpen={() => openReport(iv.id)}
                onOpenTeam={() => openReport(iv.id)}
                onComplete={() => void handleCompleteNow(iv.id)}
                onView={() => setLocation(`/admin/interviews/${iv.id}`)}
                onDelete={() => void handleDelete(iv)}
                canDelete={isPlatformAdmin}
                completing={completingId === iv.id}
                deleting={deletingId === iv.id}
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

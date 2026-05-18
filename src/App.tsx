import { useState } from 'react';
import { fetchInterview, type Interview, type InterviewSession, type LanguageCode } from './lib/api';
import { useFetch } from './lib/hooks';
import { I18nProvider } from './lib/i18n';
import AdminDashboard from './pages/AdminDashboard';
import AdminReport from './pages/AdminReport';
import AdminSignIn from './pages/AdminSignIn';
import Completion from './pages/Completion';
import InterviewPage from './pages/Interview';
import InviteAdmin from './pages/InviteAdmin';
import TeamReport from './pages/TeamReport';
import Welcome from './pages/Welcome';

type Screen =
  | 'welcome'
  | 'interview'
  | 'completion'
  | 'team-report'
  | 'admin-signin'
  | 'admin-dashboard'
  | 'admin-report'
  | 'invite-admin';

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reportView, setReportView] = useState<'admin' | 'team'>('admin');

  const andean = useFetch<Interview>(() => fetchInterview('andean'), []);
  const selectedInterview = useFetch<Interview | null>(
    () => (selectedId ? fetchInterview(selectedId) : Promise.resolve(null)),
    [selectedId],
  );

  const begin = (s: { lang: LanguageCode; project: string; team: string }) => {
    setSession({
      lang: s.lang,
      project: s.project,
      team: s.team,
      participants: andean?.context.participants || [],
    });
    setScreen('interview');
  };

  function renderScreen() {
    if (!andean) return null;
    switch (screen) {
      case 'welcome':
        return <Welcome onBegin={begin} onAdminSignIn={() => setScreen('admin-signin')} />;

      case 'interview':
        if (!session) return null;
        return (
          <InterviewPage
            session={session}
            onExit={() => setScreen('welcome')}
            onFinish={() => setScreen('completion')}
          />
        );

      case 'completion':
        return <Completion onReady={() => setScreen('team-report')} />;

      case 'team-report':
        return <TeamReport interview={andean} onHome={() => setScreen('welcome')} />;

      case 'admin-signin':
        return (
          <AdminSignIn
            onBack={() => setScreen('welcome')}
            onAuthenticated={(e) => {
              setAdminEmail(e);
              setScreen('admin-dashboard');
            }}
          />
        );

      case 'admin-dashboard':
        return (
          <AdminDashboard
            adminEmail={adminEmail || 'shema.apps@ywambt.com'}
            onOpenReport={(id, view) => {
              setSelectedId(id);
              setReportView(view);
              setScreen('admin-report');
            }}
            onInviteAdmin={() => setScreen('invite-admin')}
            onSignOut={() => {
              setAdminEmail(null);
              setScreen('welcome');
            }}
          />
        );

      case 'admin-report':
        if (!selectedInterview) return null;
        return (
          <AdminReport
            interview={selectedInterview}
            initialView={reportView}
            onBack={() => setScreen('admin-dashboard')}
          />
        );

      case 'invite-admin':
        return <InviteAdmin adminEmail={adminEmail} onBack={() => setScreen('admin-dashboard')} />;
    }
  }

  return <I18nProvider adminEmail={adminEmail}>{renderScreen()}</I18nProvider>;
}

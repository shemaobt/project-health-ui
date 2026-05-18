import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useT } from '../lib/i18n';
import { useAuthStore } from '../lib/stores/authStore';
import { PH_ADMIN_ROLE } from '../lib/constants';
import {
  Card, DottedEyebrow, GhostButton, PrimaryButton,
} from '../components/primitives';
import { PageHeader } from '../components/composites';

export default function PendingApproval() {
  const { t } = useT();
  const [, setLocation] = useLocation();
  const { appRoles, refreshMyRoles, logout } = useAuthStore();

  useEffect(() => {
    if (appRoles.includes(PH_ADMIN_ROLE)) {
      setLocation('/admin');
    }
  }, [appRoles, setLocation]);

  return (
    <div className="min-h-screen flex flex-col screen-enter">
      <PageHeader topOnly>
        <GhostButton onClick={() => { void logout(); setLocation('/login'); }}>
          {t('pendingApproval.signOut')}
        </GhostButton>
      </PageHeader>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md animate-fade-up text-center">
          <DottedEyebrow className="mb-5">{t('pendingApproval.eyebrow')}</DottedEyebrow>
          <h1 className="font-serif text-3xl sm:text-4xl text-earth-800 leading-tight" style={{ letterSpacing: '-0.015em' }}>
            {t('pendingApproval.title')}
          </h1>

          <Card className="mt-8 p-6 sm:p-8 text-left">
            <p className="text-earth-600">{t('pendingApproval.intro')}</p>
            <div className="mt-6">
              <PrimaryButton onClick={() => void refreshMyRoles()} className="w-full">
                {t('pendingApproval.checkAgain')}
              </PrimaryButton>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

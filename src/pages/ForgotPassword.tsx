import { useState } from 'react';
import { Link } from 'wouter';
import { useT } from '../lib/i18n';
import { useAuthStore } from '../lib/stores/authStore';
import {
  Card, DottedEyebrow, Field, GhostButton, PrimaryButton, Spinner, StatusOrb,
} from '../components/primitives';
import { PageHeader } from '../components/composites';

export default function ForgotPassword() {
  const { t } = useT();
  const forgotPassword = useAuthStore((s) => s.forgotPassword);

  const [email, setEmail] = useState('');
  const [stage, setStage] = useState<'idle' | 'sending' | 'sent'>('idle');

  const submit = async () => {
    if (!email.trim() || stage === 'sending') return;
    setStage('sending');
    try {
      await forgotPassword(email.trim());
    } finally {
      setStage('sent');
    }
  };

  return (
    <div className="min-h-screen flex flex-col screen-enter">
      <PageHeader topOnly>
        <Link to="/login">
          <GhostButton>{t('forgotPassword.backToLogin')}</GhostButton>
        </Link>
      </PageHeader>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md animate-fade-up">
          <div className="text-center mb-8">
            <DottedEyebrow className="mb-5">{t('forgotPassword.eyebrow')}</DottedEyebrow>
            <h1 className="font-serif text-3xl sm:text-4xl text-earth-800 leading-tight" style={{ letterSpacing: '-0.015em' }}>
              {t('forgotPassword.title')}
            </h1>
            <p className="mt-4 text-earth-500 max-w-sm mx-auto">{t('forgotPassword.intro')}</p>
          </div>

          <Card className="p-6 sm:p-7">
            {stage !== 'sent' ? (
              <>
                <Field
                  type="email"
                  label={t('forgotPassword.emailLabel')}
                  placeholder={t('forgotPassword.emailPlaceholder')}
                  value={email}
                  onChange={setEmail}
                  onKeyDown={(e) => e.key === 'Enter' && submit()}
                />
                <div className="mt-6">
                  <PrimaryButton
                    onClick={submit}
                    disabled={!email.trim() || stage === 'sending'}
                    className="w-full"
                  >
                    {stage === 'sending'
                      ? <><Spinner /> {t('forgotPassword.submitting')}</>
                      : t('forgotPassword.submit')}
                  </PrimaryButton>
                </div>
              </>
            ) : (
              <div className="text-center py-4 animate-fade-up">
                <div className="mb-4">
                  <StatusOrb done icon="envelope" />
                </div>
                <h3 className="font-serif text-xl text-earth-800">{t('forgotPassword.sentTitle')}</h3>
                <p className="mt-2 text-sm text-earth-500">{t('forgotPassword.sentDetail')}</p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}

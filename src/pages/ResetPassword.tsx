import { useMemo, useState, type FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { useT } from '../lib/i18n';
import { useAuthStore } from '../lib/stores/authStore';
import {
  Alert, Card, DottedEyebrow, Field, GhostButton, PrimaryButton, Spinner, StatusOrb,
} from '../components/primitives';
import { PageHeader } from '../components/composites';

export default function ResetPassword() {
  const { t } = useT();
  const [, setLocation] = useLocation();
  const resetPassword = useAuthStore((s) => s.resetPassword);

  const token = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('token') ?? '';
  }, []);

  const [password, setPassword] = useState('');
  const [stage, setStage] = useState<'idle' | 'submitting' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  const submit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!password || !token || stage === 'submitting') return;
    setError(null);
    setStage('submitting');
    try {
      await resetPassword(token, password);
      setStage('done');
    } catch (e) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      setError(t(status === 400 ? 'resetPassword.errorInvalidToken' : 'resetPassword.errorGeneric'));
      setStage('idle');
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
            <DottedEyebrow className="mb-5">{t('resetPassword.eyebrow')}</DottedEyebrow>
            <h1 className="font-serif text-3xl sm:text-4xl text-earth-800 leading-tight" style={{ letterSpacing: '-0.015em' }}>
              {t('resetPassword.title')}
            </h1>
            <p className="mt-4 text-earth-500 max-w-sm mx-auto">{t('resetPassword.intro')}</p>
          </div>

          <Card className="p-6 sm:p-7">
            {stage !== 'done' ? (
              <form onSubmit={submit} noValidate>
                <Field
                  type="password"
                  name="new-password"
                  autoComplete="new-password"
                  required
                  label={t('resetPassword.passwordLabel')}
                  placeholder={t('resetPassword.passwordPlaceholder')}
                  value={password}
                  onChange={(v) => { setPassword(v); setError(null); }}
                />
                {error && (
                  <div className="mt-4">
                    <Alert tone="error">{error}</Alert>
                  </div>
                )}
                <div className="mt-6">
                  <PrimaryButton
                    type="submit"
                    disabled={!password || !token || stage === 'submitting'}
                    className="w-full"
                  >
                    {stage === 'submitting'
                      ? <><Spinner /> {t('resetPassword.submitting')}</>
                      : t('resetPassword.submit')}
                  </PrimaryButton>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 animate-fade-up">
                <div className="mb-4">
                  <StatusOrb done icon="check" />
                </div>
                <h3 className="font-serif text-xl text-earth-800">{t('resetPassword.doneTitle')}</h3>
                <p className="mt-2 text-sm text-earth-500">{t('resetPassword.doneDetail')}</p>
                <div className="mt-6">
                  <PrimaryButton onClick={() => setLocation('/login')} className="w-full">
                    {t('login.submit')}
                  </PrimaryButton>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}

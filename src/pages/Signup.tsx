import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useT } from '../lib/i18n';
import { useAuthStore } from '../lib/stores/authStore';
import {
  Alert, Card, DottedEyebrow, Field, GhostButton, PrimaryButton, Spinner,
} from '../components/primitives';
import { PageHeader } from '../components/composites';

export default function Signup() {
  const { t } = useT();
  const [, setLocation] = useLocation();
  const signup = useAuthStore((s) => s.signup);
  const loading = useAuthStore((s) => s.loading);

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!email.trim() || !password || loading) return;
    setError(null);
    try {
      await signup({
        email: email.trim(),
        password,
        display_name: displayName.trim() || undefined,
      });
      setLocation('/pending-approval');
    } catch (e) {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || t('signup.errorGeneric'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col screen-enter">
      <PageHeader topOnly>
        <Link to="/">
          <GhostButton>{t('common.backToHome')}</GhostButton>
        </Link>
      </PageHeader>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-md animate-fade-up">
          <div className="text-center mb-8">
            <DottedEyebrow className="mb-5">{t('signup.eyebrow')}</DottedEyebrow>
            <h1 className="font-serif text-3xl sm:text-4xl text-earth-800 leading-tight" style={{ letterSpacing: '-0.015em' }}>
              {t('signup.title')}
            </h1>
            <p className="mt-4 text-earth-500 max-w-sm mx-auto">{t('signup.intro')}</p>
          </div>

          <Card className="p-6 sm:p-7">
            <Field
              label={t('signup.displayNameLabel')}
              placeholder={t('signup.displayNamePlaceholder')}
              value={displayName}
              onChange={setDisplayName}
            />
            <div className="mt-5">
              <Field
                type="email"
                label={t('signup.emailLabel')}
                placeholder={t('signup.emailPlaceholder')}
                value={email}
                onChange={(v) => { setEmail(v); setError(null); }}
              />
            </div>
            <div className="mt-5">
              <Field
                type="password"
                label={t('signup.passwordLabel')}
                placeholder={t('signup.passwordPlaceholder')}
                value={password}
                onChange={(v) => { setPassword(v); setError(null); }}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
            </div>

            {error && (
              <div className="mt-4">
                <Alert tone="error">{error}</Alert>
              </div>
            )}

            <div className="mt-6">
              <PrimaryButton
                onClick={submit}
                disabled={!email.trim() || !password || loading}
                className="w-full"
              >
                {loading
                  ? <><Spinner /> {t('signup.submitting')}</>
                  : t('signup.submit')}
              </PrimaryButton>
            </div>

            <p className="mt-5 text-center text-xs text-earth-500">
              {t('signup.haveAccount')}{' '}
              <Link to="/login" className="text-clay-600 hover:text-clay-700 underline-offset-4 hover:underline">
                {t('signup.signin')}
              </Link>
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}

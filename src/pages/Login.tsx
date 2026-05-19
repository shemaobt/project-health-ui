import { useState, type FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { useT } from '../lib/i18n';
import { useAuthStore } from '../lib/stores/authStore';
import {
  Alert, Card, DottedEyebrow, Field, GhostButton, PrimaryButton, Spinner,
} from '../components/primitives';
import { PageHeader } from '../components/composites';

export default function Login() {
  const { t } = useT();
  const [, setLocation] = useLocation();
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!email.trim() || !password || loading) return;
    setError(null);
    try {
      await login(email.trim(), password);
      setLocation('/admin');
    } catch (e) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      setError(t(status === 401 ? 'login.errorInvalid' : 'login.errorGeneric'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col screen-enter">
      <PageHeader topOnly>
        <Link to="/">
          <GhostButton>{t('common.backToHome')}</GhostButton>
        </Link>
      </PageHeader>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md animate-fade-up">
          <div className="text-center mb-8">
            <DottedEyebrow className="mb-5">{t('login.eyebrow')}</DottedEyebrow>
            <h1 className="font-serif text-3xl sm:text-4xl text-earth-800 leading-tight" style={{ letterSpacing: '-0.015em' }}>
              {t('login.title')}
            </h1>
            <p className="mt-4 text-earth-500 max-w-sm mx-auto">{t('login.intro')}</p>
          </div>

          <Card className="p-6 sm:p-7">
            <form onSubmit={submit} noValidate>
              <Field
                type="email"
                name="email"
                autoComplete="email"
                required
                label={t('login.emailLabel')}
                placeholder={t('login.emailPlaceholder')}
                value={email}
                onChange={(v) => { setEmail(v); setError(null); }}
              />
              <div className="mt-5">
                <Field
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  label={t('login.passwordLabel')}
                  placeholder={t('login.passwordPlaceholder')}
                  value={password}
                  onChange={(v) => { setPassword(v); setError(null); }}
                />
              </div>

              {error && (
                <div className="mt-4">
                  <Alert tone="error">{error}</Alert>
                </div>
              )}

              <div className="mt-6">
                <PrimaryButton
                  type="submit"
                  disabled={!email.trim() || !password || loading}
                  className="w-full"
                >
                  {loading
                    ? <><Spinner /> {t('login.submitting')}</>
                    : t('login.submit')}
                </PrimaryButton>
              </div>
            </form>

            <div className="mt-5 flex items-center justify-between text-xs text-earth-500">
              <Link to="/forgot-password" className="hover:text-earth-700 underline-offset-4 hover:underline">
                {t('login.forgot')}
              </Link>
              <span>
                {t('login.noAccount')}{' '}
                <Link to="/signup" className="text-clay-600 hover:text-clay-700 underline-offset-4 hover:underline">
                  {t('login.signup')}
                </Link>
              </span>
            </div>
          </Card>

          {/* Shema attribution — keep identical with translation-helper-ui/src/components/shells/AuthShell.tsx */}
          <p
            style={{
              marginTop: 24,
              textAlign: 'center',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.04em',
              color: 'currentColor',
              opacity: 0.55,
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            }}
          >
            by Shema Bible Translation · YWAM Kansas City
          </p>
        </div>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { signIn } from '../lib/api';
import { useT } from '../lib/i18n';
import {
  Alert, Card, DottedEyebrow, Field, GhostButton, PrimaryButton, Spinner, StatusOrb,
} from '../components/primitives';
import { PageHeader } from '../components/composites';

interface AdminSignInProps {
  onAuthenticated: (email: string) => void;
  onBack: () => void;
}

type Stage = 'idle' | 'sending' | 'sent' | 'error';

export default function AdminSignIn({ onAuthenticated, onBack }: AdminSignInProps) {
  const { t } = useT();
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState<Stage>('idle');

  const send = async () => {
    if (!email.trim() || stage === 'sending') return;
    setStage('sending');
    const result = await signIn(email);
    if (!result.ok) {
      setStage(result.error === 'unauthorized' ? 'error' : 'idle');
      return;
    }
    setStage('sent');
    setTimeout(() => onAuthenticated(result.email!), 1800);
  };

  return (
    <div className="min-h-screen flex flex-col screen-enter">
      <PageHeader topOnly>
        <GhostButton onClick={onBack}>{t('common.backToHome')}</GhostButton>
      </PageHeader>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md animate-fade-up">
          <div className="text-center mb-8">
            <DottedEyebrow className="mb-5">{t('adminSignIn.eyebrow')}</DottedEyebrow>
            <h1 className="font-serif text-3xl sm:text-4xl text-earth-800 leading-tight" style={{ letterSpacing: '-0.015em' }}>
              {t('adminSignIn.title')}
            </h1>
            <p className="mt-4 text-earth-500 max-w-sm mx-auto" style={{ textWrap: 'balance' as never }}>
              {t('adminSignIn.intro')}
            </p>
          </div>

          <Card className="p-6 sm:p-7">
            {stage !== 'sent' && (
              <>
                <Field
                  type="email"
                  label={t('adminSignIn.emailLabel')}
                  placeholder={t('adminSignIn.emailPlaceholder')}
                  value={email}
                  onChange={(v) => { setEmail(v); setStage('idle'); }}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                />

                {stage === 'error' && (
                  <Alert tone="error">{t('adminSignIn.notAuthorized')}</Alert>
                )}

                <div className="mt-6">
                  <PrimaryButton
                    onClick={send}
                    disabled={!email.trim() || stage === 'sending'}
                    className="w-full">
                    {stage === 'sending'
                      ? <><Spinner /> {t('adminSignIn.sending')}</>
                      : t('adminSignIn.send')}
                  </PrimaryButton>
                </div>
              </>
            )}

            {stage === 'sent' && (
              <div className="text-center py-4 animate-fade-up">
                <div className="mb-4">
                  <StatusOrb done icon="envelope" />
                </div>
                <h3 className="font-serif text-xl text-earth-800">{t('adminSignIn.sentTitle')}</h3>
                <p className="mt-2 text-sm text-earth-500" style={{ textWrap: 'balance' as never }}>
                  {t('adminSignIn.sentDetailBefore')} <span className="text-earth-700 font-medium">{email}</span>{t('adminSignIn.sentDetailAfter')}
                </p>
                <p className="mt-6 text-xs text-earth-400 font-serif italic">
                  {t('adminSignIn.demoNote')}
                </p>
              </div>
            )}
          </Card>

          <p className="mt-6 text-center text-xs text-earth-400" style={{ textWrap: 'balance' as never }}>
            {t('adminSignIn.inviteOnly')}
          </p>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto w-full px-5 sm:px-8 pb-6 sm:pb-8 text-xs text-earth-400">
        {t('adminSignIn.supervisorArea')}
      </footer>
    </div>
  );
}

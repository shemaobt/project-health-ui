import { useState } from 'react';
import { useLocation } from 'wouter';
import axios from 'axios';
import { adminApi } from '../lib/api';
import { useT } from '../lib/i18n';
import {
  Alert, Card, DottedEyebrow, Field, PrimaryButton, SecondaryButton,
} from '../components/primitives';
import { PageHeader } from '../components/composites';

type Stage = 'idle' | 'sending' | 'sent' | 'notFound' | 'invalid' | 'error';

export default function InviteAdmin() {
  const { t } = useT();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState<Stage>('idle');
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  const send = async () => {
    const trimmed = email.trim();
    if (!trimmed || stage === 'sending') return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStage('invalid');
      return;
    }
    setStage('sending');
    setErrorDetail(null);
    try {
      await adminApi.inviteAdmin(trimmed);
      setEmail('');
      setStage('sent');
      setTimeout(() => setStage('idle'), 3500);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const detail = e.response?.data?.detail;
        if (e.response?.status === 404) {
          setStage('notFound');
          setErrorDetail(typeof detail === 'string' ? detail : null);
          return;
        }
      }
      setStage('error');
    }
  };

  return (
    <div className="min-h-screen screen-enter">
      <PageHeader bordered maxWidth="max-w-4xl">
        <SecondaryButton onClick={() => setLocation('/admin')} className="!px-4 !py-2 text-xs">
          {t('common.backToDashboard')}
        </SecondaryButton>
      </PageHeader>

      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <div className="mb-8 sm:mb-10 animate-fade-up">
          <DottedEyebrow className="mb-4">{t('inviteAdmin.eyebrow')}</DottedEyebrow>
          <h1 className="font-serif text-3xl sm:text-4xl text-earth-800" style={{ letterSpacing: '-0.015em' }}>
            {t('inviteAdmin.title')}
          </h1>
          <p className="mt-3 text-earth-500 max-w-xl" style={{ textWrap: 'pretty' as never }}>
            {t('inviteAdmin.intro')}
          </p>
        </div>

        <Card className="p-6 sm:p-7 animate-fade-up" style={{ animationDelay: '60ms' }}>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1">
              <Field
                type="email"
                label={t('inviteAdmin.emailLabel')}
                placeholder={t('inviteAdmin.emailPlaceholder')}
                value={email}
                onChange={(v) => { setEmail(v); setStage('idle'); }}
                onKeyDown={(e) => e.key === 'Enter' && send()}
              />
            </div>
            <PrimaryButton
              onClick={() => void send()}
              disabled={!email.trim() || stage === 'sending'}
              className="sm:w-auto">
              {stage === 'sending' ? t('inviteAdmin.sending') : t('inviteAdmin.send')}
            </PrimaryButton>
          </div>

          {stage === 'sent'     && <div className="mt-4"><Alert tone="success">{t('inviteAdmin.sent')}</Alert></div>}
          {stage === 'notFound' && <div className="mt-4"><Alert tone="info">{errorDetail ?? t('common.error')}</Alert></div>}
          {stage === 'invalid'  && <div className="mt-4"><Alert tone="error">{t('inviteAdmin.invalid')}</Alert></div>}
          {stage === 'error'    && <div className="mt-4"><Alert tone="error">{t('common.error')}</Alert></div>}
        </Card>

        <p className="mt-10 text-center text-xs text-earth-400 font-serif italic" style={{ textWrap: 'balance' as never }}>
          {t('inviteAdmin.footerNote')}
        </p>
      </main>
    </div>
  );
}

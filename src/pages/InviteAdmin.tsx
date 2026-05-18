import { useEffect, useState } from 'react';
import { fetchAdmins, inviteAdmin, type Admin } from '../lib/api';
import { useFetch } from '../lib/hooks';
import { useT } from '../lib/i18n';
import {
  Alert, Card, DottedEyebrow, Eyebrow, Field, formatDate, HRule, InitialsAvatar, PrimaryButton, SecondaryButton,
} from '../components/primitives';
import { PageHeader } from '../components/composites';

interface InviteAdminProps {
  adminEmail: string | null;
  onBack: () => void;
}

type Stage = 'idle' | 'sending' | 'sent' | 'duplicate' | 'invalid';

export default function InviteAdmin({ adminEmail, onBack }: InviteAdminProps) {
  const { t } = useT();
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState<Stage>('idle');
  const initialAdmins = useFetch(() => fetchAdmins(), []);
  const [admins, setAdmins] = useState<Admin[]>([]);

  useEffect(() => {
    if (initialAdmins && admins.length === 0) setAdmins(initialAdmins);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAdmins]);

  const send = async () => {
    if (!email.trim() || stage === 'sending') return;
    setStage('sending');
    const result = await inviteAdmin(email, adminEmail);
    if (!result.ok) {
      setStage(result.error as Stage);
      return;
    }
    setAdmins(result.admins!);
    setEmail('');
    setStage('sent');
    setTimeout(() => setStage('idle'), 3200);
  };

  return (
    <div className="min-h-screen screen-enter">
      <PageHeader bordered maxWidth="max-w-4xl">
        <SecondaryButton onClick={onBack} className="!px-4 !py-2 text-xs">
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
              onClick={send}
              disabled={!email.trim() || stage === 'sending'}
              className="sm:w-auto">
              {stage === 'sending' ? t('inviteAdmin.sending') : t('inviteAdmin.send')}
            </PrimaryButton>
          </div>

          {stage === 'sent'      && <Alert tone="success">{t('inviteAdmin.sent')}</Alert>}
          {stage === 'duplicate' && <Alert tone="info">{t('inviteAdmin.duplicate')}</Alert>}
          {stage === 'invalid'   && <Alert tone="error">{t('inviteAdmin.invalid')}</Alert>}
        </Card>

        <div className="mt-10 sm:mt-12">
          <div className="flex items-baseline gap-3 mb-5">
            <Eyebrow>{t('inviteAdmin.authorizedLabel', { count: admins.length })}</Eyebrow>
            <HRule />
          </div>

          <Card className="p-1.5">
            {admins.map((a, i) => (
              <div key={a.email + i}
                className={`px-4 sm:px-5 py-4 ${i < admins.length - 1 ? 'border-b border-earth-700/5' : ''}`}>
                <div className="hidden sm:grid grid-cols-[1.5fr,1.2fr,0.8fr] items-center gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <InitialsAvatar email={a.email} />
                    <div className="text-sm text-earth-700 truncate">{a.email}</div>
                  </div>
                  <div className="text-sm text-earth-500 truncate">
                    <Eyebrow size="tertiary" tone="earth400" className="mr-2">{t('inviteAdmin.invitedBy')}</Eyebrow>
                    {a.invited_by}
                  </div>
                  <div className="text-sm text-earth-500 text-right">{formatDate(a.date)}</div>
                </div>
                <div className="sm:hidden flex flex-col gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <InitialsAvatar email={a.email} />
                    <div className="text-sm text-earth-700 truncate flex-1">{a.email}</div>
                  </div>
                  <div className="text-xs text-earth-500 pl-11">
                    <span className="text-earth-400">{t('inviteAdmin.invitedBy')}</span> {a.invited_by}
                    <span aria-hidden="true" className="text-earth-700/15 mx-2">·</span>
                    {formatDate(a.date)}
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>

        <p className="mt-10 text-center text-xs text-earth-400 font-serif italic" style={{ textWrap: 'balance' as never }}>
          {t('inviteAdmin.footerNote')}
        </p>
      </main>
    </div>
  );
}

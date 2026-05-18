import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { StatusOrb, PrimaryButton, Alert } from '../components/primitives';
import { useT } from '../lib/i18n';
import { useInterviewStore } from '../lib/stores/interviewStore';
import { InterviewTokenExpiredError } from '../lib/api/interviews';

type Stage = 'pending' | 'done' | 'blocked' | 'error' | 'expired';

export default function Completion() {
  const { t } = useT();
  const [, setLocation] = useLocation();
  const interviewId = useInterviewStore((s) => s.interviewId);
  const complete = useInterviewStore((s) => s.complete);
  const resetStore = useInterviewStore((s) => s.reset);

  const [stage, setStage] = useState<Stage>('pending');
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!interviewId) {
      setLocation('/');
      return;
    }
    void (async () => {
      try {
        const result = await complete();
        if (result.ok) {
          setStage('done');
          setTimeout(() => setLocation(`/team-report/${result.reportId}`), 1500);
        } else {
          setBlockedMessage(result.blockedMessage);
          setStage('blocked');
        }
      } catch (err) {
        if (err instanceof InterviewTokenExpiredError) {
          setStage('expired');
        } else {
          console.error('completeInterview failed', err);
          setStage('error');
        }
      }
    })();
  }, [interviewId, complete, setLocation]);

  const startOver = () => {
    resetStore();
    setLocation('/');
  };

  if (stage === 'blocked') {
    return (
      <div className="min-h-screen flex items-center justify-center screen-enter">
        <div className="text-center max-w-md px-5 sm:px-8 animate-fade-up">
          <Alert tone="info">{blockedMessage ?? t('completion.inProgressDetail')}</Alert>
          <div className="mt-6">
            <PrimaryButton onClick={() => interviewId && setLocation(`/interview/${interviewId}`)}>
              {t('common.back')}
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center screen-enter">
        <div className="text-center max-w-md px-5 sm:px-8 animate-fade-up">
          <Alert tone="error">{t('interview.sessionExpired')}</Alert>
          <div className="mt-6">
            <PrimaryButton onClick={startOver}>{t('interview.startOver')}</PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center screen-enter">
        <div className="text-center max-w-md px-5 sm:px-8 animate-fade-up">
          <Alert tone="error">{t('common.error')}</Alert>
          <div className="mt-6">
            <PrimaryButton onClick={() => interviewId && setLocation(`/interview/${interviewId}`)}>
              {t('common.back')}
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  const done = stage === 'done';
  return (
    <div className="min-h-screen flex items-center justify-center screen-enter">
      <div className="text-center max-w-md px-5 sm:px-8 animate-fade-up">
        <div className="mb-8">
          <StatusOrb done={done} icon="check" size="lg" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-earth-800" style={{ letterSpacing: '-0.012em' }}>
          {done ? t('completion.readyTitle') : t('completion.inProgressTitle')}
        </h2>
        <p className="mt-4 text-earth-500 font-serif italic" style={{ textWrap: 'balance' as never }}>
          {done ? t('completion.readyDetail') : t('completion.inProgressDetail')}
        </p>
      </div>
    </div>
  );
}

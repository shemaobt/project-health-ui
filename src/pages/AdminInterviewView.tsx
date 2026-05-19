import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { adminApi } from '../lib/api';
import type { InterviewDetailResponse, MessageDto } from '../lib/api/types';
import { langLabel, type Message as MessagePayload } from '../lib/fixtures';
import { useT } from '../lib/i18n';
import { Alert, DottedEyebrow, Spinner, StatusPill } from '../components/primitives';
import { BreadcrumbHeader, Message } from '../components/composites';

interface Props {
  interviewId: string;
}

export default function AdminInterviewView({ interviewId }: Props) {
  const { t } = useT();
  const [, setLocation] = useLocation();
  const [data, setData] = useState<InterviewDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const detail = await adminApi.getInterviewTranscript(interviewId);
        if (!cancelled) setData(detail);
      } catch (e) {
        console.error('getInterviewTranscript failed', e);
        if (!cancelled) setError(t('adminInterviewView.loadError'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [interviewId, t]);

  return (
    <div className="min-h-screen flex flex-col screen-enter">
      <BreadcrumbHeader
        onBack={() => setLocation('/admin')}
        backLabel={t('adminInterviewView.back')}
        maxWidth="max-w-5xl"
        eyebrow={<DottedEyebrow>{t('adminInterviewView.eyebrow')}</DottedEyebrow>}
        title={data ? <>{data.project_name} <span aria-hidden="true" className="text-earth-400">·</span> {data.team_name}</> : t('common.loading')}
      >
        {data && <StatusPill status={data.status === 'completed' ? 'completed' : 'in_progress'} />}
      </BreadcrumbHeader>

      <main className="flex-1 overflow-y-auto nice-scroll">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {loading && (
            <div className="flex items-center gap-2 text-earth-500 text-sm">
              <Spinner /> {t('common.loading')}
            </div>
          )}
          {error && (
            <div className="mb-8 animate-fade-up">
              <Alert tone="error">{error}</Alert>
            </div>
          )}
          {data && (
            <>
              <div className="mb-6 text-sm text-earth-500">
                {langLabel(data.language)}
                <span aria-hidden="true" className="text-earth-700/15 mx-2">·</span>
                {t('adminInterviewView.messageCount', { count: data.messages.length })}
              </div>
              <div className="space-y-6">
                {data.messages.map((m, idx) => (
                  <Message
                    key={`${m.timestamp}-${idx}`}
                    message={toLegacyMessage(m, idx)}
                    playing={false}
                    onTogglePlay={() => undefined}
                    respondents={[]}
                  />
                ))}
                {data.messages.length === 0 && (
                  <div className="text-earth-500 text-sm italic">{t('adminInterviewView.empty')}</div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function toLegacyMessage(m: MessageDto, idx: number): MessagePayload {
  return {
    id: idx,
    role: m.role,
    text: m.content,
    time: m.timestamp,
  };
}

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useLocation } from 'wouter';
import { langLabel, type Message as MessagePayload } from '../lib/fixtures';
import { useT } from '../lib/i18n';
import { useInterviewStore } from '../lib/stores/interviewStore';
import { useVoiceInput } from '../lib/hooks/useVoiceInput';
import { useTextToSpeech } from '../lib/hooks/useTextToSpeech';
import { InterviewTokenExpiredError } from '../lib/api/interviews';
import {
  Alert, DottedEyebrow, DividerEyebrow, Eyebrow, FacilitatorAvatar, Icon, MicButton, PrimaryButton, TypingIndicator,
} from '../components/primitives';
import { BreadcrumbHeader, Message, PacingHint } from '../components/composites';

interface InterviewProps {
  interviewId: string;
}

export default function Interview({ interviewId }: InterviewProps) {
  const { t } = useT();
  const [, setLocation] = useLocation();

  const language = useInterviewStore((s) => s.language);
  const projectName = useInterviewStore((s) => s.projectName);
  const teamName = useInterviewStore((s) => s.teamName);
  const storeId = useInterviewStore((s) => s.interviewId);
  const interviewToken = useInterviewStore((s) => s.interviewToken);
  const messages = useInterviewStore((s) => s.messages);
  const coverage = useInterviewStore((s) => s.coverage);
  const sendMessage = useInterviewStore((s) => s.sendMessage);

  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState('');
  const [expired, setExpired] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLElement>(null);
  const resetStore = useInterviewStore((s) => s.reset);

  useEffect(() => {
    if (storeId && storeId !== interviewId) {
      setLocation('/');
    }
  }, [storeId, interviewId, setLocation]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const voice = useVoiceInput({
    language,
    interviewId,
    interviewToken,
    onResult: (text) => setDraft((prev) => prev ? `${prev} ${text}`.trim() : text),
  });
  const tts = useTextToSpeech({ language, interviewId, interviewToken });

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || typing) return;
    setSendError(null);
    setDraft('');
    setTyping(true);
    try {
      await sendMessage(text);
    } catch (err) {
      if (err instanceof InterviewTokenExpiredError) {
        setExpired(true);
      } else {
        setSendError(t('interview.sendError'));
        setDraft(text);
        console.error('sendMessage failed', err);
      }
    } finally {
      setTyping(false);
    }
  };

  const startOver = () => {
    resetStore();
    setLocation('/');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const teamTurnCount = messages.filter((m) => m.role === 'team').length;
  const openingComplete = (coverage?.missing_opening_fields?.length ?? 1) === 0;
  const sufficient = teamTurnCount >= 10
    && openingComplete
    && coverage?.interview_phase === 'closing';
  const canFinish = sufficient || (teamTurnCount >= 10 && openingComplete);
  const coverageRatio = sufficient ? 1 : Math.min(0.95, 0.4 + teamTurnCount * 0.05);
  const langName = language ? langLabel(language) : '';

  return (
    <div className="min-h-screen flex flex-col screen-enter">
      <BreadcrumbHeader
        onBack={() => setLocation('/')}
        backLabel={t('ariaLabel.leaveInterview')}
        maxWidth="max-w-5xl"
        eyebrow={<DottedEyebrow>{t('interview.inConversation')}</DottedEyebrow>}
        title={<>{projectName} <span aria-hidden="true" className="text-earth-400">·</span> {teamName}</>}
      >
        <PacingHint coverage={coverageRatio} sufficient={sufficient} />
        <PrimaryButton
          disabled={!canFinish}
          onClick={() => setLocation('/completion')}
          className="!px-5 sm:!px-7 !py-2.5 sm:!py-3 text-xs sm:text-sm">
          {t('interview.finish')}
        </PrimaryButton>
      </BreadcrumbHeader>

      <main className="flex-1 overflow-y-auto nice-scroll" ref={scrollRef}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <DividerEyebrow className="mb-8">{t('interview.dateMarker', { language: langName })}</DividerEyebrow>

          {expired && (
            <div className="mb-8 animate-fade-up">
              <Alert tone="error">
                <div className="flex flex-col gap-3">
                  <span>{t('interview.sessionExpired')}</span>
                  <div>
                    <PrimaryButton onClick={startOver} className="!px-4 !py-2 text-xs">
                      {t('interview.startOver')}
                    </PrimaryButton>
                  </div>
                </div>
              </Alert>
            </div>
          )}

          {!expired && sendError && (
            <div className="mb-8 animate-fade-up">
              <Alert tone="error">{sendError}</Alert>
            </div>
          )}

          <div className="space-y-6">
            {messages.map((m, idx) => (
              <Message
                key={`${m.timestamp}-${idx}`}
                message={toLegacyMessage(m, idx, t('interview.justNow'))}
                playing={tts.playingId === idx}
                onTogglePlay={() => tts.toggle({ id: idx, text: m.content })}
                respondents={[]}
              />
            ))}
            {typing && (
              <div
                className="flex items-start gap-3 animate-fade-in"
                role="status"
                aria-live="polite"
                aria-label={t('ariaLabel.facilitatorComposing')}
              >
                <FacilitatorAvatar />
                <div className="mt-1">
                  <Eyebrow size="tertiary" tone="earth400" className="block mb-1">{t('interview.facilitator')}</Eyebrow>
                  <div className="bg-cream-50 rounded-2xl rounded-tl-md px-4 py-2 ring-1 ring-earth-700/5">
                    <TypingIndicator />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-earth-700/8 bg-cream-100/85 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-3 sm:px-6 py-3 sm:py-5">
          {sufficient && (
            <div className="mb-2 text-[12px] text-earth-500 px-1" role="note">
              {t('interview.wrapUpHint', { button: t('interview.finish') })}
            </div>
          )}
          <div className={`bg-cream-50 rounded-2xl ring-1 ${voice.isListening ? 'ring-clay-400/50' : 'ring-earth-700/10'} transition-all duration-200 p-2 pl-3 flex items-end gap-2 sm:gap-3`}>
            <MicButton
              listening={voice.isListening}
              onClick={() => voice.isListening ? voice.stopListening() : void voice.startListening()}
            />
            <textarea
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={voice.isListening ? t('interview.listening') : t('interview.placeholder')}
              className="focus-warm flex-1 resize-none bg-transparent py-2.5 px-1 text-[15px] text-earth-800 placeholder:text-earth-400/80 max-h-32"
              style={{ minHeight: '40px' }}
            />
            <button
              onClick={() => void handleSend()}
              disabled={!draft.trim() || typing}
              aria-label={t('ariaLabel.sendMessage')}
              className={`focus-warm shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200
                ${draft.trim() && !typing
                  ? 'bg-earth-700 text-cream-50 hover:bg-earth-800 active:scale-[0.985]'
                  : 'bg-earth-700/10 text-earth-700/30 cursor-not-allowed'}`}>
              <Icon name="send" />
            </button>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-earth-400 px-1">
            <span>
              {voice.error ? (
                <span className="text-clay-700">{voice.error}</span>
              ) : !voice.isSupported ? (
                <span className="text-earth-400">{t('interview.typeHint')}</span>
              ) : voice.isListening ? (
                <><span className="text-clay-600" aria-hidden="true">●</span> {t('interview.listeningHint')}</>
              ) : (
                t('interview.typeHint')
              )}
            </span>
            <span>{t('interview.presentCount', { count: teamTurnCount })}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function toLegacyMessage(
  m: { role: string; content: string; timestamp: string },
  idx: number,
  justNowLabel: string,
): MessagePayload {
  return {
    id: idx,
    role: m.role as 'facilitator' | 'team',
    text: m.content,
    time: justNowLabel,
  };
}

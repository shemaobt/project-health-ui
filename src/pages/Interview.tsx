import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  getInterviewCoverage, langLabel, sendInterviewMessage, simulateTranscription, startInterview,
  type InterviewSession, type Message as MessagePayload, type Pace,
} from '../lib/api';
import { useFetch } from '../lib/hooks';
import { useT } from '../lib/i18n';
import {
  DottedEyebrow, DividerEyebrow, Eyebrow, FacilitatorAvatar, Icon, MicButton, PrimaryButton, TypingIndicator,
} from '../components/primitives';
import { BreadcrumbHeader, Message, PacingHint } from '../components/composites';

interface InterviewPageProps {
  session: InterviewSession;
  onFinish: () => void;
  onExit: () => void;
}

const INITIAL_PACE: Pace = { coverage: 0.86, sufficient: true };

export default function Interview({ session, onFinish, onExit }: InterviewPageProps) {
  const { t } = useT();
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [typing, setTyping] = useState(true);
  const [listening, setListening] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const [scriptIdx, setScriptIdx] = useState(0);
  const scrollRef = useRef<HTMLElement>(null);

  const initial = useFetch(() => startInterview(session), []);
  useEffect(() => {
    if (!initial) return;
    setMessages(initial);
    setTyping(false);
  }, [initial]);

  const pace = useFetch(() => getInterviewCoverage(messages.length), [messages.length]) ?? INITIAL_PACE;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (!listening) return;
    let cancelled = false;
    simulateTranscription().then((phrase) => {
      if (cancelled) return;
      setDraft((prev) => prev || phrase);
    });
    return () => {
      cancelled = true;
    };
  }, [listening]);

  useEffect(() => {
    if (playingId == null) return;
    const tt = setTimeout(() => setPlayingId(null), 3000);
    return () => clearTimeout(tt);
  }, [playingId]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    setListening(false);
    setMessages((prev) => [...prev, { id: prev.length, role: 'team', text, time: 'Just now' }]);
    setTyping(true);

    const { reply, nextScriptIdx } = await sendInterviewMessage({ scriptIdx });
    setTyping(false);
    setMessages((prev) => [...prev, { id: prev.length, role: 'facilitator', text: reply, time: 'Just now' }]);
    setScriptIdx(nextScriptIdx);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const participantCount = session.participants?.length ?? 0;
  const langName = langLabel(session.lang);

  return (
    <div className="min-h-screen flex flex-col screen-enter">
      <BreadcrumbHeader
        onBack={onExit}
        backLabel={t('ariaLabel.leaveInterview')}
        maxWidth="max-w-5xl"
        eyebrow={<DottedEyebrow>{t('interview.inConversation')}</DottedEyebrow>}
        title={<>{session.project} <span aria-hidden="true" className="text-earth-400">·</span> {session.team}</>}
      >
        <PacingHint coverage={pace.coverage} sufficient={pace.sufficient} />
        <PrimaryButton disabled={!pace.sufficient} onClick={onFinish} className="!px-5 sm:!px-7 !py-2.5 sm:!py-3 text-xs sm:text-sm">
          {t('interview.finish')}
        </PrimaryButton>
      </BreadcrumbHeader>

      <main className="flex-1 overflow-y-auto nice-scroll" ref={scrollRef}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <DividerEyebrow className="mb-8">{t('interview.dateMarker', { language: langName })}</DividerEyebrow>

          <div className="space-y-6">
            {messages.map((m) => (
              <Message
                key={m.id}
                message={m}
                playing={playingId === m.id}
                onTogglePlay={() => setPlayingId((p) => (p === m.id ? null : m.id))}
                respondents={session.participants || []}
              />
            ))}
            {typing && (
              <div className="flex items-start gap-3 animate-fade-in">
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
          <div className={`bg-cream-50 rounded-2xl ring-1 ${listening ? 'ring-clay-400/50' : 'ring-earth-700/10'} transition-all duration-200 p-2 pl-3 flex items-end gap-2 sm:gap-3`}>
            <MicButton listening={listening} onClick={() => setListening((l) => !l)} />
            <textarea
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={listening ? t('interview.listening') : t('interview.placeholder')}
              className="focus-warm flex-1 resize-none bg-transparent py-2.5 px-1 text-[15px] text-earth-800 placeholder:text-earth-400/80 max-h-32"
              style={{ minHeight: '40px' }}
            />
            <button
              onClick={handleSend}
              disabled={!draft.trim()}
              aria-label={t('ariaLabel.sendMessage')}
              className={`focus-warm shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200
                ${draft.trim()
                  ? 'bg-earth-700 text-cream-50 hover:bg-earth-800 active:scale-[0.985]'
                  : 'bg-earth-700/10 text-earth-700/30 cursor-not-allowed'}`}>
              <Icon name="send" />
            </button>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-earth-400 px-1">
            <span>
              {listening
                ? <><span className="text-clay-600" aria-hidden="true">●</span> {t('interview.listeningHint')}</>
                : t('interview.typeHint')}
            </span>
            <span>{t('interview.presentCount', { count: participantCount })}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

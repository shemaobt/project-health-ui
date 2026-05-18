import { useState } from 'react';
import { LANGUAGES, type InterviewSession, type LanguageCode } from '../lib/fixtures';
import { useT } from '../lib/i18n';
import {
  Card, DottedEyebrow, Eyebrow, Field, GhostButton, Icon, PrimaryButton,
} from '../components/primitives';
import { PageHeader, ReassuranceLine } from '../components/composites';

interface WelcomeProps {
  onBegin: (s: { lang: LanguageCode; project: string; team: string }) => void;
  onAdminSignIn: () => void;
}

export default function Welcome({ onBegin, onAdminSignIn }: WelcomeProps) {
  const { t } = useT();
  const [lang, setLang] = useState<LanguageCode>('en');
  const [project, setProject] = useState('');
  const [team, setTeam] = useState('');

  const canBegin = project.trim().length > 0 && team.trim().length > 0;

  return (
    <div className="min-h-screen w-full screen-enter">
      <PageHeader topOnly>
        <GhostButton onClick={onAdminSignIn}>{t('welcome.supervisorLink')}</GhostButton>
      </PageHeader>

      <main className="max-w-5xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-16 sm:pb-20 grid lg:grid-cols-[1.05fr,0.95fr] gap-y-10 sm:gap-y-12 lg:gap-x-16 items-start">
        <div className="animate-fade-up">
          <DottedEyebrow className="mb-7">{t('brand.eyebrow')}</DottedEyebrow>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-earth-800" style={{ letterSpacing: '-0.02em', textWrap: 'balance' as never }}>
            {t('welcome.heroBefore')} <span className="italic text-clay-600">{t('welcome.heroAccent')}</span>{t('welcome.heroAfter')}
          </h1>

          <p className="sm:hidden mt-5 text-base leading-relaxed text-earth-600" style={{ textWrap: 'pretty' as never }}>
            {t('welcome.mobileLede')}
          </p>
          <p className="hidden sm:block mt-6 text-lg leading-relaxed text-earth-600 max-w-xl" style={{ textWrap: 'pretty' as never }}>
            {t('welcome.desktopLede')}
          </p>

          <details className="sm:hidden mt-6 group">
            <summary className="inline-flex items-center gap-1.5 text-sm text-earth-500 underline decoration-earth-400/40 underline-offset-4 cursor-pointer list-none">
              <span className="group-open:hidden">{t('welcome.whatToExpect')}</span>
              <span className="hidden group-open:inline">{t('welcome.hideDetails')}</span>
              <Icon name="chevron" className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
            </summary>
            <ReassuranceList className="mt-5" />
          </details>

          <ReassuranceList className="hidden sm:block mt-10 max-w-md" />
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
          <Card className="p-6 sm:p-8 lg:p-10">
            <Eyebrow size="secondary" tone="earth400" className="block mb-1">{t('welcome.sectionEyebrow')}</Eyebrow>
            <h2 className="font-serif text-2xl text-earth-800 mb-7" style={{ letterSpacing: '-0.012em' }}>
              {t('welcome.sectionTitle')}
            </h2>

            <div className="mb-7">
              <span className="block text-xs uppercase tracking-[0.14em] text-earth-500 font-medium mb-3">
                {t('welcome.interviewLanguageLabel')}
              </span>
              <div role="radiogroup" aria-label={t('welcome.interviewLanguageLabel')} className="flex flex-wrap gap-2">
                {LANGUAGES.map((L) => {
                  const active = lang === L.code;
                  return (
                    <button key={L.code}
                      role="radio"
                      aria-checked={active}
                      onClick={() => setLang(L.code)}
                      className={`focus-warm px-3.5 py-2 rounded-full text-sm transition-all duration-200
                        ${active
                          ? 'bg-earth-700 text-cream-50'
                          : 'bg-cream-100 text-earth-700 ring-1 ring-earth-700/10 hover:ring-earth-700/25 hover:bg-cream-150'}`}>
                      <span className={active ? 'opacity-100' : 'opacity-90'}>{L.label}</span>
                      {L.native !== L.label && (
                        <span className={`ml-1.5 text-[11px] ${active ? 'text-cream-50/70' : 'text-earth-400'}`}>
                          {L.native}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-5">
              <Field label={t('welcome.projectField')} placeholder={t('welcome.projectPlaceholder')} value={project} onChange={setProject} />
              <Field label={t('welcome.teamField')}    placeholder={t('welcome.teamPlaceholder')}    value={team}    onChange={setTeam} />
            </div>

            <div className="mt-9 flex items-center justify-between gap-4">
              <p className="text-xs text-earth-400">{t('welcome.pauseNote')}</p>
              <PrimaryButton disabled={!canBegin} onClick={() => onBegin({ lang, project, team })}>
                {t('welcome.begin')}
                <Icon name="arrow-right" />
              </PrimaryButton>
            </div>
          </Card>

          <p className="mt-6 text-center text-xs text-earth-400 font-serif italic" style={{ textWrap: 'balance' as never }}>
            {t('welcome.blessing')}
          </p>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-5 sm:px-8 pb-8 sm:pb-10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-earth-400 text-center sm:text-left">
        <span>{t('welcome.footerName')}</span>
        <span>{t('welcome.footerAvailable', { languages: LANGUAGES.map((L) => L.native).join(' · ') })}</span>
      </footer>
    </div>
  );
}

function ReassuranceList({ className = '' }: { className?: string }) {
  const { t } = useT();
  return (
    <div className={`space-y-5 ${className}`}>
      <ReassuranceLine icon="hourglass" label={t('welcome.reassureTimeLabel')}  detail={t('welcome.reassureTimeDetail')} />
      <ReassuranceLine icon="voice"     label={t('welcome.reassureVoiceLabel')} detail={t('welcome.reassureVoiceDetail')} />
      <ReassuranceLine icon="heart"     label={t('welcome.reassureCareLabel')}  detail={t('welcome.reassureCareDetail')} />
    </div>
  );
}

export type { InterviewSession };

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { LANGUAGES, type LanguageCode } from '../lib/api';
import { useT } from '../lib/i18n';

type EyebrowSize = 'primary' | 'secondary' | 'tertiary' | 'breadcrumb' | 'micro';
type EyebrowTone = 'earth400' | 'earth500' | 'clay' | 'sage';

const EYEBROW_SIZES: Record<EyebrowSize, string> = {
  primary:    'text-[11px] tracking-[0.2em]',
  secondary:  'text-[11px] tracking-[0.18em]',
  tertiary:   'text-[11px] tracking-[0.14em]',
  breadcrumb: 'text-[11px] tracking-[0.16em]',
  micro:      'text-[10px] tracking-[0.12em]',
};
const EYEBROW_TONES: Record<EyebrowTone, string> = {
  earth400: 'text-earth-400',
  earth500: 'text-earth-500',
  clay:     'text-clay-700',
  sage:     'text-sage-700',
};

interface EyebrowProps {
  children: ReactNode;
  size?: EyebrowSize;
  tone?: EyebrowTone;
  className?: string;
}
export function Eyebrow({ children, size = 'primary', tone = 'earth500', className = '' }: EyebrowProps) {
  return (
    <span className={`uppercase font-medium ${EYEBROW_SIZES[size]} ${EYEBROW_TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function HRule({ tone = 'default', className = '' }: { tone?: 'default' | 'soft'; className?: string }) {
  const c = tone === 'soft' ? 'bg-earth-700/8' : 'bg-earth-700/10';
  return <span className={`h-px flex-1 ${c} ${className}`}></span>;
}

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  subtitle?: boolean;
  className?: string;
}
export function BrandMark({ size = 'md', subtitle = true, className = '' }: BrandMarkProps) {
  const { t } = useT();
  const isLg = size === 'lg';
  const isSm = size === 'sm';
  const dotSize = isLg ? 'w-2.5 h-2.5' : isSm ? 'w-1.5 h-1.5' : 'w-2 h-2';
  const title = isLg ? 'text-3xl' : isSm ? 'text-base' : 'text-xl';
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <span aria-hidden="true" className={`${dotSize} rounded-full bg-clay-500`}></span>
      <div className="leading-none">
        <div className={`font-serif ${title} text-earth-800`} style={{ letterSpacing: '-0.012em' }}>
          {t('brand.name')}
        </div>
        {subtitle && (
          <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-earth-400 font-medium">
            {t('brand.tagline')}
          </div>
        )}
      </div>
      <span aria-hidden="true" className={`${dotSize} rounded-full bg-sage-500`}></span>
    </div>
  );
}

export function DottedEyebrow({ children, size = 'primary', tone = 'earth500', className = '' }: EyebrowProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-clay-500"></span>
      <Eyebrow size={size} tone={tone}>{children}</Eyebrow>
      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-sage-500"></span>
    </div>
  );
}

export function SingleDotEyebrow({
  children, dot = 'sage', size = 'primary', tone = 'earth500', className = '',
}: EyebrowProps & { dot?: 'sage' | 'clay' }) {
  const dotColor = dot === 'clay' ? 'bg-clay-500' : 'bg-sage-500';
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      <Eyebrow size={size} tone={tone}>{children}</Eyebrow>
    </div>
  );
}

export function DividerEyebrow({
  children, size = 'secondary', tone = 'earth400', className = '',
}: EyebrowProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <HRule tone="soft" />
      <Eyebrow size={size} tone={tone}>{children}</Eyebrow>
      <HRule tone="soft" />
    </div>
  );
}

export type IconName =
  | 'arrow-left' | 'arrow-right' | 'arrow-mini' | 'chevron'
  | 'check' | 'check-mini' | 'check-bold'
  | 'send' | 'plus' | 'envelope' | 'download' | 'info' | 'globe';

const ICONS: Record<IconName, { vb: string; d?: string; body?: ReactNode }> = {
  'arrow-left':  { vb: '0 0 20 20', d: 'M15 10H3M8 5l-5 5 5 5' },
  'arrow-right': { vb: '0 0 20 20', d: 'M4 10h12M11 5l5 5-5 5' },
  'arrow-mini':  { vb: '0 0 12 12', d: 'M2 6h8M7 3l3 3-3 3' },
  'chevron':     { vb: '0 0 16 16', d: 'M4 6l4 4 4-4' },
  'check':       { vb: '0 0 20 20', d: 'M5 10.5L8.5 14L15 7' },
  'check-mini':  { vb: '0 0 14 14', d: 'M3 7l3 3 5-6' },
  'check-bold':  { vb: '0 0 20 20', d: 'M4 10l4 4 8-9' },
  'send':        { vb: '0 0 20 20', d: 'M3 10l14-7-5 16-3-7-6-2z' },
  'plus':        { vb: '0 0 20 20', d: 'M10 4v12M4 10h12' },
  'envelope':    { vb: '0 0 20 20', d: 'M3 7l9 6 9-6M3 7v10h18V7M3 7l9-4 9 4' },
  'download':    { vb: '0 0 16 16', d: 'M8 2v9M4.5 7.5L8 11l3.5-3.5M3 13h10' },
  'info':        { vb: '0 0 20 20', body: <><circle cx="10" cy="10" r="8"/><path d="M10 6v5M10 14h.01"/></> },
  'globe':       { vb: '0 0 20 20', body: <><circle cx="10" cy="10" r="8"/><path d="M2 10h16M10 2a10 14 0 010 16M10 2a10 14 0 000 16"/></> },
};

export function LanguageMenu() {
  const { locale, setLocale, t } = useT();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('languageMenu.trigger')}
        className="focus-warm inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-50 ring-1 ring-earth-700/15 hover:ring-earth-700/30 hover:bg-cream-100 transition text-xs font-medium tracking-wide text-earth-700"
      >
        <Icon name="globe" className="w-3.5 h-3.5" />
        <span className="uppercase">{current.code}</span>
        <Icon name="chevron" className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          role="menu"
          aria-label={t('languageMenu.label')}
          className="absolute right-0 mt-2 z-30 min-w-[200px] bg-cream-50 rounded-2xl shadow-lift ring-1 ring-earth-700/10 p-1.5 animate-fade-in"
        >
          {LANGUAGES.map((L) => {
            const active = L.code === locale;
            return (
              <button
                key={L.code}
                role="menuitemradio"
                aria-checked={active}
                onClick={() => { setLocale(L.code); setOpen(false); }}
                className={`focus-warm w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                  active
                    ? 'bg-earth-700 text-cream-50'
                    : 'text-earth-700 hover:bg-cream-100'
                }`}
              >
                <span>{L.label}</span>
                {L.native !== L.label && (
                  <span className={`ml-1.5 text-[11px] ${active ? 'text-cream-50/70' : 'text-earth-400'}`}>
                    {L.native}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface IconProps {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}
export function Icon({ name, className = 'w-4 h-4', strokeWidth = 1.75 }: IconProps) {
  const icon = ICONS[name];
  if (!icon) return null;
  return (
    <svg className={className} viewBox={icon.vb} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icon.d ? <path d={icon.d} /> : icon.body}
    </svg>
  );
}

interface IconButtonProps {
  onClick?: () => void;
  label: string;
  icon: IconName;
  className?: string;
}
export function IconButton({ onClick, label, icon, className = '' }: IconButtonProps) {
  return (
    <button onClick={onClick} aria-label={label}
      className={`w-8 h-8 rounded-full hover:bg-earth-700/5 flex items-center justify-center text-earth-500 hover:text-earth-700 transition shrink-0 focus-warm ${className}`}>
      <Icon name={icon} />
    </button>
  );
}

interface ButtonBaseProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}
export function PrimaryButton({
  children, onClick, disabled, type, className = '',
}: ButtonBaseProps & { type?: 'button' | 'submit' | 'reset' }) {
  return (
    <button
      type={type || 'button'}
      onClick={onClick}
      disabled={disabled}
      className={`focus-warm inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-medium tracking-wide transition-all duration-200
        ${disabled
          ? 'bg-earth-700/20 text-earth-700/40 cursor-not-allowed'
          : 'bg-earth-700 text-cream-50 hover:bg-earth-800 active:scale-[0.985] shadow-soft'} ${className}`}>
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick, disabled, className = '' }: ButtonBaseProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`focus-warm inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide
        text-earth-700 bg-cream-50 ring-1 ring-earth-700/15 hover:ring-earth-700/30 hover:bg-cream-100 transition-all duration-200 ${className}`}>
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick, className = '' }: ButtonBaseProps) {
  return (
    <button
      onClick={onClick}
      className={`focus-warm inline-flex items-center min-h-[40px] px-2 py-2 text-sm text-earth-500 hover:text-earth-800 underline decoration-earth-400/40 underline-offset-4 hover:decoration-earth-700 transition ${className}`}>
      {children}
    </button>
  );
}

interface FieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}
export function Field({ label, placeholder, value, onChange, type = 'text', onKeyDown }: FieldProps) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.14em] text-earth-500 font-medium mb-2">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="focus-warm w-full bg-cream-100 border border-transparent rounded-xl px-4 py-3 text-[15px] text-earth-800 placeholder:text-earth-400/70 transition-all duration-200"
      />
    </label>
  );
}

export type AlertTone = 'info' | 'success' | 'error';
interface AlertProps {
  tone?: AlertTone;
  children: ReactNode;
}
export function Alert({ tone = 'info', children }: AlertProps) {
  const map: Record<AlertTone, { bg: string; fg: string; ring: string; icon: IconName }> = {
    error:   { bg: 'bg-clay-50',   fg: 'text-clay-700',  ring: 'ring-clay-200',     icon: 'info' },
    success: { bg: 'bg-sage-100',  fg: 'text-sage-700',  ring: 'ring-sage-200',     icon: 'check-bold' },
    info:    { bg: 'bg-cream-200', fg: 'text-earth-700', ring: 'ring-earth-700/10', icon: 'info' },
  };
  const s = map[tone];
  return (
    <div role="status" className={`mt-4 flex items-start gap-3 p-3.5 rounded-xl ${s.bg} ${s.fg} ring-1 ${s.ring} animate-fade-in`}>
      <span className="mt-0.5 shrink-0"><Icon name={s.icon} strokeWidth={tone === 'success' ? 2 : 1.75} /></span>
      <div className="text-sm">{children}</div>
    </div>
  );
}

export function Spinner({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

interface StatusOrbProps {
  done?: boolean;
  icon?: IconName;
  size?: 'md' | 'lg';
}
export function StatusOrb({ done = false, icon = 'check', size = 'md' }: StatusOrbProps) {
  const dim = size === 'lg' ? 'w-16 h-16' : 'w-12 h-12';
  return (
    <div className={`relative ${dim} mx-auto`}>
      <span className="absolute inset-0 rounded-full bg-sage-500/15 animate-soft-pulse"></span>
      <span className="absolute inset-2 rounded-full bg-sage-500/20"></span>
      <span className={`absolute inset-4 rounded-full transition-colors duration-700 flex items-center justify-center text-cream-50 ${done ? 'bg-sage-500' : 'bg-clay-400'}`}>
        {done && <Icon name={icon} className="w-4 h-4 animate-fade-in" strokeWidth={2} />}
      </span>
    </div>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}
export function Card({ children, className = '', style }: CardProps) {
  return (
    <div style={style} className={`bg-cream-50 rounded-2xl shadow-soft ring-1 ring-earth-700/5 ${className}`}>
      {children}
    </div>
  );
}

export function StatusPill({ status }: { status: 'completed' | 'in_progress' }) {
  const { t } = useT();
  const map = {
    completed:   { bg: 'bg-sage-100', fg: 'text-sage-700', dot: 'bg-sage-500', label: t('statusPill.completed') },
    in_progress: { bg: 'bg-clay-50',  fg: 'text-clay-700', dot: 'bg-clay-500', label: t('statusPill.inProgress') },
  };
  const s = map[status] || map.completed;
  return (
    <span className={`inline-flex items-center gap-1.5 ${s.bg} ${s.fg} text-xs font-medium px-2.5 py-1 rounded-full`}>
      <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
      {s.label}
    </span>
  );
}

export interface Tone {
  fg: string;
  bg: string;
  bar: string;
  ring: string;
}
export function scoreTone(score: number): Tone {
  if (score >= 4) return { fg: 'text-sage-700',  bg: 'bg-sage-100',  bar: 'bg-sage-500',  ring: 'ring-sage-200' };
  if (score >= 3) return { fg: 'text-earth-700', bg: 'bg-cream-200', bar: 'bg-earth-400', ring: 'ring-earth-300' };
  return                 { fg: 'text-clay-700',  bg: 'bg-clay-50',   bar: 'bg-clay-500',  ring: 'ring-clay-200' };
}

export function ScoreMeter({ score, max = 5, accent }: { score: number; max?: number; accent: string }) {
  const segments = 10;
  const filled = Math.round((score / max) * segments);
  return (
    <div className="flex items-center gap-[3px] w-full" aria-hidden="true">
      {Array.from({ length: segments }).map((_, i) => (
        <div key={i} className={`h-1.5 flex-1 rounded-full ${i < filled ? accent : 'bg-earth-700/8'}`}></div>
      ))}
    </div>
  );
}

export function ConfidenceGlyph({ confidence }: { confidence: number }) {
  return (
    <span className="inline-flex items-end gap-[2px] h-3" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n}
          className={`w-[2px] rounded-sm ${n <= confidence ? 'bg-earth-500' : 'bg-earth-700/15'}`}
          style={{ height: `${n * 2 + 2}px` }}></span>
      ))}
    </span>
  );
}

const LANGUAGE_DOT_COLOR: Record<LanguageCode, string> = {
  en: '#73855A',
  pt: '#BE6A3B',
  es: '#A4542A',
  fr: '#5C4A33',
  id: '#8B9C70',
  sw: '#D08658',
};
export function LanguageDot({ code }: { code: LanguageCode | string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block w-2 h-2 rounded-full shrink-0"
      style={{ background: LANGUAGE_DOT_COLOR[code as LanguageCode] || '#8E7857' }}
    ></span>
  );
}

export function TypingIndicator() {
  const { t } = useT();
  return (
    <div className="flex items-center gap-1 px-1 py-2" aria-label={t('ariaLabel.facilitatorComposing')}>
      {[0, 1, 2].map((i) => (
        <span key={i}
          className="w-1.5 h-1.5 rounded-full bg-earth-500/80 animate-dot-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}></span>
      ))}
    </div>
  );
}

export function MicButton({ listening, onClick }: { listening: boolean; onClick?: () => void }) {
  const { t } = useT();
  return (
    <button onClick={onClick}
      aria-label={listening ? t('ariaLabel.stopListening') : t('ariaLabel.startVoice')}
      aria-pressed={listening}
      className={`focus-warm relative shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200
        ${listening
          ? 'bg-clay-500 text-cream-50'
          : 'bg-cream-50 text-earth-700 ring-1 ring-earth-700/15 hover:ring-earth-700/30'}`}>
      {listening && (
        <>
          <span aria-hidden="true" className="pulse-ring animate-mic-pulse"></span>
          <span aria-hidden="true" className="pulse-ring animate-mic-pulse" style={{ animationDelay: '0.6s' }}></span>
        </>
      )}
      <svg className={`w-5 h-5 relative ${listening ? 'animate-mic-ring' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M6 11a6 6 0 0012 0" />
        <path d="M12 17v4" />
        <path d="M9 21h6" />
      </svg>
    </button>
  );
}

export function PlayButton({ playing, onClick }: { playing: boolean; onClick?: () => void }) {
  const { t } = useT();
  return (
    <button onClick={onClick}
      aria-label={playing ? t('ariaLabel.pause') : t('ariaLabel.play')}
      aria-pressed={playing}
      className={`focus-warm inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] font-medium pl-2 pr-3 py-1.5 rounded-full transition-colors
        ${playing
          ? 'bg-clay-500/15 text-clay-700'
          : 'text-earth-400 hover:text-earth-700 hover:bg-earth-700/5'}`}>
      <span className="w-5 h-5 rounded-full bg-cream-50 ring-1 ring-earth-700/15 flex items-center justify-center">
        {playing ? (
          <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><rect x="2" y="1.5" width="2" height="7" rx="0.5" /><rect x="6" y="1.5" width="2" height="7" rx="0.5" /></svg>
        ) : (
          <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><path d="M2.5 1.2v7.6a.3.3 0 0 0 .47.25l5.6-3.8a.3.3 0 0 0 0-.5L2.97.95A.3.3 0 0 0 2.5 1.2Z" /></svg>
        )}
      </span>
      <span>{playing ? 'Playing' : 'Play'}</span>
      {playing && (
        <span className="flex items-end gap-[1.5px] h-3 ml-0.5" aria-hidden="true">
          {[3, 6, 4, 5, 3].map((h, i) => (
            <span key={i} className="audio-bar animate-soft-pulse"
              style={{ height: `${h}px`, animationDelay: `${i * 0.13}s` }}></span>
          ))}
        </span>
      )}
    </button>
  );
}

export function FacilitatorAvatar({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  return (
    <div className={`${s} rounded-full bg-gradient-to-br from-sage-200 to-sage-500 flex items-center justify-center text-cream-50 shrink-0 ring-2 ring-cream-100`} aria-hidden="true">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 21a8 8 0 1116 0" />
        <circle cx="12" cy="9" r="4" />
      </svg>
    </div>
  );
}

export function TeamAvatar({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  return (
    <div className={`${s} rounded-full bg-gradient-to-br from-clay-200 to-clay-500 flex items-center justify-center text-cream-50 shrink-0 ring-2 ring-cream-100 text-xs font-semibold`} aria-hidden="true">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="9" r="3.2" />
        <circle cx="17" cy="10" r="2.6" />
        <path d="M3 19a6 6 0 0112 0" />
        <path d="M14.5 19a4.5 4.5 0 016.5-4" />
      </svg>
    </div>
  );
}

export function InitialsAvatar({ email }: { email: string }) {
  const name = (email || '').split('@')[0];
  const parts = name.replace(/[._-]/g, ' ').split(' ').filter(Boolean);
  const initials = ((parts[0]?.[0] || '?') + (parts[1]?.[0] || '')).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-cream-200 flex items-center justify-center text-earth-600 text-xs font-medium shrink-0">
      {initials}
    </div>
  );
}

export type ReassuranceIconName = 'hourglass' | 'voice' | 'heart';
export function ReassuranceIcon({ name }: { name: ReassuranceIconName }) {
  const props = {
    className: 'w-4 h-4',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.75',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  if (name === 'hourglass') return <svg {...props}><path d="M6 3h12M6 21h12M7 3v2a5 5 0 0010 0V3M7 21v-2a5 5 0 0110 0v2" /></svg>;
  if (name === 'voice')     return <svg {...props}><path d="M4 12h2M8 7v10M12 4v16M16 9v6M20 11v2" /></svg>;
  return <svg {...props}><path d="M12 21s-7-4.35-7-10a4.5 4.5 0 018-2.8A4.5 4.5 0 0119 11c0 5.65-7 10-7 10z" /></svg>;
}

export function SectionHeader({ eyebrow }: { eyebrow?: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-4">
      {eyebrow && <Eyebrow size="secondary" tone="earth400">{eyebrow}</Eyebrow>}
      <HRule />
    </div>
  );
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

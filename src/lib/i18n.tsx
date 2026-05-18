import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { LANGUAGES, type LanguageCode } from './api';
import { dictionaries, type Dictionary } from './translations';

const DEFAULT_LOCALE: LanguageCode = 'en';
const STORAGE_PREFIX = 'obt:locale:';
const GUEST_KEY = 'guest';

type Vars = Record<string, string | number>;

interface I18nContextValue {
  locale: LanguageCode;
  setLocale: (next: LanguageCode) => void;
  t: <T = string>(path: string, vars?: Vars) => T;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function storageKey(identity: string): string {
  return `${STORAGE_PREFIX}${identity || GUEST_KEY}`;
}

function detectInitial(identity: string): LanguageCode {
  try {
    const stored = window.localStorage.getItem(storageKey(identity));
    if (stored && LANGUAGES.some((l) => l.code === stored)) return stored as LanguageCode;
  } catch {
    // ignore
  }
  try {
    const nav = (window.navigator?.language || '').slice(0, 2).toLowerCase();
    if (LANGUAGES.some((l) => l.code === nav)) return nav as LanguageCode;
  } catch {
    // ignore
  }
  return DEFAULT_LOCALE;
}

function resolve(dict: Dictionary, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, dict);
}

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => (vars[key] !== undefined ? String(vars[key]) : `{${key}}`));
}

export function I18nProvider({ adminEmail, children }: { adminEmail?: string | null; children: ReactNode }) {
  const identity = adminEmail || GUEST_KEY;
  const [locale, setLocaleState] = useState<LanguageCode>(() => detectInitial(identity));
  const lastIdentity = useRef(identity);

  useEffect(() => {
    if (lastIdentity.current === identity) return;
    lastIdentity.current = identity;
    try {
      const stored = window.localStorage.getItem(storageKey(identity));
      if (stored && LANGUAGES.some((l) => l.code === stored)) {
        setLocaleState(stored as LanguageCode);
      }
      // else: carry over current locale (no reset)
    } catch {
      // ignore
    }
  }, [identity]);

  const setLocale = useCallback((next: LanguageCode) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(storageKey(identity), next);
    } catch {
      // ignore
    }
  }, [identity]);

  const t = useCallback(<T = string,>(path: string, vars?: Vars): T => {
    const dict = dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
    let value = resolve(dict, path);
    if (value === undefined) {
      value = resolve(dictionaries[DEFAULT_LOCALE], path);
    }
    if (typeof value === 'string') {
      return interpolate(value, vars) as unknown as T;
    }
    return (value as T) ?? (path as unknown as T);
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useT must be used inside <I18nProvider>');
  return ctx;
}

import { useCallback, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import i18n, {
  LOCALE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  type SupportedLocale,
  isSupportedLocale,
} from '../i18n';
import type { LanguageCode } from './fixtures';

type Vars = Record<string, string | number>;

interface I18nContextValue {
  locale: LanguageCode;
  setLocale: (next: LanguageCode) => void;
  t: <T = string>(path: string, vars?: Vars) => T;
}

export function I18nProvider({ children }: { adminEmail?: string | null; children: ReactNode }) {
  return <>{children}</>;
}

export function useT(): I18nContextValue {
  const { t, i18n: i18nInstance } = useTranslation();

  const locale = (isSupportedLocale(i18nInstance.language)
    ? i18nInstance.language
    : 'en') as LanguageCode;

  const setLocale = useCallback((next: LanguageCode) => {
    void i18nInstance.changeLanguage(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      void 0;
    }
  }, [i18nInstance]);

  const translate = useCallback(<T,>(path: string, vars?: Vars): T => {
    const value = t(path, (vars ?? {}) as Record<string, unknown>);
    if (typeof value === 'string') return value as unknown as T;
    return (value as T) ?? (path as unknown as T);
  }, [t]);

  return useMemo(
    () => ({ locale, setLocale, t: translate }),
    [locale, setLocale, translate],
  );
}

export { SUPPORTED_LANGUAGES, isSupportedLocale };
export type { SupportedLocale };
export { i18n };

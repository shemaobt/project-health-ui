import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import id from './locales/id.json';
import pt from './locales/pt.json';
import sw from './locales/sw.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'pt', label: 'Portuguese', native: 'Português' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'id', label: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'sw', label: 'Swahili', native: 'Kiswahili' },
] as const;

export type SupportedLocale = (typeof SUPPORTED_LANGUAGES)[number]['code'];
export const LOCALE_STORAGE_KEY = 'ph_locale';

const SUPPORTED_CODES = SUPPORTED_LANGUAGES.map((l) => l.code) as readonly string[];

export function isSupportedLocale(code: string | null | undefined): code is SupportedLocale {
  return !!code && SUPPORTED_CODES.includes(code);
}

function detectInitialLanguage(): string {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(LOCALE_STORAGE_KEY) : null;
  if (isSupportedLocale(stored)) return stored;

  const browserLangs = typeof navigator !== 'undefined' ? navigator.languages ?? [navigator.language] : [];
  for (const browserLang of browserLangs) {
    if (isSupportedLocale(browserLang)) return browserLang;
    const base = browserLang.split('-')[0];
    if (isSupportedLocale(base)) return base;
  }
  return 'en';
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pt: { translation: pt },
    es: { translation: es },
    fr: { translation: fr },
    id: { translation: id },
    sw: { translation: sw },
  },
  lng: detectInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
    prefix: '{',
    suffix: '}',
  },
  returnNull: false,
});

export default i18n;

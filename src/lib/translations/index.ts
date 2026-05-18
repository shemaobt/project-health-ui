import type { LanguageCode } from '../api';
import { en, type Dictionary } from './en';
import { es } from './es';
import { fr } from './fr';
import { id } from './id';
import { pt } from './pt';
import { sw } from './sw';

export type { Dictionary } from './en';

export const dictionaries: Record<LanguageCode, Dictionary> = {
  en,
  pt,
  es,
  fr,
  id,
  sw,
};

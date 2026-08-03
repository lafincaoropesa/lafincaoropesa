import es from './es.json';
import fr from './fr.json';
import en from './en.json';
import { DEFAULT_LOCALE, type Locale } from '../config/site';

export const dictionaries = { es, fr, en } satisfies Record<Locale, unknown>;

export type Dictionary = typeof es;

/** Renvoie le dictionnaire de traductions pour une langue donnée. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

/** Déduit la langue courante à partir du chemin d'URL (ex. /fr/l-oliveraie/ -> "fr"). */
export function getLocaleFromUrl(url: URL): Locale {
  const [, maybeLocale] = url.pathname.split('/');
  if (maybeLocale === 'es' || maybeLocale === 'fr' || maybeLocale === 'en') {
    return maybeLocale;
  }
  return DEFAULT_LOCALE;
}

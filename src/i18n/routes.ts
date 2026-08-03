import { LOCALES, type Locale } from '../config/site';

/**
 * Chaque clé est une page "canonique" du site. La valeur donne le slug (segment d'URL)
 * de cette page dans chaque langue. C'est ce qui permet des URLs traduites
 * (ex. /fr/l-oliveraie/ et /es/el-olivar/ pointent vers la même page).
 *
 * Une chaîne vide '' signifie la racine de la langue (ex. /es/).
 */
export const ROUTES = {
  home: { es: '', fr: '', en: '' },
  oliveraie: { es: 'el-olivar', fr: 'l-oliveraie', en: 'the-olive-grove' },
  projet: { es: 'el-proyecto', fr: 'le-projet', en: 'the-project' },
  sejourner: { es: 'alojarse', fr: 'sejourner', en: 'stay' },
  spa: { es: 'el-spa', fr: 'le-spa', en: 'the-spa' },
  table: { es: 'la-mesa', fr: 'la-table', en: 'the-table' },
  retraites: { es: 'los-retiros', fr: 'les-retraites', en: 'the-retreats' },
  legal: { es: 'aviso-legal', fr: 'mentions-legales', en: 'legal-notice' },
  privacidad: { es: 'privacidad', fr: 'confidentialite', en: 'privacy' },
  cookies: { es: 'cookies', fr: 'cookies', en: 'cookies' },
  confirmation: { es: 'gracias', fr: 'merci', en: 'thank-you' },
} as const;

export type RouteKey = keyof typeof ROUTES;

/** Chemin absolu (avec préfixe de langue) d'une page canonique dans une langue donnée. */
export function pathTo(key: RouteKey, locale: Locale): string {
  const slug = ROUTES[key][locale];
  return slug ? `/${locale}/${slug}/` : `/${locale}/`;
}

/** Construit les liens hreflang (toutes langues + x-default) pour une page canonique. */
export function alternateLinks(key: RouteKey): { hreflang: string; href: string }[] {
  const links = LOCALES.map((locale) => ({
    hreflang: locale,
    href: `https://lafincaoropesa.com${pathTo(key, locale)}`,
  }));
  links.push({ hreflang: 'x-default', href: `https://lafincaoropesa.com${pathTo(key, 'es')}` });
  return links;
}

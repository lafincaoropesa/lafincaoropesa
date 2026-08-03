/**
 * Données factuelles du domaine, centralisées ici pour être modifiées en un seul endroit.
 * Voir MODIFIER-LE-SITE.md pour le guide non-développeur.
 */

export const SITE = {
  name: 'La Finca Oropesa',
  domain: 'lafincaoropesa.com',
  url: 'https://lafincaoropesa.com',

  contact: {
    email: 'contact@lafincaoropesa.com',
    phone: '+33 7 49 24 10 17',
  },

  address: {
    line1: 'La Viña del Capitán',
    locality: 'La Calzada de Oropesa',
    province: 'Toledo',
    region: 'Castilla-La Mancha',
    country: 'ES',
    // TODO: coordonnées GPS exactes à confirmer avant mise en production (utilisées pour la carte et Schema.org).
    lat: 39.9236,
    lng: -5.2536,
  },

  distances: {
    madrid: { km: 140, minutes: 120 },
    madridAirport: { km: 155, minutes: 130 },
  },

  suites: {
    count: 15,
    capacityPerSuite: 2,
    priceFrom: 400,
    currency: 'EUR',
  },

  openingSeason: {
    es: 'primavera de 2027',
    fr: 'printemps 2027',
    en: 'spring 2027',
  },

  oliveTrees: 1200,

  // Pages prêtes (gabarits codés) mais non publiées : passer à `true` et créer les fichiers
  // de route correspondants une fois les photos définitives disponibles.
  // Voir MODIFIER-LE-SITE.md, section "Activer une page à venir".
  upcomingPages: {
    spa: false,
    table: false,
    retraites: false,
  },

  // Réseaux sociaux : aucun pour l'instant. Structure prête à recevoir des entrées
  // ({ label: 'Instagram', url: '...' }) sans changement de composant.
  socialLinks: [] as { label: string; url: string }[],
} as const;

export type Locale = 'es' | 'fr' | 'en';
export const LOCALES: Locale[] = ['es', 'fr', 'en'];
export const DEFAULT_LOCALE: Locale = 'es';

// Ajouter une langue (ex. le portugais) : ajouter son code ici, créer src/i18n/pt.json
// en copiant es.json, et ajouter les entrées "pt" dans src/i18n/routes.ts.

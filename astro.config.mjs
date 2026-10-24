// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://lafincaoropesa.com',

  vite: {
    plugins: [tailwindcss()]
  },

  // Mesure d'audience sans cookie (Vercel Analytics) : pas de bandeau de consentement nécessaire.
  // À activer aussi dans Vercel : projet > onglet Analytics > Enable.
  adapter: vercel({ webAnalytics: { enabled: true } }),
  integrations: [
    sitemap({
      // Exclut la racine (redirection) et les pages de confirmation (destinations de
      // redirection post-formulaire, sans intérêt pour l'indexation).
      filter: (page) =>
        page !== 'https://lafincaoropesa.com/' &&
        !/\/(gracias|merci|thank-you)\/$/.test(page),
    }),
  ]
});
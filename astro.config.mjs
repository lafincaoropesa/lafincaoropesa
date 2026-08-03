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

  adapter: vercel(),
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
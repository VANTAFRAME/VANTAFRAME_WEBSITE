// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
// Technical/demo/presentation routes that carry noindex,nofollow and must
// never surface in the sitemap Google is pointed at — see robots meta on
// each of these pages in src/pages.
const SITEMAP_EXCLUDED_PATHS = [
  "/logo-demo/",
  "/presentation/",
  "/presentation-system/",
  "/prezentacja/",
  "/social-asset/",
  "/social-asset-v2/",
];

export default defineConfig({
  integrations: [
    react(),
    sitemap({
      filter: (page) => !SITEMAP_EXCLUDED_PATHS.some((path) => page.endsWith(path)),
    }),
  ],
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()]
  },
  site: 'https://vantaframe.pl'
});

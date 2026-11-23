// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { WIEDZA_PUBLIC } from './src/data/wiedzaConfig.js';
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
  "/polityka-prywatnosci/",
  "/kreator-projektu/",
];
export default defineConfig({
  integrations: [
    react(),
    sitemap({
      // The knowledge base (/wiedza/...) stays out of the sitemap until WIEDZA_PUBLIC is true (src/data/wiedzaConfig.js).
      filter: (page) =>
        !SITEMAP_EXCLUDED_PATHS.some((path) => page.endsWith(path)) && (WIEDZA_PUBLIC || !page.includes("/wiedza/")),
    }),
  ],
  adapter: vercel(),
  // Every URL ends with a slash (/strony/, not /strony). On Vercel the slashless form gets a
  // 308 to the slashed one, matching the canonical tags in Layout.astro.
  trailingSlash: "always",
  // Permanent (301) redirects for retired URLs. All point straight at the final address,
  // so no visitor or crawler goes through two hops.
  // 1) 2026-11: the AI offer moved from /automatyzacje/* to /wdrozenia-ai/* (pillar + 5 pages);
  //    the former /automatyzacje/wdrozenia-ai/ page is merged into the /wdrozenia-ai/ pillar.
  // 2) Older addresses of the same pages (early /automatyzacje/ slugs and the very first
  //    top-level slugs). "/wdrozenia-ai" is NOT here any more: it is now a real page.
  // Keys are written without the trailing slash. On Vercel, scripts/vercel-redirects.mjs
  // (run by `npm run build`) makes each rule match the slashed form too.
  redirects: {
    "/automatyzacje": { status: 301, destination: "/wdrozenia-ai/" },
    "/automatyzacje/wdrozenia-ai": { status: 301, destination: "/wdrozenia-ai/" },
    "/automatyzacje/automatyzacja-procesow": { status: 301, destination: "/wdrozenia-ai/automatyzacja-procesow/" },
    "/automatyzacje/agenci-ai": { status: 301, destination: "/wdrozenia-ai/agenci-ai/" },
    "/automatyzacje/asystenci-ai": { status: 301, destination: "/wdrozenia-ai/asystenci-ai/" },
    "/automatyzacje/integracje-ai": { status: 301, destination: "/wdrozenia-ai/integracje-ai/" },
    "/automatyzacje/automatyzacja-dokumentow": { status: 301, destination: "/wdrozenia-ai/automatyzacja-dokumentow/" },
    "/automatyzacje/procesy-biznesowe": { status: 301, destination: "/wdrozenia-ai/automatyzacja-procesow/" },
    "/automatyzacje/dokumenty": { status: 301, destination: "/wdrozenia-ai/automatyzacja-dokumentow/" },
    "/automatyzacja-procesow": { status: 301, destination: "/wdrozenia-ai/automatyzacja-procesow/" },
    "/agenci-ai": { status: 301, destination: "/wdrozenia-ai/agenci-ai/" },
    "/asystenci-ai": { status: 301, destination: "/wdrozenia-ai/asystenci-ai/" },
    "/integracje-ai": { status: 301, destination: "/wdrozenia-ai/integracje-ai/" },
    "/automatyzacja-dokumentow": { status: 301, destination: "/wdrozenia-ai/automatyzacja-dokumentow/" },
  },
  vite: {
    plugins: [tailwindcss()]
  },
  site: 'https://vantaframe.pl'
});
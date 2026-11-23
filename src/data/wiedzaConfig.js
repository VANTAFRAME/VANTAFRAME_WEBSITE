// Publication switch for the knowledge base (/wiedza/).
//
// STATE: WIEDZA_PUBLIC = true since 2026-11-23 — the section is published with one article; more articles are added later.
//
// WIEDZA_PUBLIC = false (the section is built but kept private):
//   - /wiedza/ and every article carry robots "noindex, follow";
//   - they are left out of sitemap-0.xml (filter in astro.config.mjs, "/wiedza/" prefix);
//   - no link to them anywhere: not in the menu (the "Wiedza" menu item is not rendered in the production build), not in the footer, not in llms.txt / llms-full.txt;
//   - /wiedza/rss.xml is an empty channel (valid RSS 2.0, no items).
// WIEDZA_PUBLIC = true (go live):
//   - /wiedza/ and the articles are "index, follow" and appear in the sitemap;
//   - the footer and the main menu show a "Wiedza" link;
//   - llms.txt and llms-full.txt list the articles (src/pages/llms*.txt.ts);
//   - /wiedza/rss.xml lists the published articles.
// In `npm run dev` the menu item is always shown (to work on the section), whatever this switch says.
// Articles with `draft: true` in their frontmatter are never built, whatever this switch says.
export const WIEDZA_PUBLIC = true;
import { getArticles } from "../../lib/wiedza";
import { getAuthor } from "../../data/authors";
import { WIEDZA_PUBLIC } from "../../data/wiedzaConfig";
// RSS 2.0 without dependencies. While WIEDZA_PUBLIC is false the feed is a valid but empty channel
// (the simplest option: a static endpoint cannot return a 404), so nothing leaks before publication.
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export async function GET() {
  const articles = WIEDZA_PUBLIC ? await getArticles() : [];
  const items = articles
    .map((a) => {
      const link = `https://vantaframe.pl/wiedza/${a.id}/`;
      return `    <item>
      <title>${esc(a.data.title)}</title>
      <link>${link}</link>
      <description>${esc(a.data.description)}</description>
      <dc:creator>${esc(getAuthor(a.data.author).name)}</dc:creator>
      <pubDate>${a.data.publishedAt.toUTCString()}</pubDate>
      <guid isPermaLink="true">${link}</guid>
    </item>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Wiedza | VANTAFRAME</title>
    <link>https://vantaframe.pl/wiedza/</link>
    <description>Praktyczne artykuły VANTAFRAME o wdrażaniu AI w firmach.</description>
    <language>pl-PL</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
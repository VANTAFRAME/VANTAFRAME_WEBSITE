import { getCollection } from "astro:content";
import { WIEDZA_PUBLIC } from "../data/wiedzaConfig";
// Order of articles everywhere (list, RSS, llms, related): newest first; the same date: higher `priority` first;
// then by title (Polish alphabet). Drafts are never built.
const byOrder = (a, b) =>
  b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf() ||
  b.data.priority - a.data.priority ||
  a.data.title.localeCompare(b.data.title, "pl");
export const getArticles = async () => (await getCollection("wiedza", (a) => !a.data.draft)).sort(byOrder);
// Up to `n` other articles to read next: the same category first, then the rest in the order above.
export const relatedArticles = (all, current, n = 3) => {
  const others = all.filter((a) => a.id !== current.id);
  const same = others.filter((a) => a.data.category === current.data.category);
  return [...same, ...others.filter((a) => !same.includes(a))].slice(0, n);
};
// 200 words per minute, at least 1 minute.
export const readingTime = (body = "") => Math.max(1, Math.ceil(body.split(/\s+/).filter(Boolean).length / 200));
const MONTHS = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
export const formatDate = (d) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
export const isoDate = (d) => d.toISOString().slice(0, 10);
export const wiedzaRobots = WIEDZA_PUBLIC ? "index, follow" : "noindex, follow";
export const ogPath = (slug) => `/og/wiedza/${slug}.png`;
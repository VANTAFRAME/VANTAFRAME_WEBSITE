import { HUB_ORDER, HUB } from "./hub";
import wdrozeniaAi from "./wdrozenia-ai";
import agenciAi from "./agenci-ai";
import automatyzacjaProcesow from "./automatyzacja-procesow";
import integracjeAi from "./integracje-ai";
import asystenciAi from "./asystenci-ai";
import automatyzacjaDokumentow from "./automatyzacja-dokumentow";
// Page content for the six service pages (schema: see the files themselves).
export const SERVICES = {
  "wdrozenia-ai": wdrozeniaAi,
  "agenci-ai": agenciAi,
  "automatyzacja-procesow": automatyzacjaProcesow,
  "integracje-ai": integracjeAi,
  "asystenci-ai": asystenciAi,
  "automatyzacja-dokumentow": automatyzacjaDokumentow,
};
export const SERVICE_SLUGS = HUB_ORDER;
export const getService = (slug) => {
  const s = SERVICES[slug];
  if (!s) throw new Error(`Unknown AI service slug: ${slug}`);
  return { slug, path: HUB[slug].path, n: HUB[slug].n, ...s };
};
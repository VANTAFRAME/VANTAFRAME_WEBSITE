import { pushDataLayer } from "../tracking";
// Pushes into window.dataLayer through the shared, consent-gated helper (see
// lib/tracking.js): nothing is queued before the visitor accepts cookies, and
// personal data is stripped. GTM (GTM-KVP2NVZ9) is wired up in layouts/Layout.astro.
//
// Never pass PII here: no name, email, phone, free-text answers, or the existing-site URL.
export const trackEvent = (name, payload = {}) => {
  pushDataLayer(name, payload);
};
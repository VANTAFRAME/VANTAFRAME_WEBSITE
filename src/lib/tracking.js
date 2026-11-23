import { hasAcceptedConsent } from "./consent";
// Keys that must never reach the shared dataLayer (analytics / Google Ads tags
// read it). Anything matching is dropped, not masked.
const PII_KEYS = /(^|_)(e?-?mail|name|phone|tel|message|company|nip|address)($|_)/i;
const eventId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
// Pushes a custom event into window.dataLayer — only after the visitor has
// accepted cookies, and never with personal data. Returns the event_id used
// (also sent as a parameter) so related events can share it for de-duplication.
export const pushDataLayer = (event, params = {}) => {
  if (typeof window === "undefined" || !hasAcceptedConsent()) return null;
  const safe = {};
  Object.entries(params).forEach(([key, value]) => {
    if (!PII_KEYS.test(key)) safe[key] = value;
  });
  const id = safe.event_id || eventId();
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...safe, event_id: id });
  return id;
};
export const newEventId = eventId;
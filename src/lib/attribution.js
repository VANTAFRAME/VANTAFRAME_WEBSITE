import { hasAcceptedConsent } from "./consent";
// Campaign attribution for form submissions. Only the five standard UTM
// parameters are used. GCLID / other ad identifiers are deliberately NOT read
// or forwarded: they are passed on to a third-party form relay, and doing that
// needs a separate legal basis and consent-mode wiring (see the Ads checklist).
//
// The URL is read at submit time. Storing it for later pages (sessionStorage)
// only happens after cookie consent has been accepted.
const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
const STORE_KEY = "vf_attribution_v1";
const fromUrl = () => {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out = {};
  KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) out[key] = value.slice(0, 120);
  });
  return out;
};
export const captureAttribution = () => {
  const found = fromUrl();
  if (!Object.keys(found).length || !hasAcceptedConsent()) return;
  try {
    window.sessionStorage.setItem(STORE_KEY, JSON.stringify(found));
  } catch {
    /* storage unavailable — attribution simply stays URL-only */
  }
};
export const getAttribution = () => {
  const current = fromUrl();
  if (Object.keys(current).length) return current;
  if (!hasAcceptedConsent()) return {};
  try {
    return JSON.parse(window.sessionStorage.getItem(STORE_KEY) || "{}") || {};
  } catch {
    return {};
  }
};
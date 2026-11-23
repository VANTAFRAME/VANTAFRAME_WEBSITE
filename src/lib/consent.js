// Single source of truth for the cookie-consent state written by CookieBanner.
// Anything that pushes to window.dataLayer or stores campaign data must go
// through hasAcceptedConsent() so nothing is queued for GTM before the visitor
// has agreed (GTM replays the existing dataLayer when it finally loads).
export const CONSENT_KEY = "vf_cookie_consent_v1";
export const getConsentType = () => {
  if (typeof window === "undefined") return null;
  try {
    const stored = JSON.parse(window.localStorage.getItem(CONSENT_KEY) || "null");
    return stored && typeof stored.type === "string" ? stored.type : null;
  } catch {
    return null;
  }
};
export const hasAcceptedConsent = () => getConsentType() === "accepted";
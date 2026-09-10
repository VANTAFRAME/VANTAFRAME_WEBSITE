// No GTM/GA4 is wired up anywhere in this project today (verified: no gtag/GTM-/dataLayer
// references exist). This pushes into window.dataLayer defensively so it's a safe no-op
// until real analytics is configured, and works immediately once it is — nothing else
// needs to change on that day.
//
// Never pass PII here: no name, email, phone, free-text answers, or the existing-site URL.

export const trackEvent = (name, payload = {}) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...payload });
};

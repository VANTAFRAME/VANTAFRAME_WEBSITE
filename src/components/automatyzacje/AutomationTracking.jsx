import { useEffect } from "react";
import { pushDataLayer } from "../../lib/tracking";
// Click tracking for /automatyzacje, as one delegated listener (no per-link
// handlers to keep in sync). Everything goes through pushDataLayer(), so events
// are only recorded after cookie consent and never carry personal data or free
// text — only the fixed `data-cta-location` identifier of the clicked element.
//
//   automation_cta_click       any link to #contact (hero, scenario rows, final CTA, nav…)
//   automation_framework_open  the "Uruchom FRAMEWORK" link in the showcase
//
// Form events (start / success / error) are sent from Contact.jsx, and
// automation_framework_complete from the FRAMEWORK lead form (origin flag below).
const AutomationTracking = () => {
  useEffect(() => {
    const onClick = (event) => {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link) return;
      const location = link.dataset.ctaLocation || (link.closest("nav") ? "nav" : "other");
      if (link.hasAttribute("data-automation-framework")) {
        pushDataLayer("automation_framework_open", { cta_location: location });
        try {
          // Lets the FRAMEWORK page attribute a completed project to this landing page.
          window.sessionStorage.setItem("vf_framework_origin", "automatyzacje");
        } catch {
          /* sessionStorage unavailable */
        }
        return;
      }
      const href = link.getAttribute("href") || "";
      if (href === "#contact" || href.endsWith("/#contact") || href.endsWith("#contact")) {
        pushDataLayer("automation_cta_click", { cta_location: location });
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
};
export default AutomationTracking;
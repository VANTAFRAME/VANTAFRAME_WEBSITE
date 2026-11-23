import { pushDataLayer, newEventId } from "./tracking";
import { getAttribution } from "./attribution";
// Shared enquiry pipeline for the /automatyzacje forms (the hero drawer and the
// footer form). One transport (the existing formsubmit.co relay → kontakt@),
// one set of analytics events, and a `form_location` that tells the two forms
// apart in the e-mail and in GTM. `form_location` is a fixed identifier, not
// personal data.
export const FORM_TYPE = "automation_inquiry";
export const LOCATIONS = { drawer: "hero_drawer", footer: "footer_form" };
const SOURCE_LABEL = {
  [LOCATIONS.drawer]: "Panel kontaktowy /wdrozenia-ai (hero_drawer)",
  [LOCATIONS.footer]: "Formularz /wdrozenia-ai (footer_form)",
};
// Throws unless the relay has genuinely accepted the message: a non-2xx status,
// a network failure, or a body that explicitly says `success: false` all count
// as failures, so the UI never shows a success state (or records a conversion)
// for a message that was not sent.
export const sendInquiry = async ({ name, email, company, message, formLocation }) => {
  const response = await fetch("https://formsubmit.co/ajax/kontakt@vantaframe.pl", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: `Nowe zapytanie — automatyzacje (${name})`,
      _honey: "",
      name,
      email,
      ...(company ? { company } : {}),
      message,
      source: SOURCE_LABEL[formLocation] || formLocation,
      form_location: formLocation,
      form_type: FORM_TYPE,
      page: window.location.pathname,
      ...getAttribution(),
      submittedAt: new Date().toISOString(),
    }),
  });
  if (!response.ok) throw new Error(`Inquiry relay responded ${response.status}`);
  let body = null;
  try {
    body = await response.json();
  } catch {
    /* an empty/non-JSON 2xx body is treated as accepted */
  }
  if (body && (body.success === false || body.success === "false")) {
    throw new Error("Inquiry relay reported failure");
  }
};
// Analytics for the enquiry forms. Every call goes through pushDataLayer(): it
// is consent-gated and drops anything that looks like personal data.
//
// ONE successful enquiry = ONE `automation_form_submit_success`. `generate_lead`
// is deliberately NOT pushed for these forms any more, so there is nothing to
// double-count in Google Ads; if GA4 should receive `generate_lead`, send it from
// a GA4 tag in GTM triggered by this same event.
export const trackInquiry = {
  start: (location) => pushDataLayer("automation_form_start", { form_location: location, form_type: FORM_TYPE }),
  success: (location) =>
    pushDataLayer("automation_form_submit_success", { form_location: location, form_type: FORM_TYPE, event_id: newEventId() }),
  error: (location) => pushDataLayer("automation_form_submit_error", { form_location: location, form_type: FORM_TYPE }),
};
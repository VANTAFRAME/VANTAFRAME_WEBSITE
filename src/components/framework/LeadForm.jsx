import React, { useRef, useState } from "react";
import { openPrivacyFromLink } from "../../stores/legalStore";
import { trackEvent } from "../../lib/framework/track";
import { buildSummaryText } from "../../lib/framework/summaryText";
import { clearFrameworkState } from "../../lib/framework/storage";
const FIELD_STATE = { IDLE: "idle", SENDING: "sending", SUCCESS: "success", ERROR: "error" };
const LeadForm = ({ t, answers, recommendation, textHelpers, onRestart }) => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [privacyAck, setPrivacyAck] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState(FIELD_STATE.IDLE);
  const [mailFallbackHref, setMailFallbackHref] = useState(null);
  // A ref (not state): a fast double click / Enter can fire a second submit before React
  // has re-rendered the disabled button, which used to send the project — and record the
  // conversion events — twice.
  const submittingRef = useRef(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (honeypot) return; // silent drop — bot filled the hidden field
    if (submittingRef.current) return;
    submittingRef.current = true;
    setStatus(FIELD_STATE.SENDING);
    // The recommendation shown on the summary screen (the local, rule-based one on static
    // hosting) is the one that is sent, so the project id in the email matches the screen.
    const usedRecommendation = recommendation;
    const summaryForEmail = buildSummaryText({ t, answers, recommendation: usedRecommendation, ...textHelpers });
    try {
      const response = await fetch("https://formsubmit.co/ajax/kontakt@vantaframe.pl", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `FRAMEWORK — nowy projekt ${usedRecommendation.projectId}`,
          name,
          company,
          email,
          phone,
          source: "FRAMEWORK",
          projectId: usedRecommendation.projectId,
          createdAt: new Date().toISOString(),
          summary: summaryForEmail,
          message: summaryForEmail,
        }),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus(FIELD_STATE.SUCCESS);
      // Project is submitted — nothing left to resume. Clear saved progress so a
      // later visit to /kreator-projektu starts clean instead of reopening this one.
      clearFrameworkState();
      trackEvent("framework_lead_submit");
      trackEvent("framework_complete");
      // Visitors who opened FRAMEWORK from /automatyzacje get one extra event so
      // that campaign can see the completion. It is a separate name on purpose:
      // map only ONE of framework_complete / automation_framework_complete to a
      // Google Ads conversion, never both.
      try {
        if (window.sessionStorage.getItem("vf_framework_origin") === "automatyzacje") {
          trackEvent("automation_framework_complete", { origin_page: "automatyzacje" });
          window.sessionStorage.removeItem("vf_framework_origin");
        }
      } catch {
        /* sessionStorage unavailable — origin simply isn't attributed */
      }
    } catch {
      // FormSubmit is a third-party dependency and can be temporarily unavailable —
      // give the user a one-click way to send everything manually so the filled-out
      // project data isn't lost.
      const bodyLines = [summaryForEmail, "", `Imię: ${name}`, `Email: ${email}`];
      if (company) bodyLines.push(`Firma: ${company}`);
      if (phone) bodyLines.push(`Telefon: ${phone}`);
      const mailtoUrl = `mailto:kontakt@vantaframe.pl?subject=${encodeURIComponent(
        `FRAMEWORK — nowy projekt ${usedRecommendation.projectId}`
      )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
      setMailFallbackHref(mailtoUrl);
      setStatus(FIELD_STATE.ERROR);
      submittingRef.current = false; // allow a retry after a failure
    }
  };
  if (status === FIELD_STATE.SUCCESS) {
    return (
      <div className="text-center py-10">
        <p className="text-lg font-medium text-black">{t.leadForm.success}</p>
        <button
          type="button"
          onClick={onRestart}
          data-cursor-label="RESTART"
          className="cursor-hover mt-6 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-black/80 transition-colors"
        >
          {t.actions.restart}
        </button>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h3 className="text-2xl font-semibold text-black">{t.leadForm.heading}</h3>
        <p className="mt-2 text-sm text-black/60">{t.leadForm.desc}</p>
      </div>
      <input
        type="text"
        value={honeypot}
        onChange={(event) => setHoneypot(event.target.value)}
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="framework-lead-name" className="block text-xs uppercase font-bold tracking-widest mb-2 text-black/50">{t.leadForm.name}</label>
          <input
            id="framework-lead-name"
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={120}
            className="w-full bg-transparent border-b border-black/20 py-3 focus:outline-none focus:border-black transition-colors"
          />
        </div>
        <div>
          <label htmlFor="framework-lead-company" className="block text-xs uppercase font-bold tracking-widest mb-2 text-black/50">{t.leadForm.company}</label>
          <input
            id="framework-lead-company"
            type="text"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            maxLength={160}
            className="w-full bg-transparent border-b border-black/20 py-3 focus:outline-none focus:border-black transition-colors"
          />
        </div>
        <div>
          <label htmlFor="framework-lead-email" className="block text-xs uppercase font-bold tracking-widest mb-2 text-black/50">{t.leadForm.email}</label>
          <input
            id="framework-lead-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={160}
            className="w-full bg-transparent border-b border-black/20 py-3 focus:outline-none focus:border-black transition-colors"
          />
        </div>
        <div>
          <label htmlFor="framework-lead-phone" className="block text-xs uppercase font-bold tracking-widest mb-2 text-black/50">{t.leadForm.phone}</label>
          <input
            id="framework-lead-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            maxLength={32}
            className="w-full bg-transparent border-b border-black/20 py-3 focus:outline-none focus:border-black transition-colors"
          />
        </div>
      </div>
      <label className="flex items-start gap-3 text-xs text-black/70 leading-relaxed">
        <input type="checkbox" required checked={privacyAck} onChange={(event) => setPrivacyAck(event.target.checked)} className="mt-0.5 accent-black" />
        <span>
          {t.leadForm.privacyPrefix}{" "}
          <a href="/polityka-prywatnosci/" onClick={openPrivacyFromLink} className="underline underline-offset-2 font-semibold hover:text-black">
            {t.leadForm.privacyLinkText}
          </a>{" "}
          {t.leadForm.privacySuffix}
        </span>
      </label>
      {status === FIELD_STATE.ERROR && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{t.leadForm.error}</p>
          {mailFallbackHref && (
            <a
              href={mailFallbackHref}
              className="cursor-hover mt-2 inline-flex items-center gap-2 text-sm font-semibold text-black underline underline-offset-2 hover:text-black/70"
              data-cursor-label="MAIL"
            >
              {t.leadForm.mailFallback}
            </a>
          )}
        </div>
      )}
      <button
        type="submit"
        disabled={status === FIELD_STATE.SENDING || !privacyAck}
        data-cursor-label="SEND"
        className="cursor-hover mt-2 self-start rounded-full bg-black px-8 py-4 text-white font-bold uppercase tracking-widest hover:bg-black/80 transition-colors disabled:opacity-40"
      >
        {status === FIELD_STATE.SENDING ? t.leadForm.sending : t.leadForm.submit}
      </button>
    </form>
  );
};
export default LeadForm;
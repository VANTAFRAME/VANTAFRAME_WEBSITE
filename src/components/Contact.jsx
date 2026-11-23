import React, { useEffect, useRef, useState } from "react";
import { WIEDZA_PUBLIC } from "../data/wiedzaConfig";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "../lib/useStore";
import { currentLang } from "../i18n/store";
import { languages } from "../i18n/translations";
import { openPrivacyFromLink } from "../stores/legalStore";
import { pushDataLayer, newEventId } from "../lib/tracking";
import { captureAttribution } from "../lib/attribution";
import { sendInquiry, trackInquiry, LOCATIONS } from "../lib/inquiry";
gsap.registerPlugin(ScrollTrigger);
// `variant="automatyzacje"` switches the form to the B2B enquiry used on the
// Google Ads landing page: company field, "what do you want to automate?",
// automation_* tracking events, and no FRAMEWORK teaser competing with the form.
const Contact = ({ overlap = true, footerOnTop = false, overlapClass = "-mt-[100vh]", variant = "default", currentPath = "" }) => {
  const lang = useStore(currentLang, () => "pl");
  const isAutomation = variant === "automatyzacje";
  const baseContact = languages[lang].contact;
  const variantContact = isAutomation ? languages[lang].automatyzacjePage.contact : null;
  const t = variantContact
    ? { ...baseContact, ...variantContact, form: { ...baseContact.form, ...variantContact.form } }
    : baseContact;
  const footerT = languages[lang].footer;
  const frameworkT = languages[lang].framework.contactTeaser;
  const currentYear = new Date().getFullYear();
  const sectionRef = useRef(null);
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "", privacy_ack: false, _honey: "" });
  const [formStatus, setFormStatus] = useState("idle"); // 'idle' | 'submitting' | 'success' | 'error'
  const submittingRef = useRef(false);
  const startedRef = useRef(false);
  useEffect(() => {
    if (isAutomation) captureAttribution();
  }, [isAutomation]);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return undefined;
    // The section is already stacked underneath the previous one via a
    // negative top margin (see `overlapClass`); animating it up from a
    // slight offset on top of that static overlap is what produces the
    // "rises up from the bottom" reveal as the visitor scrolls to it.
    gsap.set(section, { y: "8%" });
    const tween = gsap.to(section, {
      y: "0%",
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 95%",
        end: "top 55%",
        scrub: 0.6,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (isAutomation && !startedRef.current && name !== "_honey") {
      startedRef.current = true;
      trackInquiry.start(LOCATIONS.footer);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Guard against double submits (fast double click / Enter) — a ref, because
    // state updates are async and the second event can arrive before a re-render.
    if (!formData.privacy_ack || submittingRef.current) return;
    // Honeypot: real visitors never see or fill this field. Pretend it worked
    // so bots get no signal, but send nothing and record no conversion.
    if (formData._honey) {
      setFormStatus("success");
      return;
    }
    submittingRef.current = true;
    setFormStatus("submitting");
    try {
      if (isAutomation) {
        // Shared pipeline with the hero drawer (see lib/inquiry.js).
        await sendInquiry({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message,
          formLocation: LOCATIONS.footer,
        });
        setFormStatus("success");
        trackInquiry.success(LOCATIONS.footer);
        window.dispatchEvent(new CustomEvent("vf_form_lead_success", { detail: { form: LOCATIONS.footer, submittedAt: new Date().toISOString() } }));
      } else {
        const response = await fetch("https://formsubmit.co/ajax/kontakt@vantaframe.pl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: `Nowe zapytanie kontaktowe VANTAFRAME — ${formData.name}`,
            _honey: "",
            name: formData.name,
            email: formData.email,
            message: formData.message,
            source: "Formularz Kontaktowy Główny",
            submittedAt: new Date().toISOString(),
          }),
        });
        // The success state (and every conversion event) is only reached after
        // the relay has really accepted the message.
        if (!response.ok) throw new Error("Request failed");
        setFormStatus("success");
        // Main-site form: `generate_lead` as before, without the visitor's e-mail.
        pushDataLayer("generate_lead", { form_name: "contact_form_main", event_id: newEventId() });
        window.dispatchEvent(new CustomEvent("vf_form_lead_success", { detail: { form: "contact_form_main", submittedAt: new Date().toISOString() } }));
      }
    } catch {
      setFormStatus("error");
      if (isAutomation) trackInquiry.error(LOCATIONS.footer);
    } finally {
      submittingRef.current = false;
    }
  };
  const resetForm = () => {
    setFormData({ name: "", email: "", company: "", message: "", privacy_ack: false, _honey: "" });
    startedRef.current = false;
    setFormStatus("idle");
  };
  const sectionClasses = [
    "relative z-30 flex min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-88px)] flex-col bg-white text-black rounded-t-[54px]",
    overlap ? overlapClass : "",
  ]
    .filter(Boolean)
    .join(" ");
  const footerClasses = [
    "relative min-h-[116px] md:min-h-[124px] bg-white px-6 sm:px-6 md:px-12 py-5 md:py-6 text-black text-center md:text-left flex items-center",
    footerOnTop ? "z-40" : "z-20",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <>
      <section id="contact" ref={sectionRef} className={sectionClasses}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-10 -top-12 h-20 rounded-full bg-black/18 blur-3xl" />
        <div id="contact-form" className="scroll-mt-24 px-6 md:px-12 pt-20 md:pt-24 pb-4 md:pb-5">
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between gap-14 md:gap-16">
            <div className="md:w-1/2">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
                {t.heading}
                {" "}<br />
                {t.heading2}
              </h2>
              <p className="text-xl md:text-2xl text-black/70 mb-8 max-w-md">{t.desc}</p>
              
              <div className="flex flex-col items-start gap-4 mb-8">
                <a href="mailto:kontakt@vantaframe.pl" className="text-xl border-b border-black pb-1 hover:text-black/60 transition-colors">
                  kontakt@vantaframe.pl
                </a>
                <a href="tel:+48794659528" className="text-xl border-b border-black pb-1 hover:text-black/60 transition-colors">
                  +48 794 659 528
                </a>
              </div>
              {/* Local SEO / Address block */}
              <div className="pt-6 border-t border-black/10 max-w-md">
                <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-black/50 mb-2">
                  <svg className="w-4 h-4 text-black/80 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  <span>{t.locationBadge || "Kraków, Polska"}</span>
                </div>
                <p className="font-bold text-sm text-black/90">VANTAFRAME Sp. z o.o.</p>
                <p className="text-sm text-black/75">{t.addressLine1 || "ul. Żułowska 33 lok. 10"}</p>
                <p className="text-sm text-black/75">{t.addressLine2 || "31-436 Kraków, Polska"}</p>
                <p className="text-[11px] text-black/50 mt-1.5 font-medium">{t.addressScope || "Siedziba w Krakowie • Projekty w całej Polsce i UE"}</p>
              </div>
              {!isAutomation && (
              <div className="mt-8 pt-6 border-t border-black/10 max-w-md">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 mb-3">
                  {frameworkT.microlabel}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{frameworkT.heading}</h3>
                <p className="text-black/60 mb-5">{frameworkT.desc}</p>
                <a
                  href="/kreator-projektu/"
                  data-cursor-label="START"
                  className="group inline-flex items-center gap-3 px-6 py-3.5 bg-black text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-black/80 transition-colors"
                >
                  {frameworkT.cta}
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </a>
              </div>
              )}
            </div>
            <div className="md:w-1/2 bg-white p-8 md:p-12 rounded-3xl border border-black/10 shadow-2xl shadow-black/5 flex flex-col justify-center min-h-[480px]">
              {formStatus === "success" ? (
                <div className="flex flex-col items-start gap-4 py-8 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center mb-2 shadow-lg">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-black">
                    {t.form.successHeading || "Dziękujemy za wiadomość!"}
                  </h3>
                  <p className="text-base md:text-lg text-black/70 leading-relaxed max-w-md">
                    {t.form.successDesc || "Otrzymaliśmy Twoje zapytanie. Odpowiemy zazwyczaj w ciągu 24 godzin."}
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-6 px-7 py-3.5 bg-black text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-black/80 transition-colors"
                  >
                    {t.form.sendAnother || "Wyślij kolejną wiadomość"}
                  </button>
                </div>
              ) : formStatus === "error" ? (
                <div className="flex flex-col items-start gap-4 py-8">
                  <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-black">
                    {t.form.errorHeading || "Wystąpił problem z wysyłką"}
                  </h3>
                  <p className="text-sm text-black/70 leading-relaxed max-w-md">
                    {t.form.errorDesc || "Przepraszamy, nie udało się wysłać formularza. Napisz bezpośrednio na kontakt@vantaframe.pl lub zadzwoń pod +48 794 659 528."}
                  </p>
                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setFormStatus("idle")}
                      className="px-6 py-3 bg-black text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-black/80 transition-colors"
                    >
                      {t.form.retry || "Spróbuj ponownie"}
                    </button>
                    <a
                      href="mailto:kontakt@vantaframe.pl"
                      className="px-6 py-3 border border-black text-black rounded-full font-bold text-xs uppercase tracking-widest hover:bg-black/5 transition-colors"
                    >
                      Napisz e-mail
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div>
                    <label className="block text-xs uppercase font-bold tracking-widest mb-2 text-black/50">{t.form.name}</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      maxLength={120}
                      required
                      className="w-full bg-transparent border-b border-black/20 py-3 focus:outline-none focus:border-black transition-colors"
                      placeholder={t.form.placeholderName}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold tracking-widest mb-2 text-black/50">{t.form.email}</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      maxLength={160}
                      required
                      className="w-full bg-transparent border-b border-black/20 py-3 focus:outline-none focus:border-black transition-colors"
                      placeholder={t.form.placeholderEmail}
                    />
                  </div>
                  {isAutomation && (
                    <div>
                      <label className="block text-xs uppercase font-bold tracking-widest mb-2 text-black/50">{t.form.company}</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        autoComplete="organization"
                        maxLength={160}
                        className="w-full bg-transparent border-b border-black/20 py-3 focus:outline-none focus:border-black transition-colors"
                        placeholder={t.form.placeholderCompany}
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs uppercase font-bold tracking-widest mb-2 text-black/50">{t.form.details}</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      maxLength={3000}
                      required
                      className="w-full bg-transparent border-b border-black/20 py-3 focus:outline-none focus:border-black transition-colors"
                      placeholder={t.form.placeholderDetails}
                    />
                  </div>
                  {/* Honeypot — hidden from people and assistive tech, bots fill it in. */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label>
                      Leave this field empty
                      <input type="text" name="_honey" value={formData._honey} onChange={handleChange} tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>
                  <label className="flex items-start gap-3 text-xs text-black/70 leading-relaxed cursor-pointer">
                    <input
                      type="checkbox"
                      name="privacy_ack"
                      checked={formData.privacy_ack}
                      onChange={handleChange}
                      required
                      className="mt-0.5 h-4 w-4 md:h-3.5 md:w-3.5 accent-black shrink-0 cursor-pointer"
                    />
                    <span>
                      {t.form.privacyAckPrefix}{" "}
                      <a href="/polityka-prywatnosci/" onClick={openPrivacyFromLink} className="underline underline-offset-2 font-semibold hover:text-black">
                        {t.form.privacyAckLink}
                      </a>{" "}
                      {t.form.privacyAckSuffix}
                    </span>
                  </label>
                  <p className="text-[11px] text-black/55 leading-relaxed">
                    {t.form.dataControllerNote}
                  </p>
                  <button
                    type="submit"
                    disabled={formStatus === "submitting"}
                    className="mt-4 px-8 py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest hover:bg-black/80 disabled:opacity-50 transition-colors self-start inline-flex items-center gap-2"
                  >
                    {formStatus === "submitting" ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>{t.form.submitting || "Wysyłanie..."}</span>
                      </>
                    ) : (
                      <span>{t.form.submit}</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <div id="site-footer" className={footerClasses}>
        <div className="mx-auto w-full max-w-[1800px] flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:w-auto flex flex-col items-center md:items-start">
            <span className="text-[clamp(1.5rem,6vw,2rem)] font-bold tracking-tight mb-1 leading-none">VANTAFRAME</span>
            <span className="text-xs text-black/45">
              &copy; {currentYear} VANTAFRAME. {footerT.copyright}
            </span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 text-xs text-black/80 bg-black/[0.04] border border-black/10 px-5 py-2.5 rounded-full">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-black/90 uppercase tracking-wider text-[11px]">Siedziba</span>
              <span className="font-semibold text-black/90">{footerT.location || "Kraków, Polska"}</span>
            </div>
            <span className="hidden sm:inline text-black/30">•</span>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-black/90 uppercase tracking-wider text-[11px]">KRS</span>
              <span className="font-mono text-black/90 font-bold">0001253958</span>
            </div>
            <span className="hidden sm:inline text-black/30">•</span>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-black/90 uppercase tracking-wider text-[11px]">REGON</span>
              <span className="font-mono text-black/90 font-bold">545245372</span>
            </div>
            <span className="hidden sm:inline text-black/30">•</span>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-black/90 uppercase tracking-wider text-[11px]">NIP</span>
              <span className="font-mono text-black/90 font-bold">9452332952</span>
            </div>
          </div>
          <div className="w-full md:w-auto flex flex-wrap justify-center md:justify-end gap-x-5 gap-y-1 md:gap-y-2 text-xs sm:text-sm text-black/65 font-medium">
            <a href="/polityka-prywatnosci/" onClick={openPrivacyFromLink} className="py-1.5 md:py-0 hover:text-black transition-colors">
              {footerT.privacy}
            </a>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-cookie-settings"))}
              className="py-1.5 md:py-0 hover:text-black transition-colors"
            >
              {footerT.cookieSettings}
            </button>
            {footerT.aiLink && footerT.aiLink.href !== currentPath && (
              <a href={footerT.aiLink.href} className="py-1.5 md:py-0 hover:text-black transition-colors">
                {footerT.aiLink.label}
              </a>
            )}
            {footerT.aboutLink && footerT.aboutLink.href !== currentPath && (
              <a href={footerT.aboutLink.href} className="py-1.5 md:py-0 hover:text-black transition-colors">
                {footerT.aboutLink.label}
              </a>
            )}
            {WIEDZA_PUBLIC && currentPath !== "/wiedza/" && (
              <a href="/wiedza/" className="py-1.5 md:py-0 hover:text-black transition-colors">
                {lang === "en" ? "Knowledge" : "Wiedza"}
              </a>
            )}
            {footerT.vantasignalLink && (
              <a href={footerT.vantasignalLink.href} target="_blank" rel="noopener" className="py-1.5 md:py-0 hover:text-black transition-colors">
                {footerT.vantasignalLink.label}
                <span className="sr-only"> {footerT.vantasignalLink.newTab}</span>
              </a>
            )}
            <a href="https://www.instagram.com/vantaframee/" target="_blank" rel="noopener noreferrer" className="py-1.5 md:py-0 hover:text-black transition-colors">
              Instagram
            </a>
            <a href="https://www.linkedin.com/company/vantaframe/" target="_blank" rel="noopener noreferrer" className="py-1.5 md:py-0 hover:text-black transition-colors">
              LinkedIn
            </a>
            <a href="https://www.facebook.com/profile.php?id=61588309231679" target="_blank" rel="noopener noreferrer" className="py-1.5 md:py-0 hover:text-black transition-colors">
              Facebook
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
export default Contact;
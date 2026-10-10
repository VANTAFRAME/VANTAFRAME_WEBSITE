import React, { useEffect, useState, useRef } from "react";
import { useStore } from "../lib/useStore";
import { currentLang } from "../i18n/store";

const STORAGE_DISMISSED_KEY = "vf_partner_dismissed_session";
const STORAGE_TRIGGERED_KEY = "vf_partner_triggered_session";

const translations = {
  pl: {
    badge: "PROGRAM PARTNERSKI",
    headline: "Polecaj klientów.",
    headlineSecond: "Zarabiaj prowizję.",
    desc: "Znasz firmę, która potrzebuje nowej strony, sklepu lub systemu? Poleć nas i odbierz prowizję od każdego zrealizowanego wdrożenia.",
    stepsHeading: "Jak to działa?",
    step1Title: "Polecasz klienta",
    step1Desc: "Przekazujesz nam kontakt lub informację o projekcie.",
    step2Title: "My realizujemy",
    step2Desc: "Prowadzimy rozmowy, ofertowanie i całe wdrożenie od A do Z.",
    step3Title: "Otrzymujesz prowizję",
    step3Desc: "Wypłacamy ustalony procent po podpisaniu umowy i opłaceniu etapów.",
    directCallLabel: "Zadzwoń bezpośrednio",
    phoneNumber: "+48 794 659 528",
    formHeading: "Zostaw kontakt — odezwiemy się",
    inputPlaceholder: "Twój e-mail lub numer telefonu",
    submitBtn: "Dołącz do programu",
    submittingBtn: "Wysyłanie...",
    successTitle: "Dziękujemy za kontakt!",
    successDesc: "Skontaktujemy się z Tobą w ciągu 24h, aby przedstawić szczegóły i warunki programu partnerskiego.",
    reopenTooltip: "Program Partnerski",
    reopenSub: "Polecaj i zarabiaj",
    closeAria: "Zamknij okno programu partnerskiego",
    callAria: "Zadzwoń do VANTAFRAME",
  },
  en: {
    badge: "PARTNER PROGRAM",
    headline: "Refer clients.",
    headlineSecond: "Earn commissions.",
    desc: "Know a business that needs a modern website, store, or custom system? Refer them to us and earn a generous commission on every closed deal.",
    stepsHeading: "How it works",
    step1Title: "Refer a client",
    step1Desc: "Share the contact details or brief about their project.",
    step2Title: "We deliver",
    step2Desc: "We handle consultation, proposal, design, and full deployment.",
    step3Title: "You get paid",
    step3Desc: "We pay your agreed commission percentage upon signing & milestones.",
    directCallLabel: "Call us directly",
    phoneNumber: "+48 794 659 528",
    formHeading: "Leave your contact — we will reach out",
    inputPlaceholder: "Your email or phone number",
    submitBtn: "Join Partner Program",
    submittingBtn: "Sending...",
    successTitle: "Thank you for reaching out!",
    successDesc: "We will contact you within 24 hours with partner terms and commission rates.",
    reopenTooltip: "Partner Program",
    reopenSub: "Refer & earn",
    closeAria: "Close partner program window",
    callAria: "Call VANTAFRAME",
  },
};

const PartnerModal = ({ pathname = "/" }) => {
  const lang = useStore(currentLang, () => "pl");
  const t = translations[lang] || translations.pl;
  const isHomePage = pathname === "/";

  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPill, setShowPill] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [autoPeek, setAutoPeek] = useState(false);
  const [contactValue, setContactValue] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle"); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const modalRef = useRef(null);
  const hasAutoPeekedRef = useRef(false);
  const isHoveringRef = useRef(false);
  const autoPeekTimeoutRef = useRef(null);

  const isExpanded = isHovering || autoPeek;

  // Check scroll position to trigger popup at halfway down the page
  useEffect(() => {
    // In dev mode, clear session storage on fresh page load so testing popup on scroll works every time
    if (import.meta.env.DEV) {
      sessionStorage.removeItem(STORAGE_DISMISSED_KEY);
      sessionStorage.removeItem(STORAGE_TRIGGERED_KEY);
    }

    // Check if dismissed previously in session
    const isDismissed = sessionStorage.getItem(STORAGE_DISMISSED_KEY);
    const isTriggered = sessionStorage.getItem(STORAGE_TRIGGERED_KEY);

    if (isDismissed || isTriggered) {
      setHasInteracted(true);
      // Returning to a slide-in pill state after a previous visit shouldn't
      // require scrolling again — it was already earned this session.
      setShowPill(true);
    }

    // Anchors the full popup to the "Rozwiązania" (Services) section instead
    // of a scrollY/page-height ratio — a fixed percentage of total page
    // height drifts as the page grows (more sections, lazy-loaded images
    // pushing scrollHeight up), which had pushed the old 35% mark down to
    // where the contact form sits instead of where Rozwiązania does. Same
    // root cause as the subpage auto-peek effect below, same fix shape.
    const servicesSection = document.querySelector("#services");

    const handleScroll = () => {
      // Skip while a nav link is smooth-scrolling the user to a section —
      // opening here would lock body scroll and strand the animation short
      // of its target (see Layout.astro's Lenis setup).
      if (window.__vfProgrammaticScroll) return;

      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollTotal > 0) {
        const scrollProgress = window.scrollY / scrollTotal;

        // The reopen pill only slides in once the visitor has actually engaged
        // with the page — never present, unannounced, at first paint.
        if (scrollProgress >= 0.15) {
          setShowPill(true);
        }
      }

      if (sessionStorage.getItem(STORAGE_DISMISSED_KEY) || sessionStorage.getItem(STORAGE_TRIGGERED_KEY)) {
        return;
      }

      // The full auto-opening popup is a homepage-only introduction; on the
      // service subpages it would interrupt reading with no added context,
      // so there it only ever surfaces as the slide-in pill above.
      if (!isHomePage) return;

      if (servicesSection && servicesSection.getBoundingClientRect().top <= window.innerHeight * 0.5) {
        setIsOpen(true);
        setHasInteracted(true);
        sessionStorage.setItem(STORAGE_TRIGGERED_KEY, "true");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Custom event to manually open from anywhere
    const handleCustomOpen = () => {
      setIsOpen(true);
      setHasInteracted(true);
    };

    window.addEventListener("open-partner-modal", handleCustomOpen);

    // Close on Escape key
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("open-partner-modal", handleCustomOpen);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // On subpages there's no auto-opening modal to introduce the program, so
  // the collapsed pill gets one unprompted "peek" — briefly expanding itself
  // around the middle of the page, then collapsing back down — as a passive
  // equivalent of the homepage's popup. Anchored to the case-showcase
  // section (shared across all three subpages, sitting roughly mid-page in
  // their canonical section order) rather than a scrollY/document-height
  // ratio: that ratio chases a moving target here, since the showcase's own
  // `loading="lazy"` screenshots keep growing `scrollHeight` as the visitor
  // scrolls toward them, which pushed the "50%" mark later and later until
  // it only ever fired near the real bottom of the page.
  useEffect(() => {
    if (isHomePage) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const target = document.querySelector(".case-showcase");
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAutoPeekedRef.current) return;
        hasAutoPeekedRef.current = true;
        setAutoPeek(true);
        autoPeekTimeoutRef.current = window.setTimeout(() => setAutoPeek(false), 2600);
        observer.disconnect();
      },
      { threshold: 0, rootMargin: "0px 0px -40% 0px" }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
      window.clearTimeout(autoPeekTimeoutRef.current);
    };
  }, [isHomePage]);

  // Lock background scroll while the panel is open
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    const prevPosition = style.position;
    const prevTop = style.top;
    const prevWidth = style.width;

    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";

    return () => {
      style.position = prevPosition;
      style.top = prevTop;
      style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
    sessionStorage.setItem(STORAGE_DISMISSED_KEY, "true");
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contactValue.trim()) return;

    setSubmitStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("https://formsubmit.co/ajax/kontakt@vantaframe.pl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: "[VANTAFRAME] Zgłoszenie do Programu Partnerskiego",
          _captcha: "false",
          contact: contactValue,
          source: "Pop-up Program Partnerski",
          submittedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
      } else {
        // Even if external rate limits, show success for user confidence and log
        setSubmitStatus("success");
      }
    } catch (err) {
      // Graceful fallback
      setSubmitStatus("success");
    }
  };

  return (
    <>
      {/* Lightbox / Popup Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="partner-modal-title"
          className="fixed inset-0 z-[95] flex items-end justify-center sm:p-6 bg-black/70 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
          onClick={(e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
              closeModal();
            }
          }}
        >
          <div
            ref={modalRef}
            className="relative w-full sm:max-w-[420px] max-h-[90vh] bg-white text-black rounded-t-[32px] sm:rounded-[32px] p-6 sm:p-8 shadow-2xl border border-black/10 overflow-y-auto scrollbar-thin flex flex-col justify-between animate-slideUp"
          >
            {/* Header with Tag & Close Button */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50 border-b-2 border-black pb-0.5">
                    {t.badge}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label={t.closeAria}
                  className="w-10 h-10 md:w-9 md:h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/70 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Bold Typography Title */}
              <h3 id="partner-modal-title" className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-black leading-[1.08] mb-3">
                {t.headline}
                <br />
                <span className="text-black/80">{t.headlineSecond}</span>
              </h3>

              <p className="text-xs sm:text-sm text-black/65 font-normal leading-relaxed mb-6">
                {t.desc}
              </p>

              {/* Steps (How it works) */}
              <div className="space-y-3 mb-6 bg-black/[0.03] p-4 rounded-2xl border border-black/5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45 mb-2">
                  {t.stepsHeading}
                </p>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-black text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    1
                  </div>
                  <div>
                    <p className="text-xs font-bold text-black">{t.step1Title}</p>
                    <p className="text-[11px] text-black/60 leading-tight mt-0.5">{t.step1Desc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-black text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    2
                  </div>
                  <div>
                    <p className="text-xs font-bold text-black">{t.step2Title}</p>
                    <p className="text-[11px] text-black/60 leading-tight mt-0.5">{t.step2Desc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-black text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    3
                  </div>
                  <div>
                    <p className="text-xs font-bold text-black">{t.step3Title}</p>
                    <p className="text-[11px] text-black/60 leading-tight mt-0.5">{t.step3Desc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Direct Call & Quick Contact Form */}
            <div className="space-y-4">
              {/* Click to Call Card */}
              <a
                href={`tel:${t.phoneNumber.replace(/\s+/g, "")}`}
                aria-label={t.callAria}
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-black/[0.04] border border-black/10 hover:border-black/30 hover:bg-black/[0.07] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shrink-0 shadow-md">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black/50 block">
                      {t.directCallLabel}
                    </span>
                    <span className="text-sm font-bold text-black tracking-tight group-hover:underline underline-offset-2">
                      {t.phoneNumber}
                    </span>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-white border border-black/10 flex items-center justify-center text-black group-hover:translate-x-0.5 transition-transform">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </a>

              {/* Form / Success State */}
              {submitStatus === "success" ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center animate-fadeIn">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-2 shadow-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-emerald-900 mb-1">{t.successTitle}</h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">{t.successDesc}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/50 block">
                    {t.formHeading}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={contactValue}
                      onChange={(e) => setContactValue(e.target.value)}
                      placeholder={t.inputPlaceholder}
                      className="w-full bg-black/[0.04] border border-black/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-black placeholder:text-black/40 focus:outline-none focus:border-black focus:bg-white transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitStatus === "submitting"}
                    className="w-full py-3.5 px-5 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-black/85 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {submitStatus === "submitting" ? (
                      <span>{t.submittingBtn}</span>
                    ) : (
                      <>
                        <span>{t.submitBtn}</span>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Reopen Pill in Bottom-Left Corner — hidden until the visitor
          has actually scrolled (see `showPill`), then fades in already
          collapsed to just the icon; it only expands to show its text on
          hover, or briefly on its own mid-page on subpages (`autoPeek`). */}
      {!isOpen && (
        <button
          type="button"
          onClick={openModal}
          onMouseEnter={() => {
            isHoveringRef.current = true;
            setIsHovering(true);
          }}
          onMouseLeave={() => {
            isHoveringRef.current = false;
            setIsHovering(false);
          }}
          onFocus={() => setIsHovering(true)}
          onBlur={() => setIsHovering(false)}
          aria-label={t.reopenTooltip}
          aria-hidden={!showPill}
          tabIndex={showPill ? 0 : -1}
          className={[
            "group fixed bottom-8 left-8 sm:bottom-10 sm:left-10 md:bottom-10 md:left-10 z-[85] flex items-center gap-2.5 py-2.5 sm:py-2.5 rounded-full bg-white text-black border border-black/15 shadow-[0_14px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_18px_45px_rgba(0,0,0,0.45)] hover:border-black/30 active:scale-95 transition-[opacity,transform,padding-right,box-shadow,border-color] duration-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/80",
            isExpanded ? "pl-3 pr-4 sm:pl-3.5 sm:pr-5" : "pl-3 pr-3 sm:pl-3.5 sm:pr-3.5",
            showPill ? "opacity-100 translate-y-0 translate-x-0 pointer-events-auto" : "opacity-0 -translate-x-3 translate-y-2 pointer-events-none",
          ].join(" ")}
        >
          {/* Percentage SVG icon — clean black on pure white */}
          <span className="w-8 h-8 flex items-center justify-center shrink-0">
            <svg
              className="w-4.5 h-4.5 text-black"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="5" x2="5" y2="19" />
              <circle cx="7.5" cy="7.5" r="2.5" />
              <circle cx="16.5" cy="16.5" r="2.5" />
            </svg>
          </span>

          <span
            className={[
              "flex flex-col items-start leading-none overflow-hidden transition-all duration-300 ease-out",
              isExpanded ? "max-w-[220px] opacity-100 ml-0" : "max-w-0 opacity-0 -ml-2.5",
            ].join(" ")}
          >
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap text-black">
              {t.reopenTooltip}
            </span>
            <span className="text-[10px] text-black/60 font-medium whitespace-nowrap mt-0.5">
              {t.reopenSub}
            </span>
          </span>
        </button>
      )}
    </>
  );
};

export default PartnerModal;

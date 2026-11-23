import React, { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";
import { isPrivacyOpen, togglePrivacy, openPrivacyFromLink } from "../../stores/legalStore";
import { pushDataLayer } from "../../lib/tracking";
import { sendInquiry, trackInquiry, LOCATIONS, FORM_TYPE } from "../../lib/inquiry";
// Quick-contact drawer for the /automatyzacje landing page.
//
// - Native <dialog> opened with showModal(): the browser provides the top layer,
//   inert background, focus trap and Escape handling; we only animate it and
//   restore focus/scroll.
// - Opens only on a user action: any element with [data-open-contact-drawer]
//   (a normal href="#contact" link underneath, so it still works without JS) or
//   a `open-contact-drawer` window event.
// - The form state lives in this always-mounted component (and in a
//   sessionStorage draft), so closing the drawer never loses what was typed.
// - The window's content (heading, form) is rendered only once the drawer has been opened for the
//   first time, so it is not part of the server-rendered HTML of every page (an invisible extra
//   <h2>); the <dialog> and its panel shell stay in the DOM. After the first opening it stays mounted.
// - Desktop: right-hand panel (480 px). < 640 px: full-screen view that follows
//   the visual viewport so the on-screen keyboard never covers the submit button.
const DRAFT_KEY = "vf_inquiry_draft_v1";
const LOCATION = LOCATIONS.drawer;
const EMPTY = { name: "", email: "", company: "", message: "", ack: false, _honey: "" };
const readDraft = () => {
  try {
    const d = JSON.parse(window.sessionStorage.getItem(DRAFT_KEY) || "null");
    return d && typeof d === "object" ? { ...EMPTY, name: d.name || "", email: d.email || "", company: d.company || "", message: d.message || "" } : null;
  } catch {
    return null;
  }
};
const writeDraft = (v) => {
  try {
    const { name, email, company, message } = v;
    if (name || email || company || message) window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ name, email, company, message }));
    else window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* storage unavailable — the in-memory state still keeps the data */
  }
};
const clearDraft = () => {
  try {
    window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
};
const Arrow = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14m-7-7l7 7-7 7" />
  </svg>
);
const ContactDrawer = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].automatyzacjePage.drawer;
  const privacy = languages[lang].contact.form;
  const dialogRef = useRef(null);
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const formRef = useRef(null);
  const successRef = useRef(null);
  const triggerRef = useRef(null);
  const openRef = useRef(false);
  const closingRef = useRef(false);
  const submittingRef = useRef(false);
  const startedRef = useRef(false);
  const unlockRef = useRef(null);
  const vvCleanupRef = useRef(null);
  const statusRef = useRef("idle");
  const afterCloseRef = useRef(null); // runs once the drawer has fully closed
  const originRef = useRef(null); // element that opened the drawer (survives a privacy detour)
  const reopenAfterPrivacyRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  statusRef.current = status;
  // restore a draft (client only, avoids an SSR/hydration mismatch)
  useEffect(() => {
    const draft = readDraft();
    if (draft) setValues(draft);
  }, []);
  // ---------------------------------------------------------------- scroll lock
  const lockScroll = () => {
    const html = document.documentElement;
    const prev = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
    // Hiding overflow removes a classic (non-overlay) scrollbar and would make the
    // page jump sideways under the overlay. Measure what is actually about to
    // disappear and pad exactly that much — zero on overlay-scrollbar systems.
    const scrollbar = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    if (scrollbar > 0) html.style.paddingRight = `${scrollbar}px`;
    window.lenis?.stop?.();
    unlockRef.current = () => {
      html.style.overflow = prev.overflow;
      html.style.paddingRight = prev.paddingRight;
      window.lenis?.start?.();
      unlockRef.current = null;
    };
  };
  // ---------------------------------------------------- on-screen keyboard (mobile)
  const followVisualViewport = () => {
    const vv = window.visualViewport;
    const panel = panelRef.current;
    if (!vv || !panel || window.innerWidth >= 640) return;
    const apply = () => {
      panel.style.setProperty("--cd-vvh", `${vv.height}px`);
      panel.style.setProperty("--cd-vvt", `${vv.offsetTop}px`);
    };
    apply();
    vv.addEventListener("resize", apply);
    vv.addEventListener("scroll", apply);
    vvCleanupRef.current = () => {
      vv.removeEventListener("resize", apply);
      vv.removeEventListener("scroll", apply);
      panel.style.removeProperty("--cd-vvh");
      panel.style.removeProperty("--cd-vvt");
      vvCleanupRef.current = null;
    };
  };
  // ------------------------------------------------------------------ open/close
  const open = useCallback((trigger) => {
    const dialog = dialogRef.current;
    if (!dialog || openRef.current) return;
    triggerRef.current = trigger instanceof HTMLElement ? trigger : document.activeElement;
    originRef.current = triggerRef.current;
    openRef.current = true;
    closingRef.current = false;
    startedRef.current = false;
    // A finished enquiry starts again with a clean form.
    if (statusRef.current === "success") {
      setValues(EMPTY);
      setStatus("idle");
    }
    // mount the content synchronously, so showModal() can focus the first control as before
    flushSync(() => setMounted(true));
    lockScroll();
    dialog.showModal();
    followVisualViewport();
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 640;
    const panel = panelRef.current;
    const overlay = overlayRef.current;
    gsap.killTweensOf([panel, overlay]);
    if (calm) {
      gsap.set(panel, { xPercent: 0, yPercent: 0 });
      gsap.set(overlay, { opacity: 1 });
    } else {
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power1.out" });
      gsap.fromTo(
        panel,
        mobile ? { xPercent: 0, yPercent: 100 } : { xPercent: 100, yPercent: 0 },
        { xPercent: 0, yPercent: 0, duration: 0.42, ease: "power3.out" }
      );
    }
    pushDataLayer("automation_contact_drawer_open", {
      form_location: LOCATION,
      form_type: FORM_TYPE,
      trigger_location: trigger?.dataset?.ctaLocation || "unknown",
    });
  }, []);
  const finishClose = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    vvCleanupRef.current?.();
    unlockRef.current?.();
    openRef.current = false;
    closingRef.current = false;
    const trigger = triggerRef.current;
    triggerRef.current = null;
    const after = afterCloseRef.current;
    afterCloseRef.current = null;
    if (after) after();
    else if (trigger && document.contains(trigger)) trigger.focus({ preventScroll: true });
  }, []);
  const close = useCallback(
    (method, after) => {
      if (!openRef.current || closingRef.current) return;
      closingRef.current = true;
      afterCloseRef.current = after || null;
      pushDataLayer("automation_contact_drawer_close", { form_location: LOCATION, form_type: FORM_TYPE, method });
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (calm) {
        finishClose();
        return;
      }
      const mobile = window.innerWidth < 640;
      gsap.killTweensOf([panelRef.current, overlayRef.current]);
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.28, ease: "power1.in" });
      gsap.to(panelRef.current, {
        ...(mobile ? { yPercent: 100 } : { xPercent: 100 }),
        duration: 0.3,
        ease: "power2.in",
        onComplete: finishClose,
      });
    },
    [finishClose]
  );
  // triggers: capture phase so we run before the global in-page-anchor handler
  // (Layout.astro) and can preventDefault() — the page must not scroll to #contact.
  useEffect(() => {
    const onClick = (event) => {
      const el = event.target instanceof Element ? event.target.closest("[data-open-contact-drawer]") : null;
      if (!el) return;
      event.preventDefault();
      open(el);
    };
    const onOpenEvent = () => open(document.activeElement);
    document.addEventListener("click", onClick, true);
    window.addEventListener("open-contact-drawer", onOpenEvent);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("open-contact-drawer", onOpenEvent);
      vvCleanupRef.current?.();
      unlockRef.current?.();
      gsap.killTweensOf([panelRef.current, overlayRef.current]);
    };
  }, [open]);
  // The privacy-policy modal is an ordinary fixed layer, so it would open *behind* this
  // top-layer dialog. Opening it therefore closes the drawer first (everything typed is
  // kept) and the drawer comes back as soon as the policy is closed again.
  const showPrivacy = () => {
    reopenAfterPrivacyRef.current = true;
    close("privacy", () => togglePrivacy(true));
  };
  useEffect(() => {
    const unsubscribe = isPrivacyOpen.listen((isOpen) => {
      if (!isOpen && reopenAfterPrivacyRef.current) {
        reopenAfterPrivacyRef.current = false;
        // Deferred: when the policy is closed with Escape, the browser would otherwise
        // apply that same key press to the dialog we are re-opening and close it again.
        window.setTimeout(() => open(originRef.current), 120);
      }
    });
    return unsubscribe;
  }, [open]);
  // after a successful send, move focus to the confirmation
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);
  // ----------------------------------------------------------------------- form
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (!startedRef.current && name !== "_honey") {
      startedRef.current = true;
      trackInquiry.start(LOCATION);
    }
    setValues((prev) => {
      const next = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name !== "ack" && name !== "_honey") writeDraft(next);
      return next;
    });
    if (status === "error") setStatus("idle");
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    // ref, not state: a second submit can arrive before React re-renders
    if (submittingRef.current || !values.ack) return;
    // honeypot — people never see this field; pretend success, send nothing, record nothing
    if (values._honey) {
      clearDraft();
      setStatus("success");
      return;
    }
    submittingRef.current = true;
    setStatus("submitting");
    try {
      await sendInquiry({
        name: values.name.trim(),
        email: values.email.trim(),
        company: values.company.trim(),
        message: values.message.trim(),
        formLocation: LOCATION,
      });
      clearDraft();
      setValues(EMPTY);
      setStatus("success");
      trackInquiry.success(LOCATION);
    } catch {
      // keep everything typed so far; the visitor can simply press the button again
      setStatus("error");
      trackInquiry.error(LOCATION);
    } finally {
      submittingRef.current = false;
    }
  };
  const field =
    "w-full bg-transparent border-b border-white/20 py-3 text-base text-white placeholder:text-white/45 focus:outline-none focus:border-cyan-300 transition-colors";
  const label = "block text-[10px] font-mono uppercase tracking-[0.2em] text-white/65 mb-2";
  const busy = status === "submitting";
  return (
    <>
      <style>{`
        .cd-dialog{padding:0;border:0;margin:0;background:transparent;color:#fff;max-width:none;max-height:none;width:100vw;height:100dvh;inset:0;overflow:hidden}
        .cd-dialog:not([open]){display:none}
        .cd-dialog::backdrop{background:transparent}
        .cd-panel{position:absolute;right:0;top:var(--cd-vvt,0px);height:var(--cd-vvh,100dvh);width:100%;background:#050505;border-left:1px solid rgba(255,255,255,0.1);display:flex;flex-direction:column;will-change:transform}
        @media (min-width:640px){.cd-panel{width:480px}}
        .cd-scroll{overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
        /* The site hides the system cursor and draws its own (Cursor.jsx) in a normal
           fixed layer. A modal <dialog> lives in the browser's top layer, above that
           custom cursor, so inside the drawer the real cursor must be shown again. */
        .cd-dialog,.cd-dialog *{cursor:auto !important}
        .cd-dialog a,.cd-dialog button,.cd-dialog label,.cd-dialog [role="button"],.cd-dialog input[type="checkbox"],.cd-dialog select{cursor:pointer !important}
        .cd-dialog input:not([type="checkbox"]),.cd-dialog textarea{cursor:text !important}
        .cd-dialog button:disabled{cursor:wait !important}
        @media (max-height:600px){
          .cd-desc{display:none}
          .cd-heading{font-size:1.5rem;margin-bottom:1rem}
          .cd-head{padding-top:.5rem;padding-bottom:.5rem}
          .cd-scroll-body{padding-top:1.25rem}
        }
      `}</style>
      <dialog
        ref={dialogRef}
        className="cd-dialog"
        aria-labelledby="cd-title"
        aria-describedby="cd-desc"
        onCancel={(e) => {
          e.preventDefault(); // animate out instead of the instant native close
          close("escape");
        }}
        onClose={() => {
          // closed natively by something other than our close(): keep state consistent
          if (openRef.current && !closingRef.current) finishClose();
        }}
      >
        <div ref={overlayRef} className="absolute inset-0 bg-black/60" onClick={() => close("backdrop")} aria-hidden="true" />
        <div ref={panelRef} className="cd-panel">
          {mounted && (
            <>
          <div className="cd-head flex shrink-0 items-center justify-between border-b border-white/10 px-6 py-4 sm:px-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/65">{t.label}</span>
            <button
              type="button"
              onClick={() => close("button")}
              aria-label={t.close}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          {status === "success" ? (
            <div data-lenis-prevent className="cd-scroll flex flex-1 flex-col justify-center overflow-y-auto px-6 py-10 sm:px-8">
              <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/60 text-cyan-300">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <h2 id="cd-title" ref={successRef} tabIndex={-1} className="mb-4 text-3xl font-black leading-tight tracking-tight outline-none">
                {t.successHeading}
              </h2>
              <p id="cd-desc" role="status" className="mb-10 max-w-sm text-base leading-relaxed text-white/60">
                {t.successDesc}
              </p>
              <button
                type="button"
                onClick={() => close("success")}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-white/85"
              >
                {t.successClose}
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
              <div data-lenis-prevent className="cd-scroll cd-scroll-body min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-8 sm:px-8">
                <h2 id="cd-title" className="cd-heading mb-4 text-[clamp(1.9rem,6.5vw,2.6rem)] font-black leading-[1.05] tracking-tight">
                  {t.heading}
                </h2>
                <p id="cd-desc" className="cd-desc mb-8 max-w-sm text-base leading-relaxed text-white/70">
                  {t.desc}
                </p>
                <div className="flex flex-col gap-6">
                  <div>
                    <label htmlFor="cd-name" className={label}>
                      {t.fields.name} *
                    </label>
                    <input id="cd-name" name="name" type="text" value={values.name} onChange={onChange} required maxLength={120} autoComplete="name" placeholder={t.fields.placeholderName} className={field} />
                  </div>
                  <div>
                    <label htmlFor="cd-email" className={label}>
                      {t.fields.email} *
                    </label>
                    <input id="cd-email" name="email" type="email" value={values.email} onChange={onChange} required maxLength={160} autoComplete="email" inputMode="email" placeholder={t.fields.placeholderEmail} className={field} />
                  </div>
                  <div>
                    <label htmlFor="cd-company" className={label}>
                      {t.fields.company}
                    </label>
                    <input id="cd-company" name="company" type="text" value={values.company} onChange={onChange} maxLength={160} autoComplete="organization" placeholder={t.fields.placeholderCompany} className={field} />
                  </div>
                  <div>
                    <label htmlFor="cd-message" className={label}>
                      {t.fields.message} *
                    </label>
                    <textarea id="cd-message" name="message" value={values.message} onChange={onChange} required rows={4} maxLength={3000} placeholder={t.fields.placeholderMessage} className={`${field} resize-none`} />
                  </div>
                  <p className="text-[11px] leading-relaxed text-white/60">{privacy.dataControllerNote}</p>
                  {/* Honeypot — hidden from people and assistive tech, bots fill it in. */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label>
                      Leave this field empty
                      <input type="text" name="_honey" value={values._honey} onChange={onChange} tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>
                </div>
              </div>
              <div className="shrink-0 border-t border-white/10 bg-[#050505] px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-8 sm:pb-[max(1rem,env(safe-area-inset-bottom))] sm:pt-4">
                {status === "error" && (
                  <div role="alert" className="mb-3 rounded-lg border border-red-400/40 bg-red-400/[0.06] px-3 py-2 sm:px-4 sm:py-3">
                    <p className="text-sm font-semibold text-red-200">{t.errorHeading}</p>
                    <p className="mt-1 text-xs leading-relaxed text-red-100/70">{t.errorDesc}</p>
                  </div>
                )}
                <label className="mb-3 flex cursor-pointer items-start gap-3 text-[11px] leading-snug text-white/70 sm:text-xs">
                  <input
                    type="checkbox"
                    name="ack"
                    checked={values.ack}
                    onChange={onChange}
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-cyan-300"
                  />
                  <span>
                    {privacy.privacyAckPrefix}{" "}
                    <a href="/polityka-prywatnosci/" onClick={(event) => openPrivacyFromLink(event, showPrivacy)} className="font-semibold text-white underline underline-offset-2 hover:text-white">
                      {privacy.privacyAckLink}
                    </a>{" "}
                    {privacy.privacyAckSuffix}
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={busy}
                  aria-busy={busy}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-white/85 disabled:cursor-wait disabled:opacity-60 sm:py-4"
                >
                  {busy ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t.sending}
                    </>
                  ) : (
                    <>
                      {t.submit}
                      <Arrow />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
            </>
          )}
        </div>
      </dialog>
    </>
  );
};
export default ContactDrawer;
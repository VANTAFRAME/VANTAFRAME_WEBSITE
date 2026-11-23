import React, { forwardRef, useCallback, useImperativeHandle, useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { pushDataLayer } from "../../lib/tracking";
// Window with the reference document: the first page as an image, a download link, and the text of the
// reference in a <details> (for screen readers and search engines).
//
// - Native <dialog> opened with showModal(): top layer, inert background, focus trap, Escape. Its content
//   (heading, image) is mounted on the first opening, so the server-rendered HTML has no extra <h2> and the
//   full-page image is requested only then. Opened through the `open(trigger)` method of its ref.
// - Closing (Escape, the X, a click on the backdrop) returns focus to the element that opened it and
//   releases the page scroll (Lenis is stopped while the window is open).
// - Analytics: reference_view when it opens, reference_download on "Download PDF" (dataLayer, only after
//   the visitor has accepted cookies — see lib/tracking.js).
const ReferenceViewer = forwardRef(({ reference, t }, ref) => {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const triggerRef = useRef(null);
  const unlockRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const lockScroll = () => {
    const html = document.documentElement;
    const prev = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
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
  useImperativeHandle(ref, () => ({
    open(trigger) {
      const dialog = dialogRef.current;
      if (!dialog || dialog.open) return;
      triggerRef.current = trigger instanceof HTMLElement ? trigger : document.activeElement;
      flushSync(() => setMounted(true)); // the content must exist before showModal() picks the focus
      lockScroll();
      dialog.showModal();
      closeRef.current?.focus();
      pushDataLayer("reference_view", { reference_id: reference.id });
    },
  }));
  const close = useCallback(() => dialogRef.current?.close(), []);
  const onClosed = () => {
    unlockRef.current?.();
    const trigger = triggerRef.current;
    triggerRef.current = null;
    if (trigger && document.contains(trigger)) trigger.focus({ preventScroll: true });
  };
  return (
    <>
      <style>{`
        .rv-dialog{padding:12px;border:0;margin:0;background:transparent;color:#fff;max-width:none;max-height:none;width:100vw;height:100dvh;inset:0;overflow:hidden}
        .rv-dialog[open]{display:flex;align-items:center;justify-content:center}
        .rv-dialog:not([open]){display:none}
        .rv-dialog::backdrop{background:rgba(0,0,0,0.8);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
        .rv-scroll{overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
        /* a modal <dialog> sits above the custom cursor layer, so inside it the real cursor is shown again */
        .rv-dialog,.rv-dialog *{cursor:auto !important}
        .rv-dialog a,.rv-dialog button,.rv-dialog summary{cursor:pointer !important}
      `}</style>
      <dialog
        ref={dialogRef}
        className="rv-dialog"
        aria-labelledby={mounted ? titleId : undefined}
        onClose={onClosed}
        onClick={(event) => {
          // a click on the backdrop area (the <dialog> element itself, outside the panel) closes it
          if (event.target === event.currentTarget) close();
        }}
      >
        {mounted && (
          <div className="flex max-h-[90vh] w-full max-w-[960px] flex-col overflow-hidden rounded-xl border border-white/15 bg-[#0a0a0a] shadow-2xl">
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-white/10 px-4 py-3 sm:px-6">
              <h2 id={titleId} className="text-base font-bold tracking-tight sm:text-lg">
                {t.viewerTitle}
              </h2>
              <div className="flex items-center gap-3 sm:gap-5">
                <a
                  href={reference.pdf}
                  download
                  rel="noopener"
                  onClick={() => pushDataLayer("reference_download", { reference_id: reference.id })}
                  className="group inline-flex items-center gap-2 border-b-2 border-white/60 pb-1 text-xs font-bold uppercase tracking-widest text-white outline-none transition-colors hover:border-white focus-visible:border-cyan-300 sm:text-sm"
                >
                  {t.download}
                  <svg className="h-4 w-4 transition-transform group-hover:translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M12 5v14m-7-7l7 7 7-7" />
                  </svg>
                </a>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label={t.close}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 outline-none transition-colors hover:border-white/40 hover:text-white focus-visible:ring-1 focus-visible:ring-cyan-300/70"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
            </div>
            <div data-lenis-prevent className="rv-scroll min-h-0 flex-1 overflow-y-auto p-3 sm:p-6">
              <img
                src={reference.page.src}
                width={reference.page.width}
                height={reference.page.height}
                alt={`${t.thumbAlt}${t.fullPageSuffix}`}
                className="mx-auto h-auto w-full max-w-[760px] bg-white"
              />
              <details className="mx-auto mt-6 max-w-[760px] border-t border-white/10 pt-4">
                <summary className="cursor-pointer py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70 outline-none focus-visible:text-white">
                  {t.textSummary}
                </summary>
                <div lang="pl" className="space-y-4 pt-3 text-sm leading-relaxed text-white/70 md:text-base">
                  {reference.full.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </details>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
});
ReferenceViewer.displayName = "ReferenceViewer";
export default ReferenceViewer;
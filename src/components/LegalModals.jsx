import React, { useEffect, useId, useRef, useState } from "react";
import { useStore } from "../lib/useStore";
import { isPrivacyOpen, togglePrivacy } from "../stores/legalStore";
import { currentLang } from "../i18n/store";
import gsap from "gsap";
import PrivacyPolicyContent from "./legal/PrivacyPolicyContent";
const Modal = ({ isOpen, onClose, title, closeAria, closeLabel, children }) => {
  const titleId = useId();
  const descriptionId = useId();
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const scrollRef = useRef(null);
  const previousOverflowRef = useRef("");
  const scrollByAmount = (amount) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop += amount;
    el.focus({ preventScroll: true });
  };
  const handleOverlayWheel = (event) => {
    const el = scrollRef.current;
    if (!el) return;
    event.preventDefault();
    event.stopPropagation();
    el.scrollTop += event.deltaY;
  };
  const handleScrollKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      scrollByAmount(90);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      scrollByAmount(-90);
      return;
    }
    if (event.key === "PageDown") {
      event.preventDefault();
      scrollByAmount(280);
      return;
    }
    if (event.key === "PageUp") {
      event.preventDefault();
      scrollByAmount(-280);
    }
  };
  useEffect(() => {
    if (isOpen) {
      previousOverflowRef.current = document.body.style.overflow;
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.25, pointerEvents: "auto" });
      gsap.fromTo(
        contentRef.current,
        { y: 40, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" }
      );
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = 0;
          scrollRef.current.focus({ preventScroll: true });
        }
      });
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, pointerEvents: "none" });
      document.body.style.overflow = previousOverflowRef.current;
    }
    return () => {
      document.body.style.overflow = previousOverflowRef.current;
    };
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);
  return (
    <div
      ref={overlayRef}
      inert={!isOpen}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm opacity-0 pointer-events-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClick={onClose}
      onWheelCapture={handleOverlayWheel}
    >
      <div
        ref={contentRef}
        className="bg-[#101010] border border-white/10 rounded-2xl w-full max-w-3xl h-[min(85dvh,780px)] max-h-[calc(100dvh-2rem)] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#151515]">
          {title ? <h2 id={titleId} className="text-xl font-bold tracking-tight text-white">{title}</h2> : <span />}
          <button type="button" onClick={onClose} className="p-2.5 md:p-2 hover:bg-white/10 rounded-full transition-colors group" aria-label={closeAria}>
            <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="relative flex-1 min-h-0 overflow-hidden group/modal">
          <div
            ref={scrollRef}
            tabIndex={0}
            id={descriptionId}
            onKeyDown={handleScrollKeyDown}
            className="h-full min-h-0 p-6 overflow-y-auto overscroll-contain text-sm text-white/70 leading-relaxed space-y-4 custom-scrollbar outline-none"
            style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
          >
            {children}
          </div>
        </div>
        <div className="p-4 border-t border-white/5 bg-[#151515] flex justify-end">
          <button type="button" onClick={onClose} className="px-5 py-2 bg-white text-black text-xs font-bold uppercase tracking-wide rounded-md hover:bg-gray-200 transition-colors">
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
const LegalModals = () => {
  const $isPrivacyOpen = useStore(isPrivacyOpen);
  const lang = useStore(currentLang, () => "pl");
  const isEn = lang === "en";
  // The policy text is rendered only once the window has been opened, so it is not part of the
  // server-rendered HTML of every page (the full text lives at /polityka-prywatnosci/). After the
  // first opening it stays mounted so the closing fade-out keeps showing the content.
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => {
    if ($isPrivacyOpen) setHasOpened(true);
  }, [$isPrivacyOpen]);
  return (
    <>
      <Modal
        isOpen={$isPrivacyOpen}
        onClose={() => togglePrivacy(false)}
        title={($isPrivacyOpen || hasOpened) ? (isEn ? "Privacy and Cookie Policy" : "Polityka prywatności i cookies") : ""}
        closeAria={isEn ? "Close modal" : "Zamknij modal"}
        closeLabel={isEn ? "Close" : "Zamknij"}
      >
        {($isPrivacyOpen || hasOpened) && <PrivacyPolicyContent lang={isEn ? "en" : "pl"} />}
      </Modal>
    </>
  );
};
export default LegalModals;
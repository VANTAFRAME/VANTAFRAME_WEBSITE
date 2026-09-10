import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { presentationMotion } from "../usePresentationMotion";

const MagneticCTAButton = ({
  href,
  cursorLabel = "START",
  className = "",
  children,
}) => {
  const buttonRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    const label = labelRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!button || !label || reducedMotion) return undefined;

    const moveX = gsap.quickTo(button, "x", {
      duration: 0.2,
      ease: presentationMotion.gsapEmphasisEase,
    });
    const moveY = gsap.quickTo(button, "y", {
      duration: 0.2,
      ease: presentationMotion.gsapEmphasisEase,
    });
    const labelX = gsap.quickTo(label, "x", {
      duration: 0.24,
      ease: presentationMotion.gsapEnterEase,
    });
    const labelY = gsap.quickTo(label, "y", {
      duration: 0.24,
      ease: presentationMotion.gsapEnterEase,
    });

    const onMove = (event) => {
      const bounds = button.getBoundingClientRect();
      const x = (event.clientX - bounds.left - bounds.width / 2) * 0.12;
      const y = (event.clientY - bounds.top - bounds.height / 2) * 0.12;
      moveX(x);
      moveY(y);
      labelX(x * 0.3);
      labelY(y * 0.3);
    };

    const reset = () => {
      moveX(0);
      moveY(0);
      labelX(0);
      labelY(0);
    };

    button.addEventListener("pointermove", onMove);
    button.addEventListener("pointerleave", reset);

    return () => {
      button.removeEventListener("pointermove", onMove);
      button.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <a
      ref={buttonRef}
      href={href}
      className={[
        "cursor-hover inline-flex min-w-[14rem] items-center justify-center rounded-full border border-cyan-300/35 bg-white px-7 py-4 text-sm font-semibold uppercase tracking-[0.32em] text-black shadow-[0_0_32px_rgba(34,211,238,0.16)] transition-colors duration-300 hover:bg-cyan-200",
        className,
      ].join(" ")}
      data-cursor-label={cursorLabel}
    >
      <span ref={labelRef} className="inline-flex items-center gap-3">
        <span>{children}</span>
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="M13 5l7 7-7 7" />
        </svg>
      </span>
    </a>
  );
};

export default MagneticCTAButton;

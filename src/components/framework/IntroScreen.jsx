import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import BlueprintCanvas from "./BlueprintCanvas";
import { STEP_ORDER } from "./blueprintLayout";

const IntroScreen = ({ copy, onStart, reducedMotion, contained = false }) => {
  const buttonRef = useRef(null);
  const headingRef = useRef(null);
  const [revealed, setRevealed] = useState(reducedMotion ? STEP_ORDER : []);

  useEffect(() => {
    if (reducedMotion) return undefined;
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setRevealed(STEP_ORDER.slice(0, index));
      if (index >= STEP_ORDER.length) clearInterval(interval);
    }, 220);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !headingRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.15 }
      );
    });
    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    const button = buttonRef.current;
    if (reducedMotion || !button) return undefined;

    const moveX = gsap.quickTo(button, "x", { duration: 0.2, ease: "power2.out" });
    const moveY = gsap.quickTo(button, "y", { duration: 0.2, ease: "power2.out" });

    const onMove = (event) => {
      const bounds = button.getBoundingClientRect();
      moveX((event.clientX - bounds.left - bounds.width / 2) * 0.15);
      moveY((event.clientY - bounds.top - bounds.height / 2) * 0.15);
    };
    const reset = () => {
      moveX(0);
      moveY(0);
    };

    button.addEventListener("pointermove", onMove);
    button.addEventListener("pointerleave", reset);
    return () => {
      button.removeEventListener("pointermove", onMove);
      button.removeEventListener("pointerleave", reset);
    };
  }, [reducedMotion]);

  if (contained) {
    return (
      <div className="relative flex h-full flex-col bg-brand-black text-white md:flex-row">
        <div className="absolute inset-0 opacity-25 md:opacity-100 md:relative md:w-[45%] md:shrink-0 md:order-2 md:border-l md:border-white/10">
          <BlueprintCanvas completedStepIds={revealed} currentStepId={null} stepLabels={{}} reducedMotion={reducedMotion} />
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-8 md:w-[55%] md:order-1 md:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">{copy.microlabel}</p>

          <h1 ref={headingRef} className="mt-4 text-2xl font-extralight leading-[1.15] md:text-3xl">
            {copy.heading}
          </h1>

          <p className="mt-4 text-sm text-white/60 md:text-base">{copy.desc}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              ref={buttonRef}
              type="button"
              onClick={onStart}
              data-cursor-label="START"
              className="cursor-hover inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-white/85"
            >
              {copy.cta}
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </button>
            <span className="text-xs uppercase tracking-widest text-white/35">{copy.hint}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-brand-black text-white md:flex-row">
      <div className="absolute inset-0 opacity-40 md:opacity-100 md:relative md:w-1/2 md:order-2">
        <BlueprintCanvas completedStepIds={revealed} currentStepId={null} stepLabels={{}} reducedMotion={reducedMotion} />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-16 md:w-1/2 md:order-1 md:px-16 lg:px-24">
        <a href="/" className="cursor-hover mb-10 inline-flex w-fit text-sm font-bold tracking-[0.05em] text-white/70 hover:text-white" data-cursor-label="HOME">
          ← VANTAFRAME
        </a>

        <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">{copy.microlabel}</p>

        <h1 ref={headingRef} className="mt-5 max-w-xl text-4xl font-extralight leading-[1.05] md:text-6xl">
          {copy.heading}
        </h1>

        <p className="mt-6 max-w-md text-base text-white/60 md:text-lg">{copy.desc}</p>

        <div className="mt-10 flex items-center gap-5">
          <button
            ref={buttonRef}
            type="button"
            onClick={onStart}
            data-cursor-label="START"
            className="cursor-hover inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-white/85"
          >
            {copy.cta}
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </button>
          <span className="text-xs uppercase tracking-widest text-white/35">{copy.hint}</span>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;

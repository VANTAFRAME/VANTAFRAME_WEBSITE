import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { presentationCopy } from "../presentationConfig";
import { presentationMotion, usePresentationMotion } from "../usePresentationMotion";

gsap.registerPlugin(ScrollTrigger);

const calloutThresholds = [0.34, 0.56, 0.78];
const REVEAL_START = 6;
const REVEAL_END = 100;

const BespokeComparisonReveal = () => {
  const rootRef = useRef(null);
  const boardRef = useRef(null);
  const calloutRefs = useRef([]);
  const calloutStateRef = useRef([]);
  const { scroller, slide, reducedMotion } = usePresentationMotion(rootRef);
  const { bespokeProject } = presentationCopy;

  useEffect(() => {
    const board = boardRef.current;
    const root = rootRef.current;
    if (!board || !root || !slide || !scroller) return undefined;

    const setReveal = (progress) => {
      const clampedProgress = gsap.utils.clamp(REVEAL_START, REVEAL_END, progress);
      board.style.setProperty("--comparison-progress", `${clampedProgress.toFixed(2)}%`);
    };

    setReveal(reducedMotion ? REVEAL_END : REVEAL_START);

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(calloutRefs.current, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(calloutRefs.current, { autoAlpha: 0, y: 16 });

      ScrollTrigger.create({
        trigger: slide,
        scroller,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const revealProgress = gsap.utils.clamp(0, 1, self.progress);
          const reveal = gsap.utils.interpolate(REVEAL_START, REVEAL_END, revealProgress);
          setReveal(reveal);

          calloutRefs.current.forEach((callout, index) => {
            if (!callout) return;

            const isVisible = revealProgress >= calloutThresholds[index];
            if (calloutStateRef.current[index] === isVisible) return;

            calloutStateRef.current[index] = isVisible;
            gsap.to(callout, {
              autoAlpha: isVisible ? 1 : 0.18,
              y: isVisible ? 0 : 16,
              duration: 0.22,
              ease: presentationMotion.gsapEmphasisEase,
              overwrite: true,
            });
          });
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion, scroller, slide]);

  return (
    <div ref={rootRef} className="grid h-full w-full gap-4 md:gap-5">
      <div
        ref={boardRef}
        className="presentation-corner-frame presentation-corner-frame--cyan relative min-h-[21rem] w-full overflow-hidden md:min-h-[28rem] xl:min-h-[33rem]"
        style={{ "--comparison-progress": `${REVEAL_START}%` }}
      >
        <div className="absolute inset-0 bg-[#0a0a0a]" />

        <div className="absolute inset-0 grid grid-cols-2 gap-4 p-5 opacity-80 md:gap-5 md:p-7">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`template-${index}`}
              className={[
                "rounded-[1.3rem] border border-white/10 bg-white/[0.04]",
                index === 0 || index === 3 ? "col-span-2 min-h-[4.5rem]" : "min-h-[6rem] md:min-h-[7rem]",
              ].join(" ")}
            />
          ))}
        </div>

        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{
            width: "var(--comparison-progress)",
            clipPath: "inset(0 0 0 0)",
          }}
        >
          <img
            src={bespokeProject.image}
            alt={bespokeProject.title}
            className="h-full w-full object-cover object-top"
          />
        </div>

        <div
          className="absolute inset-y-0 z-20 w-px bg-cyan-300 shadow-[0_0_28px_rgba(34,211,238,0.75)]"
          style={{ left: "var(--comparison-progress)", transform: "translateX(-100%)" }}
        >
          <span className="absolute left-1/2 top-4 h-10 w-10 -translate-x-1/2 rounded-full border border-cyan-300/45 bg-[#050505]/88 shadow-[0_0_22px_rgba(34,211,238,0.28)] md:top-5 md:h-12 md:w-12" />
        </div>

        <div className="absolute left-4 top-4 z-20 rounded-full border border-white/15 bg-[#050505]/84 px-3 py-2 text-[0.62rem] uppercase tracking-[0.28em] text-white/46 md:left-7 md:top-7 md:text-[0.68rem]">
          Template
        </div>
        <div className="absolute right-4 top-4 z-20 rounded-full border border-cyan-300/22 bg-[#050505]/84 px-3 py-2 text-[0.62rem] uppercase tracking-[0.28em] text-cyan-300/76 md:right-7 md:top-7 md:text-[0.68rem]">
          {bespokeProject.title}
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 hidden md:block">
          {presentationCopy.comparisonCallouts.map((callout, index) => (
            <div
              key={callout}
              ref={(node) => {
                calloutRefs.current[index] = node;
              }}
              className={[
                "absolute rounded-full border border-cyan-300/32 bg-[#050505]/92 px-4 py-2 text-[0.68rem] uppercase tracking-[0.3em] text-cyan-200",
                index === 0 && "left-[10%] top-[16%]",
                index === 1 && "right-[7%] top-[46%]",
                index === 2 && "left-[26%] bottom-[12%]",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {callout}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-2 md:hidden">
        {presentationCopy.comparisonCallouts.map((callout) => (
          <div key={`mobile-${callout}`} className="presentation-chip">
            {callout}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BespokeComparisonReveal;

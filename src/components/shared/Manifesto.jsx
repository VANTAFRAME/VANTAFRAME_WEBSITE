import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// A positioning statement, pinned dead-center: three "we don't start
// with..." lines cross-fade one at a time as the visitor scrolls, then
// resolve into the final line and the process steps. The lines/final share
// one fixed-height box (both absolutely stacked inside it) so the visible
// text never shifts vertically between phases — only the fixed-height box
// plus the steps' margin below it determine the group's height, regardless
// of which phase is currently showing.
const Manifesto = ({ t }) => {
  const sectionRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useLayoutEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return undefined;

    const lines = section.querySelectorAll(".manifesto-line");
    const finalEl = section.querySelector(".manifesto-final");
    const stepsEl = section.querySelector(".manifesto-steps");

    const ctx = gsap.context(() => {
      gsap.set(lines, { opacity: 0, y: 16 });
      gsap.set(lines[0], { opacity: 1, y: 0 });
      gsap.set(finalEl, { opacity: 0, y: 20 });
      gsap.set(stepsEl, { opacity: 0, y: 12 });

      // Generous holds so each line is actually readable before crossfading —
      // only ~8% of the scroll distance is spent transitioning; the rest is
      // dwell time.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });

      tl.to(lines[0], { opacity: 0, y: -16, duration: 0.08 }, 0.2)
        .fromTo(lines[1], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.08 }, 0.2)
        .to(lines[1], { opacity: 0, y: -16, duration: 0.08 }, 0.46)
        .fromTo(lines[2], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.08 }, 0.46)
        .to(lines[2], { opacity: 0, y: -16, duration: 0.08 }, 0.72)
        .to(finalEl, { opacity: 1, y: 0, duration: 0.12 }, 0.8)
        .to(stepsEl, { opacity: 1, y: 0, duration: 0.12 }, 0.9);
    }, section);

    return () => ctx.revert();
  }, [t, reducedMotion]);

  if (reducedMotion) {
    return (
      <section className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 text-center">
        <div className="max-w-3xl mx-auto space-y-3 mb-14">
          {t.lines.map((line, i) => (
            <p key={i} className="text-xl md:text-3xl font-bold tracking-tight text-white/50">
              {line}
            </p>
          ))}
        </div>
        <h2 className="text-[clamp(2rem,7vw,5.5rem)] font-black tracking-tight leading-[1.05]">
          {t.final.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-10 md:mt-14">
          {t.steps.map((step, i) => (
            <React.Fragment key={step}>
              <span className="font-mono text-xs md:text-sm uppercase tracking-widest text-white/40">{step}</span>
              {i < t.steps.length - 1 && <span className="text-white/15 text-xs">—</span>}
            </React.Fragment>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative" style={{ height: "340vh" }}>
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        {/* Fixed-height stage: lines and final both live here, absolutely
            stacked, so this box's height never changes with the phase. */}
        {/* Tall enough to hold the largest possible content (the multi-line
            final headline at its biggest clamp size) without ever clipping
            it — the individual lines are shorter and simply center within
            the same box. */}
        <div className="relative w-full max-w-4xl h-[34vh] md:h-[40vh] shrink-0">
          <div className="manifesto-lines absolute inset-0">
            {t.lines.map((line, i) => (
              <p
                key={i}
                className="manifesto-line absolute inset-0 flex items-center justify-center text-2xl sm:text-4xl md:text-6xl font-black tracking-tight text-white/50"
              >
                {line}
              </p>
            ))}
          </div>
          <h2 className="manifesto-final absolute inset-0 flex flex-col items-center justify-center text-[clamp(2rem,7vw,5.5rem)] font-black tracking-tight leading-[1.05]">
            {t.final.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>

        <div className="manifesto-steps flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-10 md:mt-14 shrink-0">
          {t.steps.map((step, i) => (
            <React.Fragment key={step}>
              <span className="font-mono text-xs md:text-sm uppercase tracking-widest text-white/40">{step}</span>
              {i < t.steps.length - 1 && <span className="text-white/15 text-xs">—</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Manifesto;

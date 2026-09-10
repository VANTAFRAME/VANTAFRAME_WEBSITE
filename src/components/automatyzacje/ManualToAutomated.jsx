import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";

gsap.registerPlugin(ScrollTrigger);

const ManualToAutomated = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].automatyzacjePage.manualToAutomated;
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const manualSteps = section.querySelectorAll(".manual-step");
    const automatedBlock = section.querySelector(".automated-block");
    const automatedNodes = section.querySelectorAll(".automated-node");
    const automatedLines = section.querySelectorAll(".automated-line");
    const finalLine = section.querySelector(".final-line");

    const ctx = gsap.context(() => {
      gsap.set(manualSteps, { color: "rgba(255,255,255,0.22)" });
      gsap.set(automatedBlock, { opacity: 0, y: 24 });
      gsap.set(automatedNodes, { opacity: 0.3 });
      gsap.set(automatedLines, { scaleX: 0 });
      gsap.set(finalLine, { opacity: 0, y: 12 });

      // Manual steps light up one at a time, slowly — this is the "45 minutes"
      // of the metaphor. The automated flow then resolves almost instantly —
      // this is the "3 seconds" — communicated purely through pacing, not a
      // literal countdown.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      tl.to(manualSteps, { color: "rgba(255,255,255,0.55)", stagger: 0.15, duration: 0.6 }, 0)
        .to(automatedBlock, { opacity: 1, y: 0, duration: 0.3 }, 0.55)
        .to(automatedNodes, { opacity: 1, stagger: 0.08, duration: 0.15 }, 0.65)
        .to(automatedLines, { scaleX: 1, stagger: 0.08, duration: 0.15 }, 0.7)
        .to(finalLine, { opacity: 1, y: 0, duration: 0.2 }, 0.85);
    }, section);

    return () => ctx.revert();
  }, [lang]);

  return (
    <section ref={sectionRef} className="relative" style={{ height: "220vh" }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="px-6 md:px-12 max-w-[1700px] mx-auto w-full flex flex-col items-center text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 mb-10 md:mb-14">{t.exampleLabel}</p>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.02] mb-8 md:mb-10">
              {t.headlineManual[0]}
              <br />
              <span className="text-white/40">{t.headlineManual[1]}</span>
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
              {t.manualSteps.map((step, i) => (
                <React.Fragment key={step}>
                  <span className="manual-step font-mono text-xs md:text-sm uppercase tracking-widest">{step}</span>
                  {i < t.manualSteps.length - 1 && <span className="text-white/15 text-xs">/</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="automated-block max-w-3xl mx-auto mt-16 md:mt-24">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.02] mb-8 md:mb-10">
              {t.headlineAutomated.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h2>

            <div className="flex items-center justify-center gap-3 md:gap-4">
              {t.automatedFlow.map((node, i) => (
                <React.Fragment key={node}>
                  <span className="automated-node font-mono text-xs md:text-sm uppercase tracking-widest text-white border border-white/20 rounded-full px-4 py-2">
                    {node}
                  </span>
                  {i < t.automatedFlow.length - 1 && (
                    <span className="automated-line h-px w-8 md:w-14 bg-cyan-300/60 origin-left shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <p className="final-line font-mono text-xs md:text-sm uppercase tracking-[0.2em] text-white/50 mt-10 md:mt-14">
              {t.finalLine[0]} <span className="text-white">{t.finalLine[1]}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManualToAutomated;

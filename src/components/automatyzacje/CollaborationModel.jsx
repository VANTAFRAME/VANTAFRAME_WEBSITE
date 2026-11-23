import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";
gsap.registerPlugin(ScrollTrigger);
// "Deployment is only the beginning" — four stages on one thin line that fills
// as the visitor scrolls (cyan marks only the stage currently reached), plus a
// dashed return line under the stages: development feeds the next analysis.
// Large outlined numerals and hairlines instead of cards, to stay in the
// editorial language of the rest of the page.
const CollaborationModel = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].automatyzacjePage.collaboration;
  const sectionRef = useRef(null);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const nodes = Array.from(section.querySelectorAll("[data-collab-node]"));
    const setActive = (progress) => {
      nodes.forEach((node, i) => {
        const reached = progress >= (i + 0.15) / nodes.length;
        node.dataset.reached = reached ? "true" : "false";
      });
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(section.querySelectorAll("[data-collab-fill]"), { scaleX: 1, scaleY: 1 });
      nodes.forEach((n) => (n.dataset.reached = "true"));
      return undefined;
    }
    const ctx = gsap.context(() => {
      const track = section.querySelector("[data-collab-track]");
      gsap.set(section.querySelectorAll("[data-collab-fill-x]"), { scaleX: 0 });
      gsap.set(section.querySelectorAll("[data-collab-fill-y]"), { scaleY: 0 });
      setActive(0);
      ScrollTrigger.create({
        trigger: track,
        start: "top 75%",
        end: "bottom 55%",
        scrub: 0.5,
        onUpdate: (self) => {
          gsap.set(section.querySelectorAll("[data-collab-fill-x]"), { scaleX: self.progress });
          gsap.set(section.querySelectorAll("[data-collab-fill-y]"), { scaleY: self.progress });
          setActive(self.progress);
        },
      });
    }, section);
    return () => ctx.revert();
  }, [lang]);
  return (
    <section ref={sectionRef} id="model-wspolpracy" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <div className="mb-16 md:mb-24" data-reveal>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 mb-6">{t.label}</p>
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-16 items-end">
          <h2 className="text-4xl md:text-6xl xl:text-7xl font-black tracking-tight leading-[1.02]">
            {t.heading[0]}
            {" "}<br />
            {t.heading[1]}
          </h2>
          <p className="text-base md:text-xl text-white/55 leading-relaxed max-w-xl">{t.desc}</p>
        </div>
      </div>
      <div data-collab-track className="relative">
        {/* progress line — horizontal on lg, vertical below */}
        <span aria-hidden="true" className="absolute left-0 right-0 top-[7px] hidden h-px bg-white/12 lg:block" />
        <span
          aria-hidden="true"
          data-collab-fill
          data-collab-fill-x
          className="absolute left-0 right-0 top-[7px] hidden h-px origin-left bg-cyan-300/70 lg:block"
        />
        <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-px bg-white/12 lg:hidden" />
        <span
          aria-hidden="true"
          data-collab-fill
          data-collab-fill-y
          className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-cyan-300/70 lg:hidden"
        />
        <ol className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-10">
          {t.steps.map((step) => (
            <li key={step.n} className="relative pl-10 lg:pl-0 lg:pt-12 group" data-reveal>
              <span
                data-collab-node
                data-reached="false"
                className="absolute left-0 top-1 h-[15px] w-[15px] rounded-full border border-white/30 bg-black transition-colors duration-500 data-[reached=true]:border-cyan-300 data-[reached=true]:bg-cyan-300/20 lg:top-0"
              />
              <span
                aria-hidden="true"
                className="block text-[clamp(4.5rem,9vw,8rem)] font-black leading-none tracking-tighter text-white/[0.09] select-none"
              >
                {step.n}
              </span>
              <h3 className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-white/80">{step.title}</h3>
              <p className="mt-4 text-base text-white/55 leading-relaxed max-w-xs">{step.desc}</p>
            </li>
          ))}
        </ol>
        {/* return line: development feeds the next analysis (lg only) */}
        <div className="relative mt-14 hidden lg:block" aria-hidden="true">
          <div className="mx-[12.5%] h-10 rounded-b-2xl border-x border-b border-dashed border-white/18" />
          <svg className="absolute left-[12.5%] -top-1 h-3 w-3 -translate-x-1/2 text-white/40" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 8l4-5 4 5" />
          </svg>
          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 bg-brand-black px-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
            {t.loop}
          </span>
        </div>
      </div>
    </section>
  );
};
export default CollaborationModel;
import React, { useEffect, useRef, useState } from "react";
import { useService } from "../useService";
// "How it works": the same process in two states, as two aligned flows read top to bottom —
// BEFORE (by hand, dimmed, dashed rail) and AFTER (automated, solid rail) — with one row per
// stage so every stage can be compared across. Wide text, no narrow columns. The human is not
// reduced to "the person who handles exceptions": an optional approval step sits in ACTION
// and a required person in EXCEPTIONS. AI is a single optional note in the RULES row (for
// unstructured input), and the one explanation of "rules first" is the note at the bottom.
// On small screens each stage becomes a BEFORE / AFTER pair. A conceptual example, not a
// client case. When the section scrolls into view the markers of the AFTER flow fill once;
// under prefers-reduced-motion everything is simply shown.
const Person = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 shrink-0 ${className}`} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" />
  </svg>
);
const BeforeAfter = ({ data, slug }) => {
  const { c, ui } = useService(data);
  const { how } = c;
  const ref = useRef(null);
  const [lit, setLit] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLit(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const grid = "lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,5fr)_minmax(0,6fr)] lg:gap-x-12";
  return (
    <section id="jak-dziala" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <style>{`
        .ba-mark{transition:background-color .6s ease,border-color .6s ease,opacity .6s ease;opacity:.4}
        .ba-text{transition:opacity .7s ease}
        .ba-wrap[data-lit="false"] .ba-after .ba-text{opacity:.35}
        .ba-wrap[data-lit="true"] .ba-after .ba-mark{opacity:1;border-color:#67e8f9;background-color:#67e8f9}
        @media (prefers-reduced-motion: reduce){.ba-mark,.ba-text{transition:none}.ba-mark{opacity:1}.ba-wrap[data-lit="false"] .ba-after .ba-text{opacity:1}}
      `}</style>
      <div className="mb-12 md:mb-16" data-reveal>
        <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{ui.how}</p>
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <h2 className="text-3xl font-black leading-[1.05] tracking-tight md:text-5xl xl:text-6xl">
            {how.heading[0]}
            {" "}<br />
            {how.heading[1]}
          </h2>
          <div className="flex max-w-xl flex-col items-start gap-5">
            <p className="text-base leading-relaxed text-white/65 md:text-lg">{how.intro}</p>
            <span className="inline-flex w-fit items-center gap-3 rounded-full border border-white/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
              <span aria-hidden="true" className="h-1.5 w-1.5 bg-white/50" />
              {how.badge}
            </span>
          </div>
        </div>
      </div>
      <div ref={ref} data-lit={lit ? "true" : "false"} className="ba-wrap">
        {/* column headers (lg+) */}
        <div aria-hidden="true" className={`hidden border-y border-white/10 py-4 font-mono text-[10px] uppercase tracking-[0.25em] ${grid}`}>
          <span className="text-white/50">{how.stageLabel}</span>
          <span className="flex items-center gap-3 pl-8 text-white/50">
            <Person />
            {how.before}
          </span>
          <span className="flex items-center gap-3 pl-8 text-white/90">
            <span className="block h-2 w-2 bg-cyan-300" />
            {how.after}
          </span>
        </div>
        <ol className="divide-y divide-white/10 border-t border-white/10 lg:border-t-0">
          {how.phases.map((p, i) => (
            <li key={p.label} className={`py-8 md:py-10 lg:py-0 ${grid}`} data-reveal>
              <div className="mb-6 flex items-baseline gap-4 lg:mb-0 lg:block lg:py-10">
                <span className="font-mono text-xs text-white/50 lg:mb-3 lg:block">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-xl font-bold uppercase tracking-tight md:text-2xl">{p.label}</h3>
              </div>
              {/* BEFORE */}
              <div className="relative mb-7 border-l border-dashed border-white/20 pl-8 lg:mb-0 lg:py-10">
                <span aria-hidden="true" className="absolute -left-[5px] top-1.5 block h-2.5 w-2.5 rounded-full lg:top-[2.9rem] border border-white/35 bg-brand-black" />
                <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 lg:hidden">{how.before}</span>
                <p className="max-w-md text-base leading-relaxed text-white/55">{p.before}</p>
              </div>
              {/* AFTER */}
              <div className="ba-after relative border-l border-white/30 pl-8 lg:py-10">
                <span aria-hidden="true" className="ba-mark absolute -left-[5px] top-1.5 lg:top-[2.9rem] block h-2.5 w-2.5 border border-white/60 bg-brand-black" />
                <div className="ba-text">
                  <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
                    <span className="lg:hidden">{how.after} · </span>
                    {p.tag}
                  </span>
                  <p className="max-w-lg text-base leading-relaxed text-white">{p.after}</p>
                  {p.ai && (
                    <div className="mt-4 max-w-lg">
                      <span className="mb-2 inline-flex items-center rounded-full border border-dashed border-white/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
                        {how.ai}
                      </span>
                      <p className="text-sm leading-relaxed text-white/65">{p.ai}</p>
                    </div>
                  )}
                  {p.human && (
                    <div className="mt-4 max-w-lg">
                      <span
                        className={`mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80 ${
                          p.human.optional ? "border-dashed border-white/40" : "border-white/40"
                        }`}
                      >
                        <Person />
                        {how.human}
                        {p.human.optional ? ` · ${how.optional}` : ""}
                      </span>
                      <p className="text-sm leading-relaxed text-white/65">{p.human.text}</p>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-14 max-w-2xl border-l border-white/20 pl-5 text-base leading-relaxed text-white/70 md:mt-16" data-reveal>
        {how.note}
      </p>
    </section>
  );
};
export default BeforeAfter;
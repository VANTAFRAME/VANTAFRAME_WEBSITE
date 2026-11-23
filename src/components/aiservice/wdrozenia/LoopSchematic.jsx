import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useService } from "../useService";
import DeliverablesLedger from "./DeliverablesLedger";
// "How a deployment unfolds": one schematic instead of paragraphs. Six mono pills on a
// hairline (the same pill + connector language as the "45 minutes / 3 seconds" section),
// a short caption under each, and a dashed return arc from MONITOR back to EVAL.
//
// Readable with no animation at all: every stage and the arc are plain, visible markup.
// With motion allowed, one GSAP timeline walks the stages (the current one is cyan,
// finished ones turn white), then draws the return arc right-to-left and lights EVAL a
// second time — "results come back to evaluation" — holds, resets and repeats. It pauses
// off screen and in a hidden tab, and is not created at all for prefers-reduced-motion.
// lg: horizontal with the arc above the pills; below lg: vertical list, return line at the end.
const REST_BORDER = "rgba(255,255,255,0.28)";
const DONE_BORDER = "rgba(255,255,255,0.6)";
const CYAN = "#67e8f9";
const REST_TEXT = "rgba(255,255,255,0.78)";
const DONE_TEXT = "rgba(255,255,255,0.95)";
const EVAL_INDEX = 3;
const LoopSchematic = ({ data, slug, withLedger = false }) => {
  const { c, ui } = useService(data);
  const { how } = c;
  const count = how.flow.length;
  const rootRef = useRef(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const pills = Array.from(root.querySelectorAll("[data-ls-pill]"));
    const fillsX = root.querySelectorAll("[data-ls-fill-x]");
    const fillsY = root.querySelectorAll("[data-ls-fill-y]");
    const arcs = root.querySelectorAll("[data-ls-arc]");
    const arcLabels = root.querySelectorAll("[data-ls-arclabel]");
    let visible = false;
    let tabHidden = document.hidden;
    let tl = null;
    const sync = () => {
      if (!tl) return;
      if (visible && !tabHidden) tl.play();
      else tl.pause();
    };
    const ctx = gsap.context(() => {
      const rest = () => {
        gsap.set(fillsX, { scaleX: 0, opacity: 1, transformOrigin: "0% 50%" });
        gsap.set(fillsY, { scaleY: 0, opacity: 1, transformOrigin: "50% 0%" });
        gsap.set(arcs, { clipPath: "inset(0 0 0 100%)", opacity: 1 });
        gsap.set(arcLabels, { opacity: 0.0 });
        gsap.set(pills, { borderColor: REST_BORDER, color: REST_TEXT, backgroundColor: "#050505" });
      };
      rest();
      const step = 0.95;
      tl = gsap.timeline({ repeat: -1, paused: true });
      tl.to({}, { duration: 0.4 });
      pills.forEach((pill, i) => {
        const at = 0.4 + i * step;
        tl.to(pill, { borderColor: CYAN, color: CYAN, backgroundColor: "rgba(103,232,249,0.08)", duration: 0.25, ease: "power2.out" }, at)
          .to(fillsX, { scaleX: (i + 1) / count, duration: step * 0.9, ease: "power1.inOut" }, at)
          .to(fillsY, { scaleY: (i + 1) / count, duration: step * 0.9, ease: "power1.inOut" }, at)
          .to(pill, { borderColor: DONE_BORDER, color: DONE_TEXT, backgroundColor: "#050505", duration: 0.4 }, at + step * 0.85);
      });
      const end = 0.4 + count * step;
      // the loop: MONITOR → EVAL
      tl.to(arcs, { clipPath: "inset(0 0 0 0%)", duration: 1.0, ease: "power1.inOut" }, end)
        .to(arcLabels, { opacity: 1, duration: 0.4 }, end + 0.4)
        .to(pills[EVAL_INDEX], { borderColor: CYAN, color: CYAN, backgroundColor: "rgba(103,232,249,0.08)", duration: 0.3 }, end + 0.9)
        .to(pills[EVAL_INDEX], { borderColor: DONE_BORDER, color: DONE_TEXT, backgroundColor: "#050505", duration: 0.5 }, end + 1.9)
        .to({}, { duration: 1.0 })
        .to([fillsX, fillsY, arcs, arcLabels], { opacity: 0, duration: 0.5 }, end + 3.2)
        .to(pills, { borderColor: REST_BORDER, color: REST_TEXT, duration: 0.5 }, end + 3.2)
        .add(() => {
          rest();
        }, end + 3.8)
        .to({}, { duration: 0.4 });
    }, root);
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.2 }
    );
    io.observe(root);
    const onVis = () => {
      tabHidden = document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      tl?.kill();
      ctx.revert();
    };
  }, [count, how]);
  return (
    <section ref={rootRef} id="jak-dziala" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <div className="mb-14 md:mb-20" data-reveal>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55 mb-6">{ui.how}</p>
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-16 items-end">
          <h2 className="text-3xl md:text-5xl xl:text-6xl font-black tracking-tight leading-[1.05]">
            {how.heading[0]}
            {" "}<br />
            {how.heading[1]}
          </h2>
          <p className="text-base md:text-lg text-white/65 leading-relaxed max-w-xl">{how.intro}</p>
        </div>
      </div>
      <div className="relative lg:pt-[88px]" data-reveal>
        {/* return arc MONITOR → EVAL (lg): a dashed bracket above the pills */}
        <div aria-hidden="true" className="pointer-events-none absolute left-[58.333%] right-[8.333%] top-6 hidden h-[58px] lg:block">
          <div
            data-ls-arc
            className="absolute inset-0 rounded-t-2xl border-x border-t border-dashed border-white/45"
          />
          <span
            data-ls-arc
            className="absolute -bottom-px left-0 h-2 w-2 -translate-x-1/2 translate-y-[1px] rotate-45 border-b border-r border-white/60"
          />
          <span
            data-ls-arclabel
            className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-brand-black px-4 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/90"
          >
            {how.loopLabel}
          </span>
        </div>
        {/* hairline + progress (lg horizontal, below lg vertical) */}
        <span aria-hidden="true" className="absolute left-0 right-0 top-[105px] hidden h-px bg-white/12 lg:block" />
        <span aria-hidden="true" data-ls-fill-x className="absolute left-0 right-0 top-[105px] hidden h-px origin-left bg-cyan-300/60 lg:block" />
        
        <span aria-hidden="true" data-ls-fill-y className="hidden" />
        <ol className="relative grid grid-cols-1 gap-9 lg:grid-cols-6 lg:gap-6">
          {how.flow.map((step, i) => (
            <li key={step.label} className="relative lg:text-center">
              <span
                data-ls-pill
                className="mb-4 inline-flex h-9 items-center rounded-full border border-white/30 bg-brand-black px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80 lg:mx-auto lg:mb-5 lg:flex lg:w-fit"
              >
                {step.label}
              </span>
              <h3 className="text-lg md:text-xl font-bold tracking-tight mb-2 lg:pt-0">{step.title}</h3>
              <p className="text-sm text-white/65 leading-relaxed lg:mx-auto lg:max-w-[16rem]">{step.desc}</p>
              {i === count - 1 && (
                <p className="mt-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/85 lg:hidden">
                  <span aria-hidden="true" className="inline-block h-5 w-5 rounded-bl-xl border-b border-l border-dashed border-white/45" />
                  {how.loopLabel}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
      {how.note && (
        <p className="mt-16 max-w-2xl border-l border-white/20 pl-5 text-sm md:text-base text-white/65 leading-relaxed" data-reveal>
          {how.note}
        </p>
      )}
      {withLedger && <DeliverablesLedger data={data} embedded />}
    </section>
  );
};
export default LoopSchematic;
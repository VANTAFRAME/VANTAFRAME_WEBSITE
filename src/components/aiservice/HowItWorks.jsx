import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useService } from "./useService";
// "How it works": this service's own architecture as a sequence of stages
// (INPUT → … → OUTPUT). A single GSAP timeline walks the stages — the current one is
// cyan, finished ones turn neutral white, a hairline fills behind them — then fades and
// repeats. Horizontal on lg, vertical below. The timeline pauses off screen / in a hidden
// tab and is not created at all for prefers-reduced-motion (static, readable list).
const REST = "rgba(255,255,255,0.55)";
const DONE = "rgba(255,255,255,0.9)";
const CYAN = "#67e8f9";
const HowItWorks = ({ data, slug }) => {
  const { c, ui } = useService(data);
  const { how } = c;
  const count = how.flow.length;
  const rootRef = useRef(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const nodes = Array.from(root.querySelectorAll("[data-hw-node]"));
    const labels = Array.from(root.querySelectorAll("[data-hw-label]"));
    const fillsX = root.querySelectorAll("[data-hw-fill-x]");
    const fillsY = root.querySelectorAll("[data-hw-fill-y]");
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
        gsap.set(fillsX, { scaleX: 0, transformOrigin: "0% 50%" });
        gsap.set(fillsY, { scaleY: 0, transformOrigin: "50% 0%" });
        gsap.set(labels, { color: REST });
        gsap.set(nodes, { backgroundColor: "#050505", borderColor: "rgba(255,255,255,0.3)", scale: 1 });
      };
      rest();
      tl = gsap.timeline({ repeat: -1, paused: true });
      const step = 1.15;
      tl.to({}, { duration: 0.4 }); // rest
      nodes.forEach((node, i) => {
        const at = 0.4 + i * step;
        tl.to(node, { backgroundColor: CYAN, borderColor: CYAN, scale: 1.25, duration: 0.25, ease: "power2.out" }, at)
          .to(labels[i], { color: CYAN, duration: 0.25 }, at)
          .to(fillsX, { scaleX: (i + 1) / count, duration: step * 0.9, ease: "power1.inOut" }, at)
          .to(fillsY, { scaleY: (i + 1) / count, duration: step * 0.9, ease: "power1.inOut" }, at)
          .to(node, { backgroundColor: DONE, borderColor: DONE, scale: 1, duration: 0.4 }, at + step * 0.9)
          .to(labels[i], { color: DONE, duration: 0.4 }, at + step * 0.9);
      });
      const end = 0.4 + count * step;
      tl.to({}, { duration: 1.1 }, end) // hold the finished state
        .to(fillsX, { scaleX: 0, duration: 0.7, ease: "power2.inOut", transformOrigin: "100% 50%" }, end + 1.1)
        .to(fillsY, { scaleY: 0, duration: 0.7, ease: "power2.inOut", transformOrigin: "50% 100%" }, end + 1.1)
        .to(nodes, { backgroundColor: "#050505", borderColor: "rgba(255,255,255,0.3)", duration: 0.6 }, end + 1.1)
        .to(labels, { color: REST, duration: 0.6 }, end + 1.1)
        .to({}, { duration: 0.5 });
    }, root);
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.15 }
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
      <div className="relative" style={{ "--hw-n": count }}>
        {/* progress line: horizontal on lg, vertical below */}
        <span aria-hidden="true" className="absolute left-0 right-0 top-[7px] hidden h-px bg-white/12 lg:block" />
        <span aria-hidden="true" data-hw-fill-x className="absolute left-0 right-0 top-[7px] hidden h-px bg-cyan-300/70 lg:block origin-left" />
        <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-px bg-white/12 lg:hidden" />
        <span aria-hidden="true" data-hw-fill-y className="absolute bottom-0 left-[7px] top-0 w-px bg-cyan-300/70 lg:hidden origin-top" />
        <ol className="grid grid-cols-1 gap-10 lg:gap-8 lg:grid-cols-[repeat(var(--hw-n),minmax(0,1fr))]">
          {how.flow.map((step, i) => (
            <li key={step.label + i} className="relative pl-10 lg:pl-0 lg:pt-12" data-reveal>
              <span
                data-hw-node
                className="absolute left-0 top-1 h-[15px] w-[15px] rounded-full border border-white/30 bg-brand-black lg:top-0"
              />
              <span data-hw-label className="block font-mono text-[11px] uppercase tracking-[0.25em] text-white/55 mb-3">
                {step.label}
              </span>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-3">{step.title}</h3>
              <p className="text-sm md:text-base text-white/65 leading-relaxed">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
      {how.note && (
        <p className="mt-14 max-w-2xl border-l border-white/20 pl-5 text-sm md:text-base text-white/60 leading-relaxed" data-reveal>
          {how.note}
        </p>
      )}
    </section>
  );
};
export default HowItWorks;
import React, { useEffect, useRef, useState } from "react";
import { useService } from "../useService";
// "Where AI makes sense": four example scenarios laid out as a blueprint — a 2×2 grid cut
// by hairlines, not four separate cards. Each cell shows the scenario as a transformation
// (INPUT → PROCESSING → OUTPUT in mono pills joined by a line), a one-line summary and the
// effect, always visible. The full situation/mechanism text opens in a native <details>
// (so it stays in the HTML and works from the keyboard).
// When a cell scrolls into view the connectors draw and the output pill turns cyan once;
// under prefers-reduced-motion everything is simply shown.
const Node = ({ label, text, cyan, delay }) => (
  <div className="min-w-0 flex-1">
    <span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.22em] text-white/55">{label}</span>
    <div
      className="sb-node rounded-md border bg-brand-black px-3 py-2.5 text-[13px] leading-snug text-white/85 transition-colors duration-700"
      data-cyan={cyan ? "true" : "false"}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {text}
    </div>
  </div>
);
const Link = ({ delay }) => (
  <span aria-hidden="true" className="sb-link relative mx-1 hidden h-px w-6 shrink-0 self-end bg-white/12 mb-[1.15rem] lg:block xl:w-8">
    <span className="sb-fill absolute inset-0 origin-left bg-cyan-300/70" style={{ transitionDelay: `${delay}ms` }} />
  </span>
);
const Cell = ({ item, labels, detailsLabel }) => {
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
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <li
      ref={ref}
      data-lit={lit ? "true" : "false"}
      className="sb-cell group border-b border-r border-white/10 p-6 md:p-9 xl:p-11 transition-colors duration-500 hover:bg-white/[0.015]"
      data-reveal
    >
      <div className="mb-6 flex items-baseline gap-4">
        <span className="font-mono text-xs text-white/50">{item.n}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{item.tag}</span>
      </div>
      <h3 className="mb-3 text-2xl font-bold tracking-tight md:text-3xl">{item.title}</h3>
      <p className="mb-8 max-w-md text-base leading-relaxed text-white/65">{item.summary}</p>
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-0">
        <Node label={labels.flowIn} text={item.flow.in} delay={0} />
        <Link delay={150} />
        <Node label={labels.flowProcess} text={item.flow.process} delay={0} />
        <Link delay={450} />
        <Node label={labels.flowOut} text={item.flow.out} cyan delay={750} />
      </div>
      <p className="border-t border-white/10 pt-5 text-base leading-relaxed text-white">
        <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300/85">{labels.effect}</span>
        {item.effect}
      </p>
      <details className="group/d mt-6">
        <summary className="inline-flex cursor-pointer list-none items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/65 outline-none transition-colors hover:text-white focus-visible:text-white focus-visible:ring-1 focus-visible:ring-cyan-300/70 [&::-webkit-details-marker]:hidden">
          <span aria-hidden="true" className="relative h-3 w-3 transition-transform duration-300 group-open/d:rotate-45">
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
          </span>
          {detailsLabel}
        </summary>
        <dl className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="border-t border-white/15 pt-4">
            <dt className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{labels.situation}</dt>
            <dd className="text-sm leading-relaxed text-white/70">{item.problem}</dd>
          </div>
          <div className="border-t border-white/15 pt-4">
            <dt className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{labels.mechanism}</dt>
            <dd className="text-sm leading-relaxed text-white/70">{item.mechanism}</dd>
          </div>
        </dl>
      </details>
    </li>
  );
};
const ScenarioBlueprint = ({ data, slug }) => {
  const { c, ui } = useService(data);
  const { useCases } = c;
  return (
    <section id="zastosowania" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <style>{`
        .sb-node{border-color:rgba(255,255,255,0.22)}
        .sb-fill{transform:scaleX(0);transition:transform .7s cubic-bezier(.4,0,.2,1)}
        .sb-cell[data-lit="true"] .sb-fill{transform:scaleX(1)}
        .sb-cell[data-lit="true"] .sb-node[data-cyan="true"]{border-color:#67e8f9;color:#ffffff}
        @media (max-width:1023px){.sb-fill{display:none}}
        @media (prefers-reduced-motion: reduce){.sb-fill{transition:none;transform:scaleX(1)}.sb-node{transition:none}}
      `}</style>
      <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between" data-reveal>
        <div>
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{ui.useCases}</p>
          <h2 className="max-w-4xl text-3xl font-black leading-[1.05] tracking-tight md:text-5xl xl:text-6xl">
            {useCases.heading[0]}
            {" "}<br />
            {useCases.heading[1]}
          </h2>
        </div>
        <span className="inline-flex w-fit items-center gap-3 rounded-full border border-white/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
          <span aria-hidden="true" className="h-1.5 w-1.5 bg-white/50" />
          {useCases.badge}
        </span>
      </div>
      <ol className="grid grid-cols-1 border-l border-t border-white/10 lg:grid-cols-2">
        {useCases.items.map((item) => (
          <Cell key={item.n} item={item} labels={useCases.labels} detailsLabel={useCases.detailsLabel} />
        ))}
      </ol>
    </section>
  );
};
export default ScenarioBlueprint;
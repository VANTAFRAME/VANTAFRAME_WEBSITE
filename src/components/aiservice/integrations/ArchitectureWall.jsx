import React, { useEffect, useRef, useState } from "react";
import { useService } from "../useService";
import Disclosure from "../Disclosure";
// "What an integration looks like": a spatial architecture diagram, not a sequence.
// Company systems on the left (each with the way it is reached — API / WEBHOOK / CONNECTOR /
// ADAPTER — and a READ / WRITE scope, as an example configuration); the integration layer in
// the middle as a framed wall of responsibilities (access and permissions, data, model call,
// validation, controlled write) with monitoring along the bottom; the AI model OUTSIDE the
// layer on the right, reached only through the model-call responsibility and with no line to
// any system; and a target system that receives the verified result. Every responsibility
// carries its main risk. The rows are responsibilities of the architecture, not numbered
// steps: the diagram says so and nothing is animated in order.
// One subtle motion: when the diagram scrolls into view the connection lines draw in at once
// (both directions) and the model's border turns cyan. Under prefers-reduced-motion the
// final state is shown. lg+: grid with the wall in the middle; below lg everything stacks
// (systems, the wall rows, then model and target).
const Chev = ({ flip = false }) => (
  <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 shrink-0 ${flip ? "rotate-180" : ""}`} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6l6 6-6 6" />
  </svg>
);
const Conn = ({ both = false, className = "" }) => (
  <span aria-hidden="true" className={`hidden items-center self-center text-white/45 lg:flex ${className}`}>
    {both && <Chev flip />}
    <span className="relative block h-px flex-1 bg-white/20">
      <span className="aw-fill absolute inset-0 origin-left bg-cyan-300/70" />
    </span>
    <Chev />
  </span>
);
// literal classes so Tailwind can see them (grid-area: row-start / col-start / row-end / col-end)
const AREA = {
  systems: "lg:[grid-area:2/1/4/2]",
  c2: "lg:[grid-area:2/2/3/3]",
  c3: "lg:[grid-area:3/2/4/3]",
  frame: "lg:[grid-area:1/3/8/4]",
  head: "lg:[grid-area:1/3/2/4]",
  duty: [
    "lg:[grid-area:2/3/3/4]",
    "lg:[grid-area:3/3/4/4]",
    "lg:[grid-area:4/3/5/4]",
    "lg:[grid-area:5/3/6/4]",
    "lg:[grid-area:6/3/7/4]",
  ],
  monitor: "lg:[grid-area:7/3/8/4]",
  c4: "lg:[grid-area:4/4/5/5]",
  c6: "lg:[grid-area:6/4/7/5]",
  model: "lg:[grid-area:4/5/5/6]",
  target: "lg:[grid-area:6/5/7/6]",
};
const ArchitectureWall = ({ data, slug, part = "schema" }) => {
  const { c, ui } = useService(data);
  const { how } = c;
  const d = how.diagram;
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
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  if (part === "details") {
    const t = how.details;
    return (
      <section id="architektura" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
        <div className="mb-10 grid grid-cols-1 items-end gap-8 md:mb-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16" data-reveal>
          <div>
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{t.eyebrow}</p>
            <h2 className="text-3xl font-black leading-[1.05] tracking-tight md:text-5xl xl:text-6xl">
              {t.heading[0]}
              {" "}<br />
              {t.heading[1]}
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-white/65 md:text-lg">{t.lead}</p>
        </div>
        <Disclosure label={t.summary}>
          <ol className="border-t border-white/10">
            {[...how.duties, how.monitor].map((duty, i) => (
              <li key={duty.tag} className="grid grid-cols-1 gap-3 border-b border-white/10 py-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)_minmax(0,4fr)] lg:gap-10">
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">
                    {String(i + 1).padStart(2, "0")} · {duty.tag}
                  </span>
                  {/* the responsibility's name is shown once, in the diagram above; here only its tag */}
                </div>
                <p className="text-sm leading-relaxed text-white/70">{duty.desc}</p>
                {duty.risk && (
                  <p className="border-l border-dashed border-white/35 pl-4 text-sm leading-relaxed text-white/60">
                    <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.22em] text-white/50">{d.riskLabel}</span>
                    {duty.risk}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </Disclosure>
        <div className="mt-16 md:mt-20" data-reveal>
          <div className="mb-2 flex items-center gap-4">
            <h3 className="rounded-full border border-white/30 px-4 py-1.5 font-mono text-[10px] font-normal uppercase tracking-[0.22em] text-white/85">{how.routes.heading}</h3>
            <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
          </div>
          <ul className="grid grid-cols-1 divide-y divide-white/10 border-y border-white/10 md:grid-cols-2 md:divide-y-0 lg:grid-cols-4">
            {how.routes.items.map((r, i) => (
              <li key={r.tag} className={`py-6 md:px-6 ${i > 0 ? "lg:border-l lg:border-white/10" : "lg:pl-0"} ${i === 2 ? "md:border-t md:border-white/10 lg:border-t-0" : ""} ${i === 3 ? "md:border-t md:border-white/10 lg:border-t-0" : ""} ${i % 2 === 1 ? "md:border-l md:border-white/10" : ""}`}>
                <span className="mb-3 inline-flex rounded border border-white/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/85">{r.tag}</span>
                <p className="text-sm leading-relaxed text-white/70">{r.desc}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid max-w-4xl grid-cols-1 gap-4 text-sm leading-relaxed text-white/60 md:text-base">
            <p className="border-l border-white/20 pl-5">{how.routes.note}</p>
            <p className="border-l border-white/20 pl-5">{how.scopes}</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="jak-dziala" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <style>{`
        .aw-fill{transform:scaleX(0);transition:transform .9s cubic-bezier(.4,0,.2,1)}
        .aw[data-lit="true"] .aw-fill{transform:scaleX(1)}
        .aw-model{transition:border-color .8s ease .6s}
        .aw[data-lit="true"] .aw-model{border-color:#67e8f9}
        @media (prefers-reduced-motion: reduce){.aw-fill{transition:none;transform:scaleX(1)}.aw-model{transition:none}}
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
      <p className="sr-only">{d.a11y}</p>
      <div
        ref={ref}
        data-lit={lit ? "true" : "false"}
        className="aw grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_3.5rem_minmax(0,6.5fr)_3.5rem_minmax(0,3fr)] lg:gap-y-0"
        data-reveal
      >
        {/* systems */}
        <div className={`self-center rounded-xl border border-white/15 bg-black ${AREA.systems}`}>
          <div className="border-b border-white/10 px-5 py-4">
            <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">{d.systemsLabel}</span>
            <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">{d.systemsNote}</span>
          </div>
          <ul className="divide-y divide-white/10">
            {d.systems.map((s) => (
              <li key={s.name} className="px-5 py-3.5">
                <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-white/85">{s.name}</span>
                <span className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="rounded border border-white/25 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/70">{s.route}</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/50">{s.access}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <Conn both className={AREA.c2} />
        <Conn both className={AREA.c3} />
        {/* the integration layer: a frame behind the rows (lg+) */}
        <div aria-hidden="true" className={`pointer-events-none hidden rounded-xl border border-white/25 lg:block ${AREA.frame}`} />
        <div className={`relative border-l border-white/25 pl-4 pr-1 pt-2 lg:border-l-0 lg:px-8 lg:pt-6 ${AREA.head}`}>
          <span className="inline-flex rounded-full border border-white/35 bg-brand-black px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/90">
            {d.layerLabel}
          </span>
        </div>
        {how.duties.map((duty, i) => (
          <div key={duty.tag} className={`relative border-l border-t border-white/25 pl-4 pr-1 py-6 lg:border-l-0 lg:border-t-white/10 lg:px-8 ${AREA.duty[i]}`}>
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{duty.tag}</span>
            <h3 className="mb-2 text-xl font-bold tracking-tight md:text-2xl">{duty.title}</h3>
            {/* the one sentence that stays visible: who decides on access (the rest is in the details below) */}
            {i === 0 && <p className="max-w-xl text-sm leading-relaxed text-white/70">{duty.desc}</p>}
          </div>
        ))}
        <div className={`relative border-l border-t border-dashed border-white/25 pl-4 pr-1 py-6 lg:border-l-0 lg:px-8 lg:pb-8 ${AREA.monitor}`}>
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{how.monitor.tag}</span>
          <h3 className="text-xl font-bold tracking-tight md:text-2xl">{how.monitor.title}</h3>
        </div>
        {/* model: outside the layer, reached through one responsibility only */}
        <Conn both className={AREA.c4} />
        <div className={`aw-model self-center rounded-xl border border-dashed border-white/35 bg-black p-5 ${AREA.model}`}>
          <span className="block font-mono text-[11px] uppercase tracking-[0.25em] text-white">{d.modelLabel}</span>
          <p className="mt-3 text-sm leading-relaxed text-white/60">{d.modelNote}</p>
        </div>
        {/* target: receives the verified result */}
        <Conn className={AREA.c6} />
        <div className={`self-center rounded-xl border border-white/25 bg-black p-5 ${AREA.target}`}>
          <span className="block font-mono text-[11px] uppercase tracking-[0.25em] text-white/90">{d.targetLabel}</span>
          <p className="mt-3 text-sm leading-relaxed text-white/60">{d.targetNote}</p>
        </div>
      </div>
    </section>
  );
};
export default ArchitectureWall;
import React, { useEffect, useRef, useState } from "react";
import { useService } from "../useService";
// "Where it applies": four example scenarios as paths. Each row has the task, then a line of
// actions on a hairline: open circle = the agent acts, cyan diamond = a decision point for a
// person (not every scenario has one at every step — it follows the permission policy),
// filled dot = a person acts. The result is always visible; the situation/mechanism text opens
// in a native <details>. When a row scrolls into view the markers light up in order once;
// under prefers-reduced-motion everything is simply shown. Not customer case studies.
const Marker = ({ kind, delay = 0 }) => {
  const style = { transitionDelay: `${delay}ms` };
  if (kind === "approval") {
    return <span aria-hidden="true" className="sp-mark sp-approval relative block h-3 w-3 rotate-45 border border-white/40 bg-brand-black" style={style} />;
  }
  if (kind === "human") {
    return <span aria-hidden="true" className="sp-mark relative block h-2.5 w-2.5 rounded-full border border-white/70 bg-white/80" style={style} />;
  }
  return <span aria-hidden="true" className="sp-mark relative block h-2.5 w-2.5 rounded-full border border-white/45 bg-brand-black" style={style} />;
};
const Row = ({ item, labels, legend, detailsLabel }) => {
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
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const n = item.steps.length;
  return (
    <li ref={ref} data-lit={lit ? "true" : "false"} className="sp-row group py-10 transition-colors duration-500 hover:bg-white/[0.015] md:py-14" data-reveal>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
        <div>
          <div className="mb-5 flex items-baseline gap-5">
            <span className="font-mono text-xs text-white/50">{item.n}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{item.tag}</span>
          </div>
          <h3 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">{item.title}</h3>
          <p className="max-w-sm text-base leading-relaxed text-white/70">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{labels.task}</span>
            {item.task}
          </p>
        </div>
        <div>
          <span className="mb-5 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{labels.path}</span>
          <ol
            className="sp-path relative grid grid-cols-1 gap-7 lg:gap-6 lg:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]"
            style={{ "--n": n }}
          >
            <span aria-hidden="true" className="absolute bottom-3 left-[5px] top-3 w-px bg-white/15 lg:hidden" />
            <span aria-hidden="true" className="absolute left-[5px] right-[5px] top-[5px] hidden h-px bg-white/15 lg:block" />
            {item.steps.map((s, i) => (
              <li
                key={s.t}
                data-kind={s.kind}
                className="sp-step relative pl-8 lg:pl-0 lg:pt-8"
                style={{ transitionDelay: `${i * 220}ms` }}
              >
                <span className="absolute left-0 top-[3px] lg:top-0">
                  <Marker kind={s.kind} delay={i * 220} />
                </span>
                <span
                  className={`mb-2 block font-mono text-[9px] uppercase tracking-[0.22em] ${
                    s.kind === "approval" ? "text-cyan-300/85" : "text-white/50"
                  }`}
                >
                  {legend[s.kind]}
                </span>
                <span className="block text-sm leading-snug text-white/85 lg:max-w-[11rem]">{s.t}</span>
              </li>
            ))}
          </ol>
          <p className="mt-7 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-white/55">{item.gate}</p>
          <p className="mt-8 border-t border-white/10 pt-5 text-base leading-relaxed text-white">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300/85">{labels.result}</span>
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
        </div>
      </div>
    </li>
  );
};
const ScenarioPaths = ({ data, slug }) => {
  const { c, ui } = useService(data);
  const { useCases } = c;
  return (
    <section id="zastosowania" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <style>{`
        .sp-row[data-lit="false"] .sp-mark{opacity:.35}
        .sp-row .sp-mark{transition:opacity .6s ease,background-color .6s ease,border-color .6s ease}
        .sp-row[data-lit="true"] .sp-approval{border-color:#67e8f9;background-color:#67e8f9}
        @media (prefers-reduced-motion: reduce){.sp-row .sp-mark{transition:none;opacity:1}}
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
      <ul aria-hidden="true" className="mb-8 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
        <li className="flex items-center gap-3"><Marker kind="agent" />{useCases.legend.agent}</li>
        <li className="flex items-center gap-3"><span className="block h-3 w-3 rotate-45 border border-cyan-300 bg-cyan-300" />{useCases.legend.approval}</li>
        <li className="flex items-center gap-3"><Marker kind="human" />{useCases.legend.human}</li>
      </ul>
      <ol className="divide-y divide-white/10 border-t border-white/10">
        {useCases.items.map((item) => (
          <Row key={item.n} item={item} labels={useCases.labels} legend={useCases.legend} detailsLabel={useCases.detailsLabel} />
        ))}
      </ol>
    </section>
  );
};
export default ScenarioPaths;
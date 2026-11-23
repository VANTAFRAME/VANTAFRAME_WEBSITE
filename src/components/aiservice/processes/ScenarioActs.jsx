import React from "react";
import { useService } from "../useService";
// "Where it applies": four example scenarios as three acts per row — PROBLEM / FLOW / RESULT —
// all visible without interaction. The flow is a short chain of mono pills (a vertical rail on
// small screens) followed by an example exception, shown as an example process configuration.
// The fuller situation and mechanism text opens in a native <details>. Static: no animation.
// Not customer case studies.
const Chain = ({ steps }) => (
  <ol className="relative flex flex-col gap-3">
    <span aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-px bg-white/15" />
    {steps.map((s) => (
      <li key={s} className="relative flex items-start gap-4">
        <span aria-hidden="true" className="relative z-10 mt-[7px] block h-[15px] w-[15px] shrink-0 rounded-full border border-white/40 bg-brand-black" />
        <span className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-white/80">{s}</span>
      </li>
    ))}
  </ol>
);
const Row = ({ item, labels, detailsLabel }) => (
  <li className="group py-10 transition-colors duration-500 hover:bg-white/[0.015] md:py-14" data-reveal>
    <div className="mb-8 flex items-baseline gap-5 md:mb-10">
      <span className="font-mono text-xs text-white/50">{item.n}</span>
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{item.tag}</span>
    </div>
    <h3 className="mb-10 max-w-3xl text-2xl font-bold tracking-tight md:text-4xl">{item.title}</h3>
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)_minmax(0,4fr)] lg:gap-14">
      <div className="border-t border-white/15 pt-5">
        <span className="mb-4 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{labels.problem}</span>
        <p className="text-base leading-relaxed text-white/70">{item.problemShort}</p>
      </div>
      <div className="border-t border-white/15 pt-5">
        <span className="mb-4 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{labels.flow}</span>
        <Chain steps={item.flow} />
        <p className="mt-6 border-l border-dashed border-white/35 pl-4 text-sm leading-relaxed text-white/65">
          <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.22em] text-white/50">{labels.exception}</span>
          {item.exception}
        </p>
      </div>
      <div className="border-t border-white/15 pt-5">
        <span className="mb-4 block font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300/85">{labels.result}</span>
        <p className="text-base leading-relaxed text-white">{item.effect}</p>
      </div>
    </div>
    <details className="group/d mt-8">
      <summary className="inline-flex cursor-pointer list-none items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/65 outline-none transition-colors hover:text-white focus-visible:text-white focus-visible:ring-1 focus-visible:ring-cyan-300/70 [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true" className="relative h-3 w-3 transition-transform duration-300 group-open/d:rotate-45">
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
        </span>
        {detailsLabel}
      </summary>
      <dl className="mt-5 grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
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
const ScenarioActs = ({ data, slug }) => {
  const { c, ui } = useService(data);
  const { useCases } = c;
  return (
    <section id="zastosowania" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
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
      <p className="mb-10 max-w-2xl border-l border-white/20 pl-5 text-sm leading-relaxed text-white/60 md:mb-12" data-reveal>
        {useCases.configNote}
      </p>
      <ol className="divide-y divide-white/10 border-t border-white/10">
        {useCases.items.map((item) => (
          <Row key={item.n} item={item} labels={useCases.labels} detailsLabel={useCases.detailsLabel} />
        ))}
      </ol>
    </section>
  );
};
export default ScenarioActs;
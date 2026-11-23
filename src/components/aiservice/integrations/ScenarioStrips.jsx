import React from "react";
import { useService } from "../useService";
// "Where it applies": four example scenarios as information strips. Each reads SOURCE →
// DATA → AI TASK → TARGET → RESULT in one band (five cells, hairline dividers, small arrows);
// the AI task is the one cell marked in cyan. All visible without interaction; the fuller
// situation and mechanism open in a native <details>. Static: no animation. Not customer
// case studies.
const Cell = ({ label, children, accent = false, first = false, last = false }) => (
  <div className={`relative py-5 lg:py-0 ${first ? "lg:pl-0 lg:pr-6" : "lg:px-6"} ${last ? "" : "lg:border-r lg:border-white/10"}`}>
    <span className={`mb-3 block font-mono text-[10px] uppercase tracking-[0.25em] ${accent ? "text-cyan-300/90" : "text-white/55"}`}>{label}</span>
    <p className={`text-sm leading-relaxed md:text-[15px] ${accent ? "text-white" : "text-white/75"}`}>{children}</p>
  </div>
);
const Row = ({ item, labels, detailsLabel }) => (
  <li className="group py-10 transition-colors duration-500 hover:bg-white/[0.015] md:py-12" data-reveal>
    <div className="mb-6 flex items-baseline gap-5">
      <span className="font-mono text-xs text-white/50">{item.n}</span>
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{item.tag}</span>
    </div>
    <h3 className="mb-8 max-w-3xl text-2xl font-bold tracking-tight md:text-3xl">{item.title}</h3>
    <div className="grid grid-cols-1 divide-y divide-white/10 border-y border-white/10 lg:grid-cols-5 lg:divide-y-0 lg:py-6">
      <Cell label={labels.source} first>{item.source}</Cell>
      <Cell label={labels.data}>{item.data}</Cell>
      <Cell label={labels.task} accent>
        {item.task}
      </Cell>
      <Cell label={labels.target}>{item.target}</Cell>
      <Cell label={labels.result} last>
        {item.effect}
      </Cell>
    </div>
    <details className="group/d mt-6">
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
const ScenarioStrips = ({ data, slug }) => {
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
      <ol className="divide-y divide-white/10 border-t border-white/10">
        {useCases.items.map((item) => (
          <Row key={item.n} item={item} labels={useCases.labels} detailsLabel={useCases.detailsLabel} />
        ))}
      </ol>
    </section>
  );
};
export default ScenarioStrips;
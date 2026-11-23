import React from "react";
import { useService } from "../useService";
// "Where it applies": four example scenarios that start from the employee's question, set as
// a large quote. Beside it the three facts that matter — the sources, an example result, and
// how a person can verify it — always visible; the fuller situation and mechanism open in a
// native <details>. Static, no animation, no outcome claims. Not customer case studies.
const Row = ({ item, labels, detailsLabel }) => (
  <li className="group relative py-12 transition-colors duration-500 hover:bg-white/[0.015] md:py-16" data-reveal>
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div className="relative">
        <div className="mb-5 flex items-baseline gap-5">
          <span className="font-mono text-xs text-white/50">{item.n}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{item.tag}</span>
          <span className="text-sm text-white/60">{item.title}</span>
        </div>
        <span aria-hidden="true" className="pointer-events-none absolute -left-1 top-6 select-none text-[7rem] font-black leading-none text-white/[0.05] md:text-[9rem]">
          “
        </span>
        <span className="relative mb-3 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{labels.question}</span>
        <p className="relative text-2xl font-bold leading-snug tracking-tight md:text-3xl">„{item.question}”</p>
      </div>
      <dl className="divide-y divide-white/10 border-t border-white/15">
        <div className="grid grid-cols-1 gap-2 py-4 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-8">
          <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55 md:pt-1">{labels.sources}</dt>
          <dd>
            <ul className="flex flex-wrap gap-2">
              {item.sources.map((s) => (
                <li key={s} className="rounded-md border border-white/20 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">
                  {s}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-2 py-4 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-8">
          <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300/85 md:pt-1">{labels.result}</dt>
          <dd className="max-w-xl text-base leading-relaxed text-white">{item.result}</dd>
        </div>
        <div className="grid grid-cols-1 gap-2 py-4 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-8">
          <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55 md:pt-1">{labels.verify}</dt>
          <dd className="max-w-xl text-base leading-relaxed text-white/70">{item.verify}</dd>
        </div>
      </dl>
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
const QuestionScenarios = ({ data, slug }) => {
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
export default QuestionScenarios;
import React from "react";
import { useService } from "../useService";
// "How we work": a vertical spine. On lg the stage number sits on a central line; to its left
// the stage and what the client receives (emphasised), to its right how quality is checked
// (muted). Below lg the spine runs down the left edge and the three parts stack. Plain
// typography and hairlines — no panel, no statuses, nothing that implies project progress —
// followed by a note that the scope of the stages depends on the sources and the company.
const SpineProcess = ({ data, slug }) => {
  const { c, ui } = useService(data);
  const { process } = c;
  const L = process.labels;
  return (
    <section id="proces" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <div className="mb-14 md:mb-20" data-reveal>
        <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{ui.process}</p>
        <h2 className="text-3xl font-black leading-[1.05] tracking-tight md:text-5xl xl:text-6xl">
          {process.heading[0]}
          {" "}<br />
          {process.heading[1]}
        </h2>
      </div>
      <ol className="relative">
        <span aria-hidden="true" className="absolute bottom-0 left-[17px] top-2 w-px bg-white/15 lg:left-1/2 lg:-translate-x-1/2" />
        {process.steps.map((step) => (
          <li
            key={step.n}
            className="relative grid grid-cols-1 gap-6 pb-14 pl-14 last:pb-0 lg:grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] lg:gap-0 lg:pl-0"
            data-reveal
          >
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-brand-black font-mono text-[10px] text-white/80 lg:left-1/2 lg:-translate-x-1/2"
            >
              {step.n}
            </span>
            <div className="lg:col-start-1 lg:pr-10 lg:text-right">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{step.tag}</span>
              <h3 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">{step.title}</h3>
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300/85">{L.gets}</span>
              <p className="text-base leading-relaxed text-white lg:ml-auto lg:max-w-md">{step.gets}</p>
            </div>
            <div className="lg:col-start-3 lg:pl-10 lg:pt-1">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{L.checks}</span>
              <p className="max-w-md text-base leading-relaxed text-white/65">{step.checks}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-16 max-w-2xl border-l border-white/20 pl-5 text-sm leading-relaxed text-white/60 md:text-base" data-reveal>
        {process.scopeNote}
      </p>
    </section>
  );
};
export default SpineProcess;
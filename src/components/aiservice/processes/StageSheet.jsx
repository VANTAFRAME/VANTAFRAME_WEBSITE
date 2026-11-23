import React from "react";
import { useService } from "../useService";
// "How we work": five stages, each as a short spec — number and stage on the left, then two
// labelled lines: what you receive and what we check. Plain editorial rows with the site's
// ghost numerals; no table, no panel, nothing that looks like live progress. Static.
const StageSheet = ({ data, slug }) => {
  const { c, ui } = useService(data);
  const { process } = c;
  const L = process.labels;
  return (
    <section id="proces" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <div className="mb-12 md:mb-16" data-reveal>
        <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{ui.process}</p>
        <h2 className="text-3xl font-black leading-[1.05] tracking-tight md:text-5xl xl:text-6xl">
          {process.heading[0]}
          {" "}<br />
          {process.heading[1]}
        </h2>
      </div>
      <ol className="divide-y divide-white/10 border-y border-white/10">
        {process.steps.map((step) => (
          <li key={step.n} className="group relative overflow-hidden py-9 transition-colors duration-500 hover:bg-white/[0.015] md:py-12" data-reveal>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-2 top-1/2 -translate-y-1/2 select-none text-[clamp(6rem,18vw,15rem)] font-black leading-none text-white/[0.025] transition-colors duration-500 group-hover:text-white/[0.05]"
            >
              {step.n}
            </span>
            <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
              <div className="lg:pl-[clamp(4rem,9vw,8rem)]">
                <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
                  {step.n} / {step.tag}
                </span>
                <h3 className="text-2xl font-bold tracking-tight md:text-3xl">{step.title}</h3>
              </div>
              <dl className="divide-y divide-white/10 border-t border-white/15">
                <div className="grid grid-cols-1 gap-2 py-4 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-8">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300/85 md:pt-1">{L.gets}</dt>
                  <dd className="max-w-2xl text-base leading-relaxed text-white">{step.gets}</dd>
                </div>
                <div className="grid grid-cols-1 gap-2 py-4 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-8">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55 md:pt-1">{L.checks}</dt>
                  <dd className="max-w-2xl text-base leading-relaxed text-white/70">{step.checks}</dd>
                </div>
              </dl>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};
export default StageSheet;
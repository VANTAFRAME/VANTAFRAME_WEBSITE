import React from "react";
import { useService } from "../useService";
// "How we work": five stages, each shown by what the client receives. On xl the stages are
// five columns hanging from one hairline (marker, stage, what we do in a line, then a
// separated "you receive" block); below xl they stack on a vertical rail. No table, no
// ladder: the stages are equal, and nothing implies full autonomy is the goal.
const Doc = () => (
  <svg className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300/85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
);
const ProcessDeliverables = ({ data, slug }) => {
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
      <ol className="relative grid grid-cols-1 gap-12 xl:grid-cols-5 xl:gap-0">
        <span aria-hidden="true" className="absolute bottom-0 left-[17px] top-2 w-px bg-white/12 xl:hidden" />
        <span aria-hidden="true" className="absolute left-0 right-0 top-[17px] hidden h-px bg-white/15 xl:block" />
        {process.steps.map((step, i) => (
          <li key={step.n} className={`relative pl-14 xl:pl-0 xl:pr-8 ${i > 0 ? "xl:pl-8 xl:border-l xl:border-white/10 xl:mt-0" : ""}`} data-reveal>
            <span className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-brand-black font-mono text-[10px] text-white/75 xl:left-auto xl:static xl:mb-8">
              {step.n}
            </span>
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{step.tag}</span>
            <h3 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">{step.title}</h3>
            <p className="mb-6 text-sm leading-relaxed text-white/65">
              <span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.22em] text-white/50">{L.does}</span>
              {step.does}
            </p>
            <div className="border-t border-white/15 pt-4">
              <span className="mb-3 block font-mono text-[9px] uppercase tracking-[0.22em] text-cyan-300/85">{L.gets}</span>
              <p className="flex gap-3 text-sm leading-relaxed text-white">
                <Doc />
                <span>{step.gets}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};
export default ProcessDeliverables;
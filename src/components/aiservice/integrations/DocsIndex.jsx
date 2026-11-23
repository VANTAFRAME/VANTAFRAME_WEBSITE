import React from "react";
import { useService } from "../useService";
// "How we work": a technical index of the project's documentation. Each stage is a line of
// the index — the deliverable as the title, a dotted leader, the stage number at the right
// like a page number — with a short description of the work underneath. Typography, hairlines
// and numbering only: no panel, no statuses, nothing that suggests live progress. Static.
const DocsIndex = ({ data, slug }) => {
  const { c, ui } = useService(data);
  const { process } = c;
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
      <div className="max-w-5xl">
        <div className="mb-2 flex items-center gap-4" data-reveal>
          <span className="rounded-full border border-white/30 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/85">{process.indexLabel}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
        </div>
        <ol className="border-t border-white/10">
          {process.steps.map((step) => (
            <li key={step.n} className="border-b border-white/10 py-8 md:py-10" data-reveal>
              <div className="flex items-baseline gap-4">
                <span className="shrink-0 font-mono text-xs text-white/50">{step.n}</span>
                <h3 className="text-xl font-bold tracking-tight md:text-3xl">{step.title}</h3>
                <span aria-hidden="true" className="mb-1.5 hidden min-w-[2rem] flex-1 self-end border-b border-dotted border-white/25 md:block" />
                <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 md:block">{step.tag}</span>
              </div>
              <span className="mt-3 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 md:hidden">{step.tag}</span>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/65 md:pl-[2.25rem]">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
export default DocsIndex;
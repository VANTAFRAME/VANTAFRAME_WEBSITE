import React from "react";
import { useService } from "../useService";
// "How we work": five stages as a list. The stage title and what the client receives are always
// visible; only the extra text about how it is checked sits in a native <details> under each
// stage. No progress animation, nothing that implies a real project is under way.
const ExpandableProcess = ({ data, slug }) => {
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
        {process.steps.map((s) => (
          <li key={s.n} className="py-8 md:py-10" data-reveal>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
              <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] md:grid-cols-[3rem_minmax(0,1fr)]">
                <span className="pt-2 font-mono text-xs text-white/50">{s.n}</span>
                <div>
                  <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{s.tag}</span>
                  <h3 className="text-2xl font-bold tracking-tight md:text-3xl">{s.title}</h3>
                </div>
              </div>
              <div className="pl-[2.25rem] md:pl-[3rem] lg:pl-0">
                <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300/85">{L.gets}</span>
                <p className="max-w-2xl text-base leading-relaxed text-white">{s.gets}</p>
                <details className="group/d mt-5">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/65 outline-none transition-colors hover:text-white focus-visible:text-white focus-visible:ring-1 focus-visible:ring-cyan-300/70 [&::-webkit-details-marker]:hidden">
                    <span aria-hidden="true" className="relative h-3 w-3 transition-transform duration-300 group-open/d:rotate-45">
                      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
                    </span>
                    {L.more}
                  </summary>
                  <p className="mt-4 max-w-2xl border-l border-white/20 pl-4 text-sm leading-relaxed text-white/70">{s.more}</p>
                </details>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-12 max-w-2xl border-l border-white/20 pl-5 text-sm leading-relaxed text-white/60 md:text-base" data-reveal>
        {process.scopeNote}
      </p>
    </section>
  );
};
export default ExpandableProcess;
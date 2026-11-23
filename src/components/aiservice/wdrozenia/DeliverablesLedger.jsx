import React from "react";
import { useService } from "../useService";
// "How we work": a ledger — one row per stage with three columns: the stage, what we do
// (one line) and, emphasised, what the client receives. Hairlines, mono column labels and
// ghost numerals as on the hub; on small screens the columns stack and the labels sit
// above each value so nothing depends on the header row.
const DocIcon = () => (
  <svg className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300/85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
);
const DeliverablesLedger = ({ data, slug, embedded = false }) => {
  const { c, ui } = useService(data);
  const { process } = c;
  const cols = process.columns;
  const grid = "lg:grid lg:grid-cols-[minmax(0,4fr)_minmax(0,4fr)_minmax(0,5fr)] lg:gap-10";
  // `embedded`: rendered inside another section (the loop schematic), which owns the <section>
  // element and the only <h2>; the ledger then starts directly with its column header row.
  const Wrapper = embedded ? "div" : "section";
  const wrapperProps = embedded ? { className: "mt-20 md:mt-28" } : { id: "proces", className: "px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10" };
  return (
    <Wrapper {...wrapperProps}>
      {!embedded && (
        <div className="mb-12 md:mb-16" data-reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55 mb-6">{ui.process}</p>
          <h2 className="text-3xl md:text-5xl xl:text-6xl font-black tracking-tight leading-[1.05]">
            {process.heading[0]}
            {" "}<br />
            {process.heading[1]}
          </h2>
        </div>
      )}
      <div className="border-t border-white/10">
        <div aria-hidden="true" className={`hidden border-b border-white/10 px-2 py-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55 ${grid}`}>
          <span>{cols.step}</span>
          <span>{cols.does}</span>
          <span className="text-cyan-300/85">{cols.gets}</span>
        </div>
        <ol className="divide-y divide-white/10">
          {process.steps.map((step) => (
            <li key={step.n} className="group relative overflow-hidden px-2 py-8 transition-colors duration-500 hover:bg-white/[0.015] md:py-10" data-reveal>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 select-none text-[clamp(4rem,12vw,9rem)] font-black leading-none text-white/[0.025] transition-colors duration-500 group-hover:text-white/[0.06]"
              >
                {step.n}
              </span>
              <div className={`relative flex flex-col gap-6 ${grid} lg:items-start`}>
                <div className="flex gap-5">
                  <span className="w-8 shrink-0 pt-2 font-mono text-xs text-white/50">{step.n}</span>
                  <div>
                    <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{step.tag}</span>
                    <h3 className="text-2xl font-bold tracking-tight transition-transform duration-500 group-hover:translate-x-1 md:text-3xl">{step.title}</h3>
                  </div>
                </div>
                <p className="pl-[3.25rem] text-base leading-relaxed text-white/70 lg:pl-0 lg:pt-2">
                  <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/55 lg:hidden">{cols.does}</span>
                  {step.does}
                </p>
                <div className="ml-[3.25rem] lg:ml-0">
                  <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300/85 lg:hidden">{cols.gets}</span>
                  <p className="flex gap-3 rounded-md border border-white/15 bg-black/40 px-4 py-3.5 text-base leading-relaxed text-white">
                    <DocIcon />
                    <span>{step.gets}</span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Wrapper>
  );
};
export default DeliverablesLedger;
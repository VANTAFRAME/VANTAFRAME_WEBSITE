import React from "react";
import { useService } from "../useService";
// "Where it applies": four example scenarios, each as a sheet in the spirit of a document form:
// a mono header strip (type of document and way in), then labelled lines — DOCUMENT, READ, WE
// CHECK, TO THE SYSTEM, WHEN A PERSON STEPS IN. Short and always visible; the last line is set
// apart with a dashed rule because it is where responsibility stays with people. Static: no
// animation, not a customer case.
const Sheet = ({ item, labels }) => {
  const rows = [
    [labels.document, item.document],
    [labels.read, item.read],
    [labels.check, item.check],
    [labels.system, item.system],
  ];
  return (
    <li className="group py-10 transition-colors duration-500 hover:bg-white/[0.015] md:py-14" data-reveal>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
        <div>
          <div className="mb-5 flex items-baseline gap-5">
            <span className="font-mono text-xs text-white/50">{item.n}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{item.tag}</span>
          </div>
          <h3 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">{item.title}</h3>
          <p className="max-w-sm text-sm leading-relaxed text-white/60">
            <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.22em] text-white/50">{labels.situation}</span>
            {item.situation}
          </p>
        </div>
        <div className="min-w-0 rounded-md border border-white/20 bg-white/[0.02]">
          <div className="border-b border-white/15 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">{item.channel}</div>
          <dl className="divide-y divide-dashed divide-white/15">
            {rows.map(([label, text]) => (
              <div key={label} className="grid grid-cols-1 gap-1.5 px-5 py-3.5 md:grid-cols-[8.5rem_minmax(0,1fr)] md:gap-6">
                <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 md:pt-1">{label}</dt>
                <dd className="text-sm leading-relaxed text-white/80 md:text-[15px]">{text}</dd>
              </div>
            ))}
            <div className="grid grid-cols-1 gap-1.5 border-t border-white/30 px-5 py-4 md:grid-cols-[8.5rem_minmax(0,1fr)] md:gap-6">
              <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/90 md:pt-1">{labels.human}</dt>
              <dd className="text-sm leading-relaxed text-white md:text-[15px]">{item.human}</dd>
            </div>
          </dl>
        </div>
      </div>
    </li>
  );
};
const DocumentSheets = ({ data, slug }) => {
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
          <Sheet key={item.n} item={item} labels={useCases.labels} />
        ))}
      </ol>
    </section>
  );
};
export default DocumentSheets;
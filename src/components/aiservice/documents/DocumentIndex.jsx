import React from "react";
import { useService } from "../useService";
import Disclosure from "../Disclosure";
import Segments from "./Segments";
// "What we process": a technical index of five document families. Each row gives the family,
// a plain-language line, the fields typically read from it and a short note on how it can be
// processed (fields and method sit in a native <details> per family) — never one method for a whole category (templates, rules, OCR and AI combine).
// The key message "not every document needs AI" sits above the index. Static, no animation.
const DocumentIndex = ({ data, slug }) => {
  const { c, ui } = useService(data);
  const { capabilities } = c;
  const grid = "lg:grid lg:grid-cols-[minmax(0,4fr)_minmax(0,7.5fr)] lg:gap-12";
  return (
    <section id="co-wdrazamy" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <div className="mb-12 grid grid-cols-1 items-end gap-8 md:mb-16 lg:grid-cols-[1.2fr_1fr] lg:gap-16" data-reveal>
        <div>
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{ui.capabilities}</p>
          <h2 className="text-3xl font-black leading-[1.05] tracking-tight md:text-5xl xl:text-6xl">
            {capabilities.heading[0]}
            {" "}<br />
            {capabilities.heading[1]}
          </h2>
        </div>
        <p className="max-w-xl text-base leading-relaxed text-white/65 md:text-lg">{capabilities.intro}</p>
      </div>
      <div className="mb-14 grid grid-cols-1 gap-4 border-y border-white/10 py-8 md:mb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-center lg:gap-16" data-reveal>
        <p className="text-2xl font-black uppercase leading-[1.1] tracking-tight md:text-4xl">{capabilities.notAi}</p>
        <p className="max-w-xl text-base leading-relaxed text-white/70">{capabilities.notAiText}</p>
      </div>
      <div className="mb-2 flex items-center gap-4" data-reveal>
        <span className="rounded-full border border-white/30 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/85">{capabilities.indexLabel}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
      </div>
      <ol className="divide-y divide-white/10 border-t border-white/10 lg:border-t-0">
        {capabilities.families.map((f) => (
          <li key={f.n} className={`group py-8 transition-colors duration-500 hover:bg-white/[0.015] md:py-10 ${grid}`} data-reveal>
            <div className="mb-6 grid grid-cols-[2.25rem_minmax(0,1fr)] md:grid-cols-[3rem_minmax(0,1fr)] lg:mb-0">
              <span className="pt-2 font-mono text-xs text-white/50">{f.n}</span>
              <div>
                <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{f.tag}</span>
                <h3 className="mb-3 text-2xl font-bold tracking-tight md:text-3xl">{f.title}</h3>
                <p className="max-w-md text-base leading-relaxed text-white/65">{f.desc}</p>
              </div>
            </div>
            <div className="pl-[2.25rem] md:pl-[3rem] lg:pl-0 lg:pt-1">
              <Disclosure label={capabilities.detailsLabel} className="[&>div]:mt-5">
                <span className="mb-3 block font-mono text-[9px] uppercase tracking-[0.22em] text-white/50">{capabilities.columns.fields}</span>
                <ul className="mb-6 flex flex-wrap gap-2">
                  {f.fields.map((field) => (
                    <li key={field} className="rounded-md border border-white/20 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">
                      {field}
                    </li>
                  ))}
                </ul>
                <span className="mb-3 block font-mono text-[9px] uppercase tracking-[0.22em] text-white/50">{capabilities.columns.method}</span>
                <p className="max-w-md border-l border-dashed border-white/30 pl-4 text-sm leading-relaxed text-white/70">{f.how}</p>
              </Disclosure>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-10 max-w-2xl border-l border-white/20 pl-5 text-sm leading-relaxed text-white/60 md:text-base" data-reveal>
        <Segments parts={capabilities.assistantNote} />
      </p>
    </section>
  );
};
export default DocumentIndex;
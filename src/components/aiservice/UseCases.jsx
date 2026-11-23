import React from "react";
import { useService } from "./useService";
// Business scenarios as editorial rows: number + tag + title on the left, then the three
// facts of the scenario (situation → mechanism → operational effect) as hairline columns.
const UseCases = ({ data, slug }) => {
  const { c, ui } = useService(data);
  const { useCases } = c;
  return (
    <section id="zastosowania" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <div className="mb-14 md:mb-20" data-reveal>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55 mb-6">{ui.useCases}</p>
        <h2 className="text-3xl md:text-5xl xl:text-6xl font-black tracking-tight leading-[1.05] max-w-4xl">
          {useCases.heading[0]}
          {" "}<br />
          {useCases.heading[1]}
        </h2>
      </div>
      <ol className="border-t border-white/10 divide-y divide-white/10">
        {useCases.items.map((item) => (
          <li key={item.n} className="group py-9 md:py-12 transition-colors duration-500 hover:bg-white/[0.015]" data-reveal>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-8 lg:gap-14">
              <div className="flex gap-5 md:gap-6">
                <span className="font-mono text-xs text-white/50 pt-2 w-8 shrink-0">{item.n}</span>
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 mb-3">{item.tag}</span>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{item.title}</h3>
                </div>
              </div>
              <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                {[
                  [ui.situation, item.problem],
                  [ui.mechanism, item.mechanism],
                  [ui.effect, item.effect],
                ].map(([label, text], k) => (
                  <div key={label} className="border-t border-white/15 pt-4">
                    <dt className={`font-mono text-[10px] uppercase tracking-[0.25em] mb-3 ${k === 2 ? "text-cyan-300/80" : "text-white/50"}`}>{label}</dt>
                    <dd className="text-sm md:text-[15px] text-white/70 leading-relaxed">{text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};
export default UseCases;
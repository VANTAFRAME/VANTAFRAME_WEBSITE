import React from "react";
import { useService } from "../useService";
// "What we build into agents": the agent is shown as a model inside a system. A small MODEL
// box sits on top of a window frame (same frame as the other diagrams); hairlines drop from
// it into three columns — EXECUTES / LIMITS / SHOWS — holding the six technical areas. The
// point of the picture: the model is one box, the rest is integration, state, permissions and
// monitoring. Static, no animation; below lg the columns simply stack.
const Item = ({ item }) => (
  <li className="group relative py-6 transition-colors duration-500 hover:bg-white/[0.02]" data-reveal>
    <div className="grid grid-cols-[2.25rem_minmax(0,1fr)]">
      <span className="pt-1.5 font-mono text-xs text-white/50">{item.n}</span>
      <div>
        <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 transition-colors duration-500 group-hover:text-cyan-300/80">
          {item.tag}
        </span>
        <h3 className="mb-2 text-xl font-bold tracking-tight md:text-2xl">{item.title}</h3>
        <p className="text-sm leading-relaxed text-white/65 md:text-[15px]">{item.desc}</p>
      </div>
    </div>
  </li>
);
const AnatomyColumns = ({ data, slug }) => {
  const { c, ui } = useService(data);
  const { capabilities } = c;
  return (
    <section id="co-wdrazamy" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <div className="mb-14 grid grid-cols-1 items-end gap-8 md:mb-16 lg:grid-cols-[1.4fr_1fr] lg:gap-16" data-reveal>
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
      <div className="overflow-hidden rounded-xl border border-white/10 bg-black" data-reveal>
        <div className="flex items-center gap-3 border-b border-white/8 bg-black/40 px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="ml-2 truncate font-mono text-[9px] tracking-wider text-white/55">{capabilities.frameLabel}</span>
        </div>
        <div className="px-6 pb-10 pt-8 md:px-10 lg:px-12">
          {/* the model: one box among many */}
          <div className="relative mx-auto mb-8 flex w-fit flex-col items-center text-center lg:mb-0">
            <span className="rounded-md border border-white/35 bg-brand-black px-8 py-3 font-mono text-xs uppercase tracking-[0.3em] text-white">
              {capabilities.modelLabel}
            </span>
            <span className="mt-3 max-w-[16rem] font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-white/55">
              {capabilities.modelNote}
            </span>
            <span aria-hidden="true" className="mt-3 hidden h-8 w-px bg-white/25 lg:block" />
          </div>
          <div className="relative grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-3">
            <span aria-hidden="true" className="absolute left-[calc(16.666%-16px)] right-[calc(16.666%-16px)] top-0 hidden h-px bg-white/25 lg:block" />
            {capabilities.groups.map((g) => (
              <div key={g.tag} className="relative lg:pt-8">
                <span aria-hidden="true" className="absolute left-1/2 top-0 hidden h-8 w-px bg-white/25 lg:block" />
                <div className="mb-2 flex items-baseline gap-4 border-b border-white/15 pb-4">
                  <span className="rounded-full border border-white/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/85">
                    {g.tag}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">{g.lead}</span>
                </div>
                <ol className="divide-y divide-white/10">
                  {g.items.map((item) => (
                    <Item key={item.n} item={item} />
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default AnatomyColumns;
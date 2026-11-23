import React from "react";
import { HUB } from "../../data/aiServices/hub";
import { useService } from "./useService";
// Internal links to the neighbouring services (the pairs come from the content file,
// each with a one-line reason) plus a way back to the hub. Real links, no hover needed.
const Related = ({ data, slug }) => {
  const { lang, c, ui } = useService(data);
  const { related } = c;
  return (
    <section id="powiazane" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-28 border-t border-white/10">
      <div className="mb-10 md:mb-14" data-reveal>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55 mb-6">{ui.related}</p>
        <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-[1.1] max-w-3xl">{related.heading}</h2>
      </div>
      <div className="border-t border-white/10 divide-y divide-white/10">
        {related.items.map((item) => {
          const hub = HUB[item.slug];
          if (!hub) return null;
          const name = (hub[lang] || hub.pl).title;
          return (
            <a
              key={item.slug}
              href={hub.path}
              className="group relative flex items-center gap-5 md:gap-10 py-7 md:py-9 outline-none transition-colors duration-500 hover:bg-white/[0.02] focus-visible:bg-white/[0.04] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-cyan-300/70"
              data-reveal
            >
              <span className="font-mono text-xs text-white/50 w-8 shrink-0">{hub.n}</span>
              <span className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-x-10 gap-y-2 items-baseline">
                <span className="text-2xl md:text-4xl font-bold tracking-tight transition-transform duration-500 group-hover:translate-x-2">{name}</span>
                <span className="text-sm md:text-base text-white/65 leading-relaxed">{item.why}</span>
              </span>
              <svg className="h-4 w-4 shrink-0 text-white/50 transition-all duration-500 group-hover:translate-x-1 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </a>
          );
        })}
        <a
          href="/wdrozenia-ai/"
          className="group flex items-center gap-5 md:gap-10 py-6 outline-none transition-colors duration-500 hover:bg-white/[0.02] focus-visible:bg-white/[0.04] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-cyan-300/70"
          data-reveal
        >
          <span className="w-8 shrink-0" />
          <span className="flex-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white/65 group-hover:text-white transition-colors">{ui.seeAll}</span>
          <svg className="h-4 w-4 shrink-0 text-white/50 transition-all duration-500 group-hover:translate-x-1 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M5 12h14m-7-7l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
};
export default Related;
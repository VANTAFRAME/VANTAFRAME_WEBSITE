import React from "react";
import { useService } from "../useService";
import { HUB } from "../../../data/aiServices/hub";
// "What we build into assistants": the problem first (knowledge scattered across documents
// and systems), one honest paragraph on chatbot vs assistant (different roles, not levels)
// with a link to agents, then four functions set as big words in a single row with hairline
// dividers — SEARCHES / ANSWERS / SHOWS SOURCES / SIGNALS A LACK OF KNOWLEDGE. No cards, no
// numbering, no animation. The functions are described as designed behaviour, not guarantees.
const Arrow = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14m-6-6l6 6-6 6" />
  </svg>
);
const CapabilityWords = ({ data, slug }) => {
  const { c, ui } = useService(data);
  const { capabilities } = c;
  const d = capabilities.distinction;
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
      <p className="mb-14 max-w-3xl border-l border-white/20 pl-5 text-base leading-relaxed text-white/65 md:mb-16" data-reveal>
        {d.before}
        <a
          href={HUB[d.slug].path}
          className="text-white underline decoration-white/35 underline-offset-4 outline-none transition-colors hover:decoration-white focus-visible:decoration-cyan-300"
        >
          {d.linkLabel}
        </a>
        {d.after}
      </p>
      <ul className="grid grid-cols-1 border-y border-white/10 md:grid-cols-2 xl:grid-cols-4">
        {capabilities.functions.map((f, i) => (
          <li
            key={f.tag}
            className={`group flex flex-col p-7 transition-colors duration-500 hover:bg-white/[0.015] md:p-9 ${
              i > 0 ? "border-t border-white/10 md:border-t-0" : ""
            } ${i % 2 === 1 ? "md:border-l md:border-white/10" : ""} ${i >= 2 ? "md:border-t md:border-white/10 xl:border-t-0" : ""} ${
              i > 0 ? "xl:border-l xl:border-white/10" : ""
            }`}
            data-reveal
          >
            <span className="mb-6 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{f.tag}</span>
            <h3 className="mb-6 text-2xl font-black uppercase leading-[1.05] tracking-tight md:text-3xl">{f.word}</h3>
            <p className="flex-1 text-base leading-relaxed text-white/65">{f.desc}</p>
            {f.link && (
              <a
                href={HUB[f.link.slug].path}
                className="mt-6 inline-flex w-fit items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/65 outline-none transition-colors hover:text-white focus-visible:text-white focus-visible:ring-1 focus-visible:ring-cyan-300/70"
              >
                {f.link.label}
                <Arrow />
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};
export default CapabilityWords;
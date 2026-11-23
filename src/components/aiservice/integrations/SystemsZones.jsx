import React from "react";
import { useService } from "../useService";
import { HUB } from "../../../data/aiServices/hub";
// "What we integrate": two zones side by side. On the left, the company's systems and data
// as five hairline rows (category, a plain-language line, mono tags of typical data). On the
// right, the AI models and services as their own window (the same frame as the other
// diagrams) — a separate component that sits behind the integration layer. The categories
// are examples, not a list of ready-made or completed integrations; the note says so. Static,
// no animation.
const Arrow = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14m-6-6l6 6-6 6" />
  </svg>
);
const Chip = ({ children }) => (
  <li className="rounded-md border border-white/20 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">{children}</li>
);
const SystemsZones = ({ data, slug }) => {
  const { c, ui } = useService(data);
  const { capabilities } = c;
  const d = capabilities.distinction;
  return (
    <section id="co-wdrazamy" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <div className="mb-12 grid grid-cols-1 items-end gap-8 md:mb-16 lg:grid-cols-[1.4fr_1fr] lg:gap-16" data-reveal>
        <div>
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{ui.capabilities}</p>
          <h2 className="text-3xl font-black leading-[1.05] tracking-tight md:text-5xl xl:text-6xl">
            {capabilities.heading[0]}
            {" "}<br />
            {capabilities.heading[1]}
          </h2>
        </div>
        <div className="max-w-xl space-y-4 text-base leading-relaxed text-white/65 md:text-lg">
          <p>{capabilities.intro}</p>
          <p className="text-base text-white/60">
            {d.before}
            <a
              href={HUB[d.slug].path}
              className="text-white underline decoration-white/35 underline-offset-4 outline-none transition-colors hover:decoration-white focus-visible:decoration-cyan-300"
            >
              {d.linkLabel}
            </a>
            {d.after}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          <div className="mb-2 flex items-center gap-4" data-reveal>
            <span className="rounded-full border border-white/30 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/85">
              {capabilities.systemsLabel}
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
          </div>
          <ol className="divide-y divide-white/10 border-t border-white/10">
            {capabilities.systems.map((s) => (
              <li key={s.n} className="group py-7 transition-colors duration-500 hover:bg-white/[0.015] md:py-8" data-reveal>
                <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] md:grid-cols-[3rem_minmax(0,1fr)]">
                  <span className="pt-2 font-mono text-xs text-white/50">{s.n}</span>
                  <div>
                    <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{s.tag}</span>
                    <h3 className="mb-3 text-2xl font-bold tracking-tight md:text-3xl">{s.title}</h3>
                    <p className="mb-4 max-w-xl text-base leading-relaxed text-white/65">{s.desc}</p>
                    <ul aria-hidden="true" className="flex flex-wrap gap-2">
                      {s.chips.map((chip) => (
                        <Chip key={chip}>{chip}</Chip>
                      ))}
                    </ul>
                    {s.link && (
                      <a
                        href={HUB[s.link.slug].path}
                        className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/65 outline-none transition-colors hover:text-white focus-visible:text-white focus-visible:ring-1 focus-visible:ring-cyan-300/70"
                      >
                        {s.link.label}
                        <Arrow />
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div data-reveal>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black lg:sticky lg:top-28">
            <div className="flex items-center gap-3 border-b border-white/8 bg-black/40 px-4 py-3">
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="ml-2 truncate font-mono text-[9px] tracking-wider text-white/55">{capabilities.ai.label}</span>
            </div>
            <div className="p-7 md:p-9">
              <span aria-hidden="true" className="mb-6 block h-2.5 w-2.5 rotate-45 border border-cyan-300" />
              <h3 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">{capabilities.ai.title}</h3>
              <p className="mb-6 text-base leading-relaxed text-white/70">{capabilities.ai.text}</p>
              <ul aria-hidden="true" className="flex flex-wrap gap-2">
                {capabilities.ai.chips.map((chip) => (
                  <Chip key={chip}>{chip}</Chip>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-12 max-w-2xl border-l border-white/20 pl-5 text-sm leading-relaxed text-white/60 md:mt-16 md:text-base" data-reveal>
        {capabilities.note}
      </p>
    </section>
  );
};
export default SystemsZones;
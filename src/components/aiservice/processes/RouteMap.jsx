import React, { useEffect, useRef, useState } from "react";
import { useService } from "../useService";
import { HUB } from "../../../data/aiServices/hub";
// "What we automate": a map of routes. One band says what starts every process (the event),
// then three groups — we move data / hand over cases / prepare documents — each made of rows:
// title and a plain-language description on the left, and the route on the right as mono
// pills joined by a line: SOURCE → TARGET (↔ when both directions are kept in sync).
// When a row scrolls into view the connector draws once and the target pills turn cyan;
// under prefers-reduced-motion everything is simply shown. Nothing depends on motion.
const Arrow = ({ flip = false }) => (
  <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 shrink-0 ${flip ? "rotate-180" : ""}`} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6l6 6-6 6" />
  </svg>
);
const Pill = ({ children, target }) => (
  <span
    className={`rm-pill inline-flex items-center rounded-md border bg-brand-black px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] ${
      target ? "rm-target border-white/25 text-white/90" : "border-white/20 text-white/70"
    }`}
  >
    {children}
  </span>
);
const Route = ({ item }) => (
  <div className="flex flex-wrap items-center gap-x-3 gap-y-3 lg:flex-nowrap" aria-hidden="true">
    <div className="flex flex-wrap gap-2 lg:w-[9.5rem] lg:flex-col lg:items-stretch">
      {item.from.map((f) => (
        <Pill key={f}>{f}</Pill>
      ))}
    </div>
    <span className="relative flex shrink-0 items-center text-white/45">
      {item.both && <Arrow flip />}
      <span className="relative block h-px w-8 bg-white/20 lg:w-14">
        <span className="rm-fill absolute inset-0 origin-left bg-cyan-300/80" />
      </span>
      <Arrow />
    </span>
    <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
      {item.to.map((t) => (
        <Pill key={t} target>
          {t}
        </Pill>
      ))}
    </div>
  </div>
);
const Row = ({ item }) => {
  const ref = useRef(null);
  const [lit, setLit] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLit(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const href = item.link ? HUB[item.link.slug].path : null;
  return (
    <li ref={ref} data-lit={lit ? "true" : "false"} className="rm-row group py-8 transition-colors duration-500 hover:bg-white/[0.015] md:py-10" data-reveal>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
        <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] md:grid-cols-[3rem_minmax(0,1fr)]">
          <span className="pt-2 font-mono text-xs text-white/50">{item.n}</span>
          <div>
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{item.tag}</span>
            <h3 className="mb-3 text-2xl font-bold tracking-tight md:text-3xl">{item.title}</h3>
            <p className="max-w-xl text-base leading-relaxed text-white/65">{item.desc}</p>
            {href && (
              <a
                href={href}
                className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/65 outline-none transition-colors hover:text-white focus-visible:text-white focus-visible:ring-1 focus-visible:ring-cyan-300/70"
              >
                {item.link.label}
                <Arrow />
              </a>
            )}
          </div>
        </div>
        <Route item={item} />
      </div>
    </li>
  );
};
const RouteMap = ({ data, slug }) => {
  const { c, ui } = useService(data);
  const { capabilities } = c;
  const t = capabilities.triggers;
  return (
    <section id="co-wdrazamy" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <style>{`
        .rm-fill{transform:scaleX(0);transition:transform .8s cubic-bezier(.4,0,.2,1)}
        .rm-row[data-lit="true"] .rm-fill{transform:scaleX(1)}
        .rm-target{transition:border-color .7s ease .5s}
        .rm-row[data-lit="true"] .rm-target{border-color:#67e8f9}
        @media (prefers-reduced-motion: reduce){.rm-fill{transition:none;transform:scaleX(1)}.rm-target{transition:none}}
      `}</style>
      <div className="mb-12 grid grid-cols-1 items-end gap-8 md:mb-16 lg:grid-cols-[1.4fr_1fr] lg:gap-16" data-reveal>
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
      <div className="mb-14 border-y border-white/10 py-7 md:mb-16 md:py-8" data-reveal>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
          <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] md:grid-cols-[3rem_minmax(0,1fr)]">
            <span aria-hidden="true" className="mt-1 block h-2 w-2 rotate-45 border border-cyan-300 bg-cyan-300" />
            <div>
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">{t.label}</span>
              <p className="max-w-xl text-base leading-relaxed text-white/75">{t.text}</p>
            </div>
          </div>
          <ul aria-hidden="true" className="flex flex-wrap content-center gap-2">
            {t.chips.map((chip) => (
              <li key={chip} className="rounded-md border border-white/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="space-y-14 md:space-y-16">
        {capabilities.groups.map((g) => (
          <div key={g.tag}>
            <div className="mb-2 flex items-center gap-4" data-reveal>
              <span className="rounded-full border border-white/30 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/85">{g.tag}</span>
              <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
            </div>
            <ol className="divide-y divide-white/10 border-t border-white/10">
              {g.items.map((item) => (
                <Row key={item.n} item={item} />
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
};
export default RouteMap;
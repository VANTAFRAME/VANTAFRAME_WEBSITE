import React from "react";
import { useService } from "../useService";
import { HUB } from "../../../data/aiServices/hub";
// "What an AI agent is": four ways a system can work, side by side — equal weight, hairline
// dividers, a small line glyph each. Deliberately not a ladder or a ranking: no arrows, no
// "levels". The agent column is only marked as the current page. Links go to the matching
// service pages. Plain text, no animation.
const STROKE = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round", strokeLinejoin: "round" };
const Glyph = ({ kind }) => (
  <svg viewBox="0 0 72 40" className="h-10 w-[72px] text-white/70" aria-hidden="true" {...STROKE}>
    {kind === "RULES" && (
      <>
        <rect x="3" y="12" width="16" height="16" rx="2" />
        <rect x="28" y="12" width="16" height="16" rx="2" />
        <rect x="53" y="12" width="16" height="16" rx="2" />
        <path d="M19 20h9M44 20h9" />
      </>
    )}
    {kind === "CONVERSATION" && (
      <>
        <rect x="3" y="5" width="34" height="18" rx="4" />
        <path d="M10 23l-2 7 8-7" />
        <rect x="35" y="16" width="34" height="18" rx="4" />
        <path d="M10 14h18M43 25h18" />
      </>
    )}
    {kind === "SUPPORT" && (
      <>
        <circle cx="18" cy="12" r="6" />
        <path d="M6 33c0-7 5-11 12-11s12 4 12 11" />
        <rect x="42" y="8" width="24" height="26" rx="2" />
        <path d="M48 16h12M48 22h12M48 28h7" />
      </>
    )}
    {kind === "GOAL" && (
      <>
        <rect x="3" y="14" width="14" height="12" rx="2" />
        <circle cx="36" cy="20" r="7" />
        <rect x="55" y="14" width="14" height="12" rx="2" />
        <path d="M17 20h12M43 20h12" />
        <path d="M36 13V5h-14M36 27v8h14" strokeDasharray="2.5 3" />
      </>
    )}
  </svg>
);
const Arrow = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true" {...STROKE}>
    <path d="M5 12h14m-6-6l6 6-6 6" />
  </svg>
);
const DefinitionCompare = ({ data, slug }) => {
  const { c } = useService(data);
  const { definition } = c;
  return (
    <section id="czym-jest-agent" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <div className="mb-12 grid grid-cols-1 items-end gap-8 md:mb-16 lg:grid-cols-[1.4fr_1fr] lg:gap-16" data-reveal>
        <div>
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{definition.eyebrow}</p>
          <h2 className="text-3xl font-black leading-[1.05] tracking-tight md:text-5xl xl:text-6xl">
            {definition.heading[0]}
            {" "}<br />
            {definition.heading[1]}
          </h2>
        </div>
        <p className="max-w-xl text-base leading-relaxed text-white/65 md:text-lg">{definition.intro}</p>
      </div>
      <ul className="grid grid-cols-1 border-y border-white/10 md:grid-cols-2 xl:grid-cols-4">
        {definition.items.map((item, i) => {
          const href = item.slug ? HUB[item.slug].path : null;
          return (
            <li
              key={item.title}
              className={`group relative flex flex-col p-7 md:p-9 transition-colors duration-500 hover:bg-white/[0.015] ${
                i > 0 ? "border-t border-white/10 md:border-t-0" : ""
              } ${i % 2 === 1 ? "md:border-l md:border-white/10" : ""} ${i === 2 ? "md:border-t md:border-white/10 xl:border-t-0" : ""} ${
                i === 3 ? "md:border-t md:border-white/10 xl:border-t-0" : ""
              } ${i > 0 ? "xl:border-l xl:border-white/10" : ""}`}
              data-reveal
            >
              <div className="mb-8 flex items-start justify-between gap-4">
                <Glyph kind={["RULES", "CONVERSATION", "SUPPORT", "GOAL"][i]} />
                {item.current && (
                  <span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-cyan-300/90">
                    <span aria-hidden="true" className="h-1.5 w-1.5 bg-cyan-300" />
                    {definition.here}
                  </span>
                )}
              </div>
              <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{item.tag}</span>
              <h3 className="mb-3 text-2xl font-bold tracking-tight md:text-3xl">{item.title}</h3>
              <p className="max-w-xs flex-1 text-base leading-relaxed text-white/65">{item.desc}</p>
              {href && (
                <a
                  href={href}
                  className="mt-8 inline-flex w-fit items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/65 outline-none transition-colors hover:text-white focus-visible:text-white focus-visible:ring-1 focus-visible:ring-cyan-300/70"
                  aria-label={`${definition.linkLabel}: ${item.title}`}
                >
                  {definition.linkLabel}
                  <Arrow />
                </a>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-12 max-w-2xl border-l border-white/20 pl-5 text-base leading-relaxed text-white/70 md:mt-16" data-reveal>
        {definition.closing}
      </p>
    </section>
  );
};
export default DefinitionCompare;
import React from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";

// A compact NODE — LINE — NODE flow indicator, not a separate card component —
// just monospace labels joined by short segments. The row's hover state is
// what lights it up (see the `group-hover` classes below), and only the last
// node ever turns cyan, matching the "cyan = current/active step only" rule.
const MiniFlow = ({ steps }) => (
  <div className="flex items-center gap-1.5 md:gap-2">
    {steps.map((step, i) => {
      const isLast = i === steps.length - 1;
      return (
        <React.Fragment key={step}>
          <span
            className={`font-mono text-[10px] uppercase tracking-widest whitespace-nowrap transition-colors duration-500 ${
              isLast ? "text-white/50 group-hover:text-cyan-300" : "text-white/30 group-hover:text-white/60"
            }`}
          >
            {step}
          </span>
          {i < steps.length - 1 && (
            <span className="w-3 md:w-4 h-px bg-white/12 group-hover:bg-white/30 transition-colors duration-500 shrink-0" />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

const ScenarioIndex = () => {
  const lang = useStore(currentLang, () => "pl");
  const items = languages[lang].automatyzacjePage.scenarios.items;

  return (
    <section id="scenariusze" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32">
      <div className="border-t border-white/10 divide-y divide-white/10">
        {items.map((item) => (
          <a
            key={item.n}
            href="#contact"
            className="scenario-row group cursor-hover relative flex items-center gap-6 md:gap-10 py-8 md:py-12 overflow-hidden"
            data-cursor-label="EXPLORE"
            data-reveal
          >
            <span
              className="pointer-events-none absolute right-0 md:right-6 top-1/2 -translate-y-1/2 text-[clamp(4rem,14vw,10rem)] font-black text-white/[0.025] leading-none select-none"
              aria-hidden="true"
            >
              {item.n}
            </span>

            <span className="relative z-10 font-mono text-xs text-white/35 shrink-0 w-8">{item.n}</span>

            <span className="relative z-10 flex-1 min-w-0 max-w-2xl transition-transform duration-500 group-hover:translate-x-3">
              <span className="block text-[10px] font-mono uppercase tracking-[0.25em] text-white/40 mb-2">{item.area}</span>
              <span className="block text-xl sm:text-2xl md:text-4xl font-bold text-white tracking-tight">{item.title}</span>
              <span className="hidden sm:block text-sm md:text-base text-white/55 mt-2 max-w-md">{item.desc}</span>
            </span>

            <span className="relative z-10 hidden lg:flex items-center justify-end ml-auto mr-6 shrink-0">
              <MiniFlow steps={item.flow} />
            </span>

            <span className="relative z-10 hidden md:flex items-center justify-center w-9 h-9 shrink-0 md:ml-auto lg:ml-0 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all duration-500">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default ScenarioIndex;

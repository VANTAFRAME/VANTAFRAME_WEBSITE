import React from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";
// "What we do": the three areas as full-width rows (number, name, one sentence, arrow) — the row
// language of the service index on /wdrozenia-ai/. The whole row is a link.
const ServiceRows = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].aboutPage.what;
  return (
    <section id="co-robimy" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32">
      <div className="mb-14 md:mb-20" data-reveal>
        <h2 className="text-3xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6 max-w-5xl">{t.heading}</h2>
        <p className="text-base md:text-lg text-white/55 leading-relaxed max-w-2xl">{t.intro}</p>
      </div>
      <div className="border-t border-white/10 divide-y divide-white/10">
        {t.items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="group cursor-hover relative flex items-center gap-6 md:gap-10 py-8 md:py-12 overflow-hidden outline-none focus-visible:bg-white/[0.04] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-cyan-300/70 transition-colors duration-500 hover:bg-white/[0.015]"
            data-reveal
          >
            <span
              className="pointer-events-none absolute right-0 md:right-6 top-1/2 -translate-y-1/2 text-[clamp(4rem,14vw,10rem)] font-black text-white/[0.025] group-hover:text-white/[0.07] group-focus-visible:text-white/[0.07] transition-colors duration-500 leading-none select-none"
              aria-hidden="true"
            >
              {item.n}
            </span>
            <span className="relative z-10 font-mono text-xs text-white/35 shrink-0 w-8">{item.n}</span>
            <span className="relative z-10 flex-1 min-w-0 max-w-2xl transition-transform duration-500 group-hover:translate-x-3">
              <span className="block text-xl sm:text-2xl md:text-4xl font-bold text-white tracking-tight">{item.title}</span>
              <span className="block text-sm md:text-base text-white/55 mt-2 max-w-xl">{item.desc}</span>
            </span>
            <span className="relative z-10 hidden md:flex items-center justify-center w-9 h-9 shrink-0 md:ml-auto text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all duration-500">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};
export default ServiceRows;
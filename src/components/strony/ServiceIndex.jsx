import React from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";

const ServiceIndex = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].stronyPage.serviceIndex;

  return (
    <section className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32">
      <div className="border-t border-white/10 divide-y divide-white/10">
        {t.services.map((s) => (
          <a
            key={s.n}
            href="#contact"
            className="service-row group cursor-hover relative flex items-center gap-6 md:gap-10 py-8 md:py-12 overflow-hidden"
            data-cursor-label={t.cursorLabel}
            data-reveal
          >
            <span
              className="pointer-events-none absolute right-0 md:right-6 top-1/2 -translate-y-1/2 text-[clamp(4rem,14vw,10rem)] font-black text-white/[0.025] leading-none select-none"
              aria-hidden="true"
            >
              {s.n}
            </span>

            <span className="relative z-10 font-mono text-xs text-white/35 shrink-0 w-8">{s.n}</span>

            <span className="relative z-10 flex-1 min-w-0 max-w-2xl transition-transform duration-500 group-hover:translate-x-3">
              <span className="block text-[10px] font-mono uppercase tracking-[0.25em] text-white/40 mb-2">{s.tag}</span>
              <span className="block text-xl sm:text-2xl md:text-4xl font-bold text-white tracking-tight">{s.title}</span>
              <span className="hidden sm:block text-sm md:text-base text-white/55 mt-2 max-w-md">{s.desc}</span>
            </span>

            <span className="relative z-10 hidden lg:flex flex-col w-40 xl:w-48 aspect-[16/10] ml-auto mr-16 xl:mr-24 rounded-lg overflow-hidden border border-white/12 bg-black opacity-0 scale-95 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100 shrink-0">
              <span className="flex items-center gap-1 px-2 py-1.5 border-b border-white/10 bg-white/[0.03]">
                <span className="w-1 h-1 rounded-full bg-white/25"></span>
                <span className="w-1 h-1 rounded-full bg-white/25"></span>
                <span className="w-1 h-1 rounded-full bg-white/25"></span>
              </span>
              <span className="flex-1 min-h-0">
                <img src={s.image} alt="" loading="lazy" className="w-full h-full object-cover" />
              </span>
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

export default ServiceIndex;

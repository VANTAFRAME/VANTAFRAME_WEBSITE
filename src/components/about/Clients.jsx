import React from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";
// "Who we worked for": a typographic list of names (no logos) as large rows on hairlines; the names that
// have a case study link to it. Under the list: the Forum Ekonomiczne reference (short) and a link to the portfolio.
const Clients = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].aboutPage.clients;
  return (
    <section id="klienci" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <div className="mb-12 md:mb-16" data-reveal>
        <h2 className="text-3xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6 max-w-5xl">{t.heading}</h2>
        <p className="text-base md:text-lg text-white/55 leading-relaxed max-w-2xl">{t.intro}</p>
      </div>
      <ul className="border-t border-white/10 divide-y divide-white/10">
        {t.items.map((item, i) => (
          <li key={`${item.name}-${i}`} data-reveal>
            {item.href ? (
              <a
                href={item.href}
                className="group flex items-center justify-between gap-6 py-5 md:py-6 text-xl sm:text-2xl md:text-4xl font-bold tracking-tight text-white outline-none transition-colors hover:text-white focus-visible:bg-white/[0.04] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-cyan-300/70"
              >
                <span className="transition-transform duration-500 group-hover:translate-x-2">{item.name}</span>
                <svg className="hidden md:block h-4 w-4 shrink-0 text-white/40 transition-all duration-500 group-hover:translate-x-1 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </a>
            ) : (
              <span className="block py-5 md:py-6 text-xl sm:text-2xl md:text-4xl font-bold tracking-tight text-white/70">{item.name}</span>
            )}
          </li>
        ))}
      </ul>
      <a
        href="/portfolio/"
        className="mt-10 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white focus-visible:text-white"
        data-reveal
      >
        {t.more}
      </a>
    </section>
  );
};
export default Clients;
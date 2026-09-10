import React from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";

const FinalStatement = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].automatyzacjePage.finalStatement;

  return (
    <section className="min-h-[100svh] flex flex-col items-center justify-center px-6 text-center bg-brand-black gap-8">
      <h2 className="text-[clamp(2.2rem,7vw,5.5rem)] font-black tracking-tight leading-[1.05] max-w-4xl" data-reveal>
        {t.headline.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h2>
      <p className="text-base md:text-lg text-white/50 max-w-md" data-reveal>
        {t.sub}
      </p>
      <a
        href="#contact"
        className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white border-b-2 border-white/60 pb-1 hover:border-white transition-colors w-fit"
        data-reveal
      >
        {t.cta}
        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14m-7-7l7 7-7 7" />
        </svg>
      </a>
    </section>
  );
};

export default FinalStatement;

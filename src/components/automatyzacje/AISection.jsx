import React from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";

const AISection = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].automatyzacjePage.ai;

  return (
    <section className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-20 mb-16 md:mb-20">
        <h2 className="text-3xl md:text-6xl font-black tracking-tight leading-[1.05]" data-reveal>
          {t.headline[0]}
          <br />
          {t.headline[1]}
          <br />
          {t.headline[2]}
        </h2>
        <p className="text-base md:text-xl text-white/55 leading-relaxed max-w-xl lg:mt-2" data-reveal>
          {t.desc}
        </p>
      </div>

      <div className="border-t border-white/10">
        {t.rows.map((row) => (
          <div key={row.n} className="group relative border-b border-white/10 px-2 md:px-4 py-7 md:py-9 hover:bg-white/[0.02] transition-colors duration-300" data-reveal>
            <div className="flex flex-wrap md:flex-nowrap items-center gap-x-4 gap-y-3 md:gap-8">
              <span className="font-mono text-xs text-white/35 w-8 shrink-0">{row.n}</span>
              <span className="text-xl sm:text-2xl md:text-4xl font-bold tracking-tight text-white shrink-0 transition-transform duration-300 group-hover:translate-x-2">
                {row.title}
              </span>
              <span className="hidden md:block h-px flex-1 bg-white/10"></span>
              <div className="w-full md:w-auto md:ml-auto pl-12 md:pl-0 flex items-center gap-2 shrink-0">
                {row.flow.map((step, i) => {
                  const isLast = i === row.flow.length - 1;
                  return (
                    <React.Fragment key={step}>
                      <span
                        className={`font-mono text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap transition-colors duration-500 ${
                          isLast ? "text-white/60 group-hover:text-cyan-300" : "text-white/35 group-hover:text-white/60"
                        }`}
                      >
                        {step}
                      </span>
                      {!isLast && <span className="w-3 md:w-4 h-px bg-white/12 group-hover:bg-white/30 transition-colors duration-500 shrink-0" />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AISection;

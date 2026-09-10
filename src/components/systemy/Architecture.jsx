import React from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";

const Architecture = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].systemyPage.architecture;

  return (
    <section className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32">
      <div className="mb-14 md:mb-16 max-w-2xl" data-reveal>
        <h2 className="text-3xl md:text-6xl font-black tracking-tight leading-[1.05]">
          {t.heading[0]}
          <br />
          {t.heading[1]}
        </h2>
      </div>

      <div className="border-t border-white/10">
        {t.layers.map((layer) => (
          <div
            key={layer.n}
            className="group relative border-b border-white/10 px-2 md:px-4 py-7 md:py-9 hover:bg-white/[0.02] transition-colors duration-300"
            tabIndex={0}
            data-reveal
          >
            <div className="flex flex-wrap md:flex-nowrap items-baseline gap-x-4 gap-y-2 md:gap-8">
              <span className="font-mono text-xs text-white/35 w-8 shrink-0">{layer.n}</span>
              <span className="text-xl sm:text-2xl md:text-4xl font-bold tracking-tight text-white shrink-0 transition-transform duration-300 group-hover:translate-x-2">
                {layer.title}
              </span>
              <span className="hidden md:block h-px flex-1 bg-white/10"></span>
              <span className="w-full md:w-auto pl-12 md:pl-0 font-mono text-[10px] md:text-xs text-white/40 uppercase tracking-widest shrink-0">
                {layer.items}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Architecture;

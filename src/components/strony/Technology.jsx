import React from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";

const Technology = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].stronyPage.technology;

  return (
    <section className="technology px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32">
      <div className="mb-14 md:mb-16 max-w-2xl" data-reveal>
        <h2 className="text-3xl md:text-6xl font-black tracking-tight leading-[1.05]">{t.heading}</h2>
      </div>

      <div className="hood-stack border-t border-white/10">
        {t.layers.map((layer) => (
          <div
            key={layer.n}
            className="hood-layer group relative border-b border-white/10 px-2 md:px-4 py-6 md:py-8 focus-within:bg-white/[0.02] md:hover:bg-white/[0.02] transition-colors"
            tabIndex={0}
            data-reveal
          >
            <div className="flex flex-wrap md:flex-nowrap items-center gap-x-4 gap-y-1.5 md:gap-8">
              <span className="font-mono text-xs text-white/35 w-8 shrink-0">{layer.n}</span>
              <span className="text-xl sm:text-2xl md:text-4xl font-bold tracking-tight text-white shrink-0">{layer.title}</span>
              <span className="hidden md:block h-px flex-1 bg-white/10"></span>
              <span className="w-full md:w-auto pl-12 md:pl-0 font-mono text-[10px] md:text-xs text-white/40 uppercase tracking-widest shrink-0">
                {layer.stack}
              </span>
            </div>
            <div className="hood-detail grid grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-within:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
              <p className="overflow-hidden text-sm md:text-base text-white/55 leading-relaxed max-w-2xl pl-12 md:pl-16 pt-0 md:group-hover:pt-4 md:group-focus-within:pt-4 transition-[padding] duration-500">
                {layer.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: always expanded, since hover doesn't exist */}
      <style>{`
        @media (max-width: 767px) {
          .hood-detail {
            grid-template-rows: 1fr !important;
          }
          .hood-detail p {
            padding-top: 0.75rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Technology;

import React from "react";
import { DeviceFrame, IPhoneFrame } from "./DeviceFrames";

// Full-scale "case-spread" rows (same geometry as strony/SelectedWork.jsx —
// min-h-[70vh]/[90vh], alternating sides) showing real, shipped products
// instead of marketing photography. Fully data-driven so /systemy and
// /automatyzacje can each supply their own cases without duplicating markup.
const CaseShowcase = ({ t }) => (
  <section className="case-showcase">
    <div className="px-6 md:px-12 max-w-[1700px] mx-auto pt-24 md:pt-32 pb-14 md:pb-16" data-reveal>
      <h2 className="text-3xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6 max-w-2xl">
        {t.heading[0]}
        <br />
        {t.heading[1]}
      </h2>
      <p className="text-base md:text-lg text-white/55 leading-relaxed max-w-2xl">{t.desc}</p>
    </div>

    {t.cases.map((c, i) => {
      const reversed = i % 2 === 1;
      const isLast = i === t.cases.length - 1;
      return (
        <div
          key={c.n}
          className={`case-spread relative flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} min-h-[70vh] md:min-h-[90vh] border-t border-white/10 ${isLast ? "border-b" : ""}`}
          data-reveal
        >
          <div className="relative w-full md:w-[68%] min-h-[50vh] h-auto md:h-auto bg-black px-4 py-6 md:p-10">
            <DeviceFrame src={c.image} alt={c.imageAlt} label={c.deviceLabel} className="h-full" />
            {c.mobileImage && (
              // Width lives on THIS wrapper, not on IPhoneFrame itself: once
              // it goes `absolute` at md+, it has no intrinsic width of its
              // own, and a percentage width on the child inside it can't
              // resolve against an "auto"-width absolute container — it
              // silently collapses instead. IPhoneFrame just fills whatever
              // width this wrapper is given.
              <div
                className={`mt-16 mx-auto w-[42%] sm:w-[34%] flex justify-center md:mt-0 md:mx-0 md:absolute md:-bottom-5 md:block md:w-[24%] lg:w-[21%] ${c.mobileSide === "left" ? "md:-left-5" : "md:-right-5"}`}
              >
                <IPhoneFrame src={c.mobileImage} alt={c.mobileAlt} className="w-full" tilt={c.mobileTilt ?? false} />
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-center px-6 md:px-12 py-10 md:py-0">
            <span className="font-mono text-xs text-white/35 mb-4">
              {c.n} / {String(t.cases.length).padStart(2, "0")}
            </span>
            <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">{c.title}</h3>
            <span className="text-sm text-white/45 font-mono uppercase tracking-wider mb-4">{c.category}</span>
            <p className="text-base md:text-lg text-white/55 leading-relaxed max-w-md mb-6">{c.desc}</p>
          </div>
        </div>
      );
    })}
  </section>
);

export default CaseShowcase;

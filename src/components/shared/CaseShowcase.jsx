import React from "react";
import { DeviceFrame, IPhoneFrame } from "./DeviceFrames";
import LinkedText from "../LinkedText";
import imageSizes from "../../data/projectImageSizes.json";
// Full-scale "case-spread" rows (same geometry as strony/SelectedWork.jsx —
// min-h-[70vh]/[90vh], alternating sides) showing real, shipped products
// instead of marketing photography. Fully data-driven so /systemy and
// /automatyzacje can each supply their own cases without duplicating markup.
const CaseShowcase = ({ t, visuals = {} }) => (
  <section className="case-showcase">
    <div className="px-6 md:px-12 max-w-[1700px] mx-auto pt-24 md:pt-32 pb-14 md:pb-16" data-reveal>
      <h2 className="text-3xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6 max-w-2xl">
        {t.heading[0]}
        {" "}<br />
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
          <div className={`relative w-full ${c.visual ? "md:w-[74%]" : "md:w-[68%]"} min-h-[50vh] h-auto md:h-auto bg-black ${c.visual ? "px-2 py-6 md:p-6" : "px-4 py-6 md:p-10"}`}>
            {c.visual ? (
              visuals[c.visual]
            ) : (
              <DeviceFrame src={c.image} alt={c.imageAlt} label={c.deviceLabel} className="h-full" width={imageSizes[c.image]?.width} height={imageSizes[c.image]?.height} />
            )}
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
                <IPhoneFrame src={c.mobileImage} alt={c.mobileAlt} className="w-full" tilt={c.mobileTilt ?? false} width={imageSizes[c.mobileImage]?.width} height={imageSizes[c.mobileImage]?.height} />
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-center px-6 md:px-12 py-10 md:py-0">
            <span className="font-mono text-xs text-white/35 mb-4">
              {c.n} / {String(t.cases.length).padStart(2, "0")}
            </span>
            <h3 className={`${c.visual ? "text-3xl md:text-4xl" : "text-3xl md:text-5xl"} font-bold tracking-tight mb-3`}>{c.title}</h3>
            <span className="text-sm text-white/45 font-mono uppercase tracking-wider mb-4">{c.category}</span>
            <p className="text-base md:text-lg text-white/55 leading-relaxed max-w-md mb-6"><LinkedText text={c.desc} /></p>
            {c.note && <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/35 max-w-md">{c.note}</p>}
            {c.cta && (
              <a
                href={c.cta.href}
                data-automation-framework
                data-cta-location="showcase"
                className="group mt-8 inline-flex w-fit items-center gap-3 border-b-2 border-white/60 pb-1 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:border-white"
              >
                {c.cta.label}
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>
        </div>
      );
    })}
  </section>
);
export default CaseShowcase;
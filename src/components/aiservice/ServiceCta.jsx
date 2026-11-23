import React from "react";
import { useService } from "./useService";
// Mid-page full-screen statement (placed after the use cases, so a visitor meets an invitation
// to get in touch in the hero, here and in the form at the end). The button opens the same contact drawer as on
// /automatyzacje/ (the link target #contact keeps it working without JavaScript).
const ServiceCta = ({ data, slug, location = "service_mid" }) => {
  const { c, ui } = useService(data);
  const { cta } = c;
  return (
    <section className="min-h-[100svh] flex flex-col items-center justify-center px-6 text-center bg-brand-black gap-8">
      <h2 className="text-[clamp(2.2rem,7vw,5.5rem)] font-black tracking-tight leading-[1.05] max-w-4xl" data-reveal>
        {cta.heading.map((line) => (
          <span key={line} className="block">
            {line}{" "}
          </span>
        ))}
      </h2>
      {cta.sub && (
        <p className="text-base md:text-lg text-white/60 max-w-md" data-reveal>
          {cta.sub}
        </p>
      )}
      <a
        href="#contact"
        data-open-contact-drawer
        data-cta-location={location}
        className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white border-b-2 border-white/60 pb-1 hover:border-white focus-visible:border-cyan-300 outline-none transition-colors w-fit"
        data-reveal
      >
        {cta.button}
        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M5 12h14m-7-7l7 7-7 7" />
        </svg>
      </a>
      <a
        href="/kreator-projektu/"
        data-automation-framework
        data-cta-location="service_mid_builder"
        className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white focus-visible:text-white outline-none transition-colors"
        data-reveal
      >
        {ui.builder}
      </a>
    </section>
  );
};
export default ServiceCta;
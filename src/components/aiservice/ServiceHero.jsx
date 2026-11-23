import React from "react";
import { HUB } from "../../data/aiServices/hub";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { UI } from "./ui";
// Hero of a service page: breadcrumb, eyebrow, big H1, lead and the CTA on the left,
// the service's own animated visual (passed in as children by the Astro page) on the right.
// All text is server-rendered; `data-reveal` uses the site-wide reveal mechanism.
const Arrow = () => (
  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14m-7-7l7 7-7 7" />
  </svg>
);
// `heroByLang` ({ pl, en }) comes from the Astro page as a prop: the hero is loaded eagerly (client:load),
// so it must not import the data of all six services the way useService does.
const ServiceHero = ({ slug, heroByLang, pillar = false, children }) => {
  const lang = useStore(currentLang, () => "pl");
  const ui = UI[lang] || UI.pl;
  const hero = heroByLang[lang] || heroByLang.pl;
  return (
    <section className="relative px-6 md:px-12 max-w-[1700px] mx-auto pt-32 md:pt-40 pb-20 md:pb-28">
      <nav aria-label="Breadcrumb" className="mb-10 md:mb-14" data-reveal suppressHydrationWarning>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
          <li>
            <a href="/" className="hover:text-white focus-visible:text-white transition-colors">
              {ui.home}
            </a>
          </li>
          <li aria-hidden="true" className="text-white/25">
            /
          </li>
          {pillar ? (
            <li aria-current="page" className="text-white/85">
              {ui.hub}
            </li>
          ) : (
            <>
              <li>
                <a href="/wdrozenia-ai/" className="hover:text-white focus-visible:text-white transition-colors">
                  {ui.hub}
                </a>
              </li>
              <li aria-hidden="true" className="text-white/25">
                /
              </li>
              <li aria-current="page" className="text-white/85">
                {(HUB[slug][lang] || HUB[slug].pl).title}
              </li>
            </>
          )}
        </ol>
      </nav>
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-14 xl:gap-16 items-center">
        <div>
          <div className="flex items-center gap-3 mb-8" data-reveal suppressHydrationWarning>
            <span className="w-1.5 h-1.5 bg-white/40" />
            <span className="font-mono text-xs text-white/60 tracking-[0.25em] uppercase">{hero.eyebrow}</span>
          </div>
          <h1 className="text-[clamp(2.2rem,4.4vw,4.6rem)] font-black tracking-[-0.02em] leading-[1.04] mb-7" data-reveal suppressHydrationWarning>
            {hero.h1.map((line) => (
              <span key={line} className="block">
                {line}{" "}
              </span>
            ))}
          </h1>
          <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-xl mb-10" data-reveal suppressHydrationWarning>
            {hero.lead}
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4" data-reveal suppressHydrationWarning>
            <a
              href="#contact"
              data-open-contact-drawer
              data-cta-location="service_hero"
              className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white border-b-2 border-white/60 pb-1 hover:border-white focus-visible:border-cyan-300 outline-none transition-colors w-fit"
            >
              {hero.cta}
              <Arrow />
            </a>
            <a
              href={pillar ? "#obszary" : "/wdrozenia-ai/"}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white focus-visible:text-white transition-colors"
            >
              {pillar ? ui.seeAreas : ui.seeAll}
            </a>
          </div>
        </div>
        <div className="min-w-0" data-reveal suppressHydrationWarning>
          {children}
        </div>
      </div>
    </section>
  );
};
export default ServiceHero;
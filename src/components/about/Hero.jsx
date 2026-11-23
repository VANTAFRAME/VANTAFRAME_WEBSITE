import React from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";
// Hero of /o-nas/: the layout of the AI service pages' hero (breadcrumb, eyebrow, big H1, lead, one CTA that
// opens the contact drawer) with the VANTAFRAME wireframe mark on the right instead of an animated visual.
// The mark is the same image the home page uses (WebP with a PNG fallback), feathered at the edges.
const Arrow = () => (
  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14m-7-7l7 7-7 7" />
  </svg>
);
const AboutHero = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].aboutPage;
  const { hero, breadcrumb } = t;
  return (
    <section className="relative px-6 md:px-12 max-w-[1700px] mx-auto pt-32 md:pt-40 pb-20 md:pb-28">
      <nav aria-label="Breadcrumb" className="mb-10 md:mb-14" data-reveal suppressHydrationWarning>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
          <li>
            <a href="/" className="hover:text-white focus-visible:text-white transition-colors">
              {breadcrumb.home}
            </a>
          </li>
          <li aria-hidden="true" className="text-white/25">
            /
          </li>
          <li aria-current="page" className="text-white/85">
            {breadcrumb.about}
          </li>
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
              data-cta-location="about_hero"
              className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white border-b-2 border-white/60 pb-1 hover:border-white focus-visible:border-cyan-300 outline-none transition-colors w-fit"
            >
              {hero.cta}
              <Arrow />
            </a>
            <a
              href={hero.secondaryHref}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 hover:text-white focus-visible:text-white transition-colors"
            >
              {hero.secondary}
            </a>
          </div>
        </div>
        <div className="min-w-0" data-reveal suppressHydrationWarning>
          <div
            className="relative mx-auto aspect-square w-full max-w-[520px]"
            style={{
              maskImage: "radial-gradient(circle at center, black 62%, transparent 96%)",
              WebkitMaskImage: "radial-gradient(circle at center, black 62%, transparent 96%)",
            }}
          >
            <picture>
              <source srcSet="/vf-logo-wireframe.webp" type="image/webp" />
              <img
                src="/vf-logo-wireframe.png"
                width="1024"
                height="1024"
                alt=""
                aria-hidden="true"
                decoding="async"
                className="h-full w-full object-contain mix-blend-screen pointer-events-none"
                style={{ filter: "contrast(1.35) brightness(1.05)" }}
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AboutHero;
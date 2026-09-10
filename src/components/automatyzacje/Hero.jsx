import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";
import FrameworkApp from "../framework/FrameworkApp";

gsap.registerPlugin(ScrollTrigger);

const Arrow = () => (
  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14m-7-7l7 7-7 7" />
  </svg>
);

// The hero's visual: our own FRAMEWORK project-builder, live and fillable
// right here — not a mockup of automation, an actual working piece of it.
// Wrapped in the same minimal device chrome used across the other hero
// visuals; the wizard itself renders in its `contained` layout (no fixed
// overlay, no home/close chrome — that only makes sense on its own page).
const FrameworkPanel = ({ caption }) => (
  <div className="rounded-xl border border-white/10 bg-black overflow-hidden">
    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-black/40">
      <span className="w-2 h-2 rounded-full bg-white/15" />
      <span className="w-2 h-2 rounded-full bg-white/15" />
      <span className="w-2 h-2 rounded-full bg-white/15" />
      <span className="ml-2 text-[9px] font-mono text-white/30 tracking-wider truncate">{caption}</span>
    </div>
    <div className="h-[620px] md:h-[720px]">
      <FrameworkApp contained />
    </div>
  </div>
);

const AutomationHero = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].automatyzacjePage.hero;
  const BLOCKS = t.blocks;

  const wrapperRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useLayoutEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Subtle reveal the first time each text block enters the viewport.
  useEffect(() => {
    const blocks = document.querySelectorAll("#automation-hero .hero-block");
    if (!blocks.length) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const ctx = gsap.context(() => {
      blocks.forEach((block) => {
        gsap.fromTo(
          block,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: block, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      });
    });
    return () => ctx.revert();
  }, [lang]);

  return (
    <>
      {/* DESKTOP: real scroll, sticky FRAMEWORK panel */}
      <section
        ref={wrapperRef}
        id="automation-hero"
        className={`relative bg-brand-black ${reducedMotion ? "hidden" : "hidden lg:block"}`}
      >
        <div className="grid grid-cols-[minmax(280px,28vw)_1fr] gap-x-4 md:gap-x-6 pl-6 md:pl-12">
          {/* Copy column — normal document flow, no pinning, no crossfade */}
          <div className="flex flex-col pt-40 pb-32">
            {BLOCKS.map((block, i) => {
              const Heading = i === 0 ? "h1" : "h2";
              return (
                <div key={i} className="hero-block min-h-[85vh] flex flex-col justify-center max-w-md">
                  {i === 0 && (
                    <div className="flex items-center gap-3 mb-8">
                      <span className="w-1.5 h-1.5 bg-white/40" />
                      <span className="font-mono text-xs text-white/40 tracking-[0.25em] uppercase">{t.eyebrow}</span>
                    </div>
                  )}
                  <Heading className="text-[clamp(1.9rem,2.6vw,2.9rem)] font-black tracking-[-0.02em] leading-[1.12] mb-6">
                    {block.heading.map((line, li) => (
                      <span key={li} className="block">
                        {line}
                      </span>
                    ))}
                  </Heading>
                  <p className="text-base text-white/55 leading-relaxed mb-8">{block.copy}</p>
                  {block.cta && (
                    <a
                      href="#contact"
                      className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white border-b-2 border-white/60 pb-1 hover:border-white transition-colors w-fit"
                    >
                      {t.ctaLabel}
                      <Arrow />
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          {/* Visual column — sticky FRAMEWORK panel */}
          <div className="relative">
            <div className="sticky top-[10vh]">
              <div className="ml-auto" style={{ width: "clamp(900px, 68vw, 1500px)" }}>
                <FrameworkPanel caption={t.caption} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE / REDUCED MOTION: simpler layout, FRAMEWORK panel between blocks */}
      <section className={`relative bg-brand-black px-6 pt-32 pb-20 ${reducedMotion ? "" : "lg:hidden"}`}>
        {BLOCKS.map((block, i) => {
          if (i === 1) {
            return (
              <React.Fragment key="visual">
                <div className="my-4 h-[620px]">
                  <FrameworkPanel caption={t.caption} />
                </div>
                <BlockContent block={block} ctaLabel={t.ctaLabel} eyebrow={t.eyebrow} />
              </React.Fragment>
            );
          }
          return <BlockContent key={i} block={block} isFirst={i === 0} ctaLabel={t.ctaLabel} eyebrow={i === 0 ? t.eyebrow : null} />;
        })}
      </section>
    </>
  );
};

const BlockContent = ({ block, isFirst, ctaLabel, eyebrow }) => (
  <div className="py-8 max-w-lg">
    {eyebrow && (
      <div className="flex items-center gap-3 mb-6">
        <span className="w-1.5 h-1.5 bg-white/40" />
        <span className="font-mono text-xs text-white/40 tracking-[0.25em] uppercase">{eyebrow}</span>
      </div>
    )}
    {isFirst ? (
      <p className="text-[clamp(2rem,8vw,3rem)] font-black tracking-[-0.02em] leading-[1.1] mb-5">
        {block.heading.map((line, li) => (
          <span key={li} className="block">
            {line}
          </span>
        ))}
      </p>
    ) : (
      <h2 className="text-[clamp(2rem,8vw,3rem)] font-black tracking-[-0.02em] leading-[1.1] mb-5">
        {block.heading.map((line, li) => (
          <span key={li} className="block">
            {line}
          </span>
        ))}
      </h2>
    )}
    <p className="text-base text-white/55 leading-relaxed mb-6">{block.copy}</p>
    {block.cta && (
      <a
        href="#contact"
        className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white border-b-2 border-white/60 pb-1 w-fit"
      >
        {ctaLabel}
        <Arrow />
      </a>
    )}
  </div>
);

export default AutomationHero;

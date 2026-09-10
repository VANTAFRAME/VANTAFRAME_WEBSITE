import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";

gsap.registerPlugin(ScrollTrigger);

// One frame of the live system interface per hero text block — scrolling
// through the copy on the left steps through the corresponding screen on the
// right, so the "system" visibly changes as the visitor reads.
const SYSTEM_SHOTS = [
  { src: "/2_systemy/systemy_hero/1_dashboard.png", label: "Dashboard" },
  { src: "/2_systemy/systemy_hero/2_wiadomosci.png", label: "Wiadomości" },
  { src: "/2_systemy/systemy_hero/3_agenci.png", label: "Agenci" },
];

const Arrow = () => (
  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14m-7-7l7 7-7 7" />
  </svg>
);

// Stacks all shots absolutely and crossfades between them — same position,
// size, crop and radius throughout, so switching frames never jumps or
// shifts layout, just a soft opacity transition.
const SystemShots = ({ activeIndex, className = "" }) => (
  <div className={`relative rounded-xl border border-white/10 bg-black overflow-hidden ${className}`}>
    {SYSTEM_SHOTS.map((shot, i) => (
      <img
        key={shot.src}
        src={shot.src}
        alt={shot.label}
        loading={i === 0 ? "eager" : "lazy"}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out"
        style={{ opacity: i === activeIndex ? 1 : 0 }}
      />
    ))}
  </div>
);

const HeroSystems = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].systemyPage.hero;
  const BLOCKS = t.blocks;
  const wrapperRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeShot, setActiveShot] = useState(0);

  useLayoutEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Subtle reveal the first time each text block enters the viewport.
  useEffect(() => {
    const blocks = document.querySelectorAll("#systemy-hero .hero-block");
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
  }, []);

  // Drives which system screen is showing from the hero's own scroll
  // distance — the same distance the visitor covers reading the three text
  // blocks, one screen per block.
  useEffect(() => {
    if (reducedMotion) return undefined;
    const wrapper = wrapperRef.current;
    if (!wrapper) return undefined;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const count = SYSTEM_SHOTS.length;
      const trigger = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const index = Math.min(count - 1, Math.floor(self.progress * count));
          setActiveShot((prev) => (prev === index ? prev : index));
        },
      });
      return () => trigger.kill();
    });

    return () => mm.revert();
  }, [reducedMotion]);

  return (
    <>
      {/* DESKTOP: real scroll, sticky live system interface */}
      <section
        ref={wrapperRef}
        id="systemy-hero"
        className={`relative bg-brand-black ${reducedMotion ? "hidden" : "hidden lg:block"}`}
      >
        <div className="grid grid-cols-[minmax(280px,28vw)_1fr] gap-x-4 md:gap-x-6 pl-6 md:pl-12">
          {/* Copy column — normal document flow, no pinning, no crossfade */}
          <div className="flex flex-col pt-40 pb-32">
            {BLOCKS.map((block, i) => {
              const Heading = i === 0 ? "h1" : "h2";
              return (
                <div key={i} className="hero-block min-h-[85vh] flex flex-col justify-center max-w-md">
                  {block.eyebrow && (
                    <div className="flex items-center gap-3 mb-8">
                      <span className="w-1.5 h-1.5 bg-white/40" />
                      <span className="font-mono text-xs text-white/40 tracking-[0.25em] uppercase">{block.eyebrow}</span>
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

          {/* Visual column — sticky, panoramic, escapes the content container */}
          <div className="relative">
            <div className="sticky top-[14vh]">
              <div className="ml-auto" style={{ width: "clamp(900px, 68vw, 1500px)" }}>
                <SystemShots activeIndex={activeShot} className="aspect-video" />
                <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">
                  {t.caption}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE / REDUCED MOTION: simpler layout — each block gets its own
          matching screen right above its copy. */}
      <section className={`relative bg-brand-black px-6 pt-32 pb-20 ${reducedMotion ? "" : "lg:hidden"}`}>
        {BLOCKS.map((block, i) => (
          <React.Fragment key={i}>
            <SystemShots activeIndex={i} className="aspect-video my-4" />
            <BlockContent block={block} isFirst={i === 0} ctaLabel={t.ctaLabel} />
          </React.Fragment>
        ))}
      </section>
    </>
  );
};

const BlockContent = ({ block, isFirst, ctaLabel }) => (
  <div className="py-8 max-w-lg">
    {block.eyebrow && (
      <div className="flex items-center gap-3 mb-6">
        <span className="w-1.5 h-1.5 bg-white/40" />
        <span className="font-mono text-xs text-white/40 tracking-[0.25em] uppercase">{block.eyebrow}</span>
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

export default HeroSystems;

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";
import imageSizes from "../../data/projectImageSizes.json";
gsap.registerPlugin(ScrollTrigger);
// One frame of the live system interface per hero text block — scrolling
// through the copy on the left steps through the corresponding screen on the
// right, so the "system" visibly changes as the visitor reads.
const SYSTEM_SHOTS = [
  { webp: "/2_systemy/systemy_hero/1_dashboard.webp", label: "Dashboard" },
  { webp: "/2_systemy/systemy_hero/2_wiadomosci.webp", label: "Wiadomości" },
  { webp: "/2_systemy/systemy_hero/3_agenci.webp", label: "Agenci" },
];
const Arrow = () => (
  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14m-7-7l7 7-7 7" />
  </svg>
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
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
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
    return () => mm.revert();
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
  // One responsive layout (copy and screenshots are in the HTML once). Phone / reduced motion: a single
  // column, each text block with its own screen right above it. lg and up (with motion): a two-column
  // grid, the three text blocks on the left; the three screens sit on top of each other in one cell on
  // the right (each sticky) and crossfade as the visitor scrolls. `L()` drops the lg: classes under
  // reduced motion, which keeps the single-column layout at any width.
  const L = (classes) => (reducedMotion ? "" : classes);
  const ROW = ["lg:row-start-1", "lg:row-start-2", "lg:row-start-3"];
  const SHOT_BOX = "lg:col-start-2 lg:row-start-1 lg:row-span-3 lg:sticky lg:self-start lg:justify-self-end lg:w-[clamp(900px,68vw,1500px)]";
  return (
    <section
      ref={wrapperRef}
      id="systemy-hero"
      className={`relative bg-brand-black px-6 pt-32 pb-20 flex flex-col ${L("lg:grid lg:grid-cols-[minmax(280px,28vw)_1fr] lg:gap-x-6 lg:px-0 lg:pl-12 lg:pt-0 lg:pb-0")}`}
    >
      {BLOCKS.map((block, i) => {
        const Heading = i === 0 ? "h1" : "h2";
        const shot = SYSTEM_SHOTS[i];
        const size = imageSizes[shot.webp];
        return (
          <React.Fragment key={i}>
            <figure
              className={`relative aspect-video my-4 rounded-xl border border-white/10 bg-black overflow-hidden ${L(
                `${SHOT_BOX} lg:top-[14vh] lg:my-0 transition-opacity duration-700 ease-out ${activeShot === i ? "lg:opacity-100" : "lg:opacity-0"}`
              )}`}
            >
              <img
                src={shot.webp}
                alt={shot.label}
                width={size?.width}
                height={size?.height}
                loading={i === 0 ? "eager" : "lazy"}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </figure>
            <div
              className={`hero-block py-8 max-w-lg ${L(
                `lg:py-0 lg:min-h-[85vh] lg:flex lg:flex-col lg:justify-center lg:max-w-md lg:col-start-1 ${ROW[i]}`
              )} ${i === 0 ? L("lg:mt-40") : ""} ${i === BLOCKS.length - 1 ? L("lg:mb-32") : ""}`}
            >
              {block.eyebrow && (
                <div className={`flex items-center gap-3 mb-6 ${L("lg:mb-8")}`}>
                  <span className="w-1.5 h-1.5 bg-white/40" />
                  <span className="font-mono text-xs text-white/40 tracking-[0.25em] uppercase">{block.eyebrow}</span>
                </div>
              )}
              <Heading
                className={`text-[clamp(2rem,8vw,3rem)] font-black tracking-[-0.02em] leading-[1.1] mb-5 ${L(
                  "lg:text-[clamp(1.9rem,2.6vw,2.9rem)] lg:leading-[1.12] lg:mb-6"
                )}`}
              >
                {block.heading.map((line, li) => (
                  <span key={li} className="block">
                    {line}{" "}
                  </span>
                ))}
              </Heading>
              <p className={`text-base text-white/55 leading-relaxed mb-6 ${L("lg:mb-8")}`}>{block.copy}</p>
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
          </React.Fragment>
        );
      })}
      {!reducedMotion && (
        <p
          className={`hidden lg:block text-[10px] font-mono uppercase tracking-[0.2em] text-white/20 ${SHOT_BOX} lg:top-[calc(14vh_+_clamp(900px,68vw,1500px)*0.5625_+_0.75rem)]`}
        >
          {t.caption}
        </p>
      )}
    </section>
  );
};
export default HeroSystems;
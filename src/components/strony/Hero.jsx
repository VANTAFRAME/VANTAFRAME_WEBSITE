import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_WEBM = "/videos/vantavision-showcase.webm";
const VIDEO_MP4 = "/videos/vantavision-showcase.mp4";
const VIDEO_POSTER = "/videos/vantavision-poster.jpg";

// The panoramic showcase is a preloaded frame sequence drawn to a <canvas>,
// not a scrubbed <video> — seeking video.currentTime on every scroll tick is
// unreliable across browsers/hardware; swapping cached images is always instant.
const FRAME_COUNT = 49;
const frameUrl = (i) => `/videos/frames/f_${String(i + 1).padStart(3, "0")}.webp`;
const FRAME_WIDTH = 1440;
const FRAME_HEIGHT = 900;

const BrowserChrome = () => (
  <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-black/40">
    <span className="w-2 h-2 rounded-full bg-white/15" />
    <span className="w-2 h-2 rounded-full bg-white/15" />
    <span className="w-2 h-2 rounded-full bg-white/15" />
    <span className="ml-2 flex-1 max-w-[220px] h-5 rounded-full bg-white/[0.03] border border-white/8 flex items-center px-3">
      <span className="text-[9px] font-mono text-white/30 tracking-wider truncate">vantavision.pl</span>
    </span>
    <span className="hidden sm:block ml-auto text-[9px] font-mono text-white/20 tracking-widest">1440 × 900</span>
  </div>
);

const Arrow = () => (
  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14m-7-7l7 7-7 7" />
  </svg>
);

const HeroWebsites = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].stronyPage.hero;

  const BLOCKS = t.blocks.map((block, i) => ({
    ...block,
    eyebrow: i === 0 ? t.eyebrow : undefined,
    cta: i === 0,
  }));

  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const lastFrameIndexRef = useRef(-1);

  const [reducedMotion, setReducedMotion] = useState(false);

  useLayoutEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Subtle reveal the first time each text block enters the viewport. Kept as
  // a self-contained effect (rather than the sitewide data-reveal/IO system)
  // so it never mutates this React tree's DOM ahead of hydration.
  useEffect(() => {
    const blocks = document.querySelectorAll("#hero .hero-block");
    if (!blocks.length) return undefined;
    const prefersReducedMotionReveal = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotionReveal) return undefined;

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

  // Panoramic showcase progress is driven by the scroll distance of the whole
  // hero — i.e. by the three text blocks the user actually scrolls through,
  // not by an artificial per-block state machine.
  useEffect(() => {
    if (reducedMotion) return undefined;
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return undefined;

    const ctx2d = canvas.getContext("2d");
    canvas.width = FRAME_WIDTH;
    canvas.height = FRAME_HEIGHT;

    const drawFrame = (index) => {
      const img = framesRef.current[index];
      if (img && img.complete && index !== lastFrameIndexRef.current) {
        ctx2d.drawImage(img, 0, 0, FRAME_WIDTH, FRAME_HEIGHT);
        lastFrameIndexRef.current = index;
      }
    };

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // Only fetch frames once we're actually on the desktop breakpoint, so
      // mobile viewports never trigger this download.
      if (framesRef.current.length === 0) {
        for (let i = 0; i < FRAME_COUNT; i++) {
          const img = new Image();
          img.src = frameUrl(i);
          framesRef.current[i] = img;
        }
        framesRef.current[0].onload = () => drawFrame(0);
      }

      const trigger = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const frameIndex = Math.min(FRAME_COUNT - 1, Math.round(self.progress * (FRAME_COUNT - 1)));
          drawFrame(frameIndex);
        },
      });

      return () => trigger.kill();
    });

    return () => mm.revert();
  }, [reducedMotion]);

  return (
    <>
      {/* DESKTOP: real scroll, sticky panoramic showcase */}
      <section
        ref={wrapperRef}
        id="hero"
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
                      {t.cta}
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
                <div className="rounded-xl border border-white/10 bg-black overflow-hidden">
                  <BrowserChrome />
                  <div className="relative w-full aspect-[8/5] bg-black overflow-hidden">
                    <img src={VIDEO_POSTER} alt="VantaVision" className="absolute inset-0 w-full h-full object-cover" />
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
                  </div>
                </div>
                <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">
                  {t.showcaseCaption}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE / REDUCED MOTION: simpler, no sticky, no scroll-driven sequence */}
      <section className={`relative bg-brand-black px-6 pt-32 pb-20 ${reducedMotion ? "" : "lg:hidden"}`}>
        {BLOCKS.map((block, i) => {
          if (i === 1) {
            return (
              <React.Fragment key="visual">
                <div className="rounded-xl border border-white/10 bg-black overflow-hidden my-4">
                  <BrowserChrome />
                  <div className="relative w-full aspect-[8/5] bg-black overflow-hidden">
                    {reducedMotion ? (
                      <img src={VIDEO_POSTER} alt="VantaVision" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <video className="absolute inset-0 w-full h-full object-cover" muted playsInline autoPlay loop preload="metadata" poster={VIDEO_POSTER}>
                        <source src={VIDEO_WEBM} type="video/webm" />
                        <source src={VIDEO_MP4} type="video/mp4" />
                      </video>
                    )}
                  </div>
                </div>
                <BlockContent block={block} ctaText={t.cta} />
              </React.Fragment>
            );
          }
          return <BlockContent key={i} block={block} isFirst={i === 0} ctaText={t.cta} />;
        })}
      </section>
    </>
  );
};

// Same primary heading appears once for the desktop h1; the mobile copy of the
// first block is restyled as a <p> so the document keeps a single <h1>.
const BlockContent = ({ block, isFirst, ctaText }) => (
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
        {ctaText}
        <Arrow />
      </a>
    )}
  </div>
);

export default HeroWebsites;

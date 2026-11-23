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
// The frames are 1440 px wide: a larger canvas would only upscale them (slower, not sharper). Raise this together
// with the frame size (see scripts/build-hero-frames.mjs once a higher-resolution source exists).
const FRAME_NATIVE_WIDTH = 1440;
const frameUrl = (i) => `/videos/frames/f_${String(i + 1).padStart(3, "0")}.webp`;
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
  const [reducedMotion, setReducedMotion] = useState(false);
  const [useVideo, setUseVideo] = useState(false);
  useLayoutEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  // The phone layout plays a short looping video instead of the scroll-driven frame sequence. It is
  // mounted on the client only (the server-rendered HTML has the poster), and only on narrow screens.
  useEffect(() => {
    if (reducedMotion) {
      setUseVideo(false);
      return undefined;
    }
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setUseVideo(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reducedMotion]);
  // Subtle reveal the first time each text block enters the viewport (desktop layout only). Kept as
  // a self-contained effect (rather than the sitewide data-reveal/IO system)
  // so it never mutates this React tree's DOM ahead of hydration.
  useEffect(() => {
    const blocks = document.querySelectorAll("#hero .hero-block");
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
  }, [lang]);
  // Panoramic showcase progress is driven by the scroll distance of the whole hero — i.e. by the three
  // text blocks the user actually scrolls through, not by an artificial per-block state machine.
  //
  // Rendering: the canvas has the size of its container x devicePixelRatio (max 2), so it stays sharp on
  // Retina; frames are drawn "cover"-style. ScrollTrigger only sets the target position; a requestAnimationFrame
  // loop (running only while the hero is in view and the picture is still moving) eases the displayed position
  // towards it and cross-fades the two neighbouring frames by the fractional part. Frames are decoded before
  // use, loaded one at a time nearest-first after the page `load` event; while a frame is missing the last
  // drawn picture stays (no jump to a distant frame).
  useEffect(() => {
    if (reducedMotion) return undefined;
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return undefined;
    const ctx2d = canvas.getContext("2d");
    ctx2d.imageSmoothingEnabled = true;
    ctx2d.imageSmoothingQuality = "high";
    const frames = new Array(FRAME_COUNT).fill(null); // decoded Image objects
    const requested = new Set();
    const state = { target: 0, shown: 0, raf: 0, inView: false, destroyed: false, loading: 0, started: false };
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const k = Math.min(1, FRAME_NATIVE_WIDTH / Math.max(1, canvas.clientWidth * dpr));
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr * k));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr * k));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        ctx2d.imageSmoothingEnabled = true;
        ctx2d.imageSmoothingQuality = "high";
        draw();
      }
    };
    // object-cover: scale to fill the canvas, centred.
    const drawImage = (img, alpha) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx2d.globalAlpha = alpha;
      ctx2d.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };
    const draw = () => {
      const pos = Math.min(FRAME_COUNT - 1, Math.max(0, state.shown));
      const i = Math.floor(pos);
      // Cross-fade only around the middle of the interval (smoothstep over 0.3..0.7): the frames are far apart in
      // time, so a linear blend would show a double image for most of the scroll.
      const t = Math.min(1, Math.max(0, (pos - i - 0.3) / 0.4));
      const frac = t * t * (3 - 2 * t);
      const a = frames[i];
      if (!a) return; // missing frame: keep the last picture
      const b = frac > 0.002 && i + 1 < FRAME_COUNT ? frames[i + 1] : null;
      drawImage(a, 1);
      if (b) drawImage(b, frac);
      ctx2d.globalAlpha = 1;
    };
    const tick = () => {
      state.raf = 0;
      const diff = state.target - state.shown;
      if (Math.abs(diff) < 0.004) state.shown = state.target;
      else state.shown += diff * 0.18;
      draw();
      if (state.inView && state.shown !== state.target) state.raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!state.raf && state.inView) state.raf = requestAnimationFrame(tick);
    };
    // Loads the missing frame nearest to the current position (one at a time), decoding it before use.
    const loadNext = () => {
      if (state.destroyed || state.loading >= 2) return;
      let best = -1;
      let bestDist = Infinity;
      const here = Math.round(state.target);
      for (let i = 0; i < FRAME_COUNT; i++) {
        if (requested.has(i)) continue;
        const d = Math.abs(i - here) + (i < here ? 0.5 : 0); // prefer the frames ahead of the scroll direction
        if (d < bestDist) {
          best = i;
          bestDist = d;
        }
      }
      if (best < 0) return;
      requested.add(best);
      state.loading++;
      const img = new Image();
      img.decoding = "async";
      img.src = frameUrl(best);
      img
        .decode()
        .then(() => {
          frames[best] = img;
          if (Math.abs(best - state.shown) <= 1) {
            draw();
            kick();
          }
        })
        .catch(() => requested.delete(best))
        .finally(() => {
          state.loading--;
          loadNext();
        });
      loadNext();
    };
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      // Only on the desktop breakpoint, so mobile viewports never trigger these downloads.
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);
      // The first frame is part of the first view: fetch it at once; the rest follows after `load`.
      const first = new Image();
      first.src = frameUrl(0);
      requested.add(0);
      first.decode().then(() => {
        frames[0] = first;
        draw();
      }).catch(() => requested.delete(0));
      const startRest = () => {
        state.started = true;
        loadNext();
      };
      if (document.readyState === "complete") startRest();
      else window.addEventListener("load", startRest, { once: true });
      const trigger = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onToggle: (self) => {
          state.inView = self.isActive;
          if (self.isActive) kick();
        },
        onUpdate: (self) => {
          state.target = self.progress * (FRAME_COUNT - 1);
          if (state.started) loadNext();
          kick();
        },
      });
      // The hero is also "in view" before its pinned range starts (it is the first thing on the page).
      const io = new IntersectionObserver(
        (entries) => {
          state.inView = entries.some((e) => e.isIntersecting) || trigger.isActive;
          if (state.inView) kick();
        },
        { rootMargin: "100% 0px" }
      );
      io.observe(wrapper);
      return () => {
        state.destroyed = true;
        trigger.kill();
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("load", startRest);
        if (state.raf) cancelAnimationFrame(state.raf);
        state.raf = 0;
      };
    });
    return () => mm.revert();
  }, [reducedMotion]);
  // One responsive layout (the copy and the visual are in the HTML once). Phone / reduced motion: a
  // single column, the visual between the first and second text block. lg and up (with motion): a
  // two-column grid, the three text blocks on the left and the sticky panoramic showcase on the right.
  // `L()` drops the lg: classes under reduced motion, which keeps the single-column layout at any width.
  const L = (classes) => (reducedMotion ? "" : classes);
  const ORDER = ["order-1", "order-3", "order-4"];
  const ROW = ["lg:row-start-1", "lg:row-start-2", "lg:row-start-3"];
  return (
    <section
      ref={wrapperRef}
      id="hero"
      className={`relative bg-brand-black px-6 pt-32 pb-20 flex flex-col ${L("lg:grid lg:grid-cols-[minmax(280px,28vw)_1fr] lg:gap-x-6 lg:px-0 lg:pl-12 lg:pt-0 lg:pb-0")}`}
    >
      {BLOCKS.map((block, i) => {
        const Heading = i === 0 ? "h1" : "h2";
        return (
          <div
            key={i}
            className={`hero-block py-8 max-w-lg ${ORDER[i]} ${L(
              `lg:order-none lg:py-0 lg:min-h-[85vh] lg:flex lg:flex-col lg:justify-center lg:max-w-md lg:col-start-1 ${ROW[i]}`
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
                {t.cta}
                <Arrow />
              </a>
            )}
          </div>
        );
      })}
      {/* Visual: between the first and second block on a phone; the sticky right column on desktop */}
      <div className={`order-2 my-4 ${L("lg:order-none lg:my-0 lg:col-start-2 lg:row-start-1 lg:row-span-3")}`}>
        <div className={L("lg:sticky lg:top-[14vh]")}>
          <div className={L("lg:ml-auto lg:w-[clamp(900px,68vw,1500px)]")}>
            <div className="rounded-xl border border-white/10 bg-black overflow-hidden">
              <BrowserChrome />
              <div className="relative w-full aspect-[8/5] bg-black overflow-hidden">
                <img src={VIDEO_POSTER} alt="VantaVision" width="1440" height="900" className="absolute inset-0 w-full h-full object-cover" />
                {!reducedMotion && (
                  <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover hidden lg:block" aria-hidden="true" />
                )}
                {useVideo && (
                  <video className="absolute inset-0 w-full h-full object-cover" muted playsInline autoPlay loop preload="metadata" poster={VIDEO_POSTER} aria-hidden="true">
                    <source src={VIDEO_WEBM} type="video/webm" />
                    <source src={VIDEO_MP4} type="video/mp4" />
                  </video>
                )}
              </div>
            </div>
            {!reducedMotion && (
              <p className="hidden lg:block mt-3 text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">{t.showcaseCaption}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroWebsites;
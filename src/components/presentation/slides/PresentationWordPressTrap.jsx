import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { presentationCopy } from "../presentationConfig";
import { presentationMotion, usePresentationMotion } from "../usePresentationMotion";

gsap.registerPlugin(ScrollTrigger);

const PresentationWordPressTrap = () => {
  const rootRef = useRef(null);
  const { scroller, slide, reducedMotion } = usePresentationMotion(rootRef);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !slide || !scroller || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.set(".trap-copy, .trap-card, .trap-chip-row", { autoAlpha: 0, y: 26 });

      ScrollTrigger.create({
        trigger: slide,
        scroller,
        start: "top 68%",
        once: true,
        onEnter: () => {
          gsap.to(".trap-copy", {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: presentationMotion.gsapEnterEase,
          });

          gsap.to(".trap-card", {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: presentationMotion.gsapEnterEase,
          });

          gsap.to(".trap-chip-row", {
            autoAlpha: 1,
            y: 0,
            delay: 0.16,
            duration: 0.65,
            ease: presentationMotion.gsapEnterEase,
          });
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion, scroller, slide]);

  return (
    <div
      ref={rootRef}
      className="grid h-full min-h-0 items-center gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8"
    >
      <div className="trap-copy max-w-[36rem]">
        <p className="presentation-stat-label text-cyan-300/74">WordPress Trap</p>
        <h2 className="presentation-focus-text mt-5 text-[clamp(2.4rem,7vw,5.2rem)] font-black leading-[0.9] text-white">
          CMS, który wygląda tanio w momencie kryzysu.
        </h2>
        <p className="mt-5 max-w-[32rem] text-base leading-relaxed text-white/62 md:text-lg">
          Gdy sprzedaż, formularze i tracking zależą od kaskady wtyczek, każda aktualizacja
          zmienia stronę w ryzyko operacyjne. Zespół nie kupuje przewagi. Kupuje obsługę
          awarii.
        </p>
      </div>

      <div className="presentation-corner-frame relative overflow-hidden px-4 py-4 md:px-6 md:py-6 group/container">
        {!reducedMotion && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 z-0 h-[35%]"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
            }}
            animate={{ top: ["-40%", "140%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          >
            {/* Soft, premium fading tail */}
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-300/15 via-cyan-300/3 to-transparent" />
            
            {/* The laser line: thicker (2px), intense core (cyan-100), heavy multidimensional glow */}
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-cyan-200/90 shadow-[0_0_12px_rgba(34,211,238,0.8),0_0_30px_rgba(34,211,238,0.4),0_0_70px_rgba(34,211,238,0.2)]" />
            
            {/* Core bright spot in the center of the line for a lens flare / CRT effect */}
            <div className="absolute left-1/2 bottom-0 h-[2px] w-1/3 -translate-x-1/2 bg-white shadow-[0_0_15px_rgba(255,255,255,1)] mix-blend-screen" />
          </motion.div>
        )}

        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.02),transparent_32%,rgba(34,211,238,0.05)_64%,transparent)] transition-opacity duration-1000 group-hover/container:opacity-60" />

        <div className="relative z-10 grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-3">
          {presentationCopy.slideTwoRisks.map((risk, index) => (
            <div
              key={risk.title}
              className={[
                "trap-card group relative rounded-[1.35rem] border border-white/10 bg-[#070707] px-3 py-4 md:px-4 md:py-5 transition-all duration-500 hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-[0_12px_40px_rgba(34,211,238,0.08)]",
                index === presentationCopy.slideTwoRisks.length - 1 ? "col-span-2 xl:col-span-1" : "",
              ].join(" ")}
            >
              <div className="absolute inset-0 overflow-hidden rounded-[1.35rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-cyan-300/5 to-transparent" />
              </div>
              
              <div className="relative z-10 mb-4 h-1.5 w-10 rounded-full bg-cyan-300/72 transition-all duration-500 group-hover:w-16 group-hover:bg-cyan-300 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
              <p className="relative z-10 text-lg font-semibold tracking-[-0.05em] text-white transition-colors duration-500 group-hover:text-cyan-50 md:text-xl">
                {risk.title}
              </p>
              <p className="relative z-10 mt-3 text-sm leading-relaxed text-white/58 transition-colors duration-500 group-hover:text-white/80 md:mt-4">{risk.body}</p>
            </div>
          ))}
        </div>

        <div className="trap-chip-row relative z-10 mt-5 hidden flex-wrap gap-2 md:gap-3 sm:flex">
          {presentationCopy.slideTwoChips.map((chip) => (
            <span key={chip} className="presentation-chip flex flex-auto cursor-default items-center justify-center text-center transition-all duration-300 hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-100 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]">
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PresentationWordPressTrap;

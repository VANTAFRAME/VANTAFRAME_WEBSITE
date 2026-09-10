import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePresentationMotion } from "../usePresentationMotion";

const FINAL_TITLE = "VANTAFRAME";
const INITIAL_TITLE = "V#N7A#R4M#";
const SCRAMBLE_CHARS = "VF01#";

const PresentationHeroIntro = () => {
  const rootRef = useRef(null);
  const markRef = useRef(null);
  const titleRef = useRef(null);
  const topLabelRef = useRef(null);
  const dividerRef = useRef(null);
  const subtitleRef = useRef(null);
  const metaRef = useRef(null);
  const intervalRef = useRef(null);
  const hasDecodedRef = useRef(false);
  const [isDecoded, setIsDecoded] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const { reducedMotion } = usePresentationMotion(rootRef);

  useEffect(() => {
    const root = rootRef.current;
    const mark = markRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const meta = metaRef.current;
    const topLabel = topLabelRef.current;
    const divider = dividerRef.current;

    if (!root || !mark || !title || !subtitle || !meta || !topLabel || !divider) return undefined;

    const cleanupTasks = [];

    const driftTween = !reducedMotion
      ? gsap.to(mark, {
          xPercent: 2,
          yPercent: -3,
          duration: 18,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      : null;

    if (driftTween) cleanupTasks.push(() => driftTween.kill());

    if (!reducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const moveX = gsap.quickTo(mark, "x", { duration: 1.1, ease: "power2.out" });
      const moveY = gsap.quickTo(mark, "y", { duration: 1.1, ease: "power2.out" });
      const handleMove = (event) => {
        const x = (event.clientX / window.innerWidth - 0.5) * -28;
        const y = (event.clientY / window.innerHeight - 0.5) * -18;
        moveX(x);
        moveY(y);
      };

      root.addEventListener("pointermove", handleMove, { passive: true });
      cleanupTasks.push(() => root.removeEventListener("pointermove", handleMove));
    }

    if (!hasDecodedRef.current && !isDecoded) {
      gsap.set([mark, topLabel, divider, subtitle, meta], { autoAlpha: 0, y: 16 });
      title.textContent = INITIAL_TITLE;
      document.body.classList.add("presentation-locked");
    }

    cleanupTasks.push(() => window.clearInterval(intervalRef.current));

    return () => {
      cleanupTasks.forEach((task) => task());
      document.body.classList.remove("presentation-locked");
    };
  }, [reducedMotion]);

  const handleDecrypt = () => {
    if (isDecrypting || isDecoded) return;

    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const meta = metaRef.current;
    const mark = markRef.current;
    const topLabel = topLabelRef.current;
    const divider = dividerRef.current;

    if (!title || !subtitle || !meta || !mark || !topLabel || !divider) return;

    setIsDecrypting(true);

    const revealContent = () => {
      title.textContent = FINAL_TITLE;
      hasDecodedRef.current = true;
      document.body.classList.remove("presentation-locked");
      
      gsap.to(mark, {
        autoAlpha: 0.05,
        y: 0,
        duration: reducedMotion ? 0.01 : 0.8,
        ease: reducedMotion ? "none" : "power2.out",
      });

      gsap.to([topLabel, divider, subtitle, meta], {
        autoAlpha: 1,
        y: 0,
        duration: reducedMotion ? 0.01 : 0.8,
        stagger: reducedMotion ? 0 : 0.08,
        ease: reducedMotion ? "none" : "power2.out",
      });
      setIsDecoded(true);
      setIsDecrypting(false);
    };

    if (reducedMotion) {
      revealContent();
      return;
    }

    let frame = 0;
    const totalFrames = 38;
    window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      const progress = frame / totalFrames;
      const revealProgress = Math.max(0, (progress - 0.1) / 0.9);

      title.textContent = FINAL_TITLE.split("")
        .map((character, index) => {
          if (index < revealProgress * FINAL_TITLE.length) {
            return character;
          }

          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join("");

      frame += 1;

      if (frame > totalFrames) {
        window.clearInterval(intervalRef.current);
        revealContent();
      }
    }, 52);
  };

  return (
    <div
      ref={rootRef}
      className="presentation-hero-intro relative mx-auto flex h-full min-h-0 w-full max-w-[1240px] flex-col justify-between gap-8 overflow-hidden pb-2 md:gap-10 md:pb-4"
    >
      <div ref={markRef} className="presentation-wire-mark opacity-[0.05]">
        <img src="/vf-logo-wireframe.png" alt="" aria-hidden="true" />
      </div>

      <div className="presentation-hero-intro__copy relative z-10 mx-auto flex flex-1 w-full max-w-[1120px] flex-col items-center justify-center text-center">
        <p ref={topLabelRef} className="presentation-stat-label text-cyan-300/82 opacity-0">
          Nowoczesny Standard Webowy dla Liderów
        </p>
        
        <h1
          ref={titleRef}
          onClick={!isDecoded ? handleDecrypt : undefined}
          data-cursor-label={!isDecoded ? "ODSZYFRUJ" : undefined}
          className={`presentation-focus-text mt-5 text-[clamp(3.3rem,11vw,9.4rem)] font-black uppercase leading-[0.82] text-white ${!isDecoded ? "cursor-hover cursor-pointer" : ""}`}
        >
          {INITIAL_TITLE}
        </h1>
        
        <div ref={dividerRef} className="presentation-divider mt-6 max-w-[18rem] md:mt-8 md:max-w-[22rem] opacity-0" />

        <div className="mt-6 flex flex-col items-center gap-5 md:mt-8 md:gap-6">
          <p
            ref={subtitleRef}
            className="max-w-[36rem] text-base leading-relaxed text-white/64 opacity-0 md:text-xl"
          >
            Astro-first. Headless-ready. Zaprojektowane dla marek, które chcą sprzedawać
            szybciej i wyglądać jak lider.
          </p>
        </div>
      </div>

      <div ref={metaRef} className="presentation-hero-intro__meta relative z-10 mx-auto grid w-full max-w-[1120px] gap-3 opacity-0 sm:grid-cols-3 md:gap-4">
        {["Astro / Headless", "B2B Growth Deck", "Premium Brutalism"].map((item) => (
          <button
            key={item}
            type="button"
            className="presentation-corner-frame presentation-ornament-frame flex items-center justify-center p-2.5 md:p-3 focus:outline-none cursor-hover"
            data-cursor-label="EXPLORE"
          >
            <span className="presentation-stat-label text-white/52 m-0 leading-none">{item}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PresentationHeroIntro;

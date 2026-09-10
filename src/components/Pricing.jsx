import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "../lib/useStore";
import { currentLang } from "../i18n/store";
import { languages } from "../i18n/translations";

gsap.registerPlugin(ScrollTrigger);

const ArrowGlyph = ({ className = "" }) => (
  <svg className={`shrink-0 ${className}`.trim()} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M9 24H39" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M27 12L39 24L27 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Pricing = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].pricing;
  const sectionRef = useRef(null);
  const linesRef = useRef(null);
  const panelRef = useRef(null);

  const openContactForm = (event) => {
    event.preventDefault();

    const contactForm = document.getElementById("contact-form");
    const contactSection = document.getElementById("contact");
    const target = contactForm || contactSection;
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.hash = "contact";
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    const linesEl = linesRef.current;
    const panelEl = panelRef.current;
    if (!section || !linesEl || !panelEl) return;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray(".pricing-line", linesEl);
      if (!lines.length) return;

      const masks = lines.map((line) => line.querySelector(".pricing-word-mask"));
      const words = lines.map((line) => line.querySelector(".pricing-word"));
      const arrows = lines.map((line) => line.querySelector(".pricing-arrow"));

      gsap.set(linesEl, { x: 0, autoAlpha: 1 });
      gsap.set(masks, { clipPath: "inset(0 100% 0 0)", autoAlpha: 1 });
      gsap.set(words, { xPercent: 0, autoAlpha: 1 });
      gsap.set(arrows, { x: -22, autoAlpha: 1 });
      gsap.set(panelEl, { xPercent: 115, autoAlpha: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=300%",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const revealStart = 0.08;
      const revealStep = 0.23;
      const revealDuration = 0.68;
      const lastRevealEnd = revealStart + (lines.length - 1) * revealStep + revealDuration;

      lines.forEach((line, index) => {
        const mask = line.querySelector(".pricing-word-mask");
        const word = line.querySelector(".pricing-word");
        const arrow = line.querySelector(".pricing-arrow");
        const startAt = revealStart + index * revealStep;

        if (!mask || !word || !arrow) return;

        tl.to(
          arrow,
          {
            x: () => {
              const sectionRect = section.getBoundingClientRect();
              const arrowRect = arrow.getBoundingClientRect();
              const targetLeft = sectionRect.left + sectionRect.width * 0.86;
              return targetLeft - arrowRect.left;
            },
            duration: revealDuration,
            ease: "power1.inOut",
          },
          startAt
        ).to(
          mask,
          {
            clipPath: "inset(0 0% 0 0)",
            duration: revealDuration,
            ease: "power1.inOut",
          },
          startAt
        );
      });

      tl.to(
        {},
        {
          duration: 0.18,
        }
      )
        .to(
          linesEl,
          {
            x: -130,
            autoAlpha: 0,
            duration: 0.32,
            ease: "power1.out",
          },
          lastRevealEnd + 0.1
        )
        .to(
          panelEl,
          {
            xPercent: 0,
            duration: 0.42,
            ease: "power1.out",
          },
          lastRevealEnd + 0.08
        )
        .set({}, {}, 3.0);
    }, section);

    return () => ctx.revert();
  }, [lang]);

  return (
    <section id="pricing" ref={sectionRef} className="relative h-screen bg-zinc-950 text-white overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-10 w-[46vw] h-[46vw] bg-cyan-400/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[52vw] h-[52vw] bg-white/6 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 h-full max-w-[1800px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="absolute inset-y-0 left-0 flex items-center">
          <div ref={linesRef} className="space-y-3 md:space-y-4">
            {(t.lines || []).map((line, index) => (
              <div key={`${line}-${index}`} className="pricing-line flex items-center gap-3 md:gap-5">
                <ArrowGlyph className="pricing-arrow w-[clamp(3.1rem,8.2vw,6.8rem)] h-[clamp(3.1rem,8.2vw,6.8rem)] text-white/72" />
                <div className="relative">
                  <span className="block text-[clamp(4.4rem,15.2vw,13.6rem)] font-black tracking-[-0.06em] leading-[0.88] whitespace-nowrap opacity-0">
                    {line}
                  </span>
                  <div
                    className="pricing-word-mask absolute inset-0 overflow-hidden will-change-[clip-path]"
                    style={{ clipPath: "inset(0 100% 0 0)" }}
                  >
                    <span className="pricing-word block text-[clamp(4.4rem,15.2vw,13.6rem)] font-black tracking-[-0.06em] leading-[0.88] whitespace-nowrap">
                      {line}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-y-0 right-0 flex items-center">
          <div
            ref={panelRef}
            className="w-[92vw] max-w-[1380px] min-h-[78vh] opacity-0 bg-white text-black rounded-[32px] border border-black/10 shadow-[0_30px_100px_rgba(0,0,0,0.35)] p-8 md:p-14 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-[clamp(2.9rem,7vw,7.2rem)] font-semibold tracking-[-0.03em] leading-[0.92] mb-7 max-w-[18ch]">
                {t.windowTitle}
              </h3>
              <p className="text-lg md:text-2xl text-black/72 leading-[1.35] mb-8 max-w-[40ch]">{t.windowDescription}</p>
            </div>
            <ul className="space-y-4 mb-10">
              {(t.reasons || []).map((reason, idx) => (
                <li key={`${reason}-${idx}`} className="flex items-center gap-4 text-base md:text-2xl text-black/78">
                  <span className="w-2.5 h-2.5 rounded-full bg-black shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
            <a
              href="#contact-form"
              onClick={openContactForm}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-black text-white text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-black/85 transition-colors self-start"
            >
              {t.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

import React, { useEffect, useRef } from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";

const VARIANT_KEYS = {
  strony: "processStrony",
  systemy: "processSystemy",
  automatyzacje: "processAutomatyzacje",
};

const Process = ({ variant = "strony" }) => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang][VARIANT_KEYS[variant] || VARIANT_KEYS.strony];
  const { heading, steps } = t;
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const stepEls = Array.from(section.querySelectorAll(".process-step"));
    const markers = Array.from(section.querySelectorAll(".process-marker"));
    const tagEl = section.querySelector(".process-tag");

    const setActive = (index) => {
      markers.forEach((marker, i) => {
        marker.classList.toggle("text-white", i === index);
        marker.classList.toggle("text-white/25", i !== index);
      });
      const active = stepEls[index];
      if (tagEl && active) tagEl.textContent = active.getAttribute("data-tag") || "";
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-step"));
            setActive(index);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    stepEls.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, [lang, variant]);

  return (
    <section ref={sectionRef} className="process-sticky px-6 md:px-12 max-w-[1700px] mx-auto py-16 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-12 lg:gap-20">
        <div className="lg:sticky lg:top-32 h-fit" data-reveal>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[0.95]">
            {heading[0]}<br />{heading[1]}
          </h2>

          <div className="flex flex-wrap items-center gap-x-1 gap-y-2 mb-6">
            {steps.map((step, i) => (
              <React.Fragment key={step.n}>
                <span className="process-marker font-mono text-xs tracking-widest text-white/25 transition-colors duration-300" data-marker={i}>
                  {step.n}
                </span>
                {i < steps.length - 1 && <span className="text-white/15 text-xs">——</span>}
              </React.Fragment>
            ))}
          </div>

          <div className="border border-white/10 px-4 py-3 w-fit">
            <span className="process-tag font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/80">{steps[0].tag}</span>
          </div>
        </div>

        <div className="flex flex-col">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className="process-step border-t border-white/10 first:border-t-0 min-h-[22vh] md:min-h-[26vh] flex flex-col justify-center"
              data-step={i}
              data-tag={step.tag}
            >
              <span className="font-mono text-xs text-white/30 mb-4">{step.n} / {steps.length.toString().padStart(2, "0")}</span>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{step.title}</h3>
              <p className="text-base md:text-lg text-white/55 leading-relaxed max-w-xl">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;

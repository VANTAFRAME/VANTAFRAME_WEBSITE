import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { presentationCopy } from "../presentationConfig";
import { presentationMotion, usePresentationMotion } from "../usePresentationMotion";

gsap.registerPlugin(ScrollTrigger);

const moduleDescriptions = {
  "Astro Frontend":
    "Błyskawiczny shell strony z selektywnie ładowaną interaktywnością.",
  "Headless Content":
    "Treść odłączona od renderingu, gotowa do skalowania bez naruszania wydajności.",
  "API Integrations":
    "Formularze, CRM i automatyzacje podpinane tam, gdzie wzmacniają proces sprzedaży.",
};

const clamp = gsap.utils.clamp(0, 1);

const PresentationParadigm = () => {
  const rootRef = useRef(null);
  const { scroller, slide, reducedMotion } = usePresentationMotion(rootRef);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !slide || !scroller) return undefined;

    const cleanupCallbacks = [];
    const addCleanup = (callback) => {
      cleanupCallbacks.push(callback);
    };

    const ctx = gsap.context(() => {
      const system = root.querySelector(".paradigm-system");
      const pulseLayer = root.querySelector(".paradigm-pulse-layer");
      const pulseBand = root.querySelector(".paradigm-pulse-band");
      const pulseReflection = root.querySelector(".paradigm-pulse-reflection");
      const cards = gsap.utils.toArray(".paradigm-card", root);

      if (!system || cards.length === 0) return;

      const resetCardState = () => {
        cards.forEach((card) => card.style.setProperty("--paradigm-card-active", "0"));
      };

      let resizeObserver;
      let pulseTimeline;
      let pulseDelayTween;
      let hasRevealed = false;

      if (!reducedMotion && pulseLayer && pulseBand && pulseReflection) {
        const pulseState = { position: -0.18, opacity: 0 };
        const geometry = {
          containerWidth: 0,
          bandWidth: 0,
          reflectionWidth: 0,
          cardCenters: [],
        };

        const measure = () => {
          geometry.containerWidth = system.clientWidth;
          geometry.bandWidth = Math.max(240, Math.min(geometry.containerWidth * 0.36, 420));
          geometry.reflectionWidth = geometry.bandWidth * 1.36;
          geometry.cardCenters = cards.map(
            (card) => card.offsetLeft + card.offsetWidth * 0.5,
          );

          pulseBand.style.width = `${geometry.bandWidth}px`;
          pulseReflection.style.width = `${geometry.reflectionWidth}px`;
        };

        const updateCardState = () => {
          if (!geometry.containerWidth || !geometry.cardCenters.length) return;

          const pulseCenter = geometry.containerWidth * pulseState.position;
          const influenceRadius = geometry.bandWidth * 0.64;

          cards.forEach((card, index) => {
            const distance = Math.abs(pulseCenter - geometry.cardCenters[index]);
            const normalized = clamp(1 - distance / influenceRadius);
            const intensity = normalized * normalized * (3 - 2 * normalized);

            card.style.setProperty("--paradigm-card-active", intensity.toFixed(3));
          });
        };

        const renderPulse = () => {
          if (!geometry.containerWidth) measure();

          const translateX =
            geometry.containerWidth * pulseState.position - geometry.bandWidth * 0.5;
          const reflectionTranslateX =
            geometry.containerWidth * pulseState.position - geometry.reflectionWidth * 0.54;

          pulseBand.style.transform = `translate3d(${translateX}px, 0, 0)`;
          pulseReflection.style.transform = `translate3d(${reflectionTranslateX}px, 0, 0)`;
          pulseBand.style.opacity = pulseState.opacity.toFixed(3);
          pulseReflection.style.opacity = (pulseState.opacity * 0.9).toFixed(3);
          updateCardState();
        };

        const startPulse = () => {
          if (pulseTimeline?.isActive()) return;

          measure();
          renderPulse();
          pulseTimeline?.restart(true);
        };

        const pausePulse = () => {
          pulseTimeline?.pause();
        };

        if (typeof ResizeObserver !== "undefined") {
          resizeObserver = new ResizeObserver(() => {
            measure();
            renderPulse();
          });
          resizeObserver.observe(system);
        }

        pulseTimeline = gsap.timeline({
          paused: true,
          repeat: -1,
          onUpdate: renderPulse,
          onRepeat: () => {
            pulseState.position = -0.18;
            pulseState.opacity = 0;
            renderPulse();
          },
        });

        pulseTimeline
          .to(pulseState, {
            position: -0.02,
            opacity: 0.28,
            duration: 0.5,
            ease: "sine.out",
          })
          .to(
            pulseState,
            {
              position: 1.02,
              opacity: 0.28,
              duration: 3.9,
              ease: "none",
            },
            ">",
          )
          .to(pulseState, {
            position: 1.14,
            opacity: 0,
            duration: 0.55,
            ease: "sine.in",
          });

        measure();
        renderPulse();
        resetCardState();

        gsap.set(".paradigm-pulse-layer", { autoAlpha: 0 });

        ScrollTrigger.create({
          trigger: slide,
          scroller,
          start: "top bottom",
          end: "bottom top",
          onEnter: () => {
            if (!hasRevealed) return;

            pulseDelayTween?.kill();
            startPulse();
          },
          onEnterBack: () => {
            if (!hasRevealed) return;

            pulseDelayTween?.kill();
            startPulse();
          },
          onLeave: pausePulse,
          onLeaveBack: pausePulse,
        });

        addCleanup(() => {
          resizeObserver?.disconnect();
          pulseDelayTween?.kill();
          pausePulse();
          pulseTimeline?.kill();
          resetCardState();
        });

        gsap.set(".paradigm-copy", { autoAlpha: 0, y: 26 });
        gsap.set(".paradigm-system", { autoAlpha: 0, y: 18 });
        gsap.set(".paradigm-line", { scaleX: 0, transformOrigin: "left center" });
        gsap.set(".paradigm-card", { autoAlpha: 0, y: 15 });

        ScrollTrigger.create({
          trigger: slide,
          scroller,
          start: "top 68%",
          once: true,
          onEnter: () => {
            hasRevealed = true;

            const revealTimeline = gsap.timeline();

            revealTimeline.to(".paradigm-copy", {
              autoAlpha: 1,
              y: 0,
              duration: 0.78,
              ease: presentationMotion.gsapEnterEase,
            });

            revealTimeline.to(
              ".paradigm-system",
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.84,
                ease: presentationMotion.gsapEnterEase,
              },
              0.08,
            );

            revealTimeline.to(
              ".paradigm-line",
              {
                scaleX: 1,
                duration: 0.95,
                ease: presentationMotion.gsapEnterEase,
              },
              0.16,
            );

            revealTimeline.to(
              ".paradigm-card",
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.82,
                stagger: 0.1,
                ease: presentationMotion.gsapEnterEase,
              },
              0.18,
            );

            revealTimeline.to(
              ".paradigm-pulse-layer",
              {
                autoAlpha: 1,
                duration: 0.36,
                ease: "power2.out",
              },
              0.28,
            );

            pulseDelayTween = gsap.delayedCall(0.24, () => {
              startPulse();
            });
          },
        });

        return;
      }

      gsap.set(".paradigm-copy", { autoAlpha: 0, y: 26 });
      gsap.set(".paradigm-system", { autoAlpha: 0, y: 18 });
      gsap.set(".paradigm-line", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".paradigm-card", { autoAlpha: 0, y: 15 });
      resetCardState();

      ScrollTrigger.create({
        trigger: slide,
        scroller,
        start: "top 68%",
        once: true,
        onEnter: () => {
          const revealTimeline = gsap.timeline();

          revealTimeline.to(".paradigm-copy", {
            autoAlpha: 1,
            y: 0,
            duration: 0.78,
            ease: presentationMotion.gsapEnterEase,
          });

          revealTimeline.to(
            ".paradigm-system",
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.84,
              ease: presentationMotion.gsapEnterEase,
            },
            0.08,
          );

          revealTimeline.to(
            ".paradigm-line",
            {
              scaleX: 1,
              duration: 0.95,
              ease: presentationMotion.gsapEnterEase,
            },
            0.16,
          );

          revealTimeline.to(
            ".paradigm-card",
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.82,
              stagger: 0.1,
              ease: presentationMotion.gsapEnterEase,
            },
            0.18,
          );
        },
      });

      addCleanup(() => {
        resizeObserver?.disconnect();
        resetCardState();
      });
    }, rootRef);

    return () => {
      cleanupCallbacks.forEach((callback) => callback());
      ctx.revert();
    };
  }, [reducedMotion, scroller, slide]);

  return (
    <div
      ref={rootRef}
      className="relative grid h-full min-h-0 items-center gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8"
    >
      <div className="presentation-wire-mark opacity-[0.045]">
        <img src="/vf-logo-wireframe.png" alt="" aria-hidden="true" />
      </div>

      <div className="paradigm-copy relative z-10 max-w-[35rem]">
        <p className="presentation-stat-label text-cyan-300/78">Jamstack + Headless</p>
        <h2 className="presentation-focus-text mt-5 text-[clamp(2.4rem,7vw,5.4rem)] font-black leading-[0.9] text-white">
          Ten sam cel sprzedażowy. Zupełnie inna architektura.
        </h2>
        <p className="mt-5 text-base leading-relaxed text-white/62 md:text-lg">
          Frontend renderowany z wyprzedzeniem, headlessowy model treści i integracje tylko tam,
          gdzie są potrzebne. Rezultat: mniej zależności, mniej tarcia i dużo więcej kontroli nad
          doświadczeniem marki.
        </p>
      </div>

      <div className="presentation-corner-frame presentation-corner-frame--cyan paradigm-system relative z-10 overflow-hidden px-4 py-6 md:px-6 md:py-8">
        {!reducedMotion && (
          <div className="paradigm-pulse-layer absolute inset-0 pointer-events-none">
            <div className="paradigm-pulse-reflection absolute inset-y-2 left-0" />
            <div className="paradigm-pulse-band absolute inset-y-5 left-0" />
          </div>
        )}

        <div className="paradigm-line absolute left-8 right-8 top-[3.7rem] hidden h-px bg-cyan-300/60 shadow-[0_0_16px_rgba(34,211,238,0.18)] xl:block" />
        <div className="relative z-10 grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-3">
          {presentationCopy.slideThreeModules.map((module, index) => (
            <div
              key={module}
              style={{ WebkitFontSmoothing: "antialiased", transformStyle: "preserve-3d" }}
              className={[
                "paradigm-card group relative overflow-hidden rounded-[1.45rem] border px-4 py-5 transition-all duration-300 ease-out hover:scale-[1.04] md:px-5 md:py-6",
                index === presentationCopy.slideThreeModules.length - 1 ? "col-span-2 xl:col-span-1" : "",
              ].join(" ")}
            >
              <div className="paradigm-card__surface absolute inset-0" />
              <div className="paradigm-card__accent relative z-10 mb-4 h-1.5 w-10 rounded-full md:h-2 md:w-12" />
              <p className="relative z-10 text-lg font-bold tracking-[-0.05em] text-white md:text-[1.55rem]">
                {module}
              </p>
              <p className="relative z-10 mt-4 text-sm leading-relaxed text-white/58 transition-colors duration-300 ease-out group-hover:text-white/80">
                {moduleDescriptions[module]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PresentationParadigm;

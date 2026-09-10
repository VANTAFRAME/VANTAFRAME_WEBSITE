import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { presentationMotion, usePresentationMotion } from "../usePresentationMotion";

gsap.registerPlugin(ScrollTrigger);

const metricItems = [
  {
    value: "0 KB",
    label: "Astro Islands",
    body: "Zero zbędnego JavaScriptu na starcie. Interaktywność trafia tylko tam, gdzie jest naprawdę potrzebna.",
  },
  {
    value: "CDN",
    label: "Statyczna dystrybucja",
    body: "Wyrenderowany HTML trafia bezpośrednio do globalnej sieci, skracając drogę do użytkownika.",
  },
  {
    value: "CWV",
    label: "Core Web Vitals",
    body: "Szybkość, stabilność i responsywność są projektowane na poziomie architektury, nie poprawiane po wdrożeniu.",
  },
];

const renderMetricValue = (value) => {
  if (value === "0 KB") {
    return (
      <>
        <span className="lighthouse-metrics__card-value-number">0</span>
        <span className="lighthouse-metrics__card-value-unit">KB</span>
      </>
    );
  }

  return value;
};

const LighthouseMetrics = () => {
  const rootRef = useRef(null);
  const scoreRef = useRef(null);
  const ringRef = useRef(null);
  const glowRingRef = useRef(null);
  const completeRingRef = useRef(null);
  const completeGlowRingRef = useRef(null);
  const statRefs = useRef([]);
  const playedRef = useRef(false);
  const { scroller, slide, reducedMotion } = usePresentationMotion(rootRef);

  useEffect(() => {
    const circle = ringRef.current;
    const glowCircle = glowRingRef.current;
    const completeCircle = completeRingRef.current;
    const completeGlowCircle = completeGlowRingRef.current;
    const scoreNode = scoreRef.current;
    if (!circle || !glowCircle || !completeCircle || !completeGlowCircle || !scoreNode) {
      return undefined;
    }

    const circumference = 2 * Math.PI * 104;
    const dashPattern = `${circumference} ${circumference}`;
    const glowOpacity = 0.58;
    const completionBlendStart = 0.9;

    const setCompletionBlend = (progress) => {
      const blend = Math.max(
        0,
        Math.min(1, (progress - completionBlendStart) / (1 - completionBlendStart)),
      );

      circle.style.opacity = `${1 - blend}`;
      glowCircle.style.opacity = `${glowOpacity * (1 - blend)}`;
      completeCircle.style.opacity = `${blend}`;
      completeGlowCircle.style.opacity = `${glowOpacity * blend}`;
    };

    const setRingProgress = (value) => {
      const progress = Math.max(0, Math.min(1, value / 100));

      [circle, glowCircle].forEach((node) => {
        node.style.strokeDasharray = dashPattern;
        node.style.strokeDashoffset = `${Math.max(0, circumference * (1 - progress))}`;
      });

      setCompletionBlend(progress);
    };

    const setScoreVisual = (value) => {
      const safeValue = Math.max(0, Math.min(100, value));

      scoreNode.textContent = `${Math.round(safeValue)}`;
      setRingProgress(safeValue);
    };

    [circle, glowCircle].forEach((node) => {
      node.style.strokeDasharray = dashPattern;
      node.style.strokeDashoffset = `${circumference}`;
    });
    completeCircle.style.opacity = "0";
    completeGlowCircle.style.opacity = "0";

    if (reducedMotion) {
      setScoreVisual(100);
    } else {
      setScoreVisual(0);
    }

    statRefs.current.forEach((item) => {
      if (!item) return;
      item.style.opacity = reducedMotion ? "1" : "0";
      item.style.transform = reducedMotion ? "translateY(0px)" : "translateY(18px)";
    });

    if (!slide || !scroller || reducedMotion) return undefined;

    const counter = { value: 0 };
    const trigger = ScrollTrigger.create({
      trigger: slide,
      scroller,
      start: "top 62%",
      once: true,
      onEnter: () => {
        if (playedRef.current) return;
        playedRef.current = true;

        gsap.to(counter, {
          value: 100,
          duration: 1.45,
          ease: "none",
          onUpdate: () => {
            setScoreVisual(counter.value);
          },
          onComplete: () => {
            setScoreVisual(100);
          },
        });

        gsap.to(statRefs.current, {
          autoAlpha: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.75,
          ease: presentationMotion.gsapEnterEase,
        });
      },
    });

    return () => trigger.kill();
  }, [reducedMotion, scroller, slide]);

  return (
    <div
      ref={rootRef}
      className="lighthouse-metrics grid items-stretch gap-4 xl:grid-cols-[minmax(19rem,0.95fr)_minmax(21rem,1.05fr)] xl:gap-5"
    >
      <div className="presentation-corner-frame lighthouse-metrics__circle-frame flex min-h-[18rem] items-center justify-center px-4 py-5 md:min-h-[22rem] md:px-7">
        <div className="lighthouse-metrics__circle-shell relative flex h-full w-full items-center justify-center">
          <div className="lighthouse-metrics__circle-label lighthouse-metrics__circle-label--top">
            Google Lighthouse
          </div>

          <div className="lighthouse-metrics__circle-stage relative flex h-[13rem] w-[13rem] items-center justify-center md:h-[17.25rem] md:w-[17.25rem] xl:h-[18rem] xl:w-[18rem]">
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 260 260">
              <circle
                cx="130"
                cy="130"
                r="104"
                fill="none"
                stroke="rgba(212,212,216,0.14)"
                strokeWidth="12"
              />
              <circle
                ref={completeGlowRingRef}
                cx="130"
                cy="130"
                r="104"
                fill="none"
                stroke="rgba(34,211,238,0.24)"
                strokeWidth="14"
                className="lighthouse-metrics__ring-glow lighthouse-metrics__ring-glow--complete"
                style={{ opacity: 0 }}
              />
              <circle
                ref={completeRingRef}
                cx="130"
                cy="130"
                r="104"
                fill="none"
                stroke="#22D3EE"
                strokeWidth="12"
                className="lighthouse-metrics__ring lighthouse-metrics__ring--complete"
                style={{ opacity: 0 }}
              />
              <circle
                ref={glowRingRef}
                cx="130"
                cy="130"
                r="104"
                fill="none"
                stroke="rgba(34,211,238,0.24)"
                strokeWidth="14"
                strokeLinecap="round"
                className="lighthouse-metrics__ring-glow"
              />
              <circle
                ref={ringRef}
                cx="130"
                cy="130"
                r="104"
                fill="none"
                stroke="#22D3EE"
                strokeWidth="12"
                strokeLinecap="round"
                className="lighthouse-metrics__ring"
              />
            </svg>

            <div className="lighthouse-metrics__score-wrap text-center">
              <div
                ref={scoreRef}
                className="lighthouse-metrics__score text-[clamp(3.8rem,7vw,6.3rem)] font-black tracking-[-0.08em] text-white"
              >
                100
              </div>
            </div>
          </div>

          <div className="lighthouse-metrics__circle-label lighthouse-metrics__circle-label--bottom">
            Performance • SEO • Best Practices
          </div>
        </div>
      </div>

      <div className="lighthouse-metrics__cards grid grid-cols-1 gap-3 md:gap-4 xl:grid-cols-1">
        {metricItems.map((item, index) => (
          <div
            key={item.label}
            ref={(node) => {
              statRefs.current[index] = node;
            }}
            className="presentation-corner-frame lighthouse-metrics__card grid gap-2 px-4 py-4 md:grid-cols-[6.6rem_minmax(0,1fr)] md:gap-4 md:px-6 md:py-6"
          >
            <div className="lighthouse-metrics__card-value text-[1.7rem] font-bold tracking-[-0.06em] text-white md:text-[2.35rem]">
              {renderMetricValue(item.value)}
            </div>
            <div className="lighthouse-metrics__card-copy">
              <div className="presentation-stat-label lighthouse-metrics__card-label text-cyan-300/75">
                {item.label}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/62 md:mt-4 md:text-base">
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LighthouseMetrics;

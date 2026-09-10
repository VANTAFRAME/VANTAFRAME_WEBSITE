import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { presentationCopy } from "../presentationConfig";
import { usePresentationMotion } from "../usePresentationMotion";

gsap.registerPlugin(ScrollTrigger);

const thresholds = [0.12, 0.35, 0.58, 0.84];
const staggerClasses = [
  "xl:translate-y-0",
  "xl:translate-y-8",
  "xl:-translate-y-2",
  "xl:translate-y-10",
];

const WorkflowTimeline = () => {
  const rootRef = useRef(null);
  const svgRef = useRef(null);
  const activePathRef = useRef(null);
  const basePathRef = useRef(null);
  const cardRefs = useRef([]);
  const activeStepRef = useRef(0);
  const [activeStep, setActiveStep] = useState(0);
  const { scroller, slide, reducedMotion } = usePresentationMotion(rootRef);

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const activePath = activePathRef.current;
    const basePath = basePathRef.current;
    if (!root || !svg || !activePath || !basePath || !slide || !scroller) {
      return undefined;
    }

    const pointsToPath = (points) =>
      points
        .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
        .join(" ");

    const measurePath = () => {
      const boardRect = root.getBoundingClientRect();
      const points = cardRefs.current
        .filter(Boolean)
        .map((card) => {
          const rect = card.getBoundingClientRect();
          return {
            x: rect.left - boardRect.left + rect.width * 0.5,
            y: rect.top - boardRect.top + rect.height * 0.5,
          };
        });

      if (points.length !== presentationCopy.workflowSteps.length) return;

      const pathValue = pointsToPath(points);
      basePath.setAttribute("d", pathValue);
      activePath.setAttribute("d", pathValue);

      const totalLength = activePath.getTotalLength();
      activePath.style.strokeDasharray = `${totalLength}`;
      activePath.style.strokeDashoffset = reducedMotion ? "0" : `${totalLength}`;
    };

    measurePath();

    const observer = new ResizeObserver(() => {
      measurePath();
      ScrollTrigger.refresh();
    });

    observer.observe(root);
    cardRefs.current.filter(Boolean).forEach((card) => observer.observe(card));

    if (reducedMotion) {
      activeStepRef.current = thresholds.length - 1;
      setActiveStep(thresholds.length - 1);
      return () => observer.disconnect();
    }

    const trigger = ScrollTrigger.create({
      trigger: slide,
      scroller,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const totalLength = activePath.getTotalLength();
        activePath.style.strokeDashoffset = `${totalLength * (1 - self.progress)}`;

        const nextActive = thresholds.reduce(
          (current, threshold, index) => (self.progress >= threshold ? index : current),
          0,
        );

        if (nextActive !== activeStepRef.current) {
          activeStepRef.current = nextActive;
          setActiveStep(nextActive);
        }
      },
    });

    return () => {
      observer.disconnect();
      trigger.kill();
    };
  }, [reducedMotion, scroller, slide]);

  return (
    <div
      ref={rootRef}
      className="presentation-corner-frame presentation-corner-frame--cyan relative min-h-[24rem] overflow-hidden px-4 py-4 md:min-h-[26rem] md:px-6 md:py-6"
    >
      <svg
        ref={svgRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={basePathRef}
          fill="none"
          stroke="rgba(212,212,216,0.18)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          ref={activePathRef}
          fill="none"
          stroke="#22D3EE"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="drop-shadow(0 0 8px rgba(34,211,238,0.58))"
        />
      </svg>

      <div className="relative z-10 grid gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-4">
        {presentationCopy.workflowSteps.map((step, index) => {
          const isActive = index <= activeStep;
          const isCurrent = index === activeStep;

          return (
            <article
              key={step.title}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className={[
                "relative min-h-[10rem] rounded-[1.55rem] border px-4 py-5 transition-colors duration-300 md:min-h-[12rem] md:px-5 md:py-6",
                staggerClasses[index],
                isActive
                  ? "border-cyan-300/45 bg-cyan-400/[0.07]"
                  : "border-white/10 bg-white/[0.03]",
              ].join(" ")}
            >
              <div
                className={[
                  "mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300",
                  isCurrent
                    ? "border-cyan-300 bg-cyan-300 text-black shadow-[0_0_20px_rgba(34,211,238,0.45)]"
                    : isActive
                      ? "border-cyan-300/45 bg-cyan-300/10 text-cyan-200"
                      : "border-white/16 text-white/48",
                ].join(" ")}
              >
                {index + 1}
              </div>
              <h4 className="text-xl font-bold tracking-[-0.04em] text-white md:text-[1.55rem]">
                {step.title}
              </h4>
              <p className="mt-4 text-sm leading-relaxed text-white/62 md:text-base">
                {step.body}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowTimeline;

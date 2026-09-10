import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { presentationMotion, usePresentationMotion } from "../usePresentationMotion";

gsap.registerPlugin(ScrollTrigger);

const MetricCounter = ({
  value,
  from = 0,
  prefix = "",
  suffix = "",
  label,
  description,
  className = "",
}) => {
  const rootRef = useRef(null);
  const valueRef = useRef(null);
  const playedRef = useRef(false);
  const { scroller, slide, reducedMotion } = usePresentationMotion(rootRef);

  useEffect(() => {
    if (!valueRef.current) return undefined;

    const updateValue = (nextValue) => {
      valueRef.current.textContent = `${prefix}${Math.round(nextValue)}${suffix}`;
    };

    updateValue(reducedMotion ? value : from);

    if (!slide || !scroller || reducedMotion) return undefined;

    const tweenTarget = { value: from };
    const trigger = ScrollTrigger.create({
      trigger: slide,
      scroller,
      start: "top 62%",
      once: true,
      onEnter: () => {
        if (playedRef.current) return;
        playedRef.current = true;

        gsap.to(tweenTarget, {
          value,
          duration: 1.35,
          ease: presentationMotion.gsapEnterEase,
          onUpdate: () => updateValue(tweenTarget.value),
        });

        gsap.fromTo(
          rootRef.current,
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: presentationMotion.gsapEnterEase,
          },
        );
      },
    });

    return () => trigger.kill();
  }, [from, prefix, reducedMotion, scroller, slide, suffix, value]);

  return (
    <div
      ref={rootRef}
      className={`presentation-corner-frame px-5 py-5 md:px-6 md:py-6 ${className}`.trim()}
    >
      <p
        ref={valueRef}
        className="text-[clamp(2.8rem,7vw,6rem)] leading-none font-black tracking-[-0.07em] text-white"
      >
        {`${prefix}${value}${suffix}`}
      </p>
      <p className="mt-4 text-xs uppercase tracking-[0.35em] text-cyan-300/80">{label}</p>
      {description && (
        <p className="mt-4 hidden max-w-[20rem] text-sm leading-relaxed text-white/58 md:block md:text-base">
          {description}
        </p>
      )}
    </div>
  );
};

export default MetricCounter;

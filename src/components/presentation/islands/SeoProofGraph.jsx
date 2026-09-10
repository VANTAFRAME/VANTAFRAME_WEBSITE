import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { presentationMotion, usePresentationMotion } from "../usePresentationMotion";

gsap.registerPlugin(ScrollTrigger);

const seoCallouts = [
  {
    label: "Szybkość = sygnał jakości",
    body: "Google premiuje witryny, które ładują się natychmiast i zachowują stabilny layout.",
  },
  {
    label: "Lepsza indeksacja",
    body: "Statyczny HTML, czysta semantyka i lekka warstwa interakcji skracają drogę crawlera do treści.",
  },
  {
    label: "Organiczna przewaga",
    body: "Techniczny porządek daje lepszy fundament pod content, topical authority i kampanie leadowe.",
  },
];

const seoSeries = [
  {
    label: "Template",
    y: 162,
    stroke: "rgba(212,212,216,0.52)",
    path: "M30 150 C100 150 150 149 220 148 C315 146 405 142 500 138 C585 135 645 133 710 131",
  },
  {
    label: "Vantaframe",
    y: 96,
    stroke: "#22D3EE",
    path: "M30 150 C110 142 175 132 245 120 C330 105 420 89 520 74 C600 63 655 55 710 44",
  },
];

const SeoProofGraph = () => {
  const rootRef = useRef(null);
  const { scroller, slide, reducedMotion } = usePresentationMotion(rootRef);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !slide || !scroller) return undefined;

    const ctx = gsap.context(() => {
      const paths = gsap.utils.toArray(".seo-line", root);
      const callouts = gsap.utils.toArray(".seo-callout", root);
      const axes = gsap.utils.toArray(".seo-axis", root);
      const guides = gsap.utils.toArray(".seo-guide", root);
      const markers = gsap.utils.toArray(".seo-marker", root);
      const labels = gsap.utils.toArray(".seo-series-label", root);

      paths.forEach((path) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = reducedMotion ? "0" : `${length}`;
      });

      if (reducedMotion) {
        gsap.set(callouts, { autoAlpha: 1, y: 0 });
        gsap.set([...axes, ...guides], { scaleX: 1, transformOrigin: "left center" });
        gsap.set(markers, { autoAlpha: 1, scale: 1 });
        gsap.set(labels, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(callouts, { autoAlpha: 0, y: 18 });
      gsap.set([...axes, ...guides], { scaleX: 0, transformOrigin: "left center" });
      gsap.set(markers, { autoAlpha: 0, scale: 0.84, transformOrigin: "center center" });
      gsap.set(labels, { autoAlpha: 0, y: 10 });

      ScrollTrigger.create({
        trigger: slide,
        scroller,
        start: "top 62%",
        once: true,
        onEnter: () => {
          gsap.to(callouts, {
            autoAlpha: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.65,
            ease: presentationMotion.gsapEnterEase,
          });

          gsap.to([...axes, ...guides], {
            scaleX: 1,
            delay: 0.24,
            duration: 0.65,
            stagger: 0.05,
            ease: presentationMotion.gsapEnterEase,
          });

          gsap.to(paths, {
            strokeDashoffset: 0,
            delay: 0.28,
            duration: 1.05,
            stagger: 0.12,
            ease: "power2.out",
          });

          gsap.to(markers, {
            autoAlpha: 1,
            scale: 1,
            delay: 0.7,
            duration: 0.45,
            stagger: 0.08,
            ease: presentationMotion.gsapEmphasisEase,
          });

          gsap.to(labels, {
            autoAlpha: 1,
            y: 0,
            delay: 0.78,
            duration: 0.55,
            stagger: 0.08,
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
      className="presentation-corner-frame flex min-h-[19rem] flex-col gap-6 px-4 py-5 md:px-7 md:py-7"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
        {seoCallouts.map((item) => (
          <div
            key={item.label}
            className="seo-callout presentation-corner-frame flex min-h-[8.75rem] flex-col px-4 py-4 md:px-5 md:py-5"
          >
            <p className="presentation-stat-label text-cyan-300/78">{item.label}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/62 md:mt-4 md:text-[0.96rem]">
              {item.body}
            </p>
          </div>
        ))}
      </div>

      <div className="relative min-h-[12.25rem] overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.018] px-4 py-4 md:min-h-[13.5rem] md:px-6 md:py-5">
        <div className="seo-axis absolute bottom-7 left-5 right-5 h-px bg-gradient-to-r from-transparent via-white/14 to-white/8" />
        <div className="seo-axis absolute left-5 top-5 bottom-7 w-px bg-gradient-to-b from-white/10 to-white/14" />
        <div className="seo-guide absolute left-5 right-5 top-[32%] h-px bg-white/[0.05]" />
        <div className="seo-guide absolute left-5 right-5 top-[57%] h-px bg-white/[0.04]" />
        <div className="absolute inset-x-[10%] bottom-4 h-16 bg-cyan-400/[0.06] blur-3xl" />

        <svg viewBox="0 0 760 190" className="relative z-10 h-[10.75rem] w-full md:h-[11.5rem]">
          {seoSeries.map((series) => (
            <path
              key={series.label}
              className="seo-line"
              d={series.path}
              fill="none"
              stroke={series.stroke}
              strokeWidth={series.label === "Vantaframe" ? "5" : "4"}
              strokeLinecap="round"
              filter={
                series.label === "Vantaframe"
                  ? "drop-shadow(0 0 12px rgba(34,211,238,0.35))"
                  : undefined
              }
            />
          ))}

          {seoSeries.map((series) => (
            <g key={`${series.label}-marker`}>
              <circle
                className="seo-marker"
                cx="710"
                cy={series.y}
                r={series.label === "Vantaframe" ? "6.5" : "5.5"}
                fill={series.stroke}
              />
              <circle
                className="seo-marker"
                cx="710"
                cy={series.y}
                r={series.label === "Vantaframe" ? "12" : "10"}
                fill={series.label === "Vantaframe" ? "rgba(34,211,238,0.14)" : "rgba(212,212,216,0.08)"}
              />
              <text
                className="seo-series-label"
                x="612"
                y={series.y - 12}
                fill={series.stroke}
                fontSize="11"
                letterSpacing="0.26em"
              >
                {series.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default SeoProofGraph;

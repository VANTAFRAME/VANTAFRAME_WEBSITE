import React from "react";
import LighthouseMetrics from "../islands/LighthouseMetrics";

const SlidePerformance = () => (
  <div className="grid h-full min-h-0 items-center gap-4 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-8">
    <div className="max-w-[34rem]">
      <p className="presentation-stat-label text-cyan-300/78">Zero initial JS</p>
      <h2 className="presentation-focus-text mt-4 text-[clamp(2.2rem,6.6vw,5.4rem)] font-black leading-[0.92] text-white">
        Szybkość nie jest featurem. Jest fundamentem decyzji zakupowej.
      </h2>
      <p className="mt-4 text-base leading-relaxed text-white/62 md:mt-5 md:text-lg">
        Astro renderuje gotową powłokę dokumentu, a interaktywne wyspy są hydratowane tylko
        tam, gdzie realnie pracują na konwersję. Dzięki temu pierwsze wrażenie nie czeka na
        aplikację.
      </p>
    </div>

    <LighthouseMetrics />
  </div>
);

export default SlidePerformance;

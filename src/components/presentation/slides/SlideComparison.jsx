import React from "react";
import BespokeComparisonReveal from "../islands/BespokeComparisonReveal";

const SlideComparison = () => (
  <div className="comparison-slide-layout">
    <div className="comparison-slide-layout__copy">
      <p className="presentation-stat-label text-cyan-300/78">Trust by Design</p>
      <h2 className="presentation-focus-text mt-4 text-[clamp(2.2rem,6.6vw,5.4rem)] font-black leading-[0.92] text-white">
        Szablon obniża zaufanie.
      </h2>
      <p className="mt-4 text-base leading-relaxed text-white/62 md:mt-5 md:text-lg">
        Powtarzalna kompozycja i przypadkowe wizualia sprawiają, że marka brzmi jak kolejny
        dostawca bez przewagi. Projekt bespoke porządkuje hierarchię, buduje autorytet i prowadzi
        odbiorcę dokładnie tam, gdzie powinien kliknąć.
      </p>
    </div>

    <div className="comparison-slide-layout__stage">
      <BespokeComparisonReveal />
    </div>
  </div>
);

export default SlideComparison;

import React from "react";
import SeoProofGraph from "../islands/SeoProofGraph";

const SlideSeo = () => (
  <div className="grid h-full min-h-0 items-start gap-5 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-8">
    <div className="max-w-[35rem]">
      <p className="presentation-stat-label text-cyan-300/78">Organic Priority</p>
      <h2 className="presentation-focus-text mt-4 text-[clamp(2.2rem,6.6vw,5.4rem)] font-black leading-[0.92] text-white">
        Lepsza technologia podnosi wartość każdego kliknięcia z Google.
      </h2>
      <p className="mt-4 text-base leading-relaxed text-white/62 md:mt-5 md:text-lg">
        Techniczne SEO nie kończy się na meta tagach. Szybkość, stabilność layoutu i semantyka
        decydują o tym, czy strona dostanie szansę na lepszą widoczność i czy ten ruch zamieni
        się w lead.
      </p>
    </div>

    <div className="lg:mt-20 xl:mt-24">
      <SeoProofGraph />
    </div>
  </div>
);

export default SlideSeo;

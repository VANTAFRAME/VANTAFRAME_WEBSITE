import React from "react";
import { presentationCopy } from "../presentationConfig";
import WorkflowTimeline from "../islands/WorkflowTimeline";

const SlideWorkflow = () => (
  <div className="grid h-full min-h-0 items-start gap-4 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] lg:gap-8">
    <div className="max-w-[34rem] pt-2 md:pt-3">
      <p className="presentation-stat-label text-cyan-300/78">Audit -&gt; UX/UI -&gt; Astro Code -&gt; QA</p>
      <h2 className="presentation-focus-text mt-4 text-[clamp(2.2rem,6.6vw,5.4rem)] font-black leading-[0.92] text-white">
        Proces, który nie zostawia jakości przypadkowi.
      </h2>
      <p className="mt-4 text-base leading-relaxed text-white/62 md:mt-5 md:text-lg">
        Każdy etap ma osobny cel biznesowy i techniczny. Dzięki temu design, kod i wdrożenie
        nie są odrębnymi usługami, tylko jednym ciągiem prowadzącym do większej skuteczności
        strony.
      </p>

      <div className="mt-5 flex flex-wrap gap-3 md:mt-8">
        {["4 etapy", "Astro-first", "QA przed launch"].map((item) => (
          <span key={item} className="presentation-chip">
            {item}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-2 md:mt-8 md:hidden">
        {presentationCopy.workflowSteps.map((step) => (
          <div key={step.title} className="presentation-corner-frame px-4 py-3 text-white/56">
            <p className="presentation-stat-label text-cyan-300/74">{step.title}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="hidden md:block md:mt-4 lg:mt-10 xl:mt-12">
      <WorkflowTimeline />
    </div>
  </div>
);

export default SlideWorkflow;

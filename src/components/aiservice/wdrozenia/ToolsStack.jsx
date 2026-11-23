import React from "react";
import { useService } from "../useService";
import WorkflowDiagram from "../../automatyzacje/WorkflowDiagram";
// "What we build on": heading and one line of intro above the data-flow diagram that was the
// centrepiece of the old /automatyzacje/ hub (models → automation hub → systems → actions).
const ToolsStack = ({ data, slug }) => {
  const { c } = useService(data);
  const { stack } = c;
  return (
    <section id="narzedzia" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <div className="mb-12 md:mb-16" data-reveal>
        <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{stack.eyebrow}</p>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-16 lg:items-end">
          <h2 className="text-3xl font-black leading-[1.05] tracking-tight md:text-5xl xl:text-6xl">
            {stack.heading[0]}
            {" "}<br />
            {stack.heading[1]}
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-white/65 md:text-lg">{stack.intro}</p>
        </div>
      </div>
      <div data-reveal>
        <WorkflowDiagram />
      </div>
    </section>
  );
};
export default ToolsStack;
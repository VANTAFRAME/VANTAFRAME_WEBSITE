import React from "react";
import { useService } from "./useService";
// Right under the hero: the problem, the effect and who the service is for, in three short
// hairline columns. Plain always-visible text (no cards, no animation beyond the usual reveal);
// the copy lives in each service's data file (`valueStrip`). Cyan only marks the effect.
const ValueStrip = ({ data, slug }) => {
  const { c, ui } = useService(data);
  const { valueStrip: v } = c;
  const cols = [
    [ui.valueProblem, v.problem, false],
    [ui.valueEffect, v.effect, true],
    [ui.valueFor, v.audience, false],
  ];
  return (
    <section id="wartosc" aria-label={ui.valueLabel} className="px-6 md:px-12 max-w-[1700px] mx-auto py-14 md:py-20 border-t border-white/10">
      <dl className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-3">
        {cols.map(([label, text, key]) => (
          <div key={label} className="border-t border-white/20 pt-5" data-reveal>
            <dt className={`mb-3 font-mono text-[10px] uppercase tracking-[0.25em] ${key ? "text-cyan-300/85" : "text-white/55"}`}>{label}</dt>
            <dd className={`text-lg leading-snug md:text-xl ${key ? "text-white" : "text-white/75"}`}>{text}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
export default ValueStrip;
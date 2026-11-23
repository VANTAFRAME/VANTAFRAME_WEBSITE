import React from "react";
import { useService } from "../useService";
// "Permissions and approvals": three short columns — allowed automatically / needs approval /
// blocked — as an example configuration, not a universal policy (stated in the intro and the
// badge). Hairline columns with a small marker each; cyan only on the approval marker, the
// same diamond that marks decision points in the scenarios above. Static, no animation.
const Mark = ({ kind }) => {
  if (kind === "approval") return <span aria-hidden="true" className="block h-3 w-3 rotate-45 border border-cyan-300 bg-cyan-300" />;
  if (kind === "blocked")
    return (
      <span aria-hidden="true" className="relative block h-3 w-3 border border-white/50">
        <span className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white/60" />
      </span>
    );
  return <span aria-hidden="true" className="block h-2.5 w-2.5 rounded-full border border-white/55 bg-brand-black" />;
};
const AccessPolicy = ({ data, slug }) => {
  const { c } = useService(data);
  const { access } = c;
  return (
    <section id="uprawnienia" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <div className="mb-12 flex flex-col gap-8 md:mb-16 lg:flex-row lg:items-end lg:justify-between" data-reveal>
        <div>
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{access.eyebrow}</p>
          <h2 className="text-3xl font-black leading-[1.05] tracking-tight md:text-5xl xl:text-6xl">
            {access.heading[0]}
            {" "}<br />
            {access.heading[1]}
          </h2>
        </div>
        <div className="flex max-w-xl flex-col items-start gap-5">
          <p className="text-base leading-relaxed text-white/65 md:text-lg">{access.intro}</p>
          <span className="inline-flex w-fit items-center gap-3 rounded-full border border-white/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
            <span aria-hidden="true" className="h-1.5 w-1.5 bg-white/50" />
            {access.badge}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 border-y border-white/10 md:grid-cols-3">
        {access.columns.map((col, i) => (
          <div key={col.kind} className={`p-7 md:p-9 ${i > 0 ? "border-t border-white/10 md:border-l md:border-t-0" : ""}`} data-reveal>
            <div className="mb-8 flex items-center gap-3">
              <Mark kind={col.kind} />
              <span className={`font-mono text-[10px] uppercase tracking-[0.25em] ${col.kind === "approval" ? "text-cyan-300/90" : "text-white/60"}`}>
                {col.tag}
              </span>
            </div>
            <h3 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">{col.title}</h3>
            <ul className="divide-y divide-white/10 border-t border-white/10">
              {col.items.map((it) => (
                <li key={it} className="py-4 text-base leading-snug text-white/75">
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-10 max-w-2xl border-l border-white/20 pl-5 text-sm leading-relaxed text-white/65 md:text-base" data-reveal>
        {access.foot}
      </p>
    </section>
  );
};
export default AccessPolicy;
import React from "react";
import { useService } from "./useService";
// "What we actually implement": sticky heading on the left, numbered modules on the
// right separated by hairlines. Hover/focus raises contrast; nothing depends on hover.
const Capabilities = ({ data, slug }) => {
  const { c, ui } = useService(data);
  const { capabilities } = c;
  return (
    <section id="co-wdrazamy" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-20">
        <div className="lg:sticky lg:top-32 h-fit" data-reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55 mb-6">{ui.capabilities}</p>
          <h2 className="text-3xl md:text-5xl xl:text-6xl font-black tracking-tight leading-[1.05] mb-6">
            {capabilities.heading[0]}
            {" "}<br />
            {capabilities.heading[1]}
          </h2>
          <p className="text-base md:text-lg text-white/65 leading-relaxed max-w-md">{capabilities.intro}</p>
        </div>
        <ol className="border-t border-white/10 divide-y divide-white/10">
          {capabilities.items.map((item) => (
            <li key={item.n} className="group relative py-7 md:py-9 transition-colors duration-500 hover:bg-white/[0.02]" data-reveal>
              <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] md:grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 md:gap-x-6">
                <span className="font-mono text-xs text-white/50 pt-2">{item.n}</span>
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 mb-3 group-hover:text-cyan-300/80 transition-colors duration-500">
                    {item.tag}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 transition-transform duration-500 group-hover:translate-x-1">
                    {item.title}
                  </h3>
                  <p className="text-base text-white/65 leading-relaxed max-w-xl">{item.desc}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
export default Capabilities;
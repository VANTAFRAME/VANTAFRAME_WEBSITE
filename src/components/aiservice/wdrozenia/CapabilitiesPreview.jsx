import React, { useEffect, useRef, useState } from "react";
import { useService } from "../useService";
import { Diagram, DIAGRAM_CSS } from "./PreviewDiagrams";
// "What an AI project covers": six short items on the left, one pinned preview window on the
// right showing a small diagram of the selected item (the same window frame as the hero
// diagrams). The selection follows hover, keyboard focus and click; until the visitor
// interacts it advances by itself every few seconds while the section is on screen
// (never under prefers-reduced-motion). On small screens every item carries its own finished
// diagram directly underneath, no pinned window. All copy is real, always-visible text;
// the diagrams are decorative.
const AUTO_MS = 3800;
// The three business-level items stay here; the technical ones (architecture, integration,
// quality tests) live lower on the page in TechnicalDetails. `idx` keeps each item's own diagram.
export const BUSINESS_ITEMS = [0, 1, 5];
export const Frame = ({ label, children, className = "" }) => (
  <div className={`rounded-xl border border-white/10 bg-black overflow-hidden ${className}`}>
    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-black/40">
      <span className="w-2 h-2 rounded-full bg-white/15" />
      <span className="w-2 h-2 rounded-full bg-white/15" />
      <span className="w-2 h-2 rounded-full bg-white/15" />
      <span className="ml-2 text-[9px] font-mono text-white/55 tracking-wider truncate">{label}</span>
    </div>
    {children}
  </div>
);
const CapabilitiesPreview = ({ data, slug }) => {
  const { c, ui } = useService(data);
  const { capabilities } = c;
  const list = BUSINESS_ITEMS.map((idx) => ({ item: capabilities.items[idx], idx }));
  const count = list.length;
  const rootRef = useRef(null);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const [calm, setCalm] = useState(false);
  useEffect(() => {
    setCalm(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = rootRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!auto || !inView || calm) return undefined;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % count), AUTO_MS);
    return () => window.clearTimeout(id);
  }, [auto, inView, calm, active, count]);
  const select = (i) => {
    setAuto(false);
    setActive(i);
  };
  const current = list[active].item;
  return (
    <section id="co-wdrazamy" ref={rootRef} className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <style>{DIAGRAM_CSS}</style>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] gap-12 lg:gap-20">
        <div>
          <div className="mb-12 md:mb-14" data-reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55 mb-6">{ui.capabilities}</p>
            <h2 className="text-3xl md:text-5xl xl:text-6xl font-black tracking-tight leading-[1.05] mb-6">
              {capabilities.heading[0]}
              {" "}<br />
              {capabilities.heading[1]}
            </h2>
            <p className="text-base md:text-lg text-white/65 leading-relaxed max-w-md">{capabilities.intro}</p>
          </div>
          <ol className="border-t border-white/10 divide-y divide-white/10">
            {list.map(({ item, idx }, i) => {
              const on = active === i;
              return (
                <li key={item.n} data-reveal>
                  <button
                    type="button"
                    onPointerEnter={(e) => e.pointerType === "mouse" && select(i)}
                    onFocus={() => select(i)}
                    onClick={() => select(i)}
                    aria-current={on ? "true" : undefined}
                    className={`group relative block w-full text-left py-6 md:py-7 pl-5 md:pl-6 pr-2 outline-none transition-colors duration-500 hover:bg-white/[0.02] focus-visible:bg-white/[0.04] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-cyan-300/70`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-6 bottom-6 w-px transition-colors duration-500 ${on ? "bg-cyan-300" : "bg-white/15"}`}
                    />
                    <span className="grid grid-cols-[2.5rem_minmax(0,1fr)] md:grid-cols-[3.5rem_minmax(0,1fr)]">
                      <span className="font-mono text-xs text-white/50 pt-2">{item.n}</span>
                      <span>
                        <span className={`block font-mono text-[10px] uppercase tracking-[0.25em] mb-2 transition-colors duration-500 ${on ? "text-cyan-300/85" : "text-white/50"}`}>
                          {item.tag}
                        </span>
                        <span className={`block text-2xl md:text-3xl font-bold tracking-tight mb-2 transition-colors duration-500 ${on ? "text-white" : "text-white/80"}`}>
                          {item.title}
                        </span>
                        <span className="block text-base text-white/65 leading-relaxed max-w-md">{item.desc}</span>
                      </span>
                    </span>
                  </button>
                  {/* small screens: the finished diagram right under its item */}
                  <div className="lg:hidden pb-7 pl-5">
                    <Frame label={`${capabilities.previewLabel} / ${item.tag}`}>
                      <Diagram index={idx} compact className="block w-full h-auto" />
                    </Frame>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
        {/* large screens: one pinned preview window */}
        <div className="hidden lg:block">
          <div className="sticky top-28" data-reveal>
            <Frame label={`${capabilities.previewLabel} / ${current.tag}`}>
              <div className="relative w-full" style={{ aspectRatio: "440 / 320" }}>
                {list.map(({ item, idx }, i) => (
                  <div
                    key={item.n}
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{ opacity: active === i ? 1 : 0 }}
                    aria-hidden="true"
                  >
                    <Diagram index={idx} on={active === i} className="block h-full w-full" />
                  </div>
                ))}
              </div>
            </Frame>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CapabilitiesPreview;
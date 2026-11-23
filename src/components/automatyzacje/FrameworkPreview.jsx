import React, { useEffect, useRef, useState } from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";
// A preview of the *real* FRAMEWORK interface: four captured screens of the
// live wizard (start, project area, functional scope, summary) that cross-fade
// in sequence. Static images on purpose — embedding the live wizard here would
// pull the whole app (state, storage, analytics events) into a marketing page.
// Screens are in /public/3_automatyzacje/framework/ (1600×1013 WebP).
const SHOTS = [
  "/3_automatyzacje/framework/1-start.webp",
  "/3_automatyzacje/framework/2-obszar.webp",
  "/3_automatyzacje/framework/3-funkcje.webp",
  "/3_automatyzacje/framework/4-podsumowanie.webp",
];
const INTERVAL_MS = 3800;
const FrameworkPreview = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].automatyzacjePage.frameworkPreview;
  const rootRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [index, setIndex] = useState(0);
  const [manual, setManual] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = rootRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!inView || reduced || manual) return undefined;
    const id = setTimeout(() => setIndex((i) => (i + 1) % SHOTS.length), INTERVAL_MS);
    return () => clearTimeout(id);
  }, [inView, reduced, manual, index]);
  const current = t.views[index];
  return (
    <div ref={rootRef} className="w-full">
      <div className="rounded-xl border border-white/12 bg-[#050505] overflow-hidden shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-white/[0.02]">
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="ml-2 text-[10px] font-mono text-white/30 tracking-wider truncate">{t.windowLabel}</span>
          <span className="ml-auto text-[10px] font-mono tracking-[0.18em] text-cyan-300/80">{current.label}</span>
        </div>
        <div className="relative w-full bg-black aspect-[4/4.3] sm:aspect-[1600/1013]">
          {SHOTS.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={t.views[i].alt}
              width="1600"
              height="1013"
              loading="lazy"
              decoding="async"
              aria-hidden={i !== index}
              className="absolute inset-0 h-full w-full object-cover object-left-top sm:object-top transition-opacity duration-700 ease-out"
              style={{ opacity: i === index ? 1 : 0 }}
            />
          ))}
        </div>
        <div className="flex items-center gap-4 border-t border-white/8 bg-white/[0.02] px-4 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 truncate">{current.caption}</span>
          <div className="ml-auto flex items-center gap-2" role="tablist" aria-label={t.windowLabel}>
            {t.views.map((view, i) => (
              <button
                key={view.label}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${view.caption}`}
                onClick={() => {
                  setManual(true);
                  setIndex(i);
                }}
                className="group flex h-6 w-8 items-center justify-center"
              >
                <span className={`h-px w-full transition-colors duration-300 ${i === index ? "bg-cyan-300" : "bg-white/25 group-hover:bg-white/50"}`} style={{ height: i === index ? 2 : 1 }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default FrameworkPreview;
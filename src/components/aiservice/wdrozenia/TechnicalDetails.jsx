import React from "react";
import { useService } from "../useService";
import Disclosure from "../Disclosure";
import { Diagram, DIAGRAM_CSS } from "./PreviewDiagrams";
import { Frame, BUSINESS_ITEMS } from "./CapabilitiesPreview";
// The technical part of "what an AI project covers" (architecture, integration, quality
// tests), moved below the manifesto. The heading and one lead sentence are always visible; the
// three items, each with its finished diagram, sit in a native <details> (text stays in the HTML).
const TechnicalDetails = ({ data, slug }) => {
  const { c } = useService(data);
  const { capabilities } = c;
  const t = capabilities.technical;
  const items = capabilities.items.map((item, idx) => ({ item, idx })).filter(({ idx }) => !BUSINESS_ITEMS.includes(idx));
  return (
    <section id="szczegoly-techniczne" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <style>{DIAGRAM_CSS}</style>
      <div className="mb-10 grid grid-cols-1 items-end gap-8 md:mb-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16" data-reveal>
        <div>
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{t.eyebrow}</p>
          <h2 className="text-3xl font-black leading-[1.05] tracking-tight md:text-5xl xl:text-6xl">
            {t.heading[0]}
            {" "}<br />
            {t.heading[1]}
          </h2>
        </div>
        <p className="max-w-xl text-base leading-relaxed text-white/65 md:text-lg">{t.lead}</p>
      </div>
      <Disclosure label={t.summary}>
        <ol className="grid grid-cols-1 gap-10 border-t border-white/10 pt-8 lg:grid-cols-3 lg:gap-12">
          {items.map(({ item, idx }) => (
            <li key={item.n}>
              <Frame label={`${capabilities.previewLabel} / ${item.tag}`} className="mb-6">
                <Diagram index={idx} compact className="block h-auto w-full" />
              </Frame>
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
                {item.n} · {item.tag}
              </span>
              <h3 className="mb-2 text-2xl font-bold tracking-tight">{item.title}</h3>
              <p className="text-base leading-relaxed text-white/65">{item.desc}</p>
            </li>
          ))}
        </ol>
      </Disclosure>
    </section>
  );
};
export default TechnicalDetails;
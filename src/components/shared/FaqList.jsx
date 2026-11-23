import React from "react";
// Presentational FAQ block shared by the AI service pages, /strony/ and /systemy/: native
// <details>/<summary> (keyboard and screen-reader accessible, works without JavaScript, the answers
// stay in the server-rendered HTML). Gets plain data: `label` (mono eyebrow), `heading` and `items`
// ({ q, a }); `renderAnswer` lets a page turn markup such as [text](/path/) into links.
const FaqList = ({ label, heading, items, renderAnswer = (a) => a, footnote = null }) => (
  <section id="faq" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-12 lg:gap-20">
      <div data-reveal>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55 mb-6">{label}</p>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]">{heading}</h2>
      </div>
      <div className="border-t border-white/10 divide-y divide-white/10">
        {items.map((item) => (
          <details key={item.q} className="group" data-reveal>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 md:py-7 outline-none focus-visible:bg-white/[0.04] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-cyan-300/70 [&::-webkit-details-marker]:hidden">
              <span className="text-lg md:text-2xl font-bold tracking-tight transition-colors group-hover:text-white text-white/90">{item.q}</span>
              <span aria-hidden="true" className="relative mt-2 h-4 w-4 shrink-0 text-white/60 transition-transform duration-300 group-open:rotate-45">
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
              </span>
            </summary>
            <p className="pb-8 pr-10 max-w-2xl text-base text-white/65 leading-relaxed">{renderAnswer(item.a)}</p>
          </details>
        ))}
        {footnote && <p className="pt-6 text-sm text-white/60 leading-relaxed">{footnote}</p>}
      </div>
    </div>
  </section>
);
export default FaqList;
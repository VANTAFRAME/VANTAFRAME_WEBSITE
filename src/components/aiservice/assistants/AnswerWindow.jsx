import React, { useEffect, useRef, useState } from "react";
import { useService } from "../useService";
import Disclosure from "../Disclosure";
// "How an assistant works": the employee's view of one question in three possible outcomes —
// an answer with references, contradicting sources, and no data — shown in the site's window
// frame. It is an illustration, not a chatbot: nothing is typed, nobody waits for a model; the
// tabs only switch which finished state is shown, with a short fade. Every document and
// passage is fictional and labelled as such, and each reference matches the passage shown.
// Below the window: the five-line explanation (RAG as one possible method) and the three things
// behind an answer — freshness, model errors, permissions.
//
// Accessible tabs (tablist/tab/tabpanel, roving tabindex, arrows/Home/End). Without JavaScript
// (and until the island hydrates) the server HTML shows all three states one under another and
// the tab row is hidden; once hydrated, only the chosen state is shown. The island hydrates on
// load, so nobody sees that switch. Reduced motion: no fade.
const Ref = ({ n, label }) => (
  <span
    aria-label={`${label} ${n}`}
    className="mx-0.5 inline-flex h-[1.35em] min-w-[1.35em] items-center justify-center rounded border border-white/35 px-1 align-baseline font-mono text-[10px] leading-none text-white/85"
  >
    {n}
  </span>
);
const AnswerWindow = ({ data, slug, part = "window" }) => {
  const { c, ui } = useService(data);
  const { how } = c;
  const demo = how.demo;
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const tabRefs = useRef([]);
  const count = demo.states.length;
  const go = (i) => {
    const next = (i + count) % count;
    setActive(next);
    tabRefs.current[next]?.focus();
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(active - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(count - 1);
    }
  };
  if (part === "under") {
    const t = how.under;
    return (
      <section id="pod-spodem" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
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
      <ol className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2 xl:grid-cols-5">
        {how.steps.map((st) => (
          <li key={st.label} className="border-t border-white/15 pt-5">
            <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">{st.label}</span>
            <p className="text-sm leading-relaxed text-white/65">{st.desc}</p>
          </li>
        ))}
      </ol>
      <p className="mt-10 max-w-3xl border-l border-white/20 pl-5 text-sm leading-relaxed text-white/65 md:text-base">
        {how.rag}
      </p>
        </Disclosure>
      </section>
    );
  }
  return (
    <section id="jak-dziala" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <style>{`
        @keyframes aq-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        .aq-in{animation:aq-in .45s ease both}
        @media (prefers-reduced-motion: reduce){.aq-in{animation:none}}
      `}</style>
      <div className="mb-12 grid grid-cols-1 items-end gap-8 md:mb-16 lg:grid-cols-[1.4fr_1fr] lg:gap-16" data-reveal>
        <div>
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{ui.how}</p>
          <h2 className="text-3xl font-black leading-[1.05] tracking-tight md:text-5xl xl:text-6xl">
            {how.heading[0]}
            {" "}<br />
            {how.heading[1]}
          </h2>
        </div>
        <p className="max-w-xl text-base leading-relaxed text-white/65 md:text-lg">{how.intro}</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-black" data-reveal>
        <div className="flex items-center gap-3 border-b border-white/8 bg-black/40 px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="ml-2 truncate font-mono text-[9px] tracking-wider text-white/55">{demo.windowLabel}</span>
        </div>
        <div className={`border-b border-white/8 px-5 py-4 md:px-8 ${ready ? "" : "hidden"}`}>
          <div role="tablist" aria-label={demo.tablistLabel} onKeyDown={onKeyDown} className="flex flex-wrap gap-2">
            {demo.states.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.id}
                  ref={(el) => (tabRefs.current[i] = el)}
                  role="tab"
                  type="button"
                  id={`aq-tab-${s.id}`}
                  aria-selected={on}
                  aria-controls={`aq-panel-${s.id}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] outline-none transition-colors duration-300 focus-visible:ring-1 focus-visible:ring-cyan-300/80 ${
                    on ? "border-white/70 bg-white/[0.06] text-white" : "border-white/20 text-white/60 hover:border-white/40 hover:text-white/85"
                  }`}
                >
                  <span aria-hidden="true" className={`h-1.5 w-1.5 ${on ? "bg-cyan-300" : "bg-white/25"}`} />
                  {s.tab}
                </button>
              );
            })}
            <span className="ml-auto hidden items-center font-mono text-[9px] uppercase tracking-[0.22em] text-white/50 md:inline-flex">{demo.badge}</span>
          </div>
        </div>
        <div className="px-5 py-8 md:px-8 md:py-10">
          {demo.states.map((s, i) => (
            <div
              key={s.id}
              role="tabpanel"
              id={`aq-panel-${s.id}`}
              aria-labelledby={`aq-tab-${s.id}`}
              hidden={ready && i !== active}
              tabIndex={0}
              className={`aq-panel outline-none focus-visible:ring-1 focus-visible:ring-cyan-300/60 ${ready ? "" : "mb-10 border-b border-white/10 pb-10 last:mb-0 last:border-b-0 last:pb-0"}`}
            >
              <div className={`grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12 ${i === active ? "aq-in" : ""}`}>
                <div>
                  <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
                    {demo.employee} · {demo.questionLabel}
                  </span>
                  <p className="mb-8 rounded-md border border-white/20 px-4 py-3.5 text-base leading-relaxed text-white md:text-lg">{s.question}</p>
                  <div className="border-l border-white/25 pl-5">
                    <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{demo.answerLabel}</span>
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.22em] ${s.id === "answer" ? "text-white/70" : "text-cyan-300/90"}`}
                      >
                        {s.status}
                      </span>
                    </div>
                    <p className="max-w-xl text-base leading-relaxed text-white/85 md:text-[17px]">
                      {s.answer.map((part, k) =>
                        typeof part === "string" ? <React.Fragment key={k}>{part}</React.Fragment> : <Ref key={k} n={part.ref} label={demo.sourcesLabel} />
                      )}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border border-white/15 p-5 md:p-6">
                  <div className="mb-5 border-b border-white/10 pb-4">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">{demo.sourcesLabel}</span>
                    <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">{demo.accessNote}</span>
                  </div>
                  {s.sources.length > 0 ? (
                    <ul className="space-y-5">
                      {s.sources.map((src) => (
                        <li key={src.ref}>
                          <div className="mb-2 flex flex-wrap items-center gap-3">
                            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-white/35 px-1 font-mono text-[10px] text-white/85">{src.ref}</span>
                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/80">{src.title}</span>
                            {src.tag && (
                              <span className="rounded-full border border-dashed border-cyan-300/60 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-cyan-300/90">{src.tag}</span>
                            )}
                          </div>
                          <blockquote className="border-l border-white/20 pl-4 text-sm leading-relaxed text-white/70">{src.text}</blockquote>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div>
                      <p className="mb-5 text-sm leading-relaxed text-white/75">{s.empty}</p>
                      <span className="mb-3 block font-mono text-[9px] uppercase tracking-[0.22em] text-white/50">{s.searchedLabel}</span>
                      <ul className="space-y-2">
                        {s.searched.map((t) => (
                          <li key={t} className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 max-w-3xl space-y-2 text-sm leading-relaxed text-white/60 md:text-base" data-reveal>
        <p className="border-l border-white/25 pl-5 text-white/75">{demo.note}</p>
        <p className="pl-5 text-white/50">{demo.fictional}</p>
      </div>
      <div className="mt-16 md:mt-20" data-reveal>
        <div className="mb-2 flex items-center gap-4">
          <span className="rounded-full border border-white/30 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/85">{how.behindLabel}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
        </div>
        <ul className="grid grid-cols-1 border-y border-white/10 md:grid-cols-3">
          {how.behind.map((b, i) => (
            <li key={b.tag} className={`py-7 md:px-8 ${i === 0 ? "md:pl-0" : "border-t border-white/10 md:border-l md:border-t-0 md:border-white/10"}`}>
              <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{b.tag}</span>
              <h3 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{b.title}</h3>
              <p className="text-sm leading-relaxed text-white/65">{b.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
export default AnswerWindow;
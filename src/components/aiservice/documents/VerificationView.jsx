import React, { useRef, useState } from "react";
import { useService } from "../useService";
import Disclosure from "../Disclosure";
import Segments from "./Segments";
// "A document's path": the screen of a person checking the result of processing ONE document.
// On the left a fictional invoice with six numbered, framed fields; on the right the fields
// read from it with a status (READ / NEEDS CHECKING / NO DATA — a word and a shape, never only
// a colour) and a short hint; below, the validation result and the possible next steps. The
// invoice is arithmetically consistent (net 1,250.00 + VAT 287.50 = gross 1,537.50); the 50.00
// difference is between the invoice and the ORDER (1,487.50), and nothing is corrected by the
// system. Picking a field — by click, or by moving through the list with the keyboard —
// highlights it on the invoice; the gross amount is picked by default. Nothing needs hover.
// Without JavaScript the full list of fields, values, statuses and hints is plain HTML.
// Conceptual example, nothing is uploaded, nothing is read.
// Under the window: read vs validate vs approve, the four terms, typical reasons for sending a
// document to a person, and a note that validation does not guarantee correctness.
const Glyph = ({ status }) => {
  if (status === "check") return <span aria-hidden="true" className="block h-2.5 w-2.5 shrink-0 rotate-45 bg-cyan-300" />;
  if (status === "missing") return <span aria-hidden="true" className="block h-2.5 w-2.5 shrink-0 rounded-full border border-dashed border-white/70" />;
  return <span aria-hidden="true" className="block h-2.5 w-2.5 shrink-0 rounded-full bg-white/80" />;
};
const VerificationView = ({ data, slug, part = "view" }) => {
  const { c, ui } = useService(data);
  const { how } = c;
  const d = how.demo;
  const doc = d.doc;
  const [sel, setSel] = useState("gross");
  const btnRefs = useRef([]);
  const idx = Object.fromEntries(d.fields.map((f, i) => [f.id, i + 1]));
  const current = d.fields.find((f) => f.id === sel) || d.fields[0];
  // a framed, numbered region of the invoice
  const F = ({ id, children, className = "" }) => {
    const on = sel === id;
    return (
      <span
        data-on={on ? "true" : "false"}
        className={`relative block rounded-[3px] border px-2 py-1 transition-colors duration-300 ${
          on ? "border-cyan-300 bg-cyan-300/[0.08]" : "border-white/20"
        } ${className}`}
      >
        <span
          aria-hidden="true"
          className={`absolute -left-2 -top-2.5 flex h-4 min-w-4 items-center justify-center rounded-full border bg-brand-black px-1 font-mono text-[9px] leading-none ${
            on ? "border-cyan-300 text-cyan-300" : "border-white/40 text-white/70"
          }`}
        >
          {idx[id]}
        </span>
        {children}
      </span>
    );
  };
  const onKey = (e, i) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const n = (i + (e.key === "ArrowDown" ? 1 : -1) + d.fields.length) % d.fields.length;
      btnRefs.current[n]?.focus();
    }
  };
  if (part === "limits") {
    const t = how.limitsSection;
    return (
      <section id="wyjatki" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
        <div className="mb-10 grid grid-cols-1 items-end gap-8 md:mb-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16" data-reveal>
          <div>
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{t.eyebrow}</p>
            <h2 className="text-3xl font-black leading-[1.05] tracking-tight md:text-5xl xl:text-6xl">
              {t.heading[0]}
              {" "}<br />
              {t.heading[1]}
            </h2>
          </div>
          <div className="max-w-xl">
            <p className="text-2xl font-black tracking-tight md:text-3xl">{how.dutiesNote}</p>
            <p className="mt-5 border-l border-white/20 pl-4 text-sm leading-relaxed text-white/65 md:text-base">{how.limits}</p>
          </div>
        </div>
        <Disclosure label={t.summary}>
          <div className="mb-2 flex items-center gap-4">
            <h3 className="rounded-full border border-white/30 px-4 py-1.5 font-mono text-[10px] font-normal uppercase tracking-[0.22em] text-white/85">{how.dutiesLabel}</h3>
            <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
          </div>
          <ul className="grid grid-cols-1 border-y border-white/10 md:grid-cols-3">
            {how.duties.map((x, i) => (
              <li key={x.tag} className={`py-7 md:px-8 ${i === 0 ? "md:pl-0" : "border-t border-white/10 md:border-l md:border-t-0"}`}>
                <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{x.tag}</span>
                <h4 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{x.title}</h4>
                <p className="text-sm leading-relaxed text-white/65">{x.desc}</p>
              </li>
            ))}
          </ul>
          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <span className="mb-4 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{how.glossaryLabel}</span>
              <dl className="divide-y divide-white/10 border-y border-white/10">
                {how.glossary.map((g) => (
                  <div key={g.term} className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-4 py-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/85">{g.term}</dt>
                    <dd className="text-sm leading-relaxed text-white/65">{g.desc}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <span className="mb-4 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{how.reasonsLabel}</span>
              <ul className="flex flex-wrap gap-2">
                {how.reasons.map((r) => (
                  <li key={r} className="rounded-md border border-white/20 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
            <Segments parts={how.handoff} />
          </p>
        </Disclosure>
      </section>
    );
  }
  return (
    <section id="jak-dziala" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <style>{`
        @media (prefers-reduced-motion: reduce){[data-on]{transition:none!important}}
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
          <span className="ml-2 truncate font-mono text-[9px] tracking-wider text-white/55">{d.windowLabel}</span>
        </div>
        <div className="grid grid-cols-1 gap-10 px-5 py-8 md:px-8 md:py-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
          {/* the invoice */}
          <div className="min-w-0">
            <span className="mb-4 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{d.docLabel}</span>
            <div className="rounded-md border border-white/20 bg-white/[0.03] p-5 font-mono text-[11px] leading-relaxed text-white/80 md:p-7 md:text-xs">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <span className="text-sm font-bold uppercase tracking-[0.25em] text-white md:text-base">{doc.title}</span>
                <div className="space-y-3 text-right">
                  <F id="number" className="inline-block">
                    {doc.numberLabel} {doc.number}
                  </F>
                  <div className="text-white/60">
                    {doc.dateLabel}: <F id="date" className="ml-1 inline-block">{doc.date}</F>
                  </div>
                </div>
              </div>
              <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="min-w-0">
                  <span className="mb-2 block text-[9px] uppercase tracking-[0.22em] text-white/50">{doc.sellerLabel}</span>
                  <F id="vendor">
                    <span className="block break-words text-white">{doc.seller}</span>
                    <span className="block text-white/60">{doc.sellerId}</span>
                  </F>
                </div>
                <div className="min-w-0">
                  <span className="mb-2 block text-[9px] uppercase tracking-[0.22em] text-white/50">{doc.buyerLabel}</span>
                  <span className="block break-words px-2 py-1 text-white/80">{doc.buyer}</span>
                  <span className="block px-2 text-white/60">
                    {doc.orderLabel}: {doc.order}
                  </span>
                </div>
              </div>
              <F id="items" className="mb-6">
                <span className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-x-3 gap-y-1 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:gap-x-5">
                  {doc.itemsHead.map((h, i) => (
                    <span key={h} className={`text-[9px] uppercase tracking-[0.18em] text-white/50 ${i > 0 ? "text-right" : ""} ${i === 2 ? "hidden sm:block" : ""}`}>
                      {h}
                    </span>
                  ))}
                  {doc.items.map((row, r) =>
                    row.map((cell, i) => (
                      <span key={`${r}-${i}`} className={`${i === 0 ? "break-words" : "whitespace-nowrap text-right"} ${i === 2 ? "hidden sm:block" : ""}`}>
                        {cell}
                      </span>
                    ))
                  )}
                </span>
              </F>
              <div className="ml-auto max-w-xs space-y-2">
                <div className="flex justify-between gap-4 px-2 text-white/70">
                  <span>{doc.net[0]}</span>
                  <span className="whitespace-nowrap">{doc.net[1]}</span>
                </div>
                <div className="flex justify-between gap-4 px-2 text-white/70">
                  <span>{doc.vat[0]}</span>
                  <span className="whitespace-nowrap">{doc.vat[1]}</span>
                </div>
                <F id="gross">
                  <span className="flex justify-between gap-4 font-bold text-white">
                    <span>{doc.gross[0]}</span>
                    <span className="whitespace-nowrap">{doc.gross[1]}</span>
                  </span>
                </F>
              </div>
              <div className="mt-6 text-white/60">
                {doc.dueLabel}:{" "}
                <F id="due" className="ml-1 inline-block border-dashed">
                  <span className="text-white/50">{doc.dueEmpty}</span>
                </F>
              </div>
            </div>
            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">{d.selectHint}</p>
          </div>
          {/* the fields */}
          <div className="min-w-0">
            <span className="mb-4 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{d.fieldsLabel}</span>
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {d.fields.map((f, i) => {
                const on = sel === f.id;
                return (
                  <li key={f.id}>
                    <button
                      type="button"
                      ref={(el) => (btnRefs.current[i] = el)}
                      aria-pressed={on}
                      onClick={() => setSel(f.id)}
                      onFocus={() => setSel(f.id)}
                      onKeyDown={(e) => onKey(e, i)}
                      className={`relative block w-full py-4 pl-5 pr-2 text-left outline-none transition-colors duration-300 hover:bg-white/[0.02] focus-visible:bg-white/[0.05] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-cyan-300/80 ${
                        on ? "bg-white/[0.04]" : ""
                      }`}
                    >
                      <span aria-hidden="true" className={`absolute bottom-3 left-0 top-3 w-px ${on ? "bg-cyan-300" : "bg-white/15"}`} />
                      <span className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-4 min-w-4 items-center justify-center rounded-full border border-white/40 px-1 font-mono text-[9px] text-white/75">{i + 1}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">{f.label}</span>
                          <span className="mt-1 block break-words text-base text-white">{f.value}</span>
                          <span className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/85">
                            <Glyph status={f.status} />
                            {d.status[f.status]}
                          </span>
                          {f.hint && <span className="mt-1 block text-sm text-white/65">{f.hint}</span>}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div aria-live="polite" className="mt-5 border-l border-white/25 pl-4">
              <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
                {d.detailLabel} · {current.label}
              </span>
              <p className="text-sm leading-relaxed text-white/75">{current.detail}</p>
            </div>
          </div>
        </div>
        {/* validation and next steps */}
        <div className="border-t border-white/10 px-5 py-8 md:px-8 md:py-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
            <div>
              <span className="mb-4 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{d.validation.label}</span>
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {d.validation.rows.map((r) => (
                  <li key={r.label} className="py-3.5">
                    <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">{r.label}</span>
                      <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/90">
                        <Glyph status={r.tone === "ok" ? "read" : r.tone} />
                        {r.result}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/70">{r.text}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-white/80">{d.validation.note}</p>
            </div>
            <div>
              <span className="mb-4 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{d.paths.label}</span>
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {d.paths.items.map((p) => (
                  <li key={p.id} className={`rounded-md border p-4 ${p.applies ? "border-white/45" : "border-dashed border-white/20"}`}>
                    <span className={`mb-3 block font-mono text-[9px] uppercase tracking-[0.2em] ${p.applies ? "text-cyan-300/90" : "text-white/55"}`}>
                      {p.applies ? d.paths.applies : d.paths.notApplies}
                    </span>
                    <h3 className={`mb-2 text-base font-bold tracking-tight ${p.applies ? "text-white" : "text-white/70"}`}>{p.title}</h3>
                    <p className="text-sm leading-relaxed text-white/65">{p.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/55" data-reveal>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">{d.badge}</span>
        {d.fictional}
      </p>
    </section>
  );
};
export default VerificationView;
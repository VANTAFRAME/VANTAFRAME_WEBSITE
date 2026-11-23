import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";
import { getReference } from "../../data/references";
import ReferenceViewer from "./ReferenceViewer";
import GoogleRating from "./GoogleRating";
gsap.registerPlugin(ScrollTrigger);
// A client reference: a large typographic quotation (no stars, no logo, no card), the author and date as a
// caption, and a thumbnail of the signed document that opens it in a viewer window (ReferenceViewer, where the
// PDF can be downloaded). Two columns from lg (text left, document right), the thumbnail between the caption
// and the actions on a phone.
//
// The quotation is shown exactly as the client wrote it (Polish) in every language. Variants: "short" (one
// sentence, with a link to the case study) and "full" (the last paragraph large, the other four below it, used
// on the case-study page). `highlights` are shown in full white, the rest of the quote in white/55.
// `heading` renders the eyebrow as an <h2> (otherwise a <p>); `embedded` renders a <div> for use inside
// another section. The words fade in once when the section scrolls into view (the server-rendered text is plain).
// Splits text into words (whitespace kept as separate text, so textContent is unchanged) and marks the words
// that fall inside one of the highlighted phrases.
const renderWords = (text, highlights = []) => {
  const ranges = [];
  highlights.forEach((phrase) => {
    const at = text.indexOf(phrase);
    if (at >= 0) ranges.push([at, at + phrase.length]);
  });
  const out = [];
  let offset = 0;
  text.split(/(\s+)/).forEach((token, i) => {
    if (!token) return;
    if (/^\s+$/.test(token)) {
      out.push(token);
    } else {
      const lit = ranges.some(([a, b]) => offset >= a && offset + token.length <= b);
      out.push(
        <span key={i} className={`rq-word inline-block ${lit ? "text-white" : "text-white/55"}`}>
          {token}
        </span>
      );
    }
    offset += token.length;
  });
  return out;
};
const ReferenceQuote = ({ id = "forum-ekonomiczne", variant = "short", heading = false, embedded = false, className = "", showRating = false }) => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].references;
  const ref = getReference(id);
  const rootRef = useRef(null);
  const viewerRef = useRef(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const words = root.querySelectorAll(".rq-word");
    const thumb = root.querySelector("[data-rq-thumb]");
    if (!words.length) return undefined;
    const ctx = gsap.context(() => {
      gsap.set(words, { opacity: 0, y: 12 });
      if (thumb) gsap.set(thumb, { opacity: 0, y: 24 });
      ScrollTrigger.create({
        trigger: root,
        start: "top 78%",
        once: true,
        onEnter: () => {
          // all words in ~1.2 s at most, whatever the length of the quotation
          const stagger = Math.min(0.025, 0.7 / words.length);
          gsap.to(words, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger });
          if (thumb) gsap.to(thumb, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.2 });
        },
      });
    }, root);
    return () => ctx.revert();
  }, [lang, variant]);
  if (!ref) return null;
  const isFull = variant === "full";
  const date = new Date(`${ref.date}T00:00:00Z`);
  const dateText = date.toLocaleDateString(lang === "pl" ? "pl-PL" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const quote = isFull ? ref.full[ref.full.length - 1] : ref.short;
  const rest = isFull ? ref.full.slice(0, -1) : [];
  const Wrapper = embedded ? "div" : "section";
  const wrapperClass = `border-t border-white/10 py-24 md:py-32 ${embedded ? "" : "px-6 md:px-12 max-w-[1700px] mx-auto"} ${className}`;
  const eyebrowClass = "font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/65 mb-8";
  const open = (event) => viewerRef.current?.open(event.currentTarget);
  return (
    <Wrapper ref={rootRef} className={wrapperClass}>
      <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {heading ? <h2 className={eyebrowClass}>{t.eyebrow}</h2> : <p className={eyebrowClass}>{t.eyebrow}</p>}
          <figure>
            <blockquote
              cite={ref.pdf}
              lang={lang === "pl" ? undefined : "pl"}
              className="text-[clamp(1.9rem,3.6vw,3.4rem)] font-bold leading-[1.1] tracking-tight"
            >
              <p>{renderWords(quote, ref.highlights)}</p>
            </blockquote>
            <figcaption className="mt-8">
              <span className="block text-sm font-semibold text-white md:text-base">{ref.author}</span>
              <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.2em] text-white/65">
                {ref.organization} / <time dateTime={ref.date}>{dateText}</time>
              </span>
            </figcaption>
          </figure>
          {rest.length > 0 && (
            <div lang={lang === "pl" ? undefined : "pl"} className="mt-12 max-w-2xl space-y-5 text-base leading-relaxed text-white/70 md:text-lg">
              {rest.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
        <div className="order-2 flex flex-col items-start lg:col-span-5 lg:row-span-2 lg:items-center lg:justify-center" data-rq-thumb>
          <button
            type="button"
            onClick={open}
            aria-haspopup="dialog"
            className="block w-full max-w-[280px] -rotate-2 rounded-sm border border-white/15 bg-white/[0.03] p-3 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9)] outline-none transition-[transform,border-color] duration-[400ms] hover:-translate-y-1 hover:rotate-0 hover:border-white/40 focus-visible:-translate-y-1 focus-visible:rotate-0 focus-visible:border-white/40 focus-visible:ring-1 focus-visible:ring-cyan-300/70 motion-reduce:rotate-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:max-w-[400px]"
          >
            <img
              src={ref.thumb.src}
              width={ref.thumb.width}
              height={ref.thumb.height}
              alt={t.thumbAlt}
              loading="lazy"
              className="h-auto w-full bg-white"
            />
          </button>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/65">{t.hint}</p>
        </div>
        <div className="order-3 flex flex-wrap items-center gap-x-8 gap-y-4 lg:col-span-7">
          <button
            type="button"
            onClick={open}
            aria-haspopup="dialog"
            className="group inline-flex items-center gap-3 border-b-2 border-white/60 pb-1 text-sm font-bold uppercase tracking-widest text-white outline-none transition-colors hover:border-white focus-visible:border-cyan-300"
          >
            {t.view}
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M5 12h14m-7-7l7 7-7 7" />
            </svg>
          </button>
          {!isFull && ref.caseStudySlug && (
            <a
              href={`/portfolio/${ref.caseStudySlug}/`}
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/65 transition-colors hover:text-white focus-visible:text-white"
            >
              {t.project}
            </a>
          )}
        </div>
      </div>
      {showRating && <GoogleRating className="mt-14" />}
      <ReferenceViewer ref={viewerRef} reference={ref} t={t} />
    </Wrapper>
  );
};
export default ReferenceQuote;
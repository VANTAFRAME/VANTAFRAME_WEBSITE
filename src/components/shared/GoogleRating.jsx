import React from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";
import { googleRating } from "../../data/googleRating";
import { reviewsCount } from "../../lib/reviewsLabel";
// One hairline row with the Google rating: the large number, five outline stars, a mono caption and a link to
// the profile. Plain text only (see data/googleRating.js: values are maintained by hand; no structured data).
const Star = () => (
  <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" />
  </svg>
);
const GoogleRating = ({ className = "" }) => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].googleRating;
  const g = googleRating;
  const shown = lang === "pl" ? g.display : g.display.replace(",", ".");
  const count = reviewsCount(g.count, lang);
  return (
    <div className={`border-t border-white/10 pt-6 ${className}`} data-reveal>
      <p className="sr-only">{t.sr.replace("{value}", shown).replace("{count}", count)}</p>
      <div aria-hidden="true" className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <span className="text-2xl font-bold tracking-tight text-white md:text-3xl">{shown}</span>
        <span className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} />
          ))}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/65">
          {t.caption} · {count}
        </span>
      </div>
      <a
        href={g.url}
        target="_blank"
        rel="noopener"
        className="group mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/80 outline-none transition-colors hover:text-white focus-visible:text-white"
      >
        {t.link}
        <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M5 12h14m-7-7l7 7-7 7" />
        </svg>
        <span className="sr-only"> {languages[lang].vantasignal.newTab}</span>
      </a>
    </div>
  );
};
export default GoogleRating;
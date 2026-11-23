import React from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";
import { googleRating } from "../../data/googleRating";
import { reviewsCount } from "../../lib/reviewsLabel";
// "At a glance": hairline columns like the value strip on the AI pages — a mono label over a short value.
// The reviews column is a link to the company's Google profile (no rating, no review count).
const Strip = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].aboutPage.strip;
  const newTab = languages[lang].vantasignal.newTab;
  return (
    <section aria-label={t.label} className="px-6 md:px-12 max-w-[1700px] mx-auto py-14 md:py-20 border-t border-white/10">
      <dl className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
        {t.items.map((item) => (
          <div key={item.label} className="border-t border-white/20 pt-5" data-reveal>
            <dt className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{item.label}</dt>
            <dd className="text-lg leading-snug text-white/85 md:text-xl">
              {item.rating ? (
                <>
                  <span className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                    {lang === "pl" ? googleRating.display : googleRating.display.replace(",", ".")} {t.ratingIn}
                  </span>
                  <a
                    href={googleRating.url}
                    target="_blank"
                    rel="noopener"
                    className="mt-2 block text-base text-white underline decoration-white/35 underline-offset-4 transition-colors hover:decoration-white focus-visible:decoration-cyan-300"
                  >
                    {reviewsCount(googleRating.count, lang)} {t.ratingLink}
                    <span className="sr-only"> {newTab}</span>
                  </a>
                </>
              ) : item.link ? (
                <a
                  href={item.link.href}
                  target="_blank"
                  rel="noopener"
                  className="text-white underline decoration-white/35 underline-offset-4 transition-colors hover:decoration-white focus-visible:decoration-cyan-300"
                >
                  {item.link.text}
                  <span className="sr-only"> {newTab}</span>
                </a>
              ) : (
                item.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
export default Strip;
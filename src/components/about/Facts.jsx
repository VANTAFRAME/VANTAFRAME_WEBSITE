import React from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";
const GOOGLE_PROFILE = "https://www.google.com/maps?cid=2449571422865794638";
const LINK =
  "text-white underline decoration-white/35 underline-offset-4 transition-colors hover:decoration-white focus-visible:decoration-cyan-300";
// The VANTASIGNAL note and the company details (<dl>). The team section is its own component (Team.jsx).
const Facts = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].aboutPage;
  const newTab = languages[lang].vantasignal.newTab;
  const r = t.company.rows;
  const rows = [
    [r.name, "VANTAFRAME SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ"],
    [r.address, "ul. Żułowska 33 lok. 10, 31-436 Kraków"],
    [r.krs, "0001253958"],
    [r.nip, "9452332952"],
    [r.regon, "545245372"],
    [
      r.email,
      <a key="mail" href="mailto:kontakt@vantaframe.pl" className={LINK}>
        kontakt@vantaframe.pl
      </a>,
    ],
    [
      r.phone,
      <a key="tel" href="tel:+48794659528" className={LINK}>
        +48 794 659 528
      </a>,
    ],
    [
      r.google,
      <a key="g" href={GOOGLE_PROFILE} target="_blank" rel="noopener" className={LINK}>
        {t.company.googleLink}
        <span className="sr-only"> {newTab}</span>
      </a>,
    ],
  ];
  return (
    <>
      <section className="px-6 md:px-12 max-w-[1700px] mx-auto py-14 md:py-20 border-t border-white/10">
        <p className="max-w-2xl text-lg md:text-xl leading-relaxed text-white/75" data-reveal>
          {t.vantasignal.text}{" "}
          <a href="https://vantasignal.pl/" target="_blank" rel="noopener" className={LINK}>
            {t.vantasignal.link}
            <span className="sr-only"> {newTab}</span>
          </a>
        </p>
      </section>
      <section id="dane-firmy" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
        <h2 className="mb-12 text-3xl md:text-6xl font-black tracking-tight leading-[1.05]" data-reveal>
          {t.company.heading}
        </h2>
        <dl className="border-t border-white/10">
          {rows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-1 gap-2 border-b border-white/10 py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] md:gap-10" data-reveal>
              <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55 md:pt-1.5">{label}</dt>
              <dd className="text-base leading-snug text-white/85 md:text-lg">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
};
export default Facts;
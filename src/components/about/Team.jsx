import React from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";
import imageSizes from "../../data/projectImageSizes.json";
// "Zespół": people from src/data/authors.js (aboutPage.team.members). Rendered only when the list is not empty.
// One person: two columns from md (portrait 4:5 + text), a single column on a phone. More people: a grid of
// the same blocks (portrait above the text), so adding a person to authors.js is enough.
const LINK =
  "text-white underline decoration-white/35 underline-offset-4 transition-colors hover:decoration-white focus-visible:decoration-cyan-300";
const Portrait = ({ m }) => (
  <div className="w-full max-w-[320px] md:max-w-none overflow-hidden rounded-sm border border-white/10 bg-white/[0.02]">
    <img
      src={m.photo}
      alt={m.name}
      width={imageSizes[m.photo]?.width}
      height={imageSizes[m.photo]?.height}
      loading="lazy"
      className="block h-auto w-full"
    />
  </div>
);
const Details = ({ m, single, newTab }) => (
  <div>
    <h3 className={`font-black tracking-tight leading-[1.05] ${single ? "text-4xl md:text-6xl" : "text-2xl md:text-3xl"}`}>{m.name}</h3>
    <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">{m.role}</p>
    <p className={`mt-6 max-w-xl leading-relaxed text-white/70 ${single ? "text-base md:text-lg" : "text-base"}`}>{m.bio}</p>
    {m.linkedin && (
      <a href={m.linkedin} target="_blank" rel="noopener" className={`mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.2em] ${LINK}`}>
        LinkedIn ↗<span className="sr-only"> {newTab}</span>
      </a>
    )}
  </div>
);
const Team = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].aboutPage.team;
  const newTab = languages[lang].vantasignal.newTab;
  if (!t.members.length) return null;
  const single = t.members.length === 1;
  return (
    <section id="zespol" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <h2 className="mb-12 md:mb-16 text-3xl md:text-6xl font-black tracking-tight leading-[1.05]" data-reveal>
        {t.heading}
      </h2>
      {single ? (
        <div id={t.members[0].id} className="scroll-mt-28 grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12 md:items-start" data-reveal>
          <div className="md:col-span-4">
            <Portrait m={t.members[0]} />
          </div>
          <div className="md:col-span-8 md:pt-2">
            <Details m={t.members[0]} single newTab={newTab} />
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {t.members.map((m) => (
            <li key={m.id} id={m.id} className="scroll-mt-28 flex flex-col gap-6" data-reveal>
              <Portrait m={m} />
              <Details m={m} single={false} newTab={newTab} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
export default Team;
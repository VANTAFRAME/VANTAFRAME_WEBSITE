import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fallbackProjects } from "../lib/projectsClient";
import { useStore } from "../lib/useStore";
import { currentLang } from "../i18n/store";
import { languages } from "../i18n/translations";
import projectImageSizes from "../data/projectImageSizes.json";
import { projectCategory } from "../lib/projectShape";
import LinkedText from "./LinkedText";
import { CaseStudyBadge, CaseStudyActions } from "./shared/CaseStudyTileParts";
gsap.registerPlugin(ScrollTrigger);
const sizeClasses = {
  wide: "col-span-1 md:col-span-2 row-span-1 md:row-span-1 aspect-[2/1] md:aspect-auto h-[350px]",
  tall: "col-span-1 row-span-2 h-[500px] sm:h-full",
  square: "col-span-1 row-span-1 h-[350px]",
  default: "col-span-1 row-span-1 h-[400px]",
};
// Cards that span the whole row on the 3-column grid (md up to xl) so that grid has no gaps; the 4-column
// desktop layout and the phone layout are not affected. The last card always does (see below).
const FULL_ROW_ON_TABLET = new Set([29]);
const PortfolioGridClient = ({ caseOrder = [] }) => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].portfolio;
  // One grid of all projects: the case-study projects first (in the order of caseStudies.js), then the rest in their
  // own order.
  const caseBySlug = Object.fromEntries(caseOrder.map((c) => [c.slug, c]));
  const [projects] = useState(() => {
    const first = caseOrder.map((c) => fallbackProjects.find((p) => p.caseStudySlug === c.slug)).filter(Boolean);
    return [...first, ...fallbackProjects.filter((p) => !p.caseStudySlug)];
  });
  useEffect(() => {
    const section = document.getElementById("portfolio-grid-section");
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars.trigger === section) trigger.kill();
    });
    if (section) {
      ScrollTrigger.create({
        trigger: section,
        start: "bottom bottom",
        end: "+=100%",
        pin: true,
        pinSpacing: true,
      });
    }
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === section) trigger.kill();
      });
    };
  }, [projects.length]);
  return (
    <section className="relative z-30 w-full bg-[#050505] px-4 py-32 pt-48 md:px-12" id="portfolio-grid-section">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 flex flex-col items-center text-center md:mb-24">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-white/40">{t.eyebrow}</p>
          <h1 className="text-4xl font-black uppercase tracking-tight text-white md:text-6xl">{t.title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            <LinkedText text={t.lead} />
          </p>
          <div className="mt-6 h-[2px] w-12 bg-white" />
        </div>
        <div className="grid auto-rows-min grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
          {projects.map((project, index) => {
            // On the 3-column grid (md up to xl) the last card spans the whole row, so the grid does not end with a gap.
            const spanClass = `${sizeClasses[project.size || "default"] || sizeClasses.default} ${index === projects.length - 1 || FULL_ROW_ON_TABLET.has(project.id) ? "md:max-xl:col-span-3" : ""}`;
            // Projects with a case study stay on-site: the tile (stretched title link) leads to /portfolio/<slug>/ and the
            // live site is a separate action. Everything else keeps its previous behaviour: straight out to the project.
            const caseInfo = project.caseStudySlug ? caseBySlug[project.caseStudySlug] : null;
            const isCase = Boolean(project.caseStudySlug);
            const href = isCase ? `/portfolio/${project.caseStudySlug}/` : project.url;
            const isExternal = !isCase && project.url?.startsWith("http");
            return (
              <article
                key={project.id}
                className={`group relative isolate flex w-full break-inside-avoid flex-col justify-end overflow-hidden rounded-xl bg-neutral-900 p-6 transition-all duration-500 hover:-translate-y-2 hover:pb-8 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-cyan-300/70 md:p-8 md:hover:pb-10 ${spanClass}`}
              >
                {/* The text block is not positioned, so the ::after of the title link spans the whole tile (stretched link). The picture sits behind it (-z-10 inside the isolated tile). */}
                <div className="absolute inset-0 -z-10 h-full w-full">
                  <img
                    src={project.image}
                    width={projectImageSizes[project.image]?.width}
                    height={projectImageSizes[project.image]?.height}
                    alt={project.title}
                    className="h-full w-full object-cover object-center opacity-90 transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:opacity-100"
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-70" />
                {isCase && <CaseStudyBadge />}
                <span className="pointer-events-none mb-2 inline-block w-fit text-xs font-medium uppercase tracking-widest text-white/60 transition-all delay-100 duration-500 md:-translate-x-4 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100">
                  {projectCategory(project, lang)}
                </span>
                <h2 className="text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl">
                  <a
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener" : undefined}
                    className="outline-none after:absolute after:inset-0 after:content-['']"
                  >
                    {project.title}
                    {isExternal && <span className="sr-only"> {t.newTab}</span>}
                  </a>
                </h2>
                {isCase ? (
                  <CaseStudyActions
                    href={href}
                    liveUrl={caseInfo?.liveUrl}
                    labels={{ caseStudy: t.caseStudyButton, viewSite: t.viewSite, newTab: t.newTab }}
                  />
                ) : (
                  <div className="pointer-events-none mt-4 flex h-0 items-center gap-2 overflow-hidden opacity-0 transition-all delay-200 duration-500 ease-in-out group-hover:h-8 group-hover:opacity-100">
                    <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                      {t.viewSite} <span aria-hidden="true">↗</span>
                    </span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default PortfolioGridClient;
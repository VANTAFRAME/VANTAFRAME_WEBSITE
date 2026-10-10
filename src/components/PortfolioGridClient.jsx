import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fallbackProjects } from "../lib/projectsClient";
import { useStore } from "../lib/useStore";
import { currentLang } from "../i18n/store";
import { languages } from "../i18n/translations";

gsap.registerPlugin(ScrollTrigger);

const sizeClasses = {
  wide: "col-span-1 md:col-span-2 row-span-1 md:row-span-1 aspect-[2/1] md:aspect-auto h-[350px]",
  tall: "col-span-1 row-span-2 h-[500px] md:h-full",
  square: "col-span-1 row-span-1 h-[350px]",
  default: "col-span-1 row-span-1 h-[400px]",
};

const PortfolioGridClient = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].portfolio;
  const [projects] = useState(fallbackProjects);

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
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/40">{t.title}</h2>
          <h1 className="text-4xl font-black uppercase tracking-tight text-white md:text-6xl">{t.title}</h1>
          <div className="mt-6 h-[2px] w-12 bg-white" />
        </div>

        <div className="grid auto-rows-min grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
          {projects.map((project) => {
            const spanClass = sizeClasses[project.size || "default"] || sizeClasses.default;
            // Flagship projects with a written case study stay on-site and
            // link to their own /portfolio/[slug] page; the external "live
            // site" link only appears there. Everything else keeps its
            // previous behavior — straight out to the live project.
            const href = project.caseStudySlug ? `/portfolio/${project.caseStudySlug}/` : project.url;
            const isExternal = !project.caseStudySlug && project.url?.startsWith("http");

            return (
              <a
                key={project.id}
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "nofollow noopener noreferrer" : undefined}
                className={`group relative block w-full break-inside-avoid overflow-hidden rounded-xl bg-neutral-900 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] ${spanClass}`}
              >
                <div className="absolute inset-0 h-full w-full">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover object-center opacity-90 transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:opacity-100"
                    loading="lazy"
                  />
                </div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-70" />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 w-full p-6 transition-all duration-500 group-hover:-translate-y-2 md:p-8">
                  <span className="mb-2 inline-block -translate-x-4 text-xs font-medium uppercase tracking-widest text-white/60 opacity-0 transition-all delay-100 duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                    {project.category}
                  </span>
                  <h3 className="text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl">{project.title}</h3>

                  <div className="mt-4 flex h-0 items-center gap-2 overflow-hidden opacity-0 transition-all delay-200 duration-500 ease-in-out group-hover:h-8 group-hover:opacity-100">
                    <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">{t.viewCase}</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PortfolioGridClient;


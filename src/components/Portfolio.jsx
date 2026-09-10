import React, { useEffect, useRef } from "react";
import { useStore } from "../lib/useStore";
import { currentLang } from "../i18n/store";
import { languages } from "../i18n/translations";

import { fallbackFeaturedProjects } from "../lib/projectsClient";

const Portfolio = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].portfolio;
  const sliderRef = useRef(null);
  const [isDown, setIsDown] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [projects] = React.useState(fallbackFeaturedProjects);

  const velocity = useRef(0);
  const rafId = useRef(null);
  const wheelRafRef = useRef(null);
  const wheelTargetRef = useRef(0);
  const lastTime = useRef(0);
  const lastX = useRef(0);

  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      if (wheelRafRef.current) {
        cancelAnimationFrame(wheelRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const animateWheel = () => {
      const current = slider.scrollLeft;
      const target = wheelTargetRef.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.5) {
        slider.scrollLeft = target;
        wheelRafRef.current = null;
        return;
      }

      slider.scrollLeft = current + diff * 0.18;
      wheelRafRef.current = requestAnimationFrame(animateWheel);
    };

    const handleLockedWheel = (e) => {
      if (!(e.target instanceof Element)) return;

      const scrollDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (scrollDelta === 0) return;

      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
      if (maxScrollLeft <= 0) return;

      const projectedScroll = wheelRafRef.current ? wheelTargetRef.current : slider.scrollLeft;
      const atStart = projectedScroll <= 0.5;
      const atEnd = projectedScroll >= maxScrollLeft - 0.5;
      const movingLeft = scrollDelta < 0;
      const movingRight = scrollDelta > 0;

      // At horizontal edges, release lock so page can scroll vertically.
      if ((atStart && movingLeft) || (atEnd && movingRight)) return;

      e.preventDefault();
      e.stopPropagation();

      const base = wheelRafRef.current ? wheelTargetRef.current : slider.scrollLeft;
      wheelTargetRef.current = Math.min(maxScrollLeft, Math.max(0, base + scrollDelta));

      if (!wheelRafRef.current) {
        wheelRafRef.current = requestAnimationFrame(animateWheel);
      }
    };

    slider.addEventListener("wheel", handleLockedWheel, { passive: false });

    return () => {
      slider.removeEventListener("wheel", handleLockedWheel);
      if (wheelRafRef.current) {
        cancelAnimationFrame(wheelRafRef.current);
        wheelRafRef.current = null;
      }
    };
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDown(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
    wheelTargetRef.current = sliderRef.current.scrollLeft;
    setIsDragging(false);

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    if (wheelRafRef.current) {
      cancelAnimationFrame(wheelRafRef.current);
      wheelRafRef.current = null;
    }
    velocity.current = 0;
    lastX.current = e.pageX;
    lastTime.current = performance.now();
  };

  const handleMouseLeave = () => {
    if (isDown) {
      setIsDown(false);
      beginMomentum();
    }
  };

  const handleMouseUp = () => {
    setIsDown(false);
    setTimeout(() => setIsDragging(false), 50);
    beginMomentum();
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;

    const now = performance.now();
    const dt = now - lastTime.current;
    const dx = e.pageX - lastX.current;

    if (dt > 0) {
      velocity.current = dx / dt;
    }

    lastX.current = e.pageX;
    lastTime.current = now;

    if (Math.abs(walk) > 5) {
      setIsDragging(true);
    }
    sliderRef.current.scrollLeft = scrollLeft - walk;
    wheelTargetRef.current = sliderRef.current.scrollLeft;
  };

  const beginMomentum = () => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    const animate = () => {
      if (Math.abs(velocity.current) < 0.1) return;

      velocity.current *= 0.95;

      if (sliderRef.current) {
        sliderRef.current.scrollLeft -= velocity.current * 15;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
  };

  const handleLinkClick = (e) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section id="work" className="h-[100dvh] w-full bg-brand-black flex flex-col relative overflow-hidden">
      <div className="absolute top-6 inset-x-4 md:top-8 md:inset-x-12 z-20 flex items-center justify-between gap-4 pointer-events-none">
        <h2 className="text-sm font-bold tracking-widest uppercase text-white/40 mix-blend-difference">{t.title}</h2>
        <a
          href="/portfolio"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-4 py-2 text-[10px] md:text-xs font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/12 hover:text-white"
        >
          <span>{t.viewAll}</span>
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M5 12h14m-7-7 7 7-7 7" />
          </svg>
        </a>
      </div>

      <div
        ref={sliderRef}
        className="flex flex-row items-center gap-3 md:gap-4 px-4 md:px-12 pt-24 md:pt-0 pb-8 md:pb-0 h-full overflow-x-auto overflow-y-hidden no-scrollbar cursor-grab active:cursor-grabbing touch-pan-x overscroll-x-contain"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {projects.map((project) => (
          <a
            key={project.id}
            href={project.url}
            onClick={handleLinkClick}
            target={project.url.startsWith("http") ? "_blank" : undefined}
            rel={project.url.startsWith("http") ? "noopener noreferrer" : undefined}
            draggable="false"
            className={`
              group project-card relative flex-shrink-0 w-[96vw] sm:w-[72vw] md:w-[22vw] h-[30vh] md:h-[60vh]
              transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden rounded-md
              ${project.img ? project.img : "bg-brand-black"}
              hover:md:w-[106.67vh]
            `}
          >
            {project.image && (
              <div className="absolute inset-0 w-full h-full pointer-events-none">
                <img
                  src={project.image}
                  alt={project.title}
                  draggable="false"
                  className="w-full h-full object-cover object-top opacity-50 grayscale transition-all duration-700 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/90 opacity-80 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />

            <div className="absolute bottom-10 left-8 z-10 w-full pr-8 pointer-events-none">
              <span className="inline-block text-xs font-mono tracking-wider text-brand-beige mb-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                {project.category}
              </span>
              <h3 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter mix-blend-screen">
                {project.title}
              </h3>
              <div className="h-[1px] w-0 group-hover:w-full max-w-[200px] bg-brand-beige mt-6 transition-all duration-700 delay-200" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Portfolio;

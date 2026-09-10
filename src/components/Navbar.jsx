import React, { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "../lib/useStore";
import { currentLang, toggleLang } from "../i18n/store";
import { languages } from "../i18n/translations";

const Navbar = ({ pathname = "/" }) => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].nav;
  const servicesDropdown = languages[lang].services.dropdown || [
    { id: "01", title: "Strony i Sklepy", desc: "Strony, sklepy, landing pages", href: "/strony" },
    { id: "02", title: "Systemy dla Firm", desc: "CRM, panele, systemy dedykowane", href: "/systemy" },
    { id: "03", title: "Automatyzacje i AI", desc: "Procesy, integracje, AI", href: "/automatyzacje" },
  ];

  const [isDocked, setIsDocked] = useState(false);
  const [hideBottomIsland, setHideBottomIsland] = useState(false);
  const [isIslandOpen, setIsIslandOpen] = useState(false);
  const [isTopDropdownOpen, setIsTopDropdownOpen] = useState(false);
  const [isBottomDropdownOpen, setIsBottomDropdownOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  const topDropdownTimeoutRef = useRef(null);
  const bottomDropdownTimeoutRef = useRef(null);
  const rafRef = useRef(0);
  const isHomePage = pathname === "/";

  const navItems = useMemo(
    () =>
      Object.entries(t).map(([key, label]) => ({
        key,
        label,
      })),
    [t]
  );

  const mobileItems = useMemo(
    () => navItems.filter((item) => ["services", "work", "contact"].includes(item.key)),
    [navItems]
  );

  useEffect(() => {
    const updateDock = () => {
      rafRef.current = 0;
      const nextDocked = window.scrollY > 72;
      const footer = document.getElementById("site-footer");
      const footerTop = footer?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
      const hideDockThreshold = window.innerHeight + 48;
      const shouldHideBottomIsland =
        footerTop < hideDockThreshold ||
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 80;

      setIsDocked(nextDocked);
      setHideBottomIsland(shouldHideBottomIsland);
      if (!nextDocked || shouldHideBottomIsland) {
        setIsIslandOpen(false);
        setIsBottomDropdownOpen(false);
      }
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(updateDock);
    };

    updateDock();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Global click outside & ESC handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsTopDropdownOpen(false);
        setIsBottomDropdownOpen(false);
        setIsMobileServicesOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (!e.target.closest(".services-dropdown-container")) {
        setIsTopDropdownOpen(false);
        setIsBottomDropdownOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleTopMouseEnter = () => {
    if (topDropdownTimeoutRef.current) clearTimeout(topDropdownTimeoutRef.current);
    setIsTopDropdownOpen(true);
  };

  const handleTopMouseLeave = () => {
    topDropdownTimeoutRef.current = setTimeout(() => {
      setIsTopDropdownOpen(false);
    }, 180);
  };

  const handleBottomMouseEnter = () => {
    if (bottomDropdownTimeoutRef.current) clearTimeout(bottomDropdownTimeoutRef.current);
    setIsBottomDropdownOpen(true);
  };

  const handleBottomMouseLeave = () => {
    bottomDropdownTimeoutRef.current = setTimeout(() => {
      setIsBottomDropdownOpen(false);
    }, 180);
  };

  // Hovering any other nav item collapses the OFERTA dropdown immediately,
  // instead of waiting for the leave-timeout (which may never fire while the
  // mouse stays inside the same pill).
  const closeTopDropdown = () => {
    if (topDropdownTimeoutRef.current) clearTimeout(topDropdownTimeoutRef.current);
    setIsTopDropdownOpen(false);
  };

  const closeBottomDropdown = () => {
    if (bottomDropdownTimeoutRef.current) clearTimeout(bottomDropdownTimeoutRef.current);
    setIsBottomDropdownOpen(false);
  };

  const getSectionHref = (key) => {
    if (key === "framework") return "/kreator-projektu";
    if (key === "services") return isHomePage ? "#services" : "/#services";
    return isHomePage ? `#${key}` : `/#${key}`;
  };

  const scrollToSection = (event, key) => {
    if (key === "framework") {
      setIsIslandOpen(false);
      return;
    }

    if (!isHomePage) {
      return;
    }

    event.preventDefault();
    const target = document.getElementById(key);
    if (!target) return;
    if (window.lenis) {
      window.lenis.scrollTo(target);
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsIslandOpen(false);
    setIsTopDropdownOpen(false);
    setIsBottomDropdownOpen(false);
  };

  const goTop = () => {
    if (!isHomePage) {
      window.location.href = "/";
      return;
    }

    if (window.lenis) {
      window.lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsIslandOpen(false);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* TOP FLOATING NAVBAR                                                       */}
      {/* ========================================================================= */}
      <div
        className={[
          "fixed left-1/2 top-3 md:top-6 -translate-x-1/2 z-50 transition-all duration-300",
          isDocked ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100 translate-y-0",
        ].join(" ")}
      >
        <nav
          onMouseLeave={handleTopMouseLeave}
          className={[
            "pointer-events-auto border border-white/20 bg-black/85 backdrop-blur-xl shadow-[0_16px_38px_rgba(0,0,0,0.45)] transition-[border-radius] duration-300 overflow-hidden",
            isTopDropdownOpen ? "rounded-[28px]" : "rounded-full",
          ].join(" ")}
        >
          <div className="flex items-center px-5 py-2.5">
            <button
              onClick={goTop}
              className="text-sm md:text-[1.15rem] font-bold tracking-[0.05em] whitespace-nowrap hover:opacity-85 transition-opacity cursor-pointer py-1.5 md:py-0"
              aria-label="Wróć na początek strony"
            >
              VANTAFRAME
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center ml-3">
              {navItems.map((item) => {
                if (item.key === "services") {
                  return (
                    <div key={item.key} className="services-dropdown-container relative" onMouseEnter={handleTopMouseEnter}>
                      <a
                        href={getSectionHref(item.key)}
                        onClick={(e) => scrollToSection(e, item.key)}
                        className={[
                          "inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] px-3 py-2 rounded-full transition-colors",
                          isTopDropdownOpen ? "text-white bg-white/10" : "text-white/78 hover:text-white hover:bg-white/10",
                        ].join(" ")}
                      >
                        <span>{item.label}</span>
                        <svg
                          className={[
                            "w-3 h-3 transition-transform duration-200 opacity-60",
                            isTopDropdownOpen ? "rotate-180 opacity-100" : "",
                          ].join(" ")}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </a>
                    </div>
                  );
                }

                return (
                  <a
                    key={item.key}
                    href={getSectionHref(item.key)}
                    onClick={(event) => scrollToSection(event, item.key)}
                    onMouseEnter={closeTopDropdown}
                    className="text-[11px] uppercase tracking-[0.14em] px-3 py-2 rounded-full text-white/78 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {item.label}
                  </a>
                );
              })}
              <button
                onClick={toggleLang}
                onMouseEnter={closeTopDropdown}
                className="ml-1 px-3 py-1.5 border border-white/25 rounded-full text-[10px] font-bold hover:bg-white hover:text-black transition-colors cursor-pointer"
                aria-label={lang === "pl" ? "Switch language to English" : "Przełącz język na polski"}
              >
                {lang === "pl" ? "EN" : "PL"}
              </button>
            </div>

            {/* Mobile Navigation Bar */}
            <div className="md:hidden flex items-center ml-2">
              <button
                onClick={() => setIsMobileServicesOpen((prev) => !prev)}
                className={[
                  "px-2.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.1em] transition-colors flex items-center gap-1",
                  isMobileServicesOpen ? "text-white bg-white/15" : "text-white/80 hover:text-white hover:bg-white/10",
                ].join(" ")}
              >
                <span>{t.services}</span>
                <svg
                  className={[
                    "w-2.5 h-2.5 transition-transform duration-200",
                    isMobileServicesOpen ? "rotate-180" : "",
                  ].join(" ")}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <a
                href={getSectionHref("work")}
                onClick={(event) => scrollToSection(event, "work")}
                className="px-2.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.1em] text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                {t.work}
              </a>

              <a
                href={getSectionHref("contact")}
                onClick={(event) => scrollToSection(event, "contact")}
                className="px-2.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.1em] text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                {t.contact}
              </a>

              <button
                onClick={toggleLang}
                className="ml-1 px-2.5 py-1.5 border border-white/25 rounded-full text-[10px] font-bold hover:bg-white hover:text-black transition-colors cursor-pointer"
                aria-label={lang === "pl" ? "Switch language to English" : "Przełącz język na polski"}
              >
                {lang === "pl" ? "EN" : "PL"}
              </button>
            </div>
          </div>

          {/* Desktop Services Dropdown — expands the island itself, in-flow.
              Collapsing only grid-template-rows leaves the container's
              natural WIDTH (3 fixed-width cards) intact even at 0 height,
              which silently widens the pill even while "closed". Collapsing
              grid-template-columns in lockstep forces it to true 0x0. */}
          <div
            className={[
              "hidden md:grid transition-[grid-template-rows,grid-template-columns] duration-300 ease-out",
              isTopDropdownOpen ? "grid-rows-[1fr] grid-cols-[1fr]" : "grid-rows-[0fr] grid-cols-[0fr]",
            ].join(" ")}
          >
            <div className="overflow-hidden min-w-0">
              <div className="flex flex-row gap-1 pl-5 pr-3 pb-3 pt-1 mt-0.5">
                {servicesDropdown.map((d) => (
                  <a
                    key={d.id}
                    href={d.href}
                    onClick={() => setIsTopDropdownOpen(false)}
                    className="group flex flex-col w-[190px] px-3.5 py-2.5 rounded-xl hover:bg-white/[0.08] transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5 whitespace-nowrap">
                        <span className="font-mono text-[10px] text-white/40 group-hover:text-white/80 transition-colors">
                          {d.id} /
                        </span>
                        {d.title}
                      </span>
                      <svg
                        className="w-3.5 h-3.5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14m-7-7l7 7-7 7" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-white/50 group-hover:text-white/80 mt-1 leading-tight transition-colors">
                      {d.desc}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Services Accordion */}
          {isMobileServicesOpen && (
            <div className="md:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-2">
              {servicesDropdown.map((d) => (
                <a
                  key={d.id}
                  href={d.href}
                  onClick={() => setIsMobileServicesOpen(false)}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/5 text-xs text-white/90"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <span className="font-mono text-[10px] text-white/40">{d.id}</span>
                    {d.title}
                  </span>
                  <svg className="w-3 h-3 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14m-7-7l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* DOCKED BOTTOM ISLAND                                                      */}
      {/* ========================================================================= */}
      <div
        className={[
          "fixed left-1/2 -translate-x-1/2 bottom-4 md:bottom-6 z-50 transition-all duration-300",
          hideBottomIsland ? "hidden" : "",
          isDocked && !hideBottomIsland ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none",
        ].join(" ")}
      >
        <div
          className={[
            "pointer-events-auto border border-white/20 bg-black/85 backdrop-blur-xl shadow-[0_16px_38px_rgba(0,0,0,0.45)] transition-[border-radius] duration-300 overflow-hidden",
            isBottomDropdownOpen ? "rounded-[28px]" : "rounded-full",
          ].join(" ")}
          onMouseEnter={() => setIsIslandOpen(true)}
          onMouseLeave={() => {
            setIsIslandOpen(false);
            handleBottomMouseLeave();
          }}
          onFocusCapture={() => setIsIslandOpen(true)}
          onBlurCapture={() => setIsIslandOpen(false)}
        >
          {/* Desktop Services Dropdown — opens upward, expands the island itself,
              in-flow. Both axes collapse together (see the matching top-nav
              dropdown for why grid-rows alone isn't enough) so the pill is
              truly narrow while closed instead of secretly pill-widened by
              the hidden cards' natural width. */}
          <div
            className={[
              "hidden md:grid transition-[grid-template-rows,grid-template-columns] duration-300 ease-out",
              isBottomDropdownOpen && isIslandOpen ? "grid-rows-[1fr] grid-cols-[1fr]" : "grid-rows-[0fr] grid-cols-[0fr]",
            ].join(" ")}
          >
            <div className="overflow-hidden min-w-0">
              <div className="flex flex-row gap-1 pl-4 pr-3 pt-3 pb-1 mb-0.5">
                {servicesDropdown.map((d) => (
                  <a
                    key={d.id}
                    href={d.href}
                    onClick={() => {
                      setIsBottomDropdownOpen(false);
                      setIsIslandOpen(false);
                    }}
                    className="group flex flex-col w-[190px] px-3.5 py-2.5 rounded-xl hover:bg-white/[0.08] transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5 whitespace-nowrap">
                        <span className="font-mono text-[10px] text-white/40 group-hover:text-white/80 transition-colors">
                          {d.id} /
                        </span>
                        {d.title}
                      </span>
                      <svg
                        className="w-3.5 h-3.5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14m-7-7l7 7-7 7" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-white/50 group-hover:text-white/80 mt-1 leading-tight transition-colors">
                      {d.desc}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className={["flex items-center transition-all duration-300", isIslandOpen ? "px-4 py-2.5" : "px-5 py-2.5"].join(" ")}>
            <button
              onClick={() => {
                if (isHomePage && window.innerWidth < 768) {
                  setIsIslandOpen((prev) => !prev);
                  return;
                }
                goTop();
              }}
              className="text-sm md:text-[1.15rem] font-bold tracking-[0.05em] whitespace-nowrap hover:opacity-85 transition-opacity cursor-pointer py-1.5 md:py-0"
              aria-label="Wróć na początek strony"
            >
              VANTAFRAME
            </button>

            {/* Grid-column reveal: animates to the exact natural content width
                (no arbitrary max-width guess), so the pill never overshoots
                or leaves an invisible oversized box when "closed". */}
            <div
              className={[
                "hidden md:grid transition-[grid-template-columns] duration-300 ease-out",
                isIslandOpen ? "grid-cols-[1fr]" : "grid-cols-[0fr]",
              ].join(" ")}
            >
              <div className="overflow-hidden flex items-center min-w-0">
                <div
                  className={[
                    "flex items-center transition-opacity duration-200",
                    isIslandOpen ? "opacity-100 ml-3" : "opacity-0 ml-3 pointer-events-none",
                  ].join(" ")}
                >
              {navItems.map((item) => {
                if (item.key === "services") {
                  return (
                    <div key={item.key} className="services-dropdown-container relative" onMouseEnter={handleBottomMouseEnter}>
                      <a
                        href={getSectionHref(item.key)}
                        onClick={(e) => scrollToSection(e, item.key)}
                        className={[
                          "inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] px-3 py-2 rounded-full transition-colors",
                          isBottomDropdownOpen ? "text-white bg-white/10" : "text-white/78 hover:text-white hover:bg-white/10",
                        ].join(" ")}
                      >
                        <span>{item.label}</span>
                        <svg
                          className={[
                            "w-3 h-3 transition-transform duration-200 opacity-60",
                            isBottomDropdownOpen ? "rotate-180 opacity-100" : "",
                          ].join(" ")}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M6 15l6-6 6 6" />
                        </svg>
                      </a>
                    </div>
                  );
                }

                return (
                  <a
                    key={item.key}
                    href={getSectionHref(item.key)}
                    onClick={(event) => scrollToSection(event, item.key)}
                    onMouseEnter={closeBottomDropdown}
                    className="text-[11px] uppercase tracking-[0.14em] px-3 py-2 rounded-full text-white/78 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {item.label}
                  </a>
                );
              })}
              <button
                onClick={toggleLang}
                onMouseEnter={closeBottomDropdown}
                className="ml-1 px-3 py-1.5 border border-white/25 rounded-full text-[10px] font-bold hover:bg-white hover:text-black transition-colors cursor-pointer"
                aria-label={lang === "pl" ? "Switch language to English" : "Przełącz język na polski"}
              >
                {lang === "pl" ? "EN" : "PL"}
              </button>
                </div>
              </div>
            </div>

            <div
              className={[
                "md:hidden flex items-center overflow-hidden transition-all duration-300",
                isIslandOpen ? "max-w-[280px] opacity-100 ml-2" : "max-w-0 opacity-0 ml-0",
              ].join(" ")}
            >
              {mobileItems.map((item) => (
                <a
                  key={item.key}
                  href={getSectionHref(item.key)}
                  onClick={(event) => scrollToSection(event, item.key)}
                  className="px-2.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.1em] text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={toggleLang}
                className="ml-1 px-2.5 py-1.5 border border-white/25 rounded-full text-[10px] font-bold hover:bg-white hover:text-black transition-colors cursor-pointer"
                aria-label={lang === "pl" ? "Switch language to English" : "Przełącz język na polski"}
              >
                {lang === "pl" ? "EN" : "PL"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

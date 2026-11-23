import React, { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "../lib/useStore";
import { currentLang, toggleLang } from "../i18n/store";
import { languages } from "../i18n/translations";
import { WIEDZA_PUBLIC } from "../data/wiedzaConfig";
// The "Wiedza" item is shown when the knowledge base is public, and always in `npm run dev` (see src/data/wiedzaConfig.js).
const SHOW_KNOWLEDGE = WIEDZA_PUBLIC || import.meta.env.DEV;
// Navigation, in the order of the offer: AI & automation (with a dropdown of its six services),
// systems, websites & stores, then work / about / contact and one call to action.
// Page items are real links to their pages; section items scroll on the home page and go to
// "/#section" everywhere else (never a relative "#section" that only works on "/").
//
// Layout switch: the full row (six items + CTA) needs about 1250px, so it is shown from the `xl`
// breakpoint; below it the compact bar with a "Menu" accordion is used (same pattern as the old
// mobile bar). The dropdown opens on hover, on keyboard focus and with ArrowDown/ArrowUp; inside it
// the arrow keys move between services and Escape closes it and returns focus to the trigger.
const Chevron = ({ up = false, open = false, className = "w-3 h-3" }) => (
  <svg
    className={[className, "transition-transform duration-200", open ? "rotate-180 opacity-100" : "opacity-60"].join(" ")}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d={up ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
  </svg>
);
const ArrowIcon = ({ className = "w-3.5 h-3.5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M5 12h14m-7-7l7 7-7 7" />
  </svg>
);
const Navbar = ({ pathname = "/" }) => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].nav;
  const aiMenu = t.aiMenu;
  const [isDocked, setIsDocked] = useState(false);
  const [hideBottomIsland, setHideBottomIsland] = useState(false);
  const [isIslandOpen, setIsIslandOpen] = useState(false);
  const [isTopDropdownOpen, setIsTopDropdownOpen] = useState(false);
  const [isBottomDropdownOpen, setIsBottomDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileBottomMenuOpen, setIsMobileBottomMenuOpen] = useState(false);
  const topDropdownTimeoutRef = useRef(null);
  const bottomDropdownTimeoutRef = useRef(null);
  const rafRef = useRef(0);
  const topTriggerRef = useRef(null);
  const bottomTriggerRef = useRef(null);
  const topPanelRef = useRef(null);
  const bottomPanelRef = useRef(null);
  const suppressFocusOpenRef = useRef(false);
  const path = pathname.replace(/\/+$/, "") || "/";
  const isHomePage = path === "/";
  const items = useMemo(
    () => [
      { key: "ai", label: t.ai, href: "/wdrozenia-ai/", dropdown: true, base: "/wdrozenia-ai" },
      { key: "sites", label: t.sites, href: "/strony/", base: "/strony" },
      { key: "systems", label: t.systems, href: "/systemy/", base: "/systemy" },
      { key: "work", label: t.work, href: "/portfolio/", base: "/portfolio" },
      ...(SHOW_KNOWLEDGE ? [{ key: "knowledge", label: t.knowledge, href: "/wiedza/", base: "/wiedza" }] : []),
      { key: "about", label: t.about, href: "/o-nas/", base: "/o-nas" },
      { key: "contact", label: t.contact, section: "contact" },
    ],
    [t]
  );
  // "page" = exactly this page, "true" = inside this part of the site (e.g. an AI sub-page)
  const currentOf = (item) => {
    if (!item.base) return undefined;
    if (path === item.base) return "page";
    return path.startsWith(`${item.base}/`) ? "true" : undefined;
  };
  const itemHref = (item) => item.href || (isHomePage ? `#${item.section}` : `/#${item.section}`);
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
        setIsMobileBottomMenuOpen(false);
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
  // Arriving on "/" from another page with #work / #contact (the menu links there as
  // "/#section"): the page's smooth-scroll library overrides the browser's own hash jump, so the
  // visitor would land at the top. Scroll to the section once the page has settled; a second pass
  // runs only if the first one left the page near the top (late hydration can shift positions).
  useEffect(() => {
    if (!isHomePage) return undefined;
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!["work", "contact"].includes(id)) return undefined;
    const timers = [];
    const go = () => {
      const target = document.getElementById(id);
      if (!target) return;
      if (window.__vfLenisScrollTo) window.__vfLenisScrollTo(target, { duration: 0.8 });
      else target.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const start = () => {
      timers.push(setTimeout(go, 400));
      timers.push(setTimeout(() => window.scrollY < 200 && go(), 1800));
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      timers.forEach(clearTimeout);
    };
  }, [isHomePage]);
  // Global click outside & ESC handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsTopDropdownOpen(false);
        setIsBottomDropdownOpen(false);
        setIsMobileMenuOpen(false);
        setIsMobileBottomMenuOpen(false);
      }
    };
    const handleClickOutside = (e) => {
      if (!e.target.closest(".services-dropdown-container, [data-dd]")) {
        setIsTopDropdownOpen(false);
        setIsBottomDropdownOpen(false);
      }
      if (!e.target.closest("[data-nav-root]")) {
        setIsMobileMenuOpen(false);
        setIsMobileBottomMenuOpen(false);
        setIsIslandOpen(false);
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
  // Hovering any other nav item collapses the AI dropdown immediately,
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
  const closeAllMenus = () => {
    setIsIslandOpen(false);
    setIsTopDropdownOpen(false);
    setIsBottomDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileBottomMenuOpen(false);
  };
  const scrollToSection = (event, key) => {
    if (!isHomePage) {
      return;
    }
    event.preventDefault();
    const target = document.getElementById(key);
    if (!target) return;
    if (window.__vfLenisScrollTo) {
      window.__vfLenisScrollTo(target);
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    closeAllMenus();
  };
  const onItemClick = (event, item) => {
    if (item.section) {
      scrollToSection(event, item.section);
      if (!isHomePage) closeAllMenus();
      return;
    }
    closeAllMenus();
  };
  const goTop = () => {
    if (!isHomePage) {
      window.location.href = "/";
      return;
    }
    if (window.__vfLenisScrollTo) {
      window.__vfLenisScrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsIslandOpen(false);
  };
  // ---- keyboard handling of the AI dropdown (shared by the top bar and the docked island) ----
  const variantOf = (v) =>
    v === "top"
      ? { open: isTopDropdownOpen, setOpen: setIsTopDropdownOpen, trigger: topTriggerRef, panel: topPanelRef }
      : { open: isBottomDropdownOpen, setOpen: setIsBottomDropdownOpen, trigger: bottomTriggerRef, panel: bottomPanelRef };
  const focusTrigger = (v) => {
    suppressFocusOpenRef.current = true;
    variantOf(v).trigger.current?.focus();
    setTimeout(() => {
      suppressFocusOpenRef.current = false;
    }, 0);
  };
  const onTriggerKeyDown = (e, v) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const { setOpen, panel } = variantOf(v);
    setOpen(true);
    setTimeout(() => panel.current?.querySelector("a")?.focus(), 0);
  };
  const onPanelKeyDown = (e, v) => {
    const { setOpen, panel } = variantOf(v);
    const links = Array.from(panel.current?.querySelectorAll("a") || []);
    const index = links.indexOf(document.activeElement);
    const move = (next) => {
      e.preventDefault();
      links[(next + links.length) % links.length]?.focus();
    };
    if (e.key === "ArrowDown" || e.key === "ArrowRight") move(index + 1);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") move(index - 1);
    else if (e.key === "Home") move(0);
    else if (e.key === "End") move(links.length - 1);
    else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      focusTrigger(v);
    }
  };
  // Focus anywhere in the nav: keep the dropdown open while focus is on its trigger or its links,
  // close it as soon as focus goes to another item or leaves the nav.
  const onNavFocus = (e, v) => {
    if (suppressFocusOpenRef.current) return;
    const { setOpen } = variantOf(v);
    setOpen(!!e.target.closest("[data-dd]"));
  };
  const onNavBlur = (e, v) => {
    if (!e.currentTarget.contains(e.relatedTarget)) variantOf(v).setOpen(false);
  };
  // ---- shared pieces ----
  const pillBase = "whitespace-nowrap text-[11px] uppercase tracking-[0.14em] px-3 py-2 rounded-full transition-colors";
  const pillIdle = "text-white/78 hover:text-white hover:bg-white/10";
  const pillOn = "text-white bg-white/10";
  const ActiveDot = () => <span aria-hidden="true" className="mr-1.5 inline-block h-1 w-1 rounded-full bg-cyan-300 align-middle" />;
  const renderDesktopItems = (v) => {
    const top = v === "top";
    const open = top ? isTopDropdownOpen : isBottomDropdownOpen;
    const enter = top ? handleTopMouseEnter : handleBottomMouseEnter;
    const closeDd = top ? closeTopDropdown : closeBottomDropdown;
    return (
      <>
        {items.map((item) => {
          const current = currentOf(item);
          if (item.dropdown) {
            return (
              <div key={item.key} className="services-dropdown-container relative" onMouseEnter={enter}>
                <a
                  ref={top ? topTriggerRef : bottomTriggerRef}
                  data-dd="ai"
                  href={itemHref(item)}
                  aria-haspopup="true"
                  aria-expanded={open}
                  aria-controls={`nav-ai-panel-${v}`}
                  aria-current={current}
                  onClick={(e) => onItemClick(e, item)}
                  onKeyDown={(e) => onTriggerKeyDown(e, v)}
                  className={["inline-flex items-center gap-1", pillBase, open || current ? pillOn : pillIdle].join(" ")}
                >
                  <span>
                    {current && <ActiveDot />}
                    {item.label}
                  </span>
                  <Chevron up={!top} open={open} />
                </a>
              </div>
            );
          }
          return (
            <a
              key={item.key}
              href={itemHref(item)}
              aria-current={current}
              onClick={(e) => onItemClick(e, item)}
              onMouseEnter={closeDd}
              className={[pillBase, current ? pillOn : pillIdle].join(" ")}
            >
              {current && <ActiveDot />}
              {item.label}
            </a>
          );
        })}
        <a
          href="/kreator-projektu/"
          onClick={closeAllMenus}
          onMouseEnter={closeDd}
          className="ml-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-black transition-colors hover:bg-white/85"
        >
          {t.cta}
        </a>
        <button
          onClick={toggleLang}
          onMouseEnter={closeDd}
          className="ml-1 px-3 py-1.5 border border-white/25 rounded-full text-[10px] font-bold hover:bg-white hover:text-black transition-colors cursor-pointer"
          aria-label={lang === "pl" ? "Switch language to English" : "Przełącz język na polski"}
        >
          {lang === "pl" ? "EN" : "PL"}
        </button>
      </>
    );
  };
  const renderDropdownPanel = (v) => {
    const top = v === "top";
    const open = top ? isTopDropdownOpen : isBottomDropdownOpen && isIslandOpen;
    return (
      <div
        className={[
          "hidden xl:grid transition-[grid-template-rows,grid-template-columns] duration-300 ease-out",
          open ? "grid-rows-[1fr] grid-cols-[1fr]" : "grid-rows-[0fr] grid-cols-[0fr]",
        ].join(" ")}
      >
        <div className="overflow-hidden min-w-0" inert={!open}>
          <div
            id={`nav-ai-panel-${v}`}
            ref={top ? topPanelRef : bottomPanelRef}
            role="group"
            aria-label={t.ai}
            onKeyDown={(e) => onPanelKeyDown(e, v)}
            className={
              top
                ? "grid grid-cols-3 gap-1 pl-5 pr-3 pb-3 pt-1 mt-0.5"
                : "grid grid-cols-3 gap-1 pl-4 pr-3 pt-3 pb-1 mb-0.5"
            }
          >
            {aiMenu.map((d) => (
              <a
                key={d.id}
                data-dd="ai"
                href={d.href}
                onClick={closeAllMenus}
                className="group flex flex-col w-[190px] px-3.5 py-2.5 rounded-xl hover:bg-white/[0.08] focus-visible:bg-white/[0.08] outline-none focus-visible:ring-1 focus-visible:ring-cyan-300/70 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5 whitespace-nowrap">
                    <span className="font-mono text-[10px] text-white/40 group-hover:text-white/80 transition-colors">{d.id} /</span>
                    {d.title}
                  </span>
                  <ArrowIcon />
                </div>
                <span className="text-[10px] text-white/50 group-hover:text-white/80 mt-1 leading-tight transition-colors">{d.desc}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  };
  // Compact menu (below xl): the whole menu in one accordion, with the CTA at the bottom.
  const renderMobileMenu = () => (
    <div className="xl:hidden max-h-[70vh] overflow-y-auto border-white/10 px-4 py-3 flex flex-col gap-1">
      {items.map((item) => {
        const current = currentOf(item);
        return (
          <React.Fragment key={item.key}>
            <a
              href={itemHref(item)}
              aria-current={current}
              onClick={(e) => onItemClick(e, item)}
              className={[
                "flex items-center justify-between py-2 px-2 rounded-lg hover:bg-white/5 text-xs",
                current ? "text-white font-bold" : "text-white/90 font-medium",
              ].join(" ")}
            >
              <span className="flex items-center gap-2">
                {current && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-cyan-300" />}
                {item.label}
              </span>
              <ArrowIcon className="w-3 h-3 text-white/40" />
            </a>
            {item.dropdown && (
              <div className="ml-3 mb-1 flex flex-col border-l border-white/10 pl-3">
                {aiMenu.map((d) => (
                  <a
                    key={d.id}
                    href={d.href}
                    onClick={closeAllMenus}
                    className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-white/5 text-[11px] text-white/70"
                  >
                    <span className="font-mono text-[10px] text-white/35">{d.id}</span>
                    {d.title}
                  </a>
                ))}
              </div>
            )}
          </React.Fragment>
        );
      })}
      <a
        href="/kreator-projektu/"
        onClick={closeAllMenus}
        className="mt-2 flex items-center justify-center rounded-full bg-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-black transition-colors hover:bg-white/85"
      >
        {t.cta}
      </a>
    </div>
  );
  const contactItem = items.find((i) => i.key === "contact");
  return (
    <>
      {/* ========================================================================= */}
      {/* TOP FLOATING NAVBAR                                                       */}
      {/* ========================================================================= */}
      <div
        className={[
          "fixed left-1/2 top-3 md:top-6 -translate-x-1/2 z-50 transition-all duration-300 w-max max-w-[calc(100vw-1rem)]",
          isDocked ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100 translate-y-0",
        ].join(" ")}
        inert={isDocked}
      >
        <nav
          data-nav-root
          aria-label={lang === "pl" ? "Menu główne" : "Main menu"}
          onMouseLeave={handleTopMouseLeave}
          onFocusCapture={(e) => onNavFocus(e, "top")}
          onBlurCapture={(e) => onNavBlur(e, "top")}
          className={[
            "pointer-events-auto border border-white/20 bg-black/85 backdrop-blur-xl shadow-[0_16px_38px_rgba(0,0,0,0.45)] transition-[border-radius] duration-300 overflow-hidden",
            isTopDropdownOpen || isMobileMenuOpen ? "rounded-[28px]" : "rounded-full",
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
            {/* Full navigation (xl and up) */}
            <div className="hidden xl:flex items-center ml-3">{renderDesktopItems("top")}</div>
            {/* Compact bar (below xl) */}
            <div className="xl:hidden flex items-center ml-2">
              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-expanded={isMobileMenuOpen}
                aria-controls="nav-mobile-menu-top"
                className={[
                  "px-2.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.1em] transition-colors flex items-center gap-1",
                  isMobileMenuOpen ? "text-white bg-white/15" : "text-white/80 hover:text-white hover:bg-white/10",
                ].join(" ")}
              >
                <span>{t.menu}</span>
                <Chevron open={isMobileMenuOpen} className="w-2.5 h-2.5" />
              </button>
              <a
                href={itemHref(contactItem)}
                onClick={(event) => onItemClick(event, contactItem)}
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
          {/* Desktop AI dropdown — expands the island itself, in-flow.
              Collapsing only grid-template-rows leaves the container's
              natural WIDTH (fixed-width cards) intact even at 0 height,
              which silently widens the pill even while "closed". Collapsing
              grid-template-columns in lockstep forces it to true 0x0. */}
          {renderDropdownPanel("top")}
          {/* Compact menu accordion */}
          {isMobileMenuOpen && (
            <div id="nav-mobile-menu-top" className="xl:hidden border-t border-white/10">
              {renderMobileMenu()}
            </div>
          )}
        </nav>
      </div>
      {/* ========================================================================= */}
      {/* DOCKED BOTTOM ISLAND                                                      */}
      {/* ========================================================================= */}
      <div
        className={[
          "fixed left-1/2 -translate-x-1/2 bottom-4 md:bottom-6 z-50 transition-all duration-300 w-max max-w-[calc(100vw-1rem)]",
          hideBottomIsland ? "hidden" : "",
          isDocked && !hideBottomIsland ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none",
        ].join(" ")}
      >
        <div
          data-nav-root
          role="navigation"
          aria-label={lang === "pl" ? "Menu główne (przypięte)" : "Main menu (docked)"}
          className={[
            "pointer-events-auto border border-white/20 bg-black/85 backdrop-blur-xl shadow-[0_16px_38px_rgba(0,0,0,0.45)] transition-[border-radius] duration-300 overflow-hidden",
            isBottomDropdownOpen || (isMobileBottomMenuOpen && isIslandOpen) ? "rounded-[28px]" : "rounded-full",
          ].join(" ")}
          onMouseEnter={() => setIsIslandOpen(true)}
          onMouseLeave={() => {
            setIsIslandOpen(false);
            handleBottomMouseLeave();
          }}
          onFocusCapture={(e) => {
            setIsIslandOpen(true);
            onNavFocus(e, "bottom");
          }}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setIsIslandOpen(false);
              setIsBottomDropdownOpen(false);
            }
          }}
        >
          {/* Desktop AI dropdown — opens upward, expands the island itself, in-flow. */}
          {renderDropdownPanel("bottom")}
          {/* Compact menu accordion — opens upward */}
          {isMobileBottomMenuOpen && isIslandOpen && (
            <div id="nav-mobile-menu-bottom" className="xl:hidden border-b border-white/10">
              {renderMobileMenu()}
            </div>
          )}
          <div className={["flex items-center transition-all duration-300", isIslandOpen ? "px-4 py-2.5" : "px-5 py-2.5"].join(" ")}>
            <button
              onClick={() => {
                // Below xl the docked island is a touch control: a tap on the logo opens it (touch
                // browsers also fire hover/focus first, so a toggle would immediately close it again);
                // tapping anywhere outside closes it.
                if (window.innerWidth < 1280) {
                  setIsIslandOpen(true);
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
                "hidden xl:grid transition-[grid-template-columns] duration-300 ease-out",
                isIslandOpen ? "grid-cols-[1fr]" : "grid-cols-[0fr]",
              ].join(" ")}
            >
              <div className="overflow-hidden flex items-center min-w-0">
                <div
                  className={[
                    "flex items-center transition-opacity duration-200",
                    isIslandOpen ? "opacity-100 ml-3" : "opacity-0 ml-3 pointer-events-none",
                  ].join(" ")}
                  inert={!isIslandOpen}
                >
                  {renderDesktopItems("bottom")}
                </div>
              </div>
            </div>
            <div
              className={[
                "xl:hidden flex items-center overflow-hidden transition-all duration-300",
                isIslandOpen ? "max-w-[280px] opacity-100 ml-2" : "max-w-0 opacity-0 ml-0",
              ].join(" ")}
              inert={!isIslandOpen}
            >
              <button
                onClick={() => setIsMobileBottomMenuOpen((prev) => !prev)}
                aria-expanded={isMobileBottomMenuOpen}
                aria-controls="nav-mobile-menu-bottom"
                className={[
                  "px-2.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.1em] transition-colors flex items-center gap-1",
                  isMobileBottomMenuOpen ? "text-white bg-white/15" : "text-white/80 hover:text-white hover:bg-white/10",
                ].join(" ")}
              >
                <span>{t.menu}</span>
                <Chevron up open={isMobileBottomMenuOpen} className="w-2.5 h-2.5" />
              </button>
              <a
                href={itemHref(contactItem)}
                onClick={(event) => onItemClick(event, contactItem)}
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
        </div>
      </div>
    </>
  );
};
export default Navbar;
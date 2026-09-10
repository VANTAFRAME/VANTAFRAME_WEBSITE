import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  PRESENTATION_NATIVE_SCROLL_ATTR,
  PRESENTATION_ROUTE_SELECTOR,
  PRESENTATION_SCROLLER_SELECTOR,
  PRESENTATION_SLIDE_SELECTOR,
  clamp,
  createCleanupBucket,
  setSlideProgress,
} from "./presentationRuntime";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_SNAP_STEP = 0.24;
const DEFAULT_SNAP_STEP = 0.36;

const PresentationRouteController = () => {
  useEffect(() => {
    const route = document.querySelector(PRESENTATION_ROUTE_SELECTOR);
    const scroller = route?.querySelector(PRESENTATION_SCROLLER_SELECTOR);
    if (!route || !scroller) return undefined;

    const cleanup = createCleanupBucket();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenisController = window.__vfLenisController;
    lenisController?.destroy?.();

    const docEl = document.documentElement;
    const body = document.body;
    const previousStyles = {
      htmlOverflow: docEl.style.overflow,
      htmlHeight: docEl.style.height,
      bodyOverflow: body.style.overflow,
      bodyHeight: body.style.height,
      bodyOverscroll: body.style.overscrollBehavior,
    };

    docEl.style.overflow = "hidden";
    docEl.style.height = "100%";
    body.style.overflow = "hidden";
    body.style.height = "100%";
    body.style.overscrollBehavior = "none";

    cleanup.add(() => {
      docEl.style.overflow = previousStyles.htmlOverflow;
      docEl.style.height = previousStyles.htmlHeight;
      body.style.overflow = previousStyles.bodyOverflow;
      body.style.height = previousStyles.bodyHeight;
      body.style.overscrollBehavior = previousStyles.bodyOverscroll;
      lenisController?.init?.();
    });

    const getSlides = () =>
      Array.from(scroller.querySelectorAll(PRESENTATION_SLIDE_SELECTOR)).map(
        (slide) => ({
          element: slide,
          top: slide.offsetTop,
          height: slide.offsetHeight,
          mode: slide.dataset.presentationMode || "standard",
        }),
      );

    const getCurrentIndex = (slides) => {
      const midpoint = scroller.scrollTop + scroller.clientHeight * 0.5;
      const activeIndex = slides.findIndex(
        (slide) =>
          midpoint >= slide.top &&
          midpoint < slide.top + slide.height,
      );

      if (activeIndex >= 0) return activeIndex;

      return slides.reduce((closestIndex, slide, index) => {
        const closestDistance = Math.abs(
          midpoint - (slides[closestIndex].top + slides[closestIndex].height * 0.5),
        );
        const distance = Math.abs(
          midpoint - (slide.top + slide.height * 0.5),
        );

        return distance < closestDistance ? index : closestIndex;
      }, 0);
    };

    const updateSlideStates = () => {
      const slides = getSlides();
      if (!slides.length) return;

      const activeIndex = getCurrentIndex(slides);
      route.dataset.presentationActiveIndex = String(activeIndex + 1);

      slides.forEach((slide, index) => {
        const progressRange = Math.max(1, slide.height - scroller.clientHeight);
        const rawProgress =
          slide.mode === "scrubbed"
            ? (scroller.scrollTop - slide.top) / progressRange
            : index === activeIndex
              ? 1
              : 0;

        setSlideProgress(slide.element, rawProgress);
        slide.element.dataset.presentationActive =
          index === activeIndex ? "true" : "false";
      });
    };

    let isAnimating = false;
    let wheelAccumulator = 0;
    let touchStart = null;
    let rafId = 0;
    let wheelResetId = 0;

    const getSnapType = () => (reducedMotion ? "y proximity" : "y mandatory");
    const setSnapEnabled = (enabled) => {
      scroller.style.scrollSnapType = enabled ? getSnapType() : "none";
    };

    const animateScrollTo = (target) => {
      if (document.body.classList.contains("presentation-locked")) return;
      if (Math.abs(scroller.scrollTop - target) < 2) {
        updateSlideStates();
        return;
      }

      isAnimating = true;
      setSnapEnabled(false);
      gsap.killTweensOf(scroller);

      gsap.to(scroller, {
        scrollTop: target,
        duration: reducedMotion ? 0.01 : 0.54,
        ease: reducedMotion ? "none" : "power2.out",
        overwrite: "auto",
        onUpdate: updateSlideStates,
        onComplete: () => {
          isAnimating = false;
          scroller.scrollTop = target;
          setSnapEnabled(true);
          updateSlideStates();
        },
      });
    };

    const stepWithinDeck = (direction) => {
      if (document.body.classList.contains("presentation-locked")) return;
      
      const slides = getSlides();
      if (!slides.length) return;

      const currentIndex = getCurrentIndex(slides);
      const currentSlide = slides[currentIndex];
      const currentTop = scroller.scrollTop;
      let target = currentTop;

      if (
        currentSlide.mode === "scrubbed" &&
        currentSlide.height > scroller.clientHeight
      ) {
        const stepDistance =
          scroller.clientHeight * (reducedMotion ? REDUCED_SNAP_STEP : DEFAULT_SNAP_STEP);
        const slideEnd = currentSlide.top + currentSlide.height - scroller.clientHeight;
        const threshold = 18;

        if (direction > 0 && currentTop < slideEnd - threshold) {
          target = Math.min(slideEnd, currentTop + stepDistance);
        } else if (direction < 0 && currentTop > currentSlide.top + threshold) {
          target = Math.max(currentSlide.top, currentTop - stepDistance);
        } else {
          const nextIndex = clamp(currentIndex + direction, 0, slides.length - 1);
          target = slides[nextIndex].top;
        }
      } else {
        const nextIndex = clamp(currentIndex + direction, 0, slides.length - 1);
        target = slides[nextIndex].top;
      }

      animateScrollTo(target);
    };

    const shouldAllowNativeScroll = (target) =>
      target?.closest?.(`[${PRESENTATION_NATIVE_SCROLL_ATTR}]`);

    const onWheel = (event) => {
      if (shouldAllowNativeScroll(event.target)) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      event.preventDefault();
      if (isAnimating) return;

      wheelAccumulator += event.deltaY;
      window.clearTimeout(wheelResetId);
      wheelResetId = window.setTimeout(() => {
        wheelAccumulator = 0;
      }, 140);

      if (Math.abs(wheelAccumulator) < 42) {
        return;
      }

      const direction = wheelAccumulator > 0 ? 1 : -1;
      wheelAccumulator = 0;
      stepWithinDeck(direction);
    };

    const onTouchStart = (event) => {
      if (event.touches.length !== 1 || shouldAllowNativeScroll(event.target)) {
        touchStart = null;
        return;
      }

      const { clientX, clientY } = event.touches[0];
      touchStart = { clientX, clientY };
    };

    const onTouchMove = (event) => {
      if (!touchStart || shouldAllowNativeScroll(event.target)) return;
      event.preventDefault();
    };

    const onTouchEnd = (event) => {
      if (!touchStart || shouldAllowNativeScroll(event.target) || isAnimating) {
        touchStart = null;
        return;
      }

      const touch = event.changedTouches[0];
      const deltaY = touchStart.clientY - touch.clientY;
      const deltaX = touchStart.clientX - touch.clientX;
      touchStart = null;

      if (Math.abs(deltaY) < 48 || Math.abs(deltaY) < Math.abs(deltaX)) {
        return;
      }

      stepWithinDeck(deltaY > 0 ? 1 : -1);
    };

    const onKeyDown = (event) => {
      const interactiveTag = event.target?.tagName;
      if (
        interactiveTag === "INPUT" ||
        interactiveTag === "TEXTAREA" ||
        interactiveTag === "SELECT"
      ) {
        return;
      }

      const slides = getSlides();
      if (!slides.length) return;

      if (event.key === "Home") {
        event.preventDefault();
        animateScrollTo(slides[0].top);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        animateScrollTo(slides[slides.length - 1].top);
        return;
      }

      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        if (!isAnimating) stepWithinDeck(1);
      }

      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        if (!isAnimating) stepWithinDeck(-1);
      }
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        updateSlideStates();
      });
    };
    const onResize = () => {
      updateSlideStates();
      ScrollTrigger.refresh();
    };

    scroller.addEventListener("wheel", onWheel, { passive: false });
    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("touchstart", onTouchStart, { passive: true });
    scroller.addEventListener("touchmove", onTouchMove, { passive: false });
    scroller.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    cleanup.add(() => {
      scroller.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("touchstart", onTouchStart);
      scroller.removeEventListener("touchmove", onTouchMove);
      scroller.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      gsap.killTweensOf(scroller);
      window.clearTimeout(wheelResetId);
      window.cancelAnimationFrame(rafId);
      scroller.style.scrollSnapType = "";
    });

    requestAnimationFrame(() => {
      setSnapEnabled(true);
      updateSlideStates();
      ScrollTrigger.refresh();
    });

    return () => cleanup.flush();
  }, []);

  return null;
};

export default PresentationRouteController;

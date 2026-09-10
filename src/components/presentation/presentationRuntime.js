export const PRESENTATION_ROUTE_SELECTOR = "[data-presentation-route]";
export const PRESENTATION_SCROLLER_SELECTOR = "[data-presentation-scroller]";
export const PRESENTATION_SLIDE_SELECTOR = "[data-presentation-slide]";
export const PRESENTATION_NATIVE_SCROLL_ATTR = "data-presentation-allow-native-scroll";

export const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const getPresentationRoute = (node = document) => {
  if (!node) return null;

  if (typeof node.closest === "function") {
    const route = node.closest(PRESENTATION_ROUTE_SELECTOR);
    if (route) return route;
  }

  return document.querySelector(PRESENTATION_ROUTE_SELECTOR);
};

export const getPresentationScroller = (node = document) => {
  const route = getPresentationRoute(node);
  return route?.querySelector(PRESENTATION_SCROLLER_SELECTOR) ?? null;
};

export const getPresentationSlide = (node) => {
  if (!node || typeof node.closest !== "function") return null;
  return node.closest(PRESENTATION_SLIDE_SELECTOR);
};

export const isReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const readSlideProgress = (slide) => {
  if (!slide) return 0;

  const progressValue =
    slide.style.getPropertyValue("--presentation-progress") ||
    slide.dataset.presentationProgress;

  return clamp(Number.parseFloat(progressValue || "0"));
};

export const setSlideProgress = (slide, value) => {
  if (!slide) return;

  const progress = clamp(value);
  slide.style.setProperty("--presentation-progress", progress.toFixed(4));
  slide.dataset.presentationProgress = progress.toFixed(4);
};

export const createCleanupBucket = () => {
  const tasks = [];

  return {
    add(task) {
      if (typeof task === "function") {
        tasks.push(task);
      }
    },
    flush() {
      while (tasks.length) {
        const task = tasks.pop();

        try {
          task?.();
        } catch {
          // Ignore individual cleanup errors so the rest can still run.
        }
      }
    },
  };
};

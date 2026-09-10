import { useEffect, useState } from "react";
import {
  getPresentationScroller,
  getPresentationSlide,
  isReducedMotion,
  readSlideProgress,
} from "./presentationRuntime";

export const presentationMotion = {
  cssEnterEase: "cubic-bezier(0.16, 1, 0.3, 1)",
  cssEmphasisEase: "cubic-bezier(0.22, 1, 0.36, 1)",
  gsapEnterEase: "power4.out",
  gsapEmphasisEase: "power2.out",
  scrubEase: "none",
};

export const usePresentationMotion = (scopeRef) => {
  const [context, setContext] = useState({
    scroller: null,
    slide: null,
    reducedMotion: false,
  });

  useEffect(() => {
    const node = scopeRef.current;
    if (!node) return undefined;

    setContext({
      scroller: getPresentationScroller(node),
      slide: getPresentationSlide(node),
      reducedMotion: isReducedMotion(),
    });

    return undefined;
  }, [scopeRef]);

  return context;
};

export const getSlideProgressValue = (slide) => readSlideProgress(slide);

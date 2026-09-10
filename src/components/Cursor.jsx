import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const Cursor = () => {
  const cursorDotRef = useRef(null);
  const cursorFrameRef = useRef(null);
  const cursorTextRef = useRef(null);
  const isHoveringRef = useRef(false);
  const activeInteractiveRef = useRef(null);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const dot = cursorDotRef.current;
    const frame = cursorFrameRef.current;
    const text = cursorTextRef.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (!dot || !frame || !text || prefersReducedMotion || !supportsFinePointer) return;

    const brackets = Array.from(frame.querySelectorAll("div"));

    gsap.set([dot, frame, text], {
      xPercent: -50,
      yPercent: -50,
      autoAlpha: 0,
      force3D: true,
    });
    gsap.set([dot, frame, text], { willChange: "transform, opacity" });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power2.out", overwrite: true });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power2.out", overwrite: true });
    const frameX = gsap.quickTo(frame, "x", { duration: 0.1, ease: "power2.out", overwrite: true });
    const frameY = gsap.quickTo(frame, "y", { duration: 0.1, ease: "power2.out", overwrite: true });
    const textX = gsap.quickTo(text, "x", { duration: 0.1, ease: "power2.out", overwrite: true });
    const textY = gsap.quickTo(text, "y", { duration: 0.1, ease: "power2.out", overwrite: true });

    const setCursorText = (value) => {
      if (text.firstChild) {
        text.firstChild.textContent = value;
      }
    };

    const updateHoverState = (interactiveEl) => {
      if (activeInteractiveRef.current === interactiveEl) {
        return;
      }

      activeInteractiveRef.current = interactiveEl;

      if (interactiveEl) {
        isHoveringRef.current = true;

        gsap.to(frame, {
          scale: 1.18,
          autoAlpha: 1,
          duration: 0.18,
          ease: "power2.out",
          overwrite: "auto",
        });

        gsap.to(brackets, {
          borderColor: "#22D3EE",
          duration: 0.18,
          ease: "power2.out",
          overwrite: "auto",
        });

        const explicitLabel = interactiveEl.dataset.cursorLabel?.trim();

        if (explicitLabel) {
          setCursorText(explicitLabel);
        } else if (interactiveEl.tagName === "A" && interactiveEl.href && !interactiveEl.href.includes("#")) {
          setCursorText("VIEW");
        } else if (interactiveEl.classList.contains("project-item")) {
          setCursorText("EXPLORE");
        } else {
          setCursorText("");
        }

        return;
      }

      isHoveringRef.current = false;

      gsap.to(frame, {
        scale: 1,
        autoAlpha: 0.55,
        duration: 0.16,
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(brackets, {
        borderColor: "rgba(255, 255, 255, 0.7)",
        duration: 0.16,
        ease: "power2.out",
        overwrite: "auto",
      });

      setCursorText("");
    };

    const moveCursor = (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const interactiveEl = target?.closest("a, button, [role=\"button\"], .cursor-hover") ?? null;

      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        gsap.set([dot, frame, text], { autoAlpha: 1 });
        gsap.set([dot, frame, text], { x: event.clientX, y: event.clientY });
      }

      updateHoverState(interactiveEl);

      dotX(event.clientX);
      dotY(event.clientY);
      frameX(event.clientX);
      frameY(event.clientY);
      textX(event.clientX);
      textY(event.clientY);
    };

    const handlePointerLeave = () => {
      activeInteractiveRef.current = null;
      isHoveringRef.current = false;
      gsap.to([dot, frame, text], {
        autoAlpha: 0,
        duration: 0.14,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseDown = () => {
      gsap.to(frame, {
        scale: isHoveringRef.current ? 1.08 : 0.9,
        duration: 0.12,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseUp = () => {
      gsap.to(frame, {
        scale: isHoveringRef.current ? 1.18 : 1,
        duration: 0.18,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("pointermove", moveCursor, { passive: true });
    window.addEventListener("pointerdown", handleMouseDown);
    window.addEventListener("pointerup", handleMouseUp);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", moveCursor);
      window.removeEventListener("pointerdown", handleMouseDown);
      window.removeEventListener("pointerup", handleMouseUp);
      window.removeEventListener("pointerleave", handlePointerLeave);
      gsap.killTweensOf([dot, frame, text, ...brackets]);
    };
  }, []);

  return (
    <>
      <div ref={cursorDotRef} className="fixed top-0 left-0 z-[9999] hidden h-1.5 w-1.5 rounded-full bg-white opacity-0 pointer-events-none mix-blend-difference md:block" />

      <div ref={cursorFrameRef} className="fixed top-0 left-0 z-[9998] hidden h-10 w-10 opacity-0 pointer-events-none md:block">
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 rounded-tl-sm border-white/70" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 rounded-tr-sm border-white/70" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 rounded-bl-sm border-white/70" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 rounded-br-sm border-white/70" />
      </div>

      <div ref={cursorTextRef} className="fixed top-0 left-0 z-[9997] hidden opacity-0 pointer-events-none md:block">
        <span className="inline-block mt-8 text-[10px] font-bold tracking-widest text-cyan-400 uppercase whitespace-nowrap drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
      </div>
    </>
  );
};

export default Cursor;

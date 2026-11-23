import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
// Browser frame with the full-page capture of the site. From lg (and without prefers-reduced-motion) the section is
// pinned and the page scrolls inside the frame as the visitor scrolls (scrub, ~175vh). Below lg and with reduced
// motion it is a static frame showing the top of the page. The frame has a fixed aspect ratio, so nothing shifts.
const CaseStudyPreview = ({ src, width, height, alt, label, fit = "scroll", url }) => {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const imgRef = useRef(null);
  useEffect(() => {
    if (fit !== "scroll") return undefined;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const viewport = viewportRef.current;
      const img = imgRef.current;
      if (!viewport || !img) return undefined;
      const distance = () => Math.max(0, img.offsetHeight - viewport.offsetHeight);
      const tween = gsap.to(img, {
        y: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 1.75)}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(img, { clearProps: "transform" });
      };
    });
    return () => mm.revert();
  }, [fit, src]);
  return (
    <section
      ref={sectionRef}
      aria-label={label}
      className="flex items-center justify-center px-4 py-10 md:px-12 lg:min-h-screen lg:py-0"
    >
      <div className="w-full lg:w-[min(1100px,calc((100vh-8rem)*1.6))]">
        <div className="overflow-hidden rounded-xl border border-white/12 bg-[#050505]">
          <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.02] px-4 py-3">
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            {url && <span className="ml-3 truncate font-mono text-[10px] tracking-wider text-white/35">{url}</span>}
          </div>
          <div ref={viewportRef} className="relative aspect-[16/10] overflow-hidden bg-black">
            {fit === "scroll" ? (
              <img
                ref={imgRef}
                src={src}
                alt={alt}
                width={width}
                height={height}
                loading="eager"
                decoding="async"
                className="absolute left-0 top-0 block h-auto w-full will-change-transform"
              />
            ) : (
              <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                loading="eager"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default CaseStudyPreview;
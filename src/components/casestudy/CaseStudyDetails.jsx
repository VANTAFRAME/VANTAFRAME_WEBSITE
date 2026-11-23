import React, { useEffect, useRef, useState } from "react";
// Detail frames of the solution. Below lg: a plain list of figures with captions. From lg: the frames sit in a
// sticky browser window and cross-fade as the matching caption (left column) scrolls through the middle of the screen.
const Frame = ({ children }) => (
  <div className="overflow-hidden rounded-xl border border-white/12 bg-[#050505]">
    <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.02] px-4 py-3">
      <span className="h-2 w-2 rounded-full bg-white/15" />
      <span className="h-2 w-2 rounded-full bg-white/15" />
      <span className="h-2 w-2 rounded-full bg-white/15" />
    </div>
    {children}
  </div>
);
const CaseStudyDetails = ({ frames, sizes }) => {
  const [active, setActive] = useState(0);
  const stepRefs = useRef([]);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.step));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [frames]);
  return (
    <>
      <ol className="flex flex-col gap-14 lg:hidden">
        {frames.map((f, i) => (
          <li key={f.src} data-reveal>
            <figure>
              <Frame>
                <img src={f.src} alt={f.alt} width={sizes[f.src]?.width} height={sizes[f.src]?.height} loading="lazy" decoding="async" className="block h-auto w-full" />
              </Frame>
              <figcaption className="mt-4 font-mono text-[11px] uppercase leading-relaxed tracking-widest text-white/55">
                <span className="text-white/35">0{i + 1}</span> · {f.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>
      <div className="hidden lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <ol>
          {frames.map((f, i) => (
            <li
              key={f.src}
              ref={(el) => (stepRefs.current[i] = el)}
              data-step={i}
              className={`flex min-h-[70vh] items-center border-t border-white/10 transition-opacity duration-500 motion-reduce:transition-none ${active === i ? "opacity-100" : "opacity-35"}`}
            >
              <p className="font-mono text-xs uppercase leading-relaxed tracking-widest text-white/70">
                <span className="mr-3 text-white/35">0{i + 1}</span>
                {f.caption}
              </p>
            </li>
          ))}
        </ol>
        <div className="relative">
          <div className="sticky top-[calc(50vh-12rem)]">
            <Frame>
              <div className="relative aspect-[16/10] bg-black">
                {frames.map((f, i) => (
                  <img
                    key={f.src}
                    src={f.src}
                    alt={f.alt}
                    width={sizes[f.src]?.width}
                    height={sizes[f.src]?.height}
                    loading="lazy"
                    decoding="async"
                    aria-hidden={active !== i}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 motion-reduce:transition-none ${active === i ? "opacity-100" : "opacity-0"}`}
                  />
                ))}
              </div>
            </Frame>
          </div>
        </div>
      </div>
    </>
  );
};
export default CaseStudyDetails;
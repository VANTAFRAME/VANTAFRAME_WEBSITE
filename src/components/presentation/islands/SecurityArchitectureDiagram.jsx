import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { presentationMotion, usePresentationMotion } from "../usePresentationMotion";

gsap.registerPlugin(ScrollTrigger);

const securityPanels = [
  {
    title: "Edge CDN",
    body: "Statyczny HTML i assety są podawane bezpośrednio z sieci brzegowej.",
  },
  {
    title: "Firewall Layer",
    body: "Brak publicznego panelu CMS, brak otwartej bazy, brak PHP runtime.",
  },
  {
    title: "Static Delivery",
    body: "Użytkownik otrzymuje gotowy dokument. Mniej powierzchni ataku, mniej punktów awarii.",
  },
];

const SecurityArchitectureDiagram = () => {
  const rootRef = useRef(null);
  const playedRef = useRef(false);
  const { scroller, slide, reducedMotion } = usePresentationMotion(rootRef);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !slide || !scroller) return undefined;

    const ctx = gsap.context(() => {
      const packets = gsap.utils.toArray(".security-packet", root);
      const threats = gsap.utils.toArray(".security-threat", root);
      const panels = gsap.utils.toArray(".security-panel", root);
      const signalTrack = root.querySelector(".security-signal-track");

      if (reducedMotion) {
        gsap.set(panels, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(panels, { autoAlpha: 0, y: 24 });
      gsap.set(packets, { x: -120, opacity: 0.34 });
      gsap.set(threats, { x: 0, opacity: 0.55 });

      ScrollTrigger.create({
        trigger: slide,
        scroller,
        start: "top 62%",
        once: true,
        onEnter: () => {
          if (playedRef.current) return;
          playedRef.current = true;

          const travelDistance = signalTrack ? signalTrack.clientWidth + 120 : 640;

          gsap.to(panels, {
            autoAlpha: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.82,
            ease: presentationMotion.gsapEnterEase,
          });

          packets.forEach((packet, index) => {
            gsap.fromTo(
              packet,
              {
                x: -120,
                opacity: 0.34,
              },
              {
                x: travelDistance,
                opacity: 0.98,
                duration: 3.45,
                ease: "none",
                repeat: -1,
                repeatDelay: 0.1,
                delay: 0.15 + index * 0.6,
              },
            );
          });

          gsap.to(threats, {
            x: -18,
            opacity: 0.18,
            duration: 1.8,
            ease: presentationMotion.gsapEmphasisEase,
            repeat: -1,
            yoyo: true,
            stagger: 0.2,
          });
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion, scroller, slide]);

  return (
    <div
      ref={rootRef}
      className="presentation-corner-frame relative min-h-[19rem] overflow-hidden px-4 py-5 md:min-h-[24rem] md:px-7 md:py-7"
    >
      <div className="absolute left-[7%] top-[15%] hidden max-w-[11.5rem] flex-col gap-3 xl:flex">
        <span className="security-threat rounded-full border border-white/12 bg-white/4 px-4 py-2 text-[0.68rem] uppercase tracking-[0.28em] text-white/42">
          SQL Injection
        </span>
        <span className="security-threat rounded-full border border-white/12 bg-white/4 px-4 py-2 text-[0.68rem] uppercase tracking-[0.28em] text-white/42">
          wp-admin brute force
        </span>
        <span className="security-threat rounded-full border border-white/12 bg-white/4 px-4 py-2 text-[0.68rem] uppercase tracking-[0.28em] text-white/42">
          plugin exploit
        </span>
      </div>

      <div className="relative z-10 xl:pb-[6.1rem]">
        <div className="grid grid-cols-2 gap-3 md:gap-5 md:[grid-auto-rows:1fr] xl:grid-cols-3 xl:items-stretch">
          {securityPanels.map((panel, index) => (
            <div
              key={panel.title}
              className={[
                "security-panel presentation-corner-frame relative flex h-full min-h-[12rem] flex-col px-4 py-4 md:min-h-[13rem] md:px-6 md:py-6",
                index === 2 ? "col-span-2 xl:col-span-1" : "",
              ].join(" ")}
            >
              <p className="presentation-stat-label text-cyan-300/78">{panel.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/66 md:mt-5 md:text-lg">
                {panel.body}
              </p>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden h-[6.1rem] xl:block">
          <div className="absolute inset-x-0 top-[3.55rem] h-px bg-gradient-to-r from-transparent via-cyan-200/46 to-transparent" />
          <div className="absolute inset-x-[4%] top-[3.55rem] h-12 -translate-y-1/2 bg-cyan-400/18 blur-2xl" />

          <div className="absolute inset-0 grid grid-cols-3 gap-5">
            {securityPanels.map((panel) => (
              <div key={`${panel.title}-connector`} className="relative flex justify-center">
                <span className="absolute top-0 h-[3.55rem] w-px bg-gradient-to-b from-white/28 to-cyan-300/24" />
                <span className="absolute top-[3.55rem] h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-cyan-300/70 bg-cyan-300/84 shadow-[0_0_16px_rgba(34,211,238,0.38)]" />
              </div>
            ))}
          </div>

          <div className="security-signal-track absolute inset-x-0 top-[3.55rem] h-5 -translate-y-1/2 overflow-hidden">
            {[0, 1, 2].map((packet) => (
              <span
                key={packet}
                className={[
                  "security-packet absolute left-0 top-1/2 -translate-y-1/2 rounded-full mix-blend-screen",
                  packet === 0
                    ? "h-3.5 w-28 bg-[linear-gradient(90deg,rgba(34,211,238,0)_0%,rgba(34,211,238,0.52)_28%,rgba(191,249,255,0.98)_70%,rgba(255,255,255,1)_100%)] shadow-[0_0_22px_rgba(34,211,238,0.5)]"
                    : packet === 1
                      ? "h-3 w-22 bg-[linear-gradient(90deg,rgba(34,211,238,0)_0%,rgba(34,211,238,0.34)_34%,rgba(191,249,255,0.84)_72%,rgba(255,255,255,0.9)_100%)] shadow-[0_0_18px_rgba(34,211,238,0.36)]"
                      : "h-2.5 w-18 bg-[linear-gradient(90deg,rgba(34,211,238,0)_0%,rgba(34,211,238,0.22)_36%,rgba(191,249,255,0.72)_75%,rgba(255,255,255,0.82)_100%)] shadow-[0_0_14px_rgba(34,211,238,0.28)]",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityArchitectureDiagram;

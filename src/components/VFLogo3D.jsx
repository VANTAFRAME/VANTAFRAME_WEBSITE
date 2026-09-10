import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VFLogo3D = () => {
    const containerRef = useRef(null);
    const logoWrapperRef = useRef(null);
    const imageRef = useRef(null);
    const svgRef = useRef(null);

    // References for animated elements
    const lineWebRef = useRef(null);
    const lineSysRef = useRef(null);
    const lineAutoRef = useRef(null);

    const nodeWebRef = useRef(null);
    const nodeSysRef = useRef(null);
    const nodeAutoRef = useRef(null);

    const pulseWebRef = useRef(null);
    const pulseSysRef = useRef(null);
    const pulseAutoRef = useRef(null);

    const hudGridRef = useRef(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const container = containerRef.current;
        const wrapper = logoWrapperRef.current;

        // Mouse Parallax
        let setParallaxX, setParallaxY, setLabelParallaxX, setLabelParallaxY;
        if (!prefersReducedMotion && wrapper) {
            setParallaxX = gsap.quickTo(wrapper, 'x', { duration: 0.9, ease: 'power2.out' });
            setParallaxY = gsap.quickTo(wrapper, 'y', { duration: 0.9, ease: 'power2.out' });
            setLabelParallaxX = gsap.quickTo('.node-label', { duration: 1.2, ease: 'power2.out' });
            setLabelParallaxY = gsap.quickTo('.node-label', { duration: 1.2, ease: 'power2.out' });

            const handlePointerMove = (e) => {
                const rect = container.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 24;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * 24;

                setParallaxX(x);
                setParallaxY(y);
                if (setLabelParallaxX && setLabelParallaxY) {
                    setLabelParallaxX(x * 1.4);
                    setLabelParallaxY(y * 1.4);
                }
            };

            window.addEventListener('pointermove', handlePointerMove, { passive: true });

            var cleanupParallax = () => {
                window.removeEventListener('pointermove', handlePointerMove);
            };
        }

        const ctx = gsap.context(() => {
            // Setup lines for draw-in effect
            const lines = [lineWebRef.current, lineSysRef.current, lineAutoRef.current].filter(Boolean);
            lines.forEach((line) => {
                const length = line.getTotalLength ? line.getTotalLength() : 300;
                gsap.set(line, {
                    strokeDasharray: length,
                    strokeDashoffset: length,
                    opacity: 0.85
                });
            });

            // Initial states
            gsap.set(imageRef.current, { opacity: 0, scale: 0.92, filter: 'blur(6px)' });
            gsap.set(hudGridRef.current, { opacity: 0 });
            gsap.set([nodeWebRef.current, nodeSysRef.current, nodeAutoRef.current], { opacity: 0, y: 8 });

            // Master Timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 75%',
                    toggleActions: 'play none none reverse'
                }
            });

            // 1. VF Core Reveal
            tl.to(imageRef.current, {
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
                duration: 1.4,
                ease: 'power3.out'
            })
            .to(hudGridRef.current, {
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out'
            }, '-=0.9');

            // 2. Node 01 / WEB
            if (lineWebRef.current) {
                tl.to(lineWebRef.current, {
                    strokeDashoffset: 0,
                    duration: 0.65,
                    ease: 'power2.inOut'
                }, '-=0.3');
            }
            tl.to(nodeWebRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.2');

            // 3. Node 02 / SYSTEMS
            if (lineSysRef.current) {
                tl.to(lineSysRef.current, {
                    strokeDashoffset: 0,
                    duration: 0.65,
                    ease: 'power2.inOut'
                }, '-=0.15');
            }
            tl.to(nodeSysRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.2');

            // 4. Node 03 / AUTOMATION
            if (lineAutoRef.current) {
                tl.to(lineAutoRef.current, {
                    strokeDashoffset: 0,
                    duration: 0.65,
                    ease: 'power2.inOut'
                }, '-=0.15');
            }
            tl.to(nodeAutoRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.2');

            // 5. Continuous Loop: Signal Pulses & Subtle Float
            if (!prefersReducedMotion) {
                // Subtle breathing float for the logo
                gsap.to(imageRef.current, {
                    y: -6,
                    duration: 4,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true
                });

                // Micro pulse on nodes in loop
                const pulseNodes = [pulseWebRef.current, pulseSysRef.current, pulseAutoRef.current].filter(Boolean);
                if (pulseNodes.length > 0) {
                    gsap.timeline({ repeat: -1, repeatDelay: 1 })
                        .to(pulseWebRef.current, { opacity: 1, scale: 1.4, duration: 0.35, yoyo: true, repeat: 1, ease: 'power2.out' }, '+=0.5')
                        .to(pulseSysRef.current, { opacity: 1, scale: 1.4, duration: 0.35, yoyo: true, repeat: 1, ease: 'power2.out' }, '+=0.8')
                        .to(pulseAutoRef.current, { opacity: 1, scale: 1.4, duration: 0.35, yoyo: true, repeat: 1, ease: 'power2.out' }, '+=0.8');
                }
            }
        }, containerRef);

        return () => {
            if (cleanupParallax) cleanupParallax();
            ctx.revert();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full h-full min-h-[420px] md:min-h-[620px] max-w-[760px] flex justify-center items-center relative select-none"
        >
            {/* Parallax Interactive Wrapper */}
            <div
                ref={logoWrapperRef}
                className="relative w-full aspect-square max-w-[700px] flex items-center justify-center"
            >
                {/* SVG Blueprint & Leader Lines Layer */}
                <svg
                    ref={svgRef}
                    viewBox="0 0 600 600"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
                >
                    <defs>
                        {/* Glow Filter for Points */}
                        <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Subtle Dash Pattern */}
                        <pattern id="diagGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="0.6" fill="rgba(255,255,255,0.08)" />
                        </pattern>
                    </defs>

                    {/* HUD Technical Frame & Precision Crosshairs */}
                    <g ref={hudGridRef} className="hud-elements transition-opacity duration-700">
                        {/* Blueprint Radial / Polygonal Guide Lines */}
                        <circle
                            cx="300"
                            cy="300"
                            r="215"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="1"
                            strokeDasharray="2 6"
                        />
                        <circle
                            cx="300"
                            cy="300"
                            r="275"
                            stroke="rgba(255,255,255,0.03)"
                            strokeWidth="0.75"
                        />

                        {/* Corner Registration Crosshairs (+) */}
                        <g stroke="rgba(255,255,255,0.25)" strokeWidth="1">
                            {/* Top Left */}
                            <path d="M 40 48 L 40 32 M 32 40 L 48 40" />
                            {/* Top Right */}
                            <path d="M 560 48 L 560 32 M 552 40 L 568 40" />
                            {/* Bottom Left */}
                            <path d="M 40 568 L 40 552 M 32 560 L 48 560" />
                            {/* Bottom Right */}
                            <path d="M 560 568 L 560 552 M 552 560 L 568 560" />
                        </g>

                        {/* Fine Axis Ticks */}
                        <line x1="300" y1="20" x2="300" y2="35" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                        <line x1="300" y1="565" x2="300" y2="580" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                        <line x1="20" y1="300" x2="35" y2="300" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                        <line x1="565" y1="300" x2="580" y2="300" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

                        {/* Technical Metadata in SVG */}
                        <text
                            x="48"
                            y="52"
                            fill="rgba(255,255,255,0.22)"
                            fontSize="8"
                            fontFamily="monospace"
                            letterSpacing="0.25em"
                        >
                            SYS.SPEC // 03-CORE
                        </text>
                        <text
                            x="552"
                            y="52"
                            textAnchor="end"
                            fill="rgba(255,255,255,0.22)"
                            fontSize="8"
                            fontFamily="monospace"
                            letterSpacing="0.25em"
                        >
                            VANTAFRAME ARCHITECTURE
                        </text>
                    </g>

                    {/* ============================================================== */}
                    {/* LEADER LINES CONNECTING VF CORE TO THE 3 NODES */}
                    {/* ============================================================== */}

                    {/* 01 / WEB — Line from VF upper-left wing to top-left label */}
                    <g>
                        <path
                            ref={lineWebRef}
                            d="M 235 240 L 175 160 L 95 160"
                            stroke="rgba(255,255,255,0.55)"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {/* Anchor Node Dot at VF Connection Point */}
                        <circle cx="235" cy="240" r="2.5" fill="#ffffff" filter="url(#nodeGlow)" />
                        {/* Terminal Anchor Circle at Label */}
                        <circle cx="95" cy="160" r="3" fill="#000000" stroke="#ffffff" strokeWidth="1.2" />
                        {/* Signal Pulse Indicator */}
                        <circle
                            ref={pulseWebRef}
                            cx="95"
                            cy="160"
                            r="5"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="1"
                            opacity="0"
                        />
                    </g>

                    {/* 02 / SYSTEMS — Line from VF upper-right wing to top-right label */}
                    <g>
                        <path
                            ref={lineSysRef}
                            d="M 370 230 L 435 150 L 505 150"
                            stroke="rgba(255,255,255,0.55)"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {/* Anchor Node Dot at VF Connection Point */}
                        <circle cx="370" cy="230" r="2.5" fill="#ffffff" filter="url(#nodeGlow)" />
                        {/* Terminal Anchor Circle at Label */}
                        <circle cx="505" cy="150" r="3" fill="#000000" stroke="#ffffff" strokeWidth="1.2" />
                        {/* Signal Pulse Indicator */}
                        <circle
                            ref={pulseSysRef}
                            cx="505"
                            cy="150"
                            r="5"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="1"
                            opacity="0"
                        />
                    </g>

                    {/* 03 / AUTOMATION — Line from VF lower junction to bottom-right label */}
                    <g>
                        <path
                            ref={lineAutoRef}
                            d="M 330 380 L 400 450 L 475 450"
                            stroke="rgba(255,255,255,0.55)"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {/* Anchor Node Dot at VF Connection Point */}
                        <circle cx="330" cy="380" r="2.5" fill="#ffffff" filter="url(#nodeGlow)" />
                        {/* Terminal Anchor Circle at Label */}
                        <circle cx="475" cy="450" r="3" fill="#000000" stroke="#ffffff" strokeWidth="1.2" />
                        {/* Signal Pulse Indicator */}
                        <circle
                            ref={pulseAutoRef}
                            cx="475"
                            cy="450"
                            r="5"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="1"
                            opacity="0"
                        />
                    </g>
                </svg>

                {/* Central VF Wireframe Image with feather mask */}
                <div
                    className="relative w-[84%] max-w-[560px] aspect-square flex justify-center items-center z-0"
                    style={{
                        maskImage: 'radial-gradient(circle at center, black 68%, transparent 97%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, black 68%, transparent 97%)'
                    }}
                >
                    <img
                        ref={imageRef}
                        src="/vf-logo-wireframe.png"
                        alt="VANTAFRAME Architectural Core"
                        className="w-full h-full object-contain mix-blend-screen pointer-events-none"
                        style={{ filter: 'contrast(1.35) brightness(1.05)' }}
                        loading="eager"
                        decoding="async"
                    />
                </div>

                {/* ============================================================== */}
                {/* HTML LABELS / HUD CALLOUTS (Positioned in relative percentages) */}
                {/* ============================================================== */}

                {/* Node 01: 01 / WEB */}
                <div
                    ref={nodeWebRef}
                    style={{ left: '3%', top: '21%' }}
                    className="node-label absolute z-20 flex flex-col items-start text-left pointer-events-none"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] sm:text-xs md:text-[13px] font-mono font-bold tracking-[0.22em] text-white bg-[#000000] px-2.5 py-1 rounded border border-white/20">
                            01 / WEB
                        </span>
                    </div>
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] font-mono tracking-[0.18em] text-white/45 uppercase mt-1 pl-1">
                        Websites & Commerce
                    </span>
                </div>

                {/* Node 02: 02 / SYSTEMS */}
                <div
                    ref={nodeSysRef}
                    style={{ right: '3%', top: '19%' }}
                    className="node-label absolute z-20 flex flex-col items-end text-right pointer-events-none"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] sm:text-xs md:text-[13px] font-mono font-bold tracking-[0.22em] text-white bg-[#000000] px-2.5 py-1 rounded border border-white/20">
                            02 / SYSTEMS
                        </span>
                    </div>
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] font-mono tracking-[0.18em] text-white/45 uppercase mt-1 pr-1">
                        Systems & Applications
                    </span>
                </div>

                {/* Node 03: 03 / AUTOMATION */}
                <div
                    ref={nodeAutoRef}
                    style={{ right: '8%', bottom: '20%' }}
                    className="node-label absolute z-20 flex flex-col items-end text-right pointer-events-none"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] sm:text-xs md:text-[13px] font-mono font-bold tracking-[0.22em] text-white bg-[#000000] px-2.5 py-1 rounded border border-white/20">
                            03 / AUTOMATION
                        </span>
                    </div>
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] font-mono tracking-[0.18em] text-white/45 uppercase mt-1 pr-1">
                        Automation & AI
                    </span>
                </div>
            </div>
        </div>
    );
};

export default VFLogo3D;

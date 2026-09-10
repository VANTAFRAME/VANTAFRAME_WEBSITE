import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SectionConnector = ({ position = 'left' }) => {
    const lineRef = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        const line = lineRef.current;
        const glow = glowRef.current;

        if (!line || !glow) return;

        const ctx = gsap.context(() => {
            // Get the section element (grandparent of line)
            const section = line.parentElement?.parentElement;

            if (!section) return;

            // Set initial state - HIDDEN
            gsap.set([line, glow], { opacity: 0 });

            // Create ScrollTrigger with explicit callbacks
            ScrollTrigger.create({
                trigger: section,
                start: 'top 60%',
                end: 'bottom 40%',
                onEnter: () => {
                    // Show lines when entering section (with delay)
                    gsap.to(line, { opacity: 1, duration: 2, ease: 'power2.out', delay: 0.3 });
                    gsap.to(glow, { opacity: 0.6, duration: 1.6, ease: 'power2.out', delay: 0.3 });
                },
                onLeave: () => {
                    // Hide lines when leaving section (scrolling down)
                    gsap.to(line, { opacity: 0, duration: 1.2, ease: 'power2.in' });
                    gsap.to(glow, { opacity: 0, duration: 1, ease: 'power2.in' });
                },
                onEnterBack: () => {
                    // Show lines when entering section again (scrolling up, with delay)
                    gsap.to(line, { opacity: 1, duration: 2, ease: 'power2.out', delay: 0.3 });
                    gsap.to(glow, { opacity: 0.6, duration: 1.6, ease: 'power2.out', delay: 0.3 });
                },
                onLeaveBack: () => {
                    // Hide lines when leaving section (scrolling up)
                    gsap.to(line, { opacity: 0, duration: 1.2, ease: 'power2.in' });
                    gsap.to(glow, { opacity: 0, duration: 1, ease: 'power2.in' });
                }
            });
        });

        return () => ctx.revert();
    }, []);

    const positionClass = position === 'left' ? 'left-6' : 'right-6';

    return (
        <div className={`absolute ${positionClass} top-0 h-full w-px pointer-events-none hidden md:block z-10`}>
            {/* Main line - shorter gradient */}
            <div
                ref={lineRef}
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent from-15% via-cyan-400/30 via-50% to-transparent to-85%"
            />

            {/* Glow effect - shorter gradient */}
            <div
                ref={glowRef}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-full bg-gradient-to-b from-transparent from-15% via-cyan-400/20 via-50% to-transparent to-85% blur-md"
            />
        </div>
    );
};

export default SectionConnector;

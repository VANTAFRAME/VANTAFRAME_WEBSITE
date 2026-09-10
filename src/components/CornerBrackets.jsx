import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CornerBrackets = () => {
    const bracketsRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Fade in animation on load
            gsap.fromTo('.corner-bracket',
                { opacity: 0, scale: 0.8 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1.5,
                    ease: 'power2.out',
                    stagger: 0.1,
                    delay: 0.5
                }
            );

            // Subtle pulse animation
            gsap.to('.corner-bracket', {
                opacity: 0.4,
                duration: 2,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                stagger: {
                    each: 0.3,
                    from: 'random'
                }
            });

        }, bracketsRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={bracketsRef} className="fixed inset-0 pointer-events-none z-[9990] hidden md:block">
            {/* Top Left */}
            <div className="corner-bracket absolute top-6 left-6 w-12 h-12 opacity-30">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-white/60 to-transparent rounded-full" />
                <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-white/60 to-transparent rounded-full" />
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/40 rounded-tl-md" />
            </div>

            {/* Top Right */}
            <div className="corner-bracket absolute top-6 right-6 w-12 h-12 opacity-30">
                <div className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-white/60 to-transparent rounded-full" />
                <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-white/60 to-transparent rounded-full" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/40 rounded-tr-md" />
            </div>

            {/* Bottom Left */}
            {/* Bottom Left */}
            <div className="corner-bracket absolute bottom-6 left-6 w-12 h-12 opacity-30">
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-white/60 to-transparent rounded-full" />
                <div className="absolute bottom-0 left-0 w-0.5 h-full bg-gradient-to-t from-white/60 to-transparent rounded-full" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/40 rounded-bl-md" />
            </div>

            {/* Bottom Right */}
            <div className="corner-bracket absolute bottom-6 right-6 w-12 h-12 opacity-30">
                <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-white/60 to-transparent rounded-full" />
                <div className="absolute bottom-0 right-0 w-0.5 h-full bg-gradient-to-t from-white/60 to-transparent rounded-full" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/40 rounded-br-md" />
            </div>
        </div>
    );
};

export default CornerBrackets;

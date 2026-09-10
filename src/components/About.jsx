import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../lib/useStore';
import { currentLang } from '../i18n/store';
import { languages } from '../i18n/translations';
import SectionConnector from './SectionConnector';
import VFLogo3D from './VFLogo3D';


gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const lang = useStore(currentLang, () => "pl");
    const t = languages[lang].about;
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const visualRef = useRef(null);
    const vfRef = useRef(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const section = sectionRef.current;
        const visual = vfRef.current;

        if (visual) {
            gsap.set(visual, { transformPerspective: 1000, transformStyle: 'preserve-3d' });
        }

        const setRotateY = visual ? gsap.quickTo(visual, 'rotateY', { duration: 0.9, ease: 'power2.out' }) : null;
        const setRotateX = visual ? gsap.quickTo(visual, 'rotateX', { duration: 0.9, ease: 'power2.out' }) : null;

        // Mouse Parallax Handler
        const handlePointerMove = (e) => {
            if (prefersReducedMotion || !setRotateY || !setRotateX) return;
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 30;
            const y = (clientY / window.innerHeight - 0.5) * 30;

            setRotateY(x);
            setRotateX(-y);
        };

        // Add Event Listener
        if (section) {
            section.addEventListener('pointermove', handlePointerMove, { passive: true });
        }

        // GSAP Context for Scroll Animations
        const ctx = gsap.context(() => {
            // Text Animations
            gsap.fromTo(textRef.current.children,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 70%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );

            // Visual Reveal
            gsap.fromTo(visualRef.current,
                { opacity: 0, scale: 0.8 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 70%',
                        end: 'bottom top',
                        scrub: 1
                    }
                }
            );
        }, sectionRef);

        // Cleanup
        return () => {
            if (section) {
                section.removeEventListener('pointermove', handlePointerMove);
            }
            ctx.revert();
        };
    }, [lang]);

    return (
        <section id="why_us" ref={sectionRef} className="py-20 px-6 md:px-12 bg-[#000000] text-white relative z-10 overflow-hidden min-h-screen flex items-center">
            <SectionConnector position="left" />
            <SectionConnector position="right" />
            <div className="max-w-[1800px] mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-16 md:gap-32">

                {/* Text Content */}
                <div ref={textRef} className="md:w-1/2 z-10">
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
                        {t.heading} <br className="hidden md:block" />
                        <span className="text-white/50">
                            {t.headingHighlight}
                        </span> <br className="hidden md:block" />
                        {t.headingEnd}
                    </h2>
                    <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-12 max-w-xl">
                        {t.desc}
                    </p>
                    <a href="#contact" className="inline-block px-8 py-4 border border-white/30 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                        {t.cta}
                    </a>
                </div>

                {/* Visual Content (VF 3D Representation) */}
                <div ref={visualRef} className="md:w-1/2 flex justify-center items-center relative perspective-1000">
                    {/* The "VF" Graphic - 3D Wireframe */}
                    <div ref={vfRef} className="relative w-full h-[58vh] md:h-[64vh] flex items-center justify-center">
                        <VFLogo3D />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;

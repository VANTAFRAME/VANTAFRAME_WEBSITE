import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../lib/useStore';
import { currentLang } from '../i18n/store';
import { languages } from '../i18n/translations';

const Hero = () => {
    const lang = useStore(currentLang, () => "pl");
    const t = languages[lang].hero;

    const containerRef = useRef(null);
    const textRef = useRef(null);
    const bgRef = useRef(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
            const section = containerRef.current;
            const text = textRef.current;
            const background = bgRef.current;
            if (!section || !text || !background) return;
            const revealItems = text.querySelectorAll('.hero-reveal');

            const setTextX = gsap.quickTo(text, 'x', { duration: 0.8, ease: 'power2.out' });
            const setTextY = gsap.quickTo(text, 'y', { duration: 0.8, ease: 'power2.out' });
            const setBgX = gsap.quickTo(background, 'x', { duration: 1.2, ease: 'power2.out' });
            const setBgY = gsap.quickTo(background, 'y', { duration: 1.2, ease: 'power2.out' });

            const handlePointerMove = (e) => {
                if (prefersReducedMotion) return;
                const { clientX, clientY } = e;
                const x = (clientX / window.innerWidth - 0.5) * 20;
                const y = (clientY / window.innerHeight - 0.5) * 20;

                setTextX(x);
                setTextY(y);
                setBgX(-x * 2);
                setBgY(-y * 2);
            };

            section.addEventListener('pointermove', handlePointerMove, { passive: true });

            // Reveal Animation
            const tl = gsap.timeline();
            tl.fromTo(bgRef.current,
                { scale: 1.2, opacity: 0 },
                { scale: 1, opacity: 0.4, duration: 1.5, ease: 'power4.out' }
            )
                .fromTo(revealItems,
                    { y: 28 },
                    { y: 0, duration: 0.85, stagger: 0.08, ease: 'power3.out', clearProps: 'transform' },
                    "-=1"
                );

            // Scroll exit animation
            gsap.to(revealItems, {
                y: -80,
                opacity: 0,
                stagger: 0.04,
                ease: 'power2.in',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: '20% top',
                    end: '80% top',
                    scrub: 2,
                }
            });

            // Cleanup
            return () => section.removeEventListener('pointermove', handlePointerMove);
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-brand-black">
            {/* Background Elements */}
            <div ref={bgRef} className="absolute inset-0 z-0">
                {/* Soft Grid Background */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(34, 211, 238, 0.3) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(34, 211, 238, 0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: '80px 80px',
                        maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)'
                    }}
                />

                {/* Soft glow on grid */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(34, 211, 238, 0.5) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(34, 211, 238, 0.5) 1px, transparent 1px)
                        `,
                        backgroundSize: '80px 80px',
                        filter: 'blur(1px)',
                        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)'
                    }}
                />

                {/* Existing blur elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[72vw] h-[72vw] bg-white/6 rounded-full blur-[120px]" />
                <div className="absolute top-0 right-0 w-[48vw] h-[48vw] bg-cyan-400/6 rounded-full blur-[140px]" />
                <div className="absolute -bottom-20 left-0 w-[44vw] h-[44vw] bg-cyan-500/5 rounded-full blur-[130px]" />
                <div className="absolute bottom-0 right-0 w-[36vw] h-[36vw] bg-cyan-400/[0.04] rounded-full blur-[120px]" />
            </div>

            {/* Content */}
            <div ref={textRef} className="relative z-10 w-full px-4 md:px-8">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="select-none text-[clamp(7rem,32vw,34rem)] font-black tracking-[-0.07em] text-white/[0.038] leading-none">
                        VANTAFRAME
                    </span>
                </div>
                <div className="relative mx-auto max-w-[1700px] text-center drop-shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
                    <h2 className="hero-reveal text-xs md:text-base font-light tracking-[0.55em] text-white/60 mb-4 uppercase">{t.subtitle}</h2>
                    <h1 className="hero-reveal text-[clamp(4.5rem,18vw,19rem)] font-black tracking-[-0.055em] text-white leading-[0.78] uppercase">
                        <div className="overflow-hidden"><span className="inline-block">VANTA</span></div>
                        <div className="overflow-hidden -mt-1 md:-mt-4"><span className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/45">FRAME</span></div>
                    </h1>
                    <div className="hero-reveal mt-8 md:mt-10 flex flex-col items-center gap-4 overflow-hidden">
                        <a href="#work" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-all transform hover:scale-105">
                            <span>{t.cta}</span>
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-24 md:bottom-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-50">
                <span className="text-[10px] uppercase tracking-widest">{t.scroll}</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
            </div>
            <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </section>
    );
};

export default Hero;

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../lib/useStore';
import { currentLang } from '../i18n/store';
import { languages } from '../i18n/translations';
import SectionConnector from './SectionConnector';

gsap.registerPlugin(ScrollTrigger);

const Process = () => {
    const lang = useStore(currentLang, () => "pl");
    const t = languages[lang].process;

    const sectionRef = useRef(null);
    const lineRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Line Animation
            gsap.fromTo(lineRef.current,
                { height: 0 },
                {
                    height: '100%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 60%',
                        end: 'bottom 80%',
                        scrub: 1,
                    }
                }
            );

            // Steps Reveal
            const stepElements = sectionRef.current?.querySelectorAll('.process-step') || [];
            stepElements.forEach((step) => {
                gsap.fromTo(step,
                    { opacity: 0, x: -50 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: step,
                            start: 'top 80%',
                            end: 'bottom 80%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });

        }, sectionRef);
        return () => ctx.revert();
    }, [lang]);

    return (
        <section id="process" ref={sectionRef} className="py-24 md:py-32 px-6 md:px-12 bg-brand-dark relative z-10 overflow-hidden">
            <SectionConnector position="left" />
            <SectionConnector position="right" />
            <div className="max-w-4xl mx-auto relative">
                <h2 className="text-sm font-bold tracking-widest uppercase text-white/40 mb-16 text-center">{t.title}</h2>

                <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-white/10 hidden md:block"></div>
                <div ref={lineRef} className="absolute left-4 top-0 w-[1px] bg-white hidden md:block"></div>

                <div className="flex flex-col gap-12 md:gap-20">
                    {t.steps.map((step) => (
                        <div key={step.id} className="process-step group flex flex-col md:flex-row gap-6 md:gap-12 relative pl-12 md:pl-0">
                            <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[clamp(4rem,12vw,9rem)] font-black text-white/[0.025] leading-none select-none hidden md:block">
                              0{step.id}
                            </span>
                            {/* Mobile Line */}
                            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/20 md:hidden"></div>

                            <div className="md:w-32 flex justify-end md:pr-12 relative">
                                <span className="text-[10px] font-mono text-white/30 tracking-widest">0{step.id}</span>
                            </div>
                            <div className="md:w-1/2">
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors duration-300">{step.title}</h3>
                                <p className="text-white/60">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Process;

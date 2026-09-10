import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../lib/useStore';
import { currentLang } from '../i18n/store';
import { languages } from '../i18n/translations';
import SectionConnector from './SectionConnector';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
    const lang = useStore(currentLang, () => "pl");
    const t = languages[lang].services;
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const items = sectionRef.current?.querySelectorAll('.service-item') || [];

            items.forEach((item) => {
                gsap.fromTo(item,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 80%',
                            end: 'top 50%',
                            scrub: false
                        }
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [lang]);

    return (
        <section id="services" ref={sectionRef} className="py-24 md:py-32 px-6 md:px-12 bg-brand-black relative z-10">
            <SectionConnector position="left" />
            <SectionConnector position="right" />
            <div className="max-w-[1800px] mx-auto">
                <div className="mb-20">
                    <h2 className="text-sm md:text-base font-bold tracking-widest uppercase text-white/40">{t.title}</h2>
                    <h3 className="text-4xl md:text-6xl font-extralight text-white leading-tight">
                        {t.heading} <br />
                        <span className="italic font-serif bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">{t.headingAccent}</span>.
                    </h3>
                </div>

                <div className="flex flex-col">
                    {t.items.map((service) => (
                        <a
                            key={service.id}
                            href={service.slug}
                            data-cursor-label="ZOBACZ"
                            className="service-item cursor-hover group block border-t border-white/10 hover:border-white/25 transition-all duration-500 py-14 md:py-20 hover:bg-white/[0.03] relative"
                        >
                            <span className="pointer-events-none absolute right-6 md:right-8 top-1/2 -translate-y-1/2 text-[clamp(4rem,10vw,8rem)] font-black text-white/[0.035] group-hover:text-white/[0.06] leading-none select-none transition-colors duration-500">
                                {service.id}
                            </span>
                            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-8 md:gap-0">
                                <div className="flex items-baseline gap-6 md:w-1/3">
                                    <span className="text-sm font-mono text-white/40 group-hover:text-white/80 transition-colors">{service.id}</span>
                                    <h4 className="text-3xl md:text-5xl font-medium text-white group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-3">
                                        {service.title}
                                    </h4>
                                </div>
                                <div className="md:w-1/3">
                                    <p className="text-lg text-white/60 group-hover:text-white transition-colors duration-300 max-w-xl">{service.desc}</p>
                                </div>
                                <div className="md:w-1/4 flex gap-2 flex-wrap justify-start md:justify-end items-center">
                                    {service.tags.map(tag => (
                                        <span key={tag} className="text-xs border border-white/20 group-hover:border-white/35 rounded-full px-3 py-1 text-white/60 group-hover:text-white/90 transition-colors">{tag}</span>
                                    ))}
                                    <svg className="w-5 h-5 ml-2 text-white/30 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300 hidden md:inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14m-7-7l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </a>
                    ))}
                    <div className="border-t border-white/10" />
                </div>
            </div>
        </section>
    );
};

export default Services;

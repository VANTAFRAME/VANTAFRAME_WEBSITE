import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../lib/useStore';
import { currentLang } from '../i18n/store';
import { languages } from '../i18n/translations';
gsap.registerPlugin(ScrollTrigger);
// A short, separate note between the work and the process sections: VANTASIGNAL is a specialised
// VANTAFRAME brand for GEO and SEO. It is deliberately not one of the three main offer pillars
// (no card, no menu entry). Plain typography and hairlines, same reveal as the other sections.
const VantaSignal = () => {
    const lang = useStore(currentLang, () => "pl");
    const t = languages[lang].vantasignal;
    const sectionRef = useRef(null);
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
        const ctx = gsap.context(() => {
            const items = sectionRef.current?.querySelectorAll('.vs-reveal') || [];
            gsap.fromTo(
                items,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    stagger: 0.1,
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, [lang]);
    const linkProps = { target: '_blank', rel: 'noopener noreferrer' };
    const NewTab = () => <span className="sr-only"> {t.newTab}</span>;
    return (
        <section id="vantasignal" ref={sectionRef} className="py-24 md:py-32 px-6 md:px-12 bg-brand-black relative z-10 border-t border-white/10">
            <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-12 lg:gap-20 items-end">
                <div>
                    <p className="vs-reveal font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/50 mb-6">{t.eyebrow}</p>
                    <h2 className="vs-reveal text-4xl md:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] uppercase">
                        {t.heading[0]}
                        {" "}<br />
                        <span className="text-white/50">{t.heading[1]}</span>
                    </h2>
                </div>
                <div>
                    <p className="vs-reveal text-base md:text-lg text-white/65 leading-relaxed max-w-xl mb-10">{t.desc}</p>
                    <div className="vs-reveal flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                        <a
                            href="https://vantasignal.pl/"
                            {...linkProps}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
                        >
                            <span>{t.cta}</span>
                            <NewTab />
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
                        </a>
                        <a
                            href="https://vantasignal.pl/audyt"
                            {...linkProps}
                            className="inline-flex items-center justify-center px-8 py-4 border border-white/30 rounded-full font-medium text-white hover:bg-white hover:text-black transition-all"
                        >
                            <span>{t.ctaSecondary}</span>
                            <NewTab />
                        </a>
                    </div>
                    <p className="vs-reveal border-t border-white/10 pt-5 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/45">{t.relation}</p>
                </div>
            </div>
        </section>
    );
};
export default VantaSignal;
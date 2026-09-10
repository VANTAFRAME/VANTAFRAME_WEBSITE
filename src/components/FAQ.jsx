import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../lib/useStore';
import { currentLang } from '../i18n/store';
import { languages } from '../i18n/translations';
import SectionConnector from './SectionConnector';

gsap.registerPlugin(ScrollTrigger);

const FAQItem = ({ item, isOpen, onToggle }) => {
    return (
        <div className="border-t border-white/10 transition-colors">
            <button
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${item.id}`}
                id={`faq-question-${item.id}`}
                className="w-full py-7 md:py-9 text-left flex items-start justify-between gap-4 group cursor-pointer focus:outline-none"
            >
                <div className="flex items-baseline gap-4 sm:gap-6 md:gap-8 pr-4">
                    <span className="text-xs md:text-sm font-mono text-white/40 group-hover:text-white/80 transition-colors shrink-0">
                        {item.id}
                    </span>
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-[1.65rem] font-bold text-white group-hover:text-white/90 leading-snug transition-colors">
                        {item.q}
                    </h3>
                </div>

                <div className="shrink-0 pt-1">
                    <div className="w-7 h-7 flex items-center justify-center rounded-full border border-white/10 group-hover:border-white/30 transition-colors">
                        <svg
                            className={`w-3.5 h-3.5 text-white/50 group-hover:text-white transition-transform duration-300 ${isOpen ? 'rotate-45 text-white' : 'rotate-0'}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                    </div>
                </div>
            </button>

            <div
                id={`faq-answer-${item.id}`}
                role="region"
                aria-labelledby={`faq-question-${item.id}`}
                className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}
            >
                <div className="overflow-hidden pl-8 sm:pl-10 md:pl-14 pr-4 md:pr-12 pb-8">
                    <p className="text-sm md:text-base lg:text-lg text-white/70 leading-relaxed font-normal">
                        {item.a}
                    </p>
                </div>
            </div>
        </div>
    );
};

const FAQ = () => {
    const lang = useStore(currentLang, () => "pl");
    const t = languages[lang].faq;
    const sectionRef = useRef(null);
    const [openIndex, setOpenIndex] = useState(null);

    const toggleItem = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.faq-left-block',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );

            gsap.fromTo('.faq-list-container',
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, [lang]);

    return (
        <section id="faq" ref={sectionRef} className="py-24 md:py-36 px-6 md:px-12 bg-brand-black text-white relative z-10">
            <SectionConnector position="left" />
            <SectionConnector position="right" />

            <div className="max-w-[1700px] mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-20 relative">
                    
                    {/* LEWA KOLUMNA: Sticky Header on Desktop */}
                    <div className="faq-left-block lg:w-[35%] lg:sticky lg:top-32 self-start">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="font-mono text-xs md:text-sm text-white/45 tracking-[0.25em] uppercase">
                                {t.label || "FAQ / NAJCZĘŚCIEJ PYTACIE"}
                            </span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] mb-6">
                            {t.titleLine1 || "Pytania, które"} <br />
                            <span className="text-white/40 font-normal">
                                {t.titleLine2 || "warto zadać."}
                            </span>
                        </h2>

                        <p className="text-sm md:text-base text-white/60 leading-relaxed max-w-md hidden lg:block">
                            {t.subDesc}
                        </p>
                    </div>

                    {/* PRAWA KOLUMNA: Accordion List */}
                    <div className="faq-list-container lg:w-[65%] w-full flex flex-col">
                        <div className="flex flex-col">
                            {t.questions.map((item, index) => (
                                <FAQItem
                                    key={item.id}
                                    item={item}
                                    isOpen={openIndex === index}
                                    onToggle={() => toggleItem(index)}
                                />
                            ))}
                            <div className="border-t border-white/10" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FAQ;

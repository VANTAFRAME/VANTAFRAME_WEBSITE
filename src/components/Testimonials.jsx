import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useStore } from '../lib/useStore';
import { currentLang } from '../i18n/store';
import { languages } from '../i18n/translations';

const Testimonials = () => {
    const lang = useStore(currentLang, () => "pl");
    const t = languages[lang].testimonials;
    const marqueeRef = useRef(null);

    const tweenRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Simple Marquee Animation
            const content = marqueeRef.current;
            const totalWidth = content.scrollWidth / 2; // Assuming duplicated content

            tweenRef.current = gsap.to(content, {
                x: -totalWidth,
                duration: 20,
                ease: "none",
                repeat: -1
            });
        });

        return () => ctx.revert();
    }, [lang]);

    const handleMouseEnter = () => {
        if (tweenRef.current) {
            gsap.to(tweenRef.current, { timeScale: 0.2, duration: 0.5 });
        }
    };

    const handleMouseLeave = () => {
        if (tweenRef.current) {
            gsap.to(tweenRef.current, { timeScale: 1, duration: 0.5 });
        }
    };

    // Duplicating reviews for infinite loop
    const reviews = [...t.reviews, ...t.reviews];

    return (
        <section
            className="py-24 bg-black overflow-hidden relative z-10 border-t border-white/5"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-white tracking-tight">{t.title}</h2>

            <div className="relative w-full">
                {/* Gradient Masks for smooth edges */}
                <div className="absolute top-0 left-0 w-48 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

                <div className="flex gap-8 w-max" ref={marqueeRef}>
                    {reviews.map((review, index) => (
                        <div key={index} className="w-[350px] md:w-[450px] p-8 rounded-xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/[0.08] backdrop-blur-sm flex flex-col gap-6 shrink-0 relative group hover:bg-[#111] transition-colors">

                            {/* Header: Avatar + Info */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                                    {/* Placeholder Avatar logic */}
                                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.name}`} alt={review.name} className="w-full h-full object-cover opacity-80" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white">{review.name}</h4>
                                    <p className="text-sm text-white/50 uppercase tracking-wider">{review.role}</p>
                                </div>
                            </div>

                            {/* Review Text */}
                            <p className="text-white/70 leading-relaxed italic text-lg">
                                "{review.text}"
                            </p>

                            {/* Stars */}
                            <div className="flex gap-1 text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                <span className="text-white ml-2 text-sm">5.0</span>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../lib/useStore';
import { currentLang } from '../i18n/store';
import { languages } from '../i18n/translations';

gsap.registerPlugin(ScrollTrigger);

// Code Snippets for the "behind glass" effect
const codeSnippets = {
    astro: `---
import Layout from '../layouts/Layout.astro';
---
<Layout title="Speed">
  <h1>Zero JS by default</h1>
</Layout>`,
    react: `useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to(ref.current, { x: 100 });
  });
  return () => ctx.revert();
}, []);`,
    typescript: `interface Agency {
  name: string;
  premium: boolean;
  stack: Stack[];
}`,
    tailwind: `<div
  class="flex flex-col
    gap-4 p-8
    rounded-xl
    hover:scale-105
    transition-all"
>`,
    gsap: `gsap.to(".element", {
  scrollTrigger: ".trigger",
  x: 500,
  duration: 1.5,
  ease: "power2.out"
});`,
    figma: `{
  "id": "1:2",
  "name": "Desktop - 1",
  "type": "FRAME",
  "blendMode": "PASS_THROUGH"
}`
};

const useTypewriter = (text, isHovered, speed = 20) => {
    const [displayText, setDisplayText] = React.useState('');

    useEffect(() => {
        let timeout;

        if (isHovered && text) {
            let currentIndex = 0;
            setDisplayText(''); // Reset on hover start

            const type = () => {
                if (currentIndex < text.length) {
                    const char = text[currentIndex];
                    if (char !== undefined) {
                        setDisplayText(prev => prev + char);
                        currentIndex++;
                        // Randomize speed slightly for realism
                        const randomSpeed = speed + (Math.random() * 20 - 10);
                        timeout = setTimeout(type, randomSpeed);
                    }
                }
            };

            timeout = setTimeout(type, 100); // Slight delay before starting
        } else {
            setDisplayText('');
            clearTimeout(timeout);
        }

        return () => clearTimeout(timeout);
    }, [isHovered, text, speed]);

    return displayText;
};

const Card = ({ name, icon, code, large = false, subtext = null }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const typedCode = useTypewriter(code || '', isHovered);

    return (
        <div
            className={`
                tech-card relative border border-white/10 bg-white/5 rounded-3xl p-8 md:p-12 flex flex-col justify-between overflow-hidden 
                transition-colors duration-500 hover:border-white/30
                ${large ? 'md:col-span-2 min-h-[300px]' : 'min-h-[250px]'}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Code Overlay - Positioned in "Safe Zone" (Right side) */}
            <div className={`absolute top-0 right-0 bottom-0 pointer-events-none overflow-hidden transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} ${large ? 'w-2/3' : 'w-full md:w-3/4'}`}>
                {/* No background gradients per user request */}

                <pre className={`
                    font-mono text-cyan-100/60 p-6 text-right
                    ${large ? 'text-xs leading-5' : 'text-[10px] leading-4'}
                `}>
                    <code>{typedCode}</code>
                </pre>
            </div>

            {/* Content Layer - Z-Index 20 to stay above code */}
            <div className="relative z-20">
                <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="text-white/80 transition-colors duration-300 mb-auto inline-block">
                    {icon}
                </div>
            </div>

            <div className="relative z-20 mt-auto pt-8">
                <h3 className={`font-bold tracking-wide ${large ? 'text-3xl' : 'text-xl'}`}>{name}</h3>
                {subtext && <p className="text-white/50 text-sm mt-2">{subtext}</p>}
            </div>
        </div>
    );
};

const Technologies = () => {
    const lang = useStore(currentLang, () => "pl");
    const t = languages[lang].technologies;
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.tech-card',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                    }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, [lang]);

    // SVG Icons
    const icons = {
        react: <svg viewBox="-10.5 -9.45 21 18.9" fill="none" stroke="currentColor" className="w-12 h-12 md:w-16 md:h-16"><circle r="2" fill="currentColor" /><g strokeWidth="1"><ellipse rx="10" ry="4.5" /><ellipse rx="10" ry="4.5" transform="rotate(60)" /><ellipse rx="10" ry="4.5" transform="rotate(120)" /></g></svg>,
        astro: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 md:w-16 md:h-16"><path d="M12 2l9 19-9-9-9 9 9-19z" /></svg>,
        next: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 md:w-16 md:h-16"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" /><path d="M15 9L9 15M9 9V15M15 9V15" /></svg>,
        ts: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 md:w-16 md:h-16"><path d="M4 4h16v16H4z" /><path d="M8 12h3m-1.5 0v6M14 18v-4.5a1.5 1.5 0 0 1 3 0V18M14 15h3" /></svg>,
        tailwind: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="M3.5 12c0-2.5 2-5 5-5s5 2.5 5 5c0 2.5-2 5-5 5s-5-2.5-5-5z" /><path d="M10.5 12c0-2.5 2-5 5-5s5 2.5 5 5c0 2.5-2 5-5 5s-5-2.5-5-5z" /></svg>,
        gsap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10"><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></svg>,
        figma: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" /><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" /><path d="M12 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" /><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" /><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" /></svg>
    };

    return (
        <section id="technologies" ref={sectionRef} className="py-32 px-6 md:px-12 bg-zinc-950 relative z-10 text-white border-t border-white/5">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-20">
                    <h2 className="text-sm md:text-base font-bold tracking-widest uppercase text-white/40 mb-4">{t.subtitle}</h2>
                    <h3 className="text-4xl md:text-6xl font-light leading-tight mb-6">{t.title}</h3>
                    <p className="text-white/60 max-w-xl">{t.desc}</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 content-center">
                    {/* Large Cards - Core */}
                    <Card
                        name="Astro"
                        icon={icons.astro}
                        code={codeSnippets.astro}
                        large
                        subtext="Performance First Framework"
                    />
                    <Card
                        name="React"
                        icon={icons.react}
                        code={codeSnippets.react}
                        large
                        subtext="Interactive UI Library"
                    />

                    {/* Smaller Cards - Utilities */}
                    <Card name="TypeScript" icon={icons.ts} code={codeSnippets.typescript} />
                    <Card name="Tailwind CSS" icon={icons.tailwind} code={codeSnippets.tailwind} />
                    <Card name="GSAP" icon={icons.gsap} code={codeSnippets.gsap} />
                    <Card name="Figma" icon={icons.figma} code={codeSnippets.figma} />
                </div>
            </div>
        </section>
    );
};

export default Technologies;

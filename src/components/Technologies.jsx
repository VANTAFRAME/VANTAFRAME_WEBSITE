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
    openai: `const res = await openai.responses.create({
  model: MODEL,
  input: ticket.body,
});`,
    anthropic: `const msg = await anthropic.messages.create({
  model: MODEL,
  max_tokens: 1024,
  messages: [{ role: "user", content: doc }],
});`,
    gemini: `const result = await ai.models.generateContent({
  model: MODEL,
  contents: invoice.text,
});`,
    n8n: `{
  "node": "Webhook",
  "next": ["Classify", "CRM: Update"],
  "onError": "notify"
}`,
    make: `scenario:
  trigger: gmail.watchEmails
  router:
    - drive.uploadFile
    - crm.createLead`,
    workspace: `gmail.users.messages.list({
  userId: "me",
  q: "has:attachment invoice",
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
    const tabRefs = useRef({});
    const [active, setActive] = React.useState('ui');
    const firstRender = useRef(true);
    const tabsBaseId = React.useId();
    const prefersReduced = () =>
        typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Entry animation on scroll: only the cards of the panel that is visible when the section enters.
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(`[data-tech-panel="${active}"] .tech-card`,
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
                        once: true,
                    }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lang]);
    // Short stagger for the cards of the newly selected panel.
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const section = sectionRef.current;
        if (!section) return;
        const heightBefore = section.offsetHeight;
        if (!prefersReduced()) {
            gsap.fromTo(
                section.querySelectorAll(`[data-tech-panel="${active}"] .tech-card`),
                { y: 16, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out', overwrite: 'auto' }
            );
        } else {
            gsap.set(section.querySelectorAll('.tech-card'), { clearProps: 'opacity,transform' });
        }
        if (section.offsetHeight !== heightBefore) ScrollTrigger.refresh();
    }, [active]);
    const select = (next, focus = false) => {
        if (next === active) {
            if (focus) tabRefs.current[next]?.focus();
            return;
        }
        const section = sectionRef.current;
        const outgoing = section?.querySelector(`[data-tech-panel="${active}"]`);
        const commit = () => {
            setActive(next);
            if (focus) tabRefs.current[next]?.focus();
        };
        if (outgoing && !prefersReduced()) {
            gsap.to(outgoing, { opacity: 0, duration: 0.15, ease: 'power1.out', onComplete: () => { gsap.set(outgoing, { clearProps: 'opacity' }); commit(); } });
        } else {
            commit();
        }
    };
    const order = ['ui', 'ai'];
    const onTabKeyDown = (event) => {
        const idx = order.indexOf(active);
        let next = null;
        if (event.key === 'ArrowRight') next = order[(idx + 1) % order.length];
        else if (event.key === 'ArrowLeft') next = order[(idx - 1 + order.length) % order.length];
        else if (event.key === 'Home') next = order[0];
        else if (event.key === 'End') next = order[order.length - 1];
        if (next) {
            event.preventDefault();
            select(next, true);
        }
    };
    // SVG Icons
    const icons = {
        react: <svg viewBox="-10.5 -9.45 21 18.9" fill="none" stroke="currentColor" className="w-12 h-12 md:w-16 md:h-16"><circle r="2" fill="currentColor" /><g strokeWidth="1"><ellipse rx="10" ry="4.5" /><ellipse rx="10" ry="4.5" transform="rotate(60)" /><ellipse rx="10" ry="4.5" transform="rotate(120)" /></g></svg>,
        astro: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 md:w-16 md:h-16"><path d="M12 2l9 19-9-9-9 9 9-19z" /></svg>,
        next: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 md:w-16 md:h-16"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" /><path d="M15 9L9 15M9 9V15M15 9V15" /></svg>,
        ts: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 md:w-16 md:h-16"><path d="M4 4h16v16H4z" /><path d="M8 12h3m-1.5 0v6M14 18v-4.5a1.5 1.5 0 0 1 3 0V18M14 15h3" /></svg>,
        tailwind: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="M3.5 12c0-2.5 2-5 5-5s5 2.5 5 5c0 2.5-2 5-5 5s-5-2.5-5-5z" /><path d="M10.5 12c0-2.5 2-5 5-5s5 2.5 5 5c0 2.5-2 5-5 5s-5-2.5-5-5z" /></svg>,
        gsap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10"><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></svg>,
        figma: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" /><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" /><path d="M12 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" /><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" /><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" /></svg>,
        openai: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 md:w-16 md:h-16"><circle cx="19.5" cy="12" r="1.8" /><circle cx="15.75" cy="18.5" r="1.8" /><circle cx="8.25" cy="18.5" r="1.8" /><circle cx="4.5" cy="12" r="1.8" /><circle cx="8.25" cy="5.5" r="1.8" /><circle cx="15.75" cy="5.5" r="1.8" /><circle cx="12" cy="12" r="1.2" fill="currentColor" /><path d="M19.17 14.19A7.5 7.5 0 0 1 17.49 17.11M13.69 19.31A7.5 7.5 0 0 1 10.31 19.31M6.51 17.11A7.5 7.5 0 0 1 4.83 14.19M4.83 9.81A7.5 7.5 0 0 1 6.51 6.89M10.31 4.69A7.5 7.5 0 0 1 13.69 4.69M17.49 6.89A7.5 7.5 0 0 1 19.17 9.81M14.20 12.00L17.50 12.00M10.90 13.91L9.25 16.76M10.90 10.09L9.25 7.24" /></svg>,
        anthropic: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 md:w-16 md:h-16"><path d="M4 5h16M4 9h16M4 13h9" /><path d="M16.5 12v5" /></svg>,
        gemini: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></svg>,
        n8n: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><circle cx="5" cy="12" r="2.5" /><circle cx="19" cy="6" r="2.5" /><circle cx="19" cy="18" r="2.5" /><path d="M7.5 12H11M11 12L16.9 7.3M11 12L16.9 16.7" /></svg>,
        make: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="M4 12a8 8 0 0 1 14-5.3M18 3v4h-4" /><path d="M20 12a8 8 0 0 1-14 5.3M6 21v-4h4" /><circle cx="4" cy="12" r="1.2" fill="currentColor" /><circle cx="20" cy="12" r="1.2" fill="currentColor" /></svg>,
        workspace: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="M2 6a1.5 1.5 0 0 1 1.5-1.5H8l1.5 2H15A1.5 1.5 0 0 1 16.5 8v5" /><path d="M2 6v10.5A1.5 1.5 0 0 0 3.5 18H8" /><rect x="8" y="10.5" width="14" height="9.5" rx="1.5" /><path d="M8.5 11.5L15 16l6.5-4.5" /></svg>
    };
    const tabs = [
        { id: 'ui', label: t.tabUi },
        { id: 'ai', label: t.tabAi },
    ];
    const panelId = (id) => `${tabsBaseId}-panel-${id}`;
    const tabId = (id) => `${tabsBaseId}-tab-${id}`;
    const gridClass = 'col-start-1 row-start-1 grid grid-cols-2 lg:grid-cols-4 gap-6 content-start';
    const panelProps = (id) => ({
        id: panelId(id),
        role: 'tabpanel',
        'aria-labelledby': tabId(id),
        'data-tech-panel': id,
        tabIndex: active === id ? 0 : -1,
        inert: active === id ? undefined : true,
        className: `${gridClass} outline-none focus-visible:ring-1 focus-visible:ring-cyan-300/70 rounded-3xl ${active === id ? '' : 'invisible'}`,
    });
    return (
        <section id="technologies" ref={sectionRef} className="py-32 px-6 md:px-12 bg-zinc-950 relative z-10 text-white border-t border-white/5">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-12">
                    <p className="text-sm md:text-base font-bold tracking-widest uppercase text-white/40 mb-4">{t.subtitle}</p>
                    <h2 className="text-4xl md:text-6xl font-light leading-tight mb-6">{t.title}</h2>
                    <p className="text-white/60 max-w-xl">{t.desc}</p>
                </div>
                <div
                    role="tablist"
                    aria-label={t.tabsLabel}
                    className="flex w-full md:w-auto md:inline-flex mb-10 p-1 rounded-full border border-white/15"
                >
                    {tabs.map((tab) => {
                        const isActive = active === tab.id;
                        return (
                            <button
                                key={tab.id}
                                ref={(el) => (tabRefs.current[tab.id] = el)}
                                type="button"
                                role="tab"
                                id={tabId(tab.id)}
                                aria-selected={isActive}
                                aria-controls={panelId(tab.id)}
                                tabIndex={isActive ? 0 : -1}
                                onClick={() => select(tab.id)}
                                onKeyDown={onTabKeyDown}
                                className={`flex-1 min-w-0 md:flex-none px-3 md:px-7 py-2.5 rounded-full font-mono text-[10px] md:text-xs tracking-[0.12em] md:tracking-[0.22em] uppercase text-center md:whitespace-nowrap outline-none focus-visible:ring-1 focus-visible:ring-cyan-300/70 transition-colors duration-300 ${isActive ? 'bg-white text-black font-bold' : 'text-white/50 hover:text-white'}`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
                {/* Both panels are always in the HTML (SEO/GEO); the inactive one is only hidden, in the same grid cell so the height never changes. */}
                <div className="grid">
                    <div {...panelProps('ui')}>
                        <Card name="Astro" icon={icons.astro} code={codeSnippets.astro} large subtext={t.uiSubtext.astro} />
                        <Card name="React" icon={icons.react} code={codeSnippets.react} large subtext={t.uiSubtext.react} />
                        <Card name="TypeScript" icon={icons.ts} code={codeSnippets.typescript} />
                        <Card name="Tailwind CSS" icon={icons.tailwind} code={codeSnippets.tailwind} />
                        <Card name="GSAP" icon={icons.gsap} code={codeSnippets.gsap} />
                        <Card name="Figma" icon={icons.figma} code={codeSnippets.figma} />
                    </div>
                    <div {...panelProps('ai')}>
                        {t.aiTools.map((tool, index) => (
                            <Card
                                key={tool.name}
                                name={tool.name}
                                icon={icons[tool.icon]}
                                code={codeSnippets[tool.snippet]}
                                large={index < 2}
                                subtext={tool.sub}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
export default Technologies;
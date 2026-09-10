import React from 'react';

/*
  Each icon is a self-contained, hover-reactive SVG.
  They rely on the parent element carrying `group/icon` so hover state
  is scoped to the icon itself, not the whole modal card.
*/

export const WebCartIcon = ({ className = '' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.2" className="text-white/40 transition-colors duration-500 group-hover/icon:text-brand-cyan/70" />
        <path d="M2 8H22" stroke="currentColor" strokeWidth="1.2" className="text-white/40 transition-colors duration-500 group-hover/icon:text-brand-cyan/70" />
        <circle cx="4.7" cy="6" r="0.55" fill="currentColor" className="text-white/40" />
        <circle cx="6.6" cy="6" r="0.55" fill="currentColor" className="text-white/40" />
        <circle cx="8.5" cy="6" r="0.55" fill="currentColor" className="text-white/40" />

        <g
            className="transition-transform duration-500 ease-out group-hover/icon:-translate-y-1"
            style={{ transformOrigin: '12px 15px' }}
        >
            <path
                d="M6.5 13.5L7.7 11H16.3L17.5 13.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/70"
            />
            <path
                d="M6.5 13.5H17.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                className="text-white/70"
            />
            <circle
                cx="9"
                cy="16"
                r="1"
                fill="currentColor"
                className="text-white/70 origin-center transition-transform duration-500 group-hover/icon:animate-spin"
                style={{ transformOrigin: '9px 16px' }}
            />
            <circle
                cx="15"
                cy="16"
                r="1"
                fill="currentColor"
                className="text-white/70 origin-center transition-transform duration-500 group-hover/icon:animate-spin"
                style={{ transformOrigin: '15px 16px' }}
            />
        </g>

        <circle
            cx="18.5"
            cy="7"
            r="1.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-brand-cyan opacity-0 scale-50 origin-center transition-all duration-500 group-hover/icon:opacity-100 group-hover/icon:scale-100"
            style={{ transformOrigin: '18.5px 7px' }}
        />
        <path
            d="M17.8 7L18.3 7.5L19.3 6.4"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand-cyan opacity-0 transition-opacity duration-500 delay-150 group-hover/icon:opacity-100"
        />
    </svg>
);

export const AppDevicesIcon = ({ className = '' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <g className="transition-colors duration-500">
            <path d="M4 16H20L21.2 18.2H2.8L4 16Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" className="text-white/40" />
            <rect x="6" y="5.5" width="12" height="9.2" rx="1" stroke="currentColor" strokeWidth="1.2" className="text-white/45 transition-colors duration-500 group-hover/icon:text-brand-cyan/70" />
            <path d="M9 12.5H15" stroke="currentColor" strokeWidth="1" className="text-white/20 transition-colors duration-500 group-hover/icon:text-brand-cyan/50" />
        </g>

        <g
            className="transition-transform duration-500 ease-out origin-bottom-right group-hover/icon:-translate-y-1 group-hover/icon:-rotate-6"
            style={{ transformOrigin: '19px 15px' }}
        >
            <rect x="14.2" y="2.8" width="6" height="11" rx="1.4" fill="#0a0a0a" stroke="currentColor" strokeWidth="1.2" className="text-white/70" />
            <circle cx="17.2" cy="12" r="0.5" fill="currentColor" className="text-white/50" />
            <circle
                cx="17.2"
                cy="6.3"
                r="0.9"
                fill="currentColor"
                className="text-white/30 transition-colors duration-500 group-hover/icon:text-brand-cyan animate-pulse"
            />
        </g>
    </svg>
);

export const AiBotIcon = ({ className = '' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <line x1="12" y1="2.2" x2="12" y2="5.5" stroke="currentColor" strokeWidth="1.2" className="text-white/40" />
        <circle
            cx="12"
            cy="2.2"
            r="1"
            fill="currentColor"
            className="text-white/40 transition-colors duration-500 group-hover/icon:text-brand-cyan animate-pulse"
        />

        <rect x="5" y="5.8" width="14" height="12.4" rx="4" stroke="currentColor" strokeWidth="1.2" className="text-white/45 transition-colors duration-500 group-hover/icon:text-brand-cyan/70" />

        <ellipse
            cx="9.2"
            cy="11.6"
            rx="1.1"
            ry="1.3"
            fill="currentColor"
            className="text-white/70 transition-transform duration-300 origin-center group-hover/icon:scale-y-[0.35]"
            style={{ transformOrigin: '9.2px 11.6px' }}
        />
        <ellipse
            cx="14.8"
            cy="11.6"
            rx="1.1"
            ry="1.3"
            fill="currentColor"
            className="text-white/70 transition-transform duration-300 origin-center group-hover/icon:scale-y-[0.35]"
            style={{ transformOrigin: '14.8px 11.6px' }}
        />

        <path
            d="M9.3 15.4H14.7"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            className="text-white/60 opacity-100 transition-opacity duration-300 group-hover/icon:opacity-0"
        />
        <path
            d="M8.8 14.7C9.6 16.6 14.4 16.6 15.2 14.7"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            className="text-brand-cyan opacity-0 transition-opacity duration-300 delay-100 group-hover/icon:opacity-100"
        />
    </svg>
);

export const GrowthMagnifierIcon = ({ className = '' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M3 19.5H21" stroke="currentColor" strokeWidth="1" className="text-white/20" />

        <rect
            x="4.5" y="14" width="2.6" height="5.5" rx="0.4"
            fill="currentColor"
            className="text-white/40 transition-transform duration-500 ease-out origin-bottom group-hover/icon:scale-y-[1.2]"
            style={{ transformOrigin: '5.8px 19.5px' }}
        />
        <rect
            x="9" y="10.5" width="2.6" height="9" rx="0.4"
            fill="currentColor"
            className="text-white/55 transition-transform duration-500 delay-100 ease-out origin-bottom group-hover/icon:scale-y-[1.2]"
            style={{ transformOrigin: '10.3px 19.5px' }}
        />
        <rect
            x="13.5" y="6.5" width="2.6" height="13" rx="0.4"
            fill="currentColor"
            className="text-white/70 transition-transform duration-500 delay-200 ease-out origin-bottom group-hover/icon:scale-y-[1.2]"
            style={{ transformOrigin: '14.8px 19.5px' }}
        />

        <g className="transition-transform duration-500 ease-out group-hover/icon:-translate-y-0.5 group-hover/icon:translate-x-0.5">
            <circle cx="17" cy="6" r="2.9" fill="#0a0a0a" stroke="currentColor" strokeWidth="1.2" className="text-white/70 transition-colors duration-500 group-hover/icon:text-brand-cyan" />
            <path d="M19.1 8.1L21.3 10.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className="text-white/70 transition-colors duration-500 group-hover/icon:text-brand-cyan" />
            <path
                d="M15.5 5.2L17 6.3"
                stroke="currentColor"
                strokeWidth="0.9"
                strokeLinecap="round"
                className="text-white opacity-0 transition-opacity duration-500 delay-300 group-hover/icon:opacity-80"
            />
        </g>
    </svg>
);

export const ShieldPulseIcon = ({ className = '' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path
            d="M12 3L19 5.8V11C19 15.6 16 18.7 12 20.2C8 18.7 5 15.6 5 11V5.8L12 3Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
            className="text-white/45 transition-colors duration-500 group-hover/icon:text-brand-cyan/80"
        />
        <path
            pathLength="1"
            d="M6.5 12H9L10.4 8.3L13 15.5L14.4 12H17.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1"
            strokeDashoffset="1"
            className="text-brand-cyan transition-[stroke-dashoffset] duration-700 ease-out group-hover/icon:[stroke-dashoffset:0]"
        />
    </svg>
);

export const serviceIconsById = {
    '01': WebCartIcon,
    '02': AppDevicesIcon,
    '03': AiBotIcon,
    '04': GrowthMagnifierIcon,
    '05': ShieldPulseIcon,
};

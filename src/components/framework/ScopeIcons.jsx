import React from "react";

// Simple line icons for the "scope" step answers, matching the stroke language already
// used across the site (ServiceIcons.jsx, LegalModals close icon): stroke=currentColor,
// strokeWidth ~1.5, no fill. Color is driven by the parent button's text color, so these
// stay monochrome/cyan automatically on hover + selection.

const base = "w-full h-full";

export const WebsiteIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" className={base} {...props}>
    <rect x="3" y="4" width="18" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M3 8.5H21" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="5.6" cy="6.2" r="0.5" fill="currentColor" />
  </svg>
);

export const StoreIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" className={base} {...props}>
    <path d="M4 9L5.2 4.5H18.8L20 9" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M4 9V19H20V9" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M9.5 19V14H14.5V19" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

export const WebAppIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" className={base} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M3 9H21" stroke="currentColor" strokeWidth="1.4" />
    <path d="M8 13.5L10 15.5L8 17.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 17.5H16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const MobileAppIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" className={base} {...props}>
    <rect x="7" y="2.5" width="10" height="19" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
    <path d="M11 19H13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const AutomationIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" className={base} {...props}>
    <path d="M12 3V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M12 18V21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M3 12H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M18 12H21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

export const AiIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" className={base} {...props}>
    <rect x="5" y="6" width="14" height="12" rx="4" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="9.4" cy="12" r="1" fill="currentColor" />
    <circle cx="14.6" cy="12" r="1" fill="currentColor" />
    <path d="M12 2.5V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const ConfiguratorIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" className={base} {...props}>
    <path d="M4 7H20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M4 12H20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M4 17H20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="9" cy="7" r="1.6" fill="#0a0a0a" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="16" cy="12" r="1.6" fill="#0a0a0a" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="10.5" cy="17" r="1.6" fill="#0a0a0a" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

export const BrandingIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" className={base} {...props}>
    <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M12 12L20 7.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M12 12L4 7.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M12 12V21" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

export const SeoIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" className={base} {...props}>
    <circle cx="10.5" cy="10.5" r="6" stroke="currentColor" strokeWidth="1.4" />
    <path d="M15 15L20 20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M8 10.5H13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M10.5 8V13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const CareIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" className={base} {...props}>
    <path d="M12 3L19 5.8V11C19 15.6 16 18.7 12 20.2C8 18.7 5 15.6 5 11V5.8L12 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M9 11.5L11 13.5L15.5 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const UnknownIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" className={base} {...props}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
    <path d="M9.5 9.3C9.5 7.9 10.6 7 12 7C13.4 7 14.4 7.9 14.4 9.1C14.4 10.9 12 10.7 12 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="12" cy="16.2" r="0.9" fill="currentColor" />
  </svg>
);

export const SCOPE_ICONS = {
  website: WebsiteIcon,
  store: StoreIcon,
  webapp: WebAppIcon,
  mobileapp: MobileAppIcon,
  automation: AutomationIcon,
  ai: AiIcon,
  configurator: ConfiguratorIcon,
  branding: BrandingIcon,
  seo: SeoIcon,
  care: CareIcon,
  unknown: UnknownIcon,
};

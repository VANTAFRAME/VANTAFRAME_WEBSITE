import React from "react";
// Parts shared by the project tiles on /portfolio/ and in the home page "Nasze realizacje" slider for projects
// that have a case study: the "CASE STUDY" corner marker and the two actions. The tile's main link is a stretched
// link on the title (an <a> with ::after over the whole tile), so these controls are siblings, never nested links.
export const CaseStudyBadge = ({ label = "CASE STUDY", className = "" }) => (
  <span
    className={`pointer-events-none absolute left-4 top-4 z-10 rounded-full border border-white/30 bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur ${className}`}
  >
    {label}
  </span>
);
// Visible on hover and keyboard focus where hover exists (md and up, hover-capable devices); always visible on
// phones and touch devices. z-20: above the stretched link, so each button works independently.
const REVEAL =
  "pointer-events-none translate-y-2 opacity-0 transition-all duration-500 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 max-md:pointer-events-auto max-md:translate-y-0 max-md:opacity-100 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100";
const FOCUS = "outline-none focus-visible:ring-1 focus-visible:ring-cyan-300/70";
export const CaseStudyActions = ({ href, liveUrl, labels, className = "" }) => (
  <div className={`relative z-20 mt-4 flex flex-wrap items-center gap-2 ${REVEAL} ${className}`}>
    <a
      href={href}
      draggable="false"
      className={`rounded-full bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-black transition-colors hover:bg-white/85 ${FOCUS}`}
    >
      {labels.caseStudy}
    </a>
    {liveUrl && (
      <a
        href={liveUrl}
        target="_blank"
        rel="noopener"
        draggable="false"
        className={`rounded-full border border-white/40 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/10 ${FOCUS}`}
      >
        {labels.viewSite} <span aria-hidden="true">↗</span>
        <span className="sr-only"> {labels.newTab}</span>
      </a>
    )}
  </div>
);
import React from "react";
// Native <details>/<summary> used to layer technical detail: the text stays in the HTML
// (search engines and screen readers read it), the summary is a real button with keyboard focus
// and a visible cyan focus ring. No data-reveal inside — content that starts hidden must not
// wait for a scroll-reveal that never fires. Same plus/cross marker as the scenario details.
const Disclosure = ({ label, children, className = "", open = false }) => (
  <details className={`group/d ${className}`} open={open}>
    <summary className="inline-flex cursor-pointer list-none items-center gap-3 rounded-full border border-white/25 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/80 outline-none transition-colors hover:border-white/50 hover:text-white focus-visible:text-white focus-visible:ring-1 focus-visible:ring-cyan-300/80 [&::-webkit-details-marker]:hidden">
      <span aria-hidden="true" className="relative h-3 w-3 shrink-0 transition-transform duration-300 group-open/d:rotate-45">
        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
      </span>
      {label}
    </summary>
    <div className="mt-8">{children}</div>
  </details>
);
export default Disclosure;
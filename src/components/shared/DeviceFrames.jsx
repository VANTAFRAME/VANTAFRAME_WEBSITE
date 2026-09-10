import React from "react";

// Desktop screenshot inside the same minimal device chrome used across the
// site's hero panels — a real product, not a mockup, framed consistently.
// `contain` (not `cover`) so a dashboard's own UI is never cropped — the
// surrounding frame does the "large, confident" scale work instead.
export const DeviceFrame = ({ src, alt, label, className = "" }) => (
  <div className={`h-full flex flex-col rounded-xl border border-white/12 bg-[#050505] overflow-hidden ${className}`}>
    <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-white/[0.02] shrink-0">
      <span className="w-2 h-2 rounded-full bg-white/15" />
      <span className="w-2 h-2 rounded-full bg-white/15" />
      <span className="w-2 h-2 rounded-full bg-white/15" />
      {label && <span className="ml-2 text-[10px] font-mono text-white/30 tracking-wider truncate">{label}</span>}
    </div>
    <div className="flex-1 min-h-0 flex items-center justify-center p-3 md:p-5">
      <img src={src} alt={alt} loading="lazy" className="max-w-full max-h-full w-auto h-auto object-contain" />
    </div>
  </div>
);

// A real iPhone mockup — thick rounded bezel, dynamic island, side buttons —
// slightly tilted so it reads as a deliberate product shot next to the
// desktop frame, not a second flat rectangle. Large enough to actually read
// the screen, and never clipped: the tilt is applied with room to spare.
export const IPhoneFrame = ({ src, alt, className = "", tilt = true }) => (
  <div className={`relative ${className}`} style={{ aspectRatio: "9 / 19.5" }}>
    <div
      className="absolute inset-0 origin-bottom transition-transform duration-500"
      style={tilt ? { transform: "rotate(-9deg)" } : undefined}
    >
      <div className="relative h-full rounded-[2.6rem] border-[10px] border-[#1a1a1a] bg-[#1a1a1a] shadow-[0_45px_90px_-25px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
        {/* side buttons */}
        <span className="absolute -left-[12px] top-[16%] h-7 w-[4px] rounded-l-sm bg-[#1a1a1a]" />
        <span className="absolute -left-[12px] top-[24%] h-11 w-[4px] rounded-l-sm bg-[#1a1a1a]" />
        <span className="absolute -left-[12px] top-[36%] h-11 w-[4px] rounded-l-sm bg-[#1a1a1a]" />
        <span className="absolute -right-[12px] top-[20%] h-16 w-[4px] rounded-r-sm bg-[#1a1a1a]" />

        <div className="relative h-full w-full rounded-[2rem] overflow-hidden bg-black">
          <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover object-top" />
          {/* Faux iOS status bar — grounds the screenshot as "a phone", not a
              flat crop pasted at the very top edge of the bezel. */}
          <div className="absolute top-0 inset-x-0 h-[6%] min-h-[22px] flex items-center justify-between px-5 pointer-events-none bg-gradient-to-b from-black/55 to-transparent">
            <span className="text-white text-[11px] font-semibold tracking-tight" style={{ fontFamily: "system-ui, sans-serif" }}>
              9:41
            </span>
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 12" fill="white">
                <rect x="0" y="7" width="3" height="5" rx="0.5" />
                <rect x="5" y="5" width="3" height="7" rx="0.5" />
                <rect x="10" y="3" width="3" height="9" rx="0.5" />
                <rect x="15" y="0" width="3" height="12" rx="0.5" />
              </svg>
              <svg className="w-4 h-3" viewBox="0 0 24 16" fill="none" stroke="white" strokeWidth="1.4">
                <rect x="1" y="1" width="19" height="14" rx="3.5" />
                <rect x="21.5" y="5.5" width="1.6" height="5" rx="0.8" fill="white" stroke="none" />
                <rect x="3" y="3" width="15" height="10" rx="2" fill="white" stroke="none" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

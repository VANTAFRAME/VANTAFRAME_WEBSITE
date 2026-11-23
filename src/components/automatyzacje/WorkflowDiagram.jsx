import React, { useEffect, useRef, useState } from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";
// "Orchestration" diagram: data sources and AI models flow into the VF hub,
// the hub fans out to integrations and into a four-step process row. Thin
// base lines carry a travelling cyan pulse (see the keyframes below) so the
// direction of data is readable at a glance. All glyphs are drawn around
// (0,0) at roughly ±14 units so the same <Glyph> works in the big SVG and in
// the small mobile cards.
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
const Glyph = ({ name }) => {
  switch (name) {
    case "mail":
      return (
        <g {...stroke}>
          <rect x="-11" y="-8" width="22" height="16" rx="2.5" />
          <path d="m-10.5 -6 10.5 8 10.5 -8" />
        </g>
      );
    case "chat":
      return (
        <g {...stroke}>
          <path d="M-11 -2a9 8 0 0 1 9 -8h4a9 8 0 0 1 9 8 9 8 0 0 1 -9 8h-4l-6 4v-5a8 8 0 0 1 -3 -7z" />
          <path d="M-5 -2h.1M0 -2h.1M5 -2h.1" strokeWidth="2.4" />
        </g>
      );
    case "doc":
      return (
        <g {...stroke}>
          <path d="M-7 -12h9l7 7v15a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-20a2 2 0 0 1 2 -2z" />
          <path d="M2 -12v7h7M-4 2h8M-4 6.5h8" />
        </g>
      );
    case "db":
      return (
        <g {...stroke}>
          <ellipse cx="0" cy="-8" rx="9" ry="3.6" />
          <path d="M-9 -8v16c0 2 4 3.6 9 3.6s9 -1.6 9 -3.6v-16M-9 0c0 2 4 3.6 9 3.6s9 -1.6 9 -3.6" />
        </g>
      );
    case "bolt":
      return (
        <g {...stroke}>
          <path d="M3 -14 -8 2h7l-3 12 11 -16h-7z" />
        </g>
      );
    case "bars":
      return (
        <g fill="currentColor">
          <rect x="-10" y="2" width="5" height="9" rx="1" />
          <rect x="-2.5" y="-4" width="5" height="15" rx="1" />
          <rect x="5" y="-11" width="5" height="22" rx="1" />
        </g>
      );
    case "check":
      return (
        <g {...stroke}>
          <path d="M11 1.5a11 11 0 1 1 -5 -9.4" />
          <path d="m-4.5 1 4 4 11 -13" />
        </g>
      );
    case "send":
      return (
        <g {...stroke}>
          <path d="M12 -12 -12 -2l9 4 4 9z" />
          <path d="M12 -12 -3 2" />
        </g>
      );
    // ---- simplified brand marks -------------------------------------------
    case "llm":
      return (
        <g {...stroke}>
          <rect x="-11" y="-11" width="22" height="16" rx="3.5" />
          <path d="M-6 -5h12M-6 -1h8M-4 5v6l6 -6" />
        </g>
      );
    case "multimodal":
      return (
        <g {...stroke}>
          <circle cx="-4" cy="-4" r="6.5" />
          <rect x="1" y="-8" width="11" height="11" rx="2" />
          <path d="M-10 12 -2 0l8 12z" />
        </g>
      );
    case "reasoning":
      return (
        <g {...stroke}>
          <path d="M-9 0 2 -9M-9 0 2 9M2 -9 10 0M2 9 10 0M2 -9v18" />
          <circle cx="-9" cy="0" r="2.6" fill="currentColor" />
          <circle cx="2" cy="-9" r="2.6" fill="currentColor" />
          <circle cx="2" cy="9" r="2.6" fill="currentColor" />
          <circle cx="10" cy="0" r="2.6" fill="currentColor" />
        </g>
      );
    // own line glyphs (same motifs as the technology section), drawn on a 24-unit grid
    case "openai":
      return (
        <g {...stroke} transform="translate(-12 -12)">
          <circle cx="19.5" cy="12" r="1.8" />
          <circle cx="15.75" cy="18.5" r="1.8" />
          <circle cx="8.25" cy="18.5" r="1.8" />
          <circle cx="4.5" cy="12" r="1.8" />
          <circle cx="8.25" cy="5.5" r="1.8" />
          <circle cx="15.75" cy="5.5" r="1.8" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" />
          <path d="M19.17 14.19A7.5 7.5 0 0 1 17.49 17.11M13.69 19.31A7.5 7.5 0 0 1 10.31 19.31M6.51 17.11A7.5 7.5 0 0 1 4.83 14.19M4.83 9.81A7.5 7.5 0 0 1 6.51 6.89M10.31 4.69A7.5 7.5 0 0 1 13.69 4.69M17.49 6.89A7.5 7.5 0 0 1 19.17 9.81M14.20 12.00L17.50 12.00M10.90 13.91L9.25 16.76M10.90 10.09L9.25 7.24" />
        </g>
      );
    case "anthropic":
      return (
        <g {...stroke} transform="translate(-12 -12)">
          <path d="M4 5h16M4 9h16M4 13h9" />
          <path d="M16.5 12v5" />
        </g>
      );
    case "gemini":
      return (
        <g {...stroke} transform="translate(-12 -12)">
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </g>
      );
    case "slack":
      return (
        <g>
          <rect x="-12" y="-3" width="9" height="5" rx="2.5" fill="#36c5f0" />
          <rect x="-3" y="-12" width="5" height="9" rx="2.5" fill="#2eb67d" />
          <rect x="3" y="-3" width="9" height="5" rx="2.5" fill="#ecb22e" />
          <rect x="-2" y="3" width="5" height="9" rx="2.5" fill="#e01e5a" />
        </g>
      );
    case "salesforce":
      return (
        <g>
          <path d="M-8 9a6 6 0 0 1 -1 -11.5 7 7 0 0 1 12 -2 6 6 0 0 1 8 6 5 5 0 0 1 -2 7.5z" fill="#00a1e0" />
          <text x="1" y="3.5" fontSize="5" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="sans-serif">
            salesforce
          </text>
        </g>
      );
    case "drive":
      return (
        <g>
          <path d="M-4 -12h8l10 17h-8z" fill="#fbbc04" />
          <path d="M-4 -12 -14 5l4 7 10 -17z" fill="#0f9d58" />
          <path d="M-10 12h20l4 -7h-20z" fill="#4285f4" />
        </g>
      );
    case "notion":
      return (
        <g>
          <rect x="-12" y="-12" width="24" height="24" rx="4" fill="#f5f5f5" />
          <path d="M-5 6V-6l10 12V-6" fill="none" stroke="#111" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "api":
      return (
        <g fill="#f2f2f2">
          <circle cx="-9" cy="0" r="2.4" />
          <circle cx="0" cy="0" r="2.4" />
          <circle cx="9" cy="0" r="2.4" />
        </g>
      );
    default:
      return null;
  }
};
const BRAND = new Set(["slack", "salesforce", "drive", "notion", "api"]);
// ---- layout (viewBox 1240 x 800) -----------------------------------------
const HUB = { x: 505, y: 300, w: 230, h: 240 };
const HUB_CX = HUB.x + HUB.w / 2;
const MODELS = { x: [345, 535, 725], y: 70, w: 170, h: 128 };
const SRC = { x: 20, y: 218, w: 205, h: 78, pitch: 88 };
const INT = { x: 1015, y: 176, w: 205, h: 70, pitch: 82 };
const STEPS = { x: [168, 404, 640, 876], y: 690, w: 196, h: 84 };
const BUS_Y = 622;
const hubPortL = (i) => 385 + i * 15;
const hubPortR = (i) => 380 + i * 15;
const Card = ({ x, y, w, h, children }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx="13" fill="#0b0b0b" stroke="rgba(255,255,255,0.1)" />
    {children}
  </g>
);
const Lines = ({ lines, x, y0, size = 12.5, fill = "rgba(255,255,255,0.45)", anchor = "start", lh = 16 }) =>
  lines.map((line, i) => (
    <text key={line} x={x} y={y0 + i * lh} fontSize={size} fill={fill} textAnchor={anchor}>
      {line}
    </text>
  ));
// Visual only — the surrounding case row (CaseShowcase) supplies heading,
// description and spacing.
const WorkflowDiagram = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].automatyzacjePage.workflow;
  const rootRef = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // Each flow = a thin base line plus one travelling pulse.
  const flows = [];
  t.sources.forEach((_, i) => {
    const cy = SRC.y + i * SRC.pitch + SRC.h / 2;
    const px = SRC.x + SRC.w + 12;
    const hy = hubPortL(i);
    flows.push({ key: `s${i}`, d: `M${px} ${cy} C 360 ${cy} 380 ${hy} ${HUB.x - 12} ${hy}`, delay: i * 0.35 });
  });
  const mcx = MODELS.x.map((x) => x + MODELS.w / 2);
  const mTargets = [HUB_CX - 46, HUB_CX, HUB_CX + 46];
  const mBottom = MODELS.y + MODELS.h + 12;
  mcx.forEach((cx, i) => {
    const ty = HUB.y - 6;
    const dir = i === 0 ? 1 : -1;
    const d =
      i === 1
        ? `M${cx} ${mBottom} V${ty}`
        : `M${cx} ${mBottom} V${mBottom + 26} Q${cx} ${mBottom + 38} ${cx + dir * 12} ${mBottom + 38} H${mTargets[i] - dir * 12} Q${mTargets[i]} ${mBottom + 38} ${mTargets[i]} ${mBottom + 50} V${ty}`;
    flows.push({ key: `m${i}`, d, delay: 0.2 + i * 0.4, dashed: i !== 1 });
  });
  t.integrations.forEach((_, i) => {
    const cy = INT.y + i * INT.pitch + INT.h / 2;
    const hy = hubPortR(i);
    flows.push({ key: `i${i}`, d: `M${HUB.x + HUB.w + 12} ${hy} C 870 ${hy} 880 ${cy} ${INT.x - 12} ${cy}`, delay: 1.7 + i * 0.3 });
  });
  const bcx = STEPS.x.map((x) => x + STEPS.w / 2);
  flows.push({ key: "stem", d: `M${HUB_CX} ${HUB.y + HUB.h + 12} V${BUS_Y}`, delay: 2.2 });
  bcx.forEach((cx, i) => {
    const goesLeft = cx < HUB_CX;
    const r = 14;
    flows.push({
      key: `b${i}`,
      d: `M${HUB_CX} ${BUS_Y} H${cx + (goesLeft ? r : -r)} Q${cx} ${BUS_Y} ${cx} ${BUS_Y + r} V${STEPS.y - 12}`,
      delay: 2.5 + i * 0.25,
    });
  });
  const mono = { fontFamily: MONO };
  const label = { fontSize: 10.5, letterSpacing: 4, fill: "rgba(255,255,255,0.4)", style: mono };
  return (
    <div
      ref={rootRef}
      className="w-full h-full min-h-[inherit] flex items-center justify-center"
      style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* ---------------- Wide: full orchestration canvas ---------------- */}
      <svg
        viewBox="0 0 1240 800"
        className={`hidden xl:block w-full h-auto wf-svg ${inView ? "" : "wf-paused"}`}
        fontFamily="Outfit, sans-serif"
        role="img"
        aria-label={t.hub.name}
      >
        <style>{`
          .wf-pulse{stroke-dasharray:6 94;stroke-dashoffset:6;animation:wf-flow 3.6s linear infinite}
          .wf-paused .wf-pulse,.wf-paused .wf-ring{animation-play-state:paused}
          .wf-ring{animation:wf-ring 3.6s ease-in-out infinite}
          @keyframes wf-flow{0%{stroke-dashoffset:6}100%{stroke-dashoffset:-100}}
          @keyframes wf-ring{0%,100%{opacity:.35}50%{opacity:.9}}
          @media (prefers-reduced-motion: reduce){.wf-pulse,.wf-ring{animation:none}.wf-pulse{opacity:0}}
        `}</style>
        <defs>
          <clipPath id="wfHubClip">
            <rect x={HUB.x} y={HUB.y} width={HUB.w} height={HUB.h} rx="26" />
          </clipPath>
          <linearGradient id="wfHubFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#151516" />
            <stop offset="1" stopColor="#0a0a0a" />
          </linearGradient>
          <filter id="wfGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>
        <text x={HUB_CX} y="48" textAnchor="middle" {...label}>
          {t.modelsLabel}
        </text>
        <text x={SRC.x + 6} y="200" {...label}>
          {t.sourcesLabel}
        </text>
        <text x={INT.x + 4} y="158" {...label}>
          {t.integrationsLabel}
        </text>
        {flows.map((f) => (
          <path key={`b-${f.key}`} d={f.d} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeDasharray={f.dashed ? "4 5" : undefined} />
        ))}
        <path d={`M${bcx[0]} ${STEPS.y - 12} V${BUS_Y + 14} Q${bcx[0]} ${BUS_Y} ${bcx[0] + 14} ${BUS_Y} H${HUB_CX - 150}`} fill="none" stroke="rgba(255,255,255,0.12)" />
        <path d={`M${HUB_CX + 150} ${BUS_Y} H${bcx[3] - 14} Q${bcx[3]} ${BUS_Y} ${bcx[3]} ${BUS_Y + 14} V${STEPS.y - 12}`} fill="none" stroke="rgba(255,255,255,0.12)" />
        {flows.map((f) => (
          <path
            key={`p-${f.key}`}
            className="wf-pulse"
            d={f.d}
            pathLength="100"
            fill="none"
            stroke="#67e8f9"
            strokeWidth="2.2"
            strokeLinecap="round"
            style={{ animationDelay: `${f.delay}s` }}
          />
        ))}
        {/* process label interrupts the bus */}
        <rect x={HUB_CX - 158} y={BUS_Y - 12} width="316" height="24" fill="#050505" />
        <text x={HUB_CX} y={BUS_Y + 4} textAnchor="middle" {...label} fill="rgba(255,255,255,0.45)">
          {t.processLabel}
        </text>
        {/* hub */}
        <rect x={HUB.x - 6} y={HUB.y - 6} width={HUB.w + 12} height={HUB.h + 12} rx="32" fill="none" stroke="rgba(103,232,249,0.35)" className="wf-ring" filter="url(#wfGlow)" />
        <rect x={HUB.x} y={HUB.y} width={HUB.w} height={HUB.h} rx="26" fill="url(#wfHubFill)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
        <g clipPath="url(#wfHubClip)">
          <image href="/vf-logo-wireframe.png" x={HUB_CX - 125} y={HUB.y - 8} width="250" height="250" style={{ mixBlendMode: "screen" }} />
        </g>
        <text x={HUB_CX} y={HUB.y + 204} fontSize="9.5" letterSpacing="3.4" textAnchor="middle" fill="rgba(255,255,255,0.45)" style={mono}>
          {t.hub.sub}
        </text>
        {t.hub.tools && (
          <text x={HUB_CX} y={HUB.y + 224} fontSize="12" letterSpacing="2" textAnchor="middle" fill="rgba(255,255,255,0.8)" style={mono}>
            {t.hub.tools}
          </text>
        )}
        {t.sources.map((_, i) => (
          <circle key={`pl${i}`} cx={HUB.x - 6} cy={hubPortL(i)} r="3.4" fill="#cbd5e1" />
        ))}
        {t.integrations.map((_, i) => (
          <circle key={`pr${i}`} cx={HUB.x + HUB.w + 6} cy={hubPortR(i)} r="3.4" fill="#cbd5e1" />
        ))}
        <circle cx={HUB_CX} cy={HUB.y - 6} r="4" fill="#e2e8f0" />
        <circle cx={HUB_CX} cy={HUB.y + HUB.h + 6} r="4" fill="#e2e8f0" />
        {/* AI models */}
        {t.models.map((m, i) => {
          const x = MODELS.x[i];
          const cx = x + MODELS.w / 2;
          return (
            <g key={m.title}>
              <Card x={x} y={MODELS.y} w={MODELS.w} h={MODELS.h}>
                <g transform={`translate(${cx} ${MODELS.y + 42}) scale(1.4)`} style={{ color: "#fff" }}>
                  <Glyph name={m.brand} />
                </g>
                <text x={cx} y={MODELS.y + 90} fontSize="15.5" fontWeight="600" fill="#fff" textAnchor="middle">
                  {m.title}
                </text>
                <Lines lines={m.desc} x={cx} y0={MODELS.y + 108} size={12} anchor="middle" lh={15} />
              </Card>
              <circle cx={cx} cy={MODELS.y + MODELS.h + 12} r="3.2" fill="#cbd5e1" />
            </g>
          );
        })}
        {/* sources */}
        {t.sources.map((s, i) => {
          const y = SRC.y + i * SRC.pitch;
          const cy = y + SRC.h / 2;
          return (
            <g key={s.title}>
              <Card x={SRC.x} y={y} w={SRC.w} h={SRC.h}>
                <circle cx={SRC.x + 38} cy={cy} r="24" fill="rgba(255,255,255,0.045)" />
                <g transform={`translate(${SRC.x + 38} ${cy}) scale(1.05)`} style={{ color: "rgba(255,255,255,0.88)" }}>
                  <Glyph name={s.icon} />
                </g>
                <text x={SRC.x + 76} y={cy - 9} fontSize="15" fontWeight="600" fill="#fff">
                  {s.title}
                </text>
                <Lines lines={s.desc} x={SRC.x + 76} y0={cy + 6} size={12} />
              </Card>
              <circle cx={SRC.x + SRC.w + 12} cy={cy} r="3.2" fill="#cbd5e1" />
            </g>
          );
        })}
        {/* integrations */}
        {t.integrations.map((it, i) => {
          const y = INT.y + i * INT.pitch;
          const cy = y + INT.h / 2;
          const two = it.desc.length > 1;
          return (
            <g key={it.title}>
              <Card x={INT.x} y={y} w={INT.w} h={INT.h}>
                <g transform={`translate(${INT.x + 36} ${cy}) scale(1.45)`} style={{ color: "#fff" }}>
                  <Glyph name={it.brand} />
                </g>
                <text x={INT.x + 76} y={cy - (two ? 9 : 3)} fontSize={it.title.length > 16 ? 12.5 : 15} fontWeight="600" fill="#fff">
                  {it.title}
                </text>
                <Lines lines={it.desc} x={INT.x + 76} y0={cy + (two ? 6 : 14)} size={12} />
              </Card>
              <circle cx={INT.x - 12} cy={cy} r="3.2" fill="#cbd5e1" />
            </g>
          );
        })}
        {/* process steps */}
        {t.steps.map((s, i) => {
          const x = STEPS.x[i];
          const cy = STEPS.y + STEPS.h / 2;
          const two = s.desc.length > 1;
          return (
            <g key={s.title}>
              <Card x={x} y={STEPS.y} w={STEPS.w} h={STEPS.h}>
                <g transform={`translate(${x + 34} ${cy}) scale(1.2)`} style={{ color: "rgba(255,255,255,0.9)" }}>
                  <Glyph name={s.icon} />
                </g>
                <text x={x + 66} y={cy - (two ? 9 : 3)} fontSize="14.5" fontWeight="600" fill="#fff">
                  {s.title}
                </text>
                <Lines lines={s.desc} x={x + 66} y0={cy + (two ? 6 : 14)} size={12} />
              </Card>
              <circle cx={x + STEPS.w / 2} cy={STEPS.y - 12} r="3.2" fill="#cbd5e1" />
              {i < 3 && (
                <g stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d={`M${x + STEPS.w + 10} ${cy} H${STEPS.x[i + 1] - 12}`} />
                  <path d={`M${STEPS.x[i + 1] - 18} ${cy - 5} l6 5 -6 5`} />
                </g>
              )}
            </g>
          );
        })}
      </svg>
      {/* ---------------- Narrower: stacked list ---------------- */}
      <div className="xl:hidden w-full px-4 py-6 sm:px-6 space-y-3">
        <MobileLabel>{t.sourcesLabel}</MobileLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {t.sources.map((s) => (
            <MobileCard key={s.title} glyph={s.icon} title={s.title} desc={s.desc} />
          ))}
        </div>
        <MobileArrow />
        <MobileLabel>{t.modelsLabel}</MobileLabel>
        <div className="grid grid-cols-3 gap-3">
          {t.models.map((m) => (
            <div key={m.title} className="rounded-xl border border-white/10 bg-[#0b0b0b] px-2 py-4 text-center">
              <svg viewBox="-16 -16 32 32" className="mx-auto h-9 w-9" style={{ color: "#fff" }} aria-hidden="true">
                <Glyph name={m.brand} />
              </svg>
              <p className="mt-2 text-sm font-semibold text-white">{m.title}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-white/45">
                {m.desc.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
        <MobileArrow />
        <div className="relative rounded-2xl border border-white/30 bg-gradient-to-b from-[#151516] to-[#0a0a0a] overflow-hidden text-center py-6">
          <img src="/vf-logo-wireframe.png" width="1024" height="1024" loading="lazy" alt="" className="mx-auto h-40 w-40 object-contain" style={{ mixBlendMode: "screen" }} />
          <p className="-mt-2 font-mono text-[10px] tracking-[0.3em] text-white/45">{t.hub.sub}</p>
          {t.hub.tools && <p className="mt-1 font-mono text-xs tracking-[0.2em] text-white/80">{t.hub.tools}</p>}
        </div>
        <MobileArrow />
        <MobileLabel>{t.integrationsLabel}</MobileLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {t.integrations.map((it) => (
            <MobileCard key={it.title} glyph={it.brand} title={it.title} desc={it.desc} />
          ))}
        </div>
        <MobileArrow />
        <MobileLabel>{t.processLabel}</MobileLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {t.steps.map((s) => (
            <MobileCard key={s.title} glyph={s.icon} title={s.title} desc={s.desc} />
          ))}
        </div>
      </div>
    </div>
  );
};
const MobileLabel = ({ children }) => <p className="font-mono text-[10px] tracking-[0.3em] text-white/40 pt-1">{children}</p>;
const MobileArrow = () => (
  <div className="flex justify-center py-1" aria-hidden="true">
    <svg width="14" height="26" viewBox="0 0 14 26" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 1v22M2 18l5 6 5 -6" />
    </svg>
  </div>
);
const MobileCard = ({ glyph, title, desc }) => (
  <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-3.5">
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/[0.045]" style={{ color: BRAND.has(glyph) ? "#fff" : "rgba(255,255,255,0.88)" }}>
      <svg viewBox="-16 -16 32 32" className="h-6 w-6" aria-hidden="true">
        <Glyph name={glyph} />
      </svg>
    </span>
    <span className="min-w-0">
      <span className="block text-[15px] font-semibold text-white">{title}</span>
      <span className="block text-xs text-white/45 mt-0.5">{desc.join(" ")}</span>
    </span>
  </div>
);
export default WorkflowDiagram;
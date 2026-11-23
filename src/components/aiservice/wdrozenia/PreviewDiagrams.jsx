import React from "react";
// Six small, static-by-nature technical diagrams for the "what an AI project covers" list
// on /wdrozenia-ai/ — one per capability. They use the site's own vocabulary: hairline
// strokes, mono UPPERCASE tokens (language-neutral, no sentences), rounded boxes, and cyan
// only for the single element the diagram is about. No data, no numbers.
//
// Motion is CSS only: when the wrapper has data-on="true" lines draw in (stroke-dashoffset)
// and boxes fade in with a small stagger. `compact` renders the finished diagram with no
// transition (mobile list and reduced motion).
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const LINE = "rgba(255,255,255,0.3)";
const TEXT = "rgba(255,255,255,0.78)";
const MUTED = "rgba(255,255,255,0.6)";
const CYAN = "#67e8f9";
export const DIAGRAM_CSS = `
  .pd-draw{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .9s cubic-bezier(.4,0,.2,1)}
  .pd-fade{opacity:0;transition:opacity .55s ease}
  [data-on="true"] .pd-draw{stroke-dashoffset:0}
  [data-on="true"] .pd-fade{opacity:1}
  @media (prefers-reduced-motion: reduce){
    .pd-draw{stroke-dashoffset:0;transition:none}
    .pd-fade{opacity:1;transition:none}
  }
`;
const Ln = ({ d, delay = 0, cyan = false }) => (
  <path
    className="pd-draw"
    pathLength="1"
    d={d}
    fill="none"
    stroke={cyan ? CYAN : LINE}
    strokeWidth="1.2"
    strokeLinecap="round"
    style={{ transitionDelay: `${delay}ms` }}
  />
);
const Fade = ({ delay = 0, children }) => (
  <g className="pd-fade" style={{ transitionDelay: `${delay}ms` }}>
    {children}
  </g>
);
const Box = ({ x, y, w, h, label, delay = 0, dashed = false, cyan = false, size = 11, anchor = "middle", ty }) => (
  <Fade delay={delay}>
    <rect x={x} y={y} width={w} height={h} rx="7" fill="#0a0a0a" stroke={cyan ? CYAN : LINE} strokeDasharray={dashed ? "4 4" : undefined} />
    {label && (
      <text
        x={anchor === "middle" ? x + w / 2 : x + 10}
        y={ty ?? y + h / 2 + size * 0.36}
        textAnchor={anchor}
        fontSize={size}
        letterSpacing="1.6"
        fill={cyan ? CYAN : TEXT}
        style={{ fontFamily: MONO }}
      >
        {label}
      </text>
    )}
  </Fade>
);
const Cap = ({ x, y, children, anchor = "start", delay = 0, fill = MUTED, size = 10.5 }) => (
  <Fade delay={delay}>
    <text x={x} y={y} textAnchor={anchor} fontSize={size} letterSpacing="2" fill={fill} style={{ fontFamily: MONO }}>
      {children}
    </text>
  </Fade>
);
/* 01 — where AI helps: a plain process map, most steps are rules, one is AI, one is a person */
const Analysis = () => {
  const xs = [10, 92, 174, 256, 338];
  const labels = ["INTAKE", "CLASSIFY", "DECIDE", "ENTER", "NOTIFY"];
  const tags = ["RULES", "AI", "HUMAN", "RULES", "RULES"];
  const data = [72, 44, 28, 72, 60];
  return (
    <g transform="translate(0 38)">
      <Cap x="10" y="38">PROCESS MAP</Cap>
      {xs.map((x, i) => (
        <g key={labels[i]}>
          <Box x={x} y={90} w={72} h={40} label={labels[i]} delay={120 + i * 110} size={10.5} />
          <Box x={x} y={150} w={72} h={24} label={tags[i]} delay={260 + i * 110} size={10} dashed={tags[i] === "AI"} cyan={tags[i] === "AI"} />
          <Fade delay={380 + i * 110}>
            <rect x={x} y={212} width={72} height="4" rx="2" fill="rgba(255,255,255,0.12)" />
            <rect x={x} y={212} width={data[i]} height="4" rx="2" fill="rgba(255,255,255,0.5)" />
          </Fade>
          {i < xs.length - 1 && <Ln d={`M${x + 72} 110 H${xs[i + 1]}`} delay={200 + i * 110} />}
        </g>
      ))}
      <Cap x="10" y="204" delay={500}>DATA</Cap>
    </g>
  );
};
/* 02 — use-case selection: value against data quality, a few chosen, the rest deferred */
const UseCases = () => (
  <>
    <Ln d="M50 270 H410" />
    <Ln d="M50 270 V40" delay={150} />
    <Cap x="410" y="292" anchor="end">DATA QUALITY</Cap>
    <Cap x="56" y="34">VALUE</Cap>
    {[
      { x: 320, y: 90, r: 15, label: "1", cyan: true },
      { x: 250, y: 132, r: 13, label: "2" },
      { x: 168, y: 104, r: 13, label: "3" },
      { x: 118, y: 214, r: 11, later: true },
      { x: 342, y: 216, r: 11, later: true },
      { x: 212, y: 200, r: 11, later: true },
    ].map((p, i) => (
      <Fade key={i} delay={300 + i * 130}>
        <circle cx={p.x} cy={p.y} r={p.r} fill="#0a0a0a" stroke={p.cyan ? CYAN : LINE} strokeWidth={p.cyan ? 1.5 : 1.1} strokeDasharray={p.later ? "3 3" : undefined} />
        {p.label && (
          <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="12" fill={p.cyan ? CYAN : TEXT} style={{ fontFamily: MONO }}>
            {p.label}
          </text>
        )}
      </Fade>
    ))}
    <Fade delay={1100}>
      <circle cx="58" cy="308" r="4" fill="none" stroke={CYAN} />
      <text x="68" y="312" fontSize="10.5" letterSpacing="2" fill={MUTED} style={{ fontFamily: MONO }}>NOW</text>
      <circle cx="132" cy="308" r="4" fill="none" stroke={LINE} strokeDasharray="2 2" />
      <text x="142" y="312" fontSize="10.5" letterSpacing="2" fill={MUTED} style={{ fontFamily: MONO }}>LATER</text>
    </Fade>
  </>
);
/* 03 — architecture: data stays inside a boundary; access first, then rules, then AI */
const Architecture = () => (
  <>
    <Box x={10} y={112} w={80} h={96} label="SOURCES" ty={132} delay={100} size={10.5} />
    <Box x={350} y={112} w={80} h={96} label="SYSTEMS" ty={132} delay={100} size={10.5} />
    <Fade delay={200}>
      {[152, 168, 184].map((y) => (
        <line key={y} x1="24" y1={y} x2="76" y2={y} stroke="rgba(255,255,255,0.18)" />
      ))}
      {[152, 168, 184].map((y) => (
        <line key={`r${y}`} x1="364" y1={y} x2="416" y2={y} stroke="rgba(255,255,255,0.18)" />
      ))}
    </Fade>
    <Fade delay={300}>
      <rect x="120" y="36" width="210" height="248" rx="12" fill="none" stroke={LINE} strokeDasharray="5 5" />
    </Fade>
    <Cap x="225" y="56" anchor="middle" delay={400}>COMPANY CONTROL</Cap>
    <Box x={140} y={76} w={170} h={42} label="ACCESS" delay={450} />
    <Box x={140} y={136} w={170} h={42} label="RULES" delay={600} />
    <Box x={140} y={196} w={170} h={42} label="AI" delay={750} cyan />
    <Ln d="M225 118 V136" delay={560} />
    <Ln d="M225 178 V196" delay={710} />
    <Ln d="M90 160 H112 V97 H140" delay={500} />
    <Ln d="M310 217 H338 V160 H350" delay={820} />
  </>
);
/* 04 — integration: existing systems on the left, one connection layer, then the AI */
const Integration = () => (
  <>
    {["CRM", "ERP", "MAIL", "TOOLS"].map((s, i) => (
      <g key={s}>
        <Box x={10} y={40 + i * 60} w={84} h={36} label={s} delay={100 + i * 110} />
        <Ln d={`M94 ${58 + i * 60} H160`} delay={250 + i * 110} />
      </g>
    ))}
    <Fade delay={500}>
      <rect x="160" y="30" width="130" height="236" rx="10" fill="#0a0a0a" stroke={LINE} />
    </Fade>
    <Cap x="225" y="52" anchor="middle" delay={560}>LAYER</Cap>
    {["AUTH", "RETRY", "LOG"].map((r, i) => (
      <Box key={r} x={175} y={70 + i * 62} w={100} h={38} label={r} delay={640 + i * 120} size={10.5} />
    ))}
    <Ln d="M290 148 H350" delay={900} />
    <Box x={350} y={118} w={80} h={60} label="AI" delay={1000} cyan />
  </>
);
/* 05 — quality testing: a test set of real examples, a few failures to fix, an acceptance mark */
const Evaluation = () => {
  const rows = ["COMMON", "EDGE", "HARD"];
  const fixes = new Set(["2-1", "4-2"]);
  return (
    <>
      {rows.map((r, j) => (
        <g key={r}>
          <Cap x="8" y={86 + j * 50} delay={100 + j * 100} size={10}>{r}</Cap>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const fix = fixes.has(`${i}-${j}`);
            const x = 84 + i * 50;
            const y = 62 + j * 50;
            return (
              <Fade key={i} delay={200 + (i + j * 6) * 45}>
                <rect x={x} y={y} width="38" height="38" rx="6" fill="#0a0a0a" stroke={LINE} strokeDasharray={fix ? "3 3" : undefined} />
                {fix ? (
                  <path d={`M${x + 13} ${y + 13} l12 12 M${x + 25} ${y + 13} l-12 12`} stroke={TEXT} strokeWidth="1.3" strokeLinecap="round" fill="none" />
                ) : (
                  <path d={`M${x + 11} ${y + 20} l7 7 l11 -13`} stroke={TEXT} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                )}
              </Fade>
            );
          })}
        </g>
      ))}
      <Fade delay={800}>
        <rect x="84" y="236" width="288" height="8" rx="4" fill="rgba(255,255,255,0.1)" />
        <rect x="84" y="236" width="210" height="8" rx="4" fill="rgba(255,255,255,0.5)" />
      </Fade>
      <Ln d="M336 226 V254" delay={900} cyan />
      <Cap x="336" y="274" anchor="middle" delay={1000} fill={CYAN}>ACCEPTANCE</Cap>
    </>
  );
};
/* 06 — operations: rollout in widening stages, a way back, and a monitoring strip with one alert */
const Operations = () => (
  <>
    {[
      { x: 20, y: 170, h: 50, label: "PILOT" },
      { x: 130, y: 130, h: 90, label: "PART" },
      { x: 240, y: 90, h: 130, label: "FULL" },
    ].map((b, i) => (
      <Box key={b.label} x={b.x} y={b.y} w={100} h={b.h} label={b.label} ty={b.y + 20} delay={150 + i * 220} size={10.5} />
    ))}
    <Ln d="M290 82 V54 H70 V162" delay={900} />
    <Fade delay={1100}>
      <path d="M65 154 l5 8 l5 -8" fill="none" stroke={LINE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </Fade>
    <Cap x="180" y="46" anchor="middle" delay={1000}>ROLLBACK</Cap>
    <Cap x="20" y="252" delay={500}>MONITOR</Cap>
    <Ln d="M20 276 H420" delay={600} />
    <Fade delay={800}>
      {Array.from({ length: 28 }, (_, k) => 20 + k * 14.4).map((x, k) =>
        k === 20 ? null : <line key={k} x1={x} y1={276} x2={x} y2={k % 3 === 0 ? 268 : 271} stroke="rgba(255,255,255,0.35)" />
      )}
    </Fade>
    <Fade delay={1200}>
      <line x1="308" y1="276" x2="308" y2="256" stroke={CYAN} strokeWidth="1.5" />
      <text x="316" y="262" fontSize="10.5" letterSpacing="2" fill={CYAN} style={{ fontFamily: MONO }}>ALERT</text>
    </Fade>
  </>
);
const DIAGRAMS = [Analysis, UseCases, Architecture, Integration, Evaluation, Operations];
// `on` toggles the draw-in; with `compact` the finished diagram is always shown.
export const Diagram = ({ index, on = true, compact = false, className = "" }) => {
  const D = DIAGRAMS[index];
  return (
    <svg
      viewBox="0 0 440 320"
      className={className}
      data-on={compact || on ? "true" : "false"}
      aria-hidden="true"
      focusable="false"
      fontFamily="Outfit, sans-serif"
    >
      <D />
    </svg>
  );
};
export default Diagram;
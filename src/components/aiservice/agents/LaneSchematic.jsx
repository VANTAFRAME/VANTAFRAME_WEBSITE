import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useService } from "../useService";
import Disclosure from "../Disclosure";
// "How an agent works": a three-lane schematic — AGENT / SYSTEM / HUMAN — showing who does
// each step. The agent plans and picks a tool; the system layer validates parameters and
// permissions, executes the call and records the result; a person approves only what the
// configuration says needs approval. The approval gate belongs to the system lane (a system
// check), not to the model. Errors loop back: retry / new plan, or hand-over to a person.
//
// Readable with no animation: the whole diagram is static, complete SVG with text. With
// motion allowed, one GSAP timeline sends a single marker through the path (stopping at the
// gate, failing verification once and returning to the plan), then resets and repeats. It
// pauses off screen and in a hidden tab, and is not created for prefers-reduced-motion.
// Below lg the SVG is replaced by a vertical list with the lane named on every step.
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const BG = "#050505";
const REST_STROKE = "rgba(255,255,255,0.3)";
const DONE_STROKE = "rgba(255,255,255,0.62)";
const REST_TEXT = "rgba(255,255,255,0.78)";
const DONE_TEXT = "rgba(255,255,255,0.95)";
const MUTED = "rgba(255,255,255,0.6)";
const EDGE = "rgba(255,255,255,0.28)";
const CYAN = "#67e8f9";
const CYAN_FILL = "rgba(103,232,249,0.08)";
const NW = 124;
const NH = 30;
const LANE_Y = { agent: 70, system: 165, human: 260 };
const NODES = {
  goal: { x: 175, y: LANE_Y.human },
  plan: { x: 315, y: LANE_Y.agent },
  tools: { x: 455, y: LANE_Y.agent },
  gate: { x: 595, y: LANE_Y.system },
  approve: { x: 595, y: LANE_Y.human, dashed: true },
  exec: { x: 735, y: LANE_Y.system },
  verify: { x: 875, y: LANE_Y.system },
  result: { x: 1015, y: LANE_Y.human },
};
// pts end on the node boundary (arrowhead sits there); the last segment sets its direction
const EDGES = {
  "goal>plan": { pts: [[175, 245], [175, 70], [253, 70]] },
  "plan>tools": { pts: [[377, 70], [393, 70]] },
  "tools>gate": { pts: [[517, 70], [595, 70], [595, 150]] },
  "gate>approve": { pts: [[595, 180], [595, 245]], dashed: true },
  "gate>exec": { pts: [[657, 165], [673, 165]] },
  "approve>exec": { pts: [[657, 260], [735, 260], [735, 180]], dashed: true },
  "exec>verify": { pts: [[797, 165], [813, 165]] },
  "verify>result": { pts: [[937, 165], [1015, 165], [1015, 245]] },
  "verify>plan": { pts: [[875, 150], [875, 30], [315, 30], [315, 55]], dashed: true, ret: true },
  "verify>handover": { pts: [[875, 180], [875, 300], [1015, 300], [1015, 275]], dashed: true, ret: true },
};
const arrowFor = ([a, b]) => {
  const dx = Math.sign(b[0] - a[0]);
  const dy = Math.sign(b[1] - a[1]);
  const [x, y] = b;
  const s = 4.5;
  if (dx) return `${x},${y} ${x - dx * s * 1.6},${y - s} ${x - dx * s * 1.6},${y + s}`;
  return `${x},${y} ${x - s},${y - dy * s * 1.6} ${x + s},${y - dy * s * 1.6}`;
};
// the marker's route: [from, to, seconds]; first pass fails verification once and goes back
const SEQ = [
  ["goal", "plan", 0.9],
  ["plan", "tools", 0.6],
  ["tools", "gate", 0.8],
  ["gate", "approve", 0.6],
  ["approve", "exec", 1.0],
  ["exec", "verify", 0.6],
  ["verify", "plan", 1.5],
  ["plan", "tools", 0.4],
  ["tools", "gate", 0.5],
  ["gate", "exec", 0.35],
  ["exec", "verify", 0.4],
  ["verify", "result", 0.9],
];
const LaneSchematic = ({ data, slug }) => {
  const { c, ui } = useService(data);
  const { how } = c;
  const d = how.diagram;
  const rootRef = useRef(null);
  const laneName = (k) => d.lanes[k];
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const q = (sel) => root.querySelector(sel);
    const all = (sel) => Array.from(root.querySelectorAll(sel));
    const token = q("[data-token]");
    if (!token) return undefined;
    const nodeIds = Object.keys(NODES);
    let visible = false;
    let tabHidden = document.hidden;
    let tl = null;
    const sync = () => {
      if (!tl) return;
      if (visible && !tabHidden) tl.play();
      else tl.pause();
    };
    const ctx = gsap.context(() => {
      const rectOf = (id) => q(`[data-n="${id}"] rect`);
      const textOf = (id) => q(`[data-n="${id}"] text`);
      const edgeEls = (k) => all(`[data-e="${k}"] [data-ink]`);
      const retryLabels = all("[data-retry]");
      const rest = () => {
        nodeIds.forEach((id) => {
          gsap.set(rectOf(id), { stroke: REST_STROKE, fill: BG });
          gsap.set(textOf(id), { fill: REST_TEXT });
        });
        gsap.set(all("[data-e] [data-ink]"), { stroke: EDGE });
        gsap.set(all("[data-e] polygon"), { fill: EDGE, stroke: EDGE });
        gsap.set(retryLabels, { opacity: 0.55 });
        gsap.set(token, { attr: { cx: NODES.goal.x, cy: NODES.goal.y }, opacity: 0 });
      };
      rest();
      tl = gsap.timeline({ repeat: -1, paused: true });
      tl.to({}, { duration: 0.4 });
      tl.set(token, { opacity: 1 });
      tl.to(rectOf("goal"), { stroke: CYAN, fill: CYAN_FILL, duration: 0.25 })
        .to(textOf("goal"), { fill: CYAN, duration: 0.25 }, "<")
        .to({}, { duration: 0.5 });
      const lit = new Set(["goal"]);
      SEQ.forEach(([from, to, dur]) => {
        const key = `${from}>${to}`;
        const edge = EDGES[key];
        const a = NODES[from];
        const b = NODES[to];
        const path = [[a.x, a.y], ...edge.pts, [b.x, b.y]];
        const lens = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]));
        const total = lens.reduce((s, v) => s + v, 0);
        // the node we leave settles to "done" (white)
        tl.to(rectOf(from), { stroke: DONE_STROKE, fill: BG, duration: 0.3 }, ">")
          .to(textOf(from), { fill: DONE_TEXT, duration: 0.3 }, "<");
        tl.to(edgeEls(key), { stroke: CYAN, duration: 0.2 }, "<");
        tl.to(all(`[data-e="${key}"] polygon`), { fill: CYAN, stroke: CYAN, duration: 0.2 }, "<");
        if (EDGES[key].ret) tl.to(retryLabels.filter((el) => el.dataset.retry === key), { opacity: 1, duration: 0.3 }, "<");
        path.slice(1).forEach((p, i) => {
          const sd = (dur * lens[i]) / total;
          tl.to(token, { attr: { cx: p[0], cy: p[1] }, duration: sd, ease: "none" }, i === 0 ? ">-0.05" : ">");
        });
        tl.to(rectOf(to), { stroke: CYAN, fill: CYAN_FILL, duration: 0.25 }, ">-0.1")
          .to(textOf(to), { fill: CYAN, duration: 0.25 }, "<");
        tl.to(edgeEls(key), { stroke: DONE_STROKE, duration: 0.4 }, ">");
        tl.to(all(`[data-e="${key}"] polygon`), { fill: DONE_STROKE, stroke: DONE_STROKE, duration: 0.4 }, "<");
        if (to === "approve") tl.to({}, { duration: 0.9 }); // waits for a person
        if (to === "verify" && !lit.has("verify-failed") && SEQ.findIndex((s) => s[0] === from && s[1] === to) < 6) {
          lit.add("verify-failed");
          tl.to({}, { duration: 0.6 });
        }
      });
      tl.to({}, { duration: 1.6 })
        .to(token, { opacity: 0, duration: 0.4 })
        .to(all("[data-e] [data-ink]"), { stroke: EDGE, duration: 0.5 }, "<")
        .to(all("[data-e] polygon"), { fill: EDGE, stroke: EDGE, duration: 0.5 }, "<")
        .to(retryLabels, { opacity: 0.55, duration: 0.5 }, "<");
      nodeIds.forEach((id) => {
        tl.to(rectOf(id), { stroke: REST_STROKE, duration: 0.5 }, "<");
        tl.to(textOf(id), { fill: REST_TEXT, duration: 0.5 }, "<");
      });
      tl.add(rest).to({}, { duration: 0.6 });
    }, root);
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.25 }
    );
    io.observe(root);
    const onVis = () => {
      tabHidden = document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      tl?.kill();
      ctx.revert();
    };
  }, [how]);
  const steps = [how.steps[0], how.steps[1], how.steps[2], how.gate, how.steps[3], how.steps[4], how.steps[5]];
  return (
    <section ref={rootRef} id="jak-dziala" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <div className="mb-14 md:mb-20" data-reveal>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/55 mb-6">{ui.how}</p>
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-16 items-end">
          <h2 className="text-3xl md:text-5xl xl:text-6xl font-black tracking-tight leading-[1.05]">
            {how.heading[0]}
            {" "}<br />
            {how.heading[1]}
          </h2>
          <p className="text-base md:text-lg text-white/65 leading-relaxed max-w-xl">{how.intro}</p>
        </div>
      </div>
      {/* lg+: the three-lane diagram (decorative copy of the list below, with real text) */}
      <div className="hidden lg:block" data-reveal>
        <svg viewBox="0 0 1100 330" className="block h-auto w-full" role="img" aria-label={d.a11y}>
          {["agent", "system", "human"].map((k, i) => (
            <g key={k}>
              {i > 0 && <line x1="0" x2="1100" y1={LANE_Y[k] - 48} y2={LANE_Y[k] - 48} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />}
              <text x="0" y={LANE_Y[k] + 4} fontSize="10.5" letterSpacing="2" fill={MUTED} style={{ fontFamily: MONO }}>
                {laneName(k)}
              </text>
            </g>
          ))}
          {Object.entries(EDGES).map(([key, e]) => {
            const last = e.pts.slice(-2);
            return (
              <g key={key} data-e={key}>
                <polyline
                  data-ink
                  points={e.pts.map((p) => p.join(",")).join(" ")}
                  fill="none"
                  stroke={EDGE}
                  strokeWidth="1.2"
                  strokeDasharray={e.dashed ? "4 4" : undefined}
                  strokeLinejoin="round"
                />
                <polygon points={arrowFor(last)} fill={EDGE} stroke={EDGE} strokeWidth="1" strokeLinejoin="round" />
              </g>
            );
          })}
          {/* edge captions */}
          <g style={{ fontFamily: MONO }} fontSize="9.5" letterSpacing="1.6" fill={MUTED}>
            <rect x="470" y="22" width="250" height="16" fill={BG} />
            <text x="595" y="34" textAnchor="middle" data-retry="verify>plan">{d.labels.retry}</text>
            <rect x="860" y="309" width="170" height="16" fill={BG} />
            <text x="945" y="321" textAnchor="middle" data-retry="verify>handover">{d.labels.handover}</text>
            <text x="607" y="218" fill={MUTED}>{d.labels.needsApproval}</text>
            <text x="665" y="146" textAnchor="middle">{d.labels.allowed}</text>
          </g>
          {Object.entries(NODES).map(([id, n]) => (
            <g key={id} data-n={id}>
              <rect
                x={n.x - NW / 2}
                y={n.y - NH / 2}
                width={NW}
                height={NH}
                rx={NH / 2}
                fill={BG}
                stroke={REST_STROKE}
                strokeWidth="1.2"
                strokeDasharray={n.dashed ? "4 4" : undefined}
              />
              <text
                x={n.x}
                y={n.y + 4}
                textAnchor="middle"
                fontSize="11.5"
                letterSpacing="1"
                fill={REST_TEXT}
                style={{ fontFamily: MONO }}
              >
                {d.nodes[id]}
              </text>
            </g>
          ))}
          <circle data-token cx={NODES.goal.x} cy={NODES.goal.y} r="4.5" fill={CYAN} opacity="0" />
        </svg>
      </div>
      {/* below lg there is no diagram: the stage names stay visible as a short line */}
      <ol aria-label={how.heading.join(" ")} className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 lg:hidden">
        {steps.map((step, i) => (
          <li key={step.label} className="flex items-center gap-3">
            <span className="rounded-full border border-white/25 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/75">{step.label}</span>
            {i < steps.length - 1 && <span aria-hidden="true" className="text-xs text-white/20">—</span>}
          </li>
        ))}
      </ol>
      {/* the full description of the six steps sits in a native <details> */}
      <Disclosure label={how.detailsLabel} className="mt-10 lg:mt-14">
      <ol className="relative grid grid-cols-1 gap-9 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-12">
        <span aria-hidden="true" className="absolute bottom-6 left-[17px] top-4 w-px bg-white/12 lg:hidden" />
        {steps.map((step, i) => {
          const isGate = step === how.gate;
          return (
            <li
              key={step.label}
              className={`relative pl-14 lg:border-t lg:border-white/12 lg:pl-0 lg:pt-6 ${
                isGate ? "lg:order-last lg:col-span-3 lg:mt-0 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10" : ""
              }`}
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-brand-black font-mono text-[10px] text-white/70 lg:hidden"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={`mb-3 flex flex-wrap items-center gap-3 ${isGate ? "lg:mb-0 lg:self-start" : ""}`}>
                <span
                  className={`rounded-full border border-white/25 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/75 ${
                    isGate ? "lg:border-dashed lg:border-white/35 lg:text-white/80" : ""
                  }`}
                >
                  {step.label}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">{laneName(step.lane)}</span>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold tracking-tight md:text-xl">{step.title}</h3>
                <p className={`max-w-md text-sm leading-relaxed text-white/65 ${isGate ? "lg:max-w-2xl" : ""}`}>{step.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>
      </Disclosure>
      {how.note && (
        <p className="mt-16 max-w-2xl border-l border-white/20 pl-5 text-sm md:text-base text-white/65 leading-relaxed" data-reveal>
          {how.note}
        </p>
      )}
    </section>
  );
};
export default LaneSchematic;
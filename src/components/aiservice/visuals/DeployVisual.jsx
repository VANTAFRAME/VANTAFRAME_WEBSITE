import React, { useEffect, useRef } from "react";
import gsap from "gsap";
// DeployVisual — "a system assembling".
//
// A phase spine (ANALYSIS → DESIGN → BUILD → TEST → DEPLOY) advances one step at
// a time; beneath it an architecture stack is built bottom-up, module by module
// (ghost outline → being built → built). A connector is drawn only after the
// module it belongs to is finished. At TEST an EVAL meter gates progress: the
// flow only continues once the bar crosses the threshold. At DEPLOY a request
// travels through the layers, MONITOR taps every module and a return line carries
// the signal back to ANALYSIS (continuous improvement).
//
// ONE master GSAP timeline per cycle, cycles are chained and deterministic:
//
//   cycle 0  clean pass
//   cycle 1  EVAL fails (GUARDRAILS) → flow steps back to BUILD → fix → EVAL passes
//   cycle 2  clean pass, MONITOR raises an ALERT that goes round the feedback loop
//   cycle 3  EVAL fails (MODEL) → flow steps back to BUILD → fix → EVAL passes
//
// Nothing re-renders React: the SVG is rendered once and the timeline writes to
// DOM attributes/styles (transform / opacity / stroke only). No timeline at all
// under prefers-reduced-motion (a fully resolved static frame is shown).
// Hover highlights are pure CSS overlays and never touch the timeline.
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const CY = "#67e8f9";
const C = {
  ghost: "rgba(255,255,255,0.16)",
  on: "rgba(103,232,249,0.9)",
  done: "rgba(255,255,255,0.34)",
  sys: "rgba(255,255,255,0.5)",
  labelGhost: "rgba(255,255,255,0.52)",
  labelDone: "rgba(255,255,255,0.88)",
  tagGhost: "rgba(255,255,255,0.4)",
  tagDone: "rgba(255,255,255,0.62)",
  nodeRest: "rgba(255,255,255,0.3)",
  nodeDone: "rgba(255,255,255,0.72)",
  phRest: "rgba(255,255,255,0.5)",
  phDone: "rgba(255,255,255,0.82)",
  line: "rgba(255,255,255,0.4)",
};
// Visible texts come from the `labels` prop (PL/EN, see data/aiServices/wdrozenia-ai.js); these are the
// English defaults, also used when a page does not pass any.
const DEFAULT_LABELS = {
  phases: ["ANALYSIS", "DESIGN", "BUILD", "TEST", "DEPLOY"],
  mods: {
    data: { label: "DATA", tag: "SRC" },
    integ: { label: "INTEGRATIONS", tag: "API" },
    model: { label: "MODEL", tag: "LLM" },
    guard: { label: "GUARDRAILS", tag: "RULES" },
    eval: { label: "EVAL", tag: null },
  },
  monitor: "MONITOR",
  logs: "LOGS",
  feedback: "FEEDBACK",
  gate: "GATE",
  pass: "PASS",
  fail: "FAIL",
  alert: "ALERT",
  loop: "LOOP",
};
const PX = [90, 270, 450, 630, 810];
const SPINE_Y = 84;
// Architecture stack, bottom → top. EVAL is a thinner gate bar on top.
const MODS = {
  data: { label: "DATA", tag: "SRC", y: 450, h: 48 },
  integ: { label: "INTEGRATIONS", tag: "API", y: 374, h: 48 },
  model: { label: "MODEL", tag: "LLM", y: 298, h: 48 },
  guard: { label: "GUARDRAILS", tag: "RULES", y: 222, h: 48 },
  eval: { label: "EVAL", tag: null, y: 150, h: 44 },
};
const ORDER = ["data", "integ", "model", "guard", "eval"];
const SX = 70;
const SW = 520;
const MID = 330;
const MON = { x: 660, y: 150, w: 180, h: 348 };
const BAR_H = [70, 110, 60, 140, 90, 120, 80, 100];
const CONNS = [0, 1, 2, 3].map((i) => {
  const lo = MODS[ORDER[i]];
  const up = MODS[ORDER[i + 1]];
  return `M${MID} ${lo.y} V${up.y + up.h}`;
});
const TAPS = ORDER.map((k) => `M${SX + SW} ${MODS[k].y + MODS[k].h / 2} H${MON.x}`);
const PATHS = {
  ret: `M${MON.x + MON.w / 2} ${MON.y} V120 H${PX[0]} V93`,
  flow: `M${MID} 474 V172 H${MON.x}`,
};
const VARIANTS = [
  { fail: null, alert: false },
  { fail: "guard", alert: false },
  { fail: null, alert: true },
  { fail: "model", alert: false },
];
const EVAL_TRACK = { x: 230, w: 240 };
const THR_X = EVAL_TRACK.x + EVAL_TRACK.w * 0.8;
const DeployVisual = ({ caption = "", a11y = "", labels = DEFAULT_LABELS }) => {
  const rootRef = useRef(null);
  const L = labels || DEFAULT_LABELS;
  // the GSAP timelines are built once; they read the current labels through this ref
  const Lref = useRef(L);
  Lref.current = L;
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 48rem)");
    const $ = (sel) => root.querySelector(sel);
    const $$ = (sel) => Array.from(root.querySelectorAll(sel));
    let visible = false;
    let tabHidden = document.hidden;
    let current = null;
    let cycle = 0;
    let ctx = null;
    let teardown = () => {};
    const syncPlayState = () => {
      if (!current) return;
      if (visible && !tabHidden) current.play();
      else current.pause();
    };
    // ------------------------------------------------------------ desktop (SVG)
    const setupDesktop = () => {
      const mods = {};
      [...ORDER, "monitor"].forEach((k) => {
        const g = $(`[data-mod="${k}"]`);
        mods[k] = {
          box: g.querySelector(".dv-box"),
          label: g.querySelector(".dv-label"),
          tags: Array.from(g.querySelectorAll(".dv-tag")),
          bar: g.querySelector(".dv-bar"),
        };
      });
      const nodes = $$("[data-node]");
      const plabels = $$("[data-plabel]");
      const spineFill = $('[data-id="spineFill"]');
      const cursor = $('[data-id="cursor"]');
      const conns = $$("[data-conn]");
      const taps = $$("[data-tap]");
      const retTrail = $('[data-id="retTrail"]');
      const retLabel = $('[data-id="retLabel"]');
      const meterFill = $('[data-id="meterFill"]');
      const thr = $('[data-id="thr"]');
      const resPass = $('[data-id="resPass"]');
      const resFail = $('[data-id="resFail"]');
      const mbars = $$("[data-mbar]");
      const alertTxt = $('[data-id="alertTxt"]');
      const packets = $$("[data-packet]");
      const pathEl = (id) => $(`[data-path="${id}"]`);
      const boxes = [...ORDER, "monitor"].map((k) => mods[k]);
      const modRest = (m) => {
        gsap.set(m.box, { opacity: 0, stroke: C.done });
        gsap.set(m.label, { fill: C.labelGhost });
        gsap.set(m.tags, { fill: C.tagGhost });
        gsap.set(m.bar, { opacity: 0, scaleX: 0, transformOrigin: "0% 50%" });
      };
      // Known starting state (also the state every cycle ends in).
      const rest = () => {
        boxes.forEach(modRest);
        gsap.set(nodes, { stroke: C.nodeRest, fill: "#050505" });
        gsap.set(plabels, { fill: C.phRest });
        gsap.set(spineFill, { strokeDashoffset: 1 });
        gsap.set(cursor, { x: PX[0], y: SPINE_Y, opacity: 0 });
        gsap.set([...conns, ...taps], { strokeDashoffset: 1, opacity: 1 });
        gsap.set(retTrail, { opacity: 0, strokeDashoffset: 100 });
        gsap.set(retLabel, { fill: C.tagGhost });
        gsap.set(meterFill, { scaleX: 0, fill: CY, transformOrigin: "0% 50%" });
        gsap.set(thr, { stroke: C.line });
        gsap.set([resPass, resFail, alertTxt], { opacity: 0 });
        gsap.set(mbars, { scaleY: 0, fill: "rgba(255,255,255,0.4)", transformOrigin: "50% 100%" });
        gsap.set(packets, { autoAlpha: 0 });
      };
      if (reduced) {
        // Static, fully resolved frame: the finished system, no timeline.
        rest();
        boxes.forEach((m) => {
          gsap.set(m.box, { opacity: 1, stroke: C.sys });
          gsap.set(m.label, { fill: C.labelDone });
          gsap.set(m.tags, { fill: C.tagDone });
        });
        gsap.set(nodes, { stroke: C.nodeDone, fill: C.nodeDone });
        gsap.set(plabels, { fill: C.phDone });
        gsap.set(spineFill, { strokeDashoffset: 0 });
        gsap.set([...conns, ...taps], { strokeDashoffset: 0, stroke: C.line });
        gsap.set(retTrail, { opacity: 1, strokeDashoffset: 0, stroke: C.line });
        gsap.set(retLabel, { fill: C.tagDone });
        gsap.set(meterFill, { scaleX: 1, fill: "rgba(255,255,255,0.6)" });
        gsap.set(resPass, { opacity: 1, fill: C.labelDone });
        gsap.set(mbars, { scaleY: 1 });
        return () => {};
      }
      // Small data packet along an existing path (no plugin needed).
      const travel = (id, pk, dur, ease = "power1.inOut") => {
        const p = pathEl(id);
        const len = p.getTotalLength();
        const state = { v: 0 };
        return gsap.to(state, {
          v: 1,
          duration: dur,
          ease,
          onStart() {
            gsap.set(pk, { autoAlpha: 1 });
          },
          onUpdate() {
            const d = state.v * len;
            const a = p.getPointAtLength(d);
            const b = p.getPointAtLength(Math.min(len, d + 1));
            const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
            pk.setAttribute("transform", `translate(${a.x.toFixed(2)} ${a.y.toFixed(2)}) rotate(${ang.toFixed(1)})`);
          },
          onComplete() {
            gsap.set(pk, { autoAlpha: 0 });
          },
        });
      };
      const build = (variant) => {
        const tl = gsap.timeline({
          paused: !(visible && !tabHidden),
          onComplete: () => {
            cycle += 1;
            current = build(VARIANTS[cycle % VARIANTS.length]);
            syncPlayState();
          },
        });
        // Authored in "choreography seconds"; played 1.15x (1.25x with ALERT, 1.5x when EVAL fails) so a
        // clean pass lasts ~11 s, the longer variants ~12.5 s.
        tl.timeScale(variant.fail ? 1.5 : variant.alert ? 1.25 : 1.15);
        // -- small vocabulary ------------------------------------------------
        const phOn = (i, at) =>
          tl.to(nodes[i], { stroke: CY, fill: CY, duration: 0.25 }, at).to(plabels[i], { fill: CY, duration: 0.25 }, at);
        const phDone = (i, at) =>
          tl.to(nodes[i], { stroke: C.nodeDone, fill: C.nodeDone, duration: 0.4 }, at).to(plabels[i], { fill: C.phDone, duration: 0.4 }, at);
        const phRest = (i, at) =>
          tl.to(nodes[i], { stroke: C.nodeRest, fill: "#050505", duration: 0.4 }, at).to(plabels[i], { fill: C.phRest, duration: 0.4 }, at);
        // cursor + spine move to phase i (the cursor is the "current step" marker)
        const go = (i, at) => {
          tl.to(cursor, { x: PX[i], duration: 0.45, ease: "power2.inOut" }, at).to(
            spineFill,
            { strokeDashoffset: 1 - i / 4, duration: 0.45, ease: "power2.inOut" },
            at
          );
          return phOn(i, at + 0.35);
        };
        const modOn = (k, at, d) => {
          const m = mods[k];
          tl.to(m.box, { opacity: 1, stroke: C.on, duration: 0.25 }, at)
            .to(m.label, { fill: "#ffffff", duration: 0.25 }, at)
            .to(m.tags, { fill: C.tagDone, duration: 0.25 }, at)
            .set(m.bar, { opacity: 1, scaleX: 0 }, at + 0.1)
            .to(m.bar, { scaleX: 1, duration: d, ease: "power1.inOut" }, at + 0.1);
          return at + 0.1 + d;
        };
        const modDone = (k, at, stroke = C.done) => {
          const m = mods[k];
          tl.to(m.box, { stroke, duration: 0.4 }, at)
            .to(m.label, { fill: C.labelDone, duration: 0.4 }, at)
            .to(m.bar, { opacity: 0, duration: 0.3 }, at);
        };
        const conn = (i, at) => tl.to(conns[i], { strokeDashoffset: 0, duration: 0.35, ease: "power2.out" }, at);
        // -- A · ANALYSIS: DATA is mapped ------------------------------------
        tl.to(cursor, { opacity: 1, duration: 0.2 }, 0.4);
        phOn(0, 0.4);
        let t = modOn("data", 0.6, 1.0);
        modDone("data", t);
        phDone(0, t + 0.1);
        // -- B · DESIGN: INTEGRATIONS (API contracts) -------------------------
        go(1, t + 0.1);
        t = modOn("integ", t + 0.5, 0.9);
        modDone("integ", t);
        conn(0, t);
        phDone(1, t + 0.35);
        // -- C · BUILD: MODEL, then GUARDRAILS on top of it -------------------
        go(2, t + 0.35);
        t = modOn("model", t + 0.75, 0.8);
        modDone("model", t);
        conn(1, t);
        t = modOn("guard", t + 0.1, 0.8);
        modDone("guard", t);
        conn(2, t);
        phDone(2, t + 0.35);
        // -- D · TEST: the EVAL bar gates progress ----------------------------
        const evalAttempt = (at, pass) => {
          const m = mods.eval;
          tl.to(m.box, { opacity: 1, stroke: C.on, duration: 0.25 }, at)
            .to(m.label, { fill: "#ffffff", duration: 0.25 }, at)
            .set(meterFill, { scaleX: 0, fill: CY }, at);
          // the bar fills; it must cross the threshold tick (80 %) to pass
          tl.to(meterFill, { scaleX: pass ? 1 : 0.55, duration: pass ? 1.0 : 0.8, ease: "power1.inOut" }, at + 0.2);
          const end = at + 0.2 + (pass ? 1.0 : 0.8);
          tl.to(thr, { stroke: "#ffffff", duration: 0.15 }, end - 0.05);
          if (pass) {
            tl.to(resPass, { opacity: 1, fill: CY, duration: 0.2 }, end)
              .to(resPass, { fill: C.labelDone, duration: 0.5 }, end + 0.5)
              .to(m.box, { stroke: C.done, duration: 0.4 }, end + 0.3)
              .to(m.label, { fill: C.labelDone, duration: 0.4 }, end + 0.3)
              .to(meterFill, { fill: "rgba(255,255,255,0.6)", duration: 0.4 }, end + 0.3);
            conn(3, end + 0.3);
            return end + 0.65;
          }
          tl.to(resFail, { opacity: 1, duration: 0.2 }, end)
            .to(meterFill, { fill: "rgba(255,255,255,0.45)", duration: 0.3 }, end);
          return end + 0.5;
        };
        go(3, t + 0.35);
        t += 0.8;
        if (variant.fail) {
          t = evalAttempt(t, false);
          // failed check: the flow steps back ONE phase (BUILD), the weak module is reworked
          tl.to(thr, { stroke: C.line, duration: 0.3 }, t)
            .to(resFail, { opacity: 0, duration: 0.25 }, t + 0.2)
            .to(meterFill, { scaleX: 0, duration: 0.4, ease: "power2.inOut" }, t + 0.2)
            .to(mods.eval.box, { stroke: C.done, duration: 0.3 }, t)
            .to(mods.eval.label, { fill: C.labelGhost, duration: 0.3 }, t);
          phRest(3, t);
          tl.to(cursor, { x: PX[2], duration: 0.45, ease: "power2.inOut" }, t + 0.1).to(
            spineFill,
            { strokeDashoffset: 1 - 2 / 4, duration: 0.45, ease: "power2.inOut" },
            t + 0.1
          );
          phOn(2, t + 0.45);
          const fixed = modOn(variant.fail, t + 0.6, 0.7);
          modDone(variant.fail, fixed);
          phDone(2, fixed + 0.3);
          go(3, fixed + 0.3);
          t = evalAttempt(fixed + 1.1, true);
        } else {
          t = evalAttempt(t, true);
        }
        phDone(3, t);
        // -- E · DEPLOY: one connected system + feedback loop -----------------
        go(4, t);
        t += 0.8;
        // a request travels through the layers; MONITOR taps every module
        tl.add(travel("flow", packets[0], 1.3), t);
        taps.forEach((tp, i) => tl.to(tp, { strokeDashoffset: 0, duration: 0.35, ease: "power2.out" }, t + 0.15 + i * 0.16));
        ORDER.forEach((k, i) => modDone(k, t + 0.9 + i * 0.05, C.sys));
        modOn("monitor", t + 0.9, 0.5);
        tl.to(mbars, { scaleY: 1, duration: 0.5, ease: "power2.out", stagger: 0.05 }, t + 1.2);
        modDone("monitor", t + 1.7, C.sys);
        // MONITOR is live: the bars breathe (finite, authored in the cycle)
        tl.to(mbars, { scaleY: 0.55, duration: 0.45, stagger: { each: 0.06, repeat: 1, yoyo: true } }, t + 1.8);
        let loopAt = t + 2.6;
        if (variant.alert) {
          // drift detected: one bar spikes, ALERT is raised before the feedback loop
          tl.to(mbars[4], { scaleY: 1.5, fill: CY, duration: 0.35, ease: "power2.out" }, loopAt)
            .to(alertTxt, { opacity: 1, duration: 0.2 }, loopAt + 0.1)
            .to(mbars[4], { scaleY: 1, fill: "rgba(255,255,255,0.4)", duration: 0.5 }, loopAt + 1.1)
            .to(alertTxt, { opacity: 0, duration: 0.3 }, loopAt + 1.3);
          loopAt += 0.7;
        }
        // return line MONITOR → ANALYSIS
        tl.to(retLabel, { fill: "#ffffff", duration: 0.2 }, loopAt)
          .set(retTrail, { opacity: 1, strokeDashoffset: 100 }, loopAt)
          .to(retTrail, { strokeDashoffset: 0, duration: 1.3, ease: "power1.inOut" }, loopAt)
          .add(travel("ret", packets[1], 1.3), loopAt);
        const back = loopAt + 1.3;
        // the loop closes: ANALYSIS lights up again as the next cycle's input
        tl.to(nodes[0], { stroke: CY, fill: CY, duration: 0.2 }, back)
          .to(plabels[0], { fill: CY, duration: 0.2 }, back)
          .to(plabels[4], { fill: C.phDone, duration: 0.3 }, back);
        phDone(4, back);
        // -- smooth reset, then a beat of rest --------------------------------
        const r = back + 0.7;
        boxes.forEach((m) => {
          tl.to(m.box, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, r)
            .to(m.label, { fill: C.labelGhost, duration: 0.7 }, r)
            .to(m.tags, { fill: C.tagGhost, duration: 0.7 }, r);
        });
        tl.to([...conns, ...taps], { strokeDashoffset: 1, duration: 0.7, ease: "power2.inOut" }, r)
          .to(retTrail, { opacity: 0, duration: 0.5 }, r)
          .to(retLabel, { fill: C.tagGhost, duration: 0.6 }, r)
          .to(spineFill, { strokeDashoffset: 1, duration: 0.7, ease: "power2.inOut" }, r)
          .to(cursor, { opacity: 0, duration: 0.3 }, r)
          .to(nodes, { stroke: C.nodeRest, fill: "#050505", duration: 0.7 }, r)
          .to(plabels, { fill: C.phRest, duration: 0.7 }, r)
          .to(meterFill, { scaleX: 0, duration: 0.6 }, r)
          .to([resPass, resFail], { opacity: 0, duration: 0.4 }, r)
          .to(thr, { stroke: C.line, duration: 0.4 }, r)
          .to(mbars, { scaleY: 0, duration: 0.5, stagger: 0.03 }, r)
          .to({}, { duration: 0.3 }, r + 0.7); // idle tail
        return tl;
      };
      rest();
      current = build(VARIANTS[cycle % VARIANTS.length]);
      syncPlayState();
      return () => {
        current?.kill();
        current = null;
      };
    };
    // ------------------------------------------------------ mobile (HTML list)
    const setupMobile = () => {
      const stagesM = $$("[data-m-stage]");
      const dots = $$("[data-m-dot]");
      const fills = $$("[data-m-fill]");
      const labels = $$("[data-m-label]");
      const chipsM = {};
      $$("[data-m-chip]").forEach((el) => {
        chipsM[el.dataset.mChip] = el;
      });
      const ALL = Object.values(chipsM);
      const res = chipsM.res;
      const chipRest = { borderColor: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.66)", backgroundColor: "#0a0a0a" };
      const chipOnS = { borderColor: "rgba(103,232,249,0.85)", color: "#ffffff", backgroundColor: "rgba(103,232,249,0.08)" };
      const chipDone = { borderColor: "rgba(255,255,255,0.32)", color: "rgba(255,255,255,0.9)", backgroundColor: "#0a0a0a" };
      const rest = () => {
        gsap.set(ALL, chipRest);
        gsap.set(fills, { scaleY: 0, transformOrigin: "50% 0%" });
        gsap.set(dots, { backgroundColor: "rgba(255,255,255,0.3)", scale: 1 });
        gsap.set(labels, { color: "rgba(255,255,255,0.62)" });
        if (res) res.textContent = Lref.current.gate;
      };
      if (reduced) {
        gsap.set(ALL, chipDone);
        gsap.set(fills, { scaleY: 1, transformOrigin: "50% 0%" });
        gsap.set(dots, { backgroundColor: "rgba(255,255,255,0.7)" });
        if (res) res.textContent = Lref.current.pass;
        return () => {};
      }
      const stageOn = (tl, i, at) =>
        tl.to(dots[i], { backgroundColor: "rgba(103,232,249,0.95)", scale: 1.35, duration: 0.25 }, at).to(labels[i], { color: "#ffffff", duration: 0.25 }, at);
      const stageDone = (tl, i, at) =>
        tl.to(dots[i], { backgroundColor: "rgba(255,255,255,0.62)", scale: 1, duration: 0.4 }, at).to(labels[i], { color: "rgba(255,255,255,0.62)", duration: 0.4 }, at);
      const on = (tl, el, at) => tl.to(el, { ...chipOnS, duration: 0.25 }, at);
      const done = (tl, el, at) => tl.to(el, { ...chipDone, duration: 0.4 }, at);
      const line = (tl, i, at) => tl.to(fills[i], { scaleY: 1, duration: 0.5, ease: "power1.inOut" }, at);
      const setText = (tl, el, txt, at) => tl.call(() => el && (el.textContent = txt), null, at);
      const build = (variant) => {
        const tl = gsap.timeline({
          paused: !(visible && !tabHidden),
          onComplete: () => {
            cycle += 1;
            current = build(VARIANTS[cycle % VARIANTS.length]);
            syncPlayState();
          },
        });
        let t = 0.4;
        // ANALYSIS
        stageOn(tl, 0, t);
        on(tl, chipsM.data, t + 0.1);
        done(tl, chipsM.data, t + 0.9);
        line(tl, 0, t + 1.0);
        stageDone(tl, 0, t + 1.4);
        // DESIGN
        t += 1.4;
        stageOn(tl, 1, t);
        on(tl, chipsM.integ, t + 0.1);
        done(tl, chipsM.integ, t + 0.9);
        line(tl, 1, t + 1.0);
        stageDone(tl, 1, t + 1.4);
        // BUILD
        t += 1.4;
        stageOn(tl, 2, t);
        on(tl, chipsM.model, t + 0.1);
        done(tl, chipsM.model, t + 0.8);
        on(tl, chipsM.guard, t + 0.8);
        done(tl, chipsM.guard, t + 1.5);
        line(tl, 2, t + 1.6);
        stageDone(tl, 2, t + 2.0);
        // TEST (EVAL gate)
        t += 2.0;
        stageOn(tl, 3, t);
        on(tl, chipsM.eval, t + 0.1);
        if (variant.fail) {
          on(tl, res, t + 0.9);
          setText(tl, res, Lref.current.fail, t + 0.9);
          // step back one phase, rework the weak module, test again
          stageDone(tl, 3, t + 1.8);
          done(tl, res, t + 1.8);
          setText(tl, res, Lref.current.gate, t + 2.2);
          stageOn(tl, 2, t + 1.9);
          const k = chipsM[variant.fail];
          on(tl, k, t + 2.0);
          done(tl, k, t + 2.9);
          stageDone(tl, 2, t + 3.0);
          t += 3.0;
          stageOn(tl, 3, t);
        }
        on(tl, res, t + 1.0);
        setText(tl, res, Lref.current.pass, t + 1.0);
        done(tl, chipsM.eval, t + 1.4);
        done(tl, res, t + 1.9);
        line(tl, 3, t + 1.9);
        stageDone(tl, 3, t + 2.3);
        // DEPLOY + feedback
        t += 2.3;
        stageOn(tl, 4, t);
        on(tl, chipsM.monitor, t + 0.1);
        done(tl, chipsM.monitor, t + 1.0);
        if (variant.alert) {
          setText(tl, chipsM.loop, Lref.current.alert, t + 1.0);
          on(tl, chipsM.loop, t + 1.0);
          setText(tl, chipsM.loop, Lref.current.loop, t + 2.0);
          t += 1.0;
        }
        on(tl, chipsM.loop, t + 1.2);
        stageOn(tl, 0, t + 2.0); // loop returns to ANALYSIS
        stageDone(tl, 4, t + 2.0);
        // reset
        const r = t + 2.6;
        tl.to(ALL, { ...chipRest, duration: 0.6 }, r)
          .to(fills, { scaleY: 0, duration: 0.6, ease: "power2.inOut" }, r)
          .to(dots, { backgroundColor: "rgba(255,255,255,0.3)", duration: 0.6 }, r)
          .to(labels, { color: "rgba(255,255,255,0.62)", duration: 0.6 }, r)
          .call(() => res && (res.textContent = Lref.current.gate), null, r + 0.3)
          .to({}, { duration: 0.3 }, r + 0.6);
        return tl;
      };
      rest();
      current = build(VARIANTS[cycle % VARIANTS.length]);
      syncPlayState();
      return () => {
        current?.kill();
        current = null;
      };
    };
    // --------------------------------------------------------------- lifecycle
    const init = () => {
      teardown();
      ctx?.revert();
      cycle = 0;
      ctx = gsap.context(() => {
        teardown = wide.matches ? setupDesktop() : setupMobile();
      }, root);
    };
    init();
    const onBreakpoint = () => init();
    wide.addEventListener("change", onBreakpoint);
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncPlayState();
      },
      { threshold: 0.1 }
    );
    io.observe(root);
    const onVisibility = () => {
      tabHidden = document.hidden;
      syncPlayState();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      wide.removeEventListener("change", onBreakpoint);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      teardown();
      ctx?.revert();
      current = null;
    };
  }, []);
  const mobileRows = [
    [L.phases[0], [[L.mods.data.label, "data"]]],
    [L.phases[1], [[L.mods.integ.label, "integ"]]],
    [L.phases[2], [[L.mods.model.label, "model"], [L.mods.guard.label, "guard"]]],
    [L.phases[3], [[L.mods.eval.label, "eval"], [L.gate, "res"]]],
    [L.phases[4], [[L.monitor, "monitor"], [L.loop, "loop"]]],
  ];
  return (
    <div ref={rootRef} className="dv-root rounded-xl border border-white/10 bg-black overflow-hidden">
      <style>{`
        .dv-hl{opacity:0;transition:opacity .25s ease;pointer-events:none}
        @media (hover:hover) and (pointer:fine){.dv-hit:hover .dv-hl{opacity:1}}
      `}</style>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-black/40">
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="ml-2 text-[10px] font-mono text-white/60 tracking-wider truncate">{caption}</span>
      </div>
      {/* Text equivalent for assistive tech and crawlers. */}
      <p className="sr-only">{a11y}</p>
      {/* ---------- md+ : full canvas ---------- */}
      <svg
        viewBox="0 0 900 540"
        className="hidden md:block w-full h-auto"
        aria-hidden="true"
        focusable="false"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      >
        {/* phase spine */}
        <path d={`M${PX[0]} ${SPINE_Y} H${PX[4]}`} stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" fill="none" />
        <path data-id="spineFill" d={`M${PX[0]} ${SPINE_Y} H${PX[4]}`} pathLength="1" stroke="rgba(255,255,255,0.5)" strokeWidth="1.4" fill="none" strokeDasharray="1" strokeDashoffset="1" />
        {L.phases.map((p, i) => (
          <g key={p}>
            <text data-plabel={i} x={PX[i]} y="56" textAnchor="middle" fontSize="11" letterSpacing="3.5" fill={C.phRest} style={{ fontFamily: MONO }}>
              {p}
            </text>
            <circle data-node={i} cx={PX[i]} cy={SPINE_Y} r="4.5" fill="#050505" stroke={C.nodeRest} strokeWidth="1.3" />
          </g>
        ))}
        {/* feedback line: MONITOR → ANALYSIS (base + cyan trail) */}
        <path data-path="ret" d={PATHS.ret} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" strokeDasharray="4 5" />
        <path data-id="retTrail" d={PATHS.ret} pathLength="100" fill="none" stroke={CY} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="100" strokeDashoffset="100" opacity="0" />
        <path data-path="flow" d={PATHS.flow} fill="none" stroke="none" />
        <text data-id="retLabel" x="450" y="112" textAnchor="middle" fontSize="11" letterSpacing="3.5" fill={C.tagGhost} style={{ fontFamily: MONO }}>
          {L.feedback}
        </text>
        {/* connectors (drawn after the module below them is built) */}
        {CONNS.map((d, i) => (
          <path key={`c${i}`} data-conn={i} d={d} pathLength="1" fill="none" stroke={C.line} strokeWidth="1.2" strokeDasharray="1" strokeDashoffset="1" />
        ))}
        {TAPS.map((d, i) => (
          <path key={`t${i}`} data-tap={i} d={d} pathLength="1" fill="none" stroke={C.line} strokeWidth="1.2" strokeDasharray="1" strokeDashoffset="1" />
        ))}
        {/* architecture modules */}
        {ORDER.map((k) => {
          const m = MODS[k];
          const cy = m.y + m.h / 2 + 4;
          return (
            <g key={k} data-mod={k} className="dv-hit">
              <rect x={SX} y={m.y} width={SW} height={m.h} rx="10" fill="none" stroke={C.ghost} strokeDasharray="3 4" />
              <rect className="dv-box" x={SX} y={m.y} width={SW} height={m.h} rx="10" fill="#0a0a0a" stroke={C.done} opacity="0" />
              <text className="dv-label" x={SX + 22} y={cy} fontSize="12" letterSpacing="3" fill={C.labelGhost} style={{ fontFamily: MONO }}>
                {L.mods[k].label}
              </text>
              {L.mods[k].tag && (
                <text className="dv-tag" x={SX + SW - 22} y={cy} textAnchor="end" fontSize="11" letterSpacing="2.5" fill={C.tagGhost} style={{ fontFamily: MONO }}>
                  {L.mods[k].tag}
                </text>
              )}
              <rect className="dv-bar" x={SX + 10} y={m.y + m.h - 3} width={SW - 20} height="2" rx="1" fill={CY} opacity="0" />
              <rect className="dv-hl" x={SX} y={m.y} width={SW} height={m.h} rx="10" fill="none" stroke="rgba(255,255,255,0.6)" />
            </g>
          );
        })}
        {/* EVAL meter (inside the gate bar) */}
        <rect x={EVAL_TRACK.x} y="168" width={EVAL_TRACK.w} height="8" rx="2" fill="rgba(255,255,255,0.1)" />
        <rect data-id="meterFill" x={EVAL_TRACK.x} y="168" width={EVAL_TRACK.w} height="8" rx="2" fill={CY} />
        <path data-id="thr" d={`M${THR_X} 160 V184`} stroke={C.line} strokeWidth="1.4" />
        <text data-id="resPass" x={SX + SW - 22} y="176" textAnchor="end" fontSize="11" letterSpacing="2.5" fill={C.labelDone} opacity="0" style={{ fontFamily: MONO }}>
          {L.pass}
        </text>
        <text data-id="resFail" x={SX + SW - 22} y="176" textAnchor="end" fontSize="11" letterSpacing="2.5" fill="rgba(255,255,255,0.9)" opacity="0" style={{ fontFamily: MONO }}>
          {L.fail}
        </text>
        {/* MONITOR tower */}
        <g data-mod="monitor" className="dv-hit">
          <rect x={MON.x} y={MON.y} width={MON.w} height={MON.h} rx="10" fill="none" stroke={C.ghost} strokeDasharray="3 4" />
          <rect className="dv-box" x={MON.x} y={MON.y} width={MON.w} height={MON.h} rx="10" fill="#0a0a0a" stroke={C.done} opacity="0" />
          <text className="dv-label" x={MON.x + 20} y={MON.y + 32} fontSize="12" letterSpacing="3" fill={C.labelGhost} style={{ fontFamily: MONO }}>
            {L.monitor}
          </text>
          <text className="dv-tag" x={MON.x + MON.w - 20} y={MON.y + 58} textAnchor="end" fontSize="11" letterSpacing="2.5" fill={C.tagGhost} style={{ fontFamily: MONO }}>
            {L.logs}
          </text>
          <text data-id="alertTxt" x={MON.x + 20} y={MON.y + 58} fontSize="11" letterSpacing="2.5" fill="rgba(255,255,255,0.9)" opacity="0" style={{ fontFamily: MONO }}>
            {L.alert}
          </text>
          {BAR_H.map((h, i) => (
            <rect key={i} data-mbar={i} x={MON.x + 20 + i * 18} y={MON.y + MON.h - 24 - h} width="8" height={h} rx="1.5" fill="rgba(255,255,255,0.4)" />
          ))}
          <rect className="dv-bar" x={MON.x + 10} y={MON.y + MON.h - 3} width={MON.w - 20} height="2" rx="1" fill={CY} opacity="0" />
          <rect className="dv-hl" x={MON.x} y={MON.y} width={MON.w} height={MON.h} rx="10" fill="none" stroke="rgba(255,255,255,0.6)" />
        </g>
        {/* spine cursor + data packets (on top) */}
        <rect data-id="cursor" x="-7" y="-2.5" width="14" height="5" rx="1.6" fill={CY} opacity="0" />
        {[0, 1].map((i) => (
          <rect key={i} data-packet={i} x="-6" y="-2.5" width="12" height="5" rx="1.6" fill={CY} opacity="0" />
        ))}
      </svg>
      {/* ---------- < md : compact vertical flow (same cycle, simplified) ---------- */}
      <ol className="md:hidden px-5 py-6" aria-hidden="true">
        {mobileRows.map(([label, items], i) => (
          <li key={label} data-m-stage={i} className="relative pl-6 pb-6 last:pb-0">
            {i < mobileRows.length - 1 && (
              <span className="absolute left-[3px] top-3 bottom-[-4px] w-px bg-white/15 overflow-hidden">
                <span data-m-fill className="block h-full w-full bg-cyan-300/70" />
              </span>
            )}
            <span data-m-dot className="absolute left-0 top-[6px] h-[7px] w-[7px] rounded-full bg-white/30" />
            <p data-m-label className="font-mono text-[11px] tracking-[0.3em] text-white/60 mb-2">
              {label}
            </p>
            <div className="flex flex-wrap gap-2">
              {items.map(([text, key]) => (
                <span key={key} data-m-chip={key} className="rounded-lg border border-white/14 bg-[#0a0a0a] px-3 py-2 font-mono text-[11px] tracking-[0.18em] text-white/70">
                  {text}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
export default DeployVisual;
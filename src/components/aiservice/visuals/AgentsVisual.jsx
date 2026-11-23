import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { translate } from "./translate";
// AgentsVisual — "an agent working a task".
//
// TASK enters a loop PLAN → ACT → OBSERVE → VERIFY. ACT never touches a tool
// directly: every call goes through the PERMISSIONS gate, then to a tool
// (API, CRM, DB, MAIL) and the result comes back as an observation. Each
// action appends a short trace line to the LOG column, so the run is visible.
// The cycle ends in RESULT. The agent is not shown as infallible:
//
//   cycle 0  S01 API ok · S02 CRM ok → RESULT
//   cycle 1  S01 DB ok · S02 MAIL is sensitive → HUMAN approval (waiting, then approved) → RESULT
//   cycle 2  S01 CRM call is DENIED at the gate → VERIFY flags it → re-plan → S02 API ok → RESULT
//   cycle 3  S01 DB returns a result, VERIFY FAILS → re-plan → S02 API ok → RESULT
//
// ONE master GSAP timeline per cycle, chained and deterministic. Nothing
// re-renders React: the SVG is rendered once; the timeline writes straight to
// DOM attributes/styles (transform / opacity / stroke only; the few log
// strings are written once per cycle while their row is still hidden, or via
// tl.call). Packets are small rects moved along real paths with
// getPointAtLength. No timeline under prefers-reduced-motion.
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const CY = "#67e8f9";
const C = {
  boxRest: "rgba(255,255,255,0.16)",
  boxOn: "rgba(103,232,249,0.9)",
  boxDone: "rgba(255,255,255,0.34)",
  labelRest: "rgba(255,255,255,0.74)",
  dotRest: "rgba(255,255,255,0.24)",
  gateRest: "rgba(255,255,255,0.3)",
  headRest: "rgba(255,255,255,0.6)",
  logRest: "rgba(255,255,255,0.7)",
  base: "#232323",
};
const TOOLS = ["API", "CRM", "DB", "MAIL"];
const TOOL_Y = [130, 180, 230, 280]; // chip tops (h 36)
const TX = 616;
const NODES = {
  plan: { x: 190, y: 150, label: "PLAN" },
  act: { x: 400, y: 150, label: "ACT" },
  obs: { x: 400, y: 340, label: "OBSERVE" },
  ver: { x: 190, y: 340, label: "VERIFY" },
};
const PATHS = {
  task: "M130 272 H160 V172 H190",
  p2a: "M310 172 H400",
  a2o: "M460 194 V340",
  o2v: "M400 362 H310",
  v2p: "M250 340 V194",
  v2r: "M250 384 V450",
  gate: "M520 172 H553",
  toHuman: "M553 172 H562 V322 H606 V384",
  fromHuman: "M716 440 H728 V298 H700",
};
TOOL_Y.forEach((y, k) => {
  PATHS[`out${k}`] = `M520 172 H575 C 592 172 598 ${y + 10} ${TX} ${y + 10}`;
  PATHS[`back${k}`] = `M${TX} ${y + 26} H540 V362 H520`;
});
const DASHED = new Set(["toHuman", "fromHuman"]);
// Steps per cycle. kind: ok | deny | vfail | human
const VARIANTS = [
  { steps: [{ tool: 0, kind: "ok" }, { tool: 1, kind: "ok" }] },
  { steps: [{ tool: 2, kind: "ok" }, { tool: 3, kind: "human" }] },
  { steps: [{ tool: 1, kind: "deny" }, { tool: 0, kind: "ok" }] },
  { steps: [{ tool: 2, kind: "vfail" }, { tool: 0, kind: "ok" }] },
];
// Trace lines written to the LOG column, in the order the timeline appends them.
const rowsFor = (variant) => {
  const rows = [];
  variant.steps.forEach((s, i) => {
    const n = `S0${i + 1}`;
    const tool = TOOLS[s.tool];
    rows.push([`${n} PLAN`, ""]);
    if (s.kind === "deny") rows.push([`${n} ${tool}`, "DENY"], [`${n} VERIFY`, "RETRY"]);
    else if (s.kind === "human") rows.push([`${n} ${tool}`, "OK"], [`${n} HUMAN`, "OK"], [`${n} VERIFY`, "OK"]);
    else if (s.kind === "vfail") rows.push([`${n} ${tool}`, "OK"], [`${n} VERIFY`, "FAIL"]);
    else rows.push([`${n} ${tool}`, "OK"], [`${n} VERIFY`, "OK"]);
  });
  rows.push(["RESULT", "DONE"]);
  return rows;
};
const ROW_Y = (i) => 176 + i * 36;
const Node = ({ id, x, y, w = 120, h = 44, label, check = false }) => (
  <g data-chip={id} className="ag-hit">
    <rect className="ag-box" x={x} y={y} width={w} height={h} rx="10" fill="#0a0a0a" stroke={C.boxRest} />
    <circle className="ag-dot" cx={x + 16} cy={y + h / 2} r="2.4" fill={C.dotRest} />
    <text className="ag-label" x={x + w / 2 + 2} y={y + h / 2 + 4.5} textAnchor="middle" fontSize="12" letterSpacing="2.4" fill={C.labelRest} style={{ fontFamily: MONO }}>
      {label}
    </text>
    {check && (
      <path className="ag-check" d={`M${x + w - 20} ${y + h / 2} l3.4 3.4 l6.6 -7.2`} pathLength="1" fill="none" stroke={CY} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset="1" />
    )}
    <rect className="ag-hl" x={x} y={y} width={w} height={h} rx="10" fill="none" stroke="rgba(255,255,255,0.6)" />
  </g>
);
const AgentsVisual = ({ caption = "", a11y = "", labels = {} }) => {
  const rootRef = useRef(null);
  const Lref = useRef(labels);
  Lref.current = labels;
  const tr = (text) => translate(text, labels);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const tr = (text) => translate(text, Lref.current);
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
      const chipOf = (id) => {
        const g = $(`[data-chip="${id}"]`);
        return { box: g.querySelector(".ag-box"), label: g.querySelector(".ag-label"), dot: g.querySelector(".ag-dot"), check: g.querySelector(".ag-check") };
      };
      const chips = {};
      ["task", "plan", "act", "obs", "ver", "result", "t0", "t1", "t2", "t3"].forEach((id) => (chips[id] = chipOf(id)));
      const gate = { box: $('[data-id="gateBox"]'), txt: $('[data-id="gateTxt"]'), head: $('[data-id="gateHead"]') };
      const human = { box: $('[data-id="humanBox"]'), icon: $$('[data-id="humanIcon"]'), label: $('[data-id="humanLabel"]'), dots: $$('[data-id="humanDot"]'), check: $('[data-id="humanCheck"]') };
      const iter = $('[data-id="iter"]');
      const packets = $$("[data-packet]");
      const rowEls = $$("[data-row]").map((g) => ({ g, l: g.querySelector(".lg-l"), r: g.querySelector(".lg-r"), tick: g.querySelector(".lg-tick") }));
      const pathEl = (id) => $(`[data-path="${id}"]`);
      const trail = (id) => $(`[data-trail="${id}"]`);
      const fillRows = (rows) =>
        rowEls.forEach((el, i) => {
          el.l.textContent = rows[i] ? tr(rows[i][0]) : "";
          el.r.textContent = rows[i] ? tr(rows[i][1]) : "";
        });
      const rest = () => {
        Object.values(chips).forEach((c) => {
          gsap.set(c.box, { stroke: C.boxRest });
          gsap.set(c.label, { fill: C.labelRest });
          gsap.set(c.dot, { fill: C.dotRest, x: 0 });
          if (c.check) gsap.set(c.check, { strokeDashoffset: 1, opacity: 1 });
        });
        gsap.set(gate.box, { stroke: C.gateRest });
        gsap.set(gate.head, { fill: C.headRest });
        gsap.set(gate.txt, { opacity: 0, fill: CY });
        gsap.set(human.box, { stroke: C.boxRest });
        gsap.set(human.icon, { stroke: "rgba(255,255,255,0.6)" });
        gsap.set(human.label, { fill: C.labelRest });
        gsap.set(human.dots, { opacity: 0 });
        gsap.set(human.check, { strokeDashoffset: 1, opacity: 1 });
        gsap.set(iter, { opacity: 0, fill: CY });
        gsap.set(packets, { autoAlpha: 0 });
        gsap.set(rowEls.map((e) => e.g), { opacity: 0, x: 6 });
        gsap.set(rowEls.map((e) => e.tick), { fill: "rgba(255,255,255,0.3)" });
        Object.keys(PATHS).forEach((id) => gsap.set(trail(id), { opacity: 0, strokeDashoffset: 100 }));
      };
      if (reduced) {
        // Static, fully resolved frame: clean run, full trace, RESULT reached.
        rest();
        fillRows(rowsFor(VARIANTS[0]));
        rowEls.forEach((e, i) => gsap.set(e.g, { opacity: i < rowsFor(VARIANTS[0]).length ? 1 : 0, x: 0 }));
        gsap.set(rowEls.map((e) => e.l), { fill: C.logRest });
        gsap.set(iter, { opacity: 0.8, fill: "rgba(255,255,255,0.7)" });
        iter.textContent = "S02";
        ["task", "result", "t0", "t1"].forEach((id) => {
          gsap.set(chips[id].box, { stroke: C.boxDone });
          gsap.set(chips[id].label, { fill: "rgba(255,255,255,0.9)" });
        });
        gsap.set([chips.result.check], { strokeDashoffset: 0, stroke: "rgba(255,255,255,0.8)" });
        return () => {};
      }
      // Small packet along a path, optionally reversed; the cyan trail follows.
      const travel = (id, pk, dur, { rev = false, ease = "power1.inOut", keep = false } = {}) => {
        const p = pathEl(id);
        const tr = trail(id);
        const len = p.getTotalLength();
        const state = { v: rev ? 1 : 0 };
        return gsap.to(state, {
          v: rev ? 0 : 1,
          duration: dur,
          ease,
          onStart() {
            gsap.set(tr, { opacity: 1 });
            gsap.set(pk, { autoAlpha: 1 });
          },
          onUpdate() {
            const d = state.v * len;
            const a = p.getPointAtLength(d);
            const b = p.getPointAtLength(Math.min(len, d + 1));
            const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + (rev ? 180 : 0);
            pk.setAttribute("transform", `translate(${a.x.toFixed(2)} ${a.y.toFixed(2)}) rotate(${ang.toFixed(1)})`);
            tr.style.strokeDashoffset = String(100 * (1 - state.v));
          },
          onComplete() {
            gsap.set(pk, { autoAlpha: 0 });
            if (!keep && rev) gsap.set(tr, { opacity: 0 });
          },
        });
      };
      const build = (variant) => {
        const rows = rowsFor(variant);
        fillRows(rows);
        const tl = gsap.timeline({
          paused: !(visible && !tabHidden),
          onComplete: () => {
            cycle += 1;
            current = build(VARIANTS[cycle % VARIANTS.length]);
            syncPlayState();
          },
        });
        // Authored in "choreography seconds"; played 1.4x (1.7x with a human approval) → ~10–12.5 s per cycle.
        tl.timeScale(variant.steps.some((x) => x.kind === "human") ? 1.7 : 1.4);
        const on = (c, at, d = 0.25) => tl.to(c.box, { stroke: C.boxOn, duration: d }, at).to(c.label, { fill: "#ffffff", duration: d }, at).to(c.dot, { fill: CY, duration: d }, at);
        const off = (c, at, d = 0.4) => tl.to(c.box, { stroke: C.boxRest, duration: d }, at).to(c.label, { fill: C.labelRest, duration: d }, at).to(c.dot, { fill: C.dotRest, x: 0, duration: d }, at);
        const fade = (id, at, d = 0.5) => tl.to(trail(id), { opacity: 0, duration: d }, at);
        let ri = 0;
        // append one trace line (cyan while it is the newest, then it settles)
        const logOn = (at) => {
          const e = rowEls[ri++];
          tl.to(e.g, { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }, at)
            .set([e.l, e.r, e.tick], { fill: CY }, at)
            .to([e.l, e.r], { fill: C.logRest, duration: 0.7 }, at + 0.5)
            .to(e.tick, { fill: "rgba(255,255,255,0.3)", duration: 0.7 }, at + 0.5);
          return e;
        };
        const logSet = (e, txt, at) => tl.call(() => (e.r.textContent = tr(txt)), null, at);
        const gateOn = (at, txt) => {
          tl.to(gate.box, { stroke: C.boxOn, duration: 0.2 }, at)
            .to(gate.head, { fill: "#ffffff", duration: 0.2 }, at)
            .set(gate.txt, { opacity: 1, fill: CY }, at)
            .call(() => (gate.txt.textContent = tr(txt)), null, at);
        };
        const gateOff = (at) => {
          tl.to(gate.box, { stroke: C.gateRest, duration: 0.4 }, at).to(gate.head, { fill: C.headRest, duration: 0.4 }, at).to(gate.txt, { opacity: 0, duration: 0.3 }, at);
        };
        const setIter = (n, at) => tl.call(() => (iter.textContent = `S0${n}`), null, at).to(iter, { opacity: 1, duration: 0.2 }, at);
        // ---- A · TASK enters the loop ---------------------------------------
        let t = 0.4;
        on(chips.task, t);
        tl.add(travel("task", packets[0], 0.8), t + 0.2);
        off(chips.task, t + 1.0);
        fade("task", t + 1.3);
        t += 1.0;
        variant.steps.forEach((s, i) => {
          const last = i === variant.steps.length - 1;
          const k = s.tool;
          const tool = chips[`t${k}`];
          // ---- B · PLAN ------------------------------------------------------
          setIter(i + 1, t);
          on(chips.plan, t);
          logOn(t + 0.1);
          off(chips.plan, t + 0.9);
          tl.add(travel("p2a", packets[0], 0.5), t + 0.5);
          fade("p2a", t + 1.2);
          t += 1.0;
          // ---- C · ACT → PERMISSIONS → TOOL ----------------------------------
          on(chips.act, t);
          const actRow = logOn(t + 0.1);
          logSet(actRow, "RUN", t + 0.1);
          if (s.kind === "deny") {
            // blocked at the gate: the packet bounces back, the agent observes the denial
            tl.add(travel("gate", packets[0], 0.5), t + 0.35);
            gateOn(t + 0.8, "DENY");
            logSet(actRow, "DENY", t + 0.8);
            tl.to(gate.txt, { fill: "#ffffff", duration: 0.3 }, t + 1.0);
            tl.add(travel("gate", packets[0], 0.45, { rev: true }), t + 1.2);
            off(chips.act, t + 1.5);
            gateOff(t + 1.9);
            t += 1.7;
          } else {
            if (s.kind === "human") {
              // sensitive step: the gate holds the call and routes it to a person
              tl.add(travel("gate", packets[0], 0.5), t + 0.35);
              gateOn(t + 0.8, "HOLD");
              logSet(actRow, "HOLD", t + 0.8);
              tl.to(trail("gate"), { opacity: 0, duration: 0.3 }, t + 1.0);
              tl.add(travel("toHuman", packets[1], 1.1), t + 1.0);
              off(chips.act, t + 1.1);
              const h = t + 2.1;
              tl.to(human.box, { stroke: C.boxOn, duration: 0.25 }, h)
                .to(human.icon, { stroke: CY, duration: 0.25 }, h)
                .to(human.label, { fill: "#ffffff", duration: 0.25 }, h)
                .to(human.dots, { opacity: 1, duration: 0.2, stagger: 0.18 }, h + 0.15)
                .to(human.dots, { opacity: 0.25, duration: 0.3, stagger: { each: 0.18, repeat: 1, yoyo: true } }, h + 0.55);
              const ap = h + 1.9;
              tl.to(human.dots, { opacity: 0, duration: 0.15 }, ap - 0.05)
                .to(human.check, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, ap)
                .call(() => (gate.txt.textContent = tr("ALLOW")), null, ap + 0.1);
              logSet(actRow, "OK", ap + 0.2);
              logOn(ap + 0.3); // HUMAN row
              tl.to(human.box, { stroke: C.boxDone, duration: 0.3 }, ap + 0.5)
                .to(human.icon, { stroke: "rgba(255,255,255,0.6)", duration: 0.6 }, ap + 0.9)
                .to(human.label, { fill: C.labelRest, duration: 0.6 }, ap + 0.9)
                .to(trail("toHuman"), { opacity: 0, duration: 0.4 }, ap + 0.3);
              // approved → the call continues to the tool
              tl.add(travel("fromHuman", packets[1], 0.8), ap + 0.7);
              const arrive = ap + 1.5;
              on(tool, arrive, 0.2);
              tl.to(tool.dot, { x: 3, duration: 0.3 }, arrive).to(tool.check, { strokeDashoffset: 0, duration: 0.3 }, arrive + 0.3);
              tl.to(tool.check, { opacity: 0, duration: 0.3 }, arrive + 1.0).set(tool.check, { strokeDashoffset: 1, opacity: 1 }, arrive + 1.3);
              off(tool, arrive + 1.1);
              tl.to(human.check, { opacity: 0, duration: 0.4 }, arrive + 0.2).set(human.check, { strokeDashoffset: 1, opacity: 1 }, arrive + 0.7);
              fade("fromHuman", arrive + 0.6);
              gateOff(arrive + 0.6);
              tl.add(travel(`back${k}`, packets[0], 0.9), arrive + 0.9);
              fade(`back${k}`, arrive + 2.0);
              t = arrive + 1.8;
            } else {
              tl.add(travel(`out${k}`, packets[0], 1.0), t + 0.35);
              gateOn(t + 0.75, "ALLOW");
              const arrive = t + 1.35;
              off(chips.act, t + 1.0);
              on(tool, arrive, 0.2);
              logSet(actRow, "OK", arrive);
              tl.to(tool.dot, { x: 3, duration: 0.3 }, arrive).to(tool.check, { strokeDashoffset: 0, duration: 0.3 }, arrive + 0.3);
              gateOff(arrive + 0.2);
              tl.to(tool.check, { opacity: 0, duration: 0.3 }, arrive + 0.85).set(tool.check, { strokeDashoffset: 1, opacity: 1 }, arrive + 1.15);
              off(tool, arrive + 0.95);
              tl.add(travel(`back${k}`, packets[0], 0.9), arrive + 0.6);
              fade(`out${k}`, arrive + 0.2);
              fade(`back${k}`, arrive + 1.7);
              t = arrive + 1.5;
            }
          }
          // ---- D · OBSERVE ---------------------------------------------------
          if (s.kind === "deny") tl.add(travel("a2o", packets[0], 0.6), t - 0.6); // denial is observed
          on(chips.obs, t - 0.1);
          tl.to(chips.obs.dot, { x: 3, duration: 0.3 }, t);
          fade("a2o", t + 0.6);
          tl.add(travel("o2v", packets[0], 0.5), t + 0.4);
          off(chips.obs, t + 0.7);
          t += 0.9;
          // ---- E · VERIFY ----------------------------------------------------
          on(chips.ver, t);
          logOn(t + 0.1);
          fade("o2v", t + 0.4);
          if (s.kind === "deny" || s.kind === "vfail") {
            // the check does not pass: a re-plan is needed, back to PLAN
            tl.to(chips.ver.dot, { fill: "#ffffff", duration: 0.2 }, t + 0.5);
            tl.add(travel("v2p", packets[0], 0.6), t + 0.8);
            off(chips.ver, t + 1.2);
            fade("v2p", t + 1.5);
            t += 1.3;
          } else if (!last) {
            tl.add(travel("v2p", packets[0], 0.6), t + 0.7);
            off(chips.ver, t + 1.1);
            fade("v2p", t + 1.4);
            t += 1.2;
          } else {
            tl.add(travel("v2r", packets[0], 0.6), t + 0.7);
            off(chips.ver, t + 1.1);
            t += 1.3;
          }
        });
        // The re-planned retry is the final step in deny/vfail cycles (steps[1]),
        // so every cycle ends here with RESULT.
        on(chips.result, t);
        tl.to(chips.result.check, { strokeDashoffset: 0, duration: 0.35 }, t + 0.3);
        logOn(t + 0.3);
        fade("v2r", t + 0.8);
        tl.to(iter, { opacity: 0, duration: 0.4 }, t + 0.9);
        // ---- smooth reset, then a beat of rest -------------------------------
        const r = t + 1.6;
        off(chips.result, r, 0.6);
        tl.to(chips.result.check, { opacity: 0, duration: 0.4 }, r)
          .set(chips.result.check, { strokeDashoffset: 1, opacity: 1 }, r + 0.45)
          .to(
            rowEls.map((e) => e.g),
            { opacity: 0, duration: 0.6, stagger: 0.04 },
            r
          )
          .to({}, { duration: 0.3 }, r + 0.7);
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
      const dots = $$("[data-m-dot]");
      const fills = $$("[data-m-fill]");
      const labels = $$("[data-m-label]");
      const chipsM = {};
      $$("[data-m-chip]").forEach((el) => (chipsM[el.dataset.mChip] = el));
      const ALL = Object.values(chipsM);
      const logEls = $$("[data-m-log]");
      const gateM = chipsM.gate;
      const fillLog = (rows) =>
        logEls.forEach((el, i) => {
          el.textContent = rows[i] ? tr(`${rows[i][0]}${rows[i][1] ? ` ${rows[i][1]}` : ""}`) : "";
        });
      const chipRest = { borderColor: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.68)", backgroundColor: "#0a0a0a" };
      const chipOnS = { borderColor: "rgba(103,232,249,0.85)", color: "#ffffff", backgroundColor: "rgba(103,232,249,0.08)" };
      const chipDone = { borderColor: "rgba(255,255,255,0.32)", color: "rgba(255,255,255,0.9)", backgroundColor: "#0a0a0a" };
      const rest = () => {
        gsap.set(ALL, chipRest);
        gsap.set(logEls, { opacity: 0, ...chipRest });
        gsap.set(fills, { scaleY: 0, transformOrigin: "50% 0%" });
        gsap.set(dots, { backgroundColor: "rgba(255,255,255,0.3)", scale: 1 });
        gsap.set(labels, { color: "rgba(255,255,255,0.62)" });
        if (gateM) gateM.textContent = tr("PERMISSIONS");
      };
      if (reduced) {
        const rows = rowsFor(VARIANTS[0]);
        fillLog(rows);
        gsap.set(ALL, chipDone);
        gsap.set(logEls, { opacity: 1, ...chipDone });
        logEls.forEach((el, i) => i >= rows.length && gsap.set(el, { opacity: 0 }));
        gsap.set(fills, { scaleY: 1, transformOrigin: "50% 0%" });
        gsap.set(dots, { backgroundColor: "rgba(255,255,255,0.7)" });
        return () => {};
      }
      const stageOn = (tl, i, at) => tl.to(dots[i], { backgroundColor: "rgba(103,232,249,0.95)", scale: 1.35, duration: 0.25 }, at).to(labels[i], { color: "#ffffff", duration: 0.25 }, at);
      const stageDone = (tl, i, at) => tl.to(dots[i], { backgroundColor: "rgba(255,255,255,0.62)", scale: 1, duration: 0.4 }, at).to(labels[i], { color: "rgba(255,255,255,0.62)", duration: 0.4 }, at);
      const on = (tl, el, at) => tl.to(el, { ...chipOnS, duration: 0.25 }, at);
      const done = (tl, el, at) => tl.to(el, { ...chipDone, duration: 0.4 }, at);
      const line = (tl, i, at) => tl.to(fills[i], { scaleY: 1, duration: 0.5, ease: "power1.inOut" }, at);
      const setText = (tl, el, txt, at) => tl.call(() => (el.textContent = tr(txt)), null, at);
      const build = (variant) => {
        const rows = rowsFor(variant);
        fillLog(rows);
        const tl = gsap.timeline({
          paused: !(visible && !tabHidden),
          onComplete: () => {
            cycle += 1;
            current = build(VARIANTS[cycle % VARIANTS.length]);
            syncPlayState();
          },
        });
        // Mobile list is authored at 1x (13-15 s); play it slightly faster to land at ~12 s.
        tl.timeScale(variant.steps.some((x) => x.kind === "human") ? 1.25 : 1.1);
        let ri = 0;
        const logLine = (at) => {
          const el = logEls[ri++];
          tl.to(el, { opacity: 1, ...chipOnS, duration: 0.25 }, at).to(el, { ...chipDone, duration: 0.5 }, at + 0.6);
        };
        let t = 0.4;
        stageOn(tl, 0, t);
        on(tl, chipsM.task, t + 0.1);
        done(tl, chipsM.task, t + 0.7);
        line(tl, 0, t + 0.8);
        stageDone(tl, 0, t + 1.2);
        t += 1.2;
        const loop = ["plan", "act", "obs", "ver"];
        variant.steps.forEach((s, i) => {
          const last = i === variant.steps.length - 1;
          const tool = chipsM[`t${s.tool}`];
          stageOn(tl, 1, t);
          on(tl, chipsM.plan, t + 0.1);
          logLine(t + 0.2);
          done(tl, chipsM.plan, t + 0.7);
          on(tl, chipsM.act, t + 0.8);
          logLine(t + 0.9);
          t += 1.5;
          // tools stage: gate decides
          stageOn(tl, 2, t);
          if (s.kind === "deny") {
            on(tl, gateM, t);
            setText(tl, gateM, "DENY", t);
            done(tl, gateM, t + 0.9);
            done(tl, chipsM.act, t + 0.9);
            t += 1.0;
          } else {
            on(tl, gateM, t);
            setText(tl, gateM, s.kind === "human" ? "HOLD" : "ALLOW", t);
            if (s.kind === "human") {
              on(tl, chipsM.human, t + 0.4);
              done(tl, chipsM.human, t + 2.0);
              setText(tl, gateM, "ALLOW", t + 2.0);
              logLine(t + 2.1);
              t += 2.1;
            }
            on(tl, tool, t + 0.5);
            done(tl, tool, t + 1.2);
            done(tl, gateM, t + 1.2);
            done(tl, chipsM.act, t + 1.2);
            t += 1.3;
          }
          done(tl, gateM, t);
          setText(tl, gateM, "PERMISSIONS", t + 0.5);
          stageDone(tl, 2, t);
          // observe + verify
          stageOn(tl, 1, t);
          on(tl, chipsM.obs, t + 0.1);
          done(tl, chipsM.obs, t + 0.6);
          on(tl, chipsM.ver, t + 0.7);
          logLine(t + 0.8);
          done(tl, chipsM.ver, t + 1.4);
          stageDone(tl, 1, t + 1.5);
          t += 1.5;
          if (!last) {
            // the next iteration re-lights the loop chips
            tl.to([chipsM.plan, chipsM.act, chipsM.obs, chipsM.ver, chipsM.gate, tool, chipsM.human], { ...chipRest, duration: 0.4 }, t);
          }
        });
        line(tl, 1, t);
        stageOn(tl, 3, t);
        stageDone(tl, 3, t + 0.5);
        stageOn(tl, 4, t + 0.3);
        on(tl, chipsM.result, t + 0.4);
        logLine(t + 0.5);
        done(tl, chipsM.result, t + 1.3);
        stageDone(tl, 4, t + 1.5);
        const r = t + 2.2;
        tl.to(ALL, { ...chipRest, duration: 0.6 }, r)
          .to(logEls, { opacity: 0, duration: 0.6 }, r)
          .to(fills, { scaleY: 0, duration: 0.6, ease: "power2.inOut" }, r)
          .to(dots, { backgroundColor: "rgba(255,255,255,0.3)", duration: 0.6 }, r)
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
  const paths = Object.entries(PATHS);
  const mobileRows = [
    ["TASK", [["TASK", "task"]]],
    ["LOOP", [["PLAN", "plan"], ["ACT", "act"], ["OBSERVE", "obs"], ["VERIFY", "ver"]]],
    ["TOOLS", [["PERMISSIONS", "gate"], ["API", "t0"], ["CRM", "t1"], ["DB", "t2"], ["MAIL", "t3"], ["HUMAN", "human"]]],
    ["LOG", null],
    ["RESULT", [["RESULT", "result"]]],
  ];
  const chipCls = "rounded-lg border border-white/14 bg-[#0a0a0a] px-3 py-2 font-mono text-[11px] tracking-[0.18em] text-white/70";
  return (
    <div ref={rootRef} className="ag-root rounded-xl border border-white/10 bg-black overflow-hidden">
      <style>{`
        .ag-hl{opacity:0;transition:opacity .25s ease;pointer-events:none}
        @media (hover:hover) and (pointer:fine){.ag-hit:hover .ag-hl{opacity:1}}
      `}</style>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-black/40">
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="ml-2 text-[10px] font-mono text-white/60 tracking-wider truncate">{caption}</span>
      </div>
      <p className="sr-only">{a11y}</p>
      {/* ---------- md+ : full canvas ---------- */}
      <svg
        viewBox="0 0 900 520"
        className="hidden md:block w-full h-auto"
        aria-hidden="true"
        focusable="false"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      >
        {/* section captions */}
        <text x="355" y="112" textAnchor="middle" fontSize="11" letterSpacing="4" fill="rgba(255,255,255,0.5)" style={{ fontFamily: MONO }}>
          {tr("AGENT LOOP")}
        </text>
        <text data-id="gateHead" x="562" y="112" textAnchor="middle" fontSize="11" letterSpacing="2" fill={C.headRest} style={{ fontFamily: MONO }}>
          {tr("PERMISSIONS")}
        </text>
        <text x={TX + 42} y="112" textAnchor="middle" fontSize="11" letterSpacing="3" fill={C.headRest} style={{ fontFamily: MONO }}>
          {tr("TOOLS")}
        </text>
        <text x="744" y="112" fontSize="11" letterSpacing="4" fill={C.headRest} style={{ fontFamily: MONO }}>
          {tr("LOG")}
        </text>
        {/* base lines */}
        {paths.map(([id, d]) => (
          <path key={`b-${id}`} data-path={id} d={d} fill="none" stroke={DASHED.has(id) ? "rgba(255,255,255,0.18)" : C.base} strokeWidth="1.2" strokeDasharray={DASHED.has(id) ? "4 5" : undefined} />
        ))}
        {paths.map(([id, d]) => (
          <path key={`t-${id}`} data-trail={id} d={d} pathLength="100" fill="none" stroke={CY} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="100" strokeDashoffset="100" opacity="0" />
        ))}
        {/* loop centre: current step counter */}
        <text data-id="iter" x="355" y="266" textAnchor="middle" fontSize="12" letterSpacing="4" fill={CY} opacity="0" style={{ fontFamily: MONO }}>
          S01
        </text>
        <Node id="task" x={10} y={250} w={120} label={tr("TASK")} />
        {Object.entries(NODES).map(([id, n]) => (
          <Node key={id} id={id} x={n.x} y={n.y} label={tr(n.label)} w={120} />
        ))}
        <Node id="result" x={190} y={450} w={140} label={tr("RESULT")} check />
        {/* permissions gate */}
        <g className="ag-hit">
          <rect data-id="gateBox" x="555" y="130" width="14" height="200" rx="3" fill="#0a0a0a" stroke={C.gateRest} />
          <rect className="ag-hl" x="555" y="130" width="14" height="200" rx="3" fill="none" stroke="rgba(255,255,255,0.6)" />
        </g>
        <text data-id="gateTxt" x="548" y="352" fontSize="11" letterSpacing="2" fill={CY} opacity="0" style={{ fontFamily: MONO }}>
          {tr("ALLOW")}
        </text>
        {/* tools */}
        {TOOLS.map((label, k) => (
          <Node key={label} id={`t${k}`} x={TX} y={TOOL_Y[k]} w={84} h={36} label={tr(label)} check />
        ))}
        {/* human approval (dashed) */}
        <g className="ag-hit">
          <rect data-id="humanBox" x="596" y="384" width="120" height="84" rx="12" fill="#0a0a0a" stroke={C.boxRest} strokeDasharray="4 4" />
          <circle data-id="humanIcon" cx="624" cy="414" r="7" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" />
          <path data-id="humanIcon" d="M610 436 c1.5 -11 8 -16 14 -16 s12.500 5 14 16" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" strokeLinecap="round" />
          <text data-id="humanLabel" x="650" y="419" fontSize="11" letterSpacing="2" fill={C.labelRest} style={{ fontFamily: MONO }}>
            {tr("HUMAN")}
          </text>
          {[646, 660, 674].map((cx) => (
            <circle key={cx} data-id="humanDot" cx={cx} cy="452" r="2.2" fill={CY} opacity="0" />
          ))}
          <path data-id="humanCheck" d="M652 451 l5 5 l10 -11" pathLength="1" fill="none" stroke={CY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset="1" />
          <rect className="ag-hl" x="596" y="384" width="120" height="84" rx="12" fill="none" stroke="rgba(255,255,255,0.6)" />
        </g>
        {/* LOG column */}
        <rect x="738" y="124" width="148" height="372" rx="10" fill="none" stroke="rgba(255,255,255,0.12)" />
        <path d="M738 144 H886" stroke="rgba(255,255,255,0.12)" />
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i} data-row={i} opacity="0">
            <rect className="lg-tick" x="748" y={ROW_Y(i) - 10} width="2" height="14" fill="rgba(255,255,255,0.3)" />
            <text className="lg-l" x="758" y={ROW_Y(i)} fontSize="11" letterSpacing="1.2" fill={C.logRest} style={{ fontFamily: MONO }} />
            <text className="lg-r" x="876" y={ROW_Y(i)} textAnchor="end" fontSize="11" letterSpacing="1.2" fill={C.logRest} style={{ fontFamily: MONO }} />
          </g>
        ))}
        {/* packets last, on top */}
        {[0, 1].map((i) => (
          <rect key={i} data-packet={i} x="-6" y="-2.5" width="12" height="5" rx="1.6" fill={CY} opacity="0" />
        ))}
      </svg>
      {/* ---------- < md : compact vertical flow (same cycle, simplified) ---------- */}
      <ol className="md:hidden px-5 py-6" aria-hidden="true">
        {mobileRows.map(([label, items], i) => (
          <li key={label} className="relative pl-6 pb-6 last:pb-0">
            {i < mobileRows.length - 1 && (
              <span className="absolute left-[3px] top-3 bottom-[-4px] w-px bg-white/15 overflow-hidden">
                <span data-m-fill className="block h-full w-full bg-cyan-300/70" />
              </span>
            )}
            <span data-m-dot className="absolute left-0 top-[6px] h-[7px] w-[7px] rounded-full bg-white/30" />
            <p data-m-label className="font-mono text-[11px] tracking-[0.3em] text-white/60 mb-2">
              {tr(label)}
            </p>
            <div className="flex flex-wrap gap-2">
              {items
                ? items.map(([text, key]) => (
                    <span key={key} data-m-chip={key} className={chipCls}>
                      {tr(text)}
                    </span>
                  ))
                : Array.from({ length: 8 }, (_, n) => <span key={n} data-m-log className={chipCls} style={{ opacity: 0, minHeight: 34 }} />)}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
export default AgentsVisual;
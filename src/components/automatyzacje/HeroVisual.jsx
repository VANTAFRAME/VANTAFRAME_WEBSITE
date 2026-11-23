import React, { useEffect, useRef } from "react";
import gsap from "gsap";
// Hero visual: an abstract pipeline — input → analysis → decision → action.
//
// Motion model: ONE master GSAP timeline per cycle, built from the logic of the
// process (a signal can only leave a module after it has arrived and been
// processed). Cycles are chained and differ deterministically:
//
//   cycle 0  inputs FORM→MAIL→API   rules → automatic → CRM
//   cycle 1  inputs MAIL→API→FORM   rules → automatic → TASK
//   cycle 2  inputs API→FORM→MAIL   rules → human review → approval → NOTIFICATION
//   cycle 3  inputs FORM→API→MAIL   rules → automatic → NOTIFICATION
//
// Nothing here re-renders React: the SVG is rendered once and the timeline
// writes straight to DOM attributes/styles. Data "packets" are small rects moved
// along the existing SVG paths with getPointAtLength() (no plugin needed).
// The timeline pauses off screen / in a hidden tab, is not created at all for
// prefers-reduced-motion, and is torn down (gsap.context + listeners) on unmount.
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const CY = "#67e8f9";
// Resting / active looks, kept in one place so the timeline and the static
// (reduced-motion) state agree.
const C = {
  boxRest: "rgba(255,255,255,0.14)",
  boxOn: "rgba(103,232,249,0.85)",
  labelRest: "rgba(255,255,255,0.72)",
  dotRest: "rgba(255,255,255,0.2)",
  moduleRest: "rgba(255,255,255,0.22)",
  moduleOn: "rgba(103,232,249,0.5)",
  moduleDone: "rgba(103,232,249,0.9)",
  rowRest: "rgba(255,255,255,0.6)",
  rowDone: "rgba(255,255,255,0.82)",
  stageRest: "rgba(255,255,255,0.34)",
  diamondRest: "rgba(255,255,255,0.3)",
  branchRest: "rgba(255,255,255,0.38)",
  humanRest: "rgba(255,255,255,0.2)",
};
const PATHS = {
  in0: "M180 170 H250",
  in1: "M180 250 H250",
  in2: "M180 330 H250",
  toDec: "M440 250 H522",
  crm: "M658 250 C 690 250 690 170 718 170",
  task: "M658 250 H718",
  notif: "M658 250 C 690 250 690 330 718 330",
  toHuman: "M590 318 V428",
  fromHuman: "M672 478 H700 V366 C 700 336 704 332 718 332",
};
const DASHED = new Set(["toHuman", "fromHuman"]);
// Deterministic cycle plan. `outcome` is the action module that ends up running.
const VARIANTS = [
  { inputs: [0, 1, 2], outcome: "crm", human: false },
  { inputs: [1, 2, 0], outcome: "task", human: false },
  { inputs: [2, 0, 1], outcome: "notif", human: true },
  { inputs: [0, 2, 1], outcome: "notif", human: false },
];
const OUT_INDEX = { crm: 0, task: 1, notif: 2 };
const Chip = ({ id, x, y, w = 150, h = 44, label, action = false }) => (
  <g data-chip={id} data-hover-key={id} style={{ cursor: "default" }}>
    <rect className="hv-chip-box" x={x} y={y} width={w} height={h} rx="10" fill="#0a0a0a" stroke={C.boxRest} />
    <circle className="hv-chip-dot" cx={x + 16} cy={y + h / 2} r="2.4" fill={C.dotRest} />
    <text className="hv-chip-label" x={x + w / 2 + 4} y={y + h / 2 + 4.5} textAnchor="middle" fontSize="12" letterSpacing="2.2" fill={C.labelRest} style={{ fontFamily: MONO }}>
      {label}
    </text>
    {action && (
      <path
        className="hv-check"
        d={`M${x + w - 28} ${y + h / 2} l3.6 3.6 l7 -7.6`}
        pathLength="1"
        fill="none"
        stroke={CY}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1"
        strokeDashoffset="1"
      />
    )}
  </g>
);
const rowY = (i) => 176 + i * 62;
const HeroVisual = ({ t }) => {
  const rootRef = useRef(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 48rem)");
    const $ = (sel) => root.querySelector(sel);
    const $$ = (sel) => Array.from(root.querySelectorAll(sel));
    let visible = false;
    let tabHidden = document.hidden;
    let current = null; // active cycle timeline
    let cycle = 0;
    let ctx = null;
    // ------------------------------------------------------------------ helpers
    const syncPlayState = () => {
      if (!current) return;
      if (visible && !tabHidden) current.play();
      else current.pause();
    };
    // ------------------------------------------------------------ desktop (SVG)
    const setupDesktop = () => {
      const chipOf = (id) => {
        const g = $(`[data-chip="${id}"]`);
        return {
          g,
          box: g.querySelector(".hv-chip-box"),
          label: g.querySelector(".hv-chip-label"),
          dot: g.querySelector(".hv-chip-dot"),
          check: g.querySelector(".hv-check"),
        };
      };
      const chips = {
        in0: chipOf("in0"),
        in1: chipOf("in1"),
        in2: chipOf("in2"),
        crm: chipOf("crm"),
        task: chipOf("task"),
        notif: chipOf("notif"),
      };
      const analysis = $('[data-id="analysis"]');
      const diamond = $('[data-id="diamond"]');
      const rules = $('[data-id="rules"]');
      const lblAuto = $('[data-id="lblAuto"]');
      const lblHuman = $('[data-id="lblHuman"]');
      const human = {
        box: $('[data-id="humanBox"]'),
        icon: $$('[data-id="humanIcon"]'),
        dots: $$('[data-id="humanDot"]'),
        check: $('[data-id="humanCheck"]'),
      };
      const stages = $$("[data-stage]");
      const bars = $$("[data-bar]");
      const rowLabels = $$("[data-row-label]");
      const ticks = $$("[data-tick]");
      const scan = $('[data-id="scan"]');
      const packets = $$("[data-packet]");
      const trail = (id) => $(`[data-trail="${id}"]`);
      const pathEl = (id) => $(`[data-path="${id}"]`);
      // Known starting state (also the state every cycle ends in).
      const rest = () => {
        gsap.set(bars, { scaleX: 0, opacity: 0.9, transformOrigin: "0% 50%" });
        gsap.set(ticks, { strokeDashoffset: 1, opacity: 1 });
        gsap.set(rowLabels, { fill: C.rowRest });
        gsap.set(stages, { fill: C.stageRest });
        gsap.set(analysis, { stroke: C.moduleRest });
        gsap.set(diamond, { stroke: C.diamondRest });
        gsap.set(rules, { fill: "rgba(255,255,255,0.78)" });
        gsap.set([lblAuto, lblHuman], { fill: C.branchRest });
        gsap.set(scan, { opacity: 0, y: 0 });
        gsap.set(packets, { autoAlpha: 0 });
        Object.keys(PATHS).forEach((id) => gsap.set(trail(id), { opacity: 0, strokeDashoffset: 100 }));
        Object.values(chips).forEach((c) => {
          gsap.set(c.box, { stroke: C.boxRest });
          gsap.set(c.label, { fill: C.labelRest });
          gsap.set(c.dot, { fill: C.dotRest, x: 0 });
          if (c.check) gsap.set(c.check, { strokeDashoffset: 1, opacity: 1 });
        });
        gsap.set(human.box, { stroke: C.humanRest });
        gsap.set(human.icon, { stroke: "rgba(255,255,255,0.6)" });
        gsap.set(human.dots, { opacity: 0 });
        gsap.set(human.check, { strokeDashoffset: 1, opacity: 1 });
      };
      if (reduced) {
        // Static, fully resolved frame: no timeline, no packets.
        rest();
        gsap.set(bars, { scaleX: 1 });
        gsap.set(ticks, { strokeDashoffset: 0 });
        return () => {};
      }
      // A small data packet travelling along one of the existing paths; the
      // matching cyan trail is drawn behind it.
      const travel = (id, pk, dur, ease = "power1.inOut") => {
        const p = pathEl(id);
        const tr = trail(id);
        const len = p.getTotalLength();
        const state = { v: 0 };
        return gsap.to(state, {
          v: 1,
          duration: dur,
          ease,
          onStart() {
            gsap.set(tr, { opacity: 1, strokeDashoffset: 100 });
            gsap.set(pk, { autoAlpha: 1 });
          },
          onUpdate() {
            const d = state.v * len;
            const a = p.getPointAtLength(d);
            const b = p.getPointAtLength(Math.min(len, d + 1));
            const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
            pk.setAttribute("transform", `translate(${a.x.toFixed(2)} ${a.y.toFixed(2)}) rotate(${ang.toFixed(1)})`);
            tr.style.strokeDashoffset = String(100 * (1 - state.v));
          },
          onComplete() {
            gsap.set(pk, { autoAlpha: 0 });
          },
        });
      };
      const chipOn = (tl, c, at, d = 0.25) => {
        tl.to(c.box, { stroke: C.boxOn, duration: d, ease: "power2.out" }, at)
          .to(c.label, { fill: "#ffffff", duration: d }, at)
          .to(c.dot, { fill: CY, duration: d }, at);
      };
      const chipOff = (tl, c, at, d = 0.4) => {
        tl.to(c.box, { stroke: C.boxRest, duration: d }, at)
          .to(c.label, { fill: C.labelRest, duration: d }, at)
          .to(c.dot, { fill: C.dotRest, x: 0, duration: d }, at);
      };
      const stageOn = (tl, i, at) => tl.to(stages[i], { fill: CY, duration: 0.3 }, at);
      const stageOff = (tl, i, at) => tl.to(stages[i], { fill: C.stageRest, duration: 0.5 }, at);
      const build = (variant) => {
        const tl = gsap.timeline({
          paused: !(visible && !tabHidden),
          onComplete: () => {
            cycle += 1;
            current = build(VARIANTS[cycle % VARIANTS.length]);
            syncPlayState();
          },
        });
        // Authored in "seconds of choreography"; played 1.2× so an automatic
        // cycle lasts ≈ 9.5 s and a cycle with human review ≈ 12 s.
        tl.timeScale(1.2);
        // ---- A · INPUT: three sources fire one after another (async) -------
        const fire = [0.3, 1.3, 2.3];
        stageOn(tl, 0, 0.2);
        variant.inputs.forEach((idx, k) => {
          const id = `in${idx}`;
          const at = fire[k];
          chipOn(tl, chips[id], at);
          tl.add(travel(id, packets[k], 0.7), at + 0.2);
          chipOff(tl, chips[id], at + 0.95);
          tl.to(trail(id), { opacity: 0, duration: 0.6 }, at + 1.7);
        });
        stageOff(tl, 0, 3.4);
        // ---- B · ANALYSIS: starts when the first packet lands ---------------
        const firstArrival = fire[0] + 0.9;
        stageOn(tl, 1, firstArrival);
        tl.to(analysis, { stroke: C.moduleOn, duration: 0.3 }, firstArrival)
          .to(scan, { opacity: 0.75, duration: 0.2 }, firstArrival)
          .fromTo(scan, { y: 0 }, { y: 150, duration: 4.4, ease: "none" }, firstArrival);
        const rows = [
          [firstArrival + 0.05, 1.7],
          [firstArrival + 1.85, 1.4],
          [firstArrival + 3.35, 1.15],
        ];
        rows.forEach(([at, d], i) => {
          tl.to(rowLabels[i], { fill: "#ffffff", duration: 0.25 }, at)
            .to(bars[i], { scaleX: 1, duration: d, ease: "power2.inOut" }, at)
            .to(ticks[i], { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, at + d)
            .to(rowLabels[i], { fill: C.rowDone, duration: 0.4 }, at + d);
        });
        const analysisDone = firstArrival + 3.35 + 1.15; // 5.4
        tl.to(scan, { opacity: 0, duration: 0.3 }, analysisDone)
          .to(analysis, { stroke: C.moduleDone, duration: 0.2 }, analysisDone + 0.1)
          .to(analysis, { stroke: C.moduleRest, duration: 0.7, ease: "power1.out" }, analysisDone + 0.35);
        stageOff(tl, 1, analysisDone + 0.7);
        // result → rules
        tl.add(travel("toDec", packets[0], 0.7), analysisDone + 0.35);
        tl.to(trail("toDec"), { opacity: 0, duration: 0.6 }, analysisDone + 1.4);
        // ---- C · DECISION --------------------------------------------------
        const decAt = analysisDone + 1.05; // 6.45
        stageOn(tl, 2, decAt);
        tl.to(diamond, { stroke: "rgba(103,232,249,0.95)", duration: 0.2, ease: "power2.out" }, decAt)
          .to(rules, { fill: "#ffffff", duration: 0.2 }, decAt)
          .to(diamond, { stroke: "rgba(103,232,249,0.45)", duration: 0.5 }, decAt + 0.25);
        const chooseAt = decAt + 0.55; // 7.0
        const branchLabel = variant.human ? lblHuman : lblAuto;
        tl.to(branchLabel, { fill: CY, duration: 0.25 }, chooseAt);
        const routeId = variant.human ? "toHuman" : variant.outcome;
        tl.add(travel(routeId, packets[1], variant.human ? 0.8 : 0.75), chooseAt + 0.15);
        let doneAt;
        const runAction = (key, at) => {
          const c = chips[key];
          stageOn(tl, 3, at);
          chipOn(tl, c, at, 0.2);
          tl.to(c.dot, { x: 3, duration: 0.3, ease: "power2.out" }, at)
            .to(c.check, { strokeDashoffset: 0, duration: 0.35, ease: "power2.out" }, at + 0.4);
          const offAt = at + 1.5;
          tl.to(c.check, { opacity: 0, duration: 0.3 }, offAt - 0.1)
            .set(c.check, { strokeDashoffset: 1, opacity: 1 }, offAt + 0.25);
          chipOff(tl, c, offAt);
          stageOff(tl, 3, offAt);
          return offAt + 0.45;
        };
        if (!variant.human) {
          // ---- D · ACTION (automatic path) -------------------------------
          const arrive = chooseAt + 0.15 + 0.75;
          doneAt = runAction(variant.outcome, arrive);
          tl.to(trail(variant.outcome), { opacity: 0, duration: 0.6 }, doneAt - 0.5);
          tl.to(diamond, { stroke: C.diamondRest, duration: 0.5 }, doneAt - 0.5)
            .to(lblAuto, { fill: C.branchRest, duration: 0.5 }, doneAt - 0.5);
        } else {
          // ---- E · HUMAN REVIEW ------------------------------------------
          const arriveH = chooseAt + 0.15 + 0.8; // 7.95
          tl.to(human.box, { stroke: C.boxOn, duration: 0.25 }, arriveH)
            .to(human.icon, { stroke: CY, duration: 0.25 }, arriveH)
            .to(human.dots, { opacity: 1, duration: 0.2, stagger: 0.18 }, arriveH + 0.15);
          // "waiting" — dots pulse in sequence (one dip each, ends before approval)
          tl.to(human.dots, { opacity: 0.25, duration: 0.3, stagger: { each: 0.18, repeat: 1, yoyo: true } }, arriveH + 0.5);
          const approveAt = arriveH + 1.6; // 9.55
          tl.to(human.dots, { opacity: 0, duration: 0.15 }, approveAt - 0.05)
            .to(human.check, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, approveAt)
            .to(human.box, { stroke: C.moduleDone, duration: 0.15 }, approveAt + 0.2)
            .to(human.box, { stroke: C.humanRest, duration: 0.7 }, approveAt + 0.55)
            .to(human.icon, { stroke: "rgba(255,255,255,0.6)", duration: 0.7 }, approveAt + 0.55)
            .to(trail("toHuman"), { opacity: 0, duration: 0.5 }, approveAt + 0.2);
          // approved → back onto the automatic route
          const returnAt = approveAt + 0.75; // 10.3
          tl.add(travel("fromHuman", packets[2], 0.9), returnAt);
          doneAt = runAction("notif", returnAt + 0.9);
          tl.to(trail("fromHuman"), { opacity: 0, duration: 0.6 }, doneAt - 0.5)
            .to(human.check, { opacity: 0, duration: 0.4 }, returnAt + 0.2)
            .set(human.check, { strokeDashoffset: 1, opacity: 1 }, returnAt + 0.7)
            .to(diamond, { stroke: C.diamondRest, duration: 0.5 }, doneAt - 0.5)
            .to(lblHuman, { fill: C.branchRest, duration: 0.5 }, doneAt - 0.5);
        }
        stageOff(tl, 2, decAt + 1.4);
        // ---- smooth reset, then a beat of rest before the next cycle -------
        const resetAt = doneAt + 0.05;
        tl.to(bars, { scaleX: 0, duration: 0.7, ease: "power2.inOut", stagger: 0.08 }, resetAt)
          .set(human.dots, { opacity: 0 }, resetAt)
          .to(ticks, { opacity: 0, duration: 0.4 }, resetAt)
          .set(ticks, { strokeDashoffset: 1, opacity: 1 }, resetAt + 0.45)
          .to(rowLabels, { fill: C.rowRest, duration: 0.6 }, resetAt)
          .to({}, { duration: 0.3 }, resetAt + 0.7); // idle tail
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
      const chipRest = { borderColor: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.7)", backgroundColor: "#0a0a0a" };
      const chipOnS = { borderColor: "rgba(103,232,249,0.85)", color: "#ffffff", backgroundColor: "rgba(103,232,249,0.08)" };
      const chipDone = { borderColor: "rgba(255,255,255,0.32)", color: "rgba(255,255,255,0.9)", backgroundColor: "#0a0a0a" };
      const rest = () => {
        gsap.set(ALL, chipRest);
        gsap.set(fills, { scaleY: 0, transformOrigin: "50% 0%" });
        gsap.set(dots, { backgroundColor: "rgba(255,255,255,0.3)", scale: 1 });
        gsap.set(labels, { color: "rgba(255,255,255,0.62)" });
      };
      if (reduced) {
        gsap.set(ALL, chipRest);
        gsap.set(fills, { scaleY: 1, transformOrigin: "50% 0%" });
        gsap.set(dots, { backgroundColor: "rgba(103,232,249,0.9)" });
        return () => {};
      }
      const stageOn = (tl, i, at) =>
        tl.to(dots[i], { backgroundColor: "rgba(103,232,249,0.95)", scale: 1.35, duration: 0.25 }, at)
          .to(labels[i], { color: "#ffffff", duration: 0.25 }, at);
      const stageDone = (tl, i, at) =>
        tl.to(dots[i], { backgroundColor: "rgba(255,255,255,0.62)", scale: 1, duration: 0.4 }, at)
          .to(labels[i], { color: "rgba(255,255,255,0.62)", duration: 0.4 }, at);
      const on = (tl, el, at) => tl.to(el, { ...chipOnS, duration: 0.25 }, at);
      const done = (tl, el, at) => tl.to(el, { ...chipDone, duration: 0.4 }, at);
      const line = (tl, i, at, d = 0.5) => tl.to(fills[i], { scaleY: 1, duration: d, ease: "power1.inOut" }, at);
      const build = (variant) => {
        const tl = gsap.timeline({
          paused: !(visible && !tabHidden),
          onComplete: () => {
            cycle += 1;
            current = build(VARIANTS[cycle % VARIANTS.length]);
            syncPlayState();
          },
        });
        // input
        stageOn(tl, 0, 0.2);
        variant.inputs.forEach((idx, k) => {
          const el = chipsM[`in${idx}`];
          on(tl, el, 0.3 + k * 0.7);
          done(tl, el, 0.3 + k * 0.7 + 0.6);
        });
        line(tl, 0, 2.5);
        stageDone(tl, 0, 3.0);
        // analysis
        stageOn(tl, 1, 3.0);
        [0, 1, 2].forEach((i) => {
          const el = chipsM[`an${i}`];
          on(tl, el, 3.1 + i * 0.8);
          done(tl, el, 3.1 + i * 0.8 + 0.7);
        });
        line(tl, 1, 5.6);
        stageDone(tl, 1, 6.1);
        // decision
        stageOn(tl, 2, 6.1);
        let t2 = 6.3;
        if (variant.human) {
          on(tl, chipsM.human, t2);
          done(tl, chipsM.human, t2 + 1.3);
          t2 += 1.4;
        } else {
          on(tl, chipsM.auto, t2);
          done(tl, chipsM.auto, t2 + 0.7);
          t2 += 0.8;
        }
        line(tl, 2, t2);
        stageDone(tl, 2, t2 + 0.5);
        // action
        const at = t2 + 0.5;
        stageOn(tl, 3, at);
        const act = chipsM[variant.outcome];
        on(tl, act, at + 0.2);
        done(tl, act, at + 1.6);
        stageDone(tl, 3, at + 1.8);
        // reset
        const r = at + 2.0;
        tl.to(ALL, { ...chipRest, duration: 0.6 }, r)
          .to(fills, { scaleY: 0, duration: 0.6, ease: "power2.inOut" }, r)
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
    let teardown = () => {};
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
    // Pointer parallax (single CSS variable per animation frame, fine pointers only).
    let raf = 0;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = root.getBoundingClientRect();
        root.style.setProperty("--hv-mx", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
        root.style.setProperty("--hv-my", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
      });
    };
    // Hover: purely additive highlight overlays (`.hv-hl`), never touches the timeline.
    let hovered = null;
    const setHover = (key) => {
      if (key === hovered) return;
      $$(".hv-hl.is-hl").forEach((el) => el.classList.remove("is-hl"));
      hovered = key;
      if (key) $$(`.hv-hl[data-for~="${key}"]`).forEach((el) => el.classList.add("is-hl"));
    };
    const onOver = (e) => {
      const target = e.target instanceof Element ? e.target.closest("[data-hover-key]") : null;
      setHover(target ? target.dataset.hoverKey : null);
    };
    const onLeave = () => setHover(null);
    if (canHover && !reduced) root.addEventListener("pointermove", onMove, { passive: true });
    if (canHover) {
      root.addEventListener("pointerover", onOver);
      root.addEventListener("pointerleave", onLeave);
    }
    return () => {
      wide.removeEventListener("change", onBreakpoint);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerover", onOver);
      root.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      teardown();
      ctx?.revert();
      current = null;
    };
  }, []);
  const stageX = [105, 345, 590, 795];
  const paths = Object.entries(PATHS);
  return (
    <div ref={rootRef} className="hv-root rounded-xl border border-white/10 bg-black overflow-hidden">
      <style>{`
        .hv-layer{transform:translate3d(calc(var(--hv-mx,0) * 6px),calc(var(--hv-my,0) * 4px),0);transition:transform .35s ease-out}
        .hv-hl{opacity:0;transition:opacity .25s ease;pointer-events:none}
        .hv-hl.is-hl{opacity:1}
        @media (prefers-reduced-motion: reduce){.hv-layer{transform:none;transition:none}}
      `}</style>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-black/40">
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="ml-2 text-[9px] font-mono text-white/30 tracking-wider truncate">{t.windowLabel}</span>
      </div>
      {/* Text equivalent for assistive tech and crawlers. */}
      <p className="sr-only">{t.a11y}</p>
      {/* ---------- md+ : full canvas ---------- */}
      <svg
        viewBox="0 0 900 600"
        className="hidden md:block w-full h-auto"
        fontFamily="Outfit, sans-serif"
        aria-hidden="true"
        focusable="false"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <defs>
          <linearGradient id="hvTail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={CY} stopOpacity="0" />
            <stop offset="1" stopColor={CY} stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <g className="hv-layer">
          {t.stages.map((label, i) => (
            <text
              key={label}
              data-stage={i}
              x={stageX[i]}
              y="62"
              textAnchor="middle"
              fontSize="11"
              letterSpacing="4"
              fill={C.stageRest}
              style={{ fontFamily: MONO }}
            >
              {label}
            </text>
          ))}
          {/* base lines */}
          {paths.map(([id, d]) => (
            <path key={`b-${id}`} data-path={id} d={d} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" strokeDasharray={DASHED.has(id) ? "4 5" : undefined} />
          ))}
          {/* hover highlights (additive, hidden by default) */}
          {[
            ["in0", "in0"],
            ["in1", "in1"],
            ["in2", "in2"],
            ["crm", "crm decision"],
            ["task", "task decision"],
            ["notif", "notif decision"],
            ["toHuman", "decision"],
            ["fromHuman", "notif decision"],
          ].map(([id, keys]) => (
            <path key={`h-${id}`} className="hv-hl" data-for={keys} d={PATHS[id]} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.6" strokeDasharray={DASHED.has(id) ? "4 5" : undefined} />
          ))}
          {/* travelling trails (drawn behind the packet by the timeline) */}
          {paths.map(([id, d]) => (
            <path
              key={`t-${id}`}
              data-trail={id}
              d={d}
              pathLength="100"
              fill="none"
              stroke={CY}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset="100"
              opacity="0"
            />
          ))}
          {/* inputs */}
          {t.inputs.map((label, i) => (
            <Chip key={label} id={`in${i}`} x={30} y={148 + i * 80} label={label} />
          ))}
          {/* analysis module */}
          <g data-hover-key="analysis" style={{ cursor: "default" }}>
            <rect data-id="analysis" x="250" y="120" width="190" height="260" rx="16" fill="#0a0a0a" stroke={C.moduleRest} />
            <rect className="hv-hl" data-for="analysis" x="250" y="120" width="190" height="260" rx="16" fill="none" stroke="rgba(255,255,255,0.6)" />
            {t.analysis.map((label, i) => (
              <g key={label}>
                <text data-row-label={i} x="270" y={rowY(i)} fontSize="10.5" letterSpacing="2.6" fill={C.rowRest} style={{ fontFamily: MONO }}>
                  {label}
                </text>
                <rect x="270" y={rowY(i) + 12} width="150" height="3" rx="1.5" fill="rgba(255,255,255,0.1)" />
                <rect className="hv-hl" data-for="analysis" x="270" y={rowY(i) + 12} width="150" height="3" rx="1.5" fill="rgba(255,255,255,0.62)" />
                <rect data-bar={i} x="270" y={rowY(i) + 12} width="150" height="3" rx="1.5" fill={CY} opacity="0" />
                <path
                  data-tick={i}
                  d={`M406 ${rowY(i) - 4} l3.4 3.4 l6.6 -7.2`}
                  pathLength="1"
                  fill="none"
                  stroke={CY}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                />
              </g>
            ))}
            <rect data-id="scan" x="270" y="170" width="150" height="1" fill={CY} opacity="0" />
          </g>
          {/* decision node */}
          <g data-hover-key="decision" style={{ cursor: "default" }}>
            <path data-id="diamond" d="M590 190 L658 250 L590 318 L522 250 Z" fill="#0a0a0a" stroke={C.diamondRest} strokeWidth="1.2" />
            <path className="hv-hl" data-for="decision" d="M590 190 L658 250 L590 318 L522 250 Z" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
            <text data-id="rules" x="590" y="254" textAnchor="middle" fontSize="11" letterSpacing="3" fill="rgba(255,255,255,0.78)" style={{ fontFamily: MONO }}>
              {t.decisionTitle}
            </text>
          </g>
          <text data-id="lblAuto" x="672" y="226" fontSize="9.5" letterSpacing="2.4" fill={C.branchRest} style={{ fontFamily: MONO }}>
            {t.decisionOk}
          </text>
          <text data-id="lblHuman" x="604" y="372" fontSize="9.5" letterSpacing="2.4" fill={C.branchRest} style={{ fontFamily: MONO }}>
            {t.decisionReview}
          </text>
          {/* human review (dashed) */}
          <g>
            <rect data-id="humanBox" x="518" y="428" width="154" height="100" rx="14" fill="#0a0a0a" stroke={C.humanRest} strokeDasharray="4 4" />
            <circle data-id="humanIcon" cx="595" cy="462" r="9" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" />
            <path data-id="humanIcon" d="M577 504 c2 -14 10 -20 18 -20 s16 6 18 20" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" strokeLinecap="round" />
            {[581, 595, 609].map((cx) => (
              <circle key={cx} data-id="humanDot" cx={cx} cy="516" r="2" fill={CY} opacity="0" />
            ))}
            <path
              data-id="humanCheck"
              d="M588 515 l5 5 l10 -11"
              pathLength="1"
              fill="none"
              stroke={CY}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1"
              strokeDashoffset="1"
            />
          </g>
          {/* actions */}
          {t.actions.map((label, i) => (
            <Chip key={label} id={["crm", "task", "notif"][i]} x={718} y={148 + i * 80} w={160} label={label} action />
          ))}
          {/* data packets (small, precise) — placed last so they sit on top */}
          {[0, 1, 2].map((i) => (
            <g key={i} data-packet={i} opacity="0">
              <rect x="-24" y="-1.5" width="18" height="3" rx="1.5" fill="url(#hvTail)" />
              <rect x="-6" y="-2.5" width="12" height="5" rx="1.6" fill={CY} />
            </g>
          ))}
        </g>
      </svg>
      {/* ---------- < md : compact vertical flow (same cycle, simplified) ---------- */}
      <ol className="md:hidden px-5 py-6">
        {t.stages.map((label, i) => {
          const items =
            i === 0
              ? t.inputs.map((x, k) => [x, `in${k}`])
              : i === 1
                ? t.analysis.map((x, k) => [x, `an${k}`])
                : i === 2
                  ? [
                      [t.decisionOk, "auto"],
                      [t.decisionReview, "human"],
                    ]
                  : t.actions.map((x, k) => [x, ["crm", "task", "notif"][k]]);
          return (
            <li key={label} data-m-stage={i} className="relative pl-6 pb-6 last:pb-0">
              {i < t.stages.length - 1 && (
                <span className="absolute left-[3px] top-3 bottom-[-4px] w-px bg-white/15 overflow-hidden">
                  <span data-m-fill className="block h-full w-full bg-cyan-300/70" />
                </span>
              )}
              <span data-m-dot className="absolute left-0 top-[6px] h-[7px] w-[7px] rounded-full bg-white/30" />
              <p data-m-label className="font-mono text-[10px] tracking-[0.3em] text-white/60 mb-2">
                {label}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map(([text, key]) => (
                  <span
                    key={key}
                    data-m-chip={key}
                    className="rounded-lg border border-white/14 bg-[#0a0a0a] px-3 py-2 font-mono text-[10.5px] tracking-[0.18em] text-white/70"
                  >
                    {text}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
export default HeroVisual;
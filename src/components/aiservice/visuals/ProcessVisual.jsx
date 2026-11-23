import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { translate } from "./translate";
// ProcessVisual — "deterministic workflow".
//
// An event arrives (TRIGGER). A CONDITION diamond evaluates its rules in order
// (R1, R2, R3) and routes to the matching ACTION lanes (CRM, NOTIFY, DOC) which
// converge on RESULT. An EXCEPTION branch (ERR → RETRY → QUEUE for a person)
// appears in one cycle. A dashed AI (OPTIONAL) node stays dim unless a rule
// actually needs it: most of the process is plain, deterministic automation.
//
//   cycle 0  FORM     R1+R2 match → CRM and NOTIFY run in parallel → RESULT
//   cycle 1  MAIL     R2+R3 match → NOTIFY and DOC run (AI stays dim) → RESULT
//   cycle 2  WEBHOOK  R1+R2 match → CRM fails: ERR → RETRY ×2 → QUEUE for a person;
//                     NOTIFY completes → RESULT
//   cycle 3  CRON     only R3 matches → routed through the AI node (OPTIONAL lights up) → DOC → RESULT
//
// ONE master GSAP timeline per cycle, chained and deterministic. Nothing
// re-renders React: the timeline writes straight to DOM attributes/styles
// (transform / opacity / stroke only). Packets are small rects moved along real
// paths with getPointAtLength. No timeline under prefers-reduced-motion.
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const CY = "#67e8f9";
const C = {
  boxRest: "rgba(255,255,255,0.16)",
  boxOn: "rgba(103,232,249,0.9)",
  boxDone: "rgba(255,255,255,0.34)",
  labelRest: "rgba(255,255,255,0.74)",
  labelDim: "rgba(255,255,255,0.56)",
  dotRest: "rgba(255,255,255,0.24)",
  diamondRest: "rgba(255,255,255,0.3)",
  ruleRest: "rgba(255,255,255,0.6)",
  base: "#232323",
};
const LANE_Y = { crm: 154, not: 274, doc: 394 };
const LX = 490;
const LW = 150;
const PATHS = {
  ev: "M0 274 H60",
  t2c: "M190 274 H240",
  c_crm: "M380 274 C 430 274 430 154 490 154",
  c_not: "M380 274 H490",
  c_doc: "M380 274 C 430 274 430 394 490 394",
  c_ai: "M310 334 V420",
  ai_doc: "M390 443 H430 C 460 443 460 394 490 394",
  r_crm: "M640 154 C 690 154 690 274 730 274",
  r_not: "M640 274 H730",
  r_doc: "M640 394 C 690 394 690 274 730 274",
  toErr: "M555 130 V82",
  errBack: "M577 82 V130",
  toQ: "M631 60 H680",
};
const DASHED = new Set(["toErr", "errBack", "toQ", "c_ai", "ai_doc"]);
// rules: indexes of matching rules (0=R1→CRM, 1=R2→NOTIFY, 2=R3→DOC)
const VARIANTS = [
  { event: "FORM", rules: [0, 1], crmFail: false, ai: false },
  { event: "MAIL", rules: [1, 2], crmFail: false, ai: false },
  { event: "WEBHOOK", rules: [0, 1], crmFail: true, ai: false },
  { event: "CRON", rules: [2], crmFail: false, ai: true },
];
const LANES = ["crm", "not", "doc"];
const RULE_LABELS = [
  { t: "R1", x: 402, y: 214 },
  { t: "R2", x: 404, y: 260 },
  { t: "R3", x: 402, y: 338 },
];
const Node = ({ id, x, y, w = 130, h = 48, label, check = false, dashed = false, dim = false, children }) => (
  <g data-chip={id} className="pv-hit">
    <rect className="pv-box" x={x} y={y} width={w} height={h} rx="10" fill="#0a0a0a" stroke={C.boxRest} strokeDasharray={dashed ? "4 4" : undefined} />
    <circle className="pv-dot" cx={x + 16} cy={y + h / 2} r="2.4" fill={C.dotRest} />
    <text className="pv-label" data-dim={dim ? "1" : undefined} x={x + 32} y={y + h / 2 + 4.5} fontSize="12" letterSpacing="2.4" fill={dim ? C.labelDim : C.labelRest} style={{ fontFamily: MONO }}>
      {label}
    </text>
    {check && (
      <path className="pv-check" d={`M${x + w - 28} ${y + h / 2} l3.4 3.4 l6.6 -7.2`} pathLength="1" fill="none" stroke={CY} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset="1" />
    )}
    {children}
    <rect className="pv-hl" x={x} y={y} width={w} height={h} rx="10" fill="none" stroke="rgba(255,255,255,0.6)" strokeDasharray={dashed ? "4 4" : undefined} />
  </g>
);
const ProcessVisual = ({ caption = "", a11y = "", labels = {} }) => {
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
        return {
          box: g.querySelector(".pv-box"),
          label: g.querySelector(".pv-label"),
          dot: g.querySelector(".pv-dot"),
          check: g.querySelector(".pv-check"),
          dim: g.querySelector(".pv-label").dataset.dim === "1",
        };
      };
      const chips = {};
      ["trig", "crm", "not", "doc", "result", "ai", "retry", "queue"].forEach((id) => (chips[id] = chipOf(id)));
      const diamond = $('[data-id="diamond"]');
      const ifTxt = $('[data-id="if"]');
      const rules = $$("[data-rule]");
      const evTag = $('[data-id="evTag"]');
      const errTxt = $('[data-id="errTxt"]');
      const aiTag = $('[data-id="aiTag"]');
      const aiScan = $('[data-id="aiScan"]');
      const retryDots = $$('[data-id="retryDot"]');
      const qIcon = $$('[data-id="qIcon"]');
      const qDots = $$('[data-id="qDot"]');
      const packets = $$("[data-packet]");
      const pathEl = (id) => $(`[data-path="${id}"]`);
      const trail = (id) => $(`[data-trail="${id}"]`);
      const restChip = (c) => {
        gsap.set(c.box, { stroke: C.boxRest });
        gsap.set(c.label, { fill: c.dim ? C.labelDim : C.labelRest });
        gsap.set(c.dot, { fill: C.dotRest, x: 0 });
        if (c.check) gsap.set(c.check, { strokeDashoffset: 1, opacity: 1, stroke: CY });
      };
      const rest = () => {
        Object.values(chips).forEach(restChip);
        gsap.set(diamond, { stroke: C.diamondRest });
        gsap.set(ifTxt, { fill: C.ruleRest });
        gsap.set(rules, { fill: C.ruleRest });
        gsap.set([evTag, errTxt], { opacity: 0 });
        gsap.set(aiTag, { fill: C.labelDim });
        gsap.set(aiScan, { opacity: 0, y: 0 });
        gsap.set(retryDots, { fill: "rgba(255,255,255,0.2)" });
        gsap.set(qIcon, { stroke: "rgba(255,255,255,0.6)" });
        gsap.set(qDots, { opacity: 0 });
        gsap.set(packets, { autoAlpha: 0 });
        Object.keys(PATHS).forEach((id) => gsap.set(trail(id), { opacity: 0, strokeDashoffset: 100 }));
      };
      if (reduced) {
        // Static, fully resolved frame: a finished run (R1+R2 → CRM, NOTIFY → RESULT).
        rest();
        ["trig", "crm", "not", "result"].forEach((id) => {
          gsap.set(chips[id].box, { stroke: C.boxDone });
          gsap.set(chips[id].label, { fill: "rgba(255,255,255,0.9)" });
          if (chips[id].check) gsap.set(chips[id].check, { strokeDashoffset: 0, stroke: "rgba(255,255,255,0.8)" });
        });
        gsap.set(diamond, { stroke: C.boxDone });
        gsap.set([rules[0], rules[1]], { fill: "rgba(255,255,255,0.95)" });
        gsap.set(evTag, { opacity: 1 });
        ["c_crm", "c_not", "r_crm", "r_not", "t2c", "ev"].forEach((id) => gsap.set(trail(id), { opacity: 1, strokeDashoffset: 0, stroke: "rgba(255,255,255,0.4)" }));
        return () => {};
      }
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
      const build = (variant) => {
        const tl = gsap.timeline({
          paused: !(visible && !tabHidden),
          onComplete: () => {
            cycle += 1;
            current = build(VARIANTS[cycle % VARIANTS.length]);
            syncPlayState();
          },
        });
        evTag.textContent = tr(variant.event);
        const on = (c, at, d = 0.25) => tl.to(c.box, { stroke: C.boxOn, duration: d }, at).to(c.label, { fill: "#ffffff", duration: d }, at).to(c.dot, { fill: CY, duration: d }, at);
        const off = (c, at, d = 0.4) => tl.to(c.box, { stroke: C.boxRest, duration: d }, at).to(c.label, { fill: c.dim ? C.labelDim : C.labelRest, duration: d }, at).to(c.dot, { fill: C.dotRest, x: 0, duration: d }, at);
        const fade = (id, at, d = 0.5) => tl.to(trail(id), { opacity: 0, duration: d }, at);
        const check = (c, at) => tl.to(c.dot, { x: 3, duration: 0.3 }, at).to(c.check, { strokeDashoffset: 0, duration: 0.35, ease: "power2.out" }, at + 0.3);
        // ---- A · TRIGGER: an event arrives -----------------------------------
        let t = 0.5;
        tl.to(evTag, { opacity: 1, duration: 0.3 }, t);
        tl.add(travel("ev", packets[0], 0.8), t + 0.1);
        on(chips.trig, t + 0.9);
        tl.add(travel("t2c", packets[0], 0.6), t + 1.6);
        off(chips.trig, t + 1.7);
        fade("ev", t + 1.4);
        // ---- B · CONDITION: rules are evaluated in order, matches light up ----
        t += 2.2;
        tl.to(diamond, { stroke: "rgba(103,232,249,0.95)", duration: 0.2 }, t).to(ifTxt, { fill: "#ffffff", duration: 0.2 }, t);
        const last = Math.max(...variant.rules);
        for (let r = 0; r <= last; r += 1) {
          const at = t + 0.3 + r * 0.45;
          if (variant.rules.includes(r)) tl.to(rules[r], { fill: CY, duration: 0.2 }, at);
          else tl.to(rules[r], { fill: "#ffffff", duration: 0.15 }, at).to(rules[r], { fill: C.ruleRest, duration: 0.3 }, at + 0.25);
        }
        const route = t + 0.3 + (last + 1) * 0.45 + 0.2;
        tl.to(diamond, { stroke: "rgba(103,232,249,0.45)", duration: 0.4 }, route);
        fade("t2c", t + 0.3);
        // ---- C · ACTIONS --------------------------------------------------------
        const resultDone = [];
        let queueEnd = 0;
        const lane = (rule, at, extra = {}) => {
          const key = LANES[rule];
          const c = chips[key];
          const via = extra.viaAi ? "ai_doc" : `c_${key}`;
          const out = `r_${key}`;
          let arrive;
          if (extra.viaAi) {
            // the only place AI is used: it processes the content, then DOC runs
            tl.add(travel("c_ai", packets[rule], 0.8), at);
            const a = at + 0.8;
            on(chips.ai, a);
            tl.to(aiTag, { fill: "#ffffff", duration: 0.25 }, a)
              .to(aiScan, { opacity: 0.8, duration: 0.2 }, a)
              .fromTo(aiScan, { y: 0 }, { y: 28, duration: 1.1, ease: "none", immediateRender: false }, a)
              .to(aiScan, { opacity: 0, duration: 0.2 }, a + 1.1)
              .to(chips.ai.dot, { x: 3, duration: 0.3 }, a);
            off(chips.ai, a + 1.4);
            tl.to(aiTag, { fill: C.labelDim, duration: 0.5 }, a + 1.4);
            fade("c_ai", a + 1.0);
            tl.add(travel("ai_doc", packets[rule], 0.8), a + 1.3);
            arrive = a + 2.1;
          } else {
            tl.add(travel(via, packets[rule], 0.85), at);
            arrive = at + 0.85;
          }
          on(c, arrive, 0.2);
          if (rule === 0 && variant.crmFail) {
            // CRM write fails → ERR → RETRY (twice) → QUEUE for a person
            tl.to(c.box, { stroke: "rgba(255,255,255,0.95)", duration: 0.2 }, arrive + 0.35)
              .to(c.dot, { fill: "#ffffff", duration: 0.2 }, arrive + 0.35)
              .to(errTxt, { opacity: 1, duration: 0.25 }, arrive + 0.35);
            tl.add(travel("toErr", packets[2], 0.6), arrive + 0.6);
            const rt = arrive + 1.2;
            on(chips.retry, rt);
            tl.to(retryDots[0], { fill: CY, duration: 0.2 }, rt + 0.2);
            tl.add(travel("errBack", packets[2], 0.55), rt + 0.6);
            tl.to(c.box, { stroke: C.boxOn, duration: 0.15 }, rt + 1.1).to(c.box, { stroke: "rgba(255,255,255,0.95)", duration: 0.2 }, rt + 1.35);
            tl.add(travel("toErr", packets[2], 0.55), rt + 1.55);
            tl.to(retryDots[1], { fill: CY, duration: 0.2 }, rt + 2.1);
            fade("toErr", rt + 2.2).to(retryDots, { fill: "#ffffff", duration: 0.2 }, rt + 2.3);
            tl.add(travel("toQ", packets[2], 0.6), rt + 2.4);
            off(chips.retry, rt + 2.9);
            const q = rt + 3.0;
            tl.to(chips.queue.box, { stroke: C.boxOn, duration: 0.25 }, q)
              .to(chips.queue.label, { fill: "#ffffff", duration: 0.25 }, q)
              .to(qIcon, { stroke: CY, duration: 0.25 }, q)
              .to(qDots, { opacity: 1, duration: 0.2, stagger: 0.18 }, q + 0.15)
              .to(qDots, { opacity: 0.25, duration: 0.3, stagger: { each: 0.18, repeat: 1, yoyo: true } }, q + 0.55);
            tl.to(c.box, { stroke: C.boxRest, duration: 0.5 }, q).to(c.dot, { fill: C.dotRest, duration: 0.5 }, q).to(c.label, { fill: C.labelRest, duration: 0.5 }, q).to(errTxt, { opacity: 0, duration: 0.5 }, q);
            fade("errBack", q);
            fade("toQ", q + 0.6);
            queueEnd = q + 1.5;
            return;
          }
          check(c, arrive);
          fade(via, arrive + 0.2);
          const leave = arrive + 0.9;
          tl.add(travel(out, packets[rule], 0.8), leave);
          off(c, leave + 0.2);
          tl.to(c.check, { opacity: 0, duration: 0.3 }, leave + 0.5).set(c.check, { strokeDashoffset: 1, opacity: 1 }, leave + 0.9);
          resultDone.push(leave + 0.8);
          fade(out, leave + 1.6);
        };
        variant.rules.forEach((r, i) => {
          const at = route + i * 0.25;
          lane(r, at, { viaAi: variant.ai && r === 2 });
        });
        // ---- D · RESULT: lights on the first arrival, completes on the last -----
        const arrivals = resultDone.slice().sort((a, b) => a - b);
        on(chips.result, arrivals[0], 0.2);
        const doneAt = arrivals[arrivals.length - 1] + 0.1;
        check(chips.result, doneAt);
        // with a failed CRM lane the queue stays open a little longer, then everything resets
        const hold = Math.max(doneAt + 1.2, queueEnd + 0.4);
        tl.to(chips.result.check, { opacity: 0, duration: 0.4 }, hold).set(chips.result.check, { strokeDashoffset: 1, opacity: 1 }, hold + 0.45);
        off(chips.result, hold, 0.6);
        // ---- smooth reset, then a beat of rest ------------------------------
        tl.to(ifTxt, { fill: C.ruleRest, duration: 0.5 }, hold)
          .to(diamond, { stroke: C.diamondRest, duration: 0.6 }, hold)
          .to(rules, { fill: C.ruleRest, duration: 0.6 }, hold)
          .to(evTag, { opacity: 0, duration: 0.5 }, hold)
          .to(errTxt, { opacity: 0, duration: 0.4 }, hold);
        if (variant.crmFail) {
          tl.to(chips.queue.box, { stroke: C.boxRest, duration: 0.7 }, hold)
            .to(chips.queue.label, { fill: C.labelRest, duration: 0.7 }, hold)
            .to(qIcon, { stroke: "rgba(255,255,255,0.6)", duration: 0.7 }, hold)
            .to(qDots, { opacity: 0, duration: 0.4 }, hold)
            .to(retryDots, { fill: "rgba(255,255,255,0.2)", duration: 0.5 }, hold);
        }
        tl.to({}, { duration: 0.3 }, hold + 0.8);
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
      const DIM = ALL.filter((el) => el.dataset.mDim);
      const chipRest = { borderColor: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.68)", backgroundColor: "#0a0a0a" };
      const chipDimRest = { borderColor: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.56)", backgroundColor: "#0a0a0a" };
      const chipOnS = { borderColor: "rgba(103,232,249,0.85)", color: "#ffffff", backgroundColor: "rgba(103,232,249,0.08)" };
      const chipDone = { borderColor: "rgba(255,255,255,0.32)", color: "rgba(255,255,255,0.9)", backgroundColor: "#0a0a0a" };
      const chipErr = { borderColor: "rgba(255,255,255,0.8)", color: "#ffffff", backgroundColor: "#0a0a0a" };
      const rest = () => {
        gsap.set(ALL, chipRest);
        gsap.set(DIM, chipDimRest);
        gsap.set(fills, { scaleY: 0, transformOrigin: "50% 0%" });
        gsap.set(dots, { backgroundColor: "rgba(255,255,255,0.3)", scale: 1 });
        gsap.set(labels, { color: "rgba(255,255,255,0.62)" });
      };
      if (reduced) {
        rest();
        ["trig", "r0", "r1", "crm", "not", "result"].forEach((k) => gsap.set(chipsM[k], chipDone));
        gsap.set(fills, { scaleY: 1, transformOrigin: "50% 0%" });
        gsap.set(dots, { backgroundColor: "rgba(255,255,255,0.7)" });
        return () => {};
      }
      const stageOn = (tl, i, at) => tl.to(dots[i], { backgroundColor: "rgba(103,232,249,0.95)", scale: 1.35, duration: 0.25 }, at).to(labels[i], { color: "#ffffff", duration: 0.25 }, at);
      const stageDone = (tl, i, at) => tl.to(dots[i], { backgroundColor: "rgba(255,255,255,0.62)", scale: 1, duration: 0.4 }, at).to(labels[i], { color: "rgba(255,255,255,0.62)", duration: 0.4 }, at);
      const on = (tl, el, at) => tl.to(el, { ...chipOnS, duration: 0.25 }, at);
      const done = (tl, el, at) => tl.to(el, { ...chipDone, duration: 0.4 }, at);
      const line = (tl, i, at) => tl.to(fills[i], { scaleY: 1, duration: 0.5, ease: "power1.inOut" }, at);
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
        // TRIGGER
        stageOn(tl, 0, t);
        on(tl, chipsM.trig, t + 0.1);
        done(tl, chipsM.trig, t + 0.9);
        line(tl, 0, t + 1.0);
        stageDone(tl, 0, t + 1.4);
        // CONDITION
        t += 1.4;
        stageOn(tl, 1, t);
        const lastRule = Math.max(...variant.rules);
        for (let r = 0; r <= lastRule; r += 1) {
          const at = t + 0.2 + r * 0.5;
          if (variant.rules.includes(r)) on(tl, chipsM[`r${r}`], at);
          else tl.to(chipsM[`r${r}`], { color: "#ffffff", duration: 0.15 }, at).to(chipsM[`r${r}`], { color: "rgba(255,255,255,0.68)", duration: 0.3 }, at + 0.3);
        }
        t += 0.2 + (lastRule + 1) * 0.5 + 0.2;
        variant.rules.forEach((r) => done(tl, chipsM[`r${r}`], t));
        line(tl, 1, t);
        stageDone(tl, 1, t + 0.5);
        // ACTION (+ optional AI, + exception)
        t += 0.5;
        stageOn(tl, 2, t);
        let end = t;
        variant.rules.forEach((r, i) => {
          const k = LANES[r];
          let at = t + 0.2 + i * 0.3;
          if (variant.ai && r === 2) {
            on(tl, chipsM.ai, at);
            done(tl, chipsM.ai, at + 1.1);
            tl.to(chipsM.ai, { ...chipDimRest, duration: 0.5 }, at + 1.6);
            at += 1.2;
          }
          on(tl, chipsM[k], at);
          if (r === 0 && variant.crmFail) {
            tl.to(chipsM.crm, { ...chipErr, duration: 0.2 }, at + 0.7);
            on(tl, chipsM.err, at + 0.9);
            on(tl, chipsM.retry, at + 1.8);
            tl.to(chipsM.retry, { ...chipErr, duration: 0.2 }, at + 2.6);
            on(tl, chipsM.queue, at + 3.0);
            end = Math.max(end, at + 4.2);
          } else {
            done(tl, chipsM[k], at + 1.2);
            end = Math.max(end, at + 1.6);
          }
        });
        line(tl, 2, end - 0.4);
        stageDone(tl, 2, end);
        // RESULT
        stageOn(tl, 3, end);
        on(tl, chipsM.result, end + 0.2);
        done(tl, chipsM.result, end + 1.4);
        stageDone(tl, 3, end + 1.6);
        const r = end + 2.2;
        tl.to(ALL, { ...chipRest, duration: 0.6 }, r)
          .to(DIM, { ...chipDimRest, duration: 0.6 }, r)
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
    ["TRIGGER", [["TRIGGER", "trig"]]],
    ["CONDITION", [["R1", "r0"], ["R2", "r1"], ["R3", "r2"]]],
    ["ACTION", [["CRM", "crm"], ["NOTIFY", "not"], ["DOC", "doc"], ["AI OPTIONAL", "ai", true], ["ERR", "err", true], ["RETRY", "retry", true], ["QUEUE", "queue", true]]],
    ["RESULT", [["RESULT", "result"]]],
  ];
  const chipCls = "rounded-lg border border-white/14 bg-[#0a0a0a] px-3 py-2 font-mono text-[11px] tracking-[0.18em] text-white/70";
  return (
    <div ref={rootRef} className="pv-root rounded-xl border border-white/10 bg-black overflow-hidden">
      <style>{`
        .pv-hl{opacity:0;transition:opacity .25s ease;pointer-events:none}
        @media (hover:hover) and (pointer:fine){.pv-hit:hover .pv-hl{opacity:1}}
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
        {/* column captions */}
        <text x="125" y="222" textAnchor="middle" fontSize="11" letterSpacing="4" fill="rgba(255,255,255,0.5)" style={{ fontFamily: MONO }}>
          {tr("TRIGGER")}
        </text>
        {/* base lines */}
        {paths.map(([id, d]) => (
          <path key={`b-${id}`} data-path={id} d={d} fill="none" stroke={DASHED.has(id) ? "rgba(255,255,255,0.18)" : C.base} strokeWidth="1.2" strokeDasharray={DASHED.has(id) ? "4 5" : undefined} />
        ))}
        {paths.map(([id, d]) => (
          <path key={`t-${id}`} data-trail={id} d={d} pathLength="100" fill="none" stroke={CY} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="100" strokeDashoffset="100" opacity="0" />
        ))}
        {/* event tag */}
        <text data-id="evTag" x="4" y="262" fontSize="10" letterSpacing="1.2" fill="rgba(255,255,255,0.85)" opacity="0" style={{ fontFamily: MONO }}>
          {tr("EVENT")}
        </text>
        <Node id="trig" x={60} y={250} w={130} label={tr("TRIGGER")} />
        {/* condition */}
        <g className="pv-hit">
          <path data-id="diamond" d="M310 214 L380 274 L310 334 L240 274 Z" fill="#0a0a0a" stroke={C.diamondRest} strokeWidth="1.2" />
          <path className="pv-hl" d="M310 214 L380 274 L310 334 L240 274 Z" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
          <text data-id="if" x="310" y="279" textAnchor="middle" fontSize="12" letterSpacing="3" fill={C.ruleRest} style={{ fontFamily: MONO }}>
            {tr("IF")}
          </text>
        </g>
        {RULE_LABELS.map((r, i) => (
          <text key={r.t} data-rule={i} x={r.x} y={r.y} fontSize="11" letterSpacing="2" fill={C.ruleRest} style={{ fontFamily: MONO }}>
            {r.t}
          </text>
        ))}
        {/* actions */}
        <Node id="crm" x={LX} y={LANE_Y.crm - 24} w={LW} label={tr("CRM")} check />
        <Node id="not" x={LX} y={LANE_Y.not - 24} w={LW} label={tr("NOTIFY")} check />
        <Node id="doc" x={LX} y={LANE_Y.doc - 24} w={LW} label={tr("DOC")} check />
        <text data-id="errTxt" x={LX} y="122" fontSize="11" letterSpacing="2.5" fill="rgba(255,255,255,0.95)" opacity="0" style={{ fontFamily: MONO }}>
          {tr("ERR")}
        </text>
        {/* exception branch: RETRY → QUEUE (person) */}
        <Node id="retry" x={515} y={38} w={116} h={44} label={tr("RETRY")}>
          {[610, 620].map((cx) => (
            <circle key={cx} data-id="retryDot" cx={cx} cy="60" r="2.2" fill="rgba(255,255,255,0.2)" />
          ))}
        </Node>
        <g data-chip="queue" className="pv-hit">
          <rect className="pv-box" x="680" y="38" width="140" height="44" rx="10" fill="#0a0a0a" stroke={C.boxRest} strokeDasharray="4 4" />
          <circle data-id="qIcon" cx="702" cy="55" r="4.5" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3" />
          <path data-id="qIcon" d="M692 70 c1 -8 5 -10 10 -10 s9 2 10 10" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3" strokeLinecap="round" />
          <text className="pv-label" x="724" y="65" fontSize="12" letterSpacing="2.4" fill={C.labelRest} style={{ fontFamily: MONO }}>
            {tr("QUEUE")}
          </text>
          {[790, 800, 810].map((cx) => (
            <circle key={cx} data-id="qDot" cx={cx} cy="60" r="2" fill={CY} opacity="0" />
          ))}
          <circle className="pv-dot" cx="-20" cy="-20" r="0" fill="none" />
          <rect className="pv-hl" x="680" y="38" width="140" height="44" rx="10" fill="none" stroke="rgba(255,255,255,0.6)" strokeDasharray="4 4" />
        </g>
        {/* optional AI node (dim unless a rule needs it) */}
        <Node id="ai" x={240} y={420} w={150} h={46} label={tr("AI")} dashed dim>
          <text data-id="aiTag" x="372" y="447.500" textAnchor="end" fontSize="11" letterSpacing="2" fill={C.labelDim} style={{ fontFamily: MONO }}>
            {tr("OPTIONAL")}
          </text>
          <rect data-id="aiScan" x="250" y="424" width="130" height="1" fill={CY} opacity="0" />
        </Node>
        {/* result */}
        <Node id="result" x={730} y={250} w={130} label={tr("RESULT")} check />
        {[0, 1, 2].map((i) => (
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
              {items.map(([text, key, dim]) => (
                <span key={key} data-m-chip={key} data-m-dim={dim ? "1" : undefined} className={`${chipCls} ${dim ? "border-dashed" : ""}`}>
                  {tr(text)}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
export default ProcessVisual;
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { translate } from "./translate";
// Documents visual: "document to record".
//
// A page-shaped skeleton on the left is scanned by OCR (a line sweeps down it), FIELD
// boxes are drawn around the regions that were recognised, and each field travels into a
// key → value RECORD (values are masked: nothing here is real data). VALIDATE ticks the
// rules one by one; a valid record is written to the SYSTEM (ERP) on the right. Cycles
// are chained and differ deterministically:
//
//   cycle 0  fields VENDOR, DATE, TOTAL, ID → all rules pass → written
//   cycle 1  FORMAT fails on DATE → EXCEPTION → HUMAN REVIEW → corrected → re-checked → written
//   cycle 2  fields in another order (TOTAL, ID, DATE, VENDOR) → all rules pass → written
//   cycle 3  CLASSIFY first (INVOICE / FORM / CONTRACT, one selected) → then as cycle 0
//
// Geometry is fixed in the SVG; the timeline only moves transform / opacity / stroke
// (field boxes and checks are drawn with stroke-dashoffset). No React re-render per frame,
// no timeline for prefers-reduced-motion, paused off screen / in a hidden tab, torn down on
// unmount.
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const CY = "#67e8f9";
const C = {
  tag: "rgba(255,255,255,0.6)",
  panel: "rgba(255,255,255,0.16)",
  rowRest: "rgba(255,255,255,0.14)",
  rowDone: "rgba(255,255,255,0.3)",
  boxRest: "rgba(255,255,255,0.55)",
  keyRest: "rgba(255,255,255,0.62)",
  chipRest: "rgba(255,255,255,0.14)",
};
// Fields: record row i is fixed; `box` is the region on the page, `path` the route into the record.
const RY = [122, 158, 194, 230];
const FIELDS = [
  { key: "VENDOR", val: "•••• ••••", box: [50, 104, 96, 42], path: "M98 104 V88 H292 V122 H344" },
  { key: "DATE", val: "••.••.••••", box: [164, 128, 76, 18], path: "M240 137 H292 V158 H344" },
  { key: "TOTAL", val: "••••.••", box: [146, 406, 100, 36], path: "M246 424 H292 V194 H344" },
  { key: "ID", val: "•••• ••••", box: [164, 104, 76, 18], path: "M240 113 H292 V230 H344" },
];
const RULES = ["CHECKSUM", "FORMAT", "MATCH"];
const RULE_Y = [328, 354, 380];
const TYPES = ["INVOICE", "FORM", "CONTRACT"];
// Width of the document-type chips follows the (translated) label length.
const typeLayout = (labels) => {
  let x = 40;
  return labels.map((l) => {
    const w = Math.round(l.length * 8.6 + 24);
    const box = { x, w };
    x += w + 8;
    return box;
  });
};
const SYS_Y = 297; // new row centre in the system table
const PATHS = {
  toVal: "M445 262 V282",
  toReview: "M445 396 V430 H530 V460",
  toSys: `M560 340 H606 V${SYS_Y} H668`,
};
const VARIANTS = [
  { speed: 1.12, order: [0, 1, 2, 3] },
  { speed: 1.5, order: [3, 2, 0, 1], fail: 1, failField: 1 },
  { speed: 1.12, order: [2, 3, 1, 0] },
  { speed: 1.25, order: [0, 3, 1, 2], classify: true },
];
const Person = ({ cx, cy, parts }) => (
  <>
    <circle data-id={parts} cx={cx} cy={cy} r="8" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" />
    <path data-id={parts} d={`M${cx - 16} ${cy + 38} c2 -14 9 -20 16 -20 s14 6 16 20`} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" strokeLinecap="round" />
  </>
);
const DocumentsVisual = ({ caption, a11y, labels = {} }) => {
  const Lref = useRef(labels);
  Lref.current = labels;
  const tr = (text) => translate(text, labels);
  const rootRef = useRef(null);
  useEffect(() => {
    const tr = (text) => translate(text, Lref.current);
    const root = rootRef.current;
    if (!root) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 48rem)");
    const $ = (s) => root.querySelector(s);
    const $$ = (s) => Array.from(root.querySelectorAll(s));
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
    const nextCycle = (build) => () => {
      cycle += 1;
      current = build(VARIANTS[cycle % VARIANTS.length]);
      syncPlayState();
    };
    // ------------------------------------------------------------ desktop (SVG)
    const setupDesktop = () => {
      const tags = {};
      $$("[data-tag]").forEach((el) => {
        tags[el.dataset.tag] = el;
      });
      const dyn = $('[data-id="dyn"]');
      const scan = $('[data-id="scan"]');
      const scanTint = $('[data-id="scanTint"]');
      const scanLbl = $('[data-id="scanLbl"]');
      const boxes = $$("[data-fbox]");
      const rows = $$("[data-row]").map((g) => ({
        rect: g.querySelector("rect"),
        key: g.querySelector("[data-key]"),
        val: g.querySelector("[data-val]"),
        cross: g.querySelector("[data-flagx]"),
        tick: g.querySelector("[data-flagt]"),
      }));
      const rules = $$("[data-rule]").map((g) => ({
        name: g.querySelector("[data-name]"),
        tick: g.querySelector("[data-tick]"),
        cross: g.querySelector("[data-cross]"),
      }));
      const exc = $('[data-id="exc"]');
      const valBox = $('[data-id="valBox"]');
      const rev = { box: $('[data-id="revBox"]'), parts: $$("[data-id=revPart]"), tick: $('[data-id="revTick"]'), tile: $('[data-id="revTile"]') };
      const sys = { box: $('[data-id="sysBox"]'), row: $('[data-id="sysRow"]'), bars: $$("[data-sysbar]") };
      const chips = $$("[data-type]").map((g) => ({ box: g.querySelector("rect"), txt: g.querySelector("text") }));
      const packets = $$("[data-packet]");
      const paths = {};
      const trails = {};
      $$("[data-path]").forEach((p) => {
        paths[p.dataset.path] = p;
      });
      $$("[data-trail]").forEach((p) => {
        trails[p.dataset.trail] = p;
      });
      const allKeys = Object.keys(trails);
      const rest = (classify) => {
        gsap.set(dyn, { opacity: 1 });
        gsap.set(Object.values(tags), { fill: C.tag });
        gsap.set(scan, { opacity: 0, y: 0 });
        gsap.set(scanTint, { scaleY: 0, opacity: 1, transformOrigin: "50% 0%" });
        gsap.set(scanLbl, { opacity: 0, y: 0 });
        gsap.set(boxes, { strokeDashoffset: 1, stroke: C.boxRest, opacity: 1 });
        rows.forEach((r) => {
          gsap.set(r.rect, { stroke: C.rowRest });
          gsap.set(r.key, { fill: C.keyRest });
          gsap.set(r.val, { opacity: 0, x: -4, fill: "#fff" });
          gsap.set([r.cross, r.tick], { strokeDashoffset: 1, opacity: 1 });
        });
        rules.forEach((r) => {
          gsap.set(r.name, { fill: C.keyRest });
          gsap.set([r.tick, r.cross], { strokeDashoffset: 1, opacity: 1 });
        });
        gsap.set(exc, { opacity: 0 });
        gsap.set(valBox, { stroke: C.panel });
        gsap.set(rev.box, { stroke: C.panel });
        gsap.set(rev.parts, { stroke: "rgba(255,255,255,0.6)" });
        gsap.set(rev.tick, { strokeDashoffset: 1, opacity: 1 });
        gsap.set(rev.tile, { opacity: 0 });
        gsap.set(sys.box, { stroke: C.panel });
        gsap.set(sys.row, { opacity: 0 });
        gsap.set(sys.bars, { scaleX: 0, transformOrigin: "0% 50%" });
        chips.forEach((c, i) => {
          // known type = INVOICE is preselected; classify cycles start undecided
          const on = !classify && i === 0;
          gsap.set(c.box, { stroke: on ? "rgba(255,255,255,0.6)" : C.chipRest });
          gsap.set(c.txt, { fill: on ? "#fff" : "rgba(255,255,255,0.5)" });
        });
        gsap.set(packets, { autoAlpha: 0 });
        allKeys.forEach((k) => gsap.set(trails[k], { opacity: 0, strokeDashoffset: 100 }));
      };
      if (reduced) {
        // Static resolved frame: record complete, rules passed, written to the system.
        rest(false);
        gsap.set(boxes, { strokeDashoffset: 0 });
        rows.forEach((r) => {
          gsap.set(r.val, { opacity: 1, x: 0 });
          gsap.set(r.rect, { stroke: C.rowDone });
        });
        rules.forEach((r) => gsap.set(r.tick, { strokeDashoffset: 0 }));
        gsap.set(sys.row, { opacity: 1 });
        gsap.set(sys.bars, { scaleX: 1 });
        return () => {};
      }
      const travel = (key, pk, dur, { reverse = false, ease = "power1.inOut" } = {}) => {
        const p = paths[key];
        const tr = trails[key];
        const len = p.getTotalLength();
        const st = { v: 0 };
        return gsap.to(st, {
          v: 1,
          duration: dur,
          ease,
          onStart() {
            gsap.set(tr, { opacity: 1, strokeDashoffset: 100 });
            gsap.set(pk, { autoAlpha: 1 });
          },
          onUpdate() {
            const f = reverse ? 1 - st.v : st.v;
            const a = p.getPointAtLength(f * len);
            pk.setAttribute("transform", `translate(${a.x.toFixed(2)} ${a.y.toFixed(2)})`);
            tr.style.strokeDashoffset = String(100 * (1 - st.v));
          },
          onComplete() {
            gsap.set(pk, { autoAlpha: 0 });
          },
        });
      };
      const tagOn = (t, k, at) => t.to(tags[k], { fill: CY, duration: 0.25 }, at);
      const tagOff = (t, k, at) => t.to(tags[k], { fill: C.tag, duration: 0.4 }, at);
      const fade = (t, key, at) => t.to(trails[key], { opacity: 0, duration: 0.5 }, at);
      const build = (v) => {
        const t = gsap.timeline({ paused: !(visible && !tabHidden), onComplete: nextCycle(build) });
        t.timeScale(v.speed);
        rest(!!v.classify);
        let c = 0.5;
        // ---- CLASSIFY (cycle 3): candidate types are tried, one is selected -----
        if (v.classify) {
          tagOn(t, "doc", c);
          chips.forEach((ch, i) => {
            t.to(ch.box, { stroke: "rgba(103,232,249,0.85)", duration: 0.2 }, c + i * 0.4)
              .to(ch.txt, { fill: "#fff", duration: 0.2 }, c + i * 0.4);
            if (i !== 0) {
              t.to(ch.box, { stroke: C.chipRest, duration: 0.3 }, c + i * 0.4 + 0.35)
                .to(ch.txt, { fill: "rgba(255,255,255,0.5)", duration: 0.3 }, c + i * 0.4 + 0.35);
            }
          });
          // INVOICE wins: it was lit first; light it again as the final choice
          t.to(chips[0].box, { stroke: "rgba(103,232,249,0.85)", duration: 0.2 }, c + 1.3)
            .to(chips[0].txt, { fill: "#fff", duration: 0.2 }, c + 1.3)
            .to(chips[0].box, { stroke: "rgba(255,255,255,0.6)", duration: 0.5 }, c + 1.7);
          c += 2.0;
        }
        // ---- OCR: a scan line sweeps the page, then the fields are located ------
        tagOn(t, "doc", c);
        t.set(scan, { opacity: 0.85, y: 0 }, c)
          .set(scanLbl, { opacity: 1, y: 0 }, c)
          .to([scan, scanLbl], { y: 372, duration: 2.0, ease: "none" }, c)
          .to(scanTint, { scaleY: 1, duration: 2.0, ease: "none" }, c)
          .to([scan, scanLbl], { opacity: 0, duration: 0.3 }, c + 2.0);
        c += 2.1;
        boxes.forEach((b, i) => t.to(b, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, c + i * 0.18));
        c += 0.18 * 3 + 0.6;
        tagOff(t, "doc", c);
        // ---- EXTRACT: each field travels into its key → value row ---------------
        tagOn(t, "record", c);
        v.order.forEach((fi, k) => {
          const at = c + k * 0.62;
          const r = rows[fi];
          t.to(boxes[fi], { stroke: CY, duration: 0.2 }, at)
            .add(travel(`f${fi}`, packets[k % 4], 0.6), at + 0.1)
            .to(r.rect, { stroke: "rgba(103,232,249,0.7)", duration: 0.2 }, at + 0.65)
            .to(r.key, { fill: "#fff", duration: 0.2 }, at + 0.65)
            .to(r.val, { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }, at + 0.7)
            .to(r.rect, { stroke: C.rowDone, duration: 0.5 }, at + 1.0)
            .to(r.key, { fill: C.keyRest, duration: 0.5 }, at + 1.0)
            .to(boxes[fi], { stroke: C.boxRest, duration: 0.5 }, at + 0.8);
          fade(t, `f${fi}`, at + 0.8);
        });
        c += 3 * 0.62 + 1.2;
        tagOff(t, "record", c);
        // ---- VALIDATE: rules tick one by one -----------------------------------
        t.add(travel("toVal", packets[0], 0.4), c - 0.3);
        fade(t, "toVal", c + 0.2);
        tagOn(t, "validate", c);
        t.to(valBox, { stroke: "rgba(103,232,249,0.45)", duration: 0.3 }, c);
        RULES.forEach((_, i) => {
          const at = c + 0.3 + i * 0.6;
          t.to(rules[i].name, { fill: "#fff", duration: 0.2 }, at);
          if (v.fail === i) {
            t.to(rules[i].cross, { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, at + 0.15)
              .to(rows[v.failField].cross, { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, at + 0.3);
          } else {
            t.to(rules[i].tick, { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, at + 0.15);
          }
          t.to(rules[i].name, { fill: C.keyRest, duration: 0.4 }, at + 0.5);
        });
        c += 0.3 + RULES.length * 0.6 + 0.2;
        if (v.fail !== undefined) {
          // ---- EXCEPTION → HUMAN REVIEW → corrected → re-checked ---------------
          t.to(exc, { opacity: 1, duration: 0.3 }, c).to(valBox, { stroke: "rgba(255,255,255,0.5)", duration: 0.3 }, c);
          c += 0.5;
          t.add(travel("toReview", packets[1], 0.9), c);
          tagOn(t, "review", c + 0.8);
          t.to(rev.tile, { opacity: 1, duration: 0.25 }, c + 0.85)
            .to(rev.box, { stroke: "rgba(103,232,249,0.6)", duration: 0.25 }, c + 0.85)
            .to(rev.parts, { stroke: CY, duration: 0.25 }, c + 0.85);
          fade(t, "toReview", c + 1.0);
          c += 1.9;
          const fr = rows[v.failField];
          t.to(fr.rect, { stroke: CY, duration: 0.2 }, c)
            .to(fr.cross, { opacity: 0, duration: 0.3 }, c + 0.2)
            .to(fr.tick, { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, c + 0.5)
            .to(rev.tick, { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, c + 0.5)
            .to(fr.rect, { stroke: C.rowDone, duration: 0.5 }, c + 0.9);
          c += 1.3;
          t.to(rev.box, { stroke: C.panel, duration: 0.5 }, c)
            .to(rev.parts, { stroke: "rgba(255,255,255,0.6)", duration: 0.5 }, c)
            .to(rev.tick, { opacity: 0, duration: 0.4 }, c)
            .to(rev.tile, { opacity: 0, duration: 0.4 }, c + 0.2);
          tagOff(t, "review", c);
          t.add(travel("toReview", packets[2], 0.8, { reverse: true }), c);
          fade(t, "toReview", c + 0.6);
          c += 0.9;
          // re-check the rule that failed
          const i = v.fail;
          t.to(rules[i].name, { fill: "#fff", duration: 0.2 }, c)
            .to(rules[i].cross, { opacity: 0, duration: 0.25 }, c + 0.1)
            .to(rules[i].tick, { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, c + 0.35)
            .to(exc, { opacity: 0, duration: 0.3 }, c + 0.5)
            .to(rules[i].name, { fill: C.keyRest, duration: 0.4 }, c + 0.8);
          c += 1.0;
        }
        // ---- WRITE: a valid record goes into the system -------------------------
        tagOff(t, "validate", c);
        t.to(valBox, { stroke: C.panel, duration: 0.4 }, c);
        tagOn(t, "system", c);
        t.add(travel("toSys", packets[3], 0.9), c)
          .to(sys.box, { stroke: "rgba(103,232,249,0.45)", duration: 0.3 }, c + 0.8)
          .to(sys.row, { opacity: 1, duration: 0.2 }, c + 0.9)
          .to(sys.bars, { scaleX: 1, duration: 0.5, ease: "power2.out", stagger: 0.12 }, c + 0.95);
        fade(t, "toSys", c + 1.0);
        c += 2.3;
        tagOff(t, "system", c);
        t.to(sys.box, { stroke: C.panel, duration: 0.5 }, c);
        c += 0.6;
        // ---- smooth reset ---------------------------------------------------------
        t.to(dyn, { opacity: 0, duration: 0.7, ease: "power1.inOut" }, c)
          .to([...rows.map((r) => r.val), ...rules.map((r) => r.tick)], { opacity: 0, duration: 0.7 }, c)
          .to(boxes, { opacity: 0, duration: 0.7 }, c)
          .to(scanTint, { opacity: 0, duration: 0.7 }, c)
          .to({}, { duration: 0.4 }, c + 0.8);
        return t;
      };
      rest(false);
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
      const types = $$("[data-m-type]");
      const ocr = $("[data-m-ocr]");
      const fields = $$("[data-m-field]").map((el) => ({ el, val: el.querySelector("[data-m-val]") }));
      const rules = $$("[data-m-rule]").map((el) => ({ el, mark: el.querySelector("[data-m-mark]") }));
      const review = $("[data-m-review]");
      const erp = $("[data-m-erp]");
      const ALL = [...types, ...fields.map((f) => f.el), ...rules.map((r) => r.el), review, erp];
      const chipRest = { borderColor: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.7)", backgroundColor: "#0a0a0a" };
      const chipOn = { borderColor: "rgba(103,232,249,0.85)", color: "#ffffff", backgroundColor: "rgba(103,232,249,0.08)" };
      const chipDone = { borderColor: "rgba(255,255,255,0.32)", color: "rgba(255,255,255,0.9)", backgroundColor: "#0a0a0a" };
      const rest = (classify) => {
        gsap.set(ALL, chipRest);
        gsap.set(types.map((x, i) => (i === 0 && !classify ? null : x)).filter(Boolean), { color: "rgba(255,255,255,0.5)" });
        if (!classify) gsap.set(types[0], chipDone);
        gsap.set(fields.map((f) => f.val), { opacity: 0 });
        gsap.set(rules.map((r) => r.mark), { opacity: 0 });
        gsap.set(ocr, { scaleX: 0, transformOrigin: "0% 50%" });
        gsap.set(fills, { scaleY: 0, transformOrigin: "50% 0%" });
        gsap.set(dots, { backgroundColor: "rgba(255,255,255,0.3)", scale: 1 });
        gsap.set(labels, { color: "rgba(255,255,255,0.62)" });
      };
      if (reduced) {
        rest(false);
        gsap.set(fields.map((f) => f.val), { opacity: 1 });
        gsap.set(rules.map((r) => r.mark), { opacity: 1 });
        gsap.set(ocr, { scaleX: 0 }); // static frame: cyan marks only a current step
        gsap.set(fills, { scaleY: 1 });
        gsap.set(dots, { backgroundColor: "rgba(103,232,249,0.9)" });
        gsap.set(erp, chipDone);
        return () => {};
      }
      const stageOn = (t, i, at) =>
        t.to(dots[i], { backgroundColor: "rgba(103,232,249,0.95)", scale: 1.35, duration: 0.25 }, at).to(labels[i], { color: "#fff", duration: 0.25 }, at);
      const stageDone = (t, i, at) =>
        t.to(dots[i], { backgroundColor: "rgba(255,255,255,0.62)", scale: 1, duration: 0.4 }, at).to(labels[i], { color: "rgba(255,255,255,0.62)", duration: 0.4 }, at);
      const line = (t, i, at, d = 0.5) => t.to(fills[i], { scaleY: 1, duration: d, ease: "power1.inOut" }, at);
      const on = (t, el, at) => t.to(el, { ...chipOn, duration: 0.25 }, at);
      const done = (t, el, at) => t.to(el, { ...chipDone, duration: 0.4 }, at);
      const build = (v) => {
        const t = gsap.timeline({ paused: !(visible && !tabHidden), onComplete: nextCycle(build) });
        t.timeScale(v.speed);
        rest(!!v.classify);
        let c = 0.4;
        // stage 0 · CLASSIFY
        stageOn(t, 0, c);
        if (v.classify) {
          types.forEach((el, i) => {
            on(t, el, c + 0.2 + i * 0.4);
            if (i) t.to(el, { ...chipRest, color: "rgba(255,255,255,0.5)", duration: 0.3 }, c + 0.2 + i * 0.4 + 0.35);
          });
          done(t, types[0], c + 1.6);
          c += 2.0;
        } else {
          c += 0.6;
        }
        line(t, 0, c);
        stageDone(t, 0, c + 0.3);
        // stage 1 · OCR
        c += 0.3;
        stageOn(t, 1, c);
        t.to(ocr, { scaleX: 1, duration: 1.8, ease: "none" }, c + 0.1);
        c += 2.1;
        line(t, 1, c);
        stageDone(t, 1, c + 0.3);
        // stage 2 · EXTRACT
        c += 0.3;
        stageOn(t, 2, c);
        v.order.forEach((fi, k) => {
          on(t, fields[fi].el, c + 0.2 + k * 0.55);
          t.to(fields[fi].val, { opacity: 1, duration: 0.25 }, c + 0.3 + k * 0.55);
          done(t, fields[fi].el, c + 0.2 + k * 0.55 + 0.5);
        });
        c += 0.3 + 4 * 0.55 + 0.4;
        line(t, 2, c);
        stageDone(t, 2, c + 0.3);
        // stage 3 · VALIDATE
        c += 0.3;
        stageOn(t, 3, c);
        rules.forEach((r, i) => {
          const at = c + 0.2 + i * 0.6;
          on(t, r.el, at);
          t.set(r.mark, { opacity: 1 }, at + 0.3);
          if (v.fail === i) {
            r.mark.textContent = tr("FAIL");
            done(t, r.el, at + 0.5);
          } else {
            r.mark.textContent = tr("OK");
            done(t, r.el, at + 0.5);
          }
        });
        c += 0.3 + 3 * 0.6 + 0.4;
        line(t, 3, c);
        stageDone(t, 3, c + 0.3);
        // stage 4 · REVIEW (only on exception), then re-check
        c += 0.3;
        stageOn(t, 4, c);
        if (v.fail !== undefined) {
          on(t, review, c + 0.2);
          done(t, review, c + 1.5);
          t.call(() => { rules[v.fail].mark.textContent = tr("OK"); }, null, c + 1.6);
          on(t, rules[v.fail].el, c + 1.6);
          done(t, rules[v.fail].el, c + 2.0);
          c += 2.3;
        } else {
          c += 0.4;
        }
        line(t, 4, c);
        stageDone(t, 4, c + 0.3);
        // stage 5 · SYSTEM
        c += 0.3;
        stageOn(t, 5, c);
        on(t, erp, c + 0.2);
        done(t, erp, c + 1.5);
        c += 1.7;
        stageDone(t, 5, c);
        t.to(ALL, { ...chipRest, duration: 0.6 }, c + 0.3)
          .to(fields.map((f) => f.val), { opacity: 0, duration: 0.5 }, c + 0.3)
          .to(rules.map((r) => r.mark), { opacity: 0, duration: 0.5 }, c + 0.3)
          .to(ocr, { scaleX: 0, duration: 0.6 }, c + 0.3)
          .to(fills, { scaleY: 0, duration: 0.6, ease: "power2.inOut" }, c + 0.3)
          .to({}, { duration: 0.4 }, c + 1.0);
        return t;
      };
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
  const Tag = ({ k, x, y, anchor, children }) => (
    <text data-tag={k} x={x} y={y} textAnchor={anchor} fontSize="11" letterSpacing="3" fill={C.tag} style={{ fontFamily: MONO }}>
      {children}
    </text>
  );
  const bar = (x, y, w, o = 0.14, h = 4) => <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={`rgba(255,255,255,${o})`} />;
  const check = (d, extra) => (
    <path d={d} pathLength="1" fill="none" stroke={CY} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset="1" {...extra} />
  );
  const allPaths = [...FIELDS.map((f, i) => [`f${i}`, f.path]), ...Object.entries(PATHS)];
  return (
    <div ref={rootRef} className="dv-root rounded-xl border border-white/10 bg-black overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-black/40">
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="ml-2 text-[9px] font-mono text-white/50 tracking-wider truncate">{caption}</span>
      </div>
      <p className="sr-only">{a11y}</p>
      {/* ---------- md+ : full canvas ---------- */}
      <svg
        viewBox="0 0 900 600"
        className="hidden md:block w-full h-auto"
        aria-hidden="true"
        focusable="false"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      >
        <Tag k="doc" x="40" y="44">
          {tr("DOCUMENT")}
        </Tag>
        <Tag k="record" x="330" y="44">
          {tr("RECORD")}
        </Tag>
        <Tag k="system" x="650" y="44">
          {tr("SYSTEM")}
        </Tag>
        {/* document types */}
        {TYPES.map((label, i) => {
          const box = typeLayout(TYPES.map(tr))[i];
          return (
          <g key={label} data-type={i}>
            <rect x={box.x} y="56" width={box.w} height="22" rx="7" fill="#0a0a0a" stroke={C.chipRest} />
            <text x={box.x + box.w / 2 + 0.7} y="71" textAnchor="middle" fontSize="11" letterSpacing="1.4" fill="rgba(255,255,255,0.5)" style={{ fontFamily: MONO }}>
              {tr(label)}
            </text>
          </g>
          );
        })}
        {/* page skeleton */}
        <path d="M40 96 H236 L260 120 V470 H40 Z" fill="#0a0a0a" stroke="rgba(255,255,255,0.2)" />
        <path d="M236 96 V120 H260" fill="none" stroke="rgba(255,255,255,0.2)" />
        <rect x="56" y="112" width="36" height="14" rx="3" fill="rgba(255,255,255,0.2)" />
        {bar(100, 114, 40)}
        {bar(100, 122, 26)}
        {bar(56, 134, 70, 0.1, 3)}
        {bar(176, 110, 52)}
        {bar(176, 134, 52)}
        {bar(56, 180, 60, 0.26)}
        {bar(130, 180, 36, 0.26)}
        {bar(186, 180, 48, 0.26)}
        <rect x="56" y="192" width="188" height="1" fill="rgba(255,255,255,0.14)" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            {bar(56, 206 + i * 30, 50 + ((i * 17) % 36), 0.14, 3.5)}
            {bar(130, 206 + i * 30, 24, 0.14, 3.5)}
            {bar(190, 206 + i * 30, 40, 0.14, 3.5)}
          </g>
        ))}
        {bar(150, 372, 94, 0.12, 3)}
        {bar(150, 386, 94, 0.12, 3)}
        {bar(158, 420, 78, 0.34, 6)}
        {bar(56, 452, 90, 0.1, 3)}
        {/* OCR scan */}
        <rect data-id="scanTint" x="40" y="96" width="220" height="374" fill="rgba(255,255,255,0.035)" />
        <rect data-id="scan" x="40" y="96" width="220" height="1.6" fill={CY} opacity="0" />
        <text data-id="scanLbl" x="268" y="104" fontSize="11" letterSpacing="2" fill={CY} opacity="0" style={{ fontFamily: MONO }}>
          OCR
        </text>
        {/* field boxes */}
        {FIELDS.map((f, i) => (
          <rect key={f.key} data-fbox x={f.box[0]} y={f.box[1]} width={f.box[2]} height={f.box[3]} rx="4" pathLength="1" fill="none" stroke={C.boxRest} strokeWidth="1.2" strokeDasharray="1" strokeDashoffset="1" />
        ))}
        {/* routes */}
        {allPaths.map(([k, d]) => (
          <g key={k}>
            <path data-path={k} d={d} fill="none" stroke={k.startsWith("f") || k === "toVal" ? "none" : "rgba(255,255,255,0.14)"} strokeWidth="1.2" strokeDasharray={k === "toReview" ? "4 5" : undefined} />
            <path data-trail={k} d={d} pathLength="100" fill="none" stroke={CY} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="100" strokeDashoffset="100" opacity="0" />
          </g>
        ))}
        {/* record */}
        <rect x="330" y="96" width="230" height="166" rx="12" fill="none" stroke={C.panel} />
        {FIELDS.map((f, i) => (
          <g key={f.key} data-row>
            <rect x="344" y={RY[i] - 14} width="202" height="28" rx="7" fill="#0a0a0a" stroke={C.rowRest} />
            <text data-key x="358" y={RY[i] + 4} fontSize="11" letterSpacing="2" fill={C.keyRest} style={{ fontFamily: MONO }}>
              {tr(f.key)}
            </text>
            <text data-val x="436" y={RY[i] + 4} fontSize="11" letterSpacing="1.5" fill="#fff" opacity="0" style={{ fontFamily: MONO }}>
              {f.val}
            </text>
            {check(`M${524} ${RY[i] - 4} l8 8 M${532} ${RY[i] - 4} l-8 8`, { "data-flagx": "", stroke: "rgba(255,255,255,0.85)" })}
            {check(`M522 ${RY[i]} l3.4 3.4 l6.6 -7.2`, { "data-flagt": "" })}
          </g>
        ))}
        {/* validate */}
        <rect data-id="valBox" x="330" y="282" width="230" height="114" rx="12" fill="none" stroke={C.panel} />
        <Tag k="validate" x="344" y="304">
          {tr("VALIDATE")}
        </Tag>
        <text data-id="exc" x="546" y="304" textAnchor="end" fontSize="11" letterSpacing="2" fill="#fff" opacity="0" style={{ fontFamily: MONO }}>
          {tr("EXCEPTION")}
        </text>
        {RULES.map((name, i) => (
          <g key={name} data-rule>
            <text data-name x="358" y={RULE_Y[i] + 4} fontSize="11" letterSpacing="2" fill={C.keyRest} style={{ fontFamily: MONO }}>
              {tr(name)}
            </text>
            {check(`M522 ${RULE_Y[i]} l3.4 3.4 l6.6 -7.2`, { "data-tick": "" })}
            {check(`M524 ${RULE_Y[i] - 4} l8 8 M532 ${RULE_Y[i] - 4} l-8 8`, { "data-cross": "", stroke: "rgba(255,255,255,0.85)" })}
          </g>
        ))}
        {/* human review */}
        <rect data-id="revBox" x="330" y="420" width="230" height="120" rx="12" fill="none" stroke={C.panel} strokeDasharray="4 4" />
        <Tag k="review" x="406" y="446">
          {tr("HUMAN REVIEW")}
        </Tag>
        <Person cx={368} cy={470} parts="revPart" />
        {check("M384 462 l3.4 3.4 l6.6 -7.2", { "data-id": "revTick" })}
        <rect x="406" y="462" width="40" height="32" rx="5" fill="#0a0a0a" stroke="rgba(255,255,255,0.22)" />
        {bar(412, 472, 24, 0.14, 3)}
        <rect x="458" y="462" width="40" height="32" rx="5" fill="#0a0a0a" stroke="rgba(255,255,255,0.22)" />
        {bar(464, 472, 24, 0.14, 3)}
        <rect data-id="revTile" x="510" y="462" width="40" height="32" rx="5" fill="#0a0a0a" stroke="rgba(255,255,255,0.7)" />
        {/* system (ERP) */}
        <rect data-id="sysBox" x="650" y="96" width="210" height="444" rx="12" fill="none" stroke={C.panel} />
        <text x="668" y="122" fontSize="11" letterSpacing="3" fill="rgba(255,255,255,0.7)" style={{ fontFamily: MONO }}>
          ERP
        </text>
        {[0, 1, 2, 3, 5, 6, 7, 8].map((i) => {
          const cy = 150 + i * 36;
          const filled = i < 4;
          return (
            <g key={i}>
              <rect x="668" y={cy - 14} width="174" height="28" rx="7" fill={filled ? "#0a0a0a" : "none"} stroke={filled ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.07)"} strokeDasharray={filled ? undefined : "3 4"} />
              {filled && bar(680, cy - 2, 28, 0.2, 3)}
              {filled && bar(722, cy - 2, 60 + ((i * 13) % 30), 0.14, 3)}
            </g>
          );
        })}
        <g data-id="sysRow" opacity="0">
          <rect x="668" y={SYS_Y - 14} width="174" height="28" rx="7" fill="#0a0a0a" stroke="rgba(103,232,249,0.8)" />
          <rect data-sysbar x="680" y={SYS_Y - 2} width="28" height="3" rx="1.5" fill="rgba(255,255,255,0.7)" />
          <rect data-sysbar x="722" y={SYS_Y - 2} width="82" height="3" rx="1.5" fill="rgba(255,255,255,0.55)" />
        </g>
        <g data-id="dyn">
          {[0, 1, 2, 3].map((i) => (
            <g key={i} data-packet={i} opacity="0">
              <rect x="-6" y="-2.5" width="12" height="5" rx="1.6" fill={CY} />
            </g>
          ))}
        </g>
      </svg>
      {/* ---------- < md : vertical flow (same cycle, simplified) ---------- */}
      <ol className="md:hidden px-5 py-6" aria-hidden="true">
        {["CLASSIFY", "OCR", "EXTRACT", "VALIDATE", "REVIEW", "SYSTEM"].map((label, i) => (
          <li key={label} data-m-stage={i} className="relative pl-6 pb-6 last:pb-0">
            {i < 5 && (
              <span className="absolute left-[3px] top-3 bottom-[-4px] w-px bg-white/15 overflow-hidden">
                <span data-m-fill className="block h-full w-full bg-cyan-300/70" />
              </span>
            )}
            <span data-m-dot className="absolute left-0 top-[6px] h-[7px] w-[7px] rounded-full bg-white/30" />
            <p data-m-label className="font-mono text-[10px] tracking-[0.3em] text-white/60 mb-2">
              {tr(label)}
            </p>
            {i === 0 && (
              <div className="flex flex-wrap gap-2">
                {TYPES.map((x) => (
                  <span key={x} data-m-type className="rounded-lg border border-white/14 bg-[#0a0a0a] px-3 py-2 font-mono text-[10.5px] tracking-[0.18em] text-white/70">
                    {tr(x)}
                  </span>
                ))}
              </div>
            )}
            {i === 1 && (
              <div className="h-[5px] w-full rounded-full bg-white/10 overflow-hidden">
                <div data-m-ocr className="h-full w-full bg-cyan-300/80" />
              </div>
            )}
            {i === 2 && (
              <div className="grid grid-cols-2 gap-2">
                {FIELDS.map((f) => (
                  <span key={f.key} data-m-field className="rounded-lg border border-white/14 bg-[#0a0a0a] px-3 py-2 font-mono text-[10.5px] tracking-[0.14em] text-white/70 flex flex-col gap-1">
                    <span>{tr(f.key)}</span>
                    <span data-m-val className="text-white/90">
                      {f.val}
                    </span>
                  </span>
                ))}
              </div>
            )}
            {i === 3 && (
              <div className="flex flex-wrap gap-2">
                {RULES.map((x) => (
                  <span key={x} data-m-rule className="inline-flex items-center gap-2 rounded-lg border border-white/14 bg-[#0a0a0a] px-3 py-2 font-mono text-[10.5px] tracking-[0.14em] text-white/70">
                    {tr(x)}
                    <span data-m-mark className="text-white/90">
                      {tr("OK")}
                    </span>
                  </span>
                ))}
              </div>
            )}
            {i === 4 && (
              <span data-m-review className="inline-block rounded-lg border border-dashed border-white/14 bg-[#0a0a0a] px-3 py-2 font-mono text-[10.5px] tracking-[0.18em] text-white/70">
                {tr("HUMAN REVIEW")}
              </span>
            )}
            {i === 5 && (
              <span data-m-erp className="inline-block rounded-lg border border-white/14 bg-[#0a0a0a] px-3 py-2 font-mono text-[10.5px] tracking-[0.18em] text-white/70">
                ERP
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};
export default DocumentsVisual;
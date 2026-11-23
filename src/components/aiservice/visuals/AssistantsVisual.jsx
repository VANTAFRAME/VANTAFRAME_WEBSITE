import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { translate } from "./translate";
// Assistants visual: "a question answered from company knowledge".
//
// A person asks (QUESTION is typed by a mask that uncovers the line). A corpus of
// document tiles is searched: RETRIEVE sweeps the grid and lights the relevant tiles
// with similarity bars; ACCESS removes what this user may not read; the chosen
// chunks travel into a CONTEXT slot; the MODEL composes the ANSWER from that context
// only, line by line, each line carrying a SOURCE chip that links back to its tile.
// The answer then goes back to the person: the assistant supports, the person reads
// and decides. Cycles are chained and differ deterministically:
//
//   cycle 0  3 chunks, all readable, 4 answer lines
//   cycle 1  4 candidates, ACCESS locks tiles (one candidate dropped), 3 chunks
//   cycle 2  nothing relevant → CONTEXT stays EMPTY → NO SOURCE FOUND (nothing invented)
//   cycle 3  2 chunks, 3 answer lines
//
// Pools (candidates, locks, chunk paths, answer lines) are configured once per cycle;
// the timeline only moves transform / opacity / stroke. No React re-render per frame;
// no timeline for prefers-reduced-motion; pauses off screen / hidden tab; cleaned up
// on unmount.
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const CY = "#67e8f9";
const C = {
  tile: "rgba(255,255,255,0.14)",
  tileWave: "rgba(255,255,255,0.4)",
  used: "rgba(255,255,255,0.6)",
  tag: "rgba(255,255,255,0.6)",
  lineW: "rgba(255,255,255,0.12)",
  weak: "rgba(255,255,255,0.55)",
};
// Geometry
const GX = 40;
const GY = 156;
const tileXY = (i) => ({ x: GX + (i % 8) * 58, y: GY + Math.floor(i / 8) * 44 });
const CTX_CY = [190, 238, 286];
const WORDS = [64, 40, 88, 52, 70, 36];
const QX0 = 112;
const wordEnd = (k) => QX0 + WORDS.slice(0, k).reduce((a, w) => a + w + 14, 0) - 14;
const ANS_W = [380, 330, 270, 150];
// i = tile index, s = similarity, lock = candidate that ACCESS will drop
const VARIANTS = [
  { speed: 1.3, words: 5, cand: [{ i: 11, s: 0.92 }, { i: 5, s: 0.74 }, { i: 22, s: 0.58 }], locked: [], lines: [0, 1, 2, 1], mini: [3, 6, 10], miniLocked: [] },
  {
    speed: 1.35,
    words: 6,
    cand: [{ i: 3, s: 0.9 }, { i: 9, s: 0.82, lock: true }, { i: 14, s: 0.7 }, { i: 20, s: 0.6 }],
    locked: [1, 6, 9, 12, 17, 25, 28, 30],
    lines: [0, 1, 2, 2],
    mini: [1, 7, 12],
    miniLocked: [3, 5, 8, 14],
  },
  { speed: 1.05, words: 4, cand: [{ i: 2, s: 0.14, weak: true }, { i: 13, s: 0.2, weak: true }, { i: 18, s: 0.1, weak: true }, { i: 27, s: 0.17, weak: true }], locked: [], lines: [], none: true, mini: [], miniLocked: [] },
  { speed: 1.2, words: 3, cand: [{ i: 26, s: 0.88 }, { i: 7, s: 0.69 }], locked: [], lines: [0, 1, 0], mini: [4, 11], miniLocked: [] },
];
const Lock = ({ x = 0, y = 0, c = "rgba(255,255,255,0.8)" }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="-4.5" y="-1" width="9" height="7" rx="1.4" fill="none" stroke={c} strokeWidth="1.2" />
    <path d="M-2.8 -1 V-3 a2.8 2.8 0 0 1 5.6 0 V-1" fill="none" stroke={c} strokeWidth="1.2" />
  </g>
);
const AssistantsVisual = ({ caption, a11y, labels = {} }) => {
  const tr = (text) => translate(text, labels);
  const rootRef = useRef(null);
  useEffect(() => {
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
      const dyn = $('[data-id="dyn"]');
      const tiles = $$("[data-tile]");
      const tag = (k) => $(`[data-tag="${k}"]`);
      const tags = { question: tag("question"), corpus: tag("corpus"), retrieve: tag("retrieve"), access: tag("access"), context: tag("context"), answer: tag("answer") };
      const person = { box: $('[data-id="pBox"]'), parts: $$("[data-id=pPart]"), tick: $('[data-id="pTick"]'), name: $('[data-id="pName"]') };
      const qBox = $('[data-id="qBox"]');
      const qCover = $('[data-id="qCover"]');
      const caret = $('[data-id="caret"]');
      const cands = $$("[data-cand]").map((g) => ({ g, hi: g.querySelector("[data-hi]"), track: g.querySelector("[data-track]"), bar: g.querySelector("[data-bar]") }));
      const locks = $$("[data-lockpool]");
      const chunkPaths = $$("[data-chunk-path]");
      const chunkTrails = $$("[data-chunk-trail]");
      const links = $$("[data-link]");
      const chips = $$("[data-chip]").map((g) => ({ g, box: g.querySelector("rect"), txt: g.querySelector("text") }));
      const rows = $$("[data-ctxrow]");
      const empty = $('[data-id="empty"]');
      const ctxBox = $('[data-id="ctxBox"]');
      const model = { box: $('[data-id="modelBox"]'), txt: $$("[data-id=modelTxt]") };
      const ansLines = $$("[data-ans]");
      const badges = $$("[data-badge]");
      const noSrc = $('[data-id="noSrc"]');
      const ansBox = $('[data-id="ansBox"]');
      const packets = $$("[data-packet]");
      const fixedPath = (k) => $(`[data-path="${k}"]`);
      const fixedTrail = (k) => $(`[data-trail="${k}"]`);
      // --- per-cycle configuration (geometry + text; never per frame)
      const configure = (v) => {
        const chosen = v.cand.filter((c) => !c.lock && !c.weak);
        v.cand.forEach((c, k) => {
          const { x, y } = tileXY(c.i);
          gsap.set(cands[k].g, { x, y, display: "block" });
        });
        for (let k = v.cand.length; k < cands.length; k++) gsap.set(cands[k].g, { display: "none" });
        locks.forEach((g, k) => {
          const i = v.locked[k];
          if (i === undefined) return gsap.set(g, { display: "none" });
          const { x, y } = tileXY(i);
          gsap.set(g, { x, y, display: "block" });
        });
        chosen.forEach((c, k) => {
          const { x, y } = tileXY(c.i);
          const d = `M${x + 48} ${y + 17} H536 V${CTX_CY[k]} H594`;
          chunkPaths[k].setAttribute("d", d);
          chunkTrails[k].setAttribute("d", d);
          const lx = x + 24;
          links[k].setAttribute("d", `M${lx} ${y + 34} V334`);
          gsap.set(chips[k].g, { x: x + 7, y: 334 });
        });
        badges.forEach((b, k) => {
          b.textContent = v.lines[k] !== undefined ? `S${v.lines[k] + 1}` : "";
        });
        ansLines.forEach((l, k) => gsap.set(l, { display: v.lines[k] === undefined ? "none" : "block" }));
        return chosen;
      };
      const rest = () => {
        gsap.set(dyn, { opacity: 1 });
        gsap.set(tiles, { stroke: C.tile });
        gsap.set(Object.values(tags), { fill: C.tag });
        gsap.set(person.box, { stroke: "rgba(255,255,255,0.2)" });
        gsap.set(person.parts, { stroke: "rgba(255,255,255,0.6)" });
        gsap.set(person.tick, { strokeDashoffset: 1, opacity: 1 });
        gsap.set(person.name, { fill: "rgba(255,255,255,0.6)" });
        gsap.set(qBox, { stroke: "rgba(255,255,255,0.14)" });
        gsap.set(qCover, { scaleX: 1, svgOrigin: `${QX0 + 534} 0` });
        gsap.set(caret, { opacity: 0, x: 0 });
        cands.forEach((c) => {
          gsap.set(c.hi, { opacity: 0, stroke: CY });
          gsap.set(c.track, { opacity: 0 });
          gsap.set(c.bar, { scaleX: 0, opacity: 1, fill: CY, transformOrigin: "0% 50%" });
        });
        gsap.set(locks, { opacity: 0 });
        chunkTrails.forEach((tr) => gsap.set(tr, { opacity: 0, strokeDashoffset: 100 }));
        gsap.set(links, { opacity: 0, strokeDashoffset: 100 });
        chips.forEach((c) => {
          gsap.set(c.g, { opacity: 0 });
          gsap.set(c.box, { stroke: "rgba(255,255,255,0.3)" });
          gsap.set(c.txt, { fill: "#fff" });
        });
        gsap.set(rows, { opacity: 0, x: -6 });
        gsap.set(empty, { opacity: 0 });
        gsap.set(ctxBox, { stroke: "rgba(255,255,255,0.16)" });
        gsap.set(model.box, { stroke: "rgba(255,255,255,0.18)" });
        gsap.set(model.txt, { fill: "rgba(255,255,255,0.72)" });
        gsap.set(ansLines, { scaleX: 0, opacity: 0.85, transformOrigin: "0% 50%" });
        gsap.set(badges, { opacity: 0 });
        gsap.set(noSrc, { opacity: 0 });
        gsap.set(ansBox, { stroke: "rgba(255,255,255,0.16)" });
        gsap.set(packets, { autoAlpha: 0 });
        ["ctxModel", "modelAns", "ansUser"].forEach((k) => gsap.set(fixedTrail(k), { opacity: 0, strokeDashoffset: 100 }));
      };
      if (reduced) {
        // Static resolved frame: cycle 0 completely answered, nothing moving.
        const v = VARIANTS[0];
        rest();
        const chosen = configure(v);
        gsap.set(qCover, { scaleX: 1 - (wordEnd(v.words) + 8 - QX0) / 540 });
        cands.forEach((c, k) => {
          if (k >= v.cand.length) return;
          gsap.set(c.hi, { opacity: 1, stroke: C.used });
          gsap.set(c.track, { opacity: 1 });
          gsap.set(c.bar, { scaleX: v.cand[k].s, fill: "rgba(255,255,255,0.75)" });
        });
        gsap.set(rows.slice(0, chosen.length), { opacity: 1, x: 0 });
        gsap.set(badges, { opacity: 1 });
        chosen.forEach((_, k) => gsap.set(links[k], { opacity: 0.6, strokeDashoffset: 0 }));
        chips.slice(0, chosen.length).forEach((c) => gsap.set(c.g, { opacity: 1 }));
        gsap.set(person.tick, { strokeDashoffset: 0 });
        ansLines.forEach((l, k) => gsap.set(l, { scaleX: ANS_W[k] / 380 }));
        return () => {};
      }
      // A small packet travelling along an SVG path (point-at-length, as in HeroVisual).
      const travel = (p, tr, pk, dur, ease = "power1.inOut") => {
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
            const a = p.getPointAtLength(st.v * len);
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
      const build = (v) => {
        const t = gsap.timeline({ paused: !(visible && !tabHidden), onComplete: nextCycle(build) });
        t.timeScale(v.speed);
        rest();
        const chosen = configure(v);
        let c = 0.5;
        // ---- QUESTION: the person asks; a mask uncovers the typed line --------
        const fullW = 540;
        const endFrac = (wordEnd(v.words) + 8 - QX0) / fullW;
        const typeDur = 0.3 * v.words;
        tagOn(t, "question", c);
        t.to(person.box, { stroke: "rgba(103,232,249,0.85)", duration: 0.25 }, c)
          .to(person.parts, { stroke: CY, duration: 0.25 }, c)
          .to(qBox, { stroke: "rgba(103,232,249,0.5)", duration: 0.25 }, c)
          .set(caret, { opacity: 1, x: QX0 - 4 }, c + 0.2)
          .to(qCover, { scaleX: 1 - endFrac, duration: typeDur, ease: `steps(${v.words * 3})` }, c + 0.2)
          .to(caret, { x: QX0 - 4 + endFrac * fullW, duration: typeDur, ease: `steps(${v.words * 3})` }, c + 0.2);
        c += 0.2 + typeDur + 0.2;
        t.to(caret, { opacity: 0, duration: 0.2 }, c)
          .to(person.box, { stroke: "rgba(255,255,255,0.2)", duration: 0.4 }, c)
          .to(person.parts, { stroke: "rgba(255,255,255,0.6)", duration: 0.4 }, c)
          .to(qBox, { stroke: "rgba(255,255,255,0.14)", duration: 0.4 }, c);
        tagOff(t, "question", c);
        c += 0.3;
        // ---- RETRIEVE: a search wave crosses the corpus, candidates light up ---
        tagOn(t, "retrieve", c);
        t.to(tiles, { stroke: C.tileWave, duration: 0.25, stagger: { each: 0.025, from: "start" } }, c)
          .to(tiles, { stroke: C.tile, duration: 0.4, stagger: { each: 0.025, from: "start" } }, c + 0.25);
        c += 1.3;
        v.cand.forEach((cd, k) => {
          const at = c + k * 0.22;
          const col = cd.weak ? C.weak : CY;
          t.set(cands[k].hi, { stroke: col }, at)
            .to(cands[k].hi, { opacity: 1, duration: 0.2 }, at)
            .to(cands[k].track, { opacity: 1, duration: 0.2 }, at)
            .set(cands[k].bar, { fill: cd.weak ? C.weak : CY }, at)
            .to(cands[k].bar, { scaleX: cd.s, duration: 0.6, ease: "power2.out" }, at + 0.1);
        });
        c += v.cand.length * 0.22 + 0.7;
        tagOff(t, "retrieve", c);
        // ---- ACCESS: only what this user may read stays in play ---------------
        tagOn(t, "access", c);
        if (v.locked.length) {
          t.to(locks, { opacity: 1, duration: 0.25, stagger: 0.07 }, c + 0.15);
          v.cand.forEach((cd, k) => {
            if (!cd.lock) return;
            t.to(cands[k].bar, { scaleX: 0, duration: 0.4 }, c + 0.5)
              .to(cands[k].hi, { opacity: 0, duration: 0.3 }, c + 0.5)
              .to(cands[k].track, { opacity: 0, duration: 0.3 }, c + 0.5);
          });
          c += 1.5;
        } else {
          c += 0.9;
        }
        tagOff(t, "access", c);
        c += 0.2;
        // ---- CONTEXT: chosen chunks flow into the slot -------------------------
        tagOn(t, "context", c);
        if (v.none) {
          // nothing passed the threshold: weak bars fade, the slot stays empty
          t.to(ctxBox, { stroke: "rgba(255,255,255,0.4)", duration: 0.3 }, c)
            .to(empty, { opacity: 1, duration: 0.3 }, c + 0.2)
            .to(cands.map((x) => x.hi), { opacity: 0, duration: 0.5 }, c + 0.2)
            .to(cands.map((x) => x.track), { opacity: 0, duration: 0.5 }, c + 0.2)
            .to(cands.map((x) => x.bar), { scaleX: 0, duration: 0.5 }, c + 0.2);
          c += 1.2;
        } else {
          t.to(ctxBox, { stroke: "rgba(103,232,249,0.5)", duration: 0.3 }, c);
          chosen.forEach((cd, k) => {
            const kk = v.cand.indexOf(cd);
            const at = c + k * 0.35;
            t.add(travel(chunkPaths[k], chunkTrails[k], packets[k], 0.7), at);
            t.to(rows[k], { opacity: 1, x: 0, duration: 0.3 }, at + 0.65)
              .to(chunkTrails[k], { opacity: 0, duration: 0.5 }, at + 0.8)
              .to(cands[kk].hi, { stroke: C.used, duration: 0.4 }, at + 0.7)
              .to(cands[kk].bar, { fill: "rgba(255,255,255,0.75)", duration: 0.4 }, at + 0.7);
          });
          c += (chosen.length - 1) * 0.35 + 1.0;
          t.to(ctxBox, { stroke: "rgba(255,255,255,0.3)", duration: 0.4 }, c);
        }
        tagOff(t, "context", c);
        // ---- MODEL composes ONLY from context; then ANSWER builds line by line -
        const modelOn = (at) =>
          t.to(model.box, { stroke: "rgba(103,232,249,0.85)", duration: 0.25 }, at).to(model.txt, { fill: "#fff", duration: 0.25 }, at);
        const modelOff = (at) =>
          t.to(model.box, { stroke: "rgba(255,255,255,0.18)", duration: 0.5 }, at).to(model.txt, { fill: "rgba(255,255,255,0.72)", duration: 0.5 }, at);
        if (v.none) {
          // no context reaches the model, so nothing is composed: an explicit token instead
          c += 0.2;
          tagOn(t, "answer", c);
          t.to(ansBox, { stroke: "rgba(103,232,249,0.5)", duration: 0.3 }, c)
            .to(noSrc, { opacity: 1, duration: 0.4 }, c + 0.3)
            .to(ansBox, { stroke: "rgba(255,255,255,0.3)", duration: 0.5 }, c + 1.2);
          tagOff(t, "answer", c + 1.2);
          c += 1.9;
        } else {
          t.add(travel(fixedPath("ctxModel"), fixedTrail("ctxModel"), packets[0], 0.6), c);
          modelOn(c + 0.55);
          t.to(fixedTrail("ctxModel"), { opacity: 0, duration: 0.5 }, c + 0.8);
          c += 0.9;
          t.add(travel(fixedPath("modelAns"), fixedTrail("modelAns"), packets[1], 0.45), c);
          tagOn(t, "answer", c + 0.4);
          t.to(ansBox, { stroke: "rgba(103,232,249,0.5)", duration: 0.3 }, c + 0.4)
            .to(fixedTrail("modelAns"), { opacity: 0, duration: 0.5 }, c + 0.8);
          c += 0.6;
          const seen = new Set();
          v.lines.forEach((src, k) => {
            const at = c + k * 0.42;
            t.to(ansLines[k], { scaleX: ANS_W[k] / 380, duration: 0.45, ease: "power2.inOut" }, at)
              .to(badges[k], { opacity: 1, duration: 0.25 }, at + 0.35);
            if (!seen.has(src)) {
              seen.add(src);
              // SOURCE chip points back at the tile the line was composed from
              t.to(links[src], { opacity: 1, strokeDashoffset: 0, duration: 0.45, ease: "power2.out" }, at + 0.3)
                .to(chips[src].g, { opacity: 1, duration: 0.25 }, at + 0.55)
                .to(links[src], { opacity: 0.45, duration: 0.5 }, at + 1.0);
            }
          });
          c += v.lines.length * 0.42 + 0.8;
          modelOff(c - 0.4);
          tagOff(t, "answer", c);
          t.to(ansBox, { stroke: "rgba(255,255,255,0.3)", duration: 0.4 }, c);
        }
        // ---- the answer goes back to the person, who reads and decides --------
        if (!v.none) {
          t.add(travel(fixedPath("ansUser"), fixedTrail("ansUser"), packets[2], 1.0, "power1.inOut"), c);
          c += 1.0;
        } else {
          c += 0.1;
        }
        t.to(person.box, { stroke: "rgba(103,232,249,0.85)", duration: 0.25 }, c)
          .to(person.parts, { stroke: CY, duration: 0.25 }, c)
          .to(person.tick, { strokeDashoffset: v.none ? 1 : 0, duration: 0.4, ease: "power2.out" }, c + 0.2)
          .to(fixedTrail("ansUser"), { opacity: 0, duration: 0.5 }, c + 0.2);
        c += 1.5;
        t.to(person.box, { stroke: "rgba(255,255,255,0.2)", duration: 0.5 }, c)
          .to(person.parts, { stroke: "rgba(255,255,255,0.6)", duration: 0.5 }, c);
        // ---- smooth reset ------------------------------------------------------
        t.to(dyn, { opacity: 0, duration: 0.7, ease: "power1.inOut" }, c + 0.4)
          .to(person.tick, { opacity: 0, duration: 0.4 }, c + 0.4)
          .to({}, { duration: 0.4 }, c + 1.1);
        return t;
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
      const stages = $$("[data-m-stage]");
      const dots = $$("[data-m-dot]");
      const fills = $$("[data-m-fill]");
      const labels = $$("[data-m-label]");
      const cover = $("[data-m-qcover]");
      const personIcon = $$("[data-m-person]");
      const minis = $$("[data-m-mini]");
      const accessChip = $("[data-m-access]");
      const ctxChips = $$("[data-m-ctx]");
      const ansBars = $$("[data-m-ans]");
      const srcChips = $$("[data-m-src]");
      const noSrc = $("[data-m-nosrc]");
      const userChip = $("[data-m-user]");
      const ALLCH = [accessChip, ...ctxChips, ...srcChips, noSrc, userChip];
      const chipRest = { borderColor: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.7)", backgroundColor: "#0a0a0a" };
      const chipOn = { borderColor: "rgba(103,232,249,0.85)", color: "#ffffff", backgroundColor: "rgba(103,232,249,0.08)" };
      const chipDone = { borderColor: "rgba(255,255,255,0.32)", color: "rgba(255,255,255,0.9)", backgroundColor: "#0a0a0a" };
      const miniRest = { borderColor: "rgba(255,255,255,0.14)", backgroundColor: "#0a0a0a", opacity: 1 };
      const rest = () => {
        gsap.set(ALLCH, chipRest);
        gsap.set(ALLCH, { opacity: 0.72 });
        gsap.set(minis, miniRest);
        gsap.set(ansBars, { scaleX: 0, transformOrigin: "0% 50%" });
        gsap.set(cover, { scaleX: 1, transformOrigin: "100% 50%" });
        gsap.set(fills, { scaleY: 0, transformOrigin: "50% 0%" });
        gsap.set(dots, { backgroundColor: "rgba(255,255,255,0.3)", scale: 1 });
        gsap.set(labels, { color: "rgba(255,255,255,0.62)" });
        gsap.set(personIcon, { stroke: "rgba(255,255,255,0.6)" });
      };
      if (reduced) {
        rest();
        const v = VARIANTS[0];
        gsap.set(cover, { scaleX: 0.15 });
        gsap.set(ALLCH, { opacity: 1 });
        gsap.set(noSrc, { opacity: 0 });
        v.mini.forEach((i) => gsap.set(minis[i], { borderColor: "rgba(255,255,255,0.6)", backgroundColor: "rgba(255,255,255,0.35)" }));
        gsap.set(ansBars, { scaleX: 1 });
        gsap.set(fills, { scaleY: 1 });
        gsap.set(dots, { backgroundColor: "rgba(103,232,249,0.9)" });
        return () => {};
      }
      const stageOn = (t, i, at) =>
        t.to(dots[i], { backgroundColor: "rgba(103,232,249,0.95)", scale: 1.35, duration: 0.25 }, at).to(labels[i], { color: "#fff", duration: 0.25 }, at);
      const stageDone = (t, i, at) =>
        t.to(dots[i], { backgroundColor: "rgba(255,255,255,0.62)", scale: 1, duration: 0.4 }, at).to(labels[i], { color: "rgba(255,255,255,0.62)", duration: 0.4 }, at);
      const line = (t, i, at, d = 0.5) => t.to(fills[i], { scaleY: 1, duration: d, ease: "power1.inOut" }, at);
      const on = (t, el, at) => t.to(el, { ...chipOn, opacity: 1, duration: 0.25 }, at);
      const done = (t, el, at) => t.to(el, { ...chipDone, opacity: 1, duration: 0.4 }, at);
      const build = (v) => {
        const t = gsap.timeline({ paused: !(visible && !tabHidden), onComplete: nextCycle(build) });
        t.timeScale(v.speed);
        rest();
        const nChosen = v.none ? 0 : v.cand.filter((c) => !c.lock).length;
        // chips beyond what this cycle uses stay hidden
        gsap.set(ctxChips.slice(nChosen), { display: "none" });
        gsap.set(ctxChips.slice(0, nChosen), { display: "inline-flex" });
        const used = new Set(v.lines);
        srcChips.forEach((el, k) => gsap.set(el, { display: used.has(k) && !v.none ? "inline-flex" : "none" }));
        gsap.set(noSrc, { display: v.none ? "inline-flex" : "none" });
        gsap.set(ansBars, { display: (i) => (!v.none && i < v.lines.length ? "block" : "none") });
        let c = 0.4;
        stageOn(t, 0, c);
        t.to(personIcon, { stroke: CY, duration: 0.25 }, c)
          .to(cover, { scaleX: 1 - (0.2 + 0.13 * v.words), duration: 0.3 * v.words, ease: `steps(${v.words * 3})` }, c + 0.2);
        c += 0.2 + 0.3 * v.words + 0.2;
        t.to(personIcon, { stroke: "rgba(255,255,255,0.6)", duration: 0.4 }, c);
        line(t, 0, c);
        stageDone(t, 0, c + 0.3);
        c += 0.3;
        stageOn(t, 1, c);
        v.cand.forEach((cd, k) => {
          const el = minis[v.mini[k] ?? -1];
          if (!el) return;
          t.to(el, { borderColor: cd.weak ? "rgba(255,255,255,0.5)" : "rgba(103,232,249,0.85)", backgroundColor: cd.weak ? "rgba(255,255,255,0.25)" : "rgba(103,232,249,0.35)", duration: 0.3 }, c + 0.2 + k * 0.25);
        });
        // weak candidates (no source) light a few squares in grey
        if (v.none) [2, 7, 10].forEach((i, k) => t.to(minis[i], { borderColor: "rgba(255,255,255,0.5)", backgroundColor: "rgba(255,255,255,0.22)", duration: 0.3 }, c + 0.2 + k * 0.25));
        c += 1.4;
        on(t, accessChip, c);
        v.miniLocked.forEach((i, k) => t.to(minis[i], { opacity: 0.2, borderColor: "rgba(255,255,255,0.08)", duration: 0.3 }, c + 0.2 + k * 0.1));
        done(t, accessChip, c + 0.9);
        c += 1.0;
        line(t, 1, c);
        stageDone(t, 1, c + 0.3);
        c += 0.3;
        stageOn(t, 2, c);
        if (v.none) {
          t.to({}, { duration: 0.8 }, c);
          c += 1.0;
        } else {
          for (let k = 0; k < nChosen; k++) {
            on(t, ctxChips[k], c + 0.2 + k * 0.4);
            done(t, ctxChips[k], c + 0.2 + k * 0.4 + 0.6);
          }
          c += 0.3 + nChosen * 0.4 + 0.5;
        }
        line(t, 2, c);
        stageDone(t, 2, c + 0.3);
        c += 0.3;
        stageOn(t, 3, c);
        if (v.none) {
          on(t, noSrc, c + 0.2);
          done(t, noSrc, c + 1.6);
          c += 1.9;
        } else {
          v.lines.forEach((src, k) => {
            t.to(ansBars[k], { scaleX: 1, duration: 0.4, ease: "power2.inOut" }, c + 0.2 + k * 0.4);
          });
          [...used].forEach((src, k) => {
            on(t, srcChips[src], c + 0.5 + k * 0.4);
            done(t, srcChips[src], c + 1.1 + k * 0.4);
          });
          c += 0.4 + v.lines.length * 0.4 + 0.9;
          t.to(personIcon, { stroke: CY, duration: 0.25 }, c);
          on(t, userChip, c);
          t.to(personIcon, { stroke: "rgba(255,255,255,0.6)", duration: 0.5 }, c + 1.2);
          done(t, userChip, c + 1.2);
          c += 1.6;
        }
        stageDone(t, 3, c);
        t.to([...ALLCH, ...minis], { ...chipRest, opacity: 0.72, duration: 0.6 }, c + 0.3)
          .to(minis, { ...miniRest, duration: 0.6 }, c + 0.3)
          .to(ansBars, { scaleX: 0, duration: 0.6 }, c + 0.3)
          .to(cover, { scaleX: 1, duration: 0.6 }, c + 0.3)
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
  const Tag = ({ k, x, y, children }) => (
    <text data-tag={k} x={x} y={y} fontSize="11" letterSpacing="3" fill={C.tag} style={{ fontFamily: MONO }}>
      {children}
    </text>
  );
  const PATHS = {
    ctxModel: "M720 322 V424",
    modelAns: "M620 456 H560",
    ansUser: "M40 474 H20 V76 H33",
  };
  const qBars = (() => {
    let x = QX0;
    return WORDS.map((w) => {
      const r = { x, w };
      x += w + 14;
      return r;
    });
  })();
  return (
    <div ref={rootRef} className="av-root rounded-xl border border-white/10 bg-black overflow-hidden">
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
        {/* person: the one who reads and decides */}
        <g>
          <rect data-id="pBox" x="34" y="56" width="36" height="42" rx="9" fill="#0a0a0a" stroke="rgba(255,255,255,0.2)" />
          <circle data-id="pPart" cx="52" cy="71" r="6.5" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" />
          <path data-id="pPart" d="M40 92 c1.5 -10 6.5 -13 12 -13 s10.5 3 12 13" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" strokeLinecap="round" />
          <path data-id="pTick" d="M75 80 l3.4 3.4 l6.6 -7.4" pathLength="1" fill="none" stroke={CY} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset="1" />
          <text data-id="pName" x="52" y="114" textAnchor="middle" fontSize="11" letterSpacing="2" fill="rgba(255,255,255,0.6)" style={{ fontFamily: MONO }}>
            {tr("USER")}
          </text>
        </g>
        {/* question */}
        <Tag k="question" x="92" y="48">
          {tr("QUESTION")}
        </Tag>
        <rect data-id="qBox" x="92" y="58" width="768" height="42" rx="10" fill="#0a0a0a" stroke="rgba(255,255,255,0.14)" />
        {qBars.map((b, i) => (
          <rect key={i} x={b.x} y="76" width={b.w} height="6" rx="3" fill="rgba(255,255,255,0.58)" />
        ))}
        <rect data-id="qCover" x={QX0 - 6} y="62" width="540" height="34" fill="#0a0a0a" />
        <rect data-id="caret" x="0" y="68" width="1.6" height="22" fill={CY} opacity="0" />
        {/* corpus */}
        <Tag k="corpus" x="40" y="140">
          {tr("CORPUS")}
        </Tag>
        <Tag k="retrieve" x="140" y="140">
          {tr("RETRIEVE")}
        </Tag>
        <Tag k="access" x="262" y="140">
          {tr("ACCESS")}
        </Tag>
        {Array.from({ length: 32 }, (_, i) => {
          const { x, y } = tileXY(i);
          return (
            <g key={i}>
              <rect data-tile x={x} y={y} width="48" height="34" rx="5" fill="#0a0a0a" stroke={C.tile} />
              <rect x={x + 7} y={y + 7} width="28" height="2.5" rx="1.2" fill={C.lineW} />
              <rect x={x + 7} y={y + 13} width="18" height="2.5" rx="1.2" fill={C.lineW} />
            </g>
          );
        })}
        {/* fixed connections */}
        {Object.entries(PATHS).map(([k, d]) => (
          <g key={k}>
            <path data-path={k} d={d} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" strokeDasharray={k === "ansUser" ? "4 5" : undefined} />
            <path data-trail={k} d={d} pathLength="100" fill="none" stroke={CY} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="100" strokeDashoffset="100" opacity="0" />
          </g>
        ))}
        {/* context */}
        <Tag k="context" x="580" y="140">
          {tr("CONTEXT")}
        </Tag>
        <rect data-id="ctxBox" x="580" y="156" width="280" height="166" rx="12" fill="none" stroke="rgba(255,255,255,0.16)" strokeDasharray="4 4" />
        {CTX_CY.map((cy, k) => (
          <g key={k} data-ctxrow>
            <rect x="594" y={cy - 20} width="252" height="40" rx="7" fill="#0a0a0a" stroke="rgba(255,255,255,0.3)" />
            <text x="608" y={cy + 4} fontSize="11" letterSpacing="2" fill="rgba(255,255,255,0.8)" style={{ fontFamily: MONO }}>
              {`C${k + 1}`}
            </text>
            <rect x="646" y={cy - 7} width={150 - k * 18} height="3" rx="1.5" fill="rgba(255,255,255,0.4)" />
            <rect x="646" y={cy + 3} width={96 + k * 10} height="3" rx="1.5" fill="rgba(255,255,255,0.28)" />
          </g>
        ))}
        <text data-id="empty" x="720" y="244" textAnchor="middle" fontSize="11" letterSpacing="3" fill="rgba(255,255,255,0.7)" opacity="0" style={{ fontFamily: MONO }}>
          {tr("EMPTY")}
        </text>
        {/* model */}
        <g>
          <rect data-id="modelBox" x="620" y="424" width="200" height="64" rx="12" fill="#0a0a0a" stroke="rgba(255,255,255,0.18)" />
          <text data-id="modelTxt" x="720" y="451" textAnchor="middle" fontSize="11" letterSpacing="3" fill="rgba(255,255,255,0.72)" style={{ fontFamily: MONO }}>
            {tr("MODEL")}
          </text>
          <text data-id="modelTxt" x="720" y="472" textAnchor="middle" fontSize="11" letterSpacing="2" fill="rgba(255,255,255,0.72)" style={{ fontFamily: MONO }}>
            {tr("CONTEXT ONLY")}
          </text>
        </g>
        {/* answer */}
        <Tag k="answer" x="40" y="392">
          {tr("ANSWER")}
        </Tag>
        <rect data-id="ansBox" x="40" y="404" width="520" height="140" rx="12" fill="#0a0a0a" stroke="rgba(255,255,255,0.16)" />
        {[0, 1, 2, 3].map((k) => (
          <rect key={k} data-ans x="58" y={428 + k * 26} width="380" height="6" rx="3" fill="rgba(255,255,255,0.7)" />
        ))}
        {[0, 1, 2, 3].map((k) => (
          <text key={k} data-badge x="500" y={436 + k * 26} fontSize="11" letterSpacing="1" fill="rgba(255,255,255,0.8)" style={{ fontFamily: MONO }}>
            S1
          </text>
        ))}
        <text data-id="noSrc" x="58" y="480" fontSize="14" letterSpacing="4" fill="rgba(255,255,255,0.92)" opacity="0" style={{ fontFamily: MONO }}>
          {tr("NO SOURCE FOUND")}
        </text>
        {/* dynamic overlays (faded out at reset) */}
        <g data-id="dyn">
          {[0, 1, 2, 3].map((k) => (
            <g key={k} data-cand style={{ display: "none" }}>
              <rect data-hi x="0" y="0" width="48" height="34" rx="5" fill="none" stroke={CY} strokeWidth="1.2" opacity="0" />
              <rect data-track x="7" y="25" width="34" height="2.5" rx="1.2" fill="rgba(255,255,255,0.14)" opacity="0" />
              <rect data-bar x="7" y="25" width="34" height="2.5" rx="1.2" fill={CY} />
            </g>
          ))}
          {Array.from({ length: 9 }, (_, k) => (
            <g key={k} data-lockpool opacity="0" style={{ display: "none" }}>
              <rect x="0" y="0" width="48" height="34" rx="5" fill="#000" fillOpacity="0.7" stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
              <Lock x={24} y={14} />
            </g>
          ))}
          {[0, 1, 2].map((k) => (
            <g key={k}>
              <path data-chunk-path d="M0 0" fill="none" stroke="none" />
              <path data-chunk-trail d="M0 0" pathLength="100" fill="none" stroke={CY} strokeWidth="1.4" strokeLinecap="round" strokeDasharray="100" strokeDashoffset="100" opacity="0" />
              <path data-link d="M0 0" pathLength="100" fill="none" stroke={CY} strokeWidth="1.2" strokeLinecap="round" strokeDasharray="100" strokeDashoffset="100" opacity="0" />
              <g data-chip opacity="0">
                <rect x="0" y="0" width="34" height="20" rx="6" fill="#0a0a0a" stroke="rgba(255,255,255,0.3)" />
                <text x="17" y="14" textAnchor="middle" fontSize="11" letterSpacing="1" fill="#fff" style={{ fontFamily: MONO }}>
                  {`S${k + 1}`}
                </text>
              </g>
            </g>
          ))}
          {[0, 1, 2].map((i) => (
            <g key={i} data-packet={i} opacity="0">
              <rect x="-6" y="-2.5" width="12" height="5" rx="1.6" fill={CY} />
            </g>
          ))}
        </g>
      </svg>
      {/* ---------- < md : vertical flow (same cycle, simplified) ---------- */}
      <div className="md:hidden px-5 py-6" aria-hidden="true">
        <div className="flex items-center gap-3 mb-6">
          <svg viewBox="0 0 24 28" className="w-7 h-8 shrink-0" fill="none" aria-hidden="true">
            <circle data-m-person cx="12" cy="9" r="5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" />
            <path data-m-person d="M3 26 c1.5 -8 5 -10 9 -10 s7.5 2 9 10" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <div className="relative flex-1 h-10 rounded-lg border border-white/14 bg-[#0a0a0a] overflow-hidden flex items-center gap-[7px] px-3">
            {WORDS.map((w, i) => (
              <span key={i} className="block h-[5px] rounded-full bg-white/55" style={{ width: `${w * 0.6}px` }} />
            ))}
            <span data-m-qcover className="absolute inset-0 bg-[#0a0a0a]" />
          </div>
        </div>
        <ol>
          {["QUESTION", "RETRIEVE", "CONTEXT", "ANSWER"].map((label, i) => (
            <li key={label} data-m-stage={i} className="relative pl-6 pb-6 last:pb-0">
              {i < 3 && (
                <span className="absolute left-[3px] top-3 bottom-[-4px] w-px bg-white/15 overflow-hidden">
                  <span data-m-fill className="block h-full w-full bg-cyan-300/70" />
                </span>
              )}
              <span data-m-dot className="absolute left-0 top-[6px] h-[7px] w-[7px] rounded-full bg-white/30" />
              <p data-m-label className="font-mono text-[10px] tracking-[0.3em] text-white/60 mb-2">
                {tr(label)}
              </p>
              {i === 0 && <p className="font-mono text-[10.5px] tracking-[0.18em] text-white/60">{tr("USER")}</p>}
              {i === 1 && (
                <div>
                  <div className="grid grid-cols-8 gap-1.5 mb-3">
                    {Array.from({ length: 16 }, (_, k) => (
                      <span key={k} data-m-mini className="block h-6 rounded-[5px] border border-white/14 bg-[#0a0a0a]" />
                    ))}
                  </div>
                  <span data-m-access className="inline-flex items-center rounded-lg border border-white/14 bg-[#0a0a0a] px-3 py-2 font-mono text-[10.5px] tracking-[0.18em] text-white/70">
                    {tr("ACCESS")}
                  </span>
                </div>
              )}
              {i === 2 && (
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((n) => (
                    <span key={n} data-m-ctx className="rounded-lg border border-white/14 bg-[#0a0a0a] px-3 py-2 font-mono text-[10.5px] tracking-[0.18em] text-white/70">{tr(`CHUNK ${n}`)}</span>
                  ))}
                </div>
              )}
              {i === 3 && (
                <div>
                  <div className="mb-3 space-y-2">
                    {[100, 86, 70, 40].map((w, k) => (
                      <span key={k} data-m-ans className="block h-[5px] rounded-full bg-white/65" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map((n, k) => (
                      <span key={n} data-m-src className="rounded-lg border border-white/14 bg-[#0a0a0a] px-3 py-2 font-mono text-[10.5px] tracking-[0.18em] text-white/70">{`S${n}`}</span>
                    ))}
                    <span data-m-nosrc className="rounded-lg border border-white/14 bg-[#0a0a0a] px-3 py-2 font-mono text-[10.5px] tracking-[0.18em] text-white/70" style={{ display: "none" }}>
                      {tr("NO SOURCE FOUND")}
                    </span>
                    <span data-m-user className="inline-flex items-center rounded-lg border border-white/14 bg-[#0a0a0a] px-3 py-2 font-mono text-[10.5px] tracking-[0.18em] text-white/70">
                      {tr("USER")}
                    </span>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
export default AssistantsVisual;
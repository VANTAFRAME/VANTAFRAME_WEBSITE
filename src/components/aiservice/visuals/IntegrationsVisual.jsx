import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { translate } from "./translate";
// Integrations visual: a SEQUENCE DIAGRAM — time flows downward, one message per row.
//
// Lifelines: AI MODEL | INTEGRATION LAYER | CRM | ERP | DB. Messages are drawn one
// after another (a message can only start after the previous one has landed), each
// with a small packet travelling along it. A MONITOR strip at the bottom records a
// tick per event while a cursor moves through time. Cycles are chained and differ:
//
//   cycle 0  REQUEST → AUTH ok → QUERY → RESPONSE → RESULT, then WEBHOOK (ERP) → SYNC (DB)
//   cycle 1  REQUEST → AUTH DENIED → REJECT (no data leaves), then WEBHOOK → SYNC
//   cycle 2  as 0 but the first QUERY times out → TIMEOUT → RETRY → RESPONSE …
//   cycle 3  the ERP WEBHOOK arrives first → SYNC, then the AI request path
//
// The SVG holds a pool of 9 message "slots" that is configured once per cycle (path
// geometry + label text, never per frame). The timeline only animates stroke offset,
// transform and opacity. No React state updates; the timeline is not created for
// prefers-reduced-motion (one static, resolved frame instead), pauses off screen and
// in a hidden tab, and is torn down on unmount.
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const CY = "#67e8f9";
const C = {
  boxRest: "rgba(255,255,255,0.18)",
  boxOn: "rgba(103,232,249,0.85)",
  nameRest: "rgba(255,255,255,0.72)",
  life: "rgba(255,255,255,0.13)",
  done: "rgba(255,255,255,0.45)",
  doneHead: "rgba(255,255,255,0.7)",
  lbl: "rgba(255,255,255,0.74)",
  tick: "rgba(255,255,255,0.2)",
  tickOn: "rgba(255,255,255,0.7)",
};
const LANES = [
  { x: 100, w: 112, name: "AI MODEL", short: "AI" },
  { x: 290, w: 156, name: "INTEGRATION LAYER", short: "LAYER" },
  { x: 470, w: 76, name: "CRM", short: "CRM" },
  { x: 630, w: 76, name: "ERP", short: "ERP" },
  { x: 790, w: 76, name: "DB", short: "DB" },
];
const MAX = 9;
const M = (f, t, l, extra) => ({ k: "msg", f, t, l, ...extra });
const AUTH_OK = { k: "auth", ok: true };
const AUTH_NO = { k: "auth", ok: false };
const TAIL = [M(3, 1, "WEBHOOK"), M(1, 4, "SYNC")];
const VARIANTS = [
  { speed: 1.05, entries: [M(0, 1, "REQUEST"), AUTH_OK, M(1, 2, "QUERY"), M(2, 1, "RESPONSE", { ret: 1 }), M(1, 0, "RESULT", { ret: 1 }), ...TAIL] },
  { speed: 1, entries: [M(0, 1, "REQUEST"), AUTH_NO, M(1, 0, "REJECT", { ret: 1, err: 1 }), ...TAIL] },
  {
    speed: 1.2,
    entries: [M(0, 1, "REQUEST"), AUTH_OK, M(1, 2, "QUERY"), { k: "note", l: "TIMEOUT", err: 1 }, M(1, 2, "RETRY"), M(2, 1, "RESPONSE", { ret: 1 }), M(1, 0, "RESULT", { ret: 1 }), ...TAIL],
  },
  { speed: 1.05, entries: [...TAIL, M(0, 1, "REQUEST"), AUTH_OK, M(1, 2, "QUERY"), M(2, 1, "RESPONSE", { ret: 1 }), M(1, 0, "RESULT", { ret: 1 })] },
];
// Pure scheduling shared by the desktop SVG and the mobile list (same cycle).
const schedule = (entries) => {
  let at = 0.5;
  const items = entries.map((e) => {
    const dur = e.k === "msg" ? 0.95 : e.k === "auth" ? (e.ok ? 1.25 : 1.8) : 1.5;
    const it = { at, dur };
    at += dur + 0.4;
    return it;
  });
  return { items, end: at + 0.3 };
};
const rowYs = (n) => {
  const step = n >= 9 ? 40 : n >= 7 ? 52 : 64;
  return Array.from({ length: n }, (_, i) => 128 + i * step);
};
const TICKS = 36;
const tickX = (i) => 150 + i * 20;
const IntegrationsVisual = ({ caption, a11y, labels = {} }) => {
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
      const hdr = $$("[data-hdr]").map((g) => ({ box: g.querySelector("rect"), txt: g.querySelector("text") }));
      const dyn = $('[data-id="dyn"]');
      const slots = $$("[data-slot]").map((g) => ({
        g,
        base: g.querySelector("[data-base]"),
        trail: g.querySelector("[data-trail]"),
        head: g.querySelector("[data-head]"),
        lbl: g.querySelector("[data-lbl]"),
        pk: g.querySelector("[data-pk]"),
      }));
      const lock = {
        g: $('[data-id="lock"]'),
        body: $('[data-id="lockBody"]'),
        shut: $('[data-id="shackleShut"]'),
        open: $('[data-id="shackleOpen"]'),
        tag: $('[data-id="authTag"]'),
        cross: $('[data-id="authCross"]'),
      };
      const evTicks = $$("[data-evtick]");
      const beat = $$("[data-beat]");
      const cursor = $('[data-id="cursor"]');
      // Configure slot geometry + text for one variant (build time only).
      const configure = (entries) => {
        const ys = rowYs(entries.length);
        slots.forEach((s, i) => {
          const e = entries[i];
          gsap.set(s.g, { display: e ? "block" : "none" });
          if (!e) return;
          const y = ys[i];
          let d;
          let lx;
          let dir = 1;
          let x1;
          let x2;
          if (e.k === "msg") {
            x1 = LANES[e.f].x;
            x2 = LANES[e.t].x;
            dir = Math.sign(x2 - x1);
            d = `M${x1} ${y} H${x2}`;
            lx = Math.min(x1, x2) + 12;
            s.head.setAttribute("d", `M${x2 - dir * 7} ${y - 3.5} L${x2} ${y} L${x2 - dir * 7} ${y + 3.5}`);
            s.lbl.textContent = tr(e.l);
            s.lbl.setAttribute("x", lx);
          } else if (e.k === "note") {
            x1 = LANES[1].x + 8;
            x2 = x1 + 84;
            d = `M${x1} ${y} H${x2}`;
            s.head.setAttribute("d", "");
            s.lbl.textContent = tr(e.l);
            s.lbl.setAttribute("x", x2 + 12);
          } else {
            x1 = x2 = LANES[1].x;
            d = "";
            s.head.setAttribute("d", "");
            s.lbl.textContent = tr("AUTH");
            s.lbl.setAttribute("x", LANES[1].x + 42);
          }
          s.lbl.setAttribute("y", e.k === "msg" ? y - 8 : y + 4);
          s.base.setAttribute("d", d);
          s.trail.setAttribute("d", d);
          if (e.ret || e.k === "note") s.base.setAttribute("stroke-dasharray", "5 5");
          else s.base.removeAttribute("stroke-dasharray");
          s.x1 = x1;
          s.x2 = x2;
          s.y = y;
          gsap.set(s.pk, { x: x1, y, opacity: 0 });
          if (e.k === "auth") {
            gsap.set(lock.g, { x: LANES[1].x + 20, y: y - 4 });
            lock.tag.setAttribute("x", LANES[1].x + 96);
            lock.tag.setAttribute("y", y + 4);
            lock.tag.textContent = tr(e.ok ? "OK" : "DENIED");
            lock.cross.setAttribute("transform", `translate(${LANES[1].x + 82} ${y - 1})`);
          }
        });
      };
      const rest = () => {
        gsap.set(dyn, { opacity: 1, y: 0 });
        gsap.set(hdr.map((h) => h.box), { stroke: C.boxRest });
        gsap.set(hdr.map((h) => h.txt), { fill: C.nameRest });
        slots.forEach((s) => {
          gsap.set([s.base, s.head, s.lbl], { opacity: 0 });
          gsap.set(s.lbl, { fill: "#fff" });
          gsap.set(s.base, { stroke: C.done });
          gsap.set(s.head, { stroke: C.doneHead });
          gsap.set(s.trail, { opacity: 0, strokeDashoffset: 1 });
        });
        gsap.set(lock.g, { opacity: 0 });
        gsap.set([lock.open, lock.tag], { opacity: 0 });
        gsap.set(lock.shut, { opacity: 1 });
        gsap.set(lock.cross, { strokeDashoffset: 1, opacity: 1 });
        gsap.set([lock.body, lock.shut, lock.open], { stroke: CY });
        gsap.set(lock.tag, { fill: "#fff" });
        gsap.set(evTicks, { opacity: 0, stroke: CY });
        gsap.set(beat, { opacity: 1, stroke: C.tick });
        gsap.set(cursor, { x: tickX(0), opacity: 0 });
      };
      // Static ticks for an entry list: where on the strip each event lands.
      const placeEvents = (entries, sch) => {
        const evs = [];
        entries.forEach((e, i) => {
          if (e.k === "auth" && e.ok) return;
          const x = tickX(0) + (sch.items[i].at / sch.end) * (tickX(TICKS - 1) - tickX(0));
          evs.push({ i, x, err: !!(e.err || (e.k === "auth" && !e.ok)) });
        });
        evs.forEach((ev, k) => {
          const t = evTicks[k];
          t.setAttribute("x1", ev.x);
          t.setAttribute("x2", ev.x);
          t.setAttribute("y1", ev.err ? 546 : 551);
          t.setAttribute("y2", ev.err ? 574 : 569);
          ev.el = t;
        });
        return evs;
      };
      if (reduced) {
        // One resolved frame: the full trace of cycle 0, no timeline, no packets.
        const entries = VARIANTS[0].entries;
        const sch = schedule(entries);
        rest();
        configure(entries);
        const evs = placeEvents(entries, sch);
        entries.forEach((e, i) => {
          const s = slots[i];
          gsap.set([s.lbl, s.head], { opacity: 1 });
          gsap.set(s.lbl, { fill: C.lbl });
          if (e.k !== "auth") gsap.set(s.base, { opacity: 1 });
          if (e.k === "msg") gsap.set(s.head, { stroke: C.doneHead });
          else gsap.set(s.head, { opacity: 0 });
        });
        gsap.set(lock.g, { opacity: 1 });
        gsap.set([lock.body, lock.open], { stroke: "rgba(255,255,255,0.7)" });
        gsap.set(lock.shut, { opacity: 0 });
        gsap.set([lock.open, lock.tag], { opacity: 1 });
        gsap.set(lock.tag, { fill: C.lbl });
        gsap.set(evs.map((v) => v.el), { opacity: 1, stroke: C.tickOn });
        return () => {};
      }
      const hdrPulse = (tl, idx, at) => {
        tl.to(hdr[idx].box, { stroke: C.boxOn, duration: 0.2 }, at)
          .to(hdr[idx].txt, { fill: "#fff", duration: 0.2 }, at)
          .to(hdr[idx].box, { stroke: C.boxRest, duration: 0.5 }, at + 0.55)
          .to(hdr[idx].txt, { fill: C.nameRest, duration: 0.5 }, at + 0.55);
      };
      const build = (variant) => {
        const t = gsap.timeline({ paused: !(visible && !tabHidden), onComplete: nextCycle(build) });
        t.timeScale(variant.speed);
        const { entries } = variant;
        const sch = schedule(entries);
        rest();
        configure(entries);
        const evs = placeEvents(entries, sch);
        entries.forEach((e, i) => {
          const s = slots[i];
          const { at, dur } = sch.items[i];
          const label = (to = "#fff") => t.to(s.lbl, { opacity: 1, fill: to, duration: 0.25 }, at);
          if (e.k === "msg") {
            label();
            hdrPulse(t, e.f, at);
            // the message is drawn and its packet rides the head of the line
            t.set(s.trail, { opacity: 1, strokeDashoffset: 1 }, at + 0.1)
              .to(s.trail, { strokeDashoffset: 0, duration: dur, ease: "power1.inOut" }, at + 0.1)
              .set(s.pk, { opacity: 1 }, at + 0.1)
              .to(s.pk, { x: s.x2, duration: dur, ease: "power1.inOut" }, at + 0.1)
              .set(s.pk, { opacity: 0 }, at + 0.1 + dur);
            const land = at + 0.1 + dur;
            t.set(s.base, { opacity: 1 }, land)
              .set(s.head, { opacity: 1, stroke: CY }, land)
              .to(s.head, { stroke: C.doneHead, duration: 0.6 }, land + 0.1)
              .to(s.trail, { opacity: 0, duration: 0.5 }, land + 0.05)
              .to(s.lbl, { fill: C.lbl, duration: 0.5 }, land + 0.1);
            hdrPulse(t, e.t, land);
          } else if (e.k === "auth") {
            // the layer checks credentials: lock appears shut, then opens (or stays shut)
            label();
            hdrPulse(t, 1, at);
            t.set(lock.g, { opacity: 1 }, at).to(lock.tag, { opacity: 0, duration: 0.01 }, at);
            if (e.ok) {
              t.set(lock.shut, { opacity: 0 }, at + 0.65)
                .set(lock.open, { opacity: 1 }, at + 0.65)
                .to(lock.open, { y: -1.5, duration: 0.2, ease: "power2.out" }, at + 0.65)
                .to(lock.tag, { opacity: 1, duration: 0.25 }, at + 0.75);
              t.to([lock.body, lock.open], { stroke: "rgba(255,255,255,0.7)", duration: 0.6 }, at + 1.0)
                .to(lock.tag, { fill: C.lbl, duration: 0.6 }, at + 1.0)
                .to(s.lbl, { fill: C.lbl, duration: 0.5 }, at + 1.0);
            } else {
              t.to(lock.cross, { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, at + 0.65)
                .to(lock.tag, { opacity: 1, duration: 0.25 }, at + 0.7)
                .to([lock.body, lock.shut], { stroke: "rgba(255,255,255,0.7)", duration: 0.5 }, at + 1.2)
                .to(lock.tag, { fill: C.lbl, duration: 0.5 }, at + 1.2)
                .to(s.lbl, { fill: C.lbl, duration: 0.5 }, at + 1.2);
            }
          } else {
            // timeout note: a timer bar fills slowly (waiting), then stays as a dashed stub
            label();
            hdrPulse(t, 1, at);
            t.set(s.trail, { opacity: 1, strokeDashoffset: 1 }, at + 0.1)
              .to(s.trail, { strokeDashoffset: 0, duration: dur - 0.3, ease: "none" }, at + 0.1)
              .set(s.base, { opacity: 1 }, at + dur - 0.2)
              .to(s.trail, { opacity: 0, duration: 0.4 }, at + dur - 0.2)
              .to(s.lbl, { fill: C.lbl, duration: 0.5 }, at + dur - 0.2);
          }
        });
        // monitor: a cursor moves through time; each event leaves a tick on the strip
        const span = tickX(TICKS - 1) - tickX(0);
        t.set(cursor, { opacity: 1, x: tickX(0) }, 0)
          .to(cursor, { x: tickX(0) + span, duration: sch.end, ease: "none" }, 0);
        evs.forEach((ev) => {
          const when = sch.items[ev.i].at;
          t.set(ev.el, { opacity: 1, stroke: CY }, when)
            .to(ev.el, { stroke: C.tickOn, duration: 0.6 }, when + 0.3);
        });
        const each = sch.end / TICKS;
        t.to(beat, { stroke: C.tickOn, duration: 0.12, stagger: each }, 0)
          .to(beat, { stroke: C.tick, duration: 0.5, stagger: each }, 0.12);
        // smooth reset: the trace scrolls up and fades; the next cycle starts clean
        t.to(dyn, { opacity: 0, y: -14, duration: 0.8, ease: "power2.in" }, sch.end + 0.1)
          .to(hdr.map((h) => h.box), { stroke: C.boxRest, duration: 0.3 }, sch.end + 0.1)
          .to({}, { duration: 0.35 }, sch.end + 0.9);
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
      const rows = $$("[data-m-row]").map((el) => ({
        el,
        f: el.querySelector("[data-m-f]"),
        t: el.querySelector("[data-m-t]"),
        l: el.querySelector("[data-m-l]"),
      }));
      const beatM = $$("[data-m-beat]");
      const ROW_REST = { borderColor: "rgba(255,255,255,0.07)", borderStyle: "dashed", color: "rgba(255,255,255,0)", backgroundColor: "#000" };
      const ROW_ON = { borderColor: "rgba(103,232,249,0.85)", borderStyle: "solid", color: "#ffffff", backgroundColor: "rgba(103,232,249,0.08)" };
      const ROW_DONE = { borderColor: "rgba(255,255,255,0.28)", borderStyle: "solid", color: "rgba(255,255,255,0.88)", backgroundColor: "#0a0a0a" };
      const label = (e) => {
        if (e.k === "msg") return [LANES[e.f].short, LANES[e.t].short, e.l];
        if (e.k === "auth") return ["LAYER", "AUTH", e.ok ? "OK" : "DENIED"];
        return ["LAYER", "CRM", e.l];
      };
      const configure = (entries) => {
        rows.forEach((r, i) => {
          const e = entries[i];
          if (!e) return;
          const [f, t, l] = label(e);
          r.f.textContent = tr(f);
          r.t.textContent = tr(t);
          r.l.textContent = tr(l);
        });
        gsap.set(rows.map((r) => r.el), ROW_REST);
      };
      if (reduced) {
        configure(VARIANTS[0].entries);
        VARIANTS[0].entries.forEach((_, i) => gsap.set(rows[i].el, ROW_DONE));
        gsap.set(beatM, { backgroundColor: C.tickOn });
        return () => {};
      }
      const build = (variant) => {
        const t = gsap.timeline({ paused: !(visible && !tabHidden), onComplete: nextCycle(build) });
        t.timeScale(variant.speed);
        const sch = schedule(variant.entries);
        configure(variant.entries);
        gsap.set(beatM, { backgroundColor: "rgba(255,255,255,0.2)" });
        variant.entries.forEach((_, i) => {
          const { at, dur } = sch.items[i];
          t.to(rows[i].el, { ...ROW_ON, duration: 0.25 }, at)
            .to(rows[i].el, { ...ROW_DONE, duration: 0.5 }, at + dur);
        });
        const each = sch.end / beatM.length;
        t.to(beatM, { backgroundColor: C.tickOn, duration: 0.12, stagger: each }, 0)
          .to(beatM, { backgroundColor: "rgba(255,255,255,0.2)", duration: 0.5, stagger: each }, 0.12);
        t.to(rows.map((r) => r.el), { ...ROW_REST, duration: 0.7 }, sch.end + 0.1)
          .to({}, { duration: 0.35 }, sch.end + 0.9);
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
  const lifeTop = 100;
  const lifeBot = 520;
  const slotIdx = Array.from({ length: MAX }, (_, i) => i);
  return (
    <div ref={rootRef} className="iv-root rounded-xl border border-white/10 bg-black overflow-hidden">
      <style>{`
        .iv-hl{opacity:0;transition:opacity .25s ease;pointer-events:none}
        @media (hover:hover) and (pointer:fine){.iv-lane:hover .iv-hl{opacity:1}}
      `}</style>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-black/40">
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="w-2 h-2 rounded-full bg-white/15" />
        <span className="ml-2 text-[9px] font-mono text-white/50 tracking-wider truncate">{caption}</span>
      </div>
      <p className="sr-only">{a11y}</p>
      {/* ---------- md+ : sequence diagram ---------- */}
      <svg
        viewBox="0 0 900 600"
        className="hidden md:block w-full h-auto"
        aria-hidden="true"
        focusable="false"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      >
        {/* time axis */}
        <path d={`M26 ${lifeTop} V${lifeBot}`} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <path d={`M22 ${lifeBot - 7} L26 ${lifeBot} L30 ${lifeBot - 7}`} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <text transform={`translate(18 ${lifeTop + 8}) rotate(-90)`} textAnchor="end" fontSize="10.5" letterSpacing="3" fill="rgba(255,255,255,0.6)" style={{ fontFamily: MONO }}>
          {tr("TIME")}
        </text>
        {/* lifelines */}
        {LANES.map((l, i) => (
          <g key={l.name} className="iv-lane" data-hdr={i} style={{ cursor: "default" }}>
            <rect x={l.x - l.w / 2} y="52" width={l.w} height="30" rx="8" fill="#0a0a0a" stroke={C.boxRest} />
            <text x={l.x + 0.7} y="71.5" textAnchor="middle" fontSize="11" letterSpacing="1.4" fill={C.nameRest} style={{ fontFamily: MONO }}>
              {tr(l.name)}
            </text>
            <path d={`M${l.x} 82 V${lifeBot}`} stroke={C.life} strokeWidth="1" strokeDasharray="2 5" />
            <path className="iv-hl" d={`M${l.x} 82 V${lifeBot}`} stroke="rgba(255,255,255,0.55)" strokeWidth="1" strokeDasharray="2 5" />
            <rect x={l.x - 36} y="52" width="72" height={lifeBot - 52} fill="transparent" />
          </g>
        ))}
        <g data-id="dyn">
          {slotIdx.map((i) => (
            <g key={i} data-slot={i} style={{ display: "none" }}>
              <path data-base d="" fill="none" stroke={C.done} strokeWidth="1.2" opacity="0" />
              <path data-trail d="" pathLength="1" fill="none" stroke={CY} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1" strokeDashoffset="1" opacity="0" />
              <path data-head d="" fill="none" stroke={C.doneHead} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0" />
              <text
                data-lbl
                x="0"
                y="0"
                fontSize="11"
                letterSpacing="2"
                fill="#fff"
                stroke="#000"
                strokeWidth="5"
                strokeLinejoin="round"
                paintOrder="stroke"
                opacity="0"
                style={{ fontFamily: MONO }}
              >
                .
              </text>
              <g data-pk opacity="0">
                <rect x="-6" y="-2.5" width="12" height="5" rx="1.6" fill={CY} />
              </g>
            </g>
          ))}
          {/* AUTH lock: a small padlock that opens, or stays shut on denial */}
          <g data-id="lock" opacity="0">
            <rect data-id="lockBody" x="-5" y="0" width="10" height="8" rx="1.5" fill="#000" stroke={CY} strokeWidth="1.3" />
            <path data-id="shackleShut" d="M-3 0 V-3 a3 3 0 0 1 6 0 V0" fill="none" stroke={CY} strokeWidth="1.3" />
            <path data-id="shackleOpen" d="M-3 -2 V-4.5 a3 3 0 0 1 6 0" fill="none" stroke={CY} strokeWidth="1.3" opacity="0" />
          </g>
          <text data-id="authTag" x="0" y="0" fontSize="11" letterSpacing="2" fill="#fff" opacity="0" style={{ fontFamily: MONO }}>
            OK
          </text>
          <path data-id="authCross" d="M-4 -4 l8 8 M4 -4 l-8 8" pathLength="1" strokeDasharray="1" strokeDashoffset="1" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.4" strokeLinecap="round" />
          {/* monitor events + cursor (positions are set per cycle) */}
          {Array.from({ length: 10 }, (_, i) => (
            <line key={i} data-evtick x1="0" x2="0" y1="551" y2="569" stroke={CY} strokeWidth="1.6" strokeLinecap="round" opacity="0" />
          ))}
          <g data-id="cursor" opacity="0">
            <line x1="0" x2="0" y1="543" y2="577" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          </g>
        </g>
        {/* monitor strip */}
        <g>
          <rect x="30" y="538" width="840" height="44" rx="10" fill="none" stroke="rgba(255,255,255,0.12)" />
          <text x="46" y="565" fontSize="11" letterSpacing="3" fill="rgba(255,255,255,0.7)" style={{ fontFamily: MONO }}>
            {tr("MONITOR")}
          </text>
          {Array.from({ length: TICKS }, (_, i) => (
            <line key={i} data-beat x1={tickX(i)} x2={tickX(i)} y1="556" y2="564" stroke={C.tick} strokeWidth="1.2" strokeLinecap="round" />
          ))}
        </g>
      </svg>
      {/* ---------- < md : trace log (same cycle, simplified) ---------- */}
      <div className="md:hidden px-4 py-5" aria-hidden="true">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] tracking-[0.3em] text-white/60">{tr("MONITOR")}</span>
          <span className="flex flex-1 items-center justify-between h-3">
            {Array.from({ length: 24 }, (_, i) => (
              <span key={i} data-m-beat className="block w-px h-2 bg-white/20" />
            ))}
          </span>
        </div>
        <ol className="space-y-[6px]">
          {slotIdx.map((i) => (
            <li
              key={i}
              data-m-row={i}
              className="flex items-center gap-2 h-[38px] rounded-lg border border-dashed border-white/[0.07] px-3 font-mono text-[10.5px] tracking-[0.14em]"
              style={{ color: "rgba(255,255,255,0)" }}
            >
              <span data-m-f>.</span>
              <span>&rarr;</span>
              <span data-m-t>.</span>
              <span data-m-l className="ml-auto">
                .
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
export default IntegrationsVisual;
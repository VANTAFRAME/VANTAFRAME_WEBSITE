import React from "react";
import { useService } from "../useService";
// "Data under control": four hairline columns, each with a small line icon, a short title and one
// or two sentences. Plain text and static markup (only the site-wide `data-reveal`); copy lives in
// the service data file (`dataControl`). Four columns from lg, two on tablets, one on phones.
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
const ICONS = [
  // agreement / document with a check mark
  <g key="agreement" {...stroke}>
    <path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
    <path d="M14 3v5h5M9 15l2 2 4-4" />
  </g>,
  // location pin (processing place)
  <g key="eu" {...stroke}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </g>,
  // transparency + oversight: eye
  <g key="act" {...stroke}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </g>,
  // permissions: shield with a check
  <g key="access" {...stroke}>
    <path d="M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </g>,
];
const DataControl = ({ data, slug }) => {
  const { c } = useService(data);
  const { dataControl: d } = c;
  return (
    <section id="dane" className="px-6 md:px-12 max-w-[1700px] mx-auto py-24 md:py-32 border-t border-white/10">
      <div className="mb-12 md:mb-16 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-16 lg:items-end" data-reveal>
        <div>
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">{d.eyebrow}</p>
          <h2 className="text-3xl font-black leading-[1.05] tracking-tight md:text-5xl xl:text-6xl">
            {d.heading[0]}
            {" "}<br />
            {d.heading[1]}
          </h2>
        </div>
        <p className="max-w-xl text-base leading-relaxed text-white/65 md:text-lg">{d.lead}</p>
      </div>
      <ul className="grid grid-cols-1 border-y border-white/10 md:grid-cols-2 lg:grid-cols-4">
        {d.items.map((item, i) => (
          <li
            key={item.title}
            className={`p-7 md:p-9 border-white/10 ${i > 0 ? "border-t" : ""} ${i === 1 ? "md:border-t-0 md:border-l lg:border-l" : ""} ${i === 2 ? "md:border-l-0 lg:border-l lg:border-t-0" : ""} ${i === 3 ? "md:border-l lg:border-l lg:border-t-0" : ""}`}
            data-reveal
          >
            <svg viewBox="0 0 24 24" className="mb-8 h-6 w-6 text-cyan-300/85" aria-hidden="true">
              {ICONS[i]}
            </svg>
            <h3 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{item.title}</h3>
            <p className="text-base leading-relaxed text-white/70">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
export default DataControl;
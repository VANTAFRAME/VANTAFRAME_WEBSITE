import React from "react";
import { HUB } from "../../../data/aiServices/hub";
// A sentence made of plain text and links to other service pages: [{ t }, { l: slug, t }, …].
const Segments = ({ parts }) =>
  parts.map((p, i) =>
    p.l ? (
      <a
        key={i}
        href={HUB[p.l].path}
        className="text-white underline decoration-white/35 underline-offset-4 outline-none transition-colors hover:decoration-white focus-visible:decoration-cyan-300"
      >
        {p.t}
      </a>
    ) : (
      <React.Fragment key={i}>{p.t}</React.Fragment>
    )
  );
export default Segments;
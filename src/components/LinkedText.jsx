import React from "react";
// Renders a plain string in which links are written as [anchor](/path/). Strings without that
// markup render unchanged, so it can wrap any translated copy. Link style matches the
// underlined text links used on the service pages; `tone="dark"` is for light backgrounds.
// Links starting with https:// are treated as external (new tab, rel="noopener").
const PATTERN = /\[([^\]]+)\]\((\/[^)\s]*|https?:\/\/[^)\s]*)\)/g;
const LinkedText = ({ text, tone = "light", newTabLabel = "" }) => {
  if (typeof text !== "string" || !/\]\((\/|https?:\/\/)/.test(text)) return text;
  const cls =
    tone === "dark"
      ? "text-black underline decoration-black/35 underline-offset-4 transition-colors hover:decoration-black"
      : "text-white underline decoration-white/35 underline-offset-4 transition-colors hover:decoration-white focus-visible:decoration-cyan-300";
  const out = [];
  let last = 0;
  let m;
  PATTERN.lastIndex = 0;
  while ((m = PATTERN.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    // external links (https://…) open in a new tab; `newTabLabel` adds the text for screen readers
    const external = m[2].startsWith("http");
    out.push(
      <a key={m.index} href={m[2]} className={cls} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
        {m[1]}
        {external && newTabLabel ? <span className="sr-only"> {newTabLabel}</span> : null}
      </a>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
};
export default LinkedText;
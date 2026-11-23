// Slices a service's data for one island. The Astro page passes each island only the keys it
// renders, in both languages ({ pl, en }), so the browser never downloads the content of the other
// services. A spec entry is either a key ("faq") or an object that narrows one key to some of its
// fields ({ hero: ["visualCaption", "visualA11y"] }).
const slice = (content, spec) => {
  const out = {};
  for (const entry of spec) {
    if (typeof entry === "string") {
      if (content[entry] !== undefined) out[entry] = content[entry];
    } else {
      for (const [key, fields] of Object.entries(entry)) {
        if (!content[key]) continue;
        out[key] = {};
        for (const f of fields) if (content[key][f] !== undefined) out[key][f] = content[key][f];
      }
    }
  }
  return out;
};
export const pickData = (service, spec) => ({ pl: slice(service.pl, spec), en: slice(service.en, spec) });
export const VISUAL_SPEC = [{ hero: ["visualCaption", "visualA11y", "visualLabels"] }];
// Word-by-word label translation for the animated visuals. The visuals keep their English
// labels as keys; a page passes a dictionary (data/aiServices/<slug>.js → hero.visualLabels,
// empty for EN) and every visible label goes through this function, including the labels the
// timelines write into the SVG while they run. A whole phrase is looked up first, then each
// word; words without an entry stay as they are.
export const translate = (text, dict) => {
  if (!dict) return text;
  const whole = String(text);
  if (dict[whole] !== undefined) return dict[whole];
  return whole
    .split(" ")
    .map((word) => (dict[word] !== undefined ? dict[word] : word))
    .join(" ");
};
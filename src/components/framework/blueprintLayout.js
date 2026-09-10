// Static, hand-placed node positions for the 10 wizard steps. Deliberately not measured
// from the DOM (unlike presentation/islands/WorkflowTimeline.jsx) — the step order is
// fixed and known upfront, so a precomputed layout avoids ResizeObserver churn and keeps
// this component cheap to run on every answer.

export const STEP_ORDER = [
  "start",
  "scope",
  "goal",
  "audience",
  "functional",
  "visual",
  "materials",
  "timeline",
  "budget",
  "context",
];

// Desktop: viewBox "0 0 100 100" — a loose diagonal scatter, evoking a technical schematic.
export const DESKTOP_POSITIONS = {
  start: { x: 18, y: 10 },
  scope: { x: 54, y: 6 },
  goal: { x: 82, y: 20 },
  audience: { x: 30, y: 28 },
  functional: { x: 64, y: 36 },
  visual: { x: 14, y: 48 },
  materials: { x: 46, y: 56 },
  timeline: { x: 78, y: 50 },
  budget: { x: 26, y: 70 },
  context: { x: 60, y: 78 },
};

// Mobile/compact: viewBox "0 0 320 60" — a single left-to-right strip.
export const COMPACT_POSITIONS = {
  start: { x: 16, y: 30 },
  scope: { x: 46, y: 14 },
  goal: { x: 76, y: 42 },
  audience: { x: 106, y: 18 },
  functional: { x: 136, y: 40 },
  visual: { x: 166, y: 16 },
  materials: { x: 196, y: 42 },
  timeline: { x: 226, y: 18 },
  budget: { x: 256, y: 40 },
  context: { x: 290, y: 24 },
};

export const buildPathFromNodes = (positions, stepIds) => {
  const points = stepIds.map((id) => positions[id]).filter(Boolean);
  if (points.length < 2) return "";
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");
};

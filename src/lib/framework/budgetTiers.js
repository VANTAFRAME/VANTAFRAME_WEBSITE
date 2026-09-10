// No confirmed public price ranges exist on the site (Pricing.jsx is explicitly quote-only).
// So budget is captured as levels, not numbers. Fill in real ranges here later if the agency
// decides to publish them — nothing else needs to change.

export const BUDGET_TIERS = [
  { id: "basic", labelKey: "basic" },
  { id: "standard", labelKey: "standard" },
  { id: "advanced", labelKey: "advanced" },
  { id: "dedicated", labelKey: "dedicated" },
  { id: "needs_recommendation", labelKey: "needsRecommendation" },
];

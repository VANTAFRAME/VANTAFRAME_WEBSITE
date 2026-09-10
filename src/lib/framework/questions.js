import { OFFER_CATEGORY, deriveCategoriesFromScope } from "./offerCategories";

// Structural definition of the wizard. No copy lives here — every label is resolved at
// render time from translations.js (framework.steps[stepId]...), keyed by the stable ids
// below. This file only decides shape, order and branching (visibleIf).

export const STEP_KIND = {
  SINGLE: "single",
  MULTI: "multi",
  SLIDERS: "sliders",
  FREEFORM: "freeform",
};

// Functional options per offer category, each tagged with a delivery tier so the summary
// can split "START" vs "ROZWOJ" without any extra questions.
export const FUNCTIONAL_OPTIONS = {
  [OFFER_CATEGORY.SITES]: [
    { id: "cms", tier: "start" },
    { id: "blog", tier: "growth" },
    { id: "multilang", tier: "growth" },
    { id: "leadForms", tier: "start" },
    { id: "booking", tier: "growth" },
    { id: "payments", tier: "start" },
    { id: "customerAccount", tier: "growth" },
    { id: "catalog", tier: "start" },
    { id: "shipping", tier: "growth" },
    { id: "newsletter", tier: "growth" },
    { id: "search", tier: "growth" },
    { id: "filtering", tier: "growth" },
    { id: "analytics", tier: "start" },
    { id: "seoBasics", tier: "start" },
    { id: "advancedMotion", tier: "growth" },
  ],
  [OFFER_CATEGORY.APPS]: [
    { id: "userAccounts", tier: "start" },
    { id: "rolesPermissions", tier: "growth" },
    { id: "adminPanel", tier: "start" },
    { id: "dashboard", tier: "start" },
    { id: "subscriptions", tier: "growth" },
    { id: "notifications", tier: "growth" },
    { id: "apiIntegrations", tier: "start" },
    { id: "reports", tier: "growth" },
    { id: "dataWork", tier: "growth" },
    { id: "mobileVersion", tier: "growth" },
    { id: "offlineMode", tier: "growth" },
  ],
  [OFFER_CATEGORY.AUTOMATION_AI]: [
    { id: "customerAgent", tier: "start" },
    { id: "salesAgent", tier: "growth" },
    { id: "knowledgeBase", tier: "start" },
    { id: "docSearch", tier: "growth" },
    { id: "offerGeneration", tier: "growth" },
    { id: "requestHandling", tier: "start" },
    { id: "dataAnalysis", tier: "growth" },
    { id: "documentProcessing", tier: "growth" },
    { id: "crmAutomation", tier: "start" },
    { id: "erpIntegration", tier: "growth" },
    { id: "reporting", tier: "growth" },
    { id: "productConfigurator", tier: "growth" },
    { id: "leadQualification", tier: "start" },
  ],
  [OFFER_CATEGORY.MARKETING_BRAND]: [
    { id: "communicationStrategy", tier: "start" },
    { id: "logo", tier: "start" },
    { id: "visualIdentity", tier: "start" },
    { id: "designSystem", tier: "growth" },
    { id: "brandMaterials", tier: "growth" },
    { id: "seo", tier: "start" },
    { id: "campaigns", tier: "growth" },
    { id: "analyticsSetup", tier: "start" },
    { id: "conversionOptimization", tier: "growth" },
  ],
};

export const MATERIALS_OPTIONS = [
  "logo",
  "copy",
  "media",
  "existingSite",
  "functionalDocs",
  "integrations",
  "domainHosting",
];

export const VISUAL_AXES = [
  { id: "minimalExpressive" },
  { id: "calmDynamic" },
  { id: "classicExperimental" },
  { id: "lightDark" },
  { id: "informationalImage" },
];

export const STEPS = [
  {
    id: "start",
    number: 1,
    kind: STEP_KIND.SINGLE,
    required: true,
    optionIds: ["idea", "rebuild", "problem", "help"],
    extraFields: [
      {
        id: "existingUrl",
        type: "url",
        required: false,
        visibleIf: (answers) => answers.start === "rebuild",
      },
    ],
  },
  {
    id: "scope",
    number: 2,
    kind: STEP_KIND.MULTI,
    required: true,
    optionIds: [
      "website",
      "store",
      "webapp",
      "mobileapp",
      "automation",
      "ai",
      "configurator",
      "branding",
      "seo",
      "care",
      "unknown",
    ],
    exclusiveOptionIds: ["unknown"],
  },
  {
    id: "goal",
    number: 3,
    kind: STEP_KIND.SINGLE,
    required: true,
    optionIds: [
      "generateLeads",
      "sellOnline",
      "presentBrand",
      "supportCustomers",
      "automateWork",
      "improveTeamWork",
      "launchProduct",
      "replaceLegacySystem",
      "growVisibility",
      "organizeBrandImage",
    ],
    secondaryField: {
      id: "additionalGoals",
      kind: STEP_KIND.MULTI,
      required: false,
    },
  },
  {
    id: "audience",
    number: 4,
    kind: STEP_KIND.MULTI,
    required: false,
    fields: [
      { id: "audienceType", kind: STEP_KIND.SINGLE, optionIds: ["b2b", "b2c", "both"] },
      { id: "market", kind: STEP_KIND.SINGLE, optionIds: ["local", "national", "international"] },
      { id: "industry", kind: "text", required: false },
      { id: "primaryAudience", kind: "text", required: false },
      { id: "languages", kind: STEP_KIND.MULTI, optionIds: ["pl", "en", "other"] },
    ],
  },
  {
    id: "functional",
    number: 5,
    kind: STEP_KIND.MULTI,
    required: false,
    visibleIf: (answers) => deriveCategoriesFromScope(answers.scope).length > 0,
    // options resolved dynamically per selected category at render/engine time
  },
  {
    id: "visual",
    number: 6,
    kind: STEP_KIND.SLIDERS,
    required: false,
    fields: [
      { id: "axes", kind: STEP_KIND.SLIDERS },
      {
        id: "animationLevel",
        kind: STEP_KIND.SINGLE,
        optionIds: ["subtle", "expressive", "immersive", "needsRecommendation"],
      },
    ],
  },
  {
    id: "materials",
    number: 7,
    kind: STEP_KIND.MULTI,
    required: false,
    optionIds: MATERIALS_OPTIONS,
  },
  {
    id: "timeline",
    number: 8,
    kind: STEP_KIND.SINGLE,
    required: false,
    optionIds: ["asap", "onetothree", "threetosix", "flexible"],
    extraFields: [
      { id: "hasDeadline", type: "boolean", required: false },
      {
        id: "deadlineDate",
        type: "text",
        required: false,
        visibleIf: (answers) => answers.hasDeadline === true,
      },
      {
        id: "priority",
        type: "single",
        required: false,
        optionIds: ["time", "scope", "visualQuality", "automation", "scalability"],
      },
    ],
  },
  {
    id: "budget",
    number: 9,
    kind: STEP_KIND.SINGLE,
    required: false,
    optionIds: ["basic", "standard", "advanced", "dedicated", "needs_recommendation"],
  },
  {
    id: "context",
    number: 10,
    kind: STEP_KIND.FREEFORM,
    required: false,
  },
];

export const getStepDef = (stepId) => STEPS.find((step) => step.id === stepId);

import { STEPS, FUNCTIONAL_OPTIONS, MATERIALS_OPTIONS } from "./questions";
import { deriveCategoriesFromScope, OFFER_CATEGORY_TO_SERVICE_ID } from "./offerCategories";

/** @typedef {Record<string, any>} FrameworkAnswers */

export const isStepVisible = (step, answers) => {
  if (typeof step.visibleIf === "function") return Boolean(step.visibleIf(answers));
  return true;
};

export const getVisibleSteps = (answers) => STEPS.filter((step) => isStepVisible(step, answers));

export const getStepPosition = (answers, stepId) => {
  const visible = getVisibleSteps(answers);
  const index = visible.findIndex((step) => step.id === stepId);
  return { index: index === -1 ? 0 : index, total: visible.length };
};

export const getFunctionalOptionsForAnswers = (answers) => {
  const categories = deriveCategoriesFromScope(answers.scope);
  return categories.map((category) => ({
    category,
    serviceId: OFFER_CATEGORY_TO_SERVICE_ID[category],
    options: FUNCTIONAL_OPTIONS[category] || [],
  }));
};

const isEmpty = (value) => value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);

const STEP_ANSWERED_CHECKS = {
  start: (a) => !isEmpty(a.start),
  scope: (a) => !isEmpty(a.scope),
  goal: (a) => !isEmpty(a.goal),
  audience: (a) => !isEmpty(a.audienceType) || !isEmpty(a.market) || !isEmpty(a.industry) || !isEmpty(a.primaryAudience) || !isEmpty(a.languages),
  functional: (a) => !isEmpty(a.functional),
  visual: (a) => !isEmpty(a.axes) || !isEmpty(a.animationLevel),
  materials: (a) => !isEmpty(a.materials),
  timeline: (a) => !isEmpty(a.timeline),
  budget: (a) => !isEmpty(a.budget),
  context: (a) => !isEmpty(a.context),
};

export const isStepAnswered = (stepId, answers) => Boolean(STEP_ANSWERED_CHECKS[stepId]?.(answers));

export const validateStep = (step, answers) => {
  const errors = {};

  if (step.required && isEmpty(answers[step.id])) {
    errors[step.id] = "REQUIRED";
  }

  (step.extraFields || []).forEach((field) => {
    if (!field.required) return;
    if (field.visibleIf && !field.visibleIf(answers)) return;
    if (isEmpty(answers[field.id])) errors[field.id] = "REQUIRED";
  });

  (step.fields || []).forEach((field) => {
    if (!field.required) return;
    if (isEmpty(answers[field.id])) errors[field.id] = "REQUIRED";
  });

  return { valid: Object.keys(errors).length === 0, errors };
};

export const generateProjectId = () => {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `VF-FW-${year}-${random}`;
};

/**
 * Deterministic, rule-based recommendation — always available, no network/AI required.
 * Shape matches the AI endpoint response contract 1:1 so the summary screen doesn't care
 * which source produced it.
 */
export const buildLocalRecommendation = (answers) => {
  const categories = deriveCategoriesFromScope(answers.scope);
  const functionalByCategory = getFunctionalOptionsForAnswers(answers);
  const selectedFunctional = new Set(answers.functional || []);

  const phases = { start: [], growth: [] };
  functionalByCategory.forEach(({ options }) => {
    options.forEach((option) => {
      if (!selectedFunctional.has(option.id)) return;
      phases[option.tier === "growth" ? "growth" : "start"].push(option.id);
    });
  });

  const haveMaterials = new Set(answers.materials || []);
  const requiredMaterials = MATERIALS_OPTIONS.filter((id) => !haveMaterials.has(id));

  const assumptions = [];
  const openQuestions = [];

  if (categories.length === 0) {
    openQuestions.push("scopeUndefined");
  }
  if (!answers.timeline) {
    assumptions.push("noFixedTimeline");
  }
  if (answers.budget === "needs_recommendation" || !answers.budget) {
    openQuestions.push("budgetToDiscuss");
  }
  if (isEmpty(answers.audienceType) || isEmpty(answers.market)) {
    openQuestions.push("audienceToConfirm");
  }
  if ((answers.materials || []).length === 0) {
    assumptions.push("materialsNotConfirmed");
  }

  return {
    source: "local",
    projectId: generateProjectId(),
    createdAt: new Date().toISOString(),
    primaryGoal: answers.goal || null,
    recommendedSolution: categories,
    recommendedScope: {
      start: phases.start,
      growth: phases.growth,
    },
    priorities: [answers.priority, answers.animationLevel].filter(Boolean),
    phases: [
      { id: "start", items: phases.start },
      { id: "growth", items: phases.growth },
    ],
    requiredMaterials,
    assumptions,
    openQuestions,
    nextStep: "contactCall",
  };
};

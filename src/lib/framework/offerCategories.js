// Canonical offer categories — must stay in sync with services.items in src/i18n/translations.js
// (ids 01-05: Strony i Sklepy Online, Aplikacje, Automatyzacje i AI, Marketing i Marka, Opieka i Rozwój).
// Kept language-agnostic on purpose: the engine works with these keys, components resolve labels via i18n.

export const OFFER_CATEGORY = {
  SITES: "sites", // -> service id "01"
  APPS: "apps", // -> service id "02"
  AUTOMATION_AI: "automation_ai", // -> service id "03"
  MARKETING_BRAND: "marketing_brand", // -> service id "04"
  CARE: "care", // -> service id "05"
};

export const OFFER_CATEGORY_TO_SERVICE_ID = {
  [OFFER_CATEGORY.SITES]: "01",
  [OFFER_CATEGORY.APPS]: "02",
  [OFFER_CATEGORY.AUTOMATION_AI]: "03",
  [OFFER_CATEGORY.MARKETING_BRAND]: "04",
  [OFFER_CATEGORY.CARE]: "05",
};

// scope step option id -> offer category it maps onto (used to derive recommendedSolution)
export const SCOPE_OPTION_TO_CATEGORY = {
  website: OFFER_CATEGORY.SITES,
  store: OFFER_CATEGORY.SITES,
  webapp: OFFER_CATEGORY.APPS,
  mobileapp: OFFER_CATEGORY.APPS,
  configurator: OFFER_CATEGORY.APPS,
  automation: OFFER_CATEGORY.AUTOMATION_AI,
  ai: OFFER_CATEGORY.AUTOMATION_AI,
  branding: OFFER_CATEGORY.MARKETING_BRAND,
  seo: OFFER_CATEGORY.MARKETING_BRAND,
  care: OFFER_CATEGORY.CARE,
  unknown: null,
};

export const deriveCategoriesFromScope = (scopeAnswer = []) => {
  const categories = new Set();
  scopeAnswer.forEach((optionId) => {
    const category = SCOPE_OPTION_TO_CATEGORY[optionId];
    if (category) categories.add(category);
  });
  return Array.from(categories);
};

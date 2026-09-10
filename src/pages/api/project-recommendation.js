import { buildLocalRecommendation } from "../../lib/framework/engine";
import { getFunctionalOptionsForAnswers } from "../../lib/framework/engine";
import { MATERIALS_OPTIONS } from "../../lib/framework/questions";
import { OFFER_CATEGORY } from "../../lib/framework/offerCategories";

export const prerender = false;

const ANTHROPIC_MODEL = "claude-opus-4-8";
const REQUEST_TIMEOUT_MS = 8000;

const getApiKey = () => import.meta.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY || "";

const json = (data, init = {}) =>
  new Response(JSON.stringify(data), {
    ...init,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...(init.headers || {}) },
  });

const CATEGORY_IDS = Object.values(OFFER_CATEGORY);

const RECOMMENDATION_SCHEMA = {
  type: "object",
  properties: {
    projectSummary: { type: "string" },
    primaryGoal: { type: "string" },
    recommendedSolution: { type: "array", items: { type: "string", enum: CATEGORY_IDS } },
    recommendedScope: {
      type: "object",
      properties: {
        start: { type: "array", items: { type: "string" } },
        growth: { type: "array", items: { type: "string" } },
      },
      required: ["start", "growth"],
      additionalProperties: false,
    },
    priorities: { type: "array", items: { type: "string" } },
    phases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", enum: ["start", "growth"] },
          items: { type: "array", items: { type: "string" } },
        },
        required: ["id", "items"],
        additionalProperties: false,
      },
    },
    requiredMaterials: { type: "array", items: { type: "string", enum: MATERIALS_OPTIONS } },
    assumptions: { type: "array", items: { type: "string" } },
    openQuestions: { type: "array", items: { type: "string" } },
    nextStep: { type: "string" },
  },
  required: [
    "projectSummary",
    "primaryGoal",
    "recommendedSolution",
    "recommendedScope",
    "priorities",
    "phases",
    "requiredMaterials",
    "assumptions",
    "openQuestions",
    "nextStep",
  ],
  additionalProperties: false,
};

const SYSTEM_PROMPT = `Jesteś silnikiem rekomendacji projektowych agencji VANTAFRAME.
Odpowiadasz wyłącznie po polsku, krótkim i konkretnym językiem.
Rekomendujesz WYŁĄCZNIE rozwiązania zgodne z ofertą VANTAFRAME (5 kategorii: sites, apps, automation_ai, marketing_brand, care).
Nie obiecujesz konkretnego terminu realizacji. Nie wymyślasz cen ani widełek budżetowych.
Nie przedstawiasz rekomendacji jako wiążącej oferty - to wstępna analiza do potwierdzenia podczas rozmowy.
W polach "assumptions" i "openQuestions" jasno oznacz informacje, które wymagają potwierdzenia podczas rozmowy z klientem.
Zwracaj wyłącznie identyfikatory (nie etykiety) w polach recommendedSolution, recommendedScope, phases i requiredMaterials - dokładnie takie, jakie otrzymałeś w danych wejściowych jako dozwolone wartości.`;

const buildUserPrompt = (answers) => {
  const functionalCatalog = getFunctionalOptionsForAnswers(answers).flatMap((group) =>
    group.options.map((option) => option.id)
  );

  return JSON.stringify({
    answers,
    allowedFunctionalIds: functionalCatalog,
    allowedMaterialIds: MATERIALS_OPTIONS,
    allowedCategoryIds: CATEGORY_IDS,
    instructions:
      "Przeanalizuj odpowiedzi klienta z kreatora FRAMEWORK i zwróć strukturalną rekomendację zgodną ze schematem. " +
      "recommendedSolution: wybierz spośród allowedCategoryIds na podstawie scope i celu. " +
      "phases.start / phases.growth oraz recommendedScope: użyj WYŁĄCZNIE identyfikatorów z allowedFunctionalIds, podziel je sensownie na pierwsze wdrożenie (start) i dalszy rozwój (growth). " +
      "requiredMaterials: identyfikatory z allowedMaterialIds, których klient NIE zaznaczył jako już posiadane.",
  });
};

const sanitizeRecommendation = (data, answers) => {
  const validFunctional = new Set(
    getFunctionalOptionsForAnswers(answers).flatMap((group) => group.options.map((o) => o.id))
  );
  const validMaterials = new Set(MATERIALS_OPTIONS);
  const validCategories = new Set(CATEGORY_IDS);

  const filterFunctional = (arr) => (Array.isArray(arr) ? arr.filter((id) => validFunctional.has(id)) : []);

  return {
    source: "ai",
    projectId: buildLocalRecommendation(answers).projectId,
    createdAt: new Date().toISOString(),
    projectSummary: typeof data.projectSummary === "string" ? data.projectSummary : "",
    primaryGoal: typeof data.primaryGoal === "string" ? data.primaryGoal : answers.goal || null,
    recommendedSolution: Array.isArray(data.recommendedSolution)
      ? data.recommendedSolution.filter((id) => validCategories.has(id))
      : [],
    recommendedScope: {
      start: filterFunctional(data.recommendedScope?.start),
      growth: filterFunctional(data.recommendedScope?.growth),
    },
    priorities: Array.isArray(data.priorities) ? data.priorities : [],
    phases: [
      { id: "start", items: filterFunctional(data.phases?.find((p) => p.id === "start")?.items) },
      { id: "growth", items: filterFunctional(data.phases?.find((p) => p.id === "growth")?.items) },
    ],
    requiredMaterials: Array.isArray(data.requiredMaterials)
      ? data.requiredMaterials.filter((id) => validMaterials.has(id))
      : [],
    assumptions: Array.isArray(data.assumptions) ? data.assumptions : [],
    openQuestions: Array.isArray(data.openQuestions) ? data.openQuestions : [],
    nextStep: typeof data.nextStep === "string" ? data.nextStep : "contactCall",
  };
};

export async function POST({ request }) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return json({ error: "AI_NOT_CONFIGURED" }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const answers = body?.answers;
  if (!answers || typeof answers !== "object") {
    return json({ error: "VALIDATION_ERROR" }, { status: 400 });
  }

  // Boundary check: never forward contact/PII fields to the model, even if a
  // caller mistakenly includes them.
  const { name, email, phone, company, ...safeAnswers } = answers;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserPrompt(safeAnswers) }],
        output_config: {
          format: {
            type: "json_schema",
            schema: RECOMMENDATION_SCHEMA,
          },
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return json({ error: "AI_REQUEST_FAILED" }, { status: 502 });
    }

    const message = await response.json();
    const textBlock = message.content?.find((block) => block.type === "text");
    if (!textBlock?.text) {
      return json({ error: "AI_EMPTY_RESPONSE" }, { status: 502 });
    }

    const parsed = JSON.parse(textBlock.text);
    return json(sanitizeRecommendation(parsed, safeAnswers));
  } catch (error) {
    if (error?.name === "AbortError") {
      return json({ error: "AI_TIMEOUT" }, { status: 504 });
    }
    return json({ error: "AI_REQUEST_FAILED" }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { buildLocalRecommendation } from "../../lib/framework/engine";
import { OFFER_CATEGORY_TO_SERVICE_ID } from "../../lib/framework/offerCategories";
import { buildSummaryText } from "../../lib/framework/summaryText";
import LeadForm from "./LeadForm";
import "./summaryPrint.css";

const REQUIRED_KEYS = ["projectId", "recommendedSolution", "recommendedScope", "requiredMaterials", "assumptions", "openQuestions", "nextStep"];
const isValidRecommendation = (data) => data && REQUIRED_KEYS.every((key) => key in data);

const SummaryScreen = ({ t, answers, serviceCategoryLabels, onEdit, onRestart, contained = false }) => {
  const cardRef = useRef(null);
  const leadFormRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [recommendation, setRecommendation] = useState(() => buildLocalRecommendation(answers));
  const [source, setSource] = useState("local");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { clipPath: "inset(4% 4% 96% 4% round 24px)", opacity: 0.6 },
        { clipPath: "inset(0% 0% 0% 0% round 24px)", opacity: 1, duration: 0.9, ease: "power3.inOut" }
      );
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    fetch("/api/project-recommendation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && isValidRecommendation(data)) {
          setRecommendation(data);
          setSource("ai");
        }
      })
      .catch(() => {
        // AI unavailable/timeout — the local recommendation already rendered, nothing to do.
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categoryLabel = (category) => serviceCategoryLabels[OFFER_CATEGORY_TO_SERVICE_ID[category]] || category;
  const featureLabel = (id) => t.steps.functional.options[id]?.label || id;
  const materialLabel = (id) => t.steps.materials.options[id]?.label || id;

  const audienceLine = useMemo(() => {
    const parts = [];
    if (answers.audienceType) parts.push(t.steps.audience.fields.audienceType.options[answers.audienceType]?.label);
    if (answers.market) parts.push(t.steps.audience.fields.market.options[answers.market]?.label);
    if (answers.industry) parts.push(answers.industry);
    return parts.filter(Boolean).join(" · ") || "—";
  }, [answers, t]);

  const visualLine = useMemo(() => {
    const axisLabels = Object.entries(answers.axes || {})
      .filter(([, value]) => value !== undefined && value !== 50)
      .map(([axisId, value]) => {
        const axis = t.steps.visual.axes[axisId];
        if (!axis) return null;
        return value > 50 ? axis.right : axis.left;
      })
      .filter(Boolean);
    if (answers.animationLevel) axisLabels.push(t.steps.visual.animationOptions[answers.animationLevel]?.label);
    return axisLabels.length ? axisLabels.join(" · ") : "—";
  }, [answers, t]);

  const integrationIds = ["apiIntegrations", "crmAutomation", "erpIntegration", "shipping"];
  const integrations = (answers.functional || []).filter((id) => integrationIds.includes(id));

  const handleCopy = async () => {
    const text = buildSummaryText({ t, answers, recommendation, categoryLabel, featureLabel, materialLabel });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be blocked (permissions/insecure context) — silently ignore,
      // the user still has PRINT and SEND as fallbacks.
    }
  };

  const scrollToLeadForm = () => {
    leadFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const Section = ({ label, children }) =>
    children ? (
      <div className="border-t border-black/8 py-5 first:border-t-0 first:pt-0">
        <p className="text-[11px] font-bold uppercase tracking-widest text-black/40">{label}</p>
        <div className="mt-2 text-sm md:text-base text-black/85">{children}</div>
      </div>
    ) : null;

  return (
    <div className={contained ? "h-full overflow-y-auto bg-brand-black" : "min-h-screen bg-brand-black"}>
      <div
        ref={cardRef}
        className={
          contained
            ? "mx-4 my-4 bg-white text-black rounded-2xl shadow-2xl print:shadow-none print:my-0 print:rounded-none"
            : "mx-auto max-w-4xl bg-white text-black rounded-3xl my-6 md:my-12 shadow-2xl print:shadow-none print:my-0 print:rounded-none"
        }
        id="framework-summary-card"
      >
        <div className={contained ? "px-5 py-6" : "px-6 py-10 md:px-14 md:py-14"}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-black/40">{t.summary.projectIdLabel}</p>
              <p className="font-mono text-sm text-black/70">{recommendation.projectId}</p>
            </div>
            <span
              className={[
                "rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest print:hidden",
                source === "ai" ? "border-brand-cyan/50 text-brand-cyan bg-brand-cyan/5" : "border-black/15 text-black/50",
              ].join(" ")}
            >
              {source === "ai" ? t.summary.aiBadge.ai : t.summary.aiBadge.local}
            </span>
          </div>

          <h1 className={contained ? "mt-6 text-2xl font-semibold tracking-tight" : "mt-6 text-4xl md:text-6xl font-semibold tracking-tight"}>{t.summary.heading}</h1>

          <div className="mt-10">
            <Section label={t.summary.sections.projectType}>
              {answers.start ? t.steps.start.options[answers.start]?.label : "—"}
            </Section>
            <Section label={t.summary.sections.primaryGoal}>
              {answers.goal ? t.steps.goal.options[answers.goal]?.label : "—"}
            </Section>
            <Section label={t.summary.sections.audience}>{audienceLine}</Section>
            <Section label={t.summary.sections.recommendedSolution}>
              {recommendation.recommendedSolution.length ? (
                <div className="flex flex-wrap gap-2">
                  {recommendation.recommendedSolution.map((category) => (
                    <span key={category} className="rounded-full border border-black/15 px-3 py-1 text-xs">
                      {categoryLabel(category)}
                    </span>
                  ))}
                </div>
              ) : (
                "—"
              )}
            </Section>
            <Section label={t.summary.sections.recommendedScope}>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-cyan mb-2">{t.summary.phaseLabels.start}</p>
                  <ul className="space-y-1.5 text-sm">
                    {recommendation.phases[0].items.length ? (
                      recommendation.phases[0].items.map((id) => <li key={id}>{featureLabel(id)}</li>)
                    ) : (
                      <li className="text-black/40">—</li>
                    )}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-black/40 mb-2">{t.summary.phaseLabels.growth}</p>
                  <ul className="space-y-1.5 text-sm">
                    {recommendation.phases[1].items.length ? (
                      recommendation.phases[1].items.map((id) => <li key={id}>{featureLabel(id)}</li>)
                    ) : (
                      <li className="text-black/40">—</li>
                    )}
                  </ul>
                </div>
              </div>
            </Section>
            <Section label={t.summary.sections.visualDirection}>{visualLine}</Section>
            <Section label={t.summary.sections.integrations}>
              {integrations.length ? integrations.map(featureLabel).join(", ") : "—"}
            </Section>
            <Section label={t.summary.sections.materialsProvided}>
              {(answers.materials || []).length ? answers.materials.map(materialLabel).join(", ") : "—"}
            </Section>
            <Section label={t.summary.sections.materialsNeeded}>
              {recommendation.requiredMaterials.length ? recommendation.requiredMaterials.map(materialLabel).join(", ") : "—"}
            </Section>
            <Section label={t.summary.sections.priorities}>
              {answers.priority ? t.steps.timeline.priorityOptions[answers.priority]?.label : "—"}
            </Section>
            <Section label={t.summary.sections.assumptions}>
              {recommendation.assumptions.length ? (
                <ul className="space-y-1.5 text-sm">
                  {recommendation.assumptions.map((id) => (
                    <li key={id}>{t.summary.assumptionCopy[id] || id}</li>
                  ))}
                </ul>
              ) : (
                "—"
              )}
            </Section>
            <Section label={t.summary.sections.openQuestions}>
              {recommendation.openQuestions.length ? (
                <ul className="space-y-1.5 text-sm">
                  {recommendation.openQuestions.map((id) => (
                    <li key={id}>{t.summary.openQuestionCopy[id] || id}</li>
                  ))}
                </ul>
              ) : (
                "—"
              )}
            </Section>
            <Section label={t.summary.sections.nextStep}>
              {t.summary.nextStepCopy[recommendation.nextStep] || recommendation.nextStep}
            </Section>
          </div>

          <p className="mt-10 text-xs text-black/45 leading-relaxed">{t.summary.disclaimer}</p>

          <div className="mt-8 flex flex-wrap gap-3 print:hidden">
            <button type="button" onClick={onEdit} className="cursor-hover rounded-full border border-black/20 px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black/5 transition-colors" data-cursor-label="EDIT">
              {t.summary.actions.edit}
            </button>
            <button type="button" onClick={handleCopy} className="cursor-hover rounded-full border border-black/20 px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black/5 transition-colors" data-cursor-label="COPY">
              {copied ? t.summary.actions.copied : t.summary.actions.copy}
            </button>
            <button type="button" onClick={() => window.print()} className="cursor-hover rounded-full border border-black/20 px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black/5 transition-colors" data-cursor-label="PRINT">
              {t.summary.actions.print}
            </button>
            <button type="button" onClick={scrollToLeadForm} className="cursor-hover rounded-full bg-black px-6 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-black/85 transition-colors" data-cursor-label="SEND">
              {t.summary.actions.send}
            </button>
          </div>
        </div>

        <div ref={leadFormRef} className={contained ? "border-t border-black/10 px-5 py-6 print:hidden" : "border-t border-black/10 px-6 py-10 md:px-14 md:py-14 print:hidden"}>
          <LeadForm
            t={t}
            answers={answers}
            recommendation={recommendation}
            textHelpers={{ categoryLabel, featureLabel, materialLabel }}
            onRestart={onRestart}
          />
        </div>
      </div>

      <div className="text-center pb-10 print:hidden">
        <button type="button" onClick={onRestart} className="cursor-hover text-xs uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors" data-cursor-label="RESTART">
          {t.actions.restart}
        </button>
      </div>
    </div>
  );
};

export default SummaryScreen;

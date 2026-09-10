import React, { useEffect, useMemo, useReducer, useState } from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";
import { STEPS, getStepDef } from "../../lib/framework/questions";
import {
  getVisibleSteps,
  getStepPosition,
  validateStep,
  isStepAnswered,
  getFunctionalOptionsForAnswers,
} from "../../lib/framework/engine";
import { loadFrameworkState, saveFrameworkState, clearFrameworkState } from "../../lib/framework/storage";
import { trackEvent } from "../../lib/framework/track";
import { STEP_ORDER } from "./blueprintLayout";
import IntroScreen from "./IntroScreen";
import StepShell from "./StepShell";
import QuestionRenderer from "./QuestionRenderer";
import BlueprintCanvas from "./BlueprintCanvas";
import SummaryScreen from "./SummaryScreen";

const initialState = {
  phase: "intro",
  currentStepId: STEPS[0].id,
  answers: {},
  history: [],
};

const pruneInvalidAnswers = (answers) => {
  // Scope changes can remove offer categories entirely — drop functional picks that no
  // longer belong to any selected category so the summary never shows a contradiction.
  if (!answers.functional || answers.functional.length === 0) return answers;
  const validIds = new Set(
    getFunctionalOptionsForAnswers(answers).flatMap((group) => group.options.map((o) => o.id))
  );
  const nextFunctional = answers.functional.filter((id) => validIds.has(id));
  if (nextFunctional.length === answers.functional.length) return answers;
  return { ...answers, functional: nextFunctional };
};

function reducer(state, action) {
  switch (action.type) {
    case "HYDRATE": {
      if (!action.payload?.answers || Object.keys(action.payload.answers).length === 0) return state;
      return {
        ...state,
        answers: action.payload.answers,
        currentStepId: action.payload.currentStepId || state.currentStepId,
      };
    }
    case "START":
      return { ...state, phase: "wizard" };
    case "ANSWER": {
      let answers = { ...state.answers, [action.key]: action.value };
      if (action.key === "scope") answers = pruneInvalidAnswers(answers);
      return { ...state, answers };
    }
    case "NEXT": {
      const visible = getVisibleSteps(state.answers);
      const idx = visible.findIndex((s) => s.id === state.currentStepId);
      const next = visible[idx + 1];
      if (!next) {
        return { ...state, phase: "summary" };
      }
      return { ...state, currentStepId: next.id, history: [...state.history, state.currentStepId] };
    }
    case "BACK": {
      if (state.history.length === 0) {
        return { ...state, phase: "intro" };
      }
      const history = state.history.slice(0, -1);
      const previous = state.history[state.history.length - 1];
      return { ...state, currentStepId: previous, history };
    }
    case "EDIT_ANSWERS":
      return { ...state, phase: "wizard", currentStepId: STEPS[0].id, history: [] };
    case "RESTART":
      clearFrameworkState();
      return { ...initialState };
    default:
      return state;
  }
}

const useReducedMotionPref = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return reduced;
};

const FrameworkApp = ({ contained = false }) => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].framework;
  const servicesT = languages[lang].services;
  const reducedMotion = useReducedMotionPref();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  const serviceCategoryLabels = useMemo(
    () => Object.fromEntries(servicesT.items.map((item) => [item.id, item.title])),
    [servicesT]
  );

  const stepLabels = useMemo(
    () => Object.fromEntries(STEP_ORDER.map((id) => [id, t.steps[id]?.areaLabel || ""])),
    [t]
  );

  useEffect(() => {
    const saved = loadFrameworkState();
    if (saved) dispatch({ type: "HYDRATE", payload: saved });
    setHydrated(true);
    trackEvent("framework_view");
  }, []);

  useEffect(() => {
    if (!hydrated || state.phase === "intro") return;
    saveFrameworkState({ answers: state.answers, currentStepId: state.currentStepId });
  }, [hydrated, state.answers, state.currentStepId, state.phase]);

  useEffect(() => {
    if (state.phase === "wizard") trackEvent("framework_start");
    if (state.phase === "summary") trackEvent("framework_summary_generated");
  }, [state.phase]);

  const completedStepIds = useMemo(
    () => STEP_ORDER.filter((id) => isStepAnswered(id, state.answers)),
    [state.answers]
  );

  if (!hydrated) return <div className={contained ? "relative h-full w-full bg-brand-black" : "fixed inset-0 z-[80] bg-brand-black"} />;

  if (state.phase === "intro") {
    return (
      <IntroScreen
        copy={t.intro}
        onStart={() => dispatch({ type: "START" })}
        reducedMotion={reducedMotion}
        contained={contained}
      />
    );
  }

  if (state.phase === "summary") {
    return (
      <SummaryScreen
        t={t}
        answers={state.answers}
        serviceCategoryLabels={serviceCategoryLabels}
        onEdit={() => dispatch({ type: "EDIT_ANSWERS" })}
        onRestart={() => dispatch({ type: "RESTART" })}
        contained={contained}
      />
    );
  }

  const stepDef = getStepDef(state.currentStepId);
  const { index, total } = getStepPosition(state.answers, state.currentStepId);
  const validation = validateStep(stepDef, state.answers);
  const isLastStep = index === total - 1;

  return (
    <StepShell
      frameworkName={t.nav.name}
      closeLabel={t.nav.close}
      stepIndexLabel={`${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`}
      areaLabel={t.steps[state.currentStepId]?.areaLabel}
      progressFraction={(index + 1) / total}
      backLabel={t.actions.back}
      nextLabel={isLastStep ? t.actions.seeSummary : t.actions.next}
      onBack={() => dispatch({ type: "BACK" })}
      onNext={() => {
        if (!validation.valid) return;
        trackEvent("framework_step_complete", { step: state.currentStepId });
        dispatch({ type: "NEXT" });
      }}
      canGoBack
      nextDisabled={!validation.valid}
      restartLabel={t.actions.restart}
      onRestart={() => {
        if (window.confirm(t.actions.restartConfirm)) dispatch({ type: "RESTART" });
      }}
      contained={contained}
      visual={
        <>
          <div className="hidden h-full md:block">
            <BlueprintCanvas
              completedStepIds={completedStepIds}
              currentStepId={state.currentStepId}
              stepLabels={stepLabels}
              reducedMotion={reducedMotion}
            />
          </div>
          <div className="h-full md:hidden">
            <BlueprintCanvas
              completedStepIds={completedStepIds}
              currentStepId={state.currentStepId}
              stepLabels={stepLabels}
              compact
              reducedMotion={reducedMotion}
            />
          </div>
        </>
      }
    >
      <QuestionRenderer
        stepId={state.currentStepId}
        t={t}
        answers={state.answers}
        onAnswer={(key, value) => dispatch({ type: "ANSWER", key, value })}
        serviceCategoryLabels={serviceCategoryLabels}
      />
    </StepShell>
  );
};

export default FrameworkApp;

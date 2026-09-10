import React from "react";
import AnswerOptionCard from "./AnswerOptionCard";
import { SCOPE_ICONS } from "./ScopeIcons";
import { BUDGET_TIERS } from "../../lib/framework/budgetTiers";
import { VISUAL_AXES } from "../../lib/framework/questions";
import { getFunctionalOptionsForAnswers } from "../../lib/framework/engine";

const StepHeading = ({ title, description }) => (
  <>
    <h2 className="mt-3 text-2xl font-medium leading-tight text-white md:text-3xl">{title}</h2>
    {description && <p className="mt-2 text-sm text-white/50 md:text-base">{description}</p>}
  </>
);

const Pill = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    data-cursor-label="SELECT"
    className={[
      "cursor-hover rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wide transition-colors duration-300 md:text-sm",
      selected
        ? "border-brand-cyan/60 bg-brand-cyan/[0.08] text-white"
        : "border-white/15 text-white/60 hover:border-white/35 hover:text-white",
    ].join(" ")}
  >
    {label}
  </button>
);

const TextField = ({ label, placeholder, value, onChange, type = "text" }) => (
  <label className="block">
    <span className="block text-xs uppercase font-bold tracking-widest text-white/40 mb-2">{label}</span>
    <input
      type={type}
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-brand-cyan transition-colors"
    />
  </label>
);

const SliderField = ({ leftLabel, rightLabel, value, onChange }) => (
  <div>
    <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-white/40">
      <span>{leftLabel}</span>
      <span>{rightLabel}</span>
    </div>
    <input
      type="range"
      min={0}
      max={100}
      value={value ?? 50}
      onChange={(event) => onChange(Number(event.target.value))}
      className="mt-2 w-full accent-brand-cyan"
      aria-label={`${leftLabel} – ${rightLabel}`}
    />
  </div>
);

const toggleInArray = (arr = [], id) => (arr.includes(id) ? arr.filter((item) => item !== id) : [...arr, id]);

const QuestionRenderer = ({ stepId, t, answers, onAnswer, serviceCategoryLabels }) => {
  const steps = t.steps;

  switch (stepId) {
    case "start": {
      const s = steps.start;
      return (
        <>
          <StepHeading title={s.title} />
          <div className="mt-8 grid gap-3">
            {Object.entries(s.options).map(([id, opt]) => (
              <AnswerOptionCard
                key={id}
                label={opt.label}
                selected={answers.start === id}
                onClick={() => onAnswer("start", id)}
              />
            ))}
          </div>
          {answers.start === "rebuild" && (
            <div className="mt-6">
              <TextField
                label={s.existingUrl.label}
                placeholder={s.existingUrl.placeholder}
                value={answers.existingUrl}
                onChange={(value) => onAnswer("existingUrl", value)}
              />
            </div>
          )}
        </>
      );
    }

    case "scope": {
      const s = steps.scope;
      const selected = answers.scope || [];
      const toggle = (id) => {
        if (id === "unknown") {
          onAnswer("scope", selected.includes("unknown") ? [] : ["unknown"]);
          return;
        }
        const withoutUnknown = selected.filter((item) => item !== "unknown");
        onAnswer("scope", toggleInArray(withoutUnknown, id));
      };
      return (
        <>
          <StepHeading title={s.title} description={s.description} />
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(s.options).map(([id, opt]) => (
              <AnswerOptionCard
                key={id}
                label={opt.label}
                selected={selected.includes(id)}
                onClick={() => toggle(id)}
                Icon={SCOPE_ICONS[id]}
              />
            ))}
          </div>
        </>
      );
    }

    case "goal": {
      const s = steps.goal;
      const additional = answers.additionalGoals || [];
      return (
        <>
          <StepHeading title={s.title} description={s.description} />
          <div className="mt-8 grid gap-3">
            {Object.entries(s.options).map(([id, opt]) => (
              <AnswerOptionCard
                key={id}
                label={opt.label}
                selected={answers.goal === id}
                onClick={() => onAnswer("goal", id)}
              />
            ))}
          </div>

          {answers.goal && (
            <div className="mt-8">
              <p className="text-xs uppercase font-bold tracking-widest text-white/40 mb-3">{s.additionalLabel}</p>
              <div className="flex flex-wrap gap-2.5">
                {Object.entries(s.options)
                  .filter(([id]) => id !== answers.goal)
                  .map(([id, opt]) => (
                    <Pill
                      key={id}
                      label={opt.label}
                      selected={additional.includes(id)}
                      onClick={() => onAnswer("additionalGoals", toggleInArray(additional, id))}
                    />
                  ))}
              </div>
            </div>
          )}
        </>
      );
    }

    case "audience": {
      const s = steps.audience;
      const languages = answers.languages || [];
      return (
        <>
          <StepHeading title={s.title} />
          <div className="mt-8 space-y-8">
            <div>
              <p className="text-xs uppercase font-bold tracking-widest text-white/40 mb-3">{s.fields.audienceType.label}</p>
              <div className="flex flex-wrap gap-2.5">
                {Object.entries(s.fields.audienceType.options).map(([id, opt]) => (
                  <Pill key={id} label={opt.label} selected={answers.audienceType === id} onClick={() => onAnswer("audienceType", id)} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase font-bold tracking-widest text-white/40 mb-3">{s.fields.market.label}</p>
              <div className="flex flex-wrap gap-2.5">
                {Object.entries(s.fields.market.options).map(([id, opt]) => (
                  <Pill key={id} label={opt.label} selected={answers.market === id} onClick={() => onAnswer("market", id)} />
                ))}
              </div>
            </div>

            <TextField label={s.fields.industry.label} placeholder={s.fields.industry.placeholder} value={answers.industry} onChange={(v) => onAnswer("industry", v)} />
            <TextField label={s.fields.primaryAudience.label} placeholder={s.fields.primaryAudience.placeholder} value={answers.primaryAudience} onChange={(v) => onAnswer("primaryAudience", v)} />

            <div>
              <p className="text-xs uppercase font-bold tracking-widest text-white/40 mb-3">{s.fields.languages.label}</p>
              <div className="flex flex-wrap gap-2.5">
                {Object.entries(s.fields.languages.options).map(([id, opt]) => (
                  <Pill key={id} label={opt.label} selected={languages.includes(id)} onClick={() => onAnswer("languages", toggleInArray(languages, id))} />
                ))}
              </div>
            </div>
          </div>
        </>
      );
    }

    case "functional": {
      const s = steps.functional;
      const groups = getFunctionalOptionsForAnswers(answers);
      const selected = answers.functional || [];
      return (
        <>
          <StepHeading title={s.title} description={s.description} />
          <div className="mt-8 space-y-8">
            {groups.map(({ category, serviceId, options }) => (
              <div key={category}>
                <p className="text-xs uppercase font-bold tracking-widest text-brand-cyan/80 mb-3">
                  {serviceCategoryLabels?.[serviceId] || category}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {options.map((opt) => (
                    <Pill
                      key={opt.id}
                      label={s.options[opt.id]?.label || opt.id}
                      selected={selected.includes(opt.id)}
                      onClick={() => onAnswer("functional", toggleInArray(selected, opt.id))}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }

    case "visual": {
      const s = steps.visual;
      const axes = answers.axes || {};
      return (
        <>
          <StepHeading title={s.title} />
          <div className="mt-8 space-y-6">
            {VISUAL_AXES.map(({ id }) => (
              <SliderField
                key={id}
                leftLabel={s.axes[id].left}
                rightLabel={s.axes[id].right}
                value={axes[id]}
                onChange={(value) => onAnswer("axes", { ...axes, [id]: value })}
              />
            ))}
          </div>

          <div className="mt-10">
            <p className="text-xs uppercase font-bold tracking-widest text-white/40 mb-3">{s.animationLabel}</p>
            <div className="grid gap-3">
              {Object.entries(s.animationOptions).map(([id, opt]) => (
                <AnswerOptionCard key={id} label={opt.label} selected={answers.animationLevel === id} onClick={() => onAnswer("animationLevel", id)} />
              ))}
            </div>
          </div>
        </>
      );
    }

    case "materials": {
      const s = steps.materials;
      const selected = answers.materials || [];
      return (
        <>
          <StepHeading title={s.title} description={s.description} />
          <div className="mt-8 grid gap-3">
            {Object.entries(s.options).map(([id, opt]) => (
              <AnswerOptionCard key={id} label={opt.label} selected={selected.includes(id)} onClick={() => onAnswer("materials", toggleInArray(selected, id))} />
            ))}
          </div>
        </>
      );
    }

    case "timeline": {
      const s = steps.timeline;
      return (
        <>
          <StepHeading title={s.title} />
          <div className="mt-8 grid gap-3">
            {Object.entries(s.options).map(([id, opt]) => (
              <AnswerOptionCard key={id} label={opt.label} selected={answers.timeline === id} onClick={() => onAnswer("timeline", id)} />
            ))}
          </div>

          <div className="mt-8">
            <p className="text-xs uppercase font-bold tracking-widest text-white/40 mb-3">{s.hasDeadlineLabel}</p>
            <div className="flex gap-2.5">
              <Pill label="Tak" selected={answers.hasDeadline === true} onClick={() => onAnswer("hasDeadline", true)} />
              <Pill label="Nie" selected={answers.hasDeadline === false} onClick={() => onAnswer("hasDeadline", false)} />
            </div>
          </div>

          {answers.hasDeadline === true && (
            <div className="mt-6">
              <TextField label={s.deadlineDateLabel} placeholder={s.deadlineDatePlaceholder} value={answers.deadlineDate} onChange={(v) => onAnswer("deadlineDate", v)} />
            </div>
          )}

          <div className="mt-8">
            <p className="text-xs uppercase font-bold tracking-widest text-white/40 mb-3">{s.priorityLabel}</p>
            <div className="flex flex-wrap gap-2.5">
              {Object.entries(s.priorityOptions).map(([id, opt]) => (
                <Pill key={id} label={opt.label} selected={answers.priority === id} onClick={() => onAnswer("priority", id)} />
              ))}
            </div>
          </div>
        </>
      );
    }

    case "budget": {
      const s = steps.budget;
      return (
        <>
          <StepHeading title={s.title} />
          <div className="mt-8 grid gap-3">
            {BUDGET_TIERS.map(({ id }) => (
              <AnswerOptionCard key={id} label={s.options[id].label} selected={answers.budget === id} onClick={() => onAnswer("budget", id)} />
            ))}
          </div>
        </>
      );
    }

    case "context": {
      const s = steps.context;
      return (
        <>
          <StepHeading title={s.title} description={s.description} />
          <textarea
            value={answers.context || ""}
            onChange={(event) => onAnswer("context", event.target.value)}
            placeholder={s.placeholder}
            rows={6}
            maxLength={2000}
            className="mt-8 w-full resize-none rounded-lg border border-white/15 bg-white/[0.02] p-4 text-white placeholder:text-white/25 focus:outline-none focus:border-brand-cyan transition-colors"
          />
        </>
      );
    }

    default:
      return null;
  }
};

export default QuestionRenderer;

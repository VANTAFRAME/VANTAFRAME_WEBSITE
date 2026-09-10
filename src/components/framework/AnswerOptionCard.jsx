import React from "react";

const AnswerOptionCard = ({ label, description, selected, onClick, Icon, cursorLabel = "SELECT" }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    data-cursor-label={cursorLabel}
    className={[
      "cursor-hover group relative flex items-center gap-4 rounded-lg border px-5 py-4 text-left transition-colors duration-300",
      selected
        ? "border-brand-cyan/60 bg-brand-cyan/[0.06]"
        : "border-white/12 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]",
    ].join(" ")}
  >
    {Icon && (
      <span
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center transition-colors duration-300",
          selected ? "text-brand-cyan" : "text-white/50 group-hover:text-white/80",
        ].join(" ")}
      >
        <Icon />
      </span>
    )}
    <span className="min-w-0">
      <span className={["block text-sm md:text-base font-medium", selected ? "text-white" : "text-white/85"].join(" ")}>
        {label}
      </span>
      {description && <span className="mt-0.5 block text-xs text-white/45">{description}</span>}
    </span>
    <span
      className={[
        "ml-auto h-2 w-2 shrink-0 rounded-full border transition-colors duration-300",
        selected ? "border-brand-cyan bg-brand-cyan" : "border-white/25 bg-transparent",
      ].join(" ")}
      aria-hidden="true"
    />
  </button>
);

export default AnswerOptionCard;

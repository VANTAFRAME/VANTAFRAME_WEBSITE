// Shared plain-text summary builder — used by both the "copy summary" action and the
// lead email body, so the two never drift apart.
export const buildSummaryText = ({ t, answers, recommendation, categoryLabel, featureLabel, materialLabel }) => {
  const lines = [];
  lines.push(`${t.summary.heading} — ${recommendation.projectId}`);
  lines.push("");
  if (answers.goal) lines.push(`${t.summary.sections.primaryGoal}: ${t.steps.goal.options[answers.goal]?.label || answers.goal}`);
  if (recommendation.recommendedSolution.length) {
    lines.push(`${t.summary.sections.recommendedSolution}: ${recommendation.recommendedSolution.map(categoryLabel).join(", ")}`);
  }
  if (recommendation.phases[0].items.length) {
    lines.push(`${t.summary.phaseLabels.start}: ${recommendation.phases[0].items.map(featureLabel).join(", ")}`);
  }
  if (recommendation.phases[1].items.length) {
    lines.push(`${t.summary.phaseLabels.growth}: ${recommendation.phases[1].items.map(featureLabel).join(", ")}`);
  }
  if (recommendation.requiredMaterials.length) {
    lines.push(`${t.summary.sections.materialsNeeded}: ${recommendation.requiredMaterials.map(materialLabel).join(", ")}`);
  }
  lines.push(`${t.summary.sections.nextStep}: ${t.summary.nextStepCopy[recommendation.nextStep] || recommendation.nextStep}`);
  return lines.join("\n");
};

import React from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";
import CaseShowcase from "../shared/CaseShowcase";
import WorkflowDiagram from "./WorkflowDiagram";
import FrameworkPreview from "./FrameworkPreview";
const AutomationShowcase = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].automatyzacjePage.showcase;
  return <CaseShowcase t={t} visuals={{ workflow: <WorkflowDiagram />, framework: <FrameworkPreview /> }} />;
};
export default AutomationShowcase;
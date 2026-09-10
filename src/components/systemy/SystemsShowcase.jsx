import React from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";
import CaseShowcase from "../shared/CaseShowcase";

const SystemsShowcase = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].systemyPage.systemsShowcase;
  return <CaseShowcase t={t} />;
};

export default SystemsShowcase;

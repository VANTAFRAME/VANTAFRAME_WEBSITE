import React from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";
import Process from "../Process";
// "How we work" on /o-nas/: the home page's five-step process (same steps, same animation) under the
// anchor #jak-pracujemy and this page's heading.
const ProcessSection = () => {
  const lang = useStore(currentLang, () => "pl");
  return <Process id="jak-pracujemy" title={languages[lang].aboutPage.processTitle} />;
};
export default ProcessSection;
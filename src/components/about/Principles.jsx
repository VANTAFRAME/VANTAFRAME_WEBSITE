import React from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";
import Manifesto from "../shared/Manifesto";
// "Principles": the pinned manifesto used on the service pages, with this page's three lines.
const Principles = () => {
  const lang = useStore(currentLang, () => "pl");
  return <Manifesto t={languages[lang].aboutPage.principles} strong height="230vh" />;
};
export default Principles;
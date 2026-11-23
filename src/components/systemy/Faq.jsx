import React from "react";
import { useStore } from "../../lib/useStore";
import { currentLang } from "../../i18n/store";
import { languages } from "../../i18n/translations";
import FaqList from "../shared/FaqList";
import LinkedText from "../LinkedText";
// FAQ of /systemy/ (same block as the AI service pages). Answers may contain [text](url) links.
const Faq = () => {
  const lang = useStore(currentLang, () => "pl");
  const t = languages[lang].systemyPage.faq;
  const newTab = languages[lang].vantasignal.newTab;
  return <FaqList label={t.label} heading={t.heading} items={t.items} renderAnswer={(a) => <LinkedText text={a} newTabLabel={newTab} />} />;
};
export default Faq;
import React from "react";
import { useService } from "./useService";
import FaqList from "../shared/FaqList";
import LinkedText from "../LinkedText";
// Under the questions of the /wdrozenia-ai/ pillar: one contextual line linking to the knowledge-base article.
const ARTICLE_NOTE = {
  pl: "Więcej o kolejnych krokach piszemy w artykule [Jak wdrożyć AI w firmie: krok po kroku](/wiedza/jak-wdrozyc-ai-w-firmie/).",
  en: "We describe the steps in more detail in [How to implement AI in a company: step by step](/wiedza/jak-wdrozyc-ai-w-firmie/).",
};
// FAQ of an AI service page: the shared presentational block (native <details>, answers in the
// server-rendered HTML) fed with this service's questions.
const Faq = ({ data, slug }) => {
  const { c, ui, lang } = useService(data);
  const { faq } = c;
  return <FaqList label={ui.faq} heading={faq.heading} items={faq.items} footnote={slug === "wdrozenia-ai" ? <LinkedText text={ARTICLE_NOTE[lang] || ARTICLE_NOTE.pl} /> : null} />;
};
export default Faq;
import React from "react";
import AssistantsVisual from "./visuals/AssistantsVisual";
import { useService } from "./useService";
// Binds the Assistants visual to the asystenci-ai content (caption + text equivalent, in the
// visitor's language). Kept as its own tiny island so a page only ships its own visual.
const VisualAssistants = ({ data }) => {
  const { c } = useService(data);
  return <AssistantsVisual caption={c.hero.visualCaption} a11y={c.hero.visualA11y} labels={c.hero.visualLabels} />;
};
export default VisualAssistants;
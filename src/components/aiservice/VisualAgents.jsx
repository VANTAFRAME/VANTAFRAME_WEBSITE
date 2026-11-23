import React from "react";
import AgentsVisual from "./visuals/AgentsVisual";
import { useService } from "./useService";
// Binds the Agents visual to the agenci-ai content (caption + text equivalent, in the
// visitor's language). Kept as its own tiny island so a page only ships its own visual.
const VisualAgents = ({ data }) => {
  const { c } = useService(data);
  return <AgentsVisual caption={c.hero.visualCaption} a11y={c.hero.visualA11y} labels={c.hero.visualLabels} />;
};
export default VisualAgents;
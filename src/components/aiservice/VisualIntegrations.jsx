import React from "react";
import IntegrationsVisual from "./visuals/IntegrationsVisual";
import { useService } from "./useService";
// Binds the Integrations visual to the integracje-ai content (caption + text equivalent, in the
// visitor's language). Kept as its own tiny island so a page only ships its own visual.
const VisualIntegrations = ({ data }) => {
  const { c } = useService(data);
  return <IntegrationsVisual caption={c.hero.visualCaption} a11y={c.hero.visualA11y} labels={c.hero.visualLabels} />;
};
export default VisualIntegrations;
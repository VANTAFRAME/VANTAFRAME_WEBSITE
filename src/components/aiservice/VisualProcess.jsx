import React from "react";
import ProcessVisual from "./visuals/ProcessVisual";
import { useService } from "./useService";
// Binds the Process visual to the automatyzacja-procesow content (caption + text equivalent, in the
// visitor's language). Kept as its own tiny island so a page only ships its own visual.
const VisualProcess = ({ data }) => {
  const { c } = useService(data);
  return <ProcessVisual caption={c.hero.visualCaption} a11y={c.hero.visualA11y} labels={c.hero.visualLabels} />;
};
export default VisualProcess;
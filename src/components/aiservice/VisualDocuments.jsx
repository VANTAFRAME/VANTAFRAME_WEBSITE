import React from "react";
import DocumentsVisual from "./visuals/DocumentsVisual";
import { useService } from "./useService";
// Binds the Documents visual to the automatyzacja-dokumentow content (caption + text equivalent, in the
// visitor's language). Kept as its own tiny island so a page only ships its own visual.
const VisualDocuments = ({ data }) => {
  const { c } = useService(data);
  return <DocumentsVisual caption={c.hero.visualCaption} a11y={c.hero.visualA11y} labels={c.hero.visualLabels} />;
};
export default VisualDocuments;
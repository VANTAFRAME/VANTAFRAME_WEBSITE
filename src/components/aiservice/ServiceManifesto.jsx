import React from "react";
import { useService } from "./useService";
import ManifestoBase from "../shared/Manifesto";
// The pinned statement used on /strony/ and /systemy/ (shared/Manifesto): the page stops for a
// moment, three "we do not…" lines cross-fade as the visitor scrolls, then resolve into the
// final line and the page's own steps. Copy lives in each service's data file (`manifesto`).
const ServiceManifesto = ({ data, slug }) => {
  const { c } = useService(data);
  return <ManifestoBase t={c.manifesto} strong height="230vh" />;
};
export default ServiceManifesto;
import React from "react";
import Process from "../shared/Process";
import { useService } from "./useService";
// Collaboration process for this service: the site's existing sticky-heading timeline
// (shared/Process) fed with the service's own five steps.
const ServiceProcess = ({ data, slug }) => {
  const { c } = useService(data);
  return <Process content={c.process} />;
};
export default ServiceProcess;
import { projects as staticProjects } from "../data/projects";
import { FEATURED_LIMIT, normalizeProject } from "./projectShape";

const withFeaturedFallback = (project, index) =>
  normalizeProject({
    ...project,
    image_url: project.image,
    sort_order: index,
    is_featured: index < FEATURED_LIMIT,
    featured_order: index < FEATURED_LIMIT ? index : null,
  });

export const fallbackProjects = staticProjects.map(withFeaturedFallback);
export const fallbackFeaturedProjects = fallbackProjects.slice(0, FEATURED_LIMIT);

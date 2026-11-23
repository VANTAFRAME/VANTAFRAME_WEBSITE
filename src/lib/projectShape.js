export const TILE_SIZE_PATTERN = [
  "wide",
  "square",
  "square",
  "square",
  "square",
  "wide",
  "tall",
  "tall",
  "wide",
  "wide",
  "square",
  "square",
  "wide",
  "tall",
  "square",
];
export const FEATURED_LIMIT = 6;
export const normalizeProject = (project) => ({
  id: Number(project.id),
  title: project.title,
  category: project.category,
  categoryPl: project.categoryPl || project.category_pl || null,
  image: project.image_url || project.image,
  url: project.url,
  caseStudySlug: project.case_study_slug || project.caseStudySlug || null,
  size: project.size || "square",
  isFeatured: Boolean(project.is_featured ?? project.isFeatured),
  featuredOrder:
    project.featured_order === null || project.featured_order === undefined
      ? null
      : Number(project.featured_order),
  sortOrder: Number(project.sort_order ?? project.sortOrder ?? 0),
});
export const pickTileSize = (index) => TILE_SIZE_PATTERN[index % TILE_SIZE_PATTERN.length];
// Category label in the visitor's language (Polish falls back to the English label).
export const projectCategory = (project, lang) => (lang === "pl" && project.categoryPl) || project.category;
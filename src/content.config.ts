import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
// Knowledge-base articles: src/content/wiedza/<slug>.md (the slug is the file name). See src/data/wiedzaConfig.js.
const wiedza = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/wiedza" }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string(),
    description: z.string(),
    lead: z.string(),
    category: z.enum(["Wdrożenia AI", "Automatyzacja", "Bezpieczeństwo i prawo", "Strony i systemy"]),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    summary: z.array(z.string()),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    relatedService: z.object({ label: z.string(), href: z.string() }),
    author: z.string().default("dawid-jaskiewicz"), // id from src/data/authors.js
    priority: z.number().default(0), // same publishedAt: higher first (the main guide has 10)
    draft: z.boolean().default(false),
  }),
});
export const collections = { wiedza };
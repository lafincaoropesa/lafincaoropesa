import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const legal = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/legal" }),
  schema: z.object({
    title: z.string(),
    lastUpdated: z.string().optional(),
    // true tant que le texte définitif (données juridiques réelles) n'a pas remplacé le TODO.
    // Le build de production échoue si un seul document a todo: true — voir scripts/check-legal-todos.mjs.
    todo: z.boolean(),
  }),
});

export const collections = { legal };

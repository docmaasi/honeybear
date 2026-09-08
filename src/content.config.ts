import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    category: z.enum([
      "metaverse",
      "cheating",
      "dating",
      "relationships",
      "safety",
    ]),
    image: z.string(),
    /** The question this post answers, used for FAQ structured data. */
    answers: z.string(),
    quickAnswer: z.string(),
    book: z.boolean().default(false),
  }),
});

export const collections = { blog };

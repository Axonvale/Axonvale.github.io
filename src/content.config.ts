import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    status: z.enum(['open', 'closed']),
    tagline: z.string(),
    order: z.number().default(0),
    platforms: z.array(z.string()),
    capabilities: z.array(z.object({ key: z.string(), value: z.string() })).default([]),
    demoVideo: z.string().nullable().default(null),
    links: z
      .object({
        github: z.string().optional(),
        store: z.string().optional(),
        contact: z.string().optional(),
      })
      .default({}),
  }),
});

export const collections = { products };

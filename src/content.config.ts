import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const metric = z.object({
  n: z.string(),          // the figure itself, e.g. "70%" or "10,000"
  l: z.string(),          // what it measures
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Card-level framing
    summary: z.string(),
    role: z.string(),
    period: z.string(),
    badges: z.array(z.string()).default([]),
    live: z.boolean().default(false),
    // Filtering on /work
    tags: z.array(z.enum(['product', 'ai', 'eng', 'shipped'])).min(1),
    metrics: z.array(metric).default([]),
    links: z
      .object({
        live: z.string().url().optional(),
        code: z.string().url().optional(),
        prd: z.string().optional(),
      })
      .default({}),
    // Ordering: featured projects drive the cinematic home page
    featured: z.boolean().default(false),
    order: z.number(),
  }),
});

const artifacts = defineCollection({
  loader: glob({ base: './src/content/artifacts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    kind: z.string(),                       // e.g. "PRD", "Architecture review"
    related: z.string().optional(),         // project id this belongs to
    order: z.number(),
  }),
});

export const collections = { projects, artifacts };

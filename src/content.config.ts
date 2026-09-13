import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const metric = z.object({
  n: z.string(),          // the figure itself, e.g. "70%" or "10,000"
  l: z.string(),          // what it measures
});

/**
 * Two of the three content tiers live here, separated by `depth`:
 *   case-study — the handful he'd actually be interviewed on (1,500-2,500 words)
 *   project    — real builds that aren't centerpieces (600-1,000 words)
 * The third tier (roles, no narrative) is the `experience` collection below.
 */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    summary: z.string(),
    role: z.string(),
    period: z.string(),
    depth: z.enum(['case-study', 'project']),
    // Groups the work index once one employer carries several entries,
    // so AWS items don't flood a flat list.
    org: z.string().optional(),
    badges: z.array(z.string()).default([]),
    live: z.boolean().default(false),
    tags: z
      .array(z.enum(['product', 'ai', 'eng', 'analytics', 'gtm', 'research', 'shipped']))
      .min(1),
    metrics: z.array(metric).default([]),
    links: z
      .object({
        live: z.string().url().optional(),
        code: z.string().url().optional(),
        prd: z.string().optional(),
      })
      .default({}),
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

/** Tier three: a role, its outcomes, and nothing else. No narrative. */
const experience = defineCollection({
  loader: glob({ base: './src/content/experience', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    org: z.string(),
    role: z.string(),
    location: z.string().optional(),
    start: z.string(),                      // display strings, e.g. "Jul 2023"
    end: z.string(),                        // "Present" is valid
    kind: z.enum(['work', 'education', 'volunteer']).default('work'),
    summary: z.string(),
    outcomes: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]),  // project ids to link into
    order: z.number(),                      // ascending = most recent first
  }),
});

export const collections = { projects, artifacts, experience };

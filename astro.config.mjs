// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// User site: served at the domain root, so no `base` path.
export default defineConfig({
  site: 'https://easonhanyc.github.io',
  integrations: [mdx(), sitemap()],
  markdown: { shikiConfig: { theme: 'github-dark-dimmed', wrap: true } },
  // The AI project was renamed when its case study was corrected to describe
  // release automation rather than code review. Keeps the old URL alive.
  redirects: {
    '/work/ai-code-review': '/work/pr-automation',
    '/work/aws-insights-platform': '/work/action-hub',
  },
});

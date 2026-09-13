// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// User site: served at the domain root, so no `base` path.
export default defineConfig({
  site: 'https://easonhanyc.github.io',
  integrations: [mdx(), sitemap()],
  markdown: { shikiConfig: { theme: 'github-dark-dimmed', wrap: true } },
});

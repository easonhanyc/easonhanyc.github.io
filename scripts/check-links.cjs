/**
 * Link check over the built site. No browser — it reads dist/ directly.
 *
 *   - every internal href resolves to a page that exists
 *   - every off-site link opens in a new tab, with rel="noopener"
 *   - no internal link or mailto: opens in a new tab
 *
 * The second rule needs a check because it cannot be automated in the build:
 * Astro's default Markdown processor no longer takes rehypePlugins without
 * swapping the whole remark pipeline back in, so prose links carry target and
 * rel by hand. This is what catches the next one that forgets.
 *
 * Usage:  node scripts/check-links.cjs [dist]
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || 'dist';
let fail = 0;
const bad = (m) => { console.log('  ✗ ' + m); fail++; };
const ok = (m) => console.log('  ✓ ' + m);

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    e.isDirectory() ? walk(p) : files.push(p);
  }
})(ROOT);

const served = new Set();
for (const f of files) {
  const rel = '/' + path.relative(ROOT, f).split(path.sep).join('/');
  served.add(rel);
  if (rel.endsWith('/index.html')) served.add(rel.slice(0, -10));
}

const pages = files.filter((f) => f.endsWith('.html'));
const anchors = /<a\b([^>]*)>/gi;
const attr = (tag, name) => (tag.match(new RegExp(`${name}="([^"]*)"`, 'i')) || [])[1];

let internal = 0, external = 0;
const broken = [], leaky = [], selfTab = [];

for (const f of pages) {
  const html = fs.readFileSync(f, 'utf8');
  const where = '/' + path.relative(ROOT, f).split(path.sep).join('/');
  for (const m of html.matchAll(anchors)) {
    const tag = m[1];
    const href = attr(tag, 'href');
    if (!href) continue;
    const target = attr(tag, 'target') || '';
    const rel = attr(tag, 'rel') || '';

    if (/^https?:\/\//i.test(href)) {
      external++;
      if (target !== '_blank' || !/noopener/.test(rel)) leaky.push(`${where} → ${href} (target="${target}" rel="${rel}")`);
    } else if (href.startsWith('mailto:') || href.startsWith('#')) {
      if (target === '_blank') selfTab.push(`${where} → ${href}`);
    } else if (href.startsWith('/')) {
      internal++;
      if (target === '_blank') selfTab.push(`${where} → ${href}`);
      const clean = href.split(/[#?]/)[0];
      if (!served.has(clean) && !served.has(clean.replace(/\/$/, '')) && !served.has(clean.replace(/\/?$/, '/')))
        broken.push(`${where} → ${href}`);
    }
  }
}

console.log(`${pages.length} pages, ${internal} internal and ${external} off-site links`);
broken.length ? broken.forEach((b) => bad('broken: ' + b)) : ok('every internal link resolves');
leaky.length ? leaky.forEach((l) => bad('off-site link stays in the tab: ' + l))
             : ok('every off-site link opens in a new tab with rel="noopener"');
selfTab.length ? selfTab.forEach((s) => bad('opens a pointless new tab: ' + s))
               : ok('no internal or mailto link opens a new tab');

console.log(fail ? `\n${fail} problem(s)` : '\nlinks are sound');
process.exit(fail ? 1 : 0);

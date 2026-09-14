/**
 * Diagram checks that desktop review does not catch.
 *
 *   1. Legibility — an SVG with a 700-wide viewBox squeezed into a phone-width
 *      text column renders 10px labels at about 5px. Fails under 9px.
 *   2. Containment — a label that overflows the box it belongs to.
 *
 * Both are needed: containment alone is scale-invariant, so a diagram shrunk
 * to illegibility passes it cleanly. That is exactly how every figure on this
 * site came to render at 4.6-5.1px on a phone without anything complaining.
 *
 * Usage:  npm run build && npx http-server dist -p 8080 &
 *         node scripts/check-diagrams.cjs http://127.0.0.1:8080
 */
// Playwright is deliberately not a dependency of this project: adding it would
// desync package-lock.json unless installed, and the Pages build runs `npm ci`.
// Install it where you run the check:  npm i -D playwright && npx playwright install chromium
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  try {
    ({ chromium } = require(require('child_process')
      .execSync('npm root -g', { encoding: 'utf8' }).trim() + '/playwright'));
  } catch {
    console.error('This check needs Playwright.\n  npm i -D playwright && npx playwright install chromium');
    process.exit(2);
  }
}

const BASE = process.argv[2] || 'http://127.0.0.1:8080';
const MIN_PX = 9;
const PAGES = [
  'action-hub', 'allowlist', 'asteroid-screening', 'datafest-2023', 'formula-1-trends',
  'genai-adoption-program', 'genai-target-setting', 'kickstarter-scraper', 'pr-automation',
  'tripmatch', 'pacman-dqn', 'secure-networking-tracker', 'job-search-agent',
];

(async () => {
  const browser = await chromium.launch();
  let failures = 0;

  for (const slug of PAGES) {
    for (const width of [390, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.route('**://fonts.g*/**', (r) => r.abort());   // webfonts are not needed for geometry
      await page.goto(`${BASE}/work/${slug}/`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(300);

      const result = await page.evaluate((minPx) => {
        const svg = document.querySelector('.prose .dg svg');
        if (!svg) return null;
        const box = svg.getBoundingClientRect();
        const scale = box.width / (svg.viewBox.baseVal.width || box.width);

        const tooSmall = [];
        const clipped = [];
        const rects = [...svg.querySelectorAll('rect')].map((r) => r.getBoundingClientRect());

        for (const t of svg.querySelectorAll('text')) {
          const size = (parseFloat(t.getAttribute('font-size')) || 10) * scale;
          if (size < minPx) tooSmall.push(`${t.textContent.slice(0, 30)} @ ${size.toFixed(1)}px`);

          const tb = t.getBoundingClientRect();
          const cx = (tb.left + tb.right) / 2, cy = (tb.top + tb.bottom) / 2;
          const host = rects.find((r) => cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom);
          if (host && (tb.left < host.left + 1 || tb.right > host.right - 1)) clipped.push(t.textContent.slice(0, 40));
        }
        return { tooSmall, clipped };
      }, MIN_PX);

      await page.close();
      if (!result) continue;

      // Label size only matters where the reader actually is; check it at phone width.
      const small = width === 390 ? result.tooSmall : [];
      if (small.length || result.clipped.length) {
        failures++;
        console.log(`✗ ${slug} @ ${width}px`);
        small.forEach((s) => console.log(`    under ${MIN_PX}px: ${s}`));
        result.clipped.forEach((c) => console.log(`    overflows its box: ${c}`));
      }
    }
  }

  await browser.close();
  console.log(failures ? `\n${failures} diagram problem(s)` : `\nall ${PAGES.length} diagrams legible and contained`);
  process.exit(failures ? 1 : 0);
})();

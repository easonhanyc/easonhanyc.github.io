/**
 * Touch-target check.
 *
 * Measures the *tappable* area, not the painted box: several controls here are
 * deliberately small and gain their hit area from a pseudo-element, which
 * getBoundingClientRect cannot see. Probes upward and downward with
 * elementFromPoint instead.
 *
 * Inline links inside prose are reported separately and never fail — they are
 * words in a sentence, and extending them vertically would steal taps from the
 * line above.
 *
 * Usage:  node scripts/check-touch.cjs http://127.0.0.1:8080
 */
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
const MIN = 40;
const ROUTES = ['/', '/work/', '/experience/', '/about/', '/artifacts/',
                '/work/action-hub/', '/work/tripmatch/', '/artifacts/tripmatch-prd/'];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.route('**://fonts.g*/**', (r) => r.abort());
  let fails = 0;

  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);
    // the site sets scroll-behavior:smooth, which would make every measurement
    // below race the scroll animation and read off-screen coordinates
    await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });

    const found = await page.evaluate((min) => {
      const out = [];
      for (const el of document.querySelectorAll('a, button')) {
        if (!el.getBoundingClientRect().height) continue;
        el.scrollIntoView({ block: 'center', behavior: 'instant' });
        const b = el.getBoundingClientRect(), cx = b.left + b.width / 2;
        let up = 0, down = 0;
        for (let d = 1; d <= 26; d++) { const t = document.elementFromPoint(cx, b.top - d); if (t === el || el.contains(t)) up = d; else break; }
        for (let d = 1; d <= 26; d++) { const t = document.elementFromPoint(cx, b.bottom + d); if (t === el || el.contains(t)) down = d; else break; }
        const tap = Math.round(b.height) + up + down;
        if (tap < min) out.push({ label: el.textContent.trim().slice(0, 30), tap, inline: !!el.closest('p, li, td, figcaption') });
      }
      return out;
    }, MIN);

    const standalone = found.filter((f) => !f.inline);
    const inline = found.filter((f) => f.inline);
    console.log(`${standalone.length ? '✗' : '✓'} ${route}${inline.length ? `   (${inline.length} inline text link${inline.length > 1 ? 's' : ''}, exempt)` : ''}`);
    standalone.forEach((f) => { console.log(`      ${f.tap}px  "${f.label}"`); fails++; });
  }

  await browser.close();
  console.log(fails ? `\n${fails} control(s) under ${MIN}px` : `\nevery standalone control is at least ${MIN}px tappable`);
  process.exit(fails ? 1 : 0);
})();

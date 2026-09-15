/**
 * Highlights deck check.
 *
 * The deck replaced a scroll-pinned stage, so the two things worth guarding are
 * the reasons that stage was replaced:
 *   - the section must not be taller than the viewport it sits in (no scroll-jacking)
 *   - no step's heading may be clipped, which is what a fixed-height, overflow-hidden
 *     stage did to any title that ran to two lines
 * plus the behaviour itself: one step at a time, both buttons, wrapping at the ends,
 * and all four still readable with JS off.
 *
 * Usage:  node scripts/check-deck.cjs http://127.0.0.1:8080
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
let fail = 0;
const ok = (m) => console.log('  ✓ ' + m);
const bad = (m) => { console.log('  ✗ ' + m); fail++; };

(async () => {
  const browser = await chromium.launch();

  for (const [w, h] of [[1280, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, isMobile: w < 700, hasTouch: w < 700 });
    await page.route('**://fonts.g*/**', (r) => r.abort());
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    console.log(`${w}×${h}`);

    const shape = await page.evaluate(() => {
      const hl = document.querySelector('[data-hl]');
      const arw = document.querySelectorAll('.arw:not([hidden])');
      return { tall: hl.offsetHeight / window.innerHeight, arrows: arw.length,
               steps: document.querySelectorAll('[data-step]').length };
    });
    shape.tall <= 1.35 ? ok(`section is ${shape.tall.toFixed(2)}× the viewport — nothing pinned`)
                       : bad(`section is ${shape.tall.toFixed(2)}× the viewport; scroll is being held`);
    shape.arrows === 2 ? ok('a previous and a next button') : bad(`${shape.arrows} arrow button(s)`);

    // walk one full cycle and back round to the start
    for (let k = 0; k <= shape.steps; k++) {
      const st = await page.evaluate(() => {
        const on = document.querySelector('.step.on');
        if (!on) return null;
        const cell = document.querySelector('.steps').getBoundingClientRect();
        const n = on.querySelector('.n').getBoundingClientRect();
        return { i: [...document.querySelectorAll('.step')].indexOf(on),
                 t: on.querySelector('.n').textContent,
                 active: document.querySelectorAll('.step.on').length,
                 fits: n.top >= cell.top - 0.5 && n.bottom <= cell.bottom + 0.5 };
      });
      if (!st) { bad('no step is active'); break; }
      if (st.active !== 1) bad(`${st.active} steps active at once`);
      if (!st.fits) bad(`"${st.t}" is clipped by its cell`);
      if (k % shape.steps !== st.i) bad(`expected step ${k % shape.steps}, got ${st.i}`);
      await page.click('.arw.next');
      await page.waitForTimeout(520);
    }
    if (!fail) ok(`${shape.steps} steps cycle and wrap, one at a time, none clipped`);

    // each card carries a mock screen: its labels have to be readable at this
    // width, and nothing may be drawn outside the viewBox it is scaled by
    const mocks = await page.evaluate(() => {
      const out = [];
      for (const s of document.querySelectorAll('.step')) {
        const svg = s.querySelector('.viz svg');
        if (!svg) continue;
        const vb = svg.viewBox.baseVal;
        const scale = svg.getBoundingClientRect().width / vb.width;
        if (!scale) continue;                       // hidden in the no-JS fallback
        const labels = [...svg.querySelectorAll('text')]
          .map((t) => ({ t: t.textContent.slice(0, 20), px: +(parseFloat(getComputedStyle(t).fontSize) * scale).toFixed(1) }));
        const escaped = [...svg.querySelectorAll('text,rect,circle,path')]
          .filter((el) => { const b = el.getBBox(); return b.x < -0.5 || b.y < -0.5 || b.x + b.width > vb.width + 0.5 || b.y + b.height > vb.height + 0.5; })
          .map((el) => el.tagName + (el.textContent ? `:"${el.textContent.slice(0, 18)}"` : ''));
        out.push({ name: s.querySelector('.n').textContent, min: labels.length ? Math.min(...labels.map((l) => l.px)) : null,
                   worst: labels.length ? labels.reduce((a, b) => (b.px < a.px ? b : a)).t : '', escaped });
      }
      return out;
    });
    if (mocks.length) {
      const tiny = mocks.filter((m) => m.min !== null && m.min < 9);
      const out = mocks.filter((m) => m.escaped.length);
      tiny.forEach((m) => bad(`"${m.name}" mock label at ${m.min}px ("${m.worst}") — under 9px`));
      out.forEach((m) => bad(`"${m.name}" mock draws outside its viewBox: ${JSON.stringify(m.escaped.slice(0, 3))}`));
      if (!tiny.length && !out.length)
        ok(`${mocks.length} mock screens legible (min ${Math.min(...mocks.map((m) => m.min)).toFixed(1)}px) and inside their viewBox`);
    }
    await page.close();
  }

  // with JS off every step has to be readable at once
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  const np = await ctx.newPage();
  await np.route('**://fonts.g*/**', (r) => r.abort());
  await np.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const nojs = await np.evaluate(() => {
    const steps = [...document.querySelectorAll('[data-step]')];
    return { total: steps.length, faint: steps.filter((s) => parseFloat(getComputedStyle(s).opacity) < 0.9).length,
             arrows: [...document.querySelectorAll('.arw')].filter((a) => getComputedStyle(a).display !== 'none' && !a.hidden).length };
  });
  nojs.faint === 0 ? ok(`all ${nojs.total} steps visible without JS`) : bad(`${nojs.faint} step(s) hidden without JS`);
  nojs.arrows === 0 ? ok('the buttons stay hidden without JS') : bad(`${nojs.arrows} dead button(s) shown without JS`);

  await browser.close();
  console.log(fail ? `\n${fail} check(s) failed` : '\nthe highlights deck behaves');
  process.exit(fail ? 1 : 0);
})();

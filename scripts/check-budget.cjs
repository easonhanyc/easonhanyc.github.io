/**
 * Simplicity check: the limits the design sets for itself, measured on the
 * built site so they cannot quietly creep back.
 *
 *   Home, first screen (1440×900)   words, links and buttons, raised surfaces
 *   Home, phone (390×844)           who/pitch/seeking on the first screen, the
 *                                   first project within a screen and a half,
 *                                   and the page's total length
 *   Every page                      six text sizes, three greys and green,
 *                                   one solid green element per screen,
 *                                   one small-capitals label per block,
 *                                   two bold phrases per paragraph
 *
 * Long-form prose, code and diagrams are content, not interface, and are
 * left out of the counts.
 *
 * Usage:  node scripts/check-budget.cjs http://127.0.0.1:8080
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
const LIMIT = { words: 80, controls: 8, surfaces: 3, sizes: 6, colours: 4, phoneLength: 5000 };
const ROUTES = ['/', '/work/', '/about/', '/artifacts/', '/work/tripmatch/', '/work/action-hub/',
                '/work/spotify-insight-pipeline/', '/artifacts/tripmatch-prd/'];
let fail = 0;
const ok = (m) => console.log('  ✓ ' + m);
const bad = (m) => { console.log('  ✗ ' + m); fail++; };
const settle = async (page) => {
  await page.addStyleTag({ content: 'html{scroll-behavior:auto !important} .rv{opacity:1 !important; transform:none !important; transition:none !important}' });
  await page.waitForTimeout(300);
};

(async () => {
  const browser = await chromium.launch();

  console.log('Home, first screen (1440×900)');
  let page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await settle(page);
  const first = await page.evaluate(() => {
    const vh = innerHeight, vw = innerWidth;
    const onScreen = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.top < vh && r.bottom > 0 && r.left < vw && r.right > 0; };
    let words = 0;
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const t = w.currentNode.textContent.trim(), el = w.currentNode.parentElement;
      if (!t || !el || el.closest('script,style,svg') || !onScreen(el)) continue;
      words += t.split(/\s+/).length;
    }
    return {
      words,
      controls: [...document.querySelectorAll('a,button')].filter(onScreen).length,
      surfaces: [...document.querySelectorAll('.tile')].filter(onScreen).length,
    };
  });
  first.words <= LIMIT.words ? ok(`${first.words} words (limit ${LIMIT.words})`) : bad(`${first.words} words, over the limit of ${LIMIT.words}`);
  first.controls <= LIMIT.controls ? ok(`${first.controls} links and buttons (limit ${LIMIT.controls})`) : bad(`${first.controls} links and buttons, over the limit of ${LIMIT.controls}`);
  first.surfaces <= LIMIT.surfaces ? ok(`${first.surfaces} raised surfaces (limit ${LIMIT.surfaces})`) : bad(`${first.surfaces} raised surfaces, over the limit of ${LIMIT.surfaces}`);
  await page.close();

  console.log('Home, phone (390×844)');
  page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await settle(page);
  const phone = await page.evaluate(() => {
    const bottom = (s) => Math.round(document.querySelector(s).getBoundingClientRect().bottom);
    return {
      opening: Math.max(bottom('.hero-name'), bottom('.hero-pitch'), bottom('.hero-seek')),
      project: Math.round(document.querySelector('.feat-t').getBoundingClientRect().top),
      length: document.documentElement.scrollHeight, vh: innerHeight,
    };
  });
  phone.opening <= phone.vh ? ok('name, pitch and seeking line fit the first screen') : bad(`the opening runs to ${phone.opening}px on an ${phone.vh}px screen`);
  phone.project <= phone.vh * 1.5 ? ok(`the first project starts at ${phone.project}px, within a screen and a half`) : bad(`the first project starts at ${phone.project}px, past a screen and a half`);
  phone.length <= LIMIT.phoneLength ? ok(`the page is ${phone.length}px long (limit ${LIMIT.phoneLength})`) : bad(`the page is ${phone.length}px long, over the limit of ${LIMIT.phoneLength}`);
  await page.close();

  console.log('Every page (1440×900)');
  page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    await settle(page);
    const r = await page.evaluate(() => {
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      const probe = document.createElement('i'); probe.style.color = accent; document.body.append(probe);
      const green = getComputedStyle(probe).color; probe.remove();
      const content = (e) => e.closest('svg, pre, script, style, .skip');
      const sizes = new Set(), colours = new Set();
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) {
        const el = w.currentNode.parentElement;
        if (!w.currentNode.textContent.trim() || !el || content(el) || !el.getBoundingClientRect().height) continue;
        const cs = getComputedStyle(el);
        sizes.add(cs.fontSize);
        // text set on solid green or solid ink (a pressed button) is that button's own colour
        let a = el, onSolid = false;
        while (a && a !== document.body) { const bg = getComputedStyle(a).backgroundColor; if (bg !== 'rgba(0, 0, 0, 0)') { onSolid = bg === green || !!a.closest('.chip.solid, .fbtn[aria-pressed="true"]'); break; } a = a.parentElement; }
        if (!onSolid) colours.add(cs.color);
      }
      // solid green elements, counted screen by screen
      const perScreen = {};
      for (const el of document.querySelectorAll('body *')) {
        if (content(el)) continue;
        const b = el.getBoundingClientRect();
        if (b.width < 20 || b.height < 16 || getComputedStyle(el).backgroundColor !== green) continue;
        const k = Math.floor((b.top + scrollY) / innerHeight); perScreen[k] = (perScreen[k] || 0) + 1;
      }
      const solid = Math.max(0, ...Object.values(perScreen));
      // small-capitals labels per block
      const blocks = [...document.querySelectorAll('.hero, .sec-h, .feat-copy, .feat-vis, .bk, .rows li, .pagehead, .dochead, .foot, .toc, .stop')];
      const labels = Math.max(0, ...blocks.map((b) => [...b.querySelectorAll('*')].filter((e) => getComputedStyle(e).textTransform === 'uppercase' && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())).length));
      // bold phrases per paragraph, outside long-form prose
      const bold = Math.max(0, ...[...document.querySelectorAll('main p, footer p')].filter((p) => !p.closest('.prose')).map((p) => p.querySelectorAll('strong, b').length));
      return { sizes: [...sizes], colours: colours.size, solid, labels, bold };
    });
    const problems = [];
    if (r.sizes.length > LIMIT.sizes) problems.push(`${r.sizes.length} text sizes (${r.sizes.join(', ')})`);
    if (r.colours > LIMIT.colours) problems.push(`${r.colours} text colours`);
    if (r.solid > 1) problems.push(`${r.solid} solid green elements on one screen`);
    if (r.labels > 1) problems.push(`${r.labels} small-capitals labels in one block`);
    if (r.bold > 2) problems.push(`${r.bold} bold phrases in one paragraph`);
    problems.length ? bad(`${route}  ${problems.join('; ')}`)
                    : ok(`${route}  ${r.sizes.length} sizes, ${r.colours} colours, ${r.solid} solid green, ${r.labels} label per block`);
  }
  await browser.close();
  console.log(fail ? `\n${fail} limit(s) exceeded` : '\nevery page is within its limits');
  process.exit(fail ? 1 : 0);
})();

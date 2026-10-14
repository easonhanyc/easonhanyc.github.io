/**
 * Home page check: the working rides board and the pinned profile card.
 *
 *   - the board's +1 takes a seat and gives it back, a full ride can't be joined,
 *     and the count and the announcement follow along
 *   - with JS off there are no dead buttons, and every ride and every idea still reads
 *   - the profile card fits the viewport it is pinned in, so nothing in it is
 *     reachable only by scrolling a sticky box
 *
 * Usage:  node scripts/check-board.cjs http://127.0.0.1:8080
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

  for (const [w, h] of [[1280, 760], [1440, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, isMobile: w < 700, hasTouch: w < 700 });
    await page.route('**://fonts.g*/**', (r) => r.abort());
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
    console.log(`${w}×${h}`);

    const rows = await page.evaluate(() => [...document.querySelectorAll('[data-board] li')].map((li) => ({
      name: li.querySelector('b').textContent, seats: li.querySelector('.s').textContent,
      btn: getComputedStyle(li.querySelector('button')).display !== 'none', disabled: li.querySelector('button').disabled,
    })));
    rows.length === 4 ? ok('four sample rides on the board') : bad(`${rows.length} rides on the board`);
    rows.every((r) => r.btn) ? ok('every ride has its button') : bad('a ride is missing its button');
    const full = rows.filter((r) => { const [n, , c] = r.seats.split(' '); return +n >= +c; });
    full.every((r) => r.disabled) ? ok(`${full.length} full ride(s) can't be joined`) : bad('a full ride can still be joined');

    const open = rows.findIndex((r) => !r.disabled);
    const btn = page.locator('[data-board] li button').nth(open);
    await btn.scrollIntoViewIfNeeded();
    const before = rows[open].seats;
    await btn.click();
    const after = await page.evaluate((i) => {
      const li = document.querySelectorAll('[data-board] li')[i];
      return { seats: li.querySelector('.s').textContent, pressed: li.querySelector('button').getAttribute('aria-pressed'),
               toast: document.querySelector('[data-board] .toast').textContent };
    }, open);
    const n0 = +before.split(' ')[0], n1 = +after.seats.split(' ')[0];
    n1 === n0 + 1 && after.pressed === 'true' && /Seat taken/.test(after.toast)
      ? ok(`+1 on "${rows[open].name}" took a seat (${before} → ${after.seats}) and said so`)
      : bad(`+1 on "${rows[open].name}": ${before} → ${after.seats}, pressed=${after.pressed}, "${after.toast}"`);
    await btn.click();
    const back = await page.evaluate((i) => document.querySelectorAll('[data-board] li')[i].querySelector('.s').textContent, open);
    back === before ? ok('a second tap gives the seat back') : bad(`second tap left ${back}, expected ${before}`);

    const card = await page.evaluate(() => {
      const c = document.querySelector('.idp');
      const pinned = getComputedStyle(c.parentElement).position === 'sticky';
      return { pinned, over: c.scrollHeight - c.clientHeight };
    });
    if (card.pinned) card.over <= 1 ? ok('the pinned profile card fits its viewport') : bad(`the pinned profile card overflows by ${card.over}px`);
    else ok('profile card flows with the page at this width');

    const time = await page.evaluate(() => document.querySelector('[data-clock]').textContent);
    /\d{1,2}:\d{2}/.test(time) ? ok(`Berkeley clock reads ${time}`) : bad(`clock reads "${time}"`);
    await page.close();
  }

  // with JS off: nothing that only works with script, and everything readable
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  const np = await ctx.newPage();
  await np.route('**://fonts.g*/**', (r) => r.abort());
  await np.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const nojs = await np.evaluate(() => ({
    buttons: [...document.querySelectorAll('[data-board] button, [data-ideas] button')].filter((b) => getComputedStyle(b).display !== 'none').length,
    rides: [...document.querySelectorAll('[data-board] li')].filter((li) => li.offsetHeight > 0).length,
    ideas: [...document.querySelectorAll('[data-ideas] .q')].filter((q) => q.offsetHeight > 0).length,
    faint: [...document.querySelectorAll('.rv')].filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.9).length,
  }));
  nojs.buttons === 0 ? ok('no dead buttons without JS') : bad(`${nojs.buttons} button(s) that do nothing without JS`);
  nojs.rides === 4 ? ok('all four rides readable without JS') : bad(`${nojs.rides} ride(s) readable without JS`);
  nojs.ideas === 3 ? ok('all three ideas readable without JS') : bad(`${nojs.ideas} idea(s) readable without JS`);
  nojs.faint === 0 ? ok('nothing left faded without JS') : bad(`${nojs.faint} element(s) left faded without JS`);

  await browser.close();
  console.log(fail ? `\n${fail} check(s) failed` : '\nthe home page behaves');
  process.exit(fail ? 1 : 0);
})();

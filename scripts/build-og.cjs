/**
 * Renders scripts/og-card.html to public/og.png (1200×630) — the image a link
 * preview shows on LinkedIn, Slack, iMessage and the like.
 *
 * Kept as a script rather than a one-off export so the card can be regenerated
 * when the tagline or the palette changes, instead of drifting from the site.
 * Webfonts are passed in on the command line because the card is rendered from
 * a file:// URL with no network.
 *
 * Usage:  node scripts/build-og.cjs [path/to/inlined-fonts.css]
 */
const fs = require('fs');
const path = require('path');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  try {
    ({ chromium } = require(require('child_process')
      .execSync('npm root -g', { encoding: 'utf8' }).trim() + '/playwright'));
  } catch {
    console.error('This needs Playwright.\n  npm i -D playwright && npx playwright install chromium');
    process.exit(2);
  }
}

const card = path.join(__dirname, 'og-card.html');
const out = path.join(__dirname, '..', 'public', 'og.png');
const fontCss = process.argv[2] && fs.existsSync(process.argv[2]) ? fs.readFileSync(process.argv[2], 'utf8') : null;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await p.goto('file://' + card);
  if (fontCss) await p.addStyleTag({ content: fontCss });
  else console.warn('No font CSS given — the card will render in fallback faces.');
  await p.waitForTimeout(900);
  await p.screenshot({ path: out });
  await b.close();
  console.log(`wrote ${out} (${(fs.statSync(out).size / 1024).toFixed(0)} KB)`);
})();

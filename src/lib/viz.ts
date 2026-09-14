/**
 * One small diagram per project, drawn from that project's own argument.
 *
 * Colours come from `currentColor` and the gold token rather than literals, so
 * the same drawing works on the navy blocks of the home page and on the light
 * cards of /work without a second copy.
 */
const L = 'stroke="currentColor" stroke-opacity=".5" stroke-width="1.5" fill="none"';
const F = 'fill="currentColor" fill-opacity=".3"';
const G = 'stroke="var(--gold)" stroke-width="1.7" fill="none"';

export const viz: Record<string, string> = {
  // eight mandatory steps collapse into one skill, and it stops there
  'pr-automation': `<svg viewBox="0 0 200 46" aria-hidden="true">${[0,1,2,3,4,5,6,7].map((i)=>`<rect x="${4+i*15}" y="14" width="10" height="18" rx="2" ${F}/>`).join('')}<path d="M128 23 L152 23" ${L}/><rect x="156" y="10" width="40" height="26" rx="3" ${G}/></svg>`,
  // a forecast splitting off a history that actually has one
  'genai-target-setting': `<svg viewBox="0 0 200 46" aria-hidden="true"><path d="M4 40 L44 37 L84 31 L124 20 L164 7" ${L}/><path d="M124 40 L164 31 L196 16" ${G} stroke-dasharray="4 4"/></svg>`,
  // two rows you can add and remove, two you can never edit in place
  'allowlist': `<svg viewBox="0 0 200 46" aria-hidden="true"><rect x="4" y="12" width="42" height="22" rx="3" ${L}/><rect x="54" y="12" width="42" height="22" rx="3" ${L}/><rect x="104" y="12" width="42" height="22" rx="3" stroke="currentColor" stroke-opacity=".26" stroke-width="1.5" fill="none" stroke-dasharray="3 3"/><rect x="154" y="12" width="42" height="22" rx="3" stroke="currentColor" stroke-opacity=".26" stroke-width="1.5" fill="none" stroke-dasharray="3 3"/></svg>`,
  // everyone gets a return on taking part, not only whoever finishes first
  'genai-adoption-program': `<svg viewBox="0 0 200 46" aria-hidden="true">${[0,1,2,3,4,5].map((i)=>`<rect x="${4+i*20}" y="${36-i*5}" width="13" height="${4+i*5}" rx="2" ${F}/>`).join('')}<rect x="124" y="6" width="13" height="34" rx="2" fill="var(--gold)"/><path d="M148 23 L196 23" ${L} stroke-dasharray="3 3"/></svg>`,
  // the boundary sits inside the boundary: Postgres below the API
  'secure-networking-tracker': `<svg viewBox="0 0 200 46" aria-hidden="true"><rect x="4" y="6" width="192" height="34" rx="3" ${L} stroke-dasharray="4 4"/><rect x="16" y="13" width="168" height="20" rx="2" ${L}/><rect x="28" y="18" width="144" height="10" rx="2" ${G}/></svg>`,
  // the gain is real, but it is measured against a floor that barely plays
  'pacman-dqn': `<svg viewBox="0 0 200 46" aria-hidden="true"><rect x="4" y="10" width="52" height="11" rx="2" ${F}/><rect x="4" y="27" width="110" height="11" rx="2" fill="var(--gold)"/><path d="M124 15 L196 15" ${L} stroke-dasharray="2 4"/><path d="M124 32 L196 32" ${L} stroke-dasharray="2 4"/></svg>`,
  // sparse categories keep themselves sparse
  'datafest-2023': `<svg viewBox="0 0 200 46" aria-hidden="true"><circle cx="100" cy="23" r="18" ${L}/><circle cx="100" cy="23" r="9" ${G} stroke-dasharray="2 4"/><path d="M100 1 l6 5 -6 5 z" fill="var(--gold)"/></svg>`,
  // speed rises to a peak, falls, and only partly recovers
  'formula-1-trends': `<svg viewBox="0 0 200 46" aria-hidden="true"><path d="M4 38 L38 31 L72 19 L98 9 L124 32 L152 28 L196 21" ${L}/><circle cx="98" cy="9" r="3" fill="var(--gold)"/></svg>`,
  // one path returns nothing at all, and does not say so
  'kickstarter-scraper': `<svg viewBox="0 0 200 46" aria-hidden="true"><path d="M4 14 L92 14" ${L} stroke-dasharray="3 3"/><path d="M96 9 l9 5 -9 5 z" fill="currentColor" fill-opacity=".3"/><text x="112" y="18" font-family="ui-monospace,monospace" font-size="9" fill="currentColor" fill-opacity=".45">nothing</text><path d="M4 34 L150 34" ${G}/><path d="M154 29 l9 5 -9 5 z" fill="var(--gold)"/></svg>`,
  // half the label was sitting in the features
  'asteroid-screening': `<svg viewBox="0 0 200 46" aria-hidden="true"><circle cx="82" cy="23" r="17" ${L}/><circle cx="110" cy="23" r="17" ${G}/></svg>`,
  // finding everything is easy; the product decision is what to throw away
  'job-search-agent': `<svg viewBox="0 0 200 46" aria-hidden="true"><rect x="4" y="6" width="192" height="9" rx="2" ${L}/><rect x="38" y="19" width="124" height="9" rx="2" ${L}/><rect x="86" y="32" width="28" height="9" rx="2" ${G}/></svg>`,
  // two hundred dashboards, one ranked list
  'action-hub': `<svg viewBox="0 0 200 46" aria-hidden="true"><rect x="4" y="8" width="60" height="30" rx="3" ${L}/><rect x="12" y="13" width="60" height="30" rx="3" ${L}/><path d="M84 23 L106 23" ${L}/><rect x="114" y="8" width="82" height="9" rx="2" fill="var(--gold)"/><rect x="114" y="21" width="82" height="9" rx="2" ${F}/><rect x="114" y="34" width="82" height="9" rx="2" ${F}/></svg>`,
  // five things it would never do are why the scope held
  'tripmatch': `<svg viewBox="0 0 200 46" aria-hidden="true"><rect x="4" y="14" width="34" height="18" rx="3" ${G}/>${[0,1,2,3,4].map((i)=>`<line x1="${52+i*30}" y1="14" x2="${74+i*30}" y2="32" stroke="currentColor" stroke-opacity=".34" stroke-width="1.5"/><line x1="${52+i*30}" y1="32" x2="${74+i*30}" y2="14" stroke="currentColor" stroke-opacity=".34" stroke-width="1.5"/>`).join('')}</svg>`,
};

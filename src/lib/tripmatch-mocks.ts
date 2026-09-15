// One mock screen per TripMatch highlight, in the same register as the Action
// Hub plate: redrawn, not captured, and showing the mechanism rather than
// decorating it.
//
// These only ever render on the navy panel, so the light-on-dark values are
// literal. --gold is the exception: it shifts in dark mode and should follow.
// One viewBox for all four, so swapping cards does not resize the frame.

const INK = '#f4f2ef';
const INK2 = '#a8b6c4';
const INK3 = '#6f8298';
const LINE = 'rgba(255,255,255,.14)';
const FILL = 'rgba(255,255,255,.05)';
const MONO = 'font-family="var(--mono)"';

const frame = (id: string, title: string, body: string) => `
<svg viewBox="0 0 440 170" role="img" aria-labelledby="${id}" preserveAspectRatio="xMidYMid meet">
<title id="${id}">${title}</title>
${body}
</svg>`.trim();

const arrow = (x: number, y: number) =>
  `<path d="M${x} ${y}h26" stroke="${INK3}" stroke-width="1.5"/><path d="M${x + 26} ${y} l-7 -4 v8 z" fill="${INK3}"/>`;

/* ── 01 · One board ─────────────────────────────────────────────── */
const rides: [string, string, string, boolean][] = [
  ['SFO airport', 'Fri 4:00pm', '3 of 4', false],
  ['Tahoe trek', 'Sat 8:00am', '1 of 3', true],
  ['Napa, Sunday', 'Sun 9:30am', 'Full', false],
  ['San Jose', 'Fri 6:15pm', '2 of 4', false],
];
const board = frame('hv-board',
  'A single board listing four rides, each with its route, time and the seats still open',
  `<rect x="1" y="1" width="438" height="168" rx="10" fill="${FILL}" stroke="${LINE}"/>
   <path d="M1 11a10 10 0 0 1 10-10h418a10 10 0 0 1 10 10v23H1z" fill="rgba(255,255,255,.05)"/>
   <circle cx="20" cy="18" r="4" fill="var(--gold)"/>
   <text x="33" y="22" font-size="12" ${MONO} letter-spacing="1.3" fill="${INK2}">RIDES BOARD · THIS WEEK</text>
   ${rides.map(([route, when, seats, hot], i) => {
     const y = 44 + i * 30;
     return `<rect x="14" y="${y}" width="412" height="26" rx="5" fill="rgba(255,255,255,.05)"/>
   ${hot ? `<rect x="14" y="${y}" width="3" height="26" rx="1.5" fill="var(--gold)"/>` : ''}
   <text x="28" y="${y + 17}" font-size="13" font-weight="600" fill="${INK}">${route}</text>
   <text x="170" y="${y + 17}" font-size="12" ${MONO} fill="${INK3}">${when}</text>
   <rect x="344" y="${y + 4}" width="70" height="18" rx="9" fill="rgba(255,255,255,.07)"/>
   <text x="379" y="${y + 17}" font-size="12" ${MONO} text-anchor="middle" fill="${seats === 'Full' ? INK3 : INK2}">${seats}</text>`;
   }).join('\n   ')}`);

/* ── 02 · +1 ────────────────────────────────────────────────────── */
const seat = (cx: number, cy: number, taken: boolean, fresh = false) =>
  `<circle cx="${cx}" cy="${cy}" r="7" fill="${fresh ? 'var(--gold)' : taken ? INK2 : 'none'}" stroke="${fresh ? 'var(--gold)' : INK3}" stroke-width="1.5"/>`;
const plusOne = frame('hv-plusone',
  'Tapping the plus-one button on a ride takes the seat count from two of four to three of four, in front of everyone',
  `<rect x="1" y="16" width="268" height="138" rx="10" fill="${FILL}" stroke="${LINE}"/>
   <text x="22" y="46" font-size="13" font-weight="600" fill="${INK}">Tahoe trek · Sat 8:00am</text>
   <text x="22" y="68" font-size="12" ${MONO} letter-spacing="1.2" fill="${INK3}">SEATS</text>
   ${seat(92, 64, true)}${seat(112, 64, true)}${seat(132, 64, false)}${seat(152, 64, false)}
   <circle cx="64" cy="106" r="37" fill="none" stroke="var(--gold)" stroke-opacity=".18" stroke-width="1.3"/>
   <circle cx="64" cy="106" r="28" fill="none" stroke="var(--gold)" stroke-opacity=".45" stroke-width="1.3"/>
   <rect x="21" y="87" width="86" height="38" rx="19" fill="rgba(13,27,42,.9)" stroke="var(--gold)" stroke-width="1.7"/>
   <text x="64" y="112" font-size="20" font-weight="700" text-anchor="middle" fill="var(--gold)">+1</text>
   <text x="125" y="101" font-size="12" ${MONO} fill="${INK2}">one tap,</text>
   <text x="125" y="117" font-size="12" ${MONO} fill="${INK2}">no thread</text>
   ${arrow(281, 85)}
   <rect x="325" y="16" width="114" height="138" rx="10" fill="${FILL}" stroke="${LINE}"/>
   <text x="382" y="62" font-size="26" font-weight="700" text-anchor="middle" fill="var(--gold)">3 of 4</text>
   <text x="382" y="84" font-size="12" ${MONO} letter-spacing="1.2" text-anchor="middle" fill="${INK3}">TAKEN</text>
   ${seat(346, 118, true)}${seat(366, 118, true)}${seat(386, 118, true, true)}${seat(406, 118, false)}`);

/* ── 03 · No app ────────────────────────────────────────────────── */
const noApp = frame('hv-noapp',
  'A link dropped in the class group chat opens the board directly, with nothing to download',
  `<rect x="1" y="14" width="236" height="142" rx="12" fill="${FILL}" stroke="${LINE}"/>
   <path d="M18 156 l0 12 l18 -12z" fill="${FILL}" stroke="${LINE}"/>
   <text x="20" y="40" font-size="12" ${MONO} letter-spacing="1.3" fill="${INK3}">HAAS 2027 · GROUP CHAT</text>
   <rect x="20" y="52" width="198" height="30" rx="8" fill="rgba(255,255,255,.06)"/>
   <text x="34" y="72" font-size="13" fill="${INK}">Anyone driving to SFO Friday?</text>
   <rect x="20" y="92" width="198" height="46" rx="8" fill="rgba(255,255,255,.06)" stroke="var(--gold)" stroke-opacity=".55"/>
   <text x="34" y="112" font-size="12" ${MONO} fill="var(--gold)">tripmatch · rides board</text>
   <text x="34" y="129" font-size="12" ${MONO} fill="${INK3}">tap to open</text>
   ${arrow(249, 85)}
   <rect x="293" y="14" width="146" height="142" rx="10" fill="${FILL}" stroke="${LINE}"/>
   <path d="M293 24a10 10 0 0 1 10-10h126a10 10 0 0 1 10 10v18H293z" fill="rgba(255,255,255,.05)"/>
   <circle cx="308" cy="28" r="4" fill="var(--gold)"/>
   <text x="320" y="32" font-size="12" ${MONO} fill="${INK2}">BOARD</text>
   ${[0, 1, 2, 3].map((i) => `<rect x="305" y="${52 + i * 26}" width="122" height="22" rx="5" fill="rgba(255,255,255,.06)"/>
   <rect x="315" y="${59 + i * 26}" width="${74 - i * 13}" height="7" rx="3.5" fill="${INK3}"/>`).join('\n   ')}`);

/* ── 04 · Verified ──────────────────────────────────────────────── */
const tick = (x: number, y: number) =>
  `<circle cx="${x}" cy="${y}" r="9" fill="var(--gold)"/><path d="M${x - 4} ${y} l3 3.4 l5.4 -6" fill="none" stroke="#0d1b2a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
const verified = frame('hv-verified',
  'Sign-in is a Berkeley email checked on the server, so every person on a ride is a verified classmate',
  `<rect x="1" y="14" width="250" height="142" rx="10" fill="${FILL}" stroke="${LINE}"/>
   <text x="22" y="44" font-size="12" ${MONO} letter-spacing="1.3" fill="${INK3}">SIGN IN</text>
   <rect x="22" y="56" width="208" height="38" rx="7" fill="rgba(255,255,255,.06)" stroke="var(--gold)" stroke-opacity=".5"/>
   <text x="36" y="80" font-size="13" fill="${INK}">eason_han@berkeley.edu</text>
   ${tick(238, 75)}
   <text x="22" y="122" font-size="12" ${MONO} fill="${INK2}">checked on the server,</text>
   <text x="22" y="140" font-size="12" ${MONO} fill="${INK2}">not taken on trust</text>
   ${arrow(263, 85)}
   <rect x="307" y="14" width="132" height="142" rx="10" fill="${FILL}" stroke="${LINE}"/>
   <text x="373" y="40" font-size="12" ${MONO} letter-spacing="1.2" text-anchor="middle" fill="${INK3}">IN THE CAR</text>
   ${[0, 1, 2].map((i) => {
     const y = 56 + i * 34;
     return `<rect x="319" y="${y}" width="108" height="26" rx="13" fill="rgba(255,255,255,.06)"/>
   <circle cx="334" cy="${y + 13}" r="8" fill="${INK3}"/>
   <rect x="349" y="${y + 9}" width="${44 - i * 8}" height="8" rx="4" fill="${INK2}"/>
   ${tick(414, y + 13)}`;
   }).join('\n   ')}`);

export const tripmatchMocks = { board, plusOne, noApp, verified };

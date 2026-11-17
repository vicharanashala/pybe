// The places in the Palace of Whispers, drawn as inline SVG.
//
// Every scene shares one 960 × 540 drawing area (16:9) and one palette, so the
// palace feels like a single connected world. Parts that change during the
// story (a lid that opens, a card that lights up, a camera that zooms out)
// are marked with classes, and CSS animates them when the story says so.
//
// Clickable story objects are wrapped in <g class="target" data-target="…">.

import { taraAndMithu, mithu, tara } from './characters.js';
import { escapeHtml } from '../util.js';

const P = {
  lavender: '#C8B8E8', lavenderDeep: '#A994D6', lavenderSoft: '#EDE6F8',
  ivory: '#FFF9F0', ivoryDeep: '#F3E8D6', line: '#E4D6C2',
  pink: '#F1D5DF', pinkDeep: '#E4B6C6',
  sage: '#C8D9C1', sageDeep: '#A9C2A0',
  plum: '#40304F', gold: '#E8C987', goldDeep: '#C9A24E', glow: '#FFF1C9',
  blue: '#D6E5F2', blueDeep: '#B7CFE6', wood: '#C99C70', woodDeep: '#A87D55'
};

/* ------------------------------------------------------------ helpers */

function svg(label, inner, defs = '', { cls = 'scene-svg', slice = false } = {}) {
  return `
<svg class="${cls}" viewBox="0 0 960 540" role="img" aria-label="${escapeHtml(label)}"
     xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid ${slice ? 'slice' : 'meet'}">
  <defs>
    <radialGradient id="glow"><stop offset="0" stop-color="${P.glow}" stop-opacity="0.95"/><stop offset="1" stop-color="${P.glow}" stop-opacity="0"/></radialGradient>
    ${defs}
  </defs>
  ${inner}
</svg>`;
}

/** A tiny four-pointed star that twinkles. */
export function sparkle(x, y, s = 6, delay = 0, fill = P.gold) {
  return `<path class="twinkle" style="animation-delay:${delay}s" fill="${fill}"
    d="M${x} ${y - s} Q${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y} Q${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s}
       Q${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y} Q${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s} Z"/>`;
}

/** A small floating point of light. */
function light(x, y, r, delay) {
  return `<g class="float-light" style="animation-delay:${delay}s"><circle cx="${x}" cy="${y}" r="${r * 3}" fill="url(#glow)"/><circle cx="${x}" cy="${y}" r="${r}" fill="${P.glow}"/></g>`;
}

/** An arch shape: straight sides, round top. */
function arch(x, y, w, h, fill, extra = '') {
  return `<path d="M${x} ${y + h} L${x} ${y + w / 2} Q${x} ${y} ${x + w / 2} ${y} Q${x + w} ${y} ${x + w} ${y + w / 2} L${x + w} ${y + h} Z" fill="${fill}" ${extra}/>`;
}

/** A card with a line of Python on it, e.g. gift = "Teddy Bear". */
function codeCard(x, y, text, { kind = 'gift', cls = '' } = {}) {
  const w = text.length * 10.4 + 34;
  const builtin = kind === 'builtin';
  return `
<g class="code-card ${cls}" transform="translate(${x} ${y})">
  <rect class="card-glow" x="${-w / 2 - 14}" y="-34" width="${w + 28}" height="68" rx="26" fill="url(#glow)"/>
  <rect x="${-w / 2}" y="-20" width="${w}" height="40" rx="12" fill="${builtin ? '#F2F7FB' : P.ivory}" stroke="${builtin ? P.sageDeep : P.gold}" stroke-width="2.5"/>
  <text x="0" y="6" text-anchor="middle" class="svg-code">${escapeHtml(text)}</text>
</g>`;
}

function cloud(x, y, s, cls = '') {
  return `<g class="cloud ${cls}" transform="translate(${x} ${y}) scale(${s})" fill="#FFFFFF" opacity="0.9">
    <ellipse cx="0" cy="0" rx="42" ry="18"/><ellipse cx="30" cy="-10" rx="30" ry="20"/><ellipse cx="-28" cy="-6" rx="24" ry="14"/><ellipse cx="58" cy="2" rx="22" ry="12"/>
  </g>`;
}

function flower(x, y, h, colour, delay) {
  return `<g class="sway" style="animation-delay:${delay}s; transform-origin:${x}px ${y}px">
    <path d="M${x} ${y} Q${x - 4} ${y - h / 2} ${x} ${y - h}" stroke="${P.sageDeep}" stroke-width="2.5" fill="none"/>
    ${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="${x}" cy="${y - h - 6}" rx="3.6" ry="6.5" fill="${colour}" transform="rotate(${a} ${x} ${y - h})"/>`).join('')}
    <circle cx="${x}" cy="${y - h}" r="3" fill="${P.gold}"/>
  </g>`;
}

/** Marks a story object the learner can click. */
function target(id, cx, cy, r, inner) {
  return `<g class="target" data-target="${id}">
    <circle class="target-ring" cx="${cx}" cy="${cy}" r="${r}" fill="none"/>
    ${inner}
  </g>`;
}

/* ---------------------------------------------------- opening: the palace */

function palace(cx, base) {
  const win = (x, y, w = 12, h = 22) => arch(x, y, w, h, '#F6DC97', 'class="palace-window"');
  return `
<g class="palace">
  <!-- side towers -->
  <rect x="${cx - 128}" y="${base - 160}" width="44" height="160" fill="${P.ivory}" stroke="${P.line}" stroke-width="2"/>
  <rect x="${cx + 84}" y="${base - 160}" width="44" height="160" fill="${P.ivory}" stroke="${P.line}" stroke-width="2"/>
  <path d="M${cx - 136} ${base - 158} L${cx - 106} ${base - 222} L${cx - 76} ${base - 158} Z" fill="${P.lavender}"/>
  <path d="M${cx - 106} ${base - 222} L${cx - 76} ${base - 158} L${cx - 106} ${base - 158} Z" fill="${P.lavenderDeep}"/>
  <path d="M${cx + 76} ${base - 158} L${cx + 106} ${base - 222} L${cx + 136} ${base - 158} Z" fill="${P.lavender}"/>
  <path d="M${cx + 106} ${base - 222} L${cx + 136} ${base - 158} L${cx + 106} ${base - 158} Z" fill="${P.lavenderDeep}"/>
  <path class="flag" d="M${cx - 106} ${base - 222} l0 -18 l16 5 l-16 5" fill="${P.pinkDeep}" stroke="${P.goldDeep}" stroke-width="1.5"/>
  <path class="flag" d="M${cx + 106} ${base - 222} l0 -18 l16 5 l-16 5" fill="${P.pinkDeep}" stroke="${P.goldDeep}" stroke-width="1.5"/>
  ${win(cx - 112, base - 130)}${win(cx - 112, base - 80)}${win(cx + 100, base - 130)}${win(cx + 100, base - 80)}

  <!-- main hall -->
  <rect x="${cx - 84}" y="${base - 112}" width="168" height="112" fill="${P.ivory}" stroke="${P.line}" stroke-width="2"/>
  <rect x="${cx - 90}" y="${base - 118}" width="180" height="8" rx="3" fill="${P.gold}"/>
  ${win(cx - 66, base - 92, 14, 26)}${win(cx - 36, base - 92, 14, 26)}${win(cx + 22, base - 92, 14, 26)}${win(cx + 52, base - 92, 14, 26)}

  <!-- central tower -->
  <rect x="${cx - 30}" y="${base - 214}" width="60" height="102" fill="${P.ivory}" stroke="${P.line}" stroke-width="2"/>
  <path d="M${cx - 40} ${base - 212} L${cx} ${base - 292} L${cx + 40} ${base - 212} Z" fill="${P.lavender}"/>
  <path d="M${cx} ${base - 292} L${cx + 40} ${base - 212} L${cx} ${base - 212} Z" fill="${P.lavenderDeep}"/>
  <line x1="${cx}" y1="${base - 292}" x2="${cx}" y2="${base - 312}" stroke="${P.goldDeep}" stroke-width="2.5"/>
  <circle cx="${cx}" cy="${base - 314}" r="4" fill="${P.gold}"/>
  ${win(cx - 9, base - 196, 18, 34)}${win(cx - 9, base - 150, 18, 28)}
  <circle cx="${cx}" cy="${base - 236}" r="9" fill="#F6DC97" stroke="${P.gold}" stroke-width="2" class="palace-window"/>

  <!-- the entrance -->
  <circle class="gate-glow" cx="${cx}" cy="${base - 26}" r="44" fill="url(#glow)"/>
  ${arch(cx - 20, base - 52, 40, 52, P.plum)}
  ${arch(cx - 14, base - 46, 28, 46, '#F6DC97')}
</g>`;
}

export function openingArt() {
  const defs = `
    <linearGradient id="sky-open" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${P.blue}"/><stop offset="0.55" stop-color="#E9E1F5"/><stop offset="1" stop-color="${P.ivory}"/>
    </linearGradient>`;
  const dust = Array.from({ length: 16 }, (_, i) =>
    `<circle class="dust" style="animation-delay:${(i * 0.7) % 8}s; animation-duration:${8 + (i % 5)}s" cx="${60 + ((i * 131) % 860)}" cy="${330 + ((i * 47) % 180)}" r="${1.6 + (i % 3) * 0.7}" fill="${P.gold}"/>`).join('');
  return svg('A fairytale palace with lavender rooftops and glowing golden windows stands in the distance, at the end of a winding path. Tara stands in the foreground looking towards it, with Mithu on her shoulder.', `
  <g class="layer" data-depth="0">
    <rect width="960" height="540" fill="url(#sky-open)"/>
    <circle cx="610" cy="270" r="220" fill="url(#glow)" opacity="0.8"/>
    ${sparkle(120, 70, 5, 0)}${sparkle(260, 40, 4, 1.2)}${sparkle(700, 60, 5, 0.6)}${sparkle(860, 110, 4, 1.8)}${sparkle(560, 30, 3.5, 2.4)}${sparkle(380, 90, 3, 0.9)}
  </g>
  <g class="layer" data-depth="0.12">
    <path d="M0 360 Q160 300 320 340 T640 330 T960 320 L960 540 L0 540 Z" fill="#DCE7D6"/>
  </g>
  <g class="layer clouds" data-depth="0.2">
    ${cloud(150, 150, 1, 'drift-a')}${cloud(760, 120, 0.85, 'drift-b')}${cloud(520, 70, 0.6, 'drift-c')}
  </g>
  <g class="layer" data-depth="0.3">
    <!-- the palace, small and far away, so it feels distant -->
    <g transform="translate(610 396) scale(0.78) translate(-480 -382)">${palace(480, 382)}</g>
  </g>
  <g class="layer" data-depth="0.5">
    <path d="M0 410 Q240 360 480 392 T960 380 L960 540 L0 540 Z" fill="${P.sage}"/>
    <path class="path-to-palace" d="M602 396 L618 396 Q640 430 600 458 Q540 500 600 540 L420 540 Q470 492 560 452 Q610 428 602 396 Z" fill="#F6EAD2"/>
    <path d="M602 396 Q610 428 560 452 Q470 492 420 540 M618 396 Q640 430 600 458 Q540 500 600 540" fill="none" stroke="${P.gold}" stroke-width="2" stroke-dasharray="3 9"/>
  </g>
  <g class="layer" data-depth="0.85">
    <path d="M0 470 Q160 440 300 470 L300 540 L0 540 Z" fill="${P.sageDeep}"/>
    <path d="M700 480 Q840 440 960 462 L960 540 L700 540 Z" fill="${P.sageDeep}"/>
    ${flower(60, 500, 34, P.pink, 0)}${flower(110, 515, 26, P.lavender, 0.6)}${flower(170, 505, 30, '#FFFFFF', 1.1)}
    ${flower(760, 505, 30, P.pink, 0.4)}${flower(830, 495, 38, P.lavender, 1.3)}${flower(900, 512, 26, '#FFFFFF', 0.8)}
    ${taraAndMithu({ x: 330, y: 528, scale: 0.86, mood: 'happy' })}
  </g>
  ${dust}
  `, defs, { slice: true, cls: 'scene-svg opening-svg' });
}

/* --------------------------------------------- scene 1: the palace hallway */

export function hallwayArt() {
  const defs = `
    <pattern id="marble" width="80" height="40" patternUnits="userSpaceOnUse">
      <rect width="80" height="40" fill="#F8F1E6"/><path d="M0 40 L40 0 L80 40" fill="none" stroke="#EDE2D0" stroke-width="1.5"/>
      <path d="M10 30 Q30 22 46 30" stroke="#EADFD2" stroke-width="1" fill="none"/>
    </pattern>`;
  const archway = (x) => `
    ${arch(x, 70, 190, 290, P.lavender)}
    ${arch(x + 14, 84, 162, 276, P.lavenderSoft)}
    <g transform="translate(${x + 95} 200)">
      <rect x="-40" y="-50" width="80" height="96" rx="6" fill="${P.ivory}" stroke="${P.gold}" stroke-width="5"/>
      <rect x="-31" y="-41" width="62" height="78" fill="${P.blue}"/>
      <circle cx="12" cy="-20" r="9" fill="#FFF6DC"/>
      <path d="M-31 37 L-12 4 L2 22 L14 8 L31 37 Z" fill="${P.sage}"/>
    </g>`;
  return svg('A palace hallway with lavender arches, framed pictures and an ivory marble floor. A golden card floats in the air. On the right, a glowing doorway with golden handles.', `
  <rect width="960" height="370" fill="#FBF4EA"/>
  ${archway(70)}${archway(330)}
  <rect y="360" width="960" height="180" fill="url(#marble)"/>
  <rect y="352" width="960" height="12" fill="${P.ivoryDeep}"/>
  ${light(120, 60, 3, 0)}${light(300, 46, 2.5, 1.4)}${light(560, 70, 3, 0.7)}${light(700, 40, 2.5, 2)}${light(460, 300, 2, 1.1)}

  <!-- the floating golden card -->
  <g class="floating-card">
    <circle cx="480" cy="128" r="120" fill="url(#glow)" opacity="0.7"/>
    <rect x="320" y="96" width="320" height="66" rx="14" fill="${P.ivory}" stroke="${P.gold}" stroke-width="3"/>
    <rect x="328" y="104" width="304" height="50" rx="10" fill="none" stroke="${P.gold}" stroke-width="1" stroke-dasharray="2 5"/>
    <text x="480" y="136" text-anchor="middle" class="svg-serif">What does this name mean?</text>
    ${sparkle(314, 96, 6, 0.3)}${sparkle(648, 160, 5, 1)}
  </g>

  <!-- the golden trail, appearing once the mystery begins -->
  <path class="golden-trail" d="M370 512 Q520 520 640 470 Q760 430 836 372" fill="none" stroke="${P.gold}" stroke-width="7" stroke-linecap="round" stroke-dasharray="2 18"/>

  <!-- the doorway to Tara's room -->
  ${target('door-room', 836, 270, 92, `
    <circle class="door-glow" cx="836" cy="270" r="110" fill="url(#glow)"/>
    ${arch(770, 160, 132, 210, P.gold)}
    ${arch(780, 170, 112, 200, P.lavenderDeep)}
    <line x1="836" y1="172" x2="836" y2="370" stroke="${P.lavender}" stroke-width="3"/>
    <circle cx="824" cy="282" r="6" fill="${P.gold}" stroke="${P.goldDeep}"/><circle cx="848" cy="282" r="6" fill="${P.gold}" stroke="${P.goldDeep}"/>
    <path d="M806 214 Q836 196 866 214" stroke="${P.gold}" stroke-width="2" fill="none"/>`)}

  ${taraAndMithu({ x: 330, y: 518, scale: 0.9, mood: 'curious' })}
  `, defs);
}

/* ------------------------------------------------- scene 2: Tara's room */

export function roomArt() {
  const defs = `
    <pattern id="room-stripes" width="44" height="44" patternUnits="userSpaceOnUse">
      <rect width="44" height="44" fill="${P.pink}"/><rect width="14" height="44" fill="#F5DEE6"/>
    </pattern>
    <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF6DC" stop-opacity="0.75"/><stop offset="1" stop-color="#FFF6DC" stop-opacity="0"/></linearGradient>`;
  const books = [[596, '#AE9BD8', 16], [614, P.sageDeep, 12], [628, P.pinkDeep, 18], [648, P.gold, 12]];
  return svg('Tara\'s cosy bedroom: a window overlooking a garden, soft curtains, a lavender rug, and a wooden desk with books, a plant and a wrapped gift box.', `
  <rect width="960" height="330" fill="url(#room-stripes)"/>
  <rect y="330" width="960" height="30" fill="${P.ivory}"/>
  <rect y="356" width="960" height="184" fill="#E9D3B4"/>
  <g stroke="#DEC39E" stroke-width="2">${[400, 450, 500].map((y) => `<line x1="0" y1="${y}" x2="960" y2="${y}"/>`).join('')}</g>

  <!-- window with the garden outside -->
  ${arch(70, 60, 190, 240, P.ivory)}
  ${arch(84, 74, 162, 220, P.blue)}
  <circle cx="200" cy="130" r="22" fill="#FFF6DC"/>
  <path d="M84 250 Q130 216 180 236 T246 226 L246 294 L84 294 Z" fill="${P.sage}"/>
  ${[110, 140, 172, 210, 232].map((x, i) => `<circle cx="${x}" cy="${262 + (i % 2) * 10}" r="5" fill="${i % 2 ? P.pinkDeep : '#FFFFFF'}"/>`).join('')}
  <line x1="165" y1="74" x2="165" y2="294" stroke="${P.ivory}" stroke-width="6"/>
  <path d="M60 52 Q90 170 64 312 L46 312 L46 52 Z" fill="${P.lavender}"/>
  <path d="M270 52 Q240 170 266 312 L284 312 L284 52 Z" fill="${P.lavender}"/>
  <rect x="40" y="44" width="250" height="12" rx="6" fill="${P.goldDeep}"/>
  <polygon class="sunbeam" points="110,90 250,90 470,520 210,520" fill="url(#beam)" opacity="0.6"/>

  <!-- shelf, rug -->
  <rect x="330" y="140" width="150" height="10" rx="4" fill="${P.wood}"/>
  ${[340, 356, 372].map((x, i) => `<rect x="${x}" y="${104 + i * 4}" width="13" height="${36 - i * 4}" rx="2" fill="${[P.lavenderDeep, P.sageDeep, P.pinkDeep][i]}"/>`).join('')}
  <path d="M430 140 Q436 112 452 116 Q456 130 450 140 Z" fill="${P.sage}"/>
  <ellipse cx="400" cy="474" rx="250" ry="48" fill="${P.lavender}"/>
  <ellipse cx="400" cy="474" rx="226" ry="38" fill="none" stroke="${P.ivory}" stroke-width="3" stroke-dasharray="8 10"/>

  <!-- the little door to the study (opens in the next scene) -->
  <rect x="884" y="232" width="62" height="124" rx="8" fill="${P.ivory}" stroke="${P.gold}" stroke-width="3"/>
  <circle cx="896" cy="296" r="4" fill="${P.gold}"/>

  <!-- the desk -->
  <rect x="560" y="330" width="290" height="16" rx="5" fill="${P.wood}"/>
  <rect x="574" y="346" width="14" height="120" fill="${P.woodDeep}"/><rect x="822" y="346" width="14" height="120" fill="${P.woodDeep}"/>
  <rect x="600" y="346" width="120" height="36" rx="4" fill="${P.woodDeep}"/><circle cx="660" cy="364" r="4" fill="${P.gold}"/>
  ${books.map(([x, c, w], i) => `<rect x="${x}" y="${330 - 34 - i * 2}" width="${w}" height="${34 + i * 2}" rx="2" fill="${c}"/>`).join('')}
  <rect x="790" y="300" width="34" height="30" rx="6" fill="${P.pinkDeep}"/>
  <path d="M807 300 Q790 270 778 262 Q800 268 807 290 Q812 262 834 254 Q820 276 807 300 Z" fill="${P.sageDeep}"/>

  <!-- the gift box, and its label -->
  ${codeCard(720, 160, 'gift = "Teddy Bear"', { cls: 'room-card' })}
  <path d="M720 180 L720 236" stroke="${P.goldDeep}" stroke-width="1.5" stroke-dasharray="3 3"/>
  <!-- the gift box is drawn a little larger, so the teddy bear reads clearly -->
  <g transform="translate(720 330) scale(1.45) translate(-720 -330)">
  ${target('gift-box', 720, 300, 64, `
    <g class="teddy">
      <circle cx="704" cy="262" r="9" fill="#B07D52"/><circle cx="736" cy="262" r="9" fill="#B07D52"/>
      <circle cx="720" cy="280" r="22" fill="#C99466"/>
      <ellipse cx="720" cy="288" rx="9" ry="7" fill="#E8C8A2"/>
      <circle cx="712" cy="276" r="2.6" fill="${P.plum}"/><circle cx="728" cy="276" r="2.6" fill="${P.plum}"/>
      <ellipse cx="720" cy="285" rx="3" ry="2" fill="${P.plum}"/>
    </g>
    <rect x="686" y="290" width="68" height="40" rx="6" fill="${P.pink}" stroke="${P.pinkDeep}" stroke-width="2"/>
    <rect x="714" y="290" width="12" height="40" fill="${P.gold}"/>
    <g class="gift-lid">
      <rect x="680" y="278" width="80" height="16" rx="5" fill="${P.pinkDeep}"/>
      <rect x="714" y="278" width="12" height="16" fill="${P.gold}"/>
      <path d="M720 278 Q700 258 704 274 Q708 280 720 278 Q732 258 736 274 Q732 280 720 278 Z" fill="${P.gold}" stroke="${P.goldDeep}"/>
    </g>
    ${sparkle(676, 268, 6, 0.4)}${sparkle(768, 280, 5, 1.1)}`)}
  </g>

  ${taraAndMithu({ x: 430, y: 512, scale: 0.92, mood: 'happy' })}
  `, defs);
}

/* --------------------------------------------- scene 3: the nested study */

export function studyArt() {
  const shelfBooks = (x, y) => [0, 1, 2, 3, 4, 5, 6].map((i) =>
    `<rect x="${x + i * 19}" y="${y - 30 - (i % 3) * 4}" width="15" height="${30 + (i % 3) * 4}" rx="2" fill="${[P.lavenderDeep, P.sageDeep, P.pinkDeep, P.gold, P.blueDeep][i % 5]}"/>`).join('');
  return svg('A cosy study with bookshelves, a tea table and warm lamps. A card on the wall says gift equals "Book". Inside the study is a smaller reading nook with a reading chair and an empty spot on its shelf.', `
  <g class="camera">
    <rect width="960" height="540" fill="#F5EBDD"/>
    <rect width="960" height="350" fill="${P.sage}"/>
    <rect y="350" width="960" height="190" fill="#E2C9A4"/>
    <g stroke="#D4B88F" stroke-width="2"><line x1="0" y1="410" x2="960" y2="410"/><line x1="0" y1="470" x2="960" y2="470"/></g>

    <!-- the study: the larger, outer room -->
    <rect class="room-outline outline-study" x="22" y="22" width="916" height="496" rx="26" fill="none" stroke="${P.gold}" stroke-width="3"/>
    <g transform="translate(110 22)"><rect x="-64" y="-14" width="128" height="28" rx="14" fill="${P.ivory}" stroke="${P.gold}" stroke-width="2"/><text x="0" y="5" text-anchor="middle" class="svg-label">the study</text></g>

    <!-- bookshelf -->
    <rect x="58" y="90" width="170" height="260" rx="6" fill="${P.woodDeep}"/>
    ${[160, 230, 300].map((y) => `<rect x="58" y="${y}" width="170" height="8" fill="${P.wood}"/>`).join('')}
    ${shelfBooks(70, 158)}${shelfBooks(70, 228)}${shelfBooks(70, 298)}

    <!-- the study's card, with a little book -->
    ${codeCard(400, 150, 'gift = "Book"', { cls: 'study-card' })}
    <g transform="translate(400 210)">
      <path d="M-30 0 Q-15 -10 0 0 Q15 -10 30 0 L30 24 Q15 14 0 24 Q-15 14 -30 24 Z" fill="${P.ivory}" stroke="${P.lavenderDeep}" stroke-width="2"/>
      <line x1="0" y1="0" x2="0" y2="24" stroke="${P.lavenderDeep}" stroke-width="2"/>
    </g>

    <!-- floor lamp and tea table -->
    <circle class="lamp-glow" cx="296" cy="230" r="70" fill="url(#glow)"/>
    <path d="M276 212 L316 212 L306 186 L286 186 Z" fill="${P.pink}"/>
    <line x1="296" y1="212" x2="296" y2="440" stroke="${P.goldDeep}" stroke-width="4"/>
    <ellipse cx="296" cy="442" rx="20" ry="5" fill="${P.goldDeep}"/>
    <ellipse cx="420" cy="420" rx="70" ry="14" fill="${P.wood}"/>
    <rect x="414" y="420" width="12" height="56" fill="${P.woodDeep}"/>
    <path d="M396 404 Q396 384 414 384 Q432 384 432 404 Z" fill="${P.lavender}"/><path d="M432 392 Q444 392 444 400" stroke="${P.lavender}" stroke-width="4" fill="none"/>
    <rect x="446" y="398" width="14" height="10" rx="3" fill="${P.ivory}" stroke="${P.pinkDeep}"/>

    <!-- the reading nook: a smaller room inside the study -->
    <rect x="560" y="112" width="350" height="380" rx="20" fill="${P.lavenderSoft}"/>
    ${arch(600, 140, 270, 352, '#F6F1FB')}
    <rect class="room-outline outline-nook" x="560" y="112" width="350" height="380" rx="20" fill="none" stroke="${P.gold}" stroke-width="2.5" stroke-dasharray="8 7"/>
    <g transform="translate(735 112)"><rect x="-88" y="-14" width="176" height="28" rx="14" fill="${P.ivory}" stroke="${P.gold}" stroke-width="2"/><text x="0" y="5" text-anchor="middle" class="svg-label">the little reading nook</text></g>
    <rect x="768" y="236" width="118" height="9" rx="4" fill="${P.wood}"/>
    <rect x="776" y="204" width="13" height="32" rx="2" fill="${P.sageDeep}"/><rect x="792" y="210" width="11" height="26" rx="2" fill="${P.pinkDeep}"/>
    ${target('empty-spot', 846, 214, 40, `
      <rect class="empty-spot" x="818" y="190" width="56" height="44" rx="8" fill="${P.ivory}" stroke="${P.lavenderDeep}" stroke-width="2.5" stroke-dasharray="5 5"/>
      <text x="846" y="221" text-anchor="middle" class="svg-question">?</text>`)}
    <!-- reading chair -->
    <path d="M780 470 L780 380 Q780 340 820 340 L860 340 Q900 340 900 380 L900 470 Z" fill="${P.pinkDeep}"/>
    <rect x="770" y="410" width="140" height="48" rx="16" fill="${P.pink}"/>

    <!-- the connection, shown once the camera pulls back -->
    <path class="connection" d="M846 190 Q700 60 470 140" fill="none" stroke="${P.gold}" stroke-width="4" stroke-linecap="round" stroke-dasharray="3 12"/>

    ${taraAndMithu({ x: 680, y: 496, scale: 0.78, mood: 'curious', pose: 'point' })}
  </g>
  `);
}

/* -------------------------------------------------- scene 4: the grand hall */

export function hallArt() {
  const window = (x) => `${arch(x, 60, 96, 220, P.ivory)}${arch(x + 8, 68, 80, 206, P.blue)}
    <line x1="${x + 48}" y1="70" x2="${x + 48}" y2="274" stroke="${P.ivory}" stroke-width="4"/>
    <line x1="${x + 8}" y1="170" x2="${x + 88}" y2="170" stroke="${P.ivory}" stroke-width="4"/>`;
  const pillar = (x) => `<rect x="${x}" y="70" width="34" height="300" fill="${P.ivory}" stroke="${P.line}" stroke-width="2"/>
    <rect x="${x - 6}" y="62" width="46" height="12" rx="3" fill="${P.gold}"/><rect x="${x - 6}" y="364" width="46" height="12" rx="3" fill="${P.ivoryDeep}"/>`;
  const lantern = (x, d) => `<g class="lantern" style="animation-delay:${d}s; transform-origin:${x}px 0px">
    <line x1="${x}" y1="0" x2="${x}" y2="96" stroke="${P.goldDeep}" stroke-width="2"/>
    <circle cx="${x}" cy="118" r="34" fill="url(#glow)"/>
    <path d="M${x - 12} 98 L${x + 12} 98 L${x + 16} 132 L${x - 16} 132 Z" fill="${P.gold}" stroke="${P.goldDeep}"/>
    <rect x="${x - 8}" y="104" width="16" height="22" rx="3" fill="#FFF3CC"/></g>`;
  return svg('A magnificent grand hall with tall windows, elegant pillars, hanging lanterns, a chandelier and a sweeping staircase. On the left wall hangs a large golden noticeboard with a card that says gift equals "Bicycle".', `
  <rect width="960" height="380" fill="#EEE6F6"/>
  ${window(452)}${window(572)}
  ${pillar(92)}${pillar(412)}${pillar(700)}
  <rect y="370" width="960" height="170" fill="#F8F1E6"/>
  <path d="M380 370 L560 370 L640 540 L300 540 Z" fill="${P.pink}"/>
  <path d="M392 370 L548 370 L622 540 L318 540 Z" fill="none" stroke="${P.gold}" stroke-width="2"/>

  <!-- chandelier and lanterns -->
  <line x1="560" y1="0" x2="560" y2="40" stroke="${P.goldDeep}" stroke-width="2.5"/>
  <circle cx="560" cy="58" r="60" fill="url(#glow)"/>
  <path d="M520 48 Q560 76 600 48" stroke="${P.gold}" stroke-width="5" fill="none"/>
  ${[520, 540, 560, 580, 600].map((x, i) => `<circle class="twinkle" style="animation-delay:${i * 0.3}s" cx="${x}" cy="${i === 2 ? 44 : 50}" r="4.5" fill="#FFF3CC"/>`).join('')}
  ${lantern(300, 0)}${lantern(820, 1.2)}

  <!-- sweeping staircase -->
  <path d="M760 540 Q800 420 960 360 L960 540 Z" fill="${P.ivoryDeep}"/>
  ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${770 + i * 28} ${540 - i * 30} Q${830 + i * 20} ${470 - i * 24} 960 ${430 - i * 16}" stroke="${P.line}" stroke-width="3" fill="none"/>`).join('')}
  <path d="M740 470 Q820 360 960 300" stroke="${P.gold}" stroke-width="5" fill="none"/>

  <!-- the noticeboard: the whole palace can see it -->
  ${target('noticeboard', 270, 240, 120, `
    <circle class="board-glow" cx="270" cy="240" r="170" fill="url(#glow)"/>
    <rect x="142" y="150" width="256" height="180" rx="12" fill="${P.gold}" stroke="${P.goldDeep}" stroke-width="3"/>
    <rect x="156" y="164" width="228" height="152" rx="8" fill="#F7EBD3"/>
    <text x="270" y="190" text-anchor="middle" class="svg-label">Palace Noticeboard</text>
    ${codeCard(270, 238, 'gift = "Bicycle"', { cls: 'board-card' })}
    <g transform="translate(270 290)" stroke="${P.plum}" stroke-width="2.5" fill="none">
      <circle cx="-22" cy="0" r="12"/><circle cx="22" cy="0" r="12"/><path d="M-22 0 L-6 -16 L12 -16 L22 0 M-6 -16 L0 0 L12 -16"/>
    </g>`)}

  <g class="walker" data-walker="tara">${taraAndMithu({ x: 760, y: 520, scale: 0.86, mood: 'surprised' })}</g>
  ${mithu({ x: 610, y: 250, scale: 0.55, flip: true }).replace('class="mithu"', 'class="mithu mithu-flying"')}
  `);
}

/* ---------------------------------------------- scene 5: the workshop */

export function workshopArt() {
  const bottle = (x, y, c, d) => `<g><circle class="twinkle" style="animation-delay:${d}s" cx="${x}" cy="${y - 10}" r="13" fill="url(#glow)"/>
    <rect x="${x - 8}" y="${y - 22}" width="16" height="22" rx="5" fill="${c}" opacity="0.85"/><rect x="${x - 4}" y="${y - 28}" width="8" height="7" fill="${P.woodDeep}"/></g>`;
  const label = (x, y, text, i) => `<g class="tool-label" style="--i:${i}">${codeCard(x, y, text, { kind: 'builtin' })}</g>`;
  return svg('A tiny golden door near the grand hall opens into a magical workshop with a wooden toolbox, scrolls, little bottles of stardust, floating tools and a floating book of Python\'s built-in names.', `
  <!-- outside: the hall corner with a tiny golden door -->
  <g class="view-outside">
    <rect width="960" height="540" fill="#EEE6F6"/>
    <rect y="390" width="960" height="150" fill="#F8F1E6"/>
    <rect x="200" y="70" width="40" height="320" fill="${P.ivory}" stroke="${P.line}" stroke-width="2"/>
    ${target('tiny-door', 600, 404, 52, `
      <circle class="door-glow" cx="600" cy="400" r="80" fill="url(#glow)"/>
      ${arch(568, 340, 64, 56, P.gold)}${arch(574, 346, 52, 50, P.goldDeep)}
      <circle cx="616" cy="374" r="3.5" fill="#FFF3CC"/>
      ${sparkle(554, 336, 5, 0.2)}${sparkle(650, 350, 4, 0.9)}`)}
    ${taraAndMithu({ x: 380, y: 520, scale: 0.86, mood: 'curious', pose: 'point' })}
  </g>

  <!-- inside: the workshop -->
  <g class="view-inside">
    <rect width="960" height="540" fill="#EAD7BB"/>
    <g stroke="#DCC3A0" stroke-width="3">${[100, 200, 300, 400, 500, 600, 700, 800, 900].map((x) => `<line x1="${x}" y1="0" x2="${x}" y2="380"/>`).join('')}</g>
    <rect y="380" width="960" height="160" fill="#D9BC94"/>
    <rect x="60" y="110" width="250" height="10" rx="4" fill="${P.woodDeep}"/>
    <rect x="60" y="210" width="250" height="10" rx="4" fill="${P.woodDeep}"/>
    ${bottle(90, 110, P.lavender, 0)}${bottle(130, 110, P.pink, 0.6)}${bottle(170, 110, P.blue, 1.2)}${bottle(210, 110, P.sage, 1.8)}
    <g fill="${P.ivory}" stroke="${P.goldDeep}" stroke-width="2">
      <rect x="236" y="180" width="60" height="22" rx="10"/><rect x="90" y="186" width="70" height="18" rx="9"/><rect x="170" y="182" width="56" height="22" rx="10"/>
    </g>
    <!-- floating tools -->
    <g class="float-a"><path d="M690 90 L740 60" stroke="${P.goldDeep}" stroke-width="4" stroke-linecap="round"/><path d="M740 60 Q756 44 748 70 Z" fill="${P.ivory}" stroke="${P.goldDeep}"/></g>
    <g class="float-b"><circle cx="400" cy="90" r="18" fill="none" stroke="${P.goldDeep}" stroke-width="3"/><path d="M400 74 L400 106 M384 90 L416 90" stroke="${P.goldDeep}" stroke-width="2"/></g>
    <!-- the floating little book of built-in names -->
    <g class="float-c">
      <circle cx="830" cy="130" r="70" fill="url(#glow)"/>
      <path d="M770 120 Q800 104 830 120 Q860 104 890 120 L890 170 Q860 154 830 170 Q800 154 770 170 Z" fill="${P.ivory}" stroke="${P.lavenderDeep}" stroke-width="2.5"/>
      <line x1="830" y1="120" x2="830" y2="170" stroke="${P.lavenderDeep}" stroke-width="2"/>
      <text x="830" y="98" text-anchor="middle" class="svg-label">Python's built-in names</text>
      ${sparkle(764, 112, 5, 0.3)}${sparkle(898, 176, 4, 1.4)}
    </g>
    <!-- workbench and toolbox -->
    <rect x="380" y="380" width="420" height="18" rx="5" fill="${P.woodDeep}"/>
    <rect x="396" y="396" width="16" height="110" fill="#8E6644"/><rect x="768" y="396" width="16" height="110" fill="#8E6644"/>
    ${label(470, 230, 'print()', 0)}${label(590, 200, 'len()', 1)}${label(710, 230, 'range()', 2)}
    ${target('toolbox', 590, 340, 76, `
      <circle class="box-glow" cx="590" cy="330" r="110" fill="url(#glow)"/>
      <rect x="520" y="320" width="140" height="60" rx="8" fill="${P.wood}" stroke="${P.woodDeep}" stroke-width="3"/>
      <rect x="520" y="340" width="140" height="6" fill="${P.gold}"/>
      <g class="toolbox-lid"><rect x="514" y="304" width="152" height="20" rx="6" fill="${P.woodDeep}"/><path d="M570 304 Q590 284 610 304" stroke="${P.gold}" stroke-width="5" fill="none"/></g>
      <circle cx="590" cy="346" r="6" fill="${P.gold}" stroke="${P.goldDeep}"/>`)}
    ${tara({ x: 250, y: 520, scale: 0.86, mood: 'surprised' }).replace('class="tara"', 'class="tara actor"')}
    ${mithu({ x: 430, y: 380, scale: 0.55 })}
  </g>
  `);
}

/* ------------------------------------------- small pictures for the cards */

export const miniIcons = {
  room: `<svg viewBox="0 0 120 80" aria-hidden="true"><rect width="120" height="80" rx="12" fill="${P.pink}"/>
    <rect y="54" width="120" height="26" fill="#E9D3B4"/>
    <rect x="16" y="14" width="30" height="34" rx="4" fill="${P.blue}" stroke="${P.ivory}" stroke-width="3"/>
    <rect x="62" y="40" width="40" height="18" rx="4" fill="${P.pink}" stroke="${P.pinkDeep}" stroke-width="2"/><rect x="79" y="40" width="6" height="18" fill="${P.gold}"/></svg>`,
  study: `<svg viewBox="0 0 120 80" aria-hidden="true"><rect width="120" height="80" rx="12" fill="${P.sage}"/>
    <rect x="6" y="6" width="108" height="68" rx="10" fill="none" stroke="${P.gold}" stroke-width="2"/>
    <rect x="64" y="18" width="44" height="50" rx="8" fill="${P.lavenderSoft}" stroke="${P.gold}" stroke-dasharray="4 3"/>
    <path d="M18 30 Q28 24 38 30 Q48 24 58 30 L58 50 Q48 44 38 50 Q28 44 18 50 Z" fill="${P.ivory}" stroke="${P.lavenderDeep}"/></svg>`,
  hall: `<svg viewBox="0 0 120 80" aria-hidden="true"><rect width="120" height="80" rx="12" fill="#EEE6F6"/>
    <rect x="22" y="14" width="76" height="52" rx="6" fill="${P.gold}"/><rect x="28" y="20" width="64" height="40" rx="4" fill="#F7EBD3"/>
    <g stroke="${P.plum}" stroke-width="2" fill="none"><circle cx="48" cy="44" r="7"/><circle cx="72" cy="44" r="7"/><path d="M48 44 L56 34 L66 34 L72 44"/></g></svg>`,
  toolbox: `<svg viewBox="0 0 120 80" aria-hidden="true"><rect width="120" height="80" rx="12" fill="#EAD7BB"/>
    <rect x="30" y="36" width="60" height="30" rx="5" fill="${P.wood}" stroke="${P.woodDeep}" stroke-width="2"/>
    <rect x="26" y="28" width="68" height="10" rx="4" fill="${P.woodDeep}"/><path d="M50 28 Q60 18 70 28" stroke="${P.gold}" stroke-width="3" fill="none"/></svg>`
};

/** Tara and Mithu on their own, for HTML-based scenes. */
export function charactersOnly({ mood = 'happy', pose = 'stand' } = {}) {
  return `<svg class="cast-svg" viewBox="0 0 200 270" aria-hidden="true">${taraAndMithu({ x: 100, y: 262, scale: 1, mood, pose })}</svg>`;
}

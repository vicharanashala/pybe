// Tara and Mithu, drawn as inline SVG.
//
// Both return an SVG <g> placed by where their FEET touch the ground, so they
// stand naturally in any scene. Every expression is drawn once and CSS shows
// the right one (data-mood), so a scene can change Tara's face, make her walk
// or make Mithu flap, without redrawing anyone.

const C = {
  skin: '#E8B590',
  skinShade: '#D79E7A',
  hair: '#3A2834',
  hairLight: '#5A4050',
  dress: '#C8B8E8',
  dressShade: '#AE9BD8',
  gold: '#E8C987',
  goldDeep: '#C9A24E',
  plum: '#40304F',
  blush: '#F1A7B8',
  white: '#FFFFFF',
  collar: '#FFF9F0'
};

const MOODS = ['happy', 'curious', 'surprised', 'thinking'];

const MOUTHS = {
  happy: '<path d="M71 104 Q80 115 89 104 Q80 108 71 104 Z" fill="#B5566B"/>',
  curious: '<path d="M73 104 Q80 110 87 104" stroke="#8A4A5A" stroke-width="2.6" fill="none" stroke-linecap="round"/>',
  surprised: '<ellipse cx="80" cy="107" rx="5" ry="6.5" fill="#B5566B"/>',
  thinking: '<path d="M73 106 Q79 108 86 103" stroke="#8A4A5A" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
};

const BROWS = {
  happy: '<path d="M56 70 Q63 65 71 69"/><path d="M89 69 Q97 65 104 70"/>',
  curious: '<path d="M56 71 Q63 67 71 70"/><path d="M89 64 Q97 58 104 63"/>',
  surprised: '<path d="M56 64 Q63 58 71 63"/><path d="M89 63 Q97 58 104 64"/>',
  thinking: '<path d="M56 69 Q63 67 71 70"/><path d="M89 66 Q97 61 104 66"/>'
};

function eye(cx) {
  return `
    <ellipse cx="${cx}" cy="86" rx="8.5" ry="10.5" fill="${C.white}"/>
    <ellipse cx="${cx + 0.5}" cy="87.5" rx="6.2" ry="8" fill="${C.plum}"/>
    <circle cx="${cx + 2.6}" cy="83.5" r="2.6" fill="${C.white}"/>
    <circle cx="${cx - 2}" cy="91" r="1.2" fill="${C.white}"/>
    <path d="M${cx - 9} 79 Q${cx} 72.5 ${cx + 9.5} 79" stroke="${C.plum}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
}

/**
 * Tara: dark hair, a lavender dress with golden trim, and a small golden
 * star clip in her hair. About 250 units tall at scale 1.
 * @param {object} o
 * @param {'happy'|'curious'|'surprised'|'thinking'} [o.mood]
 * @param {'stand'|'point'} [o.pose]  'point' raises her arm towards something
 */
export function tara({ x = 0, y = 0, scale = 1, mood = 'happy', pose = 'stand' } = {}) {
  const pointing = pose === 'point';
  return `
<g class="tara" data-mood="${mood}" transform="translate(${x} ${y}) scale(${scale})" aria-hidden="true">
 <g transform="translate(-80 -252)">
  <ellipse cx="80" cy="250" rx="46" ry="7" fill="${C.plum}" opacity="0.13"/>

  <!-- hair behind her shoulders -->
  <path d="M34 80 Q26 142 42 172 Q60 162 62 140 L98 140 Q100 162 118 172 Q134 142 126 80 Z" fill="${C.hair}"/>

  <!-- legs: separate groups so CSS can make her walk -->
  <g class="leg leg-left"><rect x="66" y="204" width="12" height="38" rx="6" fill="#F4ECF8"/><ellipse cx="70" cy="244" rx="11" ry="6" fill="${C.plum}"/></g>
  <g class="leg leg-right"><rect x="84" y="204" width="12" height="38" rx="6" fill="#F4ECF8"/><ellipse cx="91" cy="244" rx="11" ry="6" fill="${C.plum}"/></g>

  <!-- arms -->
  <path d="M52 146 Q40 172 44 194" stroke="${C.skin}" stroke-width="10" fill="none" stroke-linecap="round"/>
  <circle cx="44" cy="197" r="7.5" fill="${C.skin}"/>
  ${pointing
    ? `<path d="M108 146 Q130 130 148 112" stroke="${C.skin}" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="151" cy="109" r="7.5" fill="${C.skin}"/>`
    : `<path d="M108 146 Q120 172 116 194" stroke="${C.skin}" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="116" cy="197" r="7.5" fill="${C.skin}"/>`}

  <!-- the lavender dress, with golden trim and a waist ribbon -->
  <path d="M56 132 Q80 122 104 132 L126 214 Q80 228 34 214 Z" fill="${C.dress}"/>
  <path d="M80 126 Q100 128 104 132 L126 214 Q104 222 82 224 Z" fill="${C.dressShade}" opacity="0.55"/>
  <path d="M36 210 Q80 224 124 210" stroke="${C.gold}" stroke-width="3.5" fill="none"/>
  <path d="M50 158 Q80 164 110 158" stroke="${C.gold}" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="80" cy="162" r="4" fill="${C.gold}"/>
  <circle cx="56" cy="140" r="13" fill="${C.dress}"/><circle cx="104" cy="140" r="13" fill="${C.dress}"/>

  <!-- collar, neck and head -->
  <rect x="73" y="114" width="14" height="16" rx="5" fill="${C.skinShade}"/>
  <path d="M66 128 Q80 138 94 128 Q88 124 80 126 Q72 124 66 128 Z" fill="${C.collar}"/>
  <circle cx="80" cy="82" r="42" fill="${C.skin}"/>

  <!-- hair: a soft side-swept fringe -->
  <path d="M37 84 Q30 34 80 32 Q130 34 123 84 Q120 62 104 52 Q84 64 62 60 Q46 64 37 84 Z" fill="${C.hair}"/>
  <path d="M62 44 Q78 36 96 42" stroke="${C.hairLight}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7"/>

  <!-- the small golden star clip -->
  <g class="hair-clip" transform="translate(110 50)">
    <path d="M0 -10 L3 -3 L10 -3 L4.5 1.5 L6.5 9 L0 4.5 L-6.5 9 L-4.5 1.5 L-10 -3 L-3 -3 Z" fill="${C.gold}" stroke="${C.goldDeep}" stroke-width="1"/>
    <circle cx="0" cy="0" r="2" fill="#FFF6DC"/>
  </g>

  <!-- face -->
  <ellipse cx="54" cy="100" rx="8" ry="5" fill="${C.blush}" opacity="0.55"/>
  <ellipse cx="106" cy="100" rx="8" ry="5" fill="${C.blush}" opacity="0.55"/>
  ${eye(64)}${eye(96)}
  <path d="M78 96 Q80 99 83 96" stroke="${C.skinShade}" stroke-width="2" fill="none" stroke-linecap="round"/>
  ${MOODS.map((m) => `<g class="mood mood-${m}"><g stroke="${C.hair}" stroke-width="3" fill="none" stroke-linecap="round">${BROWS[m]}</g>${MOUTHS[m]}</g>`).join('')}
 </g>
</g>`;
}

/**
 * Mithu: a little green parrot with a golden-yellow beak, a gold-tipped crest
 * and a tiny golden band on one leg. About 100 units tall at scale 1, facing
 * right unless `flip` is set. The wing and head are their own groups so CSS
 * can make him flap and tilt his head.
 */
export function mithu({ x = 0, y = 0, scale = 1, flip = false } = {}) {
  const sx = flip ? -scale : scale;
  return `
<g class="mithu" transform="translate(${x} ${y}) scale(${sx} ${scale})" aria-hidden="true">
 <g class="mithu-bob">
 <g transform="translate(-50 -98)">
  <path d="M34 72 L8 108 L22 108 L44 82 Z" fill="#4E9F78"/>
  <path d="M40 76 L22 112 L33 110 L48 84 Z" fill="#6DBE93"/>
  <ellipse cx="50" cy="62" rx="26" ry="32" fill="#7CC49A"/>
  <ellipse cx="57" cy="70" rx="14" ry="20" fill="#CDEBD8"/>
  <g class="mithu-wing"><path d="M30 50 Q18 78 42 92 Q38 70 47 55 Z" fill="#58A47E"/><path d="M28 64 Q30 80 40 88" stroke="#4E9F78" stroke-width="2" fill="none"/></g>
  <g class="mithu-head">
    <path d="M49 16 Q46 2 57 4 Q55 10 59 15 Z" fill="#58A47E"/>
    <circle cx="56" cy="5" r="3" fill="#E8C987"/>
    <circle cx="58" cy="33" r="20" fill="#7CC49A"/>
    <path d="M42 46 Q58 57 75 44" stroke="#E8C987" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="1 5"/>
    <path d="M73 27 Q92 31 81 47 Q77 41 72 39 Z" fill="#E9B949"/>
    <path d="M74 40 Q80 44 80 47 Q76 45 72 41 Z" fill="#D29A2E"/>
    <ellipse cx="69" cy="40" rx="4" ry="2.5" fill="#F1A7B8" opacity="0.65"/>
    <circle cx="64" cy="28" r="5.5" fill="#FFFFFF"/>
    <circle cx="65.5" cy="28.5" r="3.4" fill="#40304F"/>
    <circle cx="64.3" cy="27" r="1.2" fill="#FFFFFF"/>
  </g>
  <path d="M44 92 L42 99 M56 92 L58 99" stroke="#E9B949" stroke-width="3.5" stroke-linecap="round"/>
  <rect x="53.5" y="93" width="6" height="2.5" rx="1" fill="#E8C987"/>
 </g>
 </g>
</g>`;
}

/**
 * Tara with Mithu perched on her shoulder: the pair as they appear in most
 * scenes.
 */
export function taraAndMithu({ x, y, scale = 1, mood = 'happy', pose = 'stand', mithuFlip = false }) {
  // Tara's right shoulder sits at (104, 134) in her own drawing.
  const sx = x + (104 - 80) * scale;
  const sy = y + (134 - 252) * scale;
  return `
<g class="actor actor-tara" data-actor="tara">
  ${tara({ x, y, scale, mood, pose })}
  <g class="actor-mithu-perch">${mithu({ x: sx, y: sy, scale: 0.36 * scale, flip: mithuFlip })}</g>
</g>`;
}

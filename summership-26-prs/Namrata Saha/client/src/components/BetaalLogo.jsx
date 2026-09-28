/**
 * BetaalLogo
 * Original clipart of the classic Vikram-Betaal scene for PyBe branding:
 * King Vikramaditya (royal turban, beard, robe) carries Betaal - a friendly cream
 * spirit with a bindi and gentle smile - draped over his shoulder and back.
 * Faces use soft human features (white almond eyes, brows, nose, smiling mouth)
 * while staying flat and legible in the small header badge on the PyBe purple.
 */

/* Reusable almond eye: white sclera, dark pupil, tiny highlight. Placed via transform. */
function Eye() {
  return (
    <g>
      <path d="M -3.6 0 Q 0 -2.8 3.6 0 Q 0 2.8 -3.6 0 Z" fill="#FFFFFF" />
      <circle cx="1" cy="0.2" r="1.1" fill="#33261C" />
      <circle cx="1.5" cy="-0.5" r="0.45" fill="#FFFFFF" />
    </g>
  );
}

export default function BetaalLogo({ size = 24, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Betaal, the storyteller spirit"
    >
      {/* ===== King Vikramaditya ===== */}
      {/* head */}
      <ellipse cx="32" cy="26" rx="9.5" ry="10.5" fill="#E6B98C" />
      {/* hair peeking under the turban */}
      <path d="M 24 20 Q 23.3 23.8 26.2 24.4 L 26.8 20.6 Z" fill="#4a3020" />
      <path d="M 40 20 Q 40.7 23.8 37.8 24.4 L 37.2 20.6 Z" fill="#4a3020" />
      {/* neck */}
      <rect x="29.6" y="35.6" width="4.8" height="3.2" fill="#E6B98C" />
      {/* turban */}
      <path d="M 21 19.5 Q 21 10.5 32 10.5 Q 43 10.5 43 19.5 L 43 23.5 Q 32 17 21 23.5 Z" fill="#D9A441" />
      <path d="M 27 12.4 Q 26.6 15 27.6 17.2" stroke="#C6923B" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M 37 12.4 Q 37.4 15 36.4 17.2" stroke="#C6923B" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <rect x="21" y="18.5" width="22" height="5" rx="2.5" fill="#B8862F" />
      <ellipse cx="32" cy="12" rx="4" ry="2.6" fill="#B8862F" />
      {/* turban crest */}
      <rect x="30.9" y="8.6" width="2.2" height="2.2" fill="#B8862F" />
      <circle cx="32" cy="7.2" r="2.3" fill="#C2572E" />
      {/* face: brows, eyes, nose */}
      <path d="M 24.6 23 Q 26.8 21.6 29 22.8" stroke="#6b4a2e" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M 35 22.8 Q 37.2 21.6 39.4 23" stroke="#6b4a2e" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <g transform="translate(28 26.8)"><Eye /></g>
      <g transform="translate(36 26.8)"><Eye /></g>
      <path d="M 31.2 28.4 Q 32 29.9 32.8 28.4" stroke="#c08457" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* mustache */}
      <path d="M 27.6 30.6 Q 32 28.6 36.4 30.6 Q 33.6 31.8 32 31 Q 30.4 31.8 27.6 30.6 Z" fill="#7a4a2a" />
      {/* smiling mouth */}
      <path d="M 29.4 32.4 Q 32 35.4 34.6 32.4 Q 32 34.4 29.4 32.4 Z" fill="#7a3b2e" />
      {/* beard */}
      <path d="M 26 33.4 C 27 38.8 29 40.8 32 41.2 C 35 40.8 37 38.8 38 33.4 C 35 36.4 29 36.4 26 33.4 Z" fill="#A9714A" />
      {/* robe */}
      <path d="M 25 39 Q 32 41.5 39 39 L 50 56 L 14 56 Z" fill="#3a7a5a" />
      {/* v-collar */}
      <path d="M 27.5 39.5 L 32 44.5 L 36.5 39.5 L 32 41.8 Z" fill="#E7C984" />
      {/* sleeves + hands */}
      <path d="M 24.5 40 C 21 41.5 17.5 44.5 16 48 L 19 49 C 20 46 22.5 44 25 42.5 Z" fill="#356c50" />
      <path d="M 39.5 40 C 43 41.5 46.5 44.5 48 48 L 45 49 C 44 46 41.5 44 39 42.5 Z" fill="#356c50" />
      <circle cx="16" cy="50" r="2.6" fill="#E6B98C" />
      <circle cx="46" cy="50" r="2.6" fill="#E6B98C" />
      {/* belt + hem */}
      <rect x="14" y="48" width="36" height="3.2" rx="1.6" fill="#D9A441" />
      <rect x="30.4" y="46.8" width="3.2" height="5.6" rx="1" fill="#B8862F" />
      <rect x="14" y="52.8" width="36" height="3.2" rx="1.6" fill="#D9A441" />

      {/* ===== Betaal the spirit ===== */}
      {/* draped body */}
      <path
        d="M 45 30 C 41 38 35 45 28 49 C 23 51.5 18 52 16 50 A 4 4 0 0 0 23 55 A 4 4 0 0 0 31 52 C 36 49 41 43 44 36 C 46 33 47 31 47 30 Z"
        fill="#F8E9CB"
      />
      <circle cx="30" cy="47" r="1.6" fill="#B8862F" />
      {/* head */}
      <ellipse cx="49" cy="23" rx="8.8" ry="9.8" fill="#F8E9CB" />
      {/* mini turban (Betaal's spirit identity) */}
      <rect x="42.5" y="15" width="13" height="3.6" rx="1.8" fill="#D9A441" />
      <ellipse cx="49" cy="13.2" rx="2.6" ry="2" fill="#B8862F" />
      <rect x="48" y="10.8" width="2" height="1.9" fill="#B8862F" />
      <circle cx="49" cy="9.6" r="1.9" fill="#C2572E" />
      {/* face: bindi, brows, eyes, nose, mouth, cheeks */}
      <circle cx="49" cy="20.2" r="1.8" fill="#C2572E" />
      <path d="M 43.8 23.2 Q 46 22.2 48 23" stroke="#b98d5e" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M 50 23 Q 52 22.2 54.2 23.2" stroke="#b98d5e" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <g transform="translate(46 25.4)"><Eye /></g>
      <g transform="translate(52 25.4)"><Eye /></g>
      <path d="M 48.3 27.2 Q 49 28.4 49.7 27.2" stroke="#c9a878" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <path d="M 47.2 30 Q 49 32.4 50.8 30 Q 49 31.4 47.2 30 Z" fill="#a85f4a" />
      <ellipse cx="44.6" cy="28.6" rx="2" ry="1.3" fill="#E88B6A" opacity="0.5" />
      <ellipse cx="53.4" cy="28.6" rx="2" ry="1.3" fill="#E88B6A" opacity="0.5" />
      {/* arm resting on the king's shoulder */}
      <path d="M 41.5 29.5 C 39.8 31.8 39.2 34.4 40.2 36.4 L 43 35.8 C 42 33.8 42.6 32.2 43.6 30.6 Z" fill="#F8E9CB" />
      <circle cx="40.6" cy="37" r="1.9" fill="#F8E9CB" />
    </svg>
  );
}

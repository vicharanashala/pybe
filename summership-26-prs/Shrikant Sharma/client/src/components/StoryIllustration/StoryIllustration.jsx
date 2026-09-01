import "./StoryIllustration.css";

function MoonScene() {
  return (
    <svg viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ill-moon-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A5A46" />
          <stop offset="100%" stopColor="#2C4435" />
        </linearGradient>
        <radialGradient id="ill-moon-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#F7EBC4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F7EBC4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ill-moon-river" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#AFC7B4" />
          <stop offset="100%" stopColor="#7C9C87" />
        </linearGradient>
      </defs>

      <rect width="1200" height="520" fill="url(#ill-moon-sky)" />

      <g fill="#F7EBC4">
        <circle cx="120" cy="70" r="2.2" opacity="0.8" />
        <circle cx="230" cy="120" r="1.8" opacity="0.6" />
        <circle cx="360" cy="60" r="2" opacity="0.7" />
        <circle cx="480" cy="140" r="1.6" opacity="0.5" />
        <circle cx="640" cy="70" r="2.2" opacity="0.6" />
        <circle cx="760" cy="150" r="1.8" opacity="0.5" />
        <circle cx="860" cy="60" r="2" opacity="0.7" />
        <circle cx="1040" cy="120" r="1.8" opacity="0.6" />
        <circle cx="1120" cy="70" r="2" opacity="0.7" />
      </g>

      <g className="ill-cloud" fill="#E4EBE0" opacity="0.35">
        <ellipse cx="200" cy="110" rx="90" ry="22" />
        <ellipse cx="260" cy="96" rx="60" ry="18" />
      </g>
      <g className="ill-cloud ill-cloud--2" fill="#E4EBE0" opacity="0.3">
        <ellipse cx="860" cy="120" rx="100" ry="24" />
        <ellipse cx="930" cy="104" rx="66" ry="20" />
      </g>

      <g>
        <circle className="ill-moon-pulse" cx="820" cy="150" r="150" fill="url(#ill-moon-halo)" />
        <circle cx="820" cy="150" r="70" fill="#F1E3BC" />
        <circle cx="842" cy="138" r="62" fill="#F7F0DD" />
        <circle cx="800" cy="140" r="8" fill="#EAD9AC" opacity="0.7" />
        <circle cx="836" cy="170" r="7" fill="#EAD9AC" opacity="0.6" />
        <circle cx="810" cy="182" r="5" fill="#EAD9AC" opacity="0.5" />
      </g>

      <path d="M0 320 Q 120 288 260 306 T 520 300 T 780 310 T 1040 296 L 1200 304 L 1200 520 L 0 520 Z" fill="#24402E" />

      <path d="M240 340 C 380 330 520 350 680 358 C 860 366 1020 358 1200 372 L 1200 520 L 240 520 Z" fill="url(#ill-moon-river)" />
      <path className="ill-shimmer" d="M420 392 q 40 12 84 4" stroke="#F1E3BC" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" />
      <path className="ill-shimmer ill-shimmer--2" d="M600 428 q 46 12 96 4" stroke="#F1E3BC" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.45" />
      <path className="ill-shimmer ill-shimmer--3" d="M820 464 q 42 11 90 4" stroke="#F1E3BC" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.35" />

      <path d="M0 470 Q 150 450 320 464 T 700 468 T 1200 462 L 1200 520 L 0 520 Z" fill="#1F3626" />

      <g stroke="#3A543F" strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M180 520 C 190 480 188 452 200 428" />
        <path d="M210 520 C 222 486 230 460 224 432" />
        <path d="M240 520 C 234 484 246 458 260 440" />
      </g>
      <ellipse cx="200" cy="424" rx="5" ry="9" fill="#D8A84C" />
      <ellipse cx="224" cy="428" rx="5" ry="9" fill="#B8893A" />
      <ellipse cx="260" cy="436" rx="5" ry="9" fill="#D8A84C" />

      <circle className="ill-sparkle" cx="300" cy="430" r="3" fill="#F5C869" />
      <circle className="ill-sparkle ill-sparkle--2" cx="1000" cy="440" r="3" fill="#F5C869" />
      <circle className="ill-sparkle ill-sparkle--3" cx="940" cy="400" r="2.4" fill="#F5C869" />

      <g transform="translate(700 60)">
        <ellipse cx="140" cy="432" rx="86" ry="16" fill="#162A1C" opacity="0.55" />
        <ellipse cx="150" cy="400" rx="42" ry="32" fill="#F3EADB" />
        <circle cx="196" cy="386" r="30" fill="#F3EADB" />
        <g className="ill-ear">
          <ellipse cx="196" cy="326" rx="8" ry="26" fill="#E7D9C0" />
          <ellipse cx="196" cy="326" rx="4.2" ry="16" fill="#CDB894" />
        </g>
        <g className="ill-ear ill-ear--r">
          <ellipse cx="220" cy="330" rx="8" ry="24" fill="#E7D9C0" />
          <ellipse cx="220" cy="330" rx="4.2" ry="15" fill="#CDB894" />
        </g>
        <circle cx="214" cy="378" r="3.6" fill="#2B2B2B" />
        <circle cx="206" cy="386" r="2.6" fill="#C66A2B" />
        <circle cx="150" cy="424" r="12" fill="#FBF6EA" />
      </g>
    </svg>
  );
}

function CrowScene() {
  return (
    <svg viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ill-crow-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EEDFC3" />
          <stop offset="100%" stopColor="#DCC39A" />
        </linearGradient>
        <radialGradient id="ill-crow-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#F5C869" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#F5C869" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1200" height="520" fill="url(#ill-crow-sky)" />
      <circle cx="140" cy="120" r="150" fill="url(#ill-crow-sun)" />
      <circle className="ill-sun-glow" cx="140" cy="120" r="52" fill="#EBBF74" />

      <path d="M0 380 Q 180 358 360 372 T 720 368 T 1080 370 L 1200 366 L 1200 520 L 0 520 Z" fill="#C9A870" />
      <path d="M0 440 Q 200 426 420 434 T 840 430 T 1200 436 L 1200 520 L 0 520 Z" fill="#B98E58" />

      <ellipse cx="260" cy="470" rx="22" ry="13" fill="#8A7F74" />
      <ellipse cx="880" cy="486" rx="26" ry="15" fill="#7B7066" />
      <ellipse cx="960" cy="452" rx="18" ry="11" fill="#9C9084" />
      <ellipse cx="1060" cy="470" rx="20" ry="12" fill="#8A7F74" />

      <ellipse cx="600" cy="472" rx="150" ry="26" fill="#2B2B2B" opacity="0.16" />
      <path d="M660 260 C 760 262 800 340 760 400" stroke="#9A4E1F" strokeWidth="26" fill="none" strokeLinecap="round" />
      <path d="M470 330 C 448 420 470 480 540 512 C 590 538 680 540 730 512 C 800 484 822 420 796 330 Z" fill="#C66A2B" />
      <path d="M500 344 C 486 420 496 474 540 502" stroke="#D3772F" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M560 330 L 580 226 L 690 226 L 706 330 Z" fill="#9A4E1F" />

      <ellipse cx="635" cy="226" rx="66" ry="22" fill="#8A4018" />
      <ellipse cx="635" cy="226" rx="55" ry="17" fill="#9A4E1F" />

      <g className="ill-water-rise">
        <ellipse cx="635" cy="230" rx="50" ry="15" fill="#AFC7B4" />
        <path d="M600 226 q 16 7 34 4" stroke="#E8F0E6" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.85" />
      </g>

      <path d="M786 250 h 34" stroke="#AFC7B4" strokeWidth="9" strokeLinecap="round" opacity="0.9" />
      <path d="M790 292 h 30" stroke="#AFC7B4" strokeWidth="9" strokeLinecap="round" opacity="0.55" />
      <path d="M794 334 h 26" stroke="#AFC7B4" strokeWidth="9" strokeLinecap="round" opacity="0.35" />

      <ellipse cx="440" cy="470" rx="20" ry="13" fill="#7B7066" />
      <ellipse cx="470" cy="466" rx="16" ry="11" fill="#9C9084" />
      <ellipse cx="452" cy="452" rx="15" ry="10" fill="#8A7F74" />
      <circle className="ill-sparkle" cx="440" cy="440" r="3" fill="#F5C869" />
      <circle className="ill-sparkle ill-sparkle--2" cx="470" cy="452" r="2.6" fill="#F5C869" />

      <g className="ill-pebble-fall">
        <circle cx="600" cy="202" r="14" fill="#8A7F74" />
      </g>

      <g>
        <path className="ill-wing ill-wing--l" d="M610 190 C 570 160 520 152 488 164 C 530 184 556 196 574 210 Z" fill="#33333A" />
        <ellipse cx="640" cy="210" rx="58" ry="40" fill="#2B2B2B" />
        <circle cx="580" cy="186" r="32" fill="#2B2B2B" />
        <path d="M548 178 l -28 10 l 24 14 Z" fill="#D8A84C" />
        <circle cx="570" cy="182" r="6" fill="#F3EADB" />
        <path d="M600 246 l -3 14 M612 246 l 0 16 M624 246 l 3 14" stroke="#2B2B2B" strokeWidth="5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function TurtleScene() {
  return (
    <svg viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ill-turtle-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9D6BF" />
          <stop offset="100%" stopColor="#A8BFA5" />
        </linearGradient>
        <radialGradient id="ill-turtle-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#F5C869" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#F5C869" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1200" height="520" fill="url(#ill-turtle-sky)" />
      <circle cx="160" cy="110" r="140" fill="url(#ill-turtle-sun)" />
      <circle className="ill-sun-glow" cx="160" cy="110" r="44" fill="#EBBF74" />

      <g fill="#5F7A60" opacity="0.5">
        <circle cx="80" cy="260" r="44" />
        <circle cx="128" cy="252" r="36" />
        <circle cx="1120" cy="230" r="46" />
        <circle cx="1168" cy="224" r="38" />
        <circle cx="1060" cy="300" r="34" />
      </g>

      <g>
        <rect x="90" y="200" width="26" height="150" rx="12" fill="#4C5741" />
        <circle cx="76" cy="190" r="52" fill="#3F5B41" />
        <circle cx="132" cy="194" r="44" fill="#4A6B4C" />
        <circle cx="104" cy="150" r="48" fill="#557A54" />
        <rect x="1060" y="230" width="24" height="140" rx="11" fill="#4C5741" />
        <circle cx="1050" cy="220" r="48" fill="#3F5B41" />
        <circle cx="1096" cy="224" r="42" fill="#4A6B4C" />
        <circle cx="1072" cy="184" r="44" fill="#557A54" />
      </g>

      <path d="M0 380 Q 200 358 420 372 T 840 366 T 1200 372 L 1200 520 L 0 520 Z" fill="#7C986F" />
      <path d="M120 520 C 200 470 380 440 520 420 C 700 396 940 398 1080 372 L 1200 520 Z" fill="#E8DCC8" />
      <path d="M180 500 C 280 462 460 432 580 420 C 720 406 940 406 1060 392" stroke="#C9A870" strokeWidth="8" strokeLinecap="round" strokeDasharray="4 30" fill="none" opacity="0.7" />

      <g>
        <rect x="250" y="368" width="12" height="70" rx="5" fill="#6B4A2C" />
        <path d="M246 352 L 296 336 L 246 326 Z" fill="#C66A2B" />
      </g>
      <g>
        <rect x="880" y="356" width="12" height="70" rx="5" fill="#6B4A2C" />
        <path d="M876 340 L 926 324 L 876 314 Z" fill="#B8893A" />
      </g>

      <g stroke="#6C8A62" strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M420 470 l 8 -22 M430 468 l 0 -26 M440 470 l -6 -20" />
        <path d="M740 480 l 8 -22 M750 478 l 0 -26 M760 480 l -6 -20" />
      </g>

      <g className="ill-walk">
        <ellipse className="ill-leg ill-leg--fl" cx="560" cy="452" rx="26" ry="13" fill="#4A6B4C" />
        <ellipse className="ill-leg ill-leg--fr" cx="660" cy="452" rx="26" ry="13" fill="#4A6B4C" />
        <ellipse className="ill-leg ill-leg--bl" cx="570" cy="456" rx="22" ry="11" fill="#4A6B4C" />
        <ellipse className="ill-leg ill-leg--br" cx="650" cy="456" rx="22" ry="11" fill="#4A6B4C" />
        <ellipse cx="610" cy="400" rx="86" ry="50" fill="#4A6B4C" />
        <ellipse cx="610" cy="388" rx="86" ry="50" fill="#D8A84C" />
        <ellipse cx="610" cy="388" rx="60" ry="32" fill="none" stroke="#B8893A" strokeWidth="8" />
        <path d="M550 388 h 120" stroke="#B8893A" strokeWidth="8" strokeLinecap="round" />
        <path d="M584 362 c 0 24 0 48 0 60" stroke="#B8893A" strokeWidth="8" strokeLinecap="round" />
        <path d="M636 362 c 0 24 0 48 0 60" stroke="#B8893A" strokeWidth="8" strokeLinecap="round" />
        <circle cx="520" cy="394" r="28" fill="#4A6B4C" />
        <circle cx="506" cy="388" r="5" fill="#2B2B2B" />
        <path d="M486 404 q -12 10 -22 26" stroke="#4A6B4C" strokeWidth="10" fill="none" strokeLinecap="round" />
      </g>

      <g className="ill-butterfly ill-butterfly--1">
        <path className="ill-bfly-wing" d="M480 300 q -16 -16 -4 -30 q 16 8 12 22 Z" fill="#D3772F" opacity="0.9" />
        <path className="ill-bfly-wing" d="M480 300 q 16 -16 4 -30 q -16 8 -12 22 Z" fill="#C66A2B" opacity="0.9" />
        <ellipse cx="480" cy="304" rx="3" ry="8" fill="#2B2B2B" />
      </g>

      <g className="ill-butterfly ill-butterfly--2">
        <path className="ill-bfly-wing" d="M760 200 q -14 -14 -3 -26 q 14 7 10 19 Z" fill="#D8A84C" opacity="0.9" />
        <path className="ill-bfly-wing" d="M760 200 q 14 -14 3 -26 q -14 7 -10 19 Z" fill="#B8893A" opacity="0.9" />
        <ellipse cx="760" cy="204" rx="3" ry="7" fill="#2B2B2B" />
      </g>

      <g className="ill-leaf-fall">
        <path d="M300 40 C 308 48 308 62 300 70 C 292 62 292 48 300 40 Z" fill="#D8A84C" />
      </g>
      <g className="ill-leaf-fall ill-leaf-fall--2">
        <path d="M960 30 C 968 38 968 52 960 60 C 952 52 952 38 960 30 Z" fill="#C66A2B" />
      </g>
    </svg>
  );
}

const SCENES = {
  moon: MoonScene,
  crow: CrowScene,
  turtle: TurtleScene,
};

export default function StoryIllustration({ type = "moon" }) {
  const Scene = SCENES[type] ?? MoonScene;

  return (
    <div className="ill" aria-hidden="true">
      <Scene />
    </div>
  );
}

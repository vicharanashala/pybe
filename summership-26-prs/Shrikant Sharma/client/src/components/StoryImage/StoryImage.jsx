import "./StoryImage.css";

const LEAVES = [
  { x: 6, size: 17, dur: 15, delay: 0, sway: 120, spin: 260, color: "#D8A84C" },
  { x: 14, size: 13, dur: 18, delay: 3.2, sway: -90, spin: -220, color: "#B98A3E" },
  { x: 25, size: 15, dur: 13, delay: 1.4, sway: 70, spin: 300, color: "#C66A2B" },
  { x: 38, size: 12, dur: 20, delay: 5.1, sway: -140, spin: -340, color: "#D8A84C" },
  { x: 54, size: 16, dur: 16, delay: 2.2, sway: 110, spin: 280, color: "#8FA88C" },
  { x: 66, size: 13, dur: 22, delay: 7.3, sway: -80, spin: -260, color: "#D8A84C" },
  { x: 78, size: 14, dur: 14, delay: 4.1, sway: 130, spin: 240, color: "#C66A2B" },
  { x: 90, size: 15, dur: 19, delay: 6.2, sway: -110, spin: -300, color: "#8FA88C" },
];

const PARTICLES = [
  { x: 28, y: 62, s: 5, dur: 4.2, delay: 0 },
  { x: 44, y: 74, s: 4, dur: 5.4, delay: 1.2 },
  { x: 58, y: 66, s: 6, dur: 6.1, delay: 0.6 },
  { x: 70, y: 78, s: 4, dur: 4.8, delay: 2.1 },
  { x: 82, y: 60, s: 5, dur: 5.7, delay: 1.6 },
  { x: 18, y: 80, s: 4, dur: 6.6, delay: 2.8 },
  { x: 92, y: 72, s: 5, dur: 5.1, delay: 0.9 },
  { x: 37, y: 84, s: 4, dur: 6.9, delay: 3.4 },
];

function Tree({ x, y, scale = 1, shade = "#3F5B41", canopy = "#557A54", canopy2 = "#4A6B4C" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-8" y="-74" width="16" height="74" rx="7" fill="#4C5741" />
      <circle cx="-24" cy="-82" r="30" fill={shade} />
      <circle cx="16" cy="-80" r="26" fill={canopy2} />
      <circle cx="-4" cy="-106" r="28" fill={canopy} />
    </g>
  );
}

export default function StorybookHero() {
  return (
    <div className="si-hero" aria-hidden="true">
      <svg
        className="si-scene"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="si-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDF7E9" />
            <stop offset="62%" stopColor="#F8F1E0" />
            <stop offset="100%" stopColor="#F1E6D0" />
          </linearGradient>
          <radialGradient id="si-sun-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#F5C869" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#EEC579" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#EEC579" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="si-river" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#AFC7B4" />
            <stop offset="100%" stopColor="#87A990" />
          </linearGradient>
          <radialGradient id="si-moon-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#F7EBC4" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#F7EBC4" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#si-sky)" />

        <g className="si-sun">
          <circle cx="1190" cy="150" r="240" fill="url(#si-sun-glow)" />
          <g className="si-sun-rays">
            {Array.from({ length: 12 }).map((_, index) => (
              <line
                key={index}
                x1="1190"
                y1="150"
                x2="1190"
                y2="44"
                stroke="#EBC27A"
                strokeWidth="7"
                strokeLinecap="round"
                opacity="0.4"
                transform={`rotate(${index * 30} 1190 150)`}
              />
            ))}
          </g>
          <circle cx="1190" cy="150" r="46" fill="#EBBF74" />
        </g>

        <g className="si-moon">
          <circle cx="210" cy="170" r="70" fill="url(#si-moon-glow)" />
          <circle cx="210" cy="170" r="44" fill="#F1E3BC" />
          <circle cx="232" cy="158" r="40" fill="#F7F0DD" />
          <circle cx="196" cy="160" r="5" fill="#EAD9AC" opacity="0.7" />
          <circle cx="220" cy="184" r="4" fill="#EAD9AC" opacity="0.6" />
        </g>

        <g className="si-clouds">
          <ellipse cx="420" cy="180" rx="90" ry="26" fill="#FBF6E9" opacity="0.85" />
          <ellipse cx="470" cy="168" rx="60" ry="22" fill="#FBF6E9" opacity="0.9" />
          <ellipse cx="980" cy="230" rx="110" ry="26" fill="#FBF6E9" opacity="0.7" />
          <ellipse cx="1030" cy="218" rx="66" ry="22" fill="#FBF6E9" opacity="0.8" />
        </g>

        <path
          className="si-hill-far"
          d="M0 500 Q 180 448 380 486 T 760 472 T 1140 500 T 1440 470 L1440 900 L0 900 Z"
          fill="#A9BCA3"
          opacity="0.5"
        />

        <path
          className="si-hill-mid"
          d="M0 600 Q 240 542 480 580 T 980 556 T 1440 588 L1440 900 L0 900 Z"
          fill="#6F8A70"
        />

        <Tree x="120" y="568" scale="1.1" />
        <Tree x="248" y="590" scale="0.85" shade="#557A54" canopy="#6F8A70" canopy2="#4A6B4C" />
        <Tree x="1320" y="572" scale="1" shade="#33491E" canopy="#557A54" canopy2="#44623F" />
        <Tree x="1440" y="560" scale="0.9" shade="#3F5B41" canopy="#6F8A70" canopy2="#44623F" />

        <path
          className="si-river"
          d="M330 560 C 440 610 520 700 640 780 C 760 858 960 884 1130 900 L 560 900 C 500 820 470 720 470 640 Z"
          fill="url(#si-river)"
        />

        <path
          className="si-river-light"
          d="M400 620 C 480 680 540 760 640 826 C 730 884 880 900 1010 900 L 620 900 C 570 820 545 720 545 650 Z"
          fill="#B7CDBB"
          opacity="0.55"
        />

        <path className="si-water-line" d="M470 700 q 34 9 68 0" stroke="#E8F0E6" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7" />
        <path className="si-water-line si-water-line--2" d="M520 790 q 40 10 80 0" stroke="#E8F0E6" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.55" />
        <path className="si-water-line si-water-line--3" d="M600 850 q 46 11 92 0" stroke="#E8F0E6" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.45" />

        <g transform="translate(0 -46)">
          <ellipse cx="700" cy="806" rx="250" ry="36" fill="#5F7A60" />
          <ellipse cx="700" cy="806" rx="238" ry="30" fill="#6F8A70" opacity="0.7" />

          <g className="si-rabbit">
            <circle cx="478" cy="742" r="8" fill="#FBF6EA" />
            <ellipse cx="452" cy="728" rx="30" ry="24" fill="#F3EADB" />
            <circle cx="452" cy="688" r="21" fill="#F3EADB" />
            <ellipse cx="437" cy="650" rx="7" ry="19" fill="#E7D9C0" transform="rotate(-14 437 650)" />
            <ellipse cx="459" cy="648" rx="7" ry="16" fill="#E7D9C0" transform="rotate(10 459 648)" />
            <ellipse cx="437" cy="650" rx="3.6" ry="11" fill="#CDB894" transform="rotate(-14 437 650)" />
            <ellipse cx="459" cy="648" rx="3.6" ry="9" fill="#CDB894" transform="rotate(10 459 648)" />
            <circle cx="447" cy="686" r="2.6" fill="#2B2B2B" />
            <circle cx="459" cy="694" r="2.2" fill="#C66A2B" />
            <path d="M470 690 q 5 4 9 0" stroke="#B49C72" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
          </g>

          <g className="si-book">
            <ellipse cx="718" cy="804" rx="206" ry="20" fill="#2B2B2B" opacity="0.12" />
            <rect x="708" y="726" width="26" height="98" rx="4" fill="#9A4E1F" />
            <path d="M498 700 L714 728 L714 822 L498 794 Z" fill="#B85F26" />
            <path d="M504 706 L714 732 L714 816 L504 788 Z" fill="#FFFDF6" />
            <path d="M726 728 L942 700 L942 794 L726 822 Z" fill="#C66A2B" />
            <path d="M726 732 L936 706 L936 788 L726 816 Z" fill="#FFFBF0" />
            <path className="si-page-line" d="M540 742 q 50 6 100 4" stroke="#DCC9A6" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path className="si-page-line" d="M542 758 q 46 5 92 4" stroke="#DCC9A6" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path className="si-page-line" d="M540 774 q 40 5 80 4" stroke="#DCC9A6" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path className="si-page-line" d="M792 752 q 46 -5 92 -4" stroke="#DCC9A6" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path className="si-page-line" d="M794 768 q 44 -4 88 -3" stroke="#DCC9A6" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path className="si-page-line" d="M792 784 q 34 -4 68 -3" stroke="#DCC9A6" strokeWidth="3" fill="none" strokeLinecap="round" />
            <rect x="716" y="696" width="11" height="52" rx="3" fill="#D8A84C" />
            <circle cx="710" cy="782" r="10" fill="#F3EADB" />
          </g>

          <g className="si-turtle">
            <ellipse cx="946" cy="776" rx="10" ry="6" fill="#4A6B4C" />
            <ellipse cx="1018" cy="778" rx="10" ry="6" fill="#4A6B4C" />
            <ellipse cx="985" cy="760" rx="42" ry="24" fill="#4A6B4C" />
            <ellipse cx="985" cy="754" rx="42" ry="24" fill="#D8A84C" />
            <ellipse cx="985" cy="754" rx="30" ry="15" fill="none" stroke="#B8893A" strokeWidth="4" />
            <path d="M955 754 h 60" stroke="#B8893A" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M972 744 c 0 12 -0 24 0 28" stroke="#B8893A" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M998 744 c 0 12 0 24 0 28" stroke="#B8893A" strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="948" cy="762" r="13" fill="#4A6B4C" />
            <circle cx="942" cy="759" r="2.4" fill="#2B2B2B" />
          </g>
        </g>

        <g className="si-crow">
          <path className="si-wing si-wing--l" d="M900 294 C 878 272 848 264 828 270 C 854 278 872 290 884 300 Z" fill="#33333A" />
          <path className="si-wing si-wing--r" d="M940 294 C 962 268 992 258 1014 262 C 988 276 972 288 958 300 Z" fill="#3A3A42" />
          <ellipse cx="922" cy="304" rx="25" ry="13" fill="#2B2B2B" />
          <circle cx="896" cy="296" r="11" fill="#2B2B2B" />
          <path d="M886 298 l -12 4 l 10 5 Z" fill="#D8A84C" />
          <circle cx="893" cy="294" r="2.2" fill="#F3EADB" />
          <path d="M912 318 l -3 8 M916 318 l -1 9 M920 317 l 1 9" stroke="#2B2B2B" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>

      {PARTICLES.map((p, index) => (
        <span
          key={`p-${index}`}
          className="si-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            "--dur": `${p.dur}s`,
            "--delay": `${p.delay}s`,
          }}
        />
      ))}

      {LEAVES.map((leaf, index) => (
        <span
          key={`l-${index}`}
          className="si-leaf"
          style={{
            left: `${leaf.x}%`,
            width: leaf.size,
            height: leaf.size,
            color: leaf.color,
            "--dur": `${leaf.dur}s`,
            "--delay": `${leaf.delay}s`,
            "--sway": `${leaf.sway}px`,
            "--spin": `${leaf.spin}deg`,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 3 C 17.5 8 17.5 16 12 21.5 C 6.5 16 6.5 8 12 3 Z" fill="currentColor" />
            <path d="M12 6 V 19" stroke="#F8F4EC" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
      ))}
    </div>
  );
}

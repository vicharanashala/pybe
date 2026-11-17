import { Play } from 'lucide-react';
import BetaalLogo from './BetaalLogo';
import './../intro.css';

const LEAVES = [
  { x: 90, y: 90, dur: 9, delay: 0.4, dx: -60, size: 1 },
  { x: 210, y: 40, dur: 11, delay: 2.1, dx: 90, size: 0.8 },
  { x: 620, y: 70, dur: 10, delay: 1.2, dx: -80, size: 1.1 },
  { x: 720, y: 150, dur: 12, delay: 3.4, dx: 70, size: 0.9 },
  { x: 330, y: 120, dur: 13, delay: 5.2, dx: -50, size: 1 },
  { x: 520, y: 30, dur: 9.5, delay: 6.6, dx: 60, size: 0.85 },
  { x: 840, y: 100, dur: 10.5, delay: 2.8, dx: -70, size: 0.9 }
];

const SPARKLES = [
  { x: 160, y: 120, dur: 2.6, delay: 0.2, size: 6 },
  { x: 300, y: 70, dur: 3.2, delay: 0.9, size: 5 },
  { x: 470, y: 140, dur: 2.9, delay: 1.6, size: 6 },
  { x: 640, y: 90, dur: 3.5, delay: 2.4, size: 5 },
  { x: 560, y: 210, dur: 2.4, delay: 1.1, size: 7 },
  { x: 850, y: 170, dur: 3.1, delay: 2, size: 5 }
];

const FAR_TREES = [
  { x: 34, y: 302 },
  { x: 420, y: 318 },
  { x: 500, y: 322 },
  { x: 600, y: 326 },
  { x: 720, y: 308 },
  { x: 830, y: 304 },
  { x: 930, y: 308 }
];

function Leaf({ leaf }) {
  return (
    <g
      className="intro-leaf"
      style={{
        animationDuration: `${leaf.dur}s`,
        animationDelay: `${leaf.delay}s`,
        '--dx': `${leaf.dx}px`,
        transformBox: 'fill-box',
        transformOrigin: 'center'
      }}
    >
      <g transform={`translate(${leaf.x} ${leaf.y}) scale(${leaf.size})`}>
        <path d="M0 0 C7 -9 15 -11 21 -6 C14 -1 6 0 0 0 Z" fill="#8fae5a" />
        <path d="M0 0 C7 -9 15 -11 21 -6" stroke="#6f8f42" strokeWidth="1" fill="none" />
      </g>
    </g>
  );
}

function Sparkle({ sparkle }) {
  return (
    <g
      className="intro-sparkle"
      style={{
        animationDuration: `${sparkle.dur}s`,
        animationDelay: `${sparkle.delay}s`,
        transformBox: 'fill-box',
        transformOrigin: 'center'
      }}
    >
      <path
        transform={`translate(${sparkle.x} ${sparkle.y})`}
        d="M0 -6 L1.4 -1.4 L6 0 L1.4 1.4 L0 6 L-1.4 1.4 L-6 0 L-1.4 -1.4 Z"
        fill="#f3c368"
      />
    </g>
  );
}

export default function Intro({ onDone }) {
  return (
    <section className="intro" aria-label="PyBe - Betaal Tales introduction">
      <div className="intro-scene-wrap">
        <svg
          className="intro-scene"
          viewBox="0 0 960 420"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="introSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1b1540" />
              <stop offset="45%" stopColor="#3a2b6e" />
              <stop offset="75%" stopColor="#6b3f86" />
              <stop offset="100%" stopColor="#a85f4a" />
            </linearGradient>
            <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f6e6bd" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#f6e6bd" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f6e6bd" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="betaalGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f2e7cf" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#f2e7cf" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#f2e7cf" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="crownGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f0d084" />
              <stop offset="100%" stopColor="#b8862f" />
            </linearGradient>
            <linearGradient id="robeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a3352a" />
              <stop offset="100%" stopColor="#5e1e1a" />
            </linearGradient>
            <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f0c297" />
              <stop offset="100%" stopColor="#d99e70" />
            </linearGradient>
            <linearGradient id="introGround" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2f6b4f" />
              <stop offset="100%" stopColor="#1d4532" />
            </linearGradient>
            <linearGradient id="horizonGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f2c98a" stopOpacity="0" />
              <stop offset="45%" stopColor="#ef9d6b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#7a3f8a" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="vignetteGrad" cx="50%" cy="50%" r="72%">
              <stop offset="0%" stopColor="#0d0a24" stopOpacity="0" />
              <stop offset="72%" stopColor="#0d0a24" stopOpacity="0" />
              <stop offset="100%" stopColor="#0d0a24" stopOpacity="0.4" />
            </radialGradient>
            <g id="introFarTree" fill="#2b1f49">
              <path d="M0 0 C -4 -14 -10 -20 -16 -24 C -12 -28 -10 -34 -10 -40 C -4 -38 2 -40 4 -44 C 6 -40 12 -38 18 -40 C 18 -34 20 -28 24 -26 C 18 -20 14 -14 10 0 Z" />
            </g>
          </defs>

          {/* sky */}
          <rect width="960" height="420" fill="url(#introSky)" />

          {/* soft horizon glow where the sky meets the hills */}
          <ellipse cx="480" cy="330" rx="540" ry="135" fill="url(#horizonGlow)" />

          {/* twilight moon + glow */}
          <g className="intro-moon" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <circle cx="660" cy="150" r="64" fill="url(#moonGlow)" />
            <circle cx="660" cy="150" r="34" fill="#f3ead7" opacity="0.95" />
            <circle cx="660" cy="150" r="35" fill="none" stroke="#fbf3dc" strokeWidth="1" opacity="0.8" />
            <circle cx="649" cy="142" r="7" fill="#e0d3b0" opacity="0.6" />
            <circle cx="673" cy="159" r="5" fill="#e0d3b0" opacity="0.5" />
            <circle cx="655" cy="164" r="4" fill="#e0d3b0" opacity="0.45" />
            <circle cx="668" cy="138" r="2.4" fill="#dcc79b" opacity="0.4" />
            <circle cx="648" cy="160" r="1.8" fill="#dcc79b" opacity="0.35" />
          </g>

          {/* stars */}
          <g className="intro-stars" fill="#e7d9a8">
            <circle cx="70" cy="72" r="0.9" opacity="0.7" />
            <circle cx="180" cy="36" r="1" opacity="0.8" />
            <circle cx="300" cy="92" r="0.8" opacity="0.6" />
            <circle cx="470" cy="34" r="0.9" opacity="0.7" />
            <circle cx="640" cy="52" r="0.8" opacity="0.6" />
            <circle cx="790" cy="96" r="0.9" opacity="0.7" />
            <circle cx="880" cy="40" r="1" opacity="0.85" />
            <circle cx="150" cy="170" r="0.8" opacity="0.5" />
            <circle cx="570" cy="150" r="0.8" opacity="0.5" />
            <circle cx="90" cy="50" r="1.6" />
            <circle cx="220" cy="96" r="1.2" />
            <circle cx="340" cy="40" r="1.5" />
            <circle cx="520" cy="60" r="1.3" />
            <circle cx="820" cy="48" r="1.4" />
            <circle cx="120" cy="130" r="1.2" />
            <circle cx="910" cy="92" r="1.1" />
            <circle cx="740" cy="48" r="1.2" />
            <circle cx="430" cy="112" r="1.1" />
          </g>

          {/* far mountain haze layers */}
          <path d="M0 240 Q 150 210 320 232 Q 520 260 700 226 Q 840 206 960 234 L960 420 L0 420 Z" fill="#4a3576" opacity="0.5" />
          <path d="M0 258 Q 220 234 420 254 Q 640 276 820 248 Q 900 240 960 248 L960 420 L0 420 Z" fill="#3f2c64" opacity="0.6" />

          {/* distant hills */}
          <path d="M0 300 Q 150 268 330 290 Q 520 314 700 288 Q 830 270 960 292 L960 420 L0 420 Z" fill="#46306e" />
          <path d="M0 318 Q 180 292 360 310 Q 560 330 760 306 Q 860 300 960 310 L960 420 L0 420 Z" fill="#332553" />

          {/* distant silhouette trees along the ridge */}
          <g className="intro-trees-far">
            {FAR_TREES.map((tree) => <use key={tree.x} href="#introFarTree" x={tree.x} y={tree.y} />)}
          </g>

          {/* distant ancient palace on the hill */}
          <g className="intro-palace" fill="#2b1f49">
            {/* plinth */}
            <path d="M58 298 L 302 298 L 300 306 L 60 306 Z" />
            {/* main wall */}
            <rect x="68" y="282" width="224" height="16" />
            {/* battlements */}
            <g fill="#2b1f49">
              <rect x="70" y="276" width="10" height="6" />
              <rect x="94" y="276" width="10" height="6" />
              <rect x="118" y="276" width="10" height="6" />
              <rect x="142" y="276" width="10" height="6" />
              <rect x="208" y="276" width="10" height="6" />
              <rect x="232" y="276" width="10" height="6" />
              <rect x="256" y="276" width="10" height="6" />
              <rect x="280" y="276" width="10" height="6" />
            </g>
            {/* central tower + onion dome */}
            <path d="M168 282 L 168 252 L 192 252 L 192 282 Z" />
            <path d="M168 252 C168 226 192 226 192 252 Z" />
            <path d="M180 232 L 180 218" stroke="#2b1f49" strokeWidth="2.5" />
            <circle cx="180" cy="216" r="3" fill="#2b1f49" />
            {/* golden finial + pennant */}
            <circle cx="180" cy="212" r="1.6" fill="#e7c984" />
            <path d="M181 213 L 195 209 L 181 217 Z" fill="#e7c984" />
            {/* left chhatri */}
            <path d="M112 282 L 112 264 L 130 264 L 130 282 Z" />
            <path d="M108 264 C108 250 134 250 134 264 Z" />
            <path d="M121 255 L 121 246" stroke="#2b1f49" strokeWidth="2" />
            <circle cx="121" cy="245" r="2.5" fill="#2b1f49" />
            <path d="M122 241 L 132 238 L 122 246 Z" fill="#e7c984" />
            {/* right chhatri */}
            <path d="M232 282 L 232 264 L 250 264 L 250 282 Z" />
            <path d="M228 264 C228 250 254 250 254 264 Z" />
            <path d="M241 255 L 241 246" stroke="#2b1f49" strokeWidth="2" />
            <circle cx="241" cy="245" r="2.5" fill="#2b1f49" />
            <path d="M242 241 L 252 238 L 242 246 Z" fill="#e7c984" />
            {/* end towers */}
            <path d="M74 282 L 74 258 L 84 258 L 84 282 Z" />
            <path d="M71 258 C71 246 87 246 87 258 Z" />
            <path d="M286 282 L 286 258 L 296 258 L 296 282 Z" />
            <path d="M283 258 C283 246 299 246 299 258 Z" />
            {/* arched gate with warm light spill */}
            <path d="M172 298 L 172 284 Q 180 276 188 284 L 188 298 Z" fill="#160f30" />
            <ellipse cx="180" cy="295" rx="8" ry="4" fill="#f3c368" opacity="0.35" />
            {/* warm lit windows */}
            <g fill="#f3c368" opacity="0.8">
              <rect x="178" y="287" width="4" height="5" rx="1" />
              <rect x="128" y="270" width="3" height="4" rx="1" />
              <rect x="238" y="270" width="3" height="4" rx="1" />
              <rect x="75" y="266" width="3" height="4" rx="1" />
              <rect x="288" y="266" width="3" height="4" rx="1" />
            </g>
          </g>

          {/* mid ground */}
          <path d="M0 340 Q 140 320 280 336 Q 460 356 620 334 Q 800 316 960 340 L960 420 L0 420 Z" fill="url(#introGround)" />

          {/* path Vikram walks on */}
          <path d="M 240 420 C 270 392 292 366 310 344 C 324 328 336 320 352 322 C 336 344 320 380 312 420 Z" fill="#4a8a68" />
          <path d="M 246 420 C 274 394 296 368 314 346 C 326 332 334 324 344 325" stroke="#7fae78" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 252 420 C 278 395 298 371 315 350" stroke="#8fc493" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.8" />
          {/* grass tufts */}
          <g stroke="#7fae78" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.55">
            <path d="M170 392 l3 -8 M173 392 l0 -9 M176 392 l-3 -7" />
            <path d="M470 408 l3 -8 M473 408 l0 -9 M476 408 l-3 -7" />
            <path d="M580 398 l3 -8 M583 398 l0 -9 M586 398 l-3 -7" />
            <path d="M740 386 l3 -8 M743 386 l0 -9 M746 386 l-3 -7" />
            <path d="M90 408 l3 -7 M93 408 l0 -8 M96 408 l-3 -6" />
            <path d="M640 412 l3 -7 M643 412 l0 -8 M646 412 l-3 -6" />
            <path d="M820 396 l3 -7 M823 396 l0 -8 M826 396 l-3 -6" />
          </g>
          {/* meadow flowers */}
          <g fill="#f3c368" opacity="0.85">
            <circle cx="150" cy="402" r="1.6" />
            <circle cx="520" cy="410" r="1.8" />
            <circle cx="700" cy="404" r="1.5" />
            <circle cx="820" cy="398" r="1.6" />
            <circle cx="560" cy="392" r="1.4" />
          </g>
          <g fill="#e7c984" opacity="0.8">
            <circle cx="620" cy="412" r="1.4" />
            <circle cx="780" cy="410" r="1.5" />
            <circle cx="260" cy="414" r="1.5" />
          </g>

          {/* frame trees */}
          <g className="intro-tree left" style={{ transformBox: 'fill-box', transformOrigin: 'bottom center' }}>
            <path d="M70 340 C68 306 66 280 64 258 C64 246 66 236 70 228 C74 236 76 246 76 258 C74 280 72 306 70 340 Z" fill="#4a3020" />
            <path d="M68 270 C58 258 50 250 44 244" stroke="#4a3020" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M72 262 C80 252 86 246 92 242" stroke="#4a3020" strokeWidth="5" fill="none" strokeLinecap="round" />
            <circle cx="70" cy="228" r="38" fill="#1f4a36" />
            <circle cx="44" cy="242" r="24" fill="#24533e" />
            <circle cx="96" cy="242" r="24" fill="#24533e" />
            <circle cx="60" cy="210" r="20" fill="#2f6b4f" />
            <circle cx="84" cy="216" r="16" fill="#3a7a5a" opacity="0.9" />
          </g>
          <g className="intro-tree right" style={{ transformBox: 'fill-box', transformOrigin: 'bottom center' }}>
            <path d="M896 340 C894 306 892 280 890 258 C890 246 892 236 896 228 C900 236 902 246 902 258 C900 280 898 306 896 340 Z" fill="#4a3020" />
            <path d="M894 270 C884 258 876 250 870 244" stroke="#4a3020" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M898 262 C906 252 912 246 918 242" stroke="#4a3020" strokeWidth="5" fill="none" strokeLinecap="round" />
            <circle cx="896" cy="228" r="40" fill="#1f4a36" />
            <circle cx="870" cy="242" r="25" fill="#24533e" />
            <circle cx="922" cy="242" r="25" fill="#24533e" />
            <circle cx="886" cy="210" r="21" fill="#2f6b4f" />
            <circle cx="910" cy="216" r="17" fill="#3a7a5a" opacity="0.9" />
          </g>

          {/* ===== King Vikramaditya — full body ===== */}
          <g className="intro-vikram">
            {/* grounding shadow */}
            <ellipse cx="350" cy="405" rx="34" ry="6.5" fill="#12301f" opacity="0.45" />
            <g transform="translate(350 400)">
              <g className="intro-vikram-inner">
                {/* ornate staff */}
                <g transform="translate(-35 0)">
                  <path d="M 0 -120 L 0 -6" stroke="#5a3a28" strokeWidth="3.2" strokeLinecap="round" />
                  <path d="M 1.4 -116 L 1.4 -12" stroke="#d9a441" strokeWidth="1" opacity="0.45" strokeLinecap="round" />
                  <rect x="-2" y="-96" width="4" height="4" rx="2" fill="#D9A441" />
                  <rect x="-2" y="-78" width="4" height="4" rx="2" fill="#D9A441" />
                  <rect x="-2" y="-60" width="4" height="4" rx="2" fill="#D9A441" />
                  <path d="M 0 -124 L -5 -129 L 0 -134 L 5 -129 Z" fill="#D9A441" />
                  <circle cx="0" cy="-135.5" r="2.2" fill="#C2572E" />
                  <path d="M -1.6 -122 L -8 -125 L -5 -117 Z" fill="#D9A441" opacity="0.9" />
                  <path d="M 1.6 -122 L 8 -125 L 5 -117 Z" fill="#D9A441" opacity="0.9" />
                </g>

                {/* dhoti — left & right legs */}
                <path d="M -13 -58 C -13.5 -46 -13 -32 -12 -20 C -11 -13 -10 -11 -8 -10 L -2 -10 C -3 -15 -3 -24 -4 -34 C -6 -44 -9 -51 -13 -58 Z" fill="#f2ead8" />
                <path d="M 13 -58 C 13.5 -46 13 -32 12 -20 C 11 -13 10 -11 8 -10 L 2 -10 C 3 -15 3 -24 4 -34 C 6 -44 9 -51 13 -58 Z" fill="#e9dcc0" />
                <path d="M -2.5 -56 C -3 -46 -3.5 -38 -3 -30 L 3 -30 C 3.5 -38 3 -46 2.5 -56 Z" fill="#f7f0df" />
                <path d="M -1.4 -50 L -1.2 -38 M 1.2 -50 L 1 -38" stroke="#d8c9a4" strokeWidth="0.6" fill="none" opacity="0.7" />
                <path d="M -9 -50 C -9.5 -42 -10 -34 -10 -26" stroke="#d8c9a4" strokeWidth="0.7" fill="none" opacity="0.6" />
                <path d="M 9 -50 C 9.5 -42 10 -34 10 -26" stroke="#d8c9a4" strokeWidth="0.7" fill="none" opacity="0.6" />

                {/* feet — traditional pointed shoes */}
                <path d="M -8 -9 C -12.5 -7 -14.5 -3.5 -13.5 0.5 C -11.5 -0.3 -8.8 -1.5 -7.6 -3 C -8.2 -5 -8 -7 -8 -9 Z" fill="#3d2718" />
                <path d="M -13.4 0.4 L -11.6 1.1 L -12.1 -0.5 Z" fill="#e7c984" />
                <path d="M 8 -9 C 12.5 -7 14.5 -3.5 13.5 0.5 C 11.5 -0.3 8.8 -1.5 7.6 -3 C 8.2 -5 8 -7 8 -9 Z" fill="#2b1a10" />
                <path d="M 13.4 0.4 L 11.6 1.1 L 12.1 -0.5 Z" fill="#e7c984" />

                {/* royal kurta (robe) */}
                <path d="M -15 -58 C -17 -70 -21 -86 -25 -100 C -21 -103 -17 -105 -12 -105 L 12 -105 C 17 -105 21 -103 25 -100 C 21 -86 17 -70 15 -58 Z" fill="url(#robeGrad)" stroke="#4a1512" strokeWidth="1" />
                <path d="M 15 -58 C 17 -70 21 -86 25 -100 C 23 -103 21 -104.5 19 -105 C 17 -92 15 -74 13 -58 Z" fill="#401009" opacity="0.35" />
                <path d="M -18.5 -62 L -21 -94 M 18.5 -62 L 21 -94" stroke="#3a100d" strokeWidth="1" fill="none" opacity="0.5" />
                {/* chest opening */}
                <path d="M -8 -104 L 0 -88 L 8 -104 Z" fill="url(#skinGrad)" />
                <path d="M -6 -104 L 0 -91.5 L 6 -104 Z" fill="#c08a5e" opacity="0.3" />
                {/* collar + hem trims */}
                <path d="M -10 -104.5 L 0 -86 L 10 -104.5" stroke="#e7c984" strokeWidth="1.8" fill="none" />
                <path d="M -7.5 -104.5 L 0 -89.5 L 7.5 -104.5" stroke="#d9a441" strokeWidth="0.9" fill="none" opacity="0.8" />
                <path d="M -15 -58 C -8 -61 8 -61 15 -58 L 14 -55 C 7 -58 -7 -58 -14 -55 Z" fill="#d9a441" opacity="0.85" />
                {/* necklace */}
                <path d="M -8 -96 Q 0 -90 8 -96" stroke="#e7c984" strokeWidth="2" fill="none" />
                <path d="M -6 -94 Q 0 -88.6 6 -94" stroke="#d9a441" strokeWidth="0.9" fill="none" />
                <path d="M 0 -95 L 0 -93" stroke="#d9a441" strokeWidth="0.8" />
                <circle cx="0" cy="-92.5" r="1.4" fill="#C2572E" />

                {/* gold angavastra sash across chest */}
                <path d="M -21 -104 C -15 -96 -10 -88 -6 -80 C -4 -75 -3 -72 -2 -69" stroke="#d9a441" strokeWidth="9" fill="none" opacity="0.9" strokeLinecap="round" />
                <path d="M -15 -92 C -10 -85 -6 -78 -3 -71" stroke="#b8862f" strokeWidth="1.3" fill="none" opacity="0.55" />

                {/* waist sash + knot + tassels */}
                <path d="M -15 -76 C -8 -80 8 -80 15 -76 L 15 -70 C 8 -74 -8 -74 -15 -70 Z" fill="#7a1f15" />
                <path d="M -15 -76 C -8 -80 8 -80 15 -76" stroke="#e7c984" strokeWidth="1.2" fill="none" />
                <path d="M 4 -73 C 6 -76.5 9 -76 10 -72.5 C 9 -69.5 6 -69.8 4 -73 Z" fill="#a3352a" />
                <path d="M 6 -72 L 5 -57" stroke="#C2572E" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M 8.5 -72 L 9.5 -59" stroke="#C2572E" strokeWidth="1.8" strokeLinecap="round" />
                <rect x="3.6" y="-57.5" width="3" height="3.4" rx="1.5" fill="#e7c984" />
                <rect x="8" y="-59.5" width="3" height="3.4" rx="1.5" fill="#e7c984" />
                <rect x="-5" y="-81" width="10" height="4.5" rx="2" fill="#e7c984" stroke="#b8862f" strokeWidth="0.6" />

                {/* left arm (staff side) */}
                <path d="M -21 -104 C -26 -98 -30 -92 -32 -86 C -29 -84 -25 -86 -20 -96 Z" fill="#7a2a20" />
                <path d="M -32.5 -95 L -27 -96.5 L -26.3 -93 L -31.8 -91.5 Z" fill="#e7c984" opacity="0.9" />
                <path d="M -31 -87 C -33 -80 -33 -73 -33 -67 C -31 -65 -29 -67 -29 -72 C -29 -78 -30 -83 -30 -87 Z" fill="#7a2a20" />
                <rect x="-34.5" y="-69.5" width="6" height="3" rx="1.5" fill="#e7c984" transform="rotate(-8 -31.5 -68)" />
                {/* left hand gripping staff */}
                <path d="M -37 -63.5 C -39 -61 -38.5 -57.5 -35.5 -56.8 C -33 -57.4 -31.8 -59.5 -32.5 -62.5 C -33.2 -65 -35.5 -65.5 -37 -63.5 Z" fill="url(#skinGrad)" stroke="#c08a5e" strokeWidth="0.6" />
                <path d="M -33.5 -62 C -33.8 -60.4 -34.8 -59.2 -36 -59.4 M -32.6 -60.5 C -32.7 -59 -33.5 -58 -34.6 -58.2 M -31.9 -58.8 C -31.8 -57.5 -32.5 -56.7 -33.5 -56.9" stroke="#c08a5e" strokeWidth="0.9" fill="none" strokeLinecap="round" />

                {/* right arm */}
                <path d="M 21 -104 C 26 -99 30 -93 32 -87 C 29 -85 25 -87 20 -97 Z" fill="#8e2f25" />
                <path d="M 27 -96 L 32.5 -94.5 L 31.8 -91 L 26.3 -92.5 Z" fill="#e7c984" opacity="0.9" />
                <path d="M 31 -88 C 33 -81 33 -74 32 -68 C 30 -66 28 -68 28 -73 C 28 -79 29 -84 30 -88 Z" fill="#8e2f25" />
                <rect x="29" y="-71" width="6" height="3" rx="1.5" fill="#e7c984" transform="rotate(8 32 -69.5)" />
                {/* right hand — relaxed fingers */}
                <path d="M 26.5 -68 C 30 -70.5 34 -68.5 34 -65 C 34 -61.5 31 -60 29 -61 C 26.5 -62 26 -66 26.5 -68 Z" fill="url(#skinGrad)" stroke="#c08a5e" strokeWidth="0.6" />
                <path d="M 33.6 -66.6 C 35 -68.6 36.4 -66.8 35.2 -65.2 C 34.6 -64.6 33.5 -65.4 33.6 -66.6 Z" fill="url(#skinGrad)" stroke="#c08a5e" strokeWidth="0.5" />
                <path d="M 29.2 -60.6 C 29 -58.8 29.9 -57.7 30.8 -58 M 30.9 -61 C 30.9 -59.3 31.7 -58.4 32.6 -58.8 M 32.7 -62.3 C 33.1 -60.9 34 -60.2 34.8 -60.9" stroke="#c08a5e" strokeWidth="0.9" fill="none" strokeLinecap="round" />

                {/* neck */}
                <rect x="-5" y="-117" width="10" height="12" fill="url(#skinGrad)" />
                <path d="M -5 -111 C -5 -107 5 -107 5 -111 L 5 -105 L -5 -105 Z" fill="#c08a5e" opacity="0.35" />
                <path d="M -6 -105 L 6 -105" stroke="#e7c984" strokeWidth="1.5" />

                {/* head */}
                <ellipse cx="0" cy="-132" rx="15" ry="17" fill="url(#skinGrad)" />
                <path d="M 6 -132 C 8 -126 9 -119 7 -112 C 11 -121 12 -129 11 -135 C 9 -132 7 -132 6 -132 Z" fill="#c08a5e" opacity="0.22" />
                {/* short hair — fringe hugging the skull, tilak clear at center */}
                <path d="M -15 -131 C -14.8 -134 -14.4 -137 -13.4 -140 C -12.2 -143.6 -10 -146.6 -7 -148.6 C -4.4 -150.2 -2 -151 -0.4 -149.8 C -0.9 -147.6 -2.4 -145.8 -4.4 -145.1 C -6.4 -144.4 -8 -142.8 -9.4 -141.2 C -10.8 -139.6 -12.2 -139 -13.4 -137.8 C -14.4 -136.8 -14.8 -134 -15 -131 Z" fill="#3d2718" />
                <path d="M 15 -131 C 14.8 -134 14.4 -137 13.4 -140 C 12.2 -143.6 10 -146.6 7 -148.6 C 4.4 -150.2 2 -151 0.4 -149.8 C 0.9 -147.6 2.4 -145.8 4.4 -145.1 C 6.4 -144.4 8 -142.8 9.4 -141.2 C 10.8 -139.6 12.2 -139 13.4 -137.8 C 14.4 -136.8 14.8 -134 15 -131 Z" fill="#3d2718" />
                <path d="M -3 -147 C -5.5 -145.8 -7.8 -144.4 -9.8 -142.6" stroke="#6b4a2f" strokeWidth="0.7" fill="none" opacity="0.4" />
                <path d="M 3 -147 C 5.5 -145.8 7.8 -144.4 9.8 -142.6" stroke="#6b4a2f" strokeWidth="0.7" fill="none" opacity="0.4" />
                {/* ears + earrings */}
                <path d="M -14 -130 C -17 -130 -18 -133 -17 -135 C -15.5 -134 -14.6 -132 -14.3 -129 Z" fill="url(#skinGrad)" />
                <path d="M 14 -130 C 17 -130 18 -133 17 -135 C 15.5 -134 14.6 -132 14.3 -129 Z" fill="url(#skinGrad)" />
                <circle cx="-16.5" cy="-131.5" r="1.5" fill="#e7c984" />
                <circle cx="16.5" cy="-131.5" r="1.5" fill="#e7c984" />
                {/* eyes */}
                <g>
                  <ellipse cx="-5.2" cy="-134.2" rx="3.1" ry="2.1" fill="#fff" />
                  <circle cx="-5.3" cy="-134.2" r="1.7" fill="#5b3a24" />
                  <circle cx="-5.3" cy="-134.2" r="0.9" fill="#1f120a" />
                  <circle cx="-4.9" cy="-134.7" r="0.45" fill="#fff" />
                  <path d="M -8.6 -136 Q -5.2 -137.5 -1.8 -136" stroke="#4a2f1f" strokeWidth="1.1" fill="none" />
                  <path d="M -8 -132.6 Q -5.2 -131.8 -2.4 -132.4" stroke="#4a2f1f" strokeWidth="0.7" fill="none" opacity="0.6" />
                  <ellipse cx="5.2" cy="-134.2" rx="3.1" ry="2.1" fill="#fff" />
                  <circle cx="5.1" cy="-134.2" r="1.7" fill="#5b3a24" />
                  <circle cx="5.1" cy="-134.2" r="0.9" fill="#1f120a" />
                  <circle cx="5.5" cy="-134.7" r="0.45" fill="#fff" />
                  <path d="M 1.8 -136 Q 5.2 -137.5 8.6 -136" stroke="#4a2f1f" strokeWidth="1.1" fill="none" />
                  <path d="M 2.4 -132.4 Q 5.2 -131.8 8 -132.6" stroke="#4a2f1f" strokeWidth="0.7" fill="none" opacity="0.6" />
                </g>
                {/* brows */}
                <path d="M -9.6 -138 Q -5.2 -140.4 -1 -138.2" stroke="#3a2414" strokeWidth="1.7" strokeLinecap="round" fill="none" />
                <path d="M 1 -138.2 Q 5.2 -140.4 9.6 -138" stroke="#3a2414" strokeWidth="1.7" strokeLinecap="round" fill="none" />
                {/* nose */}
                <path d="M -0.3 -131.5 C -1.8 -128 -1.6 -123.5 -0.1 -120.8 L 0.7 -120.8 C -0.5 -123.2 -0.4 -127 0.8 -131.5" stroke="#c08a5e" strokeWidth="1.1" fill="none" strokeLinecap="round" />
                <path d="M -2 -119.8 C -0.6 -118.8 0.6 -118.8 2 -119.8" stroke="#c08a5e" strokeWidth="0.7" fill="none" opacity="0.6" />
                {/* mustache — sits above the upper lip, wings sweeping up with twirled tips */}
                <path d="M -11.8 -121.2 C -11.2 -119.4 -10 -117.7 -8 -116.3 C -5.5 -115.1 -3 -114.4 0 -114.4 C 3 -114.4 5.5 -115.1 8 -116.3 C 10 -117.7 11.2 -119.4 11.8 -121.2" fill="none" stroke="#3d2718" strokeWidth="3.2" strokeLinecap="round" />
                <path d="M 0 -113.8 L 0 -114.9" stroke="#3d2718" strokeWidth="0.8" strokeLinecap="round" />
                {/* mouth */}
                <path d="M -3.2 -108 Q 0 -105.8 3.2 -108" stroke="#8a4a34" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                {/* beard */}
                <path d="M -13.5 -121 C -14.5 -115 -13 -110 -10.5 -107 C -7 -102.5 -3.5 -101 0 -101 C 3.5 -101 7 -102.5 10.5 -107 C 13 -110 14.5 -115 13.5 -121 C 10.6 -113 6 -109 0 -105.5 C -6 -109 -10.6 -113 -13.5 -121 Z" fill="#3d2718" />
                <path d="M -10.5 -112 C -11.5 -108 -12 -104 -11.5 -99" stroke="#6b4a2f" strokeWidth="0.8" fill="none" opacity="0.5" />
                <path d="M 10.5 -112 C 11.5 -108 12 -104 11.5 -99" stroke="#6b4a2f" strokeWidth="0.8" fill="none" opacity="0.5" />
                {/* tilak */}
                <path d="M -1.8 -141.8 L 0 -144.8 L 1.8 -141.8 Q 0 -142.6 -1.8 -141.8 Z" fill="#C2572E" />
                {/* crown + plumes */}
                <path d="M -12.5 -149 C -4.5 -152 4.5 -152 12.5 -149 L 12.5 -145 C 4.5 -148 -4.5 -148 -12.5 -145 Z" fill="url(#crownGold)" stroke="#a87a2a" strokeWidth="0.6" />
                <path d="M -11 -147.5 L -13 -161 L -7 -151.5 Z" fill="url(#crownGold)" />
                <path d="M -5 -149.5 L -6 -163.5 L -2 -153 Z" fill="url(#crownGold)" />
                <path d="M 5 -149.5 L 6 -163.5 L 2 -153 Z" fill="url(#crownGold)" />
                <path d="M 11 -147.5 L 13 -161 L 7 -151.5 Z" fill="url(#crownGold)" />
                <path d="M -3.2 -149.5 L 0 -172 L 3.2 -149.5 Z" fill="url(#crownGold)" />
                <circle cx="0" cy="-173.5" r="2.1" fill="#C2572E" />
                <circle cx="-13" cy="-161" r="0.9" fill="#f0d084" />
                <circle cx="13" cy="-161" r="0.9" fill="#f0d084" />
                <circle cx="-6" cy="-163.5" r="0.9" fill="#f0d084" />
                <circle cx="6" cy="-163.5" r="0.9" fill="#f0d084" />
                <circle cx="-6" cy="-147.5" r="1" fill="#C2572E" />
                <circle cx="6" cy="-147.5" r="1" fill="#C2572E" />
                <circle cx="0" cy="-149.5" r="1" fill="#C2572E" />
                <path d="M 0 -171 C -3 -177 -8 -181 -13.5 -181.5 C -9 -179.5 -4.5 -176 -1.8 -170 Z" fill="#f3ead7" opacity="0.95" />
                <path d="M 0 -171 C 3 -177 8 -181 13.5 -181.5 C 9 -179.5 4.5 -176 1.8 -170 Z" fill="#f3ead7" opacity="0.95" />
              </g>
            </g>
          </g>

          {/* ===== Betaal the spirit — riding Vikram's shoulders ===== */}
          <g className="intro-betaal">
            <g transform="translate(384 254) rotate(6)">
              <g className="intro-betaal-inner">
                {/* ethereal halo */}
                <circle cx="0" cy="0" r="42" fill="url(#betaalGlow)" />
                {/* ghost tail draping Vikram's back */}
                <path d="M -1 9 C -8 18 -12 30 -14 44 C -16 56 -15 66 -11 73 C -15 66 -17 56 -15 45 C -14 36 -10 25 -1 9 Z" fill="#f7eed9" opacity="0.78" />
                <path d="M -14 44 C -20 52 -26 56 -33 54 C -26 51 -21 46 -17 38 Z" fill="#f4e4c4" opacity="0.7" />
                {/* back hair */}
                <path d="M -10 -7 C -8 -14 -2 -18 5 -17 C -1 -14 -4 -9 -5 -3 Z" fill="#2a1b3a" opacity="0.88" />
                {/* torso draped on the shoulder */}
                <path d="M -2 11 C 1 17 2 26 0 34 C -2 41 -7 45 -12 46 C -8 42 -5 37 -4 30 C -3 23 -2 17 -2 11 Z" fill="#f7eed9" opacity="0.92" />
                {/* arm reaching to Vikram's shoulder */}
                <path d="M 2 11 C -4 18 -9 27 -12 35 C -13 38 -13 40 -12 41 C -10 40 -8 37 -6 33 C -2 25 0 18 2 11 Z" fill="#f7eed9" opacity="0.92" />
                <path d="M -15 36 C -17.5 37 -18.2 39.5 -16.8 41.5 C -15 42.8 -12.8 41 -12.6 39 C -12.6 37.2 -13.8 36 -15 36 Z" fill="#f7eed9" />
                <path d="M -15.2 39.2 C -14.8 40.6 -13.8 41.2 -13 40.8" stroke="#d9c49a" strokeWidth="0.6" fill="none" strokeLinecap="round" />
                <path d="M -16.6 39.6 C -16 41 -14.8 41.6 -13.8 41.2" stroke="#d9c49a" strokeWidth="0.6" fill="none" strokeLinecap="round" />
                {/* neck */}
                <path d="M -2.5 13 L 2.5 13 L 2.5 20 L -2.5 20 Z" fill="#f7eed9" opacity="0.95" />
                {/* head */}
                <ellipse cx="0" cy="0" rx="12.5" ry="14" fill="#f7eed9" opacity="0.95" />
                <path d="M 6 -4 C 9.5 -2 11.5 2 10.5 6.5 C 8.5 11 4 12.5 1.5 10.5 C 6.5 8.5 9 4 8 -1.5 C 7.5 -3 6.8 -3.5 6 -4 Z" fill="#e8d7ac" opacity="0.45" />
                {/* ears + earrings */}
                <path d="M -12 -1 C -14.5 -1 -15.2 -3.5 -14.2 -5.5 C -12.8 -4.5 -12.2 -2.8 -12.2 -1 Z" fill="#f7eed9" />
                <path d="M 12 -1 C 14.5 -1 15.2 -3.5 14.2 -5.5 C 12.8 -4.5 12.2 -2.8 12.2 -1 Z" fill="#f7eed9" />
                <circle cx="-14" cy="0.4" r="1.1" fill="#f3c368" />
                <circle cx="14" cy="0.4" r="1.1" fill="#f3c368" />
                {/* eyes */}
                <g>
                  <circle cx="-4.4" cy="-1.5" r="3.6" fill="#f3c368" opacity="0.28" />
                  <ellipse cx="-4.4" cy="-1.5" rx="3" ry="2.3" fill="#fff" opacity="0.97" />
                  <circle cx="-4.5" cy="-1.4" r="1.7" fill="#8a5a2b" />
                  <circle cx="-4.5" cy="-1.4" r="0.85" fill="#3a2414" />
                  <circle cx="-4.1" cy="-2" r="0.42" fill="#fff" />
                  <path d="M -7.6 -3.8 Q -4.4 -4.9 -1.2 -3.8" stroke="#3a2414" strokeWidth="0.9" fill="none" />
                  <circle cx="4.4" cy="-1.5" r="3.6" fill="#f3c368" opacity="0.28" />
                  <ellipse cx="4.4" cy="-1.5" rx="3" ry="2.3" fill="#fff" opacity="0.97" />
                  <circle cx="4.3" cy="-1.4" r="1.7" fill="#8a5a2b" />
                  <circle cx="4.3" cy="-1.4" r="0.85" fill="#3a2414" />
                  <circle cx="4.7" cy="-2" r="0.42" fill="#fff" />
                  <path d="M 1.2 -3.8 Q 4.4 -4.9 7.6 -3.8" stroke="#3a2414" strokeWidth="0.9" fill="none" />
                  {/* lashes */}
                  <path d="M -6.6 -3.2 L -8.2 -5 M -6 -3.8 L -7 -5.6" stroke="#2a1b3a" strokeWidth="0.6" strokeLinecap="round" fill="none" opacity="0.85" />
                  <path d="M 6.6 -3.2 L 8.2 -5 M 6 -3.8 L 7 -5.6" stroke="#2a1b3a" strokeWidth="0.6" strokeLinecap="round" fill="none" opacity="0.85" />
                </g>
                {/* brows */}
                <path d="M -7.6 -5.6 Q -4.4 -7.2 -1.2 -5.4" stroke="#2a1b3a" strokeWidth="1" strokeLinecap="round" fill="none" />
                <path d="M 1.2 -5.4 Q 4.4 -7.2 7.6 -5.6" stroke="#2a1b3a" strokeWidth="1" strokeLinecap="round" fill="none" />
                {/* nose */}
                <path d="M -0.4 -4.5 C -1.1 -2.4 -0.9 -0.6 0.1 1 L 0.9 1 C 0 -0.5 -0.3 -2.4 0.4 -4.5" stroke="#d9b98a" strokeWidth="0.9" fill="none" strokeLinecap="round" />
                {/* happy smile */}
                <path d="M -4.6 3.6 Q 0 8 4.6 3.6 Z" fill="#8a4538" />
                <path d="M -4.6 3.6 Q 0 8 4.6 3.6" stroke="#b56a52" strokeWidth="1.3" fill="none" strokeLinecap="round" />
                <path d="M -2.2 5.4 Q 0 6.6 2.2 5.4" stroke="#c0664a" strokeWidth="0.8" fill="none" strokeLinecap="round" />
                {/* blush */}
                <ellipse cx="-6.8" cy="2.6" rx="2.4" ry="1.3" fill="#E88B6A" opacity="0.5" />
                <ellipse cx="6.8" cy="2.6" rx="2.4" ry="1.3" fill="#E88B6A" opacity="0.5" />
                {/* warm face shading + chin definition */}
                <path d="M -9.5 -3 C -11 2 -10 7 -7.5 9.5" stroke="#d9b98a" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round" />
                <path d="M 9.5 -3 C 11 2 10 7 7.5 9.5" stroke="#d9b98a" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round" />
                <path d="M -4.5 9.5 C -2 11.5 2 11.5 4.5 9.5" stroke="#c9a26f" strokeWidth="1" fill="none" opacity="0.55" />
                {/* lower-lip shadow */}
                <path d="M -2.4 6.6 Q 0 7.6 2.4 6.6" stroke="#a06a52" strokeWidth="0.8" fill="none" opacity="0.6" />
                {/* nose bridge highlight */}
                <path d="M -0.4 -4.2 C -0.2 -2.6 0 -1.4 0.1 -0.4" stroke="#fbf3dc" strokeWidth="0.6" fill="none" opacity="0.5" strokeLinecap="round" />
                {/* flowing hair — layered, streaming right */}
                <g fill="#241631" opacity="0.95">
                  {/* crown of hair above the circlet */}
                  <path d="M -11 -5 C -11 -12 -6 -15 0 -15 C 6 -15 11 -12 12 -8 C 10 -10 6 -11.5 0 -11.5 C -5 -11.5 -9 -10 -11 -5 Z" />
                  {/* deepest back sweep */}
                  <path d="M -5 -11 C 4 -16 16 -16 27 -11 C 37 -6 44 1 47 9 C 41 4 34 0 25 -3 C 15 -6 5 -7 -5 -5 Z" />
                  <path d="M 4 -8 C 16 -11 28 -8 38 -2 C 46 3 52 9 54 16 C 48 11 40 7 30 4 C 20 1 10 -1 4 -3 Z" />
                </g>
                <g fill="#2a1b3a" opacity="0.9">
                  <path d="M -6 -12 C 8 -17 22 -15 33 -8 C 42 -2 48 5 49 12 C 43 6 36 2 27 -1 C 18 -4 7 -6 -6 -5 Z" />
                  <path d="M 6 -5 C 16 -7 26 -3 34 3 C 40 8 44 14 45 20 C 40 14 33 9 25 6 C 16 2 8 0 6 1 Z" />
                  <path d="M 9 3 C 17 1 25 5 32 10 C 37 14 40 19 40 25 C 36 20 31 15 24 12 C 16 9 10 6 9 6 Z" />
                  {/* side wisp framing the left cheek */}
                  <path d="M -10 -4 C -11.5 0 -12 4 -11.5 8" stroke="#2a1b3a" strokeWidth="1.6" fill="none" opacity="0.85" strokeLinecap="round" />
                </g>
                <g fill="#3a2b55" opacity="0.8">
                  <path d="M 6 -10 C 16 -12 27 -8 35 -2 C 41 3 45 9 45 15 C 40 11 34 7 27 4 C 18 0 9 -2 6 -4 Z" />
                  <path d="M 9 -2 C 17 -4 25 0 31 5 C 36 9 39 14 39 19 C 35 14 30 10 24 7 C 16 3 10 1 9 0 Z" />
                </g>
                {/* golden hair highlights */}
                <g stroke="#5a4a86" strokeWidth="1.1" fill="none" opacity="0.7" strokeLinecap="round">
                  <path d="M -3 -13 C 8 -16 20 -12 30 -6 C 38 0 43 6 44 12" />
                  <path d="M 5 -7 C 15 -9 25 -5 32 1 C 38 6 42 11 43 17" />
                  <path d="M 8 0 C 15 -2 22 1 27 5 C 31 9 34 13 35 18" />
                </g>
                {/* soft light wisps at the tips */}
                <g fill="none" stroke="#7d6aa8" strokeWidth="0.8" opacity="0.5" strokeLinecap="round">
                  <path d="M 45 12 C 48 15 50 19 50 23" />
                  <path d="M 39 19 C 42 23 43 27 42 31" />
                </g>
                {/* circlet + crescent */}
                <path d="M -10.5 -9 Q 0 -12 10.5 -9" fill="none" stroke="url(#crownGold)" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M 8.5 -11.5 C 11.5 -13 13 -10.8 11 -8.3 C 12.5 -10 13 -12 10.5 -13.3 Z" fill="#f3c368" opacity="0.95" />
                {/* luminous bindi */}
                <circle cx="0" cy="-7.6" r="3" fill="#f3c368" opacity="0.25" />
                <circle cx="0" cy="-7.6" r="1.5" fill="#f3c368" opacity="0.95" />
              </g>
            </g>
          </g>

          {/* magical particles around Betaal */}
          <g className="intro-magic" fill="#f3c368">
            <circle cx="410" cy="300" r="2" style={{ animationDelay: '0s' }} />
            <circle cx="336" cy="312" r="1.6" style={{ animationDelay: '0.6s' }} />
            <circle cx="386" cy="342" r="1.8" style={{ animationDelay: '1.2s' }} />
            <circle cx="362" cy="266" r="1.4" style={{ animationDelay: '1.8s' }} />
          </g>

          {/* birds */}
          <g className="intro-birds" stroke="#2b1f49" strokeWidth="2.4" strokeLinecap="round" fill="none">
            <path className="intro-bird" d="M0 0 Q 5 -7 10 0" style={{ animationDelay: '0s' }} />
            <path className="intro-bird" d="M0 0 Q 5 -7 10 0" style={{ animationDelay: '4.2s' }} />
            <path className="intro-bird" d="M0 0 Q 5 -7 10 0" style={{ animationDelay: '7.8s' }} />
          </g>

          {/* falling leaves + twinkling sparkles */}
          {LEAVES.map((leaf) => <Leaf key={leaf.x} leaf={leaf} />)}
          {SPARKLES.map((sparkle) => <Sparkle key={sparkle.x} sparkle={sparkle} />)}

          {/* cinematic vignette */}
          <rect width="960" height="420" fill="url(#vignetteGrad)" />
        </svg>

        {/* overlay: title, speech bubble, CTA */}
        <div className="intro-overlay">
          <h1 className="intro-title">
            <BetaalLogo size={34} />
            <span>PyBe</span>
            <span className="intro-title-dash">–</span>
            <span>Betaal Tales</span>
          </h1>

          <div className="intro-bubble" role="presentation">
            <p>Let’s learn Python in an interesting way through the tales of Panchatantra and Jataka.</p>
            <span className="intro-bubble-tag">— Betaal</span>
          </div>

          <div className="intro-cta">
            <button type="button" className="btn intro-begin" onClick={onDone}>
              Begin the Journey <Play size={18} aria-hidden="true" />
            </button>
            <button type="button" className="btn intro-skip" onClick={onDone}>
              Skip Intro
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

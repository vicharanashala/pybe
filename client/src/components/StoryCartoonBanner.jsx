import React from 'react';
import redHoodImg from '../assets/red_hood.jpg';
import tortoiseHareImg from '../assets/tortoise_hare.jpg';
import goldilocksImg from '../assets/goldilocks.jpg';
import criedWolfImg from '../assets/cried_wolf.jpg';
import threePigsImg from '../assets/three_pigs.jpg';
import hanselGretelImg from '../assets/hansel_gretel.jpg';
import jackBeanstalkImg from '../assets/jack_beanstalk.jpg';
import aladdinGenieImg from '../assets/aladdin_genie.jpg';
import cinderellaImg from '../assets/cinderella.jpg';
import piedPiperImg from '../assets/pied_piper.jpg';

const STORY_IMAGES = {
  red_hood: redHoodImg,
  tortoise_hare: tortoiseHareImg,
  goldilocks: goldilocksImg,
  cried_wolf: criedWolfImg,
  three_pigs: threePigsImg,
  hansel_gretel: hanselGretelImg,
  jack_beanstalk: jackBeanstalkImg,
  aladdin_genie: aladdinGenieImg,
  cinderella: cinderellaImg,
  pied_piper: piedPiperImg,
};

export function StoryCartoonBanner({ story, isThumbnail = false, mode = 'both' }) {
  const storyId = story.id;
  const imageSrc = STORY_IMAGES[storyId];

  const renderIllustration = () => {
    switch (storyId) {
      case 'red_hood':
        return (
          <svg className="scb-svg" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg_red" x1="0" y1="0" x2="600" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1e1b4b" />
                <stop offset="0.5" stopColor="#31103f" />
                <stop offset="1" stopColor="#450a0a" />
              </linearGradient>
              <linearGradient id="hood_grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
            </defs>
            <rect width="600" height="200" rx="16" fill="url(#bg_red)" />

            {/* Trees in background */}
            <path d="M40 200 L70 120 L100 200 Z" fill="#0f172a" opacity="0.6" />
            <path d="M75 200 L110 100 L145 200 Z" fill="#020617" opacity="0.8" />
            <path d="M480 200 L515 90 L550 200 Z" fill="#020617" opacity="0.8" />
            <path d="M520 200 L550 110 L580 200 Z" fill="#0f172a" opacity="0.6" />

            {/* Cottage */}
            <rect x="360" y="90" width="110" height="80" rx="6" fill="#78350f" />
            <path d="M345 95 L415 45 L485 95 Z" fill="#b45309" />
            <rect x="400" y="125" width="30" height="45" fill="#451a03" rx="3" />
            <rect x="375" y="110" width="20" height="20" fill="#fef08a" opacity="0.9" rx="2" />

            {/* Animated Pastry Basket (Floating Sparkles) */}
            <g className="scb-float">
              <path d="M120 145 C120 125 155 125 155 145 Z" fill="#d97706" />
              <rect x="110" y="145" width="55" height="25" rx="5" fill="#b45309" />
              <circle cx="125" cy="140" r="8" fill="#fef08a" />
              <circle cx="140" cy="138" r="7" fill="#fbcfe8" />
              <circle cx="150" cy="142" r="6" fill="#fef08a" />
            </g>

            {/* Red Riding Hood Character (Animated Walk) */}
            <g className="scb-bounce">
              {/* Cloak/Hood */}
              <path d="M185 100 Q205 75 225 100 L235 160 L175 160 Z" fill="url(#hood_grad)" />
              <circle cx="205" cy="95" r="16" fill="url(#hood_grad)" />
              {/* Face */}
              <circle cx="205" cy="98" r="10" fill="#fed7aa" />
              <circle cx="202" cy="96" r="1.5" fill="#1e293b" />
              <circle cx="208" cy="96" r="1.5" fill="#1e293b" />
              <path d="M203 102 Q205 105 207 102" stroke="#e11d48" strokeWidth="1.5" fill="none" />
            </g>

            {/* Wolf in Nightcap (Peek/Disguise in Cottage Window/Bed) */}
            <g className="scb-wiggle">
              <ellipse cx="450" cy="80" rx="22" ry="18" fill="#475569" />
              <path d="M435 68 L442 50 L452 65 Z" fill="#475569" />
              {/* Nightcap */}
              <path d="M440 68 Q465 40 480 75 Z" fill="#e0e7ff" />
              <circle cx="480" cy="75" r="5" fill="#a5b4fc" />
              {/* Glowing Wolf Eye */}
              <circle cx="442" cy="78" r="3" fill="#fbbf24" className="scb-pulse" />
              <circle cx="442" cy="78" r="1" fill="#000" />
            </g>

            {/* Exception Code Tag Floating Banner */}
            <g className="scb-float-slow">
              <rect x="210" y="25" width="190" height="34" rx="17" fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" strokeWidth="1.5" />
              <text x="305" y="46" textAnchor="middle" fill="#fca5a5" fontSize="13" fontWeight="bold" fontFamily="monospace">
                🚨 AttributeError!
              </text>
            </g>
          </svg>
        );

      case 'tortoise_hare':
        return (
          <svg className="scb-svg" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg_th" x1="0" y1="0" x2="600" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#064e3b" />
                <stop offset="0.5" stopColor="#022c22" />
                <stop offset="1" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            <rect width="600" height="200" rx="16" fill="url(#bg_th)" />

            {/* Race Track */}
            <path d="M0 160 Q300 140 600 160 L600 200 L0 200 Z" fill="#78350f" />
            <path d="M0 165 Q300 145 600 165" stroke="#fef08a" strokeWidth="3" strokeDasharray="12 8" />

            {/* Finish Line Banner */}
            <line x1="520" y1="90" x2="520" y2="165" stroke="#ffffff" strokeWidth="4" />
            <line x1="550" y1="90" x2="550" y2="165" stroke="#ffffff" strokeWidth="4" />
            <rect x="520" y="90" width="30" height="20" fill="#000000" />
            <rect x="520" y="90" width="15" height="10" fill="#ffffff" />
            <rect x="535" y="100" width="15" height="10" fill="#ffffff" />

            {/* Sleeping Tree */}
            <rect x="180" y="80" width="25" height="80" fill="#451a03" rx="4" />
            <circle cx="192" cy="70" r="45" fill="#15803d" />
            <circle cx="170" cy="60" r="35" fill="#166534" />
            <circle cx="215" cy="65" r="35" fill="#22c55e" />

            {/* Hare Sleeping under Tree (Zzz Floating) */}
            <g>
              {/* Hare body */}
              <ellipse cx="230" cy="150" rx="20" ry="12" fill="#e2e8f0" />
              <circle cx="245" cy="142" r="10" fill="#e2e8f0" />
              {/* Long ears down */}
              <ellipse cx="240" cy="154" rx="12" ry="4" fill="#cbd5e1" transform="rotate(20 240 154)" />
              {/* ZZZ animations */}
              <text x="255" y="130" fill="#fbbf24" fontSize="18" fontWeight="bold" className="scb-float">Z</text>
              <text x="270" y="115" fill="#fbbf24" fontSize="14" fontWeight="bold" className="scb-float-slow">z</text>
              <text x="282" y="102" fill="#fbbf24" fontSize="11" fontWeight="bold" className="scb-bounce">z</text>
            </g>

            {/* Speedy Tortoise with Sneakers Running Ahead */}
            <g className="scb-dash">
              {/* Shell */}
              <path d="M410 145 C410 120 450 120 450 145 Z" fill="#15803d" stroke="#4ade80" strokeWidth="2" />
              {/* Head */}
              <circle cx="460" cy="142" r="9" fill="#22c55e" />
              <circle cx="463" cy="140" r="1.5" fill="#000" />
              {/* Red Sneakers */}
              <rect x="420" y="145" width="12" height="7" rx="3" fill="#ef4444" />
              <rect x="442" y="145" width="12" height="7" rx="3" fill="#ef4444" />
              {/* Speed Lines */}
              <line x1="380" y1="135" x2="400" y2="135" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
              <line x1="370" y1="145" x2="395" y2="145" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Formula Warning Tag */}
            <g className="scb-float-slow">
              <rect x="180" y="20" width="240" height="34" rx="17" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="300" y="41" textAnchor="middle" fill="#fef08a" fontSize="13" fontWeight="bold" fontFamily="monospace">
                ⚠️ distance / 0 → ZeroDivisionError!
              </text>
            </g>
          </svg>
        );

      case 'goldilocks':
        return (
          <svg className="scb-svg" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg_gl" x1="0" y1="0" x2="600" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#451a03" />
                <stop offset="0.5" stopColor="#78350f" />
                <stop offset="1" stopColor="#1e1b4b" />
              </linearGradient>
            </defs>
            <rect width="600" height="200" rx="16" fill="url(#bg_gl)" />

            {/* Table */}
            <rect x="100" y="130" width="400" height="20" fill="#92400e" rx="4" />
            <rect x="140" y="150" width="20" height="50" fill="#78350f" />
            <rect x="440" y="150" width="20" height="50" fill="#78350f" />

            {/* Bowl 1: Big Papa Bear (Hot Flame) */}
            <g>
              <ellipse cx="180" cy="130" rx="28" ry="14" fill="#b45309" />
              <ellipse cx="180" cy="126" rx="24" ry="10" fill="#dc2626" />
              <text x="180" y="112" textAnchor="middle" fontSize="16" className="scb-bounce">🔥 Too Hot</text>
            </g>

            {/* Bowl 2: Mama Bear (Cold Ice) */}
            <g>
              <ellipse cx="300" cy="130" rx="22" ry="11" fill="#b45309" />
              <ellipse cx="300" cy="127" rx="19" ry="8" fill="#38bdf8" />
              <text x="300" y="112" textAnchor="middle" fontSize="16" className="scb-float">🧊 Too Cold</text>
            </g>

            {/* Bowl 3: Baby Bear (Just Right ✨) */}
            <g className="scb-pulse">
              <ellipse cx="410" cy="130" rx="18" ry="9" fill="#b45309" />
              <ellipse cx="410" cy="128" rx="15" ry="6" fill="#facc15" />
              <text x="410" y="112" textAnchor="middle" fontSize="16">✨ Just Right</text>
            </g>

            {/* Goldilocks Reaching for Bowl #5 (Out of Bounds Pointer) */}
            <g className="scb-wiggle">
              <text x="510" y="125" fill="#f87171" fontSize="24" fontWeight="bold">🥣 [#5] ?</text>
            </g>

            {/* Out of bounds Exception Banner */}
            <g className="scb-float-slow">
              <rect x="180" y="20" width="240" height="34" rx="17" fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" strokeWidth="1.5" />
              <text x="300" y="41" textAnchor="middle" fill="#fca5a5" fontSize="13" fontWeight="bold" fontFamily="monospace">
                🚨 bowls[5] → IndexError!
              </text>
            </g>
          </svg>
        );

      case 'cried_wolf':
        return (
          <svg className="scb-svg" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg_cw" x1="0" y1="0" x2="600" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0f172a" />
                <stop offset="0.5" stopColor="#1e1b4b" />
                <stop offset="1" stopColor="#31103f" />
              </linearGradient>
            </defs>
            <rect width="600" height="200" rx="16" fill="url(#bg_cw)" />

            {/* Hill */}
            <path d="M0 200 Q250 100 600 200 Z" fill="#14532d" />

            {/* Shepherd Boy with Horn */}
            <g className="scb-bounce">
              <circle cx="160" cy="110" r="14" fill="#fed7aa" />
              <path d="M145 124 Q160 115 175 124 L170 170 L150 170 Z" fill="#0284c7" />
              {/* Horn */}
              <path d="M168 112 L195 102 L200 115 Z" fill="#fbbf24" />
              {/* Alarm waves */}
              <path d="M205 100 Q215 108 205 116" stroke="#ef4444" strokeWidth="3" fill="none" className="scb-pulse" />
              <path d="M212 95 Q225 108 212 121" stroke="#ef4444" strokeWidth="3" fill="none" className="scb-pulse" />
            </g>

            {/* Sheep on hill */}
            <g className="scb-float">
              <ellipse cx="280" cy="155" rx="18" ry="12" fill="#ffffff" />
              <circle cx="266" cy="150" r="7" fill="#1e293b" />
              <ellipse cx="340" cy="165" rx="16" ry="11" fill="#ffffff" />
              <circle cx="328" cy="160" r="6" fill="#1e293b" />
            </g>

            {/* Wolf Shadow in distance */}
            <g className="scb-wiggle">
              <path d="M470 140 L495 110 L510 140 Z" fill="#020617" />
              <circle cx="488" cy="122" r="2.5" fill="#ef4444" className="scb-pulse" />
            </g>

            {/* Custom Exception Banner */}
            <g className="scb-float-slow">
              <rect x="160" y="20" width="280" height="34" rx="17" fill="rgba(168, 85, 247, 0.25)" stroke="#a855f7" strokeWidth="1.5" />
              <text x="300" y="41" textAnchor="middle" fill="#e9d5ff" fontSize="13" fontWeight="bold" fontFamily="monospace">
                📯 raise WolfAlarmError("REAL WOLF!")
              </text>
            </g>
          </svg>
        );

      case 'three_pigs':
        return (
          <svg className="scb-svg" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg_tp" x1="0" y1="0" x2="600" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#111827" />
                <stop offset="0.5" stopColor="#1f2937" />
                <stop offset="1" stopColor="#064e3b" />
              </linearGradient>
            </defs>
            <rect width="600" height="200" rx="16" fill="url(#bg_tp)" />

            {/* Straw House (Blown Down/Collapsing) */}
            <g className="scb-wiggle">
              <path d="M90 170 L110 120 L150 170 Z" fill="#fde047" opacity="0.6" stroke="#ca8a04" strokeDasharray="4 4" />
              <text x="120" y="110" textAnchor="middle" fill="#facc15" fontSize="13" fontWeight="bold">💨 Straw (Blown!)</text>
            </g>

            {/* Wooden Stick House */}
            <g className="scb-float">
              <rect x="240" y="125" width="50" height="45" fill="#b45309" />
              <path d="M230 125 L265 95 L300 125 Z" fill="#78350f" />
              <text x="265" y="85" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="bold">🪵 Wood</text>
            </g>

            {/* Brick House (Sturdy & Safe) */}
            <g className="scb-pulse">
              <rect x="400" y="110" width="80" height="60" fill="#991b1b" stroke="#f87171" strokeWidth="2" />
              <path d="M390 110 L440 75 L490 110 Z" fill="#7f1d1d" />
              {/* Chimney */}
              <rect x="460" y="70" width="14" height="25" fill="#450a0a" />
              <text x="440" y="65" textAnchor="middle" fill="#4ade80" fontSize="14" fontWeight="bold">🧱 Brick (Firm!)</text>
            </g>

            {/* Finally Shield Banner */}
            <g className="scb-float-slow">
              <rect x="170" y="18" width="260" height="34" rx="17" fill="rgba(52, 211, 153, 0.25)" stroke="#34d399" strokeWidth="1.5" />
              <text x="300" y="39" textAnchor="middle" fill="#a7f3d0" fontSize="13" fontWeight="bold" fontFamily="monospace">
                🔒 finally: lock_site() always runs!
              </text>
            </g>
          </svg>
        );

      case 'hansel_gretel':
        return (
          <svg className="scb-svg" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg_hg" x1="0" y1="0" x2="600" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#020617" />
                <stop offset="0.5" stopColor="#0f172a" />
                <stop offset="1" stopColor="#1e1b4b" />
              </linearGradient>
            </defs>
            <rect width="600" height="200" rx="16" fill="url(#bg_hg)" />

            {/* Forest Path */}
            <path d="M100 200 Q250 140 450 200 Z" fill="#334155" />

            {/* Birds Eating Breadcrumbs */}
            <g className="scb-bounce">
              {/* Bird 1 */}
              <path d="M180 140 Q190 130 200 140 Q190 145 180 140 Z" fill="#38bdf8" />
              <circle cx="202" cy="138" r="4" fill="#38bdf8" />
              {/* Bird 2 */}
              <path d="M240 130 Q250 120 260 130 Q250 135 240 130 Z" fill="#60a5fa" />
              <circle cx="262" cy="128" r="4" fill="#60a5fa" />
              <text x="210" y="115" fill="#f87171" fontSize="13" fontWeight="bold">🐦 Birds ate trail!</text>
            </g>

            {/* Emergency Compass */}
            <g className="scb-pulse">
              <circle cx="430" cy="130" r="30" fill="#0284c7" stroke="#38bdf8" strokeWidth="3" />
              <circle cx="430" cy="130" r="24" fill="#0f172a" />
              {/* Needle */}
              <polygon points="430,112 435,130 430,126 425,130" fill="#ef4444" />
              <polygon points="430,148 435,130 430,134 425,130" fill="#cbd5e1" />
              <text x="430" y="178" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold">🧭 Compass Backup</text>
            </g>

            {/* File Error Banner */}
            <g className="scb-float-slow">
              <rect x="150" y="20" width="300" height="34" rx="17" fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" strokeWidth="1.5" />
              <text x="300" y="41" textAnchor="middle" fill="#fca5a5" fontSize="13" fontWeight="bold" fontFamily="monospace">
                📂 FileNotFoundError: breadcrumbs.txt
              </text>
            </g>
          </svg>
        );

      case 'jack_beanstalk':
        return (
          <svg className="scb-svg" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg_jb" x1="0" y1="0" x2="600" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#064e3b" />
                <stop offset="0.5" stopColor="#047857" />
                <stop offset="1" stopColor="#0284c7" />
              </linearGradient>
            </defs>
            <rect width="600" height="200" rx="16" fill="url(#bg_jb)" />

            {/* Clouds */}
            <ellipse cx="200" cy="30" rx="60" ry="20" fill="#ffffff" opacity="0.8" />
            <ellipse cx="400" cy="40" rx="80" ry="25" fill="#ffffff" opacity="0.8" />

            {/* Massive Beanstalk Growing up */}
            <g className="scb-pulse">
              <path d="M280 200 Q320 120 290 0" stroke="#15803d" strokeWidth="24" fill="none" />
              <path d="M290 200 Q330 120 300 0" stroke="#22c55e" strokeWidth="14" fill="none" />
              {/* Leaves */}
              <ellipse cx="265" cy="140" rx="25" ry="12" fill="#4ade80" transform="rotate(-30 265 140)" />
              <ellipse cx="325" cy="100" rx="25" ry="12" fill="#4ade80" transform="rotate(30 325 100)" />
              <ellipse cx="270" cy="60" rx="25" ry="12" fill="#4ade80" transform="rotate(-25 270 60)" />
            </g>

            {/* Type Mismatch Warning */}
            <g className="scb-float">
              <rect x="70" y="90" width="160" height="60" rx="10" fill="#0f172a" stroke="#c084fc" strokeWidth="2" />
              <text x="150" y="115" textAnchor="middle" fill="#e9d5ff" fontSize="13" fontWeight="bold">beans = "5" (str)</text>
              <text x="150" y="138" textAnchor="middle" fill="#f472b6" fontSize="13" fontWeight="bold">+ 3 (int) → 🚨</text>
            </g>

            {/* TypeError Banner */}
            <g className="scb-float-slow">
              <rect x="180" y="20" width="240" height="34" rx="17" fill="rgba(192, 132, 252, 0.25)" stroke="#c084fc" strokeWidth="1.5" />
              <text x="300" y="41" textAnchor="middle" fill="#e9d5ff" fontSize="13" fontWeight="bold" fontFamily="monospace">
                🫘 TypeError: str + int invalid
              </text>
            </g>
          </svg>
        );

      case 'aladdin_genie':
        return (
          <svg className="scb-svg" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg_ag" x1="0" y1="0" x2="600" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#31103f" />
                <stop offset="0.5" stopColor="#581c87" />
                <stop offset="1" stopColor="#1e1b4b" />
              </linearGradient>
            </defs>
            <rect width="600" height="200" rx="16" fill="url(#bg_ag)" />

            {/* Golden Magic Lamp */}
            <g className="scb-wiggle">
              <path d="M120 160 C120 140 180 140 200 160 C180 175 140 175 120 160 Z" fill="#eab308" stroke="#fef08a" strokeWidth="2" />
              <path d="M195 152 Q230 140 240 135" stroke="#eab308" strokeWidth="6" strokeLinecap="round" />
              <path d="M125 155 Q100 150 105 135 Q115 125 130 145" stroke="#eab308" strokeWidth="5" fill="none" />
            </g>

            {/* Genie Smoke & Genie Avatar */}
            <g className="scb-pulse">
              <path d="M238 132 Q280 110 320 80 Q350 120 380 60" stroke="#c084fc" strokeWidth="18" opacity="0.6" strokeLinecap="round" fill="none" />
              <circle cx="380" cy="55" r="22" fill="#a855f7" />
              {/* Genie Eyes */}
              <circle cx="373" cy="52" r="3" fill="#ffffff" />
              <circle cx="387" cy="52" r="3" fill="#ffffff" />
              <circle cx="374" cy="52" r="1.5" fill="#000" />
              <circle cx="388" cy="52" r="1.5" fill="#000" />
              <path d="M374 62 Q380 68 386 62" stroke="#ffffff" strokeWidth="2" fill="none" />
            </g>

            {/* Wish Count Badge */}
            <g className="scb-bounce">
              <rect x="430" y="110" width="130" height="50" rx="10" fill="#0f172a" stroke="#eab308" strokeWidth="2" />
              <text x="495" y="132" textAnchor="middle" fill="#fef08a" fontSize="13" fontWeight="bold">Requested: 5 ✨</text>
              <text x="495" y="150" textAnchor="middle" fill="#f87171" fontSize="12" fontWeight="bold">Max Allowed: 3 🚫</text>
            </g>

            {/* Permission Error Banner */}
            <g className="scb-float-slow">
              <rect x="160" y="20" width="280" height="34" rx="17" fill="rgba(234, 179, 8, 0.25)" stroke="#eab308" strokeWidth="1.5" />
              <text x="300" y="41" textAnchor="middle" fill="#fef08a" fontSize="13" fontWeight="bold" fontFamily="monospace">
                🧞 PermissionError: Max 3 Wishes!
              </text>
            </g>
          </svg>
        );

      case 'cinderella':
        return null;

      case 'pied_piper':
        return null;

      default:
        return null;
    }
  };

  if (mode === 'imageOnly') {
    if (!imageSrc) return null;
    return (
      <div className="story-cartoon-image-card is-standalone-card">
        <img src={imageSrc} alt={`${story.title} Cartoon`} className="story-cartoon-img" />
      </div>
    );
  }

  if (mode === 'illustrationOnly') {
    return (
      <div className="story-cartoon-illustration-card">
        {renderIllustration()}
      </div>
    );
  }

  return (
    <div className={`story-cartoon-banner-wrapper ${isThumbnail ? 'is-thumbnail' : 'is-full'}`}>
      {imageSrc && (
        <div className="story-cartoon-image-card">
          <img src={imageSrc} alt={`${story.title} Cartoon`} className="story-cartoon-img" />
        </div>
      )}
      {renderIllustration()}
    </div>
  );
}

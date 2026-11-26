/**
 * The Sorting Investigation - SVG Illustrations & Icons
 * Polished, original, vector-based historical and educational illustrations.
 * Completely self-contained, no external image files or CDNs needed.
 */

const SVGIcons = {
  // Scene 1 & Hero: Scutari Barracks Hospital at dusk (Enhanced Victorian / Ottoman Architecture)
  scutariHospital: `
    <svg viewBox="0 0 800 420" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-label="Scutari Barracks Hospital during the Crimean War" role="img">
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="45%" stop-color="#1e293b"/>
          <stop offset="85%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#475569"/>
        </linearGradient>
        <linearGradient id="seaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#090d16"/>
          <stop offset="40%" stop-color="#172554"/>
          <stop offset="100%" stop-color="#1e3a8a"/>
        </linearGradient>
        <linearGradient id="wallStone" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#cbd5e1"/>
          <stop offset="25%" stop-color="#f1f5f9"/>
          <stop offset="70%" stop-color="#e2e8f0"/>
          <stop offset="100%" stop-color="#94a3b8"/>
        </linearGradient>
        <linearGradient id="wallShadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#94a3b8"/>
          <stop offset="100%" stop-color="#64748b"/>
        </linearGradient>
        <linearGradient id="terracottaRoof" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#b45309"/>
          <stop offset="40%" stop-color="#92400e"/>
          <stop offset="100%" stop-color="#78350f"/>
        </linearGradient>
        <radialGradient id="lampAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fef08a" stop-opacity="0.95"/>
          <stop offset="40%" stop-color="#f59e0b" stop-opacity="0.6"/>
          <stop offset="80%" stop-color="#d97706" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#b45309" stop-opacity="0"/>
        </radialGradient>
        <filter id="glowEffect">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      <!-- Twilight Sky -->
      <rect x="0" y="0" width="800" height="290" fill="url(#skyGrad)"/>

      <!-- Distant Hills & Bosporus Coastline -->
      <path d="M0,240 Q180,210 420,232 T800,218 L800,290 L0,290 Z" fill="#1e293b" opacity="0.85"/>
      <path d="M0,255 Q260,235 550,250 T800,242 L800,290 L0,290 Z" fill="#0f172a" opacity="0.6"/>

      <!-- Water (The Bosporus Strait) -->
      <rect x="0" y="285" width="800" height="135" fill="url(#seaGrad)"/>
      <!-- Water ripple lines with subtle reflections -->
      <path d="M30,310 Q140,305 260,310 T520,308 T800,310" stroke="#38bdf8" stroke-width="1.5" fill="none" opacity="0.25"/>
      <path d="M60,340 Q200,335 340,340 T640,338 T800,340" stroke="#38bdf8" stroke-width="1.2" fill="none" opacity="0.2"/>
      <path d="M10,375 Q160,370 320,375 T600,372 T800,375" stroke="#38bdf8" stroke-width="1.0" fill="none" opacity="0.15"/>

      <!-- Quayside Stone Wharf -->
      <rect x="0" y="272" width="800" height="16" fill="#334155"/>
      <line x1="0" y1="274" x2="800" y2="274" stroke="#475569" stroke-width="1.5"/>

      <!-- ================= SCUTARI BARRACKS QUADRANGLE ================= -->
      <!-- Foundation / Terrace -->
      <rect x="50" y="252" width="700" height="22" fill="#475569" rx="2"/>

      <!-- Left Wing -->
      <rect x="75" y="105" width="165" height="150" fill="url(#wallStone)"/>
      <polygon points="70,105 157,68 245,105" fill="url(#terracottaRoof)"/>
      <!-- Left Wing Cornice & Stringcourses -->
      <line x1="75" y1="150" x2="240" y2="150" stroke="#94a3b8" stroke-width="2"/>
      <line x1="75" y1="198" x2="240" y2="198" stroke="#94a3b8" stroke-width="2"/>

      <!-- Main Central Block -->
      <rect x="235" y="80" width="330" height="175" fill="url(#wallStone)"/>
      <polygon points="230,80 400,42 570,80" fill="url(#terracottaRoof)"/>
      <!-- Pediment on Central Block -->
      <polygon points="340,80 400,52 460,80" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5"/>
      <circle cx="400" cy="70" r="6" fill="#64748b"/>
      <!-- Central Cornices -->
      <line x1="235" y1="135" x2="565" y2="135" stroke="#94a3b8" stroke-width="2"/>
      <line x1="235" y1="188" x2="565" y2="188" stroke="#94a3b8" stroke-width="2"/>

      <!-- Right Wing -->
      <rect x="560" y="105" width="165" height="150" fill="url(#wallStone)"/>
      <polygon points="555,105 642,68 730,105" fill="url(#terracottaRoof)"/>
      <!-- Right Wing Cornices -->
      <line x1="560" y1="150" x2="725" y2="150" stroke="#94a3b8" stroke-width="2"/>
      <line x1="560" y1="198" x2="725" y2="198" stroke="#94a3b8" stroke-width="2"/>

      <!-- Prominent Corner Towers (Selimiye Ottoman Barracks characteristics) -->
      <!-- Left Tower -->
      <rect x="55" y="65" width="45" height="190" fill="url(#wallShadow)"/>
      <polygon points="50,65 77,32 105,65" fill="#78350f"/>
      <rect x="68" y="75" width="18" height="24" rx="9" fill="#0f172a"/>
      <rect x="68" y="115" width="18" height="24" rx="9" fill="#0f172a"/>
      <rect x="68" y="160" width="18" height="24" rx="9" fill="#0f172a"/>

      <!-- Right Tower -->
      <rect x="700" y="65" width="45" height="190" fill="url(#wallShadow)"/>
      <polygon points="695,65 722,32 750,65" fill="#78350f"/>
      <rect x="714" y="75" width="18" height="24" rx="9" fill="#0f172a"/>
      <rect x="714" y="115" width="18" height="24" rx="9" fill="#0f172a"/>
      <rect x="714" y="160" width="18" height="24" rx="9" fill="#0f172a"/>

      <!-- Grand Arched Central Entrance Portal -->
      <path d="M375,255 L375,205 Q400,188 425,205 L425,255 Z" fill="#090d16"/>
      <path d="M370,255 L370,203 Q400,182 430,203 L430,255 Z" fill="none" stroke="#cbd5e1" stroke-width="3"/>
      <!-- Stone steps leading to entrance -->
      <rect x="360" y="255" width="80" height="4" fill="#94a3b8"/>
      <rect x="355" y="259" width="90" height="4" fill="#64748b"/>

      <!-- Arched Victorian Hospital Windows -->
      <!-- Left Wing Windows Grid -->
      <g fill="#0f172a" opacity="0.88">
        <rect x="110" y="115" width="13" height="24" rx="6.5"/>
        <rect x="140" y="115" width="13" height="24" rx="6.5"/>
        <rect x="170" y="115" width="13" height="24" rx="6.5"/>
        <rect x="200" y="115" width="13" height="24" rx="6.5"/>
        <rect x="110" y="160" width="13" height="24" rx="6.5"/>
        <rect x="140" y="160" width="13" height="24" rx="6.5"/>
        <rect x="170" y="160" width="13" height="24" rx="6.5"/>
        <rect x="200" y="160" width="13" height="24" rx="6.5"/>
        <rect x="110" y="210" width="13" height="24" rx="6.5"/>
        <rect x="140" y="210" width="13" height="24" rx="6.5"/>
        <rect x="170" y="210" width="13" height="24" rx="6.5"/>
        <rect x="200" y="210" width="13" height="24" rx="6.5"/>
      </g>

      <!-- Center Block Windows Grid -->
      <g fill="#0f172a" opacity="0.88">
        <rect x="260" y="98" width="14" height="25" rx="7"/>
        <rect x="295" y="98" width="14" height="25" rx="7"/>
        <rect x="330" y="98" width="14" height="25" rx="7"/>
        <rect x="455" y="98" width="14" height="25" rx="7"/>
        <rect x="490" y="98" width="14" height="25" rx="7"/>
        <rect x="525" y="98" width="14" height="25" rx="7"/>

        <rect x="260" y="148" width="14" height="25" rx="7"/>
        <rect x="295" y="148" width="14" height="25" rx="7"/>
        <rect x="330" y="148" width="14" height="25" rx="7"/>
        <rect x="455" y="148" width="14" height="25" rx="7"/>
        <rect x="490" y="148" width="14" height="25" rx="7"/>
        <rect x="525" y="148" width="14" height="25" rx="7"/>

        <rect x="260" y="200" width="14" height="25" rx="7"/>
        <rect x="295" y="200" width="14" height="25" rx="7"/>
        <rect x="330" y="200" width="14" height="25" rx="7"/>
        <rect x="455" y="200" width="14" height="25" rx="7"/>
        <rect x="490" y="200" width="14" height="25" rx="7"/>
        <rect x="525" y="200" width="14" height="25" rx="7"/>
      </g>

      <!-- Right Wing Windows Grid -->
      <g fill="#0f172a" opacity="0.88">
        <rect x="585" y="115" width="13" height="24" rx="6.5"/>
        <rect x="615" y="115" width="13" height="24" rx="6.5"/>
        <rect x="645" y="115" width="13" height="24" rx="6.5"/>
        <rect x="675" y="115" width="13" height="24" rx="6.5"/>
        <rect x="585" y="160" width="13" height="24" rx="6.5"/>
        <rect x="615" y="160" width="13" height="24" rx="6.5"/>
        <rect x="645" y="160" width="13" height="24" rx="6.5"/>
        <rect x="675" y="160" width="13" height="24" rx="6.5"/>
        <rect x="585" y="210" width="13" height="24" rx="6.5"/>
        <rect x="615" y="210" width="13" height="24" rx="6.5"/>
        <rect x="645" y="210" width="13" height="24" rx="6.5"/>
        <rect x="675" y="210" width="13" height="24" rx="6.5"/>
      </g>

      <!-- Florence Nightingale's Hospital Ward Window: Radiant Warm Lantern Glow -->
      <circle cx="395" cy="155" r="48" fill="url(#lampAura)" filter="url(#glowEffect)"/>
      <rect x="384" y="140" width="22" height="32" rx="10" fill="#fef08a"/>
      <rect x="386" y="142" width="18" height="28" rx="8" fill="#fffbeb"/>
      <line x1="395" y1="140" x2="395" y2="172" stroke="#b45309" stroke-width="1.8"/>
      <line x1="384" y1="156" x2="406" y2="156" stroke="#b45309" stroke-width="1.8"/>

      <!-- Atmospheric Crimean War Transport Vessel Moored at Wharf -->
      <g>
        <path d="M45,296 L65,335 L160,335 L180,296 Z" fill="#090d16"/>
        <rect x="70" y="290" width="85" height="7" fill="#1e293b"/>
        <!-- Masts -->
        <line x1="95" y1="290" x2="95" y2="235" stroke="#090d16" stroke-width="3"/>
        <line x1="135" y1="290" x2="135" y2="242" stroke="#090d16" stroke-width="2.5"/>
        <!-- Rigging & Furled Sails -->
        <line x1="95" y1="240" x2="55" y2="295" stroke="#475569" stroke-width="1.2"/>
        <line x1="95" y1="240" x2="135" y2="295" stroke="#475569" stroke-width="1.2"/>
        <line x1="135" y1="245" x2="175" y2="295" stroke="#475569" stroke-width="1.2"/>
        <polygon points="95,248 128,262 95,266" fill="#e2e8f0" opacity="0.35"/>
        <!-- Small Steam Pipe Funnel -->
        <rect x="110" y="275" width="8" height="18" fill="#78350f"/>
        <ellipse cx="114" cy="272" rx="6" ry="3" fill="#64748b" opacity="0.4"/>
      </g>

      <!-- Crimean Night Sky Details: Crescent Moon & Distant Constellations -->
      <path d="M720,45 A18,18 0 0 0 706,24 A20,20 0 1 1 720,45 Z" fill="#fef08a" opacity="0.9"/>
      <circle cx="160" cy="35" r="1.5" fill="#f8fafc" opacity="0.8"/>
      <circle cx="270" cy="25" r="1.2" fill="#f8fafc" opacity="0.75"/>
      <circle cx="505" cy="38" r="1.6" fill="#f8fafc" opacity="0.9"/>
      <circle cx="630" cy="20" r="1.2" fill="#f8fafc" opacity="0.6"/>
      <circle cx="48" cy="50" r="1.2" fill="#f8fafc" opacity="0.7"/>
    </svg>
  `,

  // Scene 2: The Unsorted Ledgers (Detailed Investigator's Desk with Disorganised Records)
  ledger: `
    <svg viewBox="0 0 600 340" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-label="Investigator desk with scattered unorganised hospital records" role="img">
      <defs>
        <linearGradient id="deskWood" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#451a03"/>
          <stop offset="30%" stop-color="#78350f"/>
          <stop offset="100%" stop-color="#271003"/>
        </linearGradient>
        <linearGradient id="parchment" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="50%" stop-color="#fffbeb"/>
          <stop offset="100%" stop-color="#fef3c7"/>
        </linearGradient>
        <linearGradient id="leatherSpine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#7f1d1d"/>
          <stop offset="50%" stop-color="#991b1b"/>
          <stop offset="100%" stop-color="#450a0a"/>
        </linearGradient>
        <filter id="deskShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="3" dy="6" stdDeviation="5" flood-color="#000000" flood-opacity="0.35"/>
        </filter>
      </defs>

      <!-- Victorian Oak Desk Surface -->
      <rect x="0" y="0" width="600" height="340" fill="url(#deskWood)" rx="8"/>
      <!-- Subtle Wood Grain Horizontal Streaks -->
      <line x1="0" y1="60" x2="600" y2="60" stroke="#92400e" stroke-width="1" opacity="0.25"/>
      <line x1="0" y1="140" x2="600" y2="140" stroke="#92400e" stroke-width="1.5" opacity="0.2"/>
      <line x1="0" y1="230" x2="600" y2="230" stroke="#92400e" stroke-width="1" opacity="0.25"/>

      <!-- Scattered Hospital Document 1 (Tilted Left) -->
      <g transform="translate(60, 45) rotate(-14)" filter="url(#deskShadow)">
        <rect x="0" y="0" width="120" height="150" fill="url(#parchment)" stroke="#d97706" stroke-width="1" rx="3"/>
        <rect x="10" y="12" width="70" height="8" fill="#92400e" opacity="0.3"/>
        <text x="12" y="40" font-family="serif" font-size="12" font-weight="bold" fill="#78350f">Ward C Record</text>
        <text x="12" y="65" font-family="sans-serif" font-size="22" font-weight="900" fill="#dc2626">85</text>
        <text x="50" y="65" font-family="sans-serif" font-size="10" fill="#64748b">cases</text>
        <line x1="12" y1="85" x2="105" y2="85" stroke="#94a3b8" stroke-width="1.5"/>
        <line x1="12" y1="102" x2="95" y2="102" stroke="#94a3b8" stroke-width="1.5"/>
        <line x1="12" y1="119" x2="80" y2="119" stroke="#94a3b8" stroke-width="1.5"/>
        <circle cx="95" cy="125" r="9" fill="#dc2626" opacity="0.8"/>
      </g>

      <!-- Scattered Hospital Document 2 (Tilted Right) -->
      <g transform="translate(410, 60) rotate(16)" filter="url(#deskShadow)">
        <rect x="0" y="0" width="130" height="160" fill="url(#parchment)" stroke="#d97706" stroke-width="1" rx="3"/>
        <text x="15" y="30" font-family="serif" font-size="12" font-weight="bold" fill="#78350f">Ward A Admissions</text>
        <text x="15" y="62" font-family="sans-serif" font-size="22" font-weight="900" fill="#2563eb">42</text>
        <text x="52" y="62" font-family="sans-serif" font-size="10" fill="#64748b">patients</text>
        <line x1="15" y1="85" x2="115" y2="85" stroke="#94a3b8" stroke-width="1.5"/>
        <line x1="15" y1="105" x2="100" y2="105" stroke="#94a3b8" stroke-width="1.5"/>
        <line x1="15" y1="125" x2="110" y2="125" stroke="#94a3b8" stroke-width="1.5"/>
      </g>

      <!-- Scattered Slip 3 (Bottom Center) -->
      <g transform="translate(140, 195) rotate(7)" filter="url(#deskShadow)">
        <rect x="0" y="0" width="130" height="85" fill="#fef08a" stroke="#d97706" stroke-width="1" rx="2"/>
        <text x="10" y="24" font-family="serif" font-size="11" font-weight="bold" fill="#92400e">Ward B (Fever)</text>
        <text x="10" y="55" font-family="sans-serif" font-size="24" font-weight="900" fill="#0f172a">19</text>
        <text x="45" y="55" font-family="sans-serif" font-size="10" fill="#475569">admitted</text>
      </g>

      <!-- Main Open Victorian Leatherbound Ledger Book (Center) -->
      <g transform="translate(180, 50)" filter="url(#deskShadow)">
        <!-- Leather Cover Edges -->
        <rect x="-8" y="2" width="256" height="176" fill="url(#leatherSpine)" rx="5"/>
        <!-- Left Page -->
        <path d="M0,8 Q120,18 120,170 Q60,165 0,162 Z" fill="url(#parchment)" stroke="#d97706" stroke-width="1"/>
        <!-- Right Page -->
        <path d="M240,8 Q120,18 120,170 Q180,165 240,162 Z" fill="url(#parchment)" stroke="#d97706" stroke-width="1"/>
        <!-- Book Spine Center Binding -->
        <line x1="120" y1="10" x2="120" y2="170" stroke="#7f1d1d" stroke-width="3"/>

        <!-- Left Page Header & Disordered Number Columns -->
        <text x="15" y="28" font-family="serif" font-size="11" font-weight="bold" fill="#78350f">Scutari Wards: Nov 1854</text>
        <line x1="15" y1="36" x2="108" y2="36" stroke="#b45309" stroke-width="1"/>
        <!-- Left Page Entries (Notice unsorted jump: 42, 19, 85) -->
        <text x="15" y="56" font-family="sans-serif" font-size="9" fill="#334155">Ward C: <tspan font-weight="bold" fill="#dc2626">85</tspan></text>
        <text x="15" y="78" font-family="sans-serif" font-size="9" fill="#334155">Ward A: <tspan font-weight="bold" fill="#2563eb">42</tspan></text>
        <text x="15" y="100" font-family="sans-serif" font-size="9" fill="#334155">Ward E: <tspan font-weight="bold" fill="#7c3aed">128</tspan></text>
        <text x="15" y="122" font-family="sans-serif" font-size="9" fill="#334155">Ward B: <tspan font-weight="bold" fill="#059669">19</tspan></text>
        <text x="15" y="144" font-family="sans-serif" font-size="9" fill="#334155">Ward D: <tspan font-weight="bold" fill="#d97706">64</tspan></text>

        <!-- Right Page Jottings -->
        <text x="135" y="28" font-family="serif" font-size="10" font-style="italic" fill="#64748b">Weekly Tally - Unsorted</text>
        <line x1="135" y1="36" x2="225" y2="36" stroke="#cbd5e1" stroke-width="1"/>
        <line x1="135" y1="56" x2="225" y2="56" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3,3"/>
        <line x1="135" y1="78" x2="220" y2="78" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3,3"/>
        <line x1="135" y1="100" x2="225" y2="100" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3,3"/>
        <line x1="135" y1="122" x2="215" y2="122" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3,3"/>
        <!-- Red Question Mark Callout -->
        <circle cx="180" cy="95" r="18" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5"/>
        <text x="175" y="102" font-family="sans-serif" font-size="18" font-weight="900" fill="#dc2626">?</text>
      </g>

      <!-- Glass Inkwell with Dark Navy Ink -->
      <g transform="translate(480, 205)" filter="url(#deskShadow)">
        <rect x="0" y="15" width="46" height="50" rx="6" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.5"/>
        <rect x="6" y="24" width="34" height="35" rx="3" fill="#1e3a8a" opacity="0.8"/>
        <!-- Brass Collar -->
        <rect x="10" y="5" width="26" height="12" rx="3" fill="#f59e0b" stroke="#78350f" stroke-width="1"/>
        <circle cx="23" cy="5" r="7" fill="#1e293b"/>
      </g>

      <!-- Goose Feather Quill Pen Resting across Documents -->
      <g transform="translate(380, 160) rotate(-32)" filter="url(#deskShadow)">
        <path d="M0,0 Q60,18 170,12 Q120,4 0,0 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
        <path d="M0,0 L180,12" stroke="#e2e8f0" stroke-width="1.8"/>
        <!-- Quill Nib -->
        <polygon points="-8,-1 0,-3 0,1" fill="#0f172a"/>
      </g>

      <!-- Stamp / Wax Seal -->
      <circle cx="485" cy="165" r="14" fill="#dc2626" opacity="0.9" filter="url(#deskShadow)"/>
      <circle cx="485" cy="165" r="9" fill="#991b1b"/>
      <text x="481" y="169" font-family="serif" font-size="11" font-weight="bold" fill="#fef08a">N</text>
    </svg>
  `,

  // Scene 3: Order Reveals Patterns (Clear Visual Transformation: Unsorted -> Sorted Discovery)
  patternDiscovery: `
    <svg viewBox="0 0 600 340" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-label="Visual transformation showing unsorted data ordered into clear patterns" role="img">
      <defs>
        <linearGradient id="transBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="60%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="glowArrow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f59e0b"/>
          <stop offset="50%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#10b981"/>
        </linearGradient>
        <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fef08a" stop-opacity="1"/>
          <stop offset="60%" stop-color="#38bdf8" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#1e3a8a" stop-opacity="0"/>
        </radialGradient>
        <filter id="popShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.4"/>
        </filter>
      </defs>

      <!-- Dark Navy Canvas -->
      <rect x="0" y="0" width="600" height="340" fill="url(#transBg)" rx="8"/>

      <!-- LEFT SIDE: Unsorted Chaos -->
      <g transform="translate(30, 40)">
        <rect x="0" y="0" width="200" height="250" fill="#1e293b" rx="10" stroke="#475569" stroke-width="1.5" stroke-dasharray="4,4"/>
        <text x="100" y="30" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f87171">
          UNSORTED RECORDS
        </text>
        <text x="100" y="46" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#94a3b8">
          Chaotic & hard to evaluate
        </text>

        <!-- Jumbled, Tilted Record Chips -->
        <g transform="translate(25, 65) rotate(-9)" filter="url(#popShadow)">
          <rect x="0" y="0" width="65" height="40" rx="6" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="32" y="26" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="900" fill="#b45309">85</text>
        </g>
        <g transform="translate(105, 75) rotate(12)" filter="url(#popShadow)">
          <rect x="0" y="0" width="65" height="40" rx="6" fill="#fffbeb" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="32" y="26" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="900" fill="#1d4ed8">19</text>
        </g>
        <g transform="translate(20, 125) rotate(14)" filter="url(#popShadow)">
          <rect x="0" y="0" width="70" height="40" rx="6" fill="#fffbeb" stroke="#8b5cf6" stroke-width="1.5"/>
          <text x="35" y="26" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="900" fill="#6d28d9">128</text>
        </g>
        <g transform="translate(110, 135) rotate(-8)" filter="url(#popShadow)">
          <rect x="0" y="0" width="65" height="40" rx="6" fill="#fffbeb" stroke="#ef4444" stroke-width="1.5"/>
          <text x="32" y="26" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="900" fill="#dc2626">42</text>
        </g>
        <g transform="translate(65, 185) rotate(-5)" filter="url(#popShadow)">
          <rect x="0" y="0" width="65" height="40" rx="6" fill="#fffbeb" stroke="#059669" stroke-width="1.5"/>
          <text x="32" y="26" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="900" fill="#047857">64</text>
        </g>
      </g>

      <!-- CENTER: Transformation Dynamic Arrow -->
      <g transform="translate(245, 135)">
        <circle cx="55" cy="30" r="38" fill="url(#starGlow)" opacity="0.6"/>
        <path d="M15,30 L80,30 M65,15 L85,30 L65,45" fill="none" stroke="url(#glowArrow)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="50" y="65" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="#38bdf8">
          SORTING
        </text>
      </g>

      <!-- RIGHT SIDE: Ordered Clarity & Ascending Staircase Pattern -->
      <g transform="translate(370, 40)">
        <rect x="0" y="0" width="200" height="250" fill="#1e293b" rx="10" stroke="#10b981" stroke-width="2"/>
        <text x="100" y="30" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#34d399">
          ORDERED PATTERNS
        </text>
        <text x="100" y="46" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#a7f3d0">
          Instant clarity & insight
        </text>

        <!-- Neatly Sorted Ascending Staircase -->
        <g transform="translate(20, 68)" filter="url(#popShadow)">
          <rect x="0" y="0" width="160" height="28" rx="5" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
          <text x="25" y="19" font-family="sans-serif" font-size="14" font-weight="bold" fill="#065f46">19</text>
          <text x="75" y="18" font-family="sans-serif" font-size="10" fill="#047857">Lowest Ward (Rank 1)</text>
          <rect x="135" y="6" width="16" height="16" rx="8" fill="#10b981"/>
          <path d="M139,14 L142,17 L148,11" stroke="#ffffff" stroke-width="1.8" fill="none"/>
        </g>
        <g transform="translate(20, 102)" filter="url(#popShadow)">
          <rect x="0" y="0" width="160" height="28" rx="5" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
          <text x="25" y="19" font-family="sans-serif" font-size="14" font-weight="bold" fill="#065f46">42</text>
          <text x="75" y="18" font-family="sans-serif" font-size="10" fill="#047857">Ward A (Rank 2)</text>
        </g>
        <g transform="translate(20, 136)" filter="url(#popShadow)">
          <rect x="0" y="0" width="160" height="28" rx="5" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
          <text x="25" y="19" font-family="sans-serif" font-size="14" font-weight="bold" fill="#065f46">64</text>
          <text x="75" y="18" font-family="sans-serif" font-size="10" fill="#047857">Ward D (Rank 3)</text>
        </g>
        <g transform="translate(20, 170)" filter="url(#popShadow)">
          <rect x="0" y="0" width="160" height="28" rx="5" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
          <text x="25" y="19" font-family="sans-serif" font-size="14" font-weight="bold" fill="#065f46">85</text>
          <text x="75" y="18" font-family="sans-serif" font-size="10" fill="#047857">Ward C (Rank 4)</text>
        </g>
        <g transform="translate(20, 204)" filter="url(#popShadow)">
          <rect x="0" y="0" width="160" height="28" rx="5" fill="#d1fae5" stroke="#059669" stroke-width="2"/>
          <text x="22" y="19" font-family="sans-serif" font-size="14" font-weight="bold" fill="#065f46">128</text>
          <text x="75" y="18" font-family="sans-serif" font-size="10" font-weight="bold" fill="#065f46">Highest Ward (Rank 5)</text>
        </g>
      </g>

      <!-- Spark of Discovery Star -->
      <g transform="translate(540, 30)">
        <polygon points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9" fill="#fef08a"/>
      </g>
    </svg>
  `,

  // Scene 4: Your Mission as Investigator (Investigator Examining Records with Magnifying Glass)
  investigatorMission: `
    <svg viewBox="0 0 600 340" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-label="Investigator examining hospital records with magnifying glass" role="img">
      <defs>
        <linearGradient id="missionBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="brassHandle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="40%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#78350f"/>
        </linearGradient>
        <radialGradient id="lensReflect" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.75"/>
          <stop offset="40%" stop-color="#e0f2fe" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#0284c7" stop-opacity="0.15"/>
        </radialGradient>
        <filter id="missionShadow">
          <feDropShadow dx="3" dy="5" stdDeviation="5" flood-color="#000000" flood-opacity="0.4"/>
        </filter>
      </defs>

      <!-- Studio Investigation Workspace -->
      <rect x="0" y="0" width="600" height="340" fill="url(#missionBg)" rx="8"/>

      <!-- Blueprint / Hospital Floorplan Grid in Background -->
      <g stroke="#334155" stroke-width="1" opacity="0.3">
        <line x1="40" y1="0" x2="40" y2="340"/>
        <line x1="120" y1="0" x2="120" y2="340"/>
        <line x1="200" y1="0" x2="200" y2="340"/>
        <line x1="280" y1="0" x2="280" y2="340"/>
        <line x1="360" y1="0" x2="360" y2="340"/>
        <line x1="440" y1="0" x2="440" y2="340"/>
        <line x1="520" y1="0" x2="520" y2="340"/>
        <line x1="0" y1="60" x2="600" y2="60"/>
        <line x1="0" y1="120" x2="600" y2="120"/>
        <line x1="0" y1="180" x2="600" y2="180"/>
        <line x1="0" y1="240" x2="600" y2="240"/>
        <line x1="0" y1="300" x2="600" y2="300"/>
      </g>

      <!-- Case File Folder Base -->
      <g transform="translate(60, 40)" filter="url(#missionShadow)">
        <rect x="0" y="0" width="480" height="260" rx="10" fill="#fffbeb" stroke="#d97706" stroke-width="2"/>
        <rect x="0" y="0" width="480" height="38" rx="10" fill="#fef3c7"/>
        <line x1="0" y1="38" x2="480" y2="38" stroke="#fde68a" stroke-width="1.5"/>

        <!-- Case Title Banner -->
        <rect x="25" y="10" width="160" height="20" rx="4" fill="#92400e"/>
        <text x="105" y="24" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="#ffffff">
          SCUTARI INQUIRY: DOSSIER
        </text>
        <text x="450" y="24" text-anchor="end" font-family="sans-serif" font-size="10" font-weight="bold" fill="#92400e">
          EVIDENCE LAB • 1854
        </text>

        <!-- Document Content Columns -->
        <!-- Left: Mission Briefing Note -->
        <g transform="translate(25, 55)">
          <text x="0" y="18" font-family="serif" font-size="14" font-weight="bold" fill="#1e293b">Investigator's Directives:</text>
          <text x="0" y="38" font-family="sans-serif" font-size="11" fill="#475569">1. Gather unsorted hospital ledgers</text>
          <text x="0" y="58" font-family="sans-serif" font-size="11" fill="#475569">2. Discover order through hands-on sorting</text>
          <text x="0" y="78" font-family="sans-serif" font-size="11" fill="#475569">3. Master Python's built-in sorted()</text>
          <text x="0" y="98" font-family="sans-serif" font-size="11" fill="#475569">4. Support life-saving sanitary reforms</text>

          <!-- Checkmark Box -->
          <rect x="0" y="118" width="180" height="55" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="1.2"/>
          <text x="12" y="138" font-family="sans-serif" font-size="10" font-weight="bold" fill="#065f46">Status: Mission Active</text>
          <text x="12" y="156" font-family="sans-serif" font-size="10" fill="#047857">Tools: Python 3 • sorted()</text>
        </g>

        <!-- Right: Evidence Cards being organized -->
        <g transform="translate(240, 55)">
          <!-- Underneath Record Card -->
          <rect x="10" y="10" width="110" height="60" rx="6" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="20" y="28" font-family="sans-serif" font-size="9" fill="#64748b">Ward A</text>
          <text x="20" y="52" font-family="sans-serif" font-size="20" font-weight="bold" fill="#2563eb">42</text>

          <rect x="90" y="40" width="110" height="60" rx="6" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="100" y="58" font-family="sans-serif" font-size="9" fill="#64748b">Ward B</text>
          <text x="100" y="82" font-family="sans-serif" font-size="20" font-weight="bold" fill="#059669">19</text>

          <rect x="30" y="95" width="110" height="60" rx="6" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="40" y="113" font-family="sans-serif" font-size="9" fill="#64748b">Ward C</text>
          <text x="40" y="137" font-family="sans-serif" font-size="20" font-weight="bold" fill="#dc2626">85</text>
        </g>
      </g>

      <!-- Brass Victorian Magnifying Glass focusing on Data -->
      <g transform="translate(365, 120)" filter="url(#missionShadow)">
        <!-- Handle angled downward right -->
        <line x1="70" y1="70" x2="155" y2="155" stroke="#78350f" stroke-width="14" stroke-linecap="round"/>
        <line x1="70" y1="70" x2="155" y2="155" stroke="url(#brassHandle)" stroke-width="10" stroke-linecap="round"/>
        <!-- Brass Outer Bezel Rim -->
        <circle cx="35" cy="35" r="54" fill="none" stroke="url(#brassHandle)" stroke-width="8"/>
        <!-- Convex Glass Lens with High-Contrast Reflection -->
        <circle cx="35" cy="35" r="50" fill="url(#lensReflect)"/>
        <!-- Magnified Focus: Clear 19 & sorted tag inside lens -->
        <rect x="5" y="12" width="60" height="46" rx="6" fill="#fef08a" stroke="#d97706" stroke-width="2"/>
        <text x="35" y="44" text-anchor="middle" font-family="sans-serif" font-size="26" font-weight="900" fill="#065f46">19</text>
      </g>

      <!-- Wax Seal of Official Investigation -->
      <g transform="translate(100, 260)" filter="url(#missionShadow)">
        <circle cx="20" cy="20" r="18" fill="#dc2626"/>
        <circle cx="20" cy="20" r="12" fill="#991b1b"/>
        <polygon points="20,11 23,17 29,17 24,21 26,27 20,23 14,27 16,21 11,17 17,17" fill="#fef08a"/>
      </g>
    </svg>
  `,

  // Screen 8 Completion Badge: Gold Star & Victorian Medallion
  badge: `
    <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sorting Investigator Badge">
      <defs>
        <linearGradient id="goldMedal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="50%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
        <linearGradient id="ribbonBlue" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#1d4ed8"/>
          <stop offset="100%" stop-color="#3b82f6"/>
        </linearGradient>
      </defs>
      <!-- Hanging Ribbon tails -->
      <polygon points="75,100 60,180 85,165 95,180 90,100" fill="url(#ribbonBlue)"/>
      <polygon points="125,100 110,180 115,165 140,180 125,100" fill="#1e40af"/>
      <!-- Starburst Gear / Outer Rosette -->
      <circle cx="100" cy="90" r="62" fill="#d97706" opacity="0.3"/>
      <circle cx="100" cy="90" r="54" fill="url(#goldMedal)" stroke="#78350f" stroke-width="3"/>
      <!-- Inner Ring -->
      <circle cx="100" cy="90" r="42" fill="#1e293b" stroke="#fef08a" stroke-width="2"/>
      <!-- Central Star -->
      <polygon points="100,58 107,76 126,76 111,88 117,106 100,94 83,106 89,88 74,76 93,76" fill="#fef08a"/>
      <!-- Small Python Symbol Dots -->
      <circle cx="92" cy="118" r="4" fill="#38bdf8"/>
      <circle cx="108" cy="118" r="4" fill="#fbbf24"/>
    </svg>
  `,

  // Brand Emblem / Victorian Lantern Icon (36x36)
  emblem: `
    <svg viewBox="0 0 36 36" width="36" height="36" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The Sorting Investigation Emblem">
      <defs>
        <linearGradient id="embGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="embGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="50%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="8" fill="url(#embGrad)"/>
      <circle cx="18" cy="18" r="14" fill="none" stroke="url(#embGold)" stroke-width="1.2" stroke-dasharray="2 1.5"/>
      <circle cx="18" cy="9" r="2.5" fill="none" stroke="#f59e0b" stroke-width="1.2"/>
      <rect x="13" y="12" width="10" height="13" rx="2" fill="#fef08a" fill-opacity="0.25" stroke="#f59e0b" stroke-width="1.2"/>
      <line x1="18" y1="12" x2="18" y2="25" stroke="#d97706" stroke-width="0.8"/>
      <circle cx="18" cy="19" r="2.5" fill="#f59e0b"/>
      <circle cx="18" cy="19" r="1.2" fill="#ef4444"/>
      <rect x="12" y="25" width="12" height="3" rx="1" fill="#b45309"/>
    </svg>
  `,
  lantern: `
    <svg viewBox="0 0 36 36" width="36" height="36" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Historical Lantern">
      <defs>
        <linearGradient id="lantGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="lantGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="50%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="8" fill="url(#lantGrad)"/>
      <circle cx="18" cy="18" r="14" fill="none" stroke="url(#lantGold)" stroke-width="1.2" stroke-dasharray="2 1.5"/>
      <circle cx="18" cy="9" r="2.5" fill="none" stroke="#f59e0b" stroke-width="1.2"/>
      <rect x="13" y="12" width="10" height="13" rx="2" fill="#fef08a" fill-opacity="0.25" stroke="#f59e0b" stroke-width="1.2"/>
      <line x1="18" y1="12" x2="18" y2="25" stroke="#d97706" stroke-width="0.8"/>
      <circle cx="18" cy="19" r="2.5" fill="#f59e0b"/>
      <circle cx="18" cy="19" r="1.2" fill="#ef4444"/>
      <rect x="12" y="25" width="12" height="3" rx="1" fill="#b45309"/>
    </svg>
  `,
  logo: `
    <svg viewBox="0 0 36 36" width="36" height="36" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Investigation Logo">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="50%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="8" fill="url(#logoGrad)"/>
      <circle cx="18" cy="18" r="14" fill="none" stroke="url(#logoGold)" stroke-width="1.2" stroke-dasharray="2 1.5"/>
      <circle cx="18" cy="9" r="2.5" fill="none" stroke="#f59e0b" stroke-width="1.2"/>
      <rect x="13" y="12" width="10" height="13" rx="2" fill="#fef08a" fill-opacity="0.25" stroke="#f59e0b" stroke-width="1.2"/>
      <line x1="18" y1="12" x2="18" y2="25" stroke="#d97706" stroke-width="0.8"/>
      <circle cx="18" cy="19" r="2.5" fill="#f59e0b"/>
      <circle cx="18" cy="19" r="1.2" fill="#ef4444"/>
      <rect x="12" y="25" width="12" height="3" rx="1" fill="#b45309"/>
    </svg>
  `,

  // UI Icons
  icons: {
    check: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    arrowLeft: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
    refresh: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
    play: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    pause: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
    stepForward: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"/><rect x="17" y="4" width="3" height="16"/></svg>`,
    stepBackward: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><polygon points="19 20 9 12 19 4 19 20"/><rect x="4" y="4" width="3" height="16"/></svg>`,
    search: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    sparkle: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>`,
    info: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    terminal: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
  }
};

window.SVGIcons = SVGIcons;

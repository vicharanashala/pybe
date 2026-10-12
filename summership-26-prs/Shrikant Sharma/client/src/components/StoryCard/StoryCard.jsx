import { Link } from "react-router-dom";
import "./StoryCard.css";

function ConceptIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7l4 5-4 5" />
      <path d="M11 17h9" />
    </svg>
  );
}

function SproutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20v-7" />
      <path d="M12 13C12 9 9 7 4 7c0 4 2.5 6 8 6Z" />
      <path d="M12 10c0-3 2-5 8-5 0 3-2 5-8 5Z" opacity="0.7" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function MoonArt() {
  return (
    <svg viewBox="0 0 360 460" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="moon-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A6B4C" />
          <stop offset="100%" stopColor="#33513C" />
        </linearGradient>
        <radialGradient id="moon-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#F7EBC4" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#F7EBC4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="moon-river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#AFC7B4" />
          <stop offset="100%" stopColor="#8FA890" />
        </linearGradient>
      </defs>

      <rect width="360" height="460" fill="url(#moon-sky)" />

      <circle cx="52" cy="70" r="2.2" fill="#F7EBC4" opacity="0.8" />
      <circle cx="120" cy="122" r="1.8" fill="#F7EBC4" opacity="0.6" />
      <circle cx="300" cy="60" r="2" fill="#F7EBC4" opacity="0.7" />
      <circle cx="330" cy="150" r="1.6" fill="#F7EBC4" opacity="0.5" />
      <circle cx="36" cy="180" r="1.8" fill="#F7EBC4" opacity="0.5" />

      <circle cx="252" cy="110" r="96" fill="url(#moon-glow)" />
      <circle cx="252" cy="110" r="54" fill="#F1E3BC" />
      <circle cx="266" cy="100" r="48" fill="#F7F0DD" />
      <circle cx="236" cy="102" r="6" fill="#EAD9AC" opacity="0.7" />
      <circle cx="262" cy="128" r="5" fill="#EAD9AC" opacity="0.6" />

      <path d="M0 300 Q 70 262 150 286 T 300 278 L 360 292 L 360 460 L 0 460 Z" fill="#2F4A35" />

      <path d="M0 352 C 90 340 150 356 220 366 C 300 378 340 372 360 380 L 360 460 L 0 460 Z" fill="url(#moon-river)" />
      <path d="M240 372 q 18 8 36 2" stroke="#F1E3BC" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M246 396 q 16 7 32 2" stroke="#F1E3BC" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M250 420 q 14 6 28 2" stroke="#F1E3BC" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />

      <path d="M0 424 Q 110 400 230 418 T 360 410 L 360 460 L 0 460 Z" fill="#1F3626" />

      <path d="M70 460 C 76 420 74 396 82 372" stroke="#3A543F" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M82 460 C 90 424 96 402 92 378" stroke="#3A543F" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M104 460 C 100 430 108 410 118 392" stroke="#3A543F" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="82" cy="368" rx="4" ry="7" fill="#D8A84C" />
      <ellipse cx="92" cy="374" rx="4" ry="7" fill="#B8893A" />
      <ellipse cx="118" cy="388" rx="4" ry="7" fill="#D8A84C" />

      <g transform="translate(116 0)">
        <ellipse cx="150" cy="442" rx="72" ry="14" fill="#162A1C" opacity="0.6" />
        <ellipse cx="160" cy="414" rx="34" ry="26" fill="#F3EADB" />
        <circle cx="196" cy="404" r="24" fill="#F3EADB" />
        <ellipse cx="216" cy="368" rx="7" ry="20" fill="#E7D9C0" transform="rotate(12 216 368)" />
        <ellipse cx="202" cy="366" rx="7" ry="22" fill="#E7D9C0" transform="rotate(-10 202 366)" />
        <ellipse cx="216" cy="368" rx="3.6" ry="12" fill="#CDB894" transform="rotate(12 216 368)" />
        <ellipse cx="202" cy="366" rx="3.6" ry="13" fill="#CDB894" transform="rotate(-10 202 366)" />
        <circle cx="212" cy="398" r="3" fill="#2B2B2B" />
        <circle cx="206" cy="404" r="2.2" fill="#C66A2B" />
        <circle cx="162" cy="432" r="10" fill="#FBF6EA" />
      </g>
    </svg>
  );
}

function CrowArt() {
  return (
    <svg viewBox="0 0 360 460" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="crow-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EEDFC3" />
          <stop offset="100%" stopColor="#DCC39A" />
        </linearGradient>
        <radialGradient id="crow-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#F5C869" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#F5C869" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="360" height="460" fill="url(#crow-sky)" />
      <circle cx="52" cy="66" r="80" fill="url(#crow-sun)" />
      <circle cx="52" cy="66" r="30" fill="#EBBF74" />

      <path d="M0 396 Q 120 380 240 392 T 360 390 L 360 460 L 0 460 Z" fill="#C9A870" />
      <path d="M0 428 Q 130 414 260 424 T 360 422 L 360 460 L 0 460 Z" fill="#B98E58" />

      <ellipse cx="118" cy="452" rx="14" ry="9" fill="#8A7F74" />
      <ellipse cx="268" cy="456" rx="12" ry="8" fill="#7B7066" />
      <ellipse cx="300" cy="438" rx="10" ry="7" fill="#9C9084" />

      <ellipse cx="180" cy="452" rx="58" ry="12" fill="#2B2B2B" opacity="0.18" />
      <path d="M216 300 C 252 300 262 340 246 372" stroke="#9A4E1F" strokeWidth="12" fill="none" strokeLinecap="round" />
      <path d="M140 330 C 132 372 140 404 168 424 C 190 440 214 440 230 424 C 254 404 258 372 250 330 Z" fill="#C66A2B" />
      <path d="M150 336 C 144 372 150 398 172 416" stroke="#D3772F" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M166 330 L 172 268 L 220 268 L 226 330 Z" fill="#9A4E1F" />

      <ellipse cx="196" cy="268" rx="30" ry="11" fill="#8A4018" />
      <ellipse cx="196" cy="268" rx="25" ry="8.5" fill="#9A4E1F" />
      <ellipse cx="196" cy="269" rx="22" ry="7" fill="#AFC7B4" />
      <path d="M182 267 q 8 3.5 16 2" stroke="#E8F0E6" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.85" />

      <path d="M214 296 h 12" stroke="#AFC7B4" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
      <path d="M214 322 h 12" stroke="#AFC7B4" strokeWidth="5" strokeLinecap="round" opacity="0.55" />

      <ellipse cx="138" cy="452" rx="12" ry="8" fill="#8A7F74" />
      <ellipse cx="160" cy="450" rx="10" ry="7" fill="#9C9084" />
      <ellipse cx="148" cy="442" rx="9" ry="6.5" fill="#7B7066" />

      <g>
        <path d="M186 208 C 170 196 150 194 138 200 C 158 210 170 218 178 226 Z" fill="#33333A" />
        <ellipse cx="200" cy="236" rx="30" ry="20" fill="#2B2B2B" />
        <circle cx="170" cy="218" r="16" fill="#2B2B2B" />
        <path d="M154 214 l -16 7 l 14 8 Z" fill="#D8A84C" />
        <circle cx="166" cy="214" r="3" fill="#F3EADB" />
        <path d="M182 254 l -2 8 M190 254 l 0 9 M198 254 l 2 8" stroke="#2B2B2B" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="146" cy="238" r="7" fill="#8A7F74" />
      </g>
    </svg>
  );
}

function TurtleArt() {
  return (
    <svg viewBox="0 0 360 460" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="turtle-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9D6BF" />
          <stop offset="100%" stopColor="#A8BFA5" />
        </linearGradient>
        <radialGradient id="turtle-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#F5C869" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#F5C869" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="360" height="460" fill="url(#turtle-sky)" />
      <circle cx="66" cy="64" r="66" fill="url(#turtle-sun)" />
      <circle cx="66" cy="64" r="24" fill="#EBBF74" />

      <g fill="#5F7A60" opacity="0.55">
        <circle cx="40" cy="180" r="26" />
        <circle cx="64" cy="176" r="20" />
        <circle cx="318" cy="150" r="24" />
        <circle cx="340" cy="146" r="18" />
        <circle cx="300" cy="360" r="22" />
      </g>

      <path d="M0 350 Q 120 330 240 352 T 360 344 L 360 460 L 0 460 Z" fill="#7C986F" />
      <path d="M40 460 C 60 430 120 420 170 400 C 220 380 300 380 330 360 L 360 460 Z" fill="#E8DCC8" />
      <path d="M60 452 C 90 430 150 414 200 404 C 240 396 300 392 330 382" stroke="#C9A870" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 16" fill="none" opacity="0.7" />

      <g>
        <rect x="104" y="352" width="7" height="44" rx="3" fill="#6B4A2C" />
        <path d="M102 344 L 128 336 L 102 330 Z" fill="#C66A2B" />
      </g>
      <g>
        <rect x="282" y="356" width="7" height="44" rx="3" fill="#6B4A2C" />
        <path d="M280 348 L 306 340 L 280 334 Z" fill="#B8893A" />
      </g>

      <g>
        <ellipse cx="196" cy="432" rx="16" ry="9" fill="#4A6B4C" />
        <ellipse cx="256" cy="434" rx="16" ry="9" fill="#4A6B4C" />
        <ellipse cx="222" cy="408" rx="52" ry="30" fill="#4A6B4C" />
        <ellipse cx="222" cy="400" rx="52" ry="30" fill="#D8A84C" />
        <ellipse cx="222" cy="400" rx="36" ry="19" fill="none" stroke="#B8893A" strokeWidth="5" />
        <path d="M186 400 h 72" stroke="#B8893A" strokeWidth="5" strokeLinecap="round" />
        <path d="M208 386 c 0 14 0 28 0 36" stroke="#B8893A" strokeWidth="5" strokeLinecap="round" />
        <path d="M236 386 c 0 14 0 28 0 36" stroke="#B8893A" strokeWidth="5" strokeLinecap="round" />
        <circle cx="172" cy="402" r="17" fill="#4A6B4C" />
        <circle cx="162" cy="398" r="3" fill="#2B2B2B" />
        <path d="M150 408 q -8 6 -14 18" stroke="#4A6B4C" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

const ARTWORK = {
  moon: MoonArt,
  crow: CrowArt,
  turtle: TurtleArt,
};

export default function StoryCard({ story, index, chapterWord, numeral }) {
  const Artwork = ARTWORK[story.variant] ?? MoonArt;

  return (
    <article
      className="storycard"
      style={{
        "--art-w": story.artSpan,
        "--card-accent": story.accent,
        "--delay": `${0.2 + 0.14 * index}s`,
      }}
    >
      <div className="storycard__art" aria-hidden="true">
        <Artwork />
      </div>

      <div className="storycard__body">
        <span className="storycard__chapter">
          <span className="storycard__medal">{numeral}</span>
          Chapter {chapterWord}
        </span>

        <h2 className="storycard__title">{story.title}</h2>

        <ul className="storycard__meta">
          <li className="storycard__meta--concept">
            <ConceptIcon />
            <span>{story.concept}</span>
          </li>
          <li className="storycard__meta--difficulty">
            <SproutIcon />
            <span>{story.difficulty}</span>
          </li>
          <li>
            <ClockIcon />
            <span>{story.minutes} minutes</span>
          </li>
        </ul>

        <Link to={story.href} className="storycard__cta">
          <span>Read Story</span>
          <span className="storycard__cta-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </Link>
      </div>
    </article>
  );
}

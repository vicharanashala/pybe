import React from 'react';
import { KidProfile } from '../../types/story';

const INK = '#24303C';

interface GermSpec {
  id: string;
  x: number;
  y: number;
  variant: 'coral' | 'green' | 'orange';
  scale: number;
  anim: 'a' | 'b';
}

// Scattered across both palms and fingers in SVG viewBox (0..640 x 0..420)
const HIDDEN_GERMS: GermSpec[] = [
  { id: 'g1', x: 188, y: 248, variant: 'coral', scale: 0.95, anim: 'a' },
  { id: 'g2', x: 222, y: 274, variant: 'green', scale: 0.85, anim: 'b' },
  { id: 'g3', x: 165, y: 205, variant: 'orange', scale: 0.8, anim: 'a' },
  { id: 'g4', x: 204, y: 175, variant: 'coral', scale: 0.72, anim: 'b' },
  { id: 'g5', x: 245, y: 235, variant: 'green', scale: 0.9, anim: 'a' },
  { id: 'g6', x: 180, y: 292, variant: 'orange', scale: 0.78, anim: 'b' },
  { id: 'g7', x: 416, y: 255, variant: 'green', scale: 0.92, anim: 'b' },
  { id: 'g8', x: 452, y: 232, variant: 'coral', scale: 0.88, anim: 'a' },
  { id: 'g9', x: 432, y: 288, variant: 'orange', scale: 0.82, anim: 'a' },
  { id: 'g10', x: 392, y: 218, variant: 'coral', scale: 0.75, anim: 'b' },
  { id: 'g11', x: 468, y: 186, variant: 'green', scale: 0.72, anim: 'a' },
  { id: 'g12', x: 444, y: 152, variant: 'orange', scale: 0.68, anim: 'b' },
  { id: 'g13', x: 228, y: 145, variant: 'green', scale: 0.68, anim: 'a' },
  { id: 'g14', x: 382, y: 270, variant: 'orange', scale: 0.78, anim: 'b' },
];

export function hasGermUnderLens(x: number, y: number): boolean {
  return HIDDEN_GERMS.some((germ) => Math.hypot(germ.x - x, germ.y - y) <= 44);
}

const GermCreature: React.FC<{ germ: GermSpec }> = ({ germ }) => {
  const fill =
    germ.variant === 'coral'
      ? '#D9544D'
      : germ.variant === 'green'
      ? '#3E9A4D'
      : '#E8A33D';

  return (
    <g transform={`translate(${germ.x}, ${germ.y}) scale(${germ.scale})`}>
      <g className={germ.anim === 'a' ? 'animate-germ-a' : 'animate-germ-b'}>
        {/* Wiggly little feelers/arms */}
        <path
          d="M-14 -4 Q-20 -10 -16 -14 M14 -4 Q20 -10 16 -14 M-12 8 Q-18 14 -14 17 M12 8 Q18 14 14 17 M0 -14 L0 -20 M-6 -13 L-9 -19 M6 -13 L9 -19"
          stroke={INK}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {germ.variant === 'coral' && (
          <path
            d="M0 -15 C9 -15 16 -8 15 1 C16 10 9 15 0 14 C-9 15 -16 10 -15 1 C-16 -8 -9 -15 0 -15 Z"
            fill={fill}
            stroke={INK}
            strokeWidth="2.5"
          />
        )}
        {germ.variant === 'green' && (
          <ellipse cx="0" cy="0" rx="15" ry="12" fill={fill} stroke={INK} strokeWidth="2.5" />
        )}
        {germ.variant === 'orange' && (
          <path
            d="M0 -15 L5 -8 L14 -10 L11 -1 L16 7 L7 9 L2 15 L-5 10 L-14 11 L-11 2 L-16 -6 L-7 -8 Z"
            fill={fill}
            stroke={INK}
            strokeWidth="2.3"
            strokeLinejoin="round"
          />
        )}
        {/* Googly cartoon eyes */}
        <circle cx="-5" cy="-2" r="4" fill="#FFFDF7" stroke={INK} strokeWidth="1.8" />
        <circle cx="5" cy="-2" r="4" fill="#FFFDF7" stroke={INK} strokeWidth="1.8" />
        <circle cx="-4.2" cy="-1.5" r="1.7" fill={INK} />
        <circle cx="5.8" cy="-1.5" r="1.7" fill={INK} />
        {/* Tiny cheeky mouth */}
        <path d="M-4 6 Q0 9 4 6" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
    </g>
  );
};

interface HandsArtworkProps {
  kid: KidProfile;
  showMacroDetails?: boolean;
}

const HandsArtwork: React.FC<HandsArtworkProps> = ({ kid, showMacroDetails = false }) => {
  const skin = kid.skinColor;
  const shadow = kid.skinShadow;

  return (
    <g>
      {/* Left Hand (Palm facing up) */}
      <g>
        {/* Wrist & Sleeve Cuff */}
        <rect
          x="156"
          y="330"
          width="88"
          height="66"
          rx="14"
          fill={kid.shirtColor}
          stroke={INK}
          strokeWidth="5"
        />
        <rect
          x="152"
          y="324"
          width="96"
          height="18"
          rx="9"
          fill={kid.accentColor}
          stroke={INK}
          strokeWidth="4.5"
        />

        {/* Hand Palm & Fingers Silhouette */}
        <path
          d="M158 326
             C150 302 142 276 138 250
             C120 242 104 228 96 212
             C88 197 104 185 118 196
             C128 204 136 216 144 226
             L142 152
             C141 136 163 135 165 151
             L169 204
             L173 124
             C173 107 197 107 197 124
             L198 198
             L208 118
             C210 101 234 103 232 120
             L224 202
             L241 140
             C246 124 268 130 263 146
             L244 238
             C248 272 240 304 234 326 Z"
          fill={skin}
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        {/* Palm shadow / creases */}
        <path
          d="M164 252 Q196 244 224 260"
          stroke={shadow}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M172 284 Q198 276 218 292"
          stroke={shadow}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M158 292 Q168 272 174 258"
          stroke={shadow}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </g>

      {/* Right Hand (Palm facing up, mirrored) */}
      <g transform="translate(640, 0) scale(-1, 1)">
        {/* Wrist & Sleeve Cuff */}
        <rect
          x="156"
          y="330"
          width="88"
          height="66"
          rx="14"
          fill={kid.shirtColor}
          stroke={INK}
          strokeWidth="5"
        />
        <rect
          x="152"
          y="324"
          width="96"
          height="18"
          rx="9"
          fill={kid.accentColor}
          stroke={INK}
          strokeWidth="4.5"
        />

        {/* Hand Palm & Fingers Silhouette */}
        <path
          d="M158 326
             C150 302 142 276 138 250
             C120 242 104 228 96 212
             C88 197 104 185 118 196
             C128 204 136 216 144 226
             L142 152
             C141 136 163 135 165 151
             L169 204
             L173 124
             C173 107 197 107 197 124
             L198 198
             L208 118
             C210 101 234 103 232 120
             L224 202
             L241 140
             C246 124 268 130 263 146
             L244 238
             C248 272 240 304 234 326 Z"
          fill={skin}
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        {/* Palm shadow / creases */}
        <path
          d="M164 252 Q196 244 224 260"
          stroke={shadow}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M172 284 Q198 276 218 292"
          stroke={shadow}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M158 292 Q168 272 174 258"
          stroke={shadow}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </g>

      {/* Visual Dirt Overlay based on kid.appearance */}
      {kid.appearance === 'muddy' && (
        <g>
          {/* Left hand heavy mud blobs */}
          <path
            d="M166 232 C178 220 212 224 224 242 C232 256 226 286 206 292 C186 298 164 286 158 264 C154 250 158 238 166 232 Z"
            fill="#6E472B"
            stroke="#4A2E1B"
            strokeWidth="3"
          />
          <ellipse cx="156" cy="176" rx="10" ry="15" fill="#6E472B" />
          <ellipse cx="186" cy="146" rx="9" ry="18" fill="#5B3921" />
          <ellipse cx="218" cy="158" rx="9" ry="14" fill="#6E472B" />
          <circle cx="116" cy="208" r="10" fill="#6E472B" />
          <circle cx="196" cy="264" r="6" fill="#4A2E1B" />
          <circle cx="174" cy="274" r="4.5" fill="#4A2E1B" />
          {/* Tiny grass smudge */}
          <path d="M180 250 L194 242" stroke="#3E9A4D" strokeWidth="4.5" strokeLinecap="round" />

          {/* Right hand heavy mud blobs */}
          <path
            d="M412 246 C428 232 464 236 474 256 C482 272 470 298 446 302 C424 306 404 290 402 268 C400 256 406 250 412 246 Z"
            fill="#6E472B"
            stroke="#4A2E1B"
            strokeWidth="3"
          />
          <ellipse cx="452" cy="142" rx="10" ry="16" fill="#5B3921" />
          <ellipse cx="482" cy="172" rx="9" ry="15" fill="#6E472B" />
          <circle cx="520" cy="210" r="11" fill="#6E472B" />
          <circle cx="424" cy="172" r="8" fill="#6E472B" />
          <circle cx="436" cy="270" r="5" fill="#4A2E1B" />
          <path d="M446 256 L462 264" stroke="#3E9A4D" strokeWidth="4.5" strokeLinecap="round" />
        </g>
      )}

      {kid.appearance === 'smudged' && (
        <g opacity="0.72">
          {/* Left hand dusty smudges */}
          <ellipse cx="194" cy="256" rx="28" ry="18" fill="#7D7268" transform="rotate(-12 194 256)" />
          <ellipse cx="182" cy="276" rx="18" ry="11" fill="#675D54" transform="rotate(18 182 276)" />
          <ellipse cx="154" cy="174" rx="8" ry="13" fill="#7D7268" />
          <ellipse cx="218" cy="154" rx="8" ry="13" fill="#7D7268" />
          <ellipse cx="116" cy="206" rx="9" ry="7" fill="#675D54" />

          {/* Right hand dusty smudges */}
          <ellipse cx="446" cy="264" rx="27" ry="17" fill="#7D7268" transform="rotate(14 446 264)" />
          <ellipse cx="424" cy="238" rx="15" ry="10" fill="#675D54" transform="rotate(-15 424 238)" />
          <ellipse cx="452" cy="148" rx="8" ry="12" fill="#7D7268" />
          <ellipse cx="484" cy="184" rx="8" ry="12" fill="#7D7268" />
        </g>
      )}

      {/* Magnified skin texture + wiggling germs ONLY inside zoomed lens */}
      {showMacroDetails && (
        <g>
          {/* Subtle skin micro-lines visible when zoomed in */}
          <g stroke={shadow} strokeOpacity="0.45" strokeWidth="1.6" strokeLinecap="round">
            <path d="M160 232 Q190 226 220 234" />
            <path d="M168 268 Q195 262 222 272" />
            <path d="M410 236 Q440 228 470 238" />
            <path d="M416 274 Q444 266 472 276" />
          </g>
          {HIDDEN_GERMS.map((germ) => (
            <GermCreature key={germ.id} germ={germ} />
          ))}
        </g>
      )}
    </g>
  );
};

interface KidHandsInspectionProps {
  kid: KidProfile;
  magnifier?: {
    x: number;
    y: number;
    active: boolean;
  };
  pulseMagnifier?: boolean;
  onMagnifierMove?: (x: number, y: number) => void;
  className?: string;
}

export const KidHandsInspection: React.FC<KidHandsInspectionProps> = ({
  kid,
  magnifier,
  pulseMagnifier = false,
  onMagnifierMove,
  className = '',
}) => {
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const dragOffsetRef = React.useRef({ dx: 0, dy: 0 });
  const [isDragging, setIsDragging] = React.useState(false);

  const lensRadius = 86;
  const zoomScale = 2.15;

  React.useEffect(() => {
    return () => {
      document.body.style.userSelect = '';
    };
  }, []);

  const clientToSvg = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (ctm) {
      const pt = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
      return { relX: pt.x, relY: pt.y };
    }
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    return {
      relX: ((clientX - rect.left) / rect.width) * 640,
      relY: ((clientY - rect.top) / rect.height) * 420,
    };
  };

  const moveFromPointer = (clientX: number, clientY: number) => {
    if (!onMagnifierMove) return;
    const coords = clientToSvg(clientX, clientY);
    if (!coords) return;
    const nextTopLeftX = coords.relX - dragOffsetRef.current.dx;
    const nextTopLeftY = coords.relY - dragOffsetRef.current.dy;
    const nextCenterX = Math.max(96, Math.min(544, nextTopLeftX + lensRadius));
    const nextCenterY = Math.max(96, Math.min(340, nextTopLeftY + lensRadius));
    onMagnifierMove(nextCenterX, nextCenterY);
  };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 640 420"
      className={`${className} select-none`}
      style={{ touchAction: 'none', userSelect: 'none' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`${kid.name}'s hands`}
    >
      <defs>
        {magnifier?.active && (
          <clipPath id="magnifier-lens-clip">
            <circle cx={magnifier.x} cy={magnifier.y} r={lensRadius} />
          </clipPath>
        )}
      </defs>

      {/* Clinic Inspection Cushion / Mat */}
      <rect
        x="48"
        y="46"
        width="544"
        height="350"
        rx="34"
        fill="#A8D8E8"
        stroke={INK}
        strokeWidth="5"
      />
      <rect
        x="68"
        y="66"
        width="504"
        height="310"
        rx="24"
        fill="#F5EFE0"
        stroke={INK}
        strokeWidth="4"
      />

      {/* Base Hands (Normal 1x View — Spotless on clean-looking kids!) */}
      <HandsArtwork kid={kid} showMacroDetails={false} />

      {/* Magnified Layer clipped inside the Magnifying Glass Lens */}
      {magnifier?.active && (
        <g clipPath="url(#magnifier-lens-clip)">
          {/* Brighter backlit tint inside lens */}
          <rect x="0" y="0" width="640" height="420" fill="#FFFDF7" />
          <g
            transform={`translate(${magnifier.x}, ${magnifier.y}) scale(${zoomScale}) translate(${-magnifier.x}, ${-magnifier.y})`}
          >
            <rect
              x="68"
              y="66"
              width="504"
              height="310"
              rx="24"
              fill="#F5EFE0"
            />
            <HandsArtwork kid={kid} showMacroDetails={true} />
          </g>
          {/* Glass rim inner shadow */}
          <circle
            cx={magnifier.x}
            cy={magnifier.y}
            r={lensRadius}
            fill="none"
            stroke="#7FC4D6"
            strokeOpacity="0.4"
            strokeWidth="12"
          />
          {/* Curved glass reflection highlight */}
          <path
            d={`M ${magnifier.x - 54} ${magnifier.y - 38} A 62 62 0 0 1 ${magnifier.x + 12} ${magnifier.y - 62}`}
            stroke="#FFFDF7"
            strokeOpacity="0.7"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* Magnifying Glass Frame & Handle (positioned via translate & draggable with pointer capture) */}
      {magnifier?.active && (
        <g
          transform={`translate(${magnifier.x}, ${magnifier.y})`}
          style={{
            touchAction: 'none',
            userSelect: 'none',
            cursor: onMagnifierMove ? (isDragging ? 'grabbing' : 'grab') : 'default',
          }}
          onPointerDown={(e) => {
            if (!onMagnifierMove) return;
            e.preventDefault();
            e.stopPropagation();
            const coords = clientToSvg(e.clientX, e.clientY);
            if (!coords) return;
            const topLeftX = magnifier.x - lensRadius;
            const topLeftY = magnifier.y - lensRadius;
            dragOffsetRef.current = {
              dx: coords.relX - topLeftX,
              dy: coords.relY - topLeftY,
            };
            setIsDragging(true);
            document.body.style.userSelect = 'none';
            try {
              e.currentTarget.setPointerCapture(e.pointerId);
            } catch {
              // ignore if capture is unavailable
            }
          }}
          onPointerMove={(e) => {
            if (!onMagnifierMove || !isDragging) return;
            moveFromPointer(e.clientX, e.clientY);
          }}
          onPointerUp={(e) => {
            if (!isDragging) return;
            setIsDragging(false);
            document.body.style.userSelect = '';
            try {
              e.currentTarget.releasePointerCapture(e.pointerId);
            } catch {
              // ignore if already released
            }
          }}
          onPointerCancel={() => {
            if (!isDragging) return;
            setIsDragging(false);
            document.body.style.userSelect = '';
          }}
        >
          {/* Invisible hit area covering lens + handle for effortless touch/mouse grab */}
          <circle cx={0} cy={0} r={lensRadius + 22} fill="transparent" />
          <g transform="translate(60, 60) rotate(45)">
            <rect x="-10" y="-26" width="118" height="52" rx="22" fill="transparent" />
          </g>

          {/* Gentle pulse ring inviting the learner to drag */}
          {pulseMagnifier && !isDragging && (
            <circle
              cx={0}
              cy={0}
              r={lensRadius + 16}
              fill="none"
              stroke="#E8A33D"
              strokeWidth="6"
              className="animate-lens-pulse pointer-events-none"
            />
          )}
          {/* Handle */}
          <g transform="translate(60, 60) rotate(45)">
            <rect
              x="0"
              y="-14"
              width="98"
              height="28"
              rx="14"
              fill="#D9544D"
              stroke={INK}
              strokeWidth="5"
            />
            <rect
              x="12"
              y="-6"
              width="68"
              height="7"
              rx="3.5"
              fill="#FFFDF7"
              fillOpacity="0.35"
            />
          </g>
          {/* Outer Orange Bezel */}
          <circle
            cx={0}
            cy={0}
            r={lensRadius + 6}
            fill="none"
            stroke={INK}
            strokeWidth="18"
          />
          <circle
            cx={0}
            cy={0}
            r={lensRadius + 6}
            fill="none"
            stroke="#E8A33D"
            strokeWidth="10"
          />
          <circle
            cx={0}
            cy={0}
            r={lensRadius}
            fill="none"
            stroke={INK}
            strokeWidth="4"
          />
        </g>
      )}
    </svg>
  );
};

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ *
 * Reusable illustration primitives for the Everwell Library story.
 * Every character / object is its own component so scenes can place
 * and animate them independently.
 * ------------------------------------------------------------------ */

type CharacterName = "alex" | "sam" | "librarian" | "inspector" | "priya" | "dev";

const CHARACTER_STYLE: Record<
  CharacterName,
  { skin: string; hair: string; cloth: string; cloth2: string; label: string }
> = {
  alex: {
    skin: "var(--skin-warm)",
    hair: "var(--ink)",
    cloth: "var(--character-alex)",
    cloth2: "var(--character-alex-dark)",
    label: "Alex",
  },
  sam: {
    skin: "var(--skin-deep)",
    hair: "var(--ink)",
    cloth: "var(--character-sam)",
    cloth2: "var(--character-sam-dark)",
    label: "Sam",
  },
  librarian: {
    skin: "var(--skin-light)",
    hair: "var(--hair-grey)",
    cloth: "var(--character-librarian)",
    cloth2: "var(--character-librarian-dark)",
    label: "The Librarian",
  },
  inspector: {
    skin: "var(--skin-warm)",
    hair: "var(--ink)",
    cloth: "var(--character-inspector)",
    cloth2: "var(--character-inspector-dark)",
    label: "The Inspector",
  },
  priya: {
    skin: "var(--skin-light)",
    hair: "var(--ink)",
    cloth: "var(--character-priya)",
    cloth2: "var(--character-priya-dark)",
    label: "Priya",
  },
  dev: {
    skin: "var(--skin-deep)",
    hair: "var(--ink)",
    cloth: "var(--character-dev)",
    cloth2: "var(--character-dev-dark)",
    label: "Dev",
  },
};

export function Character({
  name,
  size = 120,
  seated = false,
  holdingBook = false,
  showLabel = true,
  className,
  facing = "right",
}: {
  name: CharacterName;
  size?: number;
  seated?: boolean;
  holdingBook?: boolean;
  showLabel?: boolean;
  className?: string;
  facing?: "left" | "right";
}) {
  const s = CHARACTER_STYLE[name];
  return (
    <figure className={cn("flex flex-col items-center gap-1", className)}>
      <svg
        width={size}
        height={size * 1.25}
        viewBox="0 0 100 125"
        role="img"
        aria-label={s.label}
        style={{ transform: facing === "left" ? "scaleX(-1)" : undefined }}
      >
        {/* shadow */}
        <ellipse cx="50" cy="118" rx="26" ry="5" fill="var(--ink)" opacity="0.12" />
        {/* legs / body */}
        {seated ? (
          <>
            <rect x="34" y="88" width="32" height="14" rx="6" fill={s.cloth2} />
            <rect x="60" y="94" width="24" height="9" rx="4" fill={s.cloth2} />
          </>
        ) : (
          <>
            <rect x="40" y="86" width="8" height="30" rx="4" fill={s.cloth2} />
            <rect x="53" y="86" width="8" height="30" rx="4" fill={s.cloth2} />
          </>
        )}
        {/* torso */}
        <path
          d={
            seated
              ? "M32 56 q18 -10 36 0 l4 34 q-22 8 -44 0 Z"
              : "M31 56 q19 -11 38 0 l4 36 q-23 8 -46 0 Z"
          }
          fill={s.cloth}
        />
        {/* arms */}
        <rect
          x={holdingBook ? "26" : "22"}
          y="62"
          width="9"
          height={holdingBook ? "22" : "30"}
          rx="4.5"
          fill={s.cloth}
          transform={holdingBook ? "rotate(-18 30 70)" : undefined}
        />
        <rect
          x={holdingBook ? "66" : "68"}
          y="62"
          width="9"
          height={holdingBook ? "22" : "30"}
          rx="4.5"
          fill={s.cloth}
          transform={holdingBook ? "rotate(18 70 70)" : undefined}
        />
        {/* head */}
        <circle cx="50" cy="36" r="18" fill={s.skin} />
        {/* hair */}
        {name === "alex" && (
          <path d="M31 36 a19 19 0 0 1 38 0 q-6 -12 -19 -12 t-19 12 Z M28 34 q-4 22 6 30 q-8 -16 -3 -30 Z" fill={s.hair} />
        )}
        {name === "sam" && <path d="M32 33 a18 18 0 0 1 36 0 q-18 -9 -36 0 Z" fill={s.hair} />}
        {name === "librarian" && (
          <>
            <path d="M31 34 a19 19 0 0 1 38 0 q-19 -10 -38 0 Z" fill={s.hair} />
            <circle cx="66" cy="26" r="7" fill={s.hair} />
          </>
        )}
        {name === "inspector" && (
          <>
            <path d="M31 32 a19 19 0 0 1 38 0 q-19 -9 -38 0 Z" fill={s.hair} />
            <rect x="24" y="26" width="52" height="6" rx="3" fill={s.cloth2} />
            <rect x="36" y="16" width="28" height="12" rx="5" fill={s.cloth2} />
          </>
        )}
        {(name === "priya" || name === "dev") && (
          <path d="M32 33 a18 18 0 0 1 36 0 q-18 -10 -36 0 Z" fill={s.hair} />
        )}
        {/* face */}
        <circle cx="43" cy="38" r="2.1" fill="var(--ink)" />
        <circle cx="57" cy="38" r="2.1" fill="var(--ink)" />
        <path d="M45 45 q5 4 10 0" stroke="var(--ink)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {/* glasses for inspector */}
        {name === "inspector" && (
          <g stroke="var(--ink)" strokeWidth="1.6" fill="none">
            <circle cx="43" cy="38" r="6" />
            <circle cx="57" cy="38" r="6" />
            <path d="M49 38 h2" />
          </g>
        )}
        {holdingBook && (
          <g transform="translate(50 76)">
            <rect x="-18" y="-11" width="36" height="22" rx="2.5" fill="var(--book-spine)" />
            <rect x="-15" y="-8" width="30" height="16" rx="1.5" fill="var(--book-page)" />
            <path d="M0 -8 v16" stroke="var(--book-spine)" strokeWidth="1.6" />
          </g>
        )}
      </svg>
      {showLabel && <figcaption className="label-chip">{s.label}</figcaption>}
    </figure>
  );
}

export function PythonAdventureBook({
  size = 90,
  glow = false,
  className,
  title = "The Python Adventure",
  spine = "var(--book-spine)",
}: {
  size?: number;
  glow?: boolean;
  className?: string;
  title?: string;
  spine?: string;
}) {
  return (
    <figure className={cn("flex flex-col items-center gap-2", className)}>
      <svg
        width={size}
        height={size * 1.3}
        viewBox="0 0 70 91"
        role="img"
        aria-label={title}
        className={glow ? "book-glow" : undefined}
      >
        <rect x="6" y="6" width="58" height="80" rx="4" fill={spine} />
        <rect x="14" y="10" width="46" height="72" rx="3" fill="var(--book-page)" />
        <rect x="6" y="6" width="10" height="80" rx="4" fill={spine} />
        <path d="M22 26 q8 -8 16 0 q8 8 16 0" stroke={spine} strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="30" cy="24" r="2" fill={spine} />
        <rect x="22" y="44" width="32" height="3" rx="1.5" fill={spine} opacity="0.45" />
        <rect x="22" y="52" width="24" height="3" rx="1.5" fill={spine} opacity="0.3" />
        <rect x="22" y="60" width="28" height="3" rx="1.5" fill={spine} opacity="0.3" />
      </svg>
      <figcaption className="book-caption">{title}</figcaption>
    </figure>
  );
}

export function Bookshelf({
  width = 220,
  highlightSlot,
  bookMissing = false,
}: {
  width?: number;
  highlightSlot?: boolean;
  bookMissing?: boolean;
}) {
  const spines = ["#8c5a3c", "#4f6f52", "#7a4a63", "#3f5d75", "#a5763f", "#5b5f8a"];
  return (
    <svg width={width} height={width * 0.86} viewBox="0 0 220 190" role="img" aria-label="Bookshelf">
      <rect x="4" y="4" width="212" height="182" rx="6" fill="var(--wood)" />
      <rect x="12" y="12" width="196" height="166" rx="4" fill="var(--wood-dark)" />
      {[0, 1, 2].map((row) => (
        <g key={row}>
          <rect x="14" y={68 + row * 54} width="192" height="7" rx="3" fill="var(--wood)" />
          {Array.from({ length: 9 }).map((_, i) => {
            const isTarget = row === 1 && i === 4;
            if (isTarget && bookMissing) return null;
            const h = 38 + ((i * 7 + row * 5) % 12);
            return (
              <rect
                key={i}
                x={20 + i * 21}
                y={68 + row * 54 - h}
                width={15}
                height={h}
                rx={2}
                fill={isTarget ? "var(--book-spine)" : spines[(i + row) % spines.length]}
                className={isTarget && highlightSlot ? "shelf-target" : undefined}
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

export function ReadingTable({
  width = 300,
  children,
  empty = false,
}: {
  width?: number;
  children?: ReactNode;
  empty?: boolean;
}) {
  return (
    <div className="relative flex flex-col items-center" style={{ width }}>
      <div className="relative flex min-h-[130px] w-full items-end justify-center gap-4">{children}</div>
      <svg width={width} height={90} viewBox="0 0 300 90" role="img" aria-label="Reading table">
        <rect x="10" y="4" width="280" height="14" rx="7" fill="var(--wood)" />
        <rect x="10" y="18" width="280" height="6" rx="3" fill="var(--wood-dark)" />
        <rect x="40" y="24" width="12" height="60" rx="4" fill="var(--wood-dark)" />
        <rect x="248" y="24" width="12" height="60" rx="4" fill="var(--wood-dark)" />
        <ellipse cx="150" cy="86" rx="130" ry="5" fill="var(--ink)" opacity="0.1" />
      </svg>
      <span className={cn("label-chip", empty && "label-chip--muted")}>Reading Table</span>
    </div>
  );
}

export function LibraryWindow({ width = 180 }: { width?: number }) {
  return (
    <svg width={width} height={width * 1.2} viewBox="0 0 180 216" role="img" aria-label="Library window">
      <rect x="6" y="6" width="168" height="204" rx="84" fill="var(--wood)" />
      <rect x="18" y="18" width="144" height="180" rx="72" fill="var(--sky)" />
      <circle cx="118" cy="66" r="20" fill="var(--sun)" opacity="0.85" />
      <path d="M18 150 q40 -34 72 -6 q34 30 72 -4 v58 h-144 Z" fill="var(--foliage)" opacity="0.6" />
      <path d="M90 18 v180 M18 108 h144" stroke="var(--wood)" strokeWidth="8" />
    </svg>
  );
}

export function LibraryBackdrop({ className }: { className?: string }) {
  return (
    <div className={cn("library-backdrop", className)} aria-hidden="true">
      <div className="library-backdrop__row">
        {Array.from({ length: 6 }).map((_, i) => (
          <Bookshelf key={i} width={150} />
        ))}
      </div>
      <div className="library-backdrop__row">
        {Array.from({ length: 6 }).map((_, i) => (
          <Bookshelf key={i} width={130} />
        ))}
      </div>
    </div>
  );
}

export function StickyNote({
  children,
  tone = "yellow",
  rotate = -3,
}: {
  children: ReactNode;
  tone?: "yellow" | "pink";
  rotate?: number;
}) {
  return (
    <div
      className={cn("sticky-note", tone === "pink" && "sticky-note--pink")}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </div>
  );
}

export function ReferenceArrow({
  label,
  tone = "primary",
  direction = "right",
  length = 150,
}: {
  label?: string;
  tone?: "primary" | "muted" | "danger";
  direction?: "right" | "left";
  length?: number;
}) {
  const color =
    tone === "danger" ? "var(--danger)" : tone === "muted" ? "var(--muted-foreground)" : "var(--accent-strong)";
  const id = `arrow-${tone}-${direction}`;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={length} height="26" viewBox={`0 0 ${length} 26`} aria-hidden="true">
        <defs>
          <marker id={id} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill={color} />
          </marker>
        </defs>
        <path
          d={direction === "right" ? `M4 13 H${length - 12}` : `M${length - 4} 13 H12`}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          markerEnd={`url(#${id})`}
          className="arrow-draw"
        />
      </svg>
      {label && <span className="arrow-label">{label}</span>}
    </div>
  );
}

export function CycleArrows({ size = 210 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.55} viewBox="0 0 210 116" aria-hidden="true">
      <defs>
        <marker id="cyc" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto">
          <path d="M0 0 L9 4.5 L0 9 Z" fill="var(--danger)" />
        </marker>
      </defs>
      <path
        d="M18 30 q87 -34 174 0"
        stroke="var(--danger)"
        strokeWidth="3.5"
        fill="none"
        markerEnd="url(#cyc)"
        className="arrow-draw"
      />
      <path
        d="M192 84 q-87 34 -174 0"
        stroke="var(--danger)"
        strokeWidth="3.5"
        fill="none"
        markerEnd="url(#cyc)"
        className="arrow-draw"
      />
    </svg>
  );
}

export function RefCounter({
  value,
  label = "Reference Count",
  tone,
}: {
  value: number;
  label?: string;
  tone?: "zero" | "normal";
}) {
  const zero = tone === "zero" || value === 0;
  return (
    <div className={cn("ref-counter", zero && "ref-counter--zero")}>
      <span className="ref-counter__label">{label}</span>
      <span className="ref-counter__value">{value}</span>
    </div>
  );
}

export function SpeechBubble({ children, speaker }: { children: ReactNode; speaker?: string }) {
  return (
    <div className="speech-bubble">
      {speaker && <span className="speech-bubble__speaker">{speaker}</span>}
      <p className="speech-bubble__text">{children}</p>
    </div>
  );
}

export function StatusPanel({
  rows,
}: {
  rows: { label: string; value: string; tone?: "good" | "warn" | "zero" }[];
}) {
  return (
    <dl className="status-panel">
      {rows.map((r) => (
        <div key={r.label} className="status-panel__row">
          <dt>{r.label}</dt>
          <dd
            className={cn(
              r.tone === "zero" && "text-[var(--danger)]",
              r.tone === "good" && "text-[var(--accent-strong)]",
            )}
          >
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function ObjectBox({
  title,
  items,
  dimmed = false,
  note,
}: {
  title: string;
  items: string[];
  dimmed?: boolean;
  note?: string;
}) {
  return (
    <div className={cn("object-box", dimmed && "object-box--dimmed")}>
      <span className="object-box__title">{title}</span>
      <div className="object-box__cells">
        {items.map((it, i) => (
          <span key={i} className="object-box__cell">
            {it}
          </span>
        ))}
      </div>
      {note && <span className="object-box__note">{note}</span>}
    </div>
  );
}

export function CodeBlock({ lines, activeLine }: { lines: string[]; activeLine?: number }) {
  return (
    <pre className="code-block">
      {lines.map((line, i) => (
        <code key={i} className={cn("code-block__line", activeLine === i && "code-block__line--active")}>
          <span className="code-block__no">{i + 1}</span>
          {line || " "}
        </code>
      ))}
    </pre>
  );
}

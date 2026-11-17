import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Play,
  Trophy,
  Star,
  Lock,
  Compass,
  Wrench,
  Globe2,
  Sparkles,
  RotateCcw,
} from "lucide-react";

/* ============================== PALETTE ============================== */
const C = {
  bg: "#0F1B33",
  bgSoft: "#152546",
  panel: "#1B2C52",
  panelLight: "#25406E",
  panelLine: "#33507F",
  marigold: "#F3A62A",
  marigoldDeep: "#C97E12",
  vermilion: "#E25A34",
  steel: "#AFC0D6",
  steelDim: "#7C8CAA",
  cream: "#FBF1DD",
  leaf: "#4F9A63",
  ink: "#081020",
};

/* ============================ ILLUSTRATIONS ============================ */

function CitySkyline({ tone = "morning" }) {
  const sunY = tone === "morning" ? 92 : 60;
  const bldgs = [
    { x: 8, w: 26, h: 60 },
    { x: 40, w: 18, h: 84 },
    { x: 62, w: 30, h: 46 },
    { x: 96, w: 20, h: 100 },
    { x: 120, w: 26, h: 66 },
    { x: 150, w: 16, h: 90 },
    { x: 170, w: 34, h: 54 },
    { x: 208, w: 20, h: 76 },
    { x: 232, w: 28, h: 44 },
    { x: 264, w: 18, h: 96 },
    { x: 286, w: 24, h: 58 },
  ];
  return (
    <svg viewBox="0 0 320 150" className="w-full h-32 sm:h-40">
      <circle cx="270" cy={sunY} r="26" fill={C.marigold} opacity="0.85" />
      {bldgs.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={150 - b.h}
          width={b.w}
          height={b.h}
          fill={i % 2 === 0 ? C.panelLight : C.panelLine}
        />
      ))}
      {/* string of tiffin lights */}
      {bldgs.slice(0, 6).map((b, i) => (
        <circle key={"l" + i} cx={b.x + b.w / 2} cy={150 - b.h + 8} r="2.5" fill={C.marigold} />
      ))}
      {/* courier silhouette carrying tiffin stack */}
      <g transform="translate(18,108)">
        <circle cx="10" cy="0" r="7" fill={C.ink} />
        <path d="M4 6 L16 6 L14 30 L6 30 Z" fill={C.ink} />
        <circle cx="26" cy="14" r="5" fill="none" stroke={C.ink} strokeWidth="3" />
        <rect x="30" y="4" width="12" height="20" rx="2" fill={C.vermilion} />
        <rect x="30" y="0" width="12" height="4" rx="1" fill={C.marigoldDeep} />
      </g>
      <rect x="0" y="146" width="320" height="4" fill={C.panelLine} />
    </svg>
  );
}

function DepotLedger() {
  return (
    <svg viewBox="0 0 320 150" className="w-full h-32 sm:h-40">
      {/* master ledger */}
      <rect x="20" y="12" width="140" height="126" rx="4" fill={C.panel} stroke={C.panelLine} strokeWidth="2" />
      <rect x="20" y="12" width="140" height="18" fill={C.vermilion} />
      <text x="90" y="25" fontSize="9" fill={C.cream} textAnchor="middle" fontFamily="monospace">
        DEPOT MASTER SHEET
      </text>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1="32" x2="148" y1={44 + i * 15} y2={44 + i * 15} stroke={C.panelLine} strokeWidth="2" />
      ))}
      <text x="90" y="40" fontSize="18" fill={C.marigold} textAnchor="middle" fontFamily="monospace" fontWeight="bold">
        340
      </text>
      {/* one courier's own cart */}
      <rect x="190" y="46" width="110" height="70" rx="4" fill={C.panelLight} stroke={C.marigold} strokeWidth="2" />
      <text x="245" y="60" fontSize="8" fill={C.cream} textAnchor="middle" fontFamily="monospace">
        KIRAN'S CART
      </text>
      {[0, 1].map((i) => (
        <line key={i} x1="200" x2="290" y1={74 + i * 14} y2={74 + i * 14} stroke={C.panelLine} strokeWidth="2" />
      ))}
      <text x="245" y="72" fontSize="16" fill={C.leaf} textAnchor="middle" fontFamily="monospace" fontWeight="bold">
        12
      </text>
      <path d="M162 78 L186 78" stroke={C.steelDim} strokeWidth="2" strokeDasharray="4 3" />
    </svg>
  );
}

function ChainIllustration() {
  const steps = [
    { label: "PICK", color: C.marigold },
    { label: "SORT", color: C.vermilion },
    { label: "HAND", color: C.leaf },
    { label: "DROP", color: C.steel },
  ];
  return (
    <svg viewBox="0 0 320 120" className="w-full h-28 sm:h-32">
      {steps.map((s, i) => (
        <g key={i} transform={`translate(${20 + i * 82},40)`}>
          <circle r="26" fill={C.panel} stroke={s.color} strokeWidth="3" />
          <text y="5" textAnchor="middle" fontSize="10" fill={C.cream} fontFamily="monospace" fontWeight="bold">
            {s.label}
          </text>
          {i < steps.length - 1 && (
            <path d="M28 0 L54 0" stroke={C.steelDim} strokeWidth="2" markerEnd="url(#arrow)" />
          )}
        </g>
      ))}
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.steelDim} />
        </marker>
      </defs>
    </svg>
  );
}

function ChalkSlate() {
  return (
    <svg viewBox="0 0 320 150" className="w-full h-32 sm:h-40">
      <ellipse cx="160" cy="75" rx="120" ry="58" fill={C.panel} stroke={C.steelDim} strokeWidth="3" />
      <ellipse cx="160" cy="75" rx="95" ry="42" fill="none" stroke={C.panelLine} strokeWidth="2" strokeDasharray="3 4" />
      {/* chalk marks: circle, dash, dots — a route code */}
      <circle cx="118" cy="65" r="10" fill="none" stroke={C.marigold} strokeWidth="3" />
      <text x="118" y="69" fontSize="10" fill={C.marigold} textAnchor="middle" fontFamily="monospace">
        BND
      </text>
      <rect x="150" y="58" width="26" height="6" fill={C.vermilion} />
      <text x="163" y="80" fontSize="9" fill={C.vermilion} textAnchor="middle" fontFamily="monospace">
        F6
      </text>
      <circle cx="205" cy="65" r="4" fill={C.leaf} />
      <circle cx="217" cy="65" r="4" fill={C.leaf} />
      <circle cx="229" cy="65" r="4" fill={C.leaf} />
      <text x="217" y="90" fontSize="9" fill={C.leaf} textAnchor="middle" fontFamily="monospace">
        204
      </text>
    </svg>
  );
}

function CrossedCarts() {
  return (
    <svg viewBox="0 0 320 150" className="w-full h-32 sm:h-40">
      <g transform="translate(90,60)">
        <rect x="-30" y="-10" width="60" height="40" rx="6" fill={C.panelLight} stroke={C.marigold} strokeWidth="2" />
        <text y="14" textAnchor="middle" fontSize="9" fill={C.cream} fontFamily="monospace">
          CART A
        </text>
      </g>
      <g transform="translate(190,90)">
        <rect x="-30" y="-10" width="60" height="40" rx="6" fill={C.panelLight} stroke={C.vermilion} strokeWidth="2" />
        <text y="14" textAnchor="middle" fontSize="9" fill={C.cream} fontFamily="monospace">
          CART B
        </text>
      </g>
      <path d="M90 40 L190 60" stroke={C.vermilion} strokeWidth="2" strokeDasharray="4 3" />
      <g transform="translate(140,42)">
        <path d="M0,-16 L14,10 L-14,10 Z" fill={C.vermilion} />
        <text y="6" textAnchor="middle" fontSize="14" fill={C.ink} fontWeight="bold">
          !
        </text>
      </g>
    </svg>
  );
}

function TiffinStack({ count = 0, size = 1 }) {
  const tins = Math.max(count, 1);
  const w = 70 * size;
  const h = 26 * size;
  return (
    <svg viewBox={`0 0 90 ${26 * (tins + 1) + 10}`} width={w} height={h * (tins + 1) * 0.9} style={{ display: "block" }}>
      {Array.from({ length: tins }).map((_, i) => {
        const colors = [C.steel, C.marigold, C.vermilion, C.leaf, C.marigoldDeep];
        const y = 26 * (tins - 1 - i);
        return (
          <g key={i}>
            <rect x="10" y={y + 6} width="70" height="20" rx="3" fill={colors[i % colors.length]} stroke={C.ink} strokeWidth="1" />
            <ellipse cx="45" cy={y + 6} rx="35" ry="5" fill={colors[i % colors.length]} stroke={C.ink} strokeWidth="1" />
          </g>
        );
      })}
      <rect x="40" y={26 * tins - 14} width="10" height="20" rx="2" fill={C.ink} />
    </svg>
  );
}

function FinaleBurst() {
  const dots = [
    [40, 30, C.marigold],
    [80, 15, C.vermilion],
    [130, 35, C.leaf],
    [200, 12, C.marigold],
    [250, 30, C.vermilion],
    [280, 18, C.leaf],
    [20, 60, C.vermilion],
    [300, 55, C.marigold],
  ];
  return (
    <svg viewBox="0 0 320 140" className="w-full h-32 sm:h-40">
      {dots.map(([x, y, col], i) => (
        <circle key={i} cx={x} cy={y} r={5} fill={col} opacity="0.85" />
      ))}
      <g transform="translate(160,90)">
        <TiffinStack count={4} size={1.1} />
      </g>
    </svg>
  );
}

/* ============================== CONTENT DATA ============================== */

const BADGES = {
  scope: { name: "Scope Scout", icon: Compass, color: C.marigold },
  functions: { name: "Function Foreman", icon: Wrench, color: C.leaf },
  closures: { name: "Closure Keeper", icon: Lock, color: C.vermilion },
  global: { name: "Global Guardian", icon: Globe2, color: C.steel },
};

const PAGES = [
  {
    id: 1,
    type: "story",
    title: "Mumbai, 9:00 AM",
    photo: "/images/city-morning.jpg",
    art: <CitySkyline tone="morning" />,
    body: [
      "Somewhere in Andheri, a mother packs a warm dabba for her son Amit, who works six train stops and three streets away in Nariman Point.",
      "She won't carry it herself. A dabbawala will — handing it off to another dabbawala, who hands it to another, none of whom have ever met Amit or his mother.",
      "By 12:30pm, without a single phone call, it lands exactly on Amit's desk. Mumbai's dabbawalas do this for over 200,000 lunchboxes a day, with an error rate so low it's been studied by business schools worldwide.",
      "How does a relay of strangers pull this off, every single day? The answer looks a lot like how Python organizes a program.",
    ],
  },
  {
    id: 2,
    type: "predict",
    title: "The Depot Sheet",
    photo: "/images/depot-sorting.jpg",
    art: <DepotLedger />,
    body: [
      "Every depot keeps one shared master sheet — the day's total dabba count, 340 today. Everyone can see it.",
      "But when courier Kiran sorts his own hand-cart, he keeps a private count just for himself: 12 dabbas, his leg of the journey only.",
      "Rafiq, another courier, sorts his own cart at the very same moment, and also calls his own count 12.",
    ],
    question:
      "Kiran's sort_cart() function creates a variable count = 12. Rafiq's sort_cart() call also creates count = 12, at the same time. Do they collide?",
    choices: [
      "Yes — same depot, so count gets overwritten",
      "No — each call keeps its own private count",
      "Only if they stand next to each other",
      "No — Python renames it to count2 for you",
    ],
    correctIndex: 1,
    explanation:
      "Each function call opens its own local scope. Kiran's count and Rafiq's count live in separate namespaces — Python never confuses them, even though the code looks identical.",
  },
  {
    id: 3,
    type: "concept",
    title: "Concept Reveal — Scope",
    badge: "scope",
    body: [
      "The depot's master sheet is a global variable — created outside any function, visible everywhere.",
      "Each courier's cart is a local variable — created inside a function, and it vanishes the moment that function finishes running.",
      "This is why one courier can never accidentally overwrite another's count, even when their code looks identical.",
    ],
    code: `depot_total = 340        # global — the shared master sheet

def sort_cart():
    count = 12            # local — only exists inside this call
    return count

print(sort_cart())         # 12
print(depot_total)         # 340 — completely untouched`,
  },
  {
    id: 4,
    type: "code",
    title: "Build the Cart",
    art: <DepotLedger />,
    body: ["Fill in the two blanks: one creates the shared depot total, the other keeps Kiran's count local to his own cart."],
    template: `{{a}} = 340   # the shared depot total

def sort_cart():
    {{b}} = 12   # stays local to this cart
    return count

print(sort_cart())
print(depot_total)`,
    blanks: {
      a: { accept: ["depot_total"], hint: "Name the global variable exactly as it's used below: depot_total" },
      b: { accept: ["count"], hint: "The function returns count — name the local variable to match" },
    },
    output: "12\n340",
  },
  {
    id: 5,
    type: "story",
    title: "Pickup → Sort → Handoff → Deliver",
    photo: "/images/relay-handoff.jpg",
    art: <ChainIllustration />,
    body: [
      "No single dabbawala does the whole journey. The relay is broken into four clean jobs: pick the dabba up at home, sort it at the station, hand it to the next courier, and finally deliver it to the right desk.",
      "Each courier does exactly one job, does it well, and passes the result along. Nobody tries to be everything at once.",
    ],
  },
  {
    id: 6,
    type: "predict",
    title: "Predict the Break",
    art: <ChainIllustration />,
    body: [
      "Imagine the pickup courier decided to also read every desk address in the city, sort every dabba by hand, and personally deliver all 340 — all inside one giant pickup() job.",
    ],
    question: "What actually goes wrong if one function tries to do all four jobs at once?",
    choices: [
      "Nothing — Python runs it just as fast either way",
      "It's hard to test, reuse, or fix when it breaks",
      "Python splits it into four functions for you",
      "The tiffin arrives faster with no handoff delay",
    ],
    correctIndex: 1,
    explanation:
      "Small, single-purpose functions are easier to test in isolation, reuse elsewhere, and debug — if delivery is wrong, you check deliver() alone, not one 200-line tangle.",
  },
  {
    id: 7,
    type: "concept",
    title: "Concept Reveal — Functions",
    badge: "functions",
    body: [
      "Each leg of the relay becomes its own small function — a single job, clear inputs, a clear return value.",
      "The dabba itself flows through the chain as the return value of one function becoming the input to the next.",
    ],
    code: `def pickup(dabba, from_home):
    print(f"Picked up {dabba} from {from_home}")
    return dabba

def sort_at_station(dabba, station):
    print(f"Sorted {dabba} at {station}")
    return dabba

def deliver(dabba, desk):
    print(f"Delivered {dabba} to {desk}")`,
  },
  {
    id: 8,
    type: "code",
    title: "Assemble the Chain",
    art: <ChainIllustration />,
    body: ["Wire the relay together. Fill in the two missing function calls so the dabba flows all the way to Amit's desk."],
    template: `dabba = pickup("Amit's lunch", "Andheri")
dabba = {{a}}(dabba, "Dadar Station")
dabba = handoff(dabba, "Rafiq")
{{b}}(dabba, "Desk 204, Nariman Point")`,
    blanks: {
      a: { accept: ["sort_at_station"], hint: "This step happens at a named station" },
      b: { accept: ["deliver"], hint: "This is the very last leg of the relay" },
    },
    output:
      "Picked up Amit's lunch from Andheri\nSorted Amit's lunch at Dadar Station\nHanded Amit's lunch to Rafiq\nDelivered Amit's lunch to Desk 204, Nariman Point",
  },
  {
    id: 9,
    type: "story",
    title: "The Chalk Code",
    photo: "/images/chalk-code.jpg",
    art: <ChalkSlate />,
    body: [
      "At pickup, one courier chalks a code onto the lid: origin station, building, floor. That's it — a few marks in colored chalk.",
      "Three handoffs later, a courier who has never met Amit's mother reads that same chalk mark and knows exactly where Floor 6 is.",
      "The code was written once, by someone who is long gone from the chain — and it's still remembered, faithfully, by whoever reads it next.",
    ],
  },
  {
    id: 10,
    type: "predict",
    title: "Predict the Memory",
    art: <ChalkSlate />,
    body: [
      "In code, imagine assign_route(destination) runs once at pickup and returns a smaller function, deliver_to(dabba). By the time deliver_to() actually runs, assign_route() has already finished completely.",
    ],
    question: "How does deliver_to() still know the destination, if assign_route() already finished running?",
    choices: [
      "Python re-runs assign_route() again each time",
      "destination is captured by deliver_to's closure",
      "destination becomes a global variable instead",
      "It doesn't — calling it later raises an error",
    ],
    correctIndex: 1,
    explanation:
      "deliver_to() is a closure — an inner function that captures the variables of the outer function that created it, and keeps them alive even after the outer function is gone.",
  },
  {
    id: 11,
    type: "concept",
    title: "Concept Reveal — Closures",
    badge: "closures",
    body: [
      "assign_route() runs once, like a courier chalking the lid, and returns deliver_to — a function that still remembers destination.",
      "Every courier down the chain can call that returned function and get the right answer, without ever being told destination directly.",
    ],
    code: `def assign_route(destination):
    def deliver_to(dabba):
        print(f"Delivering {dabba} to {destination}")
    return deliver_to

deliver_to_desk_204 = assign_route("Nariman Point, Floor 6")
deliver_to_desk_204("Amit's lunch")
# → Delivering Amit's lunch to Nariman Point, Floor 6`,
  },
  {
    id: 12,
    type: "code",
    title: "Chalk Your Own Route",
    art: <ChalkSlate />,
    body: ["Complete your own closure: the inner function should use the outer variable, and the outer function should return the inner one."],
    template: `def assign_route(destination):
    def deliver_to(dabba):
        print(f"Delivering {dabba} to {{{a}}}")
    return {{b}}

my_route = assign_route("Bandra, Floor 3")
my_route("Sara's lunch")`,
    blanks: {
      a: { accept: ["destination"], hint: "The inner function reads the outer function's parameter" },
      b: { accept: ["deliver_to"], hint: "The outer function hands back the inner function itself" },
    },
    output: "Delivering Sara's lunch to Bandra, Floor 3",
  },
  {
    id: 13,
    type: "bughunt",
    title: "The Crossed Cart Bug",
    art: <CrossedCarts />,
    body: [
      "Two dabbas briefly share a cart, and someone tries to keep a running delivery count. Click the line that actually crashes.",
    ],
    lines: [
      "route_count = 0",
      "",
      "def log_delivery():",
      "    route_count = route_count + 1",
      "    print(route_count)",
      "",
      "log_delivery()",
    ],
    buggyIndex: 3,
    bugExplanation:
      "Because route_count is assigned inside log_delivery(), Python treats it as a local variable for the whole function — including on the right-hand side, before it's ever been given a local value. That raises UnboundLocalError.",
    fixedCode: `route_count = 0

def log_delivery():
    global route_count
    route_count = route_count + 1
    print(route_count)

log_delivery()`,
  },
  {
    id: 14,
    type: "concept",
    title: "Concept Reveal — global & nonlocal",
    badge: "global",
    body: [
      "Adding global route_count tells Python: don't create a new local variable — reach out and update the depot's shared sheet on purpose.",
      "nonlocal does the same thing, but one level in — for reaching into an enclosing function's variable from a nested one, like a closure.",
      "Both exist for the same reason: sharing mutable state across scopes should always be a deliberate choice, never an accident.",
    ],
    code: `route_count = 0

def log_delivery():
    global route_count      # explicit: I mean to change the shared one
    route_count += 1
    print(route_count)

log_delivery()   # 1
log_delivery()   # 2`,
  },
  {
    id: 15,
    type: "capstone",
    title: "Delivery Day",
    photo: "/images/delivery-desk.jpg",
    art: <FinaleBurst />,
    body: [
      "Everything you've learned, running end to end: local carts, a chain of functions, a chalked closure, and a properly guarded global counter.",
    ],
    code: `route_count = 0

def assign_route(destination):
    def deliver_to(dabba):
        global route_count
        route_count += 1
        print(f"#{route_count}  Delivering {dabba} to {destination}")
    return deliver_to

to_nariman = assign_route("Nariman Point, Floor 6")
to_bandra  = assign_route("Bandra, Floor 3")

to_nariman("Amit's lunch")
to_bandra("Sara's lunch")
to_nariman("Priya's lunch")`,
    outputLines: [
      "#1  Delivering Amit's lunch to Nariman Point, Floor 6",
      "#2  Delivering Sara's lunch to Bandra, Floor 3",
      "#3  Delivering Priya's lunch to Nariman Point, Floor 6",
    ],
  },
];

const TYPE_LABEL = {
  story: "Story",
  predict: "Predict",
  concept: "Concept",
  code: "Code",
  bughunt: "Debug",
  capstone: "Finale",
};
const TYPE_COLOR = {
  story: C.steel,
  predict: C.marigold,
  concept: C.vermilion,
  code: C.leaf,
  bughunt: C.vermilion,
  capstone: C.marigold,
};

function normalize(s) {
  return (s || "").trim().toLowerCase().replace(/\s+/g, " ");
}

// Deterministic shuffle seeded by page id, so the option order is stable
// during a session but the correct answer isn't always in the same spot
// or always the longest-worded choice.
function seededShuffle(arr, seed) {
  const a = arr.map((item, i) => ({ item, i }));
  let s = seed || 1;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ============================== SUBCOMPONENTS ============================== */

function Trail({ pages, current, unlocked, onJump }) {
  const scrollerRef = useRef(null);
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const btn = el.querySelector(`[data-idx="${current}"]`);
    if (btn) btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [current]);

  return (
    <div className="w-full overflow-x-auto pb-2" ref={scrollerRef} style={{ scrollbarWidth: "thin" }}>
      <div className="relative flex items-center gap-5 px-4 py-2 min-w-max">
        <div
          className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[3px] rounded-full"
          style={{ background: C.panelLine }}
        />
        {pages.map((p, i) => {
          const isDone = i < unlocked;
          const isCurrent = i === current;
          const isLocked = i > unlocked;
          const color = TYPE_COLOR[p.type];
          return (
            <button
              key={p.id}
              data-idx={i}
              disabled={isLocked}
              onClick={() => onJump(i)}
              className="relative z-10 flex flex-col items-center gap-1 shrink-0 transition-transform duration-300 ease-out"
              style={{ transform: isCurrent ? "scale(1.15)" : "scale(1)" }}
              title={p.title}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold font-mono transition-all duration-300"
                style={{
                  background: isLocked ? C.panel : isDone ? color : C.bgSoft,
                  border: `2px solid ${isLocked ? C.panelLine : color}`,
                  color: isDone ? C.ink : isLocked ? C.steelDim : color,
                  boxShadow: isCurrent ? `0 0 0 4px ${color}33` : "none",
                  animation: isCurrent ? "tt-marker-in 0.3s ease both, tt-pulse 2s ease infinite" : "none",
                }}
              >
                {isLocked ? <Lock size={12} /> : isDone && !isCurrent ? <CheckCircle2 size={14} /> : i + 1}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BadgeRow({ earned }) {
  const ids = Object.keys(BADGES);
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {ids.map((id) => {
        const b = BADGES[id];
        const Icon = b.icon;
        const has = earned.includes(id);
        return (
          <div
            key={id}
            title={b.name}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: has ? b.color + "22" : "transparent",
              border: `1.5px solid ${has ? b.color : C.panelLine}`,
              opacity: has ? 1 : 0.35,
            }}
          >
            <Icon size={15} color={has ? b.color : C.steelDim} />
          </div>
        );
      })}
    </div>
  );
}

function CodeWithBlanks({ template, blanks, values, onChange, checked, results }) {
  const parts = template.split(/(\{\{\w+\}\})/g);
  return (
    <pre
      className="rounded-xl p-4 text-[13px] sm:text-sm leading-relaxed whitespace-pre-wrap font-mono overflow-x-auto"
      style={{ background: C.ink, color: C.cream, border: `1px solid ${C.panelLine}` }}
    >
      {parts.map((part, i) => {
        const m = part.match(/^\{\{(\w+)\}\}$/);
        if (!m) return <span key={i}>{part}</span>;
        const id = m[1];
        const ok = checked ? results?.[id] : null;
        const underline = ok === true ? C.leaf : ok === false ? C.vermilion : C.marigold + "88";
        return (
          <input
            key={i}
            value={values[id] || ""}
            onChange={(e) => onChange(id, e.target.value)}
            placeholder="___"
            spellCheck={false}
            autoComplete="off"
            className="inline font-mono text-center outline-none bg-transparent"
            style={{
              width: Math.max(60, (values[id]?.length || 3) * 8.6) + "px",
              color: C.marigold,
              border: "none",
              borderBottom: `2px solid ${underline}`,
              padding: "0 2px",
              margin: "0 1px",
              borderRadius: 0,
            }}
          />
        );
      })}
    </pre>
  );
}

function Terminal({ lines, visible }) {
  if (!visible) return null;
  return (
    <div className="rounded-xl p-4 font-mono text-[13px] sm:text-sm mt-3" style={{ background: "#04070D", border: `1px solid ${C.leaf}55` }}>
      <div className="flex items-center gap-1.5 mb-2 opacity-60">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: C.vermilion }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: C.marigold }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: C.leaf }} />
        <span className="ml-2 text-[11px]" style={{ color: C.steelDim }}>
          terminal
        </span>
      </div>
      {lines.map((l, i) => (
        <div
          key={i}
          style={{
            color: C.leaf,
            animation: "tt-fade 0.4s ease both",
            animationDelay: `${i * 140}ms`,
          }}
        >
          {"> "}
          {l}
        </div>
      ))}
    </div>
  );
}

/* ============================== MAIN APP ============================== */

export default function TiffinTrail() {
  const [current, setCurrent] = useState(0);
  const [unlocked, setUnlocked] = useState(0);
  const [xp, setXp] = useState(0);
  const [badges, setBadges] = useState([]);
  const [pageState, setPageState] = useState({});
  const [direction, setDirection] = useState("fwd");
  const [xpBump, setXpBump] = useState(false);
  const prevXp = useRef(0);

  const page = PAGES[current];
  const ps = pageState[page.id] || {};

  useEffect(() => {
    if (xp !== prevXp.current) {
      prevXp.current = xp;
      setXpBump(true);
      const t = setTimeout(() => setXpBump(false), 550);
      return () => clearTimeout(t);
    }
  }, [xp]);

  const patch = (obj) => setPageState((prev) => ({ ...prev, [page.id]: { ...prev[page.id], ...obj } }));

  const awardXp = (amount, key) => {
    if (ps[key]) return;
    setXp((x) => x + amount);
    patch({ [key]: true });
  };

  const goTo = (idx) => {
    if (idx <= unlocked) {
      setDirection(idx >= current ? "fwd" : "back");
      setCurrent(idx);
    }
  };

  const advance = () => {
    const next = Math.min(current + 1, PAGES.length - 1);
    setDirection("fwd");
    setUnlocked((u) => Math.max(u, next));
    setCurrent(next);
  };
  const back = () => {
    setDirection("back");
    setCurrent((c) => Math.max(c - 1, 0));
  };

  const restart = () => {
    setDirection("fwd");
    setCurrent(0);
    setUnlocked(0);
    setXp(0);
    setBadges([]);
    setPageState({});
  };

  /* ---- per-type "can advance" logic ---- */
  let canAdvance = true;
  if (page.type === "predict") canAdvance = ps.selected !== undefined;
  if (page.type === "code") canAdvance = ps.allCorrect === true;
  if (page.type === "concept") canAdvance = ps.claimed === true;
  if (page.type === "bughunt") canAdvance = ps.solved === true;

  /* ---- handlers ---- */
  const selectChoice = (i) => {
    if (ps.selected !== undefined) return;
    patch({ selected: i });
    if (i === page.correctIndex) awardXp(10, "xpGiven");
  };

  const updateBlank = (id, val) => {
    patch({ values: { ...ps.values, [id]: val }, checked: false, allCorrect: false });
  };

  const checkBlanks = () => {
    const values = ps.values || {};
    const results = {};
    let all = true;
    Object.entries(page.blanks).forEach(([id, spec]) => {
      const ok = spec.accept.includes(normalize(values[id]));
      results[id] = ok;
      if (!ok) all = false;
    });
    patch({ checked: true, results, allCorrect: all });
    if (all) awardXp(15, "xpGiven");
  };

  const claimBadge = () => {
    patch({ claimed: true });
    if (page.badge && !badges.includes(page.badge)) {
      setBadges((b) => [...b, page.badge]);
      setXp((x) => x + 20);
    }
  };

  const selectBugLine = (i) => {
    if (ps.solved) return;
    patch({ picked: i, solved: i === page.buggyIndex });
    if (i === page.buggyIndex) awardXp(20, "xpGiven");
  };

  const runCapstone = () => {
    patch({ ran: true });
    awardXp(50, "xpGiven");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center" style={{ background: `radial-gradient(1200px 600px at 50% -10%, ${C.bgSoft}, ${C.bg})` }}>
      <style>{`
        @keyframes tt-fade { from { opacity:0; transform: translateY(-3px);} to {opacity:1; transform: translateY(0);} }
        @keyframes tt-pop { 0% { transform: scale(0.9); opacity:0;} 100%{ transform: scale(1); opacity:1;} }
        @keyframes tt-slide-fwd { 0% { opacity:0; transform: translateX(28px) scale(0.98);} 100% { opacity:1; transform: translateX(0) scale(1);} }
        @keyframes tt-slide-back { 0% { opacity:0; transform: translateX(-28px) scale(0.98);} 100% { opacity:1; transform: translateX(0) scale(1);} }
        @keyframes tt-fade-up { 0% { opacity:0; transform: translateY(10px);} 100% { opacity:1; transform: translateY(0);} }
        @keyframes tt-art-in { 0% { opacity:0; transform: scale(0.94) translateY(6px);} 100% { opacity:1; transform: scale(1) translateY(0);} }
        @keyframes tt-badge-pop { 0% { transform: scale(0.5) rotate(-8deg); opacity:0;} 60% { transform: scale(1.15) rotate(4deg); opacity:1;} 100% { transform: scale(1) rotate(0deg); opacity:1;} }
        @keyframes tt-xp-bump { 0% { transform: scale(1);} 40% { transform: scale(1.28);} 100% { transform: scale(1);} }
        @keyframes tt-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(243,166,42,0.45);} 50% { box-shadow: 0 0 0 7px rgba(243,166,42,0);} }
        @keyframes tt-marker-in { 0% { transform: scale(0.6); opacity:0.4;} 100% { transform: scale(1); opacity:1;} }
      `}</style>

      <div className="w-full max-w-6xl px-3 sm:px-6 pt-6 pb-16">
        {/* header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍱</span>
            <div>
              <h1 className="font-serif text-lg sm:text-xl font-bold tracking-tight" style={{ color: C.cream }}>
                Tiffin Trail
              </h1>
              <p className="text-[11px]" style={{ color: C.steelDim }}>
                Functions · Scope · Closures — a Mumbai dabbawala relay
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BadgeRow earned={badges} />
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-xs font-bold"
              style={{
                background: C.panel,
                color: C.marigold,
                border: `1px solid ${C.panelLine}`,
                animation: xpBump ? "tt-xp-bump 0.5s ease" : "none",
              }}
            >
              <Star size={13} /> {xp} XP
            </div>
          </div>
        </div>

        {/* trail */}
        <div className="rounded-2xl mb-4" style={{ background: C.panel, border: `1px solid ${C.panelLine}` }}>
          <Trail pages={PAGES} current={current} unlocked={unlocked} onJump={goTo} />
        </div>

        {/* page card */}
        <div
          className="rounded-2xl p-5 sm:p-7 overflow-hidden"
          style={{
            background: `linear-gradient(165deg, ${C.panelLight}, ${C.panel} 55%)`,
            border: `1px solid ${C.panelLine}`,
            boxShadow: "0 20px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
            animation: `${direction === "fwd" ? "tt-slide-fwd" : "tt-slide-back"} 0.8s cubic-bezier(0.2,0.8,0.2,1) both`,
          }}
          key={page.id}
        >
          <div
            className="flex items-center gap-2 mb-3"
            style={{ animation: "tt-fade-up 0.4s ease both", animationDelay: "40ms" }}
          >
            <span
              className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
              style={{ color: TYPE_COLOR[page.type], border: `1px solid ${TYPE_COLOR[page.type]}55` }}
            >
              {TYPE_LABEL[page.type]} · Stop {current + 1}/{PAGES.length}
            </span>
          </div>

          <h2
            className="font-serif text-xl sm:text-2xl font-bold mb-4"
            style={{ color: C.cream, animation: "tt-fade-up 0.4s ease both", animationDelay: "90ms" }}
          >
            {page.title}
          </h2>

          {page.photo && (
            <div
              className="mb-3 rounded-xl overflow-hidden relative"
              style={{
                animation: "tt-art-in 0.9s ease both",
                animationDelay: "110ms",
                boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                border: `1px solid ${C.panelLine}`,
              }}
            >
              <img
                src={page.photo}
                alt={page.title}
                className="w-full h-40 sm:h-56 object-cover"
                style={{ display: "block" }}
                onError={(e) => {
                  e.currentTarget.parentElement.style.display = "none";
                }}
              />
              <div
                className="absolute inset-x-0 bottom-0 h-12"
                style={{ background: `linear-gradient(to top, ${C.ink}cc, transparent)` }}
              />
            </div>
          )}

          {page.art && (
            <div
              className="mb-4 rounded-xl overflow-hidden"
              style={{
                background: `linear-gradient(160deg, ${C.bgSoft}, ${C.panel})`,
                animation: "tt-art-in 0.9s ease both",
                animationDelay: "130ms",
                border: `1px solid ${C.panelLine}`,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {page.art}
            </div>
          )}

          {page.body?.map((p, i) => (
            <p
              key={i}
              className="text-sm sm:text-[15px] leading-relaxed mb-2.5"
              style={{ color: C.steel, animation: "tt-fade-up 0.4s ease both", animationDelay: `${180 + i * 80}ms` }}
            >
              {p}
            </p>
          ))}

          {/* ---- PREDICT ---- */}
          {page.type === "predict" && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold mb-2" style={{ color: C.marigold }}>
                {page.question}
              </p>
              {seededShuffle(page.choices, page.id).map(({ item: c, i }) => {
                const selected = ps.selected;
                const isPicked = selected === i;
                const isRight = i === page.correctIndex;
                let border = C.panelLine;
                let bg = C.bgSoft;
                if (selected !== undefined) {
                  if (isRight) {
                    border = C.leaf;
                    bg = C.leaf + "18";
                  } else if (isPicked) {
                    border = C.vermilion;
                    bg = C.vermilion + "18";
                  }
                }
                return (
                  <button
                    key={i}
                    onClick={() => selectChoice(i)}
                    disabled={selected !== undefined}
                    className="w-full text-left px-3.5 py-2.5 rounded-lg text-sm flex items-center justify-between gap-2 transition-all duration-150 hover:enabled:-translate-y-0.5 active:enabled:translate-y-0"
                    style={{
                      background: bg,
                      border: `1.5px solid ${border}`,
                      color: C.cream,
                      animation: "tt-fade-up 0.35s ease both",
                      animationDelay: `${i * 70}ms`,
                    }}
                  >
                    <span>{c}</span>
                    {selected !== undefined && isRight && <CheckCircle2 size={16} color={C.leaf} style={{ animation: "tt-badge-pop 0.4s ease both" }} />}
                    {selected !== undefined && isPicked && !isRight && <XCircle size={16} color={C.vermilion} />}
                  </button>
                );
              })}
              {ps.selected !== undefined && (
                <p
                  className="text-xs mt-2 rounded-lg p-3"
                  style={{ background: C.bgSoft, color: C.steel, animation: "tt-fade-up 0.35s ease both" }}
                >
                  {page.explanation}
                </p>
              )}
            </div>
          )}

          {/* ---- CONCEPT ---- */}
          {page.type === "concept" && (
            <div className="mt-3">
              {page.code && (
                <pre
                  className="rounded-xl p-4 text-[12px] sm:text-sm font-mono overflow-x-auto whitespace-pre"
                  style={{ background: C.ink, color: C.cream, border: `1px solid ${C.panelLine}` }}
                >
                  {page.code}
                </pre>
              )}
              {page.badge && (
                <button
                  onClick={claimBadge}
                  disabled={ps.claimed}
                  className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold font-mono transition-transform duration-150 hover:enabled:scale-105 active:enabled:scale-95"
                  style={{
                    background: ps.claimed ? C.leaf + "22" : BADGES[page.badge].color,
                    color: ps.claimed ? C.leaf : C.ink,
                    border: `1.5px solid ${ps.claimed ? C.leaf : BADGES[page.badge].color}`,
                    animation: ps.claimed ? "tt-badge-pop 0.45s ease both" : "tt-pulse 1.8s ease infinite",
                  }}
                >
                  {ps.claimed ? <CheckCircle2 size={16} /> : <Sparkles size={16} />}
                  {ps.claimed ? `${BADGES[page.badge].name} earned` : `Claim "${BADGES[page.badge].name}" badge`}
                </button>
              )}
            </div>
          )}

          {/* ---- CODE ---- */}
          {page.type === "code" && (
            <div className="mt-3 grid sm:grid-cols-[1fr_220px] gap-3">
              <div>
                <CodeWithBlanks
                  template={page.template}
                  blanks={page.blanks}
                  values={ps.values || {}}
                  onChange={updateBlank}
                  checked={ps.checked}
                  results={ps.results}
                />
                {ps.checked && !ps.allCorrect && (
                  <div className="mt-2 space-y-1">
                    {Object.entries(page.blanks).map(([id, spec]) =>
                      ps.results?.[id] === false ? (
                        <p key={id} className="text-xs" style={{ color: C.vermilion }}>
                          Blank "{id}": {spec.hint}
                        </p>
                      ) : null
                    )}
                  </div>
                )}
                <button
                  onClick={checkBlanks}
                  className="mt-3 px-4 py-2 rounded-full text-sm font-bold font-mono flex items-center gap-2 transition-transform duration-150 hover:scale-105 active:scale-95"
                  style={{ background: C.marigold, color: C.ink }}
                >
                  <Play size={14} /> Check code
                </button>
                <Terminal lines={(page.output || "").split("\n")} visible={ps.allCorrect} />
              </div>

              {/* always-visible hint panel, so learners can reference it while typing */}
              <div
                className="rounded-xl p-3 h-fit"
                style={{ background: C.bgSoft, border: `1px solid ${C.panelLine}` }}
              >
                <p className="text-[10px] font-mono font-bold tracking-wider uppercase mb-2" style={{ color: C.steelDim }}>
                  Hints
                </p>
                <div className="space-y-3">
                  {Object.entries(page.blanks).map(([id, spec]) => (
                    <div key={id}>
                      <p className="text-xs leading-snug" style={{ color: C.steel }}>
                        <span className="font-mono font-bold" style={{ color: C.marigold }}>
                          {id}:
                        </span>{" "}
                        {spec.hint}
                      </p>
                      <p className="text-[11px] mt-1" style={{ color: C.steelDim }}>
                        Type:{" "}
                        <span
                          className="font-mono font-bold px-1.5 py-0.5 rounded"
                          style={{ background: C.panel, color: C.leaf, border: `1px solid ${C.panelLine}` }}
                        >
                          {spec.accept[0]}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---- BUGHUNT ---- */}
          {page.type === "bughunt" && (
            <div className="mt-3">
              <div className="rounded-xl p-4 font-mono text-[13px] sm:text-sm overflow-x-auto" style={{ background: C.ink, border: `1px solid ${C.panelLine}` }}>
                {page.lines.map((line, i) => {
                  const picked = ps.picked;
                  const isBug = i === page.buggyIndex;
                  let bg = "transparent";
                  if (picked !== undefined) {
                    if (isBug) bg = C.leaf + "22";
                    else if (picked === i) bg = C.vermilion + "22";
                  }
                  return (
                    <div
                      key={i}
                      onClick={() => line.trim() && selectBugLine(i)}
                      className="px-2 py-0.5 rounded cursor-pointer whitespace-pre"
                      style={{ background: bg, color: line.trim() ? C.cream : "transparent" }}
                    >
                      <span style={{ color: C.steelDim, marginRight: 10, userSelect: "none" }}>{String(i + 1).padStart(2, "0")}</span>
                      {line || " "}
                    </div>
                  );
                })}
              </div>
              {ps.picked !== undefined && (
                <div className="mt-3 rounded-lg p-3 text-xs" style={{ background: C.bgSoft, color: C.steel }}>
                  {ps.solved ? "✅ " : "Not quite. "} {page.bugExplanation}
                </div>
              )}
              {ps.solved && (
                <pre
                  className="mt-3 rounded-xl p-4 text-[12px] sm:text-sm font-mono overflow-x-auto whitespace-pre"
                  style={{ background: C.ink, color: C.leaf, border: `1px solid ${C.leaf}55` }}
                >
                  {page.fixedCode}
                </pre>
              )}
            </div>
          )}

          {/* ---- CAPSTONE ---- */}
          {page.type === "capstone" && (
            <div className="mt-3">
              <pre
                className="rounded-xl p-4 text-[12px] sm:text-sm font-mono overflow-x-auto whitespace-pre"
                style={{ background: C.ink, color: C.cream, border: `1px solid ${C.panelLine}` }}
              >
                {page.code}
              </pre>
              <button
                onClick={runCapstone}
                disabled={ps.ran}
                className="mt-3 px-5 py-2.5 rounded-full text-sm font-bold font-mono flex items-center gap-2 transition-transform duration-150 hover:enabled:scale-105 active:enabled:scale-95"
                style={{
                  background: C.marigold,
                  color: C.ink,
                  opacity: ps.ran ? 0.6 : 1,
                  animation: ps.ran ? "none" : "tt-pulse 1.8s ease infinite",
                }}
              >
                <Play size={15} /> Run full delivery
              </button>
              <Terminal lines={page.outputLines} visible={ps.ran} />
              {ps.ran && (
                <div className="mt-5 text-center" style={{ animation: "tt-fade-up 0.5s ease both", animationDelay: `${page.outputLines.length * 140 + 150}ms` }}>
                  <div className="flex justify-center mb-2" style={{ animation: "tt-badge-pop 0.5s ease both", animationDelay: `${page.outputLines.length * 140 + 200}ms` }}>
                    <Trophy size={34} color={C.marigold} />
                  </div>
                  <p className="font-serif text-lg font-bold" style={{ color: C.cream }}>
                    Tiffin Trail complete!
                  </p>
                  <p className="text-xs mb-4" style={{ color: C.steelDim }}>
                    {badges.length}/4 badges · {xp} XP total
                  </p>
                  <button
                    onClick={restart}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold transition-transform duration-150 hover:scale-105 active:scale-95"
                    style={{ background: C.panelLight, color: C.cream, border: `1px solid ${C.panelLine}` }}
                  >
                    <RotateCcw size={13} /> Restart trail
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* nav */}
        {page.type !== "capstone" && (
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={back}
              disabled={current === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-mono transition-transform duration-150 hover:enabled:-translate-x-0.5"
              style={{ color: C.steel, opacity: current === 0 ? 0.35 : 1 }}
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              onClick={advance}
              disabled={!canAdvance}
              className="flex items-center gap-1 px-5 py-2.5 rounded-full text-sm font-mono font-bold transition-transform duration-150 hover:enabled:translate-x-0.5 hover:enabled:scale-105 active:enabled:scale-95"
              style={{
                background: canAdvance ? C.vermilion : C.panel,
                color: canAdvance ? C.cream : C.steelDim,
                border: `1px solid ${canAdvance ? C.vermilion : C.panelLine}`,
              }}
            >
              Next stop <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

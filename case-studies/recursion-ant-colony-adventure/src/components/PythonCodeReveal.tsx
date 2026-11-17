// Post-order recursion reveal with three synchronized panels:
//
//   Python Code  |  Call Stack  |  Mini Colony
//
// One shared step index drives all three. build_colony() digs down to the
// rock (descending, pushing frames), then carves each chamber on the way
// back up (unwinding, popping frames) — exactly the post-order shape the
// colony actually built, matching the story's "build the rest first, then
// carve a room on the way back".

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Terminal, Layers, Bug } from 'lucide-react';
import { playSfx } from '@/audio/soundEngine';

interface CodeLine {
  text: string;
  indent: number;
  kind: 'def' | 'keyword' | 'call' | 'comment' | 'text' | 'return';
  note?: string;
}

const CODE: CodeLine[] = [
  { text: 'def build_colony(depth):', indent: 0, kind: 'def', note: 'Build from this depth down' },
  { text: 'if hit_obstacle(depth):', indent: 1, kind: 'keyword', note: 'Base case — the rock stops the digging' },
  { text: 'return', indent: 2, kind: 'return' },
  { text: 'dig_tunnel()', indent: 1, kind: 'call', note: 'Step down one level' },
  { text: 'build_colony(depth + 1)', indent: 1, kind: 'call', note: 'Build the rest of the colony first — recursion!' },
  { text: 'carve_chamber(depth)', indent: 1, kind: 'call', note: 'Then carve a room on the way back up' },
];

const MAX = 6; // the rock sits at depth 6 — the base case, under the queen's chamber

interface RunStep {
  code: number; // CODE index to highlight (-1 = none)
  push?: number; // push build_colony(depth)
  pop?: boolean;
  digTo?: number; // mini-colony shaft grows to this depth
  base?: boolean; // hit the rock
  carveAt?: number; // mini-colony chamber appears at this depth
  done?: boolean;
}

// Depth-first, post-order: dig down, recurse, carve on unwind.
function buildSteps(): RunStep[] {
  const steps: RunStep[] = [{ code: 0, push: 1 }];
  const frame = (d: number) => {
    steps.push({ code: 1 });
    if (d === MAX) {
      steps.push({ code: 2, base: true, pop: true });
      return;
    }
    steps.push({ code: 3, digTo: d + 1 });
    steps.push({ code: 4, push: d + 1 });
    frame(d + 1);
    steps.push({ code: 5, carveAt: d });
    steps.push({ code: 2, pop: true });
  };
  frame(1);
  steps.push({ code: -1, done: true });
  return steps;
}

const STEPS = buildSteps();

const COLORS: Record<CodeLine['kind'], string> = {
  def: 'text-sky-400',
  keyword: 'text-fuchsia-400',
  call: 'text-amber-300',
  comment: 'text-stone-500 italic',
  text: 'text-stone-300',
  return: 'text-rose-400',
};

// --- Mini colony geometry (260x262 viewBox) ---
// Mirrors the main colony: all five chambers sit DIRECTLY on the shaft like
// beads on a string, with the rock base case just below the queen's chamber
// at depth 6 — the same layout as the big colony diagram.
const MINI_X = 130;
const MINI_TOP = 28;
const miniY = (d: number) => MINI_TOP + d * 36;

function statusFor(step: RunStep): { title: string; detail: string; tone: 'amber' | 'emerald' | 'rose' } {
  if (step.done) return { title: 'Colony complete!', detail: 'Every chamber was carved on the way back up.', tone: 'emerald' };
  if (step.base) return { title: `Base case — hit_obstacle(${MAX})`, detail: 'Rock! No diggable soil. Return.', tone: 'rose' };
  if (step.carveAt !== undefined) return { title: `Carving chamber at depth ${step.carveAt}`, detail: 'Post-order: carve after the rest of the colony is built.', tone: 'amber' };
  if (step.push !== undefined) return { title: `Calling build_colony(${step.push})`, detail: 'A new frame is pushed onto the call stack.', tone: 'amber' };
  if (step.digTo !== undefined) return { title: `Digging tunnel to depth ${step.digTo}`, detail: 'Descending toward the rock.', tone: 'amber' };
  if (step.pop) return { title: 'Returning…', detail: 'Frame completes and is popped.', tone: 'amber' };
  return { title: 'Checking hit_obstacle()', detail: 'Is the soil still diggable here?', tone: 'amber' };
}

export default function PythonCodeReveal({ onContinue }: { onContinue: () => void }) {
  const [revealedLines, setRevealedLines] = useState(0);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [stack, setStack] = useState<number[]>([]);
  const [shaftDepth, setShaftDepth] = useState(1);
  const [rockRevealed, setRockRevealed] = useState(false);
  const [carved, setCarved] = useState<number[]>([]);

  // Phase 1: reveal code lines one by one.
  useEffect(() => {
    if (revealedLines >= CODE.length) return;
    const t = window.setTimeout(() => {
      setRevealedLines((n) => n + 1);
      playSfx('click');
    }, 420);
    return () => window.clearTimeout(t);
  }, [revealedLines]);

  // Phase 2: one timer advances all three panels together.
  useEffect(() => {
    if (!running || finished) return;
    if (step >= STEPS.length) return;
    const s = STEPS[step];
    const pushDepth = s.push;
    const digTo = s.digTo;
    const carveAt = s.carveAt;
    const t = window.setTimeout(() => {
      if (pushDepth !== undefined) {
        setStack((prev) => [...prev, pushDepth]);
        playSfx('click');
      }
      if (s.pop) setStack((prev) => prev.slice(0, -1));
      if (digTo !== undefined) {
        setShaftDepth(digTo);
        playSfx('dig');
      }
      if (s.base) {
        setRockRevealed(true);
        playSfx('correct');
      }
      if (carveAt !== undefined) {
        setCarved((prev) => (prev.includes(carveAt) ? prev : [...prev, carveAt]));
        playSfx('chamber');
      }
      if (s.done) {
        setFinished(true);
        playSfx('reveal');
      }
      setStep((n) => n + 1);
    }, 640);
    return () => window.clearTimeout(t);
  }, [running, finished, step]);

  const activeLine = running && !finished ? STEPS[step]?.code ?? -1 : -1;
  // The run timer steps past the final index before `finished` lands, so clamp
  // the status lookup — STEPS[STEPS.length] is undefined and would crash the app.
  const status = statusFor(STEPS[Math.min(step, STEPS.length - 1)]);
  // The shaft stops just above the bedrock, exactly like the real colony.
  const shaftBottom = Math.min(miniY(Math.max(shaftDepth, 1)) + 6, miniY(MAX) - 4);

  const startRun = () => {
    setRunning(true);
    setStack([]);
    setShaftDepth(1);
    setRockRevealed(false);
    setCarved([]);
    setStep(0);
    setFinished(false);
    playSfx('click');
  };

  const reset = () => {
    setRunning(false);
    setStack([]);
    setShaftDepth(1);
    setRockRevealed(false);
    setCarved([]);
    setStep(0);
    setFinished(false);
    playSfx('click');
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-4 flex items-center gap-2 text-amber-300">
        <Terminal className="h-5 w-5" />
        <span className="text-sm font-semibold uppercase tracking-wider">From Ants to Python</span>
      </div>
      <p className="mb-4 text-stone-300">
        The colony you watched is exactly this function. <span className="text-amber-200">build_colony</span> digs a tunnel,
        then calls <span className="text-amber-200">itself</span> deeper — and only on the way back up does it carve a chamber.
        That is <span className="text-amber-200">post-order</span>: build the rest first, then make a room.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Python Code */}
        <div className="overflow-hidden rounded-xl border border-stone-700 bg-[#0d1117] shadow-xl">
          <div className="flex items-center gap-2 border-b border-stone-700 bg-stone-800/60 px-3 py-2">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="ml-2 text-xs text-stone-400">colony.py</span>
          </div>
          <div className="p-3 font-mono text-[13px] leading-7">
            {CODE.map((line, i) => {
              const shown = i < revealedLines;
              const active = i === activeLine;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: shown ? 1 : 0, x: shown ? 0 : -8 }}
                  transition={{ duration: 0.25 }}
                  className={`flex rounded px-2 ${active ? 'bg-amber-400/10 ring-1 ring-amber-400/30' : ''}`}
                >
                  <span className="mr-2 w-4 select-none text-right text-stone-600">{i + 1}</span>
                  <span className="whitespace-pre" style={{ paddingLeft: line.indent * 16 }}>
                    <span className={COLORS[line.kind]}>{line.text || '\u00A0'}</span>
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Call Stack */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-stone-700 bg-stone-900/80 shadow-xl">
          <div className="flex items-center gap-2 border-b border-stone-700 bg-stone-800/60 px-3 py-2">
            <Layers className="h-4 w-4 text-amber-300" />
            <span className="text-xs text-stone-400">Call Stack</span>
            {finished && <span className="ml-auto text-xs text-emerald-400">unwound</span>}
          </div>
          <div className="flex h-[190px] flex-col-reverse gap-1.5 overflow-y-auto p-3">
            <AnimatePresence>
              {stack.length === 0 && !running && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="m-auto text-center text-xs text-stone-500"
                >
                  Press Run to watch the recursion unfold.
                </motion.p>
              )}
              {stack.map((d, i) => {
                const isTop = i === stack.length - 1;
                const isBase = d === MAX;
                return (
                  <motion.div
                    key={`${i}-${d}`}
                    layout
                    initial={{ opacity: 0, x: 30, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -30, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    className={`rounded-lg border px-3 py-1.5 font-mono text-xs ${
                      isBase
                        ? 'border-rose-400/50 bg-rose-500/10 text-rose-200'
                        : isTop && running
                          ? 'border-amber-400/60 bg-amber-500/15 text-amber-100'
                          : 'border-amber-400/40 bg-amber-500/10 text-amber-100'
                    }`}
                  >
                    <span className="font-semibold">build_colony({d})</span>
                    {isTop && !finished && <span className="ml-2 text-stone-400">running…</span>}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <div className="flex gap-2 border-t border-stone-700 p-3">
            {!running && !finished && (
              <button
                onClick={startRun}
                disabled={revealedLines < CODE.length}
                className="flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:bg-amber-400 disabled:opacity-40"
              >
                <Play className="h-4 w-4" /> Run
              </button>
            )}
            {(running || finished) && (
              <button
                onClick={reset}
                className="flex items-center gap-1.5 rounded-full border border-stone-600 px-4 py-2 text-sm text-stone-200 transition hover:bg-stone-800"
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            )}
            {finished && (
              <button
                onClick={onContinue}
                className="ml-auto rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-stone-900 transition hover:bg-emerald-400"
              >
                Continue
              </button>
            )}
          </div>
        </div>

        {/* Mini Colony (post-order trace) */}
        <div className="overflow-hidden rounded-xl border border-stone-700 bg-stone-900/80 shadow-xl">
          <div className="flex items-center gap-2 border-b border-stone-700 bg-stone-800/60 px-3 py-2">
            <Bug className="h-4 w-4 text-amber-300" />
            <span className="text-xs text-stone-400">Mini Colony</span>
          </div>
          <svg viewBox="0 0 260 262" className="h-[190px] w-full" preserveAspectRatio="xMidYMid meet">
            <rect x={0} y={0} width={260} height={28} fill="#1b3a2b" />
            <rect x={0} y={24} width={260} height={8} fill="#2f4a2e" />
            <rect x={0} y={28} width={260} height={234} fill="#4a3320" />
            {/* shaft */}
            <motion.path
              key={`shaft-${shaftBottom}`}
              d={`M ${MINI_X} ${28} L ${MINI_X} ${shaftBottom}`}
              stroke="#1d1208"
              strokeWidth={7}
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
            {/* rock at the base case */}
            {rockRevealed && (
              <motion.path
                d={`M ${MINI_X - 30} ${miniY(MAX) + 6} L ${MINI_X - 14} ${miniY(MAX) - 6} L ${MINI_X + 8} ${miniY(MAX)} L ${MINI_X + 26} ${miniY(MAX) - 8} L ${MINI_X + 34} ${miniY(MAX) + 8} L ${MINI_X - 30} ${miniY(MAX) + 10} Z`}
                fill="#4a4a52"
                stroke="#2b2b31"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              />
            )}
            {/* carved chambers appear in post-order (queen at d5 first, then up) */}
            {[1, 2, 3, 4, 5].map((d) =>
              carved.includes(d) ? (
                <motion.g
                  key={`mc-${d}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  style={{ transformOrigin: `${MINI_X}px ${miniY(d)}px` }}
                >
                  <ellipse cx={MINI_X} cy={miniY(d)} rx={17} ry={11} fill="#7a5a38" stroke="#caa46a" strokeWidth={1} />
                  <text x={MINI_X} y={miniY(d) + 3} textAnchor="middle" fontSize={6.5} fill="#e8d9bf" fontWeight="bold">
                    d{d}
                  </text>
                </motion.g>
              ) : null,
            )}
            {/* entrance dot */}
            <circle cx={MINI_X} cy={28} r={4} fill="#caa46a" />
          </svg>
          {/* live status caption */}
          <div className="border-t border-stone-700 px-3 py-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                <p className={`text-xs font-semibold ${status.tone === 'rose' ? 'text-rose-300' : status.tone === 'emerald' ? 'text-emerald-300' : 'text-amber-200'}`}>
                  {status.title}
                </p>
                <p className="text-[11px] text-stone-400">{status.detail}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mapping hint: code ↔ ants */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 grid gap-2 text-xs text-stone-400 sm:grid-cols-3"
      >
        <div className="rounded-lg border border-stone-700 bg-stone-900/60 p-2.5">
          <span className="text-sky-400">def build_colony</span> = the colony-building behavior
        </div>
        <div className="rounded-lg border border-stone-700 bg-stone-900/60 p-2.5">
          <span className="text-amber-300">build_colony(depth + 1)</span> = build the rest first, then carve (post-order)
        </div>
        <div className="rounded-lg border border-stone-700 bg-stone-900/60 p-2.5">
          <span className="text-rose-400">if hit_obstacle(depth)</span> = the rock — the base case that stops the digging
        </div>
      </motion.div>
    </div>
  );
}

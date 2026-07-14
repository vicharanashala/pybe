// src/pytutor/PythonPracticeWidget.jsx
//
// The real, run-it-yourself Python coding area for a concept's practice
// step. Ported from the standalone "trial3_pytutor_v4" project (its
// App.tsx / QuestionCard / InlineVisualizer), converted to plain JSX to
// match the rest of this codebase.
//
// IMPORTANT: this component never talks to a backend for code execution.
// Python runs entirely in the browser via Pyodide (WebAssembly), loaded
// lazily by a Web Worker (public/pyodide-worker.js) the first time a
// learner opens this widget for a concept. There is no second (Python)
// server anywhere — the existing Node/Express API is untouched.
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, FlaskConical, ChevronDown, ChevronUp,
  SkipBack, SkipForward, ChevronLeft, ChevronRight, Folder, Layers,
  Package, Terminal, Globe, ArrowRight, Lightbulb, CornerDownLeft,
  PhoneCall, AlertTriangle, Loader2, RefreshCw, Boxes, CheckCircle2,
  Check, X, BookOpen, Lock,
} from 'lucide-react';
import { getQuestions } from './data/questions';
import { getBuiltinDesc } from './data/builtins';
import api from '../utils/api';

// ─── Helpers ─────────────────────────────────────────────────────────────
function getConditionType(src) {
  const t = src.trimStart();
  if (t.startsWith('if ')) return 'if';
  if (t.startsWith('elif ')) return 'elif';
  if (t.startsWith('while ')) return 'while';
  if (t.startsWith('for ')) return 'for';
  return null;
}
function evalCondition(steps, idx) {
  const cur = steps[idx];
  const next = steps[idx + 1];
  if (!next || !cur.line || !next.line) return null;
  if (!getConditionType(cur.source_line ?? '')) return null;
  return next.line > cur.line;
}
function quickAnnotation(step, allSteps, idx) {
  const { event, source_line: src = '', line, exception } = step;
  if (exception) return `${exception}`;
  const t = src.trim();
  if (event === 'call') {
    const fn = step.frames.at(-1)?.name ?? '?';
    if (fn === '<module>') return 'Program starts';
    const methodMatch = t.match(/\.([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
    const methodName = methodMatch?.[1] ?? null;
    const desc = getBuiltinDesc(methodName ?? fn);
    if (desc) return `${methodName ?? fn}() — ${desc}`;
    return `Calling: ${fn}()`;
  }
  if (event === 'return') {
    const fn = step.frames.at(-1)?.name ?? '?';
    const methodMatch = t.match(/\.([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
    const methodName = methodMatch?.[1] ?? null;
    const desc = getBuiltinDesc(methodName ?? fn);
    if (desc) return `${methodName ?? fn}() done — ${desc}`;
    return `Returning from ${fn}()`;
  }
  const ct = getConditionType(src);
  if (ct) {
    const r = evalCondition(allSteps, idx);
    if (r === true) return `Condition TRUE — ${ct === 'for' ? 'entering loop body' : 'taking the "if" branch'}`;
    if (r === false) return `Condition FALSE — ${ct === 'for' ? 'loop ended' : 'skipping the "if" block'}`;
  }
  if (t.startsWith('return ')) return `return ${t.slice(7)}`;
  if (t.startsWith('print(')) return `Printing output`;
  if (t.startsWith('def ')) return `Defining function`;
  if (t.includes('=') && !t.startsWith('#')) return `Assigning: ${t.split('=')[0].trim()}`;
  return `Line ${line}`;
}
function annotationIcon(step) {
  if (step.exception) return AlertTriangle;
  if (step.event === 'call') return PhoneCall;
  if (step.event === 'return') return CornerDownLeft;
  return ArrowRight;
}
function pseudoAddr(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return '0x' + ('0000000' + h.toString(16)).slice(-8);
}

// ─── Val / heap rendering ────────────────────────────────────────────────
function Val({ v, heap, depth = 0 }) {
  if (!v) return <span className="text-slate-500">?</span>;
  if (v.type === 'primitive') {
    if (v.subtype === 'str') return <span className="text-emerald-700">"{v.value}"</span>;
    if (v.subtype === 'bool') return <span className={v.value ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>{v.value ? 'True' : 'False'}</span>;
    if (v.subtype === 'none') return <span className="text-slate-500">None</span>;
    return <span className="text-sky-600">{String(v.value)}</span>;
  }
  if (v.type === 'ref') {
    const obj = heap[v.id];
    if (!obj || depth > 2) return <span className="text-amber-600 text-xs italic">[obj]</span>;
    return <HeapInline obj={obj} heap={heap} depth={depth} />;
  }
  return <span className="text-slate-500 text-xs">{JSON.stringify(v)}</span>;
}
function HeapInline({ obj, heap, depth }) {
  const d = depth + 1;
  if (obj.type === 'list' || obj.type === 'tuple') {
    const [o, c] = obj.type === 'list' ? ['[', ']'] : ['(', ')'];
    return (
      <span>
        <span className="text-slate-500">{o}</span>
        {obj.value.map((v, i) => (
          <span key={i}>{i > 0 && <span className="text-slate-600">, </span>}<Val v={v} heap={heap} depth={d} /></span>
        ))}
        <span className="text-slate-500">{c}</span>
      </span>
    );
  }
  if (obj.type === 'dict') {
    return (
      <span>
        <span className="text-slate-500">{'{'}</span>
        {obj.value.map(([k, v], i) => (
          <span key={i}>{i > 0 && <span className="text-slate-600">, </span>}<Val v={k} heap={heap} depth={d} /><span className="text-slate-600">: </span><Val v={v} heap={heap} depth={d} /></span>
        ))}
        <span className="text-slate-500">{'}'}</span>
      </span>
    );
  }
  if (obj.type === 'function') return <span className="text-violet-600">fn:{obj.value}</span>;
  return <span className="text-amber-700">{obj.type.replace('instance:', '')}(…)</span>;
}

const HEAP_THEME = {
  list: { border: 'border-amber-600/60', tab: 'bg-amber-700/80', tabText: 'text-amber-50' },
  tuple: { border: 'border-amber-600/60', tab: 'bg-amber-700/60', tabText: 'text-amber-50' },
  set: { border: 'border-orange-600/60', tab: 'bg-orange-700/80', tabText: 'text-orange-50' },
  dict: { border: 'border-teal-600/60', tab: 'bg-teal-700/80', tabText: 'text-teal-50' },
  function: { border: 'border-violet-500/60', tab: 'bg-violet-700/80', tabText: 'text-violet-50' },
  instance: { border: 'border-amber-500/60', tab: 'bg-amber-700/70', tabText: 'text-amber-50' },
};
function HeapCard({ id, obj, heap }) {
  const base = obj.type.startsWith('instance:') ? 'instance' : obj.type;
  const label = obj.type.startsWith('instance:') ? obj.type.replace('instance:', '') : obj.type.toUpperCase();
  const theme = HEAP_THEME[base] ?? HEAP_THEME.instance;
  if (obj.type === 'list' || obj.type === 'tuple' || obj.type === 'set') {
    const items = obj.value;
    return (
      <div className={`rounded-lg overflow-hidden border ${theme.border} bg-ink-800 font-mono text-xs`}>
        <div className={`flex items-center justify-between px-2.5 py-1 ${theme.tab}`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.tabText}`}>{label}</span>
          <span className={`text-[10px] ${theme.tabText} opacity-70`}>{pseudoAddr(id)}</span>
        </div>
        {items.length === 0 ? (
          <div className="px-3 py-2 text-slate-500 italic">empty</div>
        ) : (
          <div className="flex">
            {items.slice(0, 5).map((v, i) => (
              <div key={i} className="flex flex-col border-r border-slate-200 min-w-[34px]">
                {obj.type !== 'set' && <div className="text-center text-[9px] py-0.5 border-b border-slate-200 text-slate-500">{i}</div>}
                <div className="text-center text-slate-800 py-1 px-1"><Val v={v} heap={heap} /></div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className={`rounded-lg overflow-hidden border ${theme.border} bg-ink-800 font-mono text-xs`}>
      <div className={`flex items-center justify-between px-2.5 py-1 ${theme.tab}`}>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.tabText}`}>{label}</span>
        <span className={`text-[10px] ${theme.tabText} opacity-70`}>{pseudoAddr(id)}</span>
      </div>
      <div className="p-2 space-y-1">
        {obj.type === 'dict' && obj.value.map(([k, v], i) => (
          <div key={i} className="flex gap-1.5"><Val v={k} heap={heap} /><span className="text-slate-500">→</span><Val v={v} heap={heap} /></div>
        ))}
        {obj.type === 'function' && <span className="text-violet-600">{obj.value}</span>}
        {obj.type.startsWith('instance:') && Object.entries(obj.value).map(([k, v]) => (
          <div key={k} className="flex gap-1.5"><span className="text-amber-700 font-semibold">{k}</span><span className="text-slate-500">=</span><Val v={v} heap={heap} /></div>
        ))}
      </div>
    </div>
  );
}

// ─── Code panel ──────────────────────────────────────────────────────────
function CodePanel({ program, steps, idx }) {
  const lines = program.split('\n');
  const cur = steps[idx];
  const curLine = cur?.line ?? -1;
  const isCondLine = curLine > 0 && getConditionType(cur?.source_line ?? '') !== null;
  const condResult = evalCondition(steps, idx);
  const visited = new Set();
  for (let i = 0; i < idx; i++) { const l = steps[i].line; if (l && l !== curLine) visited.add(l); }
  const activeRef = useRef(null);
  useEffect(() => { activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, [curLine]);
  return (
    <div className="font-mono text-[13px] h-full overflow-auto py-1">
      {lines.map((line, i) => {
        const ln = i + 1, isActive = ln === curLine, wasRan = visited.has(ln) && !isActive;
        return (
          <div key={i} ref={isActive ? activeRef : null}
            className={`flex items-center gap-0 leading-7 border-l-2 ${isActive ? 'bg-cyan-400/15 border-cyan-400' : 'border-transparent'}`}>
            <div className="w-6 flex items-center justify-center shrink-0">
              {isActive ? <Play size={11} className="text-cyan-600 fill-cyan-600" /> : <span className="invisible text-xs">▷</span>}
            </div>
            <span className={`w-5 text-right text-xs select-none shrink-0 ${isActive ? 'text-cyan-700' : 'text-slate-600'}`}>{ln}</span>
            <pre className={`pl-3 whitespace-pre flex-1 ${isActive ? 'text-slate-900 font-semibold' : wasRan ? 'text-slate-500' : 'text-slate-400'}`}>{line || ' '}</pre>
            {isActive && isCondLine && condResult !== null && (
              <span className={`mr-2 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${condResult ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                {condResult ? <><Check size={10} className="inline" /> True</> : <><X size={10} className="inline" /> False</>}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Frame card ──────────────────────────────────────────────────────────
function FrameCard({ frame, heap, isActive }) {
  return (
    <div className={`rounded-lg overflow-hidden border ${frame.is_global ? 'border-cyan-800/50' : 'border-violet-700/50'} bg-ink-800`}>
      <div className={`px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-semibold ${frame.is_global ? 'bg-cyan-900/40 text-cyan-700' : 'bg-violet-900/40 text-violet-100'}`}>
        {frame.is_global ? <Globe size={13} /> : <Boxes size={13} />}
        {frame.is_global ? 'Global' : `${frame.name}()`}
        {isActive && !frame.is_global && <span className="text-[9px] bg-violet-500 px-1.5 py-0.5 rounded-full ml-auto">active</span>}
      </div>
      <div className="px-2.5 py-2">
        {Object.keys(frame.locals).length === 0 ? (
          <span className="text-slate-500 text-xs italic">empty</span>
        ) : (
          <div className="space-y-1">
            {Object.entries(frame.locals).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2 text-xs font-mono">
                <span className="text-cyan-700 font-semibold shrink-0">{k}</span>
                <span className="text-slate-600 shrink-0">→</span>
                <span className="text-slate-700 truncate"><Val v={v} heap={heap} /></span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Scrubber ────────────────────────────────────────────────────────────
function Scrubber({ idx, max, onChange }) {
  const pct = max > 0 ? (idx / max) * 100 : 0;
  return (
    <div className="relative flex-1 h-1.5 rounded-full bg-ink-600 overflow-visible">
      <div className="absolute inset-y-0 left-0 rounded-full bg-cyan-400" style={{ width: `${pct}%` }} />
      <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyan-300" style={{ left: `calc(${pct}% - 5px)` }} />
      <input type="range" min={0} max={max} value={idx}
        onChange={e => onChange(Number(e.target.value))}
        className="pytutor-scrubber absolute inset-0 w-full h-full" />
    </div>
  );
}

// ─── Inline Visualizer ───────────────────────────────────────────────────
const EVENT_BADGE = {
  call: 'bg-cyan-600/90 text-white', line: 'bg-ink-600 text-slate-700 border border-ink-500',
  return: 'bg-cyan-700/90 text-white', exception: 'bg-rose-600 text-white',
};

function InlineVisualizer({ trace, onClose }) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (!playing) return;
    if (idx >= trace.steps.length - 1) { setPlaying(false); return; }
    timer.current = setTimeout(() => setIdx(i => i + 1), 400);
    return () => clearTimeout(timer.current);
  }, [playing, idx, trace]);

  useEffect(() => {
    const h = (e) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setIdx(i => Math.min(i + 1, trace.steps.length - 1));
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setIdx(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [trace]);

  const step = trace.steps[idx];
  const ann = quickAnnotation(step, trace.steps, idx);
  const AnnIcon = annotationIcon(step);

  return (
    <div className="border border-cyan-900/40 rounded-xl overflow-hidden mt-3">
      <div className="flex items-center gap-2 px-3 py-2 bg-ink-850 border-b border-cyan-900/30 flex-wrap gap-y-1">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide shrink-0 ${EVENT_BADGE[step.event] ?? 'bg-ink-600 text-slate-700 border border-ink-500'}`}>{step.event}</span>
        {step.line && <span className="text-slate-500 text-xs shrink-0">line {step.line}</span>}
        <Scrubber idx={idx} max={trace.steps.length - 1} onChange={i => { setIdx(i); setPlaying(false); }} />
        <span className="text-slate-500 text-xs shrink-0 tabular-nums">{idx + 1}/{trace.steps.length}</span>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => { setIdx(0); setPlaying(false); }} disabled={idx === 0} className="p-1 rounded bg-ink-700 hover:bg-ink-600 disabled:opacity-30 text-slate-600"><SkipBack size={12} /></button>
          <button onClick={() => { setIdx(i => Math.max(i - 1, 0)); setPlaying(false); }} disabled={idx === 0} className="p-1 rounded bg-ink-700 hover:bg-ink-600 disabled:opacity-30 text-slate-600"><ChevronLeft size={12} /></button>
          {playing
            ? <button onClick={() => setPlaying(false)} className="p-1 rounded-full bg-cyan-500 text-ink-950"><RefreshCw size={12} /></button>
            : <button onClick={() => setPlaying(true)} disabled={idx >= trace.steps.length - 1} className="p-1 rounded-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-ink-950"><Play size={12} className="fill-ink-950" /></button>}
          <button onClick={() => { setIdx(i => Math.min(i + 1, trace.steps.length - 1)); setPlaying(false); }} disabled={idx >= trace.steps.length - 1} className="p-1 rounded bg-ink-700 hover:bg-ink-600 disabled:opacity-30 text-slate-600"><ChevronRight size={12} /></button>
          <button onClick={() => { setIdx(trace.steps.length - 1); setPlaying(false); }} disabled={idx >= trace.steps.length - 1} className="p-1 rounded bg-ink-700 hover:bg-ink-600 disabled:opacity-30 text-slate-600"><SkipForward size={12} /></button>
        </div>
        <button onClick={onClose} className="ml-1 text-slate-500 hover:text-slate-600 text-xs border border-ink-600 px-2 py-0.5 rounded"><X size={12} /></button>
      </div>

      <div className={`px-3 py-1 text-xs font-medium flex items-center gap-2 border-b ${step.exception ? 'bg-rose-950/40 text-rose-600 border-rose-900/40' : 'bg-ink-850/70 text-cyan-700 border-cyan-900/30'}`}>
        <AnnIcon size={12} className="shrink-0" /> {ann}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1.2fr_1fr_1fr]" style={{ minHeight: '260px' }}>
        <div className="flex flex-col border-r border-ink-700 overflow-hidden">
          <div className="px-2 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-widest bg-ink-850 border-b border-ink-700 shrink-0 flex items-center gap-1">
            <Folder size={11} className="text-cyan-600" /> Code
          </div>
          <div className="flex-1 overflow-auto bg-ink-800" style={{ maxHeight: 220 }}>
            <CodePanel program={trace.program} steps={trace.steps} idx={idx} />
          </div>
          <div className="border-t border-ink-700 shrink-0 h-20 flex flex-col">
            <div className="px-2 py-0.5 text-[10px] font-semibold text-slate-500 uppercase tracking-widest bg-ink-850 border-b border-ink-700 shrink-0 flex items-center gap-1">
              <Terminal size={11} className="text-cyan-600" /> Output
            </div>
            <pre className="flex-1 p-2 text-slate-800 font-mono text-xs leading-5 whitespace-pre-wrap overflow-auto bg-ink-800">
              {step.stdout || <span className="text-slate-600 italic">no output yet…</span>}
            </pre>
          </div>
        </div>

        <div className="flex flex-col border-r border-ink-700 overflow-hidden">
          <div className="px-2 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-widest bg-ink-850 border-b border-ink-700 shrink-0 flex items-center gap-1">
            <Layers size={11} className="text-cyan-600" /> Frames
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-2 bg-ink-800/60" style={{ maxHeight: 260 }}>
            {step.frames.length === 0 && <p className="text-slate-500 text-xs italic p-1">No frames</p>}
            {step.frames.map((f, fi) => <FrameCard key={f.frame_id} frame={f} heap={step.heap} isActive={fi === step.frames.length - 1} />)}
          </div>
        </div>

        <div className="flex flex-col overflow-hidden">
          <div className="px-2 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-widest bg-ink-850 border-b border-ink-700 shrink-0 flex items-center gap-1">
            <Package size={11} className="text-amber-600" /> Heap
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-2 bg-ink-800/60" style={{ maxHeight: 260 }}>
            {Object.keys(step.heap).length === 0 ? (
              <div className="text-slate-600 text-xs italic mt-4 text-center"><Package size={18} className="mx-auto mb-1 text-slate-700" /><p>No objects yet</p></div>
            ) : (
              Object.entries(step.heap).map(([id, obj]) => <HeapCard key={id} id={id} obj={obj} heap={step.heap} />)
            )}
          </div>
        </div>
      </div>
      <div className="px-3 py-1 bg-ink-850 border-t border-ink-700">
        <p className="text-[10px] text-slate-600 flex items-center gap-1"><Lightbulb size={10} /> Arrow keys ← → to step through execution</p>
      </div>
    </div>
  );
}

// ─── Pyodide worker hook (lazily "installs" Python in the browser) ──────
// The worker fetches the Pyodide WASM runtime from a CDN the first time a
// learner opens this widget for a concept, then keeps it warm for the rest
// of the session. No Python process ever runs on our servers.
function useWorker() {
  const ref = useRef(null);
  const cbRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = new Worker('/pyodide-worker.js');
    w.onmessage = (e) => {
      if (e.data.type === 'ready') { setReady(true); return; }
      cbRef.current?.(e.data);
      cbRef.current = null;
    };
    ref.current = w;
    return () => w.terminate();
  }, []);

  const send = useCallback((msg, cb) => {
    cbRef.current = cb;
    ref.current?.postMessage(msg);
  }, []);

  return { ready, send };
}

// ─── Input Modal ─────────────────────────────────────────────────────────
function InputModal({ prompts, onSubmit, onCancel }) {
  const [values, setValues] = useState(prompts.map(() => ''));

  const handleChange = (i, v) => {
    setValues(prev => { const n = [...prev]; n[i] = v; return n; });
  };
  const handleKey = (e) => {
    if (e.key === 'Enter') onSubmit(values);
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-ink-800 border border-cyan-700/50 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 bg-ink-850 border-b border-ink-700">
          <Terminal size={16} className="text-cyan-600" />
          <span className="font-semibold text-slate-800 text-sm">Program needs input</span>
          <span className="text-xs text-slate-500 ml-1">— fill in the values below</span>
        </div>
        <div className="p-5 space-y-3">
          {prompts.map((prompt, i) => (
            <div key={i}>
              <label className="block text-xs font-semibold text-cyan-600 mb-1">{prompt || `Input ${i + 1}`}</label>
              <input
                autoFocus={i === 0}
                type="text"
                value={values[i]}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type your value here…"
                className="w-full bg-ink-900 border border-ink-600 focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-slate-800 font-mono focus:outline-none placeholder-slate-400"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <button onClick={() => onSubmit(values)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-ink-950 font-bold text-sm">
            <Play size={13} className="fill-ink-950" /> Run with these values
          </button>
          <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-ink-700 hover:bg-ink-600 text-slate-600 text-sm border border-ink-600">Cancel</button>
        </div>
      </div>
    </div>
  );
}

const LEVEL_STYLE = {
  easy: 'bg-emerald-400/10 text-emerald-600 border-emerald-500/30',
  medium: 'bg-amber-400/10   text-amber-600   border-amber-500/30',
  hard: 'bg-rose-400/10    text-rose-600    border-rose-500/30',
};

// ─── Question card (has its own Run + Visualize, own worker) ────────────
function QuestionCard({ q, num, locked, onPass }) {
  const [code, setCode] = useState(q.starter);
  const [output, setOutput] = useState(null);
  const [err, setErr] = useState(null);
  const [running, setRunning] = useState(false);
  const [vizLoading, setVizLoading] = useState(false);
  const [vizErr, setVizErr] = useState(null);
  const [trace, setTrace] = useState(null);
  const [passed, setPassed] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [hint, setHint] = useState(false);
  const [inputPrompts, setInputPrompts] = useState([]);
  const [showInputModal, setShowInputModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const { ready, send } = useWorker();

  useEffect(() => {
    setCode(q.starter); setOutput(null); setErr(null); setTrace(null);
    setPassed(false); setWrong(false); setShowInputModal(false);
  }, [q.id]);

  const handleRun = () => {
    if (locked || passed || running || !ready) return;
    setRunning(true); setOutput(null); setErr(null); setWrong(false); setTrace(null);
    send({ type: 'run', code }, (msg) => {
      if (msg.type === 'needs_input') {
        setRunning(false); setInputPrompts(msg.prompts); setPendingAction('run'); setShowInputModal(true);
        return;
      }
      setRunning(false);
      if (msg.error) { setErr(msg.error); return; }
      const out = msg.output || '';
      setOutput(out);
      if (q.check(out)) { setPassed(true); onPass(q.id); } else setWrong(true);
    });
  };

  const handleVisualize = () => {
    if (locked || !ready) return;
    setVizLoading(true); setVizErr(null); setTrace(null); setOutput(null); setErr(null);
    send({ type: 'trace', code, maxSteps: 500 }, (msg) => {
      if (msg.type === 'needs_input') {
        setVizLoading(false); setInputPrompts(msg.prompts); setPendingAction('trace'); setShowInputModal(true);
        return;
      }
      setVizLoading(false);
      if (msg.error) { setVizErr(msg.error); return; }
      setTrace({ steps: msg.steps, program: msg.program, language: 'python', version: '3.x', error: null });
    });
  };

  const handleInputSubmit = (values) => {
    setShowInputModal(false);
    if (pendingAction === 'run') {
      setRunning(true); setOutput(null); setErr(null); setWrong(false);
      send({ type: 'run_with_inputs', code, inputs: values }, (msg) => {
        setRunning(false);
        if (msg.error) { setErr(msg.error); return; }
        const out = msg.output || '';
        setOutput(out);
        if (q.check(out)) { setPassed(true); onPass(q.id); } else setWrong(true);
      });
    } else if (pendingAction === 'trace') {
      setVizLoading(true);
      send({ type: 'trace_with_inputs', code, inputs: values, maxSteps: 500 }, (msg) => {
        setVizLoading(false);
        if (msg.error) { setVizErr(msg.error); return; }
        setTrace({ steps: msg.steps, program: msg.program, language: 'python', version: '3.x', error: null });
      });
    }
    setPendingAction(null);
  };

  return (
    <>
      {showInputModal && (
        <InputModal prompts={inputPrompts} onSubmit={handleInputSubmit} onCancel={() => { setShowInputModal(false); setPendingAction(null); }} />
      )}
      <div className={`rounded-xl border-2 overflow-hidden transition-all ${passed ? 'border-emerald-500/60' : locked ? 'border-ink-600 opacity-50' : 'border-ink-600'}`}>
        <div className={`px-4 py-3 flex items-start gap-3 ${passed ? 'bg-emerald-900/20' : 'bg-ink-800'}`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${passed ? 'bg-emerald-500 text-ink-950' : locked ? 'bg-ink-600 text-slate-500' : 'bg-cyan-500 text-ink-950'}`}>
            {passed ? <Check size={14} /> : num}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${LEVEL_STYLE[q.level]}`}>{q.badge}</span>
              <span className="font-semibold text-slate-800 text-sm">{q.title}</span>
            </div>
            <p className="text-xs text-slate-500">{q.description}</p>
            {q.scenario && (
              <p className="text-xs text-amber-700/90 bg-amber-900/10 border border-amber-700/30 rounded-lg px-2.5 py-1.5 mt-2 italic flex items-start gap-1.5">
                <BookOpen size={12} className="shrink-0 mt-0.5" /> {q.scenario}
              </p>
            )}
          </div>
          {locked && <Lock size={18} className="text-slate-600 shrink-0" />}
          {passed && <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />}
        </div>

        {!locked && (
          <div className="p-3 bg-ink-900 space-y-2">
            <textarea
              value={code} onChange={e => setCode(e.target.value)} disabled={passed}
              spellCheck={false} rows={6}
              className={`w-full rounded-lg border p-2.5 font-mono text-sm leading-6 resize-none focus:outline-none ${passed ? 'bg-emerald-900/10 border-emerald-700/40 text-emerald-700' : 'bg-ink-800 border-ink-600 text-slate-800 focus:border-cyan-500'}`}
              onKeyDown={e => {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  const el = e.currentTarget, s = el.selectionStart;
                  const nv = code.slice(0, s) + '    ' + code.slice(el.selectionEnd);
                  setCode(nv);
                  requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 4; });
                }
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleRun();
              }}
            />

            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={handleRun} disabled={running || passed || !ready}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-ink-950 text-sm font-bold disabled:opacity-40">
                {running ? <><Loader2 size={13} className="animate-spin" /> Running…</> : <><Play size={13} className="fill-ink-950" /> Run</>}
              </button>

              <button onClick={handleVisualize} disabled={vizLoading || !ready}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-600 text-sm font-semibold disabled:opacity-40">
                {vizLoading ? <><Loader2 size={13} className="animate-spin" /> Tracing…</> : <><FlaskConical size={13} /> Visualize</>}
              </button>

              {!ready && <span className="text-xs text-amber-600 flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Loading Python…</span>}
            </div>

            {vizErr && <div className="text-xs bg-rose-900/20 border border-rose-700/40 rounded-lg px-3 py-2 text-rose-600 flex items-center gap-1.5"><AlertTriangle size={12} className="shrink-0" /> {vizErr}</div>}
            {trace && <InlineVisualizer trace={trace} onClose={() => setTrace(null)} />}

            {(output !== null || err) && !trace && (
              <div className={`rounded-lg border text-xs font-mono px-3 py-2 ${passed ? 'bg-emerald-900/10 border-emerald-700/40 text-emerald-700' : err ? 'bg-rose-900/20 border-rose-700/40 text-rose-600' : wrong ? 'bg-rose-900/20 border-rose-700/40' : 'bg-ink-800 border-ink-600 text-slate-700'}`}>
                {err ? (
                  <><span className="font-semibold text-rose-600">Error: </span>{err}</>
                ) : passed ? (
                  <><span className="font-bold">Output: </span>{output?.trim()}</>
                ) : wrong ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-rose-600 font-semibold"><span>Not quite</span></div>
                    <div><span className="text-slate-500">Your output: </span><span className="text-rose-600">{output?.trim() || '(empty)'}</span></div>
                    <div><span className="text-slate-500">Expected:    </span><span className="text-slate-600">{q.expected}</span></div>
                  </div>
                ) : (
                  <><span className="font-semibold">Output: </span>{output?.trim() || '(no output)'}</>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Scenario question card (no code — free-text reasoning, checked
// server-side by the same semantic-similarity scoring used in Section 1) ──
function ScenarioQuestionCard({ q, num, locked, onPass }) {
  const [answer, setAnswer] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null); // { passed, feedback }
  const [hint, setHint] = useState(false);
  const passed = !!result?.passed;

  const submit = async () => {
    if (locked || passed || checking || !answer.trim()) return;
    setChecking(true);
    try {
      const res = await api.post(`/questions/scenario/${q.id}/check`, { answer });
      setResult(res.data);
      if (res.data.passed) onPass(q.id);
    } catch {
      setResult({ passed: false, feedback: 'Something went wrong checking your answer. Please try again.' });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className={`rounded-xl border-2 overflow-hidden transition-all ${passed ? 'border-emerald-500/60' : locked ? 'border-ink-600 opacity-50' : 'border-ink-600'}`}>
      <div className={`px-4 py-3 flex items-start gap-3 ${passed ? 'bg-emerald-900/20' : 'bg-ink-800'}`}>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${passed ? 'bg-emerald-500 text-ink-950' : locked ? 'bg-ink-600 text-slate-500' : 'bg-cyan-500 text-ink-950'}`}>
          {passed ? <Check size={14} /> : num}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${LEVEL_STYLE[q.level]}`}>{q.badge}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-violet-500/30 bg-violet-400/10 text-violet-600 uppercase tracking-wide">scenario</span>
            <span className="font-semibold text-slate-800 text-sm">{q.title}</span>
          </div>
        </div>
        {locked && <Lock size={18} className="text-slate-600 shrink-0" />}
        {passed && <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />}
      </div>

      {!locked && (
        <div className="p-4 bg-ink-900 space-y-3">
          {q.scenario && (
            <p className="text-sm text-amber-700/90 bg-amber-900/10 border border-amber-700/30 rounded-lg px-3.5 py-2.5 leading-relaxed flex items-start gap-2">
              <BookOpen size={14} className="shrink-0 mt-0.5" /> {q.scenario}
            </p>
          )}
          <p className="text-sm font-medium text-slate-800 leading-relaxed">{q.description}</p>

          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            disabled={passed}
            rows={4}
            placeholder="Explain your thinking here — no code needed, just your reasoning..."
            className={`w-full rounded-lg border p-2.5 text-sm leading-6 resize-none focus:outline-none ${passed ? 'bg-emerald-900/10 border-emerald-700/40 text-emerald-700' : 'bg-ink-800 border-ink-600 text-slate-800 focus:border-cyan-500'}`}
          />

          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={submit} disabled={checking || passed || !answer.trim()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-ink-950 text-sm font-bold disabled:opacity-40">
              {checking ? <><Loader2 size={13} className="animate-spin" /> Checking…</> : 'Check my answer'}
            </button>
            {q.hint && (
              <button onClick={() => setHint(h => !h)} className="text-xs text-amber-600 hover:underline flex items-center gap-1 ml-auto">
                <Lightbulb size={11} />{hint ? 'Hide hint' : 'Show hint'}
              </button>
            )}
          </div>

          {hint && q.hint && <div className="text-xs bg-amber-900/20 border border-amber-700/40 rounded-lg px-3 py-2 text-amber-700 flex items-center gap-1.5"><Lightbulb size={12} className="shrink-0" /> {q.hint}</div>}

          {result && (
            <div className={`rounded-lg border text-sm px-3.5 py-2.5 ${passed ? 'bg-emerald-900/10 border-emerald-700/40 text-emerald-700' : 'bg-amber-900/10 border-amber-700/40 text-amber-700'}`}>
              {result.feedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// Props:
//   concept   — the current PYBE Concept (uses concept.title to look up
//               the matching set of 3 real coding questions)
//   onAllPassed — called once, the moment all questions are solved
//   isCompleted — if true, render collapsed with a "practice again" toggle
const LEVEL_BADGE = { easy: 'Very Easy', medium: 'Easy', hard: 'A Bit Difficult' };

// Turn a backend Question document into the shape QuestionCard/
// ScenarioQuestionCard expect, so they don't need to care which source a
// question came from. Scenario questions carry no code fields at all —
// they're checked server-side, not by the Pyodide runner.
function adaptBackendQuestion(q) {
  const base = {
    id: q.id,
    type: q.type || 'practice',
    level: q.level,
    badge: LEVEL_BADGE[q.level] || q.level,
    title: q.title,
    scenario: q.scenario || '',
    description: q.description,
    hint: q.hint || '',
  };
  if (base.type === 'scenario') return base;

  const outputs = [q.expectedOutput, ...(q.acceptableOutputs || [])].map(s => s.trim());
  return {
    ...base,
    starter: q.starter,
    expected: q.expectedOutput,
    check: (out) => outputs.includes((out || '').trim()),
  };
}

export default function PythonPracticeWidget({ concept, onAllPassed, isCompleted }) {
  // Only ONE coding question per concept now (was 3, sequentially unlocked).
  // We keep the easiest/first-authored question, since that's the one that
  // most directly demonstrates the concept just introduced.
  const [questions, setQuestions] = useState(() => getQuestions(concept?.title || '').slice(0, 1));
  const [passed, setPassed] = useState(new Set());
  const [expanded, setExpanded] = useState(!isCompleted);
  const firedRef = useRef(false);

  useEffect(() => {
    setPassed(new Set());
    firedRef.current = false;

    const staticQuestions = getQuestions(concept?.title || '').slice(0, 1);
    setQuestions(staticQuestions); // show the single built-in question immediately, no flash of "no questions"

    if (!concept?._id) return;
    let cancelled = false;
    // If an admin hasn't authored anything for this concept, the one
    // built-in question above is all the learner sees — by design, this
    // section is now a single question, not a growing additive set.
    return () => { cancelled = true; };
  }, [concept?._id, concept?.title]);

  const allPassed = questions.length > 0 && questions.every(q => passed.has(q.id));

  const handlePass = useCallback((id) => {
    setPassed(prev => new Set([...prev, id]));
  }, []);

  useEffect(() => {
    if (allPassed && !firedRef.current) {
      firedRef.current = true;
      onAllPassed?.();
    }
  }, [allPassed, onAllPassed]);

  if (isCompleted && !expanded) {
    return (
      <div className="card p-6 border-2 border-emerald-100 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-900/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400"><Terminal size={20} /></div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Python Practice</h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-600">Section 2 — real Python, run in your browser</p>
          </div>
          <span className="ml-auto badge-easy flex items-center gap-1"><CheckCircle2 size={12} /> Done</span>
        </div>
        <button
          onClick={() => setExpanded(true)}
          className="w-full flex items-center justify-center gap-2 py-3 mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-600 font-semibold text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
        >
          <CheckCircle2 size={14} className="inline mr-1" /> Coding Practice Completed — <span className="underline">practice again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-ink-600 bg-ink-900 text-slate-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-ink-850 border-b border-cyan-900/30 flex-wrap gap-y-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-600"><Terminal size={16} /></div>
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">Python Practice — {concept?.title}</h3>
          <p className="text-[11px] text-cyan-600/80">Write real Python. It runs right in your browser.</p>
        </div>

        {isCompleted && (
          <button onClick={() => setExpanded(false)} className="ml-2 text-xs text-slate-500 hover:text-slate-700 border border-ink-600 px-2 py-1 rounded-lg flex items-center gap-1">
            <ChevronUp size={12} /> Collapse
          </button>
        )}

        <div className="ml-auto flex items-center gap-1.5">
          {questions.map((q, i) => (
            <div key={q.id} className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${passed.has(q.id) ? 'bg-emerald-500 text-ink-950' : 'bg-ink-700 text-slate-500'}`}>
              {passed.has(q.id) ? <Check size={14} /> : i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="p-4 space-y-4">
        {questions.map((q, i) => (
          (q.type === 'scenario') ? (
            <ScenarioQuestionCard
              key={`${concept?._id}-${q.id}`}
              q={q}
              num={i + 1}
              locked={i > 0 && !passed.has(questions[i - 1].id)}
              onPass={handlePass}
            />
          ) : (
            <QuestionCard
              key={`${concept?._id}-${q.id}`}
              q={q}
              num={i + 1}
              locked={i > 0 && !passed.has(questions[i - 1].id)}
              onPass={handlePass}
            />
          )
        ))}

        {allPassed && (
          <div className="rounded-xl bg-emerald-900/20 border border-emerald-700/40 px-4 py-3 text-center text-emerald-700 text-sm font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 size={16} /> All {questions.length} question{questions.length === 1 ? '' : 's'} solved — nice work!
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Themed example visualizer (Section 2 of the concept lesson) ────────
// No Run, no test-checking, no pass/fail — just the theme's worked example,
// pre-filled and editable, with an unlimited-use Visualize button. The
// learner can step through execution as many times as they want; the
// moment they've visualized at least once, a "Proceed" button appears so
// they can move on whenever they're ready, independent of anything else.
export function ThemedExampleVisualizer({ code: initialCode, onComplete, isCompleted }) {
  const [code, setCode] = useState(initialCode);
  const [vizLoading, setVizLoading] = useState(false);
  const [vizErr, setVizErr] = useState(null);
  const [trace, setTrace] = useState(null);
  const [hasVisualized, setHasVisualized] = useState(false);
  const [inputPrompts, setInputPrompts] = useState([]);
  const [showInputModal, setShowInputModal] = useState(false);
  const { ready, send } = useWorker();

  useEffect(() => {
    setCode(initialCode);
    setTrace(null);
    setVizErr(null);
  }, [initialCode]);

  const handleVisualize = () => {
    if (vizLoading || !ready) return;
    setVizLoading(true); setVizErr(null); setTrace(null);
    send({ type: 'trace', code, maxSteps: 500 }, (msg) => {
      if (msg.type === 'needs_input') {
        setVizLoading(false); setInputPrompts(msg.prompts); setShowInputModal(true);
        return;
      }
      setVizLoading(false);
      if (msg.error) { setVizErr(msg.error); return; }
      setTrace({ steps: msg.steps, program: msg.program, language: 'python', version: '3.x', error: null });
      setHasVisualized(true);
    });
  };

  const handleInputSubmit = (values) => {
    setShowInputModal(false);
    setVizLoading(true);
    send({ type: 'trace_with_inputs', code, inputs: values, maxSteps: 500 }, (msg) => {
      setVizLoading(false);
      if (msg.error) { setVizErr(msg.error); return; }
      setTrace({ steps: msg.steps, program: msg.program, language: 'python', version: '3.x', error: null });
      setHasVisualized(true);
    });
  };

  return (
    <>
      {showInputModal && (
        <InputModal prompts={inputPrompts} onSubmit={handleInputSubmit} onCancel={() => setShowInputModal(false)} />
      )}
      <div className="rounded-xl border-2 border-ink-600 overflow-hidden">
        <div className="px-4 py-3 bg-ink-800 flex items-center gap-2 flex-wrap">
          <Terminal size={14} className="text-cyan-500 shrink-0" />
          <span className="text-sm font-semibold text-slate-800">Try it yourself</span>
          <span className="text-xs text-slate-500">— edit freely, visualize as many times as you like</span>
        </div>
        <div className="p-3 bg-ink-900 space-y-2">
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            rows={Math.min(16, Math.max(6, code.split('\n').length))}
            className="w-full rounded-lg border p-2.5 font-mono text-sm leading-6 resize-none focus:outline-none bg-ink-800 border-ink-600 text-slate-800 focus:border-cyan-500"
            onKeyDown={e => {
              if (e.key === 'Tab') {
                e.preventDefault();
                const el = e.currentTarget, s = el.selectionStart;
                const nv = code.slice(0, s) + '    ' + code.slice(el.selectionEnd);
                setCode(nv);
                requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 4; });
              }
            }}
          />

          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={handleVisualize} disabled={vizLoading || !ready}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-ink-950 text-sm font-bold disabled:opacity-40">
              {vizLoading ? <><Loader2 size={13} className="animate-spin" /> Tracing…</> : <><FlaskConical size={13} /> Visualize</>}
            </button>
            {!ready && <span className="text-xs text-amber-600 flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Loading Python…</span>}
          </div>

          {vizErr && <div className="text-xs bg-rose-900/20 border border-rose-700/40 rounded-lg px-3 py-2 text-rose-600 flex items-center gap-1.5"><AlertTriangle size={12} className="shrink-0" /> {vizErr}</div>}
          {trace && <InlineVisualizer trace={trace} onClose={() => setTrace(null)} />}
        </div>
      </div>

      {(hasVisualized || isCompleted) && (
        <button onClick={onComplete} className="btn-primary w-full mt-3">
          {isCompleted ? <><CheckCircle2 size={16} /> Practiced — practice again anytime</> : <><ArrowRight size={16} /> Proceed to next module</>}
        </button>
      )}
    </>
  );
}

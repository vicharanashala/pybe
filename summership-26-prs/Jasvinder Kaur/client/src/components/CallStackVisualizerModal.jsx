import React, { useState, useEffect } from 'react';
import { Layers, Play, Pause, RotateCcw, ArrowUpRight, CheckCircle, X, ChevronRight } from 'lucide-react';

/* ----------------------------------------------------------------
   Generates the step-by-step call stack animation for each lesson
   ---------------------------------------------------------------- */
function generateSteps(lessonId) {
  if (lessonId === 6 || lessonId === 5) {
    // Factorial / unwinding lesson
    return [
      {
        phase: 'Winding',
        desc: 'Call 1 — factorial(4) starts. Needs 4 × factorial(3).',
        stack: [{ name: 'factorial(4)', arg: 'n=4', status: 'active' }],
        usage: 25,
      },
      {
        phase: 'Winding',
        desc: 'Call 2 — factorial(3) pushed. Needs 3 × factorial(2).',
        stack: [
          { name: 'factorial(4)', arg: 'n=4', status: 'waiting' },
          { name: 'factorial(3)', arg: 'n=3', status: 'active' },
        ],
        usage: 50,
      },
      {
        phase: 'Winding',
        desc: 'Call 3 — factorial(2) pushed. Needs 2 × factorial(1).',
        stack: [
          { name: 'factorial(4)', arg: 'n=4', status: 'waiting' },
          { name: 'factorial(3)', arg: 'n=3', status: 'waiting' },
          { name: 'factorial(2)', arg: 'n=2', status: 'active' },
        ],
        usage: 75,
      },
      {
        phase: 'Base Case',
        desc: 'Call 4 — factorial(1) hits BASE CASE! Returns 1 immediately.',
        stack: [
          { name: 'factorial(4)', arg: 'n=4', status: 'waiting' },
          { name: 'factorial(3)', arg: 'n=3', status: 'waiting' },
          { name: 'factorial(2)', arg: 'n=2', status: 'waiting' },
          { name: 'factorial(1)', arg: 'n=1', status: 'base_case', ret: 1 },
        ],
        usage: 100,
      },
      {
        phase: 'Unwinding',
        desc: 'factorial(2) receives 1 → computes 2 × 1 = 2. Returns 2.',
        stack: [
          { name: 'factorial(4)', arg: 'n=4', status: 'waiting' },
          { name: 'factorial(3)', arg: 'n=3', status: 'waiting' },
          { name: 'factorial(2)', arg: 'n=2', status: 'unwinding', ret: 2 },
        ],
        usage: 75,
      },
      {
        phase: 'Unwinding',
        desc: 'factorial(3) receives 2 → computes 3 × 2 = 6. Returns 6.',
        stack: [
          { name: 'factorial(4)', arg: 'n=4', status: 'waiting' },
          { name: 'factorial(3)', arg: 'n=3', status: 'unwinding', ret: 6 },
        ],
        usage: 50,
      },
      {
        phase: 'Unwinding',
        desc: 'factorial(4) receives 6 → computes 4 × 6 = 24. Complete! ✅',
        stack: [{ name: 'factorial(4)', arg: 'n=4', status: 'unwinding', ret: 24 }],
        usage: 25,
      },
      {
        phase: 'Done',
        desc: 'All frames popped. Stack is empty. Final result: 24 returned to caller.',
        stack: [],
        usage: 0,
      },
    ];
  }

  // Default: generic 4-level recursion
  return [
    {
      phase: 'Winding',
      desc: 'Call 1 — reflect(1) starts. Calls reflect(2).',
      stack: [{ name: 'reflect(1)', arg: 'level=1', status: 'active' }],
      usage: 25,
    },
    {
      phase: 'Winding',
      desc: 'Call 2 — reflect(2) pushed. Calls reflect(3).',
      stack: [
        { name: 'reflect(1)', arg: 'level=1', status: 'waiting' },
        { name: 'reflect(2)', arg: 'level=2', status: 'active' },
      ],
      usage: 50,
    },
    {
      phase: 'Winding',
      desc: 'Call 3 — reflect(3) pushed. Calls reflect(4).',
      stack: [
        { name: 'reflect(1)', arg: 'level=1', status: 'waiting' },
        { name: 'reflect(2)', arg: 'level=2', status: 'waiting' },
        { name: 'reflect(3)', arg: 'level=3', status: 'active' },
      ],
      usage: 75,
    },
    {
      phase: 'Base Case',
      desc: 'Call 4 — reflect(4) hits BASE CASE! Depth limit reached.',
      stack: [
        { name: 'reflect(1)', arg: 'level=1', status: 'waiting' },
        { name: 'reflect(2)', arg: 'level=2', status: 'waiting' },
        { name: 'reflect(3)', arg: 'level=3', status: 'waiting' },
        { name: 'reflect(4)', arg: 'level=4', status: 'base_case' },
      ],
      usage: 100,
    },
    {
      phase: 'Unwinding',
      desc: 'All frames pop in reverse. Stack unwinds safely.',
      stack: [{ name: 'reflect(1)', arg: 'level=1', status: 'unwinding' }],
      usage: 25,
    },
    {
      phase: 'Done',
      desc: 'Call stack empty! All recursive calls completed and returned.',
      stack: [],
      usage: 0,
    },
  ];
}

/* ----------------------------------------------------------------
   Frame status → style config
   ---------------------------------------------------------------- */
const frameStyles = {
  active:     { frame: 'stack-frame active',    label: 'ACTIVE',     labelColor: '#67E8F9' },
  waiting:    { frame: 'stack-frame waiting',   label: 'WAITING',    labelColor: '#A78BFA' },
  base_case:  { frame: 'stack-frame base-case', label: 'BASE CASE',  labelColor: '#FBBF24' },
  unwinding:  { frame: 'stack-frame unwinding', label: 'RETURN ↑',   labelColor: '#34D399' },
};

const phaseColors = {
  Winding:    { bg: 'rgba(6,182,212,0.12)',    border: 'rgba(6,182,212,0.40)',    color: '#67E8F9' },
  'Base Case':{ bg: 'rgba(251,191,36,0.12)',   border: 'rgba(251,191,36,0.45)',   color: '#FCD34D' },
  Unwinding:  { bg: 'rgba(52,211,153,0.12)',   border: 'rgba(52,211,153,0.40)',   color: '#34D399' },
  Done:       { bg: 'rgba(139,92,246,0.12)',   border: 'rgba(139,92,246,0.35)',   color: '#C4B5FD' },
};

const SPEEDS = { Slow: 2000, Normal: 1200, Fast: 600 };

export default function CallStackVisualizerModal({ lesson, onClose }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState('Normal');

  const steps = generateSteps(lesson.id);
  const current = steps[stepIndex] || steps[0];
  const phaseStyle = phaseColors[current.phase] || phaseColors.Done;

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStepIndex(prev => {
        if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
        return prev + 1;
      });
    }, SPEEDS[speed]);
    return () => clearInterval(timer);
  }, [isPlaying, steps.length, speed]);

  const reset = () => { setStepIndex(0); setIsPlaying(false); };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel glass-card max-w-3xl border-purple-500/40 p-6 flex flex-col gap-5"
        style={{ border: '1px solid rgba(139,92,246,0.35)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{ background: 'rgba(139,92,246,0.18)', border: '1px solid rgba(139,92,246,0.30)' }}>
              <Layers className="w-5 h-5" style={{ color: '#A78BFA' }} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Call Stack Memory Visualizer
              </h3>
              <p className="text-xs" style={{ color: '#A78BFA' }}>{lesson.title}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X className="w-4 h-4" /></button>
        </div>

        {/* Phase indicator */}
        <div
          className="flex items-center justify-between rounded-xl p-3 gap-3"
          style={{ background: phaseStyle.bg, border: `1px solid ${phaseStyle.border}` }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="px-2.5 py-1 rounded-lg text-xs font-bold flex-shrink-0"
              style={{ background: phaseStyle.bg, border: `1px solid ${phaseStyle.border}`, color: phaseStyle.color }}
            >
              {current.phase}
            </span>
            <span className="text-sm text-gray-200 truncate">{current.desc}</span>
          </div>
          <span className="text-xs font-mono flex-shrink-0" style={{ color: '#A78BFA' }}>
            {stepIndex + 1}/{steps.length}
          </span>
        </div>

        {/* Main area: Stack + Memory Gauge */}
        <div className="flex gap-4 items-start">
          {/* Stack visualization */}
          <div
            className="flex-1 rounded-2xl p-5 min-h-[260px] flex flex-col-reverse justify-start gap-3 relative overflow-hidden"
            style={{ background: '#060819', border: '1px solid rgba(139,92,246,0.20)' }}
          >
            <span className="absolute right-4 top-4 text-[10px] font-mono uppercase text-gray-600 tracking-wider">
              RAM · Call Stack ↓ Top
            </span>

            {current.stack.length === 0 ? (
              <div className="m-auto text-center py-10">
                <CheckCircle className="w-10 h-10 mx-auto mb-2" style={{ color: '#34D399' }} />
                <p className="font-bold text-gray-200 text-sm">Call Stack Cleared!</p>
                <p className="text-xs text-gray-500 mt-1">All recursive frames returned safely.</p>
              </div>
            ) : (
              current.stack.map((frame, idx) => {
                const style = frameStyles[frame.status] || frameStyles.waiting;
                return (
                  <div key={idx} className={style.frame}>
                    <div className="flex items-center gap-3">
                      <span
                        className="font-mono text-[10px] font-bold px-2 py-0.5 rounded"
                        style={{ background: 'rgba(0,0,0,0.40)', color: '#6B7280' }}
                      >
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="font-mono font-bold text-sm">{frame.name}</div>
                        <div className="text-xs text-gray-400 font-mono">{frame.arg}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(0,0,0,0.40)', color: style.labelColor }}
                      >
                        {style.label}
                      </span>
                      {frame.ret !== undefined && (
                        <span
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold font-mono"
                          style={{ background: 'rgba(52,211,153,0.20)', border: '1px solid rgba(52,211,153,0.35)', color: '#34D399' }}
                        >
                          <ArrowUpRight className="w-3 h-3" />
                          {frame.ret}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Memory gauge */}
          <div className="flex flex-col items-center gap-2 w-14 flex-shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 text-center">
              Stack<br/>Usage
            </span>
            <div
              className="w-8 rounded-lg overflow-hidden relative"
              style={{ height: '200px', background: 'rgba(15,18,50,0.90)', border: '1px solid rgba(139,92,246,0.20)' }}
            >
              <div
                className="memory-gauge-fill absolute bottom-0 left-0 right-0 rounded-lg"
                style={{ height: `${current.usage}%` }}
              />
            </div>
            <span
              className="text-xs font-bold font-mono"
              style={{ color: current.usage >= 75 ? '#F87171' : current.usage >= 50 ? '#FBBF24' : '#34D399' }}
            >
              {current.usage}%
            </span>
          </div>
        </div>

        {/* Controls */}
        <div
          className="flex items-center justify-between pt-4"
          style={{ borderTop: '1px solid rgba(139,92,246,0.15)' }}
        >
          <button onClick={reset} className="btn-secondary text-sm py-2 px-3 flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>

          {/* Speed selector */}
          <div className="flex items-center gap-1 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(139,92,246,0.20)', background: 'rgba(10,12,35,0.80)' }}>
            {Object.keys(SPEEDS).map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className="px-3 py-1.5 text-xs font-bold transition-all"
                style={{
                  background: speed === s ? 'rgba(139,92,246,0.30)' : 'transparent',
                  color: speed === s ? '#C4B5FD' : '#6B7280'
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="btn-primary text-sm py-2 px-5 flex items-center gap-2"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" style={{ fill: 'white' }} />}
              {isPlaying ? 'Pause' : 'Auto Play'}
            </button>
            <button
              onClick={() => setStepIndex(prev => Math.min(prev + 1, steps.length - 1))}
              disabled={stepIndex >= steps.length - 1}
              className="btn-accent text-sm py-2 px-4 flex items-center gap-1 disabled:opacity-50"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step dots row */}
        <div className="flex justify-center gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStepIndex(i)}
              className="rounded-full transition-all"
              style={{
                width: i === stepIndex ? '20px' : '6px',
                height: '6px',
                background: i === stepIndex
                  ? 'linear-gradient(90deg, #8B5CF6, #22D3EE)'
                  : i < stepIndex ? 'rgba(139,92,246,0.50)' : 'rgba(255,255,255,0.12)'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

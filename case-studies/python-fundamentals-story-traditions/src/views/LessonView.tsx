import React, { useState, useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { ManuscriptCard, StoryHeader } from '../components/Ornaments';
import type { LessonSlide } from '../data/learningData';
import { getTopic } from '../data/curriculum';
import { ArrowLeft, ArrowRight, Play, Terminal, Layers } from 'lucide-react';

export const LessonView: React.FC = () => {
  const { nextStep, prevStep, activeTopicId } = useProgress();
  const topic = getTopic(activeTopicId);
  const lessonSlides = topic.lessons;
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const slide: LessonSlide = lessonSlides[activeSlide];

  useEffect(() => {
    setConsoleOutput('');
  }, [activeSlide]);

  const simulateCode = (code: string): string => {
    const lines = code.split('\n');
    const vars: Record<string, unknown> = {};
    const output: string[] = [];

    const evalExpr = (expr: string): unknown => {
      expr = expr.trim();

      if (expr.startsWith('"') && expr.endsWith('"')) return expr.slice(1, -1);
      if (expr.startsWith("'") && expr.endsWith("'")) return expr.slice(1, -1);
      if (!isNaN(Number(expr))) return Number(expr);
      if (expr === 'True') return true;
      if (expr === 'False') return false;

      if (expr.startsWith('{') && expr.endsWith('}')) {
        const inner = expr.slice(1, -1).trim();
        if (!inner) return {};
        const obj: Record<string, string> = {};
        const pairs = inner.split(',');
        for (const pair of pairs) {
          const [k, v] = pair.split(':').map(s => s.trim());
          if (k && v) obj[evalExpr(k) as string] = evalExpr(v) as string;
        }
        return obj;
      }

      if (expr.startsWith('[') && expr.endsWith(']')) {
        const inner = expr.slice(1, -1).trim();
        if (!inner) return [];
        return inner.split(',').map(s => evalExpr(s.trim()));
      }

      const callMatch = expr.match(/^(\w+)\((.+)\)$/);
      if (callMatch) {
        const [, fn, argStr] = callMatch;
        const arg = evalExpr(argStr);
        if (fn === 'str') return String(arg);
        if (fn === 'int') return parseInt(String(arg), 10);
        if (fn === 'len') return Array.isArray(arg) ? arg.length : typeof arg === 'string' ? arg.length : 0;
        if (fn === 'type') return typeof arg;
        if (fn === 'sorted') return Array.isArray(arg) ? [...arg].sort() : arg;
        if (fn === 'reversed') return Array.isArray(arg) ? [...arg].reverse() : arg;
        if (fn === 'range') {
          const nums = argStr.split(',').map(s => parseInt(s.trim(), 10));
          if (nums.length === 1) return Array.from({ length: nums[0] }, (_, i) => i);
          return Array.from({ length: nums[1] - nums[0] }, (_, i) => nums[0] + i);
        }
      }

      if (expr in vars) return vars[expr];
      if (expr.includes(' in ')) {
        const [item, container] = expr.split(' in ').map(s => s.trim());
        const containerVal = vars[container] ?? evalExpr(container);
        if (Array.isArray(containerVal)) return containerVal.includes(evalExpr(item));
      }

      return expr;
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;

      if (line.startsWith('print(') && line.endsWith(')')) {
        const inner = line.slice(6, -1).trim();
        const parts: string[] = [];
        let depth = 0;
        let current = '';
        for (const ch of inner) {
          if (ch === '(' || ch === '[' || ch === '{') depth++;
          if (ch === ')' || ch === ']' || ch === '}') depth--;
          if (ch === ',' && depth === 0) {
            parts.push(current.trim());
            current = '';
          } else {
            current += ch;
          }
        }
        parts.push(current.trim());

        const vals = parts.map(p => {
          const v = evalExpr(p);
          if (typeof v === 'object' && v !== null) return JSON.stringify(v);
          return String(v);
        });
        output.push(vals.join(' '));
        continue;
      }

      const assignMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
      if (assignMatch) {
        const [, name, valueExpr] = assignMatch;
        vars[name] = evalExpr(valueExpr);
        continue;
      }

      const augmentedMatch = line.match(/^(\w+)\s*(\+=|-=|\*=|\/=)\s*(.+)$/);
      if (augmentedMatch) {
        const [, name, op, valueExpr] = augmentedMatch;
        const current = vars[name] ?? 0;
        const val = evalExpr(valueExpr);
        if (op === '+=') vars[name] = (current as number) + (val as number);
        else if (op === '-=') vars[name] = (current as number) - (val as number);
        else if (op === '*=') vars[name] = (current as number) * (val as number);
        else if (op === '/=') vars[name] = (current as number) / (val as number);
        continue;
      }

      const delMatch = line.match(/^del\s+(\w+)\[(.+)\]$/);
      if (delMatch) {
        const [, name, keyExpr] = delMatch;
        const obj = vars[name];
        if (obj && typeof obj === 'object') {
          delete (obj as Record<string, unknown>)[evalExpr(keyExpr) as string];
        }
        continue;
      }

      const forMatch = line.match(/^for\s+(\w+)\s*,\s*(\w+)\s+in\s+(\w+)\.items\(\):$/);
      if (forMatch) {
        const [, kVar, vVar, dictName] = forMatch;
        const obj = vars[dictName];
        if (obj && typeof obj === 'object') {
          for (const [k, v] of Object.entries(obj)) {
            vars[kVar] = k;
            vars[vVar] = v;
          }
        }
        continue;
      }

      const forListMatch = line.match(/^for\s+(\w+)\s+in\s+(\w+):$/);
      if (forListMatch) {
        const [, varName, listName] = forListMatch;
        const list = vars[listName];
        if (Array.isArray(list)) {
          for (const item of list) {
            vars[varName] = item;
          }
        }
        continue;
      }

      const whileMatch = line.match(/^while\s+(.+):$/);
      if (whileMatch) {
        continue;
      }

      if (line === 'break' || line === 'continue' || line.startsWith('if ') || line.startsWith('elif ') || line.startsWith('else:')) {
        continue;
      }
    }

    if (output.length === 0) output.push('Code ran successfully.');
    return output.join('\n');
  };

  const executeCode = () => {
    setIsRunning(true);
    setConsoleOutput('Executing Python code...\n');

    setTimeout(() => {
      const output = simulateCode(slide.exampleCode);
      setConsoleOutput(prev => prev + '>>> ' + output);
      setIsRunning(false);
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-6 px-4 max-w-5xl mx-auto w-full select-none">
      <ManuscriptCard className="w-full animate-manuscript-open">
        <StoryHeader topic={topic} />

        {/* Master layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-6">
          {/* Left Column: Topics Sidebar (md:span-3) */}
          <div className="md:col-span-3 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 scrollbar-thin border-b md:border-b-0 md:border-r border-parchment-border dark:border-parchment-darkBorder md:pr-4">
            {lessonSlides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`flex-shrink-0 text-left px-3 py-2.5 rounded-lg text-xs md:text-sm font-serif font-semibold border transition-all duration-300 ${
                  idx === activeSlide
                    ? 'bg-royal-crimson text-white border-royal-crimson dark:bg-royal-gold dark:text-royal-indigo dark:border-royal-gold shadow-md'
                    : 'bg-white/40 dark:bg-parchment-darkCard/30 border-parchment-border dark:border-parchment-darkBorder text-gray-600 dark:text-gray-400 hover:border-royal-crimson/50'
                }`}
              >
                {idx + 1}. {s.title.split(". ")[1]}
              </button>
            ))}
          </div>

          {/* Middle Column: Concept Definition (md:span-4) */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold text-royal-crimson dark:text-royal-gold uppercase tracking-widest">
                Concept mapping
              </span>
              <h3 className="text-lg font-serif font-bold text-royal-indigo dark:text-white mt-1 mb-3">
                {slide.title}
              </h3>
              
              <div className="p-4 bg-white/60 dark:bg-parchment-dark/60 border border-parchment-border dark:border-parchment-darkBorder rounded-xl mb-4 shadow-sm">
                <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {slide.concept}
                </p>
              </div>

              <span className="text-[9px] font-bold text-royal-crimson dark:text-royal-gold uppercase tracking-widest">
                Syntax preview
              </span>
              <div className="mt-1.5 p-3.5 bg-royal-indigo dark:bg-black/30 rounded-xl border border-royal-gold/20 font-mono text-[11px] md:text-xs text-green-400 leading-relaxed overflow-x-auto whitespace-pre">
                {slide.syntax}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-parchment-border/40 dark:border-parchment-darkBorder/40">
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                {slide.explanation}
              </p>
            </div>
          </div>

          {/* Right Column: Code Executor Console (md:span-5) */}
          <div className="md:col-span-5 flex flex-col">
            <div className="flex justify-between items-center bg-royal-indigo/10 dark:bg-black/40 px-4 py-2 rounded-t-xl border border-b-0 border-royal-gold/20">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-royal-gold" />
                <span className="text-xs font-mono font-bold text-royal-indigo dark:text-royal-gold">
                  ledger.py
                </span>
              </div>

              <button
                onClick={executeCode}
                disabled={isRunning}
                className="flex items-center gap-1 px-3 py-1 rounded bg-royal-crimson hover:bg-royal-crimsonHover text-white font-semibold text-xs transition-all duration-300 shadow active:translate-y-0.5"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>{isRunning ? 'Running...' : 'Run'}</span>
              </button>
            </div>

            <div className="bg-royal-indigo dark:bg-black/30 p-4 border border-royal-gold/20 font-mono text-xs text-white leading-relaxed h-44 overflow-y-auto select-text">
              <pre className="whitespace-pre">{slide.exampleCode}</pre>
            </div>

            <div className="bg-black text-gray-300 p-4 rounded-b-xl border border-t-0 border-royal-gold/20 h-28 font-mono text-xs flex flex-col justify-start overflow-y-auto select-text shadow-inner">
              <div className="flex items-center gap-1.5 text-gray-500 pb-1 mb-2 border-b border-gray-900">
                <Terminal className="w-3.5 h-3.5" />
                <span>Python Sandbox Output</span>
              </div>
              <pre className="text-green-400 whitespace-pre-wrap leading-normal font-sans">
                {consoleOutput || 'Click [Run] to execute this Python code block in the court simulator.'}
              </pre>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-parchment-border dark:border-parchment-darkBorder">
          <button
            onClick={() => {
              if (activeSlide > 0) {
                setActiveSlide(activeSlide - 1);
              } else {
                prevStep();
              }
            }}
            className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-royal-indigo transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={() => {
              if (activeSlide < lessonSlides.length - 1) {
                setActiveSlide(activeSlide + 1);
              } else {
                nextStep();
              }
            }}
            className="flex items-center gap-2 px-6 py-3 bg-royal-crimson hover:bg-royal-crimsonHover text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-royal-crimson/20"
          >
            <span>{activeSlide === lessonSlides.length - 1 ? "Enter Code Playground" : "Next Topic"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </ManuscriptCard>
    </div>
  );
};

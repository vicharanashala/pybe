import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Props {
  numbers?: number[];
}

/**
 * Visual demo for Python `for` loops with an accumulator.
 *
 * Inspired by Khan Academy's loop animations: an iterator pointer walks
 * through a list while a running sum updates. Phase-1 quality — no fancy
 * canvas, just a CSS-driven row of cells.
 */
export function LoopVisual({ numbers }: Props) {
  const data = numbers ?? [78, 92, 65, 88, 71];
  const [runningTotal, setRunningTotal] = useState(0);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    if (index >= data.length - 1) {
      setPlaying(false);
      return;
    }
    timerRef.current = window.setTimeout(() => {
      const nextIndex = index + 1;
      const nextTotal = runningTotal + (data[nextIndex] ?? 0);
      setIndex(nextIndex);
      setRunningTotal(nextTotal);
    }, 900);
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [playing, index, runningTotal, data]);

  const reset = (): void => {
    setPlaying(false);
    setIndex(-1);
    setRunningTotal(0);
  };

  return (
    <section
      data-testid="pybe-visual-loop"
      className="pybe-card"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Loop visual
        </span>
        <code className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          for m in marks: total += m
        </code>
      </div>

      <div className="flex flex-wrap gap-2">
        {data.map((value, i) => {
          const isVisited = i <= index;
          const isCurrent = i === index;
          return (
            <div
              key={i}
              data-testid={`pybe-loop-cell-${i}`}
              className={`flex h-14 w-16 flex-col items-center justify-center rounded-md border text-sm transition-colors ${
                isCurrent
                  ? 'border-amber-500 bg-amber-100 font-bold text-amber-900'
                  : isVisited
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : 'border-stone-200 bg-stone-50 text-stone-500'
              }`}
            >
              <span className="text-[10px] text-stone-400">marks[{i}]</span>
              <span>{value}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          data-testid="pybe-loop-toggle"
          type="button"
          onClick={() => setPlaying((p) => !p)}
          disabled={index >= data.length - 1 && !playing}
          className="pybe-btn-primary disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? 'Pause' : 'Play'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="pybe-btn-ghost"
          aria-label="Reset loop"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
        <div className="ml-auto text-sm">
          <span className="text-stone-500">running total =</span>{' '}
          <strong
            data-testid="pybe-loop-total"
            className="font-mono text-emerald-700"
          >
            {runningTotal}
          </strong>
        </div>
      </div>

      <p className="mt-3 text-xs text-stone-500">
        The for-loop walks the list one element at a time. Each iteration
        adds the current element to a running total — exactly the pattern
        behind <code>sum()</code>.
      </p>
    </section>
  );
}
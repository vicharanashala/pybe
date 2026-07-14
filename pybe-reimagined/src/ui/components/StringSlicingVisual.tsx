import { useMemo, useState } from 'react';
import { sliceString, indexLabel } from '../../lib/strings.ts';

/**
 * Visual demo for string slicing.
 *
 * Inspired by Programiz's Python string-slicing page: a string laid out
 * with index labels above (forward) and below (backward), plus sliders
 * for `start` and `stop`. INV-P2 (First Principles): the visual makes
 * the "stop is exclusive" rule obvious without a sentence of explanation.
 */
export function StringSlicingVisual({ initial = 'hello world' }: { initial?: string }) {
  const chars = useMemo(() => Array.from(initial), [initial]);
  const len = chars.length;
  const [start, setStart] = useState(0);
  const [stop, setStop] = useState(Math.min(5, len));
  const [step, setStep] = useState(1);

  const sliced = sliceString(initial, { start, stop, step });
  const inRange = (i: number): boolean => {
    if (step <= 0) return false;
    if (i < Math.min(start, stop) || i >= Math.max(start, stop)) return false;
    return (i - start) % step === 0;
  };

  return (
    <section
      data-testid="pybe-visual-string-slicing"
      className="pybe-card"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Slicing visual
        </span>
        <code className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
          s[{start}:{stop}:{step}] = "{sliced}"
        </code>
      </div>

      <div className="mt-3 select-none font-mono">
        {/* Forward index labels */}
        <div className="mb-1 flex">
          {chars.map((_, i) => (
            <div
              key={`f-${i}`}
              className="flex-1 text-center text-[10px] text-stone-400"
              style={{ minWidth: '1.5rem' }}
            >
              {indexLabel(i, len)}
            </div>
          ))}
        </div>

        {/* The string characters, highlighted when in range */}
        <div className="flex rounded-md border border-stone-300 bg-white">
          {chars.map((c, i) => {
            const active = inRange(i);
            return (
              <div
                key={`c-${i}`}
                className={`flex-1 py-3 text-center text-base ${
                  active
                    ? 'bg-amber-200 font-bold text-stone-900'
                    : 'text-stone-700'
                }`}
                style={{ minWidth: '1.5rem' }}
              >
                {c === ' ' ? '\u00a0' : c}
              </div>
            );
          })}
        </div>

        {/* Backward index labels */}
        <div className="mt-1 flex">
          {chars.map((_, i) => (
            <div
              key={`b-${i}`}
              className="flex-1 text-center text-[10px] text-stone-400"
              style={{ minWidth: '1.5rem' }}
            >
              {indexLabel(i - len, len)}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
        <label className="flex flex-col gap-1">
          <span className="font-medium text-stone-600">start</span>
          <input
            data-testid="pybe-slice-start"
            type="range"
            min={0}
            max={len}
            value={start}
            onChange={(e) => setStart(Number(e.target.value))}
          />
          <span className="tabular-nums text-stone-500">{start}</span>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-medium text-stone-600">stop (exclusive)</span>
          <input
            data-testid="pybe-slice-stop"
            type="range"
            min={0}
            max={len}
            value={stop}
            onChange={(e) => setStop(Number(e.target.value))}
          />
          <span className="tabular-nums text-stone-500">{stop}</span>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-medium text-stone-600">step</span>
          <input
            data-testid="pybe-slice-step"
            type="range"
            min={1}
            max={4}
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
          />
          <span className="tabular-nums text-stone-500">{step}</span>
        </label>
      </div>

      <p className="mt-3 text-xs text-stone-500">
        Try <code className="rounded bg-stone-100 px-1">hello[1:4]</code> →{' '}
        <strong>"ell"</strong>. Notice that <em>stop</em> is exclusive: the character at
        index <em>stop</em> is not included.
      </p>
    </section>
  );
}
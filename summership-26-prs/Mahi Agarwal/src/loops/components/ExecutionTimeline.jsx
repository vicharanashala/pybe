import React, { useMemo } from 'react';

// Groups a line-by-line trace into loop iterations by watching how many times the
// loop header line (the first line of the snippet — `for ...` or `while ...`) has
// been visited so far. Every step that shares the same visitCount on the header line
// belongs to the same pass through the loop. This turns a fine-grained step trace into
// the coarser "Iteration 1, Iteration 2, ..." view learners actually reason in.
function groupIntoIterations(trace) {
  if (!trace || trace.length === 0) return [];
  const headerLine = trace[0].afterLine === 1 ? 1 : Math.min(...trace.map((s) => s.afterLine));
  const groups = [];
  let current = null;
  let iterationNum = 0;

  trace.forEach((step, idx) => {
    if (step.afterLine === headerLine) {
      iterationNum += 1;
      current = { number: iterationNum, startIndex: idx, endIndex: idx };
      groups.push(current);
    } else if (current) {
      current.endIndex = idx;
    } else {
      // Steps before the loop header is ever hit (rare) — ignore for iteration counting.
      current = { number: 0, startIndex: idx, endIndex: idx, pre: true };
      groups.push(current);
    }
  });

  return groups.filter((g) => !g.pre);
}

export default function ExecutionTimeline({ trace, stepIndex }) {
  const iterations = useMemo(() => groupIntoIterations(trace), [trace]);
  if (!trace || iterations.length === 0) return null;

  const finished = stepIndex >= trace.length - 1;

  return (
    <div className="lp-exec-timeline">
      <div className="lp-panel-label">Execution timeline</div>
      <div className="lp-exec-timeline-row">
        {iterations.map((g) => {
          const isCurrent = stepIndex >= g.startIndex && stepIndex <= g.endIndex;
          const isDone = stepIndex > g.endIndex;
          return (
            <div key={g.number} className={`lp-exec-chip ${isCurrent ? 'current' : ''} ${isDone ? 'done' : ''}`}>
              <span className="lp-exec-chip-label">Iteration {g.number}</span>
              {(isDone || isCurrent) && <span className="lp-exec-chip-mark">{isDone ? '✔' : '•'}</span>}
            </div>
          );
        })}
        <div className={`lp-exec-chip lp-exec-chip-finish ${finished ? 'current' : ''}`}>
          <span className="lp-exec-chip-label">Finished</span>
          {finished && <span className="lp-exec-chip-mark">{'🏁'}</span>}
        </div>
      </div>
    </div>
  );
}

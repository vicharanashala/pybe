import React, { useState } from 'react';
import { CloudRain, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export default function RainTriage({ items, onComplete }) {
  const [processedIdx, setProcessedIdx] = useState(0);

  const handleProcessItem = () => {
    if (processedIdx < items.length) {
      const item = items[processedIdx];
      if (item.name === 'Speakers') {
        soundFx.playWarning();
      } else {
        soundFx.playClick();
      }
      const next = processedIdx + 1;
      setProcessedIdx(next);
      if (next === items.length) {
        soundFx.playSuccess();
        if (onComplete) onComplete();
      }
    }
  };

  return (
    <div className="bg-stone-900/90 rounded-2xl border border-amber-900/40 p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between bg-blue-950/40 p-4 rounded-xl border border-blue-500/40">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/30 text-blue-300 rounded-xl border border-blue-400/30 animate-pulse">
            <CloudRain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-blue-200 text-lg">Rain Storm Material Triage</h3>
            <p className="text-xs text-blue-300">Combining `for` loop + `if item.weight == 'heavy': continue` + rescue action</p>
          </div>
        </div>
        <div className="font-mono text-xs text-blue-300 font-bold">
          {processedIdx} / {items.length} Items Triaged
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {items.map((itm, idx) => {
          const isDone = idx < processedIdx;
          const isCurrent = idx === processedIdx;
          const isHeavy = itm.name === 'Speakers';

          return (
            <div
              key={itm.name}
              className={`p-4 rounded-xl border text-center transition-all ${
                isDone
                  ? isHeavy
                    ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                    : 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : isCurrent
                  ? 'bg-blue-950/60 border-blue-400 ring-2 ring-blue-400/40 animate-pulse'
                  : 'bg-stone-950/50 border-stone-800 text-stone-600'
              }`}
            >
              <div className="font-extrabold text-sm text-stone-200">{itm.name}</div>
              <div className="text-xs font-mono mt-1 text-stone-400">{itm.weight}</div>
              <div className="text-[11px] font-mono mt-3 font-semibold">
                {isDone ? itm.action : 'Waiting'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Button */}
      <div className="flex justify-end pt-2">
        {processedIdx < items.length ? (
          <button
            onClick={handleProcessItem}
            className={`px-6 py-3 rounded-xl font-extrabold text-sm flex items-center gap-2 shadow-lg transform transition hover:scale-105 ${
              items[processedIdx].name === 'Speakers'
                ? 'bg-amber-600 hover:bg-amber-500 text-black shadow-amber-600/30'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-600/30'
            }`}
          >
            {items[processedIdx].name === 'Speakers' ? (
              <>
                <ShieldAlert className="w-4 h-4" />
                <span>Speakers are TOO HEAVY (80kg)! Cover with Tarp & CONTINUE</span>
              </>
            ) : (
              <>
                <CloudRain className="w-4 h-4" />
                <span>Rescue {items[processedIdx].name} Inside Auditorium</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
            <span>All Materials Secured! Heavy Speakers Tarped, Lightweight Props Safe Inside!</span>
          </div>
        )}
      </div>
    </div>
  );
}

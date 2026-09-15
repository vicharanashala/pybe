import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export default function BagElseSearch({ onComplete }) {
  const [checkedCount, setCheckedCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const pockets = [
    'Front Zipper',
    'Side Mesh Left',
    'Side Mesh Right',
    'Notebook Pocket',
    'Laptop Compartment',
    'Bottom Pouch'
  ];

  const handleCheckNext = () => {
    soundFx.playZipper();
    const next = checkedCount + 1;
    setCheckedCount(next);

    if (next === pockets.length) {
      setIsFinished(true);
      soundFx.playWarning();
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="bg-stone-900/90 rounded-2xl border border-amber-900/40 p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between bg-amber-950/30 p-4 rounded-xl border border-amber-800/30">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-amber-200 text-lg">Bag Search: Spare HDMI Cable</h3>
            <p className="text-xs text-stone-400">Loop Else Pattern: Code executed when loop completes without encountering a `break`</p>
          </div>
        </div>
        <div className="font-mono text-xs text-amber-400 font-bold">
          {checkedCount} / {pockets.length} Pockets Searched
        </div>
      </div>

      {/* Pockets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {pockets.map((pkt, idx) => {
          const isSearched = idx < checkedCount;
          const isCurrent = idx === checkedCount;

          return (
            <div
              key={pkt}
              className={`p-4 rounded-xl border transition-all ${
                isSearched
                  ? 'bg-stone-950/70 border-stone-800 text-stone-500'
                  : isCurrent
                  ? 'bg-amber-950/60 border-amber-500 ring-2 ring-amber-500/40 animate-pulse text-stone-200'
                  : 'bg-stone-900/30 border-stone-800/40 text-stone-600'
              }`}
            >
              <div className="text-xs font-mono text-amber-400 font-bold mb-1">Pocket {idx + 1}</div>
              <div className="text-sm font-semibold">{pkt}</div>
              <div className="text-xs font-mono mt-2">
                {isSearched ? 'Empty (Cable Not Here)' : isCurrent ? 'Searching Now...' : 'Waiting'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Else Block Banner */}
      {isFinished && (
        <div className="bg-gradient-to-r from-red-950 via-stone-900 to-amber-950 p-5 rounded-xl border border-red-500/40 text-red-300 font-mono text-xs space-y-1 animate-fade-in shadow-xl">
          <div className="font-extrabold text-sm text-red-200 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            LOOP `else` EXECUTED!
          </div>
          <div>All {pockets.length} pockets were searched completely. HDMI Cable was NOT found!</div>
        </div>
      )}

      {/* Button */}
      <div className="flex justify-end pt-2">
        {!isFinished ? (
          <button
            onClick={handleCheckNext}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transform transition hover:scale-105"
          >
            <Search className="w-4 h-4" />
            <span>Search Pocket #{checkedCount + 1}: {pockets[checkedCount]}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/30">
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
            <span>Loop `else` Triggered Successfully! Proceed to Discovery</span>
          </div>
        )}
      </div>
    </div>
  );
}

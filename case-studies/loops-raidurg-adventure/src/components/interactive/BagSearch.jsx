import React, { useState } from 'react';
import { Search, CheckCircle2, Lock, Sparkles, FolderSearch } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export default function BagSearch({ pockets, onComplete }) {
  const [checkedPockets, setCheckedPockets] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  const handleCheckNextPocket = () => {
    if (currentIdx < pockets.length) {
      soundFx.playZipper();
      const current = pockets[currentIdx];
      setCheckedPockets(prev => [...prev, current]);
      const next = currentIdx + 1;
      setCurrentIdx(next);

      if (next === pockets.length) {
        soundFx.playSuccess();
        if (onComplete) onComplete();
      }
    }
  };

  return (
    <div className="bg-stone-900/90 rounded-2xl border border-amber-900/40 p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between bg-amber-950/30 p-4 rounded-xl border border-amber-800/30">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <FolderSearch className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-amber-200 text-lg">Lakshmi's Backpack Search</h3>
            <p className="text-xs text-stone-400">Searching 6 compartments one by one in order</p>
          </div>
        </div>
        <div className="text-right font-mono text-xs text-amber-400 font-bold">
          {checkedPockets.length} / {pockets.length} Pockets Checked
        </div>
      </div>

      {/* Pocket Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {pockets.map((pkt, idx) => {
          const isChecked = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div
              key={pkt.id}
              className={`p-4 rounded-xl border transition-all duration-300 relative ${
                isChecked
                  ? pkt.found
                    ? 'bg-emerald-950/60 border-emerald-500/60 shadow-lg shadow-emerald-950'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400'
                  : isCurrent
                  ? 'bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/30 animate-pulse'
                  : 'bg-stone-900/40 border-stone-800 text-stone-600 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-amber-400">
                  Pocket {pkt.id}
                </span>
                {isChecked ? (
                  pkt.found ? (
                    <span className="text-xs bg-emerald-500 text-black px-2 py-0.5 rounded-full font-extrabold">FOUND!</span>
                  ) : (
                    <span className="text-xs text-stone-500">Empty</span>
                  )
                ) : (
                  <span className="text-xs text-stone-600">Pending</span>
                )}
              </div>

              <div className="font-bold text-sm text-stone-200 mb-1">{pkt.name}</div>

              <div className="text-xs text-stone-400 font-mono">
                {isChecked ? pkt.item : isCurrent ? '👉 Click Zip to Search' : 'Locked in sequence'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Search Button */}
      <div className="flex justify-end pt-2">
        {currentIdx < pockets.length ? (
          <button
            onClick={handleCheckNextPocket}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transform transition hover:scale-105"
          >
            <Search className="w-4 h-4" />
            <span>Check Pocket #{currentIdx + 1} ({pockets[currentIdx].name})</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
            <span>ID Card Found! All Pockets Examined</span>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Utensils, CheckCircle2, Play, ChevronRight } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export default function CanteenOrders({ orders, onComplete }) {
  const [preparedIdx, setPreparedIdx] = useState(0);

  const handlePrepareNext = () => {
    if (preparedIdx < orders.length) {
      soundFx.playClick();
      const next = preparedIdx + 1;
      setPreparedIdx(next);
      if (next === orders.length) {
        soundFx.playSuccess();
        if (onComplete) onComplete();
      }
    }
  };

  return (
    <div className="bg-stone-900/90 rounded-2xl border border-amber-900/40 p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between bg-amber-950/30 p-4 rounded-xl border border-amber-800/30">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30 text-2xl">
            🍲
          </div>
          <div>
            <h3 className="font-extrabold text-amber-200 text-lg">Canteen Worker's Preparation Line</h3>
            <p className="text-xs text-stone-400">Applying the same action ("Prepare Dish") to each item in the order list</p>
          </div>
        </div>
        <div className="text-right font-mono text-xs text-amber-400 font-bold">
          {preparedIdx} / {orders.length} Prepared
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {orders.map((ord, idx) => {
          const isDone = idx < preparedIdx;
          const isCurrent = idx === preparedIdx;

          return (
            <div
              key={ord.name}
              className={`p-4 rounded-xl border text-center transition-all duration-300 ${
                isDone
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                  : isCurrent
                  ? 'bg-amber-950/60 border-amber-500 ring-2 ring-amber-500/40 animate-pulse'
                  : 'bg-stone-950/50 border-stone-800 text-stone-600'
              }`}
            >
              <div className="text-3xl mb-2">{ord.icon}</div>
              <div className="font-bold text-sm text-stone-200">{ord.name}</div>
              <div className="text-xs font-mono mt-2">
                {isDone ? 'READY! ✅' : isCurrent ? 'Cooking Now...' : 'Waiting'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controller */}
      <div className="flex justify-end pt-2">
        {preparedIdx < orders.length ? (
          <button
            onClick={handlePrepareNext}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transform transition hover:scale-105"
          >
            <Utensils className="w-4 h-4" />
            <span>Prepare Order #{preparedIdx + 1}: {orders[preparedIdx].name}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
            <span>All 5 Dishes Prepared! Rahul & Friends Are Full!</span>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { DoorClosed, Lock, CheckCircle2, FastForward } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export default function RoomSkip({ rooms, onComplete }) {
  const [processedIdx, setProcessedIdx] = useState(0);

  const handleNextRoom = () => {
    if (processedIdx < rooms.length) {
      const room = rooms[processedIdx];
      if (room.id === 103) {
        soundFx.playWarning();
      } else {
        soundFx.playClick();
      }
      const next = processedIdx + 1;
      setProcessedIdx(next);
      if (next === rooms.length) {
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
            <DoorClosed className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-amber-200 text-lg">Corridor Material Pickup</h3>
            <p className="text-xs text-stone-400">Target: Skip locked room 103 using `continue` without stopping loop</p>
          </div>
        </div>
      </div>

      {/* Rooms List */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {rooms.map((rm, idx) => {
          const isProcessed = idx < processedIdx;
          const isCurrent = idx === processedIdx;
          const isLocked = rm.id === 103;

          return (
            <div
              key={rm.id}
              className={`p-4 rounded-xl border text-center transition-all ${
                isProcessed
                  ? isLocked
                    ? 'bg-rose-950/50 border-rose-500/60 text-rose-300'
                    : 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300'
                  : isCurrent
                  ? 'bg-amber-950/60 border-amber-500 ring-2 ring-amber-500/40 animate-pulse'
                  : 'bg-stone-950/50 border-stone-800 text-stone-600'
              }`}
            >
              <div className="font-mono font-extrabold text-lg text-amber-300">Room {rm.id}</div>
              <div className="text-xs font-semibold mt-1">{rm.item}</div>
              <div className="text-[11px] font-mono mt-3">
                {isProcessed ? (
                  isLocked ? (
                    <span className="text-rose-400 font-bold flex items-center justify-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> SKIPPED!
                    </span>
                  ) : (
                    'Collected ✅'
                  )
                ) : (
                  'Pending'
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Button */}
      <div className="flex justify-end pt-2">
        {processedIdx < rooms.length ? (
          <button
            onClick={handleNextRoom}
            className={`px-6 py-3 rounded-xl font-extrabold text-sm flex items-center gap-2 shadow-lg transform transition hover:scale-105 ${
              rooms[processedIdx].id === 103
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-amber-500/20'
            }`}
          >
            {rooms[processedIdx].id === 103 ? (
              <>
                <FastForward className="w-4 h-4" />
                <span>Room 103 is LOCKED! Skip & CONTINUE to 104</span>
              </>
            ) : (
              <>
                <DoorClosed className="w-4 h-4" />
                <span>Collect Materials from Room {rooms[processedIdx].id}</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
            <span>Finished Pickup! Room 103 Skipped, Other 4 Rooms Collected!</span>
          </div>
        )}
      </div>
    </div>
  );
}

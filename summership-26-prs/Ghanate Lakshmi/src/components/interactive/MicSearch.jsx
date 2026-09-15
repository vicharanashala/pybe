import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, Mic, AlertOctagon } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export default function MicSearch({ locations, onComplete }) {
  const [searchedIdx, setSearchedIdx] = useState(0);
  const [foundLoc, setFoundLoc] = useState(null);

  const handleSearchNext = () => {
    if (searchedIdx < locations.length && !foundLoc) {
      soundFx.playClick();
      const loc = locations[searchedIdx];
      if (loc.found) {
        setFoundLoc(loc);
        soundFx.playSuccess();
        if (onComplete) onComplete();
      } else {
        setSearchedIdx(prev => prev + 1);
      }
    }
  };

  return (
    <div className="bg-stone-900/90 rounded-2xl border border-amber-900/40 p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between bg-amber-950/30 p-4 rounded-xl border border-amber-800/30">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-amber-200 text-lg">Search For Missing Microphone</h3>
            <p className="text-xs text-stone-400">Target: Stop searching immediately upon finding target (BREAK loop!)</p>
          </div>
        </div>
      </div>

      {/* Locations */}
      <div className="space-y-3">
        {locations.map((loc, idx) => {
          const isSearched = idx <= searchedIdx;
          const isCurrent = idx === searchedIdx && !foundLoc;

          return (
            <div
              key={loc.name}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                loc.found && isSearched
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40'
                  : isSearched
                  ? 'bg-stone-950/70 border-stone-800 text-stone-400'
                  : isCurrent
                  ? 'bg-amber-950/50 border-amber-500 animate-pulse'
                  : 'bg-stone-900/30 border-stone-800/50 text-stone-600'
              }`}
            >
              <div className="flex items-center gap-3 font-semibold text-sm">
                <span>Location #{idx + 1}: {loc.name}</span>
              </div>

              <div>
                {isSearched ? (
                  loc.found ? (
                    <span className="flex items-center gap-1 text-xs font-bold bg-emerald-500 text-black px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4" /> FOUND! BREAK LOOP!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-red-400 bg-red-950/40 px-3 py-1 rounded-full border border-red-800/40">
                      <XCircle className="w-4 h-4" /> Not Here
                    </span>
                  )
                ) : (
                  <span className="text-xs text-stone-600 font-mono">Unsearched</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controller */}
      <div className="flex justify-end pt-2">
        {!foundLoc ? (
          <button
            onClick={handleSearchNext}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transform transition hover:scale-105"
          >
            <Search className="w-4 h-4" />
            <span>Search {locations[searchedIdx].name}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
            <span>Microphone Found in Auditorium! Search Stopped (`break`)!</span>
          </div>
        )}
      </div>
    </div>
  );
}
